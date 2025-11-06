import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('userRole'); // Get user role
  const hasAccess = allowedRoles.includes(userRole);

  return hasAccess ? children : <Navigate to="/unauthorized" />;
};

export default RoleBasedRoute;
