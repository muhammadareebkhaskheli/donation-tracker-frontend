import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCircle,
  CheckCircle2,
  Trash2,
  DollarSign,
  FileText,
  AlertCircle,
  User,
  Settings,
  Clock,
  MoreVertical,
  Eye,
  X,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Filter,
  Search
} from 'lucide-react';

// Enhanced Notifications Data - MAKE SURE THIS ARRAY IS DEFINED
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

// Priority Badge Component
const PriorityBadge = ({ priority, isDark }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-gradient-to-r from-rose-500 to-pink-600';
      case 'high':
        return 'bg-gradient-to-r from-amber-500 to-orange-500';
      case 'medium':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'low':
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
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
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${getPriorityColor(priority)} text-white shadow-sm`}>
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
        return 'bg-gradient-to-r from-emerald-500 to-green-500';
      case 'approval':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'verification':
        return 'bg-gradient-to-r from-amber-500 to-orange-500';
      case 'report':
        return 'bg-gradient-to-r from-purple-500 to-violet-500';
      case 'achievement':
        return 'bg-gradient-to-r from-violet-500 to-purple-500';
      case 'urgent':
        return 'bg-gradient-to-r from-rose-500 to-pink-600';
      case 'donor':
        return 'bg-gradient-to-r from-cyan-500 to-blue-500';
      case 'system':
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
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
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full ${getTypeColor(type)} text-white shadow-sm`}>
      {getTypeIcon(type)}
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

