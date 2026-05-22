import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './OverviewDashboard.css';

export default function OverviewDashboard() {
  const [user, setUser] = useState({
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.name || 'Marcus Chen',
          avatar: parsed.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <div className="dashboard-overview-wrapper">
      {/* Topbar */}
      <header className="topbar">
        <div>
          <h2>Safety Command Center</h2>
        </div>

        <div className="top-right">
          <i className="fa-regular fa-bell"></i>
          <div className="date-box">
            <h4>Monday, Oct 24</h4>
            <p>Shift B: 08:00 - 16:00</p>
          </div>
          <img src={user.avatar} alt={user.name} />
        </div>
      </header>

      {/* Dashboard */}
      <section className="dashboard">
        <div className="title">
          <h1>Overview Dashboard</h1>
          <p>Real-time workplace safety metrics and AI detection summary.</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="card">
            <i className="fa-solid fa-triangle-exclamation red"></i>
            <h2>02</h2>
            <h4>Daily Accidents</h4>
            <p>Total recorded safety incidents today</p>
          </div>

          <div className="card">
            <i className="fa-solid fa-users blue"></i>
            <h2>94.8%</h2>
            <h4>Compliance Rate</h4>
            <p>Overall percentage of safety protocol adherence</p>
          </div>

          <div className="card">
            <i className="fa-solid fa-clock orange"></i>
            <h2>12</h2>
            <h4>Active Violations</h4>
            <p>Current unresolved safety detections</p>
          </div>
        </div>

        {/* Content */}
        <div className="content-grid">
          {/* Alerts */}
          <div className="alerts-box">
            <div className="section-header">
              <div>
                <h2>Real-time Safety Alerts</h2>
                <p>Live feed from AI surveillance cameras</p>
              </div>

              <div className="buttons">
                <button onClick={() => alert('Viewing history...')}>View History</button>
                <button onClick={() => alert('Clearing all alerts...')}>Clear All</button>
              </div>
            </div>

            {/* Alert */}
            <div className="alert-item">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=500&auto=format&fit=crop"
                alt="Zone B"
              />
              <div className="alert-info">
                <span className="critical">Critical</span>
                <h3>Zone B - Chemicals</h3>
                <p>Unauthorized personnel detected in high-risk zone.</p>
              </div>
              <button className="handled-btn" onClick={() => alert('Alert marked as handled')}>
                Mark Handled
              </button>
            </div>

            <div className="alert-item">
              <img
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=500&auto=format&fit=crop"
                alt="Line 4"
              />
              <div className="alert-info">
                <span className="warning">Warning</span>
                <h3>Production Line 4</h3>
                <p>Supervisor detected without safety helmet.</p>
              </div>
              <button className="handled-btn" onClick={() => alert('Alert marked as handled')}>
                Mark Handled
              </button>
            </div>
          </div>

          {/* Quick Access */}
          <div className="quick-box">
            <h2>Quick Access Modules</h2>

            <NavLink to="/helmet-detection" className="quick-card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="quick-card">
                <i className="fa-solid fa-hard-hat"></i>
                <div>
                  <h4>Helmet Detection</h4>
                  <p>AI scan for mandatory headgear</p>
                </div>
              </div>
            </NavLink>

            <NavLink to="/vest-detection" className="quick-card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="quick-card">
                <i className="fa-solid fa-user-check"></i>
                <div>
                  <h4>Vest Detection</h4>
                  <p>Hi-visibility vest monitoring</p>
                </div>
              </div>
            </NavLink>

            <NavLink to="/gate-monitoring" className="quick-card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="quick-card">
                <i className="fa-solid fa-door-open"></i>
                <div>
                  <h4>Gate Monitoring</h4>
                  <p>Unauthorized entry management</p>
                </div>
              </div>
            </NavLink>
          </div>
        </div>

        {/* Area Status */}
        <div className="area-status">
          <h2>Facility Area Status</h2>

          <div className="status-grid">
            <div className="status-card">
              <h3>ASSEMBLY FLOOR</h3>
              <h1>98%</h1>
              <p>Compliance</p>
            </div>

            <div className="status-card">
              <h3>WAREHOUSE A</h3>
              <h1>95%</h1>
              <p>Compliance</p>
            </div>

            <div className="status-card">
              <h3>LOADING DOCK</h3>
              <h1>92%</h1>
              <p>Compliance</p>
            </div>

            <div className="status-card danger">
              <h3>CHEMICAL STORAGE</h3>
              <h1>45%</h1>
              <p>Compliance</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
