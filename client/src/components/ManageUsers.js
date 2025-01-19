import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { verifyToken } from './Utilities/authUtils';
import '../Styler/ManageUsers.css'

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loadingRole, setLoadingRole] = useState(null);
  const [roleUpdateSuccess, setRoleUpdateSuccess] = useState(false);
  const token = sessionStorage.getItem('token');
  const LEAD_ADMIN_ID = process.env.REACT_APP_LEAD_ADMIN_ID;

  useEffect(() => {
    if (token && verifyToken(token)) {
      axios
        .get('/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUsers(response.data))
        .catch((error) => console.error('Error fetching users:', error));
    } else {
      console.error('Invalid or expired token');
      window.location.href = '/login';
    }
  }, [token]);

  const handleRoleChange = (userId, role) => {
    if (userId === LEAD_ADMIN_ID) {
      alert('You cannot change the role of the lead admin.');
      return;
    }

    setLoadingRole(userId);
    setRoleUpdateSuccess(false);

    if (token && verifyToken(token)) {
      axios
        .put(
          `/api/users/${userId}/role`,
          { role },
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        )
        .then((response) => {
          setUsers((prevState) =>
            prevState.map((user) => (user.id === userId ? { ...user, role: response.data.role } : user))
          );
          setRoleUpdateSuccess(true);
        })
        .catch((error) => console.error('Error updating role:', error))
        .finally(() => setLoadingRole(null));
    }
  };

  const handleStatusChange = (userId, status) => {
    if (userId === LEAD_ADMIN_ID) {
      alert('You cannot change the role of the lead admin.');
      return;
    }

    const newStatus = status === 'active' ? 'inactive' : 'active';

    if (token && verifyToken(token)) {
      axios
        .put(
          `/api/users/${userId}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        )
        .then(() => {
          setUsers((prevState) =>
            prevState.map((user) => (user.id === userId ? { ...user, status: newStatus } : user))
          );
        })
        .catch((error) => console.error('Error updating user status:', error));
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={loadingRole === user.id}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className='status'
                style={{
                  backgroundColor: user.status === 'active' ? 'lightgreen' : 'lightcoral',
                  cursor: 'pointer',
                }}
                onClick={() => handleStatusChange(user.id, user.status)}
              >
                {user.status === 'active' ? 'Active' : 'Inactive'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
