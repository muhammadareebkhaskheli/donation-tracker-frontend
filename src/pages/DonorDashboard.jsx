import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrowseRecipients from './BrowseRecipients';
import DonorProfileVerificationPage from './DonorProfileVerificationPage';
import NotificationsPage from './NotificationsPage';
import RecipientSettings from './RecipientSettings';
import {
    LayoutDashboard,
    Users,
    Wallet,
    Bell,
    Sun,
    Moon,
    Settings,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    ShieldCheck,
    TrendingDown,
    Heart,
    Activity,
    User,
    LogOut,
    Menu,
    X,
    TrendingUp,
    HeartHandshake,
    IndianRupee,
} from 'lucide-react';

// ==================== DUMMY DATA FOR DONORS ====================
const donorData = {
    userInfo: {
        name: 'John Doe',
        email: 'donor@example.com',
        phone: '+91 98765 43210', // Changed to Indian format
        status: 'Active Donor',
        verificationLevel: 'Verified',
        joinDate: '2023-01-15',
        totalDonations: 8,
        recipientsHelped: 3,
    },

    stats: {
        totalDonations: 125700,
        donationCount: 8,
        recipients: 3,
        impactScore: 85,
        lastDonationDate: '2024-01-15',
        averageDonation: 15625,
        monthlyChange: 25.3,
    },

    recentDonations: [
        { date: 'Jan 10', amount: 20000, recipient: 'Ahmed Khan', category: 'Medical' },
        { date: 'Jan 5', amount: 15000, recipient: 'Fatima Bibi', category: 'Education' },
        { date: 'Dec 28', amount: 25000, recipient: 'Ali Hassan', category: 'Emergency' },
        { date: 'Dec 15', amount: 18000, recipient: 'Zainab Malik', category: 'Food' },
        { date: 'Dec 5', amount: 22000, recipient: 'Hassan Ahmed', category: 'Housing' },
    ],

    recipients: [
        { name: 'Ahmed Khan', totalReceived: 125700, yourDonations: 20000, needs: 15000, category: 'Medical' },
        { name: 'Fatima Bibi', totalReceived: 98000, yourDonations: 15000, needs: 20000, category: 'Education' },
        { name: 'Ali Hassan', totalReceived: 87000, yourDonations: 25000, needs: 5000, category: 'Emergency' },
    ],

    notifications: [
        {
            id: 1,
            title: 'Donation Successful',
            message: 'Your donation of ₹20,000 to Ahmed Khan has been processed',
            time: '2 hours ago',
            read: false,
            type: 'success'
        },
        {
            id: 2,
            title: 'Impact Update',
            message: 'Fatima Bibi has received 75% of her education fund',
            time: '1 day ago',
            read: false,
            type: 'update'
        },
        {
            id: 3,
            title: 'New Recipient',
            message: 'A new medical recipient needs your support',
            time: '2 days ago',
            read: true,
            type: 'new'
        },
        {
            id: 4,
            title: 'Thank You',
            message: 'Ali Hassan sent you a thank you message',
            time: '3 days ago',
            read: true,
            type: 'thank'
        }
    ]
};

