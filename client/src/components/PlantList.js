import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FavoriteButton from './favButton';

const PlantList = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch('/api/plants');
        if (!response.ok) {
          throw new Error('Failed to fetch plants');
        }
        const data = await response.json();
        setPlants(data);
      } catch (error) {
        console.error('Error fetching plants:', error);
        setError('Failed to load plants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      if (!userId) {
        console.warn('User ID is not available; fetchFavorites will not be called.');
        return;
      }
      try {
        const response = await fetch(`/api/favorites`);
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        const favoriteData = await response.json();
        const userFavorites = favoriteData
          .filter((favorite) => favorite.userId === parseInt(userId, 10))
          .map((favorite) => favorite.plantId); // Extract plant IDs for user's favorites
        setFavorites(userFavorites); // Update favorites with the array of plant IDs
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchPlants();
    if (userId) fetchFavorites();
  }, [userId]);

  const isFavorite = (plantId) => favorites.includes(plantId);

  if (loading) return <p>Loading plants...</p>;
  if (error) return <p className="error">{error}</p>;

  const sortedPlants = plants.sort((a, b) => a.cName.localeCompare(b.cName));

  return (
    <div className="ui grid">
      {sortedPlants.length > 0 ? (
        sortedPlants.map((plant) => (
          <div
            key={plant.id}
            className="plant-item"
            style={{
              backgroundColor: plant.pColor || 'white',
            }}
          >
            <div className="ui centered header">{plant.cName}</div>
            <div>
              <ul>
                <li className="detail">Genus: {plant.genus}</li>
                <li className="detail">Species: {plant.species}</li>
                <li className="detail">Primary Color: {plant.pColor}</li>
                <li className="detail">Secondary Color: {plant.sColor}</li>
              </ul>
            </div>
            <img src={plant.imageUrl} alt={plant.cName} />
            <Link to={`/plants/${plant.id}`}>
              <button className="ui primary button">Plant Details</button>
            </Link>
            <div className='ui icon button'>
            <FavoriteButton
              userId={userId}
              plantId={plant.id}
              initialFavorite={isFavorite(plant.id)} // Determine if the plant is a favorite
            /></div>
          </div>
        ))
      ) : (
        <p>No plants available.</p>
      )}
    </div>
  );
};

// Adding PropTypes to validate props
PlantList.propTypes = {
  plants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      cName: PropTypes.string.isRequired,
      genus: PropTypes.string.isRequired,
      species: PropTypes.string.isRequired,
      pColor: PropTypes.string,
      sColor: PropTypes.string,
      imageUrl: PropTypes.string.isRequired,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
  favorites: PropTypes.arrayOf(PropTypes.string),
  setFavorites: PropTypes.func,
};

export default PlantList;


