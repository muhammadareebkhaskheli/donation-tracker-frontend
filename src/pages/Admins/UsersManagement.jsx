import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Send,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  FileText,
  X,
  Users,
  TrendingDown,
  TrendingUp,
  Activity,
  Award,
  Lock,
  Unlock,
  MailCheck,
  PhoneCall,
  IdCard,
  BadgeCheck,
  Zap,
  Crown,
  Star,
  UserX,
  Key,
  Settings,
  Bell,
  LogOut,
} from 'lucide-react';

// Enhanced Dummy data for users with all required fields
const usersData = [
  {
    id: 'USR-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1-555-0101',
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-15',
    lastLogin: '2025-11-01 14:30',
    verified: true,
    permissions: ['all'],
    loginAttempts: 0,
    twoFactorEnabled: true,
    department: 'Operations',
    location: 'New York, USA',
    assignee: 'admin1',
    forwardingHistory: [
      {
        fromAdmin: 'admin2',
        toAdmin: 'admin1',
        reason: 'Promotion to admin role requires supervision',
        timestamp: '2024-01-20T14:30:00Z'
      }
    ]
  },
  // ... (rest of your users data remains the same)
];

// Available admins for forwarding
const availableAdmins = [
  { id: 'admin1', name: 'Super Admin', role: 'super_admin' },
  { id: 'admin2', name: 'Approver 1', role: 'approver' },
  { id: 'admin3', name: 'Co-Approver 1', role: 'co_approver' },
  { id: 'admin4', name: 'Support Admin', role: 'support' },
  { id: 'admin5', name: 'Finance Admin', role: 'finance' }
];

// Status options
const statusOptions = [
  'All Status',
  'active',
  'inactive',
  'suspended',
  'pending'
];

const roleOptions = [
  'All Roles',
  'admin',
  'approver',
  'co-approver',
  'support_user'
];

const departmentOptions = [
  'All Departments',
  'Operations',
  'Finance',
  'HR',
  'Support',
  'IT'
];

const verificationOptions = [
  'All Verification',
  'verified',
  'unverified'
];

