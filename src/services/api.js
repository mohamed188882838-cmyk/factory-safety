// ============================================
// Factory-Safety API Service Layer
// ============================================
// All API calls go through the Vite proxy (/api → backend).
// Auth token is stored in localStorage and auto-attached.

const API_BASE = '/api';

// ------------------------------------------
// Helper: get stored auth token
// ------------------------------------------
function getToken() {
  return localStorage.getItem('auth_token') || '';
}

// ------------------------------------------
// Helper: build headers
// ------------------------------------------
function buildHeaders(withAuth = true, isJson = false) {
  const headers = {
    'Accept': 'application/json',
  };
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (withAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

// ------------------------------------------
// Helper: generic fetch wrapper
// ------------------------------------------
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, options);

  // Handle 401 → redirect to login
  if (res.status === 401) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized – session expired');
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

// ============================================
// AUTH
// ============================================

export async function loginUser(email, password) {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  const data = await apiFetch('/login', {
    method: 'POST',
    headers: buildHeaders(false),
    body: formData,
  });

  // Store token & user info
  // API wraps the payload inside data.data
  const payload = data?.data ?? data;
  if (payload?.token) {
    localStorage.setItem('auth_token', payload.token);
  }
  if (payload?.user) {
    localStorage.setItem('user', JSON.stringify(payload.user));
    window.dispatchEvent(new Event('userUpdated'));
  }

  return data;
}

export async function logoutUser() {
  const data = await apiFetch('/logout', {
    method: 'POST',
    headers: buildHeaders(true),
  });
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('userUpdated'));
  return data;
}

export async function getProfile() {
  return apiFetch('/profile', {
    method: 'GET',
    headers: buildHeaders(true),
  });
}

// ============================================
// DASHBOARD
// ============================================

export async function getDashboard() {
  return apiFetch('/dashboard', {
    method: 'GET',
    headers: buildHeaders(true),
  });
}

// ============================================
// PPE (PEE) LOGS — Helmet & Vest
// ============================================

export async function getAllPeeLogs() {
  return apiFetch('/pee-log/all', {
    method: 'GET',
    headers: buildHeaders(true),
  });
}

export async function getPeeLog(id) {
  return apiFetch(`/pee-log/${id}`, {
    method: 'GET',
    headers: buildHeaders(true),
  });
}

export async function createPeeLog(formData) {
  return apiFetch('/pee-log', {
    method: 'POST',
    headers: buildHeaders(true),
    body: formData,
  });
}

// ============================================
// VEHICLE LOGS
// ============================================

export async function getAllVehicleLogs() {
  return apiFetch('/vehicle-log/all', {
    method: 'GET',
    headers: buildHeaders(true),
  });
}

export async function getVehicleLog(id) {
  return apiFetch(`/vehicle-log/${id}`, {
    method: 'GET',
    headers: buildHeaders(true),
  });
}

export async function createVehicleLog(formData) {
  return apiFetch('/vehicle-log', {
    method: 'POST',
    headers: buildHeaders(true),
    body: formData,
  });
}

// ============================================
// ADMIN VEHICLES
// ============================================

export async function getAllVehicles() {
  return apiFetch('/vehicles', {
    method: 'GET',
    headers: buildHeaders(true),
  });
}

export async function createVehicle(formData) {
  return apiFetch('/vehicles', {
    method: 'POST',
    headers: buildHeaders(true),
    body: formData,
  });
}

export async function updateVehicle(id, data) {
  return apiFetch(`/vehicles/${id}`, {
    method: 'PUT',
    headers: buildHeaders(true, true),
    body: JSON.stringify(data),
  });
}

export async function deleteVehicle(id) {
  return apiFetch(`/vehicles/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(true),
  });
}

export async function getAuthorizedVehicles() {
  return apiFetch('/vehicles/authorized', {
    method: 'GET',
    headers: buildHeaders(true),
  });
}

export async function getUnauthorizedVehicles() {
  return apiFetch('/vehicles/unauthorized', {
    method: 'GET',
    headers: buildHeaders(true),
  });
}

// ============================================
// REPORTS
// ============================================

export async function getReport() {
  return apiFetch('/report', {
    method: 'GET',
    headers: buildHeaders(true),
  });
}

// ============================================
// USER MANAGEMENT
// ============================================

export async function getUsers() {
  return apiFetch('/users', {
    method: 'GET',
    headers: buildHeaders(true),
  });
}

export async function getUser(id) {
  return apiFetch(`/users/${id}`, {
    method: 'GET',
    headers: buildHeaders(true),
  });
}

export async function addUser(formData) {
  return apiFetch('/add/user', {
    method: 'POST',
    headers: buildHeaders(true),
    body: formData,
  });
}

export async function updateUser(id, data) {
  return apiFetch(`/users/${id}`, {
    method: 'PUT',
    headers: buildHeaders(true, true),
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id) {
  return apiFetch(`/users/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(true),
  });
}

// ============================================
// FIRE LOGS
// ============================================

export async function getAllFireLogs() {
  return apiFetch('/fire-logs', {
    method: 'GET',
    headers: buildHeaders(true),
  });
}

export async function getFireLog(id) {
  return apiFetch(`/fire-logs/${id}`, {
    method: 'GET',
    headers: buildHeaders(true),
  });
}

export async function createFireLog(formData) {
  return apiFetch('/fire-log', {
    method: 'POST',
    headers: buildHeaders(true),
    body: formData,
  });
}
