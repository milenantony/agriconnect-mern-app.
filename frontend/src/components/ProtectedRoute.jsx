import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Verifying access...</div>;
  }

  if (user && user.role === 'farmer') {
    return children;
  }
  
  return <Navigate to="/login" />;
};

export default ProtectedRoute;