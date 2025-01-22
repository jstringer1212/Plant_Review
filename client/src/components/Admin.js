import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styler/Admin.css'

const Admin = () => {
  const navigate = useNavigate();
  const name = sessionStorage.getItem("firstName");

  return (
    <div>
      <div className='headline' style={{ padding: '20px' }}>
        <h1>What would you like to do today {name}?</h1>
      </div>
      <div className='adminbuttons' style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
        <button className='admin button' onClick={() => navigate('/manageusers')} style={{ padding: '10px', fontSize: '16px' }}>
          Manage Users
        </button>
        <button className='admin button' onClick={() => navigate('/addplant')} style={{ padding: '10px', fontSize: '16px' }}>
          Add Plant
        </button>
        <button className='admin button' onClick={() => navigate('/editplant')} style={{ padding: '10px', fontSize: '16px' }}>
          Edit or Delete Plant
        </button>
      </div>
    </div>
  );
};

export default Admin;
