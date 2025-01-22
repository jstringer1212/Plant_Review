import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('authToken');
    const savedUserId = sessionStorage.getItem('userId'); // Retrieve userId from local storage
    if (savedToken && savedUserId) {
      setAuth({ token: savedToken, userId: savedUserId });
    }
  }, []);

  const login = (token, userId) => {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userId', userId); // Save userId to local storage
    setAuth({ token, userId });
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userId'); // Clear userId from local storage
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
