import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Floor Supervisor');
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'); // default avatar
  
  const navigate = useNavigate();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Save user info to localStorage
    const newUser = {
      name: fullName,
      email: email,
      role: role,
      avatar: avatarPreview
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Trigger custom event to notify Sidebar (if open/listening)
    window.dispatchEvent(new Event('userUpdated'));

    alert("Account created successfully!");
    navigate('/dashboard');
  };

  return (
    <div className="register-page-wrapper">
      {/* Background Shapes */}
      <div className="bg-shield top"></div>
      <div className="bg-shield bottom"></div>

      <div className="container">
        {/* Logo */}
        <div className="logo-box">
          <div className="logo">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h1>Create Account</h1>
          <p>Register as a Supervisor to access the dashboard</p>
        </div>

        {/* Register Card */}
        <form className="register-card" onSubmit={handleSignUp}>
          
          {/* Avatar Upload (Premium interactive Circle) */}
          <div className="avatar-upload-section">
            <div className="avatar-preview-container">
              <img src={avatarPreview} alt="Avatar Preview" />
              <label htmlFor="avatar-file-input" className="camera-btn">
                <i className="fa-solid fa-camera"></i>
              </label>
            </div>
            <input 
              id="avatar-file-input" 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarChange} 
              style={{ display: 'none' }}
            />
            <p className="avatar-tip">Click the camera icon to upload your profile picture</p>
          </div>

          <div className="input-group">
            <label>Full Name</label>
            <div className="input-box">
              <i className="fa-regular fa-user"></i>
              <input
                type="text"
                placeholder="Marcus Chen"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

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
            <label>Job Title / Role</label>
            <div className="input-box">
              <i className="fa-solid fa-briefcase"></i>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ 
                  border: 'none', 
                  outline: 'none', 
                  width: '100%', 
                  fontSize: '16px', 
                  background: 'transparent',
                  cursor: 'pointer' 
                }}
              >
                <option value="Floor Supervisor">Floor Supervisor</option>
                <option value="Senior Safety Supervisor">Senior Safety Supervisor</option>
                <option value="Plant Supervisor">Plant Supervisor</option>
                <option value="Safety & Compliance Officer">Safety & Compliance Officer</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
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

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="input-box">
              <i className="fa-solid fa-lock"></i>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <i
                className={`fa-regular eye ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          <div className="terms">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()}>Safety Code of Conduct</a>.
            </label>
          </div>

          <button type="submit" className="register-btn">
            Create Supervisor Account
            <i className="fa-solid fa-user-plus"></i>
          </button>

          <div className="divider"></div>

          <p className="login-link-text">
            Already have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Sign In</a>
          </p>
        </form>

        {/* Footer */}
        <div className="footer">
          <span>COMPLIANCE VERIFIED SYSTEM</span>
        </div>
      </div>
    </div>
  );
}
