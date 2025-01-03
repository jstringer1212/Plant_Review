import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { IconButton } from '@mui/material';

const FavoriteButton = ({ userId, plantId, initialFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const handleToggleFavorite = async () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);  // Optimistically update the state

    try {
      // Ensure userId is an integer
      const userIdInt = parseInt(userId, 10);

      // Log the request data to inspect what's being sent
      console.log('Sending data to server:', { userId: userIdInt, plantId, isFavorite: newFavoriteStatus });

      const response = await fetch(`/api/favorites`, {
        method: newFavoriteStatus ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userIdInt, plantId, isFavorite: newFavoriteStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }

      console.log('Favorite status successfully updated');
    } catch (error) {
      // Revert the state if the request fails
      setIsFavorite(isFavorite);  // Revert the state back to the previous one
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <IconButton
      onClick={handleToggleFavorite}
      color={isFavorite ? 'error' : 'default'}
      size="large"
    >
      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  );
};

FavoriteButton.propTypes = {
  userId: PropTypes.number.isRequired,
  plantId: PropTypes.number.isRequired,
  initialFavorite: PropTypes.bool.isRequired,
};

export default FavoriteButton;
