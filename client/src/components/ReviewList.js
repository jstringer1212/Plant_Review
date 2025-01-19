import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { api } from '../api';
import CommentList from './CommentList';

const ReviewList = ({ plantId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [users, setUsers] = useState({}); // Cache user details by userId
  const [editingReviewId, setEditingReviewId] = useState(null); // For editing review
  const [editedReviewText, setEditedReviewText] = useState(''); // Edited review content

  // Utility to get token and userId from sessionStorage
  const getUserInfo = () => {
    const token = sessionStorage.getItem('token');
    const userId = parseInt(sessionStorage.getItem('userId'), 10);
    const role = sessionStorage.getItem('role');
    return { token, userId, role };
  };

  const { token, userId, role } = getUserInfo();

  // Function to fetch user details by userId
  const fetchUserById = async (userId) => {
    if (users[userId]) return; // Skip if user is already cached

    try {
      const response = await api.get(`/users/${userId}`);
      if (response.status === 200) {
        setUsers((prev) => ({
          ...prev,
          [userId]: {
            firstName: response.data.firstName,
            lastName: response.data.lastName,
          },
        }));
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

  // Fetch reviews when the component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/reviews?plantId=${plantId}`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch reviews');
        }

        setReviews(response.data);

        // Fetch user details for each review
        response.data.forEach((review) => fetchUserById(review.userId));
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [plantId]);

  const handleAddReview = async () => {
    if (!token || !userId) {
      setError('Please log in to add a review.');
      return;
    }

    if (reviewText.trim()) {
      try {
        const response = await api.post(
          '/reviews',
          { plantId, content: reviewText, userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 201) {
          setReviews((prev) => [
            ...prev,
            {
              ...response.data.review,
              userFullName: `${users[userId]?.firstName || 'User'} ${
                users[userId]?.lastName || ''
              }`,
            },
          ]);
          setReviewText('');
          setShowInput(false);
          setError(null);
        } else {
          throw new Error('Failed to add review');
        }
      } catch (err) {
        console.error('Error adding review:', err);
        setError('Failed to add review. Please try again later.');
      }
    } else {
      setError('Review cannot be empty.');
    }
  };

  const handleDeleteReview = async (reviewId, plantId, userId, role) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', },
        data: { plantId, userId, role },
      });

      if (response.status === 200) {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review. Please try again later.');
    }
  };

  const handleEditReview = (reviewId, currentContent) => {
    setEditingReviewId(reviewId);
    setEditedReviewText(currentContent);
  };

  const handleSaveReview = async () => {
    if (!editedReviewText.trim()) {
      setError('Review cannot be empty.');
      return;
    }

    try {
      const response = await api.put(
        `/reviews/${editingReviewId}`,
        { content: editedReviewText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setReviews((prev) =>
          prev.map((review) =>
            review.id === editingReviewId
              ? { ...review, content: editedReviewText }
              : review
          )
        );
        setEditingReviewId(null);
        setEditedReviewText('');
        setError(null);
      } else {
        throw new Error('Failed to save review');
      }
    } catch (err) {
      console.error('Error saving review:', err);
      setError('Failed to save review. Please try again later.');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddReview();
    }
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="review-list">
      <h3 className="ui dividing review header">Reviews</h3>

      {reviews.length > 0 ? (
        reviews.map((review) => {
          const user = users[review.userId];
          const userFullName = user
            ? `${user.firstName} ${user.lastName}`
            : 'Unknown User';

          const canDelete = review.userId === userId || role === 'admin';

          return (
            <div key={review.id} className="review-item">
              <h5 className="review">{userFullName}</h5>
              <div className="review-text">
                {editingReviewId === review.id ? (
                  <div className='edit'>
                    <textarea
                      className='edit-field'
                      value={editedReviewText}
                      onChange={(e) => setEditedReviewText(e.target.value)}
                      placeholder="Edit your review..."
                      rows="3"
                    />
                    <div>
                      <button onClick={() => setEditingReviewId(null)}>Cancel</button>
                      <button className="ui icon save" onClick={handleSaveReview}><i className="save icon"></i></button>
                    </div>
                  </div>
                ) : (
                  <span>{review.content}</span>
                )}

                {canDelete && (
                  <>
                    <button
                      className="ui icon edit"
                      onClick={() => handleEditReview(review.id, review.content)}
                    >
                      <i aria-hidden="true" className="edit icon"></i>
                    </button>
                    <button
                      className="ui icon trash button"
                      onClick={() => handleDeleteReview(review.id, plantId, userId, role)}
                    >
                      <i aria-hidden="true" className="trash icon"></i>
                    </button>
                  </>
                )}
              </div>
              <CommentList plantId={plantId} reviewId={review.id} />
            </div>
          );
        })
      ) : (
        <p>No reviews yet. Be the first to add one!</p>
      )}

      {/* Add review form */}
      <div className="add-review">
        {token && userId ? (
          showInput ? (
            <>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review..."
                rows="3"
                onKeyPress={handleKeyPress}
              />
              <div>
                <button
                  onClick={() => {
                    setShowInput(false);
                    setReviewText('');
                  }}
                >
                  Cancel
                </button>
                <button onClick={handleAddReview}>Submit</button>
              </div>
            </>
          ) : (
            <button onClick={() => setShowInput(true)}>Add Review</button>
          )
        ) : (
          <button onClick={() => alert('Redirecting to login page...')}>
            Log in to review
          </button>
        )}
      </div>
    </div>
  );
};

ReviewList.propTypes = {
  plantId: PropTypes.number.isRequired,
};

export default ReviewList;
