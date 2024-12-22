import React, { useState, useEffect } from 'react';
import '../Styler/PlantList.css'; // Update the import statement

const PlantList = () => {
  const [plants, setPlants] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch('/api/plants', {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Use response.json() to parse the JSON response
        
        setPlants(data);
      } catch (err) {
        console.error('Error fetching plants:', err);
        setError('Error fetching plants: ' + err.message);
      } 
    };

    fetchPlants();
  }, []);

  return (
    <div className="plant-list">
      <h2>Plant List</h2>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {plants.map((plant) => (
          <li key={plant.id}>
            <div>
              <p>{plant.cName} ({plant.sName})</p>
              <p>Primary Color: {plant.pColor}</p>
              <p>Secondary Color: {plant.sColor}</p>
            </div>
            {plant.imageUrl && <img src={plant.imageUrl} alt={plant.cName} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlantList;