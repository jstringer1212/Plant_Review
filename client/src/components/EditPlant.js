import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

const EditPlants = () => {
  const [plants, setPlants] = useState([]);
  const navigate = useNavigate(); 

  // Fetch the list of plants
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axios.get('/api/plants'); 
        setPlants(response.data);
      } catch (error) {
        console.error('Error fetching plants:', error);
      }
    };
    fetchPlants();
  }, []);

  // Handle the deletion of a plant
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/plants/${id}`);
      setPlants(plants.filter(plant => plant.id !== id)); 
    } catch (error) {
      console.error('Error deleting plant:', error);
    }
  };

  // Navigate to the edit page for a specific plant
  const handleEdit = (id) => {
    navigate(`/editplant/${id}`); 
  };

  return (
    <div>
      <h1>Edit Plants</h1>
      
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {plants.map((plant) => (
          <Card key={plant.id} style={{ margin: '10px', width: '200px' }}>
            <CardContent>
              <Typography variant="h6">{plant.cName}</Typography>
              <Typography variant="body2">{plant.sName}</Typography>
              <Typography variant="body2">{plant.species}</Typography>
              <div style={{ marginTop: '10px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit(plant.id)}
                  style={{ marginRight: '10px' }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(plant.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <button
      onClick={() => navigate('/admin')}
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
      Back to Admin
    </button>
    </div>
  );
};

export default EditPlants;
