import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api'; // Utility for API requests
import '../Styler/Login.css'; // Optional: Add custom styles

const Login = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For button state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/login', { email, password });

      if (response.status === 200) {
        // console.log('response data', response.data);
        const { token, userId, role, firstName, lastName } = response.data;
        // console.log("User ID:", userId, "Role:", role);

        // Store token and user data
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('role', role);
        sessionStorage.setItem('firstName', firstName);
        sessionStorage.setItem('lastName', lastName);

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
    } finally {
      setIsLoading(false); // Re-enable the button
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
            required
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
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {onClose && (
        <button className="modal-close-button" onClick={onClose}>
          Close
        </button>
      )}
    </div>
  );
};

export default Login;