// Notification Item Component
const NotificationItem = ({ notification, isDark, onMarkAsRead, onMarkAsUnread, onDelete, index, isSelected, onSelect }) => {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

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
        console.log('View notification:', notification.id);
        break;
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
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
  }, []);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`rounded-2xl p-6 shadow-xl border relative group cursor-pointer ${isDark
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        } ${isSelected
          ? (isDark ? 'ring-2 ring-blue-500 bg-blue-500/5' : 'ring-2 ring-blue-500 bg-blue-50')
          : (notification.read
            ? ''
            : (isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'))
        }`}
      onClick={() => onSelect(notification.id)}
    >
      {/* Floating animation effects */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${isDark ? '#4f46e5' : '#8b5cf6'} 0%, transparent 70%)`,
              filter: 'blur(4px)',
              opacity: 0,
            }}
            animate={{
              y: isHovered ? [0, Math.random() * -80 - 20, Math.random() * -150 - 30] : 0,
              x: isHovered ? [0, Math.random() * 40 - 20, Math.random() * 40 - 20] : 0,
              opacity: isHovered ? [0, 0.4, 0] : 0,
              scale: isHovered ? [0, 1, 0] : 0,
            }}
            transition={{
              duration: isHovered ? Math.random() * 3 + 2 : 0.1,
              delay: isHovered ? i * 0.2 : 0,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: isHovered ? Math.random() * 1 + 0.5 : 0,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Pulsing glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: isDark ? '#4f46e5' : '#8b5cf6',
          opacity: 0,
          filter: 'blur(40px)',
        }}
        animate={{
          opacity: isHovered ? [0.05, 0.12, 0.05] : 0,
          scale: isHovered ? [1, 1.08, 1] : 1,
        }}
        transition={{
          duration: isHovered ? 2 : 0.1,
          repeat: isHovered ? Infinity : 0,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          {/* Notification Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
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
              className={`p-3 rounded-xl backdrop-blur-sm ${isDark ? 'bg-white/5' : 'bg-black/5'}`}
            >
              {notification.type === 'donation' && <DollarSign size={20} className="text-emerald-500" />}
              {notification.type === 'approval' && <CheckCircle size={20} className="text-blue-500" />}
              {notification.type === 'verification' && <FileText size={20} className="text-amber-500" />}
              {notification.type === 'report' && <FileText size={20} className="text-purple-500" />}
              {notification.type === 'achievement' && <CheckCircle2 size={20} className="text-violet-500" />}
              {notification.type === 'urgent' && <AlertCircle size={20} className="text-rose-500" />}
              {notification.type === 'donor' && <User size={20} className="text-cyan-500" />}
              {notification.type === 'system' && <Settings size={20} className="text-gray-500" />}
            </motion.div>
          </motion.div>

          {/* Notification Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {notification.title}
                </h4>
                <TypeBadge type={notification.type} isDark={isDark} />
                <PriorityBadge priority={notification.priority} isDark={isDark} />
              </div>

              {/* Unread indicator */}
              {!notification.read && (
                <motion.div
                  animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: isHovered ? 1 : 0.1, repeat: isHovered ? Infinity : 0 }}
                  className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"
                />
              )}
            </div>

            <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {notification.message}
            </p>

            {/* Metadata */}
            {notification.metadata && (
              <div className="flex items-center gap-4 text-xs mb-3">
                {notification.metadata.donorName && (
                  <span className={`font-medium px-2 py-1 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    Donor: {notification.metadata.donorName}
                  </span>
                )}
                {notification.metadata.recipientName && (
                  <span className={`font-medium px-2 py-1 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    Recipient: {notification.metadata.recipientName}
                  </span>
                )}
                {notification.metadata.amount && (
                  <span className={`font-medium px-2 py-1 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    Amount: ₨{notification.metadata.amount.toLocaleString()}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-4">
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                }`}>
                {notification.category}
              </span>
              <motion.div
                animate={{
                  x: isHovered ? [0, 2, 0] : 0,
                }}
                transition={{
                  duration: isHovered ? 1.2 : 0.1,
                  repeat: isHovered ? Infinity : 0,
                  repeatDelay: isHovered ? 0.8 : 0
                }}
                className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
              >
                <Clock size={12} />
                {formatTime(notification.timestamp)}
              </motion.div>
            </div>
          </div>

          {/* Action Menu - FIXED VERSION */}
          <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <motion.button
              ref={buttonRef}
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-xl backdrop-blur-sm ${isDark
                ? 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                } border transition-colors z-50 relative`}
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
                  className={`absolute right-0 top-full mt-2 w-56 rounded-2xl z-[9999] ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                  style={{
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4), 0 10px 20px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => handleAction('read')}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-emerald-500/20 text-gray-300' : 'hover:bg-emerald-100 text-gray-700'}`}
                    >
                      {notification.read ? <Clock size={16} /> : <CheckCircle size={16} />}
                      {notification.read ? 'Mark as Unread' : 'Mark as Read'}
                    </button>

                    <div className={`my-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />

                    <button
                      onClick={() => handleAction('delete')}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-rose-500/20 text-rose-400' : 'hover:bg-rose-100 text-rose-700'}`}
                    >
                      <Trash2 size={16} />
                      Delete Notification
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Notifications Management Component
const RecipientNotifications = ({ isDark }) => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [showFilters, setShowFilters] = useState(false);

  // Filter options
  const typeOptions = ['All Types', 'donation', 'approval', 'verification', 'report', 'achievement', 'urgent', 'donor', 'system'];
  const priorityOptions = ['All Priorities', 'critical', 'high', 'medium', 'low'];

  // Auto scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle mark as read
  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
    setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
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
    setSelectedNotifications([]);
    setIsAllSelected(false);
  };

  // Handle delete notification
  const handleDeleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
    setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
  };

  // Handle delete multiple notifications
  const handleDeleteMultiple = () => {
    setNotifications(prev => prev.filter(notification => !selectedNotifications.includes(notification.id)));
    setSelectedNotifications([]);
    setIsAllSelected(false);
  };

  // Toggle selection for a single notification
  const toggleNotificationSelection = (notificationId) => {
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  // Toggle select all notifications
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedNotifications([]);
    } else {
      const allIds = notifications.map(n => n.id);
      setSelectedNotifications(allIds);
    }
    setIsAllSelected(!isAllSelected);
  };

  // Check if a notification is selected
  const isNotificationSelected = (notificationId) => {
    return selectedNotifications.includes(notificationId);
  };

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch =
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === 'All Types' || notification.type === selectedType;
      const matchesPriority = selectedPriority === 'All Priorities' || notification.priority === selectedPriority;

      return matchesSearch && matchesType && matchesPriority;
    });
  }, [notifications, searchTerm, selectedType, selectedPriority]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('All Types');
    setSelectedPriority('All Priorities');
  };

  return (
    <div className="space-y-6 px-4">
      {/* Management Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 shadow-2xl border ${isDark ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-100'
          }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Notifications Management
            </h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {notifications.length} total notifications • {notifications.filter(n => !n.read).length} unread
              {selectedNotifications.length > 0 && ` • ${selectedNotifications.length} selected`}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-2xl font-semibold shadow-xl"
            >
              <CheckCircle size={18} />
              Mark All as Read
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSelectAll}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-2xl font-semibold shadow-xl"
            >
              <CheckCircle2 size={18} />
              {isAllSelected ? 'Unselect All' : 'Select All'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDeleteMultiple}
              disabled={selectedNotifications.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold shadow-xl ${selectedNotifications.length === 0
                ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-rose-600 to-pink-500 text-white'
                }`}
            >
              <Trash2 size={18} />
              Delete Selected
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-3xl p-6 ${isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-white via-white to-gray-50'
          }`}
        style={{
          boxShadow: isDark
            ? '0 10px 40px rgba(0, 0, 0, 0.3)'
            : '0 10px 40px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative"
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-violet-500" size={18} />
              <input
                type="text"
                placeholder="Search notifications by title or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium transition-all ${isDark
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
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${showFilters
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
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={`p-6 rounded-2xl mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                        }`}
                    >
                      {typeOptions.map(option => (
                        <option key={option} value={option}>
                          {option === 'All Types' ? 'All Types' : option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Priority
                    </label>
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                        }`}
                    >
                      {priorityOptions.map(option => (
                        <option key={option} value={option}>
                          {option === 'All Priorities' ? 'All Priorities' : option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {filteredNotifications.length} of {notifications.length} notifications
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetFilters}
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

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`rounded-2xl shadow-2xl border ${isDark ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-white via-white to-gray-50 border-gray-100'
          }`}
      >
        <div className="p-6">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
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
                <Bell size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              </motion.div>
              <p className={`text-base font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                No notifications found
              </p>
              <p className={`text-sm font-medium mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {searchTerm || selectedType !== 'All Types' || selectedPriority !== 'All Priorities'
                  ? 'Try adjusting your filters'
                  : 'All caught up!'}
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
                  index={index}
                  isSelected={isNotificationSelected(notification.id)}
                  onSelect={toggleNotificationSelection}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RecipientNotifications;