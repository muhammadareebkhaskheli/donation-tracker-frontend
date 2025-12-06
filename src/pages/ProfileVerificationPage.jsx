import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Shield,
    CreditCard,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Upload,
    AlertCircle,
    Edit2,
    Save,
    Trash2,
    Building,
    Calendar,
    Users,
    Lock,
    TrendingUp,
    FileCheck,
    AlertTriangle,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Landmark,
    Hash,
    Globe,
    ShieldCheck,
    Loader,
    ChevronDown,
    ChevronUp,
    Eye,
    EyeOff,
    Search,
    Filter,
    RefreshCw,
    Download,
    BarChart,
    Percent,
    Target,
    Activity,
    Award,
    Heart,
    Zap,
    ChevronRight,
    X
} from 'lucide-react';

// ==================== ENHANCED DUMMY DATA ====================
const generateDummyProfileData = () => ({
    personalInfo: {
        fullName: 'Ahmed Khan',
        email: 'ahmed.khan@example.com',
        phone: '+92-300-1234567',
        address: 'House 123, Street 45, DHA Phase 6, Karachi, Pakistan',
        dateOfBirth: '1990-05-15',
        familyDetails: 'Married with 2 children',
        occupation: 'Software Engineer'
    },
    bankDetails: {
        bankName: 'Habib Bank Limited',
        accountNumber: '1234567890123456',
        iban: 'PK36HABB1234567890123456',
        accountHolderName: 'Ahmed Khan',
        branchCode: '0123',
        accountType: 'Savings',
        verificationStatus: 'pending'
    },
    documents: {
        idProof: {
            id: 1,
            name: 'cnic_front.jpg',
            size: '2.4 MB',
            type: 'image/jpeg',
            status: 'verified',
            uploadedAt: '2024-01-10',
            preview: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop'
        },
        addressProof: {
            id: 2,
            name: 'utility_bill.pdf',
            size: '1.8 MB',
            type: 'application/pdf',
            status: 'uploaded',
            uploadedAt: '2024-01-11',
            preview: null
        },
        incomeProof: {
            id: 3,
            name: 'salary_slip.pdf',
            size: '3.1 MB',
            type: 'application/pdf',
            status: 'rejected',
            uploadedAt: '2024-01-12',
            preview: null
        },
        bankStatement: {
            id: 4,
            name: 'bank_statement.pdf',
            size: '4.2 MB',
            type: 'application/pdf',
            status: 'pending',
            uploadedAt: null,
            preview: null
        }
    },
    verification: {
        progress: 75,
        status: 'in_review',
        submittedAt: '2024-01-10T10:30:00',
        estimatedCompletion: '2024-01-17',
        adminComments: [
            {
                id: 1,
                text: 'CNIC document needs clearer picture of all corners visible',
                timestamp: '2024-01-10',
                admin: 'Admin Sarah',
                type: 'document_issue'
            },
            {
                id: 2,
                text: 'Bank details verified successfully',
                timestamp: '2024-01-09',
                admin: 'Admin Ahmed',
                type: 'approval'
            },
            {
                id: 3,
                text: 'Salary slip is outdated, please upload current month document',
                timestamp: '2024-01-08',
                admin: 'Admin Ali',
                type: 'document_issue'
            }
        ]
    }
});

// ==================== ENHANCED CARD COMPONENT ====================
const Card = ({ children, className = "", isDark = false, padding = true, animate = true, ...props }) => (
    <motion.div
        initial={animate ? { opacity: 0, y: 20 } : {}}
        animate={animate ? { opacity: 1, y: 0 } : {}}
        transition={animate ? { duration: 0.5 } : {}}
        className={`rounded-2xl ${padding ? 'p-6' : ''} ${isDark
            ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 border-gray-700'
            : 'bg-white border-gray-200'
            } border shadow-xl ${className}`}
        {...props}
    >
        {children}
    </motion.div>
);

// ==================== ENHANCED FORM FIELD WITH VALIDATION ====================
const FormField = ({
    label,
    type = "text",
    value = "",
    onChange,
    error,
    placeholder,
    icon: Icon,
    required = false,
    isDark = false,
    shake = false,
    validate = () => true,
    onBlur,
    maxLength,
    disabled = false,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState(false);

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

    const handleChange = (e) => {
        const newValue = e.target.value;

        // Apply validation if validate function exists
        if (validate && !validate(newValue) && newValue.trim() !== '') {
            return; // Don't update if validation fails
        }

        onChange(e);
    };

    const handleBlur = (e) => {
        setTouched(true);
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    return (
        <div className="space-y-2">
            <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                {Icon && <Icon size={14} className={isDark ? 'text-violet-400' : 'text-violet-600'} />}
                {label}
                {required && <span className="text-rose-500">*</span>}
            </label>

            <motion.div
                animate={shake ? "shake" : "initial"}
                variants={shakeAnimation}
                className="relative"
            >
                {type === 'textarea' ? (
                    <textarea
                        value={value}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        disabled={disabled}
                        maxLength={maxLength}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                            } border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none resize-none ${error ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : ''
                            } ${isFocused && !error ? 'border-violet-500 ring-2 ring-violet-500/20' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                        rows="4"
                        {...props}
                    />
                ) : (
                    <div className="relative">
                        <input
                            type={type === 'password' && showPassword ? 'text' : type}
                            value={value}
                            onChange={handleChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={handleBlur}
                            placeholder={placeholder}
                            disabled={disabled}
                            maxLength={maxLength}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${isDark
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                                } border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none ${error ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : ''
                                } ${isFocused && !error ? 'border-violet-500 ring-2 ring-violet-500/20' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''
                                } ${type === 'password' ? 'pr-10' : ''}`}
                            {...props}
                        />

                        {type === 'password' && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                                    }`}
                            >
                                {showPassword ? (
                                    <EyeOff size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                                ) : (
                                    <Eye size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                                )}
                            </button>
                        )}
                    </div>
                )}

                {maxLength && (
                    <div className="absolute bottom-2 right-3 text-xs opacity-60">
                        {value.length}/{maxLength}
                    </div>
                )}
            </motion.div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-rose-600 text-xs font-medium"
                >
                    <AlertCircle size={12} />
                    {error}
                </motion.p>
            )}
        </div>
    );
};

// ==================== DOCUMENT UPLOAD CARD ====================
const DocumentCard = ({
    title,
    description,
    required = false,
    acceptedTypes = '.jpg, .jpeg, .png, .pdf',
    maxSizeMB = 5,
    file,
    status,
    onUpload,
    onRemove,
    error,
    isDark,
    progress,
    isRequired = false
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'verified':
                return {
                    color: 'from-emerald-500 to-green-500',
                    bgColor: 'bg-emerald-500/20',
                    textColor: 'text-emerald-600',
                    borderColor: 'border-emerald-500/30',
                    icon: CheckCircle,
                    text: 'Verified'
                };
            case 'rejected':
                return {
                    color: 'from-rose-500 to-red-500',
                    bgColor: 'bg-rose-500/20',
                    textColor: 'text-rose-600',
                    borderColor: 'border-rose-500/30',
                    icon: XCircle,
                    text: 'Rejected'
                };
            case 'uploaded':
                return {
                    color: 'from-blue-500 to-cyan-500',
                    bgColor: 'bg-blue-500/20',
                    textColor: 'text-blue-600',
                    borderColor: 'border-blue-500/30',
                    icon: FileCheck,
                    text: 'Uploaded'
                };
            case 'pending':
                return {
                    color: 'from-amber-500 to-orange-500',
                    bgColor: 'bg-amber-500/20',
                    textColor: 'text-amber-600',
                    borderColor: 'border-amber-500/30',
                    icon: Clock,
                    text: 'Pending'
                };
            default:
                return {
                    color: 'from-gray-500 to-gray-600',
                    bgColor: 'bg-gray-500/20',
                    textColor: 'text-gray-600',
                    borderColor: 'border-gray-500/30',
                    icon: FileText,
                    text: 'Not Uploaded'
                };
        }
    };

    const statusConfig = getStatusConfig(status);
    const StatusIcon = statusConfig.icon;

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    };

    const handleFileSelect = (selectedFile) => {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(selectedFile.type)) {
            alert(`Please upload only ${acceptedTypes} files`);
            return;
        }

        // Validate file size
        const maxSize = maxSizeMB * 1024 * 1024;
        if (selectedFile.size > maxSize) {
            alert(`File size must be less than ${maxSizeMB}MB`);
            return;
        }

        onUpload(selectedFile);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`space-y-3 ${error ? 'animate-pulse' : ''}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                        {title}
                    </h4>
                    {required && <span className="text-rose-500 text-sm">*</span>}
                </div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusConfig.bgColor} ${statusConfig.textColor}`}
                >
                    <StatusIcon size={12} />
                    <span>{statusConfig.text}</span>
                </motion.div>
            </div>

            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {description}
            </p>

            <div
                className={`relative border-2 border-dashed rounded-xl transition-all cursor-pointer ${isDragging
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 scale-105'
                    : isDark
                        ? 'border-gray-600 bg-gray-800 hover:border-violet-500'
                        : 'border-gray-300 bg-gray-50 hover:border-violet-400'
                    } ${error ? 'border-rose-500 ring-2 ring-rose-500/20' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                    accept={acceptedTypes}
                    className="hidden"
                />

                {progress !== undefined ? (
                    <div className="p-8 text-center">
                        <div className="relative w-20 h-20 mx-auto mb-4">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="45%"
                                    fill="none"
                                    stroke={isDark ? '#374151' : '#e5e7eb'}
                                    strokeWidth="6"
                                />
                                <circle
                                    cx="50%"
                                    cy="50%"
                                    r="45%"
                                    fill="none"
                                    stroke="#8b5cf6"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray="283"
                                    strokeDashoffset={283 - (283 * progress) / 100}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {progress}%
                                </span>
                            </div>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Uploading...
                        </p>
                    </div>
                ) : file ? (
                    <div className="p-5">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                <FileText size={20} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {file.name}
                                </p>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {file.size}
                                </p>
                                {status === 'rejected' && (
                                    <p className="text-sm text-rose-600 mt-1 flex items-center gap-1">
                                        <AlertCircle size={12} />
                                        Please upload a clearer document
                                    </p>
                                )}
                            </div>
                            <motion.button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemove();
                                }}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-2 rounded-lg ${isDark
                                    ? 'hover:bg-rose-500/20 text-gray-400 hover:text-rose-400'
                                    : 'hover:bg-rose-100 text-gray-600 hover:text-rose-600'
                                    }`}
                            >
                                <Trash2 size={18} />
                            </motion.button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-block mb-4"
                        >
                            <Upload size={28} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
                        </motion.div>
                        <div className="space-y-1">
                            <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                                Drag & drop or click to upload
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                Max size: {maxSizeMB}MB • {acceptedTypes}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-rose-600 text-xs font-medium flex items-center gap-2"
                >
                    <AlertCircle size={12} />
                    {error}
                </motion.p>
            )}
        </div>
    );
};

