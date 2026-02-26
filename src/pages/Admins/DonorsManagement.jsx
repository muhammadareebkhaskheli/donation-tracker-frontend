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
  DollarSign,
  TrendingUp,
  Activity,
  Award,
  Target,
  Heart,
  CreditCard,
  History,
  Star,
  Gift,
  Crown,
  Zap,
  UserX,
} from 'lucide-react';

// Enhanced Dummy data for donors with forwarding fields
const donorsData = [
  {
    id: 'DON-001',
    name: 'Anonymous',
    email: 'anonymous@email.com',
    phone: 'N/A',
    address: 'Not Provided',
    totalDonated: 450000,
    totalDonations: 25,
    lastDonationDate: '2024-11-01',
    firstDonationDate: '2023-01-15',
    preferredCategory: 'Medical',
    status: 'Active',
    verificationStatus: 'Verified',
    paymentMethod: 'Bank Transfer',
    anonymous: true,
    avgDonationAmount: 18000,
    largestDonation: 50000,
    completionRate: 95,
    tier: 'Platinum',
    notes: 'Prefers to remain anonymous. Regular monthly donor.',
    assignee: 'admin1',
    forwardingHistory: [
      {
        fromAdmin: 'admin2',
        toAdmin: 'admin1',
        reason: 'Workload distribution - high value donor needs special attention',
        timestamp: '2024-01-15T10:30:00Z'
      }
    ]
  },
  {
    id: 'DON-002',
    name: 'Sarah Ali',
    email: 'sarah.ali@email.com',
    phone: '+92-300-1112222',
    address: 'Karachi, Pakistan',
    totalDonated: 320000,
    totalDonations: 18,
    lastDonationDate: '2024-10-28',
    firstDonationDate: '2023-03-22',
    preferredCategory: 'Education',
    status: 'Active',
    verificationStatus: 'Verified',
    paymentMethod: 'Credit Card',
    anonymous: false,
    avgDonationAmount: 17778,
    largestDonation: 35000,
    completionRate: 90,
    tier: 'Gold',
    notes: 'Corporate donor. Interested in education projects.',
    assignee: 'admin2',
    forwardingHistory: []
  },
  // ... (rest of your donors data remains the same)
];

// Available admins for forwarding
const availableAdmins = [
  { id: 'admin1', name: 'Super Admin', role: 'super_admin' },
  { id: 'admin2', name: 'Approver 1', role: 'approver' },
  { id: 'admin3', name: 'Co-Approver 1', role: 'co_approver' },
  { id: 'admin4', name: 'Support Admin', role: 'support' },
  { id: 'admin5', name: 'Finance Admin', role: 'finance' }
];

// Status options for donors
const statusOptions = [
  'All Status',
  'Active',
  'Inactive',
  'Suspended',
  'Pending'
];

const verificationOptions = [
  'All Verification',
  'Verified',
  'Pending',
  'Not Started',
  'Rejected'
];

const tierOptions = [
  'All Tiers',
  'Platinum',
  'Gold',
  'Silver',
  'Bronze'
];

const paymentOptions = [
  'All Methods',
  'Bank Transfer',
  'Credit Card',
  'Digital Wallet',
  'Cash'
];

const categoryOptions = [
  'All Categories',
  'Medical',
  'Education',
  'Emergency',
  'Food',
  'Housing'
];

