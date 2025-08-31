// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 1. Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUser(JSON.parse(storedUserInfo));
    }
    setLoading(false); // 2. Set loading to false after checking
  }, []);

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    setUser,
    loading, // 3. Provide loading state to the rest of the app
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};