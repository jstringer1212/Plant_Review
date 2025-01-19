import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SketchPicker } from 'react-color';
import { verifyToken } from "./Utilities/authUtils"; // Import verifyToken

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
  const [loadingRole, setLoadingRole] = useState(null); // Track which user is being updated
  const [roleUpdateSuccess, setRoleUpdateSuccess] = useState(false); // Track role update success
  const token = sessionStorage.getItem('token'); // Get token from sessionStorage

  const LEAD_ADMIN_ID = process.env.REACT_APP_LEAD_ADMIN_ID;
  console.log('LEAD_ADMIN_ID:', LEAD_ADMIN_ID);
  useEffect(() => {
    // Verify token before making API call
    if (token && verifyToken(token)) {
      axios
        .get('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        });
    } else {
      // Redirect or show error if the token is invalid or expired
      console.error("Invalid or expired token");
      window.location.href = "/login"; // Example: Redirect to login page
    }
  }, [token]);

  const handleRoleChange = (userId, role) => {
    console.log(`Updating role for user ${userId} to ${role}`);

    if (userId === LEAD_ADMIN_ID) {
      // Prevent changes to the lead admin's role
      alert("You cannot change the role of the lead admin.");
      return;
    }

    setLoadingRole(userId); // Set the user as loading
    setRoleUpdateSuccess(false); // Reset the success state

    // Verify token before updating role
    if (token && verifyToken(token)) {
      axios
        .put(
          `/api/users/${userId}/role`,
          { role },
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
          console.error('Error updating role:', error.response?.data || error.message);
          setRoleUpdateSuccess(false); // Mark the update as failed
        })
        .finally(() => {
          setLoadingRole(null); // Reset loading state
        });
    } else {
      console.error("Invalid or expired token");
      window.location.href = "/login"; // Redirect to login if token is invalid
    }
  };

  const handleStatusChange = (userId, status) => {
    console.log(`Changing status for user ${userId} to ${status === 'active' ? 'inactive' : 'active'}`);
    
    if (userId === LEAD_ADMIN_ID) {
      // Prevent changes to the lead admin's role
      alert("You cannot change the role of the lead admin.");
      return;
    }

    const newStatus = status === 'active' ? 'inactive' : 'active';

    // Verify token before changing status
    if (token && verifyToken(token)) {
      axios
        .put(
          `/api/users/${userId}/status`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        .then(() => {
          console.log(`User ${userId} status updated to ${newStatus}`);
          setUsers((prevState) =>
            prevState.map((user) =>
              user.id === userId ? { ...user, status: newStatus } : user
            )
          );
        })
        .catch((error) => {
          console.error('Error updating user status:', error);
        });
    } else {
      console.error("Invalid or expired token");
      window.location.href = "/login"; // Redirect to login if token is invalid
    }
  };

  const handlePlantSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting new plant data:', plants);

    // Verify token before submitting plant
    if (token && verifyToken(token)) {
      axios
        .post(
          '/api/plants',
          plants,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
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
          console.error('Error adding plant:', error);
        });
    } else {
      console.error("Invalid or expired token");
      window.location.href = "/login"; // Redirect to login if token is invalid
    }
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
              value={plants.genus || ''}
              onChange={(e) => setPlants({ ...plants, genus: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Species:</label>
            <input
              type="text"
              value={plants.species || ''}
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
            <SketchPicker
              color={plants.pColor}
              onChangeComplete={(color) => handleColorChange('pColor', color.hex)}
            />
          </div>

          <div>
            <label>Secondary Color:</label>
            <SketchPicker
              color={plants.sColor}
              onChangeComplete={(color) => handleColorChange('sColor', color.hex)}
            />
          </div>

          <button type="submit">Add Plant</button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
