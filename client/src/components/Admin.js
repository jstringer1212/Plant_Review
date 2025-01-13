import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { SketchPicker } from 'react-color';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const { auth } = useAuth();
  const [plants, setPlants] = useState({
    cName: '',
    sName: '',
    care: '',
    imageUrl: '',
    pColor: '',
    sColor: '',
  });
  const [loadingRole, setLoadingRole] = useState(null); // Track which user is being updated
  const [roleUpdateSuccess, setRoleUpdateSuccess] = useState(false); // Track role update success

  useEffect(() => {
    axios
      .get('/api/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleRoleChange = (userId, role) => {
    console.log(`Updating role for user ${userId} to ${role}`);
    setLoadingRole(userId); // Set the user as loading
    setRoleUpdateSuccess(false); // Reset the success state
    
    axios
      .put(
        `/api/users/${userId}`,
        { userId, role },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        console.log('Role updated successfully:', response.data);
        setTimeout(() => {
        setUsers((prevState) =>
          prevState.map((user) =>
            user.id === userId ? { ...user, role: response.data.role } : user
          )
        );
      }, 5000);
        setRoleUpdateSuccess(true); // Mark the update as successful
      })
      .catch((error) => {
        console.error('Error updating role here:', error.response?.data || error.message);
        setRoleUpdateSuccess(false); // Mark the update as failed
      })
      .finally(() => {
        setLoadingRole(null); // Reset loading state
      });
  };

  const handleBanStatusChange = (userId, isBanned) => {
    console.log(`Changing ban status for user ${userId} to ${!isBanned ? 'active' : 'inactive'}`);
    const newActiveStatus = isBanned ? false : true;
  
    axios
      .put(`/api/users/${userId}`, { active: newActiveStatus })
      .then(() => {
        console.log(`User ${userId} status updated to ${newActiveStatus ? 'active' : 'inactive'}`);
        setUsers((prevState) =>
          prevState.map((user) =>
            user.id === userId ? { ...user, active: newActiveStatus } : user
          )
        );
      })
      .catch((error) => {
        console.error('Error updating user status:', error);
      });
  };

  const handlePlantSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting new plant data:', plants);

    axios
      .post('/api/plants', plants)
      .then((response) => {
        console.log('Plant added successfully:', response.data);
        alert('Plant added successfully!');
        setPlants({
          cName: '',
          sName: '',
          care: '',
          imageUrl: '',
          pColor: '',
          sColor: '',
          genus: '',
          species: '',
        });
      })
      .catch((error) => {
        console.error('Error adding plant here:', error);
      });
  };

  const handleColorChange = (colorType, colorValue) => {
    console.log(`Changing ${colorType} to ${colorValue}`);
    setPlants({
      ...plants,
      [colorType]: colorValue,
    });
  };

  return (
    <div className="ui two column grid" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <div className="ui left grid" style={{ flex: 1 }}>
        <h2>Manage Users</h2>
        <table style={{ width: '100%', border: '1px solid #ccc' }}>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Active</th>
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
                    onChange={(e) => {
                      console.log(`Role changed for user ${user.id} to ${e.target.value}`);
                      handleRoleChange(user.id, e.target.value);
                    }}
                    disabled={loadingRole === user.id} // Disable while updating
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  {loadingRole === user.id && <span> (Updating...)</span>}
                  {roleUpdateSuccess && loadingRole === user.id && <span> (Updated!)</span>}
                </td>
                <td
                  style={{
                    backgroundColor: user.active ? 'lightgreen' : 'lightcoral',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    console.log(`Ban status clicked for user ${user.id}`);
                    handleBanStatusChange(user.id, !user.active);
                  }}
                >
                  {user.active ? 'Active' : 'Inactive'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ui right grid" style={{ flex: 1 }}>
        <h2>Add Plant</h2>
        <form className="ui add form" onSubmit={handlePlantSubmit}>
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
            <label>Genus:</label>
            <input
              type="text"
              value={plants.sName}
              onChange={(e) => setPlants({ ...plants, genus: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Species:</label>
            <input
              type="text"
              value={plants.sName}
              onChange={(e) => setPlants({ ...plants, species: e.target.value })}
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
            <div>
              <SketchPicker
                color={plants.pColor}
                onChangeComplete={(color) => handleColorChange('pColor', color.hex)}
              />
            </div>
          </div>

          <div>
            <label>Secondary Color:</label>
            <div>
              <SketchPicker
                color={plants.sColor}
                onChangeComplete={(color) => handleColorChange('sColor', color.hex)}
              />
            </div>
          </div>

          <button type="submit">Add Plant</button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
