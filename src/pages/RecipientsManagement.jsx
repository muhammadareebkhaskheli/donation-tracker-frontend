import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  FileUp,
  Shield,
  AlertCircle,
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
  FileCheck,
  Upload,
  File,
  Paperclip,
  Zap,
  Sparkles,
  Star,
  Heart,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';

// Enhanced Dummy data for recipients with 7 people
const recipientsData = [
  {
    id: 'REC-001',
    name: 'Ahmed Khan',
    email: 'ahmed.khan@email.com',
    phone: '+92-300-1234567',
    address: 'Lahore, Pakistan',
    category: 'Medical',
    requiredAmount: 500000,
    donatedAmount: 325000,
    balanceAmount: 175000,
    status: 'Approved',
    registrationDate: '2024-01-15',
    lastDonationDate: '2024-11-01',
    documents: [
      { name: 'id_card.pdf', size: '2.1 MB', type: 'application/pdf' },
      { name: 'medical_report.pdf', size: '1.5 MB', type: 'application/pdf' }
    ],
    verificationStatus: 'Verified',
    approver: 'Admin User',
    completionRate: 65,
    description: 'Medical treatment for heart surgery',
    urgency: 'High',
    age: 45,
    familyMembers: 4,
    assignee: 'admin1',
    forwardingHistory: [
      {
        fromAdmin: 'admin2',
        toAdmin: 'admin1',
        reason: 'Medical expertise required for heart surgery case',
        timestamp: '2024-01-20T14:30:00Z'
      }
    ]
  },
  {
    id: 'REC-002',
    name: 'Fatima Bibi',
    email: 'fatima.bibi@email.com',
    phone: '+92-301-2345678',
    address: 'Karachi, Pakistan',
    category: 'Education',
    requiredAmount: 200000,
    donatedAmount: 150000,
    balanceAmount: 50000,
    status: 'Pending-Validation',
    registrationDate: '2024-02-20',
    lastDonationDate: '2024-10-28',
    documents: [
      { name: 'id_card.pdf', size: '2.0 MB', type: 'application/pdf' },
      { name: 'fee_structure.pdf', size: '0.8 MB', type: 'application/pdf' }
    ],
    verificationStatus: 'Pending',
    approver: 'Approver 1',
    completionRate: 75,
    description: 'University tuition fees',
    urgency: 'Medium',
    age: 22,
    familyMembers: 6,
    assignee: 'admin2',
    forwardingHistory: []
  },
  {
    id: 'REC-003',
    name: 'Ali Hassan',
    email: 'ali.hassan@email.com',
    phone: '+92-302-3456789',
    address: 'Islamabad, Pakistan',
    category: 'Emergency',
    requiredAmount: 300000,
    donatedAmount: 120000,
    balanceAmount: 180000,
    status: 'Pending-Validation',
    registrationDate: '2024-03-10',
    lastDonationDate: null,
    documents: [
      { name: 'id_card.pdf', size: '1.9 MB', type: 'application/pdf' }
    ],
    verificationStatus: 'Not Started',
    approver: null,
    completionRate: 40,
    description: 'House fire emergency funds',
    urgency: 'High',
    age: 35,
    familyMembers: 5,
    assignee: 'admin3',
    forwardingHistory: [
      {
        fromAdmin: 'admin1',
        toAdmin: 'admin3',
        reason: 'Emergency case needs specialized handling',
        timestamp: '2024-03-15T09:15:00Z'
      }
    ]
  },
  {
    id: 'REC-004',
    name: 'Zainab Malik',
    email: 'zainab.malik@email.com',
    phone: '+92-303-4567890',
    address: 'Rawalpindi, Pakistan',
    category: 'Food',
    requiredAmount: 150000,
    donatedAmount: 75000,
    balanceAmount: 75000,
    status: 'In-Progress',
    registrationDate: '2024-04-05',
    lastDonationDate: '2024-10-25',
    documents: [
      { name: 'id_card.pdf', size: '2.2 MB', type: 'application/pdf' },
      { name: 'utility_bills.pdf', size: '1.1 MB', type: 'application/pdf' }
    ],
    verificationStatus: 'Verified',
    approver: 'Admin User',
    completionRate: 50,
    description: 'Monthly food supplies',
    urgency: 'Medium',
    age: 28,
    familyMembers: 3,
    assignee: 'admin1',
    forwardingHistory: []
  },
  {
    id: 'REC-005',
    name: 'Hassan Ahmed',
    email: 'hassan.ahmed@email.com',
    phone: '+92-304-5678901',
    address: 'Faisalabad, Pakistan',
    category: 'Housing',
    requiredAmount: 400000,
    donatedAmount: 100000,
    balanceAmount: 300000,
    status: 'Rejected',
    registrationDate: '2024-05-12',
    lastDonationDate: null,
    documents: [
      { name: 'id_card.pdf', size: '2.0 MB', type: 'application/pdf' },
      { name: 'house_documents.pdf', size: '3.2 MB', type: 'application/pdf' }
    ],
    verificationStatus: 'Rejected',
    approver: 'Approver 2',
    completionRate: 25,
    description: 'Home renovation',
    urgency: 'Low',
    age: 50,
    familyMembers: 7,
    assignee: 'admin1',
    forwardingHistory: [
      {
        fromAdmin: 'admin3',
        toAdmin: 'admin1',
        reason: 'Escalation for complex housing case review',
        timestamp: '2024-05-18T16:45:00Z'
      }
    ]
  },
  {
    id: 'REC-006',
    name: 'Sara Javed',
    email: 'sara.javed@email.com',
    phone: '+92-305-6789012',
    address: 'Multan, Pakistan',
    category: 'Education',
    requiredAmount: 180000,
    donatedAmount: 90000,
    balanceAmount: 90000,
    status: 'Pending-Validation',
    registrationDate: '2024-06-08',
    lastDonationDate: '2024-10-20',
    documents: [
      { name: 'id_card.pdf', size: '1.8 MB', type: 'application/pdf' },
      { name: 'admission_letter.pdf', size: '1.2 MB', type: 'application/pdf' }
    ],
    verificationStatus: 'Verified',
    approver: 'Admin User',
    completionRate: 50,
    description: 'College tuition fees for engineering program',
    urgency: 'Medium',
    age: 20,
    familyMembers: 5,
    assignee: 'admin2',
    forwardingHistory: []
  },
  {
    id: 'REC-007',
    name: 'Omar Farooq',
    email: 'omar.farooq@email.com',
    phone: '+92-306-7890123',
    address: 'Peshawar, Pakistan',
    category: 'Medical',
    requiredAmount: 350000,
    donatedAmount: 175000,
    balanceAmount: 175000,
    status: 'Pending-Validation',
    registrationDate: '2024-07-15',
    lastDonationDate: '2024-10-15',
    documents: [
      { name: 'id_card.pdf', size: '2.3 MB', type: 'application/pdf' },
      { name: 'medical_bills.pdf', size: '2.8 MB', type: 'application/pdf' }
    ],
    verificationStatus: 'Pending',
    approver: 'Approver 1',
    completionRate: 50,
    description: 'Cancer treatment and chemotherapy',
    urgency: 'High',
    age: 38,
    familyMembers: 4,
    assignee: 'admin3',
    forwardingHistory: [
      {
        fromAdmin: 'admin1',
        toAdmin: 'admin3',
        reason: 'Specialized medical case handling required',
        timestamp: '2024-07-20T11:20:00Z'
      }
    ]
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
  'In-Progress'
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

const urgencyOptions = [
  'All Urgency',
  'High',
  'Medium',
  'Low'
];

// Shake animation variants - GUARANTEED WORKING
const shakeAnimation = {
  initial: {
    x: 0
  },
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

// Confirmation Dialog Component
const ConfirmationDialog = ({ isDark, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
      style={{ margin: 0, padding: 0 }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25 }}
        className={`rounded-3xl w-full max-w-md mx-4 ${isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-white via-white to-gray-50'
          }`}
        style={{
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                {title}
              </h2>
              <p className="text-violet-100 text-sm font-medium">
                Please confirm your action
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onCancel}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            >
              <X size={20} className="text-white" />
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          <p className={`text-base font-medium mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {message}
          </p>

          <div className="flex gap-3 flex-col sm:flex-row">
            <motion.button
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 px-6 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${isDark
                ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
            >
              {cancelText}
            </motion.button>
            <motion.button
              onClick={onConfirm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold shadow-xl"
            >
              {confirmText}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Success Dialog Component
const SuccessDialog = ({ isDark, title, message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
      style={{ margin: 0, padding: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25 }}
        className={`rounded-3xl w-full max-w-md mx-4 ${isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-white via-white to-gray-50'
          }`}
        style={{
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 bg-gradient-to-r from-emerald-600 to-green-600 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                {title}
              </h2>
              <p className="text-emerald-100 text-sm font-medium">
                Action completed successfully
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            >
              <X size={20} className="text-white" />
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="p-3 bg-emerald-100 rounded-full"
            >
              <CheckCircle size={48} className="text-emerald-600" />
            </motion.div>
          </div>
          <p className={`text-base font-medium mb-6 text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {message}
          </p>

          <div className="flex justify-center">
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl text-sm font-semibold shadow-xl"
            >
              Okay
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Status Badge Component
const StatusBadge = ({ status, isDark }) => {
  const getStatusConfig = (status) => {
    const configs = {
      'Approved': { gradient: 'from-emerald-500 to-green-500', icon: CheckCircle },
      'Validated': { gradient: 'from-blue-500 to-cyan-500', icon: Shield },
      'Pending-Validation': { gradient: 'from-amber-500 to-orange-500', icon: Clock },
      'In-Progress': { gradient: 'from-purple-500 to-pink-500', icon: Activity },
      'Rejected': { gradient: 'from-rose-500 to-red-500', icon: XCircle },
      'Closed': { gradient: 'from-gray-500 to-gray-600', icon: CheckCircle },
      'Draft': { gradient: 'from-slate-500 to-slate-600', icon: FileText },
    };
    return configs[status] || { gradient: 'from-gray-500 to-gray-600', icon: FileText };
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gradient-to-r ${config.gradient} text-white shadow-lg`}
    >
      <Icon size={14} />
      {status}
    </motion.div>
  );
};

// Urgency Badge Component
const UrgencyBadge = ({ urgency, isDark }) => {
  const getUrgencyConfig = (urgency) => {
    const configs = {
      'High': { bg: 'bg-rose-500/20', text: 'text-rose-600', border: 'border-rose-500/30', icon: AlertTriangle },
      'Medium': { bg: 'bg-amber-500/20', text: 'text-amber-600', border: 'border-amber-500/30', icon: Zap },
      'Low': { bg: 'bg-emerald-500/20', text: 'text-emerald-600', border: 'border-emerald-500/30', icon: CheckCircle },
    };
    return configs[urgency] || configs['Medium'];
  };

  const config = getUrgencyConfig(urgency);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg ${config.bg} ${config.text} border ${config.border}`}>
      <Icon size={12} />
      {urgency}
    </div>
  );
};

// Simpler Continuous Progress Circle Component - Fixed Percentage Text
const ProgressCircle = ({ percentage, size = 80, isDark }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 75) return '#10b981';
    if (percentage >= 50) return '#3b82f6';
    if (percentage >= 25) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDark ? '#374151' : '#e5e7eb'}
          strokeWidth="6"
          fill="none"
        />
        {/* Animated progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: strokeDashoffset,
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.5
          }}
          strokeLinecap="round"
        />
      </svg>

      {/* Fixed percentage text - No animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};

// MAIN RECIPIENT CARD COMPONENT - FIXED CORNERS AND ACTION MENU
const RecipientCard = ({ recipient, isDark, onView, onEdit, onDelete, onForward, onStatusChange, onApprove, index }) => {
  const [showActions, setShowActions] = useState(false);
  const menuRef = React.useRef(null);
  const buttonRef = React.useRef(null);

  const getCategoryIcon = (category) => {
    const icons = {
      'Medical': Heart,
      'Education': Award,
      'Emergency': AlertTriangle,
      'Food': Users,
      'Housing': Shield,
    };
    return icons[category] || Users;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Medical': 'from-rose-500 to-pink-600',
      'Education': 'from-blue-500 to-cyan-600',
      'Emergency': 'from-amber-500 to-orange-600',
      'Food': 'from-emerald-500 to-teal-600',
      'Housing': 'from-purple-500 to-violet-600',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const CategoryIcon = getCategoryIcon(recipient.category);

  // Close menu when clicking outside - FIXED VERSION
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showActions &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  const handleMenuAction = (action) => {
    action();
    setShowActions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.5, type: "spring" }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative rounded-3xl overflow-visible ${isDark
        ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-white via-white to-gray-50'
        }`}
      style={{
        boxShadow: isDark
          ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          : '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.03)'
      }}
    >
      {/* Gradient Header with Category - REMOVED ROUNDED CORNERS FROM TOP */}
      <div className={`relative p-4 sm:p-6 bg-gradient-to-r ${getCategoryColor(recipient.category)} overflow-visible rounded-t-3xl`}>
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-10 rounded-t-3xl"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            {/* Avatar - FIXED ANIMATION */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl font-bold shadow-xl border-2 border-white/30"
            >
              {recipient.name.split(' ').map(n => n[0]).join('')}
            </motion.div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">
                {recipient.name}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white/90 text-xs font-medium bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full truncate">
                  {recipient.id}
                </span>
                <div className="flex items-center gap-1.5 text-white/90 text-xs font-medium bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                  <CategoryIcon size={12} className="hidden xs:block" />
                  <span className="truncate">{recipient.category}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Menu - FIXED Z-INDEX ISSUE */}
          <div className="relative">
            <motion.button
              ref={buttonRef}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-1.5 sm:p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors z-40 relative"
            >
              <MoreVertical size={18} className="text-white sm:w-5 sm:h-5" />
            </motion.button>

            <AnimatePresence>
              {showActions && (
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className={`absolute right-0 top-10 sm:top-12 w-48 sm:w-56 rounded-2xl overflow-visible z-[9999] ${isDark ? 'bg-gray-800' : 'bg-white'
                    }`}
                  style={{
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4), 0 10px 20px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {/* Menu Content */}
                  <div className="p-2 space-y-1 relative z-[9999]">
                    <button
                      onClick={() => handleMenuAction(() => onView(recipient))}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 sm:gap-3 ${isDark ? 'hover:bg-blue-500/20 text-gray-300' : 'hover:bg-blue-100 text-gray-700'
                        }`}
                    >
                      <Eye size={16} />
                      View Details
                    </button>

                    {/* Approve Button - Only show for pending validation recipients */}
                    {(recipient.status === 'Pending-Validation' || recipient.status === 'Validated') && (
                      <button
                        onClick={() => handleMenuAction(() => onApprove(recipient))}
                        className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 sm:gap-3 ${isDark ? 'hover:bg-emerald-500/20 text-gray-300' : 'hover:bg-emerald-100 text-gray-700'
                          }`}
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                    )}

                    <button
                      onClick={() => handleMenuAction(() => onEdit(recipient))}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 sm:gap-3 ${isDark ? 'hover:bg-amber-500/20 text-gray-300' : 'hover:bg-amber-100 text-gray-700'
                        }`}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleMenuAction(() => onForward(recipient))}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 sm:gap-3 ${isDark ? 'hover:bg-violet-500/20 text-gray-300' : 'hover:bg-violet-100 text-gray-700'
                        }`}
                    >
                      <Send size={16} />
                      Forward
                    </button>
                    <div className={`my-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
                    <button
                      onClick={() => handleMenuAction(() => onDelete(recipient))}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 sm:gap-3 ${isDark ? 'hover:bg-rose-500/20 text-rose-400' : 'hover:bg-rose-100 text-rose-700'
                        }`}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Rest of the card content remains the same */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Description */}
        <div>
          <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} line-clamp-2`}>
            {recipient.description}
          </p>
        </div>

        {/* Status & Urgency Row */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <StatusBadge status={recipient.status} isDark={isDark} />
          <UrgencyBadge urgency={recipient.urgency} isDark={isDark} />
        </div>

        {/* Contact Information */}
        <div className={`p-3 sm:p-4 rounded-2xl space-y-2 sm:space-y-3 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
          <div className="flex items-center gap-2 sm:gap-3">
            <Mail size={14} className="text-blue-500 flex-shrink-0" />
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} truncate`}>
              {recipient.email}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Phone size={14} className="text-emerald-500 flex-shrink-0" />
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} truncate`}>
              {recipient.phone}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <MapPin size={14} className="text-rose-500 flex-shrink-0" />
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} truncate`}>
              {recipient.address}
            </span>
          </div>
        </div>

        {/* Financial Info & Progress */}
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
            <div className="flex justify-between items-center">
              <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Required
              </span>
              <span className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'} truncate ml-2`}>
                ₨{(recipient.requiredAmount / 1000).toFixed(0)}K
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Donated
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-500 truncate ml-2">
                ₨{(recipient.donatedAmount / 1000).toFixed(0)}K
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Balance
              </span>
              <span className="text-sm sm:text-base font-bold text-rose-500 truncate ml-2">
                ₨{(recipient.balanceAmount / 1000).toFixed(0)}K
              </span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <ProgressCircle percentage={recipient.completionRate} size={80} isDark={isDark} />
          </div>
        </div>

        {/* Additional Info Row */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className={`p-2 sm:p-3 rounded-xl text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Age
            </p>
            <p className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {recipient.age}
            </p>
          </div>
          <div className={`p-2 sm:p-3 rounded-xl text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Family
            </p>
            <p className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {recipient.familyMembers}
            </p>
          </div>
        </div>

        {/* Assigned Admin & Documents */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
            }`}>
            <UserCheck size={12} className="flex-shrink-0" />
            <span className="truncate max-w-[80px] xs:max-w-[100px] sm:max-w-none">
              {availableAdmins.find(a => a.id === recipient.assignee)?.name || 'Unknown'}
            </span>
          </div>
          <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium ${isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'
            }`}>
            <FileText size={12} className="flex-shrink-0" />
            {recipient.documents.length} Docs
          </div>
        </div>

        {/* Registration Date */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <Calendar size={12} className={`flex-shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className={isDark ? 'text-gray-500' : 'text-gray-500'} style={{ fontSize: '0.7rem' }}>
            Registered: {recipient.registrationDate}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Modern Stat Card Component with smaller icons
const ModernStatCard = ({ icon: Icon, title, value, change, changeType, gradient, delay, isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, type: "spring", stiffness: 100 }}
    whileHover={{ y: -12, transition: { duration: 0.3 } }}
    className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-7 overflow-hidden group cursor-pointer ${isDark
      ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
      : 'bg-gradient-to-br from-white via-white to-gray-50'
      }`}
    style={{
      boxShadow: isDark
        ? '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        : '0 10px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03)'
    }}
  >
    <motion.div
      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.15] transition-opacity duration-700`}
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 90, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
    />

    <div className="relative z-10 flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold mb-1 sm:mb-2 tracking-wide uppercase ${isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
          {title}
        </p>
        <motion.h3
          className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </motion.h3>
        {change && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${changeType === 'increase'
              ? 'bg-emerald-500/20 text-emerald-600'
              : 'bg-rose-500/20 text-rose-600'
              }`}>
              {changeType === 'increase' ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              <span>{change}%</span>
            </div>
          </motion.div>
        )}
      </div>

      <motion.div
        whileHover={{ rotate: 15, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400 }}
        className="relative flex-shrink-0"
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl relative overflow-hidden`}
          style={{
            background: gradient.includes('blue') ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.15))' :
              gradient.includes('emerald') ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))' :
                gradient.includes('amber') ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.15))' :
                  'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.15))',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Icon
            size={20}
            strokeWidth={2.5}
            className={gradient.includes('blue') ? 'text-blue-500' :
              gradient.includes('emerald') ? 'text-emerald-500' :
                gradient.includes('amber') ? 'text-amber-500' : 'text-violet-500'}
          />
        </motion.div>
      </motion.div>
    </div>
  </motion.div>
);

// Forward Modal Component - FIXED BACKDROP
const ForwardModal = ({ isDark, recipient, onClose, onForward, currentAdmin = 'admin1' }) => {
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [reason, setReason] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);

  const validateForm = () => {
    const errors = {};
    const shake = [];

    if (!selectedAdmin) {
      errors.selectedAdmin = 'Please select an admin to forward to';
      shake.push('selectedAdmin');
    }
    if (!reason.trim()) {
      errors.reason = 'Please provide a reason for forwarding';
      shake.push('reason');
    }

    // Address validation - CANNOT START WITH NUMBER, ALLOW LIMITED SPECIAL CHARS
    const isValidAddress = (address) => {
      // Check if address starts with a letter
      if (/^\d/.test(address.trim())) {
        return false;
      }
      
      // Check if address contains only allowed characters
      const addressRegex = /^[A-Za-z][A-Za-z0-9\s\-_/,'."]*$/;
      return addressRegex.test(address.trim());
    };

    setFieldErrors(errors);
    setShakeFields(shake);

    // Trigger shake animation for invalid fields
    if (shake.length > 0) {
      setTimeout(() => {
        setShakeFields([]);
      }, 600);
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onForward(recipient.id, selectedAdmin, reason.trim());
    }
  };

  const handleFieldChange = (field, value) => {
    if (field === 'selectedAdmin') setSelectedAdmin(value);
    if (field === 'reason') setReason(value);

    // Clear error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      style={{ margin: 0, padding: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25 }}
        className={`rounded-3xl w-full max-w-md mx-4 ${isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-white via-white to-gray-50'
          }`}
        style={{
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
          maxHeight: 'calc(100vh - 2rem)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-4 sm:p-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                Forward Request
              </h2>
              <p className="text-violet-100 text-xs sm:text-sm font-medium">
                Transfer recipient to another admin
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            >
              <X size={18} className="text-white" />
            </motion.button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                Recipient Details
              </label>
              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                }`}>
                <p className={`text-sm sm:text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {recipient.name}
                </p>
                <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {recipient.id} • {recipient.category}
                </p>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                Forward To Admin *
              </label>
              <div className="overflow-visible">
                <motion.div
                  animate={shakeFields.includes('selectedAdmin') ? "shake" : "initial"}
                  variants={shakeAnimation}
                  className="overflow-visible"
                >
                  <select
                    value={selectedAdmin}
                    onChange={(e) => handleFieldChange('selectedAdmin', e.target.value)}
                    required
                    className={`w-full p-3 sm:p-4 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                      } ${fieldErrors.selectedAdmin ? 'border-rose-500' : ''}`}
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
                </motion.div>
              </div>
              {fieldErrors.selectedAdmin && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-rose-600 text-xs font-medium mt-1"
                >
                  <AlertCircle size={12} />
                  {fieldErrors.selectedAdmin}
                </motion.div>
              )}
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                Reason for Forwarding *
              </label>
              <div className="overflow-visible">
                <motion.div
                  animate={shakeFields.includes('reason') ? "shake" : "initial"}
                  variants={shakeAnimation}
                  className="overflow-visible"
                >
                  <textarea
                    value={reason}
                    onChange={(e) => handleFieldChange('reason', e.target.value)}
                    required
                    rows="3"
                    placeholder="Explain why you're forwarding this recipient request..."
                    className={`w-full p-3 sm:p-4 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none resize-none transition-all text-sm font-medium ${isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                      } ${fieldErrors.reason ? 'border-rose-500' : ''}`}
                  />
                </motion.div>
              </div>
              {fieldErrors.reason && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-rose-600 text-xs font-medium mt-1"
                >
                  <AlertCircle size={12} />
                  {fieldErrors.reason}
                </motion.div>
              )}
            </div>

            <div className="flex gap-2 sm:gap-3 pt-4 flex-col sm:flex-row">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border-2 text-sm font-semibold transition-all ${isDark
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xl"
              >
                <Send size={16} />
                Forward
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Document Upload Component - FIXED: No confirmation message when deleting individual documents
const DocumentUpload = ({ documents, onDocumentsChange, isDark, fieldErrors, onFieldError, shakeFields }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type
      }));
      onDocumentsChange([...documents, ...newFiles]);
      // Clear document error when files are added
      if (onFieldError && newFiles.length > 0) {
        onFieldError('documents', '');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type
      }));
      onDocumentsChange([...documents, ...newFiles]);
      // Clear document error when files are added
      if (onFieldError && newFiles.length > 0) {
        onFieldError('documents', '');
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeDocument = (index) => {
    // FIXED: No confirmation message when deleting individual documents
    // Directly remove the document without any confirmation
    const newDocuments = documents.filter((_, i) => i !== index);
    onDocumentsChange(newDocuments);
    // Set error if no documents left
    if (onFieldError && newDocuments.length === 0) {
      onFieldError('documents', 'Please upload at least one document');
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-visible">
        <motion.div
          animate={shakeFields.includes('documents') ? "shake" : "initial"}
          variants={shakeAnimation}
          className="overflow-visible"
          whileHover={{ scale: 1.01 }}
        >
          <div
            className={`relative border-2 border-dashed rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-center transition-all cursor-pointer ${dragActive
              ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 scale-105'
              : isDark
                ? 'border-gray-600 bg-gray-800 hover:border-violet-400'
                : 'border-gray-300 bg-gray-50 hover:border-violet-400'
              } ${fieldErrors?.documents ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <motion.div
              animate={{ y: dragActive ? -10 : 0 }}
              className="space-y-3 sm:space-y-4"
            >
              <div className="flex justify-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: dragActive ? 180 : 0
                  }}
                  transition={{
                    y: { duration: 2, repeat: Infinity },
                    rotate: { duration: 0.3 }
                  }}
                  className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-white'
                    }`}
                >
                  <Upload size={32} className={dragActive ? 'text-violet-500' : isDark ? 'text-gray-400' : 'text-gray-500'} />
                </motion.div>
              </div>
              <div>
                <p className={`text-sm sm:text-base font-semibold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {dragActive ? 'Drop files here' : 'Drop files or click to upload'}
                </p>
                <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  PDF, DOC, JPG, PNG • Max 10MB each
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {fieldErrors?.documents && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-rose-600 text-xs font-medium"
        >
          <XCircle size={12} />
          {fieldErrors.documents}
        </motion.p>
      )}

      {documents.length > 0 && (
        <div className="space-y-3">
          <h4 className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
            Uploaded Documents ({documents.length})
          </h4>
          <div className="space-y-2">
            {documents.map((doc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5 }}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className={`p-1.5 sm:p-2 rounded-xl flex-shrink-0 ${isDark ? 'bg-gray-600' : 'bg-white'
                    }`}>
                    <FileText size={16} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs sm:text-sm font-semibold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {doc.name}
                    </p>
                    <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {doc.size}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => removeDocument(index)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-1.5 sm:p-2 rounded-xl flex-shrink-0 ${isDark
                    ? 'hover:bg-rose-500/20 text-gray-400 hover:text-rose-400'
                    : 'hover:bg-rose-100 text-gray-600 hover:text-rose-600'
                    }`}
                >
                  <X size={14} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Recipient Detail Modal Component - FIXED: Document deletion confirmation issue
const RecipientDetailModal = ({ recipient, isDark, onClose, onStatusChange, onVerificationChange, availableAdmins }) => {
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
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4"
      style={{ margin: 0, padding: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25 }}
        className={`rounded-3xl w-full max-w-5xl mx-2 sm:mx-4 ${isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-white via-white to-gray-50'
          }`}
        style={{
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          maxHeight: 'calc(100vh - 1rem)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-4 sm:p-6 md:p-8 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 truncate">
                Recipient Details
              </h2>
              <p className="text-violet-100 text-sm sm:text-base font-semibold truncate">
                {recipient.name} • {recipient.id}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex-shrink-0 ml-2"
            >
              <X size={18} className="text-white" />
            </motion.button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className={`p-4 sm:p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Users size={18} className="text-violet-500" />
                  Personal Information
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Full Name
                    </label>
                    <p className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipient.name}</p>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Email
                    </label>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipient.email}</p>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Phone
                    </label>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipient.phone}</p>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Address
                    </label>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipient.address}</p>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Age & Family
                    </label>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {recipient.age} years, {recipient.familyMembers} family members
                    </p>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Assigned To
                    </label>
                    <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                      <UserCheck size={14} />
                      {getAdminName(recipient.assignee)}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-4 sm:p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <DollarSign size={18} className="text-emerald-500" />
                  Financial Information
                </h3>
                <div className="space-y-3 sm:space-y-5">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Category & Description
                    </label>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {recipient.category}
                    </p>
                    <p className={`text-xs font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {recipient.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Required Amount
                      </label>
                      <p className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ₨{recipient.requiredAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Donated Amount
                      </label>
                      <p className="text-lg sm:text-xl font-bold text-emerald-500">
                        ₨{recipient.donatedAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Balance Amount
                    </label>
                    <p className="text-lg sm:text-xl font-bold text-rose-500">
                      ₨{recipient.balanceAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-center pt-3 sm:pt-4">
                    <ProgressCircle percentage={recipient.completionRate} size={100} isDark={isDark} />
                  </div>
                </div>
              </div>
            </div>

            {recipient.forwardingHistory.length > 0 && (
              <div className={`p-4 sm:p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Send size={18} className="text-violet-500" />
                  Forwarding History ({recipient.forwardingHistory.length})
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {recipient.forwardingHistory.map((record, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <Send size={14} className="text-violet-500 flex-shrink-0" />
                            <span className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {getAdminName(record.fromAdmin)} → {getAdminName(record.toAdmin)}
                            </span>
                          </div>
                          <p className={`text-xs font-medium mb-1 sm:mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {record.reason}
                          </p>
                          <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            <Clock size={12} className="inline mr-1" />
                            {formatDate(record.timestamp)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className={`p-4 sm:p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <h3 className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <FileText size={18} className="text-amber-500" />
                Documents ({recipient.documents.length})
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {recipient.documents.length > 0 ? (
                  recipient.documents.map((doc, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'
                        }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                          }`}>
                          <FileText size={16} className="text-amber-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-semibold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{doc.name}</p>
                          <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {doc.size}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation(); // FIXED: Prevent event propagation
                          // Real PDF download functionality
                          const link = document.createElement('a');
                          link.href = `/api/documents/${doc.name}`;
                          link.download = doc.name;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold ${isDark
                          ? 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
                          : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                          }`}
                      >
                        <Download size={14} className="inline mr-1 sm:mr-2" />
                        Download
                      </motion.button>
                    </motion.div>
                  ))
                ) : (
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No documents uploaded</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Add/Edit Recipient Modal Component - COMPLETELY FIXED SHAKE ANIMATION
const AddRecipientModal = ({ isDark, recipient, onClose, onAddRecipient, onUpdateRecipient }) => {
  const isEditing = !!recipient;

  // Add these state variables
  const [phoneCode, setPhoneCode] = useState('+92'); // Default to Pakistan
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Country codes with flags and phone formats
  const countryCodes = [
    { code: "+1", country: "United States", flag: "🇺🇸", format: "xxx-xxx-xxxx", length: 10 },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧", format: "xxxx-xxx-xxx", length: 10 },
    { code: "+92", country: "Pakistan", flag: "🇵🇰", format: "xxx-xxx-xxxx", length: 10 },
    { code: "+91", country: "India", flag: "🇮🇳", format: "xxxx-xxx-xxx", length: 10 },
    { code: "+971", country: "UAE", flag: "🇦🇪", format: "xx-xxx-xxxx", length: 9 },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦", format: "x-xxx-xxxx", length: 9 },
    { code: "+61", country: "Australia", flag: "🇦🇺", format: "x-xxxx-xxxx", length: 9 },
    { code: "+49", country: "Germany", flag: "🇩🇪", format: "xxxx-xxx-xxx", length: 10 },
    { code: "+33", country: "France", flag: "🇫🇷", format: "x-xx-xx-xx-xx", length: 9 },
    { code: "+81", country: "Japan", flag: "🇯🇵", format: "xx-xxxx-xxxx", length: 10 },
    { code: "+86", country: "China", flag: "🇨🇳", format: "xxx-xxxx-xxxx", length: 11 },
    { code: "+65", country: "Singapore", flag: "🇸🇬", format: "xxxx-xxxx", length: 8 }
  ];

  const selectedCountry = countryCodes.find(country => country.code === phoneCode);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Phone number formatting function
const formatPhoneNumber = (digits, countryCode) => {
  if (!digits) return '';
  
  const country = countryCodes.find(c => c.code === countryCode);
  const maxLength = country?.length || 10;
  
  let formatted = digits.slice(0, maxLength);
  
  // Apply formatting based on country
  switch (countryCode) {
    case '+1': // US: xxx-xxx-xxxx
      if (formatted.length > 6) {
        formatted = `${formatted.slice(0, 3)}-${formatted.slice(3, 6)}-${formatted.slice(6)}`;
      } else if (formatted.length > 3) {
        formatted = `${formatted.slice(0, 3)}-${formatted.slice(3)}`;
      }
      break;
      
    case '+92': // Pakistan: xxx-xxx-xxxx
      if (formatted.length > 6) {
        formatted = `${formatted.slice(0, 3)}-${formatted.slice(3, 6)}-${formatted.slice(6)}`;
      } else if (formatted.length > 3) {
        formatted = `${formatted.slice(0, 3)}-${formatted.slice(3)}`;
      }
      break;
      
    case '+44': // UK: xxxx-xxx-xxx
      if (formatted.length > 7) {
        formatted = `${formatted.slice(0, 4)}-${formatted.slice(4, 7)}-${formatted.slice(7)}`;
      } else if (formatted.length > 4) {
        formatted = `${formatted.slice(0, 4)}-${formatted.slice(4)}`;
      }
      break;
      
    case '+971': // UAE: xx-xxx-xxxx
      if (formatted.length > 5) {
        formatted = `${formatted.slice(0, 2)}-${formatted.slice(2, 5)}-${formatted.slice(5)}`;
      } else if (formatted.length > 2) {
        formatted = `${formatted.slice(0, 2)}-${formatted.slice(2)}`;
      }
      break;
      
    case '+966': // KSA: x-xxx-xxxx
      if (formatted.length > 4) {
        formatted = `${formatted.slice(0, 1)}-${formatted.slice(1, 4)}-${formatted.slice(4)}`;
      } else if (formatted.length > 1) {
        formatted = `${formatted.slice(0, 1)}-${formatted.slice(1)}`;
      }
      break;
      
    default:
      // Default formatting: xxx-xxx-xxxx
      if (formatted.length > 6) {
        formatted = `${formatted.slice(0, 3)}-${formatted.slice(3, 6)}-${formatted.slice(6)}`;
      } else if (formatted.length > 3) {
        formatted = `${formatted.slice(0, 3)}-${formatted.slice(3)}`;
      }
  }
  
  return formatted;
};

  const initialFormData = isEditing ? recipient : {
    name: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    requiredAmount: 0,
    donatedAmount: 0,
    status: 'Draft',
    verificationStatus: 'Not Started',
    description: '',
    urgency: '',
    age: 0,
    familyMembers: 0,
    documents: []
  };

  const [formData, setFormData] = useState(initialFormData);
  const [originalData] = useState(initialFormData);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);

  // Create refs for all form fields for auto-scrolling
  const fieldRefs = {
    name: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    address: useRef(null),
    category: useRef(null),
    requiredAmount: useRef(null),
    donatedAmount: useRef(null),
    urgency: useRef(null),
    age: useRef(null),
    familyMembers: useRef(null),
    description: useRef(null),
    documents: useRef(null)
  };

  const modalRef = useRef(null);

  // Check if form data has changed
  const hasFormDataChanged = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  // Auto-scroll to first invalid field - FIXED VERSION
  const scrollToFirstInvalidField = (invalidFields) => {
    if (invalidFields.length > 0) {
      // Define the order of fields as they appear in the form
      const fieldOrder = [
        'name', 'email', 'phone', 'address', 'category', 'description',
        'requiredAmount', 'donatedAmount', 'urgency', 'age', 'familyMembers', 'documents'
      ];

      // Find the first invalid field based on the form order
      const firstInvalidField = fieldOrder.find(field =>
        invalidFields.includes(field)
      );

      if (firstInvalidField) {
        const fieldRef = fieldRefs[firstInvalidField];

        if (fieldRef && fieldRef.current) {
          // Use setTimeout to ensure the DOM has updated
          setTimeout(() => {
            fieldRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            });

            // Focus the field for better UX
            const input = fieldRef.current.querySelector('input, select, textarea');
            if (input) {
              input.focus();
              // Ensure the cursor blinks by selecting the content
              if (input.type !== 'file') {
                input.select();
              }
            }
          }, 100);
        }
      }
    }
  };

  // Validation function - FIXED SHAKING FOR AGE AND FAMILY MEMBERS
  const validateForm = () => {
    const errors = {};
    const invalidFields = [];

    // Clear previous shake animations
    setShakeFields([]);

    // Helper function to check if string contains only alphabets and spaces
    const isValidName = (name) => {
      return /^[A-Za-z\s]+$/.test(name.trim());
    };

    // Strong email validation
    const isValidEmail = (email) => {
      const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9]*[._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]([a-zA-Z0-9]*[-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email.trim());
    };

    // Phone validation (basic structure for country codes and dashes)
    const isValidPhone = (phone) => {
      // Allows: +92-300-1234567, +1-800-123-4567, 0300-1234567
      const phoneRegex = /^(\+\d{1,4}-)?\d{3,4}-\d{6,8}$/;
      return phoneRegex.test(phone.trim());
    };

    // Address validation
    const isValidAddress = (address) => {
      // Allows: alphabets, numbers (not at start), spaces, - / , . ' "
      const addressRegex = /^[A-Za-z][A-Za-z\s.,'"/-]*([A-Za-z]|\d)*$/;
      return addressRegex.test(address.trim());
    };

    // VALIDATION LOGIC:

    // 1. Name - Only alphabets and spaces
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      invalidFields.push('name');
    } else if (!isValidName(formData.name)) {
      errors.name = 'Name can only contain alphabets and spaces';
      invalidFields.push('name');
    }

    // 2. Email - Strict validation with @gmail.com requirement
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      invalidFields.push('email');
    } else {
      // Enhanced email validation regex
      const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9]*[._-]?[a-zA-Z0-9]+)*@gmail\.com$/;

      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Please enter a valid Gmail address (e.g., example123@gmail.com)';
        invalidFields.push('email');
      } else {
        // Additional validation rules
        const localPart = formData.email.split('@')[0];

        // Local part cannot start or end with special characters
        if (localPart.startsWith('.') || localPart.startsWith('_') || localPart.startsWith('-') ||
          localPart.endsWith('.') || localPart.endsWith('_') || localPart.endsWith('-')) {
          errors.email = 'Email cannot start or end with . _ -';
          invalidFields.push('email');
        }

        // No consecutive special characters
        if (/[._-]{2,}/.test(localPart)) {
          errors.email = 'Email cannot have consecutive special characters (., _, -)';
          invalidFields.push('email');
        }

        // Length validation
        if (localPart.length < 3) {
          errors.email = 'Email username must be at least 3 characters long';
          invalidFields.push('email');
        }

        if (localPart.length > 30) {
          errors.email = 'Email username cannot exceed 30 characters';
          invalidFields.push('email');
        }
      }
    }

    // 3. Phone - Enhanced validation with country codes
