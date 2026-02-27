import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  // User related icons
  User,
  UserCheck,
  UserCog,
  UserPlus,
  UserMinus,
  UserX,
  UserCheck2,

  // Contact icons
  Mail,
  Phone,
  MapPin,
  MapPinned,

  // Security icons
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Key,
  Lock,
  Fingerprint,

  // Status icons
  CheckCircle,
  XCircle,
  AlertCircle,
  BadgeCheck,
  BadgeAlert,
  BadgeInfo,
  BadgeX,

  // Action icons
  Edit,
  Save,
  Download,
  Upload,
  Trash2,
  X,
  Plus,
  Check,
  ExternalLink,

  // Navigation icons
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,

  // Device icons
  Smartphone,
  Laptop,
  Tablet,
  Monitor,

  // Notification icons
  Bell,
  MailCheck,
  PhoneCall,

  // Time icons
  Calendar,
  Clock,
  CalendarDays,

  // Achievement icons
  Award,
  Medal,
  Trophy,
  Crown,
  Star,
  Sparkles,
  Gift,
  Gem,

  // Activity icons
  Activity,
  TrendingUp,
  TrendingDown,

  // Settings icons
  Settings,
  Monitor as MonitorIcon,
  Sun,
  Moon,

  // Social icons
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Twitch,

  // Globe icons
  Globe,
  Globe2,

  // Document icons
  FileText,

  // Payment/Banking icons
  CreditCard,
  Wallet,
  Banknote,

  // Profile icons
  Users,
  UsersRound,
  UserRound,

  // Eye icons
  Eye,
  EyeOff,

  // Camera icons
  Camera,

  // QR Code
  QrCode,

  // Map icons
  MapPin as MapPinIcon,

  // Message icons
  MessageSquare,

  // Refresh icon
  RefreshCw,

  // Logout icon
  LogOut,

  // Additional icons from recipients management
  Search,
  Filter,
  Eye as ViewIcon,
  MoreVertical,
  Send,
  FileCheck,
  IdCard,
  Briefcase,
  Car,
  Stethoscope,
  Cpu,
  ShoppingBag,
  Sprout,
  Building,
  GraduationCap,
  IndianRupee,
  Music,
  Ghost,
  Image,
  MessageCircle,
  BookOpen,
  Code,
  Hash,
  Code2,
  Rocket,
  Palette,
  PenTool
} from 'lucide-react';

// Add formatValue function from recipients management
const formatValue = (val, isCurrency = false) => {
  if (val === null || val === undefined) {
    return isCurrency ? '₹0' : '0';
  }

  const num = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]+/g, '')) : val;

  if (isNaN(num) || !isFinite(num)) {
    return isCurrency ? '₹0' : '0';
  }

  const absNum = Math.abs(num);
  const isNegative = num < 0;
  const prefix = isNegative ? '-' : '';
  const currencyPrefix = isCurrency ? '₹' : '';

  const formatWithTwoDecimals = (value) => {
    const [whole, decimal] = value.toFixed(10).split('.');
    const decimalPart = decimal ? decimal.slice(0, 2) : '00';
    const trimmedDecimal = decimalPart.replace(/0+$/, '');
    return trimmedDecimal ? `${whole}.${trimmedDecimal}` : whole;
  };

  const formatWithOneDecimal = (value) => {
    const [whole, decimal] = value.toFixed(10).split('.');
    const decimalPart = decimal ? decimal.slice(0, 1) : '0';
    const trimmedDecimal = decimalPart.replace(/0+$/, '');
    return trimmedDecimal ? `${whole}.${trimmedDecimal}` : whole;
  };

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
    const croreValue = absNum / 1e7;
    if (croreValue < 100) {
      return `${prefix}${currencyPrefix}${formatWithTwoDecimals(croreValue)} Cr`;
    } else {
      return `${prefix}${currencyPrefix}${formatWithOneDecimal(croreValue)} Cr`;
    }
  } else if (absNum >= 1e5) {
    const lakhValue = absNum / 1e5;
    if (lakhValue < 10) {
      return `${prefix}${currencyPrefix}${formatWithTwoDecimals(lakhValue)} L`;
    } else {
      return `${prefix}${currencyPrefix}${formatWithOneDecimal(lakhValue)} L`;
    }
  } else if (absNum >= 1e3) {
    const thousandValue = absNum / 1e3;
    if (thousandValue < 10) {
      return `${prefix}${currencyPrefix}${formatWithOneDecimal(thousandValue)} K`;
    } else {
      return `${prefix}${currencyPrefix}${Math.floor(thousandValue)} K`;
    }
  } else {
    return `${prefix}${currencyPrefix}${absNum.toLocaleString('en-IN')}`;
  }
};

// Get full formatted number function
const getFullFormattedNumber = (num, isCurrency = false) => {
  if (num === null || num === undefined) {
    return isCurrency ? '₹0' : '0';
  }

  const parsedNum = typeof num === 'string' ? parseFloat(num.replace(/[^0-9.-]+/g, '')) : num;

  if (isNaN(parsedNum) || !isFinite(parsedNum)) {
    return isCurrency ? '₹0' : '0';
  }

  const isNegative = parsedNum < 0;
  const prefix = isNegative ? '-' : '';
  const currencyPrefix = isCurrency ? '' : '';

  if (Math.abs(parsedNum) >= 1e15) {
    return `${prefix}${currencyPrefix}${Math.abs(parsedNum).toExponential(2)}`;
  }

  return `${prefix}${currencyPrefix}${Math.abs(parsedNum).toLocaleString('en-IN')}`;
};

