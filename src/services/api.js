// donation-tracker-frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || 'An error occurred';

      // Handle validation errors
      if (error.response.status === 400) {
        return Promise.reject({ type: 'VALIDATION', message: errorMessage });
      }

      // Handle authentication errors
      if (error.response.status === 401) {
        return Promise.reject({ type: 'AUTH', message: errorMessage });
      }

      // Handle forbidden errors
      if (error.response.status === 403) {
        return Promise.reject({ type: 'FORBIDDEN', message: errorMessage });
      }

      // Handle account locked
      if (error.response.status === 423) { // LOCKED
        return Promise.reject({ type: 'LOCKED', message: errorMessage });
      }

      // Handle not found
      if (error.response.status === 404) {
        return Promise.reject({ type: 'NOT_FOUND', message: errorMessage });
      }

      return Promise.reject({ type: 'SERVER', message: errorMessage });
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        type: 'NETWORK',
        message: 'Unable to connect to server. Please check your connection.'
      });
    } else {
      // Something happened in setting up the request
      return Promise.reject({
        type: 'CLIENT',
        message: error.message || 'An unexpected error occurred'
      });
    }
  }
);

export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  verifyLoginCode: (data) => api.post('/auth/verify-login-code', data),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resendLoginCode: (email) => api.post('/auth/resend-login-code', { email }),
  verifyResetCode: (data) => api.post('/auth/verify-reset-code', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  logout: () => api.post('/auth/logout', { token: localStorage.getItem('token') }),
};

export default api;