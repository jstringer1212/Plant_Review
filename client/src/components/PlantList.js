import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from './favButton';

const PlantList = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch('/api/plants');
        if (!response.ok) throw new Error('Failed to fetch plants');
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

  const handleSearchChange = (event) => setSearchTerm(event.target.value.toLowerCase());

  const filteredPlants = plants.filter((plant) =>
    plant.cName.toLowerCase().includes(searchTerm)
  );

  if (loading) return <p>Loading plants...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
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

      <div className="ui centered grid">
        {filteredPlants.length > 0 ? (
          filteredPlants
            .sort((a, b) => a.cName.localeCompare(b.cName))
            .map((plant) => (
              <div key={plant.id} className="ui card">
                <img src={plant.imageUrl} alt={plant.cName} className="ui centered bordered image" />
                <h1 className="ui centered header">{plant.cName}</h1>
                <div role="list" className="ui list">
                  <div className="item">
                    <div className="header">Genus:</div> {plant.genus}
                  </div>
                  <div className="item">
                    <div className="header">Species:</div> {plant.species}
                  </div>
                  <div className="item">
                    <div className="header">Care: </div> {plant.care}
                  </div>
                  <div className="item">
                    <div className="header">Primary Color:</div> {plant.pColor}
                  </div>
                  <div
                    className="ui centered segment"
                    style={{ backgroundColor: plant.pColor, height: '50px', border: '3px solid' }}
                  />
                  <div className="item">
                    <div className="header">Secondary Color:</div> {plant.sColor}
                  </div>
                  <div
                    className="ui centered segment"
                    style={{ backgroundColor: plant.sColor, height: '50px', border: '3px solid' }}
                  />
                </div>
                <div className="ui centered grid">
                  <Link to={`/plants/${plant.id}`}>
                    <button className="ui button">See Plant Details</button>
                  </Link>
                  {userId && (
                    <FavoriteButton
                      userId={parseInt(userId, 10)}
                      plantId={plant.id}
                      initialFavorite={false} // Adjust based on additional logic if needed
                    />
                  )}
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

export default PlantList;