// Success Dialog Component
const SuccessDialog = memo(({ isDark, title, message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      style={{ margin: 0, padding: 0 }}
      onClick={onClose}
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
          <p className={`text-base font-medium mb-6 text-center ${isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
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

// Confirmation Dialog Component
const ConfirmationDialog = memo(({ isDark, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      style={{ margin: 0, padding: 0 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onCancel(e);
      }}
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCancel(e);
              }}
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

// Enhanced Stat Card Component (matching recipients management style)
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
            <span className={`text-sm font-semibold ${changeType === 'increase' ? 'text-emerald-500' : 'text-rose-500'
              }`}>
              {change}%
            </span>
            <span className={`text-xs ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>vs last month</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

// Profile Progress Circle Component (matching recipients management)
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

// Enhanced Input Field Component (matching recipients management style)
const EnhancedInput = memo(({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  helpText,
  disabled = false,
  isDark,
  icon: Icon,
  error,
  maxLength,
  required = false,
  shakeFields = [],
  fieldName = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);

  const handleChange = (e) => {
    onChange(e.target.value);
    setCharCount(e.target.value.length);
  };

  // Shake animation
  const shakeAnimation = {
    initial: { x: 0 },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
        {maxLength && (
          <span className={`text-xs ${charCount >= maxLength ? 'text-rose-500' : isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      <div className="overflow-visible">
        <motion.div
          animate={shakeFields.includes(fieldName) ? "shake" : "initial"}
          variants={shakeAnimation}
          className="overflow-visible relative"
        >
          <div
            className={`relative rounded-2xl border-2 transition-all ${isDark
              ? error
                ? 'border-rose-500 bg-rose-500/10'
                : isFocused
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-gray-700 bg-gray-800/50'
              : error
                ? 'border-rose-500 bg-rose-50'
                : isFocused
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 bg-white'
              }`}
          >
            {Icon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Icon
                  size={18}
                  className={error
                    ? 'text-rose-500'
                    : isFocused
                      ? 'text-violet-500'
                      : isDark
                        ? 'text-gray-500'
                        : 'text-gray-400'
                  }
                />
              </div>
            )}

            <input
              type={type}
              value={value || ''}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              className={`w-full p-3 rounded-2xl bg-transparent focus:outline-none ${Icon ? 'pl-10' : 'pl-3'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                } ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
            />
          </div>
        </motion.div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-rose-500 text-xs font-medium"
        >
          <AlertCircle size={12} />
          {error}
        </motion.p>
      )}

      {helpText && !error && (
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          {helpText}
        </p>
      )}
    </div>
  );
});

// Enhanced Textarea Component
const EnhancedTextarea = memo(({
  label,
  value,
  onChange,
  placeholder,
  isDark,
  error,
  maxLength,
  required = false,
  rows = 4,
  shakeFields = [],
  fieldName = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);

  const handleChange = (e) => {
    onChange(e.target.value);
    setCharCount(e.target.value.length);
  };

  const shakeAnimation = {
    initial: { x: 0 },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
        {maxLength && (
          <span className={`text-xs ${charCount >= maxLength ? 'text-rose-500' : isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      <div className="overflow-visible">
        <motion.div
          animate={shakeFields.includes(fieldName) ? "shake" : "initial"}
          variants={shakeAnimation}
          className="overflow-visible relative"
        >
          <div
            className={`relative rounded-2xl border-2 transition-all ${isDark
              ? error
                ? 'border-rose-500 bg-rose-500/10'
                : isFocused
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-gray-700 bg-gray-800/50'
              : error
                ? 'border-rose-500 bg-rose-50'
                : isFocused
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 bg-white'
              }`}
          >
            <textarea
              value={value || ''}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              rows={rows}
              maxLength={maxLength}
              className={`w-full p-3 rounded-2xl bg-transparent focus:outline-none resize-none ${isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
            />
          </div>
        </motion.div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-rose-500 text-xs font-medium"
        >
          <AlertCircle size={12} />
          {error}
        </motion.p>
      )}
    </div>
  );
});

// Enhanced Avatar Upload Component - Fixed Version
const EnhancedAvatarUpload = memo(({ user, onAvatarChange, isDark, fieldErrors, onFieldError, shakeFields }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || null);
  const [isHovered, setIsHovered] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update preview when user avatar changes externally
  useEffect(() => {
    console.log('User avatar changed:', user?.avatar ? 'Has avatar' : 'No avatar');
    setPreviewUrl(user?.avatar || null);
  }, [user?.avatar]);

  const validateAndProcessFile = (file) => {
    console.log('Validating file:', file.name, file.type, file.size);

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      const error = 'Only JPG, PNG, GIF, and WEBP images are allowed';
      setValidationError(error);
      if (onFieldError) {
        onFieldError('avatar', error);
      }
      return false;
    }

    if (file.size > maxSize) {
      const error = 'Image size must be less than 5MB';
      setValidationError(error);
      if (onFieldError) {
        onFieldError('avatar', error);
      }
      return false;
    }

    return true;
  };

  const processFile = (file) => {
    console.log('Processing file:', file.name);
    setIsLoading(true);
    setValidationError('');

    // Use FileReader directly without image dimension validation first
    const reader = new FileReader();

    reader.onload = (e) => {
      console.log('FileReader loaded successfully');
      const result = e.target.result;

      // Set preview immediately
      setPreviewUrl(result);

      // Call the parent's onAvatarChange with the result
      if (onAvatarChange) {
        console.log('Calling onAvatarChange with data URL length:', result.length);
        onAvatarChange(result);
      } else {
        console.error('onAvatarChange is not defined');
      }

      setValidationError('');
      if (onFieldError) {
        onFieldError('avatar', '');
      }
      setIsLoading(false);
    };

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      const errorMsg = 'Error reading file';
      setValidationError(errorMsg);
      if (onFieldError) {
        onFieldError('avatar', errorMsg);
      }
      setIsLoading(false);
    };

    reader.onprogress = (data) => {
      if (data.lengthComputable) {
        const progress = (data.loaded / data.total) * 100;
        console.log('Reading progress:', progress.toFixed(0) + '%');
      }
    };

    // Start reading the file
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
          onFieldError('avatar', error);
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
    <div className="flex flex-col items-center space-y-4">
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

        <motion.div
          animate={shakeFields?.includes('avatar') ? "shake" : "initial"}
          variants={shakeAnimation}
          className="overflow-visible"
        >
          <div
            className={`relative w-32 h-32 rounded-full border-4 transition-all duration-200 ${isDragging
              ? 'border-violet-500 bg-violet-500/20 scale-110'
              : fieldErrors?.avatar || validationError
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
                  setValidationError('Failed to load image');
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

      {(fieldErrors?.avatar || validationError) && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-rose-600 text-xs font-medium"
        >
          <XCircle size={12} />
          {fieldErrors?.avatar || validationError}
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

// Password Strength Indicator
const PasswordStrengthIndicator = memo(({ password, isDark }) => {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;
    return score;
  };

  const strength = getStrength();
  const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength - 1] || 'Very Weak';
  const strengthColor = strength <= 2 ? 'text-rose-500' : strength <= 3 ? 'text-amber-500' : 'text-emerald-500';
  const strengthBg = strength <= 2 ? 'bg-rose-500' : strength <= 3 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Password Strength</span>
        <span className={strengthColor}>{strengthText}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <motion.div
          className={`h-full ${strengthBg}`}
          initial={{ width: 0 }}
          animate={{ width: `${strength * 20}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
});

// Social Links Manager Component with Enhanced UI
const SocialLinksManager = memo(({ socialLinks = [], onUpdate, isDark, onDeleteRequest, onModalStateChange, onSuccess }) => {
  const [links, setLinks] = useState(socialLinks);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editPlatform, setEditPlatform] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [customPlatform, setCustomPlatform] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);
  const [pendingAddLink, setPendingAddLink] = useState(null);
  const [showEditConfirmation, setShowEditConfirmation] = useState(false);
  const [pendingEditLink, setPendingEditLink] = useState(null);

  useEffect(() => {
    if (onModalStateChange) {
      const isAnyModalOpen = showDeleteConfirmation || showAddConfirmation || showEditConfirmation;
      onModalStateChange(isAnyModalOpen);
    }
  }, [showDeleteConfirmation, showAddConfirmation, showEditConfirmation, onModalStateChange]);

  // Popular social platforms
  const popularPlatforms = [
    { id: 'github', name: 'GitHub', icon: Github, color: 'text-gray-600', bg: 'bg-gray-100', darkBg: 'bg-gray-700', placeholder: 'https://github.com/username' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-100', darkBg: 'bg-sky-900/30', placeholder: 'https://twitter.com/username' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-100', darkBg: 'bg-blue-900/30', placeholder: 'https://linkedin.com/in/username' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-100', darkBg: 'bg-pink-900/30', placeholder: 'https://instagram.com/username' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-100', darkBg: 'bg-blue-900/30', placeholder: 'https://facebook.com/username' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-100', darkBg: 'bg-red-900/30', placeholder: 'https://youtube.com/@channel' },
    { id: 'twitch', name: 'Twitch', icon: Twitch, color: 'text-purple-600', bg: 'bg-purple-100', darkBg: 'bg-purple-900/30', placeholder: 'https://twitch.tv/username' },
    { id: 'tiktok', name: 'TikTok', icon: Music, color: 'text-black', bg: 'bg-gray-100', darkBg: 'bg-gray-700', placeholder: 'https://tiktok.com/@username' },
    { id: 'snapchat', name: 'Snapchat', icon: Ghost, color: 'text-yellow-500', bg: 'bg-yellow-100', darkBg: 'bg-yellow-900/30', placeholder: 'https://snapchat.com/add/username' },
    { id: 'pinterest', name: 'Pinterest', icon: Image, color: 'text-red-600', bg: 'bg-red-100', darkBg: 'bg-red-900/30', placeholder: 'https://pinterest.com/username' },
    { id: 'reddit', name: 'Reddit', icon: MessageCircle, color: 'text-orange-500', bg: 'bg-orange-100', darkBg: 'bg-orange-900/30', placeholder: 'https://reddit.com/user/username' },
    { id: 'discord', name: 'Discord', icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-100', darkBg: 'bg-indigo-900/30', placeholder: 'https://discord.gg/invitecode' },
    { id: 'telegram', name: 'Telegram', icon: Send, color: 'text-blue-500', bg: 'bg-blue-100', darkBg: 'bg-blue-900/30', placeholder: 'https://t.me/username' },
    { id: 'whatsapp', name: 'WhatsApp', icon: Phone, color: 'text-green-500', bg: 'bg-green-100', darkBg: 'bg-green-900/30', placeholder: 'https://wa.me/1234567890' },
    { id: 'medium', name: 'Medium', icon: BookOpen, color: 'text-gray-800', bg: 'bg-gray-100', darkBg: 'bg-gray-700', placeholder: 'https://medium.com/@username' },
    { id: 'devto', name: 'Dev.to', icon: Code, color: 'text-gray-900', bg: 'bg-gray-100', darkBg: 'bg-gray-700', placeholder: 'https://dev.to/username' },
    { id: 'hashnode', name: 'Hashnode', icon: Hash, color: 'text-blue-600', bg: 'bg-blue-100', darkBg: 'bg-blue-900/30', placeholder: 'https://hashnode.com/@username' },
    { id: 'stackoverflow', name: 'Stack Overflow', icon: Code2, color: 'text-orange-500', bg: 'bg-orange-100', darkBg: 'bg-orange-900/30', placeholder: 'https://stackoverflow.com/users/12345/username' },
    { id: 'producthunt', name: 'Product Hunt', icon: Rocket, color: 'text-red-500', bg: 'bg-red-100', darkBg: 'bg-red-900/30', placeholder: 'https://producthunt.com/@username' },
    { id: 'behance', name: 'Behance', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100', darkBg: 'bg-blue-900/30', placeholder: 'https://behance.net/username' },
    { id: 'dribbble', name: 'Dribbble', icon: Palette, color: 'text-pink-500', bg: 'bg-pink-100', darkBg: 'bg-pink-900/30', placeholder: 'https://dribbble.com/username' },
    { id: 'figma', name: 'Figma', icon: PenTool, color: 'text-purple-500', bg: 'bg-purple-100', darkBg: 'bg-purple-900/30', placeholder: 'https://figma.com/@username' },
  ];

  const getPlatformDetails = (platformId) => {
    const platform = popularPlatforms.find(p => p.id === platformId);
    if (platform) return platform;

    // For custom platforms
    return {
      id: platformId,
      name: platformId.charAt(0).toUpperCase() + platformId.slice(1),
      icon: Globe,
      color: 'text-violet-500',
      bg: 'bg-violet-100',
      darkBg: 'bg-violet-900/30',
      placeholder: 'https://...'
    };
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setNewPlatform('');
    setNewUrl('');
    setCustomPlatform('');
    setShowCustomInput(false);
  };

  const handleEditClick = (link) => {
    setEditingId(link.id);
    setEditPlatform(link.platform);
    setEditValue(link.url);
    setShowCustomInput(!popularPlatforms.some(p => p.id === link.platform));
  };

  const handleSaveEdit = () => {
    if (!editPlatform || !editValue) return;

    // Store pending edit and show confirmation
    setPendingEditLink({
      id: editingId,
      platform: editPlatform,
      url: editValue
    });
    setShowEditConfirmation(true);
  };

  const cancelEdit = () => {
    setShowEditConfirmation(false);
    setPendingEditLink(null);
  };

  const handleSaveNew = () => {
    const platform = showCustomInput ? customPlatform : newPlatform;
    if (!platform || !newUrl) return;

    // Store the form data that will be used for the new link
    const formData = {
      platform: platform.toLowerCase().replace(/\s+/g, ''),
      url: newUrl,
      isCustom: showCustomInput,
      customPlatformValue: customPlatform,
      displayPlatform: showCustomInput ? customPlatform : platform
    };

    const newLink = {
      id: `link-${Date.now()}`,
      platform: formData.platform,
      url: newUrl,
      isNew: false
    };

    // Store both the link data and the form data
    setPendingAddLink(newLink);
    setPendingFormData(formData); // Store the form data
    setShowAddConfirmation(true);
  };

  const confirmAdd = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!pendingAddLink) return;

    const updatedLinks = [...links, pendingAddLink];
    setLinks(updatedLinks);
    onUpdate(updatedLinks);

    setShowAddConfirmation(false);

    if (onSuccess) {
      onSuccess('add', pendingAddLink);
    }

    setPendingAddLink(null);
    setPendingFormData(null); // Clear pending form data
    setShowAddForm(false); // Close the add form
    setNewPlatform('');
    setNewUrl('');
    setCustomPlatform('');
    setShowCustomInput(false);
  };

  // Update confirmEdit:
  const confirmEdit = () => {
    if (!pendingEditLink) return;

    const linkIndex = links.findIndex(l => l.id === pendingEditLink.id);
    if (linkIndex === -1) return;

    const updatedLinks = [...links];
    updatedLinks[linkIndex] = {
      ...updatedLinks[linkIndex],
      platform: pendingEditLink.platform,
      url: pendingEditLink.url
    };

    setLinks(updatedLinks);
    onUpdate(updatedLinks);

    setShowEditConfirmation(false);

    if (onSuccess) {
      onSuccess('edit', pendingEditLink);
    }

    setPendingEditLink(null);
    setEditingId(null);
    setEditPlatform('');
    setEditValue('');
    setShowCustomInput(false);
  };

  // Update confirmDelete:
  const confirmDelete = () => {
    if (linkToDelete) {
      const updatedLinks = links.filter(l => l.id !== linkToDelete.id);
      setLinks(updatedLinks);
      onUpdate(updatedLinks);

      setShowDeleteConfirmation(false);

      if (onSuccess) {
        onSuccess('delete', linkToDelete);
      }

      setLinkToDelete(null);
    }
  };

  const cancelAdd = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setShowAddConfirmation(false);
    setPendingAddLink(null);

    // Restore the form data from pendingFormData
    if (pendingFormData) {
      if (pendingFormData.isCustom) {
        setShowCustomInput(true);
        setCustomPlatform(pendingFormData.customPlatformValue);
        setNewPlatform(''); // Clear popular platform selection
      } else {
        setShowCustomInput(false);
        setNewPlatform(pendingFormData.displayPlatform);
        setCustomPlatform(''); // Clear custom platform
      }
      setNewUrl(pendingFormData.url);
    }

    setPendingFormData(null); // Clear pending form data
  };

  const handleCancelAddForm = () => {
    setShowAddForm(false);
    setNewPlatform('');
    setNewUrl('');
    setCustomPlatform('');
    setShowCustomInput(false);
    setPendingFormData(null); // Clear any pending form data
  };

  // Updated delete handlers
  const handleDeleteClick = (link) => {
    // Show confirmation dialog within the component
    setLinkToDelete(link);
    setShowDeleteConfirmation(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setLinkToDelete(null);
  };

  const handleOpenLink = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Social Links ({links.length})
        </h4>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddNew}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isDark
            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg hover:shadow-violet-500/25'
            : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg hover:shadow-violet-500/25'
            }`}
        >
          <Plus size={16} />
          Add Social Link
        </motion.button>
      </div>

      {/* Add New Link Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-6 rounded-2xl border-2 ${isDark
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-violet-500/30'
              : 'bg-gradient-to-br from-white to-gray-50 border-violet-200'
              }`}
          >
            <h3 className={`text-base font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Plus size={18} className="text-violet-500" />
              Add New Social Link
            </h3>

            <div className="space-y-4">
              {/* Platform Selection */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Select Platform
                </label>

                {!showCustomInput ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 rounded-xl">
                      {popularPlatforms.map((platform) => (
                        <motion.button
                          key={platform.id}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setNewPlatform(platform.id)}
                          className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${newPlatform === platform.id
                            ? isDark
                              ? 'border-violet-500 bg-violet-500/20'
                              : 'border-violet-500 bg-violet-50'
                            : isDark
                              ? 'border-gray-700 hover:border-gray-600'
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <platform.icon
                            size={18}
                            className={platform.color}
                          />
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {platform.name}
                          </span>
                        </motion.button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowCustomInput(true)}
                      className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-700'
                        }`}
                    >
                      <Plus size={14} />
                      Add Custom Platform
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={customPlatform}
                        onChange={(e) => setCustomPlatform(e.target.value)}
                        placeholder="Enter platform name (e.g., MyWebsite, Portfolio)"
                        className={`w-full p-3 rounded-xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          }`}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                        }`}
                    >
                      <ChevronLeft size={14} />
                      Back to Popular Platforms
                    </button>
                  </div>
                )}
              </div>

              {/* URL Input */}
              {(newPlatform || customPlatform) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Profile URL
                  </label>
                  <div className="relative">
                    <Globe size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder={showCustomInput ? "https://..." : getPlatformDetails(newPlatform).placeholder}
                      className={`w-full p-3 pl-10 rounded-xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                        }`}
                    />
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <motion.button
                  type="button"
                  onClick={handleCancelAddForm}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleSaveNew}
                  disabled={!(newPlatform || customPlatform) || !newUrl}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold shadow-lg flex items-center justify-center gap-2 ${(newPlatform || customPlatform) && newUrl
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                    : isDark
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <Check size={16} />
                  Add Link
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing Links */}
      <div className="space-y-3">
        {links.map((link) => {
          const platform = getPlatformDetails(link.platform);
          const Icon = platform.icon;
          const isEditing = editingId === link.id;

          if (isEditing) {
            return (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border-2 ${isDark
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-violet-500/30'
                  : 'bg-gradient-to-br from-white to-gray-50 border-violet-200'
                  }`}
              >
                <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Edit {platform.name} Link
                </h4>

                <div className="space-y-4">
                  {/* Platform Selection */}
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Platform
                    </label>

                    {!showCustomInput ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 rounded-xl">
                          {popularPlatforms.map((p) => (
                            <motion.button
                              key={p.id}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setEditPlatform(p.id)}
                              className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${editPlatform === p.id
                                ? isDark
                                  ? 'border-violet-500 bg-violet-500/20'
                                  : 'border-violet-500 bg-violet-50'
                                : isDark
                                  ? 'border-gray-700 hover:border-gray-600'
                                  : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                              <p.icon size={14} className={p.color} />
                              <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {p.name}
                              </span>
                            </motion.button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowCustomInput(true)}
                          className={`flex items-center gap-2 text-xs font-medium ${isDark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-700'
                            }`}
                        >
                          <Plus size={12} />
                          Use Custom Platform
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editPlatform}
                          onChange={(e) => setEditPlatform(e.target.value)}
                          placeholder="Enter platform name"
                          className={`w-full p-2 rounded-lg border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm ${isDark
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                            }`}
                        />

                        <button
                          type="button"
                          onClick={() => {
                            setShowCustomInput(false);
                            setEditPlatform(link.platform);
                          }}
                          className={`flex items-center gap-2 text-xs font-medium ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                            }`}
                        >
                          <ChevronLeft size={12} />
                          Back to Popular Platforms
                        </button>
                      </div>
                    )}
                  </div>

                  {/* URL Input */}
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Profile URL
                    </label>
                    <div className="relative">
                      <Globe size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="url"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        placeholder="https://..."
                        className={`w-full p-2 pl-10 rounded-lg border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          }`}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditPlatform('');
                        setEditValue('');
                        setShowCustomInput(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 px-3 py-2 rounded-lg border-2 text-xs font-semibold ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={!editPlatform || !editValue}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 ${editPlatform && editValue
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                        : isDark
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      <Check size={12} />
                      Save
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`group relative p-4 rounded-2xl border-2 transition-all ${isDark
                ? `bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-${platform.color.replace('text-', '')}/30`
                : `bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-${platform.color.replace('text-', '')}/30`
                }`}
            >
              {/* Background Icon */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={48} />
              </div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`p-3 rounded-xl ${isDark ? platform.darkBg : platform.bg} transition-all group-hover:scale-110`}>
                    <Icon size={20} className={platform.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-base font-bold capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {platform.name}
                      </p>
                      {!popularPlatforms.some(p => p.id === link.platform) && (
                        <span className={`px-2 py-0.5 text-xs rounded-full ${isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'
                          }`}>
                          Custom
                        </span>
                      )}
                    </div>
                    <p className={`text-sm truncate max-w-[200px] sm:max-w-[300px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {link.url}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleOpenLink(link.url)}
                    className={`p-2.5 rounded-xl transition-all ${isDark
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-blue-400'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-blue-600'
                      }`}
                    title="Open link"
                  >
                    <ExternalLink size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEditClick(link)}
                    className={`p-2.5 rounded-xl transition-all ${isDark
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-violet-400'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-violet-600'
                      }`}
                    title="Edit link"
                  >
                    <Edit size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteClick(link)}
                    className={`p-2.5 rounded-xl transition-all ${isDark
                      ? 'hover:bg-rose-500/20 text-gray-400 hover:text-rose-400'
                      : 'hover:bg-rose-100 text-gray-500 hover:text-rose-600'
                      }`}
                    title="Delete link"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {links.length === 0 && !showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 px-4 rounded-2xl border-2 border-dashed ${isDark ? 'border-gray-700' : 'border-gray-200'
              }`}
          >
            <Globe size={48} className={`mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-base font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              No social links added yet
            </p>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Add your social media profiles to access them easily
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddNew}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${isDark
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                }`}
            >
              <Plus size={16} />
              Add Your First Link
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirmation && linkToDelete && (
          <ConfirmationDialog
            isDark={isDark}
            title="Delete Social Link"
            message={`Are you sure you want to delete your ${getPlatformDetails(linkToDelete.platform).name} link?`}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            confirmText="Delete"
            cancelText="Cancel"
          />
        )}
      </AnimatePresence>

      {/* Add Confirmation Dialog */}
      <AnimatePresence>
        {showAddConfirmation && pendingAddLink && (
          <ConfirmationDialog
            isDark={isDark}
            title="Add Social Link"
            message={`Are you sure you want to add your ${getPlatformDetails(pendingAddLink.platform).name} link?`}
            onConfirm={confirmAdd}
            onCancel={(e) => cancelAdd(e)}
            confirmText="Add"
            cancelText="Cancel"
          />
        )}
      </AnimatePresence>

      {/* Edit Confirmation Dialog */}
      <AnimatePresence>
        {showEditConfirmation && pendingEditLink && (
          <ConfirmationDialog
            isDark={isDark}
            title="Edit Social Link"
            message={`Are you sure you want to update your ${getPlatformDetails(pendingEditLink.platform).name} link?`}
            onConfirm={confirmEdit}
            onCancel={cancelEdit}
            confirmText="Update"
            cancelText="Cancel"
          />
        )}
      </AnimatePresence>
    </div>
  );
});

