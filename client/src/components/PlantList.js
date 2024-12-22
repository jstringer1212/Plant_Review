import React from 'react';
import '../Styler/PlantList.css'; // Update the import statement

const PlantList = ({ plants = [] }) => {

  return (
    <div className="plant-list">
      <h2>Plant List</h2>
      <ul>
        {plants.map((plant) => (
          <li key={plant.id}>
            <div>
              <p>Common Name: {plant.cName} </p>
              <p>Genus: {plant.genus}</p>
              <p>Species: {plant.species}</p>
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