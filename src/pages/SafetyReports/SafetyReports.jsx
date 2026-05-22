import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Chart from 'chart.js/auto';
import './SafetyReports.css';

export default function SafetyReports() {
  const performanceChartRef = useRef(null);
  const violationsChartRef = useRef(null);
  const [logs, setLogs] = useState([
    {
      id: 1,
      type: 'No Helmet',
      loc: 'Loading Dock 4',
      time: '14:20 PM',
      badgeClass: 'high',
      badgeText: 'High',
      img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=100&h=100&fit=crop',
      handled: false,
    },
    {
      id: 2,
      type: 'Restricted Entry',
      loc: 'Server Room',
      time: '11:05 AM',
      badgeClass: 'critical',
      badgeText: 'Critical',
      img: 'https://images.unsplash.com/photo-1558441138-5d1264381a89?w=100&h=100&fit=crop',
      handled: true,
    },
    {
      id: 3,
      type: 'No Vest',
      loc: 'Assembly Line B',
      time: '09:45 AM',
      badgeClass: 'medium',
      badgeText: 'Medium',
      img: 'https://images.unsplash.com/photo-1581092828338-2314dddb7ecb?w=100&h=100&fit=crop',
      handled: true,
    }
  ]);

  const handleResolveLog = (id) => {
    setLogs(prev => prev.map(log => log.id === id ? { ...log, handled: true } : log));
    alert('Critical incident log marked as handled!');
  };

  useEffect(() => {
    let perfChartInstance = null;
    let violChartInstance = null;

    if (performanceChartRef.current) {
      perfChartInstance = new Chart(performanceChartRef.current, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Compliance Rate (%)',
            data: [90, 88, 92, 91, 94, 93, 95],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4,
            yAxisID: 'y'
          }, {
            label: 'Total Incidents',
            data: [2, 1, 5, 2, 3, 0, 1],
            type: 'bar',
            backgroundColor: '#ef4444',
            borderRadius: 4,
            barThickness: 20,
            yAxisID: 'y1'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false,
              min: 0,
              max: 100,
              position: 'left',
              grid: { display: false }
            },
            y1: {
              beginAtZero: true,
              position: 'right',
              grid: { display: false }
            }
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: { usePointStyle: true, padding: 20 }
            }
          }
        }
      });
    }

    if (violationsChartRef.current) {
      violChartInstance = new Chart(violationsChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Assembly A', 'Loading Dock', 'Warehouse', 'Welding Hall', 'Chemical Lab'],
          datasets: [{
            label: 'Violations',
            data: [4, 9, 3, 5, 2],
            backgroundColor: '#2563eb',
            borderRadius: 4,
            indexAxis: 'y'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { grid: { display: false } },
            y: { grid: { display: false } }
          }
        }
      });
    }

    return () => {
      if (perfChartInstance) perfChartInstance.destroy();
      if (violChartInstance) violChartInstance.destroy();
    };
  }, []);

  return (
    <div className="reports-page-wrapper">
      <div className="container">
        {/* Main Content */}
        <main className="main-content">
          <header>
            <h1>Safety Analytics & Reports</h1>
            <div className="header-actions">
              <div className="view-toggle">
                <button className="active" onClick={() => alert('Viewing Daily...')}>Daily View</button>
                <button onClick={() => alert('Viewing Weekly Summary...')}>Weekly Summary</button>
              </div>

              <div className="action-buttons">
                <button className="btn-outline" onClick={() => alert('Exporting PDF...')}>
                  <i className="fas fa-download"></i> Export PDF
                </button>
                <button className="btn-primary" onClick={() => alert('Generating custom report...')}>
                  <i className="fas fa-plus"></i> Generate Custom
                </button>
              </div>
            </div>
          </header>

          {/* Stats Cards */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <span className="label">Avg Compliance</span>
                <span className="value">94.2%</span>
                <span className="trend up">
                  <i className="fas fa-arrow-up"></i> +2.4% <small>vs last week</small>
                </span>
              </div>
              <div className="stat-icon blue"><i className="fas fa-chart-line"></i></div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="label">Active Incidents</span>
                <span className="value">04</span>
                <span className="trend down">
                  <i className="fas fa-arrow-down"></i> -12% <small>vs last week</small>
                </span>
              </div>
              <div className="stat-icon red"><i className="fas fa-exclamation-circle"></i></div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="label">Hazard Areas</span>
                <span className="value">02</span>
                <span className="trend neutral">
                  No Change <small>vs last week</small>
                </span>
              </div>
              <div className="stat-icon yellow"><i className="fas fa-map-marker-alt"></i></div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <span className="label">Total Inspections</span>
                <span className="value">1,248</span>
                <span className="trend up">
                  <i className="fas fa-arrow-up"></i> +8.1% <small>vs last week</small>
                </span>
              </div>
              <div className="stat-icon dark"><i className="fas fa-clipboard-check"></i></div>
            </div>
          </section>

          {/* Charts Section */}
          <section className="charts-grid">
            <div className="chart-container main-chart">
              <div className="chart-header">
                <h3>Safety Performance Trend</h3>
                <span className="chart-subtitle">Visualizing compliance rates vs. total detected incidents</span>
                <span className="timeframe">Last 7 Days</span>
              </div>
              <canvas ref={performanceChartRef}></canvas>
            </div>

            <div className="chart-container side-chart">
              <div className="chart-header">
                <h3>Violations by Department</h3>
                <span className="chart-subtitle">Top hazard zones requiring supervisor focus</span>
              </div>
              <canvas ref={violationsChartRef}></canvas>
            </div>
          </section>

          {/* Bottom Section */}
          <section className="bottom-grid">
            <div className="incident-log">
              <div className="section-header">
                <h3>Critical Incident Log</h3>
                <a href="#" className="view-all" onClick={(e) => { e.preventDefault(); alert('Viewing all critical incident logs...'); }}>View All Logs</a>
              </div>
              <p className="subtitle">High-severity visual evidence captured by AI cameras</p>

              <div className="log-items">
                {logs.map((log) => (
                  <div className="log-item" key={log.id}>
                    <img src={log.img} alt="Incident" />
                    <div className="log-details">
                      <h4>{log.type}</h4>
                      <span><i className="fas fa-map-marker-alt"></i> {log.loc}</span>
                      <span><i className="far fa-clock"></i> {log.time}</span>
                    </div>

                    <div className="log-status">
                      <span className={`badge ${log.badgeClass}`}>{log.badgeText}</span>
                      {log.handled ? (
                        <button className="btn-link" disabled style={{ opacity: 0.6, cursor: 'default' }}>
                          Handled
                        </button>
                      ) : (
                        <button className="btn-action" onClick={() => handleResolveLog(log.id)}>
                          Handle Now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="side-panel">
              <div className="distribution-card">
                <h3>Safety Distribution</h3>
                <p className="subtitle">Internal compliance score distribution</p>
                <div className="progress-group">
                  <div className="progress-label"><span>PPE Compliance</span> <span>98.2%</span></div>
                  <div className="progress-bar"><div className="progress" style={{ width: '98.2%' }}></div></div>
                </div>
                <div className="progress-group">
                  <div className="progress-label"><span>Restricted Access</span> <span>82.5%</span></div>
                  <div className="progress-bar"><div className="progress" style={{ width: '82.5%' }}></div></div>
                </div>
                <div className="progress-group">
                  <div className="progress-label"><span>Gate Security</span> <span>91.0%</span></div>
                  <div className="progress-bar"><div className="progress" style={{ width: '91.0%' }}></div></div>
                </div>
              </div>

              <div className="quick-export">
                <h3>QUICK EXPORT</h3>
                <div className="export-buttons">
                  <button onClick={() => alert('Exporting PDF Report...')}><i className="fas fa-file-pdf"></i> PDF Report</button>
                  <button onClick={() => alert('Exporting Excel Data...')}><i className="fas fa-file-excel"></i> Excel Data</button>
                </div>
              </div>
            </div>
          </section>

          <footer>
            <span>© 2024 Industrial Safety Supervisor. All systems operational.</span>
            <div className="footer-links">
              <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Safety Standards</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Help Center</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
