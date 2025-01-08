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
import Home from './components/Home';
import Admin from './components/Admin';
import './Styler/AllStyles.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="App-header">
          <Navbar /> 
        </header>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plants/:id" element={<PlantDetail />} />
          <Route path="/plants" element={<PlantList />} />
          <Route path="/reviews/:id" element={<ReviewDetail />} />
          <Route path="/reviews" element={<ReviewList />} />
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<Admin />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
