import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import OverviewDashboard from './pages/OverviewDashboard/OverviewDashboard';
import HelmetDetection from './pages/HelmetDetection/HelmetDetection';
import VestDetection from './pages/VestDetection/VestDetection';
import GateMonitoring from './pages/GateMonitoring/GateMonitoring';
import SafetyReports from './pages/SafetyReports/SafetyReports';
import AccountSettings from './pages/AccountSettings/AccountSettings';
import UserManagement from './pages/UserManagement/UserManagement';
import FireDetection from './pages/FireDetection/FireDetection';
import DashboardLayout from './components/Layout/DashboardLayout';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes without Sidebar */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Private Routes wrapped with persistent DashboardLayout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<OverviewDashboard />} />
          <Route path="/helmet-detection" element={<HelmetDetection />} />
          <Route path="/vest-detection" element={<VestDetection />} />
          <Route path="/gate-monitoring" element={<GateMonitoring />} />
          <Route path="/reports" element={<SafetyReports />} />
          <Route path="/settings" element={<AccountSettings />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/fire-detection" element={<FireDetection />} />
        </Route>

        {/* Redirect any unknown paths to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
