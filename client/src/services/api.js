import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token from localStorage if present
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response && error.response.data) {
      if (Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
        message = error.response.data.errors.map((e) => e.message).join('. ');
      } else if (error.response.data.message) {
        message = error.response.data.message;
      }
    } else if (error.message) {
      message = error.message;
    }
    error.customMessage = message;
    return Promise.reject(error);
  }
);

// Public API endpoints
export const getEventConfig = async () => {
  const res = await api.get('/event');
  return res.data.data;
};

export const getCategories = async () => {
  const res = await api.get('/categories');
  return res.data.data;
};

export const getGallery = async (category = '') => {
  const url = category ? `/gallery?category=${category}` : '/gallery';
  const res = await api.get(url);
  return res.data.data;
};

export const submitContact = async (data) => {
  const res = await api.post('/contact', data);
  return res.data;
};

export const initiateRegistration = async (registrationData) => {
  const res = await api.post('/registration/initiate', registrationData);
  return res.data.data;
};

export const getRegistrationStatus = async (registrationId) => {
  const res = await api.get(`/registration/${registrationId}`);
  return res.data.data;
};

export const lookupRegistration = async (params) => {
  const res = await api.post('/registration/lookup', params);
  return res.data.data;
};

// Payment APIs
export const verifyRazorpayPayment = async (payload) => {
  const res = await api.post('/payment/verify', payload);
  return res.data;
};

export const getUpiDetails = async (amount, registrationId) => {
  const res = await api.get(`/payment/upi-details?amount=${amount}&registrationId=${registrationId}`);
  return res.data.data;
};

export const submitUpiProof = async (formData) => {
  const res = await api.post('/payment/submit-upi-proof', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

// Admin Authentication
export const adminLogin = async (identifier, password) => {
  const res = await api.post('/auth/login', { identifier, password });
  return res.data;
};

export const adminLogout = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

export const adminGetMe = async () => {
  const res = await api.get('/auth/me');
  return res.data.admin;
};

// Admin Management
export const adminGetDashboard = async () => {
  const res = await api.get('/admin/dashboard');
  return res.data.data;
};

export const adminGetParticipants = async (params = {}) => {
  const res = await api.get('/admin/participants', { params });
  return res.data;
};

export const adminGetPendingUpi = async () => {
  const res = await api.get('/payment/admin/pending-verifications');
  return res.data.data;
};

export const adminVerifyUpi = async (registrationId) => {
  const res = await api.post('/payment/admin/verify-upi', { registrationId });
  return res.data;
};

export const adminRejectUpi = async (registrationId, reason) => {
  const res = await api.post('/payment/admin/reject-upi', { registrationId, reason });
  return res.data;
};

export const adminToggleRegistration = async (isOpen, reason = '') => {
  const res = await api.post('/event/toggle-registration', { isOpen, reason });
  return res.data;
};

const configuredBase = import.meta.env.VITE_API_URL || '/api/v1';
export const adminExportCsvUrl = configuredBase.endsWith('/api/v1')
  ? `${configuredBase}/admin/export-csv`
  : `${configuredBase}/api/v1/admin/export-csv`;

export default api;
