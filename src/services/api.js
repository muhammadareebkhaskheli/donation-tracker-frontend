import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for logging and auth tokens
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling - FIXED VERSION
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    if (error.response) {
      // Server responded with error status
      console.error('Error details:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
      
      // FIXED: Removed auto-redirect logic for login errors
      // Let individual components handle their own error states
      // Only auto-logout for authenticated routes that return 401
      if (error.response.status === 401 && 
          !error.config?.url?.includes('/auth/login') &&
          !error.config?.url?.includes('/auth/register')) {
        console.log('🔒 Auto-logout due to 401 on protected route');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userSession');
        // Optional: You can still redirect for non-auth endpoints
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // ========== REGISTRATION ==========
  register: (userData) => {
    console.log('📝 Registering user:', { 
      ...userData, 
      password: '***', // Don't log password
      confirmPassword: '***'
    });
    return api.post('/auth/register', userData);
  },
  
  // ========== ADMIN REGISTRATION & INVITATIONS ==========
  registerAdmin: (adminData) => {
    console.log('👑 Registering admin:', { 
      ...adminData, 
      password: '***',
      confirmPassword: '***',
      adminCode: adminData.adminCode ? '***' : undefined
    });
    return api.post('/auth/register-admin', adminData);
  },

  validateInvitation: (invitationCode) => {
    console.log('🔍 Validating invitation code:', { invitationCode: '***' });
    return api.post('/auth/validate-invitation', { invitationCode });
  },

  createAdminInvitation: (invitationData) => {
    console.log('📨 Creating admin invitation:', {
      adminEmail: invitationData.adminEmail,
      role: invitationData.role,
      email: invitationData.email,
      phone: invitationData.phone,
      validityDays: invitationData.validityDays
    });
    return api.post('/auth/create-admin-invitation', invitationData);
  },

  getPendingInvitations: (adminId) => {
    console.log('📋 Getting pending invitations for admin:', adminId);
    return api.get(`/auth/pending-invitations?adminId=${adminId}`);
  },

  revokeInvitation: (invitationCode) => {
    console.log('❌ Revoking invitation:', { invitationCode: '***' });
    return api.post('/auth/revoke-invitation', { invitationCode });
  },

  // ========== EMAIL VERIFICATION ==========
  verifyEmail: (email, code) => {
    console.log('📧 Verifying email:', { email, code: '***' });
    return api.post('/auth/verify-email-code', { email, code });
  },
  
  verifyEmailCode: (data) => {
    console.log('📧 Verifying email code:', { email: data.email, code: '***' });
    return api.post('/auth/verify-email-code', data);
  },
  
  // ========== PHONE VERIFICATION ==========
  verifyPhone: (phone, code) => {
    console.log('📱 Verifying phone:', { phone, code: '***' });
    return api.post('/auth/verify-phone-code', { phone, code });
  },
  
  verifyPhoneCode: (data) => {
    console.log('📱 Verifying phone code:', { phone: data.phone, code: '***' });
    return api.post('/auth/verify-phone-code', data);
  },
  
  // ========== 2FA SETUP ==========
  setupAuthenticator: (userData) => {
    console.log('🔑 Setting up authenticator for:', userData);
    return api.post('/auth/setup-authenticator', userData);
  },
  
  verifyAuthenticatorSetup: (userData) => {
    console.log('✅ Verifying authenticator setup:', { 
      ...userData, 
      code: '***',
      secret: '***' 
    });
    return api.post('/auth/verify-authenticator-setup', userData);
  },
  
  // ========== LOGIN & AUTHENTICATION ==========
  login: (loginData) => {
    console.log('🔐 Logging in user:', { 
      ...loginData, 
      password: '***' // Don't log password
    });
    return api.post('/auth/login', loginData);
  },
  
  // Login Verification
  verifyLoginEmail: (data) => {
    console.log('📧 Verifying login email:', { email: data.email, code: '***' });
    return api.post('/auth/verify-login-email', data);
  },
  
  verifyLoginPhone: (data) => {
    console.log('📱 Verifying login phone:', { phone: data.phone, code: '***' });
    return api.post('/auth/verify-login-phone', data);
  },
  
  verifyAuthenticatorLogin: (userData) => {
    console.log('🔐 Verifying authenticator login:', { 
      ...userData, 
      code: '***' 
    });
    return api.post('/auth/verify-authenticator-login', userData);
  },
  
  // ========== PASSWORD RESET ==========
  forgotPassword: (data) => {
    console.log('🔓 Forgot password for:', data);
    return api.post('/auth/forgot-password', data);
  },
  
  verifyPasswordResetEmail: (data) => {
    console.log('📧 Verifying password reset email:', { email: data.email, code: '***' });
    return api.post('/auth/verify-password-reset-email', data);
  },
  
  verifyPasswordResetPhone: (data) => {
    console.log('📱 Verifying password reset phone:', { phone: data.phone, code: '***' });
    return api.post('/auth/verify-password-reset-phone', data);
  },
  
  verifyPasswordResetAuthenticator: (userData) => {
    console.log('🔑 Verifying password reset authenticator:', { 
      ...userData, 
      code: '***' 
    });
    return api.post('/auth/verify-password-reset-authenticator', userData);
  },
  
  // NEW: 2FA verification for forgot password
  verifyForgotPassword2FA: (userData) => {
    console.log('🔐 Verifying 2FA for forgot password:', { 
      ...userData, 
      code: '***' 
    });
    return api.post('/auth/verify-forgot-password-2fa', userData);
  },
  
  resetPassword: (resetData) => {
    console.log('🔄 Resetting password for:', { 
      ...resetData, 
      newPassword: '***' // Don't log password
    });
    return api.post('/auth/reset-password', resetData);
  },
  
  // ========== VERIFICATION MANAGEMENT ==========
  resendVerification: (userData) => {
    console.log('🔄 Resending verification:', userData);
    return api.post('/auth/resend-verification', userData);
  },
  
  // ========== ACCOUNT MANAGEMENT ==========
  cleanupAbandonedRegistrations: () => {
    console.log('🧹 Cleaning up abandoned registrations');
    return api.post('/auth/cleanup-abandoned-registrations');
  },
  
  // ========== SESSION & TOKEN MANAGEMENT ==========
  validateToken: () => {
    console.log('🔍 Validating auth token');
    return api.get('/auth/validate-token');
  },
  
  logout: () => {
    console.log('🚪 Logging out user');
    return api.post('/auth/logout');
  },
  
  // ========== USER PROFILE ==========
  getProfile: () => {
    console.log('👤 Getting user profile');
    return api.get('/auth/profile');
  },
  
  updateProfile: (profileData) => {
    console.log('✏️ Updating user profile:', profileData);
    return api.put('/auth/profile', profileData);
  },
  
  changePassword: (passwordData) => {
    console.log('🔒 Changing password:', { 
      ...passwordData, 
      currentPassword: '***',
      newPassword: '***' 
    });
    return api.put('/auth/change-password', passwordData);
  },
  
  // ========== ACCOUNT SECURITY ==========
  enableTwoFactor: () => {
    console.log('🔐 Enabling two-factor authentication');
    return api.post('/auth/enable-2fa');
  },
  
  disableTwoFactor: (code) => {
    console.log('🔓 Disabling two-factor authentication:', { code: '***' });
    return api.post('/auth/disable-2fa', { code });
  },
  
  getTwoFactorStatus: () => {
    console.log('📊 Getting 2FA status');
    return api.get('/auth/2fa-status');
  },
  
  // ========== ACCOUNT RECOVERY ==========
  getRecoveryCodes: () => {
    console.log('🆘 Getting recovery codes');
    return api.get('/auth/recovery-codes');
  },
  
  generateRecoveryCodes: () => {
    console.log('🔄 Generating new recovery codes');
    return api.post('/auth/generate-recovery-codes');
  },

  // ========== ADMIN MANAGEMENT ==========
  getAllAdmins: () => {
    console.log('👥 Getting all admins');
    return api.get('/auth/admins');
  },

  updateAdminRole: (adminId, newRole) => {
    console.log('🔄 Updating admin role:', { adminId, newRole });
    return api.put('/auth/update-admin-role', { adminId, newRole });
  },

  deactivateAdmin: (adminId) => {
    console.log('🚫 Deactivating admin:', adminId);
    return api.post('/auth/deactivate-admin', { adminId });
  },

  // ========== ADMIN DASHBOARD ==========
  getAdminStats: () => {
    console.log('📊 Getting admin statistics');
    return api.get('/auth/admin-stats');
  },

  getUserManagement: (page = 0, size = 10) => {
    console.log('👤 Getting user management data:', { page, size });
    return api.get(`/auth/user-management?page=${page}&size=${size}`);
  },
};

// ========== UTILITY FUNCTIONS ==========

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const session = localStorage.getItem('userSession');
  
  if (!token || !session) return false;
  
  try {
    const sessionData = JSON.parse(session);
    // Check if session is still valid (less than 24 hours old)
    const isSessionValid = Date.now() - sessionData.loginTime < 24 * 60 * 60 * 1000;
    return isSessionValid;
  } catch {
    return false;
  }
};

// Get current user data
export const getCurrentUser = () => {
  try {
    const session = localStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};

// Clear all auth data
export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userSession');
  localStorage.removeItem('rememberedCredentials');
};

// Set auth token
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Set user session
export const setUserSession = (sessionData) => {
  localStorage.setItem('userSession', JSON.stringify(sessionData));
};

// ========== ADMIN UTILITY FUNCTIONS ==========

// Check if user is admin
export const isAdmin = () => {
  try {
    const session = localStorage.getItem('userSession');
    if (!session) return false;
    
    const sessionData = JSON.parse(session);
    const userRole = sessionData.role || sessionData.user?.role;
    
    return ['ADMIN', 'SUPER_ADMIN', 'APPROVER', 'CO_APPROVER', 'SUPPORT_STAFF'].includes(userRole);
  } catch {
    return false;
  }
};

// Check if user is super admin
export const isSuperAdmin = () => {
  try {
    const session = localStorage.getItem('userSession');
    if (!session) return false;
    
    const sessionData = JSON.parse(session);
    const userRole = sessionData.role || sessionData.user?.role;
    
    return userRole === 'SUPER_ADMIN';
  } catch {
    return false;
  }
};

// Get user role
export const getUserRole = () => {
  try {
    const session = localStorage.getItem('userSession');
    if (!session) return 'USER';
    
    const sessionData = JSON.parse(session);
    return sessionData.role || sessionData.user?.role || 'USER';
  } catch {
    return 'USER';
  }
};

// Save admin session data
export const setAdminSession = (adminData) => {
  const sessionData = {
    ...adminData,
    isAdmin: true,
    loginTime: Date.now(),
    role: adminData.role || 'ADMIN'
  };
  setUserSession(sessionData);
};

// Admin role validation
export const validateAdminRole = (requiredRole) => {
  const userRole = getUserRole();
  const roleHierarchy = {
    'SUPER_ADMIN': 4,
    'ADMIN': 3,
    'APPROVER': 2,
    'CO_APPROVER': 2,
    'SUPPORT_STAFF': 1,
    'USER': 0
  };
  
  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  
  return userLevel >= requiredLevel;
};

// ========== FORGOT PASSWORD SPECIFIC UTILITIES ==========

// Save forgot password state to handle page refresh
export const saveForgotPasswordState = (state) => {
  localStorage.setItem('forgotPasswordState', JSON.stringify({
    ...state,
    timestamp: Date.now()
  }));
};

// Get forgot password state
export const getForgotPasswordState = () => {
  try {
    const state = localStorage.getItem('forgotPasswordState');
    if (!state) return null;
    
    const stateData = JSON.parse(state);
    // Check if state is still valid (less than 30 minutes old)
    const isStateValid = Date.now() - stateData.timestamp < 30 * 60 * 1000;
    
    if (isStateValid) {
      return stateData;
    } else {
      // Clear expired state
      clearForgotPasswordState();
      return null;
    }
  } catch {
    clearForgotPasswordState();
    return null;
  }
};

// Clear forgot password state
export const clearForgotPasswordState = () => {
  localStorage.removeItem('forgotPasswordState');
};

// Validate password strength
export const validatePasswordStrength = (password) => {
  if (!password) return { isValid: false, message: 'Password is required' };
  if (password.length < 6) return { isValid: false, message: 'Password must be at least 6 characters' };
  
  // Add more password strength checks as needed
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const strength = [
    hasUpperCase,
    hasLowerCase, 
    hasNumbers,
    hasSpecialChar
  ].filter(Boolean).length;
  
  let message = '';
  if (strength >= 4) message = 'Strong password';
  else if (strength >= 3) message = 'Good password';
  else if (strength >= 2) message = 'Fair password';
  else message = 'Weak password';
  
  return {
    isValid: password.length >= 6,
    strength,
    message
  };
};

// ========== TEST ENDPOINTS ==========
export const testAPI = {
  testEmail: () => {
    console.log('🧪 Testing email configuration');
    return api.get('/test/email');
  },
  
  testSMTP: () => {
    console.log('🧪 Testing SMTP connection');
    return api.get('/test/smtp');
  },
  
  testPublic: () => {
    console.log('🧪 Testing public endpoint');
    return api.get('/test/public');
  },
  
  testSecurity: () => {
    console.log('🧪 Testing security endpoint');
    return api.get('/test/security');
  },
  
  testServer: () => {
    console.log('🧪 Testing server status');
    return api.get('/test/server');
  },
  
  // NEW: Test forgot password flow
  testForgotPassword: (email) => {
    console.log('🧪 Testing forgot password flow for:', email);
    return api.post('/test/forgot-password', { email });
  }
};

// ========== ERROR HANDLING UTILITIES ==========

// Handle specific API errors with user-friendly messages
export const getErrorMessage = (error, defaultMessage = 'An error occurred') => {
  if (!error) return defaultMessage;
  
  // Handle axios errors
  if (error.response) {
    const { status, data } = error.response;
    
    // Server returned error response
    if (data && data.message) {
      return data.message;
    }
    
    // Generic status-based messages
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication failed. Please check your credentials.';
      case 403:
        return 'Access denied. You do not have permission.';
      case 404:
        return 'Requested resource not found.';
      case 409:
        return 'Conflict detected. This resource already exists.';
      case 429:
        return 'Too many requests. Please wait and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Bad gateway. Service temporarily unavailable.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return data?.message || defaultMessage;
    }
  } else if (error.request) {
    // Request made but no response received
    return 'Network error. Please check your connection and try again.';
  } else {
    // Something else happened
    return error.message || defaultMessage;
  }
};

// Check if error is a network error
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

// Check if error is a timeout
export const isTimeoutError = (error) => {
  return error.code === 'ECONNABORTED' || error.message?.includes('timeout');
};

// ========== EXPORT DEFAULT ==========
export default api;