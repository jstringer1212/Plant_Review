import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { SketchPicker } from 'react-color';
import { verifyToken } from './Utilities/authUtils'; // Import verifyToken function
import '../Styler/AddPlant.css';
import { Form, Input, TextArea } from 'semantic-ui-react'; // Use Semantic UI components

const EditPlantForm = () => {
  const { id } = useParams(); // Get the plant ID from the URL
  const [plant, setPlant] = useState(null);
  const navigate = useNavigate(); // Use useNavigate here
  const token = sessionStorage.getItem('token'); // Get the token from sessionStorage
  
  // Fetch the plant details for editing
  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const response = await axios.get(`/api/plants/${id}`);
        setPlant(response.data);
      } catch (error) {
        console.error('Error fetching plant:', error);
      }
    };
    fetchPlant();
  }, [id]);

  // Verify token before rendering the form
  if (token && !verifyToken(token)) {
    // If the token is invalid, redirect to login
    window.location.href = '/login';
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Verify token before submitting the plant data
    if (token && verifyToken(token)) {
      try {
        await axios.put(`/api/plants/${id}`, plant, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate('/plants'); // Redirect to the plants list after successful update
      } catch (error) {
        console.error('Error updating plant:', error);
      }
    } else {
      console.error('Invalid or expired token');
      window.location.href = '/login'; // Redirect to login if token is invalid
    }
  };

  const handleColorChange = (colorType, colorValue) => {
    setPlant({
      ...plant,
      [colorType]: colorValue,
    });
  };

  if (!plant) return <div>Loading...</div>;

  return (
    <div className="ui form container">
      <h2>Edit Plant</h2>
      <button
      onClick={() => navigate('/editplant')}
      style={{
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '10px 15px',
        fontSize: '.75rem',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      Back to Plants
    </button>
      <Form className="ui form" onSubmit={handleSubmit}>
        <Form.Field>
          <label>Common Name:</label>
          <Input
            type="text"
            name="cName"
            value={plant.cName}
            onChange={handleChange}
            required
          />
        </Form.Field>

        <Form.Field>
          <label>Scientific Name:</label>
          <Input
            type="text"
            name="sName"
            value={plant.sName}
            onChange={handleChange}
            required
          />
        </Form.Field>

        <Form.Field>
          <label>Genus:</label>
          <Input
            type="text"
            name="genus"
            value={plant.genus}
            onChange={handleChange}
            required
          />
        </Form.Field>

        <Form.Field>
          <label>Species:</label>
          <Input
            type="text"
            name="species"
            value={plant.species}
            onChange={handleChange}
            required
          />
        </Form.Field>

        <Form.Field>
          <label>Care Instructions:</label>
          <TextArea
            name="care"
            value={plant.care}
            onChange={handleChange}
            required
          />
        </Form.Field>

        <Form.Field>
          <label>Image URL:</label>
          <Input
            type="url"
            name="imageUrl"
            value={plant.imageUrl}
            onChange={handleChange}
            required
          />
        </Form.Field>

        <Form.Field
          className="flex"
          style={{
            background: `linear-gradient(to bottom right, ${plant.pColor || '#ffffff'}, ${plant.sColor || '#ffffff'})`,
          }}
        >
          <div className="color-picker">
            <div
              className="color-preview"
              style={{
                backgroundColor: plant.pColor || 'transparent', // Dynamic background color
              }}
            ></div>
            <label>Primary Color:</label>
            <SketchPicker
              color={plant.pColor}
              onChangeComplete={(color) => handleColorChange('pColor', color.hex)}
            />
          </div>

          <div className="color-picker">
            <label>Secondary Color:</label>
            <SketchPicker
              color={plant.sColor}
              onChangeComplete={(color) => handleColorChange('sColor', color.hex)}
            />
            <div
              className="color-preview"
              style={{
                backgroundColor: plant.sColor || 'transparent', // Dynamic background color
              }}
            ></div>
          </div>
        </Form.Field>

        <Button type="submit" primary>
          Update Plant
        </Button>
      </Form>
    </div>
  );
};

export default EditPlantForm;
