import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api }  from '../api';

const ReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await api.get(`/reviews/${id}`);
        setReview(response.data);
      } catch (err) {
        console.error('Error fetching review:', err);
      }
    };

    fetchReview();
  }, [id]);

  if (!review) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Review by {review.userId}</h2>
      <p>Rating: {review.rating}</p>
      <p>{review.content}</p>
    </div>
  );
};

export default ReviewDetail;