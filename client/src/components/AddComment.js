import React, { useState } from 'react';

const AddComment = ({ reviewId, onCommentAdded }) => {
  const [showInput, setShowInput] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleAddComment = () => {
    // Simulate comment submission (replace with API call if needed)
    if (commentText.trim()) {
      console.log(`New comment for review ${reviewId}:`, commentText);
      setCommentText(''); // Clear input field
      setShowInput(false); // Close the input field
      onCommentAdded?.(); // Optional callback to refresh comments
    }
  };

  return (
    <div className="add-comment">
      {showInput ? (
        <>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="comment here..."
            rows="3"
          />
          <div>
            <button onClick={handleAddComment}>Submit</button>
            <button onClick={() => setShowInput(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <button onClick={() => setShowInput(true)}>Add Comment</button>
      )}
    </div>
  );
};

export default AddComment;
