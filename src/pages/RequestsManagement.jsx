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
  Calendar,
  FileText,
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
  X,
  Users,
  TrendingDown,
  TrendingUp,
  Activity,
  Award,
  Target,
  FileCheck,
  Upload,
  Download as DownloadIcon,
  ArrowUpDown,
  UserCog,
  Shield,
  MailCheck,
  PhoneCall,
  IdCard,
  BadgeCheck,
  Zap,
  Crown,
  Star,
  UserX,
  Key,
  Settings as SettingsIcon,
  Bell,
  LogOut,
  FileUp,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Forward,
  Users as UsersIcon,
  ClipboardList,
  ListChecks,
  CheckSquare,
  Square,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  MessageSquare,
  Paperclip,
  File,
  Link,
  ExternalLink,
  BarChart3,
  PieChart,
  DollarSign,
  User,
} from 'lucide-react';

// Enhanced Dummy data for requests with all required fields
const requestsData = [
  {
    id: 'REQ-2025-001',
    type: 'recipient_registration',
    title: 'Medical Assistance Request - Heart Surgery',
    description: 'Request for financial assistance for heart surgery and post-operative care',
    requesterId: 'USR-101',
    requesterName: 'Ahmed Khan',
    requesterEmail: 'ahmed.khan@email.com',
    requesterPhone: '+92-300-1234567',
    requesterType: 'recipient',
    recipientId: 'REC-001',
    recipientName: 'Ahmed Khan',
    recipientEmail: 'ahmed.khan@email.com',
    category: 'Medical',
    requiredAmount: 500000,
    currentAmount: 0,
    status: 'Pending-Validation',
    priority: 'High',
    createdDate: '2025-11-01',
    updatedDate: '2025-11-01',
    dueDate: '2025-11-15',
    documents: [
      { name: 'medical_reports.pdf', size: '2.1 MB', type: 'application/pdf', uploadedDate: '2025-11-01' },
      { name: 'id_card.pdf', size: '1.5 MB', type: 'application/pdf', uploadedDate: '2025-11-01' },
      { name: 'bank_statement.pdf', size: '0.8 MB', type: 'application/pdf', uploadedDate: '2025-11-01' }
    ],
    assignee: 'admin1',
    approvers: ['admin2', 'admin3'],
    coApprovers: ['admin4'],
    currentApprover: 'admin2',
    approvalProgress: 0,
    requiredApprovals: 2,
    receivedApprovals: 0,
    forwardingHistory: [
      {
        fromAdmin: 'admin1',
        toAdmin: 'admin2',
        reason: 'Initial assignment for medical expertise',
        timestamp: '2025-11-01T10:30:00Z'
      }
    ],
    comments: [
      {
        adminId: 'admin1',
        adminName: 'Super Admin',
        comment: 'Request received and assigned for validation',
        timestamp: '2025-11-01T10:30:00Z',
        type: 'system'
      }
    ],
    verificationStatus: 'Not Started',
    urgency: 'High',
    estimatedProcessingTime: '7 days',
    tags: ['medical', 'surgery', 'urgent'],
    relatedRequests: [],
    emailNotifications: true,
    smsNotifications: true
  },
  {
    id: 'REQ-2025-002',
    type: 'donor_registration',
    title: 'New Donor Registration - Corporate Sponsor',
    description: 'Registration request from corporate donor interested in education projects',
    requesterId: 'DON-201',
    requesterName: 'Sarah Ali',
    requesterEmail: 'sarah.ali@email.com',
    requesterPhone: '+92-300-1112222',
    requesterType: 'donor',
    recipientId: null,
    recipientName: null,
    recipientEmail: null,
    category: 'Education',
    requiredAmount: 0,
    currentAmount: 0,
    status: 'Validated',
    priority: 'Medium',
    createdDate: '2025-10-28',
    updatedDate: '2025-10-30',
    dueDate: '2025-11-10',
    documents: [
      { name: 'business_license.pdf', size: '1.2 MB', type: 'application/pdf', uploadedDate: '2025-10-28' },
      { name: 'tax_certificate.pdf', size: '0.9 MB', type: 'application/pdf', uploadedDate: '2025-10-28' }
    ],
    assignee: 'admin2',
    approvers: ['admin1', 'admin3'],
    coApprovers: ['admin5'],
    currentApprover: 'admin1',
    approvalProgress: 1,
    requiredApprovals: 2,
    receivedApprovals: 1,
    forwardingHistory: [
      {
        fromAdmin: 'admin2',
        toAdmin: 'admin1',
        reason: 'Final approval required from supervisor',
        timestamp: '2025-10-30T14:15:00Z'
      }
    ],
    comments: [
      {
        adminId: 'admin2',
        adminName: 'Approver 1',
        comment: 'Documents verified and validated. Ready for final approval.',
        timestamp: '2025-10-30T14:15:00Z',
        type: 'approval'
      }
    ],
    verificationStatus: 'Verified',
    urgency: 'Medium',
    estimatedProcessingTime: '5 days',
    tags: ['corporate', 'education', 'verified'],
    relatedRequests: [],
    emailNotifications: true,
    smsNotifications: false
  },
  {
    id: 'REQ-2025-003',
    type: 'donation_approval',
    title: 'Large Donation Processing - Emergency Relief',
    description: 'Processing large donation for emergency housing relief program',
    requesterId: 'DON-001',
    requesterName: 'Anonymous',
    requesterEmail: 'anonymous@email.com',
    requesterPhone: 'N/A',
    requesterType: 'donor',
    recipientId: 'REC-003',
    recipientName: 'Ali Hassan',
    recipientEmail: 'ali.hassan@email.com',
    category: 'Emergency',
    requiredAmount: 75000,
    currentAmount: 75000,
    status: 'In-Progress',
    priority: 'High',
    createdDate: '2025-11-02',
    updatedDate: '2025-11-03',
    dueDate: '2025-11-05',
    documents: [
      { name: 'donation_receipt.pdf', size: '0.5 MB', type: 'application/pdf', uploadedDate: '2025-11-02' },
      { name: 'transaction_proof.pdf', size: '0.7 MB', type: 'application/pdf', uploadedDate: '2025-11-02' }
    ],
    assignee: 'admin3',
    approvers: ['admin1', 'admin2'],
    coApprovers: ['admin4'],
    currentApprover: 'admin1',
    approvalProgress: 1,
    requiredApprovals: 2,
    receivedApprovals: 1,
    forwardingHistory: [
      {
        fromAdmin: 'admin3',
        toAdmin: 'admin1',
        reason: 'Emergency case requires immediate attention',
        timestamp: '2025-11-02T16:45:00Z'
      }
    ],
    comments: [
      {
        adminId: 'admin3',
        adminName: 'Co-Approver 1',
        comment: 'Emergency funds allocated. Waiting for supervisor approval.',
        timestamp: '2025-11-02T16:45:00Z',
        type: 'processing'
      },
      {
        adminId: 'admin1',
        adminName: 'Super Admin',
        comment: 'Approved for immediate processing. High priority.',
        timestamp: '2025-11-03T09:30:00Z',
        type: 'approval'
      }
    ],
    verificationStatus: 'Verified',
    urgency: 'High',
    estimatedProcessingTime: '2 days',
    tags: ['emergency', 'housing', 'urgent'],
    relatedRequests: ['REQ-2025-001'],
    emailNotifications: true,
    smsNotifications: true
  },
  {
    id: 'REQ-2025-004',
    type: 'recipient_registration',
    title: 'Education Support Request - University Fees',
    description: 'Financial assistance request for university tuition fees and books',
    requesterId: 'USR-102',
    requesterName: 'Fatima Bibi',
    requesterEmail: 'fatima.bibi@email.com',
    requesterPhone: '+92-301-2345678',
    requesterType: 'recipient',
    recipientId: 'REC-002',
    recipientName: 'Fatima Bibi',
    recipientEmail: 'fatima.bibi@email.com',
    category: 'Education',
    requiredAmount: 200000,
    currentAmount: 0,
    status: 'Draft',
    priority: 'Medium',
    createdDate: '2025-11-03',
    updatedDate: '2025-11-03',
    dueDate: '2025-11-20',
    documents: [
      { name: 'admission_letter.pdf', size: '1.1 MB', type: 'application/pdf', uploadedDate: '2025-11-03' },
      { name: 'fee_structure.pdf', size: '0.6 MB', type: 'application/pdf', uploadedDate: '2025-11-03' }
    ],
    assignee: 'admin1',
    approvers: ['admin2'],
    coApprovers: [],
    currentApprover: 'admin2',
    approvalProgress: 0,
    requiredApprovals: 1,
    receivedApprovals: 0,
    forwardingHistory: [],
    comments: [
      {
        adminId: 'system',
        adminName: 'System',
        comment: 'Draft request created. Awaiting document submission.',
        timestamp: '2025-11-03T11:20:00Z',
        type: 'system'
      }
    ],
    verificationStatus: 'Not Started',
    urgency: 'Medium',
    estimatedProcessingTime: '10 days',
    tags: ['education', 'university', 'tuition'],
    relatedRequests: [],
    emailNotifications: true,
    smsNotifications: false
  },
  {
    id: 'REQ-2025-005',
    type: 'donation_approval',
    title: 'Monthly Food Supply Donation',
    description: 'Regular monthly donation for food supplies to needy families',
    requesterId: 'DON-003',
    requesterName: 'Muhammad Hassan',
    requesterEmail: 'm.hassan@email.com',
    requesterPhone: '+92-301-3334444',
    requesterType: 'donor',
    recipientId: 'REC-004',
    recipientName: 'Zainab Malik',
    recipientEmail: 'zainab.malik@email.com',
    category: 'Food',
    requiredAmount: 25000,
    currentAmount: 25000,
    status: 'Approved',
    priority: 'Low',
    createdDate: '2025-10-25',
    updatedDate: '2025-10-28',
    dueDate: '2025-11-05',
    documents: [
      { name: 'donation_agreement.pdf', size: '0.8 MB', type: 'application/pdf', uploadedDate: '2025-10-25' }
    ],
    assignee: 'admin2',
    approvers: ['admin1'],
    coApprovers: ['admin3'],
    currentApprover: null,
    approvalProgress: 2,
    requiredApprovals: 1,
    receivedApprovals: 1,
    forwardingHistory: [],
    comments: [
      {
        adminId: 'admin1',
        adminName: 'Super Admin',
        comment: 'Monthly donation approved. Regular monitoring required.',
        timestamp: '2025-10-28T15:45:00Z',
        type: 'approval'
      }
    ],
    verificationStatus: 'Verified',
    urgency: 'Low',
    estimatedProcessingTime: '3 days',
    tags: ['food', 'monthly', 'regular'],
    relatedRequests: ['REQ-2025-004'],
    emailNotifications: true,
    smsNotifications: true
  },
  {
    id: 'REQ-2025-006',
    type: 'recipient_registration',
    title: 'Emergency Housing Support',
    description: 'Urgent request for housing support after natural disaster',
    requesterId: 'USR-103',
    requesterName: 'Hassan Ahmed',
    requesterEmail: 'hassan.ahmed@email.com',
    requesterPhone: '+92-302-5556666',
    requesterType: 'recipient',
    recipientId: 'REC-005',
    recipientName: 'Hassan Ahmed',
    recipientEmail: 'hassan.ahmed@email.com',
    category: 'Housing',
    requiredAmount: 400000,
    currentAmount: 0,
    status: 'Rejected',
    priority: 'High',
    createdDate: '2025-10-20',
    updatedDate: '2025-10-25',
    dueDate: '2025-10-30',
    documents: [
      { name: 'disaster_report.pdf', size: '1.5 MB', type: 'application/pdf', uploadedDate: '2025-10-20' },
      { name: 'property_damage.pdf', size: '2.2 MB', type: 'application/pdf', uploadedDate: '2025-10-20' }
    ],
    assignee: 'admin1',
    approvers: ['admin2', 'admin3'],
    coApprovers: ['admin4'],
    currentApprover: null,
    approvalProgress: 0,
    requiredApprovals: 2,
    receivedApprovals: 0,
    forwardingHistory: [
      {
        fromAdmin: 'admin2',
        toAdmin: 'admin1',
        reason: 'Insufficient documentation and verification issues',
        timestamp: '2025-10-25T11:30:00Z'
      }
    ],
    comments: [
      {
        adminId: 'admin2',
        adminName: 'Approver 1',
        comment: 'Documents incomplete. Cannot verify property damage claims.',
        timestamp: '2025-10-22T14:20:00Z',
        type: 'rejection'
      },
      {
        adminId: 'admin1',
        adminName: 'Super Admin',
        comment: 'Request rejected due to insufficient supporting documents.',
        timestamp: '2025-10-25T11:30:00Z',
        type: 'rejection'
      }
    ],
    verificationStatus: 'Rejected',
    urgency: 'High',
    estimatedProcessingTime: 'N/A',
    tags: ['housing', 'emergency', 'rejected'],
    relatedRequests: [],
    emailNotifications: true,
    smsNotifications: true
  },
  {
    id: 'REQ-2025-007',
    type: 'donor_registration',
    title: 'International Donor Registration',
    description: 'Registration request from international donor organization',
    requesterId: 'DON-204',
    requesterName: 'Global Aid Foundation',
    requesterEmail: 'contact@globalaid.org',
    requesterPhone: '+1-555-0100',
    requesterType: 'donor',
    recipientId: null,
    recipientName: null,
    recipientEmail: null,
    category: 'Multiple',
    requiredAmount: 0,
    currentAmount: 0,
    status: 'Closed',
    priority: 'Medium',
    createdDate: '2025-10-15',
    updatedDate: '2025-10-25',
    dueDate: '2025-10-30',
    documents: [
      { name: 'organization_certificate.pdf', size: '1.8 MB', type: 'application/pdf', uploadedDate: '2025-10-15' },
      { name: 'international_license.pdf', size: '2.5 MB', type: 'application/pdf', uploadedDate: '2025-10-15' },
      { name: 'tax_exemption.pdf', size: '1.2 MB', type: 'application/pdf', uploadedDate: '2025-10-15' }
    ],
    assignee: 'admin1',
    approvers: ['admin2', 'admin3', 'admin4'],
    coApprovers: ['admin5'],
    currentApprover: null,
    approvalProgress: 3,
    requiredApprovals: 3,
    receivedApprovals: 3,
    forwardingHistory: [],
    comments: [
      {
        adminId: 'admin2',
        adminName: 'Approver 1',
        comment: 'International credentials verified. All documents in order.',
        timestamp: '2025-10-18T10:15:00Z',
        type: 'approval'
      },
      {
        adminId: 'admin3',
        adminName: 'Co-Approver 1',
        comment: 'Approved for partnership. Strong track record.',
        timestamp: '2025-10-20T14:30:00Z',
        type: 'approval'
      },
      {
        adminId: 'admin1',
        adminName: 'Super Admin',
        comment: 'Final approval granted. Welcome to our partner network.',
        timestamp: '2025-10-25T16:45:00Z',
        type: 'approval'
      }
    ],
    verificationStatus: 'Verified',
    urgency: 'Medium',
    estimatedProcessingTime: '10 days',
    tags: ['international', 'organization', 'partner'],
    relatedRequests: ['REQ-2025-003', 'REQ-2025-005'],
    emailNotifications: true,
    smsNotifications: false
  }
];

// Available admins for assignment and forwarding
const availableAdmins = [
  { id: 'admin1', name: 'Super Admin', role: 'super_admin', department: 'Management' },
  { id: 'admin2', name: 'Approver 1', role: 'approver', department: 'Operations' },
  { id: 'admin3', name: 'Co-Approver 1', role: 'co_approver', department: 'Finance' },
  { id: 'admin4', name: 'Support Admin', role: 'support', department: 'Support' },
  { id: 'admin5', name: 'Finance Admin', role: 'finance', department: 'Finance' }
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

const typeOptions = [
  'All Types',
  'recipient_registration',
  'donor_registration',
  'donation_approval',
  'document_verification',
  'emergency_request'
];

const categoryOptions = [
  'All Categories',
  'Medical',
  'Education',
  'Emergency',
  'Food',
  'Housing',
  'Multiple'
];

const priorityOptions = [
  'All Priority',
  'High',
  'Medium',
  'Low'
];

const verificationOptions = [
  'All Verification',
  'Verified',
  'Pending',
  'Not Started',
  'Rejected'
];

// Enhanced Stat Card for Requests Management
const RequestStatCard = ({ icon: Icon, title, value, change, changeType, color, delay, isDark }) => (
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
const EnhancedRequestStatBox = ({ icon: Icon, title, value, color, delay, index, isDark }) => (
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

// Status Badge Component for Requests
const RequestStatusBadge = ({ status, isDark }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return isDark ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-700';
      case 'Validated':
        return isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700';
      case 'Pending-Validation':
        return isDark ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-700';
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

// Priority Badge Component
const PriorityBadge = ({ priority, isDark }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return isDark ? 'bg-rose-900 text-rose-200' : 'bg-rose-100 text-rose-700';
      case 'Medium':
        return isDark ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-700';
      case 'Low':
        return isDark ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-700';
      default:
        return isDark ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(priority)}`}>
      {priority}
    </span>
  );
};

// Type Badge Component
const RequestTypeBadge = ({ type, isDark }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'recipient_registration':
        return isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700';
      case 'donor_registration':
        return isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700';
      case 'donation_approval':
        return isDark ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700';
      case 'document_verification':
        return isDark ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-700';
      case 'emergency_request':
        return isDark ? 'bg-rose-900 text-rose-200' : 'bg-rose-100 text-rose-700';
      default:
        return isDark ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'recipient_registration':
        return 'Recipient Registration';
      case 'donor_registration':
        return 'Donor Registration';
      case 'donation_approval':
        return 'Donation Approval';
      case 'document_verification':
        return 'Document Verification';
      case 'emergency_request':
        return 'Emergency Request';
      default:
        return type;
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(type)}`}>
      {getTypeLabel(type)}
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

// Progress Bar Component for Approval Progress
const ApprovalProgressBar = ({ progress, required, received, isDark }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs">
      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
        Approval Progress
      </span>
      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
        {received}/{required} Approved
      </span>
    </div>
    <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
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
  </div>
);

// Forward Modal Component for Requests
const ForwardModal = ({ isDark, request, onClose, onForward, currentAdmin = 'admin1' }) => {
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAdmin && reason.trim()) {
      onForward(request.id, selectedAdmin, reason.trim());
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
              Forward Request
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
            {/* Request Info */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Request to Forward
              </label>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {request.id} - {request.title}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {request.category} • Current: {getCurrentAdminName(request.assignee)}
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
                  .filter(admin => admin.id !== currentAdmin)
                  .map(admin => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name} ({admin.role}) - {admin.department}
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
                placeholder="Explain why you're forwarding this request..."
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

// Approve/Reject Modal Component
const ApprovalModal = ({ isDark, request, onClose, onApprove, onReject, currentAdmin = 'admin1' }) => {
  const [decision, setDecision] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (decision && comments.trim()) {
      if (decision === 'approve') {
        onApprove(request.id, comments.trim());
      } else {
        onReject(request.id, comments.trim());
      }
      onClose();
    }
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
              Review Request
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
            {/* Request Info */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Request Details
              </label>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {request.id} - {request.title}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {request.category} • {request.requesterName}
                </p>
                {request.requiredAmount > 0 && (
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Amount: ₨{request.requiredAmount.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Decision */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Decision *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDecision('approve')}
                  className={`p-3 rounded-lg border-2 font-medium flex items-center justify-center gap-2 ${
                    decision === 'approve'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <ThumbsUp size={20} />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setDecision('reject')}
                  className={`p-3 rounded-lg border-2 font-medium flex items-center justify-center gap-2 ${
                    decision === 'reject'
                      ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <ThumbsDown size={20} />
                  Reject
                </button>
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Comments *
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                required
                rows="4"
                placeholder="Provide detailed comments for your decision..."
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
              disabled={!decision || !comments.trim()}
              className={`px-4 py-2 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                decision === 'approve' 
                  ? 'bg-gradient-to-r from-emerald-600 to-green-500' 
                  : 'bg-gradient-to-r from-rose-600 to-pink-500'
              }`}
            >
              {decision === 'approve' ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
              {decision === 'approve' ? 'Approve Request' : 'Reject Request'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Requests Management Main Component
const RequestsManagement = ({ isDark }) => {
  const [requests, setRequests] = useState(requestsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedPriority, setSelectedPriority] = useState('All Priority');
  const [selectedVerification, setSelectedVerification] = useState('All Verification');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [requestToForward, setRequestToForward] = useState(null);
  const [requestToApprove, setRequestToApprove] = useState(null);
  const [requiredApprovals, setRequiredApprovals] = useState(2); // Configurable

  // Filter requests based on search and filters
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = 
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'All Status' || request.status === selectedStatus;
      const matchesType = selectedType === 'All Types' || request.type === selectedType;
      const matchesCategory = selectedCategory === 'All Categories' || request.category === selectedCategory;
      const matchesPriority = selectedPriority === 'All Priority' || request.priority === selectedPriority;
      const matchesVerification = selectedVerification === 'All Verification' || request.verificationStatus === selectedVerification;
      
      const matchesDateRange = 
        (!dateRange.start || request.createdDate >= dateRange.start) &&
        (!dateRange.end || request.createdDate <= dateRange.end);

      return matchesSearch && matchesStatus && matchesType && matchesCategory && matchesPriority && matchesVerification && matchesDateRange;
    });
  }, [requests, searchTerm, selectedStatus, selectedType, selectedCategory, selectedPriority, selectedVerification, dateRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(r => r.status === 'Pending-Validation').length;
    const approvedRequests = requests.filter(r => r.status === 'Approved').length;
    const rejectedRequests = requests.filter(r => r.status === 'Rejected').length;
    const highPriorityRequests = requests.filter(r => r.priority === 'High').length;
    const recipientRequests = requests.filter(r => r.type === 'recipient_registration').length;
    const donorRequests = requests.filter(r => r.type === 'donor_registration').length;
    const totalAmount = requests.reduce((sum, r) => sum + r.requiredAmount, 0);

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      highPriorityRequests,
      recipientRequests,
      donorRequests,
      totalAmount
    };
  }, [requests]);

  // Handle status change
  const handleStatusChange = (requestId, newStatus) => {
    setRequests(prev => prev.map(request =>
      request.id === requestId ? { 
        ...request, 
        status: newStatus,
        updatedDate: new Date().toISOString().split('T')[0]
      } : request
    ));
  };

  // Handle verification change
  const handleVerificationChange = (requestId, newVerification) => {
    setRequests(prev => prev.map(request =>
      request.id === requestId ? { ...request, verificationStatus: newVerification } : request
    ));
  };

  // Handle assignee change
  const handleAssigneeChange = (requestId, newAssignee) => {
    setRequests(prev => prev.map(request =>
      request.id === requestId ? { ...request, assignee: newAssignee } : request
    ));
  };

  // Handle forward request
  const handleForwardRequest = (requestId, targetAdminId, reason) => {
    const currentAdmin = 'admin1';
    
    setRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        const forwardRecord = {
          fromAdmin: currentAdmin,
          toAdmin: targetAdminId,
          reason: reason,
          timestamp: new Date().toISOString()
        };

        const commentRecord = {
          adminId: currentAdmin,
          adminName: 'Current User',
          comment: `Request forwarded to ${availableAdmins.find(a => a.id === targetAdminId)?.name}. Reason: ${reason}`,
          timestamp: new Date().toISOString(),
          type: 'forward'
        };

        return {
          ...request,
          assignee: targetAdminId,
          forwardingHistory: [...request.forwardingHistory, forwardRecord],
          comments: [...request.comments, commentRecord],
          updatedDate: new Date().toISOString().split('T')[0]
        };
      }
      return request;
    }));

    console.log(`Request ${requestId} forwarded to ${targetAdminId} for: ${reason}`);
  };

  // Handle approve request
  const handleApproveRequest = (requestId, comments) => {
    setRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        const newReceivedApprovals = request.receivedApprovals + 1;
        const newApprovalProgress = Math.round((newReceivedApprovals / request.requiredApprovals) * 100);
        const newStatus = newReceivedApprovals >= request.requiredApprovals ? 'Approved' : request.status;

        const commentRecord = {
          adminId: 'admin1',
          adminName: 'Current User',
          comment: `Request approved. ${comments}`,
          timestamp: new Date().toISOString(),
          type: 'approval'
        };

        return {
          ...request,
          receivedApprovals: newReceivedApprovals,
          approvalProgress: newApprovalProgress,
          status: newStatus,
          comments: [...request.comments, commentRecord],
          updatedDate: new Date().toISOString().split('T')[0]
        };
      }
      return request;
    }));

    console.log(`Request ${requestId} approved with comments: ${comments}`);
  };

  // Handle reject request
  const handleRejectRequest = (requestId, comments) => {
    setRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        const commentRecord = {
          adminId: 'admin1',
          adminName: 'Current User',
          comment: `Request rejected. ${comments}`,
          timestamp: new Date().toISOString(),
          type: 'rejection'
        };

        return {
          ...request,
          status: 'Rejected',
          comments: [...request.comments, commentRecord],
          updatedDate: new Date().toISOString().split('T')[0]
        };
      }
      return request;
    }));

    console.log(`Request ${requestId} rejected with comments: ${comments}`);
  };

  // Handle delete request
  const handleDeleteRequest = (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      setRequests(prev => prev.filter(request => request.id !== requestId));
    }
  };

  // Handle view request details
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  // Handle edit request
  const handleEditRequest = (request) => {
    setEditingRequest(request);
    setShowAddRequestModal(true);
  };

  // Handle add new request
  const handleAddRequest = (newRequest) => {
    const request = {
      ...newRequest,
      id: `REQ-${new Date().getFullYear()}-${String(requests.length + 1).padStart(3, '0')}`,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      currentAmount: 0,
      approvalProgress: 0,
      receivedApprovals: 0,
      requiredApprovals: requiredApprovals,
      assignee: 'admin1',
      approvers: ['admin2', 'admin3'],
      coApprovers: ['admin4'],
      currentApprover: 'admin2',
      forwardingHistory: [],
      comments: [
        {
          adminId: 'system',
          adminName: 'System',
          comment: 'New request created and assigned for processing.',
          timestamp: new Date().toISOString(),
          type: 'system'
        }
      ],
      tags: [],
      relatedRequests: [],
      emailNotifications: true,
      smsNotifications: true
    };
    setRequests(prev => [...prev, request]);
  };

  // Handle update request
  const handleUpdateRequest = (updatedRequest) => {
    setRequests(prev => prev.map(request =>
      request.id === updatedRequest.id ? {
        ...updatedRequest,
        updatedDate: new Date().toISOString().split('T')[0]
      } : request
    ));
    setEditingRequest(null);
  };

  // Handle open forward modal
  const handleOpenForwardModal = (request) => {
    setRequestToForward(request);
    setShowForwardModal(true);
    setActionMenu(null);
  };

  // Handle open approval modal
  const handleOpenApprovalModal = (request) => {
    setRequestToApprove(request);
    setShowApprovalModal(true);
    setActionMenu(null);
  };

  // Export to Excel
  const handleExportExcel = () => {
    const data = filteredRequests.map(request => ({
      ID: request.id,
      Title: request.title,
      Type: request.type,
      Category: request.category,
      Status: request.status,
      Priority: request.priority,
      'Requester Name': request.requesterName,
      'Requester Email': request.requesterEmail,
      'Required Amount': request.requiredAmount,
      'Created Date': request.createdDate,
      'Due Date': request.dueDate,
      'Assigned To': availableAdmins.find(a => a.id === request.assignee)?.name,
      'Verification Status': request.verificationStatus,
      'Approval Progress': `${request.approvalProgress}%`,
    }));
    
    console.log('Exporting to Excel:', data);
    alert(`Exported ${filteredRequests.length} requests to Excel`);
  };

  // Export to PDF
  const handleExportPDF = () => {
    console.log('Exporting to PDF:', filteredRequests);
    alert(`Exported ${filteredRequests.length} requests to PDF`);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
    setSelectedType('All Types');
    setSelectedCategory('All Categories');
    setSelectedPriority('All Priority');
    setSelectedVerification('All Verification');
    setDateRange({ start: '', end: '' });
  };

  // Toggle action menu
  const toggleActionMenu = (requestId) => {
    setActionMenu(actionMenu === requestId ? null : requestId);
  };

  // Close modals
  const closeModals = () => {
    setShowRequestModal(false);
    setShowAddRequestModal(false);
    setShowForwardModal(false);
    setShowApprovalModal(false);
    setEditingRequest(null);
    setSelectedRequest(null);
    setRequestToForward(null);
    setRequestToApprove(null);
  };

  // Get admin name by ID
  const getAdminName = (adminId) => {
    const admin = availableAdmins.find(a => a.id === adminId);
    return admin ? admin.name : 'Unknown Admin';
  };

  // Update required approvals configuration
  const handleUpdateRequiredApprovals = () => {
    const newCount = prompt('Enter number of required approvals:', requiredApprovals);
    if (newCount && !isNaN(newCount) && newCount > 0) {
      setRequiredApprovals(Number(newCount));
      alert(`Required approvals updated to ${newCount}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <RequestStatCard
          icon={ClipboardList}
          title="Total Requests"
          value={stats.totalRequests}
          change={12.5}
          changeType="increase"
          color="from-blue-500 to-cyan-500"
          delay={0.1}
          isDark={isDark}
        />
        <RequestStatCard
          icon={Clock}
          title="Pending Validation"
          value={stats.pendingRequests}
          change={8.3}
          changeType="increase"
          color="from-amber-500 to-orange-500"
          delay={0.2}
          isDark={isDark}
        />
        <RequestStatCard
          icon={ThumbsUp}
          title="Approved Requests"
          value={stats.approvedRequests}
          change={15.7}
          changeType="increase"
          color="from-emerald-500 to-teal-500"
          delay={0.3}
          isDark={isDark}
        />
        <RequestStatCard
          icon={AlertCircle}
          title="High Priority"
          value={stats.highPriorityRequests}
          change={5.2}
          changeType="increase"
          color="from-rose-500 to-pink-500"
          delay={0.4}
          isDark={isDark}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <EnhancedRequestStatBox
          icon={Users}
          title="Recipient Requests"
          value={stats.recipientRequests}
          color="from-blue-600 to-cyan-500"
          delay={0.5}
          index={0}
          isDark={isDark}
        />
        <EnhancedRequestStatBox
          icon={UserCheck}
          title="Donor Requests"
          value={stats.donorRequests}
          color="from-emerald-500 to-green-500"
          delay={0.6}
          index={1}
          isDark={isDark}
        />
        <EnhancedRequestStatBox
          icon={DollarSign}
          title="Total Amount"
          value={`₨${(stats.totalAmount / 1000).toFixed(0)}K`}
          color="from-violet-500 to-purple-500"
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
              Approval Configuration
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage request approval settings and workflows
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className={`px-4 py-2 rounded-lg border ${
              isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
            }`}>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Required Approvals: <strong>{requiredApprovals}</strong>
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpdateRequiredApprovals}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-lg font-semibold"
            >
              <SettingsIcon size={18} />
              Configure Approvals
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
              placeholder="Search requests by ID, title, requester, or description..."
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

                {/* Type Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {typeOptions.map(option => (
                      <option key={option} value={option}>
                        {option === 'All Types' ? option : 
                         option === 'recipient_registration' ? 'Recipient Registration' :
                         option === 'donor_registration' ? 'Donor Registration' :
                         option === 'donation_approval' ? 'Donation Approval' :
                         option === 'document_verification' ? 'Document Verification' :
                         option === 'emergency_request' ? 'Emergency Request' : option}
                      </option>
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

                {/* Priority Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Priority
                  </label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {priorityOptions.map(option => (
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

                {/* Date Range */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Created Date
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
                  Showing {filteredRequests.length} of {requests.length} requests
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
            Requests & Approvals Management
          </h3>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddRequestModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold"
            >
              <UserPlus size={18} />
              Add Request
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

      {/* Requests Table */}
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
                }`}>Request Info</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Requester & Amount</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Status & Priority</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Approval Progress</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Assigned To</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <motion.tr
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b ${
                    isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
                  } transition-colors group`}
                >
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <div className={`font-semibold group-hover:text-blue-600 transition-colors ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {request.id}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {request.title}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <RequestTypeBadge type={request.type} isDark={isDark} />
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {request.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar size={12} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          Created: {request.createdDate}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {request.requesterName}
                          </span>
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {request.requesterEmail}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {request.requesterType === 'recipient' ? 'Recipient' : 'Donor'}
                        </div>
                      </div>
                      {request.requiredAmount > 0 && (
                        <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          ₨{request.requiredAmount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <RequestStatusBadge status={request.status} isDark={isDark} />
                      <PriorityBadge priority={request.priority} isDark={isDark} />
                      <VerificationBadge status={request.verificationStatus} isDark={isDark} />
                      <div className="flex items-center gap-2 text-xs">
                        <Clock size={12} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          Due: {request.dueDate}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <ApprovalProgressBar 
                        progress={request.approvalProgress} 
                        required={request.requiredApprovals}
                        received={request.receivedApprovals}
                        isDark={isDark}
                      />
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Current: {getAdminName(request.currentApprover)}
                      </div>
                      {request.forwardingHistory.length > 0 && (
                        <div className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                          <Forward size={12} className="inline mr-1" />
                          {request.forwardingHistory.length} forward{request.forwardingHistory.length !== 1 ? 's' : ''}
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
                          {getAdminName(request.assignee)}
                        </div>
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {request.approvers.length} approver{request.approvers.length !== 1 ? 's' : ''}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {request.coApprovers.length} co-approver{request.coApprovers.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleViewRequest(request)}
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
                        onClick={() => handleEditRequest(request)}
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
                          onClick={() => toggleActionMenu(request.id)}
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
                          {actionMenu === request.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className={`absolute right-0 top-10 w-56 rounded-lg shadow-xl border z-10 ${
                                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="p-2 space-y-1">
                                {/* Approval Actions */}
                                {request.status !== 'Approved' && request.status !== 'Rejected' && request.status !== 'Closed' && (
                                  <>
                                    <button
                                      onClick={() => handleOpenApprovalModal(request)}
                                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                                        isDark 
                                          ? 'hover:bg-gray-700 text-gray-300' 
                                          : 'hover:bg-gray-100 text-gray-700'
                                      }`}
                                    >
                                      <ThumbsUp size={14} />
                                      Review & Approve/Reject
                                    </button>
                                    <hr className={isDark ? 'border-gray-700' : 'border-gray-200'} />
                                  </>
                                )}

                                {/* Forward Action */}
                                <button
                                  onClick={() => handleOpenForwardModal(request)}
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
                                    handleStatusChange(request.id, 'Validated');
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  Mark as Validated
                                </button>

                                <button
                                  onClick={() => {
                                    handleVerificationChange(request.id, 'Verified');
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  Verify Documents
                                </button>

                                {/* Notification Actions */}
                                <button
                                  onClick={() => {
                                    alert(`Sending email notification to ${request.requesterEmail}`);
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  Send Email Update
                                </button>

                                <hr className={isDark ? 'border-gray-700' : 'border-gray-200'} />

                                <button
                                  onClick={() => {
                                    handleDeleteRequest(request.id);
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-rose-600 text-rose-300' 
                                      : 'hover:bg-rose-100 text-rose-700'
                                  }`}
                                >
                                  Delete Request
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

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                No requests found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Request Detail Modal */}
      <AnimatePresence>
        {showRequestModal && selectedRequest && (
          <RequestDetailModal
            request={selectedRequest}
            isDark={isDark}
            onClose={closeModals}
            onStatusChange={handleStatusChange}
            onVerificationChange={handleVerificationChange}
            onAssigneeChange={handleAssigneeChange}
            availableAdmins={availableAdmins}
            getAdminName={getAdminName}
          />
        )}
      </AnimatePresence>

      {/* Add/Edit Request Modal */}
      <AnimatePresence>
        {showAddRequestModal && (
          <AddRequestModal
            isDark={isDark}
            request={editingRequest}
            onClose={closeModals}
            onAddRequest={handleAddRequest}
            onUpdateRequest={handleUpdateRequest}
            requiredApprovals={requiredApprovals}
            availableAdmins={availableAdmins}
          />
        )}
      </AnimatePresence>

      {/* Forward Modal */}
      <AnimatePresence>
        {showForwardModal && requestToForward && (
          <ForwardModal
            isDark={isDark}
            request={requestToForward}
            onClose={closeModals}
            onForward={handleForwardRequest}
          />
        )}
      </AnimatePresence>

      {/* Approval Modal */}
      <AnimatePresence>
        {showApprovalModal && requestToApprove && (
          <ApprovalModal
            isDark={isDark}
            request={requestToApprove}
            onClose={closeModals}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Request Detail Modal Component
const RequestDetailModal = ({ 
  request, 
  isDark, 
  onClose, 
  onStatusChange, 
  onVerificationChange, 
  onAssigneeChange,
  availableAdmins,
  getAdminName
}) => {
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
        className={`rounded-2xl shadow-2xl border w-full max-w-6xl max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Request Details - {request.id}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="lg:col-span-2">
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Title
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>{request.title}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Description
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>{request.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Type
                    </label>
                    <RequestTypeBadge type={request.type} isDark={isDark} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Category
                    </label>
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>{request.category}</p>
                  </div>
                </div>
                {request.requiredAmount > 0 && (
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Financial Information
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Required:</span>
                        <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          ₨{request.requiredAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Current:</span>
                        <p className="text-lg font-bold text-emerald-600">
                          ₨{request.currentAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status & Approval Information */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Status & Approval
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Current Status
                  </label>
                  <select
                    value={request.status}
                    onChange={(e) => onStatusChange(request.id, e.target.value)}
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
                    value={request.verificationStatus}
                    onChange={(e) => onVerificationChange(request.id, e.target.value)}
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
                    Assignee
                  </label>
                  <select
                    value={request.assignee}
                    onChange={(e) => onAssigneeChange(request.id, e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {availableAdmins.map(admin => (
                      <option key={admin.id} value={admin.id}>
                        {admin.name} ({admin.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <ApprovalProgressBar 
                    progress={request.approvalProgress} 
                    required={request.requiredApprovals}
                    received={request.receivedApprovals}
                    isDark={isDark}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Requester Information */}
          <div className="mt-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Requester Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Contact Details
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{request.requesterName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{request.requesterEmail}</span>
                  </div>
                  {request.requesterPhone && request.requesterPhone !== 'N/A' && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{request.requesterPhone}</span>
                    </div>
                  )}
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {request.requesterType}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Timeline
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Created:</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{request.createdDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Updated:</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{request.updatedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Due Date:</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{request.dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Priority:</span>
                    <PriorityBadge priority={request.priority} isDark={isDark} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          {request.documents && request.documents.length > 0 && (
            <div className="mt-6">
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Documents ({request.documents.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {request.documents.map((doc, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {doc.name}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {doc.size} • {doc.type}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          Uploaded: {doc.uploadedDate}
                        </p>
                      </div>
                      <button className={`p-1 rounded ${
                        isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                      }`}>
                        <DownloadIcon size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Forwarding History */}
          {request.forwardingHistory.length > 0 && (
            <div className="mt-6">
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Forwarding History ({request.forwardingHistory.length})
              </h3>
              <div className="space-y-3">
                {request.forwardingHistory.map((record, index) => (
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

          {/* Comments Section */}
          {request.comments && request.comments.length > 0 && (
            <div className="mt-6">
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Comments & Activity ({request.comments.length})
              </h3>
              <div className="space-y-3">
                {request.comments.map((comment, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {comment.adminName}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          comment.type === 'approval' ? (isDark ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-700') :
                          comment.type === 'rejection' ? (isDark ? 'bg-rose-900 text-rose-200' : 'bg-rose-100 text-rose-700') :
                          comment.type === 'forward' ? (isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700') :
                          (isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700')
                        }`}>
                          {comment.type}
                        </span>
                      </div>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatDate(comment.timestamp)}
                      </span>
                                        </div>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{comment.comment}</p>
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

// Add/Edit Request Modal Component
const AddRequestModal = ({ isDark, request, onClose, onAddRequest, onUpdateRequest, requiredApprovals, availableAdmins }) => {
  const isEditing = !!request;
  const [formData, setFormData] = useState(isEditing ? request : {
    type: 'recipient_registration',
    title: '',
    description: '',
    requesterName: '',
    requesterEmail: '',
    requesterPhone: '',
    requesterType: 'recipient',
    category: 'Medical',
    requiredAmount: 0,
    priority: 'Medium',
    dueDate: '',
    verificationStatus: 'Not Started',
    urgency: 'Medium',
    tags: [],
    emailNotifications: true,
    smsNotifications: false,
    documents: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      onUpdateRequest(formData);
    } else {
      onAddRequest(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleDocumentsChange = (documents) => {
    setFormData(prev => ({
      ...prev,
      documents
    }));
  };

  const handleTagAdd = (tag) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
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
              {isEditing ? 'Edit Request' : 'Create New Request'}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Basic Information
              </h3>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Request Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {typeOptions.filter(opt => opt !== 'All Types').map(option => (
                    <option key={option} value={option}>
                      {option === 'recipient_registration' ? 'Recipient Registration' :
                       option === 'donor_registration' ? 'Donor Registration' :
                       option === 'donation_approval' ? 'Donation Approval' :
                       option === 'document_verification' ? 'Document Verification' :
                       option === 'emergency_request' ? 'Emergency Request' : option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
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
            </div>

            {/* Requester Information */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Requester Information
              </h3>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Requester Type *
                </label>
                <select
                  name="requesterType"
                  value={formData.requesterType}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="recipient">Recipient</option>
                  <option value="donor">Donor</option>
                  <option value="support_staff">Support Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Requester Name *
                </label>
                <input
                  type="text"
                  name="requesterName"
                  value={formData.requesterName}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Requester Email *
                </label>
                <input
                  type="email"
                  name="requesterEmail"
                  value={formData.requesterEmail}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Requester Phone
                </label>
                <input
                  type="text"
                  name="requesterPhone"
                  value={formData.requesterPhone}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          {(formData.type === 'recipient_registration' || formData.type === 'donation_approval') && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Required Amount (₨)
                  </label>
                  <input
                    type="number"
                    name="requiredAmount"
                    value={formData.requiredAmount}
                    onChange={handleChange}
                    min="0"
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Additional Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Priority *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {priorityOptions.filter(opt => opt !== 'All Priority').map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Verification Status
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
                Urgency
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Tags
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${
                    isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="hover:opacity-70"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a tag..."
                className={`flex-1 p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTagAdd(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  handleTagAdd(input.value);
                  input.value = '';
                }}
                className={`px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Add
              </button>
            </div>
          </div>

          {/* Document Upload */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Document Upload
            </h3>
            <DocumentUpload
              documents={formData.documents}
              onDocumentsChange={handleDocumentsChange}
              isDark={isDark}
            />
          </div>

          {/* Notification Settings */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Notification Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Email Notifications
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="smsNotifications"
                  checked={formData.smsNotifications}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  SMS Notifications
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
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold"
            >
              {isEditing ? 'Update Request' : 'Create Request'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Document Upload Component (Reusable)
const DocumentUpload = ({ documents, onDocumentsChange, isDark }) => {
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
        type: file.type,
        uploadedDate: new Date().toISOString().split('T')[0]
      }));
      onDocumentsChange([...documents, ...newFiles]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        uploadedDate: new Date().toISOString().split('T')[0]
      }));
      onDocumentsChange([...documents, ...newFiles]);
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
    const newDocuments = documents.filter((_, i) => i !== index);
    onDocumentsChange(newDocuments);
  };

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
        } ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
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
        <div className="space-y-3">
          <div className="flex justify-center">
            <Upload size={32} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
          </div>
          <div>
            <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Drop files here or click to upload
            </p>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Supports PDF, DOC, JPG, PNG (Max 10MB each)
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Uploaded Documents ({documents.length})
          </h4>
          {documents.map((doc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center justify-between p-3 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText size={16} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {doc.name}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {doc.size} • {doc.type || 'Document'} • {doc.uploadedDate}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => removeDocument(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-1 rounded ${
                  isDark 
                    ? 'hover:bg-gray-600 text-gray-400' 
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                <X size={16} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsManagement;