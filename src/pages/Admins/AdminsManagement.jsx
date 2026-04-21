import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Edit,
  Clipboard,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Check,
  ClipboardCopy,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Camera,
  AlertCircle,
  MessageSquare,
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
  FileText,
  X,
  Users,
  TrendingDown,
  TrendingUp,
  Activity,
  Upload,
  ChevronLeft,
  ChevronRight,
  User,
  PhoneCall,
  Globe2,
  Building2,
  BadgeCheck,
  UserCog,
  Copy,
  Key,
  Smartphone,
  AtSign,
  ArrowRight,
  Edit as EditIcon
} from 'lucide-react';
import '../../styles/dateInputStyles.css';

const getCompletionChecklistForAdmin = (adminData) => {
  return {
    profilePhoto: adminData.profilePhoto && adminData.profilePhoto.toString().trim() !== '',
    personalInfo: ['fullName', 'email', 'phone', 'dateOfBirth', 'whatsappNumber', 'gender', 'maritalStatus', 'nationality', 'address'].every(
      field => adminData[field] && adminData[field].toString().trim() !== ''
    ),
    workInfo: ['department', 'designation', 'bio'].every(
      field => adminData[field] && adminData[field].toString().trim() !== ''
    ),
    requiredDocuments: adminData.documents && adminData.documents.length >= 5
  };
};

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

  let displayValue, suffix;

  if (absNum >= 1e24) {
    displayValue = formatWithTwoDecimals(absNum / 1e24);
    suffix = ' Y';
  } else if (absNum >= 1e21) {
    displayValue = formatWithTwoDecimals(absNum / 1e21);
    suffix = ' Z';
  } else if (absNum >= 1e18) {
    displayValue = formatWithTwoDecimals(absNum / 1e18);
    suffix = ' E';
  } else if (absNum >= 1e15) {
    displayValue = formatWithTwoDecimals(absNum / 1e15);
    suffix = ' P';
  } else if (absNum >= 1e12) {
    displayValue = formatWithTwoDecimals(absNum / 1e12);
    suffix = ' T';
  } else if (absNum >= 1e9) {
    displayValue = formatWithTwoDecimals(absNum / 1e9);
    suffix = ' B';
  } else if (absNum >= 1e7) {
    const croreValue = absNum / 1e7;
    if (croreValue < 100) {
      displayValue = formatWithTwoDecimals(croreValue);
    } else {
      displayValue = formatWithOneDecimal(croreValue);
    }
    suffix = ' Cr';
  } else if (absNum >= 1e5) {
    const lakhValue = absNum / 1e5;
    if (lakhValue < 10) {
      displayValue = formatWithTwoDecimals(lakhValue);
    } else {
      displayValue = formatWithOneDecimal(lakhValue);
    }
    suffix = ' L';
  } else if (absNum >= 1e3) {
    const thousandValue = absNum / 1e3;
    if (thousandValue < 10) {
      displayValue = formatWithOneDecimal(thousandValue);
    } else {
      displayValue = Math.floor(thousandValue).toString();
    }
    suffix = ' K';
  } else {
    return `${prefix}${currencyPrefix}${absNum.toLocaleString('en-IN')}`;
  }

  if (displayValue.endsWith('.')) {
    displayValue = displayValue.slice(0, -1);
  }

  return `${prefix}${currencyPrefix}${displayValue}${suffix}`;
};

