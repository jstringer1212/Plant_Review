import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { api } from '../api';

const CommentList = ({ plantId, reviewId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const [userNames, setUserNames] = useState({}); // Store user names by userId

  const token = localStorage.getItem('token');
  const userId = parseInt(localStorage.getItem('userId'), 10);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentResponse = await api.get(`/comments?plantId=${plantId}`);
        // console.log('commentResponse', commentResponse); // Log the full response

        if (commentResponse.status !== 200) {
          throw new Error('Failed to fetch comments');
        }

        // Filter comments based on reviewId
        const commentsData = commentResponse.data.filter((comment) => comment.reviewId === reviewId);

        // Fetch user data for each comment's userId concurrently
      const userNamesData = {};
      const userRequests = commentsData.map(async (comment) => {
        if (!userNamesData[comment.userId]) {
          const userResponse = await api.get(`/users/${comment.userId}`);
          if (userResponse.status === 200) {
            const { firstName, lastName } = userResponse.data;
            userNamesData[comment.userId] = `${firstName} ${lastName}`;
          }
        }
      });

      await Promise.all(userRequests); // Wait for all user requests to finish

        setUserNames(userNamesData);
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
    if (!token || !userId) {
      setError('Please log in to comment.');
      return;
    }

    if (commentText.trim()) {
      setIsSubmitting(true); // Set submitting state to true

      try {
        const response = await api.post(
          '/comments',
          { reviewId, content: commentText, userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 201) {
          setComments((prev) => [
            ...prev,
            {
              ...response.data.comment,
              userFullName: `${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`,
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
        setError('Failed to add comment. Please try again later.');
      } finally {
        setIsSubmitting(false); // Reset submitting state
      }
    } else {
      setError('Comment cannot be empty.');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await api.delete(`/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
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

      {comments.length > 0 &&
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <div className="comment-info">
                {/* Display user's full name fetched from /api/users */}
                <span className="author">{userNames[comment.userId]}: </span>
              </div>
            </div>
            <div className="comment-text">
              <p>{comment.content}</p>
            </div>

            <button
              className="ui icon trash button"
              onClick={() => handleDelete(comment.id)}
            >
              <i aria-hidden="true" className="trash icon"></i>
            </button>
          </div>
        ))}

      <div className="add-comment">
        {token && userId ? (
          showInput ? (
            <>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add your comment..."
                rows="3"
                onKeyPress={handleKeyPress}
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
              placeholder="Add your comment..."
              onClick={() => setShowInput(true)}
              onKeyPress={handleKeyPress}
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
