import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [randomPlant, setRandomPlant] = useState(null);
  const currentUser = sessionStorage.getItem('firstName ');
  console.log('current user: ', currentUser);
  
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch('/api/plants');
        if (!response.ok) throw new Error('Failed to fetch plants');
        const data = await response.json();
        setPlants(data);
        if (data.length) {
          setRandomPlant(data[Math.floor(Math.random() * data.length)]);
        }
      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    };

    fetchPlants();
  }, []);

  const handleRefresh = () => {
    if (plants.length) {
      setRandomPlant(plants[Math.floor(Math.random() * plants.length)]);
    }
  };

  return (
    <div>
      <h2 className="ui centered header">Welcome to the Plant App {currentUser}</h2>
      <div className="plants">
        {randomPlant ? (
          <div className="ui centered card" style={{ backgroundColor: '#f5f2f2' }}>
            <img
              src={randomPlant.imageUrl}
              alt={randomPlant.cName}
              className="ui small centered bordered image"
            />
            <h1 className="ui centered header">{randomPlant.cName}</h1>
            <div role="list" className="ui list">
              <div className="item">
                <div className="header">Genus:</div> {randomPlant.genus}
              </div>
              <div className="item">
                <div className="header">Species:</div> {randomPlant.species}
              </div>
              <div className="item">
                <div className="header">Care: </div> {randomPlant.care}
              </div>
              <div className="item">
                <div className="header">Primary Color:</div> {randomPlant.pColor}
              </div>
              <div
                className="ui centered segment"
                style={{ backgroundColor: randomPlant.pColor, height: '50px', border: '3px solid' }}
              />
              <div className="item">
                <div className="header">Secondary Color:</div> {randomPlant.sColor}
              </div>
              <div
                className="ui centered segment"
                style={{ backgroundColor: randomPlant.sColor, height: '50px', border: '3px solid' }}
              />
            </div>
            <div className="ui centered grid">
              <button className="ui button" onClick={handleRefresh}>
                RANDOMIZE ME!!
              </button>
              <Link to={`/plants/${randomPlant.id}`}>
                <button className="ui button">Plant Page</button>
              </Link>
            </div>
          </div>
        ) : (
          <p>Loading a featured plant...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
