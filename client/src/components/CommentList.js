import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { api } from '../api';
import '../Styler/AllStyles.css'

const CommentList = ({ plantId, reviewId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userNames, setUserNames] = useState({});
  const [editCommentId, setEditCommentId] = useState(null); // State for editing comment
  const [editContent, setEditContent] = useState(''); // State for the content of the comment being edited

  const token = sessionStorage.getItem('token');
  const userId = parseInt(sessionStorage.getItem('userId'), 10);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentResponse = await api.get(`/comments?plantId=${plantId}`);
        if (commentResponse.status !== 200) {
          throw new Error('Failed to fetch comments');
        }

        const commentsData = commentResponse.data.filter((comment) => comment.reviewId === reviewId);

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

        await Promise.all(userRequests);
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
      setIsSubmitting(true);

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
              userFullName: `${sessionStorage.getItem('firstName')} ${sessionStorage.getItem('lastName')}`,
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
        setIsSubmitting(false);
      }
    } else {
      setError('Comment cannot be empty.');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await api.delete(`/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
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

  const handleEdit = (commentId, content) => {
    setEditCommentId(commentId);
    setEditContent(content);
  };

  const handleUpdateComment = async () => {
    if (!token || !userId) {
      setError('Please log in to update the comment.');
      return;
    }

    if (editContent.trim()) {
      try {
        const response = await api.put(
          `/comments/${editCommentId}`,
          { content: editContent },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          const updatedComments = comments.map((comment) =>
            comment.id === editCommentId ? { ...comment, content: editContent } : comment
          );
          setComments(updatedComments);
          setEditCommentId(null);
          setEditContent('');
          setError(null);
        } else {
          throw new Error('Failed to update comment');
        }
      } catch (err) {
        console.error('Error updating comment:', err);
        setError('Failed to update comment. Please try again later.');
      }
    } else {
      setError('Comment content cannot be empty.');
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
                <span className="author">{userNames[comment.userId]}: </span>
              </div>
            </div>
            <div className="comment-text">
              {editCommentId === comment.id ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows="3"
                />
              ) : (
                <p>{comment.content}</p>
              )}
            </div>

            <div className="comment-actions">
              {editCommentId === comment.id ? (
                <button onClick={handleUpdateComment}>Save</button>
              ) : (
                <button
                  className="ui icon edit button"
                  onClick={() => handleEdit(comment.id, comment.content)}
                >
                  <i aria-hidden="true" className="edit icon"></i>
                </button>
              )}

              <button
                className="ui icon trash button"
                onClick={() => handleDelete(comment.id)}
              >
                <i aria-hidden="true" className="trash icon"></i>
              </button>
            </div>
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
              className="textarea"
              style={{ height: '25px' }}
              placeholder="Add your comment..."
              onClick={() => setShowInput(true)}
              onKeyPress={handleKeyPress}
              aria-label="Click to add comment"
            />
          )
        ) : (
          <button onClick={() => console.log('Redirect to login')}>Log in to comment</button>
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
