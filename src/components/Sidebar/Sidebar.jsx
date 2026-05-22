import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Marcus Chen',
    role: 'Safety Supervisor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
  });

  // Load user details from localStorage
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser({
            name: parsed.name || 'Marcus Chen',
            role: parsed.role || 'Safety Supervisor',
            avatar: parsed.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
          });
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
    };

    loadUser();

    // Listen to changes in localStorage so sidebar updates instantly if user updates their profile
    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-window updates
    window.addEventListener('userUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleStorageChange);
    };
  }, []);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <i className="fa-solid fa-shield-halved"></i>
        <h2>Safety Supervisor</h2>
      </div>

      {/* Main Menu */}
      <div className="menu-title">MAIN MENU</div>
      <ul className="menu">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            <i className="fa-solid fa-table-columns"></i>
            Dashboard
          </NavLink>
        </li>
        <li>
          <a href="#" onClick={(e) => { e.preventDefault(); alert("Factory Map visualization is loading..."); }}>
            <i className="fa-regular fa-map"></i>
            Factory Map
          </a>
        </li>
        <li>
          <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
            <i className="fa-regular fa-clipboard"></i>
            Safety Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
            <i className="fa-solid fa-gear"></i>
            Settings
          </NavLink>
        </li>
      </ul>

      {/* Detection Modules */}
      <div className="menu-title">DETECTION MODULES</div>
      <ul className="menu">
        <li>
          <NavLink to="/helmet-detection" className={({ isActive }) => isActive ? 'active' : ''}>
            <i className="fa-solid fa-hard-hat"></i>
            Helmet Detection
          </NavLink>
        </li>
        <li>
          <NavLink to="/vest-detection" className={({ isActive }) => isActive ? 'active' : ''}>
            <i className="fa-solid fa-user-check"></i>
            Vest Detection
          </NavLink>
        </li>
        <li>
          <NavLink to="/gate-monitoring" className={({ isActive }) => isActive ? 'active' : ''}>
            <i className="fa-solid fa-door-open"></i>
            Gate Monitoring
          </NavLink>
        </li>
      </ul>

      {/* User Box */}
      <div className="sidebar-user-box" onClick={() => navigate('/settings')}>
        <img src={user.avatar} alt={user.name} />
        <div className="user-details">
          <h4>{user.name}</h4>
          <p>{user.role}</p>
        </div>
      </div>
    </aside>
  );
}
