// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  // if roles are specified and the user’s role is not one of them, redirect
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  return children
}