// ==================== VALIDATION FUNCTIONS ====================
const validation = {
    name: (value) => {
        if (!value.trim()) return 'Name is required';
        if (!/^[A-Za-z\s.'-]+$/.test(value)) return 'Name can only contain letters, spaces, dots, and apostrophes';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 50) return 'Name cannot exceed 50 characters';
        return null;
    },

    email: (value) => {
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return null;
    },

    phone: (value) => {
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^(\+92|0)[\d]{10}$/;
        const cleanValue = value.replace(/[- ]/g, '');
        if (!phoneRegex.test(cleanValue)) return 'Please enter a valid Pakistan phone number (e.g., +923001234567 or 03001234567)';
        return null;
    },

    address: (value) => {
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 10) return 'Address must be at least 10 characters';
        return null;
    },

    bankName: (value) => {
        if (!value.trim()) return 'Bank name is required';
        if (!/^[A-Za-z\s&.,'-]+$/.test(value)) return 'Bank name contains invalid characters';
        return null;
    },

    accountNumber: (value) => {
        if (!value.trim()) return 'Account number is required';
        if (!/^\d{9,18}$/.test(value.replace(/\s/g, ''))) return 'Account number must be 9-18 digits';
        return null;
    },

    iban: (value) => {
        if (!value.trim()) return 'IBAN is required';
        const ibanRegex = /^PK\d{2}[A-Z]{4}\d{16}$/;
        const cleanValue = value.replace(/\s/g, '').toUpperCase();
        if (!ibanRegex.test(cleanValue)) return 'Please enter a valid Pakistan IBAN (e.g., PK36HABB1234567890123456)';
        return null;
    },

    accountHolder: (value) => {
        if (!value.trim()) return 'Account holder name is required';
        if (!/^[A-Za-z\s.'-]+$/.test(value)) return 'Name can only contain letters, spaces, dots, and apostrophes';
        return null;
    },

    branchCode: (value) => {
        if (!value.trim()) return 'Branch code is required';
        if (!/^\d{4}$/.test(value)) return 'Branch code must be 4 digits';
        return null;
    },

    dateOfBirth: (value) => {
        if (!value) return 'Date of birth is required';
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) return 'You must be at least 18 years old';
        if (age > 100) return 'Please enter a valid date of birth';
        return null;
    }
};

// ==================== SUCCESS DIALOG COMPONENT ====================
const SuccessDialog = ({ isDark, title, message, onClose, onOkay }) => {
    return (
        <motion.div
            key="success-dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            style={{ margin: 0, padding: 0 }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300
                }}
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
                            onClick={onOkay || onClose}
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
                            transition={{
                                type: "spring",
                                delay: 0.1,
                                stiffness: 200
                            }}
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
                            onClick={onOkay || onClose}
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
};

// ==================== MAIN COMPONENT ====================
const ProfileVerificationPage = ({ isDark = false }) => {
    // Add this useEffect first
    useEffect(() => {
        // Force scroll to top on initial page load
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });

        // Alternative methods to ensure scroll
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // Prevent any auto-focus
        if (document.activeElement && document.activeElement.tagName === 'INPUT') {
            document.activeElement.blur();
        }
    }, []);

    // State Management
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [collapsedSections, setCollapsedSections] = useState({
        personalInfo: false,
        bankDetails: false,
        documents: false,
        verification: false
    });

    // Refs for timeouts
    const autoCloseTimeoutRef = useRef(null);
    const scrollTimeoutRef = useRef(null);

    // Form States
    const [personalInfo, setPersonalInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        familyDetails: '',
        occupation: ''
    });

    const [bankDetails, setBankDetails] = useState({
        bankName: '',
        accountNumber: '',
        iban: '',
        accountHolderName: '',
        branchCode: '',
        accountType: 'Savings'
    });

    const [documents, setDocuments] = useState({
        idProof: { file: null, status: 'pending', progress: null, required: true },
        addressProof: { file: null, status: 'pending', progress: null, required: true },
        incomeProof: { file: null, status: 'pending', progress: null, required: true },
        bankStatement: { file: null, status: 'pending', progress: null, required: false }
    });

    const [verification, setVerification] = useState({
        progress: 25,
        status: 'pending',
        submittedAt: null,
        estimatedCompletion: null,
        adminComments: []
    });

    // Validation States
    const [errors, setErrors] = useState({
        personalInfo: {},
        bankDetails: {},
        documents: {}
    });

    const [shakeFields, setShakeFields] = useState({
        personalInfo: [],
        bankDetails: [],
        documents: []
    });

    const [touchedFields, setTouchedFields] = useState({
        personalInfo: {},
        bankDetails: {}
    });

    // Initialize with dummy data
    useEffect(() => {
        const dummyData = generateDummyProfileData();
        setPersonalInfo(dummyData.personalInfo);
        setBankDetails(dummyData.bankDetails);
        setVerification(dummyData.verification);

        const dummyDocs = dummyData.documents;
        setDocuments({
            idProof: {
                file: dummyDocs.idProof ? {
                    name: dummyDocs.idProof.name,
                    size: dummyDocs.idProof.size
                } : null,
                status: dummyDocs.idProof?.status || 'pending',
                progress: null,
                required: true
            },
            addressProof: {
                file: dummyDocs.addressProof ? {
                    name: dummyDocs.addressProof.name,
                    size: dummyDocs.addressProof.size
                } : null,
                status: dummyDocs.addressProof?.status || 'pending',
                progress: null,
                required: true
            },
            incomeProof: {
                file: dummyDocs.incomeProof ? {
                    name: dummyDocs.incomeProof.name,
                    size: dummyDocs.incomeProof.size
                } : null,
                status: dummyDocs.incomeProof?.status || 'pending',
                progress: null,
                required: true
            },
            bankStatement: {
                file: dummyDocs.bankStatement ? {
                    name: dummyDocs.bankStatement.name,
                    size: dummyDocs.bankStatement.size
                } : null,
                status: dummyDocs.bankStatement?.status || 'pending',
                progress: null,
                required: false
            }
        });
    }, []);

    // Auto-save functionality
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsSaving(true);
            setTimeout(() => {
                const draft = {
                    personalInfo,
                    bankDetails,
                    documents,
                    verification
                };
                localStorage.setItem('profileVerificationDraft', JSON.stringify(draft));
                setIsSaving(false);
            }, 500);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [personalInfo, bankDetails, documents, verification]);

    // Load draft on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem('profileVerificationDraft');
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                setPersonalInfo(draft.personalInfo || personalInfo);
                setBankDetails(draft.bankDetails || bankDetails);
                setDocuments(draft.documents || documents);
                setVerification(draft.verification || verification);
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    }, []);

    // Calculate verification progress
    useEffect(() => {
        const calculateProgress = () => {
            let progress = 0;

            // Personal Info (30%)
            const personalInfoFields = ['fullName', 'email', 'phone', 'address', 'dateOfBirth', 'occupation'];
            const personalInfoComplete = personalInfoFields.filter(field =>
                personalInfo[field] && personalInfo[field].trim() !== ''
            ).length;
            progress += (personalInfoComplete / personalInfoFields.length) * 30;

            // Bank Details (30%)
            const bankFields = ['bankName', 'accountNumber', 'iban', 'accountHolderName', 'branchCode'];
            const bankComplete = bankFields.filter(field =>
                bankDetails[field] && bankDetails[field].trim() !== ''
            ).length;
            progress += (bankComplete / bankFields.length) * 30;

            // Documents (40%)
            const requiredDocs = Object.values(documents).filter(doc => doc && doc.required);
            const uploadedDocs = requiredDocs.filter(doc => doc && doc.file).length;
            progress += (uploadedDocs / requiredDocs.length) * 40;

            // Update status based on progress
            let status = 'pending';
            if (progress >= 100) status = 'in_review';
            else if (progress >= 75) status = 'pending';
            else status = 'incomplete';

            setVerification(prev => ({
                ...prev,
                progress: Math.min(100, Math.round(progress)),
                status
            }));
        };

        calculateProgress();
    }, [personalInfo, bankDetails, documents]);

    // Clean up timeouts on unmount
    useEffect(() => {
        return () => {
            if (autoCloseTimeoutRef.current) {
                clearTimeout(autoCloseTimeoutRef.current);
            }
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    // Scroll function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Show dialog function
    const showDialogWithMessage = (message) => {
        // Clear any existing timeout
        if (autoCloseTimeoutRef.current) {
            clearTimeout(autoCloseTimeoutRef.current);
            autoCloseTimeoutRef.current = null;
        }
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = null;
        }

        setSuccessMessage(message);
        setShowSuccess(true);

        // For error messages, auto-close after 4 seconds
        if (message.includes('fix all errors')) {
            autoCloseTimeoutRef.current = setTimeout(() => {
                setShowSuccess(false);
            }, 4000);
        }
    };

    // Handle dialog close
    const handleDialogClose = () => {
        setShowSuccess(false);

        if (autoCloseTimeoutRef.current) {
            clearTimeout(autoCloseTimeoutRef.current);
            autoCloseTimeoutRef.current = null;
        }
    };

    // Handle dialog close with scroll
    const handleDialogCloseWithScroll = () => {
        setShowSuccess(false);

        if (autoCloseTimeoutRef.current) {
            clearTimeout(autoCloseTimeoutRef.current);
            autoCloseTimeoutRef.current = null;
        }

        // Scroll to top after dialog closes
        scrollTimeoutRef.current = setTimeout(() => {
            scrollToTop();
        }, 100);
    };

    // Handle field change with validation
    const handlePersonalInfoChange = (field, value) => {
        let processedValue = value;

        switch (field) {
            case 'fullName':
                processedValue = value.replace(/[^A-Za-z\s.'-]/g, '');
                break;
            case 'phone':
                processedValue = value.replace(/[^\d+]/g, '');
                if (processedValue.startsWith('92')) {
                    processedValue = '+' + processedValue;
                } else if (processedValue.startsWith('0')) {
                    processedValue = '+92' + processedValue.slice(1);
                }
                break;
            case 'occupation':
                processedValue = value.replace(/[^A-Za-z\s-]/g, '');
                break;
            default:
                break;
        }

        setPersonalInfo(prev => ({ ...prev, [field]: processedValue }));

        // Clear error when user starts typing
        if (errors.personalInfo && errors.personalInfo[field]) {
            setErrors(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, [field]: null }
            }));
        }
    };

    const handleBankDetailsChange = (field, value) => {
        let processedValue = value;

        switch (field) {
            case 'bankName':
                processedValue = value.replace(/[^A-Za-z\s&.,'-]/g, '');
                break;
            case 'accountNumber':
                processedValue = value.replace(/\D/g, '');
                processedValue = processedValue.slice(0, 18);
                break;
            case 'iban':
                processedValue = value.toUpperCase().replace(/\s/g, '');
                break;
            case 'accountHolderName':
                processedValue = value.replace(/[^A-Za-z\s.'-]/g, '');
                break;
            case 'branchCode':
                processedValue = value.replace(/\D/g, '').slice(0, 4);
                break;
            default:
                break;
        }

        setBankDetails(prev => ({ ...prev, [field]: processedValue }));

        // Clear error when user starts typing
        if (errors.bankDetails && errors.bankDetails[field]) {
            setErrors(prev => ({
                ...prev,
                bankDetails: { ...prev.bankDetails, [field]: null }
            }));
        }
    };

    // Field validation on blur
    const validateField = (section, field, value) => {
        let error = null;

        if (section === 'personalInfo') {
            switch (field) {
                case 'fullName':
                    error = validation.name(value);
                    break;
                case 'email':
                    error = validation.email(value);
                    break;
                case 'phone':
                    error = validation.phone(value);
                    break;
                case 'address':
                    error = validation.address(value);
                    break;
                case 'dateOfBirth':
                    error = validation.dateOfBirth(value);
                    break;
                default:
                    break;
            }
        } else if (section === 'bankDetails') {
            switch (field) {
                case 'bankName':
                    error = validation.bankName(value);
                    break;
                case 'accountNumber':
                    error = validation.accountNumber(value);
                    break;
                case 'iban':
                    error = validation.iban(value);
                    break;
                case 'accountHolderName':
                    error = validation.accountHolder(value);
                    break;
                case 'branchCode':
                    error = validation.branchCode(value);
                    break;
                default:
                    break;
            }
        }

        return error;
    };

    const handleFieldBlur = (section, field, value) => {
        setTouchedFields(prev => ({
            ...prev,
            [section]: { ...(prev[section] || {}), [field]: true }
        }));

        const error = validateField(section, field, value);
        setErrors(prev => ({
            ...prev,
            [section]: { ...(prev[section] || {}), [field]: error }
        }));

        if (error) {
            setShakeFields(prev => ({
                ...prev,
                [section]: [...(prev[section] || []), field]
            }));

            setTimeout(() => {
                setShakeFields(prev => ({
                    ...prev,
                    [section]: (prev[section] || []).filter(f => f !== field)
                }));
            }, 600);
        }
    };

    // Document handling
    const handleDocumentUpload = async (docType, file) => {
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                documents: { ...(prev.documents || {}), [docType]: 'Only JPG, PNG, and PDF files are allowed' }
            }));
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setErrors(prev => ({
                ...prev,
                documents: { ...(prev.documents || {}), [docType]: 'File size must be less than 5MB' }
            }));
            return;
        }

        setErrors(prev => ({
            ...prev,
            documents: { ...(prev.documents || {}), [docType]: null }
        }));

        setDocuments(prev => ({
            ...prev,
            [docType]: { ...(prev[docType] || {}), progress: 0 }
        }));

        for (let i = 0; i <= 100; i += 25) {
            await new Promise(resolve => setTimeout(resolve, 200));
            setDocuments(prev => ({
                ...prev,
                [docType]: { ...(prev[docType] || {}), progress: i }
            }));
        }

        setDocuments(prev => ({
            ...prev,
            [docType]: {
                ...(prev[docType] || {}),
                file: {
                    name: file.name,
                    size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                    type: file.type
                },
                status: 'uploaded',
                progress: null
            }
        }));
    };

    const handleDocumentRemove = (docType) => {
        setDocuments(prev => ({
            ...prev,
            [docType]: {
                ...(prev[docType] || {}),
                file: null,
                status: 'pending',
                progress: null,
                required: (prev[docType]?.required || false)
            }
        }));
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {
            personalInfo: {},
            bankDetails: {},
            documents: {}
        };

        const newShakeFields = {
            personalInfo: [],
            bankDetails: [],
            documents: []
        };

        let hasErrors = false;

        // Validate personal info
        Object.keys(personalInfo || {}).forEach(field => {
            if (field === 'familyDetails') return;

            const error = validateField('personalInfo', field, personalInfo[field]);
            if (error) {
                newErrors.personalInfo[field] = error;
                newShakeFields.personalInfo.push(field);
                hasErrors = true;
            }
        });

        // Validate bank details
        Object.keys(bankDetails || {}).forEach(field => {
            if (field === 'accountType') return;

            const error = validateField('bankDetails', field, bankDetails[field]);
            if (error) {
                newErrors.bankDetails[field] = error;
                newShakeFields.bankDetails.push(field);
                hasErrors = true;
            }
        });

        // Validate required documents
        Object.entries(documents || {}).forEach(([docType, doc]) => {
            if (doc && doc.required && !doc.file) {
                newErrors.documents[docType] = `${docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
                newShakeFields.documents.push(docType);
                hasErrors = true;
            }
        });

        setErrors(newErrors);
        setShakeFields(newShakeFields);

        setTimeout(() => {
            setShakeFields({
                personalInfo: [],
                bankDetails: [],
                documents: []
            });
        }, 600);

        return !hasErrors;
    };

    // Submit verification
    const handleSubmitVerification = async () => {
        if (!validateForm()) {
            showDialogWithMessage('Please fix all errors before submitting');
            return;
        }

        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 2000));

        setVerification(prev => ({
            ...prev,
            status: 'in_review',
            submittedAt: new Date().toISOString(),
            estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            adminComments: [
                ...(prev.adminComments || []),
                {
                    id: Date.now(),
                    text: 'Profile submitted for verification',
                    timestamp: new Date().toISOString().split('T')[0],
                    admin: 'System',
                    type: 'submission'
                }
            ]
        }));

        setIsLoading(false);
        showDialogWithMessage('Profile submitted for verification successfully!');
    };

    // Save draft
    const handleSaveDraft = () => {
        const draft = {
            personalInfo,
            bankDetails,
            documents,
            verification
        };
        localStorage.setItem('profileVerificationDraft', JSON.stringify(draft));

        showDialogWithMessage('Draft saved successfully!');
    };

    // Reset form
    const handleResetForm = () => {
        setPersonalInfo({
            fullName: '',
            email: '',
            phone: '',
            address: '',
            dateOfBirth: '',
            familyDetails: '',
            occupation: ''
        });

        setBankDetails({
            bankName: '',
            accountNumber: '',
            iban: '',
            accountHolderName: '',
            branchCode: '',
            accountType: 'Savings'
        });

        setDocuments({
            idProof: { file: null, status: 'pending', progress: null, required: true },
            addressProof: { file: null, status: 'pending', progress: null, required: true },
            incomeProof: { file: null, status: 'pending', progress: null, required: true },
            bankStatement: { file: null, status: 'pending', progress: null, required: false }
        });

        setErrors({
            personalInfo: {},
            bankDetails: {},
            documents: {}
        });

        localStorage.removeItem('profileVerificationDraft');

        showDialogWithMessage('Form reset successfully!');
    };

    // Toggle section collapse
    const toggleSection = (section) => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Progress Circle Component
    const ProgressCircle = ({ percentage, size = 120, isDark }) => {
        const radius = (size - 8) / 2;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        const getColor = () => {
            if (percentage >= 75) return '#10b981';
            if (percentage >= 50) return '#3b82f6';
            if (percentage >= 25) return '#f59e0b';
            return '#ef4444';
        };

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
                        stroke={getColor()}
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
                        }}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {percentage}%
                    </span>
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Complete
                    </span>
                </div>
            </div>
        );
    };

    const uploadedDocsCount = Object.values(documents || {}).filter(d => d && d.file).length || 0;
    const verifiedDocsCount = Object.values(documents || {}).filter(d => d && d.status === 'verified').length || 0;

    return (
        <div className="min-h-screen p-4 md:p-0">
            {/* Success Notification */}
            <AnimatePresence mode="wait">
                {showSuccess && (
                    <SuccessDialog
                        isDark={isDark}
                        title="Success"
                        message={successMessage}
                        onClose={handleDialogClose}
                        onOkay={handleDialogCloseWithScroll}
                    />
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Progress Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card isDark={isDark} className="relative overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10"
                            animate={{
                                backgroundPosition: ['0% 0%', '100% 100%'],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="text-center md:text-left">
                                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        Verification Progress
                                    </h2>
                                    <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Complete all sections to submit for verification
                                    </p>

                                    <div className="flex items-center gap-4 mt-6">
                                        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${verification.status === 'in_review'
                                            ? 'bg-blue-500/20 text-blue-600'
                                            : verification.status === 'verified'
                                                ? 'bg-emerald-500/20 text-emerald-600'
                                                : 'bg-amber-500/20 text-amber-600'
                                            }`}>
                                            {verification.status === 'in_review' ? 'Under Review' :
                                                verification.status === 'verified' ? 'Verified' : 'Pending Submission'}
                                        </div>

                                        {verification.submittedAt && (
                                            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Submitted: {new Date(verification.submittedAt).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <ProgressCircle percentage={verification.progress} size={140} isDark={isDark} />
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Personal Information Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card isDark={isDark} className="relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                                    }`}>
                                    <User size={24} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        Personal Information
                                    </h2>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Tell us about yourself
                                    </p>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleSection('personalInfo')}
                                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                    }`}
                            >
                                {collapsedSections.personalInfo ? (
                                    <ChevronDown size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                                ) : (
                                    <ChevronUp size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                                )}
                            </motion.button>
                        </div>

                        <AnimatePresence>
                            {!collapsedSections.personalInfo && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            label="Full Name"
                                            value={personalInfo.fullName}
                                            onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                                            onBlur={() => handleFieldBlur('personalInfo', 'fullName', personalInfo.fullName)}
                                            error={errors.personalInfo?.fullName}
                                            placeholder="Ahmed Khan"
                                            required
                                            icon={User}
                                            isDark={isDark}
                                            shake={shakeFields.personalInfo?.includes('fullName')}
                                            validate={(value) => /^[A-Za-z\s.'-]*$/.test(value)}
                                            maxLength={50}
                                        />

                                        <FormField
                                            label="Email Address"
                                            type="email"
                                            value={personalInfo.email}
                                            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                                            onBlur={() => handleFieldBlur('personalInfo', 'email', personalInfo.email)}
                                            error={errors.personalInfo?.email}
                                            placeholder="ahmed.khan@example.com"
                                            required
                                            icon={Mail}
                                            isDark={isDark}
                                            shake={shakeFields.personalInfo?.includes('email')}
                                        />

                                        <FormField
                                            label="Phone Number"
                                            type="tel"
                                            value={personalInfo.phone}
                                            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                                            onBlur={() => handleFieldBlur('personalInfo', 'phone', personalInfo.phone)}
                                            error={errors.personalInfo?.phone}
                                            placeholder="+92-300-1234567"
                                            required
                                            icon={Phone}
                                            isDark={isDark}
                                            shake={shakeFields.personalInfo?.includes('phone')}
                                            validate={(value) => /^[+\d]*$/.test(value)}
                                            maxLength={13}
                                        />

                                        <FormField
                                            label="Date of Birth"
                                            type="date"
                                            value={personalInfo.dateOfBirth}
                                            onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                                            onBlur={() => handleFieldBlur('personalInfo', 'dateOfBirth', personalInfo.dateOfBirth)}
                                            error={errors.personalInfo?.dateOfBirth}
                                            required
                                            icon={Calendar}
                                            isDark={isDark}
                                            shake={shakeFields.personalInfo?.includes('dateOfBirth')}
                                            max={new Date().toISOString().split('T')[0]}
                                        />

                                        <div className="md:col-span-2">
                                            <FormField
                                                label="Address"
                                                type="textarea"
                                                value={personalInfo.address}
                                                onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                                                onBlur={() => handleFieldBlur('personalInfo', 'address', personalInfo.address)}
                                                error={errors.personalInfo?.address}
                                                placeholder="House 123, Street 45, DHA Phase 6, Karachi, Pakistan"
                                                required
                                                icon={MapPin}
                                                isDark={isDark}
                                                shake={shakeFields.personalInfo?.includes('address')}
                                                maxLength={200}
                                                autoFocus={false}
                                            />
                                        </div>

                                        <FormField
                                            label="Occupation"
                                            value={personalInfo.occupation}
                                            onChange={(e) => handlePersonalInfoChange('occupation', e.target.value)}
                                            placeholder="Software Engineer"
                                            icon={Briefcase}
                                            isDark={isDark}
                                            validate={(value) => /^[A-Za-z\s-]*$/.test(value)}
                                            maxLength={50}
                                        />

                                        <div className="md:col-span-2">
                                            <FormField
                                                label="Family Details (Optional)"
                                                type="textarea"
                                                value={personalInfo.familyDetails}
                                                onChange={(e) => handlePersonalInfoChange('familyDetails', e.target.value)}
                                                placeholder="Tell us about your family members and dependents"
                                                icon={Users}
                                                isDark={isDark}
                                                maxLength={500}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                </motion.div>

                {/* Bank Details Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card isDark={isDark} className="relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                                    }`}>
                                    <CreditCard size={24} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        Bank Details
                                    </h2>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Secure bank information for transfers
                                    </p>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleSection('bankDetails')}
                                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                    }`}
                            >
                                {collapsedSections.bankDetails ? (
                                    <ChevronDown size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                                ) : (
                                    <ChevronUp size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                                )}
                            </motion.button>
                        </div>

                        <AnimatePresence>
                            {!collapsedSections.bankDetails && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            label="Bank Name"
                                            value={bankDetails.bankName}
                                            onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                                            onBlur={() => handleFieldBlur('bankDetails', 'bankName', bankDetails.bankName)}
                                            error={errors.bankDetails?.bankName}
                                            placeholder="Habib Bank Limited"
                                            required
                                            icon={Landmark}
                                            isDark={isDark}
                                            shake={shakeFields.bankDetails?.includes('bankName')}
                                            validate={(value) => /^[A-Za-z\s&.,'-]*$/.test(value)}
                                            maxLength={100}
                                        />

                                        <FormField
                                            label="Account Number"
                                            value={bankDetails.accountNumber}
                                            onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                                            onBlur={() => handleFieldBlur('bankDetails', 'accountNumber', bankDetails.accountNumber)}
                                            error={errors.bankDetails?.accountNumber}
                                            placeholder="1234567890123456"
                                            required
                                            icon={Hash}
                                            isDark={isDark}
                                            shake={shakeFields.bankDetails?.includes('accountNumber')}
                                            validate={(value) => /^\d*$/.test(value)}
                                            maxLength={18}
                                        />

                                        <FormField
                                            label="IBAN"
                                            value={bankDetails.iban}
                                            onChange={(e) => handleBankDetailsChange('iban', e.target.value)}
                                            onBlur={() => handleFieldBlur('bankDetails', 'iban', bankDetails.iban)}
                                            error={errors.bankDetails?.iban}
                                            placeholder="PK36HABB1234567890123456"
                                            required
                                            icon={Globe}
                                            isDark={isDark}
                                            shake={shakeFields.bankDetails?.includes('iban')}
                                            validate={(value) => /^[A-Z0-9]*$/.test(value)}
                                            maxLength={24}
                                        />

                                        <FormField
                                            label="Account Holder Name"
                                            value={bankDetails.accountHolderName}
                                            onChange={(e) => handleBankDetailsChange('accountHolderName', e.target.value)}
                                            onBlur={() => handleFieldBlur('bankDetails', 'accountHolderName', bankDetails.accountHolderName)}
                                            error={errors.bankDetails?.accountHolderName}
                                            placeholder="Ahmed Khan"
                                            required
                                            icon={User}
                                            isDark={isDark}
                                            shake={shakeFields.bankDetails?.includes('accountHolderName')}
                                            validate={(value) => /^[A-Za-z\s.'-]*$/.test(value)}
                                            maxLength={50}
                                        />

                                        <FormField
                                            label="Branch Code"
                                            value={bankDetails.branchCode}
                                            onChange={(e) => handleBankDetailsChange('branchCode', e.target.value)}
                                            onBlur={() => handleFieldBlur('bankDetails', 'branchCode', bankDetails.branchCode)}
                                            error={errors.bankDetails?.branchCode}
                                            placeholder="0123"
                                            required
                                            icon={Hash}
                                            isDark={isDark}
                                            shake={shakeFields.bankDetails?.includes('branchCode')}
                                            validate={(value) => /^\d*$/.test(value)}
                                            maxLength={4}
                                        />

                                        <div>
                                            <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-2 mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                <Landmark size={14} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
                                                Account Type
                                            </label>
                                            <select
                                                value={bankDetails.accountType}
                                                onChange={(e) => setBankDetails(prev => ({ ...prev, accountType: e.target.value }))}
                                                className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${isDark
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    } border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none`}
                                            >
                                                <option value="Savings">Savings Account</option>
                                                <option value="Current">Current Account</option>
                                                <option value="Salary">Salary Account</option>
                                                <option value="Student">Student Account</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Security Notice */}
                                    <div className={`mt-8 p-5 rounded-xl border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-blue-50 border-blue-100'
                                        }`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-600' : 'bg-blue-100'
                                                }`}>
                                                <Lock size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                                            </div>
                                            <div>
                                                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                    Security Notice
                                                </h4>
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'
                                                    }`}>
                                                    Your bank details are encrypted using AES-256 encryption and stored securely.
                                                    We use bank-level security protocols to protect your information.
                                                    Your data is never shared with third parties without your consent.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                </motion.div>

                {/* Documents Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card isDark={isDark} className="relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                                    }`}>
                                    <FileText size={24} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        Documents Upload
                                    </h2>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Upload required documents for verification
                                    </p>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleSection('documents')}
                                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                    }`}
                            >
                                {collapsedSections.documents ? (
                                    <ChevronDown size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                                ) : (
                                    <ChevronUp size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                                )}
                            </motion.button>
                        </div>

                        <AnimatePresence>
                            {!collapsedSections.documents && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    {/* Requirements */}
                                    <div className={`mb-8 p-5 rounded-xl border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-amber-50 border-amber-100'
                                        }`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-600' : 'bg-amber-100'
                                                }`}>
                                                <AlertTriangle size={20} className={isDark ? 'text-amber-400' : 'text-amber-600'} />
                                            </div>
                                            <div>
                                                <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                    Upload Requirements
                                                </h4>
                                                <ul className={`text-sm space-y-2 ${isDark ? 'text-gray-400' : 'text-gray-700'
                                                    }`}>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                        Maximum file size: 5MB per document
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                        Accepted formats: JPG, PNG, PDF
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                        Documents should be clear, legible, and up-to-date
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                        All marked (*) documents are required
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Document Upload Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <DocumentCard
                                            title="ID Proof *"
                                            description="CNIC, Passport, or Driver's License"
                                            required={true}
                                            file={documents.idProof?.file}
                                            status={documents.idProof?.status}
                                            onUpload={(file) => handleDocumentUpload('idProof', file)}
                                            onRemove={() => handleDocumentRemove('idProof')}
                                            error={errors.documents?.idProof}
                                            isDark={isDark}
                                            progress={documents.idProof?.progress}
                                        />

                                        <DocumentCard
                                            title="Address Proof *"
                                            description="Utility bill or Bank statement (not older than 3 months)"
                                            required={true}
                                            file={documents.addressProof?.file}
                                            status={documents.addressProof?.status}
                                            onUpload={(file) => handleDocumentUpload('addressProof', file)}
                                            onRemove={() => handleDocumentRemove('addressProof')}
                                            error={errors.documents?.addressProof}
                                            isDark={isDark}
                                            progress={documents.addressProof?.progress}
                                        />

                                        <DocumentCard
                                            title="Income Proof *"
                                            description="Salary slip, Tax return, or Bank statement (not older than 3 months)"
                                            required={true}
                                            file={documents.incomeProof?.file}
                                            status={documents.incomeProof?.status}
                                            onUpload={(file) => handleDocumentUpload('incomeProof', file)}
                                            onRemove={() => handleDocumentRemove('incomeProof')}
                                            error={errors.documents?.incomeProof}
                                            isDark={isDark}
                                            progress={documents.incomeProof?.progress}
                                        />

                                        <DocumentCard
                                            title="Bank Statement (Optional)"
                                            description="Last 6 months bank statement"
                                            required={false}
                                            file={documents.bankStatement?.file}
                                            status={documents.bankStatement?.status}
                                            onUpload={(file) => handleDocumentUpload('bankStatement', file)}
                                            onRemove={() => handleDocumentRemove('bankStatement')}
                                            error={errors.documents?.bankStatement}
                                            isDark={isDark}
                                            progress={documents.bankStatement?.progress}
                                        />
                                    </div>

                                    {/* Upload Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                        <div className={`text-center p-5 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                                            }`}>
                                            <div className={`text-2xl font-bold mb-2 ${isDark ? 'text-violet-400' : 'text-violet-600'
                                                }`}>
                                                {uploadedDocsCount}/4
                                            </div>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                Documents Uploaded
                                            </p>
                                        </div>

                                        <div className={`text-center p-5 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                                            }`}>
                                            <div className={`text-2xl font-bold mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'
                                                }`}>
                                                {verifiedDocsCount}
                                            </div>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                Verified
                                            </p>
                                        </div>

                                        <div className={`text-center p-5 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                                            }`}>
                                            <div className={`text-2xl font-bold mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'
                                                }`}>
                                                24-48h
                                            </div>
                                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                Verification Time
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                </motion.div>

                {/* Verification Status Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card isDark={isDark} className="relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'
                                    }`}>
                                    <ShieldCheck size={24} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        Verification Status
                                    </h2>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Track your verification progress
                                    </p>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleSection('verification')}
                                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                    }`}
                            >
                                {collapsedSections.verification ? (
                                    <ChevronDown size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                                ) : (
                                    <ChevronUp size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                                )}
                            </motion.button>
                        </div>

                        <AnimatePresence>
                            {!collapsedSections.verification && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    {/* Status Overview */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                Current Status
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        Verification Status
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${verification.status === 'in_review'
                                                        ? 'bg-blue-500/20 text-blue-600'
                                                        : verification.status === 'verified'
                                                            ? 'bg-emerald-500/20 text-emerald-600'
                                                            : 'bg-amber-500/20 text-amber-600'
                                                        }`}>
                                                        {verification.status === 'in_review' ? 'Under Review' :
                                                            verification.status === 'verified' ? 'Verified' : 'Pending Submission'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        Progress
                                                    </span>
                                                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                                                        }`}>
                                                        {verification.progress}%
                                                    </span>
                                                </div>

                                                {verification.submittedAt && (
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            Submitted Date
                                                        </span>
                                                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            {new Date(verification.submittedAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}

                                                {verification.estimatedCompletion && (
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            Estimated Completion
                                                        </span>
                                                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            {new Date(verification.estimatedCompletion).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                Completion Checklist
                                            </h3>
                                            <div className="space-y-3">
                                                {[
                                                    {
                                                        label: 'Personal Information', completed: Object.keys(personalInfo).every(key =>
                                                            ['familyDetails'].includes(key) ? true : personalInfo[key]?.trim() !== '')
                                                    },
                                                    {
                                                        label: 'Bank Details', completed: Object.keys(bankDetails).every(key =>
                                                            ['accountType'].includes(key) ? true : bankDetails[key]?.trim() !== '')
                                                    },
                                                    {
                                                        label: 'Required Documents', completed: Object.entries(documents)
                                                            .filter(([_, doc]) => doc && doc.required)
                                                            .every(([_, doc]) => doc && doc.file)
                                                    }
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
                                        </div>
                                    </div>

                                    {/* Admin Comments */}
                                    {verification.adminComments && verification.adminComments.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                Admin Comments
                                            </h3>

                                            <div className="space-y-4">
                                                {verification.adminComments.map((comment, index) => (
                                                    <motion.div
                                                        key={comment.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                                                            }`}
                                                    >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${comment.type === 'approval'
                                                                    ? 'bg-emerald-500'
                                                                    : comment.type === 'document_issue'
                                                                        ? 'bg-amber-500'
                                                                        : 'bg-blue-500'
                                                                    }`}>
                                                                    {comment.admin?.charAt(0) || 'A'}
                                                                </div>
                                                                <div>
                                                                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                                                                        }`}>
                                                                        {comment.admin || 'Admin'}
                                                                    </p>
                                                                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'
                                                                        }`}>
                                                                        Administrator
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'
                                                                }`}>
                                                                {comment.timestamp}
                                                            </span>
                                                        </div>
                                                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                            {comment.text}
                                                        </p>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-700/20"
                >
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSaveDraft}
                            className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 ${isDark
                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Save size={18} />
                            Save Draft
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleResetForm}
                            className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 ${isDark
                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <RefreshCw size={18} />
                            Reset Form
                        </motion.button>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmitVerification}
                        disabled={isLoading || verification.progress < 100}
                        className={`px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 ${verification.progress < 100
                            ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-600'
                            : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-xl'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <ShieldCheck size={18} />
                                Submit for Verification
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className={`text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}
                >
                    <p>Your information is secure and encrypted. Verification usually takes 24-48 hours.</p>
                    <p className="mt-1">Need help? Contact support at support@donationplatform.com</p>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfileVerificationPage;