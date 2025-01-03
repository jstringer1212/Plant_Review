// import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import { debounce } from 'lodash'; // Import lodash.debounce for debouncing

// const LeftNavbar = ({ handleSearch }) => {
//   const [searchType, setSearchType] = useState('cName'); // Default search type
//   const [searchQuery, setSearchQuery] = useState('');
//   const [results, setResults] = useState([]);

//   // Debounced search function
//   const debouncedSearch = debounce((query, type) => {
//     handleSearch(query, type) // Call the external search handler
//       .then((data) => {
//         setResults(data); // Assuming handleSearch returns results
//       })
//       .catch((error) => {
//         console.error('Search error:', error);
//         setResults([]); // Clear results in case of an error
//       });
//   }, 500); // 500ms debounce time

//   // Effect to handle search query change
//   useEffect(() => {
//     if (searchQuery.trim()) {
//       debouncedSearch(searchQuery, searchType); // Trigger debounced search
//     }
//   }, [searchQuery, searchType, debouncedSearch]);

//   const handleQueryChange = (event) => {
//     setSearchQuery(event.target.value); // Update the search query
//   };

//   const handleSearchTypeChange = (event) => {
//     setSearchType(event.target.value); // Update the search type
//   };

//   return (
//     <div className="left-navbar">
//       <select value={searchType} onChange={handleSearchTypeChange}>
//         <option value="cName">Common Name</option>
//         <option value="genus">Genus</option>
//         <option value="species">Species</option>
//         {/* Add more search type options here */}
//       </select>
      
//       <input
//         type="text"
//         placeholder="Search..."
//         value={searchQuery}
//         onChange={handleQueryChange} // Update query on input change
//       />

//       {results.length > 0 ? (
//         <div className="search-results">
//           <ul>
//             {results.map((result) => (
//               <li key={result.id}>{result.name}</li> // Adjust according to result structure
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>No results found</p> // Show a message if no results
//       )}
//     </div>
//   );
// };

// LeftNavbar.propTypes = {
//   handleSearch: PropTypes.func.isRequired, // Ensure handleSearch is a function passed down
// };

// export default LeftNavbar;
