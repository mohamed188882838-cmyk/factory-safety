import React, { useState, useEffect } from 'react';
import { getAllPeeLogs } from '../../services/api';
import './VestDetection.css';

export default function VestDetection() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const response = await getAllPeeLogs();
        const allLogs = response?.data || response || [];
        const vestLogs = Array.isArray(allLogs)
          ? allLogs.filter(log => log.type === 'veste' || log.type === 'vest')
          : [];
        setWorkers(vestLogs);
      } catch (err) {
        setError(err.message || 'Failed to load vest detection data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalToday = workers.length;

  return (
    <div className="vest-detection-wrapper">
      <header className="topbar">
        <h2>Vest Detection Log</h2>
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
      <section className="stats" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="box">
          <h4>Total Violations Logged</h4>
          <h1>{loading ? '...' : totalToday}</h1>
        </div>

        <div className="box">
          <h4>Detection Type</h4>
          <h1>Vest</h1>
        </div>
      </section>

      {/* Stream */}
      <section className="stream">
        <h2>Live Detection Stream</h2>

        <div className="stream-grid">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#888', gridColumn: '1 / -1' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '32px' }}></i>
              <p style={{ marginTop: '12px' }}>Loading vest detection data...</p>
            </div>
          ) : workers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#888', gridColumn: '1 / -1' }}>
              <i className="fa-regular fa-circle-check" style={{ fontSize: '32px', color: '#22c55e' }}></i>
              <p style={{ marginTop: '12px' }}>No vest violations found</p>
            </div>
          ) : (
            workers.map((worker) => (
              <div className="stream-card" key={worker.id}>
                <img
                  src={worker.image ? (worker.image.startsWith('http') ? worker.image : `http://178.16.131.178/storage/${worker.image}`) : 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop'}
                  alt={`Worker ${worker.id}`}
                />

                <div className="stream-content">
                  <div className="badge red-badge" style={{ marginBottom: '10px', display: 'inline-block' }}>Violation</div>
                  <h3>Incident #{worker.id}</h3>
                  <p>Camera {worker.number_camera || 'N/A'}</p>

                  <div className="time">
                    <span>{worker.location || 'Detection Zone'}</span>
                    <span>{worker.created_at ? new Date(worker.created_at).toLocaleTimeString() : ''}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