// Enhanced Stat Card for Donors Management
const DonorStatCard = ({ icon: Icon, title, value, change, changeType, color, delay, isDark }) => (
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
const EnhancedDonorStatBox = ({ icon: Icon, title, value, color, delay, index, isDark }) => (
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

// Status Badge Component for Donors
const DonorStatusBadge = ({ status, isDark }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return isDark ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-700';
      case 'Inactive':
        return isDark ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-700';
      case 'Suspended':
        return isDark ? 'bg-rose-900 text-rose-200' : 'bg-rose-100 text-rose-700';
      case 'Pending':
        return isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700';
      default:
        return isDark ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

// Verification Badge Component
const VerificationBadge = ({ status, isDark }) => {
  const getVerificationColor = (status) => {
    switch (status) {
      case 'Verified':
        return isDark ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-700';
      case 'Pending':
        return isDark ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-700';
      case 'Rejected':
        return isDark ? 'bg-rose-900 text-rose-200' : 'bg-rose-100 text-rose-700';
      default:
        return isDark ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVerificationColor(status)}`}>
      {status}
    </span>
  );
};

// Tier Badge Component
const TierBadge = ({ tier, isDark }) => {
  const getTierColor = (tier) => {
    switch (tier) {
      case 'Platinum':
        return isDark ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white' : 'bg-gradient-to-r from-gray-500 to-gray-700 text-white';
      case 'Gold':
        return isDark ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-white' : 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
      case 'Silver':
        return isDark ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900' : 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      case 'Bronze':
        return isDark ? 'bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100' : 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
      default:
        return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getTierColor(tier)}`}>
      {tier}
    </span>
  );
};

// Progress Bar Component
const ProgressBar = ({ percentage, isDark }) => (
  <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${percentage}%` }}
      transition={{ duration: 1.5, type: "spring" }}
      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full shadow-lg relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-white/30 rounded-full"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  </div>
);

// UPDATED Forward Modal Component with fixed blur panel
const ForwardModal = ({ isDark, donor, onClose, onForward, currentAdmin = 'admin1' }) => {
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAdmin && reason.trim()) {
      onForward(donor.id, selectedAdmin, reason.trim());
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
              Forward Donor Request
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
            {/* Donor Info */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Donor to Forward
              </label>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {donor.anonymous ? 'Anonymous Donor' : donor.name}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {donor.id} • Current: {getCurrentAdminName(donor.assignee)}
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
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Select an admin...</option>
                {availableAdmins
                  .filter(admin => admin.id !== currentAdmin) // Don't show current admin
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
                placeholder="Explain why you're forwarding this donor request..."
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none ${
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
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

// UPDATED Donors Management Main Component with auto-scroll to top
const DonorsManagement = ({ isDark }) => {
  const [donors, setDonors] = useState(donorsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedVerification, setSelectedVerification] = useState('All Verification');
  const [selectedTier, setSelectedTier] = useState('All Tiers');
  const [selectedPayment, setSelectedPayment] = useState('All Methods');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [showAddDonorModal, setShowAddDonorModal] = useState(false);
  const [editingDonor, setEditingDonor] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [donorToForward, setDonorToForward] = useState(null);

  // NEW: Auto scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter donors based on search and filters
  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      const matchesSearch = 
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.phone.includes(searchTerm) ||
        donor.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'All Status' || donor.status === selectedStatus;
      const matchesVerification = selectedVerification === 'All Verification' || donor.verificationStatus === selectedVerification;
      const matchesTier = selectedTier === 'All Tiers' || donor.tier === selectedTier;
      const matchesPayment = selectedPayment === 'All Methods' || donor.paymentMethod === selectedPayment;
      const matchesCategory = selectedCategory === 'All Categories' || donor.preferredCategory === selectedCategory;
      
      const matchesDateRange = 
        (!dateRange.start || donor.firstDonationDate >= dateRange.start) &&
        (!dateRange.end || donor.firstDonationDate <= dateRange.end);

      return matchesSearch && matchesStatus && matchesVerification && matchesTier && matchesPayment && matchesCategory && matchesDateRange;
    });
  }, [donors, searchTerm, selectedStatus, selectedVerification, selectedTier, selectedPayment, selectedCategory, dateRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDonors = donors.length;
    const activeDonors = donors.filter(d => d.status === 'Active').length;
    const totalAmountDonated = donors.reduce((sum, d) => sum + d.totalDonated, 0);
    const totalDonations = donors.reduce((sum, d) => sum + d.totalDonations, 0);
    const verifiedDonors = donors.filter(d => d.verificationStatus === 'Verified').length;
    const anonymousDonors = donors.filter(d => d.anonymous).length;
    const platinumDonors = donors.filter(d => d.tier === 'Platinum').length;

    return {
      totalDonors,
      activeDonors,
      totalAmountDonated,
      totalDonations,
      verifiedDonors,
      anonymousDonors,
      platinumDonors
    };
  }, [donors]);

  // Handle status change
  const handleStatusChange = (donorId, newStatus) => {
    setDonors(prev => prev.map(donor =>
      donor.id === donorId ? { ...donor, status: newStatus } : donor
    ));
  };

  // Handle verification change
  const handleVerificationChange = (donorId, newVerification) => {
    setDonors(prev => prev.map(donor =>
      donor.id === donorId ? { ...donor, verificationStatus: newVerification } : donor
    ));
  };

  // Handle delete donor
  const handleDeleteDonor = (donorId) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      setDonors(prev => prev.filter(donor => donor.id !== donorId));
    }
  };

  // Handle view donor details
  const handleViewDonor = (donor) => {
    setSelectedDonor(donor);
    setShowDonorModal(true);
  };

  // Handle edit donor
  const handleEditDonor = (donor) => {
    setEditingDonor(donor);
    setShowAddDonorModal(true);
  };

  // Handle add new donor
  const handleAddDonor = (newDonor) => {
    const donor = {
      ...newDonor,
      id: `DON-${String(donors.length + 1).padStart(3, '0')}`,
      firstDonationDate: new Date().toISOString().split('T')[0],
      lastDonationDate: newDonor.totalDonated > 0 ? new Date().toISOString().split('T')[0] : null,
      avgDonationAmount: newDonor.totalDonations > 0 ? Math.round(newDonor.totalDonated / newDonor.totalDonations) : 0,
      completionRate: 0,
      assignee: 'admin1', // Default assignee
      forwardingHistory: []
    };
    setDonors(prev => [...prev, donor]);
  };

  // Handle update donor
  const handleUpdateDonor = (updatedDonor) => {
    setDonors(prev => prev.map(donor =>
      donor.id === updatedDonor.id ? {
        ...updatedDonor,
        avgDonationAmount: updatedDonor.totalDonations > 0 ? Math.round(updatedDonor.totalDonated / updatedDonor.totalDonations) : 0,
      } : donor
    ));
    setEditingDonor(null);
  };

  // Handle forward request
  const handleForwardRequest = (donorId, targetAdminId, reason) => {
    const currentAdmin = 'admin1'; // This would typically come from auth context
    
    setDonors(prev => prev.map(donor => {
      if (donor.id === donorId) {
        const forwardRecord = {
          fromAdmin: currentAdmin,
          toAdmin: targetAdminId,
          reason: reason,
          timestamp: new Date().toISOString()
        };

        return {
          ...donor,
          assignee: targetAdminId,
          forwardingHistory: [...donor.forwardingHistory, forwardRecord]
        };
      }
      return donor;
    }));

    // Show success message (in a real app, this would be a toast notification)
    console.log(`Donor ${donorId} forwarded to ${targetAdminId} for: ${reason}`);
  };

  // Handle open forward modal
  const handleOpenForwardModal = (donor) => {
    setDonorToForward(donor);
    setShowForwardModal(true);
    setActionMenu(null);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const data = filteredDonors.map(donor => ({
      ID: donor.id,
      Name: donor.name,
      Email: donor.email,
      Phone: donor.phone,
      Status: donor.status,
      'Total Donated': donor.totalDonated,
      'Total Donations': donor.totalDonations,
      'Average Donation': donor.avgDonationAmount,
      'Verification Status': donor.verificationStatus,
      Tier: donor.tier,
      'Preferred Category': donor.preferredCategory,
      'First Donation': donor.firstDonationDate,
      'Last Donation': donor.lastDonationDate,
    }));
    
    console.log('Exporting to Excel:', data);
    alert(`Exported ${filteredDonors.length} donors to Excel`);
  };

  // Export to PDF
  const handleExportPDF = () => {
    console.log('Exporting to PDF:', filteredDonors);
    alert(`Exported ${filteredDonors.length} donors to PDF`);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
    setSelectedVerification('All Verification');
    setSelectedTier('All Tiers');
    setSelectedPayment('All Methods');
    setSelectedCategory('All Categories');
    setDateRange({ start: '', end: '' });
  };

  // Toggle action menu
  const toggleActionMenu = (donorId) => {
    setActionMenu(actionMenu === donorId ? null : donorId);
  };

  // Close modals
  const closeModals = () => {
    setShowDonorModal(false);
    setShowAddDonorModal(false);
    setShowForwardModal(false);
    setEditingDonor(null);
    setSelectedDonor(null);
    setDonorToForward(null);
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
        <DonorStatCard
          icon={Users}
          title="Total Donors"
          value={stats.totalDonors}
          change={12.5}
          changeType="increase"
          color="from-blue-500 to-cyan-500"
          delay={0.1}
          isDark={isDark}
        />
        <DonorStatCard
          icon={UserCheck}
          title="Active Donors"
          value={stats.activeDonors}
          change={8.3}
          changeType="increase"
          color="from-emerald-500 to-teal-500"
          delay={0.2}
          isDark={isDark}
        />
        <DonorStatCard
          icon={DollarSign}
          title="Total Donated"
          value={`₨${(stats.totalAmountDonated / 1000).toFixed(0)}K`}
          change={15.7}
          changeType="increase"
          color="from-violet-500 to-purple-500"
          delay={0.3}
          isDark={isDark}
        />
        <DonorStatCard
          icon={Shield}
          title="Verified Donors"
          value={stats.verifiedDonors}
          change={5.2}
          changeType="increase"
          color="from-amber-500 to-orange-500"
          delay={0.4}
          isDark={isDark}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <EnhancedDonorStatBox
          icon={Gift}
          title="Total Donations"
          value={stats.totalDonations}
          color="from-blue-600 to-cyan-500"
          delay={0.5}
          index={0}
          isDark={isDark}
        />
        <EnhancedDonorStatBox
          icon={UserX}
          title="Anonymous Donors"
          value={stats.anonymousDonors}
          color="from-emerald-500 to-green-500"
          delay={0.6}
          index={1}
          isDark={isDark}
        />
        <EnhancedDonorStatBox
          icon={Crown}
          title="Platinum Donors"
          value={stats.platinumDonors}
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
              placeholder="Search donors by name, email, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4 p-4 border rounded-lg bg-opacity-50"
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
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {statusOptions.map(option => (
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
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
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

                {/* Tier Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tier
                  </label>
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {tierOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Payment Method Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Payment Method
                  </label>
                  <select
                    value={selectedPayment}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {paymentOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Preferred Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {categoryOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    First Donation Date
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm ${
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
                  Showing {filteredDonors.length} of {donors.length} donors
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
            Donors Management
          </h3>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddDonorModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold"
            >
              <UserPlus size={18} />
              Add Donor
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

      {/* Donors Table */}
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
                }`}>Donor</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Contact</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Donation Info</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Status</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Assigned To</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonors.map((donor, index) => (
                <motion.tr
                  key={donor.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b ${
                    isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
                  } transition-colors group`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        donor.anonymous 
                          ? 'bg-gradient-to-br from-gray-500 to-gray-700' 
                          : 'bg-gradient-to-br from-blue-500 to-cyan-400'
                      }`}>
                        {donor.anonymous ? <UserX size={18} /> : donor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className={`font-semibold group-hover:text-blue-600 transition-colors ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {donor.anonymous ? 'Anonymous' : donor.name}
                          {donor.anonymous && (
                            <Shield size={12} className="inline ml-1 text-gray-400" />
                          )}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {donor.id} • {donor.preferredCategory}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {donor.anonymous ? 'Identity protected' : donor.paymentMethod}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      {!donor.anonymous && (
                        <>
                          <div className="flex items-center gap-2">
                            <Mail size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {donor.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {donor.phone}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {donor.anonymous ? 'Location hidden' : donor.address}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Donated:</span>
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          ₨{donor.totalDonated.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Donations:</span>
                        <span className="font-semibold text-emerald-600">
                          {donor.totalDonations}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Avg Donation:</span>
                        <span className="font-semibold text-blue-600">
                          ₨{donor.avgDonationAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Engagement Level</span>
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{donor.completionRate}%</span>
                        </div>
                        <ProgressBar percentage={donor.completionRate} isDark={isDark} />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <DonorStatusBadge status={donor.status} isDark={isDark} />
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Joined: {donor.firstDonationDate}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Last: {donor.lastDonationDate || 'Never'}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {getAdminName(donor.assignee)}
                        </div>
                        {donor.forwardingHistory.length > 0 && (
                          <div className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                            <Clock size={12} className="inline mr-1" />
                            {donor.forwardingHistory.length} forward{donor.forwardingHistory.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      <TierBadge tier={donor.tier} isDark={isDark} />
                      <VerificationBadge status={donor.verificationStatus} isDark={isDark} />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleViewDonor(donor)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded transition-colors ${
                          isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                        }`}
                        title="View Details"
                      >
                        <Eye size={16} className={isDark ? "text-gray-300" : "text-gray-600"} />
                      </motion.button>
                      {!donor.anonymous && (
                        <motion.button
                          onClick={() => handleEditDonor(donor)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-2 rounded transition-colors ${
                            isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          }`}
                          title="Edit"
                        >
                          <Edit size={16} className={isDark ? "text-gray-300" : "text-gray-600"} />
                        </motion.button>
                      )}
                      
                      {/* More Actions Dropdown */}
                      <div className="relative">
                        <motion.button
                          onClick={() => toggleActionMenu(donor.id)}
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
                          {actionMenu === donor.id && (
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
                                  onClick={() => handleOpenForwardModal(donor)}
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
                                    handleStatusChange(donor.id, 'Active');
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  Mark Active
                                </button>
                                <button
                                  onClick={() => {
                                    handleVerificationChange(donor.id, 'Verified');
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  Verify Donor
                                </button>
                                {!donor.anonymous && (
                                  <button
                                    onClick={() => {
                                      alert(`Sending email to ${donor.email}`);
                                      setActionMenu(null);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                      isDark 
                                        ? 'hover:bg-gray-700 text-gray-300' 
                                        : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    Send Thank You
                                  </button>
                                )}
                                <hr className={isDark ? 'border-gray-700' : 'border-gray-200'} />
                                <button
                                  onClick={() => {
                                    handleDeleteDonor(donor.id);
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-rose-600 text-rose-300' 
                                      : 'hover:bg-rose-100 text-rose-700'
                                  }`}
                                >
                                  Delete
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

          {filteredDonors.length === 0 && (
            <div className="text-center py-12">
              <Users size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                No donors found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Donor Detail Modal */}
      <AnimatePresence>
        {showDonorModal && selectedDonor && (
          <DonorDetailModal
            donor={selectedDonor}
            isDark={isDark}
            onClose={closeModals}
            onStatusChange={handleStatusChange}
            onVerificationChange={handleVerificationChange}
            availableAdmins={availableAdmins}
          />
        )}
      </AnimatePresence>

      {/* Add/Edit Donor Modal */}
      <AnimatePresence>
        {showAddDonorModal && (
          <AddDonorModal
            isDark={isDark}
            donor={editingDonor}
            onClose={closeModals}
            onAddDonor={handleAddDonor}
            onUpdateDonor={handleUpdateDonor}
          />
        )}
      </AnimatePresence>

      {/* Forward Modal */}
      <AnimatePresence>
        {showForwardModal && donorToForward && (
          <ForwardModal
            isDark={isDark}
            donor={donorToForward}
            onClose={closeModals}
            onForward={handleForwardRequest}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// UPDATED Donor Detail Modal Component with fixed blur panel
const DonorDetailModal = ({ donor, isDark, onClose, onStatusChange, onVerificationChange, availableAdmins }) => {
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
              Donor Details - {donor.anonymous ? 'Anonymous' : donor.name}
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
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>
                    {donor.anonymous ? 'Anonymous' : donor.name}
                    {donor.anonymous && <Shield size={16} className="inline ml-2 text-gray-400" />}
                  </p>
                </div>
                {!donor.anonymous && (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Email
                      </label>
                      <p className={isDark ? 'text-white' : 'text-gray-900'}>{donor.email}</p>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Phone
                      </label>
                      <p className={isDark ? 'text-white' : 'text-gray-900'}>{donor.phone}</p>
                    </div>
                  </>
                )}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Address
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>
                    {donor.anonymous ? 'Location hidden for privacy' : donor.address}
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Preferred Category
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {donor.preferredCategory}
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
                      {getAdminName(donor.assignee)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Donation Information */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Donation Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Total Donated
                    </label>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ₨{donor.totalDonated.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Total Donations
                    </label>
                    <p className="text-2xl font-bold text-emerald-600">
                      {donor.totalDonations}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Average Donation
                    </label>
                    <p className="text-lg font-bold text-blue-600">
                      ₨{donor.avgDonationAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Largest Donation
                    </label>
                    <p className="text-lg font-bold text-violet-600">
                      ₨{donor.largestDonation?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Engagement Level
                  </label>
                  <div className="pt-1">
                    <div className={`w-full rounded-full h-3 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${donor.completionRate}%` }}
                        transition={{ duration: 1.5, type: "spring" }}
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full shadow-lg"
                      />
                    </div>
                    <div className="text-sm text-right mt-1" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                      {donor.completionRate}% Engagement
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline and Additional Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>First Donation:</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{donor.firstDonationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Last Donation:</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{donor.lastDonationDate || 'Never'}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Payment Method:</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{donor.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Status and Verification */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Status & Verification
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Current Status
                  </label>
                  <select
                    value={donor.status}
                    onChange={(e) => onStatusChange(donor.id, e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {statusOptions.filter(opt => opt !== 'All Status').map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Verification Status
                  </label>
                  <select
                    value={donor.verificationStatus}
                    onChange={(e) => onVerificationChange(donor.id, e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {verificationOptions.filter(opt => opt !== 'All Verification').map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Forwarding History */}
          {donor.forwardingHistory.length > 0 && (
            <div className="mt-6">
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Forwarding History ({donor.forwardingHistory.length})
              </h3>
              <div className="space-y-3">
                {donor.forwardingHistory.map((record, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Send size={14} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
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

          {/* Notes */}
          {donor.notes && (
            <div className="mt-6">
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Notes
              </h3>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{donor.notes}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// UPDATED Add/Edit Donor Modal Component with fixed blur panel
const AddDonorModal = ({ isDark, donor, onClose, onAddDonor, onUpdateDonor }) => {
  const isEditing = !!donor;
  const [formData, setFormData] = useState(isEditing ? donor : {
    name: '',
    email: '',
    phone: '',
    address: '',
    totalDonated: 0,
    totalDonations: 0,
    preferredCategory: 'Medical',
    status: 'Active',
    verificationStatus: 'Not Started',
    paymentMethod: 'Bank Transfer',
    anonymous: false,
    tier: 'Bronze',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      onUpdateDonor(formData);
    } else {
      onAddDonor(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
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
              {isEditing ? 'Edit Donor' : 'Add New Donor'}
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
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Anonymous Donor
                </label>
              </div>

              {!formData.anonymous && (
                <>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required={!formData.anonymous}
                      className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
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
                      required={!formData.anonymous}
                      className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
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
                      className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </>
              )}

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* Donation Information */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Donation Information
              </h3>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Preferred Category
                </label>
                <select
                  name="preferredCategory"
                  value={formData.preferredCategory}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {categoryOptions.filter(opt => opt !== 'All Categories').map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Donated (₨)
                </label>
                <input
                  type="number"
                  name="totalDonated"
                  value={formData.totalDonated}
                  onChange={handleChange}
                  min="0"
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Donations
                </label>
                <input
                  type="number"
                  name="totalDonations"
                  value={formData.totalDonations}
                  onChange={handleChange}
                  min="0"
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {paymentOptions.filter(opt => opt !== 'All Methods').map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {statusOptions.filter(opt => opt !== 'All Status').map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Verification
              </label>
              <select
                name="verificationStatus"
                value={formData.verificationStatus}
                onChange={handleChange}
                className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {verificationOptions.filter(opt => opt !== 'All Verification').map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Tier
              </label>
              <select
                name="tier"
                value={formData.tier}
                onChange={handleChange}
                className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {tierOptions.filter(opt => opt !== 'All Tiers').map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Add any notes about this donor..."
            />
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
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold"
            >
              {isEditing ? 'Update Donor' : 'Add Donor'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DonorsManagement;