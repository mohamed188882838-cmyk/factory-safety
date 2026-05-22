import React, { useState, useEffect } from 'react';
import { getAllPeeLogs } from '../../services/api';
import './HelmetDetection.css';

export default function HelmetDetection() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const response = await getAllPeeLogs();
        const allLogs = response?.data || response || [];
        const helmetLogs = Array.isArray(allLogs)
          ? allLogs.filter(log => log.type === 'helmet')
          : [];
        setIncidents(helmetLogs);
      } catch (err) {
        setError(err.message || 'Failed to load helmet detection data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalToday = incidents.length;

  return (
    <div className="helmet-detection-wrapper">
      <header className="topbar">
        <h2>Helmet Detection Log</h2>
      </header>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          padding: '12px 16px',
          borderRadius: '12px',
          margin: '0 0 16px',
          fontSize: '14px'
        }}>
          <i className="fa-solid fa-circle-exclamation"></i> {error}
        </div>
      )}

      {/* Stats */}
      <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="stat-card">
          <h4>Total Violations Logged</h4>
          <h1>{loading ? '...' : totalToday}</h1>
          <p className="red">Helmet violations detected</p>
        </div>

        <div className="stat-card">
          <h4>Detection Type</h4>
          <h1>Helmet</h1>
          <p>PPE category filter</p>
        </div>
      </section>

      {/* Incidents */}
      <section className="cards-grid">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888', gridColumn: '1 / -1' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '32px' }}></i>
            <p style={{ marginTop: '12px' }}>Loading helmet detection data...</p>
          </div>
        ) : incidents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888', gridColumn: '1 / -1' }}>
            <i className="fa-regular fa-circle-check" style={{ fontSize: '32px', color: '#22c55e' }}></i>
            <p style={{ marginTop: '12px' }}>No helmet violations found</p>
          </div>
        ) : (
          incidents.map((incident) => (
            <div key={incident.id} className="incident-card violation">
              <img
                src={incident.image ? (incident.image.startsWith('http') ? incident.image : `http://178.16.131.178/storage/${incident.image}`) : 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop'}
                alt={`Incident ${incident.id}`}
              />

              <div className="incident-content">
                <div className="badge red-badge">Violation Detected</div>

                <h3>Incident #{incident.id}</h3>
                <p>Camera {incident.number_camera || 'N/A'}</p>

                <div className="info-row">
                  <span>{incident.location || 'Detection Zone'}</span>
                  <span>{incident.created_at ? new Date(incident.created_at).toLocaleTimeString() : ''}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
