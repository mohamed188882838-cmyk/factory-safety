import React, { useState, useEffect } from 'react';
import { getUsers, addUser, updateUser, deleteUser } from '../../services/api';
import './UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Form States
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  
  const [editingUser, setEditingUser] = useState({
    id: null,
    name: '',
    email: '',
    role: 'user'
  });

  const [submitting, setSubmitting] = useState(false);

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getUsers();
      // Handle different API response shapes (array, object.data, object.users, etc.)
      const fetchedUsers = response?.data || response?.users || (Array.isArray(response) ? response : []);
      setUsers(fetchedUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.message || 'Failed to load user directory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Add User
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      alert('All fields are required!');
      return;
    }
    
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', newUser.name.trim());
      formData.append('email', newUser.email.trim());
      formData.append('password', newUser.password);
      formData.append('role', newUser.role);

      await addUser(formData);
      alert('User added successfully!');
      setIsAddModalOpen(false);
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to add user');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Edit User
  const handleEditClick = (user) => {
    setEditingUser({
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user'
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser.name.trim() || !editingUser.email.trim()) {
      alert('Name and Email are required!');
      return;
    }

    setSubmitting(true);
    try {
      await updateUser(editingUser.id, {
        name: editingUser.name.trim(),
        email: editingUser.email.trim(),
        role: editingUser.role
      });
      alert('User updated successfully!');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete User
  const handleDeleteClick = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) {
      try {
        await deleteUser(id);
        alert('User deleted successfully!');
        fetchUsers();
      } catch (err) {
        alert(err.message || 'Failed to delete user');
      }
    }
  };

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const term = searchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.role && u.role.toLowerCase().includes(term))
    );
  });

  const totalUsersCount = users.length;
  const adminCount = users.filter(u => u.role?.toLowerCase() === 'admin').length;
  const standardCount = totalUsersCount - adminCount;

  return (
    <div className="user-management-page">
      {/* Header Banner */}
      <div className="um-header">
        <div className="um-title-section">
          <h1>User Directory &amp; Access Control</h1>
          <p>Manage administrator roles, safety supervisors, and system monitor credentials</p>
        </div>
        <button className="add-user-btn" onClick={() => setIsAddModalOpen(true)} id="add-user-trigger">
          <i className="fa-solid fa-user-plus"></i> Add New User
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="um-stats-row">
        <div className="um-stat-card">
          <div className="stat-icon-wrapper blue">
            <i className="fa-solid fa-users"></i>
          </div>
          <div className="stat-details">
            <h3>{loading ? '...' : totalUsersCount}</h3>
            <p>Total Registered</p>
          </div>
        </div>
        <div className="um-stat-card">
          <div className="stat-icon-wrapper purple">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <div className="stat-details">
            <h3>{loading ? '...' : adminCount}</h3>
            <p>Admin Administrators</p>
          </div>
        </div>
        <div className="um-stat-card">
          <div className="stat-icon-wrapper green">
            <i className="fa-solid fa-user-group"></i>
          </div>
          <div className="stat-details">
            <h3>{loading ? '...' : standardCount}</h3>
            <p>Safety Operators</p>
          </div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="um-filter-bar">
        <div className="um-search-wrapper">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Search by name, email, or system role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="um-search-input"
            id="um-user-search"
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
        <button className="refresh-btn" onClick={fetchUsers} disabled={loading} title="Refresh Directory">
          <i className={`fa-solid fa-arrows-rotate ${loading ? 'fa-spin' : ''}`}></i>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="um-content-container">
        {loading ? (
          <div className="um-loading-state">
            <div className="spinner"></div>
            <p>Loading security clearance directory...</p>
          </div>
        ) : error ? (
          <div className="um-error-state">
            <i className="fa-solid fa-circle-exclamation error-icon"></i>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchUsers}>Try Again</button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="um-empty-state">
            <i className="fa-solid fa-users-slash empty-icon"></i>
            <h3>No Clearance Records Found</h3>
            <p>{searchQuery ? 'Try adjusting your search terms' : 'Add users to grant safety system authorization'}</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="um-table">
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Email Address</th>
                  <th>System Clearence</th>
                  <th className="text-right">Management Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const initials = u.name ? u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
                  const roleLower = u.role?.toLowerCase() || 'user';
                  const isAdmin = roleLower === 'admin';
                  
                  return (
                    <tr key={u.id} className="um-table-row">
                      <td>
                        <div className="um-profile-cell">
                          <div className={`um-avatar-circle ${isAdmin ? 'admin-theme' : 'user-theme'}`}>
                            {u.avatar ? (
                              <img src={u.avatar.startsWith('http') ? u.avatar : `http://178.16.131.178/storage/${u.avatar}`} alt={u.name} onError={(e) => {e.target.style.display='none';}} />
                            ) : null}
                            <span>{initials}</span>
                          </div>
                          <div className="um-profile-info">
                            <span className="um-user-name">{u.name || 'Anonymous User'}</span>
                            <span className="um-user-id">UID: {u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="um-user-email">{u.email}</span>
                      </td>
                      <td>
                        <span className={`role-badge ${roleLower}`}>
                          <i className={isAdmin ? "fa-solid fa-user-shield" : "fa-solid fa-user"}></i>
                          {u.role ? u.role.toUpperCase() : 'USER'}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="action-buttons-group">
                          <button
                            className="btn-action edit"
                            onClick={() => handleEditClick(u)}
                            title="Edit Clearance Level"
                            id={`edit-user-${u.id}`}
                          >
                            <i className="fa-solid fa-user-pen"></i> Edit
                          </button>
                          <button
                            className="btn-action delete"
                            onClick={() => handleDeleteClick(u.id, u.name)}
                            title="Revoke Clearances & Delete"
                            id={`delete-user-${u.id}`}
                          >
                            <i className="fa-solid fa-user-xmark"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="um-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="um-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="um-modal-header">
              <h3><i className="fa-solid fa-user-plus"></i> Add Authorized User</h3>
              <button className="close-modal" onClick={() => setIsAddModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="um-modal-body">
                <div className="form-group">
                  <label htmlFor="add-name">Full Name</label>
                  <input
                    id="add-name"
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="add-email">Email Address</label>
                  <input
                    id="add-email"
                    type="email"
                    required
                    placeholder="e.g. john@factory-safety.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="add-password">System Password</label>
                  <input
                    id="add-password"
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="add-role">System Clearance Role</label>
                  <select
                    id="add-role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="user">Safety Operator (User)</option>
                    <option value="admin">System Administrator (Admin)</option>
                  </select>
                </div>
              </div>
              <div className="um-modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? <><span className="mini-spinner"></span> Authorizing...</> : 'Save Authorization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="um-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="um-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="um-modal-header">
              <h3><i className="fa-solid fa-user-pen"></i> Edit User Access Clearance</h3>
              <button className="close-modal" onClick={() => setIsEditModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="um-modal-body">
                <div className="form-group">
                  <label htmlFor="edit-name">Full Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    required
                    placeholder="Full name"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-email">Email Address</label>
                  <input
                    id="edit-email"
                    type="email"
                    required
                    placeholder="Email address"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-role">System Clearance Role</label>
                  <select
                    id="edit-role"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  >
                    <option value="user">Safety Operator (User)</option>
                    <option value="admin">System Administrator (Admin)</option>
                  </select>
                </div>
              </div>
              <div className="um-modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? <><span className="mini-spinner"></span> Saving...</> : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
