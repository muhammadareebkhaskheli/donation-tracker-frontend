import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Banknote,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  FileCheck,
  AlertTriangle,
  Send,
  RefreshCw,
  Plus,
  UserCheck,
  Forward,
  Users,
  Home,
  Briefcase,
  Heart,
  Award,
  Zap,
  Activity,
  Settings,
  Download,
  AlertCircle,
  Phone,
  Mail,
  MessageSquare,
  Upload,
  IdCard,
  Trash2,
  FileSpreadsheet,
  FileDown,
  UserPlus,
  CreditCard,
  MapPin,
  Edit,
  Car,
  Stethoscope,
  Cpu,
  ShoppingBag,
  Sprout,
  Building,
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

// ==================== FORMAT VALUE FUNCTION (SIMILAR TO YOUR EXAMPLE) ====================
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
  const currencyPrefix = isCurrency ? '₹ ' : '';

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

// ==================== MEMOIZED STATIC DATA (INDIA VERSION) ====================
const mockAdminRequests = [
  {
    id: 'REQ-2024-001',
    title: 'Medical Treatment for Cancer',
    description: 'Chemotherapy treatment for stage 2 cancer patient.',
    requiredAmount: 1200000,
    donatedAmount: 500000,
    remainingAmount: 700000,
    currency: 'INR',
    status: 'Pending-Validation',
    category: 'Medical',
    createdAt: '2024-04-01T09:30:00',
    updatedAt: '2024-04-15T14:20:00',
    deadline: '2026-06-30',
    donorsCount: 3,
    documents: [
      { id: 1, name: 'medical_report.pdf', size: '2.5 MB', type: 'application/pdf', status: 'verified' },
      { id: 2, name: 'treatment_quotation.pdf', size: '1.8 MB', type: 'application/pdf', status: 'verified' }
    ],
    approvers: ['admin1', 'admin2', 'co-approver1'],
    coApprovers: ['co-approver1', 'co-approver2'],
    approvedBy: [],
    progress: 42,
    visibility: 'public',
    featured: true,
    tags: ['medical', 'cancer', 'treatment'],
    verificationStatus: 'In Progress',
    assignee: 'admin1',
    completionRate: 42,
    forwardingHistory: [],
    requestor: {
      id: 'USER-001',
      name: 'Rajesh Kumar',
      type: 'recipient',
      phone: '+91-98765-43210',
      email: 'rajesh.kumar@example.com',
      profileCompletion: 95,
      aadhaarNumber: '1234-5678-9012'
    },
    validationNotes: [
      {
        id: 1,
        text: 'Medical reports verified by hospital',
        timestamp: '2024-04-02',
        admin: 'admin1',
        type: 'approval'
      },
      {
        id: 2,
        text: 'Treatment quotation needs validation from second doctor',
        timestamp: '2024-04-03',
        admin: 'admin2',
        type: 'document_issue'
      }
    ],
    urgency: '',
    location: 'Mumbai',
    createdBy: 'recipient',
    supportStaffId: null,
    whatsappNumber: '+91-98765-01234',
    donationHistory: [
      {
        id: 'DON-001',
        donationDate: '2024-04-15T14:30:00',
        amount: 25000,
        paymentMethod: 'UPI',
        transactionId: 'TXN-001234567890',
        paymentStatus: 'Successful',
        receiptGenerated: true,
        receiptUrl: '#',
        requestTitle: 'Medical Treatment for Cancer',
        requiredAmount: 1200000,
        recipientVerified: true,
        requestApproved: true,
        category: 'Medical',
        donorId: 'USER-001',
        role: 'donor',
        name: 'John Doe',
        email: 'john@example.com'
      },
      {
        id: 'DON-002',
        donationDate: '2024-04-10T11:20:00',
        amount: 15000,
        paymentMethod: 'Bank Transfer',
        transactionId: 'TXN-009876543210',
        paymentStatus: 'Successful',
        receiptGenerated: true,
        receiptUrl: '#',
        requestTitle: 'Medical Treatment for Cancer',
        requiredAmount: 1200000,
        recipientVerified: true,
        requestApproved: true,
        category: 'Medical',
        donorId: 'USER-002',
        role: 'donor',
        name: 'Alice Smith',
        email: 'alice@example.com'
      }
    ]
  },
  {
    id: 'REQ-2024-002',
    title: 'Home Renovation After Flood',
    description: 'Repair home damaged by recent floods.',
    requiredAmount: 800000,
    donatedAmount: 0,
    remainingAmount: 800000,
    currency: 'INR',
    status: 'Validated',
    category: 'Housing',
    createdAt: '2024-04-03T11:45:00',
    updatedAt: '2024-04-10T10:15:00',
    deadline: '2024-08-31',
    donorsCount: 0,
    documents: [
      { id: 1, name: 'damage_assessment.pdf', size: '3.2 MB', type: 'application/pdf', status: 'verified' }
    ],
    approvers: ['admin2'],
    coApprovers: ['co-approver3'],
    approvedBy: [],
    progress: 0,
    visibility: 'public',
    featured: false,
    tags: ['housing', 'flood', 'renovation'],
    verificationStatus: 'Completed',
    assignee: 'admin2',
    completionRate: 0,
    forwardingHistory: [],
    requestor: {
      id: 'USER-002',
      name: 'Priya Sharma',
      type: 'recipient',
      phone: '+91-98765-54321',
      email: 'priya.sharma@example.com',
      profileCompletion: 88,
      aadhaarNumber: '2345-6789-0123'
    },
    validationNotes: [
      {
        id: 1,
        text: 'Damage assessment verified by government agency',
        timestamp: '2024-04-05',
        admin: 'admin2',
        type: 'approval'
      }
    ],
    urgency: 'Medium',
    location: 'Delhi',
    createdBy: 'support_staff',
    supportStaffId: 'STAFF-001',
    whatsappNumber: '+91-98765-12345'
  },
  {
    id: 'REQ-2024-003',
    title: 'Business Startup Funds',
    description: 'Starting a small grocery store business.',
    requiredAmount: 500000,
    donatedAmount: 0,
    remainingAmount: 500000,
    currency: 'INR',
    status: 'Rejected',
    category: 'Business',
    createdAt: '2024-04-05T14:20:00',
    updatedAt: '2024-04-12T16:30:00',
    deadline: '2024-07-15',
    donorsCount: 0,
    documents: [
      { id: 1, name: 'business_plan.pdf', size: '2.1 MB', type: 'application/pdf', status: 'rejected' }
    ],
    approvers: ['admin1'],
    coApprovers: [],
    approvedBy: [],
    progress: 0,
    visibility: 'private',
    featured: false,
    tags: ['business', 'startup'],
    verificationStatus: 'Completed',
    assignee: 'admin1',
    completionRate: 0,
    rejectionReason: 'Business plan not feasible',
    forwardingHistory: [],
    requestor: {
      id: 'USER-003',
      name: 'Arun Singh',
      type: 'recipient',
      phone: '+91-98765-65432',
      email: 'arun.singh@example.com',
      profileCompletion: 75,
      aadhaarNumber: '3456-7890-1234'
    },
    validationNotes: [
      {
        id: 1,
        text: 'Business plan lacks market analysis',
        timestamp: '2024-04-08',
        admin: 'admin1',
        type: 'rejection'
      }
    ],
    urgency: 'Low',
    location: 'Bangalore',
    createdBy: 'recipient',
    supportStaffId: null,
    whatsappNumber: '+91-98765-23456'
  },
  {
    id: 'REQ-2024-001',
    title: 'Medical Treatment for Cancer',
    description: 'Chemotherapy treatment for stage 2 cancer patient.',
    requiredAmount: 1200000,
    donatedAmount: 500000,
    remainingAmount: 700000,
    currency: 'INR',
    status: 'Pending-Validation',
    category: 'Medical',
    createdAt: '2024-04-01T09:30:00',
    updatedAt: '2024-04-15T14:20:00',
    deadline: '2024-06-30',
    donorsCount: 3,
    documents: [
      { id: 1, name: 'medical_report.pdf', size: '2.5 MB', type: 'application/pdf', status: 'verified' },
      { id: 2, name: 'treatment_quotation.pdf', size: '1.8 MB', type: 'application/pdf', status: 'verified' }
    ],
    approvers: ['admin1', 'admin2', 'co-approver1'],
    coApprovers: ['co-approver1', 'co-approver2'],
    approvedBy: [],
    progress: 42,
    visibility: 'public',
    featured: true,
    tags: ['medical', 'cancer', 'treatment'],
    verificationStatus: 'In Progress',
    assignee: 'admin1',
    completionRate: 42,
    forwardingHistory: [],
    requestor: {
      id: 'USER-001',
      name: 'Rajesh Kumar',
      type: 'recipient',
      phone: '+91-98765-43210',
      email: 'rajesh.kumar@example.com',
      profileCompletion: 95,
      aadhaarNumber: '1234-5678-9012'
    },
    validationNotes: [
      {
        id: 1,
        text: 'Medical reports verified by hospital',
        timestamp: '2024-04-02',
        admin: 'admin1',
        type: 'approval'
      },
      {
        id: 2,
        text: 'Treatment quotation needs validation from second doctor',
        timestamp: '2024-04-03',
        admin: 'admin2',
        type: 'document_issue'
      }
    ],
    urgency: 'High',
    location: 'Mumbai',
    createdBy: 'recipient',
    supportStaffId: null,
    whatsappNumber: '+91-98765-01234'
  },
  {
    id: 'REQ-2024-002',
    title: 'Home Renovation After Flood',
    description: 'Repair home damaged by recent floods.',
    requiredAmount: 800000,
    donatedAmount: 0,
    remainingAmount: 800000,
    currency: 'INR',
    status: 'Validated',
    category: 'Housing',
    createdAt: '2024-04-03T11:45:00',
    updatedAt: '2024-04-10T10:15:00',
    deadline: '2024-08-31',
    donorsCount: 0,
    documents: [
      { id: 1, name: 'damage_assessment.pdf', size: '3.2 MB', type: 'application/pdf', status: 'verified' }
    ],
    approvers: ['admin2'],
    coApprovers: ['co-approver3'],
    approvedBy: [],
    progress: 0,
    visibility: 'public',
    featured: false,
    tags: ['housing', 'flood', 'renovation'],
    verificationStatus: 'Completed',
    assignee: 'admin2',
    completionRate: 0,
    forwardingHistory: [],
    requestor: {
      id: 'USER-002',
      name: 'Priya Sharma',
      type: 'recipient',
      phone: '+91-98765-54321',
      email: 'priya.sharma@example.com',
      profileCompletion: 88,
      aadhaarNumber: '2345-6789-0123'
    },
    validationNotes: [
      {
        id: 1,
        text: 'Damage assessment verified by government agency',
        timestamp: '2024-04-05',
        admin: 'admin2',
        type: 'approval'
      }
    ],
    urgency: 'Medium',
    location: 'Delhi',
    createdBy: 'support_staff',
    supportStaffId: 'STAFF-001',
    whatsappNumber: '+91-98765-12345'
  },
  {
    id: 'REQ-2024-003',
    title: 'Business Startup Funds',
    description: 'Starting a small grocery store business.',
    requiredAmount: 500000,
    donatedAmount: 0,
    remainingAmount: 500000,
    currency: 'INR',
    status: 'Rejected',
    category: 'Business',
    createdAt: '2024-04-05T14:20:00',
    updatedAt: '2024-04-12T16:30:00',
    deadline: '2024-07-15',
    donorsCount: 0,
    documents: [
      { id: 1, name: 'business_plan.pdf', size: '2.1 MB', type: 'application/pdf', status: 'rejected' }
    ],
    approvers: ['admin1'],
    coApprovers: [],
    approvedBy: [],
    progress: 0,
    visibility: 'private',
    featured: false,
    tags: ['business', 'startup'],
    verificationStatus: 'Completed',
    assignee: 'admin1',
    completionRate: 0,
    rejectionReason: 'Business plan not feasible',
    forwardingHistory: [],
    requestor: {
      id: 'USER-003',
      name: 'Arun Singh',
      type: 'recipient',
      phone: '+91-98765-65432',
      email: 'arun.singh@example.com',
      profileCompletion: 75,
      aadhaarNumber: '3456-7890-1234'
    },
    validationNotes: [
      {
        id: 1,
        text: 'Business plan lacks market analysis',
        timestamp: '2024-04-08',
        admin: 'admin1',
        type: 'rejection'
      }
    ],
    urgency: 'Low',
    location: 'Bangalore',
    createdBy: 'recipient',
    supportStaffId: null,
    whatsappNumber: '+91-98765-23456'
  },
  {
    id: 'REQ-2024-001',
    title: 'Medical Treatment for Cancer',
    description: 'Chemotherapy treatment for stage 2 cancer patient.',
    requiredAmount: 1200000,
    donatedAmount: 500000,
    remainingAmount: 700000,
    currency: 'INR',
    status: 'Pending-Validation',
    category: 'Medical',
    createdAt: '2024-04-01T09:30:00',
    updatedAt: '2024-04-15T14:20:00',
    deadline: '2024-06-30',
    donorsCount: 3,
    documents: [
      { id: 1, name: 'medical_report.pdf', size: '2.5 MB', type: 'application/pdf', status: 'verified' },
      { id: 2, name: 'treatment_quotation.pdf', size: '1.8 MB', type: 'application/pdf', status: 'verified' }
    ],
    approvers: ['admin1', 'admin2', 'co-approver1'],
    coApprovers: ['co-approver1', 'co-approver2'],
    approvedBy: [],
    progress: 42,
    visibility: 'public',
    featured: true,
    tags: ['medical', 'cancer', 'treatment'],
    verificationStatus: 'In Progress',
    assignee: 'admin1',
    completionRate: 42,
    forwardingHistory: [],
    requestor: {
      id: 'USER-001',
      name: 'Rajesh Kumar',
      type: 'recipient',
      phone: '+91-98765-43210',
      email: 'rajesh.kumar@example.com',
      profileCompletion: 95,
      aadhaarNumber: '1234-5678-9012'
    },
    validationNotes: [
      {
        id: 1,
        text: 'Medical reports verified by hospital',
        timestamp: '2024-04-02',
        admin: 'admin1',
        type: 'approval'
      },
      {
        id: 2,
        text: 'Treatment quotation needs validation from second doctor',
        timestamp: '2024-04-03',
        admin: 'admin2',
        type: 'document_issue'
      }
    ],
    urgency: 'High',
    location: 'Mumbai',
    createdBy: 'recipient',
    supportStaffId: null,
    whatsappNumber: '+91-98765-01234'
  },
  {
    id: 'REQ-2024-002',
    title: 'Home Renovation After Flood',
    description: 'Repair home damaged by recent floods.',
    requiredAmount: 800000,
    donatedAmount: 0,
    remainingAmount: 800000,
    currency: 'INR',
    status: 'Validated',
    category: 'Housing',
    createdAt: '2024-04-03T11:45:00',
    updatedAt: '2024-04-10T10:15:00',
    deadline: '2024-08-31',
    donorsCount: 0,
    documents: [
      { id: 1, name: 'damage_assessment.pdf', size: '3.2 MB', type: 'application/pdf', status: 'verified' }
    ],
    approvers: ['admin2'],
    coApprovers: ['co-approver3'],
    approvedBy: [],
    progress: 0,
    visibility: 'public',
    featured: false,
    tags: ['housing', 'flood', 'renovation'],
    verificationStatus: 'Completed',
    assignee: 'admin2',
    completionRate: 0,
    forwardingHistory: [],
    requestor: {
      id: 'USER-002',
      name: 'Priya Sharma',
      type: 'recipient',
      phone: '+91-98765-54321',
      email: 'priya.sharma@example.com',
      profileCompletion: 88,
      aadhaarNumber: '2345-6789-0123'
    },
    validationNotes: [
      {
        id: 1,
        text: 'Damage assessment verified by government agency',
        timestamp: '2024-04-05',
        admin: 'admin2',
        type: 'approval'
      }
    ],
    urgency: 'Medium',
    location: 'Delhi',
    createdBy: 'support_staff',
    supportStaffId: 'STAFF-001',
    whatsappNumber: '+91-98765-12345'
  },
  {
    id: 'REQ-2024-003',
    title: 'Business Startup Funds',
    description: 'Starting a small grocery store business.',
    requiredAmount: 500000,
    donatedAmount: 0,
    remainingAmount: 500000,
    currency: 'INR',
    status: 'Rejected',
    category: 'Business',
    createdAt: '2024-04-05T14:20:00',
    updatedAt: '2024-04-12T16:30:00',
    deadline: '2024-07-15',
    donorsCount: 0,
    documents: [
      { id: 1, name: 'business_plan.pdf', size: '2.1 MB', type: 'application/pdf', status: 'rejected' }
    ],
    approvers: ['admin1'],
    coApprovers: [],
    approvedBy: [],
    progress: 0,
    visibility: 'private',
    featured: false,
    tags: ['business', 'startup'],
    verificationStatus: 'Completed',
    assignee: 'admin1',
    completionRate: 0,
    rejectionReason: 'Business plan not feasible',
    forwardingHistory: [],
    requestor: {
      id: 'USER-003',
      name: 'Arun Singh',
      type: 'recipient',
      phone: '+91-98765-65432',
      email: 'arun.singh@example.com',
      profileCompletion: 75,
      aadhaarNumber: '3456-7890-1234'
    },
    validationNotes: [
      {
        id: 1,
        text: 'Business plan lacks market analysis',
        timestamp: '2024-04-08',
        admin: 'admin1',
        type: 'rejection'
      }
    ],
    urgency: 'Low',
    location: 'Bangalore',
    createdBy: 'recipient',
    supportStaffId: null,
    whatsappNumber: '+91-98765-23456'
  }
];