if (!formData.phone.trim()) {
  errors.phone = 'Phone number is required';
  invalidFields.push('phone');
} else {
  const fullPhoneNumber = phoneCode + formData.phone.replace(/\D/g, '');
  const country = countryCodes.find(c => c.code === phoneCode);
  const expectedLength = country?.length || 10;
  
  // Check if phone number has correct length for the country
  const actualLength = formData.phone.replace(/\D/g, '').length;
  
  if (actualLength !== expectedLength) {
    errors.phone = `Phone number must be ${expectedLength} digits for ${country?.country}`;
    invalidFields.push('phone');
  } else if (!/^\+?[\d\s-()]+$/.test(fullPhoneNumber)) {
    errors.phone = 'Please enter a valid phone number';
    invalidFields.push('phone');
  }
}

    // 4. Address - CANNOT START WITH NUMBER, ALLOW LIMITED SPECIAL CHARS
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
      invalidFields.push('address');
    } else if (!isValidAddress(formData.address)) {
      errors.address = 'Address must start with a letter and can only contain letters and numbers';
      invalidFields.push('address');
    }

    // 5. Category
    if (!formData.category || formData.category === '') {
      errors.category = 'Please select a category';
      invalidFields.push('category');
    }

    // 6. Description
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
      invalidFields.push('description');
    }

    // 7. Required Amount
    if (formData.requiredAmount === '' || formData.requiredAmount === null || formData.requiredAmount === undefined) {
      errors.requiredAmount = 'Required amount is required';
      invalidFields.push('requiredAmount');
    } else {
      const reqAmount = Number(formData.requiredAmount);
      if (reqAmount <= 0) {
        errors.requiredAmount = 'Required amount must be greater than 0';
        invalidFields.push('requiredAmount');
      } else if (!/^\d+$/.test(formData.requiredAmount.toString())) {
        errors.requiredAmount = 'Required amount must be a valid number';
        invalidFields.push('requiredAmount');
      } else if (!Number.isInteger(reqAmount)) {
        errors.requiredAmount = 'Amount must be a whole number without decimals';
        invalidFields.push('requiredAmount');
      } else if (reqAmount > 10000000) {
        errors.requiredAmount = 'Amount cannot exceed 10,000,000';
        invalidFields.push('requiredAmount');
      }
    }

    // 8. Donated Amount
    if (formData.donatedAmount === '' || formData.donatedAmount === null || formData.donatedAmount === undefined) {
      errors.donatedAmount = 'Donated amount is required';
      invalidFields.push('donatedAmount');
    } else {
      const donAmount = Number(formData.donatedAmount);
      if (donAmount < 0) {
        errors.donatedAmount = 'Donated amount must be 0 or greater';
        invalidFields.push('donatedAmount');
      } else if (!/^\d+$/.test(formData.donatedAmount.toString())) {
        errors.donatedAmount = 'Donated amount must be a valid number';
        invalidFields.push('donatedAmount');
      } else if (!Number.isInteger(donAmount)) {
        errors.donatedAmount = 'Amount must be a whole number without decimals';
        invalidFields.push('donatedAmount');
      } else if (formData.requiredAmount && donAmount > Number(formData.requiredAmount)) {
        errors.donatedAmount = 'Donated amount cannot exceed required amount';
        invalidFields.push('donatedAmount');
      } else if (donAmount > 10000000) {
        errors.donatedAmount = 'Amount cannot exceed 10,000,000';
        invalidFields.push('donatedAmount');
      }
    }

    // 9. Urgency
    if (!formData.urgency || formData.urgency === '') {
      errors.urgency = 'Please select urgency level';
      invalidFields.push('urgency');
    }

    // 10. Age
    if (formData.age === '' || formData.age === null || formData.age === undefined) {
      errors.age = 'Age is required';
      invalidFields.push('age');
    } else {
      const ageValue = parseInt(formData.age, 10);
      if (isNaN(ageValue)) {
        errors.age = 'Age must be a valid number';
        invalidFields.push('age');
      } else if (ageValue <= 0) {
        errors.age = 'Age must be at least 1';
        invalidFields.push('age');
      } else if (ageValue > 120) {
        errors.age = 'Age cannot exceed 120';
        invalidFields.push('age');
      } else if (!Number.isInteger(ageValue)) {
        errors.age = 'Age must be a whole number';
        invalidFields.push('age');
      }
    }

    // 11. Family Members
    if (formData.familyMembers === '' || formData.familyMembers === null || formData.familyMembers === undefined) {
      errors.familyMembers = 'Family members is required';
      invalidFields.push('familyMembers');
    } else {
      const familyValue = parseInt(formData.familyMembers, 10);
      if (isNaN(familyValue)) {
        errors.familyMembers = 'Family members must be a valid number';
        invalidFields.push('familyMembers');
      } else if (familyValue <= 0) {
        errors.familyMembers = 'Family members must be at least 1';
        invalidFields.push('familyMembers');
      } else if (familyValue > 20) {
        errors.familyMembers = 'Family members cannot exceed 20';
        invalidFields.push('familyMembers');
      } else if (!Number.isInteger(familyValue)) {
        errors.familyMembers = 'Family members must be a whole number';
        invalidFields.push('familyMembers');
      }
    }

    // 12. Documents
    if (formData.documents.length === 0) {
      errors.documents = 'Please upload at least one document';
      invalidFields.push('documents');
    }

    setFieldErrors(errors);

    // Trigger shake animation for invalid fields
    if (invalidFields.length > 0) {
      setShakeFields([...invalidFields]);

      // Auto-scroll to first invalid field based on form order
      scrollToFirstInvalidField(invalidFields);

      // Reset shake animation after delay
      setTimeout(() => {
        setShakeFields([]);
      }, 600);

      return false; // Validation failed
    }

    return true; // Validation passed
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Important: Prevent browser validation

    // Use ONLY your custom validation
    if (!validateForm()) {
      return; // Show shaking + your error messages, no browser dialogs
    }

    // Only proceed if validation passes
    if (isEditing) {
      onUpdateRecipient(formData);
    } else {
      onAddRecipient(formData);
    }

    onClose();
    setSuccessMessage(isEditing ? 'Recipient updated successfully' : 'Recipient added successfully');
    setShowSuccessDialog(true);
  };

  const handleConfirm = () => {
    if (pendingAction) {
      pendingAction();
    }
    setShowConfirmation(false);
    setPendingAction(null);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingAction(null);
  };

  // UPDATED handleChange function with address field restrictions
