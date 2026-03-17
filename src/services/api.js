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

// Auth API endpoints
export const authAPI = {
  // Signup
  signup: (userData) => api.post('/auth/signup', userData),
  
  // Login
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Verify email with code
  verifyEmail: (data) => api.post('/auth/verify-email', data),

  //Resend verification code
  resendVerification: (email) => api.post('/auth/resend-verification', { email }),
  
  // Forgot password
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Reset password with code
  resetPassword: (data) => api.post('/auth/reset-password', data),
  
  // Logout
  logout: () => api.post('/auth/logout'),
};

export default api;