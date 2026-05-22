import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const token = localStorage.getItem('auth_token');

  // If no auth token found, redirect to login immediately
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-layout-container">
      <Sidebar />
      <main className="dashboard-layout-content">
        <Outlet />
      </main>
    </div>
  );
}
