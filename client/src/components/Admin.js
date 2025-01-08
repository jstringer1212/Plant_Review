import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [plants, setPlants] = useState({
    cName: '',
    sName: '',
    care: '',
    imageUrl: '',
    pColor: '',
    sColor: '',
  });

  useEffect(() => {
    // Fetch users data on component load
    axios
      .get('/api/users') // Adjust this to your users endpoint
      .then((response) => setUsers(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleRoleChange = (userId, role) => {
    // Call backend to update user role (admin/user)
    axios
      .put(`/api/users/${userId}`, { role })
      .then((response) => {
        // Update the users list with new role
        setUsers((prevState) =>
          prevState.map((user) =>
            user.id === userId ? { ...user, role: response.data.role } : user
          )
        );
      })
      .catch((error) => console.error(error));
  };

  const handleBanStatusChange = (userId, isBanned) => {
    // Call backend to update banned status
    axios
      .put(`/api/users/${userId}`, { banned: isBanned })
      .then(() => {
        // Update the users list with new banned status
        setUsers((prevState) =>
          prevState.map((user) =>
            user.id === userId ? { ...user, banned: isBanned } : user
          )
        );
      })
      .catch((error) => console.error(error));
  };

  const handlePlantSubmit = (e) => {
    e.preventDefault();

    // Send a request to the backend to add a new plant
    axios
      .post('/api/plants', plants)
      .then((response) => {
        alert('Plant added successfully!');
        setPlants({
          cName: '',
          sName: '',
          care: '',
          imageUrl: '',
          pColor: '',
          sColor: '',
        });
      })
      .catch((error) => console.error(error));
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      {/* Left column: User list */}
      <div style={{ flex: 1 }}>
        <h2>Manage Users</h2>
        <table style={{ width: '100%', border: '1px solid #ccc' }}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Active</th>
              <th>Banned</th>
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
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td
                  style={{
                    backgroundColor: user.active ? 'lightgreen' : 'lightcoral',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleBanStatusChange(user.id, !user.active)}
                >
                  {user.active ? 'Active' : 'Inactive'}
                </td>
                <td
                  style={{
                    backgroundColor: user.banned ? 'lightcoral' : 'lightgreen',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleBanStatusChange(user.id, !user.banned)}
                >
                  {user.banned ? 'Banned' : 'Not Banned'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right column: Plant form */}
      <div style={{ flex: 1 }}>
        <h2>Add Plant</h2>
        <form onSubmit={handlePlantSubmit}>
          <div>
            <label>Common Name:</label>
            <input
              type="text"
              value={plants.cName}
              onChange={(e) => setPlants({ ...plants, cName: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Scientific Name:</label>
            <input
              type="text"
              value={plants.sName}
              onChange={(e) => setPlants({ ...plants, sName: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Care Instructions:</label>
            <textarea
              value={plants.care}
              onChange={(e) => setPlants({ ...plants, care: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Image URL:</label>
            <input
              type="url"
              value={plants.imageUrl}
              onChange={(e) => setPlants({ ...plants, imageUrl: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Primary Color:</label>
            <input
              type="text"
              value={plants.pColor}
              onChange={(e) => setPlants({ ...plants, pColor: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Secondary Color:</label>
            <input
              type="text"
              value={plants.sColor}
              onChange={(e) => setPlants({ ...plants, sColor: e.target.value })}
              required
            />
          </div>
          <button type="submit">Add Plant</button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
