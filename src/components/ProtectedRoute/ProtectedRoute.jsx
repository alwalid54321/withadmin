import React from 'react';
import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

function ProtectedRoute({ children }) {
  const isAuthenticated = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return false;

    try {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  return isAuthenticated() ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
