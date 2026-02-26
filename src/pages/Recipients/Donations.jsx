import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Eye,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Users,
    Calendar,
    Heart,
    Award,
    FileText,
    Shield,
    Zap,
    Activity,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    X,
    AlertTriangle,
    FileCheck,
    Clock,
    BarChart3,
    RefreshCw,
    MoreVertical,
    Download,
    Mail,
    Phone,
    User,
    Gift,
    MessageSquare,
    ThumbsUp,
    Star,
    Target,
    Percent,
    ArrowUpRight,
    CreditCard,
    Hash,
    MapPin,
    Globe,
    Bell,
    Share2,
    CheckCircle2,
    Sparkles,
    Trophy,
    Crown,
    Gem,
    Coins,
    Wallet,
    Banknote,
    Receipt,
    CalendarDays,
    Clock3,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    HandCoins,
    Send,
    Plus,
    XCircle,
    IndianRupee
} from 'lucide-react';

// ==================== FORMAT VALUE FUNCTION ====================
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
    const currencyPrefix = isCurrency ? '' : '';

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

// ==================== DONATION CARD COMPONENT (MOVED OUTSIDE) ====================
const DonationCard = React.memo(({ donation, index, isDark, onViewDetails, onSendThankYou, onDownloadReceipt, getRequestById, getCategoryColor, getDonorTypeColor, getPrimaryColor, formatAmount, formatDate }) => {
    const [showActions, setShowActions] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const request = getRequestById(donation.requestId);
    const categoryColor = getCategoryColor(donation.category);
    const CategoryIcon = categoryColor.icon;
    const donorTypeColor = getDonorTypeColor(donation.donorType);
    const DonorTypeIcon = donorTypeColor.icon;

    const primaryColor = getPrimaryColor(categoryColor.gradient);

    const handleViewDetails = useCallback(() => {
        onViewDetails(donation);
        setShowActions(false);
    }, [donation, onViewDetails]);

    const handleSendThankYouClick = useCallback(() => {
        onSendThankYou(donation.id);
        setShowActions(false);
    }, [donation.id, onSendThankYou]);

    const handleDownloadReceiptClick = useCallback(() => {
        onDownloadReceipt(donation.id);
        setShowActions(false);
    }, [donation.id, onDownloadReceipt]);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

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

    return (
        <motion.div
            key={`donation-card-${donation.id}`}
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
        >
            {/* Floating Orbs Animation */}
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

            {/* Floating Ring Animation */}
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

            {/* Pulsing Glow Effect */}
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

            {/* Shimmer Lines Animation */}
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

            {/* Light Background Overlay */}
            <motion.div
                className={`absolute inset-0 rounded-2xl ${categoryColor.gradient.split(' ')[0]}`}
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

            {/* Particle Dots */}
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
                                {donation.donorName}
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
                                    className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                                >
                                    {donation.donationId}
                                </motion.span>
                                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    • {donation.category}
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
                                    className={`absolute right-0 top-12 w-56 rounded-2xl overflow-visible z-[9999] ${isDark ? 'bg-gray-800' : 'bg-white'
                                        }`}
                                    style={{
                                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4), 0 10px 20px rgba(0, 0, 0, 0.3)'
                                    }}
                                >
                                    <div className="p-2 space-y-1 relative z-[9999]">
                                        <button
                                            onClick={() => {
                                                handleViewDetails();
                                                setShowActions(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-blue-500/20 text-gray-300' : 'hover:bg-blue-100 text-gray-700'
                                                }`}
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </button>

                                        {!donation.isAnonymous && donation.donorEmail && !donation.thanked && (
                                            <button
                                                onClick={() => {
                                                    handleSendThankYouClick();
                                                    setShowActions(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-emerald-500/20 text-gray-300' : 'hover:bg-emerald-100 text-gray-700'
                                                    }`}
                                            >
                                                <Mail size={16} />
                                                Send Thank You
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                handleDownloadReceiptClick();
                                                setShowActions(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-violet-500/20 text-gray-300' : 'hover:bg-violet-100 text-gray-700'
                                                }`}
                                        >
                                            <Download size={16} />
                                            Download Receipt
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Donation Amount Highlight */}
                <div className="mb-6">
                    <motion.div
                        animate={{
                            scale: isHovered ? [1, 1.02, 1] : 1,
                        }}
                        transition={{
                            duration: isHovered ? 1.5 : 0.1,
                            repeat: isHovered ? Infinity : 0
                        }}
                        className={`text-3xl font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
                        title={'₹ ' + getFullFormattedNumber(donation.amount, false)}
                    >
                        ₹ {formatAmount(donation.amount)}
                    </motion.div>
                    <p className={`text-sm text-center font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        For: <span className="font-semibold">{donation.requestTitle}</span>
                    </p>
                </div>

                {/* Donor & Request Info */}
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
                        className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
                    >
                        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Donor Type
                        </p>
                        <div className="flex items-center gap-2">
                            <DonorTypeIcon size={14} className={donorTypeColor.text} />
                            <span className={`text-sm font-medium ${donorTypeColor.text}`}>
                                {donation.donorType}
                            </span>
                        </div>
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
                        className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
                    >
                        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Payment Method
                        </p>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {donation.paymentMethod}
                        </p>
                    </motion.div>
                </div>

                {/* Request Progress */}
                {request && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Request Progress
                            </span>
                            <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {((request.donatedAmount / request.requiredAmount) * 100).toFixed(1)}%
                            </span>
                        </div>
                        <div className="relative h-2 rounded-full overflow-hidden bg-gray-700/20">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(request.donatedAmount / request.requiredAmount) * 100}%` }}
                                transition={{ duration: 1.5, ease: "easeOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 0.5 }}
                                className={`absolute h-full rounded-full bg-gradient-to-r ${categoryColor.gradient}`}
                            />
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                            <span
                                className={isDark ? 'text-gray-400' : 'text-gray-600'}
                                title={'₹ ' + getFullFormattedNumber(request.donatedAmount, false)}
                            >
                                ₹ {formatValue(request.donatedAmount, true)}
                            </span>
                            <span
                                className={isDark ? 'text-gray-400' : 'text-gray-600'}
                                title={'₹ ' + getFullFormattedNumber(request.requiredAmount, false)}
                            >
                                ₹ {formatValue(request.requiredAmount, true)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Donor Message */}
                {donation.message && (
                    <div className="mb-6">
                        <motion.div
                            animate={{
                                scale: isHovered ? [1, 1.01, 1] : 1,
                            }}
                            transition={{
                                duration: isHovered ? 1.8 : 0.1,
                                repeat: isHovered ? Infinity : 0
                            }}
                            className={`p-4 rounded-xl ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'} border`}
                        >
                            <div className="flex items-start gap-3">
                                <MessageSquare size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                <p className={`text-sm italic ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                                    "{donation.message}"
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Footer Section */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/20">
                    <motion.div
                        animate={{
                            scale: isHovered ? [1, 1.02, 1] : 1,
                        }}
                        transition={{
                            duration: isHovered ? 1.8 : 0.1,
                            repeat: isHovered ? Infinity : 0
                        }}
                        className="flex items-center gap-2 text-sm"
                    >
                        <Calendar size={14} className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                            {formatDate(donation.date)}
                        </span>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
});

// ==================== MEMOIZED STATIC DATA ====================
const mockDonationsData = [
    {
        id: 'DON-2024-001',
        donationId: 'DON001234',
        requestId: 'REQ-2024-006',
        requestTitle: 'Heart Surgery for Mother',
        donorName: 'Sarah Johnson',
        donorType: 'Individual',
        isAnonymous: false,
        amount: 50000,
        currency: 'INR',
        status: 'Completed',
        paymentMethod: 'Credit Card',
        transactionId: 'TXN78901234',
        date: '2024-03-25T14:30:00',
        message: 'Wishing your mother a speedy recovery. My prayers are with you.',
        donorEmail: 'sarah.j@email.com',
        donorPhone: '+91-555-0123',
        location: 'Mumbai, India',
        taxReceipt: true,
        receiptSent: true,
        isRecurring: false,
        category: 'Medical',
        tags: ['medical', 'emergency', 'heart'],
        verificationStatus: 'Verified',
        notes: 'Donor requested receipt via email',
        impact: 'Covered 5% of total surgery cost',
        thanked: false
    },
    {
        id: 'DON-2024-002',
        donationId: 'DON001235',
        requestId: 'REQ-2024-006',
        requestTitle: 'Heart Surgery for Mother',
        donorName: 'Anonymous',
        donorType: 'Anonymous',
        isAnonymous: true,
        amount: 100000,
        currency: 'INR',
        status: 'Completed',
        paymentMethod: 'Bank Transfer',
        transactionId: 'TXN78901235',
        date: '2024-03-26T09:15:00',
        message: 'Stay strong! Hope this helps.',
        donorEmail: null,
        donorPhone: null,
        location: null,
        taxReceipt: false,
        receiptSent: false,
        isRecurring: false,
        category: 'Medical',
        tags: ['medical', 'anonymous', 'support'],
        verificationStatus: 'Verified',
        notes: 'Anonymous donation - no contact info',
        impact: 'Covered 10% of total surgery cost',
        thanked: false
    },
    {
        id: 'DON-2024-003',
        donationId: 'DON001236',
        requestId: 'REQ-2024-006',
        requestTitle: 'Heart Surgery for Mother',
        donorName: 'Mike Chen',
        donorType: 'Individual',
        isAnonymous: false,
        amount: 30000,
        currency: 'INR',
        status: 'Completed',
        paymentMethod: 'PayPal',
        transactionId: 'TXN78901236',
        date: '2024-03-27T16:45:00',
        message: 'From one human to another. Get well soon!',
        donorEmail: 'mike.chen@email.com',
        donorPhone: '+91-7911-123456',
        location: 'Delhi, India',
        taxReceipt: true,
        receiptSent: true,
        isRecurring: false,
        category: 'Medical',
        tags: ['medical', 'international', 'support'],
        verificationStatus: 'Verified',
        notes: 'International donor',
        impact: 'Covered 3% of total surgery cost',
        thanked: false
    },
    {
        id: 'DON-2024-004',
        donationId: 'DON001237',
        requestId: 'REQ-2024-010',
        requestTitle: 'House Rent Assistance',
        donorName: 'Community Hope Foundation',
        donorType: 'Organization',
        isAnonymous: false,
        amount: 25000,
        currency: 'INR',
        status: 'Completed',
        paymentMethod: 'Bank Transfer',
        transactionId: 'TXN78901237',
        date: '2024-04-02T11:20:00',
        message: 'Providing housing stability for families in need.',
        donorEmail: 'info@communityhope.org',
        donorPhone: '+91-21-1234567',
        location: 'Mumbai, India',
        taxReceipt: true,
        receiptSent: true,
        isRecurring: true,
        category: 'Housing',
        tags: ['housing', 'organization', 'recurring'],
        verificationStatus: 'Verified',
        notes: 'Recurring monthly donation',
        impact: 'Covered 42% of monthly rent',
        thanked: false
    },
    {
        id: 'DON-2024-005',
        donationId: 'DON001238',
        requestId: 'REQ-2024-011',
        requestTitle: 'Emergency Medical Treatment',
        donorName: 'Healthcare Heroes NGO',
        donorType: 'Organization',
        isAnonymous: false,
        amount: 150000,
        currency: 'INR',
        status: 'Completed',
        paymentMethod: 'Bank Transfer',
        transactionId: 'TXN78901238',
        date: '2024-04-06T10:00:00',
        message: 'Emergency medical support for urgent cases.',
        donorEmail: 'support@healthcareheroes.org',
        donorPhone: '+91-42-7654321',
        location: 'Bangalore, India',
        taxReceipt: true,
        receiptSent: true,
        isRecurring: false,
        category: 'Medical',
        tags: ['medical', 'emergency', 'ngo'],
        verificationStatus: 'Verified',
        notes: 'NGO specializing in medical emergencies',
        impact: 'Covered 30% of emergency treatment cost',
        thanked: false
    },
    {
        id: 'DON-2024-006',
        donationId: 'DON001239',
        requestId: 'REQ-2024-012',
        requestTitle: 'University Tuition Fees',
        donorName: 'Education For All',
        donorType: 'Organization',
        isAnonymous: false,
        amount: 75000,
        currency: 'INR',
        status: 'Completed',
        paymentMethod: 'Credit Card',
        transactionId: 'TXN78901239',
        date: '2024-04-11T13:45:00',
        message: 'Investing in education is investing in the future.',
        donorEmail: 'contact@educationforall.org',
        donorPhone: '+91-51-9876543',
        location: 'Delhi, India',
        taxReceipt: true,
        receiptSent: true,
        isRecurring: false,
        category: 'Education',
        tags: ['education', 'tuition', 'organization'],
        verificationStatus: 'Verified',
        notes: 'Education-focused NGO',
        impact: 'Covered 50% of semester fees',
        thanked: false
    },
    {
        id: 'DON-2024-007',
        donationId: 'DON001240',
        requestId: 'REQ-2024-013',
        requestTitle: 'Food Supplies for Family',
        donorName: 'Food Bank India',
        donorType: 'Organization',
        isAnonymous: false,
        amount: 20000,
        currency: 'INR',
        status: 'Completed',
        paymentMethod: 'Bank Transfer',
        transactionId: 'TXN78901240',
        date: '2024-04-13T15:30:00',
        message: 'No family should go hungry. We stand with you.',
        donorEmail: 'support@foodbank.in',
        donorPhone: '+91-22-1122334',
        location: 'Mumbai, India',
        taxReceipt: true,
        receiptSent: true,
        isRecurring: true,
        category: 'Food',
        tags: ['food', 'groceries', 'recurring'],
        verificationStatus: 'Verified',
        notes: 'Monthly food support program',
        impact: 'Provided 2 weeks of groceries',
        thanked: false
    },
    {
        id: 'DON-2024-008',
        donationId: 'DON001241',
        requestId: 'REQ-2024-015',
        requestTitle: 'Transportation Vehicle Repair',
        donorName: 'Rahul Sharma',
        donorType: 'Individual',
        isAnonymous: false,
        amount: 15000,
        currency: 'INR',
        status: 'Completed',
        paymentMethod: 'PhonePe',
        transactionId: 'TXN78901241',
        date: '2024-04-19T17:20:00',
        message: 'Hope this helps get your vehicle back on the road!',
        donorEmail: 'rahul.sharma@email.com',
        donorPhone: '+91-98765-43210',
        location: 'Delhi, India',
        taxReceipt: false,
        receiptSent: false,
        isRecurring: false,
        category: 'Transportation',
        tags: ['transportation', 'local', 'support'],
        verificationStatus: 'Verified',
        notes: 'Local donor via mobile payment',
        impact: 'Covered 20% of repair cost',
        thanked: false
    },
    {
        id: 'DON-2024-009',
        donationId: 'DON001242',
        requestId: 'REQ-2024-006',
        requestTitle: 'Heart Surgery for Mother',
        donorName: 'Dr. Rajesh Kumar',
        donorType: 'Individual',
        isAnonymous: false,
        amount: 75000,
        currency: 'INR',
        status: 'Completed',
        paymentMethod: 'Credit Card',
        transactionId: 'TXN78901242',
        date: '2024-03-28T20:10:00',
        message: 'As a doctor, I understand the importance of timely medical care. Best wishes.',
        donorEmail: 'rajesh.kumar@email.com',
        donorPhone: '+91-98765-12345',
        location: 'Chennai, India',
        taxReceipt: true,
        receiptSent: true,
        isRecurring: false,
        category: 'Medical',
        tags: ['medical', 'doctor', 'professional'],
        verificationStatus: 'Verified',
        notes: 'Medical professional donor',
        impact: 'Covered 7.5% of surgery cost',
        thanked: false
    },
    {
        id: 'DON-2024-010',
        donationId: 'DON001243',
        requestId: 'REQ-2024-010',
        requestTitle: 'House Rent Assistance',
        donorName: 'Local Community Group',
        donorType: 'Organization',
        isAnonymous: false,
        amount: 15000,
        currency: 'INR',
        status: 'Completed',
        paymentMethod: 'Bank Transfer',
        transactionId: 'TXN78901243',
        date: '2024-04-03T14:00:00',
        message: 'Our community stands together.',
        donorEmail: 'community@localgroup.in',
        donorPhone: '+91-98765-67890',
        location: 'Mumbai, India',
        taxReceipt: true,
        receiptSent: true,
        isRecurring: false,
        category: 'Housing',
        tags: ['housing', 'community', 'local'],
        verificationStatus: 'Verified',
        notes: 'Local community collection',
        impact: 'Covered 25% of remaining rent',
        thanked: false
    },
    {
        id: 'DON-2024-011',
        donationId: 'DON001244',
        requestId: 'REQ-2024-016',
        requestTitle: 'Wedding Expenses Support',
        donorName: 'Family Support Network',
        donorType: 'Organization',
        isAnonymous: false,
        amount: 50000,
        currency: 'INR',
        status: 'Completed',
        paymentMethod: 'Bank Transfer',
        transactionId: 'TXN78901244',
        date: '2024-04-21T12:30:00',
        message: 'Every family deserves a beautiful beginning.',
        donorEmail: 'info@familysupport.in',
        donorPhone: '+91-98765-98765',
        location: 'Kolkata, India',
        taxReceipt: true,
        receiptSent: true,
        isRecurring: false,
        category: 'Other',
        tags: ['wedding', 'family', 'celebration'],
        verificationStatus: 'Verified',
        notes: 'Family welfare organization',
        impact: 'Covered 17% of wedding expenses',
        thanked: false
    },
    {
        id: 'DON-2024-012',
        donationId: 'DON001245',
        requestId: 'REQ-2024-017',
        requestTitle: 'Computer for Online Work',
        donorName: 'Tech for Good India',
        donorType: 'Organization',
        isAnonymous: false,
        amount: 60000,
        currency: 'INR',
        status: 'Completed',
        paymentMethod: 'Credit Card',
        transactionId: 'TXN78901245',
        date: '2024-04-23T09:45:00',
        message: 'Empowering digital livelihoods. Good luck with your online work!',
        donorEmail: 'contact@techforgood.in',
        donorPhone: '+91-98765-54321',
        location: 'Hyderabad, India',
        taxReceipt: true,
        receiptSent: true,
        isRecurring: false,
        category: 'Business',
        tags: ['business', 'technology', 'empowerment'],
        verificationStatus: 'Verified',
        notes: 'Digital empowerment NGO',
        impact: 'Covered 50% of computer cost',
        thanked: false
    }
];

const mockRequests = [
    { id: 'REQ-2024-006', title: 'Heart Surgery for Mother', requiredAmount: 1000000, donatedAmount: 255000, remainingAmount: 745000, category: 'Medical' },
    { id: 'REQ-2024-010', title: 'House Rent Assistance', requiredAmount: 60000, donatedAmount: 40000, remainingAmount: 20000, category: 'Housing' },
    { id: 'REQ-2024-011', title: 'Emergency Medical Treatment', requiredAmount: 500000, donatedAmount: 150000, remainingAmount: 350000, category: 'Medical' },
    { id: 'REQ-2024-012', title: 'University Tuition Fees', requiredAmount: 150000, donatedAmount: 75000, remainingAmount: 75000, category: 'Education' },
    { id: 'REQ-2024-013', title: 'Food Supplies for Family', requiredAmount: 45000, donatedAmount: 20000, remainingAmount: 25000, category: 'Food' },
    { id: 'REQ-2024-015', title: 'Transportation Vehicle Repair', requiredAmount: 75000, donatedAmount: 15000, remainingAmount: 60000, category: 'Transportation' },
    { id: 'REQ-2024-016', title: 'Wedding Expenses Support', requiredAmount: 300000, donatedAmount: 50000, remainingAmount: 250000, category: 'Other' },
    { id: 'REQ-2024-017', title: 'Computer for Online Work', requiredAmount: 120000, donatedAmount: 60000, remainingAmount: 60000, category: 'Business' }
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

const ProgressCircle = React.memo(({ percentage, size = 80, isDark }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = useCallback(() => {
        if (percentage >= 75) return '#10b981';
        if (percentage >= 50) return '#3b82f6';
        if (percentage >= 25) return '#f59e0b';
        return '#ef4444';
    }, [percentage]);

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
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 0.5
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

const EnhancedStatCard = React.memo(({
    icon: Icon,
    title,
    value,
    change,
    changeType,
    color,
    delay,
    fullNumber,
    isDark,
    subtitle,
    iconColor
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
                                    color.includes('cyan') ? 'from-cyan-500 to-blue-500' :
                                        color.includes('rose') ? 'from-rose-500 to-pink-500' :
                                            'from-amber-500 to-orange-500'
                            }`}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: delay + 0.2, type: "spring" }}
                        title={fullNumber}
                    >
                        {value}
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

// ==================== UPDATED PAGINATION COMPONENT ====================
const Pagination = React.memo(({ currentPage, totalPages, onPageChange, isDark, totalItems, itemsPerPage }) => {
  if (totalPages <= 1) return null;

  const handlePageChange = useCallback((page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);

      // Add smooth scroll to top of donations section after page change
      setTimeout(() => {
        const donationsSection = document.querySelector('.donations-grid-container')?.parentElement;
        if (donationsSection) {
          const yOffset = -100;
          const y = donationsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

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
        Page {currentPage} of {totalPages} • Showing {startItem}-{endItem} donations from {totalItems}
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

// ==================== MAIN DONATIONS COMPONENT ====================
const Donations = ({ isDark }) => {
    const [donations, setDonations] = useState(mockDonationsData);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState('All Requests');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [confirmationData, setConfirmationData] = useState({
        type: null,
        donationId: null,
        title: '',
        message: '',
        onConfirm: null
    });

    // ==================== REFS ====================
    const isMounted = useRef(true);
    const statsCache = useRef(null);

    const scrollPosition = useRef(0);

useEffect(() => {
    const isAnyModalOpen =
        showDetailModal ||
        showSuccessDialog ||
        showConfirmationDialog;

    if (isAnyModalOpen) {
        // Save current scroll position
        scrollPosition.current = window.pageYOffset || document.documentElement.scrollTop;
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'relative';
        document.body.style.height = '100%';
        
        // Calculate scrollbar width and add padding to prevent layout shift
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollBarWidth}px`;
        document.body.classList.add('modal-open');
    } else {
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.height = '';
        document.body.style.paddingRight = '';
        document.body.classList.remove('modal-open');

        // Restore scroll position
        if (scrollPosition.current !== undefined) {
            window.scrollTo(0, scrollPosition.current);
        }
    }

    return () => {
        // Cleanup
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.height = '';
        document.body.style.paddingRight = '';
        document.body.classList.remove('modal-open');
    };
}, [
    showDetailModal,
    showSuccessDialog,
    showConfirmationDialog
]);

    // ==================== CONSTANTS ====================
    const statusOptions = useMemo(() => [
        'All Status',
        'Completed',
        'Pending',
        'Failed',
        'Refunded'
    ], []);

    const categoryOptions = useMemo(() => [
        'All Categories',
        'Medical',
        'Education',
        'Housing',
        'Food',
        'Business',
        'Transportation',
        'Other'
    ], []);

    const sortOptions = useMemo(() => [
        { value: 'date', label: 'Date (Newest First)' },
        { value: 'amount', label: 'Amount (High to Low)' },
        { value: 'amount-asc', label: 'Amount (Low to High)' },
        { value: 'name', label: 'Donor Name (A-Z)' }
    ], []);

    // ==================== EFFECTS ====================
    useEffect(() => {
        isMounted.current = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedRequest, selectedCategory, dateRange, sortBy, sortOrder]);

    // ==================== HELPER FUNCTIONS ====================
    const getCategoryColor = useCallback((category) => {
        const colors = {
            'Medical': { gradient: 'from-rose-500 to-pink-600', icon: Heart, bg: 'bg-rose-500/10', text: 'text-rose-600', border: 'border-rose-500/20' },
            'Education': { gradient: 'from-blue-500 to-cyan-600', icon: Award, bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20' },
            'Housing': { gradient: 'from-purple-500 to-violet-600', icon: Shield, bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/20' },
            'Food': { gradient: 'from-emerald-500 to-teal-600', icon: Users, bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20' },
            'Business': { gradient: 'from-indigo-500 to-blue-600', icon: BarChart3, bg: 'bg-indigo-500/10', text: 'text-indigo-600', border: 'border-indigo-500/20' },
            'Transportation': { gradient: 'from-cyan-500 to-blue-600', icon: Activity, bg: 'bg-cyan-500/10', text: 'text-cyan-600', border: 'border-cyan-500/20' },
            'Other': { gradient: 'from-amber-500 to-orange-600', icon: FileText, bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20' }
        };
        return colors[category] || colors.Other;
    }, []);

    const getDonorTypeColor = useCallback((type) => {
        const colors = {
            'Individual': { bg: 'bg-blue-500/20', text: 'text-blue-600', border: 'border-blue-500/30', icon: User },
            'Organization': { bg: 'bg-purple-500/20', text: 'text-purple-600', border: 'border-purple-500/30', icon: Users },
            'Anonymous': { bg: 'bg-gray-500/20', text: 'text-gray-600', border: 'border-gray-500/30', icon: Eye }
        };
        return colors[type] || colors.Individual;
    }, []);

    const getPrimaryColor = useCallback((gradient = '') => {
        if (!gradient) return '#6b7280';
        if (gradient.includes('rose')) return '#f43f5e';
        if (gradient.includes('blue')) return '#3b82f6';
        if (gradient.includes('purple')) return '#8b5cf6';
        if (gradient.includes('emerald')) return '#10b981';
        if (gradient.includes('cyan')) return '#06b6d4';
        if (gradient.includes('amber')) return '#f59e0b';
        return '#6b7280';
    }, []);

    const formatDate = useCallback((dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    const formatAmount = useCallback((amount) => {
        return formatValue(amount, true);
    }, []);

    const getRequestById = useCallback((requestId) => {
        return mockRequests.find(request => request.id === requestId);
    }, []);

    // ==================== MEMOIZED COMPUTATIONS ====================
    const filteredDonations = useMemo(() => {
        let filtered = donations;

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(donation =>
                donation.requestTitle.toLowerCase().includes(term) ||
                donation.donorName.toLowerCase().includes(term) ||
                donation.donationId.toLowerCase().includes(term) ||
                donation.message?.toLowerCase().includes(term)
            );
        }

        // Request filter
        if (selectedRequest !== 'All Requests') {
            filtered = filtered.filter(donation => donation.requestId === selectedRequest);
        }

        // Category filter
        if (selectedCategory !== 'All Categories') {
            filtered = filtered.filter(donation => donation.category === selectedCategory);
        }

        // Date range filter
        if (dateRange.start) {
            filtered = filtered.filter(donation => donation.date.split('T')[0] >= dateRange.start);
        }
        if (dateRange.end) {
            filtered = filtered.filter(donation => donation.date.split('T')[0] <= dateRange.end);
        }

        // Sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return sortOrder === 'desc'
                        ? new Date(b.date) - new Date(a.date)
                        : new Date(a.date) - new Date(b.date);
                case 'amount':
                    return sortOrder === 'desc'
                        ? b.amount - a.amount
                        : a.amount - b.amount;
                case 'name':
                    return a.donorName.localeCompare(b.donorName);
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });

        return filtered;
    }, [donations, searchTerm, selectedRequest, selectedCategory, dateRange, sortBy, sortOrder]);

    const paginatedDonations = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredDonations.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredDonations, currentPage, itemsPerPage]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredDonations.length / itemsPerPage);
    }, [filteredDonations.length, itemsPerPage]);

    const stats = useMemo(() => {
        if (statsCache.current && JSON.stringify(statsCache.current.source) === JSON.stringify(donations)) {
            return statsCache.current.data;
        }

        const totalDonations = donations.length;
        const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
        const averageDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;

        const individualDonors = donations.filter(d => d.donorType === 'Individual').length;
        const organizationDonors = donations.filter(d => d.donorType === 'Organization').length;
        const anonymousDonors = donations.filter(d => d.isAnonymous).length;

        const recurringDonations = donations.filter(d => d.isRecurring).length;
        const internationalDonations = donations.filter(d =>
            d.location && !d.location.includes('India')
        ).length;

        const recentDonations = donations.filter(d => {
            const donationDate = new Date(d.date);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return donationDate >= thirtyDaysAgo;
        }).length;

        const topDonation = donations.length > 0
            ? Math.max(...donations.map(d => d.amount))
            : 0;

        // Calculate request-specific stats
        const requestProgress = mockRequests.map(request => {
            const requestDonations = donations.filter(d => d.requestId === request.id);
            const donatedAmount = requestDonations.reduce((sum, d) => sum + d.amount, 0);
            const progressPercentage = (donatedAmount / request.requiredAmount) * 100;
            return {
                ...request,
                donatedAmount,
                progress: progressPercentage.toFixed(1)
            };
        });

        const mostFundedRequest = [...requestProgress].sort((a, b) => b.progress - a.progress)[0];

        const computedStats = {
            totalDonations,
            totalAmount,
            averageDonation,
            individualDonors,
            organizationDonors,
            anonymousDonors,
            recurringDonations,
            internationalDonations,
            recentDonations,
            topDonation,
            requestProgress,
            mostFundedRequest
        };

        statsCache.current = {
            source: [...donations],
            data: computedStats
        };

        return computedStats;
    }, [donations]);

    // ==================== MODAL HANDLERS ====================
    const openDetailModal = useCallback((donation) => {
        setSelectedDonation(donation);
        setShowDetailModal(true);
    }, []);

    const closeDetailModal = useCallback(() => {
        setShowDetailModal(false);
        setSelectedDonation(null);
    }, []);

    // ==================== DONATION HANDLERS ====================
    const handleSendThankYou = useCallback((donationId) => {
        setConfirmationData({
            type: 'thank',
            donationId: donationId,
            title: 'Send Thank You',
            message: 'Are you sure you want to send a thank you message to this donor? This will notify them via email.',
            onConfirm: () => {
                setDonations(prev => prev.map(donation =>
                    donation.id === donationId ? { ...donation, thanked: true } : donation
                ));
                setSuccessMessage('Thank you sent successfully! Donor will receive your gratitude message.');
                setShowSuccessDialog(true);
            }
        });
        setShowConfirmationDialog(true);
    }, []);

    const handleDownloadReceipt = useCallback((donationId) => {
        setSuccessMessage('Receipt downloaded successfully!');
        setShowSuccessDialog(true);
    }, []);

    // ==================== DETAIL MODAL ====================
    const DetailModal = React.memo(({ donation, isDark, onClose, getRequestById, getCategoryColor, getDonorTypeColor, formatAmount, formatDate, onSendThankYou }) => {
        if (!donation) return null;

        const request = getRequestById(donation.requestId);
        const categoryColor = getCategoryColor(donation.category);
        const CategoryIcon = categoryColor.icon;
        const donorTypeColor = getDonorTypeColor(donation.donorType);
        const DonorTypeIcon = donorTypeColor.icon;

        return (
            <motion.div
                key="detail-modal"
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
                    <div className="relative p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-t-3xl">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-bold text-white mb-1">
                                    Donation Details
                                </h2>
                                <p className="text-emerald-100 text-sm font-medium">
                                    Complete information about this donation
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

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Donation Overview */}
                        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3
                                        className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
                                        title={'₹ ' + getFullFormattedNumber(donation.amount, false)}
                                    >
                                        ₹ {formatAmount(donation.amount)}
                                    </h3>
                                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Donated to: <span className="font-semibold">{donation.requestTitle}</span>
                                    </p>
                                </div>
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                                    <CategoryIcon size={32} className={categoryColor.text} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Donation ID
                                    </p>
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {donation.donationId}
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Transaction ID
                                    </p>
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {donation.transactionId}
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Status
                                    </p>
                                    <div className={`inline-flex items-center gap-2 px-2 py-1 text-xs rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white`}>
                                        <CheckCircle size={12} />
                                        {donation.status}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Donor Information */}
                        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Donor Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${donorTypeColor.bg}`}>
                                        <DonorTypeIcon size={20} className={donorTypeColor.text} />
                                    </div>
                                    <div>
                                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {donation.donorName}
                                        </p>
                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {donation.donorType}
                                        </p>
                                    </div>
                                </div>

                                {!donation.isAnonymous && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {donation.donorEmail && (
                                            <div className="flex items-center gap-2">
                                                <Mail size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {donation.donorEmail}
                                                </span>
                                            </div>
                                        )}
                                        {donation.donorPhone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {donation.donorPhone}
                                                </span>
                                            </div>
                                        )}
                                        {donation.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {donation.location}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Transaction Details
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Payment Method
                                        </p>
                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {donation.paymentMethod}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Date & Time
                                        </p>
                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {formatDate(donation.date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Type
                                        </p>
                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {donation.isRecurring ? 'Recurring Donation' : 'One-time Donation'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Impact */}
                            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Impact
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Your Request Progress
                                        </p>
                                        {request && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {((request.donatedAmount / request.requiredAmount) * 100).toFixed(1)}% Funded
                                                    </span>
                                                    <span
                                                        className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                                                        title={`₹ ${getFullFormattedNumber(request.donatedAmount, false)} / ₹ ${getFullFormattedNumber(request.requiredAmount, false)}`}
                                                    >
                                                        ₹ {formatValue(request.donatedAmount, true)} / ₹ {formatValue(request.requiredAmount, true)}
                                                    </span>
                                                </div>
                                                <div className="relative h-2 rounded-full overflow-hidden bg-gray-700/20">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(request.donatedAmount / request.requiredAmount) * 100}%` }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                        className={`absolute h-full rounded-full bg-gradient-to-r ${categoryColor.gradient}`}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {donation.impact && (
                                        <div>
                                            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                This Donation's Impact
                                            </p>
                                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {donation.impact}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Donor Message */}
                        {donation.message && (
                            <div className={`p-6 rounded-2xl ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'} border`}>
                                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Donor Message
                                </h3>
                                <div className="flex items-start gap-3">
                                    <MessageSquare size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                    <p className={`text-base italic ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                                        "{donation.message}"
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        );
    });

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
                        Loading donations...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 px-4">
            {/* Statistics Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <EnhancedStatCard
                    icon={IndianRupee}
                    title="Total Received"
                    value={formatValue(stats.totalAmount, true)}
                    fullNumber={'₹ ' + getFullFormattedNumber(stats.totalAmount, true)}
                    change={12.5}
                    changeType="increase"
                    color="from-emerald-500 to-emerald-600"
                    delay={0.1}
                    isDark={isDark}
                />
                <EnhancedStatCard
                    icon={Users}
                    title="Total Donors"
                    value={stats.totalDonations}
                    fullNumber={getFullFormattedNumber(stats.totalDonations, true)}
                    change={8.3}
                    changeType="increase"
                    color="from-blue-500 to-blue-600"
                    delay={0.2}
                    isDark={isDark}
                />
                <EnhancedStatCard
                    icon={IndianRupee}
                    title="Average Donation"
                    value={formatValue(Math.round(stats.averageDonation), true)}
                    fullNumber={'₹ ' + getFullFormattedNumber(stats.averageDonation, true)}
                    change={5.7}
                    changeType="increase"
                    color="from-violet-500 to-violet-600"
                    delay={0.3}
                    isDark={isDark}
                />
                <EnhancedStatCard
                    icon={TrendingUpIcon}
                    title="Recent Donations"
                    value={stats.recentDonations}
                    fullNumber={getFullFormattedNumber(stats.recentDonations, true)}
                    change={15.2}
                    changeType="increase"
                    color="from-amber-500 to-amber-600"
                    delay={0.4}
                    isDark={isDark}
                />
            </motion.div>

            {/* Search and Filter Section */}
            <div className="filter-section">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`rounded-3xl p-6 overflow-hidden ${isDark
                        ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
                        : 'bg-gradient-to-br from-white via-white to-gray-50'
                        }`}
                    style={{
                        boxShadow: isDark
                            ? '0 10px 40px rgba(0, 0, 0, 0.3)'
                            : '0 10px 40px rgba(0, 0, 0, 0.08)',
                        willChange: 'transform, opacity',
                        contain: 'layout paint',
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
                                    placeholder="Search donations by donor name, request title, or message..."
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

                    <AnimatePresence mode="wait">
                        {showFilters && (
                            <motion.div
                                key="filter-panel"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                    height: { duration: 0.3 }
                                }}
                                className="overflow-hidden"
                                style={{
                                    willChange: 'height, opacity',
                                    contain: 'content',
                                }}
                            >
                                <div
                                    className={`p-6 rounded-2xl mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden',
                                        transform: 'translateZ(0)',
                                        WebkitTransform: 'translateZ(0)',
                                    }}
                                >
                                    {/* First row - 3 filters */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                        <div className="relative">
                                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Request
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={selectedRequest}
                                                    onChange={(e) => setSelectedRequest(e.target.value)}
                                                    className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium appearance-none ${isDark
                                                        ? 'bg-gray-800 border-gray-600 text-white'
                                                        : 'bg-white border-gray-200 text-gray-900'
                                                        }`}
                                                    style={{
                                                        paddingRight: '2.5rem'
                                                    }}
                                                >
                                                    <option value="All Requests">All Requests</option>
                                                    {mockRequests.map(request => (
                                                        <option key={request.id} value={request.id}>
                                                            {request.title}
                                                        </option>
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

                                        <div className="relative">
                                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Sort By
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={sortBy}
                                                    onChange={(e) => {
                                                        setSortBy(e.target.value);
                                                        if (e.target.value.includes('asc')) {
                                                            setSortOrder('asc');
                                                        } else {
                                                            setSortOrder('desc');
                                                        }
                                                    }}
                                                    className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium appearance-none ${isDark
                                                        ? 'bg-gray-800 border-gray-600 text-white'
                                                        : 'bg-white border-gray-200 text-gray-900'
                                                        }`}
                                                    style={{
                                                        paddingRight: '2.5rem'
                                                    }}
                                                >
                                                    {sortOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                                <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    <ChevronDown size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Second row - Date Range */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={dateRange.start}
                                                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                                className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                                    ? 'bg-gray-800 border-gray-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    }`}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                End Date
                                            </label>
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
                                            Showing {filteredDonations.length} of {donations.length} donations
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSearchTerm('');
                                                setSelectedRequest('All Requests');
                                                setSelectedCategory('All Categories');
                                                setDateRange({ start: '', end: '' });
                                                setSortBy('date');
                                                setSortOrder('desc');
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
            </div>

            {/* Donations Card Grid */}
            {paginatedDonations.length > 0 ? (
                <>
                    <div className="donations-grid-container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                        >
                            {paginatedDonations.map((donation, index) => (
                                <DonationCard
                                    key={`donation-${donation.id}-${index}`}
                                    donation={donation}
                                    index={index}
                                    isDark={isDark}
                                    onViewDetails={openDetailModal}
                                    onSendThankYou={handleSendThankYou}
                                    onDownloadReceipt={handleDownloadReceipt}
                                    getRequestById={getRequestById}
                                    getCategoryColor={getCategoryColor}
                                    getDonorTypeColor={getDonorTypeColor}
                                    getPrimaryColor={getPrimaryColor}
                                    formatAmount={formatAmount}
                                    formatDate={formatDate}
                                />
                            ))}
                        </motion.div>
                    </div>

                    {/* Pagination */}
{totalPages > 1 && (
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
    isDark={isDark}
    totalItems={filteredDonations.length}
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
                        <Gift size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                    </motion.div>
                    <p className={`text-base font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        No donations found
                    </p>
                    <p className={`text-sm font-medium mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        Donations will appear here once donors contribute to your requests
                    </p>
                </motion.div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {showDetailModal && (
                    <DetailModal
                        donation={selectedDonation}
                        isDark={isDark}
                        onClose={closeDetailModal}
                        getRequestById={getRequestById}
                        getCategoryColor={getCategoryColor}
                        getDonorTypeColor={getDonorTypeColor}
                        formatAmount={formatAmount}
                        formatDate={formatDate}
                        onSendThankYou={handleSendThankYou}
                    />
                )}

                {showConfirmationDialog && (
                    <ConfirmationDialog
                        isDark={isDark}
                        title={confirmationData.title}
                        message={confirmationData.message}
                        onConfirm={() => {
                            confirmationData.onConfirm?.();
                            setShowConfirmationDialog(false);
                        }}
                        onCancel={() => setShowConfirmationDialog(false)}
                        confirmText={
                            confirmationData.type === 'thank' ? 'Send Thank You' :
                                confirmationData.type === 'download' ? 'Download Receipt' :
                                    'Confirm'
                        }
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
            </AnimatePresence>
        </div>
    );
};

export default React.memo(Donations);