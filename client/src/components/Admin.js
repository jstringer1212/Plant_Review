import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
        <button onClick={() => navigate('/manageusers')} style={{ padding: '10px', fontSize: '16px' }}>
          Admin Button: Manage Users
        </button>
        <button onClick={() => navigate('/addplant')} style={{ padding: '10px', fontSize: '16px' }}>
          Admin Button: Add Plant
        </button>
      </div>
    </div>
  );
};

export default Admin;
