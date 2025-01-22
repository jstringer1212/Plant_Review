import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api'; 
import "../Styler/Register.css";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await api.post('/register', { firstName, lastName, email, password });
      if (response.status === 201) {
        const { token, userId, role, firstName, lastName, status } = response.data;
        // Save the values to sessionStorage
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('role', role);
        sessionStorage.setItem('firstName', firstName);
        sessionStorage.setItem('lastName', lastName);
        sessionStorage.setItem('status', status);
        sessionStorage.setItem('token', token);
      }
      setTimeout(() => { //delay to allow session data to be written
      navigate('/'); // Redirect to home or dashboard
    }, 500);//delay to allow session data to be written
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    
    <div className='ui centered grid'>
      <form className='ui form' onSubmit={handleSubmit}>
      <h2>Register</h2>
      <div className='field'>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div className='field'>
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div className='field'>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className='field'>
        <input
          type="password"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className='field'>
        <input
          type="password"
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
        {error && <p>{error}</p>}
      <button className='ui button' type="submit">Register</button>
    </form>
    </div>
  );
};

export default Register;
