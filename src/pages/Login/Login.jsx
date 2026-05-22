import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';
import './Login.css';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Background Shapes */}
      <div className="bg-shield top"></div>
      <div className="bg-shield bottom"></div>

      <div className="container">
        {/* Logo */}
        <div className="logo-box">
          <div className="logo">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h1>Supervisor Login</h1>
          <p>Access your industrial safety dashboard</p>
        </div>

        {/* Login Card */}
        <form className="login-card" onSubmit={handleSignIn}>
          {error && (
            <div className="error-message" style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '16px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-box">
              <i className="fa-regular fa-envelope"></i>
              <input
                type="email"
                placeholder="supervisor@factory.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="input-group">
            <div className="label-row">
              <label>Password</label>
              <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
            </div>

            <div className="input-box">
              <i className="fa-solid fa-lock"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <i
                className={`fa-regular eye ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          <div className="remember">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember this device for 30 days</label>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Signing In...
              </>
            ) : (
              <>
                Sign In to Supervisor Console
                <i className="fa-solid fa-arrow-right"></i>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="footer">
          <span>COMPLIANCE VERIFIED SYSTEM</span>
          <div className="footer-icons">
            <div className="small-icon"></div>
            <div className="small-icon active"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
