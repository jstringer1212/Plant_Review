import React, { useState, useEffect } from 'react';
import { api } from '../api';

const Account = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get('/favorites');
        setFavorites(response.data);
      } catch (err) {
        console.error('Error fetching favorite plants:', err);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      <h2>Account Page</h2>
      <p>Welcome to your account page!</p>
      <h3>Your Favorite Plants</h3>
      <ul>
        {favorites.map((plant) => (
          <li key={plant.id}>{plant.cName}</li>
        ))}
      </ul>
    </div>
  );
};

export default Account;