import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  // Grab state from localStorage
  const userSession = JSON.parse(localStorage.getItem('ben_sports_user'));

  // If no token exists, send them straight away back to the login page
  if (!userSession || !userSession.token) {
    return <Navigate to="/login" replace />;
  }

  // If the user's role is not included in the allowed list, bounce them out
  if (allowedRoles && !allowedRoles.includes(userSession.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
