const API_BASE = import.meta.env.VITE_API_URL || 'http://ec2-18-189-27-180.us-east-2.compute.amazonaws.com:3001/api';

export function getToken() {
  return localStorage.getItem('chargeos_token');
}

export function setToken(token) {
  localStorage.setItem('chargeos_token', token);
}

export function clearToken() {
  localStorage.removeItem('chargeos_token');
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('chargeos_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  localStorage.setItem('chargeos_user', JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem('chargeos_user');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401) {
    clearToken();
    clearStoredUser();
    window.location.reload();
    throw new Error('Session expired');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// ── Auth ──────────────────────────────────────────────────────

export async function login(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  setToken(data.token);
  setStoredUser(data.user);
  return data.user;
}

export function logout() {
  clearToken();
  clearStoredUser();
}

// ── Dashboard ─────────────────────────────────────────────────

export async function fetchDashboard() {
  return request('/dashboard');
}

// ── Chargers ──────────────────────────────────────────────────

export async function fetchChargers() {
  return request('/chargers');
}

export async function createCharger(data) {
  return request('/chargers', { method: 'POST', body: data });
}

export async function resetCharger(id, type = 'Soft') {
  return request(`/chargers/${id}/reset`, { method: 'POST', body: { type } });
}

export async function remoteStartCharger(id, connectorId = 1, idTag = 'ADMIN-START') {
  return request(`/chargers/${id}/start`, {
    method: 'POST',
    body: { connectorId, idTag },
  });
}

export async function getChargerQR(id, connector = 1) {
  return request(`/chargers/${id}/qr?connector=${connector}`);
}

// ── Sessions ──────────────────────────────────────────────────

export async function fetchSessions() {
  return request('/sessions');
}

export async function stopSession(id) {
  return request(`/sessions/${id}/stop`, { method: 'POST' });
}

export async function refundSession(id, amountCents = null) {
  return request(`/sessions/${id}/refund`, {
    method: 'POST',
    body: amountCents ? { amountCents } : {},
  });
}

// ── Drivers ───────────────────────────────────────────────────

export async function fetchDrivers() {
  return request('/drivers');
}

export async function createDriver(data) {
  return request('/drivers', { method: 'POST', body: data });
}

// ── Sites ─────────────────────────────────────────────────────

export async function fetchSites() {
  return request('/sites');
}

export async function createSite(data) {
  return request('/sites', { method: 'POST', body: data });
}

// ── Settings ──────────────────────────────────────────────────

export async function fetchSettings() {
  return request('/settings');
}

export async function saveSettings(l2RateCents, dcfcRateCents) {
  return request('/settings', {
    method: 'POST',
    body: { l2RateCents, dcfcRateCents },
  });
}

// ── DLM ───────────────────────────────────────────────────────

export async function fetchCircuits() {
  return request('/dlm/circuits');
}

export async function createCircuit(data) {
  return request('/dlm/circuits', { method: 'POST', body: data });
}

export async function updateCircuit(id, data) {
  return request(`/dlm/circuits/${id}`, { method: 'PUT', body: data });
}

export async function assignChargerToCircuit(circuitId, chargerId) {
  return request(`/dlm/circuits/${circuitId}/chargers`, {
    method: 'POST',
    body: { chargerId },
  });
}