// ==================== UNIVERSAL NUMBER FORMATTER ====================
const formatUniversalNumber = (num, isCurrency = false) => {
    // Handle invalid inputs
    if (num === null || num === undefined || isNaN(num) || !isFinite(num)) {
        return isCurrency ? '0' : '0';
    }

    const absNum = Math.abs(num);
    const isNegative = num < 0;
    const prefix = isNegative ? '-' : '';
    const currencyPrefix = isCurrency ? '' : '';

    // Function to truncate to given decimal places without rounding
    const truncateDecimals = (number, decimals) => {
        const factor = Math.pow(10, decimals);
        return Math.floor(number * factor) / factor;
    };

    // Function to format with 2 decimal places without rounding
    const formatWithTwoDecimals = (value) => {
        // Convert to string, split by decimal point
        const [whole, decimal] = value.toFixed(10).split('.');
        // Take first 2 decimal places without rounding
        const decimalPart = decimal ? decimal.slice(0, 2) : '00';
        // Remove trailing zeros
        const trimmedDecimal = decimalPart.replace(/0+$/, '');
        return trimmedDecimal ? `${whole}.${trimmedDecimal}` : whole;
    };

    // Function to format with 1 decimal place without rounding
    const formatWithOneDecimal = (value) => {
        const [whole, decimal] = value.toFixed(10).split('.');
        const decimalPart = decimal ? decimal.slice(0, 1) : '0';
        // Remove trailing zeros
        const trimmedDecimal = decimalPart.replace(/0+$/, '');
        return trimmedDecimal ? `${whole}.${trimmedDecimal}` : whole;
    };

    // For currency/Indian context - use these special cases
    if (isCurrency) {
        if (absNum >= 1e24) {
            return `${prefix}${currencyPrefix}${formatWithTwoDecimals(absNum / 1e24)} Y`;
        } else if (absNum >= 1e21) {
            return `${prefix}${currencyPrefix}${formatWithTwoDecimals(absNum / 1e21)} Z`;
        } else if (absNum >= 1e18) {
            return `${prefix}${currencyPrefix}${formatWithTwoDecimals(absNum / 1e18)} E`;
        } else if (absNum >= 1e15) {
            return `${prefix}${currencyPrefix}${formatWithTwoDecimals(absNum / 1e15)} P`;
        } else if (absNum >= 1e12) {
            return `${prefix}${currencyPrefix}${formatWithTwoDecimals(absNum / 1e12)} T`;
        } else if (absNum >= 1e9) {
            return `${prefix}${currencyPrefix}${formatWithTwoDecimals(absNum / 1e9)} B`;
        } else if (absNum >= 1e7) {
            // For crores, show 2 decimal places for values < 100Cr, 1 decimal for larger
            const croreValue = absNum / 1e7;
            if (croreValue < 100) {
                return `${prefix}${currencyPrefix}${formatWithTwoDecimals(croreValue)} Cr`;
            } else {
                return `${prefix}${currencyPrefix}${formatWithOneDecimal(croreValue)} Cr`;
            }
        } else if (absNum >= 1e5) {
            // For lakhs, show 2 decimal places for values < 10L, 1 decimal for larger
            const lakhValue = absNum / 1e5;
            if (lakhValue < 10) {
                return `${prefix}${currencyPrefix}${formatWithTwoDecimals(lakhValue)} L`;
            } else {
                return `${prefix}${currencyPrefix}${formatWithOneDecimal(lakhValue)} L`;
            }
        } else if (absNum >= 1e3) {
            // For thousands, show 1 decimal place for values < 10K, whole number for larger
            const thousandValue = absNum / 1e3;
            if (thousandValue < 10) {
                return `${prefix}${currencyPrefix}${formatWithOneDecimal(thousandValue)} K`;
            } else {
                return `${prefix}${currencyPrefix}${Math.floor(thousandValue)} K`;
            }
        } else {
            // For numbers less than 1000, show full number
            return `${prefix}${currencyPrefix}${absNum.toLocaleString('en-IN')}`;
        }
    }
    // For non-currency numbers (counts, metrics, etc.)
    else {
        if (absNum >= 1e12) {
            return `${prefix}${formatWithTwoDecimals(absNum / 1e12)}T`;
        } else if (absNum >= 1e9) {
            return `${prefix}${formatWithTwoDecimals(absNum / 1e9)}B`;
        } else if (absNum >= 1e6) {
            return `${prefix}${formatWithTwoDecimals(absNum / 1e6)}M`;
        } else if (absNum >= 1e3) {
            const thousandValue = absNum / 1e3;
            if (thousandValue < 10) {
                return `${prefix}${formatWithOneDecimal(thousandValue)}K`;
            } else {
                return `${prefix}${Math.floor(thousandValue)}K`;
            }
        } else {
            return `${prefix}${absNum.toLocaleString('en-IN')}`;
        }
    }
};

