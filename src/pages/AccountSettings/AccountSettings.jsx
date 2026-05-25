import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateUser, logoutUser } from '../../services/api';
import './AccountSettings.css';

// ─── Modals ────────────────────────────────────────────────────────────────────

function LanguageModal({ onClose }) {
  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
  ];
  const [selected, setSelected] = useState('en');
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-wrap lang-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <div>
            <h2 className="modal-title">Language</h2>
            <p className="modal-subtitle">Choose your preferred display language</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="lang-list">
          {languages.map(l => (
            <button
              key={l.code}
              className={`lang-item${selected === l.code ? ' selected' : ''}`}
              onClick={() => setSelected(l.code)}
            >
              <span className="lang-flag">{l.flag}</span>
              <span className="lang-label">{l.label}</span>
              {selected === l.code && (
                <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn-modal-save" onClick={onClose}>Save Language</button>
        </div>
      </div>
    </div>
  );
}

function NotificationsModal({ onClose }) {
  const [settings, setSettings] = useState({
    safety: true,
    fire: true,
    helmet: false,
    system: true,
    email: false,
  });
  const toggle = key => setSettings(p => ({ ...p, [key]: !p[key] }));
  const items = [
    { key: 'safety', label: 'Safety Alerts', desc: 'Critical hazard warnings' },
    { key: 'fire', label: 'Fire Detection', desc: 'Fire & smoke alerts' },
    { key: 'helmet', label: 'Helmet Violations', desc: 'PPE non-compliance' },
    { key: 'system', label: 'System Updates', desc: 'App & firmware updates' },
    { key: 'email', label: 'Email Digest', desc: 'Daily summary via email' },
  ];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-wrap notif-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <div>
            <h2 className="modal-title">Push Notifications</h2>
            <p className="modal-subtitle">Manage what alerts you receive</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="notif-list">
          {items.map(item => (
            <div key={item.key} className="notif-row">
              <div>
                <p className="notif-label">{item.label}</p>
                <p className="notif-desc">{item.desc}</p>
              </div>
              <button
                className={`toggle-btn${settings[item.key] ? ' on' : ''}`}
                onClick={() => toggle(item.key)}
                aria-label={item.label}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn-modal-save" onClick={onClose}>Save Preferences</button>
        </div>
      </div>
    </div>
  );
}

function DarkModeModal({ onClose }) {
  const [mode, setMode] = useState('system');
  const options = [
    { value: 'light', label: 'Light', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    )},
    { value: 'dark', label: 'Dark', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    )},
    { value: 'system', label: 'System Default', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    )},
  ];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-wrap dark-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </div>
          <div>
            <h2 className="modal-title">Dark Mode</h2>
            <p className="modal-subtitle">Choose your interface appearance</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="theme-options">
          {options.map(opt => (
            <button
              key={opt.value}
              className={`theme-card${mode === opt.value ? ' active' : ''}`}
              onClick={() => setMode(opt.value)}
            >
              <div className="theme-card-icon">{opt.icon}</div>
              <span>{opt.label}</span>
              {mode === opt.value && <div className="theme-check">✓</div>}
            </button>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn-modal-save" onClick={onClose}>Apply Theme</button>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [strength, setStrength] = useState(0);

  const calcStrength = (val) => {
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    return s;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.newPass !== form.confirm) { alert('Passwords do not match!'); return; }
    if (form.newPass.length < 8) { alert('Password must be at least 8 characters.'); return; }
    alert('Password changed successfully!');
    onClose();
  };

  const EyeIcon = ({ show, toggle }) => (
    <button type="button" className="eye-btn" onClick={toggle}>
      {show ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )}
    </button>
  );

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-wrap lock-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div>
            <h2 className="modal-title">Change Password</h2>
            <p className="modal-subtitle">Keep your account secure</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="pw-form">
          <div className="pw-field">
            <label>Current Password</label>
            <div className="pw-input-wrap">
              <input
                type={showCurrent ? 'text' : 'password'}
                placeholder="Enter current password"
                value={form.current}
                onChange={e => setForm({ ...form, current: e.target.value })}
                required
              />
              <EyeIcon show={showCurrent} toggle={() => setShowCurrent(!showCurrent)} />
            </div>
          </div>
          <div className="pw-field">
            <label>New Password</label>
            <div className="pw-input-wrap">
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="Enter new password"
                value={form.newPass}
                onChange={e => { setForm({ ...form, newPass: e.target.value }); setStrength(calcStrength(e.target.value)); }}
                required
              />
              <EyeIcon show={showNew} toggle={() => setShowNew(!showNew)} />
            </div>
            {form.newPass && (
              <div className="strength-bar-wrap">
                <div className="strength-bars">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="strength-seg" style={{ background: i <= strength ? strengthColors[strength] : '#e2e8f0' }} />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
              </div>
            )}
          </div>
          <div className="pw-field">
            <label>Confirm New Password</label>
            <div className="pw-input-wrap">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                required
              />
              <EyeIcon show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-modal-save">Update Password</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PrivacyPolicyModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-wrap privacy-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <h2 className="modal-title">Privacy Policy</h2>
            <p className="modal-subtitle">Last updated: May 2024</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="privacy-content">
          <div className="privacy-section">
            <h4>🔐 Data Collection</h4>
            <p>We collect only the data necessary to operate the Factory Safety platform, including camera feeds, safety logs, and user activity within the system.</p>
          </div>
          <div className="privacy-section">
            <h4>📊 How We Use Your Data</h4>
            <p>Your data is used exclusively for safety monitoring, compliance reporting, and improving detection accuracy. We never sell or share your data with third parties.</p>
          </div>
          <div className="privacy-section">
            <h4>🛡️ Data Security</h4>
            <p>All data is encrypted in transit and at rest using industry-standard AES-256 encryption. Access is restricted to authorized personnel only.</p>
          </div>
          <div className="privacy-section">
            <h4>🗑️ Data Retention</h4>
            <p>Safety incident recordings are stored for 90 days. Account data is retained as long as your account is active. You may request deletion at any time.</p>
          </div>
          <div className="privacy-section">
            <h4>📬 Contact</h4>
            <p>For privacy concerns, contact our Data Protection Officer at <strong>privacy@factorysafety.io</strong></p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-modal-save" onClick={onClose}>I Understand</button>
        </div>
      </div>
    </div>
  );
}

function HelpSupportModal({ onClose }) {
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    { q: 'How do I reset my password?', a: 'Go to Settings → Change Password. Enter your current password, then set a new one with at least 8 characters.' },
    { q: 'Why is the camera feed not showing?', a: 'Check your network connection and ensure the camera is powered on. Try refreshing the page or contacting your system administrator.' },
    { q: 'How do I add a new camera zone?', a: 'Navigate to the Zone Management section from the dashboard and click "Add Zone". Follow the on-screen instructions.' },
    { q: 'What do the alert colors mean?', a: 'Red = Critical / immediate action needed. Orange = Warning. Green = Safe / normal operation.' },
  ];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-wrap help-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <h2 className="modal-title">Help &amp; Support</h2>
            <p className="modal-subtitle">We're here to help you</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="help-content">
          <div className="help-contacts">
            <a href="mailto:support@factorysafety.io" className="help-card">
              <span className="help-card-icon">📧</span>
              <span>support@factorysafety.io</span>
            </a>
            <a href="tel:+201000000000" className="help-card">
              <span className="help-card-icon">📞</span>
              <span>+20 100 000 0000</span>
            </a>
          </div>
          <h4 className="faq-title">Frequently Asked Questions</h4>
          {faqs.map((f, i) => (
            <div key={i} className="faq-item">
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span>
                <svg className={`faq-arrow${openFaq === i ? ' open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {openFaq === i && <p className="faq-a">{f.a}</p>}
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn-modal-save" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

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

  // Modal state
  const [activeModal, setActiveModal] = useState(null); // 'language' | 'notifications' | 'darkmode' | 'password' | 'privacy' | 'help'

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
          avatar: profile.avatar
            ? (profile.avatar.startsWith('http') ? profile.avatar : `http://178.16.131.178/storage/${profile.avatar}`)
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('userUpdated'));
      } catch (err) {
        setError(err.message || 'Failed to load profile data');
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
          } catch (e) { console.error(e); }
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleAvatarClick = () => { if (fileInputRef.current) fileInputRef.current.click(); };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Image size is too large! Please choose an image smaller than 2MB.'); return; }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target.result;
      const updatedUser = { ...user, avatar: base64Data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('userUpdated'));
      alert('Profile picture updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleStartEdit = () => {
    setTempUser({ name: user.name, role: user.role, email: user.email });
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!tempUser.name.trim() || !tempUser.role.trim() || !tempUser.email.trim()) { alert('Fields cannot be empty!'); return; }
    try {
      if (user.id) await updateUser(user.id, { name: tempUser.name.trim(), role: tempUser.role.trim(), email: tempUser.email.trim() });
      const updatedUser = { ...user, name: tempUser.name.trim(), role: tempUser.role.trim(), email: tempUser.email.trim() };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('userUpdated'));
      setIsEditing(false);
      alert('Profile details updated successfully!');
    } catch (err) { alert(err.message || 'Failed to update profile'); }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try { await logoutUser(); } catch (err) {
        console.error('Logout API failed, forcing local logout', err);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
      navigate('/login');
    }
  };

  const open = (modal) => setActiveModal(modal);
  const close = () => setActiveModal(null);

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="settings-page-wrapper">
      {/* Modals */}
      {activeModal === 'language'      && <LanguageModal       onClose={close} />}
      {activeModal === 'notifications' && <NotificationsModal  onClose={close} />}
      {activeModal === 'darkmode'      && <DarkModeModal       onClose={close} />}
      {activeModal === 'password'      && <ChangePasswordModal onClose={close} />}
      {activeModal === 'privacy'       && <PrivacyPolicyModal  onClose={close} />}
      {activeModal === 'help'          && <HelpSupportModal    onClose={close} />}

      <div className="container">
        <main className="main-content">
          <header>
            <div className="header-left">
              <h1>Account Settings</h1>
            </div>
            <div className="header-right">
              <span className="admin-access">{user.role === 'admin' ? 'Admin Access' : 'Supervisor Access'}</span>
              <div className="notification-icon" onClick={() => open('notifications')}>
                <i className="far fa-bell"></i>
                <span className="dot"></span>
              </div>
            </div>
          </header>

          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#ef4444', padding:'12px 16px', borderRadius:'12px', margin:'0 0 16px', fontSize:'14px' }}>
              <i className="fa-solid fa-circle-exclamation"></i> {error}
            </div>
          )}

          <div className="settings-container">
            {/* ── Profile Card ── */}
            <section className="profile-card">
              <div className="profile-header">
                <div className="avatar-wrapper" onClick={handleAvatarClick} title="Click to upload profile photo">
                  <img src={user.avatar} alt={user.name} />
                  <div className="camera-icon"><i className="fas fa-camera"></i></div>
                </div>
                <input type="file" ref={fileInputRef} style={{ display:'none' }} accept="image/*" onChange={handleAvatarChange} />

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
                        <input type="text" value={tempUser.name} onChange={e => setTempUser({ ...tempUser, name: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label>Job Title / Role</label>
                        <input type="text" value={tempUser.role} onChange={e => setTempUser({ ...tempUser, role: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={tempUser.email} onChange={e => setTempUser({ ...tempUser, email: e.target.value })} required />
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

            {/* ── Settings Sections ── */}
            <div className="settings-sections">

              {/* Personal Information */}
              <section className="settings-group">
                <h3>PERSONAL INFORMATION</h3>
                <div className="settings-list">
                  <div className="settings-item" onClick={handleStartEdit}>
                    <div className="item-left">
                      <div className="icon-box blue">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                      <span className="item-label">User Details</span>
                    </div>
                    <div className="item-right">
                      <span className="item-value">{user.name}</span>
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>

                  <div className="settings-item" onClick={() => alert('Department: Safety & Compliance')}>
                    <div className="item-left">
                      <div className="icon-box blue">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                      </div>
                      <span className="item-label">Department</span>
                    </div>
                    <div className="item-right">
                      <span className="item-value">Safety &amp; Compliance</span>
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>
                </div>
              </section>

              {/* Application Preferences */}
              <section className="settings-group">
                <h3>APPLICATION PREFERENCES</h3>
                <div className="settings-list">

                  {/* Language */}
                  <div className="settings-item" onClick={() => open('language')}>
                    <div className="item-left">
                      <div className="icon-box green">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="2" y1="12" x2="22" y2="12"/>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                      </div>
                      <span className="item-label">Language</span>
                    </div>
                    <div className="item-right">
                      <span className="item-value">English</span>
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div className="settings-item" onClick={() => open('notifications')}>
                    <div className="item-left">
                      <div className="icon-box orange">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                      </div>
                      <span className="item-label">Push Notifications</span>
                    </div>
                    <div className="item-right">
                      <span className="item-value item-enabled">Enabled</span>
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>

                  {/* Dark Mode */}
                  <div className="settings-item" onClick={() => open('darkmode')}>
                    <div className="item-left">
                      <div className="icon-box purple">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                      </div>
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
                <h3>SECURITY &amp; COMPLIANCE</h3>
                <div className="settings-list">

                  {/* Change Password */}
                  <div className="settings-item" onClick={() => open('password')}>
                    <div className="item-left">
                      <div className="icon-box red">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </div>
                      <span className="item-label">Change Password</span>
                    </div>
                    <div className="item-right">
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>

                  {/* Privacy Policy */}
                  <div className="settings-item" onClick={() => open('privacy')}>
                    <div className="item-left">
                      <div className="icon-box teal">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                      </div>
                      <span className="item-label">Privacy Policy</span>
                    </div>
                    <div className="item-right">
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>

                  {/* Help & Support */}
                  <div className="settings-item" onClick={() => open('help')}>
                    <div className="item-left">
                      <div className="icon-box indigo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      </div>
                      <span className="item-label">Help &amp; Support</span>
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
              <a href="#" onClick={e => e.preventDefault()}>Terms of Service</a>
              <a href="#" onClick={e => e.preventDefault()}>Security Standards</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
