import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { api } from '../api';
import { useAuth } from './Login';
import CommentList from './CommentList';
import AddComment from './AddComment';

const ReviewList = ({ plantId, plantName }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchReviewsWithUserDetails = async () => {
      try {
        const reviewResponse = await api.get(`/reviews?plantId=${plantId}`);
        if (reviewResponse.status !== 200) {
          throw new Error('Failed to fetch reviews');
        }

        const reviewsData = reviewResponse.data.filter((review) => review.plantId === plantId);
        const uniqueUserIds = [...new Set(reviewsData.map((review) => review.userId))];
        const usersResponse = await api.get(`/users?ids=${uniqueUserIds.join(',')}`);

        if (usersResponse.status !== 200) {
          throw new Error('Failed to fetch user details');
        }

        const users = usersResponse.data.reduce((acc, user) => {
          acc[user.id] = `${user.firstName} ${user.lastName}`;
          return acc;
        }, {});

        const reviewsWithUsers = reviewsData.map((review) => ({
          ...review,
          userFullName: users[review.userId],
        }));

        setReviews(reviewsWithUsers);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsWithUserDetails();
  }, [plantId]);

  const handleDelete = async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      if (response.status === 200) {
        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review. Please try again later.');

      // Clear the error message after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Reviews for {plantName}</h2>
      {reviews.length > 0 ? (
        <div className="ui comments">
          {reviews.map((review) => (
            <div key={review.id} className="comment">
              <h3 className="ui dividing header">Reviews</h3>
              <div className="content">
                <span className="author">{review.userFullName}</span>
                <p>{review.content}</p>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= review.rating ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {auth && auth.userId === review.userId && (
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(review.id)}
                  >
                    Delete Review
                  </button>
                )}
                <CommentList reviewId={review.id} />
                <AddComment reviewId={review.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews available for this plant. Be the first to leave a review!</p>
      )}
    </div>
  );
};

ReviewList.propTypes = {
  plantId: PropTypes.number.isRequired,
  plantName: PropTypes.string.isRequired,
};

export default ReviewList;
