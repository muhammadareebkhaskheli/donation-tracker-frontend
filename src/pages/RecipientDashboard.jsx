import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalyticsPage from './AnalyticsPage';
import ProfileVerificationPage from './ProfileVerificationPage';
import MyRequests from './MyRequests';
import {
    LayoutDashboard,
    FileText,
    Wallet,
    Bell,
    Sun,
    Moon,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
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
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Shield,
    Zap,
    TargetIcon,
    BarChart4,
    PieChart,
    LineChart as LineChartIcon,
    Upload as UploadIcon,
    FilePlus,
    ChevronDown,
    ChevronUp,
    Calendar,
    MapPin
} from 'lucide-react';

// ==================== DUMMY DATA FOR RECIPIENT ====================
const recipientDummyData = {
    stats: {
        totalRequests: 12,
        approvedRequests: 8,
        pendingRequests: 3,
        totalReceived: 125000,
        monthlyGrowth: 15.7,
        completionRate: 67
    },

    activeRequests: [
        {
            id: 1,
            title: "Medical Treatment for Mother",
            targetAmount: 50000,
            receivedAmount: 25000,
            progress: 50,
            status: "in-progress",
            category: "Medical",
            createdAt: "2024-01-10",
            deadline: "2024-03-10",
            donors: 24
        },
        {
            id: 2,
            title: "Children Education Fund",
            targetAmount: 30000,
            receivedAmount: 18000,
            progress: 60,
            status: "in-progress",
            category: "Education",
            createdAt: "2024-01-15",
            deadline: "2024-04-15",
            donors: 18
        },
        {
            id: 3,
            title: "Emergency Housing Support",
            targetAmount: 80000,
            receivedAmount: 32000,
            progress: 40,
            status: "in-progress",
            category: "Housing",
            createdAt: "2024-01-20",
            deadline: "2024-05-20",
            donors: 32
        },
        {
            id: 4,
            title: "Medical Equipment Purchase",
            targetAmount: 20000,
            receivedAmount: 15000,
            progress: 75,
            status: "approved",
            category: "Medical",
            createdAt: "2024-01-05",
            deadline: "2024-02-28",
            donors: 12
        },
        {
            id: 5,
            title: "Small Business Startup",
            targetAmount: 100000,
            receivedAmount: 45000,
            progress: 45,
            status: "in-progress",
            category: "Business",
            createdAt: "2024-01-25",
            deadline: "2024-06-25",
            donors: 15
        },
        {
            id: 6,
            title: "Family Food Support",
            targetAmount: 15000,
            receivedAmount: 12000,
            progress: 80,
            status: "approved",
            category: "Food",
            createdAt: "2024-01-08",
            deadline: "2024-02-15",
            donors: 8
        }
    ],

    recentTransactions: [
        {
            id: 1,
            date: "2024-01-15",
            donorName: "Anonymous",
            amount: 5000,
            requestTitle: "Medical Treatment for Mother",
            status: "completed",
            type: "donation"
        },
        {
            id: 2,
            date: "2024-01-14",
            donorName: "Sarah Ali",
            amount: 10000,
            requestTitle: "Children Education Fund",
            status: "completed",
            type: "donation"
        },
        {
            id: 3,
            date: "2024-01-13",
            donorName: "Muhammad Hassan",
            amount: 7500,
            requestTitle: "Emergency Housing Support",
            status: "completed",
            type: "donation"
        },
        {
            id: 4,
            date: "2024-01-12",
            donorName: "Anonymous",
            amount: 3000,
            requestTitle: "Medical Equipment Purchase",
            status: "completed",
            type: "donation"
        },
        {
            id: 5,
            date: "2024-01-11",
            donorName: "Ayesha Khan",
            amount: 12000,
            requestTitle: "Medical Treatment for Mother",
            status: "completed",
            type: "donation"
        },
        {
            id: 6,
            date: "2024-01-10",
            donorName: "Imran Shah",
            amount: 8000,
            requestTitle: "Children Education Fund",
            status: "completed",
            type: "donation"
        },
        {
            id: 7,
            date: "2024-01-09",
            donorName: "Fatima Ahmed",
            amount: 6000,
            requestTitle: "Emergency Housing Support",
            status: "completed",
            type: "donation"
        },
        {
            id: 8,
            date: "2024-01-08",
            donorName: "Anonymous",
            amount: 2500,
            requestTitle: "Medical Equipment Purchase",
            status: "completed",
            type: "donation"
        },
        {
            id: 9,
            date: "2024-01-07",
            donorName: "Raza Khan",
            amount: 15000,
            requestTitle: "Small Business Startup",
            status: "completed",
            type: "donation"
        },
        {
            id: 10,
            date: "2024-01-06",
            donorName: "Sana Malik",
            amount: 4500,
            requestTitle: "Family Food Support",
            status: "completed",
            type: "donation"
        }
    ],

    analytics: {
        monthlyGrowth: 15.7,
        completionRate: 67,
        avgDonation: 7500,
        topCategory: "Medical"
    },

    notifications: [
        {
            id: 1,
            title: 'New Donation Received',
            message: 'Anonymous donated ₨5,000 for medical assistance',
            time: '2 minutes ago',
            read: false,
            type: 'donation'
        },
        {
            id: 2,
            title: 'Request Approved',
            message: 'Your medical treatment request has been approved',
            time: '1 hour ago',
            read: false,
            type: 'approval'
        },
        {
            id: 3,
            title: 'Document Upload Required',
            message: 'Please upload medical reports for verification',
            time: '3 hours ago',
            read: true,
            type: 'verification'
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
        className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-700 opacity-0"
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

    // Recipient-specific sidebar menu items
    const mainMenuItems = [
        { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
        { name: "My Requests", icon: FileText, id: "requests" },
        { name: "Donations", icon: Wallet, id: "donations" },
        { name: "Profile Verification", icon: FileCheck, id: "profile" },
        { name: "Analytics", icon: BarChart3, id: "analytics" },
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
        localStorage.removeItem('recipientDashboardSettings');

        console.log('User logged out successfully');

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
            active: 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg',
            hover: 'hover:bg-white/5',
        },
        light: {
            sidebar: 'bg-gradient-to-b from-white to-gray-50 backdrop-blur-xl',
            text: 'text-gray-900',
            textSecondary: 'text-gray-600',
            border: 'border-gray-200',
            active: 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg',
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
                                        RECIPIENT
                                    </p>
                                    <h2 className={`font-semibold text-[13px] ${currentTheme.text}`}>Recipient Panel</h2>
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

// ==================== GLASS MORPHISM CARD ====================
const GlassCard = ({ children, className = "", isDark, ...props }) => (
    <motion.div
        className={`rounded-3xl backdrop-blur-xl border border-white/20 bg-gradient-to-br ${isDark
            ? 'from-gray-800/80 to-gray-900/80 shadow-2xl'
            : 'from-white/80 to-gray-50/80 shadow-xl'
            } ${className}`}
        {...props}
    >
        {children}
    </motion.div>
);

// ==================== ANIMATED TYPING TEXT ====================
const TypingText = ({ name, isDark }) => {
    const messages = [
        `Welcome back, ${name}!`,
        `Great to see you, ${name}!`,
        `Hello ${name}! Hope you're doing well!`,
        `Welcome to your dashboard, ${name}!`,
        `Hi ${name}! Let's check your requests today!`,
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
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            {displayText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse" }}
                className="inline-block w-0.5 h-6 bg-blue-500 ml-1 align-middle"
            />
        </h1>
    );
};

// ==================== ENHANCED STAT CARD ====================
const EnhancedStatCard = ({
    icon: Icon,
    title,
    value,
    change,
    changeType,
    color,
    delay,
    isDark,
    subtitle
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay, duration: 0.5, type: "spring" }}
        whileHover={{ y: -5, scale: 1.02 }}
        className={`rounded-2xl p-6 shadow-xl border relative overflow-hidden group cursor-pointer ${isDark
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
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
                <div className="flex-1">
                    <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {title}
                    </p>
                    <motion.h3
                        className={`text-3xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent ${color.includes('blue') ? 'from-blue-500 to-cyan-500' :
                            color.includes('emerald') ? 'from-emerald-500 to-teal-500' :
                                color.includes('violet') ? 'from-violet-500 to-purple-500' :
                                    'from-amber-500 to-orange-500'
                            }`}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: delay + 0.2, type: "spring" }}
                    >
                        {typeof value === 'number' ?
                            (title.includes('Amount') || title.includes('Received') ? `₨${value.toLocaleString()}` : value.toLocaleString())
                            : value
                        }
                    </motion.h3>
                    {subtitle && (
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Icon with animations */}
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

// ==================== MODERN QUICK ACTIONS ====================
const QuickActions = ({ isDark }) => {
    const [activeAction, setActiveAction] = useState(null);

    const actions = [
        {
            id: 'create-request',
            icon: FilePlus,
            label: 'Create Request',
            description: 'Start new funding request',
            color: 'from-blue-500 to-blue-600',
            hoverColor: 'from-blue-600 to-blue-700',
            delay: 0.1
        },
        {
            id: 'upload-documents',
            icon: UploadIcon,
            label: 'Upload Docs',
            description: 'Submit required documents',
            color: 'from-emerald-500 to-emerald-600',
            hoverColor: 'from-emerald-600 to-emerald-700',
            delay: 0.2
        },
        {
            id: 'view-analytics',
            icon: BarChart3,
            label: 'Analytics',
            description: 'View detailed insights',
            color: 'from-violet-500 to-violet-600',
            hoverColor: 'from-violet-600 to-violet-700',
            delay: 0.3
        },
        {
            id: 'manage-requests',
            icon: FileText,
            label: 'My Requests',
            description: 'Manage all requests',
            color: 'from-amber-500 to-amber-600',
            hoverColor: 'from-amber-600 to-amber-700',
            delay: 0.4
        }
    ];

    const handleActionClick = (actionId) => {
        setActiveAction(actionId);
        // Simulate action with a brief loading state
        setTimeout(() => {
            setActiveAction(null);
            alert(`${actions.find(a => a.id === actionId)?.label} clicked!`);
        }, 1000);
    };

    return (
        <GlassCard isDark={isDark} className="p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <motion.div
                className="absolute inset-0 opacity-[0.03]"
                animate={{
                    background: [
                        'radial-gradient(circle at 10% 20%, #3b82f6 0%, transparent 40%)',
                        'radial-gradient(circle at 90% 80%, #10b981 0%, transparent 40%)',
                        'radial-gradient(circle at 50% 50%, #8b5cf6 0%, transparent 40%)',
                    ]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
            />

            <div className="relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-6"
                >
                    <div>
                        <h3 className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-1`}>
                            Quick Actions
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Frequently used actions at your fingertips
                        </p>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2 rounded-xl backdrop-blur-sm border ${isDark
                            ? 'bg-gray-800/50 border-gray-700 text-blue-400'
                            : 'bg-white/50 border-gray-200 text-blue-600'
                            }`}
                    >
                        <Zap size={20} />
                    </motion.div>
                </motion.div>

                {/* Actions Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {actions.map((action, index) => (
                        <motion.button
                            key={action.id}
                            onClick={() => handleActionClick(action.id)}
                            disabled={activeAction === action.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: action.delay, duration: 0.5 }}
                            whileHover={{
                                y: -4,
                                scale: 1.02,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative p-4 rounded-2xl backdrop-blur-sm border-2 text-left group overflow-hidden ${isDark
                                ? 'bg-gray-800/40 border-gray-700/50 hover:border-gray-600/70'
                                : 'bg-white/60 border-gray-200/50 hover:border-gray-300/70'
                                } ${activeAction === action.id ? 'opacity-50 cursor-not-allowed' : ''
                                } transition-all duration-300`}
                        >
                            {/* Animated Background */}
                            <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10`}
                                transition={{ duration: 0.3 }}
                            />

                            {/* Loading Overlay */}
                            {activeAction === action.id && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-20 flex items-center justify-center`}
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                                    />
                                </motion.div>
                            )}

                            {/* Icon Container */}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-3 shadow-lg relative overflow-hidden group/icon`}
                            >
                                {/* Shine Effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover/icon:translate-x-full"
                                    transition={{ duration: 0.8 }}
                                />

                                {/* Icon */}
                                <action.icon size={20} className="text-white relative z-10" />

                                {/* Pulse Effect */}
                                {activeAction === action.id && (
                                    <motion.div
                                        className="absolute inset-0 rounded-xl border-2 border-white/50"
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.7, 0, 0.7],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                        }}
                                    />
                                )}
                            </motion.div>

                            {/* Content */}
                            <div className="relative z-10">
                                <h4 className={`font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    {action.label}
                                </h4>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                    {action.description}
                                </p>
                            </div>

                            {/* Hover Arrow */}
                            <motion.div
                                initial={{ opacity: 0, x: -5 }}
                                whileHover={{ opacity: 1, x: 0 }}
                                className={`absolute top-4 right-4 ${isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`}
                            >
                                <ChevronRight size={16} />
                            </motion.div>

                            {/* Subtle Floating Particles */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                {[...Array(2)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-white/30' : 'bg-gray-600/30'
                                            }`}
                                        style={{
                                            left: `${20 + i * 40}%`,
                                            bottom: '20%',
                                        }}
                                        animate={{
                                            y: [0, -8, 0],
                                            opacity: [0, 0.6, 0],
                                            scale: [0, 1, 0],
                                        }}
                                        transition={{
                                            duration: 2 + i * 0.5,
                                            repeat: Infinity,
                                            delay: i * 0.3,
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Footer Help Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className={`flex items-center justify-center gap-2 mt-6 pt-4 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'
                        }`}
                >
                    <Zap size={14} className={isDark ? 'text-amber-400' : 'text-amber-600'} />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Click any action to get started quickly
                    </span>
                </motion.div>
            </div>
        </GlassCard>
    );
};

// ==================== PERFECT ANALYTICS OVERVIEW ====================
const AnalyticsOverview = ({ analytics, isDark }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [chartView, setChartView] = useState('overview');

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsRefreshing(false);
    };

    const stats = [
        {
            label: "Monthly Growth",
            value: `${analytics.monthlyGrowth}%`,
            icon: TrendingUp,
            color: "from-emerald-500 to-teal-400",
            gradient: "bg-gradient-to-r from-emerald-500 to-teal-400",
            delay: 0.1,
            animation: "risingBubbles"
        },
        {
            label: "Completion Rate",
            value: `${analytics.completionRate}%`,
            icon: Target,
            color: "from-blue-500 to-cyan-400",
            gradient: "bg-gradient-to-r from-blue-500 to-cyan-400",
            delay: 0.2,
            animation: "rotatingRings"
        },
        {
            label: "Avg Donation",
            value: `₨${analytics.avgDonation}`,
            icon: DollarSign,
            color: "from-violet-500 to-purple-400",
            gradient: "bg-gradient-to-r from-violet-500 to-purple-400",
            delay: 0.3,
            animation: "pulsingWaves"
        },
        {
            label: "Top Category",
            value: analytics.topCategory,
            icon: Award,
            color: "from-amber-500 to-orange-400",
            gradient: "bg-gradient-to-r from-amber-500 to-orange-400",
            delay: 0.4,
            animation: "floatingStars"
        }
    ];

    const AnimationLayer = ({ type, color, isDark }) => {
        switch (type) {
            case 'risingBubbles':
                return (
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className={`absolute w-2 h-2 rounded-full ${isDark ? 'bg-emerald-400/30' : 'bg-emerald-500/30'}`}
                                style={{
                                    left: `${15 + i * 15}%`,
                                    bottom: '0%',
                                }}
                                animate={{
                                    y: [0, -120, 0],
                                    opacity: [0, 0.8, 0],
                                    scale: [0.5, 1.2, 0.5],
                                }}
                                transition={{
                                    duration: 3 + i * 0.5,
                                    repeat: Infinity,
                                    delay: i * 0.7,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>
                );

            case 'rotatingRings':
                return (
                    <div className="absolute inset-0 flex items-center justify-center">
                        {[0, 1, 2].map((ring) => (
                            <motion.div
                                key={ring}
                                className={`absolute border-2 rounded-full ${isDark ? 'border-blue-400/20' : 'border-blue-500/20'}`}
                                style={{
                                    width: `${40 + ring * 30}px`,
                                    height: `${40 + ring * 30}px`,
                                }}
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    rotate: {
                                        duration: 8 + ring * 2,
                                        repeat: Infinity,
                                        ease: "linear"
                                    },
                                    scale: {
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: ring * 0.5
                                    }
                                }}
                            />
                        ))}
                    </div>
                );

            case 'pulsingWaves':
                return (
                    <div className="absolute inset-0">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                className={`absolute rounded-full ${isDark ? 'bg-violet-400/15' : 'bg-violet-500/15'}`}
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                }}
                                animate={{
                                    width: [0, 120, 0],
                                    height: [0, 120, 0],
                                    opacity: [0.8, 0, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 0.8,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
                    </div>
                );

            case 'floatingStars':
                return (
                    <div className="absolute inset-0">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className={`absolute ${isDark ? 'text-amber-400/40' : 'text-amber-500/40'}`}
                                style={{
                                    left: `${20 + i * 15}%`,
                                    top: `${30 + (i % 2) * 20}%`,
                                }}
                                animate={{
                                    y: [0, -10, 0, 10, 0],
                                    rotate: [0, 180, 360],
                                    scale: [0.8, 1.2, 0.8],
                                }}
                                transition={{
                                    duration: 4 + i,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                    ease: "easeInOut"
                                }}
                            >
                                <Star size={16} fill="currentColor" />
                            </motion.div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <GlassCard isDark={isDark} className="p-8 relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <motion.div
                className="absolute inset-0 opacity-[0.02]"
                animate={{
                    background: [
                        'radial-gradient(circle at 20% 80%, #4f46e5 0%, transparent 50%)',
                        'radial-gradient(circle at 80% 20%, #06b6d4 0%, transparent 50%)',
                        'radial-gradient(circle at 40% 40%, #10b981 0%, transparent 50%)',
                    ]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
            />

            <div className="relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div>
                        <h3 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2`}>
                            Performance Overview
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Real-time insights and performance metrics
                        </p>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                delay: stat.delay,
                                duration: 0.6,
                                type: "spring",
                                stiffness: 100
                            }}
                            whileHover={{
                                y: -4,
                                scale: 1.02,
                                transition: { duration: 0.2 }
                            }}
                            className={`relative p-6 rounded-2xl backdrop-blur-sm border-2 ${isDark
                                ? 'bg-gray-800/40 border-gray-700/50 hover:border-gray-600/70'
                                : 'bg-white/60 border-gray-200/50 hover:border-gray-300/70'
                                } group/card cursor-pointer transition-all duration-300 overflow-hidden`}
                        >
                            {/* Unique Animation for Each Card */}
                            <AnimationLayer
                                type={stat.animation}
                                color={stat.color}
                                isDark={isDark}
                            />

                            {/* Hover Gradient Overlay */}
                            <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover/card:opacity-5`}
                                transition={{ duration: 0.3 }}
                            />

                            {/* Main Content */}
                            <div className="relative z-10">
                                {/* Icon Container */}
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ duration: 0.3 }}
                                    className={`w-12 h-12 rounded-xl ${stat.gradient} flex items-center justify-center mb-4 shadow-lg group/icon relative overflow-hidden`}
                                >
                                    {/* Icon Shine Effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover/icon:translate-x-full"
                                        transition={{ duration: 0.8 }}
                                    />
                                    <stat.icon size={20} className="text-white relative z-10" />
                                </motion.div>

                                {/* Value */}
                                <motion.div
                                    className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: stat.delay + 0.3, type: "spring" }}
                                >
                                    {stat.value}
                                </motion.div>

                                {/* Label */}
                                <p className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {stat.label}
                                </p>

                                {/* Progress Bar for Percentage Stats */}
                                {(stat.label.includes('Growth') || stat.label.includes('Rate')) && (
                                    <div className={`w-full h-1.5 rounded-full mt-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'
                                        } overflow-hidden`}>
                                        <motion.div
                                            className={`h-full rounded-full ${stat.gradient} relative`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${parseInt(stat.value)}%` }}
                                            transition={{
                                                delay: stat.delay + 0.5,
                                                duration: 1.5,
                                                type: "spring",
                                                stiffness: 60
                                            }}
                                        >
                                            {/* Shimmer Effect */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                                                animate={{
                                                    x: ['-100%', '200%'],
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
                                )}

                                {/* Subtle Trend Indicator */}
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: stat.delay + 0.7 }}
                                    className="flex items-center gap-1 mt-2"
                                >
                                    <TrendingUp size={12} className={
                                        stat.color.includes('emerald') ? 'text-emerald-500' :
                                            stat.color.includes('blue') ? 'text-blue-500' :
                                                stat.color.includes('violet') ? 'text-violet-500' : 'text-amber-500'
                                    } />
                                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        {stat.animation === 'risingBubbles' ? 'Growing' :
                                            stat.animation === 'rotatingRings' ? 'Active' :
                                                stat.animation === 'pulsingWaves' ? 'Stable' : 'Leading'}
                                    </span>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Simple Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className={`flex items-center justify-between mt-8 pt-6 border-t ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Live data updated just now
                        </span>
                    </div>

                    <motion.button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        whileHover={!isRefreshing ? { scale: 1.05, x: 2 } : {}}
                        whileTap={!isRefreshing ? { scale: 0.95 } : {}}
                        className={`text-xs px-4 py-2 rounded-lg flex items-center gap-2 border ${isDark
                            ? 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                            : 'bg-white/50 border-gray-300 text-gray-700 hover:bg-gray-100/50'
                            } transition-all duration-200 ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <motion.div
                            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                            transition={isRefreshing ?
                                { duration: 1, repeat: Infinity, ease: "linear" } :
                                { duration: 0.3 }
                            }
                        >
                            <RefreshCw size={14} />
                        </motion.div>
                        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                    </motion.button>
                </motion.div>
            </div>
        </GlassCard>
    );
};

