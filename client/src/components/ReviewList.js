import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api }  from '../api';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/reviews');
        setReviews(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div>
      <h2>Review List</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <Link to={`/reviews/${review.id}`}>Review by {review.userId}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;