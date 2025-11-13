import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RecipientsManagement from './RecipientsManagement';
import DonorsManagement from './DonorsManagement';
import UsersManagement from './UsersManagement';
import DonationsManagement from './DonationsManagement';
import RequestsManagement from './RequestsManagement';
import ReportsAnalytics from './ReportsAnalytics';
import NotificationsManagement from './NotificationsManagement';
import SettingsManagement from './SettingsManagement';
import ProfileManagement from './ProfileManagement';
import {
  LayoutDashboard,
  FileText,
  Wallet,
  Bell,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  Heart,
  TrendingDown,
  DollarSign,
  Activity,
  UserCheck,
  Clock,
  CheckCircle,
  Download,
  Eye,
  MoreVertical,
  FileCheck,
  Settings,
  User,
  LogOut,
  HeartHandshake,
  Menu,
  Award,
  Star,
  Target,
  X,
  CheckCircle2,
  UserCog,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

// ==================== DUMMY DATA ====================
const dummyData = {
  stats: {
    totalDonations: 1245780,
    totalDonors: 3456,
    totalRecipients: 892,
    pendingApprovals: 47,
    activeRequests: 156,
    completedRequests: 734,
    rejectedRequests: 23,
    totalAmount: 8945600,
  },

  donationTrend6Months: [
    { month: 'Jan', amount: 145000, donors: 340, recipients: 95 },
    { month: 'Feb', amount: 185000, donors: 420, recipients: 112 },
    { month: 'Mar', amount: 165000, donors: 380, recipients: 105 },
    { month: 'Apr', amount: 195000, donors: 450, recipients: 125 },
    { month: 'May', amount: 225000, donors: 520, recipients: 145 },
    { month: 'Jun', amount: 210000, donors: 490, recipients: 138 },
  ],

  donationTrend1Year: [
    { month: 'Jul', amount: 135000, donors: 320, recipients: 88 },
    { month: 'Aug', amount: 175000, donors: 410, recipients: 110 },
    { month: 'Sep', amount: 195000, donors: 440, recipients: 122 },
    { month: 'Oct', amount: 215000, donors: 480, recipients: 135 },
    { month: 'Nov', amount: 205000, donors: 470, recipients: 130 },
    { month: 'Dec', amount: 235000, donors: 510, recipients: 148 },
    { month: 'Jan', amount: 145000, donors: 340, recipients: 95 },
    { month: 'Feb', amount: 185000, donors: 420, recipients: 112 },
    { month: 'Mar', amount: 165000, donors: 380, recipients: 105 },
    { month: 'Apr', amount: 195000, donors: 450, recipients: 125 },
    { month: 'May', amount: 225000, donors: 520, recipients: 145 },
    { month: 'Jun', amount: 210000, donors: 490, recipients: 138 },
  ],

  donationTrendAllTime: [
    { year: '2020', amount: 1250000, donors: 1200, recipients: 350 },
    { year: '2021', amount: 1850000, donors: 1800, recipients: 520 },
    { year: '2022', amount: 2450000, donors: 2400, recipients: 680 },
    { year: '2023', amount: 3150000, donors: 3000, recipients: 850 },
    { year: '2024', amount: 3950000, donors: 3600, recipients: 1050 },
    { year: '2025', amount: 2100000, donors: 2000, recipients: 600 },
  ],

  statusDistribution: [
    { name: 'Approved', value: 734, color: '#10b981' },
    { name: 'Pending', value: 156, color: '#f59e0b' },
    { name: 'Validated', value: 89, color: '#3b82f6' },
    { name: 'In Progress', value: 67, color: '#8b5cf6' },
    { name: 'Rejected', value: 23, color: '#ef4444' },
    { name: 'Draft', value: 45, color: '#6b7280' },
  ],

  recipientVerification: [
    { name: 'Verified', value: 650, color: '#10b981' },
    { name: 'Pending Verification', value: 242, color: '#f59e0b' },
  ],

  donationComparison: [
    { category: 'Medical', required: 600000, donated: 456000 },
    { category: 'Education', required: 350000, donated: 298000 },
    { category: 'Emergency', required: 250000, donated: 187000 },
    { category: 'Food', required: 200000, donated: 145000 },
    { category: 'Housing', required: 150000, donated: 98000 },
  ],

  topRecipients: [
    { name: 'Ahmed Khan', totalReceived: 125000, completionRate: 95, category: 'Medical' },
    { name: 'Fatima Bibi', totalReceived: 98000, completionRate: 88, category: 'Education' },
    { name: 'Ali Hassan', totalReceived: 87000, completionRate: 92, category: 'Emergency' },
    { name: 'Zainab Malik', totalReceived: 76000, completionRate: 85, category: 'Food' },
    { name: 'Hassan Ahmed', totalReceived: 65000, completionRate: 90, category: 'Housing' },
  ],

  topDonors: [
    { name: 'Anonymous', totalDonated: 450000, donationCount: 25, joinDate: '2023-01-15' },
    { name: 'Sarah Ali', totalDonated: 320000, donationCount: 18, joinDate: '2023-03-22' },
    { name: 'Muhammad Hassan', totalDonated: 285000, donationCount: 15, joinDate: '2023-05-10' },
    { name: 'Ayesha Khan', totalDonated: 210000, donationCount: 12, joinDate: '2023-07-30' },
    { name: 'Ali Raza', totalDonated: 180000, donationCount: 10, joinDate: '2023-09-05' },
  ],

  recentDonations: [
    {
      id: 'DON-2025-001',
      donor: 'Anonymous',
      recipient: 'Ahmed Khan',
      amount: 50000,
      status: 'Completed',
      date: '2025-11-01',
      type: 'Medical'
    },
    {
      id: 'DON-2025-002',
      donor: 'Sarah Ali',
      recipient: 'Fatima Bibi',
      amount: 35000,
      status: 'Completed',
      date: '2025-11-01',
      type: 'Education'
    },
    {
      id: 'DON-2025-003',
      donor: 'Muhammad Hassan',
      recipient: 'Zainab Malik',
      amount: 75000,
      status: 'Processing',
      date: '2025-11-02',
      type: 'Emergency'
    },
    {
      id: 'DON-2025-004',
      donor: 'Anonymous',
      recipient: 'Ali Raza',
      amount: 25000,
      status: 'Completed',
      date: '2025-11-02',
      type: 'Food'
    },
    {
      id: 'DON-2025-005',
      donor: 'Ayesha Khan',
      recipient: 'Hassan Ahmed',
      amount: 60000,
      status: 'Processing',
      date: '2025-11-03',
      type: 'Medical'
    },
  ],

  notifications: [
    {
      id: 1,
      title: 'New Donation Received',
      message: 'Anonymous donated ₨50,000 for medical assistance',
      time: '2 minutes ago',
      read: false,
      type: 'donation'
    },
    {
      id: 2,
      title: 'Recipient Approved',
      message: 'Ahmed Khan has been approved for medical funding',
      time: '1 hour ago',
      read: false,
      type: 'approval'
    },
    {
      id: 3,
      title: 'Document Verification Required',
      message: '3 recipients require document verification',
      time: '3 hours ago',
      read: true,
      type: 'verification'
    },
    {
      id: 4,
      title: 'Weekly Report Generated',
      message: 'Weekly donation report is ready for review',
      time: '1 day ago',
      read: true,
      type: 'report'
    }
  ]
};

// ==================== CUSTOM SCROLLBAR STYLES ====================
const CustomScrollbarStyles = ({ isDark }) => (
  <style>{`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: ${isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}</style>
);

// ==================== ANIMATED TYPING TEXT ====================
const TypingText = ({ name, isDark }) => {
  const messages = [
    `Welcome back, ${name}!`,
    `Great to see you, ${name}!`,
    `Hello ${name}! Ready to make a difference?`,
    `Welcome to your dashboard, ${name}!`,
    `Hi ${name}! Let's check your impact today!`,
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const currentMessage = messages[currentMessageIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        if (displayText.length < currentMessage.length) {
          setDisplayText(currentMessage.substring(0, displayText.length + 1));
          setTypingSpeed(100);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentMessage.substring(0, displayText.length - 1));
          setTypingSpeed(50);
        } else {
          setIsDeleting(false);
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentMessageIndex, typingSpeed]);

  return (
    <h1 className={`text-xl sm:text-2xl font-bold text-white`}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-0.5 h-5 sm:h-6 bg-white ml-1 align-middle"
      />
    </h1>
  );
};

// ==================== TOOLTIP COMPONENT ====================
const TooltipHover = ({ text, children, isDark }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 5 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className={`fixed left-[75px] px-3 py-1.5 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} text-xs font-medium rounded-lg whitespace-nowrap z-[9999] shadow-xl pointer-events-none border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
            style={{
              transform: 'translateY(-50%)'
            }}
          >
            {text}
            <div className={`absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent ${isDark ? 'border-r-gray-800' : 'border-r-white'}`}></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== ANIMATED ICON LOGO ====================
const AnimatedLogo = () => (
  <motion.div
    className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden"
    whileHover={{ scale: 1.1, rotate: 5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-fuchsia-400 to-violet-700 opacity-0"
      animate={{
        opacity: [0, 0.3, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />

    <motion.div
      animate={{
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <HeartHandshake className="w-5 h-5 text-white relative z-10" />
    </motion.div>

    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
      animate={{
        x: ['-100%', '200%'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
        repeatDelay: 2
      }}
    />
  </motion.div>
);

// ==================== NOTIFICATION COMPONENT ====================
const NotificationPanel = ({ isOpen, onClose, notifications, onMarkAsRead, onMarkAllAsRead, isDark }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-20 right-4 w-80 sm:w-96 rounded-2xl shadow-2xl border z-50 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
          >
            <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 px-2 py-1 bg-rose-500 text-white text-xs rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllAsRead}
                      className={`text-xs px-2 py-1 rounded-lg ${isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className={`p-1 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                  >
                    <X size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={32} className={`mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No notifications</p>
                </div>
              ) : (
                <div className="p-2">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-xl mb-2 cursor-pointer transition-all ${notification.read
                        ? (isDark ? 'bg-gray-700/50' : 'bg-gray-50')
                        : (isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200')
                        }`}
                      onClick={() => onMarkAsRead(notification.id)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${notification.type === 'donation' ? 'bg-green-500/20' :
                          notification.type === 'approval' ? 'bg-blue-500/20' :
                            notification.type === 'verification' ? 'bg-amber-500/20' :
                              'bg-purple-500/20'
                          }`}>
                          <Bell size={16} className={
                            notification.type === 'donation' ? 'text-green-500' :
                              notification.type === 'approval' ? 'text-blue-500' :
                                notification.type === 'verification' ? 'text-amber-500' :
                                  'text-purple-500'
                          } />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-rose-500 rounded-full ml-2 flex-shrink-0" />
                            )}
                          </div>
                          <p className={`text-xs mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                className={`w-full py-2 rounded-lg text-sm font-medium ${isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                View All Notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ==================== ENHANCED NOTIFICATION ICON ====================
const EnhancedNotificationIcon = ({ isDark, onClick, unreadCount }) => {
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRinging(true);
      setTimeout(() => setIsRinging(false), 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-3 rounded-xl bg-white/10 backdrop-blur-sm transition-all border border-white/20"
    >
      <motion.div
        animate={isRinging ? {
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
        } : {}}
        transition={{ duration: 0.6 }}
      >
        <Bell size={20} className="text-white" />
      </motion.div>

      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-rose-400"
        >
          <motion.div
            className="absolute inset-0 bg-rose-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}

      {isRinging && (
        <motion.div
          className="absolute inset-0 border-2 border-rose-400 rounded-xl"
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  );
};

// ==================== LOGOUT CONFIRMATION MODAL ====================
const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm, isDark }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirm = async () => {
    setIsLoggingOut(true);
    
    // Simulate logout process with delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Perform actual logout
    onConfirm();
  };

  const handleCancel = () => {
    if (!isLoggingOut) {
      onClose();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Backdrop - This will prevent ALL interactions with background content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            onClick={handleCancel}
          />
          
          {/* Centered Modal - Using flexbox for perfect centering */}
          <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`w-full max-w-md rounded-2xl shadow-2xl border ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-full ${
                    isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600'
                  }`}>
                    <LogOut size={20} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Confirm Logout
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Are you sure you want to logout?
                    </p>
                  </div>
                </div>

                {/* Loading State */}
                {isLoggingOut && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                      />
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                          Logging you out...
                        </p>
                        <p className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                          Please wait while we secure your session
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Success Message - Shown briefly before redirect */}
                {isLoggingOut && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-emerald-500" />
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                          Logout Successful!
                        </p>
                        <p className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          You have been logged out successfully!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                {!isLoggingOut && (
                  <div className="flex justify-end gap-3 mt-6">
                    <motion.button
                      onClick={handleCancel}
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
                      onClick={handleConfirm}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-500 text-white rounded-lg font-semibold flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Yes, Logout
                    </motion.button>
                  </div>
                )}

                {/* Redirect Countdown */}
                {isLoggingOut && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="text-center mt-4"
                  >
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Redirecting to login page...
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// ==================== SIDEBAR COMPONENT ====================
const ModernSidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, user, isDark, setIsDark }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
        setSidebarOpen(false);
      } else {
        setIsOpen(true);
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setSidebarOpen]);

  // Updated sidebar menu items - removed Configuration
  const mainMenuItems = [
    { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
    { name: "Recipients Management", icon: Users, id: "recipients" },
    { name: "Donors Management", icon: Heart, id: "donors" },
    { name: "Users Management", icon: UserCog, id: "users" },
    { name: "Donations Management", icon: Wallet, id: "donations" },
    { name: "Requests / Approvals", icon: FileCheck, id: "approvals" },
    { name: "Reports & Analytics", icon: BarChart3, id: "reports" },
    { name: "Notifications", icon: Bell, id: "notifications" },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsOpen(!isOpen);
      setSidebarOpen(!isOpen);
    }
  };

  const handleItemClick = (itemId) => {
    setActiveTab(itemId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // In the ModernSidebar component, update the logout section:

// UPDATED LOGOUT FUNCTIONALITY
const handleLogout = () => {
  setShowLogoutModal(true);
};

const handleLogoutConfirm = () => {
  // Clear all authentication-related data
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('userRole');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('userData');
  
  // Clear any app-specific data
  localStorage.removeItem('donationDashboardSettings');
  localStorage.removeItem('tablePreferences');
  
  console.log('User logged out successfully');
  
  // Redirect to login page after a brief delay to show success message
  setTimeout(() => {
    window.location.href = '/login';
  }, 2000);
};

const handleLogoutCancel = () => {
  setShowLogoutModal(false);
};

  const theme = {
    dark: {
      sidebar: 'bg-gradient-to-b from-slate-800 to-slate-900 backdrop-blur-xl',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      border: 'border-slate-700',
      active: 'bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-lg',
      hover: 'hover:bg-white/5',
    },
    light: {
      sidebar: 'bg-gradient-to-b from-white to-gray-50 backdrop-blur-xl',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      active: 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg',
      hover: 'hover:bg-black/5',
    }
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  return (
    <>
      <CustomScrollbarStyles isDark={isDark} />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isDark={isDark}
      />

      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? (sidebarOpen ? 280 : 0) : (isOpen ? 240 : 70),
          x: isMobile ? (sidebarOpen ? 0 : -280) : 0
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 h-screen z-50 flex flex-col ${currentTheme.sidebar} border-r ${currentTheme.border} shadow-2xl overflow-hidden`}
      >
        {!isMobile && (
          <motion.button
            onClick={toggleSidebar}
            className={`absolute top-5 ${isOpen ? 'right-[-14px]' : 'right-[-14px]'} ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'
              } backdrop-blur-sm rounded-full p-1.5 shadow-lg border z-10`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? (
              <ChevronLeft size={14} className={isDark ? "text-white" : "text-gray-700"} />
            ) : (
              <ChevronRight size={14} className={isDark ? "text-white" : "text-gray-700"} />
            )}
          </motion.button>
        )}

        <AnimatePresence>
          {(isOpen || sidebarOpen) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={toggleTheme}
              className={`absolute top-5 right-4 p-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg z-10 border ${isDark ? 'border-amber-500' : 'border-amber-600'
                }`}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? (
                <Sun size={14} className="text-white" />
              ) : (
                <Moon size={14} className="text-white" />
              )}
            </motion.button>
          )}
        </AnimatePresence>

        <div className={`p-4 border-b ${currentTheme.border} flex items-center flex-shrink-0 ${isOpen || sidebarOpen ? 'justify-start' : 'justify-center'}`}>
          <AnimatePresence mode="wait">
            {(isOpen || sidebarOpen) ? (
              <motion.div
                key="header-expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <AnimatedLogo />
                <div className="flex-1 min-w-0">
                  <p className={`text-[9px] font-bold uppercase tracking-[0.1em] ${currentTheme.textSecondary} mb-0.5`}>
                    SUPER ADMIN
                  </p>
                  <h2 className={`font-semibold text-[13px] ${currentTheme.text}`}>Admin Panel</h2>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="header-collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center"
              >
                <TooltipHover text="Dashboard" isDark={isDark}>
                  <AnimatedLogo />
                </TooltipHover>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`flex-1 overflow-y-auto px-3 py-4 ${isOpen || sidebarOpen ? 'custom-scrollbar' : 'hide-scrollbar'}`}>
          <AnimatePresence mode="wait">
            {(isOpen || sidebarOpen) ? (
              <motion.div
                key="nav-expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full space-y-6"
              >
                <div>
                  <h3 className={`text-[9px] font-bold uppercase tracking-[0.15em] ${currentTheme.textSecondary} mb-3 px-2`}>
                    MAIN MENU
                  </h3>

                  <div className="space-y-1">
                    {mainMenuItems.map((item) => (
                      <motion.button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${activeTab === item.id
                            ? `${currentTheme.active} text-white shadow-lg`
                            : `${currentTheme.text} ${currentTheme.hover}`
                          }`}
                        whileHover={{ x: 3, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <item.icon size={17} strokeWidth={2.5} />
                        <span>{item.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`text-[9px] font-bold uppercase tracking-[0.15em] ${currentTheme.textSecondary} mb-3 px-2`}>
                    ACCOUNT
                  </h3>
                  <div className="space-y-1">
                    <motion.button
                      onClick={() => handleItemClick('profile')}
                      whileHover={{ x: 3, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${activeTab === 'profile'
                          ? `${currentTheme.active} text-white shadow-lg`
                          : `${currentTheme.text} ${currentTheme.hover}`
                        }`}
                    >
                      <User size={17} strokeWidth={2.5} />
                      <span>Profile</span>
                    </motion.button>

                    <motion.button
                      onClick={() => handleItemClick('settings')}
                      whileHover={{ x: 3, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${activeTab === 'settings'
                          ? `${currentTheme.active} text-white shadow-lg`
                          : `${currentTheme.text} ${currentTheme.hover}`
                        }`}
                    >
                      <Settings size={17} strokeWidth={2.5} />
                      <span>Settings</span>
                    </motion.button>

                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ x: 3, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-rose-500 ${currentTheme.hover}`}
                    >
                      <LogOut size={17} strokeWidth={2.5} />
                      <span>Logout</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="nav-collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 w-full"
              >
                <div className="space-y-2 flex flex-col items-center">
                  {mainMenuItems.map((item) => (
                    <TooltipHover key={item.id} text={item.name} isDark={isDark}>
                      <motion.button
                        onClick={() => handleItemClick(item.id)}
                        className={`p-2.5 rounded-xl transition-all w-11 h-11 flex items-center justify-center ${activeTab === item.id
                            ? `${currentTheme.active} text-white shadow-lg`
                            : `${currentTheme.hover}`
                          }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <item.icon size={18} className={activeTab === item.id ? 'text-white' : currentTheme.text} strokeWidth={2.5} />
                      </motion.button>
                    </TooltipHover>
                  ))}
                </div>

                <div className="space-y-2 flex flex-col items-center pt-4 border-t border-gray-700/20">
                  <TooltipHover text="Profile" isDark={isDark}>
                    <motion.button
                      onClick={() => handleItemClick('profile')}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2.5 rounded-xl transition-all ${activeTab === 'profile'
                          ? `${currentTheme.active} text-white shadow-lg`
                          : `${currentTheme.hover}`
                        } w-11 h-11 flex items-center justify-center`}
                    >
                      <User size={18} className={activeTab === 'profile' ? 'text-white' : currentTheme.text} strokeWidth={2.5} />
                    </motion.button>
                  </TooltipHover>
                  <TooltipHover text="Settings" isDark={isDark}>
                    <motion.button
                      onClick={() => handleItemClick('settings')}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2.5 rounded-xl transition-all ${activeTab === 'settings'
                          ? `${currentTheme.active} text-white shadow-lg`
                          : `${currentTheme.hover}`
                        } w-11 h-11 flex items-center justify-center`}
                    >
                      <Settings size={18} className={activeTab === 'settings' ? 'text-white' : currentTheme.text} strokeWidth={2.5} />
                    </motion.button>
                  </TooltipHover>
                  <TooltipHover text="Logout" isDark={isDark}>
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2.5 rounded-xl transition-all ${currentTheme.hover} w-11 h-11 flex items-center justify-center`}
                    >
                      <LogOut size={18} className="text-rose-500" strokeWidth={2.5} />
                    </motion.button>
                  </TooltipHover>

                  <TooltipHover text={isDark ? "Light Mode" : "Dark Mode"} isDark={isDark}>
                    <motion.button
                      onClick={toggleTheme}
                      className={`p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg w-11 h-11 flex items-center justify-center mt-2 border ${isDark ? 'border-amber-500' : 'border-amber-600'
                        }`}
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isDark ? (
                        <Sun size={18} className="text-white" strokeWidth={2.5} />
                      ) : (
                        <Moon size={18} className="text-white" strokeWidth={2.5} />
                      )}
                    </motion.button>
                  </TooltipHover>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {isMobile && !sidebarOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(true)}
          className={`fixed top-4 left-4 z-40 p-3 ${currentTheme.sidebar} rounded-xl shadow-lg border ${currentTheme.border} md:hidden`}
        >
          <Menu size={20} className={currentTheme.text} />
        </motion.button>
      )}
    </>
  );
};

// ==================== STAT CARD - THEME AWARE ====================
const StatCard = ({ icon: Icon, title, value, change, changeType, color, delay, isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.5, type: "spring" }}
    whileHover={{ y: -8, scale: 1.03 }}
    className={`rounded-2xl p-6 shadow-2xl border relative overflow-hidden group ${isDark
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

// Enhanced Chart Card Wrapper - THEME AWARE
const ChartCard = ({ title, children, actions, height = "auto", isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, type: "spring" }}
    className={`rounded-2xl p-6 shadow-2xl border ${isDark
      ? 'bg-gray-800 border-gray-700'
      : 'bg-white border-gray-100'
      }`}
    style={{ height }}
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
    {children}
  </motion.div>
);

// Enhanced Secondary Stats - THEME AWARE
const EnhancedStatBox = ({ icon: Icon, title, value, color, delay, index, isDark }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay: delay, duration: 0.6, type: "spring" }}
    className={`rounded-2xl p-6 shadow-2xl border relative overflow-hidden group cursor-pointer ${isDark
      ? 'bg-gray-800 border-gray-700'
      : 'bg-white border-gray-100'
      }`}
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      className={`absolute inset-0 bg-gradient-to-r from-transparent ${isDark ? 'via-gray-700' : 'via-gray-50'
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

// ==================== ESSENTIAL ADMIN GRAPHS ====================

// 1. Donations Over Time - Modern Line Chart with Animation
const DonationsOverTimeChart = ({ data, isDark, timeRange }) => {
  const xAxisKey = timeRange === 'alltime' ? 'year' : 'month';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <defs>
          <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? '#374151' : '#e5e7eb'}
          vertical={false}
        />
        <XAxis
          dataKey={xAxisKey}
          stroke={isDark ? '#d1d5db' : '#6b7280'}
          fontSize={12}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          stroke={isDark ? '#d1d5db' : '#6b7280'}
          fontSize={12}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `₨${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            color: isDark ? '#fff' : '#000',
          }}
          formatter={(value) => [`₨${value.toLocaleString()}`, 'Amount']}
          labelFormatter={(label) => `${timeRange === 'alltime' ? 'Year' : 'Month'}: ${label}`}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#8b5cf6"
          strokeWidth={3}
          dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
          activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2 }}
          animationBegin={200}
          animationDuration={2000}
        />
        <Area
          type="monotone"
          dataKey="amount"
          fill="url(#donationGradient)"
          stroke="none"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// 2. Request Status Distribution - Modern Donut Chart
const RequestStatusChart = ({ data, isDark }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RePieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={100}
        paddingAngle={2}
        dataKey="value"
        animationBegin={300}
        animationDuration={1500}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{
          backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          color: isDark ? '#fff' : '#000',
        }}
        formatter={(value, name) => [value, name]}
      />
      <Legend
        verticalAlign="bottom"
        height={36}
        formatter={(value, entry) => (
          <span style={{
            color: isDark ? '#d1d5db' : '#4b5563',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            {value}
          </span>
        )}
      />
    </RePieChart>
  </ResponsiveContainer>
);

// 3. Recipient Verification Progress - Horizontal Bar Chart (Centered)
const RecipientVerificationChart = ({ data, isDark }) => (
  <div className="flex justify-center items-center h-full">
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid
          horizontal={false}
          stroke={isDark ? '#374151' : '#e5e7eb'}
        />
        <XAxis
          type="number"
          stroke={isDark ? '#d1d5db' : '#6b7280'}
          fontSize={12}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          stroke={isDark ? '#d1d5db' : '#6b7280'}
          fontSize={12}
          axisLine={false}
          tickLine={false}
          width={120}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            color: isDark ? '#fff' : '#000',
          }}
          formatter={(value) => [value, 'Count']}
        />
        <Bar
          dataKey="value"
          radius={[0, 8, 8, 0]}
          animationBegin={400}
          animationDuration={1800}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

// 4. Donation vs Required Amount - Dual Axis Bar Chart
const DonationComparisonChart = ({ data, isDark }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ComposedChart data={data}>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke={isDark ? '#374151' : '#e5e7eb'}
        vertical={false}
      />
      <XAxis
        dataKey="category"
        stroke={isDark ? '#d1d5db' : '#6b7280'}
        fontSize={12}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        stroke={isDark ? '#d1d5db' : '#6b7280'}
        fontSize={12}
        axisLine={false}
        tickLine={false}
        tickFormatter={(value) => `₨${(value / 1000).toFixed(0)}K`}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          color: isDark ? '#fff' : '#000',
        }}
        formatter={(value, name) => [
          `₨${value.toLocaleString()}`,
          name === 'required' ? 'Required Amount' : 'Donated Amount'
        ]}
      />
      <Legend
        verticalAlign="top"
        height={36}
        formatter={(value) => (
          <span style={{
            color: isDark ? '#d1d5db' : '#4b5563',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            {value === 'required' ? 'Required Amount' : 'Donated Amount'}
          </span>
        )}
      />
      <Bar
        dataKey="required"
        fill="#ef4444"
        radius={[4, 4, 0, 0]}
        opacity={0.7}
        animationBegin={500}
        animationDuration={1600}
        name="required"
      />
      <Bar
        dataKey="donated"
        fill="#10b981"
        radius={[4, 4, 0, 0]}
        animationBegin={500}
        animationDuration={1600}
        name="donated"
      />
    </ComposedChart>
  </ResponsiveContainer>
);

// ==================== TOP RECIPIENTS AND DONORS COMPONENTS ====================

const TopRecipientsCard = ({ data, isDark }) => (
  <ChartCard title="Top 5 Recipients" isDark={isDark}>
    <div className="space-y-4">
      {data.map((recipient, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center gap-4 p-3 rounded-xl transition-colors group ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            }`}
        >
          <motion.div
            className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            {index + 1}
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className={`font-semibold transition-colors group-hover:text-violet-600 ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  {recipient.name}
                </span>
                <span className={`text-xs ml-2 px-2 py-1 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                  {recipient.category}
                </span>
              </div>
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ₨{recipient.totalReceived.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex-1 rounded-full h-2 ${isDark ? 'bg-gray-600' : 'bg-gray-200'} relative overflow-hidden`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${recipient.completionRate}%` }}
                  transition={{ duration: 1.5, delay: index * 0.2, type: "spring", stiffness: 50 }}
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-400 h-2 rounded-full shadow-lg absolute top-0 left-0"
                />
                {/* Continuous Animation Bar - FIXED */}
                <motion.div
                  className="absolute top-0 left-0 w-4 h-2 bg-white/30 rounded-full"
                  animate={{
                    x: ['0%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut"
                  }}
                  style={{
                    width: `${recipient.completionRate}%`,
                    maxWidth: '100%'
                  }}
                />
              </div>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {recipient.completionRate}%
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </ChartCard>
);

const TopDonorsCard = ({ data, isDark }) => (
  <ChartCard title="Top 5 Donors" isDark={isDark}>
    <div className="space-y-4">
      {data.map((donor, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center gap-4 p-3 rounded-xl transition-colors group ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            }`}
        >
          <motion.div
            className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Award size={18} />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className={`font-semibold transition-colors group-hover:text-emerald-600 ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  {donor.name}
                </span>
                <span className={`text-xs ml-2 px-2 py-1 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                  {donor.donationCount} donations
                </span>
              </div>
              <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ₨{donor.totalDonated.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Joined: {new Date(donor.joinDate).toLocaleDateString()}
              </span>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-1"
              >
                <Star size={12} className="text-amber-500 fill-amber-500" />
                <span className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                  Top Contributor
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </ChartCard>
);

// ==================== MAIN DASHBOARD ====================
const DonationDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');
  const [notifications, setNotifications] = useState(dummyData.notifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  // NEW: Auto scroll to top when component mounts or activeTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        setUser({
          id: '1',
          name: 'Andrew',
          email: 'admin@donationtracker.com',
          role: 'SUPER_ADMIN',
        });

      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#111827';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#ffffff';
    }
  }, [isDark]);

  const getDonationData = () => {
    switch (timeRange) {
      case '6months':
        return dummyData.donationTrend6Months;
      case '1year':
        return dummyData.donationTrend1Year;
      case 'alltime':
        return dummyData.donationTrendAllTime;
      default:
        return dummyData.donationTrend6Months;
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notificationId) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const handleViewDonation = (donation) => {
    setSelectedDonation(donation);
    alert(`Viewing donation: ${donation.id}\nDonor: ${donation.donor}\nRecipient: ${donation.recipient}\nAmount: ₨${donation.amount.toLocaleString()}`);
  };

  const handleMoreActions = (donation) => {
    alert(`More actions for donation: ${donation.id}\nAvailable actions: Edit, Delete, Export, Print`);
  };

  // Define DashboardContent inside the main component
  const DashboardContent = () => (
    <div className="space-y-6">
      {/* ALL 4 STAT CARDS - THEME AWARE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Donations"
          value={`₨ ${(dummyData.stats.totalAmount / 1000).toFixed(0)}K`}
          change={12.5}
          changeType="increase"
          color="from-emerald-500 to-teal-500"
          delay={0.1}
          isDark={isDark}
        />
        <StatCard
          icon={Users}
          title="Total Donors"
          value={dummyData.stats.totalDonors}
          change={8.3}
          changeType="increase"
          color="from-blue-500 to-cyan-500"
          delay={0.2}
          isDark={isDark}
        />
        <StatCard
          icon={UserCheck}
          title="Recipients Helped"
          value={dummyData.stats.totalRecipients}
          change={15.7}
          changeType="increase"
          color="from-violet-500 to-purple-500"
          delay={0.3}
          isDark={isDark}
        />
        <StatCard
          icon={Clock}
          title="Pending Approvals"
          value={dummyData.stats.pendingApprovals}
          change={-5.2}
          changeType="decrease"
          color="from-amber-500 to-orange-500"
          delay={0.4}
          isDark={isDark}
        />
      </div>

      {/* Secondary Stats - THEME AWARE */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <EnhancedStatBox
          icon={Activity}
          title="Active Requests"
          value={dummyData.stats.activeRequests}
          color="from-blue-600 to-cyan-500"
          delay={0.5}
          index={0}
          isDark={isDark}
        />
        <EnhancedStatBox
          icon={CheckCircle}
          title="Completed"
          value={dummyData.stats.completedRequests}
          color="from-emerald-500 to-green-500"
          delay={0.6}
          index={1}
          isDark={isDark}
        />
        <EnhancedStatBox
          icon={TrendingDown}
          title="Rejected"
          value={dummyData.stats.rejectedRequests}
          color="from-rose-500 to-pink-600"
          delay={0.7}
          index={2}
          isDark={isDark}
        />
      </div>

      {/* ESSENTIAL ADMIN GRAPHS - 4 KEY CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Donations Over Time */}
        <ChartCard
          title="Donations Over Time"
          actions={
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`px-3 py-1.5 rounded-lg border text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none ${isDark
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
                }`}
            >
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="alltime">All Time</option>
            </select>
          }
          isDark={isDark}
        >
          <DonationsOverTimeChart data={getDonationData()} isDark={isDark} timeRange={timeRange} />
        </ChartCard>

        {/* 2. Request Status Distribution */}
        <ChartCard title="Request Status Distribution" isDark={isDark}>
          <RequestStatusChart data={dummyData.statusDistribution} isDark={isDark} />
        </ChartCard>

        {/* 3. Recipient Verification Progress - CENTERED */}
        <ChartCard title="Recipient Verification Progress" isDark={isDark}>
          <RecipientVerificationChart data={dummyData.recipientVerification} isDark={isDark} />
        </ChartCard>

        {/* 4. Donation vs Required Amount */}
        <ChartCard title="Donation vs Required Amount" isDark={isDark}>
          <DonationComparisonChart data={dummyData.donationComparison} isDark={isDark} />
        </ChartCard>
      </div>

      {/* Top Recipients and Donors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopRecipientsCard data={dummyData.topRecipients} isDark={isDark} />
        <TopDonorsCard data={dummyData.topDonors} isDark={isDark} />
      </div>

      {/* Recent Donations Table - FIXED SHAKING ISSUE */}
      <ChartCard
        title="Recent Donations"
        actions={
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Download size={16} />
            Export
          </motion.button>
        }
        isDark={isDark}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>ID</th>
                <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Donor</th>
                <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Recipient</th>
                <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Amount</th>
                <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Type</th>
                <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Status</th>
                <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Date</th>
                <th className={`text-left py-3 px-4 text-xs font-semibold uppercase ${isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyData.recentDonations.map((donation, index) => (
                <motion.tr
                  key={donation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
                    } transition-colors group`}
                >
                  <td className={`py-3 px-4 text-sm font-medium transition-colors group-hover:text-violet-600 ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    {donation.id}
                  </td>
                  <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>{donation.donor}</td>
                  <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>{donation.recipient}</td>
                  <td className={`py-3 px-4 text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>₨{donation.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <motion.span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${isDark
                        ? 'bg-violet-900 text-violet-200'
                        : 'bg-violet-100 text-violet-700'
                        }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {donation.type}
                    </motion.span>
                  </td>
                  <td className="py-3 px-4">
                    <motion.span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${donation.status === 'Completed'
                        ? (isDark ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-700')
                        : (isDark ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-700')
                        }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {donation.status}
                    </motion.span>
                  </td>
                  <td className={`py-3 px-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>{donation.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleViewDonation(donation)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          }`}
                        title="View Details"
                      >
                        <Eye size={16} className={isDark ? "text-gray-300" : "text-gray-600"} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleMoreActions(donation)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                          }`}
                        title="More Actions"
                      >
                        <MoreVertical size={16} className={isDark ? "text-gray-300" : "text-gray-600"} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );

  // Render function for active content
  const renderActiveContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'recipients':
        return <RecipientsManagement isDark={isDark} />;
      case 'donors':
        return <DonorsManagement isDark={isDark} />;
      case 'users':
        return <UsersManagement isDark={isDark} />;
      case 'donations':
        return <DonationsManagement isDark={isDark} />;
      case 'approvals':
        return <RequestsManagement isDark={isDark} />;
      case 'reports':
        return <ReportsAnalytics isDark={isDark} />;
      case 'notifications':
        return <NotificationsManagement isDark={isDark} />;
      case 'settings':
        return <SettingsManagement isDark={isDark} />;
      case 'profile':
        return <ProfileManagement isDark={isDark} />;
      default:
        return <DashboardContent />;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30'
        }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-violet-600 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <p className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Loading Dashboard</p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Preparing your data...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
      : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30'
      }`}>
      <ModernSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      <motion.div
        className="min-h-screen transition-all duration-300"
        style={{
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? (sidebarOpen ? 240 : 70) : 0
        }}
      >
        {/* FIXED HEADER - STAYS PURPLE IN DARK MODE */}
        <div className={`sticky top-0 z-30 shadow-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500`}>
          <div className="px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <TypingText name={user?.name} isDark={false} />
                </motion.div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <EnhancedNotificationIcon
                  isDark={isDark}
                  onClick={() => setShowNotifications(!showNotifications)}
                  unreadCount={unreadNotificationsCount}
                />
              </div>
            </div>
          </div>
        </div>

        <NotificationPanel
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          isDark={isDark}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveContent()}
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default DonationDashboard;