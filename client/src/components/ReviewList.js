import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import CommentList from './CommentList';

const ReviewList = ({ plantId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const { auth } = useAuth(); // Get auth from context
  const [users, setUsers] = useState({}); // Store user details by userId

  // Function to fetch user details by userId
  const fetchUserById = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`); // Assuming this is the endpoint for fetching users
      if (response.status === 200) {
        setUsers((prevUsers) => ({
          ...prevUsers,
          [userId]: {
            firstName: response.data.firstName,
            lastName: response.data.lastName,
          },
        }));
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  // Fetch reviews when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewResponse = await api.get(`/reviews?plantId=${plantId}`);
        if (reviewResponse.status !== 200) {
          throw new Error('Failed to fetch reviews');
        }

        setReviews(reviewResponse.data);

        // Fetch user data for each review
        reviewResponse.data.forEach((review) => {
          if (!users[review.userId]) {
            fetchUserById(review.userId); // Only fetch if not already in state
          }
        });
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [plantId, users]);

  const handleAddReview = async () => {
    const token = auth?.token || localStorage.getItem('token');
    
    if (!token || !auth?.userId) {
      setError('Please log in to add a review.');
      return;
    }

    if (reviewText.trim()) {
      try {
        const response = await api.post(
          '/reviews',
          { plantId, content: reviewText, userId: auth.userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 201) {
          setReviews((prev) => [
            ...prev,
            {
              ...response.data.review,
              userFullName: auth ? `${auth.firstName} ${auth.lastName}` : '',
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
          const userFullName = user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
          return (
            <div key={review.id} className="review-item">
              <h5 className="review">{userFullName}</h5>
              <div className="review-text">
                <p>{review.content}</p>
              </div>

              {/* Show comments related to this review */}
              <CommentList plantId={plantId} reviewId={review.id} />
            </div>
          );
        })
      ) : (
        <p>No reviews yet. Be the first to add one!</p>
      )}

      {/* Add review form */}
      <div className="add-review">
        {auth && auth.userId ? (
          showInput ? (
            <>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review..."
                rows="3"
                onKeyPress={handleKeyPress} // Handle Enter press
              />
              <div>
                <button onClick={() => { setShowInput(false); setReviewText(''); }}>Cancel</button>
                <button onClick={handleAddReview}>Submit</button>
              </div>
            </>
          ) : (
            <button onClick={() => setShowInput(true)}>Add Review</button>
          )
        ) : (
          <button onClick={() => console.log('Redirect to login')}>
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