// Enhanced Stat Card for Users Management
const UserStatCard = ({ icon: Icon, title, value, change, changeType, color, delay, isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.5, type: "spring" }}
    whileHover={{ y: -8, scale: 1.03 }}
    className={`rounded-2xl p-6 shadow-2xl border relative overflow-hidden group ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}
  >
    {/* Animated Background Gradient */}
    <motion.div
      className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    />
    
    {/* Floating Particles */}
    <motion.div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      initial={false}
    >
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1.5 h-1.5 rounded-full opacity-40`}
          style={{
            backgroundColor: color.includes('blue') ? '#3b82f6' : 
                           color.includes('emerald') ? '#10b981' :
                           color.includes('violet') ? '#8b5cf6' :
                           color.includes('amber') ? '#f59e0b' : '#3b82f6',
            left: `${15 + i * 17}%`,
            top: '25%',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, i % 2 === 0 ? 15 : -15, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2.5 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </motion.div>

    <div className="flex items-start justify-between relative z-10">
      <div className="flex-1">
        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{title}</p>
        <motion.h3 
          className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring" }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </motion.h3>
        {change && (
          <motion.div 
            className="flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            {changeType === 'increase' ? (
              <TrendingUp size={16} className="text-emerald-500" />
            ) : (
              <TrendingDown size={16} className="text-rose-500" />
            )}
            <span className={`text-sm font-semibold ${changeType === 'increase' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {change}%
            </span>
            <span className={`text-xs ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>vs last month</span>
          </motion.div>
        )}
      </div>
      
      {/* Icon with animations */}
      <motion.div
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className={`p-3 rounded-xl`}
          style={{
            backgroundColor: color.includes('blue') ? 'rgba(59, 130, 246, 0.1)' : 
                           color.includes('emerald') ? 'rgba(16, 185, 129, 0.1)' :
                           color.includes('violet') ? 'rgba(139, 92, 246, 0.1)' :
                           color.includes('amber') ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)'
          }}
        >
          <Icon 
            size={24} 
            strokeWidth={2.5}
            style={{
              color: color.includes('blue') ? '#3b82f6' : 
                     color.includes('emerald') ? '#10b981' :
                     color.includes('violet') ? '#8b5cf6' :
                     color.includes('amber') ? '#f59e0b' : '#3b82f6'
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  </motion.div>
);

// Enhanced Secondary Stats
const EnhancedUserStatBox = ({ icon: Icon, title, value, color, delay, index, isDark }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay: delay, duration: 0.6, type: "spring" }}
    className={`rounded-2xl p-6 shadow-2xl border relative overflow-hidden group cursor-pointer ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      className={`absolute inset-0 bg-gradient-to-r from-transparent ${
        isDark ? 'via-gray-700' : 'via-gray-50'
      } to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000`}
    />
    
    <motion.div
      className="mb-3 relative z-10"
      animate={{ 
        y: [0, -5, 0],
        rotate: index % 2 === 0 ? [0, 5, -5, 0] : [0, -5, 5, 0]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity,
        delay: index * 0.5
      }}
    >
      <Icon size={28} className={color.includes('blue') ? 'text-blue-600' : 
                                color.includes('emerald') ? 'text-emerald-600' : 
                                color.includes('rose') ? 'text-rose-600' : 'text-blue-600'} />
    </motion.div>
    
    <h4 className={`text-sm font-medium mb-1 relative z-10 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{title}</h4>
    <motion.p 
      className={`text-3xl font-bold relative z-10 ${isDark ? 'text-white' : 'text-gray-900'}`}
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ delay: delay + 0.3, type: "spring" }}
    >
      {value}
    </motion.p>
    
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.sin(i) * 20, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3 + i,
          repeat: Infinity,
          delay: i * 0.7,
        }}
        style={{
          left: `${20 + i * 15}%`,
          bottom: '10%',
        }}
      />
    ))}
  </motion.div>
);

// Status Badge Component for Users
const UserStatusBadge = ({ status, isDark }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return isDark ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-700';
      case 'inactive':
        return isDark ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-700';
      case 'suspended':
        return isDark ? 'bg-rose-900 text-rose-200' : 'bg-rose-100 text-rose-700';
      case 'pending':
        return isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700';
      default:
        return isDark ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Role Badge Component
const RoleBadge = ({ role, isDark }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return isDark ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'approver':
        return isDark ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'co-approver':
        return isDark ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'support_user':
        return isDark ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white' : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white';
      default:
        return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getRoleColor(role)}`}>
      {role === 'support_user' ? 'Support User' : role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

// Verification Badge Component
const VerificationBadge = ({ verified, isDark }) => {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
      verified 
        ? (isDark ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-700')
        : (isDark ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-700')
    }`}>
      {verified ? <CheckCircle size={12} /> : <Clock size={12} />}
      {verified ? 'Verified' : 'Pending'}
    </span>
  );
};

