import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';
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
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Camera,
  AlertCircle,
  MessageSquare,
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
  Upload,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  IdCard,
  Briefcase,
  Car,
  Stethoscope,
  Cpu,
  ShoppingBag,
  Sprout,
  User,
  Building,
  Banknote,
  GraduationCap,
  IndianRupee
} from 'lucide-react';

// Add this function after the formatValue function
const getFullFormattedNumber = (num, isCurrency = false) => {
  if (num === null || num === undefined) {
    return isCurrency ? '₹0' : '0';
  }

  // Handle string numbers
  const parsedNum = typeof num === 'string' ? parseFloat(num.replace(/[^0-9.-]+/g, '')) : num;

  if (isNaN(parsedNum) || !isFinite(parsedNum)) {
    return isCurrency ? '₹0' : '0';
  }

  const isNegative = parsedNum < 0;
  const prefix = isNegative ? '-' : '';
  const currencyPrefix = isCurrency ? '' : '';

  // For extremely large numbers, use scientific notation
  if (Math.abs(parsedNum) >= 1e15) {
    return `${prefix}${currencyPrefix}${Math.abs(parsedNum).toExponential(2)}`;
  }

  return `${prefix}${currencyPrefix}${Math.abs(parsedNum).toLocaleString('en-IN')}`;
};

// Format value function similar to the one you provided
const formatValue = (val, isCurrency = false) => {
  if (val === null || val === undefined) {
    return isCurrency ? '₹0' : '0';
  }

  // Handle extremely large numbers with scientific notation for display
  const num = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]+/g, '')) : val;

  if (isNaN(num) || !isFinite(num)) {
    return isCurrency ? '₹0' : '0';
  }

  const absNum = Math.abs(num);
  const isNegative = num < 0;
  const prefix = isNegative ? '-' : '';
  const currencyPrefix = isCurrency ? '₹' : '';

  // For display - use compact format with dynamic scaling
  let displayValue;
  let suffix = '';

  // Helper function to format with 2 decimal places without rounding
  const formatWithTwoDecimals = (value) => {
    // Convert to string, split by decimal point
    const [whole, decimal] = value.toFixed(10).split('.');
    // Take first 2 decimal places without rounding
    const decimalPart = decimal ? decimal.slice(0, 2) : '00';
    // Remove trailing zeros
    const trimmedDecimal = decimalPart.replace(/0+$/, '');
    return trimmedDecimal ? `${whole}.${trimmedDecimal}` : whole;
  };

  // Helper function to format with 1 decimal place without rounding
  const formatWithOneDecimal = (value) => {
    const [whole, decimal] = value.toFixed(10).split('.');
    const decimalPart = decimal ? decimal.slice(0, 1) : '0';
    // Remove trailing zeros
    const trimmedDecimal = decimalPart.replace(/0+$/, '');
    return trimmedDecimal ? `${whole}.${trimmedDecimal}` : whole;
  };

  if (absNum >= 1e24) {
    displayValue = formatWithTwoDecimals(absNum / 1e24);
    suffix = ' Y'; // Yotta
  } else if (absNum >= 1e21) {
    displayValue = formatWithTwoDecimals(absNum / 1e21);
    suffix = ' Z'; // Zetta
  } else if (absNum >= 1e18) {
    displayValue = formatWithTwoDecimals(absNum / 1e18);
    suffix = ' E'; // Exa
  } else if (absNum >= 1e15) {
    displayValue = formatWithTwoDecimals(absNum / 1e15);
    suffix = ' P'; // Peta
  } else if (absNum >= 1e12) {
    displayValue = formatWithTwoDecimals(absNum / 1e12);
    suffix = ' T'; // Tera
  } else if (absNum >= 1e9) {
    displayValue = formatWithTwoDecimals(absNum / 1e9);
    suffix = ' B'; // Billion
  } else if (absNum >= 1e7) {
    // For crores, show 2 decimal places for values < 100Cr, 1 decimal for larger
    const croreValue = absNum / 1e7;
    if (croreValue < 100) {
      displayValue = formatWithTwoDecimals(croreValue);
    } else {
      displayValue = formatWithOneDecimal(croreValue);
    }
    suffix = ' Cr'; // Crore
  } else if (absNum >= 1e5) {
    // For lakhs, show 2 decimal places for values < 10L, 1 decimal for larger
    const lakhValue = absNum / 1e5;
    if (lakhValue < 10) {
      displayValue = formatWithTwoDecimals(lakhValue);
    } else {
      displayValue = formatWithOneDecimal(lakhValue);
    }
    suffix = ' L'; // Lakh
  } else if (absNum >= 1e3) {
    // For thousands, show 1 decimal place for values < 10K, whole number for larger
    const thousandValue = absNum / 1e3;
    if (thousandValue < 10) {
      displayValue = formatWithOneDecimal(thousandValue);
    } else {
      displayValue = Math.floor(thousandValue).toString();
    }
    suffix = ' K'; // Thousand
  } else {
    // For numbers less than 1000, show full number
    return `${prefix}${currencyPrefix}${absNum.toLocaleString('en-IN')}`;
  }

  // Remove trailing decimal point if no decimals
  if (displayValue.endsWith('.')) {
    displayValue = displayValue.slice(0, -1);
  }

  return `${prefix}${currencyPrefix}${displayValue}${suffix}`;
};

