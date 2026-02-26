import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
  Calendar,
  User,
  Heart,
  DollarSign,
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
  FileText,
  X,
  TrendingDown,
  TrendingUp,
  Activity,
  Award,
  Target,
  CreditCard,
  Shield,
  Users,
  Zap,
  BarChart3,
  FileCheck,
  Upload,
  Download as DownloadIcon,
  ArrowUpDown,
  Calendar as CalendarIcon,
  UserCheck,
  MailCheck,
  Settings
} from 'lucide-react';

// Enhanced Dummy data for donations with all required fields
const donationsData = [
  {
    id: 'DON-2025-001',
    donorId: 'DON-001',
    donorName: 'Anonymous',
    donorEmail: 'anonymous@email.com',
    donorPhone: 'N/A',
    recipientId: 'REC-001',
    recipientName: 'Ahmed Khan',
    recipientEmail: 'ahmed.khan@email.com',
    amount: 50000,
    currency: 'PKR',
    status: 'Completed',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Success',
    transactionId: 'TXN-001',
    donationDate: '2025-11-01',
    processedDate: '2025-11-01',
    category: 'Medical',
    description: 'Medical treatment for heart surgery',
    anonymous: true,
    maxAmountAllowed: 1000000, // Configurable max amount
    emailSent: true,
    smsSent: false,
    approver: 'Admin User',
    assignee: 'admin1',
    forwardingHistory: [
      {
        fromAdmin: 'admin2',
        toAdmin: 'admin1',
        reason: 'Large donation amount requires supervisor approval',
        timestamp: '2025-11-01T10:30:00Z'
      }
    ],
    verificationStatus: 'Verified',
    notes: 'Donor prefers to remain anonymous. Regular monthly donor.'
  },
  {
    id: 'DON-2025-002',
    donorId: 'DON-002',
    donorName: 'Sarah Ali',
    donorEmail: 'sarah.ali@email.com',
    donorPhone: '+92-300-1112222',
    recipientId: 'REC-002',
    recipientName: 'Fatima Bibi',
    recipientEmail: 'fatima.bibi@email.com',
    amount: 35000,
    currency: 'PKR',
    status: 'Completed',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Success',
    transactionId: 'TXN-002',
    donationDate: '2025-11-01',
    processedDate: '2025-11-01',
    category: 'Education',
    description: 'University tuition fees',
    anonymous: false,
    maxAmountAllowed: 1000000,
    emailSent: true,
    smsSent: true,
    approver: 'Approver 1',
    assignee: 'admin2',
    forwardingHistory: [],
    verificationStatus: 'Verified',
    notes: 'Corporate donor. Interested in education projects.'
  },
  {
    id: 'DON-2025-003',
    donorId: 'DON-003',
    donorName: 'Muhammad Hassan',
    donorEmail: 'm.hassan@email.com',
    donorPhone: '+92-301-3334444',
    recipientId: 'REC-003',
    recipientName: 'Ali Hassan',
    recipientEmail: 'ali.hassan@email.com',
    amount: 75000,
    currency: 'PKR',
    status: 'Processing',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Pending',
    transactionId: 'TXN-003',
    donationDate: '2025-11-02',
    processedDate: null,
    category: 'Emergency',
    description: 'House fire emergency funds',
    anonymous: false,
    maxAmountAllowed: 1000000,
    emailSent: false,
    smsSent: false,
    approver: null,
    assignee: 'admin3',
    forwardingHistory: [
      {
        fromAdmin: 'admin1',
        toAdmin: 'admin3',
        reason: 'Emergency case needs quick processing',
        timestamp: '2025-11-02T14:15:00Z'
      }
    ],
    verificationStatus: 'Pending',
    notes: 'Responds well to emergency relief campaigns.'
  },
  {
    id: 'DON-2025-004',
    donorId: 'DON-001',
    donorName: 'Anonymous',
    donorEmail: 'anonymous@email.com',
    donorPhone: 'N/A',
    recipientId: 'REC-004',
    recipientName: 'Zainab Malik',
    recipientEmail: 'zainab.malik@email.com',
    amount: 25000,
    currency: 'PKR',
    status: 'Completed',
    paymentMethod: 'Digital Wallet',
    paymentStatus: 'Success',
    transactionId: 'TXN-004',
    donationDate: '2025-11-02',
    processedDate: '2025-11-02',
    category: 'Food',
    description: 'Monthly food supplies',
    anonymous: true,
    maxAmountAllowed: 1000000,
    emailSent: true,
    smsSent: false,
    approver: 'Admin User',
    assignee: 'admin1',
    forwardingHistory: [],
    verificationStatus: 'Verified',
    notes: 'Anonymous donation for food supplies.'
  },
  {
    id: 'DON-2025-005',
    donorId: 'DON-004',
    donorName: 'Ayesha Khan',
    donorEmail: 'ayesha.khan@email.com',
    donorPhone: '+92-302-5556666',
    recipientId: 'REC-005',
    recipientName: 'Hassan Ahmed',
    recipientEmail: 'hassan.ahmed@email.com',
    amount: 60000,
    currency: 'PKR',
    status: 'Processing',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Pending',
    transactionId: 'TXN-005',
    donationDate: '2025-11-03',
    processedDate: null,
    category: 'Medical',
    description: 'Home renovation for medical needs',
    anonymous: false,
    maxAmountAllowed: 1000000,
    emailSent: false,
    smsSent: true,
    approver: null,
    assignee: 'admin2',
    forwardingHistory: [],
    verificationStatus: 'Pending',
    notes: 'Follow up required for payment confirmation.'
  },
  {
    id: 'DON-2025-006',
    donorId: 'DON-005',
    donorName: 'Ali Raza',
    donorEmail: 'ali.raza@email.com',
    donorPhone: '+92-303-7778888',
    recipientId: 'REC-001',
    recipientName: 'Ahmed Khan',
    recipientEmail: 'ahmed.khan@email.com',
    amount: 45000,
    currency: 'PKR',
    status: 'Rejected',
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Failed',
    transactionId: 'TXN-006',
    donationDate: '2025-10-30',
    processedDate: '2025-10-30',
    category: 'Medical',
    description: 'Additional medical support',
    anonymous: false,
    maxAmountAllowed: 1000000,
    emailSent: true,
    smsSent: true,
    approver: 'Approver 2',
    assignee: 'admin1',
    forwardingHistory: [
      {
        fromAdmin: 'admin3',
        toAdmin: 'admin1',
        reason: 'Payment failed multiple times',
        timestamp: '2025-10-30T16:45:00Z'
      }
    ],
    verificationStatus: 'Rejected',
    notes: 'Payment failed due to insufficient funds.'
  },
  {
    id: 'DON-2025-007',
    donorId: 'DON-006',
    donorName: 'Fatima Noor',
    donorEmail: 'fatima.noor@email.com',
    donorPhone: '+92-304-9990000',
    recipientId: 'REC-002',
    recipientName: 'Fatima Bibi',
    recipientEmail: 'fatima.bibi@email.com',
    amount: 28000,
    currency: 'PKR',
    status: 'Validated',
    paymentMethod: 'Digital Wallet',
    paymentStatus: 'Success',
    transactionId: 'TXN-007',
    donationDate: '2025-11-02',
    processedDate: '2025-11-02',
    category: 'Education',
    description: 'Books and stationery',
    anonymous: false,
    maxAmountAllowed: 1000000,
    emailSent: true,
    smsSent: false,
    approver: 'Co-Approver 1',
    assignee: 'admin3',
    forwardingHistory: [],
    verificationStatus: 'Verified',
    notes: 'New donor. Very responsive to education causes.'
  },
  {
    id: 'DON-2025-008',
    donorId: 'DON-007',
    donorName: 'Bilal Ahmed',
    donorEmail: 'bilal.ahmed@email.com',
    donorPhone: '+92-305-1113333',
    recipientId: 'REC-003',
    recipientName: 'Ali Hassan',
    recipientEmail: 'ali.hassan@email.com',
    amount: 35000,
    currency: 'PKR',
    status: 'Pending-Validation',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Pending',
    transactionId: 'TXN-008',
    donationDate: '2025-11-03',
    processedDate: null,
    category: 'Emergency',
    description: 'Emergency medical supplies',
    anonymous: false,
    maxAmountAllowed: 1000000,
    emailSent: false,
    smsSent: false,
    approver: null,
    assignee: 'admin1',
    forwardingHistory: [],
    verificationStatus: 'Not Started',
    notes: 'Account under review for previous payment issues.'
  },
];

