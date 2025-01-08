import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './Login';


const Home = () => {
  const [plants, setPlants] = useState([]);
  const [randomPlant, setRandomPlant] = useState(null);
  const { auth } = useAuth();
  const [userName, setUserName] = useState({ firstName: '', lastName: '' });
   

  // Log the auth object to verify its structure and values
  // console.log('Auth object:', auth);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch('/api/plants'); // Known good route
        if (!response.ok) {
          throw new Error('Failed to fetch plants');
        }
        const data = await response.json();
        setPlants(data);

        if (data.length > 0) {
          const randomId = Math.floor(Math.random() * data.length);
          setRandomPlant(data[randomId]);
        }
      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    };
    
    fetchPlants();
  }, []);

  useEffect(() => {
    if (!auth?.userId) {
      console.warn('User ID is not available; fetchUser will not be called');
      return;
    }

    console.log('Calling fetchUser with User ID:', auth.userId);

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${auth.userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user with ID ${auth.userId}`);
        }
        const data = await response.json();
        // console.log('User retrieved:', data);
        setUserName({ firstName: data.firstName, lastName: data.lastName });
      } catch (error) {
        console.error('Could not retrieve user data:', error);
      }
    };

    fetchUser();
  }, [auth?.userId]); // Dependency: Runs when `auth.userId` changes

  const handleRefresh = () => {
    if (plants.length > 0) {
      const randomId = Math.floor(Math.random() * plants.length);
      setRandomPlant(plants[randomId]);
    }
  };

  return (

    <div>
      <h2 className='ui centered header'>Welcome {userName.firstName || 'Guest'} </h2>
      <div className="plants">
      
        {randomPlant ? (
          <div
            className="ui centered card"
            style={{
              backgroundColor: "rgb(245, 242, 242)",
            }}
          >
            <img src={randomPlant.imageUrl} alt={randomPlant.cName} className='ui small centered bordered image'/>
            <h1 className='ui centered header'>{randomPlant.cName}</h1>
            <div role="list" className="ui list">
                <div role="listitem" className="item"><div className="header">Genus:</div>{randomPlant.genus}</div>
                <div role="listitem" className="item"><div className="header">Species:</div>{randomPlant.species}</div>
                <div role="listitem" className="item"><div className="header">Primary Color:</div>{randomPlant.pColor}</div>
                <div role="listitem" className="ui centered segment" style={{backgroundColor: randomPlant.pColor, width: '100%',height: '50px', border: '3px solid'}}></div>
                <div role="listitem" className="item"><div className="header">Secondary Color:</div>{randomPlant.sColor}</div>
                <div role="listitem" className="ui centered segment" style={{backgroundColor: randomPlant.sColor, width: '100%',height: '50px', border: '3px solid'}}></div>
            </div> 
            
            <div className='ui centered grid'>
            <button className="ui button" onClick={handleRefresh}>Get Another Random Plant</button>
            <Link to={`/plants/${randomPlant.id}`}>
              <button className="ui button">Go to Plant Page</button>
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