// Two Factor Badge Component
const TwoFactorBadge = ({ enabled, isDark }) => {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${
      enabled 
        ? (isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700')
        : (isDark ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-700')
    }`}>
      <Key size={12} />
      {enabled ? '2FA Enabled' : '2FA Disabled'}
    </span>
  );
};

// UPDATED Forward Modal Component for Users with fixed blur panel
const ForwardModal = ({ isDark, user, onClose, onForward, currentAdmin = 'admin1' }) => {
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAdmin && reason.trim()) {
      onForward(user.id, selectedAdmin, reason.trim());
      onClose();
    }
  };

  const getCurrentAdminName = (adminId) => {
    const admin = availableAdmins.find(a => a.id === adminId);
    return admin ? admin.name : 'Unknown Admin';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* UPDATED: Fixed blur backdrop that covers entire screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`rounded-2xl shadow-2xl border w-full max-w-md relative z-10 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Forward User Request
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              <X size={20} className={isDark ? "text-gray-400" : "text-gray-600"} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* User Info */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                User to Forward
              </label>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.name}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user.id} • {user.role} • Current: {getCurrentAdminName(user.assignee)}
                </p>
              </div>
            </div>

            {/* Admin Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Forward To Admin *
              </label>
              <select
                value={selectedAdmin}
                onChange={(e) => setSelectedAdmin(e.target.value)}
                required
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Select an admin...</option>
                {availableAdmins
                  .filter(admin => admin.id !== currentAdmin)
                  .map(admin => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name} ({admin.role})
                    </option>
                  ))
                }
              </select>
            </div>

            {/* Reason */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Reason for Forwarding *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows="4"
                placeholder="Explain why you're forwarding this user request..."
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg border font-medium ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!selectedAdmin || !reason.trim()}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={16} />
              Forward Request
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// UPDATED Users Management Main Component with auto-scroll to top
const UsersManagement = ({ isDark }) => {
  const [users, setUsers] = useState(usersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedVerification, setSelectedVerification] = useState('All Verification');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [userToForward, setUserToForward] = useState(null);

  // NEW: Auto scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'All Status' || user.status === selectedStatus;
      const matchesRole = selectedRole === 'All Roles' || user.role === selectedRole;
      const matchesDepartment = selectedDepartment === 'All Departments' || user.department === selectedDepartment;
      const matchesVerification = selectedVerification === 'All Verification' || 
        (selectedVerification === 'verified' ? user.verified : !user.verified);
      
      const matchesDateRange = 
        (!dateRange.start || user.joinDate >= dateRange.start) &&
        (!dateRange.end || user.joinDate <= dateRange.end);

      return matchesSearch && matchesStatus && matchesRole && matchesDepartment && matchesVerification && matchesDateRange;
    });
  }, [users, searchTerm, selectedStatus, selectedRole, selectedDepartment, selectedVerification, dateRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const approverUsers = users.filter(u => u.role === 'approver').length;
    const verifiedUsers = users.filter(u => u.verified).length;
    const twoFactorUsers = users.filter(u => u.twoFactorEnabled).length;
    const suspendedUsers = users.filter(u => u.status === 'suspended').length;

    return {
      totalUsers,
      activeUsers,
      adminUsers,
      approverUsers,
      verifiedUsers,
      twoFactorUsers,
      suspendedUsers
    };
  }, [users]);

  // Handle status change
  const handleStatusChange = (userId, newStatus) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  // Handle role change
  const handleRoleChange = (userId, newRole) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  // Handle verification change
  const handleVerificationChange = (userId, verified) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, verified } : user
    ));
  };

  // Handle two-factor change
  const handleTwoFactorChange = (userId, enabled) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, twoFactorEnabled: enabled } : user
    ));
  };

  // Handle delete user
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  // Handle view user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowAddUserModal(true);
  };

  // Handle add new user
  const handleAddUser = (newUser) => {
    const user = {
      ...newUser,
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: null,
      loginAttempts: 0,
      assignee: 'admin1',
      forwardingHistory: []
    };
    setUsers(prev => [...prev, user]);
  };

  // Handle update user
  const handleUpdateUser = (updatedUser) => {
    setUsers(prev => prev.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    ));
    setEditingUser(null);
  };

  // Handle forward request
  const handleForwardRequest = (userId, targetAdminId, reason) => {
    const currentAdmin = 'admin1';
    
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const forwardRecord = {
          fromAdmin: currentAdmin,
          toAdmin: targetAdminId,
          reason: reason,
          timestamp: new Date().toISOString()
        };

        return {
          ...user,
          assignee: targetAdminId,
          forwardingHistory: [...user.forwardingHistory, forwardRecord]
        };
      }
      return user;
    }));

    console.log(`User ${userId} forwarded to ${targetAdminId} for: ${reason}`);
  };

  // Handle open forward modal
  const handleOpenForwardModal = (user) => {
    setUserToForward(user);
    setShowForwardModal(true);
    setActionMenu(null);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const data = filteredUsers.map(user => ({
      ID: user.id,
      Name: user.name,
      Email: user.email,
      Phone: user.phone,
      Role: user.role,
      Status: user.status,
      Department: user.department,
      'Join Date': user.joinDate,
      'Last Login': user.lastLogin,
      Verified: user.verified ? 'Yes' : 'No',
      '2FA Enabled': user.twoFactorEnabled ? 'Yes' : 'No',
      Location: user.location,
    }));
    
    console.log('Exporting to Excel:', data);
    alert(`Exported ${filteredUsers.length} users to Excel`);
  };

  // Export to PDF
  const handleExportPDF = () => {
    console.log('Exporting to PDF:', filteredUsers);
    alert(`Exported ${filteredUsers.length} users to PDF`);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
    setSelectedRole('All Roles');
    setSelectedDepartment('All Departments');
    setSelectedVerification('All Verification');
    setDateRange({ start: '', end: '' });
  };

  // Toggle action menu
  const toggleActionMenu = (userId) => {
    setActionMenu(actionMenu === userId ? null : userId);
  };

  // Close modals
  const closeModals = () => {
    setShowUserModal(false);
    setShowAddUserModal(false);
    setShowForwardModal(false);
    setEditingUser(null);
    setSelectedUser(null);
    setUserToForward(null);
  };

  // Get admin name by ID
  const getAdminName = (adminId) => {
    const admin = availableAdmins.find(a => a.id === adminId);
    return admin ? admin.name : 'Unknown Admin';
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <UserStatCard
          icon={Users}
          title="Total Users"
          value={stats.totalUsers}
          change={8.3}
          changeType="increase"
          color="from-blue-500 to-cyan-500"
          delay={0.1}
          isDark={isDark}
        />
        <UserStatCard
          icon={UserCheck}
          title="Active Users"
          value={stats.activeUsers}
          change={12.5}
          changeType="increase"
          color="from-emerald-500 to-teal-500"
          delay={0.2}
          isDark={isDark}
        />
        <UserStatCard
          icon={Shield}
          title="Admin Users"
          value={stats.adminUsers}
          change={5.2}
          changeType="increase"
          color="from-violet-500 to-purple-500"
          delay={0.3}
          isDark={isDark}
        />
        <UserStatCard
          icon={BadgeCheck}
          title="Verified Users"
          value={stats.verifiedUsers}
          change={15.7}
          changeType="increase"
          color="from-amber-500 to-orange-500"
          delay={0.4}
          isDark={isDark}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <EnhancedUserStatBox
          icon={Award}
          title="Approvers"
          value={stats.approverUsers}
          color="from-blue-600 to-cyan-500"
          delay={0.5}
          index={0}
          isDark={isDark}
        />
        <EnhancedUserStatBox
          icon={Key}
          title="2FA Enabled"
          value={stats.twoFactorUsers}
          color="from-emerald-500 to-green-500"
          delay={0.6}
          index={1}
          isDark={isDark}
        />
        <EnhancedUserStatBox
          icon={UserX}
          title="Suspended"
          value={stats.suspendedUsers}
          color="from-rose-500 to-pink-600"
          delay={0.7}
          index={2}
          isDark={isDark}
        />
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 shadow-2xl border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name, email, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Filter Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg border font-semibold ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter size={18} />
            Filters
            {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </motion.button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 p-4 border rounded-lg bg-opacity-50"
                style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)' }}
              >
                {/* Status Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {statusOptions.map(option => (
                      <option key={option} value={option}>
                        {option === 'All Status' ? option : option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {roleOptions.map(option => (
                      <option key={option} value={option}>
                        {option === 'All Roles' ? option : 
                         option === 'support_user' ? 'Support User' : 
                         option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {departmentOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Verification Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Verification
                  </label>
                  <select
                    value={selectedVerification}
                    onChange={(e) => setSelectedVerification(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {verificationOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Join Date
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between items-center">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Showing {filteredUsers.length} of {users.length} users
                </span>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResetFilters}
                    className={`px-4 py-2 rounded-lg border font-medium ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <RefreshCw size={16} className="inline mr-2" />
                    Reset Filters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 shadow-2xl border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Users Management
          </h3>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold"
            >
              <UserPlus size={18} />
              Add User
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg font-semibold"
            >
              <Download size={18} />
              Export Excel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-500 text-white rounded-lg font-semibold"
            >
              <FileText size={18} />
              Export PDF
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl shadow-2xl border overflow-hidden ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>User</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Contact & Department</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Role & Permissions</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Status & Security</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Assigned To</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b ${
                    isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
                  } transition-colors group`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className={`font-semibold group-hover:text-purple-600 transition-colors ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {user.name}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {user.id}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          Joined: {user.joinDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.location}
                        </span>
                      </div>
                      <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {user.department}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <RoleBadge role={user.role} isDark={isDark} />
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user.permissions.length} permission{user.permissions.length !== 1 ? 's' : ''}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.slice(0, 2).map((permission, idx) => (
                          <span key={idx} className={`px-1.5 py-0.5 text-xs rounded ${
                            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {permission.replace('_', ' ')}
                          </span>
                        ))}
                        {user.permissions.length > 2 && (
                          <span className={`px-1.5 py-0.5 text-xs rounded ${
                            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}>
                            +{user.permissions.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <UserStatusBadge status={user.status} isDark={isDark} />
                      <div className="flex flex-wrap gap-1">
                        <VerificationBadge verified={user.verified} isDark={isDark} />
                        <TwoFactorBadge enabled={user.twoFactorEnabled} isDark={isDark} />
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Last login: {user.lastLogin ? user.lastLogin.split(' ')[0] : 'Never'}
                      </div>
                      {user.loginAttempts > 0 && (
                        <div className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                          {user.loginAttempts} failed attempt{user.loginAttempts !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {getAdminName(user.assignee)}
                        </div>
                        {user.forwardingHistory.length > 0 && (
                          <div className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                            <Clock size={12} className="inline mr-1" />
                            {user.forwardingHistory.length} forward{user.forwardingHistory.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleViewUser(user)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded transition-colors ${
                          isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                        }`}
                        title="View Details"
                      >
                        <Eye size={16} className={isDark ? "text-gray-300" : "text-gray-600"} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleEditUser(user)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded transition-colors ${
                          isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                        }`}
                        title="Edit"
                      >
                        <Edit size={16} className={isDark ? "text-gray-300" : "text-gray-600"} />
                      </motion.button>
                      
                      {/* More Actions Dropdown */}
                      <div className="relative">
                        <motion.button
                          onClick={() => toggleActionMenu(user.id)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-2 rounded transition-colors ${
                            isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          }`}
                          title="More Actions"
                        >
                          <MoreVertical size={16} className={isDark ? "text-gray-300" : "text-gray-600"} />
                        </motion.button>
                        
                        <AnimatePresence>
                          {actionMenu === user.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className={`absolute right-0 top-10 w-48 rounded-lg shadow-xl border z-10 ${
                                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="p-2 space-y-1">
                                {/* Forward Action */}
                                <button
                                  onClick={() => handleOpenForwardModal(user)}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  <Send size={14} />
                                  Forward to Admin
                                </button>

                                <button
                                  onClick={() => {
                                    handleStatusChange(user.id, 'active');
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  Activate User
                                </button>
                                <button
                                  onClick={() => {
                                    handleVerificationChange(user.id, true);
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  Verify User
                                </button>
                                <button
                                  onClick={() => {
                                    handleTwoFactorChange(user.id, !user.twoFactorEnabled);
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {user.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                                </button>
                                <button
                                  onClick={() => {
                                    alert(`Sending password reset to ${user.email}`);
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  Reset Password
                                </button>
                                <hr className={isDark ? 'border-gray-700' : 'border-gray-200'} />
                                <button
                                  onClick={() => {
                                    handleDeleteUser(user.id);
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-rose-600 text-rose-300' 
                                      : 'hover:bg-rose-100 text-rose-700'
                                  }`}
                                >
                                  Delete User
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                No users found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && (
          <UserDetailModal
            user={selectedUser}
            isDark={isDark}
            onClose={closeModals}
            onStatusChange={handleStatusChange}
            onRoleChange={handleRoleChange}
            onVerificationChange={handleVerificationChange}
            onTwoFactorChange={handleTwoFactorChange}
            availableAdmins={availableAdmins}
          />
        )}
      </AnimatePresence>

      {/* Add/Edit User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
          <AddUserModal
            isDark={isDark}
            user={editingUser}
            onClose={closeModals}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
          />
        )}
      </AnimatePresence>

      {/* Forward Modal */}
      <AnimatePresence>
        {showForwardModal && userToForward && (
          <ForwardModal
            isDark={isDark}
            user={userToForward}
            onClose={closeModals}
            onForward={handleForwardRequest}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// UPDATED User Detail Modal Component with fixed blur panel
const UserDetailModal = ({ user, isDark, onClose, onStatusChange, onRoleChange, onVerificationChange, onTwoFactorChange, availableAdmins }) => {
  const getAdminName = (adminId) => {
    const admin = availableAdmins.find(a => a.id === adminId);
    return admin ? admin.name : 'Unknown Admin';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* UPDATED: Fixed blur backdrop that covers entire screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`rounded-2xl shadow-2xl border w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              User Details - {user.name}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              <X size={20} className={isDark ? "text-gray-400" : "text-gray-600"} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Full Name
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>{user.name}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Email
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>{user.email}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Phone
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>{user.phone}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Location
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>{user.location}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Department
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.department}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Account Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    User ID
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>{user.id}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Join Date
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>{user.joinDate}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Last Login
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never logged in'}
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Failed Login Attempts
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>
                    <span className={user.loginAttempts > 0 ? 'text-rose-500' : 'text-emerald-500'}>
                      {user.loginAttempts}
                    </span>
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Assigned To
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'
                    }`}>
                      {getAdminName(user.assignee)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Role and Security Settings */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Role & Permissions
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    User Role
                  </label>
                  <select
                    value={user.role}
                    onChange={(e) => onRoleChange(user.id, e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {roleOptions.filter(opt => opt !== 'All Roles').map(option => (
                      <option key={option} value={option}>
                        {option === 'support_user' ? 'Support User' : option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Permissions ({user.permissions.length})
                  </label>
                  <div className={`p-3 rounded-lg border ${
                    isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                  }`}>
                    <div className="flex flex-wrap gap-2">
                      {user.permissions.map((permission, index) => (
                        <span key={index} className={`px-2 py-1 text-xs rounded ${
                          isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {permission.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Security Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Account Status
                  </label>
                  <select
                    value={user.status}
                    onChange={(e) => onStatusChange(user.id, e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {statusOptions.filter(opt => opt !== 'All Status').map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Email Verification
                    </label>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user.verified ? 'Email is verified' : 'Email verification pending'}
                    </p>
                  </div>
                  <button
                    onClick={() => onVerificationChange(user.id, !user.verified)}
                    className={`px-3 py-1 rounded text-sm ${
                      user.verified 
                        ? (isDark ? 'bg-amber-600 text-white' : 'bg-amber-500 text-white')
                        : (isDark ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-white')
                    }`}
                  >
                    {user.verified ? 'Unverify' : 'Verify'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Two-Factor Authentication
                    </label>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user.twoFactorEnabled ? '2FA is enabled' : '2FA is disabled'}
                    </p>
                  </div>
                  <button
                    onClick={() => onTwoFactorChange(user.id, !user.twoFactorEnabled)}
                    className={`px-3 py-1 rounded text-sm ${
                      user.twoFactorEnabled 
                        ? (isDark ? 'bg-rose-600 text-white' : 'bg-rose-500 text-white')
                        : (isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                    }`}
                  >
                    {user.twoFactorEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Forwarding History */}
          {user.forwardingHistory.length > 0 && (
            <div className="mt-6">
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Forwarding History ({user.forwardingHistory.length})
              </h3>
              <div className="space-y-3">
                {user.forwardingHistory.map((record, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Send size={14} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {getAdminName(record.fromAdmin)} → {getAdminName(record.toAdmin)}
                          </span>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          {record.reason}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {formatDate(record.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// UPDATED Add/Edit User Modal Component with fixed blur panel
const AddUserModal = ({ isDark, user, onClose, onAddUser, onUpdateUser }) => {
  const isEditing = !!user;
  const [formData, setFormData] = useState(isEditing ? user : {
    name: '',
    email: '',
    phone: '',
    department: 'Operations',
    location: '',
    role: 'support_user',
    status: 'active',
    verified: false,
    twoFactorEnabled: false,
    permissions: ['view_recipients', 'view_donors'],
  });

  const permissionOptions = [
    { value: 'view_recipients', label: 'View Recipients' },
    { value: 'manage_recipients', label: 'Manage Recipients' },
    { value: 'view_donors', label: 'View Donors' },
    { value: 'manage_donors', label: 'Manage Donors' },
    { value: 'view_donations', label: 'View Donations' },
    { value: 'manage_donations', label: 'Manage Donations' },
    { value: 'approve_requests', label: 'Approve Requests' },
    { value: 'view_reports', label: 'View Reports' },
    { value: 'manage_users', label: 'Manage Users' },
    { value: 'all', label: 'All Permissions' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      onUpdateUser(formData);
    } else {
      onAddUser(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePermissionChange = (permission, isChecked) => {
    setFormData(prev => {
      if (isChecked) {
        // If "all" is selected, clear other permissions and only keep "all"
        if (permission === 'all') {
          return { ...prev, permissions: ['all'] };
        }
        // If selecting any other permission, remove "all" if it exists
        const newPermissions = prev.permissions.filter(p => p !== 'all');
        return { ...prev, permissions: [...newPermissions, permission] };
      } else {
        return { ...prev, permissions: prev.permissions.filter(p => p !== permission) };
      }
    });
  };

  const handleRoleChange = (newRole) => {
    setFormData(prev => {
      let defaultPermissions = [];
      
      switch (newRole) {
        case 'admin':
          defaultPermissions = ['all'];
          break;
        case 'approver':
          defaultPermissions = ['approve_requests', 'view_recipients', 'view_donors', 'view_reports'];
          break;
        case 'co-approver':
          defaultPermissions = ['approve_requests', 'view_recipients'];
          break;
        case 'support_user':
          defaultPermissions = ['view_recipients', 'view_donors', 'manage_requests'];
          break;
        default:
          defaultPermissions = ['view_recipients', 'view_donors'];
      }
      
      return { ...prev, role: newRole, permissions: defaultPermissions };
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* UPDATED: Fixed blur backdrop that covers entire screen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`rounded-2xl shadow-2xl border w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {isEditing ? 'Edit User' : 'Add New User'}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              <X size={20} className={isDark ? "text-gray-400" : "text-gray-600"} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Personal Information
              </h3>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Account Information
              </h3>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {roleOptions.filter(opt => opt !== 'All Roles').map(option => (
                    <option key={option} value={option}>
                      {option === 'support_user' ? 'Support User' : option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {departmentOptions.filter(opt => opt !== 'All Departments').map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Permissions Section */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Permissions
            </h3>
            <div className={`p-4 rounded-lg border ${
              isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {permissionOptions.map(permission => (
                  <div key={permission.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`permission-${permission.value}`}
                      checked={formData.permissions.includes(permission.value)}
                      onChange={(e) => handlePermissionChange(permission.value, e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label 
                      htmlFor={`permission-${permission.value}`}
                      className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      {permission.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {statusOptions.filter(opt => opt !== 'All Status').map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Email Verified
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="twoFactorEnabled"
                  checked={formData.twoFactorEnabled}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Enable Two-Factor Authentication
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-lg border font-medium ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold"
            >
              {isEditing ? 'Update User' : 'Add User'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UsersManagement;