import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import './Styler/AllStyles.css';

const StarRating = ({ rating, onRate }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (onRate) {
      onRate(value);
    }
  };

  const handleMouseEnter = (value) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={value <= (hoverRating || rating) ? 'star filled' : 'star'}
          onClick={() => handleClick(value)}
          onMouseEnter={() => handleMouseEnter(value)}
          onMouseLeave={handleMouseLeave}
        >
          ★
        </span>
      ))}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onRate: PropTypes.func,
};

export default StarRating;