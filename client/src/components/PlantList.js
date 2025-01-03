import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';  // Import PropTypes
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

    fetchPlants();
  }, []);

  if (loading) return <p>Loading plants...</p>;
  if (error) return <p className="error">{error}</p>;

  const sortedPlants = plants.sort((a, b) => a.cName.localeCompare(b.cName));

  return (
    <div>
      <h2>Plant Review App</h2>
      {sortedPlants.length > 0 ? (
        sortedPlants.map((plant) => (
          <div
            key={plant.id}
            className="plant-item"
            style={{
              backgroundColor: plant.pColor || 'white',
            }}
          >
            <div className='plant-name'>{plant.cName} </div>
            <div className='detailsbox'>
              <ul>
                <li className='detail'>Genus</li>
                <li className='detail'>Species</li>
                <li className='detail'>Primary Color</li>
                <li className='detail'>Secondary Color</li>
              </ul>
              <ul>
                <li className='detail'>{plant.genus}</li>
                <li className='detail'>{plant.species}</li>
                <li className='detail'>{plant.pColor}</li>
                <li className='detail'>{plant.sColor}</li>
              </ul>
            </div>
            <img src={plant.imageUrl} alt={plant.cName} />
            <Link to={`/plants/${plant.id}`}>
              <button className='button'>View Details</button>
            </Link>
            <FavoriteButton
              userId={userId}
              plantId={plant.id}
              initialFavorite={plant.isFavorite || false}
            />
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
  setFavorites: PropTypes.func.isRequired,
};

export default PlantList;
