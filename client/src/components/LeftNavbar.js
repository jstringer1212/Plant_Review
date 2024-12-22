import React, { useState } from 'react';
import '../Styler/LeftNavbar.css'; // Ensure this import statement is correct

const LeftNavbar = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('cName');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search parameters nav:', { searchType, searchQuery }); // Log the search parameters
    onSearch(searchType, searchQuery);
  };

  return (
    <div className="left-navbar">
      <h3>Search Plants</h3>
      <form onSubmit={handleSearch}>
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="cName"
              checked={searchType === 'cName'}
              onChange={() => setSearchType('cName')}
            />
            By Common Name
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="genus"
              checked={searchType === 'genus'}
              onChange={() => setSearchType('genus')}
            />
            By Genus
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="species"
              checked={searchType === 'species'}
              onChange={() => setSearchType('species')}
            />
            By Species
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="color"
              checked={searchType === 'color'}
              onChange={() => setSearchType('color')}
            />
            By Color
          </label>
        </div>
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default LeftNavbar;