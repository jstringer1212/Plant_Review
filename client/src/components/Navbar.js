import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styler/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const currentUser = sessionStorage.getItem('firstName');

  console.log("current user: ", currentUser);

  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime; // Check token expiration
    } catch {
      return false;
    }
  };

  const getIsAdmin = (token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin' // Ensure the isAdmin property exists
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Clear token from sessionStorage
    navigate('/login'); // Redirect to login page
  };

  const renderAuthButtons = () => {
    if (!isTokenValid(token)) {
      return (
        <>
          <li>
            <Link to="/login">
              <button className="ui inverted button">Login</button>
            </Link>
          </li>
          <li>
            <Link to="/register">
              <button className="ui inverted button">Register</button>
            </Link>
          </li>
        </>
      );
    }
    return (
      <>
        <li>
          <Link to="/account">
            <button className="ui inverted button">Account</button>
          </Link>
        </li>
        {getIsAdmin(token) && (
          <li>
            <Link to="/admin">
              <button className="ui inverted button">Admin Dashboard</button>
            </Link>
          </li>
        )}
        <li>
          <button className="ui inverted button" onClick={handleLogout}>Logout</button>
        </li>
      </>
    );
  };

  return (
    <nav className="navbar">
      <ul className="navbar-left">
        <li>
          <Link to="/">
            <button className="ui inverted button">Home</button>
          </Link>
        </li>
        <li>
          <Link to="/plants">
            <button className="ui inverted button">Plants</button>
          </Link>
        </li>
      </ul>
      <div className="navbar-center">
        <h1>Plant Review App</h1>
        {currentUser && <h6>Logged in as: {currentUser}</h6>}
      </div>
      <ul className="navbar-right">
        {renderAuthButtons()}
      </ul>
    </nav>
  );
};

export default Navbar;
