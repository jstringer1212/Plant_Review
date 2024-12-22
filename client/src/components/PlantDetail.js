// filepath: /c:/School/Coursework/capstone2/client/src/components/PlantDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api }  from '../api';

const PlantDetail = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const response = await api.get(`/plant/${id}`);
        setPlant(response.data);
      } catch (err) {
        console.error('Error fetching plant:', err);
      }
    };

    fetchPlant();
  }, [id]);

  if (!plant) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{plant.cName} ({plant.sName})</h2>
      <p>{plant.care}</p>
    </div>
  );
};

export default PlantDetail;