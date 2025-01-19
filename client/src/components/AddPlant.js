import React, { useState } from 'react';
import axios from 'axios';
import { SketchPicker } from 'react-color';
import { verifyToken } from './Utilities/authUtils'; // Import verifyToken
import '../Styler/AddPlant.css'
import { Form, Input, TextArea, Button } from 'semantic-ui-react'; // Use Semantic UI components

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
    <div 
        className="ui form container" 
        
    >
      <h2>Add Plant</h2>
      <span></span>
      <Form className="ui form" onSubmit={handlePlantSubmit}>
        <Form.Field>
          <label>Common Name:</label>
          <Input
            type="text"
            value={plants.cName}
            onChange={(e) => setPlants({ ...plants, cName: e.target.value })}
            required
          />
        </Form.Field>

        <Form.Field>
          <label>Scientific Name:</label>
          <Input
            type="text"
            value={plants.sName}
            onChange={(e) => setPlants({ ...plants, sName: e.target.value })}
            required
          />
        </Form.Field>

        <Form.Field>
          <label>Genus:</label>
          <Input
            type="text"
            value={plants.genus}
            onChange={(e) => setPlants({ ...plants, genus: e.target.value })}
            required
          />
        </Form.Field>

        <Form.Field>
          <label>Species:</label>
          <Input
            type="text"
            value={plants.species}
            onChange={(e) => setPlants({ ...plants, species: e.target.value })}
            required
          />
        </Form.Field>

        <Form.Field>
          <label>Care Instructions:</label>
          <TextArea
            value={plants.care}
            onChange={(e) => setPlants({ ...plants, care: e.target.value })}
            required
          />
        </Form.Field>

        <Form.Field>
          <label>Image URL:</label>
          <Input
            type="url"
            value={plants.imageUrl}
            onChange={(e) => setPlants({ ...plants, imageUrl: e.target.value })}
            required
          />
        </Form.Field>
        <Form.Field className="flex"
            style={{
            background: `linear-gradient(to bottom right, ${plants.pColor || '#ffffff'}, ${plants.sColor || '#ffffff'})`,
            }}>
            <div className="color-picker"
            >
                <div
                    className="color-preview"
                    style={{
                    backgroundColor: plants.pColor || "transparent", // Dynamic background color
                    }}
                ></div>
                <label>Primary Color:</label>
                <SketchPicker
                color={plants.pColor}
                onChangeComplete={(color) => handleColorChange("pColor", color.hex)}
                />
                
            </div>

            <div className="color-picker">
                <label>Secondary Color:</label>
                <SketchPicker
                color={plants.sColor}
                onChangeComplete={(color) => handleColorChange("sColor", color.hex)}
                />
                <div
                    className="color-preview"
                    style={{
                    backgroundColor: plants.sColor || "transparent", // Dynamic background color
                    }}
                ></div>
            </div>
</Form.Field>
        <Button type="submit" primary>
          Add Plant
        </Button>
      </Form>
    </div>
  );
};

export default AddPlant;
