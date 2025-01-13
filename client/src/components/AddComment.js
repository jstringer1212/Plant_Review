import React, { useState } from 'react';
import { api } from '../api'; 
import { useAuth } from '../contexts/AuthContext'; 

const AddComment = ({ reviewId, onCommentAdded, userId }) => {
  const [showInput, setShowInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState(null);
  const { auth } = useAuth(); 

  const getToken = () => auth?.token || localStorage.getItem('token');

  const handleAddComment = async () => {
    const token = getToken();

    if (!token || !userId) {
      setError("Please log in to comment.");
      return;
    }

    if (commentText.trim()) {
      try {
        const response = await api.post(
          '/comments',
          { reviewId, content: commentText, userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 201) {
          setCommentText(''); 
          setShowInput(false); 
          setError(null); 

          if (onCommentAdded) {
            onCommentAdded(response.data.comment); 
          }
        } else {
          throw new Error('Failed to add comment');
        }
      } catch (err) {
        console.error('Error adding comment:', err);
        setError('Failed to add comment. Please try again later.');
      }
    } else {
      setError('Comment cannot be empty.');
    }
  };

  return (
    <div className="add-comment">
      {error && <p className="error">{error}</p>}
      {auth && userId ? (
        showInput ? (
          <>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
              rows="3"
            />
            <div>
              <button onClick={handleAddComment}>Submit</button>
              <button onClick={() => setShowInput(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <button onClick={() => setShowInput(true)}>Add Comment</button>
        )
      ) : (
        <button className="button" onClick={() => console.log('Redirect to login')}>Log in to comment</button>
      )}
    </div>
  );
};

export default AddComment;
