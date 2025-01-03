import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';

const ReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await api.get(`/comments?reviewId=${id}`);
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  }, [id]);

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
    fetchComments();
  }, [id, fetchComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/comments', { reviewId: id, content: comment });
      setComment('');
      fetchComments();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  if (!review) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Review by {review.userId}</h2>
      <p>Rating: {review.rating}</p>
      <p>{review.content}</p>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
};

export default ReviewDetail;