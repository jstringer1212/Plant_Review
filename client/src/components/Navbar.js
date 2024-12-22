import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styler/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <ul className="navbar-left">
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
      <div className="navbar-center">
        <h1>Plant Review App</h1>
      </div>
      <ul className="navbar-right">
        {!token ? (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/account">Account</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;