const SuccessDialog = memo(({ isDark, title, message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      style={{ margin: 0, padding: 0 }}
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
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl text-sm font-semibold shadow-xl min-w-[120px]"
            >
              Okay
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

const ConfirmationDialog = memo(({ isDark, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      style={{ margin: 0, padding: 0 }}
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

          <div className="flex gap-2 sm:gap-3 flex-nowrap">
            <motion.button
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 min-w-[100px] px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${isDark
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
              className="flex-1 min-w-[100px] px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold shadow-xl"
            >
              {confirmText}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

const EnhancedStatCard = memo(({
  icon: Icon,
  title,
  value,
  fullNumber,
  change,
  changeType,
  color,
  delay,
  isDark,
  subtitle,
  isCurrency = false
}) => {
  const formattedValue = useMemo(() => {
    if (typeof value === 'number' || typeof value === 'string') {
      return formatValue(value, isCurrency);
    }
    return value;
  }, [value, isCurrency]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring", default: { duration: 0.2, ease: "easeOut" } }}
      whileHover={{
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className={`rounded-2xl p-6 shadow-xl border relative overflow-hidden group cursor-pointer ${isDark
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}
      style={{
        willChange: 'transform, opacity',
        contain: 'layout style',
        transform: 'translateZ(0)',
      }}
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}
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

      <motion.div
        className="absolute -top-4 -right-4 opacity-10"
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon size={80} />
      </motion.div>

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {title}
            </p>
            <motion.h3
              className={`text-3xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent ${color.includes('blue') ? 'from-blue-500 to-cyan-500' :
                color.includes('emerald') ? 'from-emerald-500 to-teal-500' :
                  color.includes('violet') ? 'from-violet-500 to-purple-500' :
                    color.includes('rose') ? 'from-rose-500 to-pink-500' :
                      'from-amber-500 to-orange-500'
                }`}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: "spring" }}
              title={fullNumber}
            >
              {formattedValue}
            </motion.h3>
            {subtitle && (
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {subtitle}
              </p>
            )}
          </div>

          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className={`p-3 rounded-xl backdrop-blur-sm ${isDark ? 'bg-white/5' : 'bg-black/5'
                }`}
            >
              <Icon
                size={24}
                strokeWidth={2.5}
                className={
                  color.includes('blue') ? 'text-blue-500' :
                    color.includes('emerald') ? 'text-emerald-500' :
                      color.includes('violet') ? 'text-violet-500' :
                        color.includes('rose') ? 'text-rose-500' :
                          'text-amber-500'
                }
              />
            </motion.div>
          </motion.div>
        </div>

        {change && (
          <motion.div
            className="flex items-center gap-1 mt-3"
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
    </motion.div>
  );
});

const ProfileProgressCircle = memo(({ percentage, size = 100, isDark }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 75) return '#10b981';
    if (percentage >= 50) return '#3b82f6';
    if (percentage >= 25) return '#f59e0b';
    return '#ef4444';
  };

  const color = getColor();

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDark ? '#374151' : '#e5e7eb'}
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="8"
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

      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {percentage}%
        </span>
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Complete
        </span>
      </div>
    </div>
  );
});

const recipientsData = [
  {
    id: 'REC-001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91-98765-43210',
    aadhaarNumber: '1234-5678-9012',
    panNumber: 'ABCDE1234F',
    dateOfBirth: '1979-05-15',
    address: 'Mumbai, Maharashtra',
    occupation: 'Business Owner',
    familyDetails: 'Wife and 2 children',
    bankName: 'State Bank of India',
    accountNumber: '123456789012',
    ifscCode: 'SBIN0001234',
    accountHolderName: 'Rajesh Kumar',
    branchName: 'Mumbai Main Branch',
    upiId: 'rajesh.kumar@upi',
    accountType: 'Savings',
    status: 'Verified',
    registrationDate: '2024-01-15',
    documents: [
      { name: 'aadhaar_card.pdf', size: '2.1 MB', type: 'application/pdf' },
      { name: 'pan_card.pdf', size: '1.5 MB', type: 'application/pdf' },
      { name: 'address_proof.pdf', size: '1.2 MB', type: 'application/pdf' },
      { name: 'income_proof.pdf', size: '1.8 MB', type: 'application/pdf' },
      { name: 'bank_proof.pdf', size: '1.0 MB', type: 'application/pdf' }
    ],
    completionPercentage: 100,
    submittedAt: '2024-01-15',
    verificationStatus: 'Verified',
    approver: 'Admin User',
    assignee: 'admin1',
    forwardingHistory: [
      {
        fromAdmin: 'admin2',
        toAdmin: 'admin1',
        reason: 'Medical expertise required for heart surgery case',
        timestamp: '2024-01-20T14:30:00Z'
      }
    ],
    totalAmountReceived: 5000000,
    donationsCount: 15,
    createdBy: 'Super Admin',
    approvers: ['admin1', 'admin2'],
    approvedBy: ['admin1', 'admin3']
  },
  {
    id: 'REC-002',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91-98765-54321',
    aadhaarNumber: '2345-6789-0123',
    panNumber: 'BCDEF2345G',
    dateOfBirth: '2002-03-20',
    address: 'Delhi, NCR',
    occupation: 'Student',
    familyDetails: 'Parents and 3 siblings',
    bankName: 'HDFC Bank',
    accountNumber: '234567890123',
    ifscCode: 'HDFC0002345',
    accountHolderName: 'Priya Sharma',
    branchName: 'Delhi Central',
    upiId: '',
    accountType: 'Savings',
    status: 'Submitted',
    registrationDate: '2024-02-20',
    documents: [
      { name: 'aadhaar_card.pdf', size: '2.0 MB', type: 'application/pdf' },
      { name: 'pan_card.pdf', size: '0.8 MB', type: 'application/pdf' },
      { name: 'address_proof.pdf', size: '1.1 MB', type: 'application/pdf' }
    ],
    completionPercentage: 85,
    submittedAt: '2024-01-15',
    verificationStatus: 'Pending',
    approver: 'Approver 1',
    assignee: 'admin2',
    forwardingHistory: [],
    totalAmountReceived: 1500000,
    createdBy: 'Super Admin',
    donationsCount: 8,
    approvers: ['admin1', 'admin2'],
    approvedBy: []
  },
  {
    id: 'REC-003',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91-98765-65432',
    aadhaarNumber: '3456-7890-1234',
    panNumber: 'CDEFG3456H',
    dateOfBirth: '1989-07-10',
    address: 'Bangalore, Karnataka',
    occupation: 'Shopkeeper',
    familyDetails: 'Wife and 3 children',
    bankName: 'ICICI Bank',
    accountNumber: '345678901234',
    ifscCode: 'ICIC0003456',
    accountHolderName: 'Vikram Singh',
    branchName: 'Bangalore Branch',
    upiId: 'vikram.singh@upi',
    accountType: 'Current',
    status: 'Under Review',
    registrationDate: '2024-03-10',
    documents: [
      { name: 'aadhaar_card.pdf', size: '1.9 MB', type: 'application/pdf' },
      { name: 'pan_card.pdf', size: '1.0 MB', type: 'application/pdf' }
    ],
    completionPercentage: 85,
    submittedAt: '2024-01-15',
    verificationStatus: 'Not Started',
    approver: null,
    assignee: 'admin3',
    forwardingHistory: [
      {
        fromAdmin: 'admin1',
        toAdmin: 'admin3',
        reason: 'Emergency case needs specialized handling',
        timestamp: '2024-03-15T09:15:00Z'
      }
    ],
    totalAmountReceived: 3500000,
    donationsCount: 22,
    createdBy: 'Super Admin',
    approvers: ['admin1', 'admin2'],
    approvedBy: ['admin1']
  },
  {
    id: 'REC-004',
    name: 'Anjali Patel',
    email: 'anjali.patel@email.com',
    phone: '+91-98765-76543',
    aadhaarNumber: '4567-8901-2345',
    panNumber: 'DEFGH4567I',
    dateOfBirth: '1996-11-25',
    address: 'Ahmedabad, Gujarat',
    occupation: 'Teacher',
    familyDetails: 'Husband and 1 child',
    bankName: 'Axis Bank',
    accountNumber: '456789012345',
    ifscCode: 'UTIB0004567',
    accountHolderName: 'Anjali Patel',
    branchName: 'Ahmedabad Main',
    upiId: 'anjali.patel@upi',
    accountType: 'Savings',
    status: 'Under Review',
    registrationDate: '2024-04-05',
    documents: [
      { name: 'aadhaar_card.pdf', size: '2.2 MB', type: 'application/pdf' },
      { name: 'pan_card.pdf', size: '1.1 MB', type: 'application/pdf' },
      { name: 'address_proof.pdf', size: '1.3 MB', type: 'application/pdf' }
    ],
    completionPercentage: 85,
    submittedAt: '2024-01-15',
    verificationStatus: 'Verified',
    approver: 'Admin User',
    assignee: 'admin1',
    forwardingHistory: [],
    totalAmountReceived: 12000000,
    donationsCount: 45,
    createdBy: 'Super Admin',
    approvers: ['admin1', 'admin2'],
  },
  {
    id: 'REC-005',
    name: 'Amit Verma',
    email: 'amit.verma@email.com',
    phone: '+91-98765-87654',
    aadhaarNumber: '5678-9012-3456',
    panNumber: 'EFGHI5678J',
    dateOfBirth: '1974-08-12',
    address: 'Lucknow, Uttar Pradesh',
    occupation: 'Farmer',
    familyDetails: 'Wife and 5 children',
    bankName: 'Punjab National Bank',
    accountNumber: '567890123456',
    ifscCode: 'PUNB0005678',
    accountHolderName: 'Amit Verma',
    branchName: 'Lucknow Rural',
    upiId: '',
    accountType: 'Savings',
    status: 'Rejected',
    registrationDate: '2024-05-12',
    documents: [
      { name: 'aadhaar_card.pdf', size: '2.0 MB', type: 'application/pdf' },
      { name: 'pan_card.pdf', size: '1.2 MB', type: 'application/pdf' }
    ],
    completionPercentage: 85,
    submittedAt: '2024-01-15',
    verificationStatus: 'Rejected',
    approver: 'Approver 2',
    assignee: 'admin1',
    forwardingHistory: [
      {
        fromAdmin: 'admin3',
        toAdmin: 'admin1',
        reason: 'Escalation for complex housing case review',
        timestamp: '2024-05-18T16:45:00Z'
      }
    ],
    totalAmountReceived: 800000,
    createdBy: 'Super Admin',
    donationsCount: 5,
    approvers: ['admin1', 'admin2'],
  },
  {
    id: 'REC-006',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@email.com',
    phone: '+91-98765-98765',
    aadhaarNumber: '6789-0123-4567',
    panNumber: 'FGHIJ6789K',
    dateOfBirth: '2004-01-08',
    address: 'Hyderabad, Telangana',
    occupation: 'Student',
    familyDetails: 'Parents and 2 siblings',
    bankName: 'Bank of Baroda',
    accountNumber: '678901234567',
    ifscCode: 'BARB0006789',
    accountHolderName: 'Sneha Reddy',
    branchName: 'Hyderabad City',
    upiId: 'sneha.reddy@upi',
    accountType: 'Savings',
    status: 'Submitted',
    registrationDate: '2024-06-08',
    documents: [
      { name: 'aadhaar_card.pdf', size: '1.8 MB', type: 'application/pdf' },
      { name: 'pan_card.pdf', size: '1.2 MB', type: 'application/pdf' }
    ],
    completionPercentage: 85,
    submittedAt: '2024-01-15',
    verificationStatus: 'Verified',
    approver: 'Admin User',
    assignee: 'admin2',
    forwardingHistory: [],
    totalAmountReceived: 25000000,
    donationsCount: 78,
    createdBy: 'Approver 1',
    approvers: ['admin1', 'admin2'],
  },
  {
    id: 'REC-007',
    name: 'Rahul Mehta',
    email: 'rahul.mehta@email.com',
    phone: '+91-98765-09876',
    aadhaarNumber: '7890-1234-5678',
    panNumber: 'GHIJK7890L',
    dateOfBirth: '1986-09-30',
    address: 'Chennai, Tamil Nadu',
    occupation: 'Driver',
    familyDetails: 'Wife and 2 children',
    bankName: 'Kotak Mahindra Bank',
    accountNumber: '789012345678',
    ifscCode: 'KKBK0007890',
    accountHolderName: 'Rahul Mehta',
    branchName: 'Chennai Main',
    upiId: '',
    accountType: 'Savings',
    status: 'Submitted',
    registrationDate: '2024-07-15',
    documents: [
      { name: 'aadhaar_card.pdf', size: '2.3 MB', type: 'application/pdf' },
      { name: 'pan_card.pdf', size: '1.4 MB', type: 'application/pdf' }
    ],
    completionPercentage: 85,
    submittedAt: '2024-01-15',
    verificationStatus: 'Pending',
    approver: 'Approver 1',
    assignee: 'admin3',
    forwardingHistory: [
      {
        fromAdmin: 'admin1',
        toAdmin: 'admin3',
        reason: 'Specialized medical case handling required',
        timestamp: '2024-07-20T11:20:00Z'
      }
    ],
    totalAmountReceived: 500000000,
    donationsCount: 1200,
    createdBy: 'Co-Approver 1',
    approvers: ['admin1', 'admin2'],
  },
];

// Available admins for forwarding
const availableAdmins = [
  { id: 'admin1', name: 'Super Admin', role: 'super_admin' },
  { id: 'admin2', name: 'Approver 1', role: 'approver' },
  { id: 'admin3', name: 'Co-Approver 1', role: 'co_approver' },
  { id: 'admin4', name: 'Support Admin', role: 'support' }
];

// Add this after availableAdmins definition (around line ~4666)
const approversList = [
  { id: 'admin1', name: 'Super Admin', role: 'Super Admin', department: 'Management' },
  { id: 'admin2', name: 'Approver 1', role: 'Approver', department: 'Verification' },
  { id: 'admin3', name: 'Co-Approver 1', role: 'Co-Approver', department: 'Support' },
  { id: 'admin4', name: 'Support Admin', role: 'Support', department: 'Customer Support' }
];

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (formData) => {
  let totalFields = 0;
  let completedFields = 0;

  const personalInfoFields = [
    'name', 'email', 'phone', 'aadhaarNumber', 'panNumber',
    'dateOfBirth', 'address', 'occupation'
  ];

  personalInfoFields.forEach(field => {
    totalFields++;
    if (formData[field] && formData[field].toString().trim() !== '') {
      completedFields++;
    }
  });

  const bankFields = [
    'bankName', 'accountNumber', 'ifscCode', 'accountHolderName',
    'branchName', 'accountType'
  ];

  bankFields.forEach(field => {
    totalFields++;
    if (formData[field] && formData[field].toString().trim() !== '') {
      completedFields++;
    }
  });

  totalFields++;
  if (formData.documents && formData.documents.length > 0) {
    completedFields++;
  }

  return Math.round((completedFields / totalFields) * 100);
};

// Occupation Configuration Function
const getOccupationConfig = (occupation) => {
  // Normalize occupation string for matching
  const normalizedOccupation = occupation?.toString().toLowerCase().trim() || '';

  const configs = {
    // Business/Entrepreneur
    'business': {
      icon: Briefcase,
      color: '#8b5cf6', // Violet
      gradient: 'from-violet-500 to-purple-500',
      textColor: 'text-violet-600',
      bgColor: 'bg-violet-500/20',
      borderColor: 'border-violet-500'
    },
    'entrepreneur': {
      icon: Briefcase,
      color: '#8b5cf6',
      gradient: 'from-violet-500 to-purple-500',
      textColor: 'text-violet-600',
      bgColor: 'bg-violet-500/20',
      borderColor: 'border-violet-500'
    },
    'business owner': {
      icon: Briefcase,
      color: '#8b5cf6',
      gradient: 'from-violet-500 to-purple-500',
      textColor: 'text-violet-600',
      bgColor: 'bg-violet-500/20',
      borderColor: 'border-violet-500'
    },

    // Student/Education
    'student': {
      icon: GraduationCap,
      color: '#3b82f6', // Blue
      gradient: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500'
    },
    'education': {
      icon: GraduationCap,
      color: '#3b82f6',
      gradient: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500'
    },

    // Teacher/Professor
    'teacher': {
      icon: UserPlus,
      color: '#10b981', // Emerald
      gradient: 'from-emerald-500 to-green-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500'
    },
    'professor': {
      icon: UserPlus,
      color: '#10b981',
      gradient: 'from-emerald-500 to-green-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500'
    },

    // Shopkeeper/Merchant
    'shopkeeper': {
      icon: ShoppingBag,
      color: '#f59e0b', // Amber
      gradient: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500'
    },
    'merchant': {
      icon: ShoppingBag,
      color: '#f59e0b',
      gradient: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500'
    },

    // Farmer/Agriculture
    'farmer': {
      icon: Sprout,
      color: '#22c55e', // Green
      gradient: 'from-green-500 to-emerald-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500'
    },
    'agriculture': {
      icon: Sprout,
      color: '#22c55e',
      gradient: 'from-green-500 to-emerald-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500'
    },

    // Driver/Transport
    'driver': {
      icon: Car,
      color: '#6366f1', // Indigo
      gradient: 'from-indigo-500 to-blue-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-500/20',
      borderColor: 'border-indigo-500'
    },
    'transport': {
      icon: Car,
      color: '#6366f1',
      gradient: 'from-indigo-500 to-blue-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-500/20',
      borderColor: 'border-indigo-500'
    },

    // Doctor/Medical
    'doctor': {
      icon: Stethoscope,
      color: '#ec4899', // Pink
      gradient: 'from-pink-500 to-rose-500',
      textColor: 'text-pink-600',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500'
    },
    'medical': {
      icon: Stethoscope,
      color: '#ec4899',
      gradient: 'from-pink-500 to-rose-500',
      textColor: 'text-pink-600',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500'
    },

    // Engineer/Tech
    'engineer': {
      icon: Cpu,
      color: '#0ea5e9', // Sky Blue
      gradient: 'from-sky-500 to-cyan-500',
      textColor: 'text-sky-600',
      bgColor: 'bg-sky-500/20',
      borderColor: 'border-sky-500'
    },
    'tech': {
      icon: Cpu,
      color: '#0ea5e9',
      gradient: 'from-sky-500 to-cyan-500',
      textColor: 'text-sky-600',
      bgColor: 'bg-sky-500/20',
      borderColor: 'border-sky-500'
    },

    // Bank/Finance
    'bank': {
      icon: Banknote,
      color: '#8b5cf6', // Violet
      gradient: 'from-violet-500 to-purple-500',
      textColor: 'text-violet-600',
      bgColor: 'bg-violet-500/20',
      borderColor: 'border-violet-500'
    },
    'finance': {
      icon: Banknote,
      color: '#8b5cf6',
      gradient: 'from-violet-500 to-purple-500',
      textColor: 'text-violet-600',
      bgColor: 'bg-violet-500/20',
      borderColor: 'border-violet-500'
    },

    // Government/Officer
    'government': {
      icon: Building,
      color: '#6b7280', // Gray
      gradient: 'from-gray-500 to-slate-500',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500'
    },
    'officer': {
      icon: Building,
      color: '#6b7280',
      gradient: 'from-gray-500 to-slate-500',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-500'
    },

    // Default
    'default': {
      icon: User,
      color: '#8b5cf6', // Violet (default)
      gradient: 'from-violet-500 to-purple-500',
      textColor: 'text-violet-600',
      bgColor: 'bg-violet-500/20',
      borderColor: 'border-violet-500'
    }
  };

  // Find matching config
  for (const [key, config] of Object.entries(configs)) {
    if (normalizedOccupation.includes(key)) {
      return config;
    }
  }

  // Return default if no match found
  return configs.default;
};

// Helper function to check which sections are complete
const getCompletionChecklist = (formData) => {
  return {
    personalInfo: ['name', 'email', 'phone', 'aadhaarNumber', 'panNumber',
      'dateOfBirth', 'address', 'occupation'].every(
        field => formData[field] && formData[field].toString().trim() !== ''
      ),
    bankDetails: ['bankName', 'accountNumber', 'ifscCode', 'accountHolderName',
      'branchName', 'accountType'].every(
        field => formData[field] && formData[field].toString().trim() !== ''
      ),
    requiredDocuments: formData.documents && formData.documents.length > 0
  };
};

// Update the statusOptions array to match your actual data
const statusOptions = [
  'All Status',
  'Submitted',
  'Under Review',
  'Verified',
  'Rejected'
];

// Shake animation variants
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

// Add this new ValidationModal component (similar to the one in requests management)
const RecipientValidationModal = ({ isDark, recipient, onClose, onValidate }) => {
  const [formData, setFormData] = useState({
    validationType: '',
    reason: '',
    comment: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const validateForm = () => {
    const errors = {};
    const shake = [];

    if (!formData.validationType) {
      errors.validationType = 'Please select validation type';
      shake.push('validationType');
    }

    // Reason is only required for rejection, optional for validation
    if (formData.validationType === 'reject' && !formData.reason.trim()) {
      errors.reason = 'Please provide a reason for rejection';
      shake.push('reason');
    }

    setFieldErrors(errors);
    setShakeFields(shake);

    setTimeout(() => {
      setShakeFields([]);
    }, 600);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmDialog(true);
    }
  };

  const confirmValidation = () => {
    onValidate(recipient.id, formData);
    setShowConfirmDialog(false);
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, pointerEvents: 'none' }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        style={{ margin: 0, padding: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, pointerEvents: 'none' }}
          transition={{ type: "spring", damping: 25 }}
          className={`rounded-3xl w-full max-w-md mx-auto ${isDark
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
                  Validate Recipient
                </h2>
                <p className="text-amber-100 text-xs sm:text-sm font-medium">
                  Validate or reject this recipient
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
              {/* Recipient Details */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Recipient Details
                </label>
                <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <p className={`text-sm sm:text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {recipient.name}
                  </p>
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {recipient.id} • {recipient.occupation}
                  </p>
                </div>
              </div>

              {/* Validation Type (Validate/Reject) */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Validation Type <span className="text-rose-500 font-normal normal-case">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    animate={shakeFields.includes('validationType') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="overflow-visible"
                  >
                    <input
                      type="radio"
                      id="validate"
                      name="validationType"
                      value="validate"
                      checked={formData.validationType === 'validate'}
                      onChange={(e) => handleFieldChange('validationType', e.target.value)}
                      className="hidden"
                    />
                    <label
                      htmlFor="validate"
                      className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.validationType === 'validate'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                        : isDark
                          ? 'border-gray-600 bg-gray-700 text-gray-400 hover:border-emerald-500'
                          : 'border-gray-200 bg-gray-100 text-gray-600 hover:border-emerald-500'
                        }`}
                    >
                      <CheckCircle size={16} />
                      Validate
                    </label>
                  </motion.div>

                  <motion.div
                    animate={shakeFields.includes('validationType') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="overflow-visible"
                  >
                    <input
                      type="radio"
                      id="reject"
                      name="validationType"
                      value="reject"
                      checked={formData.validationType === 'reject'}
                      onChange={(e) => handleFieldChange('validationType', e.target.value)}
                      className="hidden"
                    />
                    <label
                      htmlFor="reject"
                      className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.validationType === 'reject'
                        ? 'border-rose-500 bg-rose-500/10 text-rose-600'
                        : isDark
                          ? 'border-gray-600 bg-gray-700 text-gray-400 hover:border-rose-500'
                          : 'border-gray-200 bg-gray-100 text-gray-600 hover:border-rose-500'
                        }`}
                    >
                      <XCircle size={16} />
                      Reject
                    </label>
                  </motion.div>
                </div>
                {fieldErrors.validationType && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-rose-600 text-xs font-medium mt-1"
                  >
                    <AlertCircle size={12} />
                    {fieldErrors.validationType}
                  </motion.div>
                )}
              </div>

              {/* Reason/Comment Field */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Comments
                  <span className={`font-normal normal-case ${formData.validationType === 'reject' ? 'text-rose-500' : 'text-gray-400'}`}>
                    {formData.validationType === 'reject' ? ' *' : ' (Optional)'}
                  </span>
                </label>
                <div className="overflow-visible">
                  <motion.div
                    animate={shakeFields.includes('reason') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="overflow-visible"
                  >
                    <textarea
                      value={formData.reason}
                      onChange={(e) => handleFieldChange('reason', e.target.value)}
                      rows="3"
                      placeholder={formData.validationType === 'reject'
                        ? "Please provide a reason for rejection..."
                        : "Add an optional comment for validation..."}
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

              {/* Quick rejection reasons */}
              {formData.validationType === 'reject' && (
                <div className="mt-2">
                  <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Quick reasons:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Insufficient Documentation', 'Identity Verification Failed', 'Invalid Information', 'Address Verification Failed', 'Bank Details Mismatch', 'Duplicate Entry'].map((quickReason) => (
                      <button
                        key={quickReason}
                        type="button"
                        onClick={() => handleFieldChange('reason', quickReason)}
                        className={`text-xs px-3 py-1.5 rounded-full transition-all ${isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {quickReason}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-4 flex-nowrap">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 min-w-[100px] px-3 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${isDark
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
                  className="flex-1 min-w-[100px] px-3 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xl"
                >
                  <FileCheck size={16} />
                  Submit
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <ConfirmationDialog
            isDark={isDark}
            title={`Confirm ${formData.validationType === 'validate' ? 'Validation' : 'Rejection'}`}
            message={`Are you sure you want to ${formData.validationType === 'validate' ? 'validate' : 'reject'} this recipient?`}
            onConfirm={confirmValidation}
            onCancel={() => setShowConfirmDialog(false)}
            confirmText={formData.validationType === 'validate' ? 'Validate' : 'Reject'}
            cancelText="Cancel"
          />
        )}
      </AnimatePresence>
    </>
  );
};

const RecipientCard = memo(({ recipient, isDark, onView, onEdit, onDelete, onForward, onStatusChange, onVerifyReject, onValidate, index }) => {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverRef = useRef(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const occupationConfig = useMemo(() => getOccupationConfig(recipient.occupation), [recipient.occupation]);
  const Icon = occupationConfig.icon;
  const primaryColor = occupationConfig.color;
  const categoryColor = occupationConfig.gradient;

  useEffect(() => {
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

  const handleMouseEnter = () => {
    hoverRef.current = true;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverRef.current = false;
    setIsHovered(false);
  };

  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(recipient.dateOfBirth);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get occupation icon based on category
  const getOccupationIcon = (occupation) => {
    const icons = {
      'Business Owner': Briefcase,
      'Student': Users,
      'Shopkeeper': ShoppingBag,
      'Teacher': UserPlus,
      'Farmer': Sprout,
      'Driver': Car,
      'Doctor': Stethoscope,
      'Engineer': Cpu,
      'Bank Officer': Banknote,
      'Government Officer': Building
    };
    return icons[occupation] || Users;
  };

  const OccupationIcon = getOccupationIcon(recipient.occupation);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.5, type: "spring", default: { duration: 0.2, ease: "easeOut" } }}
      whileHover={{
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`rounded-2xl p-6 shadow-xl border relative overflow-hidden group cursor-pointer ${isDark
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}
      style={{
        willChange: 'transform',
        contain: 'layout style paint',
        transform: 'translateZ(0)'
      }}
    >
      {/* ========== FLOATING ORBS ANIMATION ========== */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: `${Math.random() * 18 + 6}px`,
              height: `${Math.random() * 18 + 6}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
              filter: 'blur(4px)',
              opacity: 0,
            }}
            animate={{
              y: isHovered ? [0, Math.random() * -100 - 30, Math.random() * -180 - 50] : 0,
              x: isHovered ? [0, Math.random() * 50 - 25, Math.random() * 50 - 25] : 0,
              opacity: isHovered ? [0, 0.5, 0] : 0,
              scale: isHovered ? [0, 1, 0] : 0,
            }}
            transition={{
              duration: isHovered ? Math.random() * 4 + 3 : 0.1,
              delay: isHovered ? i * 0.25 : 0,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: isHovered ? Math.random() * 1.5 + 0.5 : 0,
              ease: isHovered ? "easeOut" : "linear",
            }}
          />
        ))}
      </div>

      {/* ========== FLOATING RING ANIMATION ========== */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 m-auto rounded-full"
            style={{
              width: `${30 + i * 70}px`,
              height: `${30 + i * 70}px`,
              border: `2px solid ${primaryColor}`,
              opacity: 0,
              boxShadow: isHovered ? `0 0 15px ${primaryColor}40` : 'none'
            }}
            animate={{
              scale: isHovered ? [0.6, 1.6, 2.2] : 0.6,
              opacity: isHovered ? [0.2, 0.12, 0] : 0,
              rotate: isHovered ? [0, 180, 360] : 0,
            }}
            transition={{
              duration: isHovered ? 5 + i : 0.1,
              delay: isHovered ? i * 0.4 : 0,
              repeat: isHovered ? Infinity : 0,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* ========== PULSING GLOW EFFECT ========== */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: primaryColor,
          opacity: 0,
          filter: 'blur(50px)',
        }}
        animate={{
          opacity: isHovered ? [0.08, 0.15, 0.08] : 0,
          scale: isHovered ? [1, 1.12, 1] : 1,
        }}
        transition={{
          duration: isHovered ? 2.5 : 0.1,
          repeat: isHovered ? Infinity : 0,
          ease: "easeInOut"
        }}
      />

      {/* ========== SHIMMER LINES ANIMATION ========== */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(to right, transparent, ${primaryColor}80, transparent)`
          }}
          animate={{
            x: isHovered ? ['-100%', '200%'] : '-100%',
          }}
          transition={{
            duration: isHovered ? 1.8 : 0.1,
            delay: isHovered ? 0.8 : 0,
            repeat: isHovered ? Infinity : 0,
            repeatDelay: isHovered ? 1.5 : 0,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(to right, transparent, ${primaryColor}60, transparent)`
          }}
          animate={{
            x: isHovered ? ['200%', '-100%'] : '200%',
          }}
          transition={{
            duration: isHovered ? 2.2 : 0.1,
            delay: isHovered ? 0.3 : 0,
            repeat: isHovered ? Infinity : 0,
            repeatDelay: isHovered ? 0.8 : 0,
            ease: "linear"
          }}
        />

        {/* Additional diagonal shimmer lines */}
        <motion.div
          className="absolute top-0 left-0 w-1 h-20"
          style={{
            background: `linear-gradient(to bottom, transparent, ${primaryColor}50, transparent)`
          }}
          animate={{
            y: isHovered ? ['-100%', '300%'] : '-100%',
            rotate: isHovered ? [0, 15] : 0,
          }}
          transition={{
            duration: isHovered ? 2.5 : 0.1,
            delay: isHovered ? 0.5 : 0,
            repeat: isHovered ? Infinity : 0,
            repeatDelay: isHovered ? 2 : 0,
            ease: "linear"
          }}
        />
      </div>

      {/* ========== LIGHT BACKGROUND OVERLAY ========== */}
      <motion.div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${categoryColor}`}
        style={{
          opacity: 0,
        }}
        animate={{
          opacity: isHovered ? 0.05 : 0,
        }}
        transition={{
          duration: 0.1,
          ease: "easeInOut"
        }}
      />

      {/* ========== PARTICLE DOTS ========== */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute rounded-full"
            style={{
              width: '1px',
              height: '1px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: primaryColor,
              opacity: 0,
            }}
            animate={{
              opacity: isHovered ? [0, 0.3, 0] : 0,
              scale: isHovered ? [0, 1.5, 0] : 0,
            }}
            transition={{
              duration: isHovered ? Math.random() * 2 + 1 : 0.1,
              delay: isHovered ? i * 0.1 : 0,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: isHovered ? Math.random() * 3 + 2 : 0,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* ========== HEADER SECTION ========== */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4 flex-1">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative"
            >
              <motion.div
                animate={{
                  rotate: isHovered ? [0, 5, -5, 0] : 0,
                  scale: isHovered ? [1, 1.08, 1] : 1,
                }}
                transition={{
                  duration: isHovered ? 1.5 : 0.1,
                  repeat: isHovered ? Infinity : 0,
                  repeatDelay: isHovered ? 2 : 0
                }}
                className={`p-3 rounded-xl backdrop-blur-sm ${isDark ? 'bg-white/5' : 'bg-black/5'
                  }`}
                style={{
                  boxShadow: isHovered ? `0 0 20px ${primaryColor}30` : 'none'
                }}
              >
                <OccupationIcon
                  size={24}
                  strokeWidth={2.5}
                  style={{
                    color: primaryColor,
                    filter: isHovered ? `drop-shadow(0 0 8px ${primaryColor}50)` : 'none'
                  }}
                />
              </motion.div>
            </motion.div>

            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {recipient.name}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <motion.span
                  animate={{
                    scale: isHovered ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: isHovered ? 2 : 0.1,
                    repeat: isHovered ? Infinity : 0,
                    repeatDelay: isHovered ? 1 : 0
                  }}
                  className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} bg-gradient-to-r ${categoryColor} bg-clip-text text-transparent`}
                >
                  {recipient.id}
                </motion.span>
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  • {recipient.occupation}
                </span>
              </div>
            </div>
          </div>

          {/* ========== ACTION MENU ========== */}
          <div className="relative">
            <motion.button
              ref={buttonRef}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className={`p-2 rounded-xl backdrop-blur-sm ${isDark
                ? 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                } border transition-colors z-40 relative`}
            >
              <MoreVertical size={20} />
            </motion.button>

            <AnimatePresence>
              {showActions && (
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className={`absolute right-0 top-12 w-56 rounded-2xl overflow-visible z-[9999] ${isDark ? 'bg-gray-800' : 'bg-white'
                    }`}
                  style={{
                    boxShadow: `0 25px 50px rgba(0, 0, 0, 0.4), 0 10px 20px ${primaryColor}20`
                  }}
                >
                  <div className="p-2 space-y-1 relative z-[9999]">
                    <button
                      onClick={() => handleMenuAction(() => onView(recipient))}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-blue-500/20 text-gray-300' : 'hover:bg-blue-100 text-gray-700'
                        }`}
                    >
                      <Eye size={16} />
                      View Details
                    </button>

                    <button
                      onClick={() => handleMenuAction(() => onEdit(recipient))}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-amber-500/20 text-gray-300' : 'hover:bg-amber-100 text-gray-700'
                        }`}
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    {/* Show Verify/Reject option only for "Under Review" recipients */}
                    {recipient.status === 'Validated' && (
                      <button
                        onClick={() => handleMenuAction(() => onVerifyReject(recipient))}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-violet-500/20 text-gray-300' : 'hover:bg-violet-100 text-gray-700'
                          }`}
                      >
                        <CheckCircle size={16} />
                        Approval
                      </button>
                    )}

                    {recipient.status === 'Pending-Validation' && (
                      <button
                        onClick={() => handleMenuAction(() => onValidate(recipient))}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-emerald-500/20 text-gray-300' : 'hover:bg-emerald-100 text-gray-700'
                          }`}
                      >
                        <CheckCircle size={16} />
                        Validation
                      </button>
                    )}

                    <button
                      onClick={() => handleMenuAction(() => onForward(recipient))}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-violet-500/20 text-gray-300' : 'hover:bg-violet-100 text-gray-700'
                        }`}
                    >
                      <Send size={16} />
                      Forward
                    </button>

                    <div className={`my-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />

                    <button
                      onClick={() => handleMenuAction(() => onDelete(recipient))}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-rose-500/20 text-rose-400' : 'hover:bg-rose-100 text-rose-700'
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

        {/* ========== IDENTIFICATION INFO ========== */}
        <div className="mb-6">
          <div className={`p-3 sm:p-4 rounded-2xl space-y-2 sm:space-y-3 mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-2 sm:gap-3">
              <IdCard size={14} className={`${occupationConfig.textColor} flex-shrink-0`} />
              <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                Aadhaar: {recipient.aadhaarNumber}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <CreditCard size={14} className={`${occupationConfig.textColor} flex-shrink-0`} />
              <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                PAN: {recipient.panNumber}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Icon size={14} className={`${occupationConfig.textColor} flex-shrink-0`} />
              <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                {recipient.occupation}
              </span>
            </div>
          </div>
        </div>

        {/* ========== STATUS & OCCUPATION BADGES ========== */}
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            animate={{
              y: isHovered ? [0, -2, 0] : 0,
            }}
            transition={{
              duration: isHovered ? 1 : 0.1,
              repeat: isHovered ? Infinity : 0
            }}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gradient-to-r ${getStatusColor(recipient.status).gradient} text-white shadow-lg`}
            style={{
              boxShadow: isHovered ? '0 8px 25px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            {getStatusColor(recipient.status).icon && React.createElement(getStatusColor(recipient.status).icon, { size: 14 })}
            {recipient.status}
          </motion.div>
          <motion.div
            animate={{
              scale: isHovered ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: isHovered ? 1.5 : 0.1,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: isHovered ? 0.5 : 0
            }}
            className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium ${occupationConfig.bgColor} ${occupationConfig.textColor} border ${occupationConfig.borderColor}/30`}
          >
            <Icon size={12} className="flex-shrink-0" />
            <span className="truncate max-w-[80px] xs:max-w-[100px] sm:max-w-none">
              {recipient.occupation}
            </span>
          </motion.div>
        </div>

        {/* ========== CONTACT INFO ========== */}
        <div className={`p-3 sm:p-4 rounded-2xl space-y-2 sm:space-y-3 mb-1`}>
          <div className="flex items-center gap-2 sm:gap-3">
            <Mail size={14} className={`${occupationConfig.textColor} flex-shrink-0`} />
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} truncate`}>
              {recipient.email}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Phone size={14} className={`${occupationConfig.textColor} flex-shrink-0`} />
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} truncate`}>
              {recipient.phone}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <MapPin size={14} className={`${occupationConfig.textColor} flex-shrink-0`} />
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} truncate`}>
              {recipient.address}
            </span>
          </div>
        </div>

        {/* ========== APPROVERS SECTION - Only show for verified/validated recipients ========== */}
        {recipient.status === 'Validated' && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Approved by
              </p>
              <div className="flex items-center gap-2">
                {/* Show approval count with visual indicator */}
                <motion.div
                  animate={{
                    scale: isHovered ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: isHovered ? 1.5 : 0.1,
                    repeat: isHovered ? Infinity : 0,
                    repeatDelay: isHovered ? 0.5 : 0
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${(recipient.approvedBy?.length || 0) === ((recipient.approvers?.length || 0) + (recipient.coApprovers?.length || 0))
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-emerald-100 text-emerald-700'
                    : (recipient.approvedBy?.length || 0) > 0
                      ? isDark
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-amber-100 text-amber-700'
                      : isDark
                        ? 'bg-gray-700/50 text-gray-400'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                >
                  <UserCheck size={12} className="flex-shrink-0" />
                  <span className="font-semibold">
                    {recipient.approvedBy?.length || 0} / {((recipient.approvers?.length || 0) + (recipient.coApprovers?.length || 0))}
                  </span>
                  {(recipient.approvedBy?.length || 0) === ((recipient.approvers?.length || 0) + (recipient.coApprovers?.length || 0)) && (
                    <CheckCircle size={10} className="text-emerald-500 flex-shrink-0" />
                  )}
                </motion.div>
              </div>
            </div>

            {/* Show approved by section with only approved approvers */}
            {recipient.approvedBy?.length > 0 && (
              <div className="mt-1">
                <div className="flex flex-wrap gap-2">
                  {recipient.approvedBy.map((approverId, index) => {
                    const approver = availableAdmins.find(a => a.id === approverId);
                    const isCoApprover = recipient.coApprovers?.includes(approverId);
                    return (
                      <motion.div
                        key={approverId}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border ${isDark
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                      >
                        <CheckCircle size={12} className="flex-shrink-0" />
                        <span className="truncate max-w-[100px]">
                          {approver?.name || 'Unknown'}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* If no approvals yet */}
            {(!recipient.approvedBy || recipient.approvedBy.length === 0) && (
              <div className="mt-3">
                <p className={`text-xs italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  No approvals yet
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========== AGE & DOB INFO ========== */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            animate={{
              y: isHovered ? [0, -1, 0] : 0,
            }}
            transition={{
              duration: isHovered ? 1 : 0.1,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: isHovered ? 1.5 : 0
            }}
            className={`p-3 rounded-xl text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
          >
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Age
            </p>
            <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {age}
            </p>
          </motion.div>
          <motion.div
            animate={{
              y: isHovered ? [0, -1, 0] : 0,
            }}
            transition={{
              duration: isHovered ? 1 : 0.1,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: isHovered ? 2 : 0
            }}
            className={`p-3 rounded-xl text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
          >
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              DOB
            </p>
            <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {new Date(recipient.dateOfBirth).toLocaleDateString('en-IN')}
            </p>
          </motion.div>
        </div>

        {/* ========== CREATED BY & ASSIGNED TO INFO ========== */}
        {recipient.assignee ? (
          /* Two columns layout when assignee exists */
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Created By */}
            <div className={`p-3 rounded-xl flex flex-col items-center justify-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Created by
              </p>
              <p className={`text-sm font-semibold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {(() => {
                  const creator = recipient.createdBy || recipient.approver || 'Super Admin';
                  // Check if creator is the current user (admin1)
                  if (creator === 'Super Admin' || creator === 'admin1') {
                    return 'You';
                  }
                  return creator;
                })()}
              </p>
            </div>

            {/* Assigned To */}
            <div className={`p-3 rounded-xl flex flex-col items-center justify-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Assigned to
              </p>
              <p className={`text-sm font-semibold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {recipient.assignee === 'admin1'
                  ? 'You'
                  : availableAdmins.find(a => a.id === recipient.assignee)?.name || 'Unknown'
                }
              </p>
            </div>
          </div>
        ) : (
          /* Full width layout when no assignee */
          <div className="mb-6">
            <div className={`p-3 rounded-xl flex flex-col items-center justify-center w-full ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Created by
              </p>
              <p className={`text-sm font-semibold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {(() => {
                  const creator = recipient.createdBy || recipient.approver || 'Super Admin';
                  // Check if creator is the current user (admin1)
                  if (creator === 'Super Admin' || creator === 'admin1') {
                    return 'You';
                  }
                  return creator;
                })()}
              </p>
            </div>
          </div>
        )}

        {/* ========== FOOTER WITH DOCUMENTS ========== */}
        <div className="flex items-center justify-between text-xs font-medium pt-4 border-t border-gray-700/20">
          <div className="flex items-center gap-2">
            <Calendar size={14} className={`flex-shrink-0 ${occupationConfig.textColor}`} />
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              Registered: {formatDate(recipient.registrationDate)}
            </span>
          </div>

          <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium ${isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'
            }`}>
            <FileText size={12} className="flex-shrink-0" />
            {recipient.documents.length} Docs
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const getStatusColor = (status) => {
  const statusMap = {
    'incomplete': { gradient: 'from-slate-500 to-gray-600', icon: FileText },
    'pending': { gradient: 'from-amber-500 to-orange-500', icon: Clock },
    'submitted': { gradient: 'from-blue-500 to-cyan-500', icon: Send },
    'under review': { gradient: 'from-purple-500 to-pink-500', icon: Activity },
    'verified': { gradient: 'from-emerald-500 to-green-500', icon: CheckCircle },
    'rejected': { gradient: 'from-rose-500 to-red-500', icon: XCircle },
  };
  return statusMap[status.toLowerCase()] || { gradient: 'from-gray-500 to-gray-600', icon: FileText };
};

// Verification Modal Component - Updated with quick reasons for reject only
const VerificationModal = ({ isDark, recipient, onClose, onVerify, onReject }) => {
  const [formData, setFormData] = useState({
    verificationType: '',
    reason: '',
    comment: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const validateForm = () => {
    const errors = {};
    const shake = [];

    if (!formData.verificationType) {
      errors.verificationType = 'Please select verification type';
      shake.push('verificationType');
    }

    // Reason is only required for rejection, optional for verification
    if (formData.verificationType === 'reject' && !formData.reason.trim()) {
      errors.reason = 'Please provide a reason for rejection';
      shake.push('reason');
    }

    setFieldErrors(errors);
    setShakeFields(shake);

    setTimeout(() => {
      setShakeFields([]);
    }, 600);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmDialog(true);
    }
  };

  const confirmAction = () => {
    if (formData.verificationType === 'verify') {
      onVerify(recipient.id, formData.comment || formData.reason);
    } else if (formData.verificationType === 'reject') {
      onReject(recipient.id, formData.reason);
    }
    setShowConfirmDialog(false);
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, pointerEvents: 'none' }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        style={{ margin: 0, padding: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, pointerEvents: 'none' }}
          transition={{ type: "spring", damping: 25 }}
          className={`rounded-3xl w-full max-w-md mx-auto ${isDark
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
                  Approve Recipient
                </h2>
                <p className="text-violet-100 text-xs sm:text-sm font-medium">
                  Approve or reject this recipient
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
              {/* Recipient Details */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Recipient Details
                </label>
                <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <p className={`text-sm sm:text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {recipient.name}
                  </p>
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {recipient.id} • {recipient.occupation}
                  </p>
                </div>
              </div>

              {/* Verification Type (Verify/Reject) */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Verification Type <span className="text-rose-500 font-normal normal-case">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    animate={shakeFields.includes('verificationType') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="overflow-visible"
                  >
                    <input
                      type="radio"
                      id="verify"
                      name="verificationType"
                      value="verify"
                      checked={formData.verificationType === 'verify'}
                      onChange={(e) => handleFieldChange('verificationType', e.target.value)}
                      className="hidden"
                    />
                    <label
                      htmlFor="verify"
                      className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.verificationType === 'verify'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                        : isDark
                          ? 'border-gray-600 bg-gray-700 text-gray-400 hover:border-emerald-500'
                          : 'border-gray-200 bg-gray-100 text-gray-600 hover:border-emerald-500'
                        }`}
                    >
                      <CheckCircle size={16} />
                      Approve
                    </label>
                  </motion.div>

                  <motion.div
                    animate={shakeFields.includes('verificationType') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="overflow-visible"
                  >
                    <input
                      type="radio"
                      id="reject"
                      name="verificationType"
                      value="reject"
                      checked={formData.verificationType === 'reject'}
                      onChange={(e) => handleFieldChange('verificationType', e.target.value)}
                      className="hidden"
                    />
                    <label
                      htmlFor="reject"
                      className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.verificationType === 'reject'
                        ? 'border-rose-500 bg-rose-500/10 text-rose-600'
                        : isDark
                          ? 'border-gray-600 bg-gray-700 text-gray-400 hover:border-rose-500'
                          : 'border-gray-200 bg-gray-100 text-gray-600 hover:border-rose-500'
                        }`}
                    >
                      <XCircle size={16} />
                      Reject
                    </label>
                  </motion.div>
                </div>
                {fieldErrors.verificationType && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-rose-600 text-xs font-medium mt-1"
                  >
                    <AlertCircle size={12} />
                    {fieldErrors.verificationType}
                  </motion.div>
                )}
              </div>

              {/* Reason/Comment Field */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Comments
                  <span className={`font-normal normal-case ${formData.verificationType === 'reject' ? 'text-rose-500' : 'text-gray-400'}`}>
                    {formData.verificationType === 'reject' ? ' *' : ' (Optional)'}
                  </span>
                </label>
                <div className="overflow-visible">
                  <motion.div
                    animate={shakeFields.includes('reason') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="overflow-visible"
                  >
                    <textarea
                      value={formData.reason}
                      onChange={(e) => handleFieldChange('reason', e.target.value)}
                      rows="3"
                      placeholder={formData.verificationType === 'reject'
                        ? "Please provide a reason for rejection..."
                        : "Add an optional comment for verification..."}
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

              {/* Quick rejection reasons - ONLY SHOW FOR REJECT */}
              {formData.verificationType === 'reject' && (
                <div className="mt-2">
                  <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Quick reasons:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Identity Verification Failed',
                      'Invalid Information',
                      'Address Verification Failed',
                      'Document Verification Failed',
                      'Incomplete Documentation',
                      'Bank Details Mismatch',
                      'Duplicate Entry',
                      'Previous Rejection History',
                      'Income Proof Required',
                      'Age Verification Failed'
                    ].map((quickReason) => (
                      <button
                        key={quickReason}
                        type="button"
                        onClick={() => handleFieldChange('reason', quickReason)}
                        className={`text-xs px-3 py-1.5 rounded-full transition-all ${isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {quickReason}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-4 flex-nowrap">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 min-w-[100px] px-3 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${isDark
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
                  className="flex-1 min-w-[100px] px-3 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xl"
                >
                  <FileCheck size={16} />
                  Submit
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <ConfirmationDialog
            isDark={isDark}
            title={`Confirm ${formData.verificationType === 'verify' ? 'Approval' : 'Rejection'}`}
            message={`Are you sure you want to ${formData.verificationType === 'verify' ? 'approve' : 'reject'} this recipient?`}
            onConfirm={confirmAction}
            onCancel={() => setShowConfirmDialog(false)}
            confirmText={formData.verificationType === 'verify' ? 'Approve' : 'Reject'}
            cancelText="Cancel"
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Forward Modal Component
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

    setFieldErrors(errors);
    setShakeFields(shake);

    setTimeout(() => {
      setShakeFields([]);
    }, 600);

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

    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      style={{ margin: 0, padding: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, pointerEvents: 'none' }}
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
                Forward Recipient
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
                <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {recipient.id} • {recipient.occupation}
                </p>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                Forward To Admin <span className="text-rose-500 font-normal normal-case">*</span>
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
                          {admin.name}
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
                Reason for Forwarding <span className="text-rose-500 font-normal normal-case">*</span>
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
                    rows="3"
                    placeholder="Explain why you're forwarding this recipient..."
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

            <div className="flex gap-2 sm:gap-3 pt-4 flex-nowrap">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 min-w-[100px] px-3 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${isDark
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
                className="flex-1 min-w-[100px] px-3 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xl"
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

const DocumentUpload = React.memo(({ documents, onDocumentsChange, isDark, fieldErrors, onFieldError, shakeFields }) => {
  const [dragActive, setDragActive] = useState(false);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const getUniqueFileName = useCallback((fileName, existingNames) => {
    let newFileName = fileName;
    let counter = 1;

    // Check if file exists in the current list
    const nameExists = (name) => {
      return existingNames.some(existing =>
        existing.toLowerCase() === name.toLowerCase()
      );
    };

    // If name already exists, add suffix
    while (nameExists(newFileName)) {
      const dotIndex = fileName.lastIndexOf('.');
      const nameWithoutExt = dotIndex === -1 ? fileName : fileName.substring(0, dotIndex);
      const ext = dotIndex === -1 ? '' : fileName.substring(dotIndex);
      newFileName = `${nameWithoutExt} (${counter})${ext}`;
      counter++;
    }

    return newFileName;
  }, []);

  const handleFileChange = useCallback((e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles = [];
      const existingNames = documents.map(doc => doc.name.toLowerCase());

      files.forEach(file => {
        let fileName = file.name;
        let counter = 1;

        // Check for duplicate names and add suffix if needed
        while (existingNames.includes(fileName.toLowerCase())) {
          const dotIndex = file.name.lastIndexOf('.');
          const nameWithoutExt = dotIndex === -1 ? file.name : file.name.substring(0, dotIndex);
          const ext = dotIndex === -1 ? '' : file.name.substring(dotIndex);
          fileName = `${nameWithoutExt} (${counter})${ext}`;
          counter++;
        }

        newFiles.push({
          id: Date.now() + Math.random(),
          name: fileName,
          size: formatFileSize(file.size),
          type: file.type
        });
        existingNames.push(fileName.toLowerCase());
      });

      onDocumentsChange([...documents, ...newFiles]);
      if (onFieldError && newFiles.length > 0) {
        onFieldError('documents', '');
      }

      // Reset the file input value to allow re-selection of the same file
      e.target.value = '';
    }
  }, [documents, formatFileSize, onDocumentsChange, onFieldError]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      const existingNames = documents.map(doc => doc.name.toLowerCase());
      const newFiles = files.map(file => {
        const uniqueName = getUniqueFileName(file.name, existingNames);
        existingNames.push(uniqueName.toLowerCase());

        return {
          id: Date.now() + Math.random(),
          name: uniqueName,
          size: formatFileSize(file.size),
          type: file.type
        };
      });

      onDocumentsChange([...documents, ...newFiles]);
      if (onFieldError && newFiles.length > 0) {
        onFieldError('documents', '');
      }
    }
  }, [documents, onDocumentsChange, onFieldError, formatFileSize, getUniqueFileName]);

  const removeDocument = useCallback((id) => {
    const newDocuments = documents.filter(doc => doc.id !== id);
    onDocumentsChange(newDocuments);
    if (onFieldError && newDocuments.length === 0) {
      onFieldError('documents', 'Please upload at least one document');
    }
  }, [documents, onDocumentsChange, onFieldError]);

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
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
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
                  onClick={() => removeDocument(doc.id)}
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
});

const EnhancedAvatarUpload = memo(({ user, onAvatarChange, isDark, fieldErrors, onFieldError, shakeFields, fieldName = 'profilePhoto' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || null);
  const [isHovered, setIsHovered] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setPreviewUrl(user?.avatar || null);
  }, [user?.avatar]);

  // Effect to scroll when shaking starts
  useEffect(() => {
    if (shakeFields?.includes(fieldName) && containerRef.current) {
      // Scroll the container into view
      containerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });

      // Focus the container for better UX
      containerRef.current.focus();
    }
  }, [shakeFields, fieldName]);

  const validateAndProcessFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      const error = 'Only JPG, PNG, GIF, and WEBP images are allowed';
      setValidationError(error);
      if (onFieldError) {
        onFieldError(fieldName, error);
      }
      return false;
    }

    if (file.size > maxSize) {
      const error = 'Image size must be less than 5MB';
      setValidationError(error);
      if (onFieldError) {
        onFieldError(fieldName, error);
      }
      return false;
    }

    return true;
  };

  const processFile = (file) => {
    console.log('Processing file:', file.name);
    setIsLoading(true);
    setValidationError('');

    // Clear any previous errors
    if (onFieldError) {
      onFieldError(fieldName, '');
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target.result;
      setPreviewUrl(result);

      if (onAvatarChange) {
        console.log('Calling onAvatarChange with data URL length:', result.length);
        onAvatarChange(result);
      } else {
        console.error('onAvatarChange is not defined');
      }

      setValidationError('');
      setIsLoading(false);
    };

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      const errorMsg = 'Error reading file';
      setValidationError(errorMsg);
      if (onFieldError) {
        onFieldError(fieldName, errorMsg);
      }
      setIsLoading(false);
    };

    reader.onprogress = (data) => {
      if (data.lengthComputable) {
        const progress = (data.loaded / data.total) * 100;
        console.log('Reading progress:', progress.toFixed(0) + '%');
      }
    };

    try {
      reader.readAsDataURL(file);
      console.log('Started reading file as data URL');
    } catch (error) {
      console.error('Error starting file read:', error);
      setValidationError('Failed to read file');
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    console.log('File input change event triggered');
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
      if (!validateAndProcessFile(file)) {
        return;
      }
      processFile(file);
    } else {
      console.log('No file selected');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    console.log('File dropped');
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log('Dropped file:', file.name, 'Size:', file.size, 'Type:', file.type);
      if (!file.type.startsWith('image/')) {
        const error = 'Please drop an image file';
        setValidationError(error);
        if (onFieldError) {
          onFieldError(fieldName, error);
        }
        return;
      }

      if (!validateAndProcessFile(file)) {
        return;
      }
      processFile(file);
    }
  };

  const shakeAnimation = {
    initial: { x: 0 },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  return (
  <div 
    ref={containerRef}
    className="flex flex-col items-center space-y-4 focus:outline-none"
    tabIndex={-1}
  >
    {/* Rest of the component remains the same */}
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 15 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      {/* Animated Rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: isHovered
            ? [
              '0 0 0 4px rgba(139, 92, 246, 0.3)',
              '0 0 0 8px rgba(139, 92, 246, 0.2)',
              '0 0 0 12px rgba(139, 92, 246, 0.1)',
            ]
            : '0 0 0 0px rgba(139, 92, 246, 0)',
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Wrap only the avatar container with shake animation */}
      <motion.div
        animate={shakeFields?.includes(fieldName) ? "shake" : "initial"}
        variants={shakeAnimation}
        className="overflow-visible"
      >
        <div
          className={`relative w-32 h-32 rounded-full border-4 transition-all duration-200 ${isDragging
            ? 'border-violet-500 bg-violet-500/20 scale-110'
            : (fieldErrors?.[fieldName] || validationError)
              ? 'border-rose-500 bg-rose-500/20'
              : isDark
                ? 'border-gray-700 bg-gray-800'
                : 'border-gray-200 bg-gray-100'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <div className="w-full h-full rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
              onError={() => {
                console.error('Image failed to load');
                setPreviewUrl(null);
                const errorMsg = 'Failed to load image';
                setValidationError(errorMsg);
                if (onFieldError) {
                  onFieldError(fieldName, errorMsg);
                }
              }}
            />
          ) : (
            <div
              className="w-full h-full rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center"
            >
              <User size={48} className="text-white" />
            </div>
          )}

          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <Camera size={16} className="text-white" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </motion.div>
    </motion.div>

    {/* Error message display */}
    {(fieldErrors?.[fieldName] || validationError) && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1 text-rose-600 text-xs font-medium"
      >
        <XCircle size={12} />
        {fieldErrors?.[fieldName] || validationError}
      </motion.p>
    )}

    <div className="text-center">
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Click camera icon or drag & drop to upload
      </p>
      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
        JPG, PNG, GIF, WEBP • Max 5MB
      </p>
    </div>
  </div>
);
});

const RecipientDetailModal = ({ recipient, isDark, onClose, onStatusChange, onVerificationChange, availableAdmins }) => {
  const getAdminName = (adminId) => {
    const admin = availableAdmins.find(a => a.id === adminId);
    return admin ? admin.name : 'Unknown Admin';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(recipient.dateOfBirth);

  // Get all validation/approval/rejection comments
  const getAllComments = useMemo(() => {
    const comments = [];

    if (recipient.validationNotes && recipient.validationNotes.length > 0) {
      recipient.validationNotes.forEach(note => {
        comments.push({
          id: `validation-${note.id || Date.now()}-${Math.random()}`,
          text: note.text,
          timestamp: note.timestamp,
          admin: note.admin,
          type: note.type
        });
      });
    }

    return comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [recipient]);

  const [showComments, setShowComments] = useState(false);

  // Get icon and color based on comment type
  const getCommentConfig = (type) => {
    switch (type) {
      case 'validation':
      case 'approval':
      case 'verification':
        return {
          icon: CheckCircle,
          color: 'text-emerald-500',
          bgColor: isDark ? 'bg-emerald-500/20' : 'bg-emerald-100',
          borderColor: isDark ? 'border-emerald-500/30' : 'border-emerald-200',
          label: type === 'validation' ? 'Validated' : type === 'approval' ? 'Approved' : 'Verified'
        };
      case 'rejection':
        return {
          icon: XCircle,
          color: 'text-rose-500',
          bgColor: isDark ? 'bg-rose-500/20' : 'bg-rose-100',
          borderColor: isDark ? 'border-rose-500/30' : 'border-rose-200',
          label: 'Rejected'
        };
      default:
        return {
          icon: FileText,
          color: 'text-gray-500',
          bgColor: isDark ? 'bg-gray-500/20' : 'bg-gray-100',
          borderColor: isDark ? 'border-gray-500/30' : 'border-gray-200',
          label: 'Comment'
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      style={{ margin: 0, padding: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, pointerEvents: 'none' }}
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
        <div className="relative p-4 sm:p-6 md:p-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-t-3xl">
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
                      Aadhaar Number
                    </label>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipient.aadhaarNumber}</p>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      PAN Number
                    </label>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipient.panNumber}</p>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Date of Birth & Age
                    </label>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(recipient.dateOfBirth).toLocaleDateString('en-IN')} ({age} years)
                    </p>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Address
                    </label>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipient.address}</p>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Occupation
                    </label>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipient.occupation}</p>
                  </div>
                  {recipient.familyDetails && (
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Family Details
                      </label>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipient.familyDetails}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={`p-4 sm:p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <CreditCard size={18} className="text-blue-500" />
                  Bank Information
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Bank Name
                    </label>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {recipient.bankName}
                    </p>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Account Number
                    </label>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {recipient.accountNumber}
                    </p>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      IFSC Code
                    </label>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {recipient.ifscCode}
                    </p>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Account Holder Name
                    </label>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {recipient.accountHolderName}
                    </p>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Branch Name
                    </label>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {recipient.branchName}
                    </p>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Account Type
                    </label>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {recipient.accountType}
                    </p>
                  </div>

                  {recipient.upiId && (
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        UPI ID
                      </label>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {recipient.upiId}
                      </p>
                    </div>
                  )}
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
            </div>

            <div className={`p-4 sm:p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <h3 className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Activity size={18} className="text-violet-500" />
                Profile Completion Status
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex flex-col items-center">
                  <ProfileProgressCircle
                    percentage={recipient.completionPercentage || calculateProfileCompletion(recipient)}
                    size={120}
                    isDark={isDark}
                  />
                  <p className={`text-xs font-medium mt-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Profile Completeness
                  </p>

                  {/* Status Overview - Simple Line Format */}
                  <div className="mt-4 w-full max-w-xs">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Status
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${recipient.status === 'Unknown'
                        ? 'bg-gray-500/20 text-gray-600'
                        : recipient.status === 'Incomplete'
                          ? 'bg-amber-500/20 text-amber-600'
                          : recipient.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-600'
                            : recipient.status === 'Submitted'
                              ? 'bg-blue-500/20 text-blue-600'
                              : recipient.status === 'Under Review'
                                ? 'bg-purple-500/20 text-purple-600'
                                : recipient.status === 'Verified'
                                  ? 'bg-emerald-500/20 text-emerald-600'
                                  : recipient.status === 'Rejected'
                                    ? 'bg-rose-500/20 text-rose-600'
                                    : recipient.status === 'Approved'
                                      ? 'bg-green-500/20 text-green-600'
                                      : 'bg-gray-500/20 text-gray-600'
                        }`}>
                        {recipient.status}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {recipient.status === 'Unknown'}
                      {recipient.status === 'Incomplete'}
                      {recipient.status === 'Pending'}
                      {recipient.status === 'Submitted'}
                      {recipient.status === 'Under Review'}
                      {recipient.status === 'Verified'}
                      {recipient.status === 'Rejected'}
                      {recipient.status === 'Approved'}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Completion Checklist
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Personal Information', completed: getCompletionChecklist(recipient).personalInfo },
                      { label: 'Bank Details', completed: getCompletionChecklist(recipient).bankDetails },
                      { label: 'Required Documents', completed: getCompletionChecklist(recipient).requiredDocuments }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.completed
                          ? 'bg-emerald-500'
                          : isDark
                            ? 'bg-gray-600'
                            : 'bg-gray-300'
                          }`}>
                          {item.completed && (
                            <CheckCircle size={12} className="text-white" />
                          )}
                        </div>
                        <span className={`text-sm ${item.completed
                          ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                          : isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {recipient.submittedAt && (
                    <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Submitted on: {new Date(recipient.submittedAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

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
                          e.stopPropagation();
                          const link = document.createElement('a');
                          link.href = `/api/documents/${doc.name}`;
                          link.download = doc.name;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);

                          if (onStatusChange && recipient.status === 'Submitted') {
                            onStatusChange(recipient.id, 'Under Review');
                          }
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

            {/* Forwarding History Section - Kept exactly as is */}
            {recipient.forwardingHistory && recipient.forwardingHistory.length > 0 && (
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

            {/* Validation/Approval/Rejection Comments Section - Similar to forwarding history style */}
            {getAllComments.length > 0 && (
              <div className={`p-4 sm:p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <MessageSquare size={18} className="text-violet-500" />
                    Review Comments ({getAllComments.length})
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowComments(!showComments)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold ${isDark
                      ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                  >
                    {showComments ? (
                      <>
                        <ChevronUp size={16} />
                        Hide Comments
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        Show Comments
                      </>
                    )}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showComments && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 sm:space-y-4">
                        {getAllComments.map((comment, index) => {
                          const config = getCommentConfig(comment.type);
                          const Icon = config.icon;

                          return (
                            <motion.div
                              key={comment.id || index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'
                                }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                    <Icon size={14} className={`${config.color} flex-shrink-0`} />
                                    <span className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                      {config.label}
                                    </span>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                                      {getAdminName(comment.admin)}
                                    </span>
                                  </div>
                                  <p className={`text-xs font-medium mb-1 sm:mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {comment.text}
                                  </p>
                                  <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                    <Clock size={12} className="inline mr-1" />
                                    {formatDate(comment.timestamp)}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AddRecipientModal = ({ isDark, recipient, onClose, onAddRecipient, onUpdateRecipient }) => {
  const isEditing = !!recipient;
  const dropdownRef = useRef(null);

  // Function to get initial status for editing
  const getInitialStatusForEdit = (existingRecipient) => {
    // If it's already in a final state, keep it
    const finalStatuses = ['Submitted', 'Verified', 'Rejected', 'Under Review', 'Approved'];
    if (existingRecipient.status && finalStatuses.includes(existingRecipient.status)) {
      return existingRecipient.status;
    }

    // Otherwise calculate based on data
    return determineStatus(existingRecipient);
  };

  // Initial form data
  const initialFormData = isEditing ? {
    ...recipient,
    status: getInitialStatusForEdit(recipient)
  } : {
    name: '',
    email: '',
    phone: '',
    aadhaarNumber: '',
    panNumber: '',
    dateOfBirth: '',
    address: '',
    occupation: '',
    familyDetails: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    branchName: '',
    upiId: '',
    accountType: '',
    status: 'Unknown',
    verificationStatus: 'Not Started',
    documents: [],
    avatar: '' // Add avatar field to initial form data
  };

  const [formData, setFormData] = useState(initialFormData);
  const [originalData] = useState(initialFormData);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [completionChecklist, setCompletionChecklist] = useState({
    personalInfo: false,
    bankDetails: false,
    requiredDocuments: false
  });

  // Function to check if status should be updated (for editing)
  const shouldUpdateStatus = (currentStatus) => {
    const finalStatuses = ['Submitted', 'Verified', 'Rejected', 'Under Review', 'Approved'];
    return !finalStatuses.includes(currentStatus);
  };

  // Calculate completion percentage and update status
  useEffect(() => {
    const percentage = calculateProfileCompletion(formData);
    const checklist = getCompletionChecklist(formData);

    // For editing: only update status if it's not in a final state
    if (isEditing && !shouldUpdateStatus(formData.status)) {
      // Keep current status
    } else {
      // Determine new status based on current form data
      const newStatus = determineStatus(formData);

      // Update form data with new status (if changed)
      if (formData.status !== newStatus) {
        setFormData(prev => ({
          ...prev,
          status: newStatus
        }));
      }
    }

    setCompletionPercentage(percentage);
    setCompletionChecklist(checklist);
  }, [formData, isEditing]);

  // Function to determine status based on form data
  const determineStatus = (formData) => {
    // Check if any field is filled
    const hasAnyFieldFilled = () => {
      const fieldsToCheck = [
        'name', 'email', 'phone', 'aadhaarNumber', 'panNumber',
        'dateOfBirth', 'address', 'occupation', 'familyDetails',
        'bankName', 'accountNumber', 'ifscCode', 'accountHolderName',
        'branchName', 'upiId', 'accountType', 'avatar' // Add avatar to fields to check
      ];

      // Check if any field has content
      const hasFieldContent = fieldsToCheck.some(field => {
        const value = formData[field];
        return value && value.toString().trim() !== '';
      });

      // Check if there are documents
      const hasDocuments = formData.documents && formData.documents.length > 0;

      return hasFieldContent || hasDocuments;
    };

    // Check if all required fields are filled
    const areAllRequiredFieldsFilled = () => {
      const requiredFields = [
        'name', 'email', 'phone', 'aadhaarNumber', 'panNumber',
        'dateOfBirth', 'address', 'occupation', 'bankName',
        'accountNumber', 'ifscCode', 'accountHolderName',
        'branchName', 'accountType'
      ];

      // Check all required fields
      const allRequiredFilled = requiredFields.every(field => {
        const value = formData[field];
        return value && value.toString().trim() !== '';
      });

      // Check if there's at least one document
      const hasAtLeastOneDocument = formData.documents && formData.documents.length > 0;

      return allRequiredFilled && hasAtLeastOneDocument;
    };

    // Determine status
    if (!hasAnyFieldFilled()) {
      return 'Unknown';
    } else if (areAllRequiredFieldsFilled()) {
      return 'Pending';
    } else {
      return 'Incomplete';
    }
  };

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

  const formatPhoneNumber = (digits, countryCode) => {
    if (!digits) return '';

    const digitsOnly = digits.replace(/\D/g, '');

    if (countryCode === '+91') {
      const limitedDigits = digitsOnly.slice(0, 10);

      if (limitedDigits.length <= 3) {
        return limitedDigits;
      } else if (limitedDigits.length <= 5) {
        return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3)}`;
      } else if (limitedDigits.length <= 6) {
        return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3)}`;
      } else if (limitedDigits.length <= 7) {
        return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3)}`;
      } else if (limitedDigits.length <= 8) {
        return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3, 7)}-${limitedDigits.slice(7)}`;
      } else if (limitedDigits.length <= 9) {
        return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3, 7)}-${limitedDigits.slice(7)}`;
      } else {
        return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6, 10)}`;
      }
    }

    return digitsOnly;
  };

  // Create refs for all form fields for auto-scrolling
  const fieldRefs = {
    name: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    aadhaarNumber: useRef(null),
    panNumber: useRef(null),
    dateOfBirth: useRef(null),
    address: useRef(null),
    occupation: useRef(null),
    familyDetails: useRef(null),
    bankName: useRef(null),
    accountNumber: useRef(null),
    ifscCode: useRef(null),
    accountHolderName: useRef(null),
    branchName: useRef(null),
    upiId: useRef(null),
    accountType: useRef(null),
    documents: useRef(null),
    avatar: useRef(null) // Add avatar ref
  };

  const modalRef = useRef(null);

  const scrollToFirstInvalidField = (invalidFields) => {
    if (invalidFields.length > 0) {
      const fieldOrder = [
        'name', 'email', 'phone', 'aadhaarNumber', 'panNumber', 'dateOfBirth',
        'address', 'occupation', 'familyDetails', 'bankName', 'accountNumber',
        'ifscCode', 'accountHolderName', 'branchName', 'upiId', 'accountType',
        'documents', 'avatar' // Add avatar to field order
      ];

      const firstInvalidField = fieldOrder.find(field =>
        invalidFields.includes(field)
      );

      if (firstInvalidField) {
        const fieldRef = fieldRefs[firstInvalidField];

        if (fieldRef && fieldRef.current) {
          setTimeout(() => {
            fieldRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            });

            const input = fieldRef.current.querySelector('input, select, textarea');
            if (input) {
              input.focus();
              if (input.type !== 'file') {
                input.select();
              }
            }
          }, 100);
        }
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    const invalidFields = [];

    setShakeFields([]);

    const isValidName = (name) => {
      return /^[A-Za-z\s]+$/.test(name.trim());
    };

    const isValidEmail = (email) => {
  // Remove any whitespace and convert to lowercase
  email = email.trim().toLowerCase();
  
  // Check if empty
  if (!email) return false;
  
  // Check length (max 254 chars as per RFC 5321)
  if (email.length > 254) return false;
  
  // Basic structure: local@domain
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  
  const [local, domain] = parts;
  
  // Local part validation (max 64 chars)
  if (local.length === 0 || local.length > 64) return false;
  
  // Domain part validation
  if (domain.length === 0 || domain.length > 255) return false;
  
  // GOOGLE-GRADE VALIDATION RULES:
  
  // 1. Local part can only contain: letters (a-z), numbers (0-9), and dots (.), plus (+), hyphen (-), underscore (_)
  //    NO special characters like &, ^, %, $, #, @, !, *, etc.
  const localRegex = /^[a-z0-9][a-z0-9._+-]*[a-z0-9]$|^[a-z0-9]$/;
  if (!localRegex.test(local)) {
    return false; // Rejects emails with special chars at start/end or invalid chars
  }
  
  // 2. No consecutive dots in local part (like john..doe)
  if (local.includes('..')) return false;
  
  // 3. Dot cannot be at start or end of local part
  if (local.startsWith('.') || local.endsWith('.')) return false;
  
  // 4. Plus sign can only be used once (for sub-addressing) and cannot be at start/end
  if ((local.match(/\+/g) || []).length > 1) return false;
  if (local.startsWith('+') || local.endsWith('+')) return false;
  
  // 5. Hyphen cannot be at start or end
  if (local.startsWith('-') || local.endsWith('-')) return false;
  
  // 6. Underscore cannot be at start or end
  if (local.startsWith('_') || local.endsWith('_')) return false;
  
  // 7. Domain validation - must be valid format
  const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/;
  if (!domainRegex.test(domain)) return false;
  
  // 8. No consecutive hyphens in domain
  if (domain.includes('--')) return false;
  
  // 9. Domain cannot start or end with hyphen
  if (domain.startsWith('-') || domain.endsWith('-')) return false;
  
  // 10. TLD must be at least 2 characters and only letters
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || tld.length > 6) return false;
  if (!/^[a-z]+$/.test(tld)) return false;
  
  // 11. Check for common invalid patterns
  const invalidPatterns = [
    /\.{2,}/,                    // Consecutive dots
    /[^a-z0-9._+@-]/,            // Any character not in allowed set
    /@.*@/,                       // Multiple @ symbols
    /\s/,                         // Whitespace
    /^\.|\.$/,                    // Dot at start or end of any part
    /[<>()\[\]\\,;:&^%$#!*?]/,    // Absolutely NO special characters
  ];
  
  for (const pattern of invalidPatterns) {
    if (pattern.test(email)) return false;
  }
  
  // 12. Block disposable/temporary email domains (like Google does)
  const disposableDomains = new Set([
    'tempmail.com', 'throwaway.com', 'mailinator.com', 'guerrillamail.com',
    'sharklasers.com', 'spam4.me', 'yopmail.com', '10minutemail.com',
    'temp-mail.org', 'fakeinbox.com', 'throwawaymail.com', 'tempemail.com',
    'trashmail.com', 'spambox.com', 'maildrop.cc', 'getnada.com',
    'tempmail.net', 'tempinbox.com', 'mailnesia.com', 'mailcatch.com',
    'guerrillamail.org', 'guerrillamail.net', 'guerrillamail.biz',
    'guerrillamail.de', 'guerrillamail.co.uk', 'sharklasers.com',
    'grr.la', 'guerrillamailblock.com', 'spam4.me', 'mailmetrash.com',
    'mailexpire.com', 'mailmoat.com', 'spambog.com', 'spamfree24.org',
    'spamfree24.de', 'spamfree24.info', 'spamfree24.net', 'spamfree24.com'
  ]);
  
  if (disposableDomains.has(domain)) {
    return false; // Reject disposable emails
  }
  
  // 13. Block role-based emails (like Google does for security)
  const roleBasedPrefixes = [
    'admin', 'administrator', 'info', 'support', 'contact', 'help',
    'webmaster', 'postmaster', 'noreply', 'no-reply', 'mailer-daemon',
    'abuse', 'spam', 'security', 'root', 'sysadmin', 'hostmaster',
    'usenet', 'news', 'marketing', 'sales', 'billing', 'accounts'
  ];
  
  const localLower = local.toLowerCase();
  for (const prefix of roleBasedPrefixes) {
    if (localLower === prefix || localLower.startsWith(prefix + '.')) {
      return false; // Reject role-based emails for security
    }
  }
  
  // 14. Check for valid domain structure (must have at least two parts)
  if (domainParts.length < 2) return false;
  
  // 15. Each domain part must be valid
  for (const part of domainParts) {
    if (part.length === 0) return false;
    if (part.length > 63) return false; // Max length per domain part
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(part)) return false;
  }
  
  // 16. Additional Google-specific restrictions
  const googleRestrictions = [
    // No consecutive special characters
    /[._+-]{2,}/.test(local),
    
    // No mixing of special characters without alphanumeric separation
    local.includes('.+') || local.includes('+.') ||
    local.includes('.-') || local.includes('-.') ||
    local.includes('._') || local.includes('_.') ||
    local.includes('+-') || local.includes('-+') ||
    local.includes('+_') || local.includes('_+') ||
    local.includes('-_') || local.includes('_-'),
    
    // No special characters in certain positions
    local.split(/[._+-]/).some(part => part.length === 0)
  ];
  
  if (googleRestrictions.some(Boolean)) return false;
  
  return true;
};

    const isValidPhone = (phone) => {
      const phoneWithoutCode = phone.replace('+91-', '');
      const validChars = /^[\d\-]+$/.test(phoneWithoutCode);
      if (!validChars) return false;
      const digitCount = (phoneWithoutCode.match(/\d/g) || []).length;
      return digitCount === 10;
    };

    const isValidAddress = (address) => {
      const addressRegex = /^[A-Za-z][A-Za-z\s.,'"/-]*([A-Za-z]|\d)*$/;
      return addressRegex.test(address.trim());
    };

    const isValidAadhaar = (aadhaar) => {
      const digits = aadhaar.replace(/\D/g, '');
      return digits.length === 12;
    };

    const isValidPAN = (pan) => {
      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
    };

    const isValidIFSC = (ifsc) => {
      return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
    };

    // VALIDATION LOGIC:
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      invalidFields.push('name');
    } else if (!isValidName(formData.name)) {
      errors.name = 'Name can only contain alphabets and spaces';
      invalidFields.push('name');
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      invalidFields.push('email');
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      invalidFields.push('email');
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
      invalidFields.push('phone');
    } else if (!isValidPhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
      invalidFields.push('phone');
    }

    if (!formData.aadhaarNumber.trim()) {
      errors.aadhaarNumber = 'Aadhaar Number is required';
      invalidFields.push('aadhaarNumber');
    } else if (!isValidAadhaar(formData.aadhaarNumber)) {
      errors.aadhaarNumber = 'Aadhaar Number must be 12 digits';
      invalidFields.push('aadhaarNumber');
    }

    if (!formData.panNumber.trim()) {
      errors.panNumber = 'PAN Number is required';
      invalidFields.push('panNumber');
    } else if (!isValidPAN(formData.panNumber)) {
      errors.panNumber = 'Invalid PAN Number format (e.g., ABCDE1234F)';
      invalidFields.push('panNumber');
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of Birth is required';
      invalidFields.push('dateOfBirth');
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();

      if (dob > today) {
        errors.dateOfBirth = 'Date of Birth cannot be in the future';
        invalidFields.push('dateOfBirth');
      } else if (age < 18) {
        errors.dateOfBirth = 'Must be at least 18 years old';
        invalidFields.push('dateOfBirth');
      }
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
      invalidFields.push('address');
    } else if (!isValidAddress(formData.address)) {
      errors.address = 'Address must start with a letter';
      invalidFields.push('address');
    }

    if (!formData.occupation.trim()) {
      errors.occupation = 'Occupation is required';
      invalidFields.push('occupation');
    }

    if (!formData.bankName.trim()) {
      errors.bankName = 'Bank Name is required';
      invalidFields.push('bankName');
    }

    if (!formData.accountNumber.trim()) {
      errors.accountNumber = 'Account Number is required';
      invalidFields.push('accountNumber');
    } else if (formData.accountNumber.length < 9 || formData.accountNumber.length > 18) {
      errors.accountNumber = 'Account Number must be 9-18 digits';
      invalidFields.push('accountNumber');
    }

    if (!formData.ifscCode.trim()) {
      errors.ifscCode = 'IFSC Code is required';
      invalidFields.push('ifscCode');
    } else if (!isValidIFSC(formData.ifscCode)) {
      errors.ifscCode = 'Invalid IFSC Code format (e.g., SBIN0001234)';
      invalidFields.push('ifscCode');
    }

    if (!formData.accountHolderName.trim()) {
      errors.accountHolderName = 'Account Holder Name is required';
      invalidFields.push('accountHolderName');
    }

    if (!formData.branchName.trim()) {
      errors.branchName = 'Branch Name is required';
      invalidFields.push('branchName');
    }

    if (!formData.accountType) {
      errors.accountType = 'Account Type is required';
      invalidFields.push('accountType');
    }

    if (formData.documents.length === 0) {
      errors.documents = 'Please upload at least one document';
      invalidFields.push('documents');
    }

    setFieldErrors(errors);

    if (invalidFields.length > 0) {
      setShakeFields([...invalidFields]);
      scrollToFirstInvalidField(invalidFields);

      setTimeout(() => {
        setShakeFields([]);
      }, 600);

      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    if (isEditing) {
      const hasChanges = Object.keys(formData).some(key => {

        if (key === 'completionPercentage' || key === 'status') {
          return false;
        }

        if (key === 'documents') {
          return JSON.stringify(formData[key]) !== JSON.stringify(originalData[key]);
        }

        return formData[key] !== originalData[key];
      });

      if (!hasChanges) {
        setTimeout(() => {
          onClose();
        }, 0);
        return;
      }
    }

    const recipientToSubmit = {
      ...formData,
      verificationStatus: formData.verificationStatus === 'Verified' ? 'Verified' : 'Pending',
      status: shouldUpdateStatus(formData.status) ? 'Submitted' : formData.status,
      submittedAt: isEditing ? formData.submittedAt : new Date().toISOString().split('T')[0]
    };

    setPendingAction(() => () => {
      if (isEditing) {
        onUpdateRecipient(recipientToSubmit);
      } else {
        onAddRecipient(recipientToSubmit);
      }
    });

    setShowConfirmation(true);
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === 'name') {
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
    }
    else if (name === 'aadhaarNumber') {
      newValue = value.replace(/[^\d-]/g, '');
      const digitsOnly = newValue.replace(/\D/g, '');
      if (digitsOnly.length <= 4) {
        newValue = digitsOnly;
      } else if (digitsOnly.length <= 8) {
        newValue = `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4)}`;
      } else {
        newValue = `${digitsOnly.slice(0, 4)}-${digitsOnly.slice(4, 8)}-${digitsOnly.slice(8, 12)}`;
      }
    }
    else if (name === 'panNumber') {
      newValue = value.toUpperCase().replace(/\s/g, '');
      newValue = newValue.replace(/[^A-Z0-9]/g, '').slice(0, 10);
    }
    else if (name === 'accountNumber') {
      newValue = value.replace(/\D/g, '').slice(0, 18);
    }
    else if (name === 'ifscCode') {
      newValue = value.toUpperCase().replace(/\s/g, '');
      newValue = newValue.replace(/[^A-Z0-9]/g, '').slice(0, 11);
    }
    else if (name === 'email') {
      newValue = value.toLowerCase();
    }
    else if (name === 'phone') {
      let processedValue = value;

      if (value.startsWith('+91-')) {
        const afterCode = value.slice(4);
        const cleaned = afterCode.replace(/[^\d\-]/g, '');
        processedValue = '+91-' + cleaned;
      } else {
        processedValue = value.replace(/[^\d\-]/g, '');
      }

      newValue = formatPhoneNumber(processedValue.replace(/\D/g, ''), '+91');

      if (value.startsWith('+91-')) {
        newValue = '+91-' + newValue;
      }
    }
    else {
      newValue = value;
    }

    // Update form data
    const updatedFormData = {
      ...formData,
      [name]: newValue
    };

    // For editing: only update status if it's not in a final state
    let newStatus = formData.status;
    if (!isEditing || shouldUpdateStatus(formData.status)) {
      newStatus = determineStatus(updatedFormData);
    }

    setFormData({
      ...updatedFormData,
      status: newStatus
    });

    // Clear field error if exists
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Update handleDocumentsChange
  const handleDocumentsChange = (documents) => {
    const updatedFormData = {
      ...formData,
      documents
    };

    // For editing: only update status if it's not in a final state
    let newStatus = formData.status;
    if (!isEditing || shouldUpdateStatus(formData.status)) {
      newStatus = determineStatus(updatedFormData);
    }

    setFormData({
      ...updatedFormData,
      status: newStatus
    });

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

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
        style={{ margin: 0, padding: 0 }}
      >
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, pointerEvents: 'none' }}
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
          <div className="relative p-4 sm:p-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-t-3xl">
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
              {/* Profile Photo Section */}
              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Camera size={16} className="text-violet-500" />
                  Profile Photo
                </h3>
                <div ref={fieldRefs.avatar} className="overflow-visible">
                  <EnhancedAvatarUpload
                    user={formData}
                    onAvatarChange={(avatar) => {
                      setFormData(prev => ({ ...prev, avatar }));
                      if (fieldErrors.avatar) {
                        setFieldErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.avatar;
                          return newErrors;
                        });
                      }
                    }}
                    isDark={isDark}
                    fieldErrors={fieldErrors}
                    onFieldError={handleFieldError}
                    shakeFields={shakeFields}
                  />
                </div>
              </div>

              {/* Personal Information Section */}
              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Users size={16} className="text-violet-500" />
                  Personal Information <span className="text-rose-500 font-normal normal-case">*</span>
                </h3>

                <div className="space-y-4 sm:space-y-5">
                  {/* Rest of the Personal Information fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div ref={fieldRefs.name} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;Full Name <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                      </label>
                      <motion.div
                        animate={shakeFields.includes('name') ? "shake" : "initial"}
                        variants={shakeAnimation}
                        className="overflow-visible relative"
                      >
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Rajesh Kumar"
                          maxLength={50}
                          autoComplete="off"
                          readOnly
                          onFocus={(e) => e.target.removeAttribute('readonly')}
                          className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                            } ${fieldErrors.name ? 'border-rose-500' : ''}`}
                        />
                        <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formData.name.length}/50
                        </div>
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

                    <div ref={fieldRefs.email} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;Email <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                      </label>
                      <motion.div
                        animate={shakeFields.includes('email') ? "shake" : "initial"}
                        variants={shakeAnimation}
                        className="overflow-visible relative"
                      >
                        <input
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="rajesh.kumar@email.com"
                          maxLength={100}
                          autoComplete="off"
                          readOnly
                          onFocus={(e) => e.target.removeAttribute('readonly')}
                          className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                            } ${fieldErrors.email ? 'border-rose-500' : ''}`}
                        />
                        <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formData.email.length}/100
                        </div>
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div ref={fieldRefs.phone} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;Phone <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                      </label>
                      <motion.div
                        animate={shakeFields.includes('phone') ? "shake" : "initial"}
                        variants={shakeAnimation}
                        className="overflow-visible"
                      >
                        <div className="flex gap-2 sm:gap-1">
                          <div className="flex-shrink-0">
                            <div className={`h-[48px] flex items-center px-3 rounded-2xl border-2 text-sm font-medium ${isDark
                              ? 'bg-gray-800 border-gray-600'
                              : 'bg-white border-gray-200'
                              } ${fieldErrors.phone ? 'border-rose-500' : ''}`}>
                              <div className={`flex items-center gap-2 ${formData.phone && formData.phone.replace(/\D/g, '').length > 0
                                ? (isDark ? 'text-white' : 'text-gray-900')
                                : (isDark ? 'text-gray-400' : 'text-gray-500')
                                }`}>
                                <span className="text-lg">🇮🇳</span>
                                <span className="text-sm font-semibold">+91</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 relative">
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="98765-43210"
                              maxLength={12}
                              autoComplete="off"
                              readOnly
                              onFocus={(e) => e.target.removeAttribute('readonly')}
                              className={`w-full h-[48px] p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                } ${fieldErrors.phone ? 'border-rose-500' : ''}`}
                            />
                            <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formData.phone.replace(/\D/g, '').length}/10
                            </div>
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

                    <div ref={fieldRefs.aadhaarNumber} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;Aadhaar Number <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                      </label>
                      <motion.div
                        animate={shakeFields.includes('aadhaarNumber') ? "shake" : "initial"}
                        variants={shakeAnimation}
                        className="overflow-visible relative"
                      >
                        <input
                          type="text"
                          name="aadhaarNumber"
                          value={formData.aadhaarNumber}
                          onChange={handleChange}
                          placeholder="XXXX-XXXX-XXXX"
                          maxLength={14}
                          autoComplete="off"
                          readOnly
                          onFocus={(e) => e.target.removeAttribute('readonly')}
                          className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                            } ${fieldErrors.aadhaarNumber ? 'border-rose-500' : ''}`}
                        />
                        <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formData.aadhaarNumber.replace(/\D/g, '').length}/12
                        </div>
                      </motion.div>
                      {fieldErrors.aadhaarNumber && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                        >
                          <XCircle size={12} />
                          {fieldErrors.aadhaarNumber}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div ref={fieldRefs.panNumber} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;PAN Number <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                      </label>
                      <motion.div
                        animate={shakeFields.includes('panNumber') ? "shake" : "initial"}
                        variants={shakeAnimation}
                        className="overflow-visible relative"
                      >
                        <input
                          type="text"
                          name="panNumber"
                          value={formData.panNumber}
                          onChange={handleChange}
                          placeholder="ABCDE1234F"
                          maxLength={10}
                          autoComplete="off"
                          readOnly
                          onFocus={(e) => e.target.removeAttribute('readonly')}
                          className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                            } ${fieldErrors.panNumber ? 'border-rose-500' : ''}`}
                        />
                        <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formData.panNumber.length}/10
                        </div>
                      </motion.div>
                      {fieldErrors.panNumber && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                        >
                          <XCircle size={12} />
                          {fieldErrors.panNumber}
                        </motion.p>
                      )}
                    </div>

                    <div ref={fieldRefs.dateOfBirth} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;Date of Birth <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                      </label>
                      <motion.div
                        animate={shakeFields.includes('dateOfBirth') ? "shake" : "initial"}
                        variants={shakeAnimation}
                        className="overflow-visible"
                      >
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          autoComplete="off"
                          onFocus={(e) => e.target.removeAttribute('readonly')}
                          className={`date-field w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                            ? 'bg-gray-800 border-gray-600 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                            } ${fieldErrors.dateOfBirth ? 'border-rose-500' : ''} 
                            ${formData.dateOfBirth ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}
                          style={{
                            color: formData.dateOfBirth ? '' : (isDark ? '#9CA3AF' : '#6B7280')
                          }}
                        />
                        <style jsx>{`
                            .date-field::-webkit-calendar-picker-indicator {
                          ${isDark
                            ? 'filter: invert(39%) sepia(6%) saturate(1199%) hue-rotate(182deg) brightness(94%) contrast(87%);'
                            : 'filter: invert(39%) sepia(6%) saturate(1199%) hue-rotate(182deg) brightness(94%) contrast(87%);'
                          }
                          `}</style>
                      </motion.div>
                      {fieldErrors.dateOfBirth && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                        >
                          <XCircle size={12} />
                          {fieldErrors.dateOfBirth}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div ref={fieldRefs.address} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;Address <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                      </label>
                      <motion.div
                        animate={shakeFields.includes('address') ? "shake" : "initial"}
                        variants={shakeAnimation}
                        className="overflow-visible relative"
                      >
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Mumbai, Maharashtra"
                          maxLength={200}
                          autoComplete="off"
                          readOnly
                          onFocus={(e) => e.target.removeAttribute('readonly')}
                          className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                            } ${fieldErrors.address ? 'border-rose-500' : ''}`}
                        />
                        <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formData.address.length}/200
                        </div>
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

                    <div ref={fieldRefs.occupation} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;Occupation <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                      </label>
                      <motion.div
                        animate={shakeFields.includes('occupation') ? "shake" : "initial"}
                        variants={shakeAnimation}
                        className="overflow-visible relative"
                      >
                        <input
                          type="text"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleChange}
                          placeholder="Business Owner, Teacher, Student"
                          maxLength={50}
                          autoComplete="off"
                          readOnly
                          onFocus={(e) => e.target.removeAttribute('readonly')}
                          className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                            } ${fieldErrors.occupation ? 'border-rose-500' : ''}`}
                        />
                        <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formData.occupation.length}/50
                        </div>
                      </motion.div>
                      {fieldErrors.occupation && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                        >
                          <XCircle size={12} />
                          {fieldErrors.occupation}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div ref={fieldRefs.familyDetails} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      &nbsp;Family Details (Optional)
                    </label>
                    <motion.div className="overflow-visible relative">
                      <textarea
                        name="familyDetails"
                        value={formData.familyDetails}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Wife and 2 children"
                        maxLength={500}
                        autoComplete="off"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium resize-none ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          }`}
                      />
                      <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formData.familyDetails.length}/500
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Bank Details Section */}
              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <CreditCard size={16} className="text-blue-500" />
                  Bank Details <span className="text-rose-500 font-normal normal-case">*</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div ref={fieldRefs.bankName} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      &nbsp;Bank Name <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <motion.div
                      animate={shakeFields.includes('bankName') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible relative"
                    >
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        placeholder="State Bank of India"
                        maxLength={100}
                        autoComplete="off"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          } ${fieldErrors.bankName ? 'border-rose-500' : ''}`}
                      />
                      <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formData.bankName.length}/100
                      </div>
                    </motion.div>
                  </div>

                  <div ref={fieldRefs.accountNumber} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      &nbsp;Account Number <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <motion.div
                      animate={shakeFields.includes('accountNumber') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible relative"
                    >
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        placeholder="123456789012"
                        maxLength={18}
                        autoComplete="off"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          } ${fieldErrors.accountNumber ? 'border-rose-500' : ''}`}
                      />
                      <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formData.accountNumber.length}/18
                      </div>
                    </motion.div>
                  </div>

                  <div ref={fieldRefs.ifscCode} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      &nbsp;IFSC Code <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <motion.div
                      animate={shakeFields.includes('ifscCode') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible relative"
                    >
                      <input
                        type="text"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleChange}
                        placeholder="SBIN0001234"
                        maxLength={11}
                        autoComplete="off"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          } ${fieldErrors.ifscCode ? 'border-rose-500' : ''}`}
                      />
                      <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formData.ifscCode.length}/11
                      </div>
                    </motion.div>
                  </div>

                  <div ref={fieldRefs.accountHolderName} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      &nbsp;Account Holder Name <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <motion.div
                      animate={shakeFields.includes('accountHolderName') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible relative"
                    >
                      <input
                        type="text"
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleChange}
                        placeholder="Rajesh Kumar"
                        maxLength={50}
                        autoComplete="off"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          } ${fieldErrors.accountHolderName ? 'border-rose-500' : ''}`}
                      />
                      <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formData.accountHolderName.length}/50
                      </div>
                    </motion.div>
                  </div>

                  <div ref={fieldRefs.branchName} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      &nbsp;Branch Name <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <motion.div
                      animate={shakeFields.includes('branchName') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible relative"
                    >
                      <input
                        type="text"
                        name="branchName"
                        value={formData.branchName}
                        onChange={handleChange}
                        placeholder="Mumbai Main Branch"
                        maxLength={50}
                        autoComplete="off"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          } ${fieldErrors.branchName ? 'border-rose-500' : ''}`}
                      />
                      <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formData.branchName.length}/50
                      </div>
                    </motion.div>
                  </div>

                  <div ref={fieldRefs.upiId} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      &nbsp;UPI ID (Optional)
                    </label>
                    <motion.div className="overflow-visible relative">
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleChange}
                        placeholder="rajesh.kumar@upi"
                        maxLength={50}
                        autoComplete="off"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          }`}
                      />
                      <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formData.upiId.length}/50
                      </div>
                    </motion.div>
                  </div>

                  <div className="md:col-span-2" ref={fieldRefs.accountType}>
                    <div className="relative">
                      <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-2 mb-3 pl-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;Account Type <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                      </label>

                      <motion.div
                        animate={shakeFields.includes('accountType') ? "shake" : "initial"}
                        variants={shakeAnimation}
                        className="relative"
                      >
                        <select
                          name="accountType"
                          value={formData.accountType}
                          onChange={handleChange}
                          autoComplete="off"
                          readOnly
                          onFocus={(e) => e.target.removeAttribute('readonly')}
                          className={`w-full p-2 sm:p-3 rounded-2xl text-sm font-medium transition-all appearance-none ${isDark
                              ? 'bg-gray-800 border-gray-600'
                              : 'bg-white border-gray-200'
                            } border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none ${formData.accountType === ""
                              ? (isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]')
                              : (isDark ? 'text-white' : 'text-gray-900')
                            } ${fieldErrors.accountType ? 'border-rose-500' : ''}`}
                        >
                          <option value="" className={`${isDark ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-white'} font-medium`}>
                            &nbsp;Select Account Type...
                          </option>
                          <option value="Savings" className={`${isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'} font-medium`}>
                            &nbsp;Savings Account
                          </option>
                          <option value="Current" className={`${isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'} font-medium`}>
                            &nbsp;Current Account
                          </option>
                          <option value="Salary" className={`${isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'} font-medium`}>
                            &nbsp;Salary Account
                          </option>
                          <option value="Joint" className={`${isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'} font-medium`}>
                            &nbsp;Joint Account
                          </option>
                          <option value="NRI" className={`${isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'} font-medium`}>
                            &nbsp;NRI Account
                          </option>
                        </select>

                        <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <ChevronDown size={16} />
                        </div>
                      </motion.div>

                      {fieldErrors.accountType && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-rose-600 text-xs font-medium mt-1"
                        >
                          <AlertCircle size={12} />
                          {fieldErrors.accountType}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Upload Section */}
              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <FileText size={16} className="text-amber-500" />
                  Documents Upload <span className="text-rose-500 font-normal normal-case">*</span>
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

              {/* Profile Completion Status Section */}
              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Activity size={16} className="text-violet-500" />
                  Profile Completion Status
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex flex-col items-center">
                    <ProfileProgressCircle
                      percentage={completionPercentage}
                      size={120}
                      isDark={isDark}
                    />
                    <p className={`text-xs font-medium mt-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {completionPercentage === 100 ? 'Ready to submit!' : 'Complete all fields to submit'}
                    </p>

                    {/* Status Overview - Simple Line Format */}
                    <div className="mt-4 w-full max-w-xs">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Status
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${formData.status === 'Unknown'
                          ? 'bg-gray-500/20 text-gray-600'
                          : formData.status === 'Incomplete'
                            ? 'bg-amber-500/20 text-amber-600'
                            : formData.status === 'Pending'
                              ? 'bg-amber-500/20 text-amber-600'
                              : formData.status === 'Submitted'
                                ? 'bg-blue-500/20 text-blue-600'
                                : formData.status === 'Under Review'
                                  ? 'bg-purple-500/20 text-purple-600'
                                  : formData.status === 'Verified'
                                    ? 'bg-emerald-500/20 text-emerald-600'
                                    : formData.status === 'Rejected'
                                      ? 'bg-rose-500/20 text-rose-600'
                                      : formData.status === 'Approved'
                                        ? 'bg-green-500/20 text-green-600'
                                        : 'bg-gray-500/20 text-gray-600'
                          }`}>
                          {formData.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Completion Checklist
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Personal Information', completed: completionChecklist.personalInfo },
                        { label: 'Bank Details', completed: completionChecklist.bankDetails },
                        { label: 'Required Documents', completed: completionChecklist.requiredDocuments },
                        { label: 'Profile Photo', completed: formData.avatar && formData.avatar.toString().trim() !== '' } // Add avatar to checklist
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.completed
                            ? 'bg-emerald-500'
                            : isDark
                              ? 'bg-gray-600'
                              : 'bg-gray-300'
                            }`}>
                            {item.completed && (
                              <CheckCircle size={12} className="text-white" />
                            )}
                          </div>
                          <span className={`text-sm ${item.completed
                            ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                            : isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Documents Uploaded
                        </span>
                        <span className={`text-xs font-bold ${formData.documents.length >= 5
                          ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                          : isDark ? 'text-rose-400' : 'text-rose-600'
                          }`}>
                          {formData.documents.length} / Required: {formData.documents.length >= 5 ? '5 ✓' : '5'}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            Required Documents:
                          </span>
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            5 total (Aadhaar Front/Back counts as 1)
                          </span>
                        </div>
                        {formData.documents.length < 5 && (
                          <p className={`text-xs mt-1 ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
                            Need {5 - formData.documents.length} more document(s)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-4 flex-nowrap">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 min-w-[100px] px-3 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${isDark
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
                  className="flex-1 min-w-[100px] px-3 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold shadow-xl flex items-center justify-center gap-2"
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
    </>
  );
};

const Pagination = React.memo(({ currentPage, totalPages, onPageChange, isDark, totalItems, itemsPerPage }) => {
  if (totalPages <= 1) return null;

  const handlePageChange = useCallback((page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);

      // Add smooth scroll to top of recipients section after page change
      setTimeout(() => {
        const recipientsSection = document.querySelector('.recipients-grid-container')?.parentElement;
        if (recipientsSection) {
          const yOffset = -100;
          const y = recipientsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({
            top: Math.max(0, y),
            behavior: 'smooth'
          });
        } else {
          // Fallback to scrolling to top of page
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [currentPage, totalPages, onPageChange]);

  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const dots = [];
  const maxDots = 5;

  if (totalPages <= maxDots) {
    for (let i = 1; i <= totalPages; i++) {
      dots.push(i);
    }
  } else {
    dots.push(1);
    if (currentPage > 3) {
      dots.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!dots.includes(i)) {
        dots.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      dots.push('...');
    }

    if (!dots.includes(totalPages)) {
      dots.push(totalPages);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 mt-8">
      <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Page {currentPage} of {totalPages} • Showing {startItem}-{endItem} recipients from {totalItems}
      </div>

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-xl ${isDark
            ? 'bg-gray-700 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-600'
            : 'bg-white text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100'
            } border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
        >
          <ChevronLeft size={16} />
        </motion.button>

        <div className="flex items-center gap-2">
          {dots.map((dot, index) => (
            <React.Fragment key={`dot-${index}-${dot}`}>
              {dot === '...' ? (
                <span className={`px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>•••</span>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePageChange(dot)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${currentPage === dot
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                    : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {dot}
                </motion.button>
              )}
            </React.Fragment>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-xl ${isDark
            ? 'bg-gray-700 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-600'
            : 'bg-white text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100'
            } border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
        >
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  );
});

const RecipientsManagement = ({ isDark }) => {
  const [recipients, setRecipients] = useState(recipientsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
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
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [recipientToVerifyReject, setRecipientToVerifyReject] = useState(null);
  const [verificationAction, setVerificationAction] = useState(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [recipientToValidate, setRecipientToValidate] = useState(null);

  const scrollPosition = useRef(0);

  // Move these outside the useEffect
  const handleValidateRecipient = useCallback((recipient) => {
    setRecipientToValidate(recipient);
    setShowValidationModal(true);
  }, []);

  const handleValidationSubmit = useCallback((recipientId, validationData) => {
    const { validationType, reason, comment } = validationData;

    setRecipients(prev => prev.map(recipient => {
      if (recipient.id === recipientId) {
        const updatedRecipient = {
          ...recipient,
          validationNotes: [
            ...(recipient.validationNotes || []),
            {
              id: Date.now(),
              text: reason || comment || (validationType === 'validate' ? 'Validated' : 'Rejected'),
              timestamp: new Date().toISOString(),
              admin: 'Admin User',
              type: validationType === 'validate' ? 'validation' : 'rejection'
            }
          ]
        };

        if (validationType === 'validate') {
          updatedRecipient.status = 'Verified';
          updatedRecipient.verificationStatus = 'Validated';
        } else if (validationType === 'reject') {
          updatedRecipient.status = 'Rejected';
          updatedRecipient.verificationStatus = 'Rejected';
        }

        return updatedRecipient;
      }
      return recipient;
    }));

    setShowValidationModal(false);
    setRecipientToValidate(null);
    setSuccessMessage(`Recipient ${validationType === 'validate' ? 'validated' : 'rejected'} successfully!`);
    setShowSuccessDialog(true);
  }, []);

  useEffect(() => {
    const isAnyModalOpen =
      showAddRecipientModal || showRecipientModal || showValidationModal || showForwardModal || showVerificationModal || showDeleteDialog || showForwardConfirmDialog || showApproveDialog || showSuccessDialog;

    if (isAnyModalOpen) {
      scrollPosition.current = window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';
      document.body.style.height = '100%';
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.height = '';
      document.body.style.paddingRight = '';
      document.body.classList.remove('modal-open');

      if (scrollPosition.current !== undefined) {
        window.scrollTo(0, scrollPosition.current);
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.height = '';
      document.body.style.paddingRight = '';
      document.body.classList.remove('modal-open');
    };
  }, [showAddRecipientModal, showValidationModal, showRecipientModal, showForwardModal, showVerificationModal, showDeleteDialog, showForwardConfirmDialog, showApproveDialog, showSuccessDialog]);

  const handleVerifyReject = useCallback((recipient) => {
    if (recipient.status === 'Submitted') {
      // For Submitted status, use the validation modal
      handleValidateRecipient(recipient);
    } else {
      // For other statuses, use the existing verification modal
      setRecipientToVerifyReject(recipient);
      setShowVerificationModal(true);
    }
  }, [handleValidateRecipient]); // Add this dependency array

  const handleVerify = useCallback((recipientId, comment = '') => {
    setRecipients(prev => prev.map(recipient =>
      recipient.id === recipientId ? {
        ...recipient,
        status: 'Verified',
        verificationStatus: 'Verified',
        verificationComment: comment,
        approver: 'Admin User',
        // Add to validationNotes for consistency
        validationNotes: [
          ...(recipient.validationNotes || []),
          {
            id: Date.now(),
            text: comment || 'Verified',
            timestamp: new Date().toISOString(),
            admin: 'Admin User',
            type: 'verification' // Using 'verification' type
          }
        ]
      } : recipient
    ));

    setShowVerificationModal(false);
    setRecipientToVerifyReject(null);
    setSuccessMessage('Recipient verified successfully');
    setShowSuccessDialog(true);
  }, []);

  const handleReject = useCallback((recipientId, reason = '') => {
    setRecipients(prev => prev.map(recipient =>
      recipient.id === recipientId ? {
        ...recipient,
        status: 'Rejected',
        verificationStatus: 'Rejected',
        rejectionReason: reason,
        approver: 'Admin User',
        // Add to validationNotes for consistency
        validationNotes: [
          ...(recipient.validationNotes || []),
          {
            id: Date.now(),
            text: reason || 'Rejected',
            timestamp: new Date().toISOString(),
            admin: 'Admin User',
            type: 'rejection'
          }
        ]
      } : recipient
    ));

    setShowVerificationModal(false);
    setRecipientToVerifyReject(null);
    setSuccessMessage('Recipient rejected successfully');
    setShowSuccessDialog(true);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const filteredRecipients = useMemo(() => {
    return recipients.filter(recipient => {
      const matchesSearch =
        recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipient.phone.includes(searchTerm) ||
        recipient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipient.aadhaarNumber.includes(searchTerm) ||
        recipient.panNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'All Status' || recipient.status === selectedStatus;
      const matchesVerification = selectedVerification === 'All Verification' || recipient.verificationStatus === selectedVerification;

      const matchesDateRange =
        (!dateRange.start || recipient.registrationDate >= dateRange.start) &&
        (!dateRange.end || recipient.registrationDate <= dateRange.end);

      return matchesSearch && matchesStatus && matchesVerification && matchesDateRange;
    });
  }, [recipients, searchTerm, selectedStatus, selectedVerification, dateRange]);

  const paginatedRecipients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRecipients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRecipients, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRecipients.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedVerification, selectedUrgency, dateRange]);

  const stats = useMemo(() => {
    const totalRecipients = recipients.length;
    const incompleteRecipients = recipients.filter(r => r.status === 'Incomplete').length;
    const pendingRecipients = recipients.filter(r => r.status === 'Pending').length;
    const submittedRecipients = recipients.filter(r => r.status === 'Submitted').length;
    const underReviewRecipients = recipients.filter(r => r.status === 'Under Review').length;
    const verifiedRecipients = recipients.filter(r => r.status === 'Verified').length;
    const rejectedRecipients = recipients.filter(r => r.status === 'Rejected').length;

    return {
      totalRecipients,
      incompleteRecipients,
      pendingRecipients,
      submittedRecipients,
      underReviewRecipients,
      verifiedRecipients,
      rejectedRecipients
    };
  }, [recipients]);

  const handleStatusChange = useCallback((recipientId, newStatus) => {
    setRecipients(prev => prev.map(recipient =>
      recipient.id === recipientId ? { ...recipient, status: newStatus } : recipient
    ));
  }, []);

  const handleVerificationChange = useCallback((recipientId, newVerification) => {
    setRecipients(prev => prev.map(recipient =>
      recipient.id === recipientId ? { ...recipient, verificationStatus: newVerification } : recipient
    ));
  }, []);

  const handleDeleteRecipient = useCallback((recipient) => {
    setRecipientToDelete(recipient);
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (recipientToDelete) {
      setRecipients(prev => prev.filter(recipient => recipient.id !== recipientToDelete.id));
      setShowDeleteDialog(false);
      setRecipientToDelete(null);
      setSuccessMessage('Recipient deleted successfully');
      setShowSuccessDialog(true);
    }
  }, [recipientToDelete]);

  const handleViewRecipient = useCallback((recipient) => {
    setSelectedRecipient(recipient);
    setShowRecipientModal(true);
  }, []);

  const handleEditRecipient = useCallback((recipient) => {
    setEditingRecipient(recipient);
    setShowAddRecipientModal(true);
  }, []);

  const handleAddRecipient = useCallback((newRecipient) => {
    const currentDate = new Date().toISOString().split('T')[0];

    const recipient = {
      ...newRecipient,
      id: `REC-${String(recipients.length + 1).padStart(3, '0')}`,
      registrationDate: currentDate,
      submittedAt: currentDate,
      completionPercentage: calculateProfileCompletion(newRecipient),
      assignee: 'admin1',
      forwardingHistory: []
    };

    setRecipients(prev => [...prev, recipient]);
    setSuccessMessage('Recipient added successfully');
    setShowSuccessDialog(true);
  }, [recipients.length]);

  const handleUpdateRecipient = useCallback((updatedRecipient) => {
    setRecipients(prev => prev.map(recipient =>
      recipient.id === updatedRecipient.id ? updatedRecipient : recipient
    ));
    setEditingRecipient(null);
    setSuccessMessage('Recipient updated successfully');
    setShowSuccessDialog(true);
  }, []);

  const handleApproveRecipient = useCallback((recipient) => {
    setRecipientToApprove(recipient);
    setShowApproveDialog(true);
  }, []);

  const confirmApprove = useCallback(() => {
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
  }, [recipientToApprove]);

  const handleForwardRequest = useCallback((recipientId, targetAdminId, reason) => {
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
  }, []);

  const handleOpenForwardModal = useCallback((recipient) => {
    setRecipientToForward(recipient);
    setShowForwardModal(true);
  }, []);

  const handleForwardConfirm = useCallback((recipientId, targetAdminId, reason) => {
    setForwardData({ recipientId, targetAdminId, reason });
    setShowForwardConfirmDialog(true);
  }, []);

  const confirmForward = useCallback(() => {
    if (forwardData) {
      handleForwardRequest(forwardData.recipientId, forwardData.targetAdminId, forwardData.reason);
      setShowForwardConfirmDialog(false);
      setForwardData(null);
      setShowForwardModal(false);
    }
  }, [forwardData, handleForwardRequest]);

  const handleExportExcel = useCallback(() => {
    const data = filteredRecipients.map(recipient => ({
      ID: recipient.id,
      Name: recipient.name,
      Email: recipient.email,
      Phone: recipient.phone,
      'Aadhaar Number': recipient.aadhaarNumber,
      'PAN Number': recipient.panNumber,
      'Date of Birth': recipient.dateOfBirth,
      Address: recipient.address,
      Occupation: recipient.occupation,
      'Family Details': recipient.familyDetails,
      'Bank Name': recipient.bankName,
      'Account Number': recipient.accountNumber,
      'IFSC Code': recipient.ifscCode,
      'Account Holder Name': recipient.accountHolderName,
      'Branch Name': recipient.branchName,
      'UPI ID': recipient.upiId,
      'Account Type': recipient.accountType,
      Status: recipient.status,
      'Registration Date': recipient.registrationDate,
      'Verification Status': recipient.verificationStatus
    }));

    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `recipients_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredRecipients]);

  const handleExportPDF = useCallback(() => {
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
<strong>Approved Recipients:</strong> ${stats.approvedRecipients}<br>
<strong>Pending Validation:</strong> ${stats.pendingRecipients}
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Aadhaar</th>
                <th>PAN</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecipients.map(recipient => `
                <tr>
                  <td>${recipient.id}</td>
                  <td>${recipient.name}</td>
                  <td>${recipient.email}</td>
                  <td>${recipient.phone}</td>
                  <td>${recipient.aadhaarNumber}</td>
                  <td>${recipient.panNumber}</td>
                  <td>${recipient.status}</td>
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
  }, [filteredRecipients, stats]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedStatus('All Status');
    setSelectedVerification('All Verification');
    setSelectedUrgency('All Urgency');
    setDateRange({ start: '', end: '' });
  }, []);

  const closeModals = useCallback(() => {
    setShowRecipientModal(false);
    setShowAddRecipientModal(false);
    setShowForwardModal(false);
    setEditingRecipient(null);
    setSelectedRecipient(null);
    setRecipientToForward(null);
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 px-3 sm:px-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddRecipientModal(true)}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-xl w-full sm:w-auto"
          >
            <UserPlus size={16} />
            <span className="truncate">Add New Recipient</span>
          </motion.button>

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
              <Download size={16} />
              <span className="truncate">PDF</span>
            </motion.button>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
      >
        <EnhancedStatCard
          icon={Users}
          title="Total Recipients"
          value={stats.totalRecipients}
          fullNumber={getFullFormattedNumber(stats.totalRecipients, true)}
          change={8.3}
          changeType="increase"
          color="from-blue-500 to-blue-600"
          delay={0.1}
          isDark={isDark}
        />
        <EnhancedStatCard
          icon={CheckCircle}
          title="Approved"
          value={stats.verifiedRecipients}
          fullNumber={getFullFormattedNumber(stats.verifiedRecipients, true)}
          change={12.5}
          changeType="increase"
          color="from-emerald-500 to-green-500"
          delay={0.2}
          isDark={isDark}
        />
        <EnhancedStatCard
          icon={Send}
          title="Pending-Validation"
          value={stats.submittedRecipients}
          fullNumber={getFullFormattedNumber(stats.submittedRecipients, true)}
          change={5.2}
          changeType="increase"
          color="from-amber-500 to-orange-500"
          delay={0.3}
          isDark={isDark}
        />
        <EnhancedStatCard
          icon={XCircle}
          title="Rejected"
          value={stats.rejectedRecipients}
          fullNumber={getFullFormattedNumber(stats.rejectedRecipients, true)}
          change={3.7}
          changeType="decrease"
          color="from-rose-500 to-pink-600"
          delay={0.4}
          isDark={isDark}
        />
      </motion.div>

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
                placeholder="Search recipients by name, email, phone, Aadhaar, PAN, or ID..."
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div className="relative">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className={`w-full p-2.5 sm:p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium appearance-none ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        style={{
                          paddingRight: '2.5rem' // Make room for the icon
                        }}
                      >
                        {statusOptions.map(option => (
                          <option key={option} value={option}>
                            {option === 'All Status' ? 'All Status' : option.replace('_', ' ').charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                      <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className={`w-full p-2.5 sm:p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                        }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      End Date
                    </label>
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

      {paginatedRecipients.length > 0 ? (
        <>
          <div className="requests-grid-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
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
                  onVerifyReject={handleVerifyReject}
                  onValidate={handleValidateRecipient}
                  onStatusChange={handleStatusChange}
                  index={index}
                />
              ))}
            </motion.div>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isDark={isDark}
              totalItems={filteredRecipients.length}
              itemsPerPage={itemsPerPage}
            />
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-3xl p-12 md:p-20 text-center ${isDark
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
            <Users size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          </motion.div>
          <p className={`text-base font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No recipients found matching your criteria
          </p>
          <p className={`text-sm font-medium mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Try adjusting your filters or search term
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {/* Add this with your other modals */}
        {showVerificationModal && recipientToVerifyReject && (
          <VerificationModal
            isDark={isDark}
            recipient={recipientToVerifyReject}
            onClose={() => {
              setShowVerificationModal(false);
              setRecipientToVerifyReject(null);
            }}
            onVerify={handleVerify}
            onReject={handleReject}
          />
        )}

        {showRecipientModal && selectedRecipient && (
          <RecipientDetailModal
            recipient={selectedRecipient}
            isDark={isDark}
            onClose={closeModals}
            onStatusChange={handleStatusChange} // Make sure this is passed
            onVerificationChange={handleVerificationChange}
            availableAdmins={availableAdmins}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showValidationModal && recipientToValidate && (
          <RecipientValidationModal
            isDark={isDark}
            recipient={recipientToValidate}
            onClose={() => {
              setShowValidationModal(false);
              setRecipientToValidate(null);
            }}
            onValidate={handleValidationSubmit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddRecipientModal && (
          <AddRecipientModal
            isDark={isDark}
            recipient={editingRecipient}
            onClose={closeModals}
            onAddRecipient={(recipient) => {
              handleAddRecipient(recipient);
              closeModals(); // Close the modal
            }}
            onUpdateRecipient={(recipient) => {
              handleUpdateRecipient(recipient);
              closeModals(); // Close the modal
            }}
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