// Mock admin users data (India version)
const mockAdminUsers = [
  { id: 'admin1', name: 'Admin Sharma', role: 'admin', email: 'admin.sharma@donation.org', phone: '+91-98765-11111' },
  { id: 'admin2', name: 'Admin Patel', role: 'admin', email: 'admin.patel@donation.org', phone: '+91-98765-22222' },
  { id: 'admin3', name: 'Admin Verma', role: 'admin', email: 'admin.verma@donation.org', phone: '+91-98765-33333' },
];

// ==================== UTILITY COMPONENTS ====================
const shakeAnimation = {
  initial: { x: 0 },
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

const ProgressCircle = React.memo(({ percentage, size = 80, isDark, color }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = useCallback(() => {
    if (color) return color;
    if (percentage >= 75) return '#10b981';
    if (percentage >= 50) return '#3b82f6';
    if (percentage >= 25) return '#f59e0b';
    return '#ef4444';
  }, [percentage, color]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDark ? '#374151' : '#e5e7eb'}
          strokeWidth="6"
          fill="none"
        />
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
          }}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {percentage}%
        </span>
      </div>
    </div>
  );
});

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

const EnhancedStatCard = React.memo(({
  icon: Icon,
  title,
  value,
  change,
  changeType,
  color,
  delay,
  isDark,
  fullNumber,
  subtitle,
  iconColor,
  isCurrency = false
}) => (
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
        duration: 8,
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
            className={`text-2xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent ${color.includes('blue') ? 'from-blue-500 to-cyan-500' :
              color.includes('emerald') ? 'from-emerald-500 to-teal-500' :
                color.includes('violet') ? 'from-violet-500 to-purple-500' :
                  color.includes('cyan') ? 'from-cyan-500 to-blue-500' :
                    color.includes('rose') ? 'from-rose-500 to-pink-500' :
                      color.includes('purple') || color.includes('indigo') ? 'from-purple-500 to-indigo-600' :
                        'from-amber-500 to-orange-500'
              }`}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring" }}
            title={fullNumber}
          >
            {isCurrency ? formatValue(value, true) : formatValue(value, false)}
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
                    color.includes('violet') || color.includes('purple') || color.includes('indigo') ? 'text-violet-500' :
                      color.includes('violet') ? 'text-violet-500' :
                        color.includes('rose') ? 'text-rose-500' :
                          color.includes('cyan') ? 'text-cyan-500' :
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
));

