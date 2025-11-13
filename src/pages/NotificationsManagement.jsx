import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Mail,
  Send,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  MoreVertical,
  Trash2,
  Settings,
  User,
  Users,
  DollarSign,
  FileText,
  X,
  CheckCircle2,
  Archive,
  Tag,
  Calendar,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
} from 'lucide-react';

// Enhanced Notifications Data
const notificationsData = [
  {
    id: 'NOT-001',
    title: 'New Donation Received',
    message: 'Anonymous donor contributed ₨50,000 for medical assistance to Ahmed Khan',
    type: 'donation',
    priority: 'high',
    status: 'unread',
    recipientId: 'REC-001',
    donorId: 'DON-001',
    donationId: 'DON-2025-001',
    timestamp: '2025-11-05T10:30:00Z',
    category: 'Medical',
    amount: 50000,
    read: false,
    actionRequired: false,
    metadata: {
      donorName: 'Anonymous',
      recipientName: 'Ahmed Khan',
      category: 'Medical'
    }
  },
  {
    id: 'NOT-002',
    title: 'Recipient Approval Required',
    message: 'Fatima Bibi has submitted documents for education funding approval',
    type: 'approval',
    priority: 'high',
    status: 'unread',
    recipientId: 'REC-002',
    timestamp: '2025-11-05T09:15:00Z',
    category: 'Education',
    read: false,
    actionRequired: true,
    metadata: {
      recipientName: 'Fatima Bibi',
      requiredAmount: 200000,
      submittedDate: '2025-11-05'
    }
  },
  {
    id: 'NOT-003',
    title: 'Document Verification Required',
    message: '3 recipients require document verification for medical cases',
    type: 'verification',
    priority: 'medium',
    status: 'unread',
    timestamp: '2025-11-05T08:45:00Z',
    category: 'Medical',
    read: false,
    actionRequired: true,
    metadata: {
      pendingCount: 3,
      categories: ['Medical', 'Emergency'],
      urgency: 'high'
    }
  },
  {
    id: 'NOT-004',
    title: 'Weekly Report Generated',
    message: 'Weekly donation summary report for Oct 28 - Nov 3 is ready',
    type: 'report',
    priority: 'low',
    status: 'read',
    timestamp: '2025-11-04T16:20:00Z',
    category: 'System',
    read: true,
    actionRequired: false,
    metadata: {
      period: 'Oct 28 - Nov 3, 2025',
      totalDonations: 245000,
      newDonors: 12
    }
  },
  {
    id: 'NOT-005',
    title: 'Donation Target Achieved',
    message: 'Medical category has reached 85% of monthly donation target',
    type: 'achievement',
    priority: 'medium',
    status: 'read',
    timestamp: '2025-11-04T14:10:00Z',
    category: 'Medical',
    read: true,
    actionRequired: false,
    metadata: {
      category: 'Medical',
      target: 500000,
      achieved: 425000,
      percentage: 85
    }
  },
  {
    id: 'NOT-006',
    title: 'Urgent: High Priority Case',
    message: 'Emergency funding required for Ali Hassan - house fire incident',
    type: 'urgent',
    priority: 'critical',
    status: 'unread',
    recipientId: 'REC-003',
    timestamp: '2025-11-04T11:30:00Z',
    category: 'Emergency',
    read: false,
    actionRequired: true,
    metadata: {
      recipientName: 'Ali Hassan',
      requiredAmount: 300000,
      urgency: 'critical',
      deadline: '2025-11-06'
    }
  },
  {
    id: 'NOT-007',
    title: 'New Donor Registered',
    message: 'Sarah Ahmed has registered as a new donor with preference for Education',
    type: 'donor',
    priority: 'low',
    status: 'read',
    donorId: 'DON-006',
    timestamp: '2025-11-03T15:45:00Z',
    category: 'Education',
    read: true,
    actionRequired: false,
    metadata: {
      donorName: 'Sarah Ahmed',
      preferredCategory: 'Education',
      registrationDate: '2025-11-03'
    }
  },
  {
    id: 'NOT-008',
    title: 'System Maintenance Scheduled',
    message: 'Scheduled maintenance on Nov 10, 2025 from 2:00 AM to 4:00 AM',
    type: 'system',
    priority: 'medium',
    status: 'read',
    timestamp: '2025-11-03T10:00:00Z',
    category: 'System',
    read: true,
    actionRequired: false,
    metadata: {
      scheduledDate: '2025-11-10',
      startTime: '02:00',
      endTime: '04:00',
      duration: '2 hours'
    }
  }
];

