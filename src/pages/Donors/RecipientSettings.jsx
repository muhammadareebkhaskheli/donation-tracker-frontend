import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  Shield,
  ShieldCheck,
  Key,
  Lock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BadgeCheck,
  BadgeAlert,
  BadgeX,
  Edit,
  Save,
  Download,
  Upload,
  Trash2,
  X,
  Plus,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Clock,
  Award,
  Medal,
  Star,
  Activity,
  TrendingUp,
  TrendingDown,
  Monitor as MonitorIcon,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Twitch,
  Globe,
  FileText,
  Eye,
  EyeOff,
  Camera,
  MapPin as MapPinIcon,
  MessageSquare,
  RefreshCw,
  Eye as ViewIcon,
  Send,
  Briefcase,
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

// Mock user data with authentic Indian persona (simplified - only essential fields kept)
const userData = {
  id: 'USR-001',
  name: 'Rajesh Kumar Sharma',
  email: 'rajesh.sharma@donationtracker.com',
  phone: '+91-98765-43210',
  role: 'Super Admin',
  avatar: null,
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
};

// Profile Header Component (simplified - no edit button)
const ProfileHeader = memo(({ user, isDark }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
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
  const [shakeKey, setShakeKey] = useState(0);

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
    setLocalShakeFields(fieldNames);
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

    setTimeout(() => {
      setLocalShakeFields([]);
    }, 600);
  };

  useEffect(() => {
    if (!showPasswordSection) {
      setPasswordErrors({});
      setLocalShakeFields([]);
      setNewPassword('');
      setConfirmPassword('');
      setShakeKey(0);
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [showPasswordSection]);

  const handlePasswordChange = async () => {
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
        triggerShake(Object.keys(errors));
        setIsLoading(false);
        return;
      }

      if (onPasswordChange) {
        await onPasswordChange({
          newPassword,
          confirmPassword,
        });
      }

      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
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

  const shouldShakeNewPassword = localShakeFields.includes('newPassword');
  const shouldShakeConfirmPassword = localShakeFields.includes('confirmPassword');

  return (
    <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <Key size={18} className="text-violet-500" />
        Password Security
      </h3>

      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02, x: 5 }}
          className={`group relative p-4 rounded-2xl border-2 transition-all ${isDark
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-violet-500/30'
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-violet-500/30'
            }`}
        >
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2" style={{ marginLeft: '16px' }}>
                    <label className={`block text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      &nbsp;New Password <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <div className="overflow-visible">
                      <motion.div
                        key={`newPassword-${shakeKey}`}
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

                  <div className="space-y-2" style={{ marginRight: '16px' }}>
                    <label className={`block text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      &nbsp;Confirm New Password <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <div className="overflow-visible">
                      <motion.div
                        key={`confirmPassword-${shakeKey}`}
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
});

// Main Recipient Settings Component
const RecipientSettings = ({ isDark }) => {
  const [user, setUser] = useState(userData);
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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const modalStates = useRef({
    deleteDevice: false,
    success: false,
    socialDelete: false
  });

  const scrollPosition = useRef(0);

  useEffect(() => {
    modalStates.current = {
      deleteDevice: showDeleteConfirmation,
      success: showSuccessDialog,
      socialDelete: showSocialDeleteConfirmation
    };
  }, [showDeleteConfirmation, showSuccessDialog, showSocialDeleteConfirmation]);

  // Handle body scroll locking
  useEffect(() => {
    const isAnyModalOpen = showDeleteConfirmation || showSuccessDialog || showSocialDeleteConfirmation || isSocialModalOpen;

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
  }, [showDeleteConfirmation, showSuccessDialog, showSocialDeleteConfirmation, isSocialModalOpen]);

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

  const handlePasswordChange = () => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 px-3 sm:px-4">
      {/* Profile Header - simplified without edit button */}
      <ProfileHeader
        user={user}
        isDark={isDark}
      />

      {/* Single Combined Overview Section with Activity & Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-2xl p-6 border ${isDark
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          }`}
      >
        <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Activity size={20} className="text-violet-500" />
          Activity & Security
        </h2>

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
              {user.activity.sessions.map((session) => (
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

          {/* Social Links */}
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
      </motion.div>

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

export default RecipientSettings;