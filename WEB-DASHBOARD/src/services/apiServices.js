import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── HOSPITALS ───────────────────────────────────────────────
export const hospitalAPI = {
  getAll: () => api.get('/hospitals'),
  getGovernment: () => api.get('/hospitals?type=government'),
  getPrivate: () => api.get('/hospitals?type=private'),
  getById: (id) => api.get(`/hospitals/${id}`),
  updateCapacity: (id, data) => api.patch(`/hospitals/${id}/capacity`, data),
};

// ─── AMBULANCES ──────────────────────────────────────────────
export const ambulanceAPI = {
  getAll: () => api.get('/ambulances'),
  getAvailable: () => api.get('/ambulances?status=available'),
  getById: (id) => api.get(`/ambulances/${id}`),
  updateStatus: (id, status) => api.patch(`/ambulances/${id}/status`, { status }),
  updateLocation: (id, location) => api.patch(`/ambulances/${id}/location`, { location }),
};

// ─── FIRE TRUCKS ─────────────────────────────────────────────
export const firetruckAPI = {
  getAll: () => api.get('/firetrucks'),
  getAvailable: () => api.get('/firetrucks?status=available'),
  getById: (id) => api.get(`/firetrucks/${id}`),
  updateStatus: (id, status) => api.patch(`/firetrucks/${id}/status`, { status }),
};

// ─── MEDICAL BOOKINGS ────────────────────────────────────────
export const medicalBookingAPI = {
  getAll: () => api.get('/medical-bookings'),
  getActive: () => api.get('/medical-bookings?status=active'),
  getById: (id) => api.get(`/medical-bookings/${id}`),
  updateStatus: (id, status) => api.patch(`/medical-bookings/${id}/status`, { status }),
  assignAmbulance: (id, ambulanceId) => api.patch(`/medical-bookings/${id}/assign`, { ambulanceId }),
};

// ─── FIRE BOOKINGS ───────────────────────────────────────────
export const fireBookingAPI = {
  getAll: () => api.get('/fire-bookings'),
  getActive: () => api.get('/fire-bookings?status=active'),
  getById: (id) => api.get(`/fire-bookings/${id}`),
  updateStatus: (id, status) => api.patch(`/fire-bookings/${id}/status`, { status }),
};

// ─── STATS ───────────────────────────────────────────────────
export const statsAPI = {
  getDashboard: () => api.get('/stats/dashboard'),
  getMedical: () => api.get('/stats/medical'),
  getFire: () => api.get('/stats/fire'),
};

export default api;