// Get full formatted number for tooltip
const getNumberFullText = (num, isCurrency = false) => {
    if (num === null || num === undefined || isNaN(num) || !isFinite(num)) {
        return isCurrency ? '0' : '0';
    }

    const absNum = Math.abs(num);
    const isNegative = num < 0;
    const prefix = isNegative ? '-' : '';
    const currencyPrefix = isCurrency ? '₹ ' : '';

    // For extremely large numbers, use scientific notation
    if (absNum >= 1e15) {
        return `${prefix}${currencyPrefix}${num.toExponential(2)}`;
    }

    return `${prefix}${currencyPrefix}${Math.abs(num).toLocaleString('en-IN')}`;
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
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            {displayText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
                className="inline-block w-0.5 h-6 bg-emerald-500 ml-1 align-middle"
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
        className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <motion.div
            className="absolute inset-0 bg-gradient-to-br from-teal-400 to-emerald-700 opacity-0"
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
            <HeartHandshake size={20} className="text-white relative z-10" />
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

// ==================== NOTIFICATION PANEL ====================
const NotificationPanel = ({ isOpen, onClose, notifications, onMarkAsRead, isDark }) => {
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
                                            onClick={() => notifications.forEach(n => onMarkAsRead(n.id))}
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
                                                : (isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200')
                                                }`}
                                            onClick={() => onMarkAsRead(notification.id)}
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg ${notification.type === 'success' ? 'bg-emerald-500/20' :
                                                    notification.type === 'update' ? 'bg-blue-500/20' :
                                                        notification.type === 'new' ? 'bg-amber-500/20' :
                                                            'bg-purple-500/20'
                                                    }`}>
                                                    <Bell size={16} className={
                                                        notification.type === 'success' ? 'text-emerald-500' :
                                                            notification.type === 'update' ? 'text-blue-500' :
                                                                notification.type === 'new' ? 'text-amber-500' :
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
            className={`relative p-3 rounded-2xl backdrop-blur-sm border ${isDark
                ? 'bg-gray-800/50 border-gray-700 text-white'
                : 'bg-white/50 border-gray-200 text-gray-700'
                }`}
        >
            <motion.div
                animate={isRinging ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                } : {}}
                transition={{ duration: 0.6 }}
            >
                <Bell size={20} />
            </motion.div>

            {unreadCount > 0 && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full ring-2 ring-rose-400"
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
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
                        onClick={handleCancel}
                    />

                    {/* Centered Modal - Using flexbox for perfect centering */}
                    <div className="fixed inset-0 flex items-center justify-center z-[10000] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className={`w-full max-w-md rounded-2xl shadow-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                                }`}
                        >
                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-full ${isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600'
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
                                            className={`px-4 py-2 rounded-lg border font-medium ${isDark
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

    // Donor-specific sidebar menu items
    const mainMenuItems = [
        { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
        { name: "Recipients", icon: Users, id: "recipients" },
        { name: "My Donations", icon: Wallet, id: "donations" },
        { name: "Profile", icon: ShieldCheck, id: "profile" },
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

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');

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
            active: 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg',
            hover: 'hover:bg-white/5',
        },
        light: {
            sidebar: 'bg-gradient-to-b from-white to-gray-50 backdrop-blur-xl',
            text: 'text-gray-900',
            textSecondary: 'text-gray-600',
            border: 'border-gray-200',
            active: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg',
            hover: 'hover:bg-black/5',
        }
    };

    const currentTheme = isDark ? theme.dark : theme.light;

    return (
        <>
            <CustomScrollbarStyles isDark={isDark} />

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
                {/* Sidebar Toggle Button - SINGLE VERSION */}
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

                {((!isMobile && isOpen) || (isMobile && sidebarOpen)) && (
                    <motion.button
                        onClick={toggleSidebar}
                        className={`absolute top-5 ${isOpen ? 'right-[-14px]' : 'right-[-14px]'} ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'
                            } backdrop-blur-sm rounded-full p-1.5 shadow-lg border z-10`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isOpen || sidebarOpen ? (
                            <ChevronLeft size={14} className={isDark ? "text-white" : "text-gray-700"} />
                        ) : (
                            <ChevronRight size={14} className={isDark ? "text-white" : "text-gray-700"} />
                        )}
                    </motion.button>
                )}

                {/* Theme Toggle Button */}
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
                                        DONOR PORTAL
                                    </p>
                                    <h2 className={`font-semibold text-[13px] ${currentTheme.text}`}>Donation Tracker</h2>
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
                                                <item.icon
                                                    size={17}
                                                    strokeWidth={2.5}
                                                    className={activeTab === item.id ? 'text-white' : currentTheme.text}
                                                />
                                                <span>{item.name}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-700/20">
                                    <h3 className={`text-[9px] font-bold uppercase tracking-[0.15em] ${currentTheme.textSecondary} mb-3 px-2`}>
                                        ACCOUNT
                                    </h3>
                                    <div className="space-y-1">
                                        <motion.button
                                            onClick={() => handleItemClick('settings')}
                                            whileHover={{ x: 3, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${activeTab === 'settings'
                                                ? `${currentTheme.active} text-white shadow-lg`
                                                : `${currentTheme.text} ${currentTheme.hover}`
                                                }`}
                                        >
                                            <Settings
                                                size={17}
                                                strokeWidth={2.5}
                                                className={activeTab === 'settings' ? 'text-white' : currentTheme.text}
                                            />
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
                                                <item.icon
                                                    size={18}
                                                    className={activeTab === item.id ? 'text-white' : currentTheme.text}
                                                    strokeWidth={2.5}
                                                />
                                            </motion.button>
                                        </TooltipHover>
                                    ))}
                                </div>

                                <div className="space-y-2 flex flex-col items-center pt-4 border-t border-gray-700/20">
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
                                            <Settings
                                                size={18}
                                                className={activeTab === 'settings' ? 'text-white' : currentTheme.text}
                                                strokeWidth={2.5}
                                            />
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

