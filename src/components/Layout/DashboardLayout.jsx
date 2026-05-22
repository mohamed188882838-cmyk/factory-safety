import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './DashboardLayout.css';

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout-container">
      <Sidebar />
      <main className="dashboard-layout-content">
        <Outlet />
      </main>
    </div>
  );
}
