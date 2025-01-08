import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FavoriteButton from './favButton';

const PlantList = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase()); // Update the search term
  };

  // Filter plants based on the search term
  const filteredPlants = plants.filter((plant) =>
    plant.cName.toLowerCase().includes(searchTerm)
  );

  if (loading) return <p>Loading plants...</p>;
  if (error) return <p className="error">{error}</p>;

  const sortedPlants = filteredPlants.sort((a, b) => a.cName.localeCompare(b.cName));

  return (
    <>
      {/* Search bar */}
      <div className="ui search">
        <div className="ui icon input">
          <input
            type="text"
            placeholder="Search plants..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="prompt"
          />
          <i className="search icon"></i>
        </div>
      </div>

      {/* Plant list */}
      <div className="ui centered grid">
        {sortedPlants.length > 0 ? (
          sortedPlants.map((plant) => (
            <div key={plant.id} className="ui card">
              <img src={plant.imageUrl} alt={plant.cName} className="ui centered bordered image" />
              <h1 className="ui centered header">{plant.cName}</h1>
              <div role="list" className="ui list">
                <div role="listitem" className="item">
                  <div className="header">Genus:</div>
                  {plant.genus}
                </div>
                <div role="listitem" className="item">
                  <div className="header">Species:</div>
                  {plant.species}
                </div>
                <div role="listitem" className="item">
                  <div className="header">Primary Color:</div>
                  {plant.pColor}
                </div>
                <div
                  className="ui centered segment"
                  style={{
                    backgroundColor: plant.pColor,
                    width: '100%',
                    height: '50px',
                    border: '3px solid',
                  }}
                ></div>
                <div role="listitem" className="item">
                  <div className="header">Secondary Color:</div>
                  {plant.sColor}
                </div>
                <div
                  className="ui centered segment"
                  style={{
                    backgroundColor: plant.sColor,
                    width: '100%',
                    height: '50px',
                    border: '3px solid',
                  }}
                ></div>
              </div>
              <div className="ui centered grid">
                <Link to={`/plants/${plant.id}`}>
                  <button className="ui button">See Plant Details</button>
                </Link>
                <div className="ui icon heart button">
                  <FavoriteButton
                    userId={Number(localStorage.getItem('userId'))}
                    plantId={plant.id}
                    initialFavorite={isFavorite(plant.id)} // Determine if the plant is a favorite
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No plants available.</p>
        )}
      </div>
    </>
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
