import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';  // Import PropTypes
import { useParams, Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { IconButton } from '@mui/material';
import ReviewList from './ReviewList';
import CommentList from './CommentList';
import AddReview from './AddReview';

const PlantDetail = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const response = await fetch(`/api/plants/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch plant details');
        }
        const data = await response.json();
        setPlant(data);
      } catch (error) {
        console.error('Error fetching plant details:', error);
        setError('Failed to load plant details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlantDetails();
  }, [id]);

  const toggleFavorite = async (plantId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(plantId)
        ? prevFavorites.filter((id) => id !== plantId)
        : [...prevFavorites, plantId]
    );
  };

  if (loading) return <p>Loading plant details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="plant-item">
      <div className="mainbg">
        {plant ? (
          <>
            <h2>{plant.cName}</h2>
            <div className="detailsbox">
              <ul>
                <li className="detail">Genus</li>
                <li className="detail">Species</li>
                <li className="detail">Primary Color</li>
                <li className="detail">Secondary Color</li>
              </ul>
              <ul>
                <li className="detail">{plant.genus}</li>
                <li className="detail">{plant.species}</li>
                <li className="detail">{plant.pColor}</li>
                <li className="detail">{plant.sColor}</li>
              </ul>
            </div>
            {plant.imageUrl && <img src={plant.imageUrl} alt={plant.cName} />}
            <Link to="/plants">
              <button className="button">Back to Plant List</button>
            </Link>
            <IconButton
              className="favorite-button"
              onClick={() => toggleFavorite(plant.id)}
              color={favorites.includes(plant.id) ? 'error' : 'default'}
              size="xlarge"
            >
              {favorites.includes(plant.id) ? (
                <FavoriteIcon fontSize="large" />
              ) : (
                <FavoriteBorderIcon fontSize="large" />
              )}
            </IconButton>
            <div className="RplusC">
              <div className="reviews">
                <ReviewList plantId={plant.id} plantName={plant.cName} />
                <AddReview plantId={plant.id} />
              </div>
              <div className="comments">
                <CommentList plantId={plant.id} plantName={plant.cName} />
              </div>
            </div>
          </>
        ) : (
          <p>Plant not found</p>
        )}
      </div>
    </div>
  );
};

// Adding PropTypes to validate props
PlantDetail.propTypes = {
  plant: PropTypes.shape({
    id: PropTypes.string.isRequired,
    cName: PropTypes.string.isRequired,
    genus: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    pColor: PropTypes.string,
    sColor: PropTypes.string,
    imageUrl: PropTypes.string.isRequired,
  }),
  favorites: PropTypes.arrayOf(PropTypes.string),
  setFavorites: PropTypes.func.isRequired,
};

export default PlantDetail;