// Available admins for forwarding
const availableAdmins = [
  { id: 'admin1', name: 'Super Admin', role: 'super_admin' },
  { id: 'admin2', name: 'Approver 1', role: 'approver' },
  { id: 'admin3', name: 'Co-Approver 1', role: 'co_approver' },
  { id: 'admin4', name: 'Support Admin', role: 'support' },
  { id: 'admin5', name: 'Finance Admin', role: 'finance' }
];

// Status options based on requirements
const statusOptions = [
  'All Status',
  'Draft',
  'Pending-Validation',
  'Validated',
  'Approved',
  'Rejected',
  'Closed',
  'In-Progress',
  'Completed',
  'Processing'
];

const paymentStatusOptions = [
  'All Payment Status',
  'Success',
  'Pending',
  'Failed',
  'Refunded'
];

const paymentMethodOptions = [
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

const verificationOptions = [
  'All Verification',
  'Verified',
  'Pending',
  'Not Started',
  'Rejected'
];

// Enhanced Stat Card for Donations Management
const DonationStatCard = ({ icon: Icon, title, value, change, changeType, color, delay, isDark }) => (
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
const EnhancedDonationStatBox = ({ icon: Icon, title, value, color, delay, index, isDark }) => (
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

// Status Badge Component for Donations
const DonationStatusBadge = ({ status, isDark }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return isDark ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-700';
      case 'Approved':
        return isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700';
      case 'Validated':
        return isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700';
      case 'Processing':
        return isDark ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-700';
      case 'Pending-Validation':
        return isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-700';
      case 'In-Progress':
        return isDark ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700';
      case 'Rejected':
        return isDark ? 'bg-rose-900 text-rose-200' : 'bg-rose-100 text-rose-700';
      case 'Closed':
        return isDark ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-700';
      case 'Draft':
        return isDark ? 'bg-slate-900 text-slate-200' : 'bg-slate-100 text-slate-700';
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

// Payment Status Badge Component
const PaymentStatusBadge = ({ status, isDark }) => {
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Success':
        return isDark ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-700';
      case 'Pending':
        return isDark ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-700';
      case 'Failed':
        return isDark ? 'bg-rose-900 text-rose-200' : 'bg-rose-100 text-rose-700';
      case 'Refunded':
        return isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700';
      default:
        return isDark ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(status)}`}>
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

// Forward Modal Component for Donations
const ForwardModal = ({ isDark, donation, onClose, onForward, currentAdmin = 'admin1' }) => {
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAdmin && reason.trim()) {
      onForward(donation.id, selectedAdmin, reason.trim());
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`rounded-2xl shadow-2xl border w-full max-w-md ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Forward Donation Request
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
            {/* Donation Info */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Donation to Forward
              </label>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {donation.id} - {donation.donorName} → {donation.recipientName}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Amount: ₨{donation.amount.toLocaleString()} • Current: {getCurrentAdminName(donation.assignee)}
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
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
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
                placeholder="Explain why you're forwarding this donation request..."
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none resize-none ${
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
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

// Donations Management Main Component
const DonationsManagement = ({ isDark }) => {
  const [donations, setDonations] = useState(donationsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All Payment Status');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('All Methods');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedVerification, setSelectedVerification] = useState('All Verification');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showAddDonationModal, setShowAddDonationModal] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [donationToForward, setDonationToForward] = useState(null);
  const [maxDonationAmount, setMaxDonationAmount] = useState(1000000); // Configurable max amount

  // Filter donations based on search and filters
  const filteredDonations = useMemo(() => {
    return donations.filter(donation => {
      const matchesSearch = 
        donation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'All Status' || donation.status === selectedStatus;
      const matchesPaymentStatus = selectedPaymentStatus === 'All Payment Status' || donation.paymentStatus === selectedPaymentStatus;
      const matchesPaymentMethod = selectedPaymentMethod === 'All Methods' || donation.paymentMethod === selectedPaymentMethod;
      const matchesCategory = selectedCategory === 'All Categories' || donation.category === selectedCategory;
      const matchesVerification = selectedVerification === 'All Verification' || donation.verificationStatus === selectedVerification;
      
      const matchesDateRange = 
        (!dateRange.start || donation.donationDate >= dateRange.start) &&
        (!dateRange.end || donation.donationDate <= dateRange.end);

      return matchesSearch && matchesStatus && matchesPaymentStatus && matchesPaymentMethod && matchesCategory && matchesVerification && matchesDateRange;
    });
  }, [donations, searchTerm, selectedStatus, selectedPaymentStatus, selectedPaymentMethod, selectedCategory, selectedVerification, dateRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDonations = donations.length;
    const completedDonations = donations.filter(d => d.status === 'Completed').length;
    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    const pendingDonations = donations.filter(d => d.status === 'Pending-Validation').length;
    const successfulPayments = donations.filter(d => d.paymentStatus === 'Success').length;
    const anonymousDonations = donations.filter(d => d.anonymous).length;
    const processingDonations = donations.filter(d => d.status === 'Processing').length;

    return {
      totalDonations,
      completedDonations,
      totalAmount,
      pendingDonations,
      successfulPayments,
      anonymousDonations,
      processingDonations
    };
  }, [donations]);

  // Handle status change
  const handleStatusChange = (donationId, newStatus) => {
    setDonations(prev => prev.map(donation =>
      donation.id === donationId ? { 
        ...donation, 
        status: newStatus,
        processedDate: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : donation.processedDate
      } : donation
    ));
  };

  // Handle verification change
  const handleVerificationChange = (donationId, newVerification) => {
    setDonations(prev => prev.map(donation =>
      donation.id === donationId ? { ...donation, verificationStatus: newVerification } : donation
    ));
  };

  // Handle payment status change
  const handlePaymentStatusChange = (donationId, newPaymentStatus) => {
    setDonations(prev => prev.map(donation =>
      donation.id === donationId ? { ...donation, paymentStatus: newPaymentStatus } : donation
    ));
  };

  // Handle delete donation
  const handleDeleteDonation = (donationId) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      setDonations(prev => prev.filter(donation => donation.id !== donationId));
    }
  };

  // Handle view donation details
  const handleViewDonation = (donation) => {
    setSelectedDonation(donation);
    setShowDonationModal(true);
  };

  // Handle edit donation
  const handleEditDonation = (donation) => {
    setEditingDonation(donation);
    setShowAddDonationModal(true);
  };

  // Handle add new donation
  const handleAddDonation = (newDonation) => {
    const donation = {
      ...newDonation,
      id: `DON-${new Date().getFullYear()}-${String(donations.length + 1).padStart(3, '0')}`,
      donationDate: new Date().toISOString().split('T')[0],
      transactionId: `TXN-${String(donations.length + 1).padStart(3, '0')}`,
      currency: 'PKR',
      assignee: 'admin1',
      forwardingHistory: [],
      maxAmountAllowed: maxDonationAmount
    };
    
    // Validate max amount
    if (donation.amount > maxDonationAmount) {
      alert(`Donation amount exceeds maximum allowed amount of ₨${maxDonationAmount.toLocaleString()}`);
      return;
    }
    
    setDonations(prev => [...prev, donation]);
  };

  // Handle update donation
  const handleUpdateDonation = (updatedDonation) => {
    // Validate max amount
    if (updatedDonation.amount > maxDonationAmount) {
      alert(`Donation amount exceeds maximum allowed amount of ₨${maxDonationAmount.toLocaleString()}`);
      return;
    }
    
    setDonations(prev => prev.map(donation =>
      donation.id === updatedDonation.id ? updatedDonation : donation
    ));
    setEditingDonation(null);
  };

  // Handle forward request
  const handleForwardRequest = (donationId, targetAdminId, reason) => {
    const currentAdmin = 'admin1';
    
    setDonations(prev => prev.map(donation => {
      if (donation.id === donationId) {
        const forwardRecord = {
          fromAdmin: currentAdmin,
          toAdmin: targetAdminId,
          reason: reason,
          timestamp: new Date().toISOString()
        };

        return {
          ...donation,
          assignee: targetAdminId,
          forwardingHistory: [...donation.forwardingHistory, forwardRecord]
        };
      }
      return donation;
    }));

    console.log(`Donation ${donationId} forwarded to ${targetAdminId} for: ${reason}`);
  };

  // Handle open forward modal
  const handleOpenForwardModal = (donation) => {
    setDonationToForward(donation);
    setShowForwardModal(true);
    setActionMenu(null);
  };

  // Send email notification
  const handleSendEmail = (donation) => {
    const emailData = {
      to: donation.donorEmail,
      subject: `Donation Confirmation - ${donation.id}`,
      body: `Thank you for your donation of ₨${donation.amount.toLocaleString()} to ${donation.recipientName}.`
    };
    
    // In real application, this would call an API
    console.log('Sending email:', emailData);
    alert(`Email sent to ${donation.donorEmail}`);
    
    // Update donation record
    setDonations(prev => prev.map(d =>
      d.id === donation.id ? { ...d, emailSent: true } : d
    ));
  };

  // Send SMS notification
  const handleSendSMS = (donation) => {
    if (donation.donorPhone && donation.donorPhone !== 'N/A') {
      // In real application, this would call an SMS API
      console.log('Sending SMS to:', donation.donorPhone);
      alert(`SMS sent to ${donation.donorPhone}`);
      
      // Update donation record
      setDonations(prev => prev.map(d =>
        d.id === donation.id ? { ...d, smsSent: true } : d
      ));
    } else {
      alert('No phone number available for this donor');
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    const data = filteredDonations.map(donation => ({
      ID: donation.id,
      Donor: donation.donorName,
      Recipient: donation.recipientName,
      Amount: donation.amount,
      Currency: donation.currency,
      Status: donation.status,
      'Payment Status': donation.paymentStatus,
      'Payment Method': donation.paymentMethod,
      Category: donation.category,
      'Donation Date': donation.donationDate,
      'Transaction ID': donation.transactionId,
      Anonymous: donation.anonymous ? 'Yes' : 'No',
      'Email Sent': donation.emailSent ? 'Yes' : 'No',
      'SMS Sent': donation.smsSent ? 'Yes' : 'No',
    }));
    
    console.log('Exporting to Excel:', data);
    alert(`Exported ${filteredDonations.length} donations to Excel`);
  };

  // Export to PDF
  const handleExportPDF = () => {
    console.log('Exporting to PDF:', filteredDonations);
    alert(`Exported ${filteredDonations.length} donations to PDF`);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
    setSelectedPaymentStatus('All Payment Status');
    setSelectedPaymentMethod('All Methods');
    setSelectedCategory('All Categories');
    setSelectedVerification('All Verification');
    setDateRange({ start: '', end: '' });
  };

  // Toggle action menu
  const toggleActionMenu = (donationId) => {
    setActionMenu(actionMenu === donationId ? null : donationId);
  };

  // Close modals
  const closeModals = () => {
    setShowDonationModal(false);
    setShowAddDonationModal(false);
    setShowForwardModal(false);
    setEditingDonation(null);
    setSelectedDonation(null);
    setDonationToForward(null);
  };

  // Get admin name by ID
  const getAdminName = (adminId) => {
    const admin = availableAdmins.find(a => a.id === adminId);
    return admin ? admin.name : 'Unknown Admin';
  };

  // Update max donation amount
  const handleUpdateMaxAmount = () => {
    const newAmount = prompt('Enter new maximum donation amount:', maxDonationAmount);
    if (newAmount && !isNaN(newAmount)) {
      setMaxDonationAmount(Number(newAmount));
      alert(`Maximum donation amount updated to ₨${Number(newAmount).toLocaleString()}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <DonationStatCard
          icon={DollarSign}
          title="Total Donations"
          value={stats.totalDonations}
          change={12.5}
          changeType="increase"
          color="from-green-500 to-emerald-500"
          delay={0.1}
          isDark={isDark}
        />
        <DonationStatCard
          icon={CheckCircle}
          title="Completed"
          value={stats.completedDonations}
          change={8.3}
          changeType="increase"
          color="from-blue-500 to-cyan-500"
          delay={0.2}
          isDark={isDark}
        />
        <DonationStatCard
          icon={TrendingUp}
          title="Total Amount"
          value={`₨${(stats.totalAmount / 1000).toFixed(0)}K`}
          change={15.7}
          changeType="increase"
          color="from-violet-500 to-purple-500"
          delay={0.3}
          isDark={isDark}
        />
        <DonationStatCard
          icon={Clock}
          title="Pending Validation"
          value={stats.pendingDonations}
          change={-5.2}
          changeType="decrease"
          color="from-amber-500 to-orange-500"
          delay={0.4}
          isDark={isDark}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <EnhancedDonationStatBox
          icon={CreditCard}
          title="Successful Payments"
          value={stats.successfulPayments}
          color="from-green-600 to-emerald-500"
          delay={0.5}
          index={0}
          isDark={isDark}
        />
        <EnhancedDonationStatBox
          icon={Shield}
          title="Anonymous Donations"
          value={stats.anonymousDonations}
          color="from-blue-600 to-cyan-500"
          delay={0.6}
          index={1}
          isDark={isDark}
        />
        <EnhancedDonationStatBox
          icon={Zap}
          title="Processing"
          value={stats.processingDonations}
          color="from-amber-500 to-orange-500"
          delay={0.7}
          index={2}
          isDark={isDark}
        />
      </div>

      {/* Configuration Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 shadow-2xl border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              System Configuration
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage donation settings and limits
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className={`px-4 py-2 rounded-lg border ${
              isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
            }`}>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Max Donation: <strong>₨{maxDonationAmount.toLocaleString()}</strong>
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpdateMaxAmount}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-lg font-semibold"
            >
              <Settings size={18} />
              Configure Limits
            </motion.button>
          </div>
        </div>
      </motion.div>

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
              placeholder="Search donations by ID, donor, recipient, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
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
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
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

                {/* Payment Status Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Payment Status
                  </label>
                  <select
                    value={selectedPaymentStatus}
                    onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {paymentStatusOptions.map(option => (
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
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {paymentMethodOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
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

                {/* Verification Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Verification
                  </label>
                  <select
                    value={selectedVerification}
                    onChange={(e) => setSelectedVerification(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
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
                <div className="md:col-span-2 lg:col-span-1">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Donation Date
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none text-sm ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none text-sm ${
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
                  Showing {filteredDonations.length} of {donations.length} donations
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
            Donations Management
          </h3>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddDonationModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg font-semibold"
            >
              <Plus size={18} />
              Add Donation
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold"
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

      {/* Donations Table */}
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
                }`}>Donation Info</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Parties</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Payment Details</th>
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
              {filteredDonations.map((donation, index) => (
                <motion.tr
                  key={donation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b ${
                    isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
                  } transition-colors group`}
                >
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <div className={`font-semibold group-hover:text-green-600 transition-colors ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {donation.id}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Transaction: {donation.transactionId}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {donation.donationDate}
                        </span>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                        isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {donation.category}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-3">
                      {/* Donor Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Donor
                          </span>
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {donation.anonymous ? (
                            <span className="flex items-center gap-1">
                              <Shield size={12} />
                              Anonymous
                            </span>
                          ) : (
                            donation.donorName
                          )}
                        </div>
                        {!donation.anonymous && (
                          <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            {donation.donorEmail}
                          </div>
                        )}
                      </div>

                      {/* Recipient Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Heart size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Recipient
                          </span>
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {donation.recipientName}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {donation.recipientEmail}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          ₨{donation.amount.toLocaleString()}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {donation.currency}
                        </span>
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {donation.paymentMethod}
                      </div>
                      <PaymentStatusBadge status={donation.paymentStatus} isDark={isDark} />
                      <div className="flex items-center gap-2 mt-2">
                        {donation.emailSent && (
                          <MailCheck size={12} className="text-green-500" title="Email sent" />
                        )}
                        {donation.smsSent && (
                          <Phone size={12} className="text-blue-500" title="SMS sent" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <DonationStatusBadge status={donation.status} isDark={isDark} />
                      <VerificationBadge status={donation.verificationStatus} isDark={isDark} />
                      {donation.processedDate && (
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Processed: {donation.processedDate}
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
                          {getAdminName(donation.assignee)}
                        </div>
                        {donation.forwardingHistory.length > 0 && (
                          <div className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                            <Clock size={12} className="inline mr-1" />
                            {donation.forwardingHistory.length} forward{donation.forwardingHistory.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      {donation.approver && (
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Approved by: {donation.approver}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleViewDonation(donation)}
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
                        onClick={() => handleEditDonation(donation)}
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
                          onClick={() => toggleActionMenu(donation.id)}
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
                          {actionMenu === donation.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className={`absolute right-0 top-10 w-56 rounded-lg shadow-xl border z-10 ${
                                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="p-2 space-y-1">
                                {/* Forward Action */}
                                <button
                                  onClick={() => handleOpenForwardModal(donation)}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  <Send size={14} />
                                  Forward to Admin
                                </button>

                                {/* Status Actions */}
                                <button
                                  onClick={() => {
                                    handleStatusChange(donation.id, 'Completed');
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  Mark Completed
                                </button>

                                <button
                                  onClick={() => {
                                    handleVerificationChange(donation.id, 'Verified');
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  Verify Donation
                                </button>

                                {/* Notification Actions */}
                                {!donation.emailSent && (
                                  <button
                                    onClick={() => {
                                      handleSendEmail(donation);
                                      setActionMenu(null);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                      isDark 
                                        ? 'hover:bg-gray-700 text-gray-300' 
                                        : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    Send Email Notification
                                  </button>
                                )}

                                {!donation.smsSent && donation.donorPhone && donation.donorPhone !== 'N/A' && (
                                  <button
                                    onClick={() => {
                                      handleSendSMS(donation);
                                      setActionMenu(null);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                      isDark 
                                        ? 'hover:bg-gray-700 text-gray-300' 
                                        : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    Send SMS Notification
                                  </button>
                                )}

                                <hr className={isDark ? 'border-gray-700' : 'border-gray-200'} />

                                {/* Payment Actions */}
                                <button
                                  onClick={() => {
                                    handlePaymentStatusChange(donation.id, 'Success');
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  Mark Payment Success
                                </button>

                                <hr className={isDark ? 'border-gray-700' : 'border-gray-200'} />

                                <button
                                  onClick={() => {
                                    handleDeleteDonation(donation.id);
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-rose-600 text-rose-300' 
                                      : 'hover:bg-rose-100 text-rose-700'
                                  }`}
                                >
                                  Delete Donation
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

          {filteredDonations.length === 0 && (
            <div className="text-center py-12">
              <DollarSign size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                No donations found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Donation Detail Modal */}
      <AnimatePresence>
        {showDonationModal && selectedDonation && (
          <DonationDetailModal
            donation={selectedDonation}
            isDark={isDark}
            onClose={closeModals}
            onStatusChange={handleStatusChange}
            onVerificationChange={handleVerificationChange}
            onPaymentStatusChange={handlePaymentStatusChange}
            onSendEmail={handleSendEmail}
            onSendSMS={handleSendSMS}
            availableAdmins={availableAdmins}
          />
        )}
      </AnimatePresence>

      {/* Add/Edit Donation Modal */}
      <AnimatePresence>
        {showAddDonationModal && (
          <AddDonationModal
            isDark={isDark}
            donation={editingDonation}
            onClose={closeModals}
            onAddDonation={handleAddDonation}
            onUpdateDonation={handleUpdateDonation}
            maxDonationAmount={maxDonationAmount}
          />
        )}
      </AnimatePresence>

      {/* Forward Modal */}
      <AnimatePresence>
        {showForwardModal && donationToForward && (
          <ForwardModal
            isDark={isDark}
            donation={donationToForward}
            onClose={closeModals}
            onForward={handleForwardRequest}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Donation Detail Modal Component
const DonationDetailModal = ({ 
  donation, 
  isDark, 
  onClose, 
  onStatusChange, 
  onVerificationChange, 
  onPaymentStatusChange,
  onSendEmail,
  onSendSMS,
  availableAdmins 
}) => {
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`rounded-2xl shadow-2xl border w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Donation Details - {donation.id}
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
            {/* Donation Information */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Donation Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Donation ID
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>{donation.id}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Transaction ID
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>{donation.transactionId}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Amount
                  </label>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ₨{donation.amount.toLocaleString()} {donation.currency}
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Category & Description
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>
                    <strong>{donation.category}</strong> - {donation.description}
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Donation Date
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>{donation.donationDate}</p>
                </div>
                {donation.processedDate && (
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Processed Date
                    </label>
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>{donation.processedDate}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Parties Information */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Parties Information
              </h3>
              <div className="space-y-4">
                {/* Donor Information */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Donor Information
                  </label>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {donation.anonymous ? 'Anonymous Donor' : donation.donorName}
                      {donation.anonymous && <Shield size={16} className="inline ml-2 text-gray-400" />}
                    </p>
                    {!donation.anonymous && (
                      <>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {donation.donorEmail}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {donation.donorPhone}
                        </p>
                      </>
                    )}
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Donor ID: {donation.donorId}
                    </p>
                  </div>
                </div>

                {/* Recipient Information */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Recipient Information
                  </label>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {donation.recipientName}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {donation.recipientEmail}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Recipient ID: {donation.recipientId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment and Status Information */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Payment Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Payment Method
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>{donation.paymentMethod}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Payment Status
                  </label>
                  <select
                    value={donation.paymentStatus}
                    onChange={(e) => onPaymentStatusChange(donation.id, e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="Success">Success</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onSendEmail(donation)}
                    disabled={donation.emailSent}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                      donation.emailSent
                        ? (isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-600')
                        : (isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600')
                    }`}
                  >
                    <Mail size={16} />
                    {donation.emailSent ? 'Email Sent' : 'Send Email'}
                  </button>
                  <button
                    onClick={() => onSendSMS(donation)}
                    disabled={donation.smsSent || donation.donorPhone === 'N/A'}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                      donation.smsSent
                        ? (isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-600')
                        : (isDark ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600')
                    }`}
                  >
                    <Phone size={16} />
                    {donation.smsSent ? 'SMS Sent' : 'Send SMS'}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Status & Verification
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Donation Status
                  </label>
                  <select
                    value={donation.status}
                    onChange={(e) => onStatusChange(donation.id, e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
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
                    value={donation.verificationStatus}
                    onChange={(e) => onVerificationChange(donation.id, e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
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
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Assigned To
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'
                    }`}>
                      {getAdminName(donation.assignee)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Forwarding History */}
          {donation.forwardingHistory.length > 0 && (
            <div className="mt-6">
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Forwarding History ({donation.forwardingHistory.length})
              </h3>
              <div className="space-y-3">
                {donation.forwardingHistory.map((record, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Send size={14} className={isDark ? 'text-green-400' : 'text-green-600'} />
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
          {donation.notes && (
            <div className="mt-6">
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Notes
              </h3>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{donation.notes}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Add/Edit Donation Modal Component
const AddDonationModal = ({ isDark, donation, onClose, onAddDonation, onUpdateDonation, maxDonationAmount }) => {
  const isEditing = !!donation;
  
  // Sample data for dropdowns (in real app, this would come from API)
  const donors = [
    { id: 'DON-001', name: 'Anonymous', email: 'anonymous@email.com' },
    { id: 'DON-002', name: 'Sarah Ali', email: 'sarah.ali@email.com' },
    { id: 'DON-003', name: 'Muhammad Hassan', email: 'm.hassan@email.com' },
    { id: 'DON-004', name: 'Ayesha Khan', email: 'ayesha.khan@email.com' },
    { id: 'DON-005', name: 'Ali Raza', email: 'ali.raza@email.com' },
  ];

  const recipients = [
    { id: 'REC-001', name: 'Ahmed Khan', email: 'ahmed.khan@email.com' },
    { id: 'REC-002', name: 'Fatima Bibi', email: 'fatima.bibi@email.com' },
    { id: 'REC-003', name: 'Ali Hassan', email: 'ali.hassan@email.com' },
    { id: 'REC-004', name: 'Zainab Malik', email: 'zainab.malik@email.com' },
    { id: 'REC-005', name: 'Hassan Ahmed', email: 'hassan.ahmed@email.com' },
  ];

  const [formData, setFormData] = useState(isEditing ? donation : {
    donorId: '',
    recipientId: '',
    amount: 0,
    paymentMethod: 'Bank Transfer',
    category: 'Medical',
    description: '',
    anonymous: false,
    status: 'Draft',
    paymentStatus: 'Pending',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate max amount
    if (formData.amount > maxDonationAmount) {
      alert(`Donation amount exceeds maximum allowed amount of ₨${maxDonationAmount.toLocaleString()}`);
      return;
    }

    if (isEditing) {
      onUpdateDonation(formData);
    } else {
      onAddDonation(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const selectedDonor = donors.find(d => d.id === formData.donorId);
  const selectedRecipient = recipients.find(r => r.id === formData.recipientId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`rounded-2xl shadow-2xl border w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {isEditing ? 'Edit Donation' : 'Add New Donation'}
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
            {/* Donor Information */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Donor Information
              </h3>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Select Donor *
                </label>
                <select
                  name="donorId"
                  value={formData.donorId}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select a donor...</option>
                  {donors.map(donor => (
                    <option key={donor.id} value={donor.id}>
                      {donor.name} ({donor.email})
                    </option>
                  ))}
                </select>
              </div>

              {selectedDonor && (
                <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedDonor.name}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedDonor.email}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Anonymous Donation
                </label>
              </div>
            </div>

            {/* Recipient Information */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Recipient Information
              </h3>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Select Recipient *
                </label>
                <select
                  name="recipientId"
                  value={formData.recipientId}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">Select a recipient...</option>
                  {recipients.map(recipient => (
                    <option key={recipient.id} value={recipient.id}>
                      {recipient.name} ({recipient.email})
                    </option>
                  ))}
                </select>
              </div>

              {selectedRecipient && (
                <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedRecipient.name}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {selectedRecipient.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Donation Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Donation Details
              </h3>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Amount (PKR) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="1"
                  max={maxDonationAmount}
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Maximum allowed: ₨{maxDonationAmount.toLocaleString()}
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
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
            </div>

            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Payment Information
              </h3>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {paymentMethodOptions.filter(opt => opt !== 'All Methods').map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Initial Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
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
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Enter donation purpose or description..."
              className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
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
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg font-semibold"
            >
              {isEditing ? 'Update Donation' : 'Add Donation'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DonationsManagement;