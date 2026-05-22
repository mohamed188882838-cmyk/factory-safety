import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './HelmetDetection.css';

export default function HelmetDetection() {
  const [incidents, setIncidents] = useState([
    {
      id: '#7821',
      dept: 'Production Department',
      loc: 'Assembly Line 4',
      time: '10:24 AM',
      img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop',
      handled: false,
    },
    {
      id: '#7819',
      dept: 'Logistics Department',
      loc: 'Loading Dock B',
      time: '09:45 AM',
      img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop',
      handled: false,
    },
    {
      id: '#7815',
      dept: 'Maintenance Department',
      loc: 'Maintenance Bay 2',
      time: '08:12 AM',
      img: 'https://images.unsplash.com/photo-1581092921461-eab10380bee1?q=80&w=1000&auto=format&fit=crop',
      handled: true,
    }
  ]);

  const handleMarkResolved = (id) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, handled: true } : inc));
    alert(`Incident ${id} marked as resolved!`);
  };

  const activeUnhandled = incidents.filter(i => !i.handled).length;

  return (
    <div className="helmet-detection-wrapper">
      {/* Topbar */}
      <header className="topbar">
        <h2>Helmet Detection Review</h2>

        <div className="top-actions">
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Search by ID or Location..." />
          </div>

          <button onClick={() => alert('Exporting helmet detection data...')}>
            <i className="fa-solid fa-download"></i>
            Export Data
          </button>

          <button className="blue-btn" onClick={() => alert('Alerting safety team...')}>
            <i className="fa-solid fa-bell"></i>
            Alert Team
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="stats-grid">
        <div className="stat-card">
          <h4>Total Violations Today</h4>
          <h1>24</h1>
          <p className="red">+12% from yesterday</p>
        </div>

        <div className="stat-card">
          <h4>Active Unhandled</h4>
          <h1>{activeUnhandled}</h1>
          <p>-4 from yesterday</p>
        </div>

        <div className="stat-card">
          <h4>Compliance Rate</h4>
          <h1>94.2%</h1>
          <p className="green" style={{ color: 'green' }}>+2.1% from yesterday</p>
        </div>

        <div className="stat-card">
          <h4>Most Problematic Area</h4>
          <h1>Loading Dock B</h1>
          <p>Unchanged from yesterday</p>
        </div>
      </section>

      {/* Filters */}
      <section className="filters">
        <button onClick={() => alert('Filtering by All Shifts...')}>All Shifts</button>
        <button onClick={() => alert('Filtering by Status...')}>Status: New</button>
        <button onClick={() => alert('Filtering by Department...')}>Department: Production</button>
      </section>

      {/* Incidents */}
      <section className="cards-grid">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className={`incident-card ${!incident.handled ? 'violation' : ''}`}
          >
            <img src={incident.img} alt={`Incident ${incident.id}`} />

            <div className="incident-content">
              {incident.handled ? (
                <div className="badge gray-badge">Handled</div>
              ) : (
                <div className="badge red-badge">Violation Detected</div>
              )}

              <h3>Incident {incident.id}</h3>
              <p>{incident.dept}</p>

              <div className="info-row">
                <span>{incident.loc}</span>
                <span>{incident.time}</span>
              </div>

              {incident.handled ? (
                <button className="disabled-btn" disabled>
                  Resolved by Supervisor
                </button>
              ) : (
                <button className="mark-btn" onClick={() => handleMarkResolved(incident.id)}>
                  Mark as Handled
                </button>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