// ==================== NOTIFICATION COMPONENT ====================
const NotificationPanel = ({ isOpen, onClose, notifications, onMarkAsRead, onMarkAllAsRead, isDark, onViewAllNotifications }) => {
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
                                onClick={onViewAllNotifications}
                                className={`w-full py-2 rounded-lg text-sm font-medium ${isDark
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    } transition-colors`}
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

// ==================== MAIN DASHBOARD COMPONENT ====================
const RecipientDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState(recipientDummyData.notifications);
    const [showNotifications, setShowNotifications] = useState(false);

    // ==================== ADD THIS EFFECT FOR AUTO-SCROLL ====================
    useEffect(() => {
        // Scroll to top when activeTab changes
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [activeTab]); // This will run whenever activeTab changes

    // Also add this for initial load
    useEffect(() => {
        // Scroll to top on initial component mount
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        const initializeDashboard = async () => {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));

                setUser({
                    id: '1',
                    name: 'Ahmed Khan',
                    email: 'ahmed.khan@example.com',
                    role: 'RECIPIENT',
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
            document.documentElement.style.backgroundColor = '#0f172a';
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.backgroundColor = '#f8fafc';
        }
    }, [isDark]);

    const unreadNotificationsCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = (notificationId) => {
        setNotifications(notifications.map(notification =>
            notification.id === notificationId ? { ...notification, read: true } : notification
        ));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    };

    const handleViewAllNotifications = () => {
        setShowNotifications(false);
        setActiveTab('notifications');
    };

    // ==================== FIXED PROGRESS CARD FOR HORIZONTAL FIT ====================
    const ProgressCard = ({ request, isDark, index }) => {
        const [isHovered, setIsHovered] = useState(false);
        const getStatusColor = (status) => {
            switch (status) {
                case 'approved':
                    return 'from-emerald-500 to-emerald-600';
                case 'in-progress':
                    return 'from-blue-500 to-blue-600';
                case 'pending':
                    return 'from-amber-500 to-amber-600';
                default:
                    return 'from-gray-500 to-gray-600';
            }
        };

        const getStatusText = (status) => {
            switch (status) {
                case 'approved':
                    return 'Approved';
                case 'in-progress':
                    return 'In Progress';
                case 'pending':
                    return 'Pending';
                default:
                    return 'Unknown';
            }
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                    delay: index * 0.05,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 120
                }}
                whileHover={{
                    y: -2,
                    scale: 1.01,
                    transition: { duration: 0.15 }
                }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="relative"
            >
                <div className={`rounded-xl backdrop-blur-sm border ${isDark
                    ? 'bg-gray-800/40 border-gray-700'
                    : 'bg-white/50 border-gray-200'
                    } p-3 group cursor-pointer relative overflow-hidden`}>
                    {/* Removed GlassCard wrapper for better fit */}

                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                            {/* Changed to flex-col on mobile, flex-row on sm+ */}
                            <div className="flex-1 min-w-0">
                                <motion.div
                                    whileHover={{ x: 1 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <h4 className={`font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                                        {/* Reduced to text-sm and added truncate */}
                                        {request.title}
                                    </h4>
                                </motion.div>
                                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                                    {/* Reduced to text-[11px] */}
                                    <motion.span
                                        whileHover={{ scale: 1.03 }}
                                        className={`px-1.5 py-0.5 rounded-full font-medium ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                            }`}
                                    >
                                        {request.category}
                                    </motion.span>
                                    <span className={`flex items-center gap-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <Calendar size={10} />
                                        {new Date(request.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className={`flex items-center gap-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <Users size={10} />
                                        {request.donors}
                                    </span>
                                </div>
                            </div>

                            <motion.span
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                className={`px-2 py-0.5 text-[10px] font-semibold rounded-full bg-gradient-to-r ${getStatusColor(request.status)} text-white shadow self-start`}
                            >
                                {/* Added self-start for better alignment */}
                                {getStatusText(request.status)}
                            </motion.span>
                        </div>

                        <div className="space-y-1.5">
                            {/* Reduced space-y-2 to space-y-1.5 */}
                            <div className="flex justify-between text-[11px]">
                                {/* Reduced to text-[11px] */}
                                <motion.span
                                    whileHover={{ scale: 1.03 }}
                                    className={isDark ? 'text-gray-300' : 'text-gray-600'}
                                >
                                    ₨{request.receivedAmount.toLocaleString()}
                                </motion.span>
                                <motion.span
                                    whileHover={{ scale: 1.03 }}
                                    className={isDark ? 'text-gray-300' : 'text-gray-600'}
                                >
                                    ₨{request.targetAmount.toLocaleString()}
                                </motion.span>
                            </div>

                            <div className={`w-full rounded-full h-1.5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden relative`}>
                                {/* Reduced h-2 to h-1.5 */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${request.progress}%` }}
                                    transition={{
                                        delay: 0.2 + index * 0.05,
                                        duration: 1,
                                        type: "spring",
                                        stiffness: 80,
                                        damping: 20
                                    }}
                                    className={`h-full rounded-full bg-gradient-to-r ${getStatusColor(request.status)} relative`}
                                />
                            </div>

                            <div className="flex justify-between items-center pt-0.5">
                                {/* Reduced pt-1 to pt-0.5 */}
                                <motion.div
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                    className="flex items-center gap-1"
                                >
                                    <motion.span
                                        className={`text-[11px] font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                                        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                                    >
                                        {request.progress}%
                                    </motion.span>
                                    <TrendingUp size={8} className={
                                        request.progress > 70 ? 'text-emerald-500' :
                                            request.progress > 40 ? 'text-blue-500' : 'text-amber-500'
                                    } />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    // ==================== FIXED TRANSACTION CARD FOR HORIZONTAL FIT ====================
    const TransactionCard = ({ transaction, isDark, index }) => {
        const [isHovered, setIsHovered] = useState(false);

        const getStatusColor = (status) => {
            switch (status) {
                case 'completed':
                    return {
                        text: 'text-emerald-500',
                        bg: 'bg-emerald-500/20',
                        border: 'border-emerald-500/30',
                        glow: 'from-emerald-500/10 to-emerald-600/10'
                    };
                case 'pending':
                    return {
                        text: 'text-amber-500',
                        bg: 'bg-amber-500/20',
                        border: 'border-amber-500/30',
                        glow: 'from-amber-500/10 to-amber-600/10'
                    };
                case 'failed':
                    return {
                        text: 'text-rose-500',
                        bg: 'bg-rose-500/20',
                        border: 'border-rose-500/30',
                        glow: 'from-rose-500/10 to-rose-600/10'
                    };
                default:
                    return {
                        text: 'text-gray-500',
                        bg: 'bg-gray-500/20',
                        border: 'border-gray-500/30',
                        glow: 'from-gray-500/10 to-gray-600/10'
                    };
            }
        };

        const statusColors = getStatusColor(transaction.status);

        return (
            <motion.div
                initial={{ opacity: 0, x: -10, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{
                    delay: index * 0.04,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 140
                }}
                whileHover={{
                    y: -1,
                    scale: 1.008,
                    transition: { duration: 0.15 }
                }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="relative"
            >
                <div className={`p-2.5 rounded-lg border backdrop-blur-sm ${isDark ? 'bg-gray-800/40 border-gray-700' : 'bg-white/50 border-gray-200'
                    } group relative overflow-hidden`}>
                    {/* Reduced padding from p-3 to p-2.5, rounded-xl to rounded-lg */}

                    <div className="relative z-10">
                        <div className="flex items-center justify-between gap-2">
                            {/* Added gap-2 for spacing */}
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                {/* Reduced gap-3 to gap-2 */}
                                {/* Animated Icon Container */}
                                <motion.div
                                    whileHover={{
                                        scale: 1.05,
                                    }}
                                    transition={{
                                        duration: 0.2,
                                    }}
                                    className={`p-1.5 rounded-md ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                                        } relative overflow-hidden flex-shrink-0`}
                                >
                                    {/* Reduced p-2 to p-1.5, rounded-lg to rounded-md */}
                                    <Users size={12} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                                    {/* Reduced icon size from 16 to 12 */}
                                </motion.div>

                                <div className="flex-1 min-w-0">
                                    <motion.div
                                        whileHover={{ x: 1 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <h4 className={`font-medium text-[12px] truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {/* Reduced to text-[12px] and added truncate */}
                                            {transaction.donorName}
                                        </h4>
                                        <p className={`text-[11px] truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {transaction.requestTitle}
                                        </p>
                                        <motion.p
                                            initial={{ opacity: 0.5 }}
                                            animate={{ opacity: isHovered ? 1 : 0.5 }}
                                            className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}
                                        >
                                            {new Date(transaction.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                            {/* Removed time for more space */}
                                        </motion.p>
                                    </motion.div>
                                </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                                {/* Added flex-shrink-0 */}
                                {/* Amount Animation */}
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    className="relative"
                                >
                                    <motion.p
                                        className={`text-[13px] font-bold ${isDark ? 'text-white' : 'text-gray-900'
                                            }`}
                                        animate={isHovered ? {
                                            scale: [1, 1.02, 1],
                                        } : {}}
                                        transition={{
                                            duration: 0.8,
                                            repeat: Infinity
                                        }}
                                    >
                                        ₨{transaction.amount.toLocaleString()}
                                    </motion.p>
                                </motion.div>

                                {/* Status Badge with Animation */}
                                <motion.span
                                    whileHover={{
                                        scale: 1.05,
                                    }}
                                    className={`text-[9px] px-1 py-0.5 rounded-full ${statusColors.text} ${statusColors.bg} border border-transparent mt-0.5 inline-block`}
                                // Reduced text size and padding
                                >
                                    {transaction.status}
                                </motion.span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    // ==================== UPDATED DASHBOARD CONTENT WITH 500px HEIGHT AND NO VIEW ALL BUTTONS ====================
    const DashboardContent = ({ isDark }) => {
        const cardHeight = "500px"; // Set to 500px as requested

        return (
            <div className="space-y-8">
                {/* Stats Grid - unchanged */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <EnhancedStatCard
                        icon={FileText}
                        title="Total Requests"
                        value={recipientDummyData.stats.totalRequests}
                        change={8.3}
                        changeType="increase"
                        color="from-blue-500 to-blue-600"
                        delay={0.1}
                        isDark={isDark}
                    />
                    <EnhancedStatCard
                        icon={CheckCircle}
                        title="Approved"
                        value={recipientDummyData.stats.approvedRequests}
                        change={12.5}
                        changeType="increase"
                        color="from-emerald-500 to-emerald-600"
                        delay={0.2}
                        isDark={isDark}
                    />
                    <EnhancedStatCard
                        icon={Clock}
                        title="Pending"
                        value={recipientDummyData.stats.pendingRequests}
                        change={-5.2}
                        changeType="decrease"
                        color="from-amber-500 to-amber-600"
                        delay={0.3}
                        isDark={isDark}
                    />
                    <EnhancedStatCard
                        icon={DollarSign}
                        title="Total Received"
                        value={recipientDummyData.stats.totalReceived}
                        change={15.7}
                        changeType="increase"
                        color="from-violet-500 to-violet-600"
                        delay={0.4}
                        isDark={isDark}
                        subtitle="All time donations"
                    />
                </div>

                {/* Analytics Overview - unchanged */}
                <AnalyticsOverview analytics={recipientDummyData.analytics} isDark={isDark} />

                {/* Quick Actions - unchanged */}
                <QuickActions isDark={isDark} />

                {/* Active Requests & Recent Transactions - WITH 500px HEIGHT AND NO VIEW ALL BUTTONS */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Active Requests Card - 500px height */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <GlassCard isDark={isDark} className="p-4 h-[500px] flex flex-col">
                            {/* Header - REMOVED VIEW ALL BUTTON */}
                            <div className="mb-3 flex-shrink-0">
                                <div>
                                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Active Requests
                                    </h2>
                                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {recipientDummyData.activeRequests.length} active campaigns
                                    </p>
                                </div>
                            </div>

                            {/* Scrollable content - 500px height container */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                                <div className="space-y-3">
                                    {recipientDummyData.activeRequests.map((request, index) => (
                                        <motion.div
                                            key={request.id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <ProgressCard
                                                request={request}
                                                isDark={isDark}
                                                index={index}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer - simple indicator */}
                            <div className={`mt-3 pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Recent Transactions Card - 500px height */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <GlassCard isDark={isDark} className="p-4 h-[500px] flex flex-col">
                            {/* Header - REMOVED VIEW ALL BUTTON */}
                            <div className="mb-3 flex-shrink-0">
                                <div>
                                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Recent Transactions
                                    </h2>
                                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {recipientDummyData.recentTransactions.length} recent donations
                                    </p>
                                </div>
                            </div>

                            {/* Scrollable content - 500px height container */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                                <div className="space-y-2">
                                    {recipientDummyData.recentTransactions.map((transaction, index) => (
                                        <motion.div
                                            key={`${transaction.id}-${index}`}
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                        >
                                            <TransactionCard
                                                transaction={transaction}
                                                isDark={isDark}
                                                index={index}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer - simple indicator */}
                            <div className={`mt-3 pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
                                <div className="flex items-center justify-between">
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        );
    };

    const renderActiveContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardContent />;
            case 'requests':
                return <MyRequests isDark={isDark} />;
            case 'profile':
                return <ProfileVerificationPage isDark={isDark} />;
            case 'analytics':
                return <AnalyticsPage isDark={isDark} />;
            case 'notifications':
                return (
                    <GlassCard isDark={isDark} className="p-6">
                        <div className="text-center py-12">
                            <Bell size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Notifications
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                All your notifications will appear here
                            </p>
                        </div>
                    </GlassCard>
                );
            case 'donations':
                return (
                    <GlassCard isDark={isDark} className="p-6">
                        <div className="text-center py-12">
                            <Wallet size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Donations
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                View and manage your donations here
                            </p>
                        </div>
                    </GlassCard>
                );
            case 'settings':
                return (
                    <GlassCard isDark={isDark} className="p-6">
                        <div className="text-center py-12">
                            <Settings size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Settings
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Configure your application settings here
                            </p>
                        </div>
                    </GlassCard>
                );
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
                        className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"
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
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
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

            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b border-white/10 bg-gradient-to-r from-transparent to-transparent">
                <div
                    className="px-6 lg:px-8 py-3"
                    style={{
                        marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? (sidebarOpen ? 240 : 70) : 0,
                        transition: 'margin-left 0.3s ease'
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <TypingText name={user?.name} isDark={isDark} />
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                            >
                                Here's your fundraising overview
                            </motion.p>
                        </div>

                        <div className="flex items-center gap-3">
                            <EnhancedNotificationIcon
                                isDark={isDark}
                                onClick={() => setShowNotifications(!showNotifications)}
                                unreadCount={unreadNotificationsCount}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <NotificationPanel
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onViewAllNotifications={handleViewAllNotifications}
                isDark={isDark}
            />

            {/* Main Content */}
            <main
                className="p-6 lg:p-8"
                style={{
                    marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? (sidebarOpen ? 240 : 70) : 0,
                    transition: 'margin-left 0.3s ease',
                    paddingTop: '110px'
                }}
            >
                <div className="max-w-7xl mx-auto">
                    {renderActiveContent()}
                </div>
            </main>
        </div>
    );
};

export default RecipientDashboard;