// Mock user data with authentic Indian persona
const userData = {
  id: 'USR-001',
  name: 'Rajesh Kumar Sharma',
  email: 'rajesh.sharma@donationtracker.com',
  phone: '+91-98765-43210',
  address: 'Green Park Extension, New Delhi - 110016',
  bio: 'Senior system administrator with 12+ years of experience in IT infrastructure management. Passionate about digital transformation and NGO impact tracking.',
  avatar: null,
  role: 'Super Admin',
  joinDate: '2023-01-15',
  lastLogin: '2025-11-05T10:30:00Z',
  department: 'Information Technology',
  designation: 'Senior System Administrator',
  reportingTo: 'Priya Desai (CTO)',
  emergencyContact: '+91-98100-12345',
  dateOfBirth: '1985-08-22',
  gender: 'Male',
  maritalStatus: 'Married',
  nationality: 'Indian',
  experience: 12,
  education: [
    { degree: 'B.Tech in Computer Science', institution: 'Indian Institute of Technology (IIT) Delhi', year: 2008 },
    { degree: 'MBA in Information Systems', institution: 'Indian Institute of Management (IIM) Bangalore', year: 2012 }
  ],
  certifications: [
    'AWS Certified Solutions Architect',
    'Certified Information Systems Security Professional (CISSP)',
    'Project Management Professional (PMP)',
    'Google Cloud Professional Data Engineer'
  ],
  languages: ['Hindi', 'English', 'Punjabi'],
  security: {
    lastPasswordChange: '2025-09-15',
    loginAttempts: 0,
    twoFactorEnabled: true,
    trustedDevices: [
      { id: 'dev1', name: 'Windows Desktop (Office)', lastUsed: '2025-11-05T10:30:00Z', ip: '103.95.84.123', location: 'Delhi NCR' },
      { id: 'dev2', name: 'Samsung Galaxy S23', lastUsed: '2025-11-04T15:20:00Z', ip: '103.95.84.124', location: 'Gurugram' },
      { id: 'dev3', name: 'iPad Pro', lastUsed: '2025-11-03T09:15:00Z', ip: '103.95.84.125', location: 'Noida' },
      { id: 'dev4', name: 'Windows Laptop (Office)', lastUsed: '2025-11-05T10:30:00Z', ip: '103.95.84.123', location: 'Delhi NCR' },
    ],
  },
  activity: {
    totalLogins: 1247,
    lastActivity: '2025-11-05T10:30:00Z',
    sessions: [
      { id: 'sess1', device: 'Windows Chrome', location: 'Delhi, IN', loginTime: '2025-11-05T10:30:00Z', active: true },
      { id: 'sess2', device: 'Android App', location: 'Gurugram, IN', loginTime: '2025-11-04T15:20:00Z', active: false },
      { id: 'sess3', device: 'iPad Safari', location: 'Noida, IN', loginTime: '2025-11-03T09:15:00Z', active: false },
    ],
  },
  socialLinks: [
    { id: '1', platform: 'linkedin', url: 'https://linkedin.com/in/rajeshsharma' },
    { id: '2', platform: 'github', url: 'https://github.com/rajeshsharma' },
    { id: '3', platform: 'twitter', url: 'https://twitter.com/rajesh_sharma' },
    { id: '4', platform: 'instagram', url: 'https://instagram.com/rajeshsharma' },
  ],
  badges: [
    { id: 'badge1', name: 'Verified Admin', icon: BadgeCheck, color: 'emerald' },
    { id: 'badge2', name: 'Security Champion', icon: ShieldCheck, color: 'blue' },
    { id: 'badge3', name: 'Top Contributor', icon: Medal, color: 'amber' },
    { id: 'badge4', name: '5 Year Club', icon: Award, color: 'purple' },
    { id: 'badge5', name: 'Mentor of the Year', icon: Star, color: 'gold' },
  ],
  notifications: {
    unread: 3,
    total: 27,
    lastNotification: '2025-11-05T09:30:00Z',
  },
  stats: {
    profileCompleteness: 92,
    accountAge: 1024,
    teamsJoined: 8,
    projectsManaged: 15
  },
  documents: [
    { id: 'doc1', name: 'Rajesh_Sharma_Resume_2025.pdf', size: '2.4 MB', type: 'application/pdf', uploadedDate: '2025-10-15' },
    { id: 'doc2', name: 'Aadhaar_Card_Rajesh_Sharma.pdf', size: '1.2 MB', type: 'application/pdf', uploadedDate: '2023-01-20' },
    { id: 'doc3', name: 'PAN_Card_Rajesh_Sharma.pdf', size: '0.8 MB', type: 'application/pdf', uploadedDate: '2023-01-20' },
    { id: 'doc4', name: 'AWS_Certificate_Rajesh.pdf', size: '1.5 MB', type: 'application/pdf', uploadedDate: '2024-06-10' },
    { id: 'doc5', name: 'IIT_Delhi_Degree_Certificate.pdf', size: '3.1 MB', type: 'application/pdf', uploadedDate: '2023-02-05' },
    { id: 'doc6', name: 'Passport_Rajesh_Sharma.jpg', size: '0.5 MB', type: 'image/jpeg', uploadedDate: '2024-01-12' }
  ],
  bankDetails: {
    accountNumber: 'XXXXXX1234',
    ifscCode: 'SBIN0001234',
    bankName: 'State Bank of India',
    branch: 'Green Park, New Delhi',
    upiId: 'rajesh.sharma@okhdfcbank'
  },
  emergencyContacts: [
    { name: 'Sunita Sharma (Spouse)', relation: 'Wife', phone: '+91-98765-01234' },
    { name: 'Amit Sharma (Brother)', relation: 'Brother', phone: '+91-98765-56789' }
  ],
  addressDetails: {
    current: 'D-42, Green Park Extension, New Delhi - 110016',
    permanent: 'H.No. 123, Model Town, Karnal, Haryana - 132001',
    office: 'DLF Cyber City, Phase III, Gurugram - 122002'
  },
  preferences: {
    language: 'English',
    theme: 'system',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    timezone: 'Asia/Kolkata'
  }
};