// Filter options
const typeOptions = [
  'All Types',
  'donation',
  'approval',
  'verification',
  'report',
  'achievement',
  'urgent',
  'donor',
  'system'
];

const priorityOptions = [
  'All Priorities',
  'critical',
  'high',
  'medium',
  'low'
];

const statusOptions = [
  'All Status',
  'unread',
  'read'
];

const categoryOptions = [
  'All Categories',
  'Medical',
  'Education',
  'Emergency',
  'Food',
  'Housing',
  'System'
];

// Enhanced Stat Card for Notifications
const NotificationStatCard = ({ icon: Icon, title, value, change, changeType, color, delay, isDark }) => (
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
              <ChevronUp size={16} className="text-emerald-500" />
            ) : (
              <ChevronDown size={16} className="text-rose-500" />
            )}
            <span className={`text-sm font-semibold ${changeType === 'increase' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {change}%
            </span>
            <span className={`text-xs ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>vs last week</span>
          </motion.div>
        )}
      </div>
      
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

// Priority Badge Component
const PriorityBadge = ({ priority, isDark }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return isDark ? 'bg-rose-900 text-rose-200 border-rose-700' : 'bg-rose-100 text-rose-700 border-rose-300';
      case 'high':
        return isDark ? 'bg-amber-900 text-amber-200 border-amber-700' : 'bg-amber-100 text-amber-700 border-amber-300';
      case 'medium':
        return isDark ? 'bg-blue-900 text-blue-200 border-blue-700' : 'bg-blue-100 text-blue-700 border-blue-300';
      case 'low':
        return isDark ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return isDark ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return <AlertCircle size={12} />;
      case 'high':
        return <Clock size={12} />;
      case 'medium':
        return <Bell size={12} />;
      case 'low':
        return <CheckCircle size={12} />;
      default:
        return <Bell size={12} />;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(priority)}`}>
      {getPriorityIcon(priority)}
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

// Type Badge Component
const TypeBadge = ({ type, isDark }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'donation':
        return isDark ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-700';
      case 'approval':
        return isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700';
      case 'verification':
        return isDark ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-700';
      case 'report':
        return isDark ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700';
      case 'achievement':
        return isDark ? 'bg-violet-900 text-violet-200' : 'bg-violet-100 text-violet-700';
      case 'urgent':
        return isDark ? 'bg-rose-900 text-rose-200' : 'bg-rose-100 text-rose-700';
      case 'donor':
        return isDark ? 'bg-cyan-900 text-cyan-200' : 'bg-cyan-100 text-cyan-700';
      case 'system':
        return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700';
      default:
        return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'donation':
        return <DollarSign size={12} />;
      case 'approval':
        return <CheckCircle size={12} />;
      case 'verification':
        return <FileText size={12} />;
      case 'report':
        return <FileText size={12} />;
      case 'achievement':
        return <CheckCircle2 size={12} />;
      case 'urgent':
        return <AlertCircle size={12} />;
      case 'donor':
        return <User size={12} />;
      case 'system':
        return <Settings size={12} />;
      default:
        return <Bell size={12} />;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(type)}`}>
      {getTypeIcon(type)}
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

// Notification Item Component
const NotificationItem = ({ notification, isDark, onMarkAsRead, onMarkAsUnread, onDelete, onViewDetails, index }) => {
  const [showActions, setShowActions] = useState(false);

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationTime.toLocaleDateString();
  };

  const handleAction = (action) => {
    setShowActions(false);
    switch (action) {
      case 'read':
        notification.read ? onMarkAsUnread(notification.id) : onMarkAsRead(notification.id);
        break;
      case 'delete':
        onDelete(notification.id);
        break;
      case 'view':
        onViewDetails(notification);
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-xl border transition-all cursor-pointer group ${
        notification.read 
          ? (isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200') 
          : (isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200')
      } ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
      onClick={() => handleAction('view')}
    >
      <div className="flex items-start gap-3">
        {/* Notification Icon */}
        <div className={`p-2 rounded-lg flex-shrink-0 ${
          notification.type === 'donation' ? 'bg-emerald-500/20' :
          notification.type === 'approval' ? 'bg-blue-500/20' :
          notification.type === 'verification' ? 'bg-amber-500/20' :
          notification.type === 'report' ? 'bg-purple-500/20' :
          notification.type === 'achievement' ? 'bg-violet-500/20' :
          notification.type === 'urgent' ? 'bg-rose-500/20' :
          notification.type === 'donor' ? 'bg-cyan-500/20' :
          'bg-gray-500/20'
        }`}>
          {notification.type === 'donation' && <DollarSign size={16} className="text-emerald-500" />}
          {notification.type === 'approval' && <CheckCircle size={16} className="text-blue-500" />}
          {notification.type === 'verification' && <FileText size={16} className="text-amber-500" />}
          {notification.type === 'report' && <FileText size={16} className="text-purple-500" />}
          {notification.type === 'achievement' && <CheckCircle2 size={16} className="text-violet-500" />}
          {notification.type === 'urgent' && <AlertCircle size={16} className="text-rose-500" />}
          {notification.type === 'donor' && <User size={16} className="text-cyan-500" />}
          {notification.type === 'system' && <Settings size={16} className="text-gray-500" />}
        </div>

        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {notification.title}
              </h4>
              <TypeBadge type={notification.type} isDark={isDark} />
              <PriorityBadge priority={notification.priority} isDark={isDark} />
              {notification.actionRequired && (
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  isDark ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-700'
                }`}>
                  Action Required
                </span>
              )}
            </div>
            
            {/* Unread indicator */}
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
            )}
          </div>

          <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {notification.message}
          </p>

          {/* Metadata */}
          {notification.metadata && (
            <div className="flex items-center gap-4 text-xs mb-2">
              {notification.metadata.donorName && (
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  Donor: {notification.metadata.donorName}
                </span>
              )}
              {notification.metadata.recipientName && (
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  Recipient: {notification.metadata.recipientName}
                </span>
              )}
              {notification.metadata.amount && (
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  Amount: ₨{notification.metadata.amount.toLocaleString()}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {formatTime(notification.timestamp)}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
            }`}>
              {notification.category}
            </span>
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative flex-shrink-0">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
              isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
            }`}
          >
            <MoreVertical size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
          </motion.button>

          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className={`absolute right-0 top-6 w-48 rounded-lg shadow-xl border z-50 ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => handleAction('read')}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                      isDark 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {notification.read ? <Clock size={14} /> : <CheckCircle size={14} />}
                    {notification.read ? 'Mark as Unread' : 'Mark as Read'}
                  </button>
                  <button
                    onClick={() => handleAction('view')}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                      isDark 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Eye size={14} />
                    View Details
                  </button>
                  <hr className={isDark ? 'border-gray-700' : 'border-gray-200'} />
                  <button
                    onClick={() => handleAction('delete')}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                      isDark 
                        ? 'hover:bg-rose-600 text-rose-300' 
                        : 'hover:bg-rose-100 text-rose-700'
                    }`}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// Notification Detail Modal
const NotificationDetailModal = ({ notification, isDark, onClose, onMarkAsRead, onMarkAsUnread }) => {
  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleMarkAsRead = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    onClose();
  };

  const getActionButtons = () => {
    if (!notification.actionRequired) return null;

    const actions = {
      approval: { label: 'Review Approval', path: '/approvals' },
      verification: { label: 'Verify Documents', path: '/verification' },
      urgent: { label: 'Take Action', path: '/urgent-cases' },
      donation: { label: 'View Donation', path: '/donations' }
    };

    const action = actions[notification.type];
    if (!action) return null;

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold"
        onClick={() => {
          console.log(`Navigate to: ${action.path}`);
          handleMarkAsRead();
        }}
      >
        {action.label}
      </motion.button>
    );
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
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${
                notification.type === 'donation' ? 'bg-emerald-500/20' :
                notification.type === 'approval' ? 'bg-blue-500/20' :
                notification.type === 'verification' ? 'bg-amber-500/20' :
                notification.type === 'report' ? 'bg-purple-500/20' :
                notification.type === 'achievement' ? 'bg-violet-500/20' :
                notification.type === 'urgent' ? 'bg-rose-500/20' :
                notification.type === 'donor' ? 'bg-cyan-500/20' :
                'bg-gray-500/20'
              }`}>
                {notification.type === 'donation' && <DollarSign size={24} className="text-emerald-500" />}
                {notification.type === 'approval' && <CheckCircle size={24} className="text-blue-500" />}
                {notification.type === 'verification' && <FileText size={24} className="text-amber-500" />}
                {notification.type === 'report' && <FileText size={24} className="text-purple-500" />}
                {notification.type === 'achievement' && <CheckCircle2 size={24} className="text-violet-500" />}
                {notification.type === 'urgent' && <AlertCircle size={24} className="text-rose-500" />}
                {notification.type === 'donor' && <User size={24} className="text-cyan-500" />}
                {notification.type === 'system' && <Settings size={24} className="text-gray-500" />}
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {notification.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <TypeBadge type={notification.type} isDark={isDark} />
                  <PriorityBadge priority={notification.priority} isDark={isDark} />
                  {notification.actionRequired && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      isDark ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-700'
                    }`}>
                      Action Required
                    </span>
                  )}
                </div>
              </div>
            </div>
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
          {/* Message */}
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Message
            </h3>
            <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              {notification.message}
            </p>
          </div>

          {/* Metadata */}
          {notification.metadata && (
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Details
              </h3>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {Object.entries(notification.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      {typeof value === 'number' && key.includes('amount') ? `₨${value.toLocaleString()}` : value}
                      {typeof value === 'number' && key.includes('percentage') ? `${value}%` : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
            <div>
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Received:
              </span>
              <span className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {formatDateTime(notification.timestamp)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {notification.read ? 'Read' : 'Unread'}
              </span>
              <button
                onClick={() => notification.read ? onMarkAsUnread(notification.id) : onMarkAsRead(notification.id)}
                className={`px-3 py-1 rounded text-sm ${
                  isDark 
                    ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {notification.read ? 'Mark Unread' : 'Mark Read'}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
          <div className="flex justify-between items-center">
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg border font-medium ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Close
            </motion.button>
            {getActionButtons()}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Notifications Management Component
const NotificationsManagement = ({ isDark }) => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [bulkActions, setBulkActions] = useState([]);

  // Auto scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter and sort notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications.filter(notification => {
      const matchesSearch = 
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'All Types' || notification.type === selectedType;
      const matchesPriority = selectedPriority === 'All Priorities' || notification.priority === selectedPriority;
      const matchesStatus = selectedStatus === 'All Status' || 
        (selectedStatus === 'read' ? notification.read : !notification.read);
      const matchesCategory = selectedCategory === 'All Categories' || notification.category === selectedCategory;
      
      const matchesDateRange = 
        (!dateRange.start || notification.timestamp >= dateRange.start) &&
        (!dateRange.end || notification.timestamp <= dateRange.end);

      return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesCategory && matchesDateRange;
    });

    // Sort notifications
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'timestamp':
        default:
          aValue = new Date(a.timestamp);
          bValue = new Date(b.timestamp);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [notifications, searchTerm, selectedType, selectedPriority, selectedStatus, selectedCategory, dateRange, sortBy, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalNotifications = notifications.length;
    const unreadNotifications = notifications.filter(n => !n.read).length;
    const actionRequired = notifications.filter(n => n.actionRequired).length;
    const highPriority = notifications.filter(n => n.priority === 'high' || n.priority === 'critical').length;
    const today = new Date().toISOString().split('T')[0];
    const todayNotifications = notifications.filter(n => n.timestamp.startsWith(today)).length;

    return {
      totalNotifications,
      unreadNotifications,
      actionRequired,
      highPriority,
      todayNotifications
    };
  }, [notifications]);

  // Handle mark as read
  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
  };

  // Handle mark as unread
  const handleMarkAsUnread = (notificationId) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId ? { ...notification, read: false } : notification
    ));
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  // Handle delete notification
  const handleDeleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  // Handle delete multiple notifications
  const handleDeleteMultiple = (notificationIds) => {
    setNotifications(prev => prev.filter(notification => !notificationIds.includes(notification.id)));
    setBulkActions([]);
  };

  // Handle view notification details
  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
  };

  // Handle bulk action
  const handleBulkAction = (action) => {
    switch (action) {
      case 'read':
        setNotifications(prev => prev.map(notification =>
          bulkActions.includes(notification.id) ? { ...notification, read: true } : notification
        ));
        break;
      case 'unread':
        setNotifications(prev => prev.map(notification =>
          bulkActions.includes(notification.id) ? { ...notification, read: false } : notification
        ));
        break;
      case 'delete':
        handleDeleteMultiple(bulkActions);
        break;
    }
    setBulkActions([]);
  };

  // Toggle bulk selection
  const toggleBulkSelection = (notificationId) => {
    setBulkActions(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  // Select all filtered notifications
  const selectAllFiltered = () => {
    setBulkActions(filteredNotifications.map(n => n.id));
  };

  // Clear all selections
  const clearSelections = () => {
    setBulkActions([]);
  };

  // Export notifications
  const handleExport = (format) => {
    const data = filteredNotifications.map(notification => ({
      ID: notification.id,
      Title: notification.title,
      Message: notification.message,
      Type: notification.type,
      Priority: notification.priority,
      Category: notification.category,
      Status: notification.read ? 'Read' : 'Unread',
      'Action Required': notification.actionRequired ? 'Yes' : 'No',
      Timestamp: new Date(notification.timestamp).toLocaleString(),
    }));
    
    console.log(`Exporting ${format}:`, data);
    alert(`Exported ${filteredNotifications.length} notifications to ${format}`);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('All Types');
    setSelectedPriority('All Priorities');
    setSelectedStatus('All Status');
    setSelectedCategory('All Categories');
    setDateRange({ start: '', end: '' });
    setSortBy('timestamp');
    setSortOrder('desc');
  };

  // Close modals
  const closeModals = () => {
    setShowDetailModal(false);
    setSelectedNotification(null);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        <NotificationStatCard
          icon={Bell}
          title="Total Notifications"
          value={stats.totalNotifications}
          change={8.3}
          changeType="increase"
          color="from-blue-500 to-cyan-500"
          delay={0.1}
          isDark={isDark}
        />
        <NotificationStatCard
          icon={AlertCircle}
          title="Unread"
          value={stats.unreadNotifications}
          change={-12.5}
          changeType="decrease"
          color="from-amber-500 to-orange-500"
          delay={0.2}
          isDark={isDark}
        />
        <NotificationStatCard
          icon={Clock}
          title="Action Required"
          value={stats.actionRequired}
          change={5.2}
          changeType="increase"
          color="from-rose-500 to-pink-500"
          delay={0.3}
          isDark={isDark}
        />
        <NotificationStatCard
          icon={AlertCircle}
          title="High Priority"
          value={stats.highPriority}
          change={15.7}
          changeType="increase"
          color="from-violet-500 to-purple-500"
          delay={0.4}
          isDark={isDark}
        />
        <NotificationStatCard
          icon={Calendar}
          title="Today"
          value={stats.todayNotifications}
          change={20.1}
          changeType="increase"
          color="from-emerald-500 to-teal-500"
          delay={0.5}
          isDark={isDark}
        />
      </div>

      {/* Bulk Actions Bar */}
      {bulkActions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-4 shadow-2xl border ${
            isDark ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className={`font-semibold ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                {bulkActions.length} notification{bulkActions.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBulkAction('read')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    isDark 
                      ? 'bg-blue-700 text-white hover:bg-blue-600' 
                      : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
                  }`}
                >
                  Mark as Read
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBulkAction('unread')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    isDark 
                      ? 'bg-blue-700 text-white hover:bg-blue-600' 
                      : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
                  }`}
                >
                  Mark as Unread
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 bg-rose-500 text-white rounded text-sm font-medium hover:bg-rose-600"
                >
                  Delete
                </motion.button>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearSelections}
              className={`p-1 rounded ${
                isDark ? 'hover:bg-blue-800' : 'hover:bg-blue-100'
              }`}
            >
              <X size={16} className={isDark ? "text-blue-300" : "text-blue-600"} />
            </motion.button>
          </div>
        </motion.div>
      )}

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
              placeholder="Search notifications by title or message..."
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
            <FilterIcon size={18} />
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

                {/* Sort By */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="timestamp">Date</option>
                    <option value="priority">Priority</option>
                    <option value="type">Type</option>
                    <option value="category">Category</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Order
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortOrder('desc')}
                      className={`flex-1 p-2 rounded-lg border ${
                        sortOrder === 'desc' 
                          ? 'bg-blue-500 text-white border-blue-500' 
                          : (isDark ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700')
                      }`}
                    >
                      <SortDesc size={16} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => setSortOrder('asc')}
                      className={`flex-1 p-2 rounded-lg border ${
                        sortOrder === 'asc' 
                          ? 'bg-blue-500 text-white border-blue-500' 
                          : (isDark ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700')
                      }`}
                    >
                      <SortAsc size={16} className="mx-auto" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg bg-opacity-50"
                style={{ backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)' }}
              >
                <div className="md:col-span-3">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date Range
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                  Showing {filteredNotifications.length} of {notifications.length} notifications
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
            Notifications Management
          </h3>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg font-semibold"
            >
              <CheckCircle size={18} />
              Mark All as Read
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={selectAllFiltered}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold"
            >
              <CheckCircle2 size={18} />
              Select All
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExport('Excel')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg font-semibold"
            >
              <Download size={18} />
              Export Excel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExport('PDF')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-500 text-white rounded-lg font-semibold"
            >
              <FileText size={18} />
              Export PDF
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl shadow-2xl border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}
      >
        <div className="p-6">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                No notifications found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  isDark={isDark}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAsUnread={handleMarkAsUnread}
                  onDelete={handleDeleteNotification}
                  onViewDetails={handleViewDetails}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedNotification && (
          <NotificationDetailModal
            notification={selectedNotification}
            isDark={isDark}
            onClose={closeModals}
            onMarkAsRead={handleMarkAsRead}
            onMarkAsUnread={handleMarkAsUnread}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsManagement;