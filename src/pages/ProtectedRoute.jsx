import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { session, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-400">
        Checking access...
      </div>
    );
  }

  // No real Supabase session -> not logged in
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Role is verified from the database (profiles table), never from the client
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
