import React, { useState } from 'react';
import axios from 'axios';
import { SketchPicker } from 'react-color';
import { verifyToken } from './Utilities/authUtils'; // Import verifyToken

const AddPlant = () => {
  const [plants, setPlants] = useState({
    cName: '',
    sName: '',
    care: '',
    imageUrl: '',
    pColor: '',
    sColor: '',
    genus: '',
    species: '',
  });

  const token = sessionStorage.getItem('token'); // Get token from sessionStorage

  const handlePlantSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting new plant data:', plants);

    // Verify token before submitting plant
    if (token && verifyToken(token)) {
      axios
        .post('/api/plants', plants, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log('Plant added successfully:', response.data);
          alert('Plant added successfully!');
          setPlants({
            cName: '',
            sName: '',
            care: '',
            imageUrl: '',
            pColor: '',
            sColor: '',
            genus: '',
            species: '',
          });
        })
        .catch((error) => {
          console.error('Error adding plant:', error);
        });
    } else {
      console.error('Invalid or expired token');
      window.location.href = '/login'; // Redirect to login if token is invalid
    }
  };

  const handleColorChange = (colorType, colorValue) => {
    console.log(`Changing ${colorType} to ${colorValue}`);
    setPlants({
      ...plants,
      [colorType]: colorValue,
    });
  };

  return (
    <div className="ui form" style={{ padding: '20px' }}>
      <h2>Add Plant</h2>
      <form onSubmit={handlePlantSubmit}>
        <div>
          <label>Common Name:</label>
          <input
            type="text"
            value={plants.cName}
            onChange={(e) => setPlants({ ...plants, cName: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Scientific Name:</label>
          <input
            type="text"
            value={plants.sName}
            onChange={(e) => setPlants({ ...plants, sName: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Genus:</label>
          <input
            type="text"
            value={plants.genus}
            onChange={(e) => setPlants({ ...plants, genus: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Species:</label>
          <input
            type="text"
            value={plants.species}
            onChange={(e) => setPlants({ ...plants, species: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Care Instructions:</label>
          <textarea
            value={plants.care}
            onChange={(e) => setPlants({ ...plants, care: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="url"
            value={plants.imageUrl}
            onChange={(e) => setPlants({ ...plants, imageUrl: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Primary Color:</label>
          <SketchPicker
            color={plants.pColor}
            onChangeComplete={(color) => handleColorChange('pColor', color.hex)}
          />
        </div>

        <div>
          <label>Secondary Color:</label>
          <SketchPicker
            color={plants.sColor}
            onChangeComplete={(color) => handleColorChange('sColor', color.hex)}
          />
        </div>

        <button type="submit">Add Plant</button>
      </form>
    </div>
  );
};

export default AddPlant;
