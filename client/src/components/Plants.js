import React, { useState, useEffect } from 'react';
import PlantList from './PlantList';
import LeftNavbar from './LeftNavbar';

const Plants = () => {
  const [searchResults, setSearchResults] = useState([]);

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
        
        setSearchResults(data); // Initialize search results with all plants
      } catch (err) {
        console.error('Error fetching plants:', err);
      } 
    };

    fetchPlants();
  }, []);

  const handleSearch = async (searchType, searchQuery) => {
    console.log('Search parameters:', { searchType, searchQuery }); // Log the search parameters
    try {
      const response = await fetch(`/api/plants/search?${searchType}=${searchQuery}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Error searching plants:', err);
    }
  };

  return (
    <div className="plants-page">
      <LeftNavbar onSearch={handleSearch} />
      <PlantList plants={searchResults} />
    </div>
  );
};

export default Plants;