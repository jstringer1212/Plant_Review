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
      <h2>Welcome {userName.firstName || 'Guest'} to the Plant Review App</h2>
      <div className="plants">
        {randomPlant ? (
          <div
            className="plant-item"
            style={{
              backgroundColor: randomPlant.pColor || 'white',
            }}
          >
            <h2>{randomPlant.cName}</h2>
            <div className='detailsbox'>
                       
          <ul>
            <li className='detail'>Genus</li>
            <li className='detail'>Species</li>
            <li className='detail'>Primary Color</li>
            <li className='detail'>Secondary Color</li>
          </ul>
          <ul>
            <li className='detail'>{randomPlant.genus}</li>
            <li className='detail'>{randomPlant.species}</li>
            <li className='detail'>{randomPlant.pColor}</li>
            <li className='detail'>{randomPlant.sColor}</li>
            </ul>
          </div>
            <img src={randomPlant.imageUrl} alt={randomPlant.cName} />
            <button className='button' onClick={handleRefresh}>Get Another Random Plant</button>
            <Link to={`/plants/${randomPlant.id}`}>
              <button className='button'>Go to Plant Page</button>
            </Link>
          </div>
        ) : (
          <p>Loading a featured plant...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
