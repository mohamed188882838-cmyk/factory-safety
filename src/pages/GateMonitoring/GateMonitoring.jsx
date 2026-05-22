import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './GateMonitoring.css';

export default function GateMonitoring() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      gate: 'North Gate - Sector A',
      subject: 'Unknown Subject',
      desc: 'Tailgating attempt detected by AI',
      time: '14:22:15',
      badgeClass: 'red-badge',
      badgeText: 'Alert',
      img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
      handled: false,
    },
    {
      id: 2,
      gate: 'Warehouse Dock 4',
      subject: 'Non-Personnel',
      desc: 'Restricted access hours violation',
      time: '14:15:30',
      badgeClass: 'orange-badge',
      badgeText: 'Flagged',
      img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop',
      handled: false,
    }
  ]);

  const [activities, setActivities] = useState([
    {
      id: 1,
      gate: 'North Gate - Sector A',
      subject: 'Unknown Subject',
      desc: 'Tailgating attempt detected by AI',
      time: '14:22:15',
      badgeClass: 'red-badge',
      badgeText: 'Alert',
      img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop',
      verified: false,
      handled: false,
    },
    {
      id: 2,
      gate: 'Main Entrance',
      subject: 'Sarah Jenkins (ID-8821)',
      desc: 'Badge ID Verified',
      time: '14:20:05',
      badgeClass: 'verified',
      badgeText: 'Verified',
      img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
      verified: true,
    },
    {
      id: 3,
      gate: 'Warehouse Dock 4',
      subject: 'Non-Personnel',
      desc: 'Restricted access hours violation',
      time: '14:15:30',
      badgeClass: 'orange-badge',
      badgeText: 'Flagged',
      img: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?q=80&w=800&auto=format&fit=crop',
      verified: false,
      handled: false,
    }
  ]);

  const handleResolveAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    setActivities(prev => prev.map(act => act.id === id ? { ...act, handled: true } : act));
    alert('Alert marked as resolved!');
  };

  const handleResolveActivityAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    setActivities(prev => prev.map(act => act.id === id ? { ...act, handled: true } : act));
    alert('Activity alert marked as resolved!');
  };

  return (
    <div className="gate-monitoring-wrapper">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <h1>Gate Monitoring</h1>
        </div>

        <div className="top-icons">
          <i className="fa-solid fa-magnifying-glass"></i>
          <i className="fa-regular fa-bell"></i>
        </div>
      </div>

      {/* Search */}
      <div className="search-row">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search by Employee ID, Name or Gate..." />
        </div>

        <div className="actions">
          <button onClick={() => alert('Filtering...')}>
            <i className="fa-solid fa-filter"></i> Filter
          </button>
          <button onClick={() => alert('Exporting log...')}>
            <i className="fa-solid fa-download"></i> Export
          </button>
        </div>
      </div>

      {/* Overview */}
      <section className="overview">
        <div className="section-header">
          <h2>
            <i className="fa-solid fa-shield-halved"></i> Real-time Overview
          </h2>
          <span>Live Feed Active</span>
        </div>

        {/* Cards */}
        <div className="cards">
          <div className="card">
            <div className="card-top">
              <div className="card-icon">
                <i className="fa-solid fa-building"></i>
              </div>
              <small>+12% today</small>
            </div>
            <p>Total Entries</p>
            <h3>1,482</h3>
          </div>

          <div className="card">
            <div className="card-top">
              <div className="card-icon">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <small className="red">+{alerts.length} new alerts</small>
            </div>
            <p>Unauthorized</p>
            <h3>42</h3>
          </div>

          <div className="card">
            <div className="card-top">
              <div className="card-icon">
                <i className="fa-solid fa-user-check"></i>
              </div>
              <small>+0.4% avg</small>
            </div>
            <p>Badge Verified</p>
            <h3>98.2%</h3>
          </div>

          <div className="card">
            <div className="card-top">
              <div className="card-icon">
                <i className="fa-regular fa-circle-check"></i>
              </div>
              <small>All Operational</small>
            </div>
            <p>Active Gates</p>
            <h3>12 / 12</h3>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="content-grid">
        {/* Left */}
        <div>
          <div className="content-header">
            <h3>
              <span className="dot"></span> Unauthorized Access
            </h3>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Viewing all unauthorized access items...'); }}>View All</a>
          </div>

          {alerts.length === 0 ? (
            <div style={{ background: '#fff', padding: '30px', borderRadius: '18px', border: '1px solid #ececec', textAlign: 'center', color: '#666' }}>
              <i className="fa-regular fa-circle-check" style={{ fontSize: '32px', color: 'green', marginBottom: '10px' }}></i>
              <p>All unauthorized access alerts handled!</p>
            </div>
          ) : (
            alerts.map((alertItem) => (
              <div className="alert-card" key={alertItem.id}>
                <img src={alertItem.img} alt={alertItem.gate} />

                <div className="alert-info">
                  <div className="alert-top">
                    <span className={`badge ${alertItem.badgeClass}`}>{alertItem.badgeText}</span>
                    <small>{alertItem.time}</small>
                  </div>

                  <h4>{alertItem.gate}</h4>
                  <p>{alertItem.subject}</p>
                  <small className="desc">{alertItem.desc}</small>
                </div>

                <button className="danger-btn" onClick={() => handleResolveAlert(alertItem.id)}>
                  Handle Alert
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right */}
        <div>
          <div className="content-header">
            <h3>
              <i className="fa-solid fa-clock-rotate-left"></i> Recent Activity Log
            </h3>
            <small>Sorted by: Newest first</small>
          </div>

          {activities.map((activity) => (
            <div className="activity-card" key={activity.id}>
              <img src={activity.img} alt={activity.gate} />

              <div className="activity-info">
                <div className="alert-top">
                  <span className={`badge ${activity.badgeClass}`}>{activity.badgeText}</span>
                  <small>{activity.time}</small>
                </div>

                <h4>{activity.gate}</h4>
                <p>{activity.subject}</p>
                <small className="desc">{activity.desc}</small>
              </div>

              {activity.verified ? (
                <div className="verified-text">
                  <i className="fa-regular fa-circle-check"></i> Verified
                </div>
              ) : activity.handled ? (
                <div className="verified-text" style={{ color: '#17a34a' }}>
                  <i className="fa-regular fa-circle-check"></i> Handled
                </div>
              ) : (
                <button className="danger-btn" onClick={() => handleResolveActivityAlert(activity.id)}>
                  Handle Alert
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