// Calculate profile completion percentage
const calculateProfileCompletion = (formData) => {
  let totalFields = 0;
  let completedFields = 0;

  const personalInfoFields = [
    'name', 'email', 'phone', 'address', 'bio', 'dateOfBirth', 'gender',
    'maritalStatus', 'nationality', 'department', 'designation', 'emergencyContact'
  ];

  personalInfoFields.forEach(field => {
    totalFields++;
    if (formData[field] && formData[field].toString().trim() !== '') {
      completedFields++;
    }
  });

  const securityFields = [
    'avatar'
  ];

  securityFields.forEach(field => {
    totalFields++;
    if (formData[field] && formData[field].toString().trim() !== '') {
      completedFields++;
    }
  });

  // Documents count
  totalFields++;
  if (formData.documents && formData.documents.length > 0) {
    completedFields++;
  }

  return Math.round((completedFields / totalFields) * 100);
};

// Get completion checklist
const getCompletionChecklist = (formData) => {
  return {
    personalInfo: ['name', 'email', 'phone', 'address', 'bio', 'dateOfBirth', 'gender',
      'maritalStatus', 'nationality', 'department', 'designation', 'emergencyContact'].every(
        field => formData[field] && formData[field].toString().trim() !== ''
      ),
    profilePhoto: formData.avatar && formData.avatar.toString().trim() !== '',
    documents: formData.documents && formData.documents.length > 0
  };
};

// Document Upload Component (matching recipients management)
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

    const nameExists = (name) => {
      return existingNames.some(existing =>
        existing.toLowerCase() === name.toLowerCase()
      );
    };

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

  const shakeAnimation = {
    initial: { x: 0 },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

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
              } ${fieldErrors?.documents ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : ''
              }`}
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
                <p className={`text-sm sm:text-base font-semibold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                  {dragActive ? 'Drop files here' : 'Drop files or click to upload'}
                </p>
                <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  Aadhaar card, educational certificates, and recent address proof (utility bill or bank statement)
                </p>
                <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
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
                    <p className={`text-xs sm:text-sm font-semibold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                      {doc.name}
                    </p>
                    <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
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

// Password Change Component - Fixed to shake every time
const PasswordChangeSection = memo(({ isDark, onPasswordChange, fieldErrors, shakeFields, user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [localShakeFields, setLocalShakeFields] = useState([]);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [shakeKey, setShakeKey] = useState(0); // Add a key to force re-render

  // Create refs for input fields
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ' at');
  };

  const shakeAnimation = {
    initial: { x: 0 },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  // Password validation function
  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  // Check if passwords match
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const triggerShake = (fieldNames) => {
    // Don't clear first - set the new shake fields directly
    setLocalShakeFields(fieldNames);

    // Increment key to force re-render with new animation
    setShakeKey(prev => prev + 1);

    if (fieldNames.includes('newPassword')) {
      setTimeout(() => {
        newPasswordRef.current?.focus();
      }, 100);
    } else if (fieldNames.includes('confirmPassword')) {
      setTimeout(() => {
        confirmPasswordRef.current?.focus();
      }, 100);
    }

    // Clear shake after animation completes
    setTimeout(() => {
      setLocalShakeFields([]);
    }, 600);
  };

  // Reset ALL states when hiding the section
  useEffect(() => {
    if (!showPasswordSection) {
      setPasswordErrors({});
      setLocalShakeFields([]);
      setValidationAttempted(false);
      setNewPassword('');
      setConfirmPassword('');
      setShakeKey(0);
      // Reset both eye icon states when section is closed
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [showPasswordSection]);

  const handlePasswordChange = async () => {
    setValidationAttempted(true);

    // Clear previous errors but DON'T clear shake fields here
    setPasswordErrors({});

    setIsLoading(true);

    try {
      const errors = {};

      if (!newPassword) {
        errors.newPassword = "New password is required";
      } else if (!validatePassword(newPassword)) {
        errors.newPassword = "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
      }

      if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (newPassword !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      if (Object.keys(errors).length > 0) {
        setPasswordErrors(errors);

        // Trigger shake for invalid fields
        triggerShake(Object.keys(errors));

        setIsLoading(false);
        return;
      }

      if (onPasswordChange) {
        await onPasswordChange({
          newPassword,
          confirmPassword,
          oldPassword: user?.security?.lastPasswordChange
        });
      }

      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
      setValidationAttempted(false);
      // Reset eye icons after successful password change too
      setShowPassword(false);
      setShowConfirmPassword(false);

    } catch (error) {
      console.error("Password change error:", error);
      setPasswordErrors({ submit: error.message || "Password change failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordIcon = () => Key;
  const getPasswordColor = () => {
    return {
      color: 'text-violet-500',
      bg: isDark ? 'bg-violet-900/30' : 'bg-violet-100'
    };
  };

  const PasswordIcon = getPasswordIcon();
  const passwordStyle = getPasswordColor();

  // Determine if fields should shake - use localShakeFields
  const shouldShakeNewPassword = localShakeFields.includes('newPassword');
  const shouldShakeConfirmPassword = localShakeFields.includes('confirmPassword');

  return (
    <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <Key size={18} className="text-violet-500" />
        Password Security
      </h3>

      <div className="space-y-3">
        {/* Password Security Item - Matching Edit Modal style */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02, x: 5 }}
          className={`group relative p-4 rounded-2xl border-2 transition-all ${isDark
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-violet-500/30'
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-violet-500/30'
            }`}
        >
          {/* Background Icon */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity">
            <Key size={48} />
          </div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`p-3 rounded-xl ${passwordStyle.bg} transition-all group-hover:scale-110`}>
                <PasswordIcon size={20} className={passwordStyle.color} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Password
                  </p>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${isDark
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'bg-violet-100 text-violet-700'
                    }`}>
                    Last Changed
                  </span>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatDate(user?.security?.lastPasswordChange || new Date().toISOString())}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                // Reset eye icons when toggling section visibility
                if (showPasswordSection) {
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                }
                setShowPasswordSection(!showPasswordSection);
              }}
              className={`p-2.5 rounded-xl transition-all ${showPasswordSection
                ? isDark
                  ? 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
                  : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                : isDark
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-violet-400'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-violet-600'
                }`}
              title={showPasswordSection ? "Hide password change" : "Change password"}
            >
              {showPasswordSection ? <ChevronUp size={16} /> : <Edit size={16} />}
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showPasswordSection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-4">
                {/* Password Fields - Two columns side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* New Password Field */}
                  <div className="space-y-2" style={{ marginLeft: '16px' }}>
                    <label className={`block text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      &nbsp;New Password <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <div className="overflow-visible">
                      <motion.div
                        key={`newPassword-${shakeKey}`} // Use key to force re-render
                        animate={shouldShakeNewPassword ? "shake" : "initial"}
                        variants={shakeAnimation}
                        className="overflow-visible relative"
                      >
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-violet-500 z-10" />
                        <input
                          ref={newPasswordRef}
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (passwordErrors.newPassword) {
                              setPasswordErrors(prev => ({ ...prev, newPassword: null }));
                            }
                          }}
                          placeholder="Enter new password"
                          className={`w-full pl-10 pr-12 py-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium
                            ${isDark
                              ? passwordErrors.newPassword
                                ? 'bg-gray-800 border-rose-500 text-white placeholder-gray-400'
                                : 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                              : passwordErrors.newPassword
                                ? 'bg-white border-rose-500 text-gray-900 placeholder-gray-500'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                            }`}
                        />
                        <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 z-20 ${isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                          {newPassword && validatePassword(newPassword) && (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          )}
                          {passwordErrors.newPassword && (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )}
                          <motion.button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-400 hover:text-violet-500 transition-colors"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                    {passwordErrors.newPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                      >
                        <XCircle size={12} />
                        {passwordErrors.newPassword}
                      </motion.p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2" style={{ marginRight: '16px' }}>
                    <label className={`block text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      &nbsp;Confirm New Password <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <div className="overflow-visible">
                      <motion.div
                        key={`confirmPassword-${shakeKey}`} // Use key to force re-render
                        animate={shouldShakeConfirmPassword ? "shake" : "initial"}
                        variants={shakeAnimation}
                        className="overflow-visible relative"
                      >
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-violet-500 z-10" />
                        <input
                          ref={confirmPasswordRef}
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (passwordErrors.confirmPassword) {
                              setPasswordErrors(prev => ({ ...prev, confirmPassword: null }));
                            }
                          }}
                          placeholder="Confirm new password"
                          className={`w-full pl-10 pr-12 py-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium
                            ${isDark
                              ? passwordErrors.confirmPassword
                                ? 'bg-gray-800 border-rose-500 text-white placeholder-gray-400'
                                : 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                              : passwordErrors.confirmPassword
                                ? 'bg-white border-rose-500 text-gray-900 placeholder-gray-500'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                            }`}
                        />
                        <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 z-20 ${isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                          {passwordsMatch && confirmPassword && (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          )}
                          {passwordErrors.confirmPassword && (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )}
                          <motion.button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-400 hover:text-violet-500 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                      >
                        <XCircle size={12} />
                        {passwordErrors.confirmPassword}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Password Requirements - Matching Edit Modal style */}
                {(newPassword || confirmPassword) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl ${isDark
                      ? 'bg-gray-800'
                      : 'bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-200'
                      }`}
                  >
                    <h4 className={`font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                      <ShieldCheck className="w-4 h-4 text-violet-500" />
                      Password Requirements:
                    </h4>
                    <ul className="text-xs space-y-2">
                      {[
                        { check: newPassword.length >= 8, text: "At least 8 characters" },
                        { check: /[A-Z]/.test(newPassword), text: "One uppercase letter" },
                        { check: /[a-z]/.test(newPassword), text: "One lowercase letter" },
                        { check: /\d/.test(newPassword), text: "One number" },
                        { check: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword), text: "One special character" }
                      ].map((req, index) => (
                        <motion.li
                          key={index}
                          className={`flex items-center gap-2 ${req.check
                            ? 'text-emerald-600'
                            : isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {req.check ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {req.text}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {passwordErrors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-rose-50 border border-rose-200 rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-2 text-rose-700">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">{passwordErrors.submit}</span>
                    </div>
                  </motion.div>
                )}

                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`} style={{ marginLeft: '16px' }}>
                  &nbsp;Leave empty if you don't want to change your password
                </p>

                {/* Save button for password change - Matching Edit Modal exactly */}
                <div className="flex justify-end" style={{ marginRight: '16px' }}>
                  <motion.button
                    type="button"
                    onClick={handlePasswordChange}
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isDark
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg hover:shadow-violet-500/25'
                      : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg hover:shadow-violet-500/25'
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        Update Password
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
})

const EditProfileModal = memo(({
  isDark,
  user,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState(user);
  const [originalData] = useState(user);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [completionChecklist, setCompletionChecklist] = useState({
    personalInfo: false,
    profilePhoto: false,
    documents: false
  });

  useEffect(() => {
    console.log('Form data avatar updated:', formData.avatar ? 'Has avatar data' : 'No avatar');
  }, [formData.avatar]);

  const handleAvatarChange = (avatarData) => {
    console.log('handleAvatarChange called with data length:', avatarData?.length);
    setFormData(prev => {
      const newFormData = {
        ...prev,
        avatar: avatarData
      };
      console.log('Updated form data with avatar');
      return newFormData;
    });

    if (fieldErrors.avatar) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.avatar;
        return newErrors;
      });
    }
  };

  const fieldRefs = {
    name: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    address: useRef(null),
    bio: useRef(null),
    dateOfBirth: useRef(null),
    gender: useRef(null),
    maritalStatus: useRef(null),
    nationality: useRef(null),
    department: useRef(null),
    designation: useRef(null),
    emergencyContact: useRef(null),
    avatar: useRef(null),
    documents: useRef(null),
  };

  useEffect(() => {
    const percentage = calculateProfileCompletion(formData);
    const checklist = getCompletionChecklist(formData);

    setCompletionPercentage(percentage);
    setCompletionChecklist(checklist);
  }, [formData]);

  const scrollToFirstInvalidField = (invalidFields) => {
    if (invalidFields.length > 0) {
      const fieldOrder = [
        'name', 'email', 'phone', 'address', 'bio', 'dateOfBirth', 'gender',
        'maritalStatus', 'nationality', 'department', 'designation',
        'emergencyContact', 'avatar', 'documents'
      ];

      const firstInvalidField = fieldOrder.find(field =>
        invalidFields.includes(field)
      );

      if (firstInvalidField) {
        const fieldRef = fieldRefs[firstInvalidField];

        if (fieldRef && fieldRef.current) {
          setTimeout(() => {
            try {
              if (firstInvalidField === 'avatar') {
                const avatarElement = fieldRef.current;
                const uploadArea = avatarElement.querySelector('.relative.w-32.h-32');

                if (uploadArea) {
                  uploadArea.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                  });
                } else {
                  avatarElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                  });
                }
              } else {
                fieldRef.current.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                  inline: 'nearest'
                });
              }

              setTimeout(() => {
                if (firstInvalidField === 'avatar') {
                  const cameraButton = fieldRef.current.querySelector('label[for="avatar-upload"]');
                  if (cameraButton) {
                    cameraButton.focus();
                  }
                } else {
                  const input = fieldRef.current.querySelector('input, select, textarea');
                  if (input) {
                    input.focus();
                    if (input.type !== 'file') {
                      input.select();
                    }
                  }
                }
              }, 100);
            } catch (error) {
              console.error('Error scrolling to field:', error);
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

    // Validation helper functions (same as before)
    const isValidName = (name) => {
      return /^[A-Za-z\s]+$/.test(name.trim());
    };

    const isValidEmail = (email) => {
      email = email.trim().toLowerCase();
      if (!email) return false;
      if (email.length > 254) return false;
      const parts = email.split('@');
      if (parts.length !== 2) return false;
      const [local, domain] = parts;
      if (local.length === 0 || local.length > 64) return false;
      if (domain.length === 0 || domain.length > 255) return false;
      const localRegex = /^[a-z0-9][a-z0-9._+-]*[a-z0-9]$|^[a-z0-9]$/;
      if (!localRegex.test(local)) return false;
      if (local.includes('..')) return false;
      if (local.startsWith('.') || local.endsWith('.')) return false;
      if ((local.match(/\+/g) || []).length > 1) return false;
      if (local.startsWith('+') || local.endsWith('+')) return false;
      if (local.startsWith('-') || local.endsWith('-')) return false;
      if (local.startsWith('_') || local.endsWith('_')) return false;
      const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/;
      if (!domainRegex.test(domain)) return false;
      if (domain.includes('--')) return false;
      if (domain.startsWith('-') || domain.endsWith('-')) return false;
      const domainParts = domain.split('.');
      const tld = domainParts[domainParts.length - 1];
      if (tld.length < 2 || tld.length > 6) return false;
      if (!/^[a-z]+$/.test(tld)) return false;
      const invalidPatterns = [
        /\.{2,}/,
        /[^a-z0-9._+@-]/,
        /@.*@/,
        /\s/,
        /^\.|\.$/,
        /[<>()\[\]\\,;:&^%$#!*?]/,
      ];
      for (const pattern of invalidPatterns) {
        if (pattern.test(email)) return false;
      }
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

    const isValidTextOnly = (text) => {
      return /^[A-Za-z\s]+$/.test(text.trim());
    };

    const isValidDateOfBirth = (dob) => {
      const birthDate = new Date(dob);
      const today = new Date();
      if (isNaN(birthDate.getTime())) return false;
      if (birthDate > today) return false;
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        if (age - 1 < 18) return false;
      } else {
        if (age < 18) return false;
      }
      return true;
    };

    const isValidGender = (gender) => {
      return ['Male', 'Female', 'Other'].includes(gender);
    };

    const isValidMaritalStatus = (status) => {
      return ['Single', 'Married', 'Divorced', 'Widowed'].includes(status);
    };

    if (!formData.avatar) {
      errors.avatar = 'Profile photo is required';
      invalidFields.push('avatar');
    } else if (typeof formData.avatar === 'string' && !formData.avatar.startsWith('data:image/')) {
      errors.avatar = 'Invalid image format';
      invalidFields.push('avatar');
    }

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
      errors.phone = 'Please enter a valid 10-digit phone number';
      invalidFields.push('phone');
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
      invalidFields.push('address');
    } else if (!isValidAddress(formData.address)) {
      errors.address = 'Address must start with a letter and can contain letters, numbers, spaces, and . , \' " / -';
      invalidFields.push('address');
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of Birth is required';
      invalidFields.push('dateOfBirth');
    } else if (!isValidDateOfBirth(formData.dateOfBirth)) {
      errors.dateOfBirth = 'You must be at least 18 years old and date cannot be in the future';
      invalidFields.push('dateOfBirth');
    }

    if (!formData.gender) {
      errors.gender = 'Gender is required';
      invalidFields.push('gender');
    } else if (!isValidGender(formData.gender)) {
      errors.gender = 'Please select a valid gender option';
      invalidFields.push('gender');
    }

    if (!formData.maritalStatus) {
      errors.maritalStatus = 'Marital Status is required';
      invalidFields.push('maritalStatus');
    } else if (!isValidMaritalStatus(formData.maritalStatus)) {
      errors.maritalStatus = 'Please select a valid marital status';
      invalidFields.push('maritalStatus');
    }

    if (!formData.nationality.trim()) {
      errors.nationality = 'Nationality is required';
      invalidFields.push('nationality');
    } else if (!isValidTextOnly(formData.nationality)) {
      errors.nationality = 'Nationality can only contain alphabets and spaces';
      invalidFields.push('nationality');
    }

    if (!formData.department.trim()) {
      errors.department = 'Department is required';
      invalidFields.push('department');
    } else if (!isValidTextOnly(formData.department)) {
      errors.department = 'Department can only contain alphabets and spaces';
      invalidFields.push('department');
    }

    if (!formData.designation.trim()) {
      errors.designation = 'Designation is required';
      invalidFields.push('designation');
    } else if (!isValidTextOnly(formData.designation)) {
      errors.designation = 'Designation can only contain alphabets and spaces';
      invalidFields.push('designation');
    }

    if (!formData.emergencyContact) {
      errors.emergencyContact = 'Emergency Contact is required';
      invalidFields.push('emergencyContact');
    } else if (!isValidPhone(formData.emergencyContact)) {
      errors.emergencyContact = 'Please enter a valid 10-digit phone number';
      invalidFields.push('emergencyContact');
    }

    if (!formData.bio.trim()) {
      errors.bio = 'Bio is required';
      invalidFields.push('bio');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    const hasChanges = Object.keys(formData).some(key => {
      if (key === 'completionPercentage') return false;
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

    setPendingAction(() => () => {
      onUpdate(formData);
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

    if (name === 'name' || name === 'nationality' || name === 'department' || name === 'designation') {
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'phone' || name === 'emergencyContact') {
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
    } else if (name === 'email') {
      newValue = value.toLowerCase();
    } else {
      newValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleArrayChange = (name, value) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [name]: arrayValue
    }));
  };

  const handleDocumentsChange = (documents) => {
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

  const shakeAnimation = {
    initial: { x: 0 },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

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
                  Edit Profile
                </h2>
                <p className="text-violet-100 text-xs sm:text-sm font-semibold truncate">
                  Update your profile information
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
                  Profile Photo <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                </h3>
                <div ref={fieldRefs.avatar} className="overflow-visible">
                  <EnhancedAvatarUpload
                    user={formData}
                    onAvatarChange={handleAvatarChange}
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
                  <User size={16} className="text-violet-500" />
                  Personal Information <span className="text-rose-500 font-normal normal-case">*</span>
                </h3>

                <div className="space-y-4 sm:space-y-5">
                  {/* All the input fields remain exactly the same as before */}
                  {/* Row 1: Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div ref={fieldRefs.name} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;Full Name <span className="text-rose-500 font-normal normal-case">*</span>
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
                          placeholder="John Doe"
                          maxLength={50}
                          autoComplete="off"
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
                        &nbsp;Email <span className="text-rose-500 font-normal normal-case">*</span>
                      </label>
                      <motion.div
                        animate={shakeFields.includes('email') ? "shake" : "initial"}
                        variants={shakeAnimation}
                        className="overflow-visible relative"
                      >
                        <input
                          type="text"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          maxLength={100}
                          autoComplete="off"
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

                  {/* Row 2: Phone and Date of Birth */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div ref={fieldRefs.phone} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;Phone <span className="text-rose-500 font-normal normal-case">*</span>
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
                              placeholder="300-1234567"
                              maxLength={15}
                              autoComplete="off"
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

                    <div ref={fieldRefs.dateOfBirth} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;Date of Birth <span className="text-rose-500 font-normal normal-case">*</span>
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
                          className={`date-field w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                            ? 'bg-gray-800 border-gray-600 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                            } ${fieldErrors.dateOfBirth ? 'border-rose-500' : ''} 
                          ${formData.dateOfBirth ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-400' : 'text-gray-500')
                            }`}
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

                  {/* Row 7: Emergency Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div ref={fieldRefs.emergencyContact} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;WhatsApp Number <span className="text-rose-500 font-normal normal-case">*</span>
                      </label>
                      <motion.div
                        animate={shakeFields.includes('emergencyContact') ? "shake" : "initial"}
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
                              name="emergencyContact"
                              value={formData.emergencyContact}
                              onChange={handleChange}
                              placeholder="300-9999999"
                              maxLength={15}
                              autoComplete="off"
                              className={`w-full h-[48px] p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                } ${fieldErrors.emergencyContact ? 'border-rose-500' : ''}`}
                            />
                            <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {formData.emergencyContact.replace(/\D/g, '').length}/10
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      {fieldErrors.emergencyContact && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                        >
                          <XCircle size={12} />
                          {fieldErrors.emergencyContact}
                        </motion.p>
                      )}
                    </div>

                    <div ref={fieldRefs.gender} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;Gender <span className="text-rose-500 font-normal normal-case">*</span>
                      </label>
                      <div className="relative">
                        <motion.div
                          animate={shakeFields.includes('gender') ? "shake" : "initial"}
                          variants={shakeAnimation}
                          className="overflow-visible"
                        >
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            autoComplete="off"
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                            className={`w-full p-2 sm:p-3 rounded-2xl text-sm font-medium transition-all appearance-none ${isDark
                              ? 'bg-gray-800 border-gray-600'
                              : 'bg-white border-gray-200'
                              } border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none ${formData.gender === ""
                                ? (isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]')
                                : (isDark ? 'text-white' : 'text-gray-900')
                              } ${fieldErrors.gender ? 'border-rose-500' : ''}`}
                            style={{
                              paddingRight: '2.5rem'
                            }}
                          >
                            <option value="" className={`${isDark ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-white'} font-medium`}>
                              Select Gender...
                            </option>
                            <option value="Male" className={`${isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'} font-medium`}>
                              Male
                            </option>
                            <option value="Female" className={`${isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'} font-medium`}>
                              Female
                            </option>
                            <option value="Other" className={`${isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'} font-medium`}>
                              Other
                            </option>
                          </select>
                        </motion.div>
                        <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <ChevronDown size={16} />
                        </div>
                      </div>
                      {fieldErrors.gender && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                        >
                          <XCircle size={12} />
                          {fieldErrors.gender}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Row 5: Marital Status and Nationality */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div ref={fieldRefs.maritalStatus} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;Marital Status <span className="text-rose-500 font-normal normal-case">*</span>
                      </label>
                      <div className="relative">
                        <motion.div
                          animate={shakeFields.includes('maritalStatus') ? "shake" : "initial"}
                          variants={shakeAnimation}
                          className="overflow-visible"
                        >
                          <select
                            name="maritalStatus"
                            value={formData.maritalStatus}
                            onChange={handleChange}
                            autoComplete="off"
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                            className={`w-full p-2 sm:p-3 rounded-2xl text-sm font-medium transition-all appearance-none ${isDark
                              ? 'bg-gray-800 border-gray-600'
                              : 'bg-white border-gray-200'
                              } border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none ${formData.maritalStatus === ""
                                ? (isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]')
                                : (isDark ? 'text-white' : 'text-gray-900')
                              } ${fieldErrors.maritalStatus ? 'border-rose-500' : ''}`}
                            style={{
                              paddingRight: '2.5rem'
                            }}
                          >
                            <option value="" className={`${isDark ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-white'} font-medium`}>
                              Select Marital Status...
                            </option>
                            <option value="Single" className={`${isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'} font-medium`}>
                              Single
                            </option>
                            <option value="Married" className={`${isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'} font-medium`}>
                              Married
                            </option>
                            <option value="Divorced" className={`${isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'} font-medium`}>
                              Divorced
                            </option>
                            <option value="Widowed" className={`${isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'} font-medium`}>
                              Widowed
                            </option>
                          </select>
                        </motion.div>
                        <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <ChevronDown size={16} />
                        </div>
                      </div>
                      {fieldErrors.maritalStatus && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                        >
                          <XCircle size={12} />
                          {fieldErrors.maritalStatus}
                        </motion.p>
                      )}
                    </div>

                    <div ref={fieldRefs.nationality} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;Nationality <span className="text-rose-500 font-normal normal-case">*</span>
                      </label>
                      <motion.div
                        animate={shakeFields.includes('nationality') ? "shake" : "initial"}
                        variants={shakeAnimation}
                        className="overflow-visible relative"
                      >
                        <input
                          type="text"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleChange}
                          placeholder="Pakistani"
                          maxLength={50}
                          autoComplete="off"
                          className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                            } ${fieldErrors.nationality ? 'border-rose-500' : ''}`}
                        />
                        <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formData.nationality.length}/50
                        </div>
                      </motion.div>
                      {fieldErrors.nationality && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                        >
                          <XCircle size={12} />
                          {fieldErrors.nationality}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Row 6: Department and Designation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div ref={fieldRefs.department} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;Department <span className="text-rose-500 font-normal normal-case">*</span>
                      </label>
                      <motion.div
                        animate={shakeFields.includes('department') ? "shake" : "initial"}
                        variants={shakeAnimation}
                        className="overflow-visible relative"
                      >
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          placeholder="Information Technology, Human Resources, etc"
                          maxLength={50}
                          autoComplete="off"
                          className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                            } ${fieldErrors.department ? 'border-rose-500' : ''}`}
                        />
                        <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formData.department.length}/50
                        </div>
                      </motion.div>
                      {fieldErrors.department && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                        >
                          <XCircle size={12} />
                          {fieldErrors.department}
                        </motion.p>
                      )}
                    </div>

                    <div ref={fieldRefs.designation} className="overflow-visible">
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        &nbsp;Designation <span className="text-rose-500 font-normal normal-case">*</span>
                      </label>
                      <motion.div
                        animate={shakeFields.includes('designation') ? "shake" : "initial"}
                        variants={shakeAnimation}
                        className="overflow-visible relative"
                      >
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation}
                          onChange={handleChange}
                          placeholder="Senior System Administrator"
                          maxLength={50}
                          autoComplete="off"
                          className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                            } ${fieldErrors.designation ? 'border-rose-500' : ''}`}
                        />
                        <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formData.designation.length}/50
                        </div>
                      </motion.div>
                      {fieldErrors.designation && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                        >
                          <XCircle size={12} />
                          {fieldErrors.designation}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Address */}
                  <div ref={fieldRefs.address} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      &nbsp;Address <span className="text-rose-500 font-normal normal-case">*</span>
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
                        placeholder="Lahore, Pakistan"
                        maxLength={200}
                        autoComplete="off"
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

                  {/* Row 4: Bio */}
                  <div ref={fieldRefs.bio} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      &nbsp;Bio  <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <motion.div
                      className="overflow-visible relative"
                      animate={shakeFields?.includes('bio') ? {
                        x: [-10, 10, -10, 10, 0],
                        transition: { duration: 0.4 }
                      } : {}}
                    >
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Tell us about yourself..."
                        maxLength={500}
                        autoComplete="off"
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium resize-none ${fieldErrors.bio
                          ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                          : isDark
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          }`}
                      />
                      <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formData.bio.length}/500
                      </div>
                      {fieldErrors.bio && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.bio}</p>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <FileText size={16} className="text-amber-500" />
                  Documents Upload  <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                </h3>
                <div ref={fieldRefs.documents} className="overflow-visible">
                  <DocumentUpload
                    documents={formData.documents || []}
                    onDocumentsChange={handleDocumentsChange}
                    isDark={isDark}
                    fieldErrors={fieldErrors}
                    onFieldError={handleFieldError}
                    shakeFields={shakeFields}
                  />
                </div>
              </div>

              {/* Profile Completion Status */}
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
                      {completionPercentage === 100 ? 'Profile complete!' : 'Complete all fields to complete profile'}
                    </p>
                  </div>

                  <div>
                    <h4 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Completion Checklist
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Profile Photo', completed: completionChecklist.profilePhoto },
                        { label: 'Personal Information', completed: completionChecklist.personalInfo },
                        { label: 'Documents', completed: completionChecklist.documents }
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
                        <span className={`text-xs font-bold ${(formData.documents?.length || 0) >= 3
                          ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                          : isDark ? 'text-rose-400' : 'text-rose-600'
                          }`}>
                          {formData.documents?.length || 0}
                        </span>
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
                  <Save size={16} />
                  Save Changes
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
            title="Update Profile"
            message="Are you sure you want to update your profile information?"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            confirmText="Update"
            cancelText="Cancel"
          />
        )}
      </AnimatePresence>
    </>
  );
});

