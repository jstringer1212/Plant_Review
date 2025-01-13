import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext
import Login from './Login'; // Import your Login component
import '../Styler/ProtectedRoute.css'; // Optional: Add styles for the modal and overlay

const ProtectedRoute = ({ element }) => {
  const { auth } = useContext(AuthContext); // Access the auth state from context
  const [showLoginModal, setShowLoginModal] = useState(false); // State to toggle modal visibility

  if (!auth?.token) {
    return (
      <div className="protected-route-container">
        <p>You must be logged in to access this page.</p>
        <button
          className="login-button"
          onClick={() => setShowLoginModal(true)}
        >
          Login
        </button>

        {showLoginModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="close-button"
                onClick={() => setShowLoginModal(false)}
              >
                ×
              </button>
              <Login onClose={() => setShowLoginModal(false)} /> {/* Pass an onClose prop */}
            </div>
          </div>
        )}
      </div>
    );
  }

  return element; // If authenticated, show the protected content
};

export default ProtectedRoute;
