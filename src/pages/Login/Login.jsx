import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    // Simulate navigation to dashboard
    navigate('/dashboard');
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

          <button type="submit" className="login-btn">
            Sign In to Supervisor Console
            <i class="fa-solid fa-arrow-right"></i>
          </button>

          <div className="divider"></div>

          <p className="signup-text">
            New to the platform?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Create an account</a>
          </p>
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