const handleChange = (e) => {
    const { name, value } = e.target;

    // For numeric fields
    const numericFields = ['requiredAmount', 'donatedAmount', 'age', 'familyMembers'];

    let newValue = value;

    // SPECIAL HANDLING FOR NAME FIELD - ONLY ALLOW ALPHABETS AND SPACES
    if (name === 'name') {
      // Only allow letters (a-z, A-Z) and spaces
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
    }
    // SPECIAL HANDLING FOR EMAIL FIELD - ONLY ALLOW VALID EMAIL CHARACTERS
    else if (name === 'email') {
      // Allow only: letters, numbers, and these special characters: . _ -
      // Also allow @ symbol but only once and only for gmail.com
      newValue = value.toLowerCase(); // Convert to lowercase for consistency

      // Remove any characters that are not allowed in email
      newValue = newValue.replace(/[^a-zA-Z0-9.@_-]/g, '');

      // Ensure only one @ symbol
      const atCount = (newValue.match(/@/g) || []).length;
      if (atCount > 1) {
        newValue = newValue.replace(/@+$/, '@'); // Remove extra @ symbols
      }

      // Auto-complete @gmail.com when user types @
      if (newValue.includes('@') && !newValue.endsWith('@gmail.com')) {
        const localPart = newValue.split('@')[0];
        const afterAt = newValue.split('@')[1] || '';

        // If user just typed @, auto-complete to @gmail.com
        if (afterAt === '') {
          newValue = localPart + '@gmail.com';
        }
        // If user is typing after @, guide them to gmail.com
        else if (!afterAt.startsWith('gmail.com')) {
          // Only allow typing that leads to gmail.com
          const validGMailChars = afterAt.replace(/[^a-zA-Z0-9.]/g, '');
          if (validGMailChars.startsWith('gmail') || validGMailChars === 'g' || validGMailChars === 'gm' ||
            validGMailChars === 'gma' || validGMailChars === 'gmai') {
            newValue = localPart + '@' + validGMailChars;
          } else {
            newValue = localPart + '@gmail.com';
          }
        }
      }
    }
    // SPECIAL HANDLING FOR PHONE FIELD - ALLOW NUMBERS AND DASHES ONLY
    else if (name === 'phone') {
      // Remove all non-digit and non-dash characters
      newValue = value.replace(/[^\d-]/g, '');
      
      // Ensure proper phone format (xxx-xxx-xxxx)
      const digitsOnly = newValue.replace(/\D/g, '');
      if (digitsOnly.length <= 3) {
        newValue = digitsOnly;
      } else if (digitsOnly.length <= 6) {
        newValue = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
      } else {
        newValue = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
      }
    }
    // SPECIAL HANDLING FOR ADDRESS FIELD - CANNOT START WITH NUMBER, ALLOW LIMITED SPECIAL CHARS
    else if (name === 'address') {
      // Remove any characters that are not allowed in address
      // Allowed: letters (a-z, A-Z), numbers (0-9), spaces, and these special characters: - _ / , . ' "
      newValue = value.replace(/[^a-zA-Z0-9\s\-_/,'."]/g, '');
      
      // Prevent address from starting with a number
      if (/^\d/.test(newValue)) {
        newValue = newValue.replace(/^\d+/, '');
      }
      
      // Remove multiple consecutive spaces
      newValue = newValue.replace(/\s+/g, ' ');
    }
    // For numeric fields
    else if (numericFields.includes(name)) {
      if (value === '') {
        newValue = '0';
      } else if (/^\d+$/.test(value)) {
        const numValue = parseInt(value, 10);
        newValue = numValue.toString();
        if (numValue < 0) {
          newValue = '0';
        }
      } else {
        return; // Don't update if invalid
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing/changing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDocumentsChange = (documents) => {
    setFormData(prev => ({
      ...prev,
      documents
    }));

    // Clear document error when documents are added
    if (fieldErrors.documents && documents.length > 0) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.documents;
        return newErrors;
      });
    }
  };

  const handleFieldError = (field, error) => {
    if (error) {
      setFieldErrors(prev => ({ ...prev, [field]: error }));
    } else {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4"
        style={{ margin: 0, padding: 0 }}
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 25 }}
          className={`rounded-3xl w-full max-w-4xl mx-2 sm:mx-4 ${isDark
            ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-white via-white to-gray-50'
            }`}
          style={{
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
            maxHeight: 'calc(100vh - 1rem)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative p-4 sm:p-6 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
                  {isEditing ? 'Edit Recipient' : 'Add New Recipient'}
                </h2>
                <p className="text-violet-100 text-xs sm:text-sm font-semibold truncate">
                  {isEditing ? 'Update recipient information' : 'Create a new recipient record'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex-shrink-0 ml-2"
              >
                <X size={18} className="text-white" />
              </motion.button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* PERSONAL INFORMATION SECTION - COMPLETELY FIXED SHAKE */}
                <div className={`p-3 sm:p-4 rounded-2xl space-y-3 sm:space-y-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <h3 className={`text-sm sm:text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <Users size={16} className="text-violet-500" />
                    Personal Information
                  </h3>

                  {/* Name Field - FIXED SHAKE */}
                  <div ref={fieldRefs.name} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Full Name *
                    </label>
                    <motion.div
                      animate={shakeFields.includes('name') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible"
                    >
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          } ${fieldErrors.name ? 'border-rose-500' : ''}`}
                      />
                    </motion.div>
                    {fieldErrors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                      >
                        <XCircle size={12} />
                        {fieldErrors.name}
                      </motion.p>
                    )}
                  </div>

                  {/* Email Field - FIXED SHAKE */}
                  <div ref={fieldRefs.email} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Email *
                    </label>
                    <motion.div
                      animate={shakeFields.includes('email') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible"
                    >
                      <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onKeyPress={(e) => {
                          // Only allow: letters, numbers, and . _ - @
                          const allowedChars = /[a-zA-Z0-9.@_-]/;
                          if (!allowedChars.test(e.key)) {
                            e.preventDefault();
                          }

                          // Additional validation for @ symbol
                          if (e.key === '@') {
                            const currentValue = e.target.value;
                            // Prevent multiple @ symbols
                            if (currentValue.includes('@')) {
                              e.preventDefault();
                            }
                            // If @ is pressed and no @ exists, auto-complete to @gmail.com
                            else if (!currentValue.includes('@')) {
                              e.preventDefault();
                              const newValue = currentValue + '@gmail.com';
                              setFormData(prev => ({ ...prev, email: newValue }));
                            }
                          }
                        }}
                        onBlur={(e) => {
                          // Auto-format on blur if @ is present but domain is incomplete
                          const emailValue = e.target.value;
                          if (emailValue.includes('@') && !emailValue.endsWith('@gmail.com')) {
                            const localPart = emailValue.split('@')[0];
                            const afterAt = emailValue.split('@')[1] || '';

                            // If domain is incomplete or wrong, auto-correct to @gmail.com
                            if (!afterAt || !afterAt.startsWith('gmail.com')) {
                              setFormData(prev => ({ ...prev, email: localPart + '@gmail.com' }));
                            }
                          }
                        }}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          } ${fieldErrors.email ? 'border-rose-500' : ''}`}
                      />
                    </motion.div>
                    {fieldErrors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                      >
                        <XCircle size={12} />
                        {fieldErrors.email}
                      </motion.p>
                    )}
                  </div>

                  {/* Phone Field - Fixed with proper theme styling and no placeholder */}
      <div ref={fieldRefs.phone} className="overflow-visible">
        <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Phone *
        </label>
        <motion.div
          animate={shakeFields.includes('phone') ? "shake" : "initial"}
          variants={shakeAnimation}
          className="overflow-visible"
        >
          <div className="flex gap-2 sm:gap-3">
            {/* Country Code Dropdown */}
            <div className="flex-shrink-0 w-28 sm:w-32" ref={dropdownRef}>
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-2 sm:p-3 rounded-2xl border-2 text-sm font-medium flex items-center justify-between ${isDark
                    ? 'bg-gray-800 border-gray-600 text-white hover:border-gray-500'
                    : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                    } ${fieldErrors.phone ? 'border-rose-500' : ''}`}
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-sm">{selectedCountry?.flag}</span>
                    <span className="text-xs sm:text-sm">{selectedCountry?.code}</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Country Dropdown Menu */}
                {showCountryDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute top-full left-0 mt-1 w-48 sm:w-56 rounded-2xl shadow-xl z-30 max-h-60 overflow-y-auto ${isDark
                      ? 'bg-gray-800 border border-gray-600'
                      : 'bg-white border border-gray-200'
                      }`}
                  >
                    {countryCodes.map((country) => (
                      <motion.button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          setPhoneCode(country.code);
                          setShowCountryDropdown(false);
                        }}
                        whileHover={{ 
                          backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)' 
                        }}
                        className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 border-b ${isDark
                          ? 'border-gray-700 text-gray-300'
                          : 'border-gray-100 text-gray-700'
                          } last:border-b-0 ${phoneCode === country.code 
                          ? isDark 
                            ? 'bg-blue-900/20 text-blue-400' 
                            : 'bg-blue-50 text-blue-600'
                          : ''}`}
                      >
                        <span className="text-base">{country.flag}</span>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">{country.country}</div>
                          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {country.code}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Phone Number Input - WHITE BACKGROUND IN LIGHT MODE, DARK IN DARK MODE, NO PLACEHOLDER */}
            <div className="flex-1">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onKeyPress={(e) => {
                  // Only allow numbers and dashes
                  if (!/[0-9-]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                  ? 'bg-gray-800 border-gray-600 text-white' // Dark theme
                  : 'bg-white border-gray-200 text-gray-900' // Light theme - WHITE background
                  } ${fieldErrors.phone ? 'border-rose-500' : ''}`}
                // No placeholder attribute
              />
            </div>
          </div>
        </motion.div>
        {fieldErrors.phone && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
          >
            <XCircle size={12} />
            {fieldErrors.phone}
          </motion.p>
        )}
      </div>

                  {/* Address Field - FIXED SHAKE */}
                  <div ref={fieldRefs.address} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Address *
                    </label>
                    <motion.div
                      animate={shakeFields.includes('address') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible"
                    >
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          } ${fieldErrors.address ? 'border-rose-500' : ''}`}
                      />
                    </motion.div>
                    {fieldErrors.address && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                      >
                        <XCircle size={12} />
                        {fieldErrors.address}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* REQUEST INFORMATION SECTION - COMPLETELY FIXED SHAKE */}
                <div className={`p-3 sm:p-4 rounded-2xl space-y-3 sm:space-y-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <h3 className={`text-sm sm:text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <DollarSign size={16} className="text-emerald-500" />
                    Request Information
                  </h3>

                  {/* Category Field - FIXED SHAKE */}
                  <div ref={fieldRefs.category} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Category *
                    </label>
                    <motion.div
                      animate={shakeFields.includes('category') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible"
                    >
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          } ${fieldErrors.category ? 'border-rose-500' : ''}`}
                      >
                        <option value="">Select Category</option>
                        {categoryOptions.filter(opt => opt !== 'All Categories').map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </motion.div>
                    {fieldErrors.category && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                      >
                        <XCircle size={12} />
                        {fieldErrors.category}
                      </motion.p>
                    )}
                  </div>

                  {/* Description Field - FIXED SHAKE */}
                  <div ref={fieldRefs.description} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Description *
                    </label>
                    <motion.div
                      animate={shakeFields.includes('description') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible"
                    >
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium resize-none ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          } ${fieldErrors.description ? 'border-rose-500' : ''}`}
                      />
                    </motion.div>
                    {fieldErrors.description && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                      >
                        <XCircle size={12} />
                        {fieldErrors.description}
                      </motion.p>
                    )}
                  </div>

                  {/* Required Amount Field - FIXED SHAKE */}
                  <div ref={fieldRefs.requiredAmount} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Required Amount (₨) *
                    </label>
                    <motion.div
                      animate={shakeFields.includes('requiredAmount') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible"
                    >
                      <input
                        type="number"
                        name="requiredAmount"
                        value={formData.requiredAmount}
                        onChange={handleChange}
                        required
                        min="0"
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          } ${fieldErrors.requiredAmount ? 'border-rose-500' : ''}`}
                      />
                    </motion.div>
                    {fieldErrors.requiredAmount && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                      >
                        <XCircle size={12} />
                        {fieldErrors.requiredAmount}
                      </motion.p>
                    )}
                  </div>

                  {/* Donated Amount Field - FIXED */}
                  <div ref={fieldRefs.donatedAmount} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Donated Amount (₨)
                    </label>
                    <motion.div
                      animate={shakeFields.includes('donatedAmount') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible"
                    >
                      <input
                        type="number"
                        name="donatedAmount"
                        value={formData.donatedAmount}
                        onChange={handleChange}
                        min="0"
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          } ${fieldErrors.donatedAmount ? 'border-rose-500' : ''}`}
                      />
                    </motion.div>
                    {fieldErrors.donatedAmount && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                      >
                        <XCircle size={12} />
                        {fieldErrors.donatedAmount}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>

              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Target size={16} className="text-blue-500" />
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* Urgency Field - FIXED SHAKE */}
                  <div ref={fieldRefs.urgency} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Urgency *
                    </label>
                    <motion.div
                      animate={shakeFields.includes('urgency') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible"
                    >
                      <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          } ${fieldErrors.urgency ? 'border-rose-500' : ''}`}
                      >
                        <option value="">Select Urgency</option>
                        {urgencyOptions.filter(opt => opt !== 'All Urgency').map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </motion.div>
                    {fieldErrors.urgency && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                      >
                        <XCircle size={12} />
                        {fieldErrors.urgency}
                      </motion.p>
                    )}
                  </div>

                  {/* Age Field - FIXED: Now allows increasing beyond limits for validation */}
                  <div ref={fieldRefs.age} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Age *
                    </label>
                    <motion.div
                      animate={shakeFields.includes('age') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible"
                    >
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          } ${fieldErrors.age ? 'border-rose-500' : ''}`}
                      />
                    </motion.div>
                    {fieldErrors.age && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                      >
                        <XCircle size={12} />
                        {fieldErrors.age}
                      </motion.p>
                    )}
                  </div>

                  {/* Family Members Field - FIXED: Now allows increasing beyond limits for validation */}
                  <div ref={fieldRefs.familyMembers} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Family Members *
                    </label>
                    <motion.div
                      animate={shakeFields.includes('familyMembers') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible"
                    >
                      <input
                        type="number"
                        name="familyMembers"
                        value={formData.familyMembers}
                        onChange={handleChange}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          } ${fieldErrors.familyMembers ? 'border-rose-500' : ''}`}
                      />
                    </motion.div>
                    {fieldErrors.familyMembers && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                      >
                        <XCircle size={12} />
                        {fieldErrors.familyMembers}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>

              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <FileText size={16} className="text-amber-500" />
                  Document Upload *
                </h3>
                <div ref={fieldRefs.documents} className="overflow-visible">
                  <DocumentUpload
                    documents={formData.documents}
                    onDocumentsChange={handleDocumentsChange}
                    isDark={isDark}
                    fieldErrors={fieldErrors}
                    onFieldError={handleFieldError}
                    shakeFields={shakeFields}
                  />
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4 pt-4 flex-col sm:flex-row">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold shadow-xl flex items-center justify-center gap-2"
                >
                  {isEditing ? (
                    <>
                      <CheckCircle size={16} />
                      Update Recipient
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Add Recipient
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>

      {/* Confirmation Dialog - Only show if data has changed for editing */}
      <AnimatePresence>
        {showConfirmation && (
          <ConfirmationDialog
            isDark={isDark}
            title={isEditing ? "Update Recipient" : "Add Recipient"}
            message={isEditing
              ? "Are you sure you want to update this recipient's information?"
              : "Are you sure you want to add this new recipient?"
            }
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            confirmText={isEditing ? "Update" : "Add"}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, isDark }) => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 sm:mt-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-1.5 sm:p-2 rounded-xl ${isDark
          ? 'bg-gray-700 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-600'
          : 'bg-white text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100'
          } border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
      >
        <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
      </motion.button>

      {startPage > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(1)}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium ${isDark
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              } border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
          >
            1
          </motion.button>
          {startPage > 2 && <span className={`px-1 sm:px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>...</span>}
        </>
      )}

      {pages.map(page => (
        <motion.button
          key={page}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(page)}
          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium ${currentPage === page
            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
            : isDark
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-white text-gray-700 hover:bg-gray-100'
            } border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
        >
          {page}
        </motion.button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className={`px-1 sm:px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>...</span>}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(totalPages)}
            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium ${isDark
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-white text-gray-700 hover:bg-gray-100'
              } border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
          >
            {totalPages}
          </motion.button>
        </>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-1.5 sm:p-2 rounded-xl ${isDark
          ? 'bg-gray-700 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-600'
          : 'bg-white text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100'
          } border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
      >
        <ChevronRight size={14} className="sm:w-4 sm:h-4" />
      </motion.button>
    </div>
  );
};

// MAIN COMPONENT - Recipients Management with Card Layout
const RecipientsManagement = ({ isDark }) => {
  const [recipients, setRecipients] = useState(recipientsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedVerification, setSelectedVerification] = useState('All Verification');
  const [selectedUrgency, setSelectedUrgency] = useState('All Urgency');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [recipientToForward, setRecipientToForward] = useState(null);

  // New state for confirmation dialogs and pagination
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [recipientToDelete, setRecipientToDelete] = useState(null);
  const [showForwardConfirmDialog, setShowForwardConfirmDialog] = useState(false);
  const [forwardData, setForwardData] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [recipientToApprove, setRecipientToApprove] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter recipients
  const filteredRecipients = useMemo(() => {
    return recipients.filter(recipient => {
      const matchesSearch =
        recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipient.phone.includes(searchTerm) ||
        recipient.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'All Status' || recipient.status === selectedStatus;
      const matchesCategory = selectedCategory === 'All Categories' || recipient.category === selectedCategory;
      const matchesVerification = selectedVerification === 'All Verification' || recipient.verificationStatus === selectedVerification;
      const matchesUrgency = selectedUrgency === 'All Urgency' || recipient.urgency === selectedUrgency;

      const matchesDateRange =
        (!dateRange.start || recipient.registrationDate >= dateRange.start) &&
        (!dateRange.end || recipient.registrationDate <= dateRange.end);

      return matchesSearch && matchesStatus && matchesCategory && matchesVerification && matchesUrgency && matchesDateRange;
    });
  }, [recipients, searchTerm, selectedStatus, selectedCategory, selectedVerification, selectedUrgency, dateRange]);

  // Paginate recipients
  const paginatedRecipients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRecipients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRecipients, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRecipients.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedCategory, selectedVerification, selectedUrgency, dateRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRecipients = recipients.length;
    const approvedRecipients = recipients.filter(r => r.status === 'Approved').length;
    const pendingRecipients = recipients.filter(r => r.status === 'Pending-Validation').length;
    const totalAmountRequired = recipients.reduce((sum, r) => sum + r.requiredAmount, 0);
    const totalAmountDonated = recipients.reduce((sum, r) => sum + r.donatedAmount, 0);
    const verifiedRecipients = recipients.filter(r => r.verificationStatus === 'Verified').length;
    const highUrgencyRecipients = recipients.filter(r => r.urgency === 'High').length;

    return {
      totalRecipients,
      approvedRecipients,
      pendingRecipients,
      totalAmountRequired,
      totalAmountDonated,
      verifiedRecipients,
      highUrgencyRecipients
    };
  }, [recipients]);

  const handleStatusChange = (recipientId, newStatus) => {
    setRecipients(prev => prev.map(recipient =>
      recipient.id === recipientId ? { ...recipient, status: newStatus } : recipient
    ));
  };

  const handleVerificationChange = (recipientId, newVerification) => {
    setRecipients(prev => prev.map(recipient =>
      recipient.id === recipientId ? { ...recipient, verificationStatus: newVerification } : recipient
    ));
  };

  const handleDeleteRecipient = (recipient) => {
    setRecipientToDelete(recipient);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (recipientToDelete) {
      setRecipients(prev => prev.filter(recipient => recipient.id !== recipientToDelete.id));
      setShowDeleteDialog(false);
      setRecipientToDelete(null);
      setSuccessMessage('Recipient deleted successfully');
      setShowSuccessDialog(true);
    }
  };

  const handleViewRecipient = (recipient) => {
    setSelectedRecipient(recipient);
    setShowRecipientModal(true);
  };

  const handleEditRecipient = (recipient) => {
    setEditingRecipient(recipient);
    setShowAddRecipientModal(true);
  };

  const handleAddRecipient = (newRecipient) => {
    const recipient = {
      ...newRecipient,
      id: `REC-${String(recipients.length + 1).padStart(3, '0')}`,
      registrationDate: new Date().toISOString().split('T')[0],
      balanceAmount: newRecipient.requiredAmount - newRecipient.donatedAmount,
      completionRate: Math.round((newRecipient.donatedAmount / newRecipient.requiredAmount) * 100),
      lastDonationDate: newRecipient.donatedAmount > 0 ? new Date().toISOString().split('T')[0] : null,
      assignee: 'admin1',
      forwardingHistory: []
    };
    setRecipients(prev => [...prev, recipient]);
    setSuccessMessage('Recipient added successfully');
    setShowSuccessDialog(true);
  };

  const handleUpdateRecipient = (updatedRecipient) => {
    setRecipients(prev => prev.map(recipient =>
      recipient.id === updatedRecipient.id ? {
        ...updatedRecipient,
        balanceAmount: updatedRecipient.requiredAmount - updatedRecipient.donatedAmount,
        completionRate: Math.round((updatedRecipient.donatedAmount / updatedRecipient.requiredAmount) * 100),
      } : recipient
    ));
    setEditingRecipient(null);
    setSuccessMessage('Recipient updated successfully');
    setShowSuccessDialog(true);
  };

  const handleApproveRecipient = (recipient) => {
    setRecipientToApprove(recipient);
    setShowApproveDialog(true);
  };

  const confirmApprove = () => {
    if (recipientToApprove) {
      setRecipients(prev => prev.map(recipient =>
        recipient.id === recipientToApprove.id ? {
          ...recipient,
          status: 'Approved',
          verificationStatus: 'Verified'
        } : recipient
      ));
      setShowApproveDialog(false);
      setRecipientToApprove(null);
      setSuccessMessage('Recipient approved successfully');
      setShowSuccessDialog(true);
    }
  };

  const handleForwardRequest = (recipientId, targetAdminId, reason) => {
    const currentAdmin = 'admin1';

    setRecipients(prev => prev.map(recipient => {
      if (recipient.id === recipientId) {
        const forwardRecord = {
          fromAdmin: currentAdmin,
          toAdmin: targetAdminId,
          reason: reason,
          timestamp: new Date().toISOString()
        };

        return {
          ...recipient,
          assignee: targetAdminId,
          forwardingHistory: [...recipient.forwardingHistory, forwardRecord]
        };
      }
      return recipient;
    }));

    setSuccessMessage(`Recipient successfully forwarded to ${availableAdmins.find(a => a.id === targetAdminId)?.name}`);
    setShowSuccessDialog(true);
  };

  const handleOpenForwardModal = (recipient) => {
    setRecipientToForward(recipient);
    setShowForwardModal(true);
  };

  const handleForwardConfirm = (recipientId, targetAdminId, reason) => {
    setForwardData({ recipientId, targetAdminId, reason });
    setShowForwardConfirmDialog(true);
  };

  const confirmForward = () => {
    if (forwardData) {
      handleForwardRequest(forwardData.recipientId, forwardData.targetAdminId, forwardData.reason);
      setShowForwardConfirmDialog(false);
      setForwardData(null);
      setShowForwardModal(false);
    }
  };

  // Real Excel export functionality
  const handleExportExcel = () => {
    const data = filteredRecipients.map(recipient => ({
      ID: recipient.id,
      Name: recipient.name,
      Email: recipient.email,
      Phone: recipient.phone,
      Category: recipient.category,
      Status: recipient.status,
      'Required Amount': recipient.requiredAmount,
      'Donated Amount': recipient.donatedAmount,
      'Balance Amount': recipient.balanceAmount,
      'Completion Rate': `${recipient.completionRate}%`,
      'Registration Date': recipient.registrationDate,
      Urgency: recipient.urgency,
      'Verification Status': recipient.verificationStatus
    }));

    // Create CSV content
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `recipients_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Real PDF export functionality
  const handleExportPDF = () => {
    // Create a printable version of the data
    const printContent = `
      <html>
        <head>
          <title>Recipients Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .summary { margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>Recipients Management Report</h1>
          <div class="summary">
            <strong>Generated on:</strong> ${new Date().toLocaleDateString()}<br>
            <strong>Total Recipients:</strong> ${filteredRecipients.length}<br>
            <strong>Total Required Amount:</strong> ₨${filteredRecipients.reduce((sum, r) => sum + r.requiredAmount, 0).toLocaleString()}<br>
            <strong>Total Donated Amount:</strong> ₨${filteredRecipients.reduce((sum, r) => sum + r.donatedAmount, 0).toLocaleString()}
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Category</th>
                <th>Status</th>
                <th>Required Amount</th>
                <th>Donated Amount</th>
                <th>Completion</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecipients.map(recipient => `
                <tr>
                  <td>${recipient.id}</td>
                  <td>${recipient.name}</td>
                  <td>${recipient.email}</td>
                  <td>${recipient.category}</td>
                  <td>${recipient.status}</td>
                  <td>₨${recipient.requiredAmount.toLocaleString()}</td>
                  <td>₨${recipient.donatedAmount.toLocaleString()}</td>
                  <td>${recipient.completionRate}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
    setSelectedCategory('All Categories');
    setSelectedVerification('All Verification');
    setSelectedUrgency('All Urgency');
    setDateRange({ start: '', end: '' });
  };

  const closeModals = () => {
    setShowRecipientModal(false);
    setShowAddRecipientModal(false);
    setShowForwardModal(false);
    setEditingRecipient(null);
    setSelectedRecipient(null);
    setRecipientToForward(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 px-3 sm:px-4">
      {/* Header Section - At Top */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 ${isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-white via-white to-gray-50'
          }`}
        style={{
          boxShadow: isDark
            ? '0 10px 40px rgba(0, 0, 0, 0.3)'
            : '0 10px 40px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-xl sm:text-2xl font-bold mb-1 sm:mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Recipients Management
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} truncate`}
            >
              Manage and track all recipient requests
            </motion.p>
          </div>

          {/* Mobile View: Stack buttons vertically */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Add New Recipient Button - Full width on mobile */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddRecipientModal(true)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-xl w-full sm:w-auto"
            >
              <UserPlus size={16} />
              <span className="truncate">Add New Recipient</span>
            </motion.button>

            {/* Export Buttons - Side by side on mobile, full width */}
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportExcel}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-xl flex-1 sm:flex-none"
              >
                <Download size={16} />
                <span className="truncate">Excel</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportPDF}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-xl flex-1 sm:flex-none"
              >
                <FileText size={16} />
                <span className="truncate">PDF</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
      >
        <ModernStatCard
          icon={Users}
          title="Total Recipients"
          value={stats.totalRecipients}
          change={8.3}
          changeType="increase"
          gradient="from-blue-500 via-blue-600 to-cyan-500"
          delay={0.1}
          isDark={isDark}
        />
        <ModernStatCard
          icon={UserCheck}
          title="Approved"
          value={stats.approvedRecipients}
          change={12.5}
          changeType="increase"
          gradient="from-emerald-500 via-emerald-600 to-teal-500"
          delay={0.2}
          isDark={isDark}
        />
        <ModernStatCard
          icon={Clock}
          title="Pending"
          value={stats.pendingRecipients}
          change={5.2}
          changeType="decrease"
          gradient="from-amber-500 via-amber-600 to-orange-500"
          delay={0.3}
          isDark={isDark}
        />
        <ModernStatCard
          icon={Shield}
          title="Verified"
          value={stats.verifiedRecipients}
          change={15.7}
          changeType="increase"
          gradient="from-violet-500 via-violet-600 to-purple-500"
          delay={0.4}
          isDark={isDark}
        />
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden ${isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-white via-white to-gray-50'
          }`}
        style={{
          boxShadow: isDark
            ? '0 10px 40px rgba(0, 0, 0, 0.3)'
            : '0 10px 40px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 relative">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative"
            >
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-violet-500" size={18} />
              <input
                type="text"
                placeholder="Search recipients by name, email, phone, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium transition-all ${isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
              />
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${showFilters
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-transparent'
              : isDark
                ? 'bg-gray-700 border-gray-600 text-white hover:border-violet-500'
                : 'bg-white border-gray-200 text-gray-700 hover:border-violet-500'
              }`}
          >
            <Filter size={16} />
            <span className="hidden xs:inline">Filters</span>
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </motion.button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className={`p-4 sm:p-6 rounded-2xl mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                }`}>
                {/* First row of filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className={`w-full p-2.5 sm:p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                        }`}
                    >
                      {statusOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={`w-full p-2.5 sm:p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                        }`}
                    >
                      {categoryOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      Verification
                    </label>
                    <select
                      value={selectedVerification}
                      onChange={(e) => setSelectedVerification(e.target.value)}
                      className={`w-full p-2.5 sm:p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                        }`}
                    >
                      {verificationOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Second row of filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      Urgency
                    </label>
                    <select
                      value={selectedUrgency}
                      onChange={(e) => setSelectedUrgency(e.target.value)}
                      className={`w-full p-2.5 sm:p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                        }`}
                    >
                      {urgencyOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className={`w-full p-2.5 sm:p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          }`}
                      />
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className={`w-full p-2.5 sm:p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {filteredRecipients.length} of {recipients.length} recipients
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResetFilters}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 text-sm font-semibold ${isDark
                      ? 'bg-gray-800 border-gray-600 text-white hover:border-violet-500'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-violet-500'
                      }`}
                  >
                    <RefreshCw size={16} />
                    Reset Filters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Recipients Card Grid */}
      {paginatedRecipients.length > 0 ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
          >
            {paginatedRecipients.map((recipient, index) => (
              <RecipientCard
                key={recipient.id}
                recipient={recipient}
                isDark={isDark}
                onView={handleViewRecipient}
                onEdit={handleEditRecipient}
                onDelete={handleDeleteRecipient}
                onForward={handleOpenForwardModal}
                onApprove={handleApproveRecipient}
                onStatusChange={handleStatusChange}
                index={index}
              />
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isDark={isDark}
            />
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-20 text-center ${isDark
            ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-white via-white to-gray-50'
            }`}
          style={{
            boxShadow: isDark
              ? '0 10px 40px rgba(0, 0, 0, 0.3)'
              : '0 10px 40px rgba(0, 0, 0, 0.08)'
          }}
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity
            }}
          >
            <Users size={48} className={`mx-auto mb-3 sm:mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          </motion.div>
          <p className={`text-sm sm:text-base font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No recipients found matching your criteria
          </p>
          <p className={`text-xs sm:text-sm font-medium mt-1 sm:mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Try adjusting your filters or search term
          </p>
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showRecipientModal && selectedRecipient && (
          <RecipientDetailModal
            recipient={selectedRecipient}
            isDark={isDark}
            onClose={closeModals}
            onStatusChange={handleStatusChange}
            onVerificationChange={handleVerificationChange}
            availableAdmins={availableAdmins}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddRecipientModal && (
          <AddRecipientModal
            isDark={isDark}
            recipient={editingRecipient}
            onClose={closeModals}
            onAddRecipient={handleAddRecipient}
            onUpdateRecipient={handleUpdateRecipient}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForwardModal && recipientToForward && (
          <ForwardModal
            isDark={isDark}
            recipient={recipientToForward}
            onClose={closeModals}
            onForward={handleForwardConfirm}
          />
        )}
      </AnimatePresence>

      {/* Confirmation Dialogs */}
      <AnimatePresence>
        {showDeleteDialog && (
          <ConfirmationDialog
            isDark={isDark}
            title="Delete Recipient"
            message={`Are you sure you want to delete ${recipientToDelete?.name}? This action cannot be undone.`}
            onConfirm={confirmDelete}
            onCancel={() => setShowDeleteDialog(false)}
            confirmText="Delete"
            cancelText="Cancel"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForwardConfirmDialog && (
          <ConfirmationDialog
            isDark={isDark}
            title="Forward Recipient"
            message={`Are you sure you want to forward this recipient to ${availableAdmins.find(a => a.id === forwardData?.targetAdminId)?.name}?`}
            onConfirm={confirmForward}
            onCancel={() => setShowForwardConfirmDialog(false)}
            confirmText="Forward"
            cancelText="Cancel"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showApproveDialog && (
          <ConfirmationDialog
            isDark={isDark}
            title="Approve Recipient"
            message={`Are you sure you want to approve ${recipientToApprove?.name}? This will change their status to Approved.`}
            onConfirm={confirmApprove}
            onCancel={() => setShowApproveDialog(false)}
            confirmText="Approve"
            cancelText="Cancel"
          />
        )}
      </AnimatePresence>

      {/* Success Dialog */}
      <AnimatePresence>
        {showSuccessDialog && (
          <SuccessDialog
            isDark={isDark}
            title="Success"
            message={successMessage}
            onClose={() => setShowSuccessDialog(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecipientsManagement;