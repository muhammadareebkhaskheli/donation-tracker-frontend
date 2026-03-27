// donation-tracker-frontend/src/context/UserContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on initial mount
    const loadUser = () => {
      try {
        const sessionStr = localStorage.getItem('userSession');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          setUser(session.user || null);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData, token) => {
    const session = {
      isLoggedIn: true,
      loginTime: Date.now(),
      user: userData,
      token: token
    };
    localStorage.setItem('userSession', JSON.stringify(session));
    if (token) {
      localStorage.setItem('token', token);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userSession');
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (userData) => {
    const sessionStr = localStorage.getItem('userSession');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      session.user = { ...session.user, ...userData };
      localStorage.setItem('userSession', JSON.stringify(session));
      setUser(session.user);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};