const ProfileHeader = memo(({ user, isDark, onEdit, verificationStatus, isSubmitted, isRejectedResubmit }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getVerificationBadge = () => {
    switch (verificationStatus) {
      case 'verified':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full text-sm font-semibold"
          >
            <BadgeCheck size={16} />
            Verified Admin
          </motion.div>
        );
      case 'rejected':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-full text-sm font-semibold"
          >
            <BadgeX size={16} />
            Verification Rejected
          </motion.div>
        );
      case 'submitted':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-sm font-semibold"
          >
            <Send size={16} />
            Submitted for Verification
          </motion.div>
        );
      default:
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-semibold"
          >
            <BadgeAlert size={16} />
            Pending Verification
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative rounded-2xl p-6 border overflow-hidden ${isDark
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}
    >
      {/* Floating Orbs Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: `${Math.random() * 18 + 6}px`,
              height: `${Math.random() * 18 + 6}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, #8b5cf6 0%, transparent 70%)`,
              filter: 'blur(4px)',
              opacity: 0,
            }}
            animate={{
              y: isHovered ? [0, Math.random() * -100 - 30] : 0,
              opacity: isHovered ? [0, 0.3, 0] : 0,
              scale: isHovered ? [0, 1, 0] : 0,
            }}
            transition={{
              duration: isHovered ? Math.random() * 4 + 3 : 0.1,
              delay: isHovered ? i * 0.25 : 0,
              repeat: isHovered ? Infinity : 0,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar with animated ring */}
          <motion.div
            className="relative"
            animate={{
              scale: isHovered ? [1, 1.05, 1] : 1,
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={32} className="text-white" />
              )}
            </div>

            {/* Animated rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-violet-500"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user.name}
              </h2>
              <BadgeCheck size={18} className="text-blue-500" />
            </div>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {user.role} • {user.department} • Member since {formatDate(user.joinDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {getVerificationBadge()}
          {!isSubmitted && !isRejectedResubmit && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl text-sm font-semibold shadow-xl"
            >
              <Edit size={16} />
              Edit Profile
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// Main Profile Management Component
const ProfileManagement = ({ isDark }) => {
  const [user, setUser] = useState(userData);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);
  const [socialLinks, setSocialLinks] = useState(user.socialLinks || []);
  const [showSocialDeleteConfirmation, setShowSocialDeleteConfirmation] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRejectedResubmit, setIsRejectedResubmit] = useState(false);
  const [adminVerificationStatus, setAdminVerificationStatus] = useState('rejected');
  const [adminComments, setAdminComments] = useState([
    {
      id: 1,
      admin: 'Priya',
      comments: 'Aadhaar card photo needs clearer picture with all corners visible',
      date: '2024-01-10T10:30:00Z',
      action: 'rejected'
    },
    {
      id: 2,
      admin: 'Rajesh',
      comments: 'Please upload a clearer photo of your PAN card',
      date: '2024-01-09T15:20:00Z',
      action: 'rejected'
    }
  ]);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const modalStates = useRef({
    edit: false,
    deleteDevice: false,
    success: false,
    socialDelete: false
  });

  const scrollPosition = useRef(0);

  useEffect(() => {
    modalStates.current = {
      edit: showEditModal,
      deleteDevice: showDeleteConfirmation,
      success: showSuccessDialog,
      socialDelete: showSocialDeleteConfirmation
    };
  }, [showEditModal, showDeleteConfirmation, showSuccessDialog, showSocialDeleteConfirmation]);

  // Handle body scroll locking
  useEffect(() => {
    const isAnyModalOpen = showEditModal || showDeleteConfirmation || showSuccessDialog || showSocialDeleteConfirmation || isSocialModalOpen;

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
  }, [showEditModal, showDeleteConfirmation, showSuccessDialog, showSocialDeleteConfirmation, isSocialModalOpen]);

  // Helper function to check if user is admin
  const isAdmin = (role) => {
    const adminRoles = ['Admin', 'Super Admin', 'System Admin', 'Administrator'];
    return adminRoles.includes(role);
  };

  // Filter comments to show only rejection comments
  const rejectionComments = adminComments?.filter(comment => comment.action === 'rejected') || [];

  const handleSocialLinkSuccess = (action, item) => {
    let message = '';
    if (action === 'add') {
      message = 'Social link added successfully!';
    } else if (action === 'edit') {
      message = 'Social link updated successfully!';
    } else if (action === 'delete') {
      message = 'Social link deleted successfully!';
    }

    setSuccessMessage(message);
    setShowSuccessDialog(true);
  };

  const handleDeleteDevice = (deviceId) => {
    setDeviceToDelete(deviceId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteDevice = () => {
    if (deviceToDelete) {
      setUser(prevUser => ({
        ...prevUser,
        security: {
          ...prevUser.security,
          trustedDevices: prevUser.security.trustedDevices.filter(
            device => device.id !== deviceToDelete
          )
        }
      }));

      setShowDeleteConfirmation(false);
      setDeviceToDelete(null);
      setSuccessMessage('Device removed successfully!');
      setShowSuccessDialog(true);
    }
  };

  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
    setShowEditModal(false);
    setSuccessMessage('Profile updated successfully!');
    setShowSuccessDialog(true);
  };

  const handlePasswordChange = () => {
    // Validate password
    const errors = {};
    const invalidFields = [];

    if (newPassword || confirmPassword) {
      if (newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters';
        invalidFields.push('newPassword');
      }
      if (newPassword !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        invalidFields.push('confirmPassword');
      }
    }

    if (invalidFields.length > 0) {
      setPasswordErrors(errors);
      setShakeFields([...invalidFields]);
      setTimeout(() => {
        setShakeFields([]);
      }, 600);
      return;
    }

    // Update password if valid
    if (newPassword) {
      setUser(prevUser => ({
        ...prevUser,
        security: {
          ...prevUser.security,
          lastPasswordChange: new Date().toISOString()
        }
      }));
      setNewPassword('');
      setConfirmPassword('');

      setSuccessMessage('Password changed successfully!');
      setShowSuccessDialog(true);
    }
  };

  const handleSocialLinksUpdate = (updatedLinks) => {
    setSocialLinks(updatedLinks);
    setUser(prevUser => ({
      ...prevUser,
      socialLinks: updatedLinks
    }));

    setSuccessMessage('Social links updated successfully!');
    setShowSuccessDialog(true);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setShowEditModal(true);
    // Reset submission states when user starts editing
    setIsSubmitted(false);
    setIsRejectedResubmit(false);
    // Show submit button when admin starts editing
    if (isAdmin(user.role)) {
      setShowSubmitButton(true);
    }
  };

  const handleSubmitForVerification = () => {
    setShowSubmitButton(false);
    setIsSubmitted(true);
    setIsRejectedResubmit(false);
    setAdminVerificationStatus('submitted');
    setAdminComments([...adminComments, {
      id: Date.now(),
      action: 'submitted',
      comments: 'Profile submitted for verification',
      date: new Date().toISOString(),
      admin: 'System'
    }]);
    setSuccessMessage('Profile submitted for verification successfully!');
    setShowSuccessDialog(true);
  };

  const handleResubmitForVerification = () => {
    setShowSubmitButton(true);
    setIsRejectedResubmit(true);
    setIsSubmitted(false);
    setAdminVerificationStatus('submitted');
    setSuccessMessage('You can now re-submit your profile for verification');
    setShowSuccessDialog(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User, color: 'blue' },
    { id: 'activity', name: 'Activity', icon: Activity, color: 'emerald' },
    { id: 'security', name: 'Security', icon: Shield, color: 'purple' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Personal Information Card */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <User size={18} className="text-violet-500" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Full Name
                    </label>
                    <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Phone
                    </label>
                    <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.phone}</p>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      WhatsApp Number
                    </label>
                    <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.emergencyContact}</p>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Marital Status
                    </label>
                    <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.maritalStatus || 'N/A'}</p>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Department
                    </label>
                    <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.department}</p>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Bio
                    </label>
                    <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.bio}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Email
                    </label>
                    <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.email}</p>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Date of Birth
                    </label>
                    <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-IN') : 'N/A'}
                      {user.dateOfBirth && ` (${calculateAge(user.dateOfBirth)} years)`}
                    </p>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Gender
                    </label>
                    <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Nationality
                    </label>
                    <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.nationality || 'N/A'}</p>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Designation
                    </label>
                    <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.designation}</p>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Address
                    </label>
                    <p className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{user.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Card */}
            {user.documents && user.documents.length > 0 && (
              <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <FileText size={18} className="text-amber-500" />
                  Documents
                </h3>

                <div className="space-y-3">
                  {user.documents.map((doc, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-white'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-amber-500" />
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                          {doc.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {doc.size}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = doc.url || '#';
                            link.download = doc.name;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${isDark
                            ? 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
                            : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                            }`}
                        >
                          <Download size={12} className="inline mr-1" />
                          Download
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isAdmin(user.role) && (
              <div className="space-y-4">
                {isAdmin(user.role) && adminVerificationStatus === 'rejected' && adminComments && adminComments.length > 0 && (
                  <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                    <div className="space-y-4">
                      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <MessageSquare size={18} className="text-violet-500" />
                        Admin Comments ({adminComments.filter(c => c.action === 'rejected').length})
                      </h3>

                      {adminComments.filter(comment => comment.action === 'rejected').map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className={`p-4 rounded-xl ${isDark
                            ? 'bg-gray-700 border-gray-600'
                            : 'bg-white border-gray-200'
                            }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-rose-500`}>
                                {comment.admin?.charAt(0) || 'A'}
                              </div>
                              <div>
                                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {comment.admin || 'Admin'}
                                </p>
                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Administrator
                                </p>
                              </div>
                            </div>
                            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                              {new Date(comment.date).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          {/* Comment text */}
                          <p className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {comment.comments}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons - On the right side */}
                <div className="flex justify-end gap-3">
                  {/* Submit Button - Shows when editing and not yet submitted */}
                  {showSubmitButton && (
                    <motion.button
                      type="button"
                      onClick={handleSubmitForVerification}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl text-sm font-semibold shadow-lg flex items-center justify-center gap-2"
                    >
                      <Send size={16} />
                      Submit for Verification
                    </motion.button>
                  )}

                  {/* Re-submit Button - Shows when status is rejected */}
                  {adminVerificationStatus === 'rejected' && !showSubmitButton && (
                    <motion.button
                      type="button"
                      onClick={handleResubmitForVerification}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl text-sm font-semibold shadow-lg flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={16} />
                      Re-submit for Verification
                    </motion.button>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6">
            {/* Activity Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Logins
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.activity.totalLogins}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Active Sessions
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.activity.sessions.filter(s => s.active).length}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Trusted Devices
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.security.trustedDevices.length}
                </p>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Clock size={18} className="text-violet-500" />
                Recent Sessions
              </h3>

              <div className="space-y-3">
                {user.activity.sessions.map((session, index) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-white'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${session.active ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {session.device}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {session.location} • {formatDate(session.loginTime)}
                        </p>
                      </div>
                    </div>
                    {session.active && (
                      <span className={`px-2 py-1 text-xs rounded-full ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                        Active
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            {/* Password Change Section */}
            <PasswordChangeSection
              isDark={isDark}
              onPasswordChange={handlePasswordChange}
              fieldErrors={passwordErrors}
              shakeFields={shakeFields}
              user={user}
            />

            {/* Trusted Devices */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Smartphone size={18} className="text-blue-500" />
                Trusted Devices
              </h3>

              <div className="space-y-3">
                {user.security.trustedDevices.map((device) => {
                  // Determine device icon based on device name
                  const getDeviceIcon = () => {
                    const name = device.name.toLowerCase();
                    if (name.includes('laptop') || name.includes('notebook') || name.includes('macbook')) {
                      return Laptop;
                    } else if (name.includes('desktop') || name.includes('pc')) {
                      return Monitor;
                    } else if (name.includes('ipad') || name.includes('tablet')) {
                      return Tablet;
                    } else {
                      return Smartphone;
                    }
                  };

                  const DeviceIcon = getDeviceIcon();

                  // Get color based on device type
                  const getDeviceColor = () => {
                    const name = device.name.toLowerCase();
                    if (name.includes('laptop') || name.includes('notebook') || name.includes('macbook')) {
                      return { color: 'text-blue-500', bg: isDark ? 'bg-blue-900/30' : 'bg-blue-100' };
                    } else if (name.includes('desktop') || name.includes('pc')) {
                      return { color: 'text-purple-500', bg: isDark ? 'bg-purple-900/30' : 'bg-purple-100' };
                    } else if (name.includes('ipad') || name.includes('tablet')) {
                      return { color: 'text-amber-500', bg: isDark ? 'bg-amber-900/30' : 'bg-amber-100' };
                    } else {
                      return { color: 'text-emerald-500', bg: isDark ? 'bg-emerald-900/30' : 'bg-emerald-100' };
                    }
                  };

                  const deviceStyle = getDeviceColor();

                  return (
                    <motion.div
                      key={device.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className={`group relative p-4 rounded-2xl border-2 transition-all ${isDark
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                        }`}
                    >
                      {/* Background Icon */}
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity">
                        <DeviceIcon size={48} />
                      </div>

                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`p-3 rounded-xl ${deviceStyle.bg} transition-all group-hover:scale-110`}>
                            <DeviceIcon size={20} className={deviceStyle.color} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {device.name}
                              </p>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                Trusted
                              </span>
                            </div>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              • {device.location} • {device.ip} • Last used: {formatDate(device.lastUsed)}
                            </p>
                          </div>
                        </div>

                        {/* Delete button only - exactly like social links */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteDevice(device.id)}
                          className={`p-2.5 rounded-xl transition-all ${isDark
                            ? 'hover:bg-rose-500/20 text-gray-400 hover:text-rose-400'
                            : 'hover:bg-rose-100 text-gray-500 hover:text-rose-600'
                            }`}
                          title="Remove device"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}

                {user.security.trustedDevices.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-center py-12 px-4 rounded-2xl border-2 border-dashed ${isDark ? 'border-gray-700' : 'border-gray-200'
                      }`}
                  >
                    <Smartphone size={48} className={`mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p className={`text-base font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      No trusted devices
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      Devices you trust will appear here
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Social Links - Now in Security section with full management */}
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Globe size={18} className="text-violet-500" />
                Social Links
              </h3>
              <SocialLinksManager
                socialLinks={socialLinks}
                onUpdate={handleSocialLinksUpdate}
                isDark={isDark}
                onDeleteRequest={() => { }}
                onModalStateChange={setIsSocialModalOpen}
                onSuccess={handleSocialLinkSuccess}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 px-3 sm:px-4">
      {/* Profile Header */}
      <ProfileHeader
        user={user}
        isDark={isDark}
        onEdit={handleEditClick}
        verificationStatus={adminVerificationStatus}
        isSubmitted={isSubmitted}
        isRejectedResubmit={isRejectedResubmit}
      />

      {/* Tabs Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-2xl p-4 border ${isDark
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          }`}
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${activeTab === tab.id
                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg'
                : isDark
                  ? 'text-gray-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <tab.icon size={18} />
              {tab.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-2xl p-6 border ${isDark
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          }`}
      >
        {renderTabContent()}
      </motion.div>

      {/* Edit Profile Modal - Now without verification section */}
      <AnimatePresence>
        {showEditModal && (
          <EditProfileModal
            isDark={isDark}
            user={user}
            onClose={() => setShowEditModal(false)}
            onUpdate={handleUpdateProfile}
          // Remove verification props as they're not needed in edit modal
          />
        )}
      </AnimatePresence>

      {/* Device Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirmation && (
          <ConfirmationDialog
            isDark={isDark}
            title="Remove Device"
            message="Are you sure you want to remove this trusted device? You may need to verify it again on next login."
            onConfirm={confirmDeleteDevice}
            onCancel={() => {
              setShowDeleteConfirmation(false);
              setDeviceToDelete(null);
            }}
            confirmText="Remove"
            cancelText="Cancel"
          />
        )}
      </AnimatePresence>

      {/* Success Dialog */}
      <AnimatePresence>
        {showSuccessDialog && (
          <SuccessDialog
            isDark={isDark}
            title="Success"
            message={successMessage}
            onClose={() => {
              setShowSuccessDialog(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileManagement;