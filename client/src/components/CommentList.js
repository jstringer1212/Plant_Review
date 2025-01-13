import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';

const CommentList = ({ plantId, reviewId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const { auth } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentResponse = await api.get(`/comments?plantId=${plantId}`);
        if (commentResponse.status !== 200) {
          throw new Error('Failed to fetch comments');
        }

        const commentsData = commentResponse.data.filter(
          (comment) => comment.reviewId === reviewId
        );

        setComments(commentsData);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [plantId, reviewId]);

  const handleAddComment = async () => {
    const token = auth?.token || localStorage.getItem('token');

    if (!token || !auth?.userId) {
      setError('Please log in to comment.');
      return;
    }

    if (commentText.trim()) {
      setIsSubmitting(true); // Set submitting state to true

      try {
        const response = await api.post(
          '/comments',
          { reviewId, content: commentText, userId: auth.userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 201) {
          setComments((prev) => [
            ...prev,
            {
              ...response.data.comment,
              userFullName: `${auth.firstName} ${auth.lastName}`,
            },
          ]);
          setCommentText('');
          setShowInput(false);
          setError(null);
        } else {
          throw new Error('Failed to add comment');
        }
      } catch (err) {
        console.error('Error adding comment:', err);
        setError('Failed to add comment. Please try agaiin later.');
      } finally {
        setIsSubmitting(false); // Reset submitting state
      }
    } else {
      setError('Comment cannot be empty.');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      if (response.status === 200) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      } else {
        throw new Error('Failed to delete comment');
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment. Please try again later.');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddComment();
    }
  };

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="comment-list">
      <h4 className="ui dividing comment header">Comments</h4>

      {comments.length > 0 && (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <div className="comment-info">
                <span className="author">{comment.userFullName}</span>
                <div className="metadata">
                  <span className="date">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="comment-text">
              <p>{comment.content}</p>
            </div>
            {auth && auth.userId === comment.userId && (
              <button
                className="ui red button delete-button"
                onClick={() => handleDelete(comment.id)}
              >
                Delete Comment
              </button>
            )}
          </div>
        ))
      )}

      <div className="add-comment">
        {auth && auth.userId ? (
          showInput ? (
            <>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment..."
                rows="3"
                onKeyPress={handleKeyPress} // Handle Enter press
                aria-label="Comment input field"
              />
              <div>
                <button onClick={handleAddComment} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                <button onClick={() => setShowInput(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <textarea
              placeholder="Write your comment..."
              onClick={() => setShowInput(true)}
              onKeyPress={handleKeyPress} // Handle Enter press
              aria-label="Click to add comment"
            />
          )
        ) : (
          <button onClick={() => console.log('Redirect to login')}>
            Log in to comment
          </button>
        )}
      </div>
    </div>
  );
};

CommentList.propTypes = {
  plantId: PropTypes.number.isRequired,
  reviewId: PropTypes.number.isRequired,
};

export default CommentList;
