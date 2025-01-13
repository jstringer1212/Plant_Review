import React from 'react';
import { Route, Routes } from 'react-router-dom'; // No need for BrowserRouter here
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
import { AuthProvider } from './contexts/AuthContext';  // Import AuthContext
import ProtectedRoute from './components/ProtectedRoute';  // Import ProtectedRoute
import './Styler/AllStyles.css';

function App() {
  return (
    <AuthProvider>  {/* Wrap your app with AuthProvider */}
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
          <Route path="/account" element={<ProtectedRoute element={<Account />} />} />
          <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