// ==================== UNIVERSAL STAT CARD ====================
const UniversalStatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color,
    delay,
    isDark,
    onClick,
    change,
    changeType,
    isCurrency = false
}) => {
    const displayText = formatUniversalNumber(value, isCurrency);
    const fullNumber = getNumberFullText(value, isCurrency);

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
            onClick={onClick}
            className={`rounded-2xl p-6 shadow-xl border relative overflow-hidden group cursor-pointer ${isDark
                ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700'
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                }`}
        >
            {/* Animated Background Gradient */}
            <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10`}
                animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
            />

            {/* Floating Particles - BUBBLE ANIMATION */}
            <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={false}
            >
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute w-1.5 h-1.5 rounded-full opacity-40`}
                        style={{
                            backgroundColor: color.includes('emerald') ? '#10b981' :
                                color.includes('blue') ? '#3b82f6' :
                                    color.includes('violet') ? '#8b5cf6' :
                                        color.includes('amber') ? '#f59e0b' :
                                            color.includes('rose') ? '#ef4444' : '#10b981',
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

            {/* Floating Icon */}
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
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'} truncate`}>
                            {title}
                        </p>
                        <motion.h3
                            className={`text-3xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent ${color.includes('emerald') ? 'from-emerald-500 to-teal-500' :
                                color.includes('blue') ? 'from-blue-500 to-cyan-500' :
                                    color.includes('violet') ? 'from-violet-500 to-purple-500' :
                                        color.includes('amber') ? 'from-amber-500 to-orange-500' :
                                            color.includes('rose') ? 'from-rose-500 to-pink-600' : 'from-emerald-500 to-teal-500'
                                } truncate`}
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: delay + 0.2, type: "spring" }}
                            title={`${fullNumber}`}
                        >
                            {displayText}
                        </motion.h3>
                        {subtitle && (
                            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Icon with animations */}
                    <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="relative flex-shrink-0 ml-2"
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
                                    color.includes('emerald') ? 'text-emerald-500' :
                                        color.includes('blue') ? 'text-blue-500' :
                                            color.includes('violet') ? 'text-violet-500' :
                                                color.includes('amber') ? 'text-amber-500' :
                                                    color.includes('rose') ? 'text-rose-500' : 'text-emerald-500'
                                }
                            />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Change percentage indicator */}
                {change && changeType && (
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
};

// ==================== DASHBOARD CONTENT ====================
const DashboardContent = ({ data, isDark, onActionClick }) => (
    <div className="space-y-6 px-2 sm:px-0">
        {/* Stats Cards with universal formatting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <UniversalStatCard
                icon={IndianRupee}
                title="Total Donated"
                value={data.stats.totalDonations}
                subtitle="All time contributions"
                color="from-emerald-500 to-emerald-600"
                delay={0.1}
                isDark={isDark}
                onClick={() => onActionClick?.('view-history')}
                change={data.stats.monthlyChange}
                changeType="increase"
                isCurrency={true}
            />
            <UniversalStatCard
                icon={Heart}
                title="Donation Count"
                value={data.stats.donationCount}
                subtitle="Total donations made"
                color="from-blue-500 to-blue-600"
                delay={0.2}
                isDark={isDark}
                onClick={() => onActionClick?.('view-history')}
                change={33.3}
                changeType="increase"
            />
            <UniversalStatCard
                icon={Users}
                title="Recipients Helped"
                value={data.stats.recipients}
                subtitle="People you've supported"
                color="from-violet-500 to-violet-600"
                delay={0.3}
                isDark={isDark}
                change={50}
                changeType="increase"
            />
            <UniversalStatCard
                icon={Activity}
                title="Impact Score"
                value={data.stats.impactScore}
                subtitle="Your contribution rating"
                color="from-amber-500 to-amber-600"
                delay={0.4}
                isDark={isDark}
                onClick={() => onActionClick?.('settings')}
                change={12.5}
                changeType="increase"
            />
        </div>
    </div>
);

// ==================== MAIN DONORS DASHBOARD ====================
const DonorDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState(donorData.notifications);
    const [showNotifications, setShowNotifications] = useState(false);

    // Render function for active content
    const renderActiveContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardContent data={donorData} isDark={isDark} onActionClick={handleQuickAction} />;
            case 'recipients':
                return <BrowseRecipients isDark={isDark} />;
            case 'donations':
                return <Donations isDark={isDark} />;
            case 'profile':
                return <DonorProfileVerificationPage isDark={isDark} />;
            case 'notifications':
                return <NotificationsPage isDark={isDark} />;
            case 'settings':
                return <RecipientSettings isDark={isDark} />;
            default:
                return <DashboardContent data={donorData} isDark={isDark} onActionClick={handleQuickAction} />;
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeTab]);

    useEffect(() => {
        const initializeDashboard = async () => {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));

                setUser({
                    id: '2',
                    name: donorData.userInfo.name,
                    email: donorData.userInfo.email,
                    role: 'DONOR',
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

    const unreadNotificationsCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = (notificationId) => {
        setNotifications(notifications.map(notification =>
            notification.id === notificationId ? { ...notification, read: true } : notification
        ));
    };

    const handleQuickAction = (action) => {
        switch (action) {
            case 'view-history':
                setActiveTab('donations');
                break;
            case 'profile':
                setActiveTab('profile');
                break;
            default:
                console.log(`Action: ${action}`);
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
                : 'bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30'
                }`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-6"
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        <p className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Loading Donor Dashboard</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Preparing your impact data...</p>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-gray-50 via-emerald-50/30 to-teal-50/30'
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

            <div className="min-h-screen transition-all duration-300 overflow-x-hidden">
                {/* Header */}
                <header
                    className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b border-white/10 bg-gradient-to-r from-transparent to-transparent"
                    style={{
                        marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? (sidebarOpen ? 240 : 70) : 0,
                        transition: 'margin-left 0.3s ease'
                    }}
                >
                    <div className="px-6 lg:px-8 py-3 mx-auto max-w-7xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <TypingText name={user?.name} isDark={isDark} />
                            </div>

                            <div className="flex items-center gap-3">
                                {typeof window !== 'undefined' && window.innerWidth < 768 && (
                                    <>
                                        {!sidebarOpen && (
                                            <motion.button
                                                onClick={() => setSidebarOpen(true)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`p-3 rounded-2xl backdrop-blur-sm border ${isDark
                                                    ? 'bg-gray-800/50 border-gray-700 text-white'
                                                    : 'bg-white/50 border-gray-200 text-gray-700'
                                                    }`}
                                            >
                                                <Menu size={20} />
                                            </motion.button>
                                        )}

                                        {sidebarOpen && (
                                            <EnhancedNotificationIcon
                                                isDark={isDark}
                                                onClick={() => setShowNotifications(!showNotifications)}
                                                unreadCount={unreadNotificationsCount}
                                            />
                                        )}
                                    </>
                                )}

                                {typeof window !== 'undefined' && window.innerWidth >= 768 && (
                                    <EnhancedNotificationIcon
                                        isDark={isDark}
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        unreadCount={unreadNotificationsCount}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <NotificationPanel
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    isDark={isDark}
                />

                <main
                    className="p-6 lg:p-8 mx-auto max-w-7xl"
                    style={{
                        marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? (sidebarOpen ? 240 : 70) : 0,
                        transition: 'margin-left 0.3s ease',
                        paddingTop: '110px'
                    }}
                >
                    {renderActiveContent()}
                </main>
            </div>
        </div>
    );
};

export default DonorDashboard;