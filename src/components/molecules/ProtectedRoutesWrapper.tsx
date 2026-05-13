import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectAuth } from '../../redux/slices/authSlice';

const ProtectedRoutesWrapper: React.FC = () => {
  const authState = useAppSelector(selectAuth);

  return authState.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutesWrapper;
