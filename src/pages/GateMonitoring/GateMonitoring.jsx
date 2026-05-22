import React, { useState, useEffect } from 'react';
import { 
  getAllVehicleLogs, 
  getAllVehicles, 
  getAuthorizedVehicles, 
  getUnauthorizedVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from '../../services/api';
import './GateMonitoring.css';

export default function GateMonitoring() {
  // Tabs State: 'monitor' or 'registry'
  const [activeTab, setActiveTab] = useState('monitor');
  
  // Data States
  const [alerts, setAlerts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [vehiclesList, setVehiclesList] = useState([]);
  const [stats, setStats] = useState({
    totalEntries: 0,
    unauthorized: 0,
    badgeVerified: '—',
  });
  
  const [loading, setLoading] = useState(true);
  const [registryLoading, setRegistryLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Registry Search & Form States
  const [searchPlate, setSearchPlate] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPlate, setNewPlate] = useState('');
  const [newIsAuthorized, setNewIsAuthorized] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // General Fetch Data
  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [vehicleLogs, vehicles, unauthorized, authorized] = await Promise.allSettled([
        getAllVehicleLogs(),
        getAllVehicles(),
        getUnauthorizedVehicles(),
        getAuthorizedVehicles()
      ]);

      if (vehicleLogs.status === 'fulfilled') {
        const logsData = vehicleLogs.value?.data || vehicleLogs.value || [];
        const logsList = Array.isArray(logsData) ? logsData : [];
        setActivities(logsList.map(log => ({
          id: log.id,
          gate: `Camera ${log.number_camera || 'N/A'}`,
          subject: log.license_plate || 'Unknown',
          desc: log.status || 'Vehicle detected',
          time: log.created_at ? new Date(log.created_at).toLocaleTimeString() : '',
          badgeClass: log.authorized ? 'verified' : 'red-badge',
          badgeText: log.authorized ? 'Verified' : 'Unauthorized',
          img: log.image ? (log.image.startsWith('http') ? log.image : `http://178.16.131.178/storage/${log.image}`) : 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop',
          verified: !!log.authorized,
        })));
      }

      if (unauthorized.status === 'fulfilled') {
        const unauthData = unauthorized.value?.data || unauthorized.value || [];
        const unauthList = Array.isArray(unauthData) ? unauthData : [];
        setAlerts(unauthList.map(v => ({
          id: v.id,
          gate: `Camera ${v.number_camera || 'N/A'}`,
          subject: v.license_plate || 'Unknown Vehicle',
          desc: 'Unauthorized vehicle access attempt',
          time: v.created_at ? new Date(v.created_at).toLocaleTimeString() : '',
          badgeClass: 'red-badge',
          badgeText: 'Alert',
          img: v.image ? (v.image.startsWith('http') ? v.image : `http://178.16.131.178/storage/${v.image}`) : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
        })));
      }

      const allVehicles = vehicles.status === 'fulfilled' ? (vehicles.value?.data || vehicles.value || []) : [];
      const allVehiclesList = Array.isArray(allVehicles) ? allVehicles : [];
      setVehiclesList(allVehiclesList);

      const authData = authorized.status === 'fulfilled' ? (authorized.value?.data || authorized.value || []) : [];
      const authList = Array.isArray(authData) ? authData : [];
      
      const unauthDataForStats = unauthorized.status === 'fulfilled' ? (unauthorized.value?.data || unauthorized.value || []) : [];
      const unauthListForStats = Array.isArray(unauthDataForStats) ? unauthDataForStats : [];

      setStats({
        totalEntries: allVehiclesList.length,
        unauthorized: unauthListForStats.length,
        badgeVerified: allVehiclesList.length > 0
          ? ((authList.length / allVehiclesList.length) * 100).toFixed(1) + '%'
          : '—',
      });

    } catch (err) {
      setError(err.message || 'Failed to load gate monitoring data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch only vehicles list (to refresh registry view without resetting spinner overlay on full page)
  const refreshVehiclesOnly = async () => {
    setRegistryLoading(true);
    try {
      const vehicles = await getAllVehicles();
      const allVehiclesList = vehicles?.data || vehicles || [];
      setVehiclesList(Array.isArray(allVehiclesList) ? allVehiclesList : []);
      
      // also refresh authorized/unauthorized ratios for stats
      const [unauth, auth] = await Promise.allSettled([
        getUnauthorizedVehicles(),
        getAuthorizedVehicles()
      ]);
      const authCount = auth.status === 'fulfilled' ? (auth.value?.data?.length || auth.value?.length || 0) : 0;
      const unauthCount = unauth.status === 'fulfilled' ? (unauth.value?.data?.length || unauth.value?.length || 0) : stats.unauthorized;
      
      setStats(prev => ({
        ...prev,
        totalEntries: allVehiclesList.length,
        unauthorized: unauthCount,
        badgeVerified: allVehiclesList.length > 0
          ? ((authCount / allVehiclesList.length) * 100).toFixed(1) + '%'
          : '—',
      }));
    } catch (err) {
      console.error("Failed to refresh vehicles:", err);
    } finally {
      setRegistryLoading(false);
    }
  };

  // Add Vehicle Submit
  const handleAddVehicleSubmit = async (e) => {
    e.preventDefault();
    if (!newPlate.trim()) {
      alert('License plate number is required!');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('license_plate', newPlate.trim().toUpperCase());
      formData.append('authorized', newIsAuthorized ? '1' : '0');

      await createVehicle(formData);
      alert('Vehicle registered successfully!');
      setIsAddModalOpen(false);
      setNewPlate('');
      setNewIsAuthorized(true);
      refreshVehiclesOnly();
    } catch (err) {
      alert(err.message || 'Failed to register vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle vehicle status
  const handleToggleAuthorization = async (vehicle) => {
    const nextAuth = !vehicle.authorized;
    try {
      await updateVehicle(vehicle.id, {
        authorized: nextAuth,
        status: nextAuth ? 'authorized' : 'unauthorized'
      });
      alert(`Plate clearance toggled to: ${nextAuth ? 'AUTHORIZED' : 'UNAUTHORIZED'}`);
      refreshVehiclesOnly();
    } catch (err) {
      alert(err.message || 'Failed to update clearance status');
    }
  };

  // Delete vehicle
  const handleDeleteVehicle = async (id, plate) => {
    if (window.confirm(`Are you sure you want to delete vehicle license "${plate}" from the registry?`)) {
      try {
        await deleteVehicle(id);
        alert('Vehicle registry entry deleted successfully!');
        refreshVehiclesOnly();
      } catch (err) {
        alert(err.message || 'Failed to delete vehicle registry entry');
      }
    }
  };

  // Filter registry
  const filteredVehicles = vehiclesList.filter(v => {
    const term = searchPlate.toLowerCase();
    return v.license_plate && v.license_plate.toLowerCase().includes(term);
  });

  return (
    <div className="gate-monitoring-wrapper">
      {/* Top Header */}
      <div className="topbar">
        <div className="gm-header-left">
          <h1>Gate Monitoring &amp; Security</h1>
          <p>Real-time vehicle access tracking, automated license plate recognition, and security overrides</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="gm-tabs-navigation">
          <button 
            className={`gm-nav-tab ${activeTab === 'monitor' ? 'active' : ''}`}
            onClick={() => setActiveTab('monitor')}
          >
            <i className="fa-solid fa-satellite-dish"></i> Security Monitor
          </button>
          <button 
            className={`gm-nav-tab ${activeTab === 'registry' ? 'active' : ''}`}
            onClick={() => setActiveTab('registry')}
            id="vehicle-registry-tab"
          >
            <i className="fa-solid fa-address-card"></i> Vehicle Registry
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          padding: '12px 16px',
          borderRadius: '12px',
          margin: '0 0 24px',
          fontSize: '14px'
        }}>
          <i className="fa-solid fa-circle-exclamation"></i> {error}
        </div>
      )}

      {/* Global Dashboard Stats */}
      <section className="overview">
        <div className="cards" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="card">
            <div className="card-top">
              <div className="card-icon">
                <i className="fa-solid fa-car"></i>
              </div>
            </div>
            <p>Total Registered Vehicles</p>
            <h3>{loading ? '...' : stats.totalEntries.toLocaleString()}</h3>
          </div>

          <div className="card">
            <div className="card-top">
              <div className="card-icon">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
            </div>
            <p>Unauthorized Attempts</p>
            <h3>{loading ? '...' : stats.unauthorized}</h3>
          </div>

          <div className="card">
            <div className="card-top">
              <div className="card-icon">
                <i className="fa-solid fa-check-double"></i>
              </div>
            </div>
            <p>Authorized Ratio</p>
            <h3>{loading ? '...' : stats.badgeVerified}</h3>
          </div>
        </div>
      </section>

      {/* Dynamic Tab Content rendering */}
      {activeTab === 'monitor' ? (
        /* ==================== MONITOR TAB ==================== */
        <section className="content-grid">
          {/* Left Area: Unauthorized Attempts */}
          <div>
            <div className="content-header">
              <h3>
                <span className="dot"></span> Unauthorized Access Feed
              </h3>
            </div>

            {loading ? (
              <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '40px', borderRadius: '18px', border: '1px solid var(--border-color, #ececec)', textAlign: 'center', color: '#888' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '28px' }}></i>
                <p style={{ marginTop: '10px' }}>Loading alerts...</p>
              </div>
            ) : alerts.length === 0 ? (
              <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '30px', borderRadius: '18px', border: '1px solid var(--border-color, #ececec)', textAlign: 'center', color: '#666' }}>
                <i className="fa-regular fa-circle-check" style={{ fontSize: '32px', color: 'green', marginBottom: '10px' }}></i>
                <p>No unauthorized access detected!</p>
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
                </div>
              ))
            )}
          </div>

          {/* Right Area: All Logs */}
          <div>
            <div className="content-header">
              <h3>
                <i className="fa-solid fa-clock-rotate-left"></i> All Vehicle Logs
              </h3>
            </div>

            {loading ? (
              <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '40px', borderRadius: '18px', border: '1px solid var(--border-color, #ececec)', textAlign: 'center', color: '#888' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '28px' }}></i>
                <p style={{ marginTop: '10px' }}>Loading logs...</p>
              </div>
            ) : activities.length === 0 ? (
              <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '30px', borderRadius: '18px', border: '1px solid var(--border-color, #ececec)', textAlign: 'center', color: '#666' }}>
                <p>No vehicle activity found</p>
              </div>
            ) : (
              activities.map((activity) => (
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

                  {activity.verified && (
                    <div className="verified-text">
                      <i className="fa-regular fa-circle-check"></i> Authorized
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      ) : (
        /* ==================== REGISTRY TAB ==================== */
        <section className="registry-section-card">
          <div className="registry-bar-controls">
            <div className="registry-search-box">
              <i className="fa-solid fa-magnifying-glass reg-search-icon"></i>
              <input 
                type="text" 
                placeholder="Search registered vehicle plate numbers..."
                value={searchPlate}
                onChange={(e) => setSearchPlate(e.target.value)}
                className="reg-search-input"
                id="plate-registry-search"
              />
              {searchPlate && (
                <button className="clear-reg-search" onClick={() => setSearchPlate('')}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
            
            <div className="registry-buttons">
              <button className="reg-refresh-btn" onClick={refreshVehiclesOnly} disabled={registryLoading} title="Refresh Registry">
                <i className={`fa-solid fa-arrows-rotate ${registryLoading ? 'fa-spin' : ''}`}></i>
              </button>
              <button className="reg-add-btn" onClick={() => setIsAddModalOpen(true)} id="register-vehicle-trigger">
                <i className="fa-solid fa-plus"></i> Register Vehicle
              </button>
            </div>
          </div>

          <div className="registry-table-container">
            {registryLoading && vehiclesList.length === 0 ? (
              <div className="registry-loading">
                <div className="spinner"></div>
                <p>Retrieving database clearance sheets...</p>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="registry-empty">
                <i className="fa-solid fa-car-tunnel empty-icon"></i>
                <h3>No Registered Plates Found</h3>
                <p>{searchPlate ? 'No matches found for your search term.' : 'Database sheet is empty. Register vehicles to white-list access permissions.'}</p>
              </div>
            ) : (
              <table className="registry-table">
                <thead>
                  <tr>
                    <th>Registration ID</th>
                    <th>Plate Number</th>
                    <th>Clearance Status</th>
                    <th>Status Controls</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((v) => {
                    const isAuth = !!v.authorized;
                    return (
                      <tr key={v.id} className="registry-row">
                        <td>
                          <span className="reg-id-badge">ID: {v.id}</span>
                        </td>
                        <td>
                          <div className="reg-plate-display">
                            <i className="fa-solid fa-rectangle-ad"></i>
                            <span className="plate-text">{v.license_plate}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`reg-status-badge ${isAuth ? 'authorized' : 'unauthorized'}`}>
                            <i className={isAuth ? "fa-solid fa-circle-check" : "fa-solid fa-circle-xmark"}></i>
                            {isAuth ? 'AUTHORIZED' : 'UNAUTHORIZED'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className={`btn-toggle-clearance ${isAuth ? 'revoke' : 'grant'}`}
                            onClick={() => handleToggleAuthorization(v)}
                            title={isAuth ? "Revoke clearance status" : "Grant access clearance"}
                            id={`toggle-clearance-${v.id}`}
                          >
                            <i className={isAuth ? "fa-solid fa-user-lock" : "fa-solid fa-key"}></i>
                            {isAuth ? 'Revoke Access' : 'Authorize Vehicle'}
                          </button>
                        </td>
                        <td className="text-right">
                          <button 
                            className="btn-reg-delete"
                            onClick={() => handleDeleteVehicle(v.id, v.license_plate)}
                            title="Remove vehicle entry"
                            id={`delete-vehicle-${v.id}`}
                          >
                            <i className="fa-solid fa-trash-can"></i> Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {/* Register Vehicle Modal */}
      {isAddModalOpen && (
        <div className="gm-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="gm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="gm-modal-header">
              <h3><i className="fa-solid fa-car-side"></i> Register Authorized Plate</h3>
              <button className="gm-close-modal" onClick={() => setIsAddModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleAddVehicleSubmit}>
              <div className="gm-modal-body">
                <div className="gm-form-group">
                  <label htmlFor="reg-plate">Plate Number *</label>
                  <input 
                    id="reg-plate" 
                    type="text" 
                    placeholder="e.g. ABC-1234 or 1234 XYZ" 
                    required
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                  />
                  <small className="help-text">Plate numbers are automatically capitalized and normalized.</small>
                </div>
                
                <div className="gm-form-group checkbox-group">
                  <label className="switch-container">
                    <input 
                      type="checkbox" 
                      checked={newIsAuthorized}
                      onChange={(e) => setNewIsAuthorized(e.target.checked)}
                    />
                    <span className="switch-slider"></span>
                  </label>
                  <div className="switch-label-details">
                    <span>Instantly Authorize Plate</span>
                    <p>Enabling this will immediately greenlight gate entry sensors for this plate.</p>
                  </div>
                </div>
              </div>
              <div className="gm-modal-footer">
                <button type="button" className="gm-btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="gm-btn-submit" disabled={submitting}>
                  {submitting ? <><span className="mini-spinner"></span> Registering...</> : 'Save Plate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
