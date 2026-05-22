import React, { useState, useEffect, useRef } from 'react';
import { getAllFireLogs, createFireLog } from '../../services/api';
import './FireDetection.css';

export default function FireDetection() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Simulator States
  const [location, setLocation] = useState('Zone B - Fuel Warehouse');
  const [cameraNumber, setCameraNumber] = useState('04');
  const [confidence, setConfidence] = useState(92);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [simulating, setSimulating] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch Fire Logs
  const fetchFireLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllFireLogs();
      const allLogs = response?.data || response?.fire_logs || (Array.isArray(response) ? response : []);
      setLogs(allLogs);
    } catch (err) {
      console.error("Failed to fetch fire logs:", err);
      setError(err.message || 'Failed to retrieve fire safety system logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFireLogs();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Submit AI Fire Simulation
  const handleSimulationSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      alert('Please upload/capture a verification image to simulate the AI fire detection!');
      return;
    }

    setSimulating(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('location', location);
      formData.append('number_camera', cameraNumber);
      formData.append('confidence', (confidence / 100).toFixed(2)); // backend usually expects 0.0 to 1.0 confidence ratio
      formData.append('status', 'active');

      await createFireLog(formData);
      alert('🔥 CRITICAL ALERT: Fire Incident simulated & broadcasted to control center!');
      
      // Reset simulator
      setImageFile(null);
      setImagePreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Refresh logs
      fetchFireLogs();
    } catch (err) {
      alert(err.message || 'Failed to trigger simulated fire alert.');
    } finally {
      setSimulating(false);
    }
  };

  const totalFireCount = logs.length;
  const activeAlertsCount = logs.filter(l => l.status?.toLowerCase() === 'active' || !l.status).length;

  return (
    <div className="fire-detection-page">
      {/* Top Banner */}
      <div className="fd-header">
        <div className="fd-title-section">
          <h1>
            <span className="live-badge-glow"></span>
            Thermal &amp; AI Fire Detection
          </h1>
          <p>Continuous AI surveillance for flame ignition, combustion and heat signature anomalies</p>
        </div>
        <button className="fd-refresh-btn" onClick={fetchFireLogs} disabled={loading}>
          <i className={`fa-solid fa-arrows-rotate ${loading ? 'fa-spin' : ''}`}></i> Refresh Feeds
        </button>
      </div>

      {/* Overview Stats */}
      <div className="fd-stats-grid">
        <div className={`fd-stat-card ${activeAlertsCount > 0 ? 'alarm-active' : ''}`}>
          <div className="stat-card-inner">
            <div className="fd-icon-box alarm">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div className="fd-stat-info">
              <h3>{loading ? '...' : activeAlertsCount}</h3>
              <p>Active Warnings</p>
            </div>
          </div>
          <div className="pulse-ripple"></div>
        </div>

        <div className="fd-stat-card">
          <div className="stat-card-inner">
            <div className="fd-icon-box history">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div className="fd-stat-info">
              <h3>{loading ? '...' : totalFireCount}</h3>
              <p>Total Recorded Events</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Logs + AI Simulator */}
      <div className="fd-dashboard-grid">
        {/* Left Side: Fire Events List */}
        <div className="fd-logs-section">
          <div className="section-header">
            <h2><i className="fa-solid fa-list-check"></i> System Alerts &amp; Incidents</h2>
            <span className="log-count-indicator">{logs.length} logged</span>
          </div>

          {error && (
            <div className="fd-alert-error">
              <i className="fa-solid fa-circle-exclamation"></i> {error}
            </div>
          )}

          {loading ? (
            <div className="fd-loading-placeholder">
              <div className="fire-spinner"></div>
              <p>Fetching safe-node logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="fd-empty-placeholder">
              <i className="fa-solid fa-shield-halved safe-shield"></i>
              <h3>All Sectors Operating Normative</h3>
              <p>No ignition signatures or thermal threats detected in the plant.</p>
            </div>
          ) : (
            <div className="fd-cards-list">
              {logs.map((log) => {
                const confidencePct = Math.round((parseFloat(log.confidence) || 0) * 100);
                const isCritical = confidencePct >= 80;
                
                return (
                  <div key={log.id} className={`fd-incident-card ${isCritical ? 'critical' : 'warning'}`}>
                    <div className="fd-card-image-wrapper">
                      <img
                        src={log.image ? (log.image.startsWith('http') ? log.image : `http://178.16.131.178/storage/${log.image}`) : 'https://images.unsplash.com/photo-1542382257-201b7f70b7f0?q=80&w=600&auto=format&fit=crop'}
                        alt={`Thermal Log #${log.id}`}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1542382257-201b7f70b7f0?q=80&w=600&auto=format&fit=crop';
                        }}
                      />
                      <span className="fd-card-badge">THERMAL SCAN</span>
                    </div>

                    <div className="fd-card-body">
                      <div className="fd-card-meta">
                        <span className="fd-camera-no">
                          <i className="fa-solid fa-video"></i> CAM-{log.number_camera || '01'}
                        </span>
                        <span className="fd-timestamp">
                          <i className="fa-solid fa-clock"></i> {log.created_at ? new Date(log.created_at).toLocaleString() : 'Just Now'}
                        </span>
                      </div>

                      <h3 className="fd-incident-title">Sector Alert #{log.id}</h3>
                      
                      <div className="fd-info-row">
                        <span className="label">Location:</span>
                        <span className="val">{log.location || 'Central Factory Floor'}</span>
                      </div>

                      <div className="fd-confidence-indicator">
                        <div className="fd-confidence-header">
                          <span>AI Certainty Rating</span>
                          <span className={isCritical ? 'text-critical' : 'text-warning'}>{confidencePct}%</span>
                        </div>
                        <div className="fd-progress-bar">
                          <div 
                            className={`fd-progress-fill ${isCritical ? 'critical' : 'warning'}`}
                            style={{ width: `${confidencePct}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="fd-card-actions">
                        <span className={`status-pill ${log.status || 'active'}`}>
                          {log.status ? log.status.toUpperCase() : 'ACTIVE ALARM'}
                        </span>
                        <button className="btn-resolve" onClick={() => alert('Dispatching remote operator verification...')}>
                          <i className="fa-solid fa-satellite-dish"></i> Verify Feed
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: AI Fire Simulator */}
        <div className="fd-simulator-section">
          <div className="simulator-card">
            <div className="simulator-header">
              <h2><i className="fa-solid fa-server"></i> AI Alert Simulator</h2>
              <p>Upload a sample thermal image to test safety automation rules and alarms</p>
            </div>

            <form onSubmit={handleSimulationSubmit} className="fd-simulator-form">
              <div className="form-group">
                <label>Verification Image *</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                
                {imagePreview ? (
                  <div className="simulator-preview-box">
                    <img src={imagePreview} alt="Simulation Preview" />
                    <button type="button" className="btn-remove-preview" onClick={() => { setImagePreview(''); setImageFile(null); }}>
                      <i className="fa-solid fa-trash-can"></i> Remove
                    </button>
                  </div>
                ) : (
                  <div className="simulator-upload-trigger" onClick={triggerSelectFile}>
                    <i className="fa-solid fa-cloud-arrow-up cloud-icon"></i>
                    <p>Select simulation photo or thermal capture</p>
                    <span>Supports JPG, PNG (Max 5MB)</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="sim-location">Detection Location</label>
                <select 
                  id="sim-location" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="Zone A - Chemical Processing">Zone A - Chemical Processing</option>
                  <option value="Zone B - Fuel Warehouse">Zone B - Fuel Warehouse</option>
                  <option value="Zone C - Main Assembly Hall">Zone C - Main Assembly Hall</option>
                  <option value="Zone D - Electrical Substations">Zone D - Electrical Substations</option>
                  <option value="Gate 1 - Cargo Entrance">Gate 1 - Cargo Entrance</option>
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="sim-camera">Camera Channel</label>
                  <input 
                    id="sim-camera" 
                    type="text" 
                    placeholder="e.g. 05" 
                    required
                    value={cameraNumber}
                    onChange={(e) => setCameraNumber(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sim-confidence">Confidence (%)</label>
                  <input 
                    id="sim-confidence" 
                    type="number" 
                    min="10" 
                    max="100" 
                    value={confidence} 
                    onChange={(e) => setConfidence(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-trigger-alarm" disabled={simulating}>
                {simulating ? (
                  <><span className="mini-spinner"></span> Broadcasting Alert...</>
                ) : (
                  <><i className="fa-solid fa-fire-extinguisher"></i> Trigger AI Alarm Signal</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
