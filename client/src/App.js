import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import PlantList from './components/PlantList';
import PlantDetail from './components/PlantDetail';
import ReviewList from './components/ReviewList';
import ReviewDetail from './components/ReviewDetail';
import Account from './components/Account';
import Plants from './components/Plants'; // Import the new Plants component

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="App-header">
          <h1>Plant Review App</h1>
          <Navbar />
        </header>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plant/:id" element={<PlantDetail />} />
          <Route path="/plant" element={<PlantList />} />
          <Route path="/reviews/:id" element={<ReviewDetail />} />
          <Route path="/reviews" element={<ReviewList />} />
          <Route path="/" element={<PlantList />} />
          <Route path="/account" element={<Account />} />
          <Route path="/plants" element={<Plants />} /> {/* Add the new route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
