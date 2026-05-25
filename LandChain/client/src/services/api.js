import axios from 'axios';

// Express Backend Base API Url
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Auto inject auth JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('landchain_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error payloads
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Server connection timed out.';
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  login: (aadhaar, password) => api.post('/auth/login', { aadhaar, password }),
  register: (formData) => api.post('/auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data' // Required for file uploads
    }
  }),
  getProfile: () => api.get('/auth/profile')
};

export const landAPI = {
  register: (formData) => api.post('/lands/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getAll: (params) => api.get('/lands', { params }),
  getById: (id) => api.get(`/lands/${id}`),
  update: (id, data) => api.put(`/lands/${id}`, data),
  delete: (id) => api.delete(`/lands/${id}`)
};

export const transferAPI = {
  create: (data) => api.post('/transfers/create', data),
  approve: (transferId, action) => api.post('/transfers/approve', { transferId, action }),
  getHistory: (wallet) => api.get('/transfers/history', { params: { wallet } })
};

export const adminAPI = {
  getStats: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getFraudReports: () => api.get('/admin/fraud-reports')
};

export const blockchainAPI = {
  getTxHistory: (wallet) => api.get('/blockchain/history', { params: { wallet } }),
  verifyOwnerOnChain: (id) => api.get(`/blockchain/verify/${id}`)
};

export default api;
