import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { getDashboard, getAllFireLogs } from '../../services/api';
import './OverviewDashboard.css';

export default function OverviewDashboard() {
  const [user, setUser] = useState({
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
  });

  const [dashboardData, setDashboardData] = useState(null);
  const [fireAlerts, setFireAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const [dashboard, fires] = await Promise.allSettled([
          getDashboard(),
          getAllFireLogs()
        ]);

        if (dashboard.status === 'fulfilled') {
          setDashboardData(dashboard.value);
        }
        if (fires.status === 'fulfilled') {
          const fireData = fires.value?.data || fires.value || [];
          setFireAlerts(Array.isArray(fireData) ? fireData.slice(0, 5) : []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = dashboardData?.data || dashboardData || {};
  const dailyAccidents = stats.daily_accidents ?? stats.accidents ?? '—';
  const complianceRate = stats.compliance_rate ?? stats.compliance ?? '—';
  const activeViolations = stats.active_violations ?? stats.violations ?? '—';

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="dashboard-overview-wrapper">
      <header className="topbar">
        <div>
          <h2>Safety Command Center</h2>
        </div>

        <div className="top-right">
          <div className="date-box">
            <h4>{dateStr}</h4>
          </div>
          <img src={user.avatar} alt={user.name} />
        </div>
      </header>

      <section className="dashboard">
        <div className="title">
          <h1>Overview Dashboard</h1>
          <p>Real-time workplace safety metrics and AI detection summary.</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            <i className="fa-solid fa-circle-exclamation"></i> {error}
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid">
          <div className="card">
            <i className="fa-solid fa-triangle-exclamation red"></i>
            {loading ? <h2 style={{ opacity: 0.4 }}>...</h2> : <h2>{dailyAccidents}</h2>}
            <h4>Daily Accidents</h4>
            <p>Total recorded safety incidents today</p>
          </div>

          <div className="card">
            <i className="fa-solid fa-users blue"></i>
            {loading ? <h2 style={{ opacity: 0.4 }}>...</h2> : <h2>{typeof complianceRate === 'number' ? complianceRate + '%' : complianceRate}</h2>}
            <h4>Compliance Rate</h4>
            <p>Overall percentage of safety protocol adherence</p>
          </div>

          <div className="card">
            <i className="fa-solid fa-clock orange"></i>
            {loading ? <h2 style={{ opacity: 0.4 }}>...</h2> : <h2>{activeViolations}</h2>}
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
                <h2>Real-time Fire Alerts</h2>
                <p>Live feed from AI surveillance cameras</p>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px' }}></i>
                <p style={{ marginTop: '10px' }}>Loading alerts...</p>
              </div>
            ) : fireAlerts.length > 0 ? (
              fireAlerts.map((alert, idx) => (
                <div className="alert-item" key={alert.id || idx}>
                  <img
                    src={alert.image ? (alert.image.startsWith('http') ? alert.image : `http://178.16.131.178/storage/${alert.image}`) : 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=500&auto=format&fit=crop'}
                    alt={alert.type || 'Alert'}
                  />
                  <div className="alert-info">
                    <span className={alert.type === 'fire' ? 'critical' : 'warning'}>
                      {alert.type === 'fire' ? 'Critical' : 'Warning'}
                    </span>
                    <h3>{alert.type || 'Safety Alert'}</h3>
                    <p>Confidence: {alert.confidence || 'N/A'}%</p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                <i className="fa-regular fa-circle-check" style={{ fontSize: '28px', color: '#22c55e' }}></i>
                <p style={{ marginTop: '8px' }}>No active fire alerts</p>
              </div>
            )}
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
            {(stats.areas || [
              { name: 'ASSEMBLY FLOOR', compliance: 98 },
              { name: 'WAREHOUSE A', compliance: 95 },
              { name: 'LOADING DOCK', compliance: 92 },
              { name: 'CHEMICAL STORAGE', compliance: 45 }
            ]).map((area, idx) => (
              <div className={`status-card ${(area.compliance ?? area.value ?? 100) < 60 ? 'danger' : ''}`} key={idx}>
                <h3>{(area.name || area.area || `AREA ${idx + 1}`).toUpperCase()}</h3>
                <h1>{area.compliance ?? area.value ?? '—'}%</h1>
                <p>Compliance</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
