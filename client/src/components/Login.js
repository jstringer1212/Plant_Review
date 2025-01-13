import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Access AuthContext
import { api } from '../api'; // Utility for API requests
import '../Styler/Login.css'; // Optional: Add custom styles

const Login = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Use AuthContext to manage auth state

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      const response = await api.post('/login', loginData);
      console.log("response: ", response.data);
      if (response.status === 200) {
        const { token, userId, role } = response.data;
        console.log("user: ", userId, "admin?: ", role); //this returns the userId
        // Store token and set auth state
        localStorage.setItem('token', token);
        login({ userId, role, token });

        if (onClose) {
          onClose(); // Close modal if triggered from modal
        } else {
          navigate('/'); // Redirect to home page if standalone
        }
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while logging in.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {/* Optional close button for modal */}
      {onClose && (
        <button className="modal-close-button" onClick={onClose}>
          Close
        </button>
      )}
    </div>
  );
};

export default Login;
