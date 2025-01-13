import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, Link, useLocation } from 'react-router-dom';
import ReviewList from './ReviewList';
import CommentList from './CommentList';
import AddReview from './AddReview';

const PlantDetail = () => {
  const { id } = useParams(); // Retrieve plant ID from the URL
  const location = useLocation(); // Access state from navigation
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const from = location.state?.from || 'list'; // Determine navigation origin

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
    const updatedFavorites = favorites.includes(plantId)
      ? favorites.filter((id) => id !== plantId)
      : [...favorites, plantId];
  
    try {
      await fetch(`/api/users/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorites: updatedFavorites }),
      });
      setFavorites(updatedFavorites); // Update local state only after success
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  if (loading) return <p>Loading plant details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="ui centered grid" style={{ display: 'flex', flexDirection: 'row' }}>
      {/* Plant Details Section (25% width) */}
      <div style={{ flex: '0 0 25%', padding: '20px' }} className="ui centered card">
        {plant ? (
          <>
            <img
              src={plant.imageUrl}
              alt={plant.cName}
              className="ui small centered bordered image"
            />
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
              <Link to={from === 'favorites' ? '/account' : '/plants'}>
                <button className="ui button">
                  Back to {from === 'favorites' ? 'Favorites' : 'Plant List'}
                </button>
              </Link>
              <button
                className={`ui button ${favorites.includes(plant.id) ? 'red' : ''}`}
                onClick={() => toggleFavorite(plant.id)}
              >
                {favorites.includes(plant.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          </>
        ) : (
          <p>Plant not found</p>
        )}
      </div>

      {/* Reviews and Comments Section (75% width) */}
      <div style={{ flex: '0 0 75%', padding: '20px' }}>
        <div className="ui comments">
          <ReviewList plantId={plant.id} plantName={plant.cName} />
          <AddReview plantId={plant.id} />
          {plant.comments && plant.comments > 0 && (
            <CommentList plantId={plant.id} plantName={plant.cName} />
          )}
        </div>
      </div>
    </div>
  );
};

// PropTypes validation for props
PlantDetail.propTypes = {
  plant: PropTypes.shape({
    id: PropTypes.string.isRequired,
    cName: PropTypes.string.isRequired,
    genus: PropTypes.string.isRequired,
    species: PropTypes.string.isRequired,
    pColor: PropTypes.string,
    sColor: PropTypes.string,
    imageUrl: PropTypes.string.isRequired,
    favorites: PropTypes.arrayOf(PropTypes.string),
    setFavorites: PropTypes.func,
  }),
  favorites: PropTypes.arrayOf(PropTypes.string),
  setFavorites: PropTypes.func,
};

export default PlantDetail;
