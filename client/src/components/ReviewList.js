import React, { useState, useEffect } from 'react';
import { api } from '../api';
import CommentList from './CommentList';
import AddComment from './AddComment';
import { useAuth } from './Login';
import PropTypes from 'prop-types';
// import AddReview from './AddReview';

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

        // Use Map to fetch unique user details
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
        console.error('Error fetching reviews with user details:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsWithUserDetails();
  }, [plantId]);

  const handleDelete = async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`, {
        data: { plantId }, // Send the plantId along with the request
      });
      if (response.status === 200) {
        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review. Please try again later.');
  
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };
  

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="reviews" >
      <h2>Reviews for {plantName}</h2>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <h4>{review.userFullName}</h4>
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
              {/* <AddReview plantId={plantId} /> */}
              <div className="comments">
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
            </li>
          ))}
        </ul>
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