const Pagination = React.memo(({ currentPage, totalPages, onPageChange, isDark, totalItems, itemsPerPage }) => {
  if (totalPages <= 1) return null;

  const handlePageChange = useCallback((page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);

      setTimeout(() => {
        const requestsSection = document.querySelector('.requests-grid-container')?.parentElement;
        if (requestsSection) {
          const yOffset = -100;
          const y = requestsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({
            top: Math.max(0, y),
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [currentPage, totalPages, onPageChange]);

  // Calculate range of items being shown
  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Show max 5 dots
  const dots = [];
  const maxDots = 5;

  if (totalPages <= maxDots) {
    for (let i = 1; i <= totalPages; i++) {
      dots.push(i);
    }
  } else {
    // Always show first, last, and current with neighbors
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
      {/* Page info */}
      <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Page {currentPage} of {totalPages} • Showing {startItem}-{endItem} requests from {totalItems}
      </div>

      <div className="flex items-center gap-4">
        {/* Previous button */}
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

        {/* Page dots */}
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

        {/* Next button */}
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

const SuccessDialog = React.memo(({ isDark, title, message, onClose }) => {
  return (
    <motion.div
      key="success-dialog"
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
});

const ConfirmationDialog = React.memo(({ isDark, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => {
  return (
    <motion.div
      key="confirmation-dialog"
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
});

// ==================== CREATE REQUEST MODAL COMPONENT ====================
const CreateRequestModal = React.memo(({
  isDark,
  formData,
  fieldErrors,
  shakeFields,
  onFormChange,
  onDocumentsChange,
  onClose,
  onSubmit,
  categoryOptions,
  urgencyOptions
}) => {
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit();
  }, [onSubmit]);

  // Format Aadhaar input
  const handleAadhaarChange = useCallback((e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 12) value = value.slice(0, 12);

    // Format as 1234-5678-9012
    if (value.length > 8) {
      value = `${value.slice(0, 4)}-${value.slice(4, 8)}-${value.slice(8, 12)}`;
    } else if (value.length > 4) {
      value = `${value.slice(0, 4)}-${value.slice(4)}`;
    }

    onFormChange({
      target: {
        name: 'aadhaarNumber',
        value: value
      }
    });
  }, [onFormChange]);

  // Validate Aadhaar format
  const validateAadhaar = (value) => {
    if (!value) return true; // Optional field
    const aadhaarRegex = /^\d{4}-\d{4}-\d{4}$/;
    return aadhaarRegex.test(value);
  };

  return (
    <motion.div
      key="create-request-modal"
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
        className={`rounded-3xl w-full max-w-4xl mx-4 ${isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-white via-white to-gray-50'
          }`}
        style={{
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          maxHeight: 'calc(100vh - 2rem)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white mb-1">
                Create New Request
              </h2>
              <p className="text-violet-100 text-sm font-medium">
                Create a new donation request as an admin
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

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
            {/* Request Details Section */}
            <div className="space-y-4 sm:space-y-5">
              {/* Row 1: Title and Required Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title Field */}
                <div className="overflow-visible">
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    &nbsp;Title <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                  </label>
                  <motion.div
                    animate={shakeFields.includes('title') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="overflow-visible relative"
                  >
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={onFormChange}
                      onKeyPress={(e) => {
                        const charCode = e.charCode;
                        if (!(
                          (charCode >= 65 && charCode <= 90) ||
                          (charCode >= 97 && charCode <= 122) ||
                          charCode === 32 ||
                          charCode === 44 ||
                          charCode === 46 ||
                          charCode === 33 ||
                          charCode === 63 ||
                          charCode === 39 ||
                          charCode === 45 ||
                          charCode === 40 ||
                          charCode === 41
                        )) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        const pastedText = e.clipboardData.getData('text');
                        const hasInvalidChars = /[0-9@#$%^&*_+=\[\]{};:"\\|<>\/~`]/.test(pastedText);
                        if (hasInvalidChars) {
                          e.preventDefault();
                          alert('Title can only contain letters, spaces, and basic punctuation (.,!?-())');
                        }
                      }}
                      placeholder="Heart surgery funding request"
                      maxLength={30}
                      autoComplete="off"
                      className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                        } ${fieldErrors.title ? 'border-rose-500' : ''}`}
                    />
                    <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formData.title.length}/30
                    </div>
                  </motion.div>
                  {fieldErrors.title && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                    >
                      <XCircle size={12} />
                      {fieldErrors.title}
                    </motion.p>
                  )}
                </div>

                {/* Required Amount Field */}
                <div className="overflow-visible">
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    &nbsp;Required Amount <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
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
                      onChange={(e) => {
                        let value = e.target.value;
                        const numValue = parseFloat(value);
                        if (value === '' || isNaN(numValue)) {
                          value = '0';
                        } else if (numValue < 0) {
                          value = '0';
                        } else {
                          value = numValue.toString();
                        }

                        onFormChange({
                          target: {
                            name: 'requiredAmount',
                            value: value
                          }
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key.length === 1 && /[0-9]/.test(e.key)) {
                          if (formData.requiredAmount === '0') {
                            onFormChange({
                              target: {
                                name: 'requiredAmount',
                                value: ''
                              }
                            });
                          }
                        }
                      }}
                      onClick={(e) => {
                        e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                      }}
                      min="0"
                      step="1"
                      autoComplete="off"
                      className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium number-input ${isDark
                        ? 'bg-gray-800 border-gray-600'
                        : 'bg-white border-gray-200'
                        } ${fieldErrors.requiredAmount ? 'border-rose-500' : ''}`}
                      style={{
                        color: (!formData.requiredAmount || formData.requiredAmount === '0')
                          ? (isDark ? '#9CA3AF' : '#6B7280')
                          : (isDark ? '#FFFFFF' : '#111827'),
                        MozAppearance: 'textfield',
                        WebkitAppearance: 'none'
                      }}
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
              </div>

              {/* Row 2: Description (Full Width) */}
              <div className="overflow-visible">
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  &nbsp;Description <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                </label>
                <motion.div
                  animate={shakeFields.includes('description') ? "shake" : "initial"}
                  variants={shakeAnimation}
                  className="overflow-visible relative"
                >
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={onFormChange}
                    rows={1}
                    placeholder="Please describe your financial need and situation in short."
                    maxLength={100}
                    autoComplete="off"
                    className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium resize-none ${isDark
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                      } ${fieldErrors.description ? 'border-rose-500' : ''}`}
                  />
                  <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formData.description.length}/100
                  </div>
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

              {/* Row 3: Deadline and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Deadline Field */}
                <div className="overflow-visible">
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    &nbsp;Deadline <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                  </label>
                  <motion.div
                    animate={shakeFields.includes('deadline') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="overflow-visible"
                  >
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={onFormChange}
                      min={new Date().toISOString().split('T')[0]}
                      autoComplete="off"
                      className={`date-field w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                        } ${fieldErrors.deadline ? 'border-rose-500' : ''} 
                        ${formData.deadline ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}
                      style={{
                        color: formData.deadline ? '' : (isDark ? '#9CA3AF' : '#6B7280')
                      }}
                    />
                    <style jsx>{`
                      .date-field::-webkit-calendar-picker-indicator {
                        ${isDark
                        ? 'filter: invert(39%) sepia(6%) saturate(1199%) hue-rotate(182deg) brightness(94%) contrast(87%);'
                        : 'filter: invert(39%) sepia(6%) saturate(1199%) hue-rotate(182deg) brightness(94%) contrast(87%);'
                      }
                        cursor: pointer;
                      }
                    `}</style>
                  </motion.div>
                  {fieldErrors.deadline && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                    >
                      <XCircle size={12} />
                      {fieldErrors.deadline}
                    </motion.p>
                  )}
                </div>

                {/* Category Field */}
                <div className="relative">
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    &nbsp;Category <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                  </label>

                  <motion.div
                    animate={shakeFields.includes('category') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="relative"
                  >
                    <select
                      name="category"
                      value={formData.category}
                      onChange={onFormChange}
                      autoComplete="off"
                      className={`w-full p-3 rounded-2xl text-sm font-medium transition-all appearance-none ${isDark
                        ? 'bg-gray-800 border-gray-600'
                        : 'bg-white border-gray-200'
                        } border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none ${formData.category === ""
                          ? (isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]')
                          : (isDark ? 'text-white' : 'text-gray-900')
                        } ${fieldErrors.category ? 'border-rose-500' : ''}`}
                    >
                      <option value="">
                        &nbsp;Select Category
                      </option>
                      {categoryOptions.filter(opt => opt !== 'All Categories').map(option => (
                        <option
                          key={option}
                          value={option}
                          className={isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'}
                        >
                          &nbsp;{option}
                        </option>
                      ))}
                    </select>

                    <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <ChevronDown size={16} />
                    </div>
                  </motion.div>

                  {fieldErrors.category && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-rose-600 text-xs font-medium mt-1"
                    >
                      <AlertCircle size={12} />
                      {fieldErrors.category}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Row 4: Aadhaar Card Number and Urgency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Aadhaar Card Number */}
                <div className="overflow-visible">
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    &nbsp;Aadhaar Number <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                  </label>
                  <motion.div
                    animate={shakeFields.includes('aadhaarNumber') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="overflow-visible relative"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        name="aadhaarNumber"
                        value={formData.aadhaarNumber}
                        onChange={handleAadhaarChange}
                        placeholder="XXXX-XXXX-XXXX"
                        maxLength={14}
                        autoComplete="off"
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          } ${fieldErrors.aadhaarNumber ? 'border-rose-500' : ''}`}
                      />
                    </div>
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

                {/* Urgency */}
                <div className="relative">
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    &nbsp;Urgency <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                  </label>
                  <motion.div
                    animate={shakeFields.includes('urgency') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="relative"
                  >
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={onFormChange}
                      autoComplete="off"
                      className={`w-full p-3 rounded-2xl text-sm font-medium transition-all appearance-none ${isDark
                        ? 'bg-gray-800 border-gray-600'
                        : 'bg-white border-gray-200'
                        } border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none ${formData.urgency === ""
                          ? (isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]')
                          : (isDark ? 'text-white' : 'text-gray-900')
                        } ${fieldErrors.urgency ? 'border-rose-500' : ''}`}
                    >
                      <option value="">
                        &nbsp;Select Urgency
                      </option>
                      {urgencyOptions.filter(opt => opt !== 'All Urgency').map(option => (
                        <option
                          key={option}
                          value={option}
                          className={isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'}
                        >
                          &nbsp;{option}
                        </option>
                      ))}
                    </select>

                    <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <ChevronDown size={16} />
                    </div>
                  </motion.div>

                  {fieldErrors.urgency && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-rose-600 text-xs font-medium mt-1"
                    >
                      <AlertCircle size={12} />
                      {fieldErrors.urgency}
                    </motion.p>
                  )}
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                &nbsp;Supporting Documents <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
              </label>
              <DocumentUpload
                documents={formData.documents}
                onDocumentsChange={onDocumentsChange}
                isDark={isDark}
                fieldErrors={fieldErrors}
                onFieldError={() => { }}
                shakeFields={shakeFields}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 px-6 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${isDark
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold shadow-xl flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Create Request
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
});

// ==================== EDIT REQUEST MODAL COMPONENT ====================
const EditRequestModal = React.memo(({
  isDark,
  request,
  formData,
  fieldErrors,
  shakeFields,
  onFormChange,
  onDocumentsChange,
  onClose,
  onSubmit,
  categoryOptions,
  urgencyOptions
}) => {
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit();
  }, [onSubmit]);

  // Format Aadhaar input
  const handleAadhaarChange = useCallback((e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 12) value = value.slice(0, 12);

    // Format as 1234-5678-9012
    if (value.length > 8) {
      value = `${value.slice(0, 4)}-${value.slice(4, 8)}-${value.slice(8, 12)}`;
    } else if (value.length > 4) {
      value = `${value.slice(0, 4)}-${value.slice(4)}`;
    }

    onFormChange({
      target: {
        name: 'aadhaarNumber',
        value: value
      }
    });
  }, [onFormChange]);

  // Validate Aadhaar format
  const validateAadhaar = (value) => {
    if (!value) return true; // Optional field
    const aadhaarRegex = /^\d{4}-\d{4}-\d{4}$/;
    return aadhaarRegex.test(value);
  };

  return (
    <motion.div
      key="edit-request-modal"
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
        className={`rounded-3xl w-full max-w-4xl mx-4 ${isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-white via-white to-gray-50'
          }`}
        style={{
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          maxHeight: 'calc(100vh - 2rem)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white mb-1">
                Edit Request
              </h2>
              <p className="text-violet-100 text-sm font-medium">
                Update request information
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

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
            {/* Request Details Section */}
            <div className="space-y-4 sm:space-y-5">
              {/* Row 1: Title and Required Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title Field */}
                <div className="overflow-visible">
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    &nbsp;Title <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                  </label>
                  <motion.div
                    animate={shakeFields.includes('title') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="overflow-visible relative"
                  >
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={onFormChange}
                      onKeyPress={(e) => {
                        const charCode = e.charCode;
                        if (!(
                          (charCode >= 65 && charCode <= 90) ||
                          (charCode >= 97 && charCode <= 122) ||
                          charCode === 32 ||
                          charCode === 44 ||
                          charCode === 46 ||
                          charCode === 33 ||
                          charCode === 63 ||
                          charCode === 39 ||
                          charCode === 45 ||
                          charCode === 40 ||
                          charCode === 41
                        )) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        const pastedText = e.clipboardData.getData('text');
                        const hasInvalidChars = /[0-9@#$%^&*_+=\[\]{};:"\\|<>\/~`]/.test(pastedText);
                        if (hasInvalidChars) {
                          e.preventDefault();
                          alert('Title can only contain letters, spaces, and basic punctuation (.,!?-())');
                        }
                      }}
                      placeholder="Heart surgery funding request"
                      maxLength={30}
                      autoComplete="off"
                      className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                        } ${fieldErrors.title ? 'border-rose-500' : ''}`}
                    />
                    <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formData.title.length}/30
                    </div>
                  </motion.div>
                  {fieldErrors.title && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                    >
                      <XCircle size={12} />
                      {fieldErrors.title}
                    </motion.p>
                  )}
                </div>

                {/* Required Amount Field */}
                <div className="overflow-visible">
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    &nbsp;Required Amount <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
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
                      onChange={(e) => {
                        let value = e.target.value;
                        const numValue = parseFloat(value);
                        if (value === '' || isNaN(numValue)) {
                          value = '0';
                        } else if (numValue < 0) {
                          value = '0';
                        } else {
                          value = numValue.toString();
                        }

                        onFormChange({
                          target: {
                            name: 'requiredAmount',
                            value: value
                          }
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key.length === 1 && /[0-9]/.test(e.key)) {
                          if (formData.requiredAmount === '0') {
                            onFormChange({
                              target: {
                                name: 'requiredAmount',
                                value: ''
                              }
                            });
                          }
                        }
                      }}
                      onClick={(e) => {
                        e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                      }}
                      min="0"
                      step="1"
                      autoComplete="off"
                      className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium number-input ${isDark
                        ? 'bg-gray-800 border-gray-600'
                        : 'bg-white border-gray-200'
                        } ${fieldErrors.requiredAmount ? 'border-rose-500' : ''}`}
                      style={{
                        color: (!formData.requiredAmount || formData.requiredAmount === '0')
                          ? (isDark ? '#9CA3AF' : '#6B7280')
                          : (isDark ? '#FFFFFF' : '#111827'),
                        MozAppearance: 'textfield',
                        WebkitAppearance: 'none'
                      }}
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
              </div>

              {/* Row 2: Description (Full Width) */}
              <div className="overflow-visible">
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  &nbsp;Description <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                </label>
                <motion.div
                  animate={shakeFields.includes('description') ? "shake" : "initial"}
                  variants={shakeAnimation}
                  className="overflow-visible relative"
                >
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={onFormChange}
                    rows={1}
                    placeholder="Please describe your financial need and situation in short."
                    maxLength={100}
                    autoComplete="off"
                    className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium resize-none ${isDark
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                      } ${fieldErrors.description ? 'border-rose-500' : ''}`}
                  />
                  <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formData.description.length}/100
                  </div>
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

              {/* Row 3: Deadline and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Deadline Field */}
                <div className="overflow-visible">
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    &nbsp;Deadline <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                  </label>
                  <motion.div
                    animate={shakeFields.includes('deadline') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="overflow-visible"
                  >
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={onFormChange}
                      min={new Date().toISOString().split('T')[0]}
                      autoComplete="off"
                      className={`date-field w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                        } ${fieldErrors.deadline ? 'border-rose-500' : ''} 
                        ${formData.deadline ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}
                      style={{
                        color: formData.deadline ? '' : (isDark ? '#9CA3AF' : '#6B7280')
                      }}
                    />
                    <style jsx>{`
                      .date-field::-webkit-calendar-picker-indicator {
                        ${isDark
                        ? 'filter: invert(39%) sepia(6%) saturate(1199%) hue-rotate(182deg) brightness(94%) contrast(87%);'
                        : 'filter: invert(39%) sepia(6%) saturate(1199%) hue-rotate(182deg) brightness(94%) contrast(87%);'
                      }
                        cursor: pointer;
                      }
                    `}</style>
                  </motion.div>
                  {fieldErrors.deadline && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                    >
                      <XCircle size={12} />
                      {fieldErrors.deadline}
                    </motion.p>
                  )}
                </div>

                {/* Category Field */}
                <div className="relative">
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    &nbsp;Category <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                  </label>

                  <motion.div
                    animate={shakeFields.includes('category') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="relative"
                  >
                    <select
                      name="category"
                      value={formData.category}
                      onChange={onFormChange}
                      autoComplete="off"
                      className={`w-full p-3 rounded-2xl text-sm font-medium transition-all appearance-none ${isDark
                        ? 'bg-gray-800 border-gray-600'
                        : 'bg-white border-gray-200'
                        } border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none ${formData.category === ""
                          ? (isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]')
                          : (isDark ? 'text-white' : 'text-gray-900')
                        } ${fieldErrors.category ? 'border-rose-500' : ''}`}
                    >
                      <option value="">
                        &nbsp;Select Category
                      </option>
                      {categoryOptions.filter(opt => opt !== 'All Categories').map(option => (
                        <option
                          key={option}
                          value={option}
                          className={isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'}
                        >
                          &nbsp;{option}
                        </option>
                      ))}
                    </select>

                    <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <ChevronDown size={16} />
                    </div>
                  </motion.div>

                  {fieldErrors.category && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-rose-600 text-xs font-medium mt-1"
                    >
                      <AlertCircle size={12} />
                      {fieldErrors.category}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Row 4: Aadhaar Card Number and Urgency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Aadhaar Card Number */}
                <div className="overflow-visible">
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    &nbsp;Aadhaar Number <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                  </label>
                  <motion.div
                    animate={shakeFields.includes('aadhaarNumber') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="overflow-visible relative"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        name="aadhaarNumber"
                        value={formData.aadhaarNumber}
                        onChange={handleAadhaarChange}
                        placeholder="XXXX-XXXX-XXXX"
                        maxLength={14}
                        autoComplete="off"
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          } ${fieldErrors.aadhaarNumber ? 'border-rose-500' : ''}`}
                      />
                    </div>
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

                {/* Urgency */}
                <div className="relative">
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    &nbsp;Urgency <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                  </label>
                  <motion.div
                    animate={shakeFields.includes('urgency') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="relative"
                  >
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={onFormChange}
                      autoComplete="off"
                      className={`w-full p-3 rounded-2xl text-sm font-medium transition-all appearance-none ${isDark
                        ? 'bg-gray-800 border-gray-600'
                        : 'bg-white border-gray-200'
                        } border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none ${formData.urgency === ""
                          ? (isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]')
                          : (isDark ? 'text-white' : 'text-gray-900')
                        } ${fieldErrors.urgency ? 'border-rose-500' : ''}`}
                    >
                      <option value="">
                        &nbsp;Select Urgency
                      </option>
                      {urgencyOptions.map(option => (
                        <option
                          key={option}
                          value={option}
                          className={isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'}
                        >
                          &nbsp;{option}
                        </option>
                      ))}
                    </select>

                    <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <ChevronDown size={16} />
                    </div>
                  </motion.div>

                  {fieldErrors.urgency && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-rose-600 text-xs font-medium mt-1"
                    >
                      <AlertCircle size={12} />
                      {fieldErrors.urgency}
                    </motion.p>
                  )}
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                &nbsp;Supporting Documents <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
              </label>
              <DocumentUpload
                documents={formData.documents}
                onDocumentsChange={onDocumentsChange}
                isDark={isDark}
                fieldErrors={fieldErrors}
                onFieldError={() => { }}
                shakeFields={shakeFields}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 px-6 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${isDark
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold shadow-xl flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} />
                Update Request
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
});

// ==================== FORWARD MODAL COMPONENT ====================
const ForwardModal = ({ isDark, request, onClose, onForward, currentAdmin = 'admin1' }) => {
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
      onForward(request.id, selectedAdmin, reason.trim());
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
                Forward Request
              </h2>
              <p className="text-violet-100 text-xs sm:text-sm font-medium">
                Transfer request to another admin for review
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
                Request Details
              </label>
              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                }`}>
                <p className={`text-sm sm:text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {request.title}
                </p>
                <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {request.id} • {request.category}
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
                    placeholder="Explain why you're forwarding this request..."
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

const AdminDonationHistory = React.memo(({ isDark, donationHistory }) => {
  const [showDonationHistory, setShowDonationHistory] = useState(false);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  if (!donationHistory || donationHistory.length === 0) {
    return null;
  }

  // Calculate totals
  const totalDonated = donationHistory.reduce((sum, donation) => sum + donation.amount, 0);
  const uniqueDonors = [...new Set(donationHistory.map(d => d.donorId))].length;

  return (
    <div className="space-y-4">
      {/* Header with collapsible toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Banknote size={20} className="text-emerald-500" />
            Donation History
          </h4>
          <div className={`px-2 py-1 rounded text-xs font-semibold ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
            {donationHistory.length} donation{donationHistory.length > 1 ? 's' : ''}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDonationHistory(!showDonationHistory)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold ${isDark
            ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
        >
          {showDonationHistory ? (
            <>
              <ChevronUp size={16} />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              Show Details
            </>
          )}
        </motion.button>
      </div>

      {/* Summary Stats (Always visible) */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className={`text-sm font-bold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Total Donations Received
            </h5>
            <p className={`text-2xl font-bold text-emerald-600`}>
              {formatValue(totalDonated, true)}
            </p>
          </div>
          <div>
            <h5 className={`text-sm font-bold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Unique Donors
            </h5>
            <p className={`text-2xl font-bold text-violet-600`}>
              {uniqueDonors} donor{uniqueDonors > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Collapsible Donation Details */}
      <AnimatePresence>
        {showDonationHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4">
              <h5 className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Donation Details ({donationHistory.length} transactions)
              </h5>

              {donationHistory.map((donation, index) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Donation #{donationHistory.length - index}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatDate(donation.donationDate)}
                      </p>
                    </div>
                    <span className={`text-lg font-bold text-emerald-600`}>
                      {formatValue(donation.amount, true)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Donor Information
                      </label>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {donation.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {donation.email}
                      </p>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Transaction ID
                      </label>
                      <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} truncate`} title={donation.transactionId}>
                        {donation.transactionId}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Payment Method
                      </label>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {donation.paymentMethod}
                      </p>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Payment Status
                      </label>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${donation.paymentStatus === 'Successful'
                        ? 'bg-emerald-500/20 text-emerald-600'
                        : donation.paymentStatus === 'Pending'
                          ? 'bg-amber-500/20 text-amber-600'
                          : 'bg-rose-500/20 text-rose-600'
                        }`}>
                        {donation.paymentStatus === 'Successful' ? (
                          <CheckCircle size={10} />
                        ) : donation.paymentStatus === 'Pending' ? (
                          <Clock size={10} />
                        ) : (
                          <XCircle size={10} />
                        )}
                        {donation.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Recipient Verified
                      </label>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${donation.recipientVerified
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                        }`}>
                        {donation.recipientVerified ? (
                          <>
                            <CheckCircle size={12} />
                            Yes
                          </>
                        ) : (
                          <>
                            <XCircle size={12} />
                            No
                          </>
                        )}
                      </span>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Request Approved
                      </label>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${donation.requestApproved
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                        }`}>
                        {donation.requestApproved ? (
                          <>
                            <CheckCircle size={12} />
                            Yes
                          </>
                        ) : (
                          <>
                            <XCircle size={12} />
                            No
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// ==================== VIEW REQUEST DETAILS MODAL ====================
const ViewRequestModal = React.memo(({ isDark, request, onClose }) => {
  const [showRecipientDetails, setShowRecipientDetails] = useState(false);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, []);

  const calculateAge = useCallback((dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }, []);

  // Mock recipient profile data (India version)
  const recipientProfile = {
    fullName: request.requestor?.name || 'Rajesh Kumar',
    email: request.requestor?.email || 'rajesh.kumar@example.com',
    phone: request.requestor?.phone || '+91-98765-43210',
    aadhaarNumber: request.requestor?.aadhaarNumber || '1234-5678-9012',
    panNumber: 'ABCDE1234F',
    dateOfBirth: '1979-05-15',
    age: calculateAge('1979-05-15'),
    address: 'Mumbai, Maharashtra',
    occupation: 'Business Owner',
    familyDetails: 'Wife and 2 children',
    bankName: 'State Bank of India',
    accountNumber: '123456789012',
    ifscCode: 'SBIN0001234',
    accountHolderName: 'Rajesh Kumar',
    branchName: 'Mumbai Main Branch',
    accountType: 'Savings',
    upiId: 'rajesh.kumar@upi',
    profileCompletion: 95,
    profileStatus: 'Verified',
    documents: [
      { name: 'aadhaar_card.pdf', size: '2.1 MB', type: 'application/pdf', url: '#' },
      { name: 'pan_card.pdf', size: '1.5 MB', type: 'application/pdf', url: '#' },
      { name: 'address_proof.pdf', size: '1.2 MB', type: 'application/pdf', url: '#' },
      { name: 'income_proof.pdf', size: '1.8 MB', type: 'application/pdf', url: '#' },
      { name: 'bank_proof.pdf', size: '1.0 MB', type: 'application/pdf', url: '#' }
    ]
  };

  const handleDownloadDocument = useCallback((doc) => {
    alert(`Downloading ${doc.name}`);
  }, []);

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
        className={`rounded-3xl w-full max-w-6xl mx-4 ${isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-white via-white to-gray-50'
          }`}
        style={{
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          maxHeight: 'calc(100vh - 2rem)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white mb-1">
                Request Details
              </h2>
              <p className="text-violet-100 text-sm font-medium">
                {request.id} • {request.title}
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

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Request Details Section */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <FileText size={20} className="text-violet-500" />
                Request Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Title
                    </label>
                    <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {request.title}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Required Amount
                    </label>
                    <p
                      className={`text-2xl font-bold text-violet-600`}
                      title={'₹ ' + getFullFormattedNumber(request.requiredAmount, false)}
                    >
                      {formatValue(request.requiredAmount, true)}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Description
                    </label>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {request.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Deadline
                    </label>
                    <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formatDate(request.deadline)}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Category
                    </label>
                    <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {request.category}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Aadhaar Card Number
                    </label>
                    <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {request.requestor?.aadhaarNumber || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Urgency
                    </label>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${request.urgency === 'High' ? 'bg-rose-500/20 text-rose-600' :
                      request.urgency === 'Medium' ? 'bg-amber-500/20 text-amber-600' :
                        request.urgency === 'Low' ? 'bg-emerald-500/20 text-emerald-600' :
                          'bg-gray-500/20 text-gray-600'
                      }`}>
                      {request.urgency}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Supporting Documents Section */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <FileText size={20} className="text-amber-500" />
                Supporting Documents ({request.documents.length})
              </h3>
              <div className="space-y-3">
                {request.documents.map((doc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                    className={`flex items-center justify-between p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'
                      }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`p-2 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                        }`}>
                        <FileText size={16} className="text-amber-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{doc.name}</p>
                        <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {doc.size} • {doc.status === 'verified' ? 'Verified' : 'Pending'}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownloadDocument(doc)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold ${isDark
                        ? 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
                        : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                        }`}
                    >
                      <Download size={14} className="inline mr-2" />
                      Download
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recipient Profile Section */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <User size={20} className="text-blue-500" />
                  Recipient Profile Reference
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRecipientDetails(!showRecipientDetails)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${isDark
                    ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                >
                  {showRecipientDetails ? (
                    <>
                      <ChevronUp size={16} />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      Show Details
                    </>
                  )}
                </motion.button>
              </div>

              {showRecipientDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h4 className={`text-sm font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Personal Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Full Name</span>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipientProfile.fullName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Email</span>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipientProfile.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Phone</span>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipientProfile.phone}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Aadhaar Number</span>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipientProfile.aadhaarNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>PAN Number</span>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipientProfile.panNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Date of Birth & Age</span>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {new Date(recipientProfile.dateOfBirth).toLocaleDateString()} ({recipientProfile.age} years)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Address</span>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipientProfile.address}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Occupation</span>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipientProfile.occupation}</span>
                        </div>
                        {recipientProfile.familyDetails && (
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Family Details</span>
                            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipientProfile.familyDetails}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bank Information */}
                    <div className="space-y-4">
                      <h4 className={`text-sm font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Bank Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Bank Name</span>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipientProfile.bankName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Account Number</span>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipientProfile.accountNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>IFSC Code</span>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipientProfile.ifscCode}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Account Holder Name</span>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipientProfile.accountHolderName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Branch Name</span>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipientProfile.branchName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Account Type</span>
                          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipientProfile.accountType}</span>
                        </div>
                        {recipientProfile.upiId && (
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>UPI ID</span>
                            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{recipientProfile.upiId}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Profile Completion</span>
                          <span className={`text-sm font-semibold ${recipientProfile.profileCompletion === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {recipientProfile.profileCompletion}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Profile Status</span>
                          <span className={`text-sm font-semibold text-emerald-600`}>
                            {recipientProfile.profileStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Documents */}
                  <div className="mt-6">
                    <h4 className={`text-sm font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Profile Documents ({recipientProfile.documents.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {recipientProfile.documents.map((doc, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          className={`p-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'
                            }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                <FileText size={14} className="text-amber-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-semibold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{doc.name}</p>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{doc.size}</p>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDownloadDocument(doc)}
                              className={`p-1.5 rounded-lg ${isDark
                                ? 'hover:bg-blue-500/20 text-blue-400'
                                : 'hover:bg-blue-100 text-blue-600'
                                }`}
                              title="Download"
                            >
                              <Download size={14} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Donation History Section */}
                  {request.donationHistory && request.donationHistory.length > 0 && (
                    <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                      <AdminDonationHistory
                        isDark={isDark}
                        donationHistory={request.donationHistory}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

// ==================== REQUEST CARD COMPONENT (WITH ANIMATIONS) ====================
const RequestCard = React.memo(({
  request,
  index,
  isDark,
  onViewDetails,
  onValidate,
  onForward,
  onReview,
  onDelete,
  onEdit,
  currentUser
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const hoverRef = useRef(false);

  const getStatusColor = useCallback((status) => {
    const statusMap = {
      'Draft': { gradient: 'from-slate-500 to-slate-600', icon: FileText, color: '#64748b' },
      'Pending-Validation': { gradient: 'from-amber-500 to-orange-500', icon: Clock, color: '#f59e0b' },
      'Validated': { gradient: 'from-blue-500 to-cyan-500', icon: FileCheck, color: '#3b82f6' },
      'Approved': { gradient: 'from-emerald-500 to-green-500', icon: CheckCircle, color: '#10b981' },
      'Rejected': { gradient: 'from-rose-500 to-red-500', icon: XCircle, color: '#ef4444' },
      'In-Progress': { gradient: 'from-violet-500 to-purple-500', icon: TrendingUp, color: '#8b5cf6' },
      'Closed': { gradient: 'from-gray-500 to-gray-600', icon: CheckCircle2, color: '#6b7280' }
    };
    return statusMap[status] || { gradient: 'from-gray-500 to-gray-600', icon: FileText, color: '#6b7280' };
  }, []);

  const canUserReview = useCallback(() => {
    return request.status === 'Validated' && !request.approvedBy.includes(currentUser?.id);
  }, [request.status, request.approvedBy, currentUser]);

  const handleReview = useCallback(() => {
    onReview(request);
    setShowActions(false);
  }, [request, onReview]);

  const handleMenuAction = (action) => {
    action();
    setShowActions(false);
  };

  const getUrgencyColor = useCallback((urgency) => {
    const urgencyMap = {
      'Critical': 'bg-rose-500/20 text-rose-600 border-rose-500/30',
      'High': 'bg-amber-500/20 text-amber-600 border-amber-500/30',
      'Medium': 'bg-blue-500/20 text-blue-600 border-blue-500/30',
      'Low': 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
    };
    return urgencyMap[urgency] || 'bg-gray-500/20 text-gray-600 border-gray-500/30';
  }, []);

  const getCategoryIcon = useCallback((category) => {
    const icons = {
      'Medical': Heart,
      'Education': Award,
      'Emergency': AlertTriangle,
      'Food': Users,
      'Housing': Home,
      'Business': Briefcase,
      'Utilities': Zap,
      'Transportation': Activity,
      'Other': FileText
    };
    return icons[category] || FileText;
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, []);

  const statusConfig = getStatusColor(request.status);
  const StatusIcon = statusConfig.icon;
  const CategoryIcon = getCategoryIcon(request.category);
  const urgencyColor = getUrgencyColor(request.urgency);
  const primaryColor = statusConfig.color;

  const handleViewDetails = useCallback(() => {
    onViewDetails(request);
    setShowActions(false);
  }, [request, onViewDetails]);

  const handleValidate = useCallback(() => {
    onValidate(request.id);
    setShowActions(false);
  }, [request.id, onValidate]);

  const handleDelete = useCallback(() => {
    onDelete(request.id);
    setShowActions(false);
  }, [request.id, onDelete]);

  const handleEdit = useCallback(() => {
    onEdit(request);
    setShowActions(false);
  }, [request, onEdit]);

  // Check if current user has already approved this request
  const hasUserApproved = useCallback(() => {
    return request.approvedBy.includes(currentUser?.id);
  }, [request.approvedBy, currentUser]);

  // Check if user can approve (only if validated and not already approved)
  const canUserApprove = useCallback(() => {
    return request.status === 'Validated' && !hasUserApproved();
  }, [request.status, hasUserApproved]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showActions && menuRef.current && !menuRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showActions]);

  const handleMouseEnter = () => {
    hoverRef.current = true;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverRef.current = false;
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.5, type: "spring" }}
      whileHover={{ y: -5, scale: 1.02 }}
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
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${statusConfig.gradient}`}
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
        {/* Header Section */}
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
                <CategoryIcon
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
                {request.title}
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
                  className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} bg-gradient-to-r ${statusConfig.gradient} bg-clip-text text-transparent`}
                >
                  {request.id}
                </motion.span>
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  • {request.category}
                </span>
              </div>
            </div>
          </div>

          {/* Action Menu */}
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
                  className={`absolute right-0 top-12 w-56 rounded-2xl overflow-visible z-[9999] ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                  style={{
                    boxShadow: `0 25px 50px rgba(0, 0, 0, 0.4), 0 10px 20px ${primaryColor}20`
                  }}
                >
                  <div className="p-2 space-y-1 relative z-[9999]">
                    <button
                      onClick={handleViewDetails}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-blue-500/20 text-gray-300' : 'hover:bg-blue-100 text-gray-700'}`}
                    >
                      <Eye size={16} />
                      View Details
                    </button>

                    <button
                      onClick={handleEdit}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-amber-500/20 text-gray-300' : 'hover:bg-amber-100 text-gray-700'}`}
                    >
                      <Edit size={16} />
                      Edit Request
                    </button>

                    {request.status === 'Pending-Validation' && (
                      <button
                        onClick={() => {
                          onValidate(request);
                          setShowActions(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-amber-500/20 text-gray-300' : 'hover:bg-amber-100 text-gray-700'}`}
                      >
                        <FileCheck size={16} />
                        Validation
                      </button>
                    )}

                    {canUserReview() && (
                      <button
                        onClick={handleReview}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-violet-500/20 text-gray-300' : 'hover:bg-violet-100 text-gray-700'
                          }`}
                      >
                        <CheckCircle size={16} />
                        Approval
                      </button>
                    )}

                    {request.status === 'Validated' && request.approvedBy.includes(currentUser?.id) && (
                      <div className={`px-4 py-3 rounded-xl text-sm font-medium text-center ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                        ✓ Already Approved
                      </div>
                    )}

                    <button
                      onClick={() => handleMenuAction(() => onForward(request))}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-violet-500/20 text-gray-300' : 'hover:bg-violet-100 text-gray-700'}`}
                    >
                      <Send size={16} />
                      Forward
                    </button>

                    <div className={`my-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />

                    <button
                      onClick={handleDelete}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-rose-500/20 text-rose-400' : 'hover:bg-rose-100 text-rose-700'}`}
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

        {/* Description */}
        <div className="mb-6">
          <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} line-clamp-2`}>
            {request.description}
          </p>
        </div>

        {/* Status & Urgency */}
        <div className="flex items-center gap-3 flex-wrap mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            animate={{
              y: isHovered ? [0, -2, 0] : 0,
            }}
            transition={{
              duration: isHovered ? 1 : 0.1,
              repeat: isHovered ? Infinity : 0
            }}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gradient-to-r ${statusConfig.gradient} text-white shadow-lg`}
            style={{
              boxShadow: isHovered ? '0 8px 25px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            <StatusIcon size={14} />
            {request.status}
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
            className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium ${urgencyColor}`}
          >
            <AlertTriangle size={12} className="flex-shrink-0" />
            <span className="truncate max-w-[80px] xs:max-w-[100px] sm:max-w-none">
              {request.urgency}
            </span>
          </motion.div>
        </div>

        {/* Financial Info */}
        <div className="flex items-center justify-between gap-6 mb-6">
          <div className="flex-1 space-y-3 min-w-0">
            <div className="flex justify-between items-center">
              <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Required
              </span>
              <span
                className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} truncate ml-2`}
                title={'₹ ' + getFullFormattedNumber(request.requiredAmount, false)}  // Add this
              >
                {formatValue(request.requiredAmount, true)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Donated
              </span>
              <span
                className="text-lg font-bold text-emerald-500 truncate ml-2"
                title={'₹ ' + getFullFormattedNumber(request.donatedAmount, false)}  // Add this
              >
                {formatValue(request.donatedAmount, true)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Remaining
              </span>
              <span
                className="text-lg font-bold text-rose-500 truncate ml-2"
                title={'₹ ' + getFullFormattedNumber(request.remainingAmount, false)}  // Add this
              >
                {formatValue(request.remainingAmount, true)}
              </span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <ProgressCircle percentage={request.completionRate} size={80} isDark={isDark} />
          </div>
        </div>

        {/* Additional Info */}
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
              Approvers
            </p>
            <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {request.approvedBy.length}/{request.approvers.length}
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
              Created
            </p>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {formatDate(request.createdAt)}
            </p>
          </motion.div>
        </div>

        {/* ========== ADMIN & DOCUMENTS INFO ========== */}
        <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
          <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
            }`}>
            <UserCheck size={12} className="flex-shrink-0" />
            <span className="truncate max-w-[80px] xs:max-w-[100px] sm:max-w-none">
              {availableAdmins.find(a => a.id === request.assignee)?.name || 'Unknown'}
            </span>
          </div>
          <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium ${isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'
            }`}>
            <FileText size={12} className="flex-shrink-0" />
            {request.documents.length} Docs
          </div>
        </div>

        {/* Footer - Only Deadline */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/20">
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={14} className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              Deadline: {formatDate(request.deadline)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const availableAdmins = [
  { id: 'admin1', name: 'Super Admin', role: 'super_admin' },
  { id: 'admin2', name: 'Approver 1', role: 'approver' },
  { id: 'admin3', name: 'Co-Approver 1', role: 'co_approver' },
  { id: 'admin4', name: 'Support Admin', role: 'support' }
];

// ==================== VALIDATION MODAL COMPONENT ====================
const ValidationModal = ({ isDark, request, onClose, onValidate, urgencyOptions }) => {
  const [formData, setFormData] = useState({
    urgency: request.urgency || '',
    validationType: '',
    reason: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Check if urgency is already set in the request
  const hasUrgencySet = request.urgency && request.urgency !== '';
  // Show urgency field only if it's not already set AND validation type is not 'reject'
  const showUrgencyField = !hasUrgencySet && formData.validationType !== 'reject';

  const validateForm = () => {
    const errors = {};
    const shake = [];

    // Only validate urgency if it's shown (meaning we're validating and urgency is not set)
    if (showUrgencyField && !formData.urgency) {
      errors.urgency = 'Please select urgency level';
      shake.push('urgency');
    }

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
    const validationData = {
      ...formData,
      // Use existing urgency if not shown in form, or empty string for rejections
      urgency: formData.validationType === 'reject' 
        ? '' // Don't set urgency for rejections
        : (showUrgencyField ? formData.urgency : request.urgency)
    };
    onValidate(request.id, validationData);
    setShowConfirmDialog(false);
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear validation type-specific errors
    if (field === 'validationType') {
      // When switching to reject, clear urgency error if any
      if (value === 'reject') {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.urgency;
          return newErrors;
        });
      }
    }

    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <>
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
                  Validate Request
                </h2>
                <p className="text-amber-100 text-xs sm:text-sm font-medium">
                  {formData.validationType === 'reject' 
                    ? 'Reject request (urgency not required)' 
                    : (showUrgencyField ? 'Set urgency and validate/reject' : 'Validate or reject request')}
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
              {/* Request Details */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Request Details
                </label>
                <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <p className={`text-sm sm:text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {request.title}
                  </p>
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {request.id} • {request.category}
                  </p>
                  {!showUrgencyField && request.urgency && formData.validationType !== 'reject' && (
                    <div className="mt-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${request.urgency === 'High' ? 'bg-rose-500/20 text-rose-600' :
                        request.urgency === 'Medium' ? 'bg-amber-500/20 text-amber-600' :
                          request.urgency === 'Low' ? 'bg-emerald-500/20 text-emerald-600' :
                            'bg-gray-500/20 text-gray-600'
                        }`}>
                        <AlertTriangle size={10} />
                        Current Urgency: {request.urgency}
                      </span>
                    </div>
                  )}
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

              {/* Urgency Field - Only shown if validating AND urgency not already set */}
              {showUrgencyField && (
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Set Urgency Level <span className="text-rose-500 font-normal normal-case">*</span>
                  </label>
                  <div className="overflow-visible">
                    <motion.div
                      animate={shakeFields.includes('urgency') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible relative"
                    >
                      <select
                        value={formData.urgency}
                        onChange={(e) => handleFieldChange('urgency', e.target.value)}
                        className={`w-full p-3 sm:p-4 rounded-2xl text-sm font-medium transition-all appearance-none ${isDark
                          ? 'bg-gray-700 border-gray-600'
                          : 'bg-white border-gray-200'
                          } border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none ${formData.urgency === ""
                            ? (isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]')
                            : (isDark ? 'text-white' : 'text-gray-900')
                          } ${fieldErrors.urgency ? 'border-rose-500' : ''}`}
                        style={{
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="">
                          &nbsp;Select Urgency
                        </option>
                        {urgencyOptions.map(option => (
                          <option
                            key={option}
                            value={option}
                            className={isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'}
                          >
                            &nbsp;{option}
                          </option>
                        ))}
                      </select>
                      <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <ChevronDown size={16} />
                      </div>
                    </motion.div>
                  </div>
                  {fieldErrors.urgency && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-rose-600 text-xs font-medium mt-1"
                    >
                      <AlertCircle size={12} />
                      {fieldErrors.urgency}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Reason Field */}
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
            message={
              <div className="space-y-3">
                <p className={`text-base font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Are you sure you want to {formData.validationType === 'validate' ? 'validate' : 'reject'} this request?
                </p>
              </div>
            }
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

// ==================== APPROVE/REJECT MODAL COMPONENT ====================
const ReviewModal = ({ isDark, request, onClose, onApprove, onReject }) => {
  const [action, setAction] = useState('');
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);

  const validateForm = () => {
    const errors = {};
    const shake = [];

    if (!action) {
      errors.action = 'Please select an action';
      shake.push('action');
    }

    if (action === 'reject' && !reason.trim()) {
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
    if (!validateForm()) {
      return;
    }

    if (action === 'approve') {
      onApprove(request.id, comment.trim());
    } else if (action === 'reject') {
      onReject(request.id, reason.trim());
    }
  };

  const handleFieldChange = (field, value) => {
    if (field === 'action') setAction(value);
    if (field === 'reason') setReason(value);
    if (field === 'comment') setComment(value);

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
        <div className={`relative p-4 sm:p-6 ${action === 'approve'
          ? 'bg-gradient-to-r from-emerald-600 to-green-600'
          : action === 'reject'
            ? 'bg-gradient-to-r from-rose-600 to-red-600'
            : 'bg-gradient-to-r from-violet-600 to-fuchsia-600'
          } rounded-t-3xl`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                {action === 'approve' ? 'Approve Request' :
                  action === 'reject' ? 'Reject Request' :
                    'Review Request'}
              </h2>
              <p className="text-white/80 text-xs sm:text-sm font-medium">
                {action === 'approve' ? 'Approve this request' :
                  action === 'reject' ? 'Reject this request' :
                    'Select an action for this request'}
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
                Request Details
              </label>
              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                }`}>
                <p className={`text-sm sm:text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {request.title}
                </p>
                <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {request.id} • {request.category} • {formatValue(request.requiredAmount, true)}
                </p>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                Select Action <span className="text-rose-500 font-normal normal-case">*</span>
              </label>
              <div className="overflow-visible">
                <motion.div
                  animate={shakeFields.includes('action') ? "shake" : "initial"}
                  variants={shakeAnimation}
                  className="overflow-visible"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFieldChange('action', 'approve')}
                      className={`p-4 rounded-2xl border-2 text-center transition-all ${action === 'approve'
                        ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-500 text-emerald-700'
                        : isDark
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-emerald-500'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-emerald-500'
                        }`}
                    >
                      <CheckCircle size={24} className="mx-auto mb-2" />
                      <span className="text-sm font-semibold">Approve</span>
                      <p className="text-xs mt-1 opacity-80">Approve request</p>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFieldChange('action', 'reject')}
                      className={`p-4 rounded-2xl border-2 text-center transition-all ${action === 'reject'
                        ? 'bg-gradient-to-r from-rose-50 to-red-50 border-rose-500 text-rose-700'
                        : isDark
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-rose-500'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-rose-500'
                        }`}
                    >
                      <XCircle size={24} className="mx-auto mb-2" />
                      <span className="text-sm font-semibold">Reject</span>
                      <p className="text-xs mt-1 opacity-80">Reject request</p>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
              {fieldErrors.action && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-rose-600 text-xs font-medium mt-1"
                >
                  <AlertCircle size={12} />
                  {fieldErrors.action}
                </motion.div>
              )}
            </div>

            {action === 'reject' && (
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Reason for Rejection <span className="text-rose-500 font-normal normal-case">*</span>
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
                      placeholder="Explain why you're rejecting this request..."
                      className={`w-full p-3 sm:p-4 rounded-2xl border-2 focus:ring-4 focus:ring-rose-500/30 focus:border-rose-500 focus:outline-none resize-none transition-all text-sm font-medium ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                        } ${fieldErrors.reason ? 'border-rose-500' : ''}`}
                    />
                  </motion.div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Quick reasons:
                  </span>
                  {['Insufficient Documentation', 'Does Not Meet Criteria', 'Budget Constraints', 'Duplicate Request', 'Information Incomplete', 'Not Urgent Enough'].map((quickReason) => (
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
            )}

            {action === 'approve' && (
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Approval Comments (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => handleFieldChange('comment', e.target.value)}
                  rows="3"
                  placeholder="Add any comments about the approval..."
                  className={`w-full p-3 sm:p-4 rounded-2xl border-2 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 focus:outline-none resize-none transition-all text-sm font-medium ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                />
              </div>
            )}

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
                className={`flex-1 min-w-[100px] px-3 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xl ${action === 'approve'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                  : action === 'reject'
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white cursor-not-allowed'
                  }`}
                disabled={!action}
              >
                {action === 'approve' ? (
                  <>
                    <CheckCircle size={16} />
                    Approve Request
                  </>
                ) : action === 'reject' ? (
                  <>
                    <XCircle size={16} />
                    Reject Request
                  </>
                ) : (
                  'Select Action'
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ==================== REQUESTS MANAGEMENT COMPONENT ====================
const RequestsManagement = ({ isDark, currentUser }) => {
  const [requests, setRequests] = useState(mockAdminRequests);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [requestToForward, setRequestToForward] = useState(null);
  const [showForwardConfirmDialog, setShowForwardConfirmDialog] = useState(false);
  const [forwardData, setForwardData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingRequest, setEditingRequest] = useState(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [requestToValidate, setRequestToValidate] = useState(null);
  const [validationForm, setValidationForm] = useState({
    urgency: '',
    validationType: '',
    reason: ''
  });
  const [validationFieldErrors, setValidationFieldErrors] = useState({});
  const [validationShakeFields, setValidationShakeFields] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [requestToReview, setRequestToReview] = useState(null);
  const [approveRejectForm, setApproveRejectForm] = useState({
    action: '',
    reason: ''
  });
  const [approveRejectFieldErrors, setApproveRejectFieldErrors] = useState({});
  const [approveRejectShakeFields, setApproveRejectShakeFields] = useState([]);
  const scrollPosition = useRef(0);
  const [confirmationDialog, setConfirmationDialog] = useState({
    show: false,
    title: '',
    message: '',
    type: null,
    data: null,
    onConfirm: null
  });

  // Form state for creating/editing requests as admin
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    requiredAmount: '',
    deadline: '',
    aadhaarNumber: '',
    urgency: '',
    documents: []
  });

  // Form validation state
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);

  // ==================== REFS ====================
  const isMounted = useRef(true);
  const statsCache = useRef(null);

  useEffect(() => {
    const isAnyModalOpen =
      showDetailModal ||
      showSuccessDialog ||
      showCreateModal ||
      showEditModal ||
      showForwardModal ||
      showValidationModal ||
      showForwardConfirmDialog ||
      confirmationDialog.show;

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
  }, [
    showDetailModal,
    showSuccessDialog,
    showCreateModal,
    showEditModal,
    showForwardModal,
    showValidationModal,
    showForwardConfirmDialog,
    confirmationDialog.show
  ]);

  // ==================== CONSTANTS ====================
  const statusOptions = useMemo(() => [
    'All Status',
    'Draft',
    'Pending-Validation',
    'Validated',
    'Approved',
    'Rejected',
    'Closed',
    'In-Progress'
  ], []);

  const categoryOptions = useMemo(() => [
    'All Categories',
    'Medical',
    'Education',
    'Emergency',
    'Food',
    'Housing',
    'Business',
    'Utilities',
    'Transportation',
    'Other'
  ], []);

  const urgencyOptions = useMemo(() => ['Critical', 'High', 'Medium', 'Low'], []);

  const handleForwardRequest = useCallback((requestId, targetAdminId, reason) => {
    const currentAdmin = currentUser?.id || 'admin1';

    setRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        const forwardRecord = {
          fromAdmin: currentAdmin,
          toAdmin: targetAdminId,
          reason: reason,
          timestamp: new Date().toISOString()
        };

        return {
          ...request,
          assignee: targetAdminId,
          forwardingHistory: [...(request.forwardingHistory || []), forwardRecord]
        };
      }
      return request;
    }));
    setShowSuccessDialog(true);
    setSuccessMessage(`Request successfully forwarded to ${mockAdminUsers.find(a => a.id === targetAdminId)?.name}`);
  }, [currentUser]);

  const handleOpenForwardModal = useCallback((request) => {
    setRequestToForward(request);
    setShowForwardModal(true);
  }, []);

  const handleForwardConfirm = useCallback((requestId, targetAdminId, reason) => {
    setForwardData({ requestId, targetAdminId, reason });
    setShowForwardConfirmDialog(true);
  }, []);

  const confirmForward = useCallback(() => {
    if (forwardData) {
      handleForwardRequest(forwardData.requestId, forwardData.targetAdminId, forwardData.reason);
      setShowForwardConfirmDialog(false);
      setForwardData(null);
      setShowForwardModal(false);
    }
  }, [forwardData, handleForwardRequest]);

  // ==================== EFFECTS ====================
  useEffect(() => {
    isMounted.current = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedCategory, dateRange, activeTab]);

  // ==================== MEMOIZED COMPUTATIONS ====================
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch =
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.requestor?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'All Status' || request.status === selectedStatus;
      const matchesCategory = selectedCategory === 'All Categories' || request.category === selectedCategory;

      const requestCreatedDate = request.createdAt.split('T')[0];
      const matchesStartDate = !dateRange.start || requestCreatedDate >= dateRange.start;
      const matchesEndDate = !dateRange.end || requestCreatedDate <= dateRange.end;

      // Active tab filtering
      let matchesTab = true;
      switch (activeTab) {
        case 'pending':
          matchesTab = request.status === 'Pending-Validation' || request.status === 'Validated';
          break;
        case 'assigned':
          matchesTab = request.assignee === currentUser?.id ||
            request.approvers.includes(currentUser?.id) ||
            request.coApprovers.includes(currentUser?.id);
          break;
        case 'approved':
          matchesTab = request.status === 'Approved';
          break;
        case 'rejected':
          matchesTab = request.status === 'Rejected';
          break;
        case 'in-progress':
          matchesTab = request.status === 'In-Progress';
          break;
        default:
          matchesTab = true;
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesStartDate && matchesEndDate && matchesTab;
    });
  }, [requests, searchTerm, selectedStatus, selectedCategory, dateRange, activeTab, currentUser]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredRequests.length / itemsPerPage);
  }, [filteredRequests.length, itemsPerPage]);

  const stats = useMemo(() => {
    if (statsCache.current && JSON.stringify(statsCache.current.source) === JSON.stringify(requests)) {
      return statsCache.current.data;
    }

    const totalRequests = requests.length;
    const pendingRequests = requests.filter(r => r.status === 'Pending-Validation' || r.status === 'Validated').length;
    const approvedRequests = requests.filter(r => r.status === 'Approved').length;
    const rejectedRequests = requests.filter(r => r.status === 'Rejected').length;
    const inProgressRequests = requests.filter(r => r.status === 'In-Progress').length;
    const totalAmountRequired = requests.reduce((sum, r) => sum + r.requiredAmount, 0);
    const totalAmountDonated = requests.reduce((sum, r) => sum + r.donatedAmount, 0);
    const assignedToMe = requests.filter(r =>
      r.assignee === currentUser?.id ||
      r.approvers.includes(currentUser?.id) ||
      r.coApprovers.includes(currentUser?.id)
    ).length;

    const computedStats = {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      inProgressRequests,
      totalAmountRequired,
      totalAmountDonated,
      assignedToMe
    };

    statsCache.current = {
      source: [...requests],
      data: computedStats
    };

    return computedStats;
  }, [requests, currentUser]);

  // ==================== HELPER FUNCTIONS ====================
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, []);

  const openCreateModal = useCallback(() => {
    setShowCreateModal(true);
    setFormData({
      title: '',
      description: '',
      category: '',
      requiredAmount: '0',
      deadline: "",
      aadhaarNumber: '',
      urgency: '',
      documents: []
    });
    setFieldErrors({});
    setShakeFields([]);
  }, []);

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
    setEditingRequest(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      requiredAmount: '',
      deadline: '',
      aadhaarNumber: '',
      urgency: '',
      documents: []
    });
    setFieldErrors({});
    setShakeFields([]);
  }, []);

  const openDetailModal = useCallback((request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedRequest(null);
  }, []);

  const handleOpenValidationModal = useCallback((request) => {
    setRequestToValidate(request);
    setValidationForm({
      urgency: request.urgency || '',
      validationType: '',
      reason: ''
    });
    setValidationFieldErrors({});
    setValidationShakeFields([]);
    setShowValidationModal(true);
  }, []);

  const handleValidationSubmit = useCallback((requestId, validationData) => {
    const { urgency, validationType, reason } = validationData;

    setRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        const updatedRequest = {
          ...request,
          urgency: urgency,
          validationNotes: [
            ...(request.validationNotes || []),
            {
              id: Date.now(),
              text: reason,
              timestamp: new Date().toISOString().split('T')[0],
              admin: currentUser?.id || 'admin1',
              type: validationType === 'validate' ? 'validation' : 'rejection'
            }
          ]
        };

        if (validationType === 'validate') {
          updatedRequest.status = 'Validated';
          updatedRequest.verificationStatus = 'Completed';
        } else if (validationType === 'reject') {
          updatedRequest.status = 'Rejected';
          updatedRequest.verificationStatus = 'Completed';
          updatedRequest.rejectionReason = reason;
        }

        return updatedRequest;
      }
      return request;
    }));

    setShowValidationModal(false);
    setRequestToValidate(null);
    setShowSuccessDialog(true);
    setSuccessMessage(`Request ${validationType === 'validate' ? 'validated' : 'rejected'} successfully!`);
  }, [currentUser]);

  const openEditModal = useCallback((request) => {
    setShowEditModal(true);
    setEditingRequest(request);
    setFormData({
      title: request.title,
      description: request.description,
      category: request.category,
      requiredAmount: request.requiredAmount,
      deadline: request.deadline,
      aadhaarNumber: request.requestor?.aadhaarNumber || '',
      urgency: request.urgency,
      documents: request.documents
    });
    setFieldErrors({});
    setShakeFields([]);
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setEditingRequest(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      requiredAmount: '',
      deadline: '',
      aadhaarNumber: '',
      urgency: '',
      documents: []
    });
    setFieldErrors({});
    setShakeFields([]);
  }, []);

  const handleReviewRequest = useCallback((request) => {
    // Check if user can review (only if validated and not already approved)
    const canUserReview = request.status === 'Validated' && !request.approvedBy.includes(currentUser?.id);

    if (!canUserReview) {
      if (request.status !== 'Validated') {
        setSuccessMessage('Request must be validated before review');
      } else if (request.approvedBy.includes(currentUser?.id)) {
        setSuccessMessage('You have already approved this request');
      }
      setShowSuccessDialog(true);
      return;
    }

    setRequestToReview(request);
    setShowReviewModal(true);
  }, [currentUser]);

  // Update the handleApproveConfirm and handleRejectConfirm functions:
  const handleApproveConfirm = useCallback((requestId, comment = '') => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedApprovers = [...req.approvedBy, currentUser?.id || 'admin1'];
        const isFullyApproved = updatedApprovers.length >= req.approvers.length;

        const updatedRequest = {
          ...req,
          approvedBy: updatedApprovers,
          status: isFullyApproved ? 'Approved' : 'Validated',
          progress: isFullyApproved ? 100 : req.progress
        };

        // Add approval note if comment is provided
        if (comment.trim()) {
          updatedRequest.validationNotes = [
            ...(req.validationNotes || []),
            {
              id: Date.now(),
              text: comment,
              timestamp: new Date().toISOString().split('T')[0],
              admin: currentUser?.id || 'admin1',
              type: 'approval'
            }
          ];
        }

        setSuccessMessage(isFullyApproved
          ? 'Request fully approved and is now active!'
          : 'Request approved successfully!');
        setShowSuccessDialog(true);

        return updatedRequest;
      }
      return req;
    }));

    setShowReviewModal(false);
    setRequestToReview(null);
  }, [currentUser]);

  const handleRejectConfirm = useCallback((requestId, reason = '') => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedRequest = {
          ...req,
          status: 'Rejected',
          rejectionReason: reason
        };

        // Add rejection note if reason is provided
        if (reason.trim()) {
          updatedRequest.validationNotes = [
            ...(req.validationNotes || []),
            {
              id: Date.now(),
              text: reason,
              timestamp: new Date().toISOString().split('T')[0],
              admin: currentUser?.id || 'admin1',
              type: 'rejection'
            }
          ];
        }

        setSuccessMessage('Request rejected successfully!');
        setShowSuccessDialog(true);

        return updatedRequest;
      }
      return req;
    }));

    setShowReviewModal(false);
    setRequestToReview(null);
  }, [currentUser]);

  const handleDeleteRequest = useCallback((requestId) => {
    setConfirmationDialog({
      show: true,
      title: 'Delete Request',
      message: 'Are you sure you want to delete this request? This action cannot be undone.',
      type: 'delete',
      data: { id: requestId },
      onConfirm: () => {
        setRequests(prev => prev.filter(req => req.id !== requestId));
        setShowSuccessDialog(true);
        setSuccessMessage('Request deleted successfully!');
      }
    });
  }, []);

  const handleEditRequest = useCallback((request) => {
    openEditModal(request);
  }, [openEditModal]);

  const handleUpdateRequest = useCallback(() => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    setRequests(prev => prev.map(req => {
      if (req.id === editingRequest.id) {
        return {
          ...req,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          requiredAmount: parseFloat(formData.requiredAmount),
          remainingAmount: parseFloat(formData.requiredAmount) - req.donatedAmount,
          deadline: formData.deadline,
          urgency: formData.urgency,
          documents: formData.documents,
          requestor: {
            ...req.requestor,
            aadhaarNumber: formData.aadhaarNumber || null
          }
        };
      }
      return req;
    }));

    setShowSuccessDialog(true);
    setSuccessMessage('Request updated successfully!');
    setShowEditModal(false);
    setFormData({
      title: '',
      description: '',
      category: '',
      requiredAmount: '',
      deadline: '',
      aadhaarNumber: '',
      urgency: '',
      documents: []
    });
    setFieldErrors({});
    setShakeFields([]);
  }, [formData, editingRequest]);

  const handleCreateRequest = useCallback(() => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    const newRequest = {
      id: `REQ-${new Date().getFullYear()}-${String(requests.length + 1).padStart(3, '0')}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      requiredAmount: parseFloat(formData.requiredAmount),
      donatedAmount: 0,
      remainingAmount: parseFloat(formData.requiredAmount),
      currency: 'INR',
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deadline: formData.deadline,
      donorsCount: 0,
      documents: formData.documents.map((doc, index) => ({
        id: index + 1,
        name: doc.name || `document_${index + 1}.pdf`,
        size: doc.size || '1.0 MB',
        type: 'application/pdf',
        status: 'pending'
      })),
      approvers: ['admin1', 'admin2'],
      coApprovers: [],
      approvedBy: [],
      progress: 0,
      visibility: 'public',
      featured: false,
      tags: [formData.category.toLowerCase()],
      verificationStatus: 'Not Started',
      assignee: currentUser?.id || 'admin1',
      completionRate: 0,
      requestor: {
        id: `USER-${Date.now()}`,
        name: 'Admin Created Request',
        type: 'recipient',
        phone: '+91-98765-00000',
        email: 'admin@donation.org',
        profileCompletion: 100,
        aadhaarNumber: formData.aadhaarNumber || null
      },
      validationNotes: [],
      urgency: formData.urgency,
      location: 'Mumbai',
      createdBy: 'admin',
      supportStaffId: null,
      whatsappNumber: '+91-98765-00000'
    };

    setRequests(prev => [newRequest, ...prev]);
    setShowSuccessDialog(true);
    setSuccessMessage('Request created successfully!');
    setShowCreateModal(false);
    setFormData({
      title: '',
      description: '',
      category: '',
      requiredAmount: '',
      deadline: '',
      aadhaarNumber: '',
      urgency: '',
      documents: []
    });
    setFieldErrors({});
    setShakeFields([]);
  }, [formData, requests.length, currentUser]);

  // ==================== FORM HANDLERS ====================
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [fieldErrors]);

  const handleDocumentsChange = useCallback((documents) => {
    setFormData(prev => ({
      ...prev,
      documents
    }));

    if (fieldErrors.documents && documents.length > 0) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.documents;
        return newErrors;
      });
    }
  }, [fieldErrors]);

  // ==================== FORM VALIDATION ====================
  const validateForm = useCallback(() => {
    const errors = {};
    const invalidFields = [];

    setShakeFields([]);

    // Title validation
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      invalidFields.push('title');
    } else if (!/^[A-Za-z\s.,!?()-]+$/.test(formData.title.trim())) {
      errors.title = 'Title can only contain letters, spaces, and basic punctuation (.,!?-)';
      invalidFields.push('title');
    } else if (formData.title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters long';
      invalidFields.push('title');
    } else if (formData.title.trim().length > 100) {
      errors.title = 'Title cannot exceed 30 characters';
      invalidFields.push('title');
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
      invalidFields.push('description');
    } else if (!/^[A-Za-z0-9\s.,!?()-]+$/.test(formData.description.trim())) {
      errors.description = 'Description must contain only valid characters';
      invalidFields.push('description');
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters long';
      invalidFields.push('description');
    } else if (formData.description.trim().length > 1000) {
      errors.description = 'Description cannot exceed 1000 characters';
      invalidFields.push('description');
    }

    // Category validation
    if (!formData.category) {
      errors.category = 'Please select a category';
      invalidFields.push('category');
    }

    // Required Amount validation
    if (!formData.requiredAmount) {
      errors.requiredAmount = 'Required amount is required';
      invalidFields.push('requiredAmount');
    } else {
      const reqAmount = Number(formData.requiredAmount);
      if (isNaN(reqAmount) || reqAmount <= 0) {
        errors.requiredAmount = 'Required amount must be greater than 0';
        invalidFields.push('requiredAmount');
      } else if (!Number.isInteger(reqAmount)) {
        errors.requiredAmount = 'Amount must be a whole number without decimals';
        invalidFields.push('requiredAmount');
      } else if (reqAmount > 10000000) {
        errors.requiredAmount = 'Amount cannot exceed 10,000,000';
        invalidFields.push('requiredAmount');
      }
    }

    // Deadline validation
    if (!formData.deadline) {
      errors.deadline = 'Deadline is required';
      invalidFields.push('deadline');
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.deadline);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.deadline = 'Deadline must be today or a future date';
        invalidFields.push('deadline');
      }
    }

    // Aadhaar validation (MANDATORY)
    if (!formData.aadhaarNumber || !formData.aadhaarNumber.trim()) {
      errors.aadhaarNumber = 'Aadhaar number is required';
      invalidFields.push('aadhaarNumber');
    } else {
      const aadhaarRegex = /^\d{4}-\d{4}-\d{4}$/;
      if (!aadhaarRegex.test(formData.aadhaarNumber)) {
        errors.aadhaarNumber = 'Aadhaar number must be in format: 1234-5678-9012';
        invalidFields.push('aadhaarNumber');
      }
    }

    // Urgency validation
    if (!formData.urgency) {
      errors.urgency = 'Please select urgency level';
      invalidFields.push('urgency');
    }

    // Documents validation
    if (formData.documents.length === 0) {
      errors.documents = 'Please upload at least one document';
      invalidFields.push('documents');
    }

    setFieldErrors(errors);

    if (invalidFields.length > 0) {
      setShakeFields([...invalidFields]);

      // Scroll to the first invalid field
      setTimeout(() => {
        const firstInvalidField = invalidFields[0];
        if (firstInvalidField) {
          // Try to find the input field by name
          const fieldElement = document.querySelector(`[name="${firstInvalidField}"]`);
          if (fieldElement) {
            const modalContent = fieldElement.closest('.overflow-y-auto');
            if (modalContent) {
              // Scroll within the modal
              const fieldRect = fieldElement.getBoundingClientRect();
              const modalRect = modalContent.getBoundingClientRect();

              if (fieldRect.top < modalRect.top || fieldRect.bottom > modalRect.bottom) {
                fieldElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center'
                });
              }
            } else {
              // Fallback to regular scroll
              fieldElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
            }
          }
        }

        // Clear shake animation after it plays
        setTimeout(() => {
          setShakeFields([]);
        }, 600);
      }, 100);

      return false;
    }

    return true;
  }, [formData]);

  const handleFormSubmit = useCallback(() => {
    if (!validateForm()) {
      return;
    }

    setConfirmationDialog({
      show: true,
      title: 'Create New Request',
      message: `Are you sure you want to create the request "${formData.title}"?`,
      type: 'create',
      data: null,
      onConfirm: handleCreateRequest
    });
  }, [formData, validateForm, handleCreateRequest]);

  const handleEditFormSubmit = useCallback(() => {
    // Check if any fields have actually changed
    const hasChanges =
      formData.title !== editingRequest.title ||
      formData.description !== editingRequest.description ||
      formData.category !== editingRequest.category ||
      parseFloat(formData.requiredAmount) !== editingRequest.requiredAmount ||
      formData.deadline !== editingRequest.deadline ||
      formData.aadhaarNumber !== (editingRequest.requestor?.aadhaarNumber || '') ||
      formData.urgency !== editingRequest.urgency ||
      JSON.stringify(formData.documents) !== JSON.stringify(editingRequest.documents);

    // If no changes, just close the modal without showing confirmation
    if (!hasChanges) {
      closeEditModal();
      return;
    }

    // Validate form only if there are changes
    if (!validateForm()) {
      return;
    }

    setConfirmationDialog({
      show: true,
      title: 'Update Request',
      message: `Are you sure you want to update the request "${formData.title}"?`,
      type: 'update',
      data: null,
      onConfirm: handleUpdateRequest
    });
  }, [formData, editingRequest, validateForm, handleUpdateRequest, closeEditModal]);

  // ==================== EXPORT FUNCTIONS ====================
  const handleExportExcel = useCallback(() => {
    const data = filteredRequests.map(request => ({
      ID: request.id,
      Title: request.title,
      Description: request.description,
      'Required Amount': `${formatValue(request.requiredAmount, true)}`,
      'Donated Amount': `${formatValue(request.donatedAmount, true)}`,
      'Remaining Amount': `${formatValue(request.remainingAmount, true)}`,
      Status: request.status,
      Category: request.category,
      Urgency: request.urgency,
      Location: request.location,
      'Created At': new Date(request.createdAt).toLocaleDateString('en-IN'),
      Deadline: new Date(request.deadline).toLocaleDateString('en-IN'),
      'Requestor Name': request.requestor?.name || 'Unknown',
      'Requestor Email': request.requestor?.email || 'Unknown',
      'Requestor Phone': request.requestor?.phone || 'Unknown',
      'Aadhaar Number': request.requestor?.aadhaarNumber || 'Not provided',
      'Approvers Count': `${request.approvedBy.length}/${request.approvers.length}`,
      'Completion Rate': `${request.completionRate}%`
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
    link.setAttribute('download', `requests_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowSuccessDialog(true);
    setSuccessMessage('Requests exported to Excel successfully!');
  }, [filteredRequests]);

  const handleExportPDF = useCallback(() => {
    const printContent = `
            <html>
                <head>
                    <title>Requests Management Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #333; text-align: center; margin-bottom: 30px; }
                        .summary { 
                            margin-bottom: 30px; 
                            padding: 20px; 
                            background: #f5f5f5; 
                            border-radius: 8px;
                            border-left: 4px solid #8b5cf6;
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 20px;
                            font-size: 12px;
                        }
                        th, td { 
                            border: 1px solid #ddd; 
                            padding: 10px; 
                            text-align: left; 
                        }
                        th { 
                            background-color: #8b5cf6; 
                            color: white; 
                            font-weight: bold;
                        }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                        .status-approved { color: #10b981; font-weight: bold; }
                        .status-pending { color: #f59e0b; font-weight: bold; }
                        .status-rejected { color: #ef4444; font-weight: bold; }
                        .footer { 
                            margin-top: 30px; 
                            text-align: center; 
                            color: #666; 
                            font-size: 12px;
                            border-top: 1px solid #ddd;
                            padding-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <h1>Requests Management Report</h1>
                    
                    <div class="summary">
                        <strong>Generated on:</strong> ${new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}<br>
                        <strong>Total Requests:</strong> ${filteredRequests.length}<br>
                        <strong>Pending Validation:</strong> ${stats.pendingRequests}<br>
                        <strong>Approved Requests:</strong> ${stats.approvedRequests}<br>
                        <strong>Total Required Amount:</strong> ${formatValue(stats.totalAmountRequired, true)}<br>
                        <strong>Total Donated Amount:</strong> ${formatValue(stats.totalAmountDonated, true)}
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Required Amount</th>
                                <th>Status</th>
                                <th>Urgency</th>
                                <th>Requestor</th>
                                <th>Created Date</th>
                                <th>Deadline</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredRequests.map(request => `
                                <tr>
                                    <td>${request.id}</td>
                                    <td>${request.title}</td>
                                    <td>${request.category}</td>
                                    <td>${formatValue(request.requiredAmount, true)}</td>
                                    <td class="status-${request.status.toLowerCase().replace('-', '')}">
                                        ${request.status}
                                    </td>
                                    <td>${request.urgency}</td>
                                    <td>${request.requestor?.name || 'Unknown'}</td>
                                    <td>${new Date(request.createdAt).toLocaleDateString('en-IN')}</td>
                                    <td>${new Date(request.deadline).toLocaleDateString('en-IN')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="footer">
                        <p>Generated by Admin Dashboard • ${filteredRequests.length} requests found</p>
                        <p>This is an auto-generated report. For detailed information, please check the admin dashboard.</p>
                    </div>
                </body>
            </html>
        `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);

    setShowSuccessDialog(true);
    setSuccessMessage('Requests exported to PDF successfully!');
  }, [filteredRequests, stats]);

  // ==================== MAIN RENDER ====================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Loading requests dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4">
      {/* Header with Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Create Request Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreateModal}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-xl w-full sm:w-auto"
          >
            <Plus size={16} />
            <span className="truncate">Create Request</span>
          </motion.button>

          {/* Export Buttons Group */}
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Excel Export Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportExcel}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-xl flex-1 sm:flex-none"
            >
              <Download size={16} />
              <span className="truncate">Excel</span>
            </motion.button>

            {/* PDF Export Button */}
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
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <EnhancedStatCard
          icon={FileText}
          title="Total Requests"
          value={stats.totalRequests}
          fullNumber={getFullFormattedNumber(stats.totalRequests, true)}
          change={12.5}
          changeType="increase"
          color="from-blue-500 to-blue-600"
          delay={0.1}
          isDark={isDark}
          iconColor="text-blue-500"
          isCurrency={false}
        />
        <EnhancedStatCard
          icon={Clock}
          title="Pending Validation"
          value={stats.pendingRequests}
          fullNumber={getFullFormattedNumber(stats.pendingRequests, true)}
          change={8.3}
          changeType="increase"
          color="from-amber-500 to-orange-600"
          delay={0.2}
          isDark={isDark}
          iconColor="text-amber-500"
          isCurrency={false}
        />
        <EnhancedStatCard
          icon={IndianRupee}
          title="Total Donations"
          value={stats.totalAmountDonated}
          fullNumber={'₹ ' + getFullFormattedNumber(stats.totalAmountDonated, true)}
          change={15.2}
          changeType="increase"
          color="from-emerald-500 to-green-600"
          delay={0.3}
          isDark={isDark}
          iconColor="text-emerald-500"
          isCurrency={true}
        />
        <EnhancedStatCard
          icon={UserCheck}
          title="Assigned to Me"
          value={stats.assignedToMe}
          fullNumber={getFullFormattedNumber(stats.assignedToMe, true)}
          change={5.7}
          changeType="increase"
          color="from-purple-500 to-indigo-600"
          delay={0.4}
          isDark={isDark}
          iconColor="text-purple-500"
          isCurrency={false}
        />
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`rounded-3xl p-6 ${isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-white via-white to-gray-50'
          }`}
        style={{
          boxShadow: isDark
            ? '0 10px 40px rgba(0, 0, 0, 0.3)'
            : '0 10px 40px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <motion.div whileHover={{ scale: 1.01 }} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-violet-500" size={18} />
              <input
                type="text"
                placeholder="Search requests by title, ID, requestor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
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
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 text-sm font-semibold ${showFilters
              ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-transparent'
              : isDark
                ? 'bg-gray-700 border-gray-600 text-white hover:border-violet-500'
                : 'bg-white border-gray-200 text-gray-700 hover:border-violet-500'
              }`}
          >
            <Filter size={16} />
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
              <div className={`p-6 rounded-2xl mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                {/* First row - Status and Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="relative">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium appearance-none ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        style={{
                          paddingRight: '2.5rem'
                        }}
                      >
                        {statusOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium appearance-none ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        style={{
                          paddingRight: '2.5rem'
                        }}
                      >
                        {categoryOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second row - Date Range */}
                <div className="mb-6">
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                        }`}
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                        }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {filteredRequests.length} of {requests.length} requests
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedStatus('All Status');
                      setSelectedCategory('All Categories');
                      setDateRange({ start: '', end: '' });
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold ${isDark
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

      {/* Requests Grid */}
      {paginatedRequests.length > 0 ? (
        <>
          <div className="requests-grid-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {paginatedRequests.map((request, index) => (
                <RequestCard
                  key={`request-${request.id}-${index}`}
                  request={request}
                  index={index}
                  isDark={isDark}
                  currentUser={currentUser}
                  onViewDetails={openDetailModal}
                  onValidate={handleOpenValidationModal}
                  onReview={handleReviewRequest}
                  onDelete={handleDeleteRequest}
                  onEdit={handleEditRequest}
                  onForward={handleOpenForwardModal}
                />
              ))}
            </motion.div>
          </div>

          {showReviewModal && requestToReview && (
            <ReviewModal
              isDark={isDark}
              request={requestToReview}
              onClose={() => {
                setShowReviewModal(false);
                setRequestToReview(null);
              }}
              onApprove={handleApproveConfirm}
              onReject={handleRejectConfirm}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isDark={isDark}
              totalItems={filteredRequests.length}
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
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <FileText size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          </motion.div>
          <p className={`text-base font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No requests found matching your criteria
          </p>
          <p className={`text-sm font-medium mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Try adjusting your filters or create a new request
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreateModal}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold shadow-xl"
          >
            <Plus size={16} className="inline mr-2" />
            Create New Request
          </motion.button>
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateRequestModal
            isDark={isDark}
            formData={formData}
            fieldErrors={fieldErrors}
            shakeFields={shakeFields}
            onFormChange={handleFormChange}
            onDocumentsChange={handleDocumentsChange}
            onClose={closeCreateModal}
            onSubmit={handleFormSubmit}
            categoryOptions={categoryOptions}
            urgencyOptions={urgencyOptions}
          />
        )}

        {showEditModal && editingRequest && (
          <EditRequestModal
            isDark={isDark}
            request={editingRequest}
            formData={formData}
            fieldErrors={fieldErrors}
            shakeFields={shakeFields}
            onFormChange={handleFormChange}
            onDocumentsChange={handleDocumentsChange}
            onClose={closeEditModal}
            onSubmit={handleEditFormSubmit}
            categoryOptions={categoryOptions}
            urgencyOptions={urgencyOptions}
          />
        )}

        {showDetailModal && selectedRequest && (
          <ViewRequestModal
            isDark={isDark}
            request={selectedRequest}
            onClose={closeDetailModal}
          />
        )}

        {showForwardModal && requestToForward && (
          <ForwardModal
            isDark={isDark}
            request={requestToForward}
            onClose={() => {
              setShowForwardModal(false);
              setRequestToForward(null);
            }}
            onForward={handleForwardConfirm}
            currentAdmin={currentUser?.id || 'admin1'}
          />
        )}

        {showForwardConfirmDialog && (
          <ConfirmationDialog
            isDark={isDark}
            title="Forward Request"
            message={`Are you sure you want to forward this request to ${mockAdminUsers.find(a => a.id === forwardData?.targetAdminId)?.name}?`}
            onConfirm={confirmForward}
            onCancel={() => setShowForwardConfirmDialog(false)}
            confirmText="Forward"
            cancelText="Cancel"
          />
        )}

        {showSuccessDialog && (
          <SuccessDialog
            isDark={isDark}
            title="Success"
            message={successMessage}
            onClose={() => setShowSuccessDialog(false)}
          />
        )}

        {confirmationDialog.show && (
          <ConfirmationDialog
            isDark={isDark}
            title={confirmationDialog.title}
            message={confirmationDialog.message}
            onConfirm={() => {
              confirmationDialog.onConfirm?.();
              setConfirmationDialog(prev => ({ ...prev, show: false }));
            }}
            onCancel={() => setConfirmationDialog(prev => ({ ...prev, show: false }))}
          />
        )}

        {showValidationModal && requestToValidate && (
          <ValidationModal
            isDark={isDark}
            request={requestToValidate}
            onClose={() => {
              setShowValidationModal(false);
              setRequestToValidate(null);
            }}
            onValidate={handleValidationSubmit}
            urgencyOptions={urgencyOptions}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(RequestsManagement);