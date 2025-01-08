import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import FavoriteButton from './favButton';

const Account = () => {
  const [favoritePlants, setFavoritePlants] = useState([]);

  const fetchFavoritePlants = async () => {
    try {
      const response = await api.get('/favorites');
      const favoritePlantIds = response.data.map((fav) => fav.plantId);

      const plantResponse = await api.get('/plants');
      const allPlants = plantResponse.data;

      // Filter plants by favorite IDs
      const userFavoritePlants = allPlants.filter((plant) =>
        favoritePlantIds.includes(plant.id)
      );
      setFavoritePlants(userFavoritePlants);
    } catch (err) {
      console.error('Error fetching favorite plants:', err);
    }
  };

  useEffect(() => {
    fetchFavoritePlants();
  }, []);

  const handleFavoriteUpdate = async () => {
    // Refresh favorite plants dynamically
    await fetchFavoritePlants();
  };

  return (
    <div>
      <div className="ui centered header">
        <p>Welcome to your account page!</p>
        <h3>Your Favorite Plants</h3>
      </div>
      <div className="ui centered grid">
        {favoritePlants.length > 0 ? (
          favoritePlants.map((plant) => (
            <div key={plant.id} className="ui card">
              <img
                src={plant.imageUrl}
                alt={plant.cName}
                className="ui centered bordered image"
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
                <Link to={`/plants/${plant.id}`} state={{ from: 'favorites' }}>
                  <button className="ui button">See Plant Details</button>
                </Link>
                <div className="ui icon heart button">
                  <FavoriteButton
                    userId={Number(localStorage.getItem('userId'))}
                    plantId={plant.id}
                    initialFavorite={true}
                    onClick={handleFavoriteUpdate} // Call fetchFavoritePlants after toggle
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>You have not added any plants to your favorites yet.</p>
        )}
      </div>
    </div>
  );
};

export default Account;
