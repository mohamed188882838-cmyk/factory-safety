import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateUser, logoutUser } from '../../services/api';
import './AccountSettings.css';

export default function AccountSettings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({
    id: null,
    name: 'Loading...',
    email: 'Loading...',
    role: 'Loading...',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState({ name: '', role: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user details from API
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError('');
      try {
        const response = await getProfile();
        const profile = response?.data || response || {};
        
        const userData = {
          id: profile.id,
          name: profile.name || 'Unknown User',
          email: profile.email || '',
          role: profile.role || 'Supervisor',
          avatar: profile.avatar ? (profile.avatar.startsWith('http') ? profile.avatar : `http://178.16.131.178/storage/${profile.avatar}`) : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('userUpdated'));
      } catch (err) {
        setError(err.message || 'Failed to load profile data');
        // Fallback to local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setUser({
              id: parsed.id,
              name: parsed.name || 'Unknown User',
              email: parsed.email || '',
              role: parsed.role || 'Supervisor',
              avatar: parsed.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
            });
          } catch (e) {
            console.error(e);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size is too large! Please choose an image smaller than 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;
        const updatedUser = { ...user, avatar: base64Data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        window.dispatchEvent(new Event('userUpdated'));
        alert('Profile picture updated successfully! (Note: Not saved to server yet)');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEdit = () => {
    setTempUser({
      name: user.name,
      role: user.role,
      email: user.email
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!tempUser.name.trim() || !tempUser.role.trim() || !tempUser.email.trim()) {
      alert('Fields cannot be empty!');
      return;
    }

    try {
      if (user.id) {
        await updateUser(user.id, {
          name: tempUser.name.trim(),
          role: tempUser.role.trim(),
          email: tempUser.email.trim(),
        });
      }

      const updatedUser = {
        ...user,
        name: tempUser.name.trim(),
        role: tempUser.role.trim(),
        email: tempUser.email.trim()
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      window.dispatchEvent(new Event('userUpdated'));
      setIsEditing(false);
      alert('Profile details updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    }
  };

  const handleItemClick = (label) => {
    alert(`Opening: ${label}`);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logoutUser();
      } catch (err) {
        console.error('Logout API failed, forcing local logout', err);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
      navigate('/login');
    }
  };

  return (
    <div className="settings-page-wrapper">
      <div className="container">
        {/* Main Content */}
        <main className="main-content">
          <header>
            <div className="header-left">
              <h1>Account Settings</h1>
            </div>
            <div className="header-right">
              <span className="admin-access">{user.role === 'admin' ? 'Admin Access' : 'Supervisor Access'}</span>
              <div className="notification-icon" onClick={() => alert("No new notifications")}>
                <i className="far fa-bell"></i>
                <span className="dot"></span>
              </div>
            </div>
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

          <div className="settings-container">
            {/* Profile Card */}
            <section className="profile-card">
              <div className="profile-header">
                <div className="avatar-wrapper" onClick={handleAvatarClick} title="Click to upload profile photo">
                  <img src={user.avatar} alt={user.name} />
                  <div className="camera-icon"><i className="fas fa-camera"></i></div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleAvatarChange}
                />

                {!isEditing ? (
                  <div className="profile-info">
                    <h2>{loading ? 'Loading...' : user.name}</h2>
                    <p>{loading ? '...' : `${user.role} • ${user.email}`}</p>
                    <div className="profile-actions">
                      <button className="btn-edit" onClick={handleStartEdit} disabled={loading}>
                        <i className="fas fa-edit"></i> Edit Profile
                      </button>
                      <button className="btn-secondary" onClick={() => alert(`Your ID Badge Number: ID-${user.name.length * 123}`)} disabled={loading}>
                        View ID Badge
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="profile-info-form" onSubmit={handleSaveProfile}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={tempUser.name}
                          onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Job Title / Role</label>
                        <input
                          type="text"
                          value={tempUser.role}
                          onChange={(e) => setTempUser({ ...tempUser, role: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          value={tempUser.email}
                          onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="profile-actions-edit">
                      <button type="submit" className="btn-save">Save Changes</button>
                      <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            </section>

            {/* Settings Sections */}
            <div className="settings-sections">
              {/* Personal Information */}
              <section className="settings-group">
                <h3>PERSONAL INFORMATION</h3>
                <div className="settings-list">
                  <div className="settings-item" onClick={handleStartEdit}>
                    <div className="item-left">
                      <div className="icon-box blue"><i className="far fa-user"></i></div>
                      <span className="item-label">User Details</span>
                    </div>
                    <div className="item-right">
                      <span className="item-value">{user.name}</span>
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>

                  <div className="settings-item" onClick={() => handleItemClick('Department')}>
                    <div className="item-left">
                      <div className="icon-box blue"><i className="fas fa-shield-alt"></i></div>
                      <span className="item-label">Department</span>
                    </div>
                    <div className="item-right">
                      <span className="item-value">Safety & Compliance</span>
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>
                </div>
              </section>

              {/* Application Preferences */}
              <section className="settings-group">
                <h3>APPLICATION PREFERENCES</h3>
                <div className="settings-list">
                  <div className="settings-item" onClick={() => handleItemClick('Language')}>
                    <div className="item-left">
                      <div className="icon-box blue"><i className="fas fa-globe"></i></div>
                      <span className="item-label">Language</span>
                    </div>
                    <div className="item-right">
                      <span className="item-value">English</span>
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>

                  <div className="settings-item" onClick={() => handleItemClick('Push Notifications')}>
                    <div className="item-left">
                      <div className="icon-box blue"><i className="far fa-bell"></i></div>
                      <span className="item-label">Push Notifications</span>
                    </div>
                    <div className="item-right">
                      <span className="item-value">Enabled</span>
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>

                  <div className="settings-item" onClick={() => handleItemClick('Dark Mode')}>
                    <div className="item-left">
                      <div className="icon-box blue"><i className="fas fa-moon"></i></div>
                      <span className="item-label">Dark Mode</span>
                    </div>
                    <div className="item-right">
                      <span className="item-value">System Default</span>
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>
                </div>
              </section>

              {/* Security & Compliance */}
              <section className="settings-group">
                <h3>SECURITY & COMPLIANCE</h3>
                <div className="settings-list">
                  <div className="settings-item" onClick={() => handleItemClick('Change Password')}>
                    <div className="item-left">
                      <div className="icon-box blue"><i className="fas fa-lock"></i></div>
                      <span className="item-label">Change Password</span>
                    </div>
                    <div className="item-right">
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>

                  <div className="settings-item" onClick={() => handleItemClick('Privacy Policy')}>
                    <div className="item-left">
                      <div className="icon-box blue"><i className="fas fa-info-circle"></i></div>
                      <span className="item-label">Privacy Policy</span>
                    </div>
                    <div className="item-right">
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>

                  <div className="settings-item" onClick={() => handleItemClick('Help & Support')}>
                    <div className="item-left">
                      <div className="icon-box blue"><i className="fas fa-question-circle"></i></div>
                      <span className="item-label">Help & Support</span>
                    </div>
                    <div className="item-right">
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>
                </div>
              </section>

              {/* Logout */}
              <div className="logout-section">
                <button className="btn-logout" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  Logout Session
                </button>
              </div>
            </div>
          </div>

          <div className="app-info">
            Industrial Safety Supervisor v2.4.0 • Built for Secure Factory Operations
          </div>

          <footer>
            <span>© 2024 Industrial Safety Supervisor Inc.</span>
            <div className="footer-links">
              <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Security Standards</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