// Reusable Dialog Components (SuccessDialog, ConfirmationDialog)
const SuccessDialog = memo(({ isDark, title, message, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      style={{ margin: 0, padding: 0 }}
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

const ConfirmationDialog = memo(({ isDark, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      style={{ margin: 0, padding: 0 }}
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
              onClick={onCancel}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
            >
              <X size={20} className="text-white" />
            </motion.button>
          </div>
        </div>

        <div className="p-6">
          <p className={`text-base font-medium mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
            {message}
          </p>

          <div className="flex gap-2 sm:gap-3 flex-nowrap">
            <motion.button
              onClick={onCancel}
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

// Enhanced Stat Card Component
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
            <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
              {title}
            </p>
            <motion.h3
              className={`text-3xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent ${color.includes('blue') ? 'from-blue-500 to-cyan-500' :
                color.includes('emerald') ? 'from-emerald-500 to-green-500' :
                  color.includes('violet') ? 'from-violet-500 to-purple-500' :
                    color.includes('purple') ? 'from-purple-500 to-indigo-600' :
                      color.includes('amber') ? 'from-amber-500 to-orange-500' :
                        color.includes('rose') ? 'from-rose-500 to-red-500' :
                          color.includes('slate') ? 'from-slate-500 to-gray-600' :
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
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
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
                      color.includes('violet') || color.includes('purple') ? 'text-violet-500' :
                        color.includes('amber') ? 'text-amber-500' :
                          color.includes('rose') ? 'text-rose-500' :
                            color.includes('slate') ? 'text-gray-500' :
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
            <span className={`text-xs ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>vs last month</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

// Profile Progress Circle Component
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
        <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
          }`}>
          {percentage}%
        </span>
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
          Complete
        </span>
      </div>
    </div>
  );
});

const EnhancedAvatarUpload = memo(({ user, onAvatarChange, isDark, fieldErrors, onFieldError, shakeFields, fieldName = 'profilePhoto' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePhoto || user?.avatar || null);
  const [isHovered, setIsHovered] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setPreviewUrl(user?.profilePhoto || user?.avatar || null);
  }, [user?.profilePhoto, user?.avatar]);

  // Effect to scroll when shaking starts
  useEffect(() => {
    if (shakeFields?.includes(fieldName) && containerRef.current) {
      // Scroll the container into view
      containerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });

      // Focus the container for better UX
      containerRef.current.focus();
    }
  }, [shakeFields, fieldName]);

  const validateAndProcessFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      const error = 'Only JPG, PNG, GIF, and WEBP images are allowed';
      setValidationError(error);
      if (onFieldError) {
        onFieldError(fieldName, error);
      }
      return false;
    }

    if (file.size > maxSize) {
      const error = 'Image size must be less than 5MB';
      setValidationError(error);
      if (onFieldError) {
        onFieldError(fieldName, error);
      }
      return false;
    }

    return true;
  };

  const processFile = (file) => {
    console.log('Processing file:', file.name);
    setIsLoading(true);
    setValidationError('');

    // Clear any previous errors
    if (onFieldError) {
      onFieldError(fieldName, '');
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target.result;
      setPreviewUrl(result);

      if (onAvatarChange) {
        console.log('Calling onAvatarChange with data URL length:', result.length);
        onAvatarChange(result);
      } else {
        console.error('onAvatarChange is not defined');
      }

      setValidationError('');
      setIsLoading(false);
    };

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      const errorMsg = 'Error reading file';
      setValidationError(errorMsg);
      if (onFieldError) {
        onFieldError(fieldName, errorMsg);
      }
      setIsLoading(false);
    };

    reader.onprogress = (data) => {
      if (data.lengthComputable) {
        const progress = (data.loaded / data.total) * 100;
        console.log('Reading progress:', progress.toFixed(0) + '%');
      }
    };

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
          onFieldError(fieldName, error);
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
    <div
      ref={containerRef}
      className="flex flex-col items-center space-y-4 focus:outline-none"
      tabIndex={-1}
    >
      {/* Rest of the component remains the same */}
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

        {/* Wrap only the avatar container with shake animation */}
        <motion.div
          animate={shakeFields?.includes(fieldName) ? "shake" : "initial"}
          variants={shakeAnimation}
          className="overflow-visible"
        >
          <div
            className={`relative w-32 h-32 rounded-full border-4 transition-all duration-200 ${isDragging
              ? 'border-violet-500 bg-violet-500/20 scale-110'
              : (fieldErrors?.[fieldName] || validationError)
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
                  const errorMsg = 'Failed to load image';
                  setValidationError(errorMsg);
                  if (onFieldError) {
                    onFieldError(fieldName, errorMsg);
                  }
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

      {/* Error message display */}
      {(fieldErrors?.[fieldName] || validationError) && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-rose-600 text-xs font-medium"
        >
          <XCircle size={12} />
          {fieldErrors?.[fieldName] || validationError}
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
                ? `bg-gray-800 border-gray-600 hover:border-violet-400 ${fieldErrors?.documents ? 'border-rose-500' : ''}`
                : `bg-white border-gray-300 hover:border-violet-400 ${fieldErrors?.documents ? 'border-rose-500' : ''}`
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
                  className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'
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
                  PDF, DOC, JPG, PNG • Max 10MB each
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Error message - only changes the text color to rose, background stays normal */}
      {fieldErrors?.documents && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-1 text-xs font-medium ${isDark ? 'text-rose-400' : 'text-rose-600'}`}
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

const shakeAnimation = {
  initial: {
    x: 0
  },
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

// Admin Data
const adminsData = [
  {
    id: 'ADM-001',
    profilePhoto: null,
    fullName: 'Rajesh Kumar',
    email: 'rajesh.kumar@admin.com',
    phone: '+91-98765-43210',
    dateOfBirth: '1985-05-15',
    whatsappNumber: '+91-98765-43210',
    gender: 'Male',
    maritalStatus: 'Married',
    nationality: 'Indian',
    department: 'Management',
    designation: 'Super Admin',
    address: 'Mumbai, Maharashtra',
    bio: 'Experienced administrator with over 10 years in system management and team leadership.',
    setStatus: 'Approved',
    documents: [
      { name: 'id_proof.pdf', size: '2.1 MB', type: 'application/pdf' },
      { name: 'resume.pdf', size: '1.5 MB', type: 'application/pdf' },
      { name: 'certificate.pdf', size: '1.2 MB', type: 'application/pdf' }
    ],
    profileCompletion: 100,
    status: 'Approved',
    role: 'super_admin',
    createdBy: 'System',
    createdAt: '2024-01-01',
    lastActive: '2024-11-20T10:30:00Z',
    statusHistory: [
      {
        fromStatus: 'Pending',
        toStatus: 'Approved',
        changedBy: 'Super Admin',
        timestamp: '2024-01-01T09:13:00Z',
        reason: 'Admin approved'
      }
    ]
  },
  {
    id: 'ADM-002',
    profilePhoto: null,
    fullName: 'Priya Sharma',
    email: 'priya.sharma@admin.com',
    phone: '+91-98765-54321',
    dateOfBirth: '1990-03-20',
    whatsappNumber: '+91-98765-54321',
    gender: 'Female',
    maritalStatus: 'Single',
    nationality: 'Indian',
    department: 'Verification',
    designation: 'Approver',
    address: 'Delhi, NCR',
    bio: 'Detail-oriented verification specialist ensuring all records meet compliance standards.',
    documents: [
      { name: 'id_proof.pdf', size: '2.0 MB', type: 'application/pdf' },
      { name: 'resume.pdf', size: '0.8 MB', type: 'application/pdf' }
    ],
    profileCompletion: 85,
    status: 'Approved',
    role: 'approver',
    createdBy: 'Super Admin',
    createdAt: '2024-02-20',
    lastActive: '2024-11-19T15:45:00Z',
    forwardingHistory: [],
    validationHistory: [],
    approvalHistory: [],
    statusHistory: []
  },
  {
    id: 'ADM-003',
    profilePhoto: null,
    fullName: 'Vikram Singh',
    email: 'vikram.singh@admin.com',
    phone: '+91-98765-65432',
    dateOfBirth: '1988-07-10',
    whatsappNumber: '+91-98765-65432',
    gender: 'Male',
    maritalStatus: 'Married',
    nationality: 'Indian',
    department: 'Support',
    designation: 'Co-Approver',
    address: 'Bangalore, Karnataka',
    bio: 'Support specialist with expertise in customer service and technical support.',
    documents: [
      { name: 'id_proof.pdf', size: '1.9 MB', type: 'application/pdf' },
      { name: 'resume.pdf', size: '1.0 MB', type: 'application/pdf' }
    ],
    profileCompletion: 75,
    status: 'Pending',
    role: 'co_approver',
    createdBy: 'Super Admin',
    createdAt: '2024-03-10',
    lastActive: '2024-11-18T09:15:00Z',
    forwardingHistory: [
      {
        fromAdmin: 'admin1',
        toAdmin: 'admin3',
        reason: 'Training purpose',
        timestamp: '2024-03-15T09:15:00Z'
      }
    ],
    validationHistory: [],
    approvalHistory: [],
    statusHistory: []
  },
  {
    id: 'ADM-004',
    profilePhoto: null,
    fullName: 'Anjali Patel',
    email: 'anjali.patel@admin.com',
    phone: '+91-98765-76543',
    dateOfBirth: '1992-11-25',
    whatsappNumber: '+91-98765-76543',
    gender: 'Female',
    maritalStatus: 'Married',
    nationality: 'Indian',
    department: 'Customer Support',
    designation: 'Support Admin',
    address: 'Ahmedabad, Gujarat',
    bio: 'Customer support expert with 5 years of experience in handling queries.',
    documents: [
      { name: 'id_proof.pdf', size: '2.2 MB', type: 'application/pdf' },
      { name: 'resume.pdf', size: '1.1 MB', type: 'application/pdf' },
      { name: 'certificate.pdf', size: '1.3 MB', type: 'application/pdf' }
    ],
    profileCompletion: 100,
    status: 'Approved',
    role: 'support',
    createdBy: 'Super Admin',
    createdAt: '2024-04-05',
    lastActive: '2024-10-15T11:20:00Z',
    forwardingHistory: [],
    validationHistory: [],
    approvalHistory: [],
    statusHistory: []
  },
  {
    id: 'ADM-005',
    profilePhoto: null,
    fullName: 'Amit Verma',
    email: 'amit.verma@admin.com',
    phone: '+91-98765-87654',
    dateOfBirth: '1983-08-12',
    whatsappNumber: '+91-98765-87654',
    gender: 'Male',
    maritalStatus: 'Married',
    nationality: 'Indian',
    department: 'Management',
    designation: 'Super Admin',
    address: 'Lucknow, Uttar Pradesh',
    bio: 'Senior administrator with expertise in team management and operations.',
    documents: [
      { name: 'id_proof.pdf', size: '2.0 MB', type: 'application/pdf' },
      { name: 'resume.pdf', size: '1.2 MB', type: 'application/pdf' }
    ],
    profileCompletion: 80,
    status: 'Pending',
    role: 'super_admin',
    createdBy: 'System',
    createdAt: '2024-05-12',
    lastActive: '2024-11-20T08:30:00Z',
    forwardingHistory: [
      {
        fromAdmin: 'admin3',
        toAdmin: 'admin5',
        reason: 'Department transfer',
        timestamp: '2024-05-18T16:45:00Z'
      }
    ],
    validationHistory: [],
    approvalHistory: [],
    statusHistory: []
  },
  {
    id: 'ADM-006',
    profilePhoto: null,
    fullName: 'Sneha Reddy',
    email: 'sneha.reddy@admin.com',
    phone: '+91-98765-98765',
    dateOfBirth: '1995-01-08',
    whatsappNumber: '+91-98765-98765',
    gender: 'Female',
    maritalStatus: 'Single',
    nationality: 'Indian',
    department: 'Verification',
    designation: 'Approver',
    address: 'Hyderabad, Telangana',
    bio: 'Young verification expert with keen eye for detail.',
    documents: [
      { name: 'id_proof.pdf', size: '1.8 MB', type: 'application/pdf' },
      { name: 'resume.pdf', size: '1.2 MB', type: 'application/pdf' }
    ],
    profileCompletion: 90,
    status: 'Approved',
    role: 'approver',
    createdBy: 'Super Admin',
    createdAt: '2024-06-08',
    lastActive: '2024-11-20T09:45:00Z',
    forwardingHistory: [],
    validationHistory: [],
    approvalHistory: [],
    statusHistory: []
  },
  {
    id: 'ADM-007',
    profilePhoto: null,
    fullName: 'Rahul Mehta',
    email: 'rahul.mehta@admin.com',
    phone: '+91-98765-09876',
    dateOfBirth: '1991-09-30',
    whatsappNumber: '+91-98765-09876',
    gender: 'Male',
    maritalStatus: 'Single',
    nationality: 'Indian',
    department: 'Support',
    designation: 'Co-Approver',
    address: 'Chennai, Tamil Nadu',
    bio: 'Support specialist focused on technical assistance.',
    documents: [
      { name: 'id_proof.pdf', size: '2.3 MB', type: 'application/pdf' },
      { name: 'resume.pdf', size: '1.4 MB', type: 'application/pdf' }
    ],
    profileCompletion: 70,
    status: 'Rejected',
    role: 'co_approver',
    createdBy: 'Super Admin',
    createdAt: '2024-07-15',
    lastActive: '2024-09-20T11:20:00Z',
    forwardingHistory: [
      {
        fromAdmin: 'admin1',
        toAdmin: 'admin7',
        reason: 'Review needed',
        timestamp: '2024-07-20T11:20:00Z'
      }
    ],
    validationHistory: [
      {
        validatedBy: 'Super Admin',
        timestamp: '2024-07-16T10:00:00Z',
        comment: 'Rejected due to incomplete documentation'
      }
    ],
    approvalHistory: [],
    statusHistory: []
  }
];

// Available admins for forwarding
const availableAdmins = [
  { id: 'admin1', name: 'Rajesh Kumar', role: 'super_admin', department: 'Management' },
  { id: 'admin2', name: 'Priya Sharma', role: 'approver', department: 'Verification' },
  { id: 'admin3', name: 'Vikram Singh', role: 'co_approver', department: 'Support' },
  { id: 'admin4', name: 'Anjali Patel', role: 'support', department: 'Customer Support' },
  { id: 'admin5', name: 'Amit Verma', role: 'super_admin', department: 'Management' },
  { id: 'admin6', name: 'Sneha Reddy', role: 'approver', department: 'Verification' },
  { id: 'admin7', name: 'Rahul Mehta', role: 'co_approver', department: 'Support' }
];

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (formData) => {
  let totalFields = 0;
  let completedFields = 0;

  const requiredFields = [
    'profilePhoto', 'fullName', 'email', 'phone', 'dateOfBirth',
    'whatsappNumber', 'gender', 'maritalStatus', 'nationality',
    'department', 'designation', 'address', 'bio'
  ];

  requiredFields.forEach(field => {
    totalFields++;
    if (formData[field] && formData[field].toString().trim() !== '') {
      completedFields++;
    }
  });

  // Documents count check - requires all 5 documents
  totalFields++;
  if (formData.documents && formData.documents.length >= 5) {
    completedFields++;
  }

  return Math.round((completedFields / totalFields) * 100);
};

const getCompletionChecklist = (formData) => {
  return {
    profilePhoto: formData.profilePhoto && formData.profilePhoto.toString().trim() !== '',
    personalInfo: ['fullName', 'email', 'phone', 'dateOfBirth', 'whatsappNumber', 'gender', 'maritalStatus', 'nationality', 'address'].every(
      field => formData[field] && formData[field].toString().trim() !== ''
    ),
    workInfo: ['department', 'designation', 'bio'].every(
      field => formData[field] && formData[field].toString().trim() !== ''
    ),
    requiredDocuments: formData.documents && formData.documents.length >= 5
  };
};

const getStatusColor = (status) => {
  const statusMap = {
    'Unknown': { gradient: 'from-slate-500 to-slate-600', icon: AlertCircle, color: '#64748b' },
    'Incomplete': { gradient: 'from-slate-500 to-slate-600', icon: AlertCircle, color: '#64748b' },
    'Pending': { gradient: 'from-amber-500 to-orange-500', icon: Clock, color: '#f59e0b' },
    'Approved': { gradient: 'from-emerald-500 to-green-500', icon: CheckCircle, color: '#10b981' },
    'Rejected': { gradient: 'from-rose-500 to-red-500', icon: XCircle, color: '#ef4444' }
  };
  return statusMap[status] || { gradient: 'from-gray-500 to-gray-600', icon: AlertCircle, color: '#6b7280' };
};

const getRoleColor = (role) => {
  const roleMap = {
    'super_admin': { gradient: 'from-purple-500 to-indigo-600', icon: UserCog, text: 'Super Admin', color: '#8b5cf6' },
    'approver': { gradient: 'from-blue-500 to-cyan-500', icon: CheckCircle, text: 'Approver', color: '#3b82f6' },
    'co_approver': { gradient: 'from-amber-500 to-orange-500', icon: Users, text: 'Co-Approver', color: '#f59e0b' },
    'support': { gradient: 'from-emerald-500 to-green-500', icon: MessageSquare, text: 'Support', color: '#10b981' }
  };
  return roleMap[role] || { gradient: 'from-gray-500 to-gray-600', icon: User, text: role, color: '#6b7280' };
};

// Email validation function - only accepts @gmail.com
const isValidGmail = (email) => {
  email = email.trim().toLowerCase();

  if (!email) return false;

  if (!email.endsWith('@gmail.com')) return false;

  const username = email.slice(0, -10);

  if (username.length === 0) return false;
  if (username.length > 64) return false;

  const usernameRegex = /^[a-z0-9._]+$/;
  if (!usernameRegex.test(username)) return false;

  if (username.includes('..')) return false;

  if (username.startsWith('.') || username.endsWith('.')) return false;

  if (username.startsWith('_')) return false;

  if (email.split('@gmail.com').length !== 2) return false;

  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const domain = parts[1];
  if (domain !== 'gmail.com') return false;

  return true;
};

const AdminApprovalModal = ({ isDark, admin, onClose, onApprove, onReject }) => {
  const [formData, setFormData] = useState({
    approvalType: '',
    reason: '',
    comment: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const validateForm = () => {
    const errors = {};
    const shake = [];

    if (!formData.approvalType) {
      errors.approvalType = 'Please select approval type';
      shake.push('approvalType');
    }

    if (formData.approvalType === 'reject' && !formData.reason.trim()) {
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

  const confirmAction = () => {
    if (formData.approvalType === 'approve') {
      onApprove(admin.id, formData.comment || formData.reason);
    } else if (formData.approvalType === 'reject') {
      onReject(admin.id, formData.reason);
    }
    setShowConfirmDialog(false);
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, pointerEvents: 'none' }}
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
                  Approve Admin
                </h2>
                <p className="text-violet-100 text-xs sm:text-sm font-medium">
                  Approve or reject this admin
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
              {/* Admin Details */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Admin Details
                </label>
                <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                  }`}>
                  <p className={`text-sm sm:text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                    {admin.fullName}
                  </p>
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                    {admin.id} • {admin.designation} • {admin.department}
                  </p>
                </div>
              </div>

              {/* Approval Type */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Approval Type <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    animate={shakeFields.includes('approvalType') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="overflow-visible"
                  >
                    <input
                      type="radio"
                      id="approve"
                      name="approvalType"
                      value="approve"
                      checked={formData.approvalType === 'approve'}
                      onChange={(e) => handleFieldChange('approvalType', e.target.value)}
                      className="hidden"
                    />
                    <label
                      htmlFor="approve"
                      className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.approvalType === 'approve'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                        : isDark
                          ? 'border-gray-600 bg-gray-700 text-gray-400 hover:border-emerald-500'
                          : 'border-gray-200 bg-gray-100 text-gray-600 hover:border-emerald-500'
                        }`}
                    >
                      <CheckCircle size={16} />
                      Approve
                    </label>
                  </motion.div>

                  <motion.div
                    animate={shakeFields.includes('approvalType') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="overflow-visible"
                  >
                    <input
                      type="radio"
                      id="reject"
                      name="approvalType"
                      value="reject"
                      checked={formData.approvalType === 'reject'}
                      onChange={(e) => handleFieldChange('approvalType', e.target.value)}
                      className="hidden"
                    />
                    <label
                      htmlFor="reject"
                      className={`flex items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.approvalType === 'reject'
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
                {fieldErrors.approvalType && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-rose-600 text-xs font-medium mt-1"
                  >
                    <AlertCircle size={12} />
                    {fieldErrors.approvalType}
                  </motion.div>
                )}
              </div>

              {/* Reason/Comment Field */}
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  Comments
                  <span className={`font-normal normal-case ${formData.approvalType === 'reject' ? 'text-rose-500' : 'text-gray-400'
                    }`}>
                    {formData.approvalType === 'reject' ? ' *' : ' (Optional)'}
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
                      placeholder={formData.approvalType === 'reject'
                        ? "Please provide a reason for rejection..."
                        : "Add an optional comment for approval..."}
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

              {/* Quick rejection reasons */}
              {formData.approvalType === 'reject' && (
                <div className="mt-2">
                  <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    Quick reasons:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Role Mismatch', 'Department Change', 'Insufficient Experience', 'Background Check Failed', 'Duplicate Entry'].map((quickReason) => (
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
                </div>
              )}

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
            title={`Confirm ${formData.approvalType === 'approve' ? 'Approval' : 'Rejection'}`}
            message={`Are you sure you want to ${formData.approvalType === 'approve' ? 'approve' : 'reject'} this admin?`}
            onConfirm={confirmAction}
            onCancel={() => setShowConfirmDialog(false)}
            confirmText={formData.approvalType === 'approve' ? 'Approve' : 'Reject'}
            cancelText="Cancel"
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Forward Modal Component
const AdminCard = memo(({ admin, isDark, onView, onEdit, onDelete, onApproveAdmin, onInvite, index }) => {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverRef = useRef(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const roleConfig = getRoleColor(admin.role);
  const RoleIcon = roleConfig.icon;
  const primaryColor = roleConfig.gradient.includes('purple') ? '#8b5cf6' :
    roleConfig.gradient.includes('blue') ? '#3b82f6' :
      roleConfig.gradient.includes('amber') ? '#f59e0b' :
        roleConfig.gradient.includes('emerald') ? '#10b981' : '#8b5cf6';

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

  const handleMenuAction = (action) => {
    action();
    setShowActions(false);
  };

  const handleMouseEnter = () => {
    hoverRef.current = true;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverRef.current = false;
    setIsHovered(false);
  };

  const canSubmitForValidation = admin.status === 'Pending';
  const canValidate = false;
  const canApprove = false;
  const allAdminsApproved = false;

  useEffect(() => {
    if (admin.status === 'Approved' && allAdminsApproved) {
      console.log('All admins approved');
    }
  }, [admin.status, allAdminsApproved]);

  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(admin.dateOfBirth);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatLastActive = (timestamp) => {
    if (!timestamp) return 'Never';
    const lastActive = new Date(timestamp);
    const now = new Date();
    const diffMs = now - lastActive;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    return formatDate(timestamp);
  };

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

      {/* Light Background Overlay */}
      <motion.div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${roleConfig.gradient}`}
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="relative"
            >
              <motion.div
                animate={{
                  boxShadow: isHovered
                    ? `0 0 0 4px ${primaryColor}40, 0 10px 20px -5px rgba(0,0,0,0.3)`
                    : `0 2px 8px rgba(0,0,0,0.1)`
                }}
                transition={{ duration: 0.2 }}
                className={`relative w-14 h-14 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                style={{
                  border: `2px solid ${isHovered ? primaryColor : (isDark ? '#374151' : '#E5E7EB')}`,
                }}
              >
                {admin.profilePhoto ? (
                  <motion.img
                    src={admin.profilePhoto}
                    alt={admin.fullName}
                    className="w-full h-full object-cover"
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                    onError={(e) => {
                      console.error('Image failed to load in card');
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('fallback-avatar');
                    }}
                    loading="lazy"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                    <User
                      size={24}
                      strokeWidth={2}
                      style={{ color: primaryColor }}
                    />
                  </div>
                )}
              </motion.div>
            </motion.div>

            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-bold mb-1 truncate ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                {admin.fullName}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-medium bg-gradient-to-r ${roleConfig.gradient} bg-clip-text text-transparent`}>
                  {admin.id}
                </span>
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                  • {admin.designation}
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
                    boxShadow: `0 25px 50px rgba(0, 0, 0, 0.4), 0 10px 20px ${primaryColor}20`
                  }}
                >
                  <div className="p-2 space-y-1 relative z-[9999]">
                    <button
                      onClick={() => handleMenuAction(() => onView(admin))}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-blue-500/20 text-gray-300' : 'hover:bg-blue-100 text-gray-700'
                        }`}
                    >
                      <Eye size={16} />
                      View Details
                    </button>

                    {/* Edit - Hidden when Approved */}
                    {admin.status !== 'Approved' && (
                      <button
                        onClick={() => handleMenuAction(() => onEdit(admin))}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-amber-500/20 text-gray-300' : 'hover:bg-amber-100 text-gray-700'
                          }`}
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                    )}

                    {/* Change Status - Hidden when Approved */}
                    {admin.status !== 'Approved' && (
                      <button
                        onClick={() => handleMenuAction(() => onApproveAdmin(admin))}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-violet-500/20 text-gray-300' : 'hover:bg-violet-100 text-gray-700'}`}
                      >
                        <CheckCircle size={16} />
                        Approval
                      </button>
                    )}

                    {admin.addedByCurrentAdmin && admin.status === 'Approved' && (
                      <>
                        <button
                          onClick={() => handleMenuAction(() => onInvite(admin))}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-green-500/20 text-gray-300' : 'hover:bg-green-100 text-gray-700'
                            }`}
                        >
                          <Key size={16} />
                          Invite Admin
                        </button>
                      </>
                    )}

                    <div className={`my-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />

                    <button
                      onClick={() => handleMenuAction(() => onDelete(admin))}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-rose-500/20 text-rose-400' : 'hover:bg-rose-100 text-rose-700'
                        }`}
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

        {/* Contact Info */}
        <div className={`p-3 sm:p-4 rounded-2xl space-y-2 sm:space-y-3 mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
          }`}>
          <div className="flex items-center gap-2 sm:gap-3">
            <Mail size={14} className="text-violet-500 flex-shrink-0" />
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
              } truncate`}>
              {admin.email}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Phone size={14} className="text-violet-500 flex-shrink-0" />
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
              } truncate`}>
              {admin.phone}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <PhoneCall size={14} className="text-violet-500 flex-shrink-0" />
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
              } truncate`}>
              WhatsApp: {admin.whatsappNumber}
            </span>
          </div>
        </div>

        {/* Status & Role Badges */}
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            animate={{
              y: isHovered ? [0, -2, 0] : 0,
            }}
            transition={{
              duration: isHovered ? 1 : 0.1,
              repeat: isHovered ? Infinity : 0
            }}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gradient-to-r ${getStatusColor(admin.status).gradient
              } text-white shadow-lg`}
            style={{
              boxShadow: isHovered ? '0 8px 25px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            {React.createElement(getStatusColor(admin.status).icon, { size: 14 })}
            {admin.status}
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
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gradient-to-r ${roleConfig.gradient} text-white shadow-lg`}
          >
            <RoleIcon size={14} />
            {roleConfig.text}
          </motion.div>
        </div>

        {/* Personal Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <motion.div
            animate={{
              y: isHovered ? [0, -1, 0] : 0,
            }}
            transition={{
              duration: isHovered ? 1 : 0.1,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: isHovered ? 1.5 : 0
            }}
            className={`p-3 rounded-xl text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
              }`}
          >
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Age
            </p>
            <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              {age}
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
            className={`p-3 rounded-xl text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
              }`}
          >
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              DOB
            </p>
            <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              {formatDate(admin.dateOfBirth)}
            </p>
          </motion.div>
        </div>

        {/* Department & Designation */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Department
            </p>
            <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              {admin.department}
            </p>
          </div>

          <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Designation
            </p>
            <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              {admin.designation}
            </p>
          </div>
        </div>

        {/* Gender & Marital Status */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Gender
            </p>
            <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              {admin.gender}
            </p>
          </div>

          <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Marital Status
            </p>
            <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'
              }`}>
              {admin.maritalStatus}
            </p>
          </div>
        </div>

        {/* Nationality & Address */}
        <div className="mb-4">
          <div className={`p-3 rounded-xl mb-2 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Nationality
            </p>
            <div className="flex items-center gap-2">
              <Globe2 size={14} className="text-violet-500" />
              <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'
                }`}>
                {admin.nationality}
              </p>
            </div>
          </div>

          <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Address
            </p>
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-violet-500 flex-shrink-0 mt-0.5" />
              <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                {admin.address}
              </p>
            </div>
          </div>
        </div>

        {/* Bio */}
        {admin.bio && (
          <div className={`p-3 rounded-xl mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Bio
            </p>
            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              {admin.bio}
            </p>
          </div>
        )}

        {/* Documents Count & Profile Completion */}
        <div className="flex items-center justify-between text-xs font-medium pt-4 border-t border-gray-700/20">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-violet-500 flex-shrink-0" />
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {admin.documents.length} Documents
            </span>
          </div>

          <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-medium ${admin.profileCompletion >= 80
            ? isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
            : admin.profileCompletion >= 50
              ? isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'
              : isDark ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-100 text-rose-700'
            }`}>
            <BadgeCheck size={12} className="flex-shrink-0" />
            {admin.profileCompletion}% Complete
            {admin.status === 'Inactive' && admin.profileCompletion >= 93 && (
              <span className="ml-1 text-emerald-500">✓</span>
            )}
          </div>
        </div>

        {/* Last Active */}
        <div className="mt-3 flex items-center gap-2 text-xs">
          <Clock size={12} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
          <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
            Last active: {formatLastActive(admin.lastActive)}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

const AdminDetailModal = ({ admin, isDark, onClose, onStatusChange, onVerificationChange, availableAdmins }) => {
  const getAdminName = (adminId) => {
    const admin = availableAdmins.find(a => a.id === adminId);
    return admin ? admin.name : 'Unknown Admin';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(admin.dateOfBirth);
  const [showComments, setShowComments] = useState(false);
  const [showFullPhoto, setShowFullPhoto] = useState(false);

  // Get icon and color based on comment type
  const getCommentConfig = (type) => {
    switch (type) {
      case 'validation':
      case 'approval':
        return {
          icon: CheckCircle,
          color: 'text-emerald-500',
          bgColor: isDark ? 'bg-emerald-500/20' : 'bg-emerald-100',
          borderColor: isDark ? 'border-emerald-500/30' : 'border-emerald-200',
          label: type === 'validation' ? 'Approved' : 'Approved'
        };
      case 'rejection':
        return {
          icon: XCircle,
          color: 'text-rose-500',
          bgColor: isDark ? 'bg-rose-500/20' : 'bg-rose-100',
          borderColor: isDark ? 'border-rose-500/30' : 'border-rose-200',
          label: 'Rejected'
        };
      default:
        return {
          icon: FileText,
          color: 'text-gray-500',
          bgColor: isDark ? 'bg-gray-500/20' : 'bg-gray-100',
          borderColor: isDark ? 'border-gray-500/30' : 'border-gray-200',
          label: 'Comment'
        };
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
          <div className="relative p-4 sm:p-6 md:p-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 truncate">
                  Admin Details
                </h2>
                <p className="text-violet-100 text-sm sm:text-base font-semibold truncate">
                  {admin.fullName} • {admin.id}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex-shrink-0 ml-2"
              >
                <X size={18} className="text-white" />
              </motion.button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
              {/* Profile Photo Section - Updated with exact styling from outline */}
              <div className={`p-4 sm:p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Camera size={18} className="text-violet-500" />
                  Profile Photo
                </h3>
                <div className="flex flex-col items-center">
                  {/* Premium Photo Display - Smaller version */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFullPhoto(true)}
                    className="relative group cursor-pointer"
                  >
                    {/* Decorative Rings - Adjusted for smaller size */}
                    <div className="absolute inset-0 rounded-full">
                      <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-violet-500" style={{ animationDuration: '3s' }} />
                      <div className="absolute inset-2 rounded-full animate-pulse opacity-30 bg-fuchsia-500" style={{ animationDuration: '2s' }} />
                    </div>

                    {/* Main Photo Container - Reduced from w-40 h-40 to w-32 h-32 */}
                    <div
                      className="relative w-32 h-32 rounded-full overflow-hidden"
                      style={{
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3), 0 0 0 4px rgba(139, 92, 246, 0.2)',
                      }}
                    >
                      {/* Gradient Border */}
                      <div
                        className="absolute inset-0 rounded-full z-10"
                        style={{
                          background: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
                          padding: '3px',
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude',
                          pointerEvents: 'none'
                        }}
                      />

                      {admin.profilePhoto ? (
                        <>
                          <img
                            src={admin.profilePhoto}
                            alt={admin.fullName}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />

                          {/* Overlay on Hover */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                              <Eye size={20} className="text-white" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                          <span className="text-white text-4xl font-bold">
                            {admin.fullName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <p className={`mt-3 text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {admin.fullName}
                  </p>
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {admin.designation} • {admin.department}
                  </p>
                  <p className={`text-xs font-medium mt-1 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                    Click photo to view full size
                  </p>
                </div>
              </div>

              {/* Personal Information and Work Information - Side by side in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Personal Information */}
                <div className={`p-4 sm:p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <h3 className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <User size={18} className="text-violet-500" />
                    Personal Information
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Full Name
                      </label>
                      <p className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{admin.fullName}</p>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Email
                      </label>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{admin.email}</p>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Phone
                      </label>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{admin.phone}</p>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        WhatsApp Number
                      </label>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{admin.whatsappNumber}</p>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Date of Birth & Age
                      </label>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formatDate(admin.dateOfBirth)} ({age} years)
                      </p>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Gender
                      </label>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{admin.gender}</p>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Marital Status
                      </label>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{admin.maritalStatus}</p>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Nationality
                      </label>
                      <div className="flex items-center gap-2">
                        <Globe2 size={14} className="text-violet-500" />
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{admin.nationality}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Information */}
                <div className={`p-4 sm:p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                  <h3 className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <Building2 size={18} className="text-violet-500" />
                    Work Information
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Department
                      </label>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{admin.department}</p>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Designation
                      </label>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{admin.designation}</p>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Address
                      </label>
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-violet-500 flex-shrink-0 mt-1" />
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{admin.address}</p>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Bio
                      </label>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{admin.bio}</p>
                    </div>
                    
                    {/* Status - Simple display */}
                    {admin.statusHistory?.length > 0 && (
                      <div>
                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Status
                        </label>
                        {[...admin.statusHistory]
                          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                          .slice(0, 1)
                          .map((record, index) => (
                            <div key={`status-${index}`} className="flex items-center justify-between gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                record.toStatus === 'Approved' ? 'bg-emerald-500/20 text-emerald-600' :
                                record.toStatus === 'Rejected' ? 'bg-rose-500/20 text-rose-600' :
                                record.toStatus === 'Pending' ? 'bg-amber-500/20 text-amber-600' :
                                isDark ? 'bg-gray-600/20 text-gray-300' : 'bg-gray-200/50 text-gray-700'
                              }`}>
                                {record.toStatus}
                              </span>
                              <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                {formatDate(record.timestamp)}
                              </p>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents Section - Full width on its own row */}
              <div className={`p-4 sm:p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <FileText size={18} className="text-amber-500" />
                  Documents ({admin.documents.length})
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {admin.documents.length > 0 ? (
                    admin.documents.map((doc, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 5 }}
                        className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <FileText size={16} className="text-amber-500" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-semibold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{doc.name}</p>
                            <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {doc.size}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold ${isDark
                            ? 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
                            : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                            }`}
                        >
                          <Download size={14} className="inline mr-1 sm:mr-2" />
                          Download
                        </motion.button>
                      </motion.div>
                    ))
                  ) : (
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No documents uploaded</p>
                  )}
                </div>
              </div>

              {/* Profile Completion Status - Full width on its own row */}
              <div className={`p-4 sm:p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Activity size={18} className="text-violet-500" />
                  Profile Completion Status
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex flex-col items-center">
                    <ProfileProgressCircle
                      percentage={admin.profileCompletion}
                      size={120}
                      isDark={isDark}
                    />
                    <p className={`text-xs font-medium mt-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Profile Completeness
                    </p>

                    {/* Status Overview */}
                    <div className="mt-4 w-full max-w-xs">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Status
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${admin.status === 'Approved'
                          ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/20 text-emerald-600'
                          : admin.status === 'Pending'
                            ? isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-500/20 text-amber-600'
                          : admin.status === 'Rejected'
                            ? isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-500/20 text-rose-600'
                            : isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-500/20 text-gray-600'
                          }`}>
                          {admin.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Completion Checklist
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Profile Photo', completed: getCompletionChecklistForAdmin(admin).profilePhoto },
                        { label: 'Personal Information', completed: getCompletionChecklistForAdmin(admin).personalInfo },
                        { label: 'Work Information', completed: getCompletionChecklistForAdmin(admin).workInfo },
                        { label: 'Required Documents', completed: getCompletionChecklistForAdmin(admin).requiredDocuments }
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

                    {admin.createdAt && (
                      <div className={`mt-2 p-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                          <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Submitted on: {formatDate(admin.createdAt)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>


            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showFullPhoto && admin.profilePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[60] flex items-center justify-center p-4"
            style={{ margin: 0, padding: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowFullPhoto(false)}
              className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[61] p-3 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                position: 'fixed'
              }}
            >
              <X size={24} className="text-white" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={admin.profilePhoto}
                alt={admin.fullName}
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const CustomSelectDropdown = memo(({
  value,
  onChange,
  isDark,
  fieldError,
  shakeFields,
  fieldName = 'field',
  options = [],
  placeholder = 'Select an option...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const dropdownRef = useRef(null);

  const selectOptions = [
    { value: '', label: placeholder },
    ...options
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setHoveredOption(null);
        setIsActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = selectOptions.find(opt => opt.value === value);

  const shakeAnimation = {
    initial: { x: 0 },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  return (
    <div ref={dropdownRef} className="relative w-full" style={{ overflow: 'visible', position: 'relative' }}>
      <motion.div
        animate={shakeFields?.includes(fieldName) ? "shake" : "initial"}
        variants={shakeAnimation}
        style={{ overflow: 'visible', zIndex: isOpen ? 10000 : 'auto' }}
      >
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setIsActive(true);
          }}
          style={{ position: 'relative', zIndex: 10001 }}
          className={`w-full p-2 sm:p-3 rounded-2xl border-2 text-sm font-medium transition-colors flex items-center justify-between focus:outline-none ${isActive ? 'ring-4 ring-violet-500/30 border-violet-500' : 'focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500'
            } ${isDark
              ? 'bg-gray-800 border-gray-600'
              : 'bg-white border-gray-200'
            } ${fieldError ? 'border-rose-500' : ''}`}
        >
          <span className={selectedOption && value !== ''
            ? (isDark ? 'text-white' : 'text-gray-900')
            : (isDark ? 'text-gray-400' : 'text-gray-500')
          }>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              color: value !== ''
                ? (isDark ? '#FFFFFF' : '#231827')
                : (isDark ? '#9CA3AF' : '#6B7280')
            }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </button>
      </motion.div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={`absolute top-8 left-0 right-0 shadow-lg border-x border-b ${isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
          }`}
        style={{
          borderTop: 'none',
          borderBottomLeftRadius: '1rem',
          borderBottomRightRadius: '1rem',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          zIndex: 9999,
          position: 'absolute',
          pointerEvents: isOpen ? 'auto' : 'none',
          overflow: 'visible',
        }}
      >
        {selectOptions.map((option, index) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange({ target: { name: fieldName, value: option.value } });
              setIsOpen(false);
              setHoveredOption(null);
            }}
            onMouseEnter={() => setHoveredOption(option.value)}
            onMouseLeave={() => setHoveredOption(null)}
            className={`w-full px-4 text-left text-sm font-medium transition-colors ${option.value === ''
              ? (isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]')
              : (isDark ? 'text-white' : 'text-gray-900')
              } ${hoveredOption === option.value
                ? (isDark ? 'bg-blue-600/20' : 'bg-blue-100')
                : (value === option.value && hoveredOption === null)
                  ? (isDark ? 'bg-blue-600/20' : 'bg-blue-100')
                  : ''
              }`}
            style={{
              margin: 0,
              marginTop: index === 0 ? '1rem' : '0',
              marginBottom: 0,
              marginLeft: 0,
              marginRight: 0,
              paddingTop: '0.625rem',
              paddingBottom: '0.625rem',
              paddingLeft: '1rem',
              paddingRight: '1rem'
            }}
          >
            {option.label}
          </button>
        ))}
      </motion.div>

      {/* Error Message */}
      {fieldError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
          style={{ marginTop: '0.5rem' }}
        >
          <XCircle size={12} />
          {fieldError}
        </motion.p>
      )}
    </div>
  );
});

// Legacy Gender Dropdown - Now uses Generic Component
const CustomGenderDropdown = memo(({
  value,
  onChange,
  isDark,
  fieldError,
  shakeFields,
  fieldName = 'gender'
}) => {
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  return (
    <CustomSelectDropdown
      value={value}
      onChange={onChange}
      isDark={isDark}
      fieldError={fieldError}
      shakeFields={shakeFields}
      fieldName={fieldName}
      options={genderOptions}
      placeholder="Select Gender..."
    />
  );
});

// Marital Status Dropdown
const CustomMaritalStatusDropdown = memo(({
  value,
  onChange,
  isDark,
  fieldError,
  shakeFields,
  fieldName = 'maritalStatus'
}) => {
  const maritalStatusOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Widowed', label: 'Widowed' }
  ];

  return (
    <CustomSelectDropdown
      value={value}
      onChange={onChange}
      isDark={isDark}
      fieldError={fieldError}
      shakeFields={shakeFields}
      fieldName={fieldName}
      options={maritalStatusOptions}
      placeholder="Select Marital Status..."
    />
  );
});

// Department Dropdown
const CustomDepartmentDropdown = memo(({
  value,
  onChange,
  isDark,
  fieldError,
  shakeFields,
  fieldName = 'department'
}) => {
  const departmentOptions = [
    { value: 'Management', label: 'Management' },
    { value: 'Verification', label: 'Verification' },
    { value: 'Support', label: 'Support' },
    { value: 'Customer Support', label: 'Customer Support' },
    { value: 'Finance', label: 'Finance' },
    { value: 'IT', label: 'IT' }
  ];

  return (
    <CustomSelectDropdown
      value={value}
      onChange={onChange}
      isDark={isDark}
      fieldError={fieldError}
      shakeFields={shakeFields}
      fieldName={fieldName}
      options={departmentOptions}
      placeholder="Select Department..."
    />
  );
});

// Designation Dropdown
const CustomDesignationDropdown = memo(({
  value,
  onChange,
  isDark,
  fieldError,
  shakeFields,
  fieldName = 'designation'
}) => {
  const designationOptions = [
    { value: 'Super Admin', label: 'Super Admin' },
    { value: 'Approver', label: 'Approver' },
    { value: 'Co-Approver', label: 'Co-Approver' },
    { value: 'Support Admin', label: 'Support Admin' },
    { value: 'Verification Officer', label: 'Verification Officer' }
  ];

  return (
    <CustomSelectDropdown
      value={value}
      onChange={onChange}
      isDark={isDark}
      fieldError={fieldError}
      shakeFields={shakeFields}
      fieldName={fieldName}
      options={designationOptions}
      placeholder="Select Designation..."
    />
  );
});

// Set Status Dropdown
const CustomSetStatusDropdown = memo(({
  value,
  onChange,
  isDark,
  fieldError,
  shakeFields,
  fieldName = 'setStatus'
}) => {
  const setStatusOptions = [
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' }
  ];

  return (
    <CustomSelectDropdown
      value={value}
      onChange={onChange}
      isDark={isDark}
      fieldError={fieldError}
      shakeFields={shakeFields}
      fieldName={fieldName}
      options={setStatusOptions}
      placeholder="Set Status..."
    />
  );
});

const AddAdminModal = ({ isDark, admin, onClose, onAddAdmin, onUpdateAdmin, onSuccess }) => {
  const isEditing = !!admin;

  const initialFormData = isEditing ? {
    ...admin,
    profilePhoto: admin.profilePhoto || '',
    fullName: admin.fullName || '',
    email: admin.email || '',
    phone: admin.phone || '',
    dateOfBirth: admin.dateOfBirth || '',
    whatsappNumber: admin.whatsappNumber || '',
    gender: admin.gender || '',
    maritalStatus: admin.maritalStatus || '',
    nationality: admin.nationality || '',
    department: admin.department || '',
    designation: admin.designation || '',
    address: admin.address || '',
    bio: admin.bio || '',
    setStatus: admin.setStatus || '',
    documents: admin.documents || [],
    profileCompletion: admin.profileCompletion || 0,
    status: admin.status || 'Unknown',
    statusHistory: admin.statusHistory || []
  } : {
    profilePhoto: '',
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    whatsappNumber: '',
    gender: '',
    maritalStatus: '',
    nationality: '',
    department: '',
    designation: '',
    address: '',
    bio: '',
    setStatus: '',
    documents: [],
    profileCompletion: 0,
    status: 'Unknown',
    statusHistory: []
  };

  const [formData, setFormData] = useState(initialFormData);
  const [originalData] = useState(initialFormData);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingAdminData, setPendingAdminData] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [formInstanceId] = useState(() => `form-${Date.now()}-${Math.random()}`);
  const [completionChecklist, setCompletionChecklist] = useState({
    personalInfo: false,
    workInfo: false,
    contactInfo: false,
    requiredDocuments: false
  });

  const modalRef = useRef(null);

  const fieldRefs = {
    profilePhoto: useRef(null),
    fullName: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    dateOfBirth: useRef(null),
    whatsappNumber: useRef(null),
    gender: useRef(null),
    maritalStatus: useRef(null),
    nationality: useRef(null),
    department: useRef(null),
    designation: useRef(null),
    address: useRef(null),
    bio: useRef(null),
    setStatus: useRef(null),
    documents: useRef(null)
  };

  useEffect(() => {
    // Only auto-set status when creating new admins, not when editing
    if (!isEditing) {
      // Check if absolutely nothing is filled (including setStatus and documents)
      const allFieldsEmpty = !formData.fullName && !formData.email && !formData.phone &&
        !formData.dateOfBirth && !formData.whatsappNumber && !formData.gender &&
        !formData.maritalStatus && !formData.nationality && !formData.department && 
        !formData.designation && !formData.address && !formData.bio && !formData.profilePhoto &&
        formData.documents.length === 0 && !formData.setStatus;

      if (allFieldsEmpty) {
        // Absolutely nothing filled → "Unknown"
        setFormData(prev => ({ ...prev, status: 'Unknown' }));
      } else {
        // Something is filled, check if all core required fields are complete
        const coreFieldsFilled = formData.fullName && formData.email && formData.phone &&
          formData.dateOfBirth && formData.whatsappNumber && formData.gender &&
          formData.maritalStatus && formData.nationality && formData.department && 
          formData.designation && formData.address && formData.bio && formData.profilePhoto &&
          formData.documents.length >= 1;

        if (coreFieldsFilled) {
          // Check if setStatus is also filled
          if (formData.setStatus) {
            // All core fields filled + at least 1 document + setStatus filled → use selected status
            setFormData(prev => ({ ...prev, status: formData.setStatus }));
          } else {
            // All core fields filled + at least 1 document but setStatus empty → "Pending" (orange)
            setFormData(prev => ({ ...prev, status: 'Pending' }));
          }
        } else {
          // Core fields incomplete → "Incomplete" (show that some fields are filled but not all)
          setFormData(prev => ({ ...prev, status: 'Incomplete' }));
        }
      }
    }
  }, [formData.fullName, formData.email, formData.phone, formData.dateOfBirth,
  formData.whatsappNumber, formData.gender, formData.maritalStatus, formData.nationality,
  formData.department, formData.designation, formData.address, formData.bio, 
  formData.profilePhoto, formData.documents, formData.setStatus, isEditing]);

  useEffect(() => {
    const percentage = calculateProfileCompletion(formData);
    const checklist = {
      personalInfo: ['fullName', 'email', 'phone', 'dateOfBirth', 'whatsappNumber', 'gender', 'maritalStatus', 'nationality', 'address'].every(
        field => formData[field] && formData[field].toString().trim() !== ''
      ),
      workInfo: ['department', 'designation', 'bio'].every(
        field => formData[field] && formData[field].toString().trim() !== ''
      ),
      profilePhoto: formData.profilePhoto && formData.profilePhoto.toString().trim() !== '',
      requiredDocuments: formData.documents && formData.documents.length >= 5
    };

    setCompletionPercentage(percentage);
    setCompletionChecklist(checklist);
  }, [formData]);

  const scrollToFirstInvalidField = (invalidFields) => {
    if (invalidFields.length > 0) {
      const fieldOrder = [
        'profilePhoto', 'fullName', 'email', 'phone', 'dateOfBirth',
        'whatsappNumber', 'gender', 'maritalStatus', 'nationality',
        'department', 'designation', 'address', 'bio', 'documents'
      ];

      const firstInvalidField = fieldOrder.find(field =>
        invalidFields.includes(field)
      );

      if (firstInvalidField) {
        const fieldRef = fieldRefs[firstInvalidField];

        if (fieldRef && fieldRef.current) {
          setTimeout(() => {
            fieldRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            });

            if (firstInvalidField === 'profilePhoto') {
              const cameraButton = fieldRef.current.querySelector('label[for="avatar-upload"]');
              if (cameraButton) {
                cameraButton.focus();
              } else {
                const container = fieldRef.current.querySelector('div[class*="w-32 h-32"]');
                if (container) {
                  container.focus();
                }
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
        }
      }
    }
  };

  const handleEnhancedFocus = (e) => {
    const input = e.target;
    const fieldName = input.name;

    if (['fullName', 'email', 'phone', 'whatsappNumber', 'address', 'nationality', 'bio'].includes(fieldName)) {
      input.setAttribute('readonly', 'readonly');
      setTimeout(() => {
        input.removeAttribute('readonly');
      }, 5);
      input.setAttribute('autocomplete', 'off-' + Math.random().toString(36).substring(7));
    }
  };

  const handleInput = (e) => {
    const input = e.target;
    const fieldName = input.name;

    if (['fullName', 'email', 'phone', 'whatsappNumber', 'address', 'nationality', 'bio'].includes(fieldName)) {
      input.setAttribute('data-autofill-prevent', Math.random().toString(36).substring(7));
      input.setAttribute('autocomplete', 'off-' + Math.random().toString(36).substring(7));
      setTimeout(() => {
        input.setAttribute('autocomplete', 'off');
      }, 5);
    }
  };

  const handleKeyDown = (e) => {
    const input = e.target;
    const fieldName = input.name;

    if (['fullName', 'email', 'phone', 'whatsappNumber', 'address', 'nationality', 'bio'].includes(fieldName)) {
      input.setAttribute('data-typing', 'true');
    }
  };

  const handlePaste = (e) => {
    const input = e.target;
    const fieldName = input.name;

    if (['fullName', 'email', 'phone', 'whatsappNumber', 'address', 'nationality', 'bio'].includes(fieldName)) {
      e.stopPropagation();
    }
  };

  const handleMouseDown = (e) => {
    const input = e.target;
    const fieldName = input.name;

    if (['fullName', 'email', 'phone', 'whatsappNumber', 'address', 'nationality', 'bio'].includes(fieldName)) {
      input.setAttribute('readonly', 'readonly');
      setTimeout(() => {
        input.removeAttribute('readonly');
      }, 5);
    }
  };

  // Add CSS styles for autofill prevention
  const autofillStyles = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #000 !important;
    transition: background-color 5000s ease-in-out 0s;
    background-color: white !important;
  }
  
  input::-webkit-contacts-auto-fill-button,
  input::-webkit-credentials-auto-fill-button {
    visibility: hidden;
    display: none !important;
    pointer-events: none;
    height: 0;
    width: 0;
    margin: 0;
  }

  input {
    autocomplete: off !important;
  }
  
  input:-internal-autofill-selected {
    background-color: white !important;
  }
`;

  const [fieldNames, setFieldNames] = useState({
    fullName: `name_${Math.random().toString(36).substring(2, 10)}`,
    email: `email_${Math.random().toString(36).substring(2, 10)}`,
    phone: `phone_${Math.random().toString(36).substring(2, 10)}`,
    whatsappNumber: `whatsapp_${Math.random().toString(36).substring(2, 10)}`,
    address: `address_${Math.random().toString(36).substring(2, 10)}`,
    nationality: `nationality_${Math.random().toString(36).substring(2, 10)}`,
    bio: `bio_${Math.random().toString(36).substring(2, 10)}`
  });

  // 2. Add this handler for all text inputs
  const handleAutofillPrevention = (e) => {
    const input = e.target;
    // Remove readonly on actual user interaction
    if (input.hasAttribute('readonly')) {
      input.removeAttribute('readonly');
    }
  };

  // 3. Add this to make fields readonly initially and on blur
  const makeReadonly = (e) => {
    const input = e.target;
    if (input.value === '') {
      input.setAttribute('readonly', 'readonly');
    }
  };

  const validateForm = () => {
    const errors = {};
    const invalidFields = [];

    setShakeFields([]);

    if (!formData.profilePhoto) {
      errors.profilePhoto = 'Profile photo is required';
      invalidFields.push('profilePhoto');
    }

    const isValidName = (name) => {
      return /^[A-Za-z\s]+$/.test(name.trim());
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

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
      invalidFields.push('fullName');
    } else if (!isValidName(formData.fullName)) {
      errors.fullName = 'Name can only contain alphabets and spaces';
      invalidFields.push('fullName');
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      invalidFields.push('email');
    } else if (!isValidGmail(formData.email)) {
      errors.email = 'Please enter a valid Gmail address';
      invalidFields.push('email');
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
      invalidFields.push('phone');
    } else if (!isValidPhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
      invalidFields.push('phone');
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of Birth is required';
      invalidFields.push('dateOfBirth');
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();

      if (dob > today) {
        errors.dateOfBirth = 'Date of Birth cannot be in the future';
        invalidFields.push('dateOfBirth');
      } else if (age < 18) {
        errors.dateOfBirth = 'Must be at least 18 years old';
        invalidFields.push('dateOfBirth');
      }
    }

    if (!formData.whatsappNumber.trim()) {
      errors.whatsappNumber = 'WhatsApp Number is required';
      invalidFields.push('whatsappNumber');
    } else if (!isValidPhone(formData.whatsappNumber)) {
      errors.whatsappNumber = 'Please enter a valid WhatsApp number';
      invalidFields.push('whatsappNumber');
    }

    if (!formData.gender) {
      errors.gender = 'Gender is required';
      invalidFields.push('gender');
    }

    if (!formData.maritalStatus) {
      errors.maritalStatus = 'Marital Status is required';
      invalidFields.push('maritalStatus');
    }

    if (!formData.nationality.trim()) {
      errors.nationality = 'Nationality is required';
      invalidFields.push('nationality');
    }

    if (!formData.department.trim()) {
      errors.department = 'Department is required';
      invalidFields.push('department');
    }

    if (!formData.designation.trim()) {
      errors.designation = 'Designation is required';
      invalidFields.push('designation');
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required';
      invalidFields.push('address');
    } else if (!isValidAddress(formData.address)) {
      errors.address = 'Address must start with a letter';
      invalidFields.push('address');
    }

    if (!formData.bio.trim()) {
      errors.bio = 'Bio is required';
      invalidFields.push('bio');
    }

    if (formData.documents.length === 0) {
      errors.documents = 'Please upload at least one document';
      invalidFields.push('documents');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    if (isEditing) {
      const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

      if (!hasChanges) {
        onClose();
        return;
      }
    }

    // Determine the status based on setStatus field
    let statusToSet = 'Pending';
    if (formData.setStatus && formData.setStatus.trim() !== '') {
      if (formData.setStatus === 'Pending') {
        statusToSet = 'Pending';
      } else if (formData.setStatus === 'Approved') {
        statusToSet = 'Approved';
      } else if (formData.setStatus === 'Rejected') {
        statusToSet = 'Rejected';
      }
    }

    // Build statusHistory for new admins with selected status
    let statusHistory = formData.statusHistory || [];
    if (!isEditing && formData.setStatus && formData.setStatus.trim() !== '') {
      const initialStatusEntry = {
        fromStatus: 'Pending',
        toStatus: statusToSet,
        changedBy: 'Current Admin',
        timestamp: new Date().toISOString(),
        reason: 'Initial status set during admin creation',
        type: 'selected-status'
      };
      statusHistory = [initialStatusEntry];
    }

    const adminToSubmit = {
      ...formData,
      id: isEditing ? formData.id : `ADM-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
      status: statusToSet,
      role: isEditing ? formData.role : 'support',
      createdBy: isEditing ? formData.createdBy : 'Current User',
      createdAt: isEditing ? formData.createdAt : new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString(),
      forwardingHistory: isEditing ? formData.forwardingHistory : [],
      validationHistory: isEditing ? formData.validationHistory : [],
      approvalHistory: isEditing ? formData.approvalHistory : [],
      statusHistory: statusHistory,
      profileCompletion: completionPercentage
    };

    setPendingAction(() => () => {
      if (isEditing) {
        onUpdateAdmin(adminToSubmit);
      } else {
        onAddAdmin(adminToSubmit);
      }
    });

    setPendingAdminData(adminToSubmit);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (pendingAction && pendingAdminData) {
      onClose();
      if (isEditing) {
        onUpdateAdmin(pendingAdminData);
      } else {
        onAddAdmin(pendingAdminData);
      }

      const successMsg = isEditing
        ? 'Admin updated successfully'
        : 'Admin added successfully';

      if (onSuccess) {
        onSuccess(successMsg);
      }
    }
    setShowConfirmation(false);
    setPendingAction(null);
    setPendingAdminData(null);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingAction(null);
    setPendingAdminData(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === 'fullName') {
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
    }
    else if (name === 'email') {
      newValue = value.toLowerCase();
    }
    else if (name === 'phone' || name === 'whatsappNumber') {
      let processedValue = value;

      if (value.startsWith('+91-')) {
        const afterCode = value.slice(4);
        const cleaned = afterCode.replace(/[^\d\-]/g, '');
        processedValue = '+91-' + cleaned;
      } else {
        processedValue = value.replace(/[^\d\-]/g, '');
      }

      const formatPhoneNumber = (digits) => {
        if (!digits) return '';

        const digitsOnly = digits.replace(/\D/g, '');
        const limitedDigits = digitsOnly.slice(0, 10);

        if (limitedDigits.length <= 3) {
          return limitedDigits;
        } else if (limitedDigits.length <= 6) {
          return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3)}`;
        } else {
          return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6, 10)}`;
        }
      };

      newValue = formatPhoneNumber(processedValue.replace(/\D/g, ''));

      if (value.startsWith('+91-')) {
        newValue = '+91-' + newValue;
      }
    }
    else if (name === 'setStatus') {
      newValue = value;

      // Track status change in history when setStatus is changed from edit mode
      if (isEditing && value && value.trim() !== '') {
        const oldStatus = formData.status;
        let newStatus = 'Pending';
        if (value === 'Pending') {
          newStatus = 'Pending';
        } else if (value === 'Approved') {
          newStatus = 'Approved';
        } else if (value === 'Rejected') {
          newStatus = 'Rejected';
        }

        // Only add to history if status actually changed
        if (oldStatus !== newStatus) {
          const statusHistoryEntry = {
            fromStatus: oldStatus,
            toStatus: newStatus,
            changedBy: 'Current Admin',
            timestamp: new Date().toISOString(),
            reason: 'Status updated from edit modal',
            type: 'selected-status'
          };

          setFormData(prev => ({
            ...prev,
            [name]: newValue,
            status: newStatus,
            statusHistory: [...(prev.statusHistory || []), statusHistoryEntry]
          }));

          if (fieldErrors[name]) {
            setFieldErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors[name];
              return newErrors;
            });
          }

          return;
        }
      }
    }
    else {
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
          ref={modalRef}
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
                  {isEditing ? 'Edit Admin' : 'Add New Admin'}
                </h2>
                <p className="text-violet-100 text-xs sm:text-sm font-semibold truncate">
                  {isEditing ? 'Update admin information' : 'Create a new admin record'}
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

          <div className="flex-1 overflow-y-auto" autoComplete="off">
            <style>{`
              input:-webkit-autofill,
              input:-webkit-autofill:hover,
              input:-webkit-autofill:focus,
              input:-webkit-autofill:active {
                -webkit-box-shadow: 0 0 0 30px white inset !important;
                box-shadow: 0 0 0 30px white inset !important;
                -webkit-text-fill-color: #000 !important;
                transition: background-color 5000s ease-in-out 0s;
              }
              
              input::-webkit-contacts-auto-fill-button,
              input::-webkit-credentials-auto-fill-button {
                visibility: hidden;
                display: none !important;
                pointer-events: none;
                height: 0;
                width: 0;
                margin: 0;
              }

              input {
                autocomplete: off;
              }

              input[type="text"],
              input[type="email"],
              input[type="password"],
              input[type="tel"] {
                -webkit-autofill: off;
              }

              textarea:-webkit-autofill {
                -webkit-box-shadow: 0 0 0 30px white inset !important;
                box-shadow: 0 0 0 30px white inset !important;
                -webkit-text-fill-color: #000 !important;
              }

              select:-webkit-autofill {
                -webkit-box-shadow: 0 0 0 30px white inset !important;
                box-shadow: 0 0 0 30px white inset !important;
              }

              /* Remove autofill styling and black outline */
              input:-webkit-autofill,
              input:-webkit-autofill:hover,
              input:-webkit-autofill:focus,
              input:-webkit-autofill:active {
                -webkit-box-shadow: 0 0 0 30px white inset !important;
                box-shadow: 0 0 0 30px white inset !important;
                -webkit-text-fill-color: #000 !important;
                caret-color: #000 !important;
                outline: none !important;
                border: 2px solid #e5e7eb !important;
              }

              textarea:-webkit-autofill,
              textarea:-webkit-autofill:hover,
              textarea:-webkit-autofill:focus {
                -webkit-box-shadow: 0 0 0 30px white inset !important;
                box-shadow: 0 0 0 30px white inset !important;
                -webkit-text-fill-color: #000 !important;
                outline: none !important;
                border: 2px solid #e5e7eb !important;
              }
            `}</style>
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-6 space-y-4 sm:space-y-6"
              name={formInstanceId}
              id={formInstanceId}
              autoComplete="off"
              spellCheck="false"
            >
              <input
                type="text"
                name="prevent_autofill_username"
                style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                autoComplete="username"
                readOnly
              />
              <input
                type="password"
                name="prevent_autofill_password"
                style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                autoComplete="current-password"
                readOnly
              />
              <input
                type="text"
                name="prevent_autofill_name"
                style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                autoComplete="name"
                readOnly
              />
              <input
                type="email"
                name="prevent_autofill_email"
                style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                autoComplete="email"
                readOnly
              />
              <input
                type="tel"
                name="prevent_autofill_tel"
                style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                autoComplete="tel"
                readOnly
              />
              <input
                type="text"
                name="prevent_autofill_address"
                style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                autoComplete="street-address"
                readOnly
              />
              {/* Profile Photo Section */}
              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Camera size={16} className="text-violet-500" />
                  Profile Photo <span className="text-rose-500 font-normal normal-case">*</span>
                </h3>
                <div ref={fieldRefs.profilePhoto} className="overflow-visible">
                  <EnhancedAvatarUpload
                    user={formData}
                    onAvatarChange={(avatar) => {
                      setFormData(prev => ({ ...prev, profilePhoto: avatar }));
                      if (fieldErrors.profilePhoto) {
                        setFieldErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.profilePhoto;
                          return newErrors;
                        });
                      }
                    }}
                    isDark={isDark}
                    fieldErrors={fieldErrors}
                    onFieldError={handleFieldError}
                    shakeFields={shakeFields}
                    fieldName="profilePhoto"
                  />
                </div>
              </div>

              {/* Personal Information Section */}
              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                }`}>
                <h3 className={`text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  <User size={16} className="text-violet-500" />
                  Personal Information <span className="text-rose-500 font-normal normal-case">*</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div ref={fieldRefs.fullName} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      &nbsp;Full Name <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <motion.div
                      animate={shakeFields.includes('fullName') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible relative"
                    >
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        onFocus={handleEnhancedFocus}
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        onMouseDown={handleMouseDown}
                        placeholder="Enter your full name..."
                        maxLength={50}
                        autoComplete="off"
                        spellCheck="false"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        data-form-type="other"
                        aria-label="Full Name"
                        aria-autocomplete="none"
                        required={false}
                        onAutoComplete={(e) => {
                          e.preventDefault();
                          e.target.value = '';
                        }}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          } ${fieldErrors.fullName ? 'border-rose-500' : ''}`}
                      />
                      <div className={`absolute bottom-1 right-3 text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        {formData.fullName.length}/50
                      </div>
                    </motion.div>
                    {fieldErrors.fullName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                      >
                        <XCircle size={12} />
                        {fieldErrors.fullName}
                      </motion.p>
                    )}
                  </div>

                  <div ref={fieldRefs.email} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      &nbsp;Email <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
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
                        onFocus={handleEnhancedFocus}
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        onMouseDown={handleMouseDown}
                        placeholder="Enter your email..."
                        maxLength={100}
                        autoComplete="off"
                        spellCheck="false"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        data-form-type="other"
                        aria-label="Email"
                        aria-autocomplete="none"
                        required={false}
                        onAutoComplete={(e) => {
                          e.preventDefault();
                          e.target.value = '';
                        }}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          } ${fieldErrors.email ? 'border-rose-500' : ''}`}
                      />
                      <div className={`absolute bottom-1 right-3 text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        {formData.email.length}/100
                      </div>
                    </motion.div>
                    <AnimatePresence>
                      {fieldErrors.email && (
                        <motion.p
                          key="email-error"
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-2 text-rose-600 text-xs font-medium mt-2 px-1"
                        >
                          <XCircle size={14} />
                          <span>{fieldErrors.email}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div ref={fieldRefs.phone} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      &nbsp;Phone <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
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
                            onFocus={handleEnhancedFocus}
                            onInput={handleInput}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                            onMouseDown={handleMouseDown}
                            placeholder="Enter your phone..."
                            maxLength={12}
                            autoComplete="off"
                            spellCheck="false"
                            data-lpignore="true"
                            data-1p-ignore="true"
                            data-form-type="other"
                            aria-label="Phone Number"
                            aria-autocomplete="none"
                            required={false}
                            onAutoComplete={(e) => {
                              e.preventDefault();
                              e.target.value = '';
                            }}
                            className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                              } ${fieldErrors.phone ? 'border-rose-500' : ''}`}
                          />
                          <div className={`absolute bottom-1 right-3 text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
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
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      &nbsp;Date of Birth <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <motion.div
                      animate={shakeFields.includes('dateOfBirth') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible"
                    >
                      <div className="date-input-modal relative">
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setFieldErrors(prev => ({ ...prev, dateOfBirth: '' }));
                            setShakeFields(prev => prev.filter(f => f !== 'dateOfBirth'));
                            if (!newValue || newValue === '') {
                              handleChange(e);
                              return;
                            }
                            const date = new Date(newValue);
                            const isValid = !isNaN(date.getTime());
                            if (isValid) {
                              const [year, month, day] = newValue.split('-').map(Number);
                              const isValidDate = year > 1900 && year < 2100 &&
                                month >= 1 && month <= 12 &&
                                day >= 1 && day <= 31;

                              if (isValidDate) {
                                handleChange(e);
                                setFieldErrors(prev => ({ ...prev, dateOfBirth: '' }));
                                setShakeFields(prev => prev.filter(f => f !== 'dateOfBirth'));
                              } else {
                                setFieldErrors(prev => ({ ...prev, dateOfBirth: 'Please enter a valid date' }));
                                setShakeFields(prev => [...prev, 'dateOfBirth']);
                                setTimeout(() => setShakeFields(prev => prev.filter(f => f !== 'dateOfBirth')), 600);
                              }
                            } else {
                              setFieldErrors(prev => ({ ...prev, dateOfBirth: 'Please enter a valid date' }));
                              setShakeFields(prev => [...prev, 'dateOfBirth']);
                              setTimeout(() => setShakeFields(prev => prev.filter(f => f !== 'dateOfBirth')), 600);
                            }
                          }}
                          onBlur={(e) => {
                            const value = e.target.value;
                            if (value) {
                              const [year, month, day] = value.split('-').map(Number);
                              const isValidDate = !isNaN(year) && !isNaN(month) && !isNaN(day) &&
                                year > 1900 && year < 2100 &&
                                month >= 1 && month <= 12 &&
                                day >= 1 && day <= 31;
                              if (!isValidDate) {
                                setFieldErrors(prev => ({ ...prev, dateOfBirth: 'Please enter a valid date' }));
                                setShakeFields(prev => [...prev, 'dateOfBirth']);
                                setTimeout(() => setShakeFields(prev => prev.filter(f => f !== 'dateOfBirth')), 600);
                              }
                            } else {
                              setFieldErrors(prev => ({ ...prev, dateOfBirth: '' }));
                              setShakeFields(prev => prev.filter(f => f !== 'dateOfBirth'));
                            }
                          }}
                          autoComplete="off"
                          className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium pr-10 transition-all ${isDark
                            ? 'bg-gray-800 border-gray-600 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                            } ${fieldErrors.dateOfBirth ? 'border-rose-500' : ''}`}
                          style={{
                            color: formData.dateOfBirth ? '' : (isDark ? '#9CA3AF' : '#6B7280'),
                          }}
                        />
                        <Calendar
                          size={18}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110"
                          onClick={() => {
                            const input = document.querySelector('.date-input-modal input[type="date"]');
                            if (input) {
                              if (input.showPicker) {
                                input.showPicker();
                              } else {
                                input.focus();
                                input.click();
                              }
                            }
                          }}
                          style={{
                            zIndex: 10,
                            color: formData.dateOfBirth
                              ? (isDark ? '#FFFFFF' : '#1F2937')
                              : (isDark ? '#9CA3AF' : '#6B7280'),
                            filter: 'none',
                            pointerEvents: 'auto'
                          }}
                        />
                      </div>
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

                  <div ref={fieldRefs.whatsappNumber} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      &nbsp;WhatsApp Number <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <motion.div
                      animate={shakeFields.includes('whatsappNumber') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible"
                    >
                      <div className="flex gap-2 sm:gap-1">
                        <div className="flex-shrink-0">
                          <div className={`h-[48px] flex items-center px-3 rounded-2xl border-2 text-sm font-medium ${isDark
                            ? 'bg-gray-800 border-gray-600'
                            : 'bg-white border-gray-200'
                            } ${fieldErrors.whatsappNumber ? 'border-rose-500' : ''}`}>
                            <div className={`flex items-center gap-2 ${formData.whatsappNumber && formData.whatsappNumber.replace(/\D/g, '').length > 0
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
                            name="whatsappNumber"
                            value={formData.whatsappNumber}
                            onChange={handleChange}
                            placeholder="Enter your WhatsApp number..."
                            maxLength={12}
                            autoComplete="off"
                            spellCheck="false"
                            readOnly
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                            data-lpignore="true"
                            data-1p-ignore="true"
                            data-form-type="other"
                            aria-label="WhatsApp Number"
                            aria-autocomplete="none"
                            required={false}
                            onAutoComplete={(e) => {
                              e.preventDefault();
                              e.target.value = '';
                            }}
                            className={`w-full h-[48px] p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                              } ${fieldErrors.whatsappNumber ? 'border-rose-500' : ''}`}
                          />
                          <div className={`absolute bottom-1 right-3 text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                            {formData.whatsappNumber.replace(/\D/g, '').length}/10
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    {fieldErrors.whatsappNumber && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                      >
                        <XCircle size={12} />
                        {fieldErrors.whatsappNumber}
                      </motion.p>
                    )}
                  </div>

                  <div ref={fieldRefs.gender} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      &nbsp;Gender <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <CustomGenderDropdown
                      value={formData.gender}
                      onChange={handleChange}
                      isDark={isDark}
                      fieldError={fieldErrors.gender}
                      shakeFields={shakeFields}
                      fieldName="gender"
                    />
                  </div>

                  <div ref={fieldRefs.maritalStatus} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      &nbsp;Marital Status <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <CustomMaritalStatusDropdown
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      isDark={isDark}
                      fieldError={fieldErrors.maritalStatus}
                      shakeFields={shakeFields}
                      fieldName="maritalStatus"
                    />
                  </div>

                  <div ref={fieldRefs.nationality} className="overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      &nbsp;Nationality <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
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
                        placeholder="Enter your nationality..."
                        maxLength={50}
                        autoComplete="off"
                        spellCheck="false"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        data-lpignore="true"
                        data-1p-ignore="true"
                        data-form-type="other"
                        aria-label="Nationality"
                        aria-autocomplete="none"
                        required={false}
                        onAutoComplete={(e) => {
                          e.preventDefault();
                          e.target.value = '';
                        }}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          } ${fieldErrors.nationality ? 'border-rose-500' : ''}`}
                      />
                      <div className={`absolute bottom-1 right-3 text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
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

                  <div ref={fieldRefs.address} className="md:col-span-2 overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      &nbsp;Address <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
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
                        onFocus={handleEnhancedFocus}
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        onMouseDown={handleMouseDown}
                        placeholder="Enter your address..."
                        maxLength={100}
                        autoComplete="off"
                        spellCheck="false"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        data-form-type="other"
                        aria-label="Address"
                        aria-autocomplete="none"
                        required={false}
                        onAutoComplete={(e) => {
                          e.preventDefault();
                          e.target.value = '';
                        }}
                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          } ${fieldErrors.address ? 'border-rose-500' : ''}`}
                      />
                      <div className={`absolute bottom-1 right-3 text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        {formData.address.length}/100
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
                </div>
              </div>

              {/* Work Information Section */}
              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                }`}>
                <h3 className={`text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  <Building2 size={16} className="text-violet-500" />
                  Work Information <span className="text-rose-500 font-normal normal-case">*</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div ref={fieldRefs.department} className="overflow-visible" style={{ zIndex: 70, position: 'relative' }}>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      &nbsp;Department <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <CustomDepartmentDropdown
                      value={formData.department}
                      onChange={handleChange}
                      isDark={isDark}
                      fieldError={fieldErrors.department}
                      shakeFields={shakeFields}
                      fieldName="department"
                    />
                  </div>

                  <div ref={fieldRefs.designation} className="overflow-visible" style={{ zIndex: 60, position: 'relative' }}>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      &nbsp;Designation <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <CustomDesignationDropdown
                      value={formData.designation}
                      onChange={handleChange}
                      isDark={isDark}
                      fieldError={fieldErrors.designation}
                      shakeFields={shakeFields}
                      fieldName="designation"
                    />
                  </div>

                  <div ref={fieldRefs.bio} className="md:col-span-2 overflow-visible">
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                      &nbsp;Bio <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <motion.div
                      animate={shakeFields.includes('bio') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible relative"
                    >
                      <div className="relative">
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="Enter your bio..."
                          maxLength={300}
                          rows={3}
                          autoComplete="off"
                          spellCheck="false"
                          readOnly
                          onFocus={(e) => e.target.removeAttribute('readonly')}
                          data-lpignore="true"
                          data-1p-ignore="true"
                          data-form-type="other"
                          aria-label="Bio"
                          aria-autocomplete="none"
                          required={false}
                          onAutoComplete={(e) => {
                            e.preventDefault();
                            e.target.value = '';
                          }}
                          className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium resize-none ${isDark
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                            } ${fieldErrors.bio ? 'border-rose-500' : ''}`}
                        />
                        <div className={`absolute right-3 text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}
                          style={{
                            bottom: '0.5rem',
                            pointerEvents: 'none'
                          }}
                        >
                          {formData.bio.length}/300
                        </div>
                      </div>
                    </motion.div>
                    {fieldErrors.bio && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                      >
                        <XCircle size={12} />
                        {fieldErrors.bio}
                      </motion.p>
                    )}
                  </div>

                  {/* Conditionally show setStatus field for new admins or when original admin status is Pending */}
                  {(!isEditing || admin?.status === 'Pending') && (
                    <div ref={fieldRefs.setStatus} className="md:col-span-2 overflow-visible" style={{ zIndex: 50, position: 'relative' }}>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        &nbsp;Status <span className="text-rose-500 font-normal normal-case">(</span>O<span style={{ textTransform: 'lowercase' }}>ptional</span><span className="text-rose-500 font-normal normal-case">)</span>
                      </label>
                      <CustomSetStatusDropdown
                        value={formData.setStatus}
                        onChange={handleChange}
                        isDark={isDark}
                        fieldError={fieldErrors.setStatus}
                        shakeFields={shakeFields}
                        fieldName="setStatus"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Document Upload Section */}
              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                }`}>
                <h3 className={`text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  <FileText size={16} className="text-amber-500" />
                  Documents Upload <span className="text-rose-500 font-normal normal-case">*</span>
                </h3>
                <div ref={fieldRefs.documents} className="overflow-visible">
                  <DocumentUpload
                    documents={formData.documents}
                    onDocumentsChange={handleDocumentsChange}
                    isDark={isDark}
                    fieldErrors={fieldErrors}
                    onFieldError={handleFieldError}
                    shakeFields={shakeFields}
                  />
                </div>
              </div>

              {/* Profile Completion Status Section */}
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
                      {completionPercentage >= 93 ? 'Ready to submit!' : 'Complete at least 93% of fields to submit'}
                    </p>

                    {/* Status Overview */}
                    <div className="mt-4 w-full max-w-xs">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Status
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${(() => {
                          let displayStatus = formData.status;
                          // Only show setStatus if form is complete (all core fields filled)
                          // If status is Incomplete or Unknown, show that instead
                          if ((displayStatus === 'Pending' || displayStatus === 'Approved' || displayStatus === 'Rejected') && 
                              formData.setStatus && formData.setStatus.trim() !== '') {
                            displayStatus = formData.setStatus;
                          }
                          return displayStatus === 'Approved'
                            ? isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/20 text-emerald-600'
                            : displayStatus === 'Pending'
                              ? isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-500/20 text-amber-600'
                            : displayStatus === 'Rejected'
                              ? isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-500/20 text-rose-600'
                            : displayStatus === 'Incomplete'
                              ? isDark ? 'bg-slate-500/20 text-slate-300' : 'bg-slate-500/20 text-slate-600'
                            : displayStatus === 'Unknown'
                              ? isDark ? 'bg-slate-500/20 text-slate-300' : 'bg-slate-500/20 text-slate-600'
                              : isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-500/20 text-gray-600';
                        })()}
                          }`}>
                          {
                            (() => {
                              let displayStatus = formData.status;
                              // Only show setStatus if form is complete (all core fields filled)
                              // If status is Incomplete or Unknown, show that instead
                              if ((displayStatus === 'Pending' || displayStatus === 'Approved' || displayStatus === 'Rejected') && 
                                  formData.setStatus && formData.setStatus.trim() !== '') {
                                displayStatus = formData.setStatus;
                              }
                              return displayStatus;
                            })()
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Completion Checklist
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Profile Photo', completed: formData.profilePhoto && formData.profilePhoto.toString().trim() !== '' },
                        { label: 'Personal Information', completed: completionChecklist.personalInfo },
                        { label: 'Work Information', completed: completionChecklist.workInfo },
                        { label: 'Required Documents', completed: formData.documents && formData.documents.length >= 5 }
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

                    {/* Documents Summary - Like in recipients */}
                    <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Documents Uploaded
                        </span>
                        <span className={`text-xs font-bold ${formData.documents.length >= 5
                          ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                          : isDark ? 'text-rose-400' : 'text-rose-600'
                          }`}>
                          {formData.documents.length} / Required: {formData.documents.length >= 5 ? '5 ✓' : '5'}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            Required Documents:
                          </span>
                          <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            5 total (Aadhaar Front/Back counts as 1)
                          </span>
                        </div>
                        {formData.documents.length < 5 && (
                          <p className={`text-xs mt-1 ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
                            Need {5 - formData.documents.length} more document(s)
                          </p>
                        )}
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
                  {isEditing ? (
                    <>
                      <CheckCircle size={16} />
                      Update Admin
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Add Admin
                    </>
                  )}
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
            title={isEditing ? "Update Admin" : "Add Admin"}
            message={isEditing
              ? "Are you sure you want to update this admin's information?"
              : "Are you sure you want to add this new admin?"
            }
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            confirmText={isEditing ? "Update" : "Add"}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Pagination Component
const Pagination = React.memo(({ currentPage, totalPages, onPageChange, isDark, totalItems, itemsPerPage }) => {
  if (totalPages <= 1) return null;

  const handlePageChange = useCallback((page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);

      setTimeout(() => {
        const adminsSection = document.querySelector('.admins-grid-container')?.parentElement;
        if (adminsSection) {
          const yOffset = -100;
          const y = adminsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({
            top: Math.max(0, y),
            behavior: 'smooth'
          });
        } else {
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
        Page {currentPage} of {totalPages} • Showing {startItem}-{endItem} admins from {totalItems}
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

const InviteAdminModal = ({ isDark, selectedAdmin, onClose, onSuccess }) => {
  // Determine invitation type based on selectedAdmin
  const isLoginInvitation = !!selectedAdmin;
  const [invitationType, setInvitationType] = useState(isLoginInvitation ? 'login' : 'signup');

  const [invitationKey, setInvitationKey] = useState('');
  const [originalPassword, setOriginalPassword] = useState('');
  const [showGeneratedKey, setShowGeneratedKey] = useState(false);
  const [activeTab, setActiveTab] = useState('email');
  const [pasteFieldValueEmail, setPasteFieldValueEmail] = useState('');
  const [pasteFieldValueSms, setPasteFieldValueSms] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [copied, setCopied] = useState(false);

  // Signup template - for code-based invitations
  const professionalTemplateSignUp = `Dear Sir/Madam,

You have been invited to join as an administrator on our platform.

INVITATION DETAILS

• Invitation Code: KEY
• Valid for: 7 days
• Role: Administrator

REGISTRATION LINK

1. Sign up here: http://localhost:5173/AdminSignup
2. Website Link Login here: http://localhost:5173/

NEXT STEPS

1. Click the registration link above
2. Enter invitation code: KEY
3. Go to website Login to Account
4. Complete your profile
5. Submit required documents
6. Wait for approval

IMPORTANT NOTES

• This invitation is for individual use only
• Do not share your code with others
• Complete registration within 7 days
• For assistance: support@yourdomain.com

Best regards,
Administration Team
• Your Company Name
• support@yourdomain.com
• www.yourdomain.com

This is an automated message, please do not reply.`;

  // Login template - for password-based login invitations
  const professionalTemplateLogin = `Dear Sir/Madam,

You have been invited to join as an administrator on our platform.

INVITATION DETAILS

• Your Password: KEY
• Valid for: 7 days
• Role: Administrator

LOGIN LINK

1. Login here: http://localhost:5173/Login
2. Website Link: http://localhost:5173/

NEXT STEPS

1. Login using your password above
2. Update your password "KEY" it is temporary only valid for 7 days
3. Start your work

IMPORTANT NOTES

• This invitation is for individual use only
• Do not share your temporary password with others
• Update your password within 7 days
• For assistance: support@yourdomain.com

Best regards,
Administration Team
• Your Company Name
• support@yourdomain.com
• www.yourdomain.com

This is an automated message, please do not reply.`;

  const [emailData, setEmailData] = useState({
    to: selectedAdmin?.email || '',
    subject: isLoginInvitation ? 'Invitation to Join as Administrator' : 'Invitation to Join as Administrator',
    message: isLoginInvitation ? professionalTemplateLogin : professionalTemplateSignUp
  });

  // Format phone number for SMS
  const formatInitialPhone = () => {
    if (!selectedAdmin?.phone) return '';
    const digits = selectedAdmin.phone.replace(/\D/g, '').slice(0, 10);
    if (digits.length === 0) return '';
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const [smsData, setSmsData] = useState({
    to: formatInitialPhone(),
    message: isLoginInvitation ? professionalTemplateLogin : professionalTemplateSignUp
  });
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingSms, setIsEditingSms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);
  const modalRef = useRef(null);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [showPasteTooltip, setShowPasteTooltip] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const [originalCode, setOriginalCode] = useState('');
  const [pasteClipboardCopiedEmail, setPasteClipboardCopiedEmail] = useState(false);
  const [pasteClipboardCopiedSms, setPasteClipboardCopiedSms] = useState(false);
  const [showClipboardIcon, setShowClipboardIcon] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [pendingInvitation, setPendingInvitation] = useState(null);
  const [isHoveringCopy, setIsHoveringCopy] = useState(false);
  const [isHoveringPasteEmail, setIsHoveringPasteEmail] = useState(false);
  const [isHoveringPasteSms, setIsHoveringPasteSms] = useState(false);
  const [pasteFieldActivatedEmail, setPasteFieldActivatedEmail] = useState(false);
  const [pasteFieldActivatedSms, setPasteFieldActivatedSms] = useState(false);

  const fieldRefs = {
    invitationKey: useRef(null),
    pasteInvitationCodeEmail: useRef(null),
    pasteInvitationCodeSms: useRef(null),
    emailTo: useRef(null),
    emailSubject: useRef(null),
    emailMessage: useRef(null),
    smsTo: useRef(null),
    smsMessage: useRef(null)
  };

  const resetPasteFields = () => {
    setPasteFieldValueEmail('');
    setPasteFieldValueSms('');
    setPasteClipboardCopiedEmail(false);
    setPasteClipboardCopiedSms(false);
    setPasteFieldActivatedEmail(false);
    setPasteFieldActivatedSms(false);
    setFieldErrors(prev => ({
      ...prev,
      pasteInvitationCode: '',
      pasteInvitationCodeSms: ''
    }));

    setShakeFields(prev => prev.filter(field =>
      field !== 'pasteInvitationCode' && field !== 'pasteInvitationCodeSms'
    ));
  };

  const scrollToFirstInvalidField = (invalidFields) => {
    if (invalidFields.length > 0) {
      const fieldOrder = [
        'invitationKey',
        activeTab === 'email' ? 'pasteInvitationCodeEmail' : 'pasteInvitationCodeSms',
        activeTab === 'email' ? 'emailTo' : 'smsTo',
        activeTab === 'email' ? 'emailSubject' : null,
        activeTab === 'email' ? 'emailMessage' : 'smsMessage'
      ].filter(Boolean);

      const firstInvalidField = fieldOrder.find(field => invalidFields.includes(field));

      if (firstInvalidField && fieldRefs[firstInvalidField]?.current) {
        setTimeout(() => {
          const el = fieldRefs[firstInvalidField].current;
          const scrollContainer = el.closest?.('[data-scroll]')
            || el.closest?.('.overflow-y-auto')
            || el.closest?.('[style*="overflow"]');

          if (scrollContainer) {
            const containerRect = scrollContainer.getBoundingClientRect();
            const elementRect = el.getBoundingClientRect();
            const relativeTop = elementRect.top - containerRect.top;
            const offset = 80;
            scrollContainer.scrollTo({
              top: scrollContainer.scrollTop + relativeTop - offset,
              behavior: 'smooth'
            });
          } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }

          setTimeout(() => {
            const input = el.querySelector('input, textarea, select');
            if (input) input.focus();
          }, 300);
        }, 50);
      }
    }
  };

  const formatPhoneNumberLive = (value) => {
    let digits = value.replace(/\D/g, '');
    digits = digits.slice(0, 10);

    if (digits.length === 0) {
      return '';
    }

    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
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

    const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/;
    if (!domainRegex.test(domain)) return false;

    if (domain.includes('--')) return false;
    if (domain.startsWith('-') || domain.endsWith('-')) return false;

    return true;
  };

  const isValidPhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10;
  };

  const isValidSpecialCharacters = (text, fieldType) => {
    if (fieldType === 'subject') {
      const allowedRegex = /^[A-Za-z0-9\s.,!?\-'"\/()&]*$/;
      return allowedRegex.test(text);
    } else if (fieldType === 'message') {
      const allowedRegex = /^[\p{L}\p{N}\p{P}\p{Z}\n\r\t•–—]*$/u;
      return allowedRegex.test(text);
    }
    return true;
  };

  // Password generation function for login invitations
  const generateRandomPassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';

    const allChars = uppercase + lowercase + numbers + symbols;
    const password = [];

    // Ensure at least one of each type
    password.push(uppercase.charAt(Math.floor(Math.random() * uppercase.length)));
    password.push(lowercase.charAt(Math.floor(Math.random() * lowercase.length)));
    password.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
    password.push(symbols.charAt(Math.floor(Math.random() * symbols.length)));

    // Fill the rest with random characters to reach 60 characters
    for (let i = password.length; i < 60; i++) {
      password.push(allChars.charAt(Math.floor(Math.random() * allChars.length)));
    }

    // Shuffle the password array
    return password.sort(() => Math.random() - 0.5).join('');
  };

  // Hash generation function for display (simulated bcrypt format)
  const generateSimulatedBcryptHash = (password) => {
    const bcryptPrefix = '$2a$10$';
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./:';
    let hash = bcryptPrefix;
    for (let i = 0; i < 53; i++) {
      hash += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return hash;
  };

  const generateInvitationKey = () => {
    if (invitationType === 'login') {
      // Generate password for login invitation
      const password = generateRandomPassword();
      const hash = generateSimulatedBcryptHash(password);

      setInvitationKey(hash); // Display the hash
      setOriginalPassword(hash); // Store the HASH (not original password) so validation compares correctly
      setShowGeneratedKey(true);
      // Set success message immediately after generation
      setFieldErrors(prev => ({ ...prev, invitationKey: 'Password generated. Valid for 7 days.' }));
    } else {
      // Generate code for signup invitation
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const code = Array.from({ length: 12 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join('');

      setInvitationKey(code);
      setOriginalCode(code);
      setShowGeneratedKey(true);
      // Set success message immediately after generation for code too
      setFieldErrors(prev => ({ ...prev, invitationKey: 'Code generated. Valid for 7 days.' }));
    }

    setCopyButtonText('Copy');
    setHasAttemptedSubmit(false);
    setShakeFields(prev => prev.filter(f => f !== 'invitationKey'));
    setShowClipboardIcon(false);
    resetPasteFields();
    if (document.activeElement) {
      document.activeElement.blur();
    }
  };

  const copyInvitationKey = () => {
    navigator.clipboard.writeText(invitationKey);
    setCopied(true);
    setShowClipboardIcon(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handlePasteInvitationCode = () => {
    if (invitationKey) {
      if (activeTab === 'email') {
        setPasteFieldValueEmail(invitationKey);
        setPasteClipboardCopiedEmail(true);
        setPasteFieldActivatedEmail(true);
        setFieldErrors(prev => ({ ...prev, pasteInvitationCode: '' }));
        setTimeout(() => {
          setPasteClipboardCopiedEmail(false);
        }, 2000);
      } else {
        setPasteFieldValueSms(invitationKey);
        setPasteClipboardCopiedSms(true);
        setPasteFieldActivatedSms(true);
        setFieldErrors(prev => ({ ...prev, pasteInvitationCodeSms: '' }));
        setTimeout(() => {
          setPasteClipboardCopiedSms(false);
        }, 2000);
      }
    }
  };

  const handleSendEmail = () => {
    const errors = {};
    const invalidFields = [];

    setShakeFields([]);

    // Conditional validation based on invitation type
    if (invitationType === 'login') {
      // For login invitations, only validate password and email
      // Paste field is not shown for login invitations
    } else {
      // For signup invitations, validate code as usual
      if (!invitationKey) {
        errors.invitationKey = 'Please generate an invitation code first';
        invalidFields.push('invitationKey');
      } else if (invitationKey.length !== 12) {
        errors.invitationKey = 'Invitation code must be exactly 12 characters';
        invalidFields.push('invitationKey');
      } else if (invitationKey !== originalCode) {
        errors.invitationKey = 'Invitation code does not match';
        invalidFields.push('invitationKey');
      }

      // Validate paste invitation code
      if (!pasteFieldValueEmail) {
        errors.pasteInvitationCode = 'Please paste the invitation code';
        invalidFields.push('pasteInvitationCodeEmail');
      } else if (pasteFieldValueEmail.length !== 12) {
        errors.pasteInvitationCode = 'Invitation code must be exactly 12 characters';
        invalidFields.push('pasteInvitationCodeEmail');
      } else if (pasteFieldValueEmail !== invitationKey) {
        errors.pasteInvitationCode = 'Invitation code does not match';
        invalidFields.push('pasteInvitationCodeEmail');
      }
    }

    // Validate email recipient
    if (!emailData.to.trim()) {
      errors.emailTo = 'Please enter an email address';
      invalidFields.push('emailTo');
    } else if (!isValidEmail(emailData.to)) {
      errors.emailTo = 'Please enter a valid email address';
      invalidFields.push('emailTo');
    }

    // Validate email subject
    if (!emailData.subject.trim()) {
      errors.emailSubject = 'Please enter an email subject';
      invalidFields.push('emailSubject');
    } else if (emailData.subject.length > 100) {
      errors.emailSubject = 'Subject must be less than 100 characters';
      invalidFields.push('emailSubject');
    } else if (!isValidSpecialCharacters(emailData.subject, 'subject')) {
      errors.emailSubject = 'Subject contains invalid special characters. Allowed: . , ! ? - \' " / ( ) &';
      invalidFields.push('emailSubject');
    }

    // Validate email message
    if (!emailData.message.trim()) {
      errors.emailMessage = 'Please enter an email message';
      invalidFields.push('emailMessage');
    } else if (emailData.message.length > 1000) {
      errors.emailMessage = 'Message must be less than 1000 characters';
      invalidFields.push('emailMessage');
    } else if (!isValidSpecialCharacters(emailData.message, 'message')) {
      errors.emailMessage = 'Message contains invalid special characters';
      invalidFields.push('emailMessage');
    }

    setFieldErrors(errors);

    if (invalidFields.length > 0) {
      // Force animation retrigger by clearing first, then re-adding with setTimeout
      setShakeFields([]);
      setTimeout(() => {
        setShakeFields([...invalidFields]);
        scrollToFirstInvalidField(invalidFields);
      }, 0);

      setTimeout(() => {
        setShakeFields([]);
      }, 600);

      return;
    }

    // Prepare message with appropriate password/code substitution
    let messageToSend = emailData.message;

    if (invitationType === 'login') {
      // For login invitations, replace KEY placeholder with original password
      messageToSend = messageToSend.replace(/KEY/g, originalPassword);
    } else {
      // For signup invitations, replace KEY placeholder with invitation code
      messageToSend = messageToSend.replace(/KEY/g, invitationKey);
    }

    // All validation passed - show confirmation dialog
    setPendingInvitation({
      type: 'email',
      to: emailData.to,
      subject: emailData.subject,
      message: messageToSend
    });
    setShowConfirmationDialog(true);
  };

  const handleSendSms = () => {
    const errors = {};
    const invalidFields = [];

    setShakeFields([]);

    // Conditional validation based on invitation type
    if (invitationType === 'login') {
      // For login invitations, only validate phone and message
      // Paste field is not shown for login invitations
    } else {
      // For signup invitations, validate code as usual
      if (!invitationKey) {
        errors.invitationKey = 'Please generate an invitation code first';
        invalidFields.push('invitationKey');
      } else if (invitationKey.length !== 12) {
        errors.invitationKey = 'Invitation code must be exactly 12 characters';
        invalidFields.push('invitationKey');
      } else if (invitationKey !== originalCode) {
        errors.invitationKey = 'Invitation code does not match';
        invalidFields.push('invitationKey');
      }

      // Validate paste invitation code (SMS)
      if (!pasteFieldValueSms) {
        errors.pasteInvitationCodeSms = 'Please paste the invitation code';
        invalidFields.push('pasteInvitationCodeSms');
      } else if (pasteFieldValueSms.length !== 12) {
        errors.pasteInvitationCodeSms = 'Invitation code must be exactly 12 characters';
        invalidFields.push('pasteInvitationCodeSms');
      } else if (pasteFieldValueSms !== invitationKey) {
        errors.pasteInvitationCodeSms = 'Invitation code does not match';
        invalidFields.push('pasteInvitationCodeSms');
      }
    }

    // Validate SMS recipient phone
    if (!smsData.to) {
      errors.smsTo = 'Please enter a phone number';
      invalidFields.push('smsTo');
    } else if (!isValidPhone(smsData.to)) {
      errors.smsTo = 'Please enter a valid 10-digit phone number';
      invalidFields.push('smsTo');
    }

    // Validate SMS message
    if (!smsData.message.trim()) {
      errors.smsMessage = 'Please enter an SMS message';
      invalidFields.push('smsMessage');
    } else if (smsData.message.length > 1000) {
      errors.smsMessage = 'Message must be less than 1000 characters';
      invalidFields.push('smsMessage');
    } else if (!isValidSpecialCharacters(smsData.message, 'message')) {
      errors.smsMessage = 'Message contains invalid special characters';
      invalidFields.push('smsMessage');
    }

    setFieldErrors(errors);

    if (invalidFields.length > 0) {
      // Force animation retrigger by clearing first, then re-adding with setTimeout
      setShakeFields([]);
      setTimeout(() => {
        setShakeFields([...invalidFields]);
        scrollToFirstInvalidField(invalidFields);
      }, 0);

      setTimeout(() => {
        setShakeFields([]);
      }, 600);

      return;
    }

    // Prepare message with appropriate password/code substitution
    let messageToSend = smsData.message;

    if (invitationType === 'login') {
      // For login invitations, replace KEY placeholder with original password
      messageToSend = messageToSend.replace(/KEY/g, originalPassword);
    } else {
      // For signup invitations, replace KEY placeholder with invitation code
      messageToSend = messageToSend.replace(/KEY/g, invitationKey);
    }

    // All validation passed - show confirmation dialog
    setPendingInvitation({
      type: 'sms',
      to: smsData.to,
      message: smsData.message
    });
    setShowConfirmationDialog(true);
  };

  // Add this helper function inside InviteAdminModal component (before confirmAndSendInvitation)
  const formatPhoneNumber = (phoneNumber) => {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');

    // Format as +91 XXX-XXX-XXXX
    if (digits.length === 10) {
      return `+91 ${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    // If already has +91 or different format, clean and format
    let cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    if (cleanNumber.startsWith('+91')) {
      const numberPart = cleanNumber.slice(3).replace(/\D/g, '');
      if (numberPart.length === 10) {
        return `+91 ${numberPart.slice(0, 3)}-${numberPart.slice(3, 6)}-${numberPart.slice(6)}`;
      }
    }

    // Fallback: return original
    return phoneNumber;
  };

  // Update confirmAndSendInvitation function
  const confirmAndSendInvitation = () => {
    if (!pendingInvitation) return;

    let msg;
    if (pendingInvitation.type === 'email') {
      msg = `Invitation email sent successfully to ${pendingInvitation.to}!`;
    } else {
      const formattedPhone = formatPhoneNumber(pendingInvitation.to);
      msg = `Invitation SMS sent successfully to ${formattedPhone}!`;
    }

    setShowConfirmationDialog(false);
    setPendingInvitation(null);
    onClose();           // close invite modal
    onSuccess(msg);      // pass message to parent - parent will show success dialog
  };

  const renderEmailSection = () => (
    <div className="space-y-4" autoComplete="off">
      <div>
        <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          &nbsp;Paste {invitationType === 'login' ? 'Password' : 'Invitation Code'} <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
        </label>
        <motion.div
          ref={fieldRefs.pasteInvitationCodeEmail}
          animate={shakeFields.includes('pasteInvitationCodeEmail') ? "shake" : "initial"}
          variants={shakeAnimation}
          className="overflow-visible relative"
        >
          <input
            id="paste-invite-input-email"
            type="text"
            name={`invite_code_${Math.random().toString(36).substring(7)}`}
            value={pasteFieldValueEmail}
            onChange={(e) => {
              const maxLength = invitationType === 'login' ? 60 : 12;
              // For login mode, allow all characters; for signup, allow only alphanumeric
              const value = invitationType === 'login'
                ? e.target.value.slice(0, maxLength)
                : e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, maxLength);
              setPasteFieldValueEmail(value);

              if (value !== invitationKey) {
                setPasteClipboardCopiedEmail(false);
              }

              // Only show validation errors if the paste field has been activated
              if (!pasteFieldActivatedEmail) {
                setFieldErrors(prev => ({ ...prev, pasteInvitationCode: '' }));
                return;
              }

              const maxLen = invitationType === 'login' ? 60 : 12;
              if (!invitationKey) {
                setFieldErrors(prev => ({ ...prev, pasteInvitationCode: '' }));
                setShakeFields(prev => prev.filter(f => f !== 'pasteInvitationCodeEmail'));
              } else if (value.length < maxLen) {
                const fieldLabel = invitationType === 'login' ? 'Password is incomplete' : 'Code is incomplete';
                setFieldErrors(prev => ({ ...prev, pasteInvitationCode: fieldLabel }));
                setShakeFields(prev => prev.filter(f => f !== 'pasteInvitationCodeEmail'));
                setTimeout(() => {
                  setShakeFields(prev => prev.includes('pasteInvitationCodeEmail') ? prev : [...prev, 'pasteInvitationCodeEmail']);
                }, 0);
              } else if (value !== invitationKey) {
                const fieldLabel = invitationType === 'login' ? 'Invalid password' : 'Invalid code';
                setFieldErrors(prev => ({ ...prev, pasteInvitationCode: fieldLabel }));
                setShakeFields(prev => prev.filter(f => f !== 'pasteInvitationCodeEmail'));
                setTimeout(() => {
                  setShakeFields(prev => prev.includes('pasteInvitationCodeEmail') ? prev : [...prev, 'pasteInvitationCodeEmail']);
                }, 0);
              } else {
                setFieldErrors(prev => ({ ...prev, pasteInvitationCode: '' }));
                setShakeFields(prev => prev.filter(f => f !== 'pasteInvitationCodeEmail'));
              }
            }}
            placeholder={invitationType === 'login' ? "Paste admin password..." : "Enter invitation code..."}
            maxLength={invitationType === 'login' ? 60 : 12}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            data-lpignore="true"
            data-1p-ignore="true"
            data-form-type="other"
            className={`w-full pl-4 pr-12 py-2 sm:py-3 h-12 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
              ? `bg-gray-800 border-gray-600 text-white placeholder-gray-400 ${fieldErrors.pasteInvitationCode ? 'border-rose-500' : ''}`
              : `bg-white border-gray-200 text-gray-900 placeholder-gray-500 ${fieldErrors.pasteInvitationCode ? 'border-rose-500' : ''}`
              }`}
          />
          {(showClipboardIcon && invitationKey) && (
            <div
              className="absolute right-4 top-[45%] transform -translate-y-1/2 w-6 h-6 flex items-center justify-center"
              onMouseEnter={() => setIsHoveringPasteEmail(true)}
              onMouseLeave={() => setIsHoveringPasteEmail(false)}
            >
              <AnimatePresence>
                {(isHoveringPasteEmail || pasteClipboardCopiedEmail) && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute bottom-full mb-2 text-xs font-semibold whitespace-nowrap pointer-events-none bg-black text-white px-3 py-2 rounded-lg"
                  >
                    <span>{pasteClipboardCopiedEmail ? 'Pasted!' : 'Paste'}</span>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-black"></div>
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                type="button"
                onClick={handlePasteInvitationCode}
                disabled={!invitationKey}
                className={`transition-colors ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}
              >
                {pasteClipboardCopiedEmail ? (
                  <Check size={18} />
                ) : (
                  <Clipboard size={18} />
                )}
              </button>
            </div>
          )}
          <div className={`absolute bottom-1 right-3 text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {pasteFieldValueEmail.length}/{invitationType === 'login' ? 60 : 12}
          </div>
        </motion.div>
        {pasteFieldValueEmail.length === (invitationType === 'login' ? 60 : 12) && !fieldErrors.pasteInvitationCode && invitationKey && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 flex items-center gap-1.5 px-1"
          >
            <CheckCircle
              size={12}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isDark ? "text-white" : "text-gray-700"}
            />
            <span className={`text-xs font-medium ${isDark ? "text-white" : "text-gray-700"}`}>
              {invitationType === 'login' ? 'Password is valid.' : 'Code is valid.'}
            </span>
          </motion.div>
        )}
        {fieldErrors.pasteInvitationCode && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
          >
            <XCircle size={12} />
            {fieldErrors.pasteInvitationCode}
          </motion.p>
        )}
      </div>

      <div>
        <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          &nbsp;Recipient Email <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
        </label>
        <motion.div
          ref={fieldRefs.emailTo}
          animate={shakeFields.includes('emailTo') ? "shake" : "initial"}
          variants={shakeAnimation}
          className="overflow-visible relative"
        >
          <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10 ${isDark ? 'text-violet-400' : 'text-violet-500'}`} />
          <input
            type="text"
            name={`recipient_email_${Math.random().toString(36).substring(7)}`}
            value={emailData.to}
            onChange={(e) => {
              const value = e.target.value.slice(0, 100);
              setEmailData(prev => ({ ...prev, to: value }));
              if (fieldErrors.emailTo) setFieldErrors(prev => ({ ...prev, emailTo: '' }));
            }}
            onFocus={(e) => {
              e.target.setAttribute('readonly', 'readonly');
              setTimeout(() => {
                e.target.removeAttribute('readonly');
              }, 5);
              e.target.setAttribute('autocomplete', 'off-' + Math.random().toString(36).substring(7));
            }}
            onMouseDown={(e) => {
              e.target.setAttribute('readonly', 'readonly');
              setTimeout(() => {
                e.target.removeAttribute('readonly');
              }, 5);
            }}
            placeholder="Enter recipient email..."
            maxLength={100}
            autoComplete="off"
            data-form-type="other"
            data-lpignore="true"
            data-1p-ignore="true"
            className={`w-full pl-12 pr-12 py-2 sm:py-3 h-12 border-2 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-violet-500/30
              focus:border-violet-500 focus:outline-none 
            ${isDark
                ? `bg-gray-800 border-gray-600 text-white placeholder-gray-400 ${fieldErrors.emailTo ? 'border-rose-500' : ''}`
                : `bg-white border-gray-200 text-gray-900 placeholder-gray-500 ${fieldErrors.emailTo ? 'border-rose-500' : ''}`
              }`}
          />
          <div className={`absolute bottom-1 right-3 text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {emailData.to.length}/100
          </div>
          {emailData.to && isValidEmail(emailData.to) && (
            <CheckCircle className="absolute right-4 top-[45%] transform -translate-y-1/2 w-5 h-5 text-emerald-500 z-10" />
          )}
          {fieldErrors.emailTo && (
            <XCircle className="absolute right-4 top-[45%] transform -translate-y-1/2 w-5 h-5 text-rose-500 z-10" />
          )}
        </motion.div>
        {fieldErrors.emailTo && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
          >
            <XCircle size={12} />
            {fieldErrors.emailTo}
          </motion.p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={`block text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            &nbsp;Email Subject <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
          </label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditingEmail(!isEditingEmail)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold ${isDark
              ? 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
              : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
              }`}
          >
            <EditIcon size={12} />
            {isEditingEmail ? 'Save' : 'Edit'}
          </motion.button>
        </div>
        {isEditingEmail ? (
          <div>
            <motion.div
              ref={fieldRefs.emailSubject}
              animate={shakeFields.includes('emailSubject') ? "shake" : "initial"}
              variants={shakeAnimation}
              className="overflow-visible relative"
            >
              <input
                type="text"
                name={`email_subject_${Math.random().toString(36).substring(7)}`}
                value={emailData.subject}
                onChange={(e) => {
                  let value = e.target.value.slice(0, 100);
                  value = value.replace(/[^A-Za-z0-9\s.,!?\-'"\/()&]/g, '');
                  setEmailData(prev => ({ ...prev, subject: value }));
                  if (fieldErrors.emailSubject) setFieldErrors(prev => ({ ...prev, emailSubject: '' }));
                }}
                onFocus={(e) => {
                  e.target.setAttribute('readonly', 'readonly');
                  setTimeout(() => {
                    e.target.removeAttribute('readonly');
                  }, 5);
                  e.target.setAttribute('autocomplete', 'off-' + Math.random().toString(36).substring(7));
                }}
                onMouseDown={(e) => {
                  e.target.setAttribute('readonly', 'readonly');
                  setTimeout(() => {
                    e.target.removeAttribute('readonly');
                  }, 5);
                }}
                onKeyPress={(e) => {
                  if (!/[A-Za-z0-9\s.,!?\-'"\/()&]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="Enter email subject..."
                maxLength={100}
                autoComplete="off"
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
                className={`w-full px-4 pr-14 py-2 sm:py-3 h-12 border-2 rounded-2xl text-sm font-medium
                  focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 ${isDark
                    ? `bg-gray-800 border-gray-600 text-white placeholder-gray-400 ${fieldErrors.emailSubject ? 'border-rose-500' : ''}`
                    : `bg-white border-gray-200 text-gray-900 ${fieldErrors.emailSubject ? 'border-rose-500' : ''}`
                  }`}
              />
              <div className={`absolute bottom-1 right-3 text-[10px] pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {emailData.subject.length}/100
              </div>
            </motion.div>
            {fieldErrors.emailSubject && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
              >
                <XCircle size={12} />
                {fieldErrors.emailSubject}
              </motion.p>
            )}
          </div>
        ) : (
          <div>
            <motion.div
              ref={fieldRefs.emailSubject}
              animate={shakeFields.includes('emailSubject') ? "shake" : "initial"}
              variants={shakeAnimation}
              className="overflow-visible relative"
            >
              <div className={`px-4 pr-14 py-2 sm:py-3 h-12 rounded-2xl border-2 ${fieldErrors.emailSubject ? 'border-rose-500' : isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <p className={`text-sm font-medium ${emailData.subject ? (isDark ? 'text-gray-300' : 'text-gray-700') : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
                  {emailData.subject || 'Enter email subject...'}
                </p>
              </div>
              <span className={`absolute bottom-1 right-3 text-[10px] pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {emailData.subject.length}/100
              </span>
            </motion.div>
            {fieldErrors.emailSubject && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
              >
                <XCircle size={12} />
                {fieldErrors.emailSubject}
              </motion.p>
            )}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={`block text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            &nbsp;Email Message <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
          </label>
        </div>
        {isEditingEmail ? (
          <div>
            <motion.div
              ref={fieldRefs.emailMessage}
              animate={shakeFields.includes('emailMessage') ? "shake" : "initial"}
              variants={shakeAnimation}
              className="overflow-visible relative"
            >
              <div className={`px-4 pr-16 py-4 rounded-2xl border-2 min-h-[150px] focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/20 transition-all overflow-hidden ${fieldErrors.emailMessage ? 'border-rose-500' : isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
                <textarea
                  value={emailData.message}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 1000);
                    setEmailData(prev => ({ ...prev, message: value }));
                    if (fieldErrors.emailMessage) setFieldErrors(prev => ({ ...prev, emailMessage: '' }));
                  }}
                  rows={Math.max(6, emailData.message.split('\n').length)}
                  maxLength={1000}
                  placeholder="Enter email message..."
                  className={`w-full px-0 py-0 border-0 text-sm font-medium resize-none bg-transparent scrollbar-hide
                  focus:outline-none ${isDark
                      ? `text-white placeholder-gray-400`
                      : `text-gray-900`
                    }`}
                />
              </div>
              <div className={`absolute bottom-1 right-3 text-[10px] pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {emailData.message.length}/1000
              </div>
            </motion.div>
            {fieldErrors.emailMessage && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
              >
                <XCircle size={12} />
                {fieldErrors.emailMessage}
              </motion.p>
            )}
          </div>
        ) : (
          <div>
            <motion.div
              ref={fieldRefs.emailMessage}
              animate={shakeFields.includes('emailMessage') ? "shake" : "initial"}
              variants={shakeAnimation}
              className="overflow-visible relative"
            >
              <div className={`px-4 pr-16 py-4 rounded-2xl border-2 min-h-[150px] ${fieldErrors.emailMessage ? 'border-rose-500' : isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className={`text-sm whitespace-pre-wrap font-medium ${emailData.message ? (isDark ? 'text-gray-300' : 'text-gray-700') : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
                  {emailData.message ? (
                    emailData.message.split('\n').map((line, i) => {
                      if (line.includes('KEY')) {
                        const parts = line.split('KEY');
                        return (
                          <span key={i}>
                            {parts[0]}
                            {pasteFieldValueEmail === invitationKey && invitationKey ? (
                              <span className="font-bold">{invitationKey}</span>
                            ) : (
                              <span className="font-bold text-gray-500">[{invitationType === 'login' ? 'PASSWORD' : 'CODE'}]</span>
                            )}
                            {parts.slice(1).join('KEY')}
                            <br />
                          </span>
                        );
                      }
                      return <span key={i}>{line}<br /></span>;
                    })
                  ) : (
                    <span>Enter email message content...</span>
                  )}
                </div>
              </div>
              <span className={`absolute bottom-1 right-3 text-[10px] pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {emailData.message.length}/1000
              </span>
            </motion.div>
            {fieldErrors.emailMessage && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
              >
                <XCircle size={12} />
                {fieldErrors.emailMessage}
              </motion.p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderSmsSection = () => (
    <div className="space-y-4">
      {/* Paste Invitation Code/Password Field for SMS Section */}
      <div ref={fieldRefs.pasteInvitationCodeSms}>
        <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          &nbsp;Paste {invitationType === 'login' ? 'Password' : 'Invitation Code'} <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
        </label>
        <motion.div
          animate={shakeFields.includes('pasteInvitationCodeSms') ? "shake" : "initial"}
          variants={shakeAnimation}
          className="overflow-visible relative"
        >
          <input
            id="paste-invite-input-sms"
            type="text"
            value={pasteFieldValueSms}
            onChange={(e) => {
              const maxLength = invitationType === 'login' ? 60 : 12;
              // For login mode, allow all characters; for signup, allow only alphanumeric
              const value = invitationType === 'login'
                ? e.target.value.slice(0, maxLength)
                : e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, maxLength);
              setPasteFieldValueSms(value);

              if (value !== invitationKey) {
                setPasteClipboardCopiedSms(false);
              }

              // Only show validation errors if the paste field has been activated
              if (!pasteFieldActivatedSms) {
                setFieldErrors(prev => ({ ...prev, pasteInvitationCodeSms: '' }));
                return;
              }

              const maxLen = invitationType === 'login' ? 60 : 12;
              if (!invitationKey) {
                setFieldErrors(prev => ({ ...prev, pasteInvitationCodeSms: '' }));
                setShakeFields(prev => prev.filter(f => f !== 'pasteInvitationCodeSms'));
              } else if (value.length < maxLen) {
                const fieldLabel = invitationType === 'login' ? 'Password is incomplete' : 'Code is incomplete';
                setFieldErrors(prev => ({ ...prev, pasteInvitationCodeSms: fieldLabel }));
                setShakeFields(prev => prev.filter(f => f !== 'pasteInvitationCodeSms'));
                setTimeout(() => {
                  setShakeFields(prev => prev.includes('pasteInvitationCodeSms') ? prev : [...prev, 'pasteInvitationCodeSms']);
                }, 0);
              } else if (value !== invitationKey) {
                const fieldLabel = invitationType === 'login' ? 'Invalid password' : 'Invalid code';
                setFieldErrors(prev => ({ ...prev, pasteInvitationCodeSms: fieldLabel }));
                setShakeFields(prev => prev.filter(f => f !== 'pasteInvitationCodeSms'));
                setTimeout(() => {
                  setShakeFields(prev => prev.includes('pasteInvitationCodeSms') ? prev : [...prev, 'pasteInvitationCodeSms']);
                }, 0);
              } else {
                setFieldErrors(prev => ({ ...prev, pasteInvitationCodeSms: '' }));
                setShakeFields(prev => prev.filter(f => f !== 'pasteInvitationCodeSms'));
              }
            }}
            placeholder={invitationType === 'login' ? "Paste admin password..." : "Enter invitation code..."}
            maxLength={invitationType === 'login' ? 60 : 12}
            autoComplete="off"
            className={`w-full pl-4 pr-12 py-2 sm:py-3 h-12 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
              ? `bg-gray-800 border-gray-600 text-white placeholder-gray-400 ${fieldErrors.pasteInvitationCodeSms ? 'border-rose-500' : ''}`
              : `bg-white border-gray-200 text-gray-900 placeholder-gray-500 ${fieldErrors.pasteInvitationCodeSms ? 'border-rose-500' : ''}`
              }`}
          />
          {(showClipboardIcon && invitationKey) && (
            <div
              className="absolute right-4 top-[45%] transform -translate-y-1/2 w-6 h-6 flex items-center justify-center"
              onMouseEnter={() => setIsHoveringPasteSms(true)}
              onMouseLeave={() => setIsHoveringPasteSms(false)}
            >
              <AnimatePresence>
                {(isHoveringPasteSms || pasteClipboardCopiedSms) && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute bottom-full mb-2 text-xs font-semibold whitespace-nowrap pointer-events-none bg-black text-white px-3 py-2 rounded-lg"
                  >
                    <span>{pasteClipboardCopiedSms ? 'Pasted!' : 'Paste'}</span>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-black"></div>
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                type="button"
                onClick={handlePasteInvitationCode}
                disabled={!invitationKey}
                className={`transition-colors ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}
              >
                {pasteClipboardCopiedSms ? (
                  <Check size={18} />
                ) : (
                  <Clipboard size={18} />
                )}
              </button>
            </div>
          )}
          <div className={`absolute bottom-1 right-3 text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {pasteFieldValueSms.length}/{invitationType === 'login' ? 60 : 12}
          </div>
        </motion.div>
        {pasteFieldValueSms.length === (invitationType === 'login' ? 60 : 12) && !fieldErrors.pasteInvitationCodeSms && invitationKey && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 flex items-center gap-1.5 px-1"
          >
            <CheckCircle
              size={12}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isDark ? "text-white" : "text-gray-700"}
            />
            <span className={`text-xs font-medium ${isDark ? "text-white" : "text-gray-700"}`}>
              {invitationType === 'login' ? 'Password is valid.' : 'Code is valid.'}
            </span>
          </motion.div>
        )}
        {fieldErrors.pasteInvitationCodeSms && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-1 text-xs font-medium mt-1 ${
              isDark ? 'text-rose-600' : 'text-rose-600'
            }`}
          >
            <XCircle size={12} className={isDark ? 'text-rose-600' : 'text-rose-600'} />
            {fieldErrors.pasteInvitationCodeSms}
          </motion.p>
        )}
      </div>

      {/* Recipient Phone Number Field - With static 🇮🇳 and +91 */}
      <div ref={fieldRefs.smsTo}>
        <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          &nbsp;Recipient Phone Number <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
        </label>
        <motion.div
          animate={shakeFields.includes('smsTo') ? "shake" : "initial"}
          variants={shakeAnimation}
          className="overflow-visible"
        >
          <div className="flex gap-2">
            <div className="flex-shrink-0">
              <div className={`h-12 flex items-center px-4 rounded-2xl border-2 text-sm font-medium ${fieldErrors.smsTo
                ? isDark ? 'border-rose-500 bg-gray-800' : 'border-rose-500 bg-white'
                : isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
                }`}>
                <div className={`flex items-center gap-2 ${smsData.to.length > 0
                  ? isDark ? 'text-white' : 'text-gray-900'
                  : isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  <span className="text-lg">🇮🇳</span>
                  <span className="text-sm font-semibold">+91</span>
                </div>
              </div>
            </div>

            <div className="flex-1 relative">
              <Phone className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10 ${isDark ? 'text-violet-400' : 'text-violet-500'}`} />
              <input
                type="tel"
                value={smsData.to}
                onChange={(e) => {
                  const formattedValue = formatPhoneNumberLive(e.target.value);
                  setSmsData(prev => ({ ...prev, to: formattedValue }));
                  if (fieldErrors.smsTo) setFieldErrors(prev => ({ ...prev, smsTo: '' }));
                }}
                placeholder="Enter recipient phone number..."
                autoComplete="off"
                className={`w-full pl-12 pr-12 py-2 sm:py-3 h-12 border-2 rounded-2xl text-sm font-medium
              focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20
              ${isDark
                    ? `bg-gray-800 border-gray-600 text-white placeholder-gray-400 ${fieldErrors.smsTo ? 'border-rose-500' : ''}`
                    : `bg-white border-gray-200 text-gray-900 placeholder-gray-500 ${fieldErrors.smsTo ? 'border-rose-500' : ''}`
                  }`}
              />
              <div className={`absolute bottom-1 right-3 text-[10px] ${fieldErrors.smsTo ? 'text-rose-500' : isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                {smsData.to.replace(/\D/g, '').length}/10
              </div>
              {smsData.to.replace(/\D/g, '').length === 10 && !fieldErrors.smsTo && (
                <CheckCircle className="absolute right-3 top-[45%] transform -translate-y-1/2 w-5 h-5 text-emerald-500 z-10" />
              )}
              {fieldErrors.smsTo && (
                <XCircle className="absolute right-3 top-[45%] transform -translate-y-1/2 w-5 h-5 text-rose-500 z-10" />
              )}
            </div>
          </div>
        </motion.div>
        {fieldErrors.smsTo && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
          >
            <XCircle size={12} />
            {fieldErrors.smsTo}
          </motion.p>
        )}
      </div>

      {/* SMS Message - Rest remains same */}
      <div ref={fieldRefs.smsMessage}>
        <div className="flex items-center justify-between mb-2">
          <label className={`block text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            &nbsp;SMS Message <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
          </label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditingSms(!isEditingSms)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold ${isDark
              ? 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
              : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
              }`}
          >
            <EditIcon size={12} />
            {isEditingSms ? 'Save' : 'Edit'}
          </motion.button>
        </div>
        {isEditingSms ? (
          <div>
            <motion.div
              animate={shakeFields.includes('smsMessage') ? "shake" : "initial"}
              variants={shakeAnimation}
              className="overflow-visible relative"
            >
              <div className={`px-4 pr-16 py-4 rounded-2xl border-2 min-h-[80px] focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/20 transition-all overflow-hidden ${fieldErrors.smsMessage ? 'border-rose-500' : isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
                <textarea
                  value={smsData.message}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 1000);
                    setSmsData(prev => ({ ...prev, message: value }));
                    if (fieldErrors.smsMessage) setFieldErrors(prev => ({ ...prev, smsMessage: '' }));
                  }}
                  rows={Math.max(3, smsData.message.split('\n').length)}
                  maxLength={1000}
                  placeholder="Enter SMS message..."
                  className={`w-full px-0 py-0 border-0 text-sm font-medium resize-none bg-transparent scrollbar-hide
                focus:outline-none ${isDark
                      ? `text-white placeholder-gray-400`
                      : `text-gray-900`
                    }`}
                />
              </div>
              <div className={`absolute bottom-1 right-3 text-[10px] pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {smsData.message.length}/1000
              </div>
            </motion.div>
            {fieldErrors.smsMessage && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
              >
                <XCircle size={12} />
                {fieldErrors.smsMessage}
              </motion.p>
            )}
          </div>
        ) : (
          <div>
            <motion.div
              animate={shakeFields.includes('smsMessage') ? "shake" : "initial"}
              variants={shakeAnimation}
              className="overflow-visible relative"
            >
              <div className={`px-4 pr-16 py-4 rounded-2xl border-2 min-h-[80px] ${fieldErrors.smsMessage ? 'border-rose-500' : isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className={`text-sm whitespace-pre-wrap font-medium ${smsData.message ? (isDark ? 'text-gray-300' : 'text-gray-700') : (isDark ? 'text-gray-500' : 'text-gray-400')}`}>
                  {smsData.message ? (
                    smsData.message.split('\n').map((line, i) => {
                      if (line.includes('KEY')) {
                        const parts = line.split('KEY');
                        return (
                          <span key={i}>
                            {parts[0]}
                            {pasteFieldValueSms === invitationKey && invitationKey ? (
                              <span className="font-bold">{invitationKey}</span>
                            ) : (
                              <span className="font-bold text-gray-500">[{invitationType === 'login' ? 'PASSWORD' : 'CODE'}]</span>
                            )}
                            {parts.slice(1).join('KEY')}
                            <br />
                          </span>
                        );
                      }
                      return <span key={i}>{line}<br /></span>;
                    })
                  ) : (
                    <span>Enter SMS message content...</span>
                  )}
                </div>
              </div>
              <span className={`absolute bottom-1 right-3 text-[10px] pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {smsData.message.length}/1000
              </span>
            </motion.div>
            {fieldErrors.smsMessage && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
              >
                <XCircle size={12} />
                {fieldErrors.smsMessage}
              </motion.p>
            )}
          </div>
        )}
      </div>
    </div>
  );

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
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, pointerEvents: 'none' }}
          transition={{ type: "spring", damping: 25 }}
          className={`rounded-3xl w-full max-w-2xl mx-2 sm:mx-4 ${isDark
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
          {/* Header */}
          <div className="relative p-4 sm:p-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">
                  {invitationType === 'login' ? `Login Invitation` : 'Sign-Up Invitation'}
                </h2>
                <p className="text-violet-100 text-xs sm:text-sm font-semibold truncate">
                  {invitationType === 'login'
                    ? `Send invitation to admin, send via Email or SMS`
                    : 'Send invitation to admin, send via Email or SMS'}
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

          {/* Body */}
          <div className="flex-1 overflow-y-auto" data-scroll="true">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Invitation Key Generation Section */}
              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className={`text-sm sm:text-base font-bold mb-3 sm:mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Key size={16} className="text-violet-500" />
                  {invitationType === 'login' ? 'Admin Password' : 'Invitation Code'} <span className="text-rose-500 font-normal normal-case">*</span>
                </h3>

                {/* Full width field container */}
                <div className="w-full overflow-visible mb-3">
                  <motion.div
                    ref={fieldRefs.invitationKey}
                    initial="initial"
                    animate={shakeFields.includes('invitationKey') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="relative"
                  >
                    <input
                      type="text"
                      value={invitationKey}
                      onChange={(e) => {
                        const maxLength = invitationType === 'login' ? 60 : 12;
                        // For login mode, allow all characters; for signup, allow only alphanumeric
                        const value = invitationType === 'login'
                          ? e.target.value.slice(0, maxLength)
                          : e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, maxLength);
                        setInvitationKey(value);

                        // Validation for both modes
                        if (invitationType === 'login') {
                          // For login mode, validate password in real-time
                          if (!originalPassword) {
                            setFieldErrors(prev => ({ ...prev, invitationKey: '' }));
                            setShakeFields(prev => prev.filter(f => f !== 'invitationKey'));
                            setShowGeneratedKey(false);
                            return;
                          }
                          if (value.length === 0) {
                            setFieldErrors(prev => ({ ...prev, invitationKey: '' }));
                            setShakeFields(prev => prev.filter(f => f !== 'invitationKey'));
                            setShowGeneratedKey(false);
                          } else if (value.length < 60) {
                            setFieldErrors(prev => ({ ...prev, invitationKey: 'Password is incomplete' }));
                            setShakeFields(prev => prev.filter(f => f !== 'invitationKey'));
                            setTimeout(() => {
                              setShakeFields(prev => prev.includes('invitationKey') ? prev : [...prev, 'invitationKey']);
                            }, 0);
                            setShowGeneratedKey(false);
                          } else if (value !== originalPassword) {
                            setFieldErrors(prev => ({ ...prev, invitationKey: 'Invalid password' }));
                            setShakeFields(prev => prev.filter(f => f !== 'invitationKey'));
                            setTimeout(() => {
                              setShakeFields(prev => prev.includes('invitationKey') ? prev : [...prev, 'invitationKey']);
                            }, 0);
                            setShowGeneratedKey(false);
                          } else {
                            setFieldErrors(prev => ({ ...prev, invitationKey: 'Password generated. Valid for 7 days.' }));
                            setShakeFields(prev => prev.filter(f => f !== 'invitationKey'));
                            setShowGeneratedKey(true);
                          }
                        } else {
                          // For signup mode, validate code
                          if (value === originalCode || value === '') {
                            setShowGeneratedKey(!!originalCode && value === originalCode);
                          } else {
                            setShowGeneratedKey(false);
                          }

                          if (!originalCode) {
                            setFieldErrors(prev => ({ ...prev, invitationKey: '' }));
                            setShakeFields(prev => prev.filter(f => f !== 'invitationKey'));
                            return;
                          }
                          if (value.length === 0) {
                            setFieldErrors(prev => ({ ...prev, invitationKey: '' }));
                            setShakeFields(prev => prev.filter(f => f !== 'invitationKey'));
                            setShowGeneratedKey(false);
                          } else if (value.length < 12) {
                            setFieldErrors(prev => ({ ...prev, invitationKey: 'Code is incomplete' }));
                            setShakeFields(prev => prev.filter(f => f !== 'invitationKey'));
                            setTimeout(() => {
                              setShakeFields(prev => prev.includes('invitationKey') ? prev : [...prev, 'invitationKey']);
                            }, 0);
                            setShowGeneratedKey(false);
                          } else if (value !== originalCode) {
                            setFieldErrors(prev => ({ ...prev, invitationKey: 'Invalid code' }));
                            setShakeFields(prev => prev.filter(f => f !== 'invitationKey'));
                            setTimeout(() => {
                              setShakeFields(prev => prev.includes('invitationKey') ? prev : [...prev, 'invitationKey']);
                            }, 0);
                            setShowGeneratedKey(false);
                          } else {
                            setFieldErrors(prev => ({ ...prev, invitationKey: 'Code generated. Valid for 7 days.' }));
                            setShakeFields(prev => prev.filter(f => f !== 'invitationKey'));
                            setShowGeneratedKey(true);
                          }
                        }
                      }}
                      placeholder={invitationType === 'login' ? "Generate admin password..." : "Generate invitation code..."}
                      maxLength={invitationType === 'login' ? 60 : 12}
                      autoComplete="off"
                      className={`w-full p-2 sm:p-3 h-12 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium transition-colors ${isDark
                        ? `bg-gray-800 border-gray-600 text-white placeholder-gray-400 ${fieldErrors.invitationKey && !fieldErrors.invitationKey.includes('generated') ? 'border-rose-500' : ''}`
                        : `bg-white border-gray-200 text-gray-900 placeholder-gray-500 ${fieldErrors.invitationKey && !fieldErrors.invitationKey.includes('generated') ? 'border-rose-500' : ''}`
                        }`}
                    />

                    {/* Show copy icon only when password/code is correct */}
                    {showGeneratedKey && invitationKey && (
                      <div
                        className="absolute right-4 top-[45%] transform -translate-y-1/2 w-6 h-6 flex items-center justify-center"
                        onMouseEnter={() => setIsHoveringCopy(true)}
                        onMouseLeave={() => setIsHoveringCopy(false)}
                      >
                        <AnimatePresence>
                          {(isHoveringCopy || copied) && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              className="absolute bottom-full mb-2 text-xs font-semibold whitespace-nowrap pointer-events-none bg-black text-white px-3 py-2 rounded-lg"
                            >
                              {copied ? 'Copied!' : 'Copy'}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-black"></div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <button
                          onClick={copyInvitationKey}
                          className={`transition-colors ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                            }`}
                        >
                          {copied ? (
                            <Check size={18} />
                          ) : (
                            <Copy size={18} />
                          )}
                        </button>
                      </div>
                    )}

                    <div
                      className={`absolute bottom-1 right-3 text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                      {invitationKey.length}/{invitationType === 'login' ? 60 : 12}
                    </div>
                  </motion.div>
                </div>

                {/* Message and Button Row - message on left, button on right */}
                <div className="flex items-start gap-3 w-full">
                  {/* Message area on the left - grows to fill space */}
                  <div className="flex-1 overflow-visible flex flex-col justify-start">
                    {fieldErrors.invitationKey && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center gap-1 text-xs font-medium -mt-2 ${
                          fieldErrors.invitationKey.includes('generated')
                            ? isDark ? 'text-white' : 'text-gray-700'
                            : isDark ? 'text-rose-600' : 'text-rose-600'
                        }`}
                      >
                        {fieldErrors.invitationKey.includes('generated') ? (
                          <CheckCircle
                            size={12}
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={isDark ? "text-white" : "text-gray-700"}
                          />
                        ) : (
                          <XCircle size={12} className={isDark ? 'text-rose-600' : 'text-rose-600'} />
                        )}
                        {fieldErrors.invitationKey}
                      </motion.p>
                    )}
                  </div>

                  {/* Button on the right - fixed size, never moves */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateInvitationKey}
                    className="px-4 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xl whitespace-nowrap focus:outline-none active:outline-none flex-shrink-0"
                    style={{ outline: 'none' }}
                  >
                    <RefreshCw size={16} />
                    {invitationType === 'login' ? 'Generate Password' : 'Generate Code'}
                  </motion.button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className={`p-3 sm:p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                {/* Tab Buttons */}
                <div className={`flex rounded-2xl p-1 mb-4 ${isDark ? 'bg-gray-800' : 'bg-gradient-to-r from-violet-50 to-fuchsia-50'} border ${isDark ? 'border-gray-700' : 'border-violet-100'}`}>
                  {[
                    { id: 'email', label: 'Email Invitation', icon: Mail },
                    { id: 'sms', label: 'SMS Invitation', icon: Smartphone }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 text-sm font-semibold ${activeTab === tab.id
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                        : isDark
                          ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
                        }`}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </motion.button>
                  ))}
                </div>
                <div>
                  {activeTab === 'email' ? renderEmailSection() : renderSmsSection()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 pt-2 flex-nowrap">
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
                  type="button"
                  onClick={activeTab === 'email' ? handleSendEmail : handleSendSms}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 min-w-[100px] px-3 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xl transition-all bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                >
                  <Send size={16} />
                  Send Invitation
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* In the confirmation dialog JSX, update the message prop */}
      <AnimatePresence>
        {showConfirmationDialog && (
          <ConfirmationDialog
            isDark={isDark}
            title={`Confirm ${pendingInvitation?.type === 'email' ? 'Email' : 'SMS'} Invitation`}
            message={`Are you sure you want to send the invitation ${pendingInvitation?.type === 'email'
              ? `to ${pendingInvitation?.to}`
              : `to ${formatPhoneNumber(pendingInvitation?.to)}`
              }?`}
            onConfirm={confirmAndSendInvitation}
            onCancel={() => {
              setShowConfirmationDialog(false);
              setPendingInvitation(null);
            }}
            confirmText="Send"
            cancelText="Cancel"
          />
        )}
      </AnimatePresence>
    </>
  );
};

const AdminsManagement = ({ isDark }) => {
  const [admins, setAdmins] = useState(adminsData.map(admin => ({
    ...admin,
    status: admin.status || 'Unknown',
    isFromMockData: true,
    addedByCurrentAdmin: false
  })));
  const [searchTerm, setSearchTerm] = useState('');
  const filterButtonRef = useRef(null);
  const [showFilterGlow, setShowFilterGlow] = useState(false);
  const [searchMethod, setSearchMethod] = useState('');
  const [dateOfBirthRange, setDateOfBirthRange] = useState({ start: '', end: '' });
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [adminToApprove, setAdminToApprove] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const scrollPosition = useRef(0);

  const statusOptions = [
    'All Status',
    'Pending',
    'Approved',
    'Rejected'
  ];

  const searchMethods = [
    'Search by...',
    'Full Name',
    'Email',
    'Phone',
    'Date of Birth',
    'WhatsApp Number',
    'Gender',
    'Marital Status',
    'Nationality',
    'Department',
    'Designation',
    'Address',
    'Bio'
  ];

  const roleOptions = [
    'All Roles',
    'super_admin',
    'approver',
    'co_approver',
    'support'
  ];

  const departmentOptions = [
    'All Departments',
    'Management',
    'Verification',
    'Support',
    'Customer Support',
    'Finance',
    'IT'
  ];

  // Simplified to directly open approval modal for status changes

  const handleApproveAdmin = useCallback((admin) => {
    // In the new system, any admin can be approved
    setAdminToApprove(admin);
    setShowApprovalModal(true);
  }, []);

  const handleApprovalSubmit = useCallback((adminId, approvalData) => {
    const { approvalType, reason, comment } = approvalData;

    setAdmins(prev => prev.map(admin => {
      if (admin.id === adminId) {
        const previousStatus = admin.status;
        let newStatus = admin.status;
        let actionReason = reason || comment || (approvalType === 'approve' ? 'Approval approved' : 'Approval rejected');

        if (approvalType === 'approve') {
          newStatus = 'Approved';
        } else if (approvalType === 'reject') {
          newStatus = 'Rejected';
        }

        const updatedAdmin = {
          ...admin,
          approvalHistory: [
            ...(admin.approvalHistory || []),
            {
              id: Date.now(),
              comment: reason || comment || (approvalType === 'approve' ? 'Approved' : 'Rejected'),
              timestamp: new Date().toISOString(),
              approvedBy: 'Current User',
              type: approvalType === 'approve' ? 'approval' : 'rejection'
            }
          ]
        };

        // Add status history if status changes
        if (newStatus !== previousStatus) {
          updatedAdmin.statusHistory = [
            ...(admin.statusHistory || []),
            {
              fromStatus: previousStatus,
              toStatus: newStatus,
              changedBy: 'Current User',
              timestamp: new Date().toISOString(),
              reason: actionReason
            }
          ];
        }

        updatedAdmin.status = newStatus;
        return updatedAdmin;
      }
      return admin;
    }));

    setShowApprovalModal(false);
    setAdminToApprove(null);
    setSuccessMessage(`Admin ${approvalType === 'approve' ? 'approved' : 'rejected'} successfully!`);
    setShowSuccessDialog(true);
  }, []);

  useEffect(() => {
    const allAdminsApproved = admins.length > 0 && admins.every(admin => admin.status === 'Approved');

    if (allAdminsApproved) {
      console.log('All admins are approved - overall status is Closed');
    }
  }, [admins]);

  useEffect(() => {
    if (!showFilters) return;

    const handleClickInsideFilters = (event) => {
      const filtersContainer = document.querySelector('.filters-container');
      if (filtersContainer && filtersContainer.contains(event.target)) {
        setShowFilterGlow(false);
      }

      if (filtersContainer &&
        !filtersContainer.contains(event.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target)) {
        setShowFilterGlow(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickInsideFilters);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickInsideFilters);
    };
  }, [showFilters]);

  useEffect(() => {
    if (showFilters || !showFilterGlow) return;

    const handleClickToHideGlow = () => {
      setShowFilterGlow(false);
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickToHideGlow);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickToHideGlow);
    };
  }, [showFilters, showFilterGlow]);

  useEffect(() => {
    const isAnyModalOpen =
      showAddAdminModal || showAdminModal || showApprovalModal || showDeleteDialog || showSuccessDialog || showInviteModal;

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
  }, [showAddAdminModal, showAdminModal, showApprovalModal, showDeleteDialog, showSuccessDialog, showInviteModal]);

  const filteredAdmins = useMemo(() => {
    return admins.filter(admin => {
      let matchesSearch = true;

      // Handle Date of Birth search separately since it doesn't use searchTerm
      if (searchMethod === 'Date of Birth') {
        const adminDOB = admin.dateOfBirth; // Format: 'YYYY-MM-DD'
        matchesSearch =
          (!dateOfBirthRange.start || adminDOB >= dateOfBirthRange.start) &&
          (!dateOfBirthRange.end || adminDOB <= dateOfBirthRange.end);
      } else if (searchMethod !== '' && searchTerm.trim() !== '') {
        // If search method is selected and search term is not empty, apply method-specific search
        const term = searchTerm.toLowerCase().trim();

        switch (searchMethod) {
          case 'Full Name':
            matchesSearch = admin.fullName.toLowerCase().includes(term);
            break;
          case 'Email':
            matchesSearch = admin.email.toLowerCase().includes(term);
            break;
          case 'Phone':
            matchesSearch = admin.phone.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, ''));
            break;
          case 'WhatsApp Number':
            matchesSearch = admin.whatsappNumber.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, ''));
            break;
          case 'Gender':
            // Exact match for gender field
            matchesSearch = admin.gender.toLowerCase() === term;
            break;
          case 'Marital Status':
            // Exact match for marital status field
            matchesSearch = admin.maritalStatus.toLowerCase() === term;
            break;
          case 'Nationality':
            // Partial match but case-insensitive for nationality
            matchesSearch = admin.nationality.toLowerCase().includes(term);
            break;
          case 'Department':
            // Exact match for department field
            matchesSearch = admin.department.toLowerCase() === term;
            break;
          case 'Designation':
            // Exact match for designation field to avoid Co-Approver appearing when searching Approver
            matchesSearch = admin.designation.toLowerCase() === term;
            break;
          case 'Address':
            matchesSearch = admin.address.toLowerCase().includes(term);
            break;
          case 'Bio':
            matchesSearch = admin.bio.toLowerCase().includes(term);
            break;
          default:
            matchesSearch = true;
        }
      } else if (searchMethod === '' && searchTerm.trim() !== '') {
        // Default search behavior when no specific method is selected
        const term = searchTerm.toLowerCase().trim();
        matchesSearch =
          admin.fullName.toLowerCase().includes(term) ||
          admin.email.toLowerCase().includes(term) ||
          admin.phone.includes(searchTerm) ||
          admin.id.toLowerCase().includes(term) ||
          admin.department.toLowerCase().includes(term) ||
          admin.designation.toLowerCase().includes(term);
      }

      const matchesStatus = selectedStatus === '' || admin.status === selectedStatus;
      const matchesRole = selectedRole === '' || admin.role === selectedRole;
      const matchesDepartment = selectedDepartment === 'All Departments' || admin.department === selectedDepartment;

      const matchesDateRange =
        (!dateRange.start || admin.createdAt >= dateRange.start) &&
        (!dateRange.end || admin.createdAt <= dateRange.end);

      return matchesSearch && matchesStatus && matchesRole && matchesDepartment && matchesDateRange;
    });
  }, [admins, searchTerm, searchMethod, dateOfBirthRange, selectedStatus, selectedRole, selectedDepartment, dateRange]);

  const paginatedAdmins = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAdmins.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAdmins, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchMethod, dateOfBirthRange, selectedStatus, selectedRole, selectedDepartment, dateRange]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const stats = useMemo(() => {
    const totalAdmins = admins.length;
    const approvedAdmins = admins.filter(a => a.status === 'Approved').length;
    const pendingAdmins = admins.filter(a => a.status === 'Pending').length;
    const rejectedAdmins = admins.filter(a => a.status === 'Rejected').length;
    const superAdmins = admins.filter(a => a.role === 'super_admin').length;
    const approvers = admins.filter(a => a.role === 'approver').length;
    const coApprovers = admins.filter(a => a.role === 'co_approver').length;
    const supportAdmins = admins.filter(a => a.role === 'support').length;

    return {
      totalAdmins,
      approvedAdmins,
      pendingAdmins,
      rejectedAdmins,
      superAdmins,
      approvers,
      coApprovers,
      supportAdmins
    };
  }, [admins]);

  const handleViewAdmin = useCallback((admin) => {
    setSelectedAdmin(admin);
    setShowAdminModal(true);
  }, []);

  const handleEditAdmin = useCallback((admin) => {
    setEditingAdmin(admin);
    setShowAddAdminModal(true);
  }, []);

  const handleAddAdmin = useCallback((newAdmin) => {
    const adminWithTracking = {
      ...newAdmin,
      isFromMockData: false,
      addedByCurrentAdmin: true
    };
    setAdmins(prev => [adminWithTracking, ...prev]);
  }, []);

  const handleUpdateAdmin = useCallback((updatedAdmin) => {
    setAdmins(prev => prev.map(admin =>
      admin.id === updatedAdmin.id ? updatedAdmin : admin
    ));
    setEditingAdmin(null);
  }, []);

  const handleDeleteAdmin = useCallback((admin) => {
    setAdminToDelete(admin);
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (adminToDelete) {
      setAdmins(prev => prev.filter(admin => admin.id !== adminToDelete.id));
      setShowDeleteDialog(false);
      setAdminToDelete(null);
      setSuccessMessage('Admin deleted successfully');
      setShowSuccessDialog(true);
    }
  }, [adminToDelete]);

  // Forward functionality removed - no longer needed

  const handleExportExcel = useCallback(() => {
    const data = filteredAdmins.map(admin => ({
      ID: admin.id,
      Name: admin.fullName,
      Email: admin.email,
      Phone: admin.phone,
      'WhatsApp': admin.whatsappNumber,
      Gender: admin.gender,
      'Marital Status': admin.maritalStatus,
      Nationality: admin.nationality,
      Department: admin.department,
      Designation: admin.designation,
      Address: admin.address,
      Bio: admin.bio,
      Status: admin.status,
      Role: admin.role,
      'Created At': admin.createdAt,
      'Last Active': admin.lastActive,
      'Profile Completion': `${admin.profileCompletion}%`
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
    link.setAttribute('download', `admins_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredAdmins]);

  const handleExportPDF = useCallback(() => {
    const printContent = `
        <html>
          <head>
            <title>Admins Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; text-align: center; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; }
              .summary { margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 5px; }
            </style>
          </head>
          <body>
            <h1>Admins Management Report</h1>
            <div class="summary">
              <strong>Generated on:</strong> ${new Date().toLocaleDateString()}<br>
              <strong>Total Admins:</strong> ${filteredAdmins.length}<br>
              <strong>Active Admins:</strong> ${stats.approvedAdmins}<br>
              <strong>Pending Validation:</strong> ${stats.pendingAdmins}
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${filteredAdmins.map(admin => `
                  <tr>
                    <td>${admin.id}</td>
                    <td>${admin.fullName}</td>
                    <td>${admin.email}</td>
                    <td>${admin.phone}</td>
                    <td>${admin.department}</td>
                    <td>${admin.designation}</td>
                    <td>${admin.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }, [filteredAdmins, stats]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setSearchMethod('');
    setDateOfBirthRange({ start: '', end: '' });
    setSelectedStatus('');
    setSelectedRole('');
    setSelectedDepartment('All Departments');
    setDateRange({ start: '', end: '' });
    setFieldErrors({});
    setShakeFields([]);
    setShowFilterGlow(false);

    setTimeout(() => {
      const startDateInput = document.querySelectorAll('.date-input-filter input[type="date"]')[0];
      const endDateInput = document.querySelectorAll('.date-input-filter input[type="date"]')[1];

      if (startDateInput) {
        startDateInput.value = '';
        const changeEvent = new Event('change', { bubbles: true });
        startDateInput.dispatchEvent(changeEvent);
      }

      if (endDateInput) {
        endDateInput.value = '';
        const changeEvent = new Event('change', { bubbles: true });
        endDateInput.dispatchEvent(changeEvent);
      }
    }, 0);
  }, []);

  const closeModals = useCallback(() => {
    setShowAdminModal(false);
    setShowAddAdminModal(false);
    setEditingAdmin(null);
    setSelectedAdmin(null);
  }, []);

  return (
    <>
      <div className="space-y-4 sm:space-y-6 md:space-y-8 px-3 sm:px-4">
        {/* Header Section with Add Button */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedAdmin(null);
                setShowInviteModal(true);
              }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-xl w-full sm:w-auto"
            >
              <Key size={16} />
              <span className="truncate">Invite Admin</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddAdminModal(true)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-xl w-full sm:w-auto"
            >
              <UserPlus size={16} />
              <span className="truncate">Add New Admin</span>
            </motion.button>

            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportExcel}
                className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-xl flex-1 sm:flex-none"
              >
                <Download size={16} />
                <span className="truncate">Excel</span>
              </motion.button>
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
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          <EnhancedStatCard
            icon={Users}
            title="Total Admins"
            value={stats.totalAdmins}
            fullNumber={getFullFormattedNumber(stats.totalAdmins)}
            change={8.3}
            changeType="increase"
            color="from-blue-500 to-blue-600"
            delay={0.1}
            isDark={isDark}
          />
          <EnhancedStatCard
            icon={CheckCircle}
            title="Approved"
            value={stats.approvedAdmins}
            fullNumber={getFullFormattedNumber(stats.approvedAdmins)}
            change={12.5}
            changeType="increase"
            color="from-emerald-500 to-green-500"
            delay={0.2}
            isDark={isDark}
          />
          <EnhancedStatCard
            icon={Clock}
            title="Pending"
            value={stats.pendingAdmins}
            fullNumber={getFullFormattedNumber(stats.pendingAdmins)}
            change={5.2}
            changeType="increase"
            color="from-amber-500 to-orange-500"
            delay={0.3}
            isDark={isDark}
          />
          <EnhancedStatCard
            icon={XCircle}
            title="Rejected"
            value={stats.rejectedAdmins}
            fullNumber={getFullFormattedNumber(stats.rejectedAdmins)}
            change={3.7}
            changeType="decrease"
            color="from-rose-500 to-red-500"
            delay={0.4}
            isDark={isDark}
          />
        </motion.div>

        {/* Search and Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 ${isDark
            ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-white via-white to-gray-50'
            }`}
          style={{
            boxShadow: isDark
              ? '0 10px 40px rgba(0, 0, 0, 0.3)'
              : '0 10px 40px rgba(0, 0, 0, 0.08)',
            overflow: 'visible',
            position: 'relative',
            zIndex: 30
          }}
        >
          {/* Hidden fields to trick browser autofill for search */}
          <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, pointerEvents: 'none' }}>
            <input type="email" name="fake_search_email" autoComplete="email" />
            <input type="text" name="fake_search_name" autoComplete="name" />
            <input type="text" name="fake_search_username" autoComplete="username" />
            <input type="tel" name="fake_search_tel" autoComplete="tel" />
            <input type="text" name="fake_search_address" autoComplete="street-address" />
          </div>

          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Search Input Field */}
            <div className="flex-1 relative">
              {searchMethod === 'Date of Birth' ? (
                // Date range input for Date of Birth - matching Filters button height
                <div className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <motion.div
                      animate={{}}
                      className="date-input-modal relative"
                    >
                      <input
                        type="date"
                        value={dateOfBirthRange.start}
                        onChange={(e) => setDateOfBirthRange(prev => ({ ...prev, start: e.target.value }))}
                        className={`w-full pl-3 sm:pl-4 pr-10 py-2.5 sm:py-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium transition-all ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        style={{
                          color: dateOfBirthRange.start ? '' : (isDark ? '#9CA3AF' : '#6B7280'),
                        }}
                      />
                      <Calendar
                        size={18}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110"
                        onClick={() => {
                          const startInput = document.querySelectorAll('.date-input-modal input[type="date"]')[0];
                          if (startInput) {
                            if (startInput.showPicker) {
                              startInput.showPicker();
                            } else {
                              startInput.focus();
                              startInput.click();
                            }
                          }
                        }}
                        style={{
                          zIndex: 10,
                          color: dateOfBirthRange.start
                            ? (isDark ? '#FFFFFF' : '#1F2937')
                            : (isDark ? '#9CA3AF' : '#6B7280'),
                          filter: 'none',
                          pointerEvents: 'auto'
                        }}
                      />
                    </motion.div>
                  </div>
                  <div className="flex-shrink-0 text-gray-500 font-semibold">-</div>
                  <div className="flex-1 relative">
                    <motion.div
                      animate={{}}
                      className="date-input-modal relative"
                    >
                      <input
                        type="date"
                        value={dateOfBirthRange.end}
                        onChange={(e) => setDateOfBirthRange(prev => ({ ...prev, end: e.target.value }))}
                        className={`w-full pl-3 sm:pl-4 pr-10 py-2.5 sm:py-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium transition-all ${isDark
                          ? 'bg-gray-800 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                          }`}
                        style={{
                          color: dateOfBirthRange.end ? '' : (isDark ? '#9CA3AF' : '#6B7280'),
                        }}
                      />
                      <Calendar
                        size={18}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110"
                        onClick={() => {
                          const endInput = document.querySelectorAll('.date-input-modal input[type="date"]')[1];
                          if (endInput) {
                            if (endInput.showPicker) {
                              endInput.showPicker();
                            } else {
                              endInput.focus();
                              endInput.click();
                            }
                          }
                        }}
                        style={{
                          zIndex: 10,
                          color: dateOfBirthRange.end
                            ? (isDark ? '#FFFFFF' : '#1F2937')
                            : (isDark ? '#9CA3AF' : '#6B7280'),
                          filter: 'none',
                          pointerEvents: 'auto'
                        }}
                      />
                    </motion.div>
                  </div>
                </div>
              ) : searchMethod === 'Phone' || searchMethod === 'WhatsApp Number' ? (
                // Phone number input with +91 prefix - matching modal style
                <div className="flex gap-2 sm:gap-1 items-stretch h-fit">
                  <div className="flex-shrink-0">
                    <div className={`h-full flex items-center px-3 rounded-2xl border-2 text-sm font-medium ${isDark
                      ? 'bg-gray-800 border-gray-600'
                      : 'bg-white border-gray-200'
                      }`}>
                      <div className={`flex items-center gap-2 ${searchTerm && searchTerm.replace(/\D/g, '').length > 0
                        ? (isDark ? 'text-white' : 'text-gray-900')
                        : (isDark ? 'text-gray-400' : 'text-gray-500')
                        }`}>
                        <span className="text-lg">🇮🇳</span>
                        <span className="text-sm font-semibold">+91</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-violet-500" size={18} />
                    <input
                      type="tel"
                      name={`search_phone_${Date.now()}_${Math.random().toString(36).substring(7)}`}
                      placeholder={`Search by phone...`}
                      value={searchTerm}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^\d\-]/g, '');
                        const formatPhoneNumber = (digits) => {
                          if (!digits) return '';
                          const digitsOnly = digits.replace(/\D/g, '');
                          const limitedDigits = digitsOnly.slice(0, 10);
                          if (limitedDigits.length <= 3) {
                            return limitedDigits;
                          } else if (limitedDigits.length <= 6) {
                            return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3)}`;
                          } else {
                            return `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6, 10)}`;
                          }
                        };
                        setSearchTerm(formatPhoneNumber(value));
                      }}
                      maxLength={12}
                      autoComplete="off"
                      spellCheck="false"
                      data-lpignore="true"
                      data-1p-ignore="true"
                      data-form-type="other"
                      aria-label="Phone Search"
                      aria-autocomplete="none"
                      readOnly
                      onFocus={(e) => {
                        e.target.removeAttribute('readonly');
                        e.target.setAttribute('autocomplete', 'off-' + Math.random().toString(36).substring(7));
                      }}
                      onMouseDown={(e) => {
                        e.target.setAttribute('readonly', 'readonly');
                        setTimeout(() => e.target.removeAttribute('readonly'), 5);
                      }}
                      className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                        }`}
                    />
                    <div className={`absolute bottom-1 right-3 text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                      {searchTerm.replace(/\D/g, '').length}/10
                    </div>
                  </div>
                </div>
              ) : (
                // Regular text input for other search methods
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative"
                >
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-violet-500" size={18} />
                  <input
                    type="text"
                    name={`search_${Date.now()}_${Math.random().toString(36).substring(7)}`}
                    placeholder={
                      searchMethod === ''
                        ? 'Search admins by name, email, phone, ID, department, or designation...'
                        : `Search by ${searchMethod.toLowerCase()}...`
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoComplete="off"
                    spellCheck="false"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-form-type="other"
                    aria-label="Search"
                    aria-autocomplete="none"
                    readOnly
                    onFocus={(e) => {
                      e.target.removeAttribute('readonly');
                      e.target.setAttribute('autocomplete', 'off-' + Math.random().toString(36).substring(7));
                    }}
                    onMouseDown={(e) => {
                      e.target.setAttribute('readonly', 'readonly');
                      setTimeout(() => e.target.removeAttribute('readonly'), 5);
                    }}
                    className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium transition-all ${isDark
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                      }`}
                  />
                  {(['Full Name', 'Email', 'Bio', 'Address', 'Nationality', 'Gender', 'Marital Status', 'Department', 'Designation'].includes(searchMethod)) && (
                    <div className={`absolute bottom-1 right-3 text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                      {searchTerm.length}/100
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Search Method Selector */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-full sm:w-56 relative"
              style={{ zIndex: 50, position: 'relative', overflow: 'visible' }}
            >
              <CustomSelectDropdown
                value={searchMethod}
                onChange={(e) => {
                  setSearchMethod(e.target.value);
                  setSearchTerm('');
                  setDateOfBirthRange({ start: '', end: '' });
                }}
                isDark={isDark}
                fieldError={null}
                shakeFields={[]}
                fieldName="searchMethod"
                options={searchMethods.filter(method => method !== 'Search by...').map(method => ({
                  value: method,
                  label: method
                }))}
                placeholder="Search by..."
              />
            </motion.div>

            <motion.button
              ref={filterButtonRef}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowFilters(!showFilters);
                setShowFilterGlow(true);
              }}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${showFilterGlow
                ? isDark
                  ? 'border-violet-500 bg-gray-800 text-white ring-4 ring-violet-500/30'
                  : 'border-violet-500 bg-white text-gray-900 ring-4 ring-violet-500/30'
                : isDark
                  ? 'bg-gray-800 border-gray-600 text-white hover:border-gray-500'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
            >
              <Filter
                size={16}
                style={{
                  color: showFilters
                    ? (isDark ? '#FFFFFF' : '#231827')
                    : (isDark ? '#9CA3AF' : '#6B7280')
                }}
              />
              <span className="hidden xs:inline">Filters</span>
              {showFilters ? (
                <ChevronUp
                  size={16}
                  style={{
                    color: showFilters
                      ? (isDark ? '#FFFFFF' : '#231827')
                      : (isDark ? '#9CA3AF' : '#6B7280')
                  }}
                />
              ) : (
                <ChevronDown
                  size={16}
                  style={{
                    color: showFilters
                      ? (isDark ? '#FFFFFF' : '#231827')
                      : (isDark ? '#9CA3AF' : '#6B7280')
                  }}
                />
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-visible filters-container"
                style={{ overflow: 'visible', position: 'relative', zIndex: 10 }}
              >
                <div className={`p-4 sm:p-6 rounded-2xl mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`} style={{ overflow: 'visible', position: 'relative', zIndex: 1 }}>
                  {/* Row 1: Status and Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4" style={{ overflow: 'visible', position: 'relative' }}>
                    <div style={{ zIndex: 30, position: 'relative', overflow: 'visible' }}>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Status
                      </label>
                      <CustomSelectDropdown
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        isDark={isDark}
                        fieldError={null}
                        shakeFields={[]}
                        fieldName="selectedStatus"
                        options={statusOptions.filter(option => option !== 'All Status').map(option => ({
                          value: option,
                          label: option
                        }))}
                        placeholder="All Status"
                      />
                    </div>

                    <div style={{ zIndex: 20, position: 'relative', overflow: 'visible' }}>
                      <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Role
                      </label>
                      <CustomSelectDropdown
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        isDark={isDark}
                        fieldError={null}
                        shakeFields={[]}
                        fieldName="selectedRole"
                        options={roleOptions.filter(option => option !== 'All Roles').map(option => ({
                          value: option,
                          label: option === 'All Roles' ? option : option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                        }))}
                        placeholder="All Roles"
                      />
                    </div>
                  </div>

                  <div className="mb-4" style={{ overflow: 'visible' }}>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Date Range
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" style={{ overflow: 'visible' }}>
                      {/* Start Date */}
                      <div style={{ zIndex: 10, position: 'relative', overflow: 'visible' }}>
                        <div className="date-input-filter relative">
                          <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              if (!newValue) {
                                setDateRange(prev => ({ ...prev, start: '' }));
                                setFieldErrors(prev => ({ ...prev, startDate: '' }));
                                setShakeFields(prev => prev.filter(f => f !== 'startDate'));
                                return;
                              }
                              const date = new Date(newValue);
                              const isValid = !isNaN(date.getTime());
                              if (isValid) {
                                const [year, month, day] = newValue.split('-').map(Number);
                                const isValidDate = year > 1900 && year < 2100 &&
                                  month >= 1 && month <= 12 &&
                                  day >= 1 && day <= 31;

                                if (isValidDate) {
                                  setDateRange(prev => ({ ...prev, start: newValue }));
                                  setFieldErrors(prev => ({ ...prev, startDate: '' }));
                                  setShakeFields(prev => prev.filter(f => f !== 'startDate'));
                                } else {
                                  setFieldErrors(prev => ({ ...prev, startDate: 'Please enter a valid date' }));
                                  setShakeFields(prev => [...prev, 'startDate']);
                                  setTimeout(() => setShakeFields(prev => prev.filter(f => f !== 'startDate')), 600);
                                }
                              } else {
                                setFieldErrors(prev => ({ ...prev, startDate: 'Please enter a valid date' }));
                                setShakeFields(prev => [...prev, 'startDate']);
                                setTimeout(() => setShakeFields(prev => prev.filter(f => f !== 'startDate')), 600);
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value) {
                                const [year, month, day] = value.split('-').map(Number);
                                const isValidDate = !isNaN(year) && !isNaN(month) && !isNaN(day) &&
                                  year > 1900 && year < 2100 &&
                                  month >= 1 && month <= 12 &&
                                  day >= 1 && day <= 31;
                                if (!isValidDate) {
                                  setFieldErrors(prev => ({ ...prev, startDate: 'Please enter a valid date' }));
                                  setShakeFields(prev => [...prev, 'startDate']);
                                  setTimeout(() => setShakeFields(prev => prev.filter(f => f !== 'startDate')), 600);
                                }
                              }
                            }}
                            autoComplete="off"
                            className={`w-full p-2.5 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium pr-9 transition-all ${isDark
                              ? 'bg-gray-800 border-gray-600'
                              : 'bg-white border-gray-200'
                              } ${fieldErrors?.startDate ? 'border-rose-500' : ''}`}
                            style={{
                              color: dateRange.start ? (isDark ? '#FFFFFF' : '#1F2937') : (isDark ? '#9CA3AF' : '#6B7280'),
                            }}
                          />
                          <Calendar
                            size={18}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-200 cursor-pointer hover:scale-110"
                            onClick={() => {
                              const dateInputs = document.querySelectorAll('.date-input-filter input[type="date"]');
                              if (dateInputs && dateInputs[0]) {
                                const input = dateInputs[0];
                                if (input.showPicker) {
                                  input.showPicker();
                                } else {
                                  input.focus();
                                  input.click();
                                }
                              }
                            }}
                            style={{
                              zIndex: 10,
                              color: dateRange.start
                                ? (isDark ? '#FFFFFF' : '#1F2937')
                                : (isDark ? '#9CA3AF' : '#6B7280'),
                              filter: 'none',
                              pointerEvents: 'auto'
                            }}
                          />
                        </div>
                        {fieldErrors?.startDate && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                          >
                            <XCircle size={12} />
                            {fieldErrors.startDate}
                          </motion.p>
                        )}
                      </div>

                      {/* End Date */}
                      <div style={{ zIndex: 5, position: 'relative', overflow: 'visible' }}>
                        <div className="date-input-filter relative">
                          <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              if (!newValue) {
                                setDateRange(prev => ({ ...prev, end: '' }));
                                setFieldErrors(prev => ({ ...prev, endDate: '' }));
                                setShakeFields(prev => prev.filter(f => f !== 'endDate'));
                                return;
                              }
                              const date = new Date(newValue);
                              const isValid = !isNaN(date.getTime());
                              if (isValid) {
                                const [year, month, day] = newValue.split('-').map(Number);
                                const isValidDate = year > 1900 && year < 2100 &&
                                  month >= 1 && month <= 12 &&
                                  day >= 1 && day <= 31;

                                if (isValidDate) {
                                  if (dateRange.start && newValue < dateRange.start) {
                                    setFieldErrors(prev => ({ ...prev, endDate: 'End date cannot be before start date' }));
                                    setShakeFields(prev => [...prev, 'endDate']);
                                    setTimeout(() => setShakeFields(prev => prev.filter(f => f !== 'endDate')), 600);
                                    return;
                                  }
                                  setDateRange(prev => ({ ...prev, end: newValue }));
                                  setFieldErrors(prev => ({ ...prev, endDate: '' }));
                                  setShakeFields(prev => prev.filter(f => f !== 'endDate'));
                                } else {
                                  setFieldErrors(prev => ({ ...prev, endDate: 'Please enter a valid date' }));
                                  setShakeFields(prev => [...prev, 'endDate']);
                                  setTimeout(() => setShakeFields(prev => prev.filter(f => f !== 'endDate')), 600);
                                }
                              } else {
                                setFieldErrors(prev => ({ ...prev, endDate: 'Please enter a valid date' }));
                                setShakeFields(prev => [...prev, 'endDate']);
                                setTimeout(() => setShakeFields(prev => prev.filter(f => f !== 'endDate')), 600);
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value) {
                                const [year, month, day] = value.split('-').map(Number);
                                const isValidDate = !isNaN(year) && !isNaN(month) && !isNaN(day) &&
                                  year > 1900 && year < 2100 &&
                                  month >= 1 && month <= 12 &&
                                  day >= 1 && day <= 31;
                                if (!isValidDate) {
                                  setFieldErrors(prev => ({ ...prev, endDate: 'Please enter a valid date' }));
                                  setShakeFields(prev => [...prev, 'endDate']);
                                  setTimeout(() => setShakeFields(prev => prev.filter(f => f !== 'endDate')), 600);
                                } else if (dateRange.start && value < dateRange.start) {
                                  setFieldErrors(prev => ({ ...prev, endDate: 'End date cannot be before start date' }));
                                  setShakeFields(prev => [...prev, 'endDate']);
                                  setTimeout(() => setShakeFields(prev => prev.filter(f => f !== 'endDate')), 600);
                                }
                              }
                            }}
                            autoComplete="off"
                            className={`w-full p-2.5 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium pr-9 transition-all ${isDark
                              ? 'bg-gray-800 border-gray-600'
                              : 'bg-white border-gray-200'
                              } ${fieldErrors?.endDate ? 'border-rose-500' : ''}`}
                            style={{
                              color: dateRange.end ? (isDark ? '#FFFFFF' : '#1F2937') : (isDark ? '#9CA3AF' : '#6B7280'),
                            }}
                          />
                          <Calendar
                            size={18}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-200 cursor-pointer hover:scale-110"
                            onClick={() => {
                              const containers = document.querySelectorAll('.date-input-filter');
                              if (containers.length >= 2) {
                                const input = containers[1].querySelector('input[type="date"]');
                                if (input) {
                                  if (input.showPicker) {
                                    input.showPicker();
                                  } else {
                                    input.focus();
                                    input.click();
                                  }
                                }
                              }
                            }}
                            style={{
                              zIndex: 10,
                              color: dateRange.end
                                ? (isDark ? '#FFFFFF' : '#1F2937')
                                : (isDark ? '#9CA3AF' : '#6B7280'),
                              filter: 'none',
                              pointerEvents: 'auto'
                            }}
                          />
                        </div>
                        {fieldErrors?.endDate && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                          >
                            <XCircle size={12} />
                            {fieldErrors.endDate}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Results count and reset button */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Showing {filteredAdmins.length} of {admins.length} admins
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleResetFilters}
                      className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-xs sm:text-sm font-semibold shadow-xl transition-all"
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

        {/* Admins Grid */}
        {paginatedAdmins.length > 0 ? (
          <>
            <div className="admins-grid-container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {paginatedAdmins.map((admin, index) => (
                  <AdminCard
                    key={admin.id}
                    admin={admin}
                    isDark={isDark}
                    onView={handleViewAdmin}
                    onEdit={handleEditAdmin}
                    onDelete={handleDeleteAdmin}
                    onApproveAdmin={handleApproveAdmin}
                    onInvite={(admin) => {
                      setSelectedAdmin(admin);
                      setShowInviteModal(true);
                    }}
                    index={index}
                  />
                ))}
              </motion.div>
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isDark={isDark}
                totalItems={filteredAdmins.length}
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
              <Users size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'
                }`} />
            </motion.div>
            <p className={`text-base font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
              No admins found matching your criteria
            </p>
            <p className={`text-sm font-medium mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'
              }`}>
              Try adjusting your filters or search term
            </p>
          </motion.div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {showAdminModal && selectedAdmin && (
            <AdminDetailModal
              admin={selectedAdmin}
              isDark={isDark}
              onClose={closeModals}
              availableAdmins={availableAdmins}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAddAdminModal && (
            <AddAdminModal
              isDark={isDark}
              admin={editingAdmin}
              onClose={closeModals}
              onAddAdmin={handleAddAdmin}
              onUpdateAdmin={handleUpdateAdmin}
              onSuccess={(message) => {
                setSuccessMessage(message);
                setShowSuccessDialog(true);
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showApprovalModal && adminToApprove && (
            <AdminApprovalModal
              isDark={isDark}
              admin={adminToApprove}
              onClose={() => {
                setShowApprovalModal(false);
                setAdminToApprove(null);
              }}
              onApprove={(adminId, comment) => handleApprovalSubmit(adminId, { approvalType: 'approve', comment })}
              onReject={(adminId, reason) => handleApprovalSubmit(adminId, { approvalType: 'reject', reason })}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDeleteDialog && (
            <ConfirmationDialog
              isDark={isDark}
              title="Delete Admin"
              message={`Are you sure you want to delete ${adminToDelete?.fullName}? This action cannot be undone.`}
              onConfirm={confirmDelete}
              onCancel={() => setShowDeleteDialog(false)}
              confirmText="Delete"
              cancelText="Cancel"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showInviteModal && (
            <InviteAdminModal
              isDark={isDark}
              selectedAdmin={selectedAdmin}
              onClose={() => setShowInviteModal(false)}
              onSuccess={(msg) => {
                setSuccessMessage(msg);
                setShowSuccessDialog(true);
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
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
    </>
  );
};

export default AdminsManagement;