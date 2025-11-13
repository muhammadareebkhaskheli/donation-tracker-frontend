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
} from 'lucide-react';

// Enhanced Dummy data for recipients with forwarding fields
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
    status: 'Validated',
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

// Enhanced Stat Card for Recipients Management - Similar to Admin Dashboard
const RecipientStatCard = ({ icon: Icon, title, value, change, changeType, color, delay, isDark }) => (
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

// Enhanced Secondary Stats - Similar to Admin Dashboard
const EnhancedStatBox = ({ icon: Icon, title, value, color, delay, index, isDark }) => (
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

// Status Badge Component
const StatusBadge = ({ status, isDark }) => {
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

// Progress Bar Component
const ProgressBar = ({ percentage, isDark }) => (
  <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${percentage}%` }}
      transition={{ duration: 1.5, type: "spring" }}
      className="bg-gradient-to-r from-violet-500 to-fuchsia-400 h-2 rounded-full shadow-lg relative overflow-hidden"
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

// Fixed Forward Modal Component for Recipients
const ForwardModal = ({ isDark, recipient, onClose, onForward, currentAdmin = 'admin1' }) => {
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAdmin && reason.trim()) {
      onForward(recipient.id, selectedAdmin, reason.trim());
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
              Forward Recipient Request
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
            {/* Recipient Info */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Recipient to Forward
              </label>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {recipient.name}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {recipient.id} • {recipient.category} • Current: {getCurrentAdminName(recipient.assignee)}
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
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
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
                placeholder="Explain why you're forwarding this recipient request..."
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none resize-none ${
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
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

// Document Upload Component
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
        type: file.type
      }));
      onDocumentsChange([...documents, ...newFiles]);
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
            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-violet-400 dark:hover:border-violet-500'
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
                    {doc.size} • {doc.type || 'Document'}
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

// Recipients Management Main Component
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
  const [actionMenu, setActionMenu] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [recipientToForward, setRecipientToForward] = useState(null);

  // Auto scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter recipients based on search and filters
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

  // Handle status change
  const handleStatusChange = (recipientId, newStatus) => {
    setRecipients(prev => prev.map(recipient =>
      recipient.id === recipientId ? { ...recipient, status: newStatus } : recipient
    ));
  };

  // Handle verification change
  const handleVerificationChange = (recipientId, newVerification) => {
    setRecipients(prev => prev.map(recipient =>
      recipient.id === recipientId ? { ...recipient, verificationStatus: newVerification } : recipient
    ));
  };

  // Handle delete recipient
  const handleDeleteRecipient = (recipientId) => {
    if (window.confirm('Are you sure you want to delete this recipient?')) {
      setRecipients(prev => prev.filter(recipient => recipient.id !== recipientId));
    }
  };

  // Handle view recipient details
  const handleViewRecipient = (recipient) => {
    setSelectedRecipient(recipient);
    setShowRecipientModal(true);
  };

  // Handle edit recipient
  const handleEditRecipient = (recipient) => {
    setEditingRecipient(recipient);
    setShowAddRecipientModal(true);
  };

  // Handle add new recipient
  const handleAddRecipient = (newRecipient) => {
    const recipient = {
      ...newRecipient,
      id: `REC-${String(recipients.length + 1).padStart(3, '0')}`,
      registrationDate: new Date().toISOString().split('T')[0],
      balanceAmount: newRecipient.requiredAmount - newRecipient.donatedAmount,
      completionRate: Math.round((newRecipient.donatedAmount / newRecipient.requiredAmount) * 100),
      lastDonationDate: newRecipient.donatedAmount > 0 ? new Date().toISOString().split('T')[0] : null,
      assignee: 'admin1', // Default assignee
      forwardingHistory: []
    };
    setRecipients(prev => [...prev, recipient]);
  };

  // Handle update recipient
  const handleUpdateRecipient = (updatedRecipient) => {
    setRecipients(prev => prev.map(recipient =>
      recipient.id === updatedRecipient.id ? {
        ...updatedRecipient,
        balanceAmount: updatedRecipient.requiredAmount - updatedRecipient.donatedAmount,
        completionRate: Math.round((updatedRecipient.donatedAmount / updatedRecipient.requiredAmount) * 100),
      } : recipient
    ));
    setEditingRecipient(null);
  };

  // Handle forward request
  const handleForwardRequest = (recipientId, targetAdminId, reason) => {
    const currentAdmin = 'admin1'; // This would typically come from auth context
    
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

    // Show success message (in a real app, this would be a toast notification)
    alert(`Recipient ${recipientId} successfully forwarded to ${availableAdmins.find(a => a.id === targetAdminId)?.name}`);
  };

  // Handle open forward modal
  const handleOpenForwardModal = (recipient) => {
    setRecipientToForward(recipient);
    setShowForwardModal(true);
    setActionMenu(null);
  };

  // Export to Excel
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
      'Verification Status': recipient.verificationStatus,
      'Registration Date': recipient.registrationDate,
    }));
    
    // In a real application, you would use a library like xlsx
    console.log('Exporting to Excel:', data);
    alert(`Exported ${filteredRecipients.length} recipients to Excel`);
  };

  // Export to PDF
  const handleExportPDF = () => {
    // In a real application, you would use a library like jspdf
    console.log('Exporting to PDF:', filteredRecipients);
    alert(`Exported ${filteredRecipients.length} recipients to PDF`);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
    setSelectedCategory('All Categories');
    setSelectedVerification('All Verification');
    setSelectedUrgency('All Urgency');
    setDateRange({ start: '', end: '' });
  };

  // Toggle action menu
  const toggleActionMenu = (recipientId) => {
    setActionMenu(actionMenu === recipientId ? null : recipientId);
  };

  // Close modals
  const closeModals = () => {
    setShowRecipientModal(false);
    setShowAddRecipientModal(false);
    setShowForwardModal(false);
    setEditingRecipient(null);
    setSelectedRecipient(null);
    setRecipientToForward(null);
  };

  // Get admin name by ID
  const getAdminName = (adminId) => {
    const admin = availableAdmins.find(a => a.id === adminId);
    return admin ? admin.name : 'Unknown Admin';
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards - Enhanced with Admin Dashboard Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <RecipientStatCard
          icon={Users}
          title="Total Recipients"
          value={stats.totalRecipients}
          change={8.3}
          changeType="increase"
          color="from-blue-500 to-cyan-500"
          delay={0.1}
          isDark={isDark}
        />
        <RecipientStatCard
          icon={UserCheck}
          title="Approved Recipients"
          value={stats.approvedRecipients}
          change={12.5}
          changeType="increase"
          color="from-emerald-500 to-teal-500"
          delay={0.2}
          isDark={isDark}
        />
        <RecipientStatCard
          icon={Clock}
          title="Pending Validation"
          value={stats.pendingRecipients}
          change={-5.2}
          changeType="decrease"
          color="from-amber-500 to-orange-500"
          delay={0.3}
          isDark={isDark}
        />
        <RecipientStatCard
          icon={Shield}
          title="Verified Recipients"
          value={stats.verifiedRecipients}
          change={15.7}
          changeType="increase"
          color="from-violet-500 to-purple-500"
          delay={0.4}
          isDark={isDark}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <EnhancedStatBox
          icon={DollarSign}
          title="Total Required"
          value={`₨${(stats.totalAmountRequired / 1000).toFixed(0)}K`}
          color="from-blue-600 to-cyan-500"
          delay={0.5}
          index={0}
          isDark={isDark}
        />
        <EnhancedStatBox
          icon={TrendingUp}
          title="Total Donated"
          value={`₨${(stats.totalAmountDonated / 1000).toFixed(0)}K`}
          color="from-emerald-500 to-green-500"
          delay={0.6}
          index={1}
          isDark={isDark}
        />
        <EnhancedStatBox
          icon={Activity}
          title="High Urgency"
          value={stats.highUrgencyRecipients}
          color="from-rose-500 to-pink-600"
          delay={0.7}
          index={2}
          isDark={isDark}
        />
      </div>

      {/* Search and Filters - Simplified */}
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
              placeholder="Search recipients by name, email, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
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

        {/* Advanced Filters - Improved Layout */}
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
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
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

                {/* Category Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
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
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
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

                {/* Urgency Filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Urgency
                  </label>
                  <select
                    value={selectedUrgency}
                    onChange={(e) => setSelectedUrgency(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {urgencyOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range - Improved Layout */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Registration Date
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none text-sm ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none text-sm ${
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
                  Showing {filteredRecipients.length} of {recipients.length} recipients
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
            Recipients Management
          </h3>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddRecipientModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-lg font-semibold"
            >
              <UserPlus size={18} />
              Add Recipient
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

      {/* Recipients Table */}
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
                }`}>Recipient</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Contact</th>
                <th className={`text-left py-4 px-6 text-xs font-semibold uppercase ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Financial Info</th>
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
              {filteredRecipients.map((recipient, index) => (
                <motion.tr
                  key={recipient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b ${
                    isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
                  } transition-colors group`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-400 rounded-full flex items-center justify-center text-white font-bold">
                        {recipient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className={`font-semibold group-hover:text-violet-600 transition-colors ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {recipient.name}
                        </div>
                        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {recipient.id} • {recipient.category}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {recipient.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {recipient.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {recipient.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {recipient.address}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Required:</span>
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          ₨{recipient.requiredAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Donated:</span>
                        <span className="font-semibold text-emerald-600">
                          ₨{recipient.donatedAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Balance:</span>
                        <span className="font-semibold text-rose-600">
                          ₨{recipient.balanceAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-1">
                        <ProgressBar percentage={recipient.completionRate} isDark={isDark} />
                        <div className="text-xs text-right mt-1" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                          {recipient.completionRate}% Complete
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-2">
                      <StatusBadge status={recipient.status} isDark={isDark} />
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {recipient.registrationDate}
                      </div>
                      {recipient.approver && (
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          By: {recipient.approver}
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
                          {getAdminName(recipient.assignee)}
                        </div>
                        {recipient.forwardingHistory.length > 0 && (
                          <div className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                            <Clock size={12} className="inline mr-1" />
                            {recipient.forwardingHistory.length} forward{recipient.forwardingHistory.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      <VerificationBadge status={recipient.verificationStatus} isDark={isDark} />
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Urgency: <span className={`font-semibold ${
                          recipient.urgency === 'High' ? 'text-rose-500' : 
                          recipient.urgency === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                        }`}>{recipient.urgency}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleViewRecipient(recipient)}
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
                        onClick={() => handleEditRecipient(recipient)}
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
                          onClick={() => toggleActionMenu(recipient.id)}
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
                          {actionMenu === recipient.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className={`absolute right-0 top-10 w-48 rounded-lg shadow-xl border z-50 ${
                                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="p-2 space-y-1">
                                {/* Forward Action */}
                                <button
                                  onClick={() => handleOpenForwardModal(recipient)}
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
                                    handleStatusChange(recipient.id, 'Approved');
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    handleVerificationChange(recipient.id, 'Verified');
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  Mark Verified
                                </button>
                                <button
                                  onClick={() => {
                                    // Send email functionality
                                    alert(`Sending email to ${recipient.email}`);
                                    setActionMenu(null);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                    isDark 
                                      ? 'hover:bg-gray-700 text-gray-300' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  Send Email
                                </button>
                                <hr className={isDark ? 'border-gray-700' : 'border-gray-200'} />
                                <button
                                  onClick={() => {
                                    handleDeleteRecipient(recipient.id);
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

          {filteredRecipients.length === 0 && (
            <div className="text-center py-12">
              <Users size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                No recipients found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Recipient Detail Modal */}
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

      {/* Add/Edit Recipient Modal */}
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

      {/* Forward Modal */}
      <AnimatePresence>
        {showForwardModal && recipientToForward && (
          <ForwardModal
            isDark={isDark}
            recipient={recipientToForward}
            onClose={closeModals}
            onForward={handleForwardRequest}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Updated Recipient Detail Modal Component with Forwarding History
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
              Recipient Details - {recipient.name}
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
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>{recipient.name}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Email
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>{recipient.email}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Phone
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>{recipient.phone}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Address
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>{recipient.address}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Age & Family
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>
                    {recipient.age} years, {recipient.familyMembers} family members
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
                      {getAdminName(recipient.assignee)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Financial Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Category & Description
                  </label>
                  <p className={isDark ? 'text-white' : 'text-gray-900'}>
                    <strong>{recipient.category}</strong> - {recipient.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Required Amount
                    </label>
                    <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ₨{recipient.requiredAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Donated Amount
                    </label>
                    <p className="text-lg font-bold text-emerald-600">
                      ₨{recipient.donatedAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Balance Amount
                  </label>
                  <p className="text-lg font-bold text-rose-600">
                    ₨{recipient.balanceAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Completion Progress
                  </label>
                  <div className="pt-1">
                    <div className={`w-full rounded-full h-3 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${recipient.completionRate}%` }}
                        transition={{ duration: 1.5, type: "spring" }}
                        className="bg-gradient-to-r from-violet-500 to-fuchsia-400 h-3 rounded-full shadow-lg"
                      />
                    </div>
                    <div className="text-sm text-right mt-1" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                      {recipient.completionRate}% Complete
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Verification */}
          <div className="mt-6 p-4 border rounded-lg" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Status & Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Current Status
                </label>
                <select
                  value={recipient.status}
                  onChange={(e) => onStatusChange(recipient.id, e.target.value)}
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
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
                  value={recipient.verificationStatus}
                  onChange={(e) => onVerificationChange(recipient.id, e.target.value)}
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
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

          {/* Forwarding History */}
          {recipient.forwardingHistory.length > 0 && (
            <div className="mt-6">
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Forwarding History ({recipient.forwardingHistory.length})
              </h3>
              <div className="space-y-3">
                {recipient.forwardingHistory.map((record, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Send size={14} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
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

          {/* Documents */}
          <div className="mt-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Documents ({recipient.documents.length})
            </h3>
            <div className="space-y-2">
              {recipient.documents.length > 0 ? (
                recipient.documents.map((doc, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <div className="flex items-center gap-3">
                      <FileText size={16} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                      <div>
                        <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{doc.name}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {doc.size} • {doc.type || 'Document'}
                        </p>
                      </div>
                    </div>
                    <button className={`px-3 py-1 rounded text-sm ${
                      isDark 
                        ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}>
                      Download
                    </button>
                  </div>
                ))
              ) : (
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No documents uploaded</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Add/Edit Recipient Modal Component
const AddRecipientModal = ({ isDark, recipient, onClose, onAddRecipient, onUpdateRecipient }) => {
  const isEditing = !!recipient;
  const [formData, setFormData] = useState(isEditing ? recipient : {
    name: '',
    email: '',
    phone: '',
    address: '',
    category: 'Medical',
    requiredAmount: 0,
    donatedAmount: 0,
    status: 'Draft',
    verificationStatus: 'Not Started',
    description: '',
    urgency: 'Medium',
    age: 0,
    familyMembers: 1,
    documents: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      onUpdateRecipient(formData);
    } else {
      onAddRecipient(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleDocumentsChange = (documents) => {
    setFormData(prev => ({
      ...prev,
      documents
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
        className={`rounded-2xl shadow-2xl border w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {isEditing ? 'Edit Recipient' : 'Add New Recipient'}
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
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
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
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Phone *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Request Information
              </h3>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
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
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Required Amount (₨) *
                </label>
                <input
                  type="number"
                  name="requiredAmount"
                  value={formData.requiredAmount}
                  onChange={handleChange}
                  required
                  min="0"
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Donated Amount (₨)
                </label>
                <input
                  type="number"
                  name="donatedAmount"
                  value={formData.donatedAmount}
                  onChange={handleChange}
                  min="0"
                  max={formData.requiredAmount}
                  className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Urgency
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {urgencyOptions.filter(opt => opt !== 'All Urgency').map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
                max="120"
                className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Family Members
              </label>
              <input
                type="number"
                name="familyMembers"
                value={formData.familyMembers}
                onChange={handleChange}
                min="1"
                max="20"
                className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>

          {/* Document Upload Section */}
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
              className="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-lg font-semibold"
            >
              {isEditing ? 'Update Recipient' : 'Add Recipient'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default RecipientsManagement;