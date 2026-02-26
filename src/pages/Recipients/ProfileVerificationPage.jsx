import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    CreditCard,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Upload,
    Calendar,
    AlertCircle,
    Trash2,
    Building,
    Users,
    Lock,
    FileCheck,
    AlertTriangle,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Landmark,
    Hash,
    ShieldCheck,
    ChevronDown,
    ChevronUp,
    Eye,
    EyeOff,
    RefreshCw,
    X,
    IdCard,
    CreditCard as CardIcon
} from 'lucide-react';

// Add this after imports, before any components
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

// Add this function at the top, after imports
const determineStatus = (formData, documents) => {
    // Check if any field is filled
    const hasAnyFieldFilled = () => {
        const fieldsToCheck = [
            'fullName', 'email', 'phone', 'aadhaarNumber', 'panNumber',
            'dateOfBirth', 'address', 'occupation', 'familyDetails',
            'bankName', 'accountNumber', 'ifscCode', 'accountHolderName',
            'branchName', 'upiId', 'accountType'
        ];

        // Check if any field has content
        const hasFieldContent = fieldsToCheck.some(field => {
            const value = formData[field];
            return value && value.toString().trim() !== '';
        });

        // Check if there are documents
        const hasDocuments = Object.values(documents).some(doc => doc && doc.file);

        return hasFieldContent || hasDocuments;
    };

    // Check if all required fields are filled
    const areAllRequiredFieldsFilled = () => {
        const requiredFields = [
            'fullName', 'email', 'phone', 'aadhaarNumber', 'panNumber',
            'dateOfBirth', 'address', 'occupation', 'bankName',
            'accountNumber', 'ifscCode', 'accountHolderName',
            'branchName', 'accountType'
        ];

        // Check all required fields
        const allRequiredFilled = requiredFields.every(field => {
            const value = formData[field];
            return value && value.toString().trim() !== '';
        });

        // Check if all required documents are uploaded
        const allRequiredDocuments = Object.values(documents)
            .filter(doc => doc && doc.required)
            .every(doc => doc && doc.file);

        return allRequiredFilled && allRequiredDocuments;
    };

    // Determine status
    if (!hasAnyFieldFilled()) {
        return 'Unknown';
    } else if (areAllRequiredFieldsFilled()) {
        return 'Pending';
    } else {
        return 'Incomplete';
    }
};

// Add this helper function after the other utility functions
const checkIfAnyFieldFilled = (personalInfo, bankDetails, documents) => {
    // Check personal info fields
    const personalFields = Object.values(personalInfo);
    const hasPersonalInfo = personalFields.some(field =>
        field && field.toString().trim() !== ''
    );

    // Check bank details fields
    const bankFields = Object.values(bankDetails);
    const hasBankDetails = bankFields.some(field =>
        field && field.toString().trim() !== ''
    );

    // Check documents
    const hasDocuments = Object.values(documents).some(doc =>
        doc && doc.files && doc.files.length > 0
    );

    return hasPersonalInfo || hasBankDetails || hasDocuments;
};

// Add this to calculate profile completion percentage
const calculateProfileCompletion = (personalInfo, bankDetails, documents) => {
    let totalFields = 0;
    let completedFields = 0;

    const personalInfoFields = [
        'fullName', 'email', 'phone', 'aadhaarNumber', 'panNumber',
        'dateOfBirth', 'address', 'occupation'
    ];

    personalInfoFields.forEach(field => {
        totalFields++;
        if (personalInfo[field] && personalInfo[field].toString().trim() !== '') {
            completedFields++;
        }
    });

    const bankFields = [
        'bankName', 'accountNumber', 'ifscCode', 'accountHolderName',
        'branchName', 'accountType'
    ];

    bankFields.forEach(field => {
        totalFields++;
        if (bankDetails[field] && bankDetails[field].toString().trim() !== '') {
            completedFields++;
        }
    });

    totalFields++;
    const hasDocuments = Object.values(documents).some(doc => doc && doc.file);
    if (hasDocuments) {
        completedFields++;
    }

    return Math.round((completedFields / totalFields) * 100);
};

// Update the generateDummyProfileData function
const generateDummyProfileData = () => ({
    personalInfo: {
        fullName: 'Rajesh Kumar',
        email: 'rajesh.kumar@example.com',
        phone: '+91-9876543210',
        address: 'House No. 123, MG Road, Bengaluru, Karnataka 560001',
        dateOfBirth: '1985-08-15',
        familyDetails: 'Married with 2 children',
        occupation: 'Software Engineer',
        aadhaarNumber: '123456789012',
        panNumber: 'ABCDE1234F'
    },
    bankDetails: {
        bankName: 'State Bank of India',
        accountNumber: '123456789012',
        ifscCode: 'SBIN0001234',
        accountHolderName: 'Rajesh Kumar',
        branchName: 'MG Road Branch',
        accountType: 'Savings',
        verificationStatus: 'pending',
        upiId: 'rajesh.kumar@oksbi'
    },
    documents: {
        aadhaarCard: {
            id: 1,
            name: 'aadhaar_front.jpg',
            size: '2.4 MB',
            type: 'image/jpeg',
            status: 'verified',
            uploadedAt: '2024-01-10',
            preview: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop'
        },
        panCard: {
            id: 2,
            name: 'pan_card.pdf',
            size: '1.8 MB',
            type: 'application/pdf',
            status: 'uploaded',
            uploadedAt: '2024-01-11',
            preview: null
        },
        addressProof: {
            id: 3,
            name: 'electricity_bill.pdf',
            size: '3.1 MB',
            type: 'application/pdf',
            status: 'rejected',
            uploadedAt: '2024-01-12',
            preview: null,
            rejectionReason: 'Document is outdated, please upload current month bill'
        },
        incomeProof: {
            id: 4,
            name: 'salary_slip.pdf',
            size: '4.2 MB',
            type: 'application/pdf',
            status: 'pending',
            uploadedAt: '2024-01-13',
            preview: null
        },
        bankProof: {
            id: 5,
            name: 'cancelled_cheque.jpg',
            size: '1.5 MB',
            type: 'image/jpeg',
            status: 'pending',
            uploadedAt: '2024-01-14',
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
                text: 'Aadhaar card photo needs clearer picture with all corners visible',
                timestamp: '2024-01-10',
                admin: 'Admin Priya',
                type: 'document_issue'
            },
            {
                id: 2,
                text: 'Bank details verified successfully',
                timestamp: '2024-01-09',
                admin: 'Admin Amit',
                type: 'approval'
            },
            {
                id: 3,
                text: 'Income proof document is outdated, please upload current month document',
                timestamp: '2024-01-08',
                admin: 'Admin Rohan',
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
    disabled = false,
    isDark,
    progress,
    multiple = false,
    maxFiles = 2
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

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        if (disabled) return;
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            handleFileSelect(droppedFiles);
        }
    };

    const handleFileSelect = (selectedFiles) => {
        const files = multiple ? selectedFiles : [selectedFiles[0]];

        // Check if adding these files would exceed maxFiles limit
        if (multiple && file && file.length + files.length > maxFiles) {
            alert(`You can only upload a maximum of ${maxFiles} files for ${title}`);
            return;
        }

        const validFiles = [];
        const errors = [];

        files.forEach((selectedFile) => {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!validTypes.includes(selectedFile.type)) {
                errors.push(`${selectedFile.name}: Only ${acceptedTypes} files are allowed`);
                return;
            }

            // Validate file size
            const maxSize = maxSizeMB * 1024 * 1024;
            if (selectedFile.size > maxSize) {
                errors.push(`${selectedFile.name}: File size must be less than ${maxSizeMB}MB`);
                return;
            }

            validFiles.push(selectedFile);
        });

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        if (validFiles.length > 0) {
            onUpload(validFiles);
        }
    };

    const handleClick = () => {
        if (disabled) return;
        fileInputRef.current?.click();
    };

    const handleDragOver = (e) => {
        if (disabled) return;
        e.preventDefault();
        setIsDragging(true);
    };

    const handleRemoveFile = (e, fileName) => {
        e.stopPropagation();
        onRemove(fileName);
    };

    return (
        <div className={`space-y-3 ${error ? 'animate-pulse' : ''} ${disabled ? 'opacity-60' : ''}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                        {title}
                    </h4>
                    {required && <span className="text-rose-500 text-sm">*</span>}
                    {multiple && (
                        <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                            Max {maxFiles} files
                        </span>
                    )}
                </div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusConfig.bgColor} ${statusConfig.textColor}`}
                >
                    <StatusIcon size={12} />
                    <span>{statusConfig.text}</span>
                </motion.div>
            </div>

            {/* Description */}
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {description}
            </p>

            {/* Upload Area */}
            <div
                className={`relative border-2 border-dashed rounded-xl transition-all ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${isDragging
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 scale-105'
                    : isDark
                        ? 'border-gray-600 bg-gray-800 hover:border-violet-500'
                        : 'border-gray-300 bg-gray-50 hover:border-violet-400'
                    } ${error ? 'border-rose-500 ring-2 ring-rose-500/20' : ''} ${disabled ? 'hover:border-gray-300 dark:hover:border-gray-600' : ''}`}
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => e.target.files && handleFileSelect(Array.from(e.target.files))}
                    accept={acceptedTypes}
                    className="hidden"
                    multiple={multiple}
                />

                {progress !== undefined ? (
                    // Upload Progress
                    <div className="p-8 text-center">
                        <div className="relative w-20 h-20 mx-auto mb-4">
                            {/* Progress circle */}
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
                ) : file && file.length > 0 ? (
                    // Files Uploaded - Show files list
                    <div className="p-5">
                        <div className="space-y-3">
                            {file.map((fileItem, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                        <FileText size={20} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {fileItem.name}
                                        </p>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {fileItem.size} • {fileItem.type}
                                        </p>
                                        {status === 'rejected' && (
                                            <p className="text-sm text-rose-600 mt-1 flex items-center gap-1">
                                                <AlertCircle size={12} />
                                                Please upload a clearer document
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            onClick={(e) => handleRemoveFile(e, fileItem.name)}
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
                            ))}
                        </div>
                        {multiple && file.length < maxFiles && (
                            <div className="mt-4 text-center">
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    You can upload {maxFiles - file.length} more file(s)
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    // Empty Upload Area
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
                                {multiple ? 'Drag & drop or click to upload multiple files' : 'Drag & drop or click to upload'}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                Max size: {maxSizeMB}MB • {acceptedTypes}
                                {multiple && ` • Max ${maxFiles} files`}
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

// Update the existing validation object with these enhanced validators:
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
        const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9]*[._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]([a-zA-Z0-9]*[-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address';
        return null;
    },

    phone: (value) => {
        if (!value.trim()) return 'Phone number is required';
        // Indian phone number validation
        const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/;
        const cleanValue = value.replace(/[- ]/g, '');
        if (!phoneRegex.test(cleanValue)) return 'Please enter a valid Indian phone number (e.g., +919876543210 or 9876543210)';
        return null;
    },

    aadhaarNumber: (value) => {
        if (!value.trim()) return 'Aadhaar Number is required';
        const digits = value.replace(/\D/g, '');
        if (digits.length !== 12) return 'Aadhaar Number must be 12 digits';
        if (!/^[2-9]{1}[0-9]{11}$/.test(digits)) return 'Please enter a valid 12-digit Aadhaar number';
        return null;
    },

    panNumber: (value) => {
        if (!value.trim()) return 'PAN Number is required';
        const upperValue = value.toUpperCase();
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(upperValue)) return 'Invalid PAN Number format (e.g., ABCDE1234F)';
        return null;
    },

    dateOfBirth: (value) => {
        if (!value) return 'Date of Birth is required';
        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();

        if (dob > today) return 'Date of Birth cannot be in the future';
        if (age < 18) return 'Must be at least 18 years old';
        return null;
    },

    address: (value) => {
        if (!value.trim()) return 'Address is required';
        const addressRegex = /^[A-Za-z][A-Za-z\s.,'"/-]*([A-Za-z]|\d)*$/;
        if (!addressRegex.test(value.trim())) return 'Address must start with a letter';
        if (value.trim().length < 10) return 'Address must be at least 10 characters';
        return null;
    },

    bankName: (value) => {
        if (!value.trim()) return 'Bank Name is required';
        return null;
    },

    accountNumber: (value) => {
        if (!value.trim()) return 'Account Number is required';
        if (value.length < 9 || value.length > 18) return 'Account Number must be 9-18 digits';
        return null;
    },

    ifscCode: (value) => {
        if (!value.trim()) return 'IFSC Code is required';
        const upperValue = value.toUpperCase();
        if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(upperValue)) return 'Invalid IFSC Code format (e.g., SBIN0001234)';
        return null;
    },

    accountHolderName: (value) => {
        if (!value.trim()) return 'Account Holder Name is required';
        return null;
    },

    branchName: (value) => {
        if (!value.trim()) return 'Branch Name is required';
        return null;
    },

    accountType: (value) => {
        if (!value.trim()) return 'Account Type is required';
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

// ==================== CONFIRMATION DIALOG COMPONENT ====================
const ConfirmationDialog = ({ isDark, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => {
    // Add a local handler for cancel
    const handleCancel = (e) => {
        e?.stopPropagation();
        if (onCancel) {
            onCancel();
        }
    };

    // Add a local handler for confirm
    const handleConfirm = (e) => {
        e?.stopPropagation();
        if (onConfirm) {
            onConfirm();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            style={{ margin: 0, padding: 0 }}
            onClick={handleCancel} // Clicking overlay cancels
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
                            onClick={handleCancel}
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
                            onClick={handleCancel}
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
                            onClick={handleConfirm}
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
};

const shouldDisableDocumentUploads = () => {
    return profileStatus === 'Verified' || profileStatus === 'Under Review' || profileStatus === 'Submitted';
};

const handleConfirmationCancel = () => {
    setShowConfirmation(false);
};

const ProfileVerificationPage = ({ isDark = false }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationConfig, setConfirmationConfig] = useState({
        title: '',
        message: '',
        onConfirm: () => { },
        confirmText: 'Confirm',
        cancelText: 'Cancel'
    });
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
        occupation: '',
        aadhaarNumber: '',
        panNumber: ''
    });

    const [bankDetails, setBankDetails] = useState({
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        branchName: '',
        accountType: '',
        upiId: ''
    });

    const [documents, setDocuments] = useState({
        aadhaarCard: { files: [], status: 'pending', progress: null, required: true },
        panCard: { files: [], status: 'pending', progress: null, required: true },
        addressProof: { files: [], status: 'pending', progress: null, required: true },
        incomeProof: { files: [], status: 'pending', progress: null, required: true },
        bankProof: { files: [], status: 'pending', progress: null, required: false }
    });

    const [profileStatus, setProfileStatus] = useState('Unknown');
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [completionChecklist, setCompletionChecklist] = useState({
        personalInfo: false,
        bankDetails: false,
        requiredDocuments: false
    });

    // Add this useEffect after ALL state declarations
    useEffect(() => {
        // Calculate completion percentage
        const percentage = calculateProfileCompletion(personalInfo, bankDetails, documents);
        setCompletionPercentage(percentage);

        // Calculate checklist
        const checklist = {
            personalInfo: ['fullName', 'email', 'phone', 'aadhaarNumber', 'panNumber',
                'dateOfBirth', 'address', 'occupation'].every(
                    field => personalInfo[field] && personalInfo[field].toString().trim() !== ''
                ),
            bankDetails: ['bankName', 'accountNumber', 'ifscCode', 'accountHolderName',
                'branchName', 'accountType'].every(
                    field => bankDetails[field] && bankDetails[field].toString().trim() !== ''
                ),
            requiredDocuments: Object.values(documents).some(doc => doc && doc.file)
        };
        setCompletionChecklist(checklist);

        // Create combined form data
        const combinedFormData = {
            ...personalInfo,
            ...bankDetails
        };

        // Determine status
        const newStatus = determineStatus(combinedFormData, documents);
        setProfileStatus(newStatus);
    }, [personalInfo, bankDetails, documents]);

    // This should be your first useEffect (scroll to top)
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

    useEffect(() => {
        const dummyData = generateDummyProfileData();
        setPersonalInfo(dummyData.personalInfo);
        setBankDetails(dummyData.bankDetails);
        setVerification(dummyData.verification);

        const dummyDocs = dummyData.documents;

        // Add this helper function
        const formatFileSize = (sizeString) => {
            const match = sizeString?.match(/(\d+\.?\d*)\s*(MB|KB|B)/i);
            if (match) {
                const size = parseFloat(match[1]);
                const unit = match[2].toUpperCase();
                return { size, unit };
            }
            return { size: 0, unit: 'B' };
        };

        // Update the createMockFile function to handle file objects better
        const createMockFile = (name, sizeString, type) => {
            const { size, unit } = formatFileSize(sizeString);
            let sizeInBytes;

            switch (unit) {
                case 'MB':
                    sizeInBytes = size * 1024 * 1024;
                    break;
                case 'KB':
                    sizeInBytes = size * 1024;
                    break;
                default:
                    sizeInBytes = size;
            }

            return {
                name,
                size: sizeString,
                type,
                id: Date.now() + Math.random(),
                fileObject: new File([new ArrayBuffer(sizeInBytes)], name, { type })
            };
        };

        setDocuments({
            aadhaarCard: {
                files: dummyDocs.aadhaarCard ? [
                    createMockFile(
                        dummyDocs.aadhaarCard.name,
                        dummyDocs.aadhaarCard.size,
                        dummyDocs.aadhaarCard.type
                    ),
                    createMockFile(
                        'aadhaar_back.jpg',
                        '2.1 MB',
                        'image/jpeg'
                    )
                ] : [],
                status: dummyDocs.aadhaarCard?.status || 'pending',
                progress: null,
                required: true
            },
            panCard: {
                files: dummyDocs.panCard ? [
                    createMockFile(
                        dummyDocs.panCard.name,
                        dummyDocs.panCard.size,
                        dummyDocs.panCard.type
                    )
                ] : [],
                status: dummyDocs.panCard?.status || 'pending',
                progress: null,
                required: true
            },
            addressProof: {
                files: dummyDocs.addressProof ? [
                    createMockFile(
                        dummyDocs.addressProof.name,
                        dummyDocs.addressProof.size,
                        dummyDocs.addressProof.type
                    )
                ] : [],
                status: dummyDocs.addressProof?.status || 'pending',
                progress: null,
                required: true
            },
            incomeProof: {
                files: dummyDocs.incomeProof ? [
                    createMockFile(
                        dummyDocs.incomeProof.name,
                        dummyDocs.incomeProof.size,
                        dummyDocs.incomeProof.type
                    )
                ] : [],
                status: dummyDocs.incomeProof?.status || 'pending',
                progress: null,
                required: true
            },
            bankProof: {
                files: dummyDocs.bankProof ? [
                    createMockFile(
                        dummyDocs.bankProof.name,
                        dummyDocs.bankProof.size,
                        dummyDocs.bankProof.type
                    )
                ] : [],
                status: dummyDocs.bankProof?.status || 'pending',
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

            // Personal Info (35%)
            const personalInfoFields = ['fullName', 'email', 'phone', 'address', 'dateOfBirth', 'occupation', 'aadhaarNumber'];
            const personalInfoComplete = personalInfoFields.filter(field =>
                personalInfo[field] && personalInfo[field].trim() !== ''
            ).length;
            progress += (personalInfoComplete / personalInfoFields.length) * 35;

            // Bank Details (30%)
            const bankFields = ['bankName', 'accountNumber', 'ifscCode', 'accountHolderName', 'branchName'];
            const bankComplete = bankFields.filter(field =>
                bankDetails[field] && bankDetails[field].trim() !== ''
            ).length;
            progress += (bankComplete / bankFields.length) * 30;

            // Documents (35%)
            const requiredDocs = Object.values(documents).filter(doc => doc && doc.required);
            const uploadedDocs = requiredDocs.filter(doc => doc && doc.file).length;
            progress += (uploadedDocs / requiredDocs.length) * 35;

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
                if (processedValue.startsWith('91')) {
                    processedValue = '+' + processedValue;
                } else if (processedValue.startsWith('0')) {
                    processedValue = '+91' + processedValue.slice(1);
                }
                break;
            case 'occupation':
                processedValue = value.replace(/[^A-Za-z\s-]/g, '');
                break;
            case 'aadhaarNumber':
                processedValue = value.replace(/\D/g, '').slice(0, 12);
                break;
            case 'panNumber':
                processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
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
            case 'ifscCode':
                processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                processedValue = processedValue.slice(0, 11);
                break;
            case 'accountHolderName':
                processedValue = value.replace(/[^A-Za-z\s.'-]/g, '');
                break;
            case 'branchName':
                processedValue = value.replace(/[^A-Za-z\s&.,'-]/g, '');
                break;
            case 'upiId':
                processedValue = value.toLowerCase();
                break;
            default:
                break;
        }

        setBankDetails(prev => ({ ...prev, [field]: processedValue }));

        if (errors.bankDetails && errors.bankDetails[field]) {
            setErrors(prev => ({
                ...prev,
                bankDetails: { ...prev.bankDetails, [field]: null }
            }));
        }
    };

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
                case 'aadhaarNumber':
                    error = validation.aadhaarNumber(value);
                    break;
                case 'panNumber':
                    error = validation.panNumber(value);
                    break;
                case 'occupation':
                    error = validation.occupation(value);
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
                case 'ifscCode':
                    error = validation.ifscCode(value);
                    break;
                case 'accountHolderName':
                    error = validation.accountHolder(value);
                    break;
                case 'branchName':
                    error = validation.branchName(value);
                    break;
                case 'accountType':
                    error = validation.accountType(value);
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

    const handleDocumentUpload = async (docType, uploadedFiles) => {
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];

        const validFiles = [];
        const errors = [];

        uploadedFiles.forEach(file => {
            if (!validTypes.includes(file.type)) {
                errors.push(`${file.name}: Only JPG, PNG, and PDF files are allowed`);
                return;
            }

            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                errors.push(`${file.name}: File size must be less than 5MB`);
                return;
            }

            validFiles.push(file);
        });

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        // Clear any existing errors
        setErrors(prev => ({
            ...prev,
            documents: { ...(prev.documents || {}), [docType]: null }
        }));

        // Set progress state for all files
        setDocuments(prev => ({
            ...prev,
            [docType]: {
                ...(prev[docType] || {}),
                progress: 0
            }
        }));

        // Simulate upload progress
        for (let i = 0; i <= 100; i += 25) {
            await new Promise(resolve => setTimeout(resolve, 200));
            setDocuments(prev => ({
                ...prev,
                [docType]: {
                    ...(prev[docType] || {}),
                    progress: i
                }
            }));
        }

        // Add files to the existing ones
        const newFiles = validFiles.map(file => ({
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            type: file.type,
            id: Date.now() + Math.random(), // Unique ID for each file
            fileObject: file // Store the actual file object for download
        }));

        setDocuments(prev => ({
            ...prev,
            [docType]: {
                ...(prev[docType] || {}),
                files: [...(prev[docType]?.files || []), ...newFiles],
                status: 'uploaded',
                progress: null
            }
        }));
    };

    const handleDocumentRemove = (docType, fileName) => {
        if (shouldDisableDocumentUploads()) return;

        setDocuments(prev => ({
            ...prev,
            [docType]: {
                ...(prev[docType] || {}),
                files: (prev[docType]?.files || []).filter(file => file.name !== fileName)
            }
        }));
    };

    const handleDocumentDownload = (file) => {
        if (file.fileObject) {
            // Create a download link for the actual file
            const url = URL.createObjectURL(file.fileObject);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            // For demo purposes, show an alert
            alert(`Downloading ${file.name}`);
        }
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
            if (field === 'accountType' || field === 'upiId') return;

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
                newErrors.documents[docType] = `${docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace('Card', ' Card')} is required`;
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

    // Add this function
    const shouldDisableFormFields = () => {
        return profileStatus === 'Verified' || profileStatus === 'Under Review';
    };

    const handleSubmitVerification = async () => {
        // Don't allow submission if profile is already verified or under review
        if (profileStatus === 'Verified' || profileStatus === 'Under Review' || profileStatus === 'Submitted') {
            showDialogWithMessage('Profile already submitted or verified');
            return;
        }

        // Check if form is 100% complete
        if (completionPercentage < 100) {
            showDialogWithMessage('Please complete all required fields and upload all documents before submitting');
            return;
        }

        // Show confirmation dialog for submission
        setConfirmationConfig({
            title: 'Submit for Verification',
            message: 'Are you sure you want to submit your profile for verification? You will not be able to edit after submission.',
            onConfirm: async () => {
                setShowConfirmation(false);

                if (!validateForm()) {
                    showDialogWithMessage('Please fix all errors before submitting');
                    return;
                }

                setIsLoading(true);

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Update status to "Submitted"
                setProfileStatus('Submitted');

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
                showDialogWithMessage('Profile submitted for verification successfully! Status changed to "Submitted"');
            },
            confirmText: 'Submit',
            cancelText: 'Cancel'
        });

        setShowConfirmation(true);
    };

    const shouldDisableClearButton = () => {
        if (profileStatus === 'Verified' || profileStatus === 'Under Review' || profileStatus === 'Submitted') {
            return true;
        }

        return !checkIfAnyFieldFilled(personalInfo, bankDetails, documents);
    };

    const handleResetForm = () => {
        // Don't reset if profile is verified or under review
        if (profileStatus === 'Verified' || profileStatus === 'Under Review' || profileStatus === 'Submitted') {
            showDialogWithMessage('Cannot reset form after submission or verification');
            return;
        }

        // Don't reset if no fields are filled
        if (!checkIfAnyFieldFilled(personalInfo, bankDetails, documents)) {
            showDialogWithMessage('No data to clear');
            return;
        }

        // Show confirmation dialog
        setConfirmationConfig({
            title: 'Clear Form',
            message: 'Are you sure you want to clear all form data? This action cannot be undone.',
            onConfirm: () => {
                // Perform the actual reset
                setPersonalInfo({
                    fullName: '',
                    email: '',
                    phone: '',
                    address: '',
                    dateOfBirth: '',
                    familyDetails: '',
                    occupation: '',
                    aadhaarNumber: '',
                    panNumber: ''
                });

                setBankDetails({
                    bankName: '',
                    accountNumber: '',
                    ifscCode: '',
                    accountHolderName: '',
                    branchName: '',
                    accountType: '',
                    upiId: ''
                });

                setDocuments({
                    aadhaarCard: { files: [], status: 'pending', progress: null, required: true },
                    panCard: { files: [], status: 'pending', progress: null, required: true },
                    addressProof: { files: [], status: 'pending', progress: null, required: true },
                    incomeProof: { files: [], status: 'pending', progress: null, required: true },
                    bankProof: { files: [], status: 'pending', progress: null, required: false }
                });

                setErrors({
                    personalInfo: {},
                    bankDetails: {},
                    documents: {}
                });

                localStorage.removeItem('profileVerificationDraft');

                // Close confirmation dialog
                setShowConfirmation(false);

                // Show success message
                showDialogWithMessage('Form cleared successfully!');
            },
            confirmText: 'Clear All',
            cancelText: 'Cancel'
        });

        setShowConfirmation(true);
    };

    // Toggle section collapse
    const toggleSection = (section) => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

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

    const uploadedDocsCount = Object.values(documents || {}).reduce((total, doc) => {
        return total + (doc?.files?.length || 0);
    }, 0);
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

                {showConfirmation && (
                    <ConfirmationDialog
                        isDark={isDark}
                        title={confirmationConfig.title}
                        message={confirmationConfig.message}
                        onConfirm={() => {
                            confirmationConfig.onConfirm();
                            setShowConfirmation(false);
                        }}
                        onCancel={() => setShowConfirmation(false)}
                        confirmText={confirmationConfig.confirmText}
                        cancelText={confirmationConfig.cancelText}
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
                                        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${profileStatus === 'Unknown'
                                            ? 'bg-gray-500/20 text-gray-600'
                                            : profileStatus === 'Incomplete'
                                                ? 'bg-amber-500/20 text-amber-600'
                                                : profileStatus === 'Pending'
                                                    ? 'bg-amber-500/20 text-amber-600'
                                                    : profileStatus === 'Submitted'
                                                        ? 'bg-blue-500/20 text-blue-600'
                                                        : profileStatus === 'Under Review'
                                                            ? 'bg-purple-500/20 text-purple-600'
                                                            : profileStatus === 'Verified'
                                                                ? 'bg-emerald-500/20 text-emerald-600'
                                                                : profileStatus === 'Rejected'
                                                                    ? 'bg-rose-500/20 text-rose-600'
                                                                    : 'bg-gray-500/20 text-gray-600'
                                            }`}>
                                            {profileStatus}
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
                                        <div className="md:col-span-1" style={{ marginLeft: '16px' }}>
                                            <FormField
                                                label="Full Name"
                                                value={personalInfo.fullName}
                                                onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                                                onBlur={() => handleFieldBlur('personalInfo', 'fullName', personalInfo.fullName)}
                                                error={errors.personalInfo?.fullName}
                                                placeholder="Rajesh Kumar"
                                                required
                                                icon={User}
                                                isDark={isDark}
                                                shake={shakeFields.personalInfo?.includes('fullName')}
                                                validate={(value) => /^[A-Za-z\s.'-]*$/.test(value)}
                                                maxLength={50}
                                                disabled={shouldDisableFormFields()}
                                            />
                                        </div>

                                        <div className="md:col-span-1" style={{ marginRight: '16px' }}>
                                            <FormField
                                                label="Email Address"
                                                type="email"
                                                value={personalInfo.email}
                                                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                                                onBlur={() => handleFieldBlur('personalInfo', 'email', personalInfo.email)}
                                                error={errors.personalInfo?.email}
                                                placeholder="rajesh.kumar@example.com"
                                                required
                                                icon={Mail}
                                                isDark={isDark}
                                                shake={shakeFields.personalInfo?.includes('email')}
                                                disabled={shouldDisableFormFields()}
                                            />
                                        </div>

                                        <div className="md:col-span-1" style={{ marginLeft: '16px' }}>
                                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
                                                    Phone Number
                                                    <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                                                </div>
                                            </label>
                                            <motion.div
                                                animate={shakeFields.personalInfo?.includes('phone') ? "shake" : "initial"}
                                                variants={shakeAnimation}
                                                className="overflow-visible"
                                            >
                                                <div className="flex gap-2 sm:gap-1">
                                                    <div className="flex-shrink-0">
                                                        <div className={`h-[48px] flex items-center px-3 rounded-2xl border-2 text-sm font-medium ${isDark
                                                            ? 'bg-gray-700 border-gray-600'
                                                            : 'bg-white border-gray-200'
                                                            } ${errors.personalInfo?.phone ? 'border-rose-500' : ''} ${shouldDisableFormFields() ? 'opacity-60' : ''}`}>
                                                            <div className={`flex items-center gap-2 ${personalInfo.phone && personalInfo.phone.replace(/\D/g, '').length > 0
                                                                ? (isDark ? 'text-white' : 'text-gray-900')
                                                                : (isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]')
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
                                                            value={personalInfo.phone}
                                                            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                                                            onBlur={() => handleFieldBlur('personalInfo', 'phone', personalInfo.phone)}
                                                            placeholder="98765-43210"
                                                            maxLength={10}
                                                            autoComplete="off"
                                                            readOnly={shouldDisableFormFields()}
                                                            onFocus={(e) => {
                                                                if (!shouldDisableFormFields()) {
                                                                    e.target.removeAttribute('readonly');
                                                                }
                                                            }}
                                                            disabled={shouldDisableFormFields()}
                                                            className={`w-full h-[48px] p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                                                                : 'bg-white border-gray-200 text-gray-900 placeholder-[#9CA3AF]'
                                                                } ${errors.personalInfo?.phone ? 'border-rose-500' : ''} ${shouldDisableFormFields() ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                        />
                                                        <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-[#9CA3AF]'}`}>
                                                            {personalInfo.phone ? personalInfo.phone.replace(/\D/g, '').length : 0}/10
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                            {errors.personalInfo?.phone && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                                                >
                                                    <AlertCircle size={12} />
                                                    {errors.personalInfo.phone}
                                                </motion.p>
                                            )}
                                        </div>

                                        <div className="md:col-span-1" style={{ marginRight: '16px' }}>
                                            <FormField
                                                label="Aadhaar Number"
                                                value={personalInfo.aadhaarNumber}
                                                onChange={(e) => handlePersonalInfoChange('aadhaarNumber', e.target.value)}
                                                onBlur={() => handleFieldBlur('personalInfo', 'aadhaarNumber', personalInfo.aadhaarNumber)}
                                                error={errors.personalInfo?.aadhaarNumber}
                                                placeholder="123456789012"
                                                required
                                                icon={IdCard}
                                                isDark={isDark}
                                                shake={shakeFields.personalInfo?.includes('aadhaarNumber')}
                                                validate={(value) => /^\d*$/.test(value)}
                                                maxLength={12}
                                                disabled={shouldDisableFormFields()}
                                            />
                                        </div>

                                        <div className="md:col-span-1" style={{ marginLeft: '16px' }}>
                                            <FormField
                                                label="PAN Number"
                                                value={personalInfo.panNumber}
                                                onChange={(e) => handlePersonalInfoChange('panNumber', e.target.value)}
                                                onBlur={() => handleFieldBlur('personalInfo', 'panNumber', personalInfo.panNumber)}
                                                error={errors.personalInfo?.panNumber}
                                                placeholder="ABCDE1234F"
                                                required
                                                icon={CardIcon}
                                                isDark={isDark}
                                                shake={shakeFields.personalInfo?.includes('panNumber')}
                                                validate={(value) => /^[A-Za-z0-9]*$/.test(value)}
                                                maxLength={10}
                                                disabled={shouldDisableFormFields()}
                                            />
                                        </div>

                                        <div className="md:col-span-1" style={{ marginRight: '16px' }}>
                                            <div className="overflow-visible">
                                                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
                                                        Date of Birth
                                                        <span className="text-rose-500 font-normal normal-case">*</span>
                                                    </div>
                                                </label>
                                                <motion.div
                                                    animate={shakeFields.personalInfo?.includes('dateOfBirth') ? "shake" : "initial"}
                                                    variants={shakeAnimation}
                                                    className="overflow-visible"
                                                >
                                                    <input
                                                        type="date"
                                                        name="dateOfBirth"
                                                        value={personalInfo.dateOfBirth}
                                                        onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                                                        onBlur={() => handleFieldBlur('personalInfo', 'dateOfBirth', personalInfo.dateOfBirth)}
                                                        autoComplete="off"
                                                        onFocus={(e) => {
                                                            if (!shouldDisableFormFields()) {
                                                                e.target.removeAttribute('readonly');
                                                            }
                                                        }}
                                                        disabled={shouldDisableFormFields()}
                                                        className={`date-field w-full px-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                                            ? 'bg-gray-700 border-gray-600 text-white'
                                                            : 'bg-white border-gray-200 text-gray-900'
                                                            } ${errors.personalInfo?.dateOfBirth ? 'border-rose-500' : ''}`}
                                                        style={{
                                                            color: personalInfo.dateOfBirth ? '' : (isDark ? '#6B7280' : '#9CA3AF ')
                                                        }}
                                                        max={new Date().toISOString().split('T')[0]}
                                                    />
                                                    <style jsx>{`
                                                        .date-field::-webkit-calendar-picker-indicator {
                                                            ${isDark
                                                            ? 'filter: invert(54%) sepia(10%) saturate(491%) hue-rotate(174deg) brightness(95%) contrast(85%);'
                                                            : 'filter: invert(54%) sepia(10%) saturate(491%) hue-rotate(174deg) brightness(95%) contrast(85%);'
                                                        }
                                                        }
                                                    `}</style>
                                                </motion.div>
                                                {errors.personalInfo?.dateOfBirth && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                                                    >
                                                        <XCircle size={12} />
                                                        {errors.personalInfo.dateOfBirth}
                                                    </motion.p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="md:col-span-1" style={{ marginLeft: '16px' }}>
                                            <FormField
                                                label="Address"
                                                type="textarea"
                                                value={personalInfo.address}
                                                onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                                                onBlur={() => handleFieldBlur('personalInfo', 'address', personalInfo.address)}
                                                error={errors.personalInfo?.address}
                                                placeholder="House No. 123, MG Road, Bengaluru, Karnataka 560001"
                                                required
                                                icon={MapPin}
                                                isDark={isDark}
                                                shake={shakeFields.personalInfo?.includes('address')}
                                                maxLength={200}
                                                autoFocus={false}
                                                disabled={shouldDisableFormFields()}
                                            />
                                        </div>

                                        <div className="md:col-span-1" style={{ marginRight: '16px' }}>
                                            <FormField
                                                label="Family Details (Optional)"
                                                type="textarea"
                                                value={personalInfo.familyDetails}
                                                onChange={(e) => handlePersonalInfoChange('familyDetails', e.target.value)}
                                                placeholder="Tell us about your family members and dependents"
                                                icon={Users}
                                                isDark={isDark}
                                                maxLength={500}
                                                disabled={shouldDisableFormFields()}
                                            />
                                        </div>

                                        <div className="md:col-span-2 mb-4" style={{ marginLeft: '16px', marginRight: '16px' }}>
                                            <FormField
                                                label="Occupation"
                                                value={personalInfo.occupation}
                                                onChange={(e) => handlePersonalInfoChange('occupation', e.target.value)}
                                                onBlur={() => handleFieldBlur('personalInfo', 'occupation', personalInfo.occupation)}
                                                error={errors.personalInfo?.occupation}
                                                placeholder="Software Engineer"
                                                required
                                                icon={Briefcase}
                                                isDark={isDark}
                                                shake={shakeFields.personalInfo?.includes('occupation')}
                                                maxLength={50}
                                                disabled={shouldDisableFormFields()}
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
                                        <div className="md:col-span-1" style={{ marginLeft: '16px' }}>
                                            <FormField
                                                label="Bank Name"
                                                value={bankDetails.bankName}
                                                onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                                                onBlur={() => handleFieldBlur('bankDetails', 'bankName', bankDetails.bankName)}
                                                error={errors.bankDetails?.bankName}
                                                placeholder="State Bank of India"
                                                required
                                                icon={Landmark}
                                                isDark={isDark}
                                                shake={shakeFields.bankDetails?.includes('bankName')}
                                                validate={(value) => /^[A-Za-z\s&.,'-]*$/.test(value)}
                                                maxLength={100}
                                                disabled={shouldDisableFormFields()}
                                            />
                                        </div>

                                        <div className="md:col-span-1" style={{ marginRight: '16px' }}>
                                            <FormField
                                                label="Account Number"
                                                value={bankDetails.accountNumber}
                                                onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                                                onBlur={() => handleFieldBlur('bankDetails', 'accountNumber', bankDetails.accountNumber)}
                                                error={errors.bankDetails?.accountNumber}
                                                placeholder="123456789012"
                                                required
                                                icon={Hash}
                                                isDark={isDark}
                                                shake={shakeFields.bankDetails?.includes('accountNumber')}
                                                validate={(value) => /^\d*$/.test(value)}
                                                maxLength={18}
                                                disabled={shouldDisableFormFields()}
                                            />
                                        </div>

                                        <div className="md:col-span-1" style={{ marginLeft: '16px' }}>
                                            <FormField
                                                label="IFSC Code"
                                                value={bankDetails.ifscCode}
                                                onChange={(e) => handleBankDetailsChange('ifscCode', e.target.value)}
                                                onBlur={() => handleFieldBlur('bankDetails', 'ifscCode', bankDetails.ifscCode)}
                                                error={errors.bankDetails?.ifscCode}
                                                placeholder="SBIN0001234"
                                                required
                                                icon={Hash}
                                                isDark={isDark}
                                                shake={shakeFields.bankDetails?.includes('ifscCode')}
                                                validate={(value) => /^[A-Za-z0-9]*$/.test(value)}
                                                maxLength={11}
                                                disabled={shouldDisableFormFields()}
                                            />
                                        </div>

                                        <div className="md:col-span-1" style={{ marginRight: '16px' }}>
                                            <FormField
                                                label="Account Holder Name"
                                                value={bankDetails.accountHolderName}
                                                onChange={(e) => handleBankDetailsChange('accountHolderName', e.target.value)}
                                                onBlur={() => handleFieldBlur('bankDetails', 'accountHolderName', bankDetails.accountHolderName)}
                                                error={errors.bankDetails?.accountHolderName}
                                                placeholder="Rajesh Kumar"
                                                required
                                                icon={User}
                                                isDark={isDark}
                                                shake={shakeFields.bankDetails?.includes('accountHolderName')}
                                                validate={(value) => /^[A-Za-z\s.'-]*$/.test(value)}
                                                maxLength={50}
                                                disabled={shouldDisableFormFields()}
                                            />
                                        </div>

                                        <div className="md:col-span-1" style={{ marginLeft: '16px' }}>
                                            <FormField
                                                label="Branch Name"
                                                value={bankDetails.branchName}
                                                onChange={(e) => handleBankDetailsChange('branchName', e.target.value)}
                                                onBlur={() => handleFieldBlur('bankDetails', 'branchName', bankDetails.branchName)}
                                                error={errors.bankDetails?.branchName}
                                                placeholder="MG Road Branch"
                                                required
                                                icon={Building}
                                                isDark={isDark}
                                                shake={shakeFields.bankDetails?.includes('branchName')}
                                                validate={(value) => /^[A-Za-z\s&.,'-]*$/.test(value)}
                                                maxLength={50}
                                                disabled={shouldDisableFormFields()}
                                            />
                                        </div>

                                        <div className="md:col-span-1" style={{ marginRight: '16px' }}>
                                            <FormField
                                                label="UPI ID (Optional)"
                                                value={bankDetails.upiId}
                                                onChange={(e) => handleBankDetailsChange('upiId', e.target.value)}
                                                placeholder="rajesh.kumar@oksbi"
                                                icon={CreditCard}
                                                isDark={isDark}
                                                maxLength={50}
                                                disabled={shouldDisableFormFields()}
                                            />
                                        </div>

                                        <div className="md:col-span-2" style={{ marginLeft: '16px', marginRight: '16px' }}>
                                            <div className="relative">
                                                <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-2 mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    <Landmark size={14} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
                                                    Account Type
                                                    <span className="text-red-500">*</span>
                                                </label>

                                                <motion.div
                                                    animate={shakeFields.bankDetails?.includes('accountType') ? "shake" : "initial"}
                                                    variants={{
                                                        initial: { x: 0 },
                                                        shake: {
                                                            x: [0, -10, 10, -10, 10, 0],
                                                            transition: {
                                                                duration: 0.6,
                                                                ease: "easeInOut"
                                                            }
                                                        }
                                                    }}
                                                    className="relative"
                                                >
                                                    <select
                                                        value={bankDetails.accountType}
                                                        onChange={(e) => setBankDetails(prev => ({ ...prev, accountType: e.target.value }))}
                                                        onBlur={() => handleFieldBlur('bankDetails', 'accountType', bankDetails.accountType)}
                                                        disabled={shouldDisableFormFields()}
                                                        className={`w-full px-4 py-3 pl-4 rounded-xl text-sm font-medium transition-all appearance-none ${isDark
                                                            ? 'bg-gray-700 border-gray-600'
                                                            : 'bg-white border-gray-200'
                                                            } border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none ${bankDetails.accountType === ""
                                                                ? (isDark ? 'text-[#9CA3AF]' : 'text-[#9CA3AF]')
                                                                : (isDark ? 'text-white' : 'text-gray-900')
                                                            } ${errors.bankDetails?.accountType ? 'border-red-500' : ''} ${shouldDisableFormFields() ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                    >
                                                        <option value="">
                                                            Select Account Type...
                                                        </option>
                                                        <option value="Savings" className={isDark ? 'text-white bg-gray-700' : 'text-gray-900 bg-white'}>
                                                            Savings Account
                                                        </option>
                                                        <option value="Current" className={isDark ? 'text-white bg-gray-700' : 'text-gray-900 bg-white'}>
                                                            Current Account
                                                        </option>
                                                        <option value="Salary" className={isDark ? 'text-white bg-gray-700' : 'text-gray-900 bg-white'}>
                                                            Salary Account
                                                        </option>
                                                        <option value="Joint" className={isDark ? 'text-white bg-gray-700' : 'text-gray-900 bg-white'}>
                                                            Joint Account
                                                        </option>
                                                        <option value="NRI" className={isDark ? 'text-white bg-gray-700' : 'text-gray-900 bg-white'}>
                                                            NRI Account
                                                        </option>
                                                    </select>

                                                    {/* Custom dropdown arrow */}
                                                    <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        <ChevronDown size={16} />
                                                    </div>
                                                </motion.div>

                                                {errors.bankDetails?.accountType && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="flex items-center gap-2 text-rose-600 text-xs font-medium mt-1"
                                                    >
                                                        <AlertCircle size={12} />
                                                        {errors.bankDetails.accountType}
                                                    </motion.p>
                                                )}
                                            </div>
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
                                                    We comply with RBI KYC regulations and UIDAI guidelines.
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
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                        Documents should be less than 3 months old
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Document Upload Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <DocumentCard
                                            title="Aadhaar Card"
                                            description="Front & Back side of Aadhaar Card (Clear image with all corners visible)"
                                            required={true}
                                            file={documents.aadhaarCard?.files}
                                            status={documents.aadhaarCard?.status}
                                            onUpload={(files) => handleDocumentUpload('aadhaarCard', files)}
                                            onRemove={(fileName) => handleDocumentRemove('aadhaarCard', fileName)}
                                            error={errors.documents?.aadhaarCard}
                                            isDark={isDark}
                                            progress={documents.aadhaarCard?.progress}
                                            multiple={true}
                                            maxFiles={2}
                                            disabled={shouldDisableFormFields()}
                                        />

                                        <DocumentCard
                                            title="PAN Card"
                                            description="PAN Card copy (Clear image of front side)"
                                            required={true}
                                            file={documents.panCard?.file}
                                            status={documents.panCard?.status}
                                            onUpload={(file) => handleDocumentUpload('panCard', file)}
                                            onRemove={() => handleDocumentRemove('panCard')}
                                            error={errors.documents?.panCard}
                                            isDark={isDark}
                                            progress={documents.panCard?.progress}
                                            disabled={shouldDisableFormFields()}
                                        />

                                        <DocumentCard
                                            title="Address Proof"
                                            description="Utility bill e.g, Electricity, Bank Statement, or Passport not older than 3 months"
                                            required={true}
                                            file={documents.addressProof?.file}
                                            status={documents.addressProof?.status}
                                            onUpload={(file) => handleDocumentUpload('addressProof', file)}
                                            onRemove={() => handleDocumentRemove('addressProof')}
                                            error={errors.documents?.addressProof}
                                            isDark={isDark}
                                            progress={documents.addressProof?.progress}
                                            disabled={shouldDisableFormFields()}
                                        />

                                        <DocumentCard
                                            title="Income Proof"
                                            description="Salary slip, Income Certificate, or Bank Statement (not older than 3 months)"
                                            required={true}
                                            file={documents.incomeProof?.file}
                                            status={documents.incomeProof?.status}
                                            onUpload={(file) => handleDocumentUpload('incomeProof', file)}
                                            onRemove={() => handleDocumentRemove('incomeProof')}
                                            error={errors.documents?.incomeProof}
                                            isDark={isDark}
                                            progress={documents.incomeProof?.progress}
                                            disabled={shouldDisableFormFields()}
                                        />

                                        <div className="lg:col-span-2">
                                            <DocumentCard
                                                title="Bank Proof (Optional)"
                                                description="Cancelled cheque or Bank passbook first page (with account details visible)"
                                                required={false}
                                                file={documents.bankProof?.file}
                                                status={documents.bankProof?.status}
                                                onUpload={(file) => handleDocumentUpload('bankProof', file)}
                                                onRemove={() => handleDocumentRemove('bankProof')}
                                                error={errors.documents?.bankProof}
                                                isDark={isDark}
                                                progress={documents.bankProof?.progress}
                                                disabled={shouldDisableFormFields()}
                                            />
                                        </div>
                                    </div>

                                    {/* Upload Stats */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                        <div className={`text-center p-5 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                                            }`}>
                                            <div className={`text-2xl font-bold mb-2 ${isDark ? 'text-violet-400' : 'text-violet-600'
                                                }`}>
                                                {uploadedDocsCount}/5
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

                                    {/* All Uploaded Documents Section - Add this after the Upload Stats */}
                                    <div className={`mt-8 p-5 rounded-xl border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            All Uploaded Documents
                                        </h3>

                                        {uploadedDocsCount === 0 ? (
                                            <p className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                No documents uploaded yet
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {Object.entries(documents).map(([docType, docData]) => (
                                                    docData.files && docData.files.length > 0 && (
                                                        <div key={docType} className="space-y-2">
                                                            <h4 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                {docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace('Card', ' Card')}
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {docData.files.map((file, index) => (
                                                                    <motion.div
                                                                        key={file.id || index}
                                                                        initial={{ opacity: 0, x: -20 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: index * 0.1 }}
                                                                        className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-white'}`}
                                                                    >
                                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-gray-600' : 'bg-gray-100'}`}>
                                                                                <FileText size={16} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                                                    {file.name}
                                                                                </p>
                                                                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                                    {file.size} • {docType} • Uploaded
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <motion.button
                                                                                onClick={() => handleDocumentDownload(file)}
                                                                                whileHover={{ scale: 1.05 }}
                                                                                whileTap={{ scale: 0.95 }}
                                                                                className={`p-2 rounded-lg ${isDark
                                                                                    ? 'hover:bg-blue-500/20 text-gray-400 hover:text-blue-400'
                                                                                    : 'hover:bg-blue-100 text-gray-600 hover:text-blue-600'
                                                                                    }`}
                                                                            >
                                                                                <Eye size={18} />
                                                                            </motion.button>
                                                                            <motion.button
                                                                                onClick={() => handleDocumentRemove(docType, file.name)}
                                                                                whileHover={{ scale: 1.05, rotate: 90 }}
                                                                                whileTap={{ scale: 0.95 }}
                                                                                className={`p-2 rounded-lg ${isDark
                                                                                    ? 'hover:bg-rose-500/20 text-gray-400 hover:text-rose-400'
                                                                                    : 'hover:bg-rose-100 text-gray-600 hover:text-rose-600'
                                                                                    }`}
                                                                            >
                                                                                <Trash2 size={18} />
                                                                            </motion.button>
                                                                        </div>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        )}

                                        {uploadedDocsCount > 0 && (
                                            <div className="mt-4 pt-4 border-t border-gray-700/30">
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Total: {uploadedDocsCount} document{uploadedDocsCount !== 1 ? 's' : ''} uploaded
                                                </p>
                                            </div>
                                        )}
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
                                                {/* In the Verification Status section, update the status display */}
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        Profile Status
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${profileStatus === 'Unknown'
                                                        ? 'bg-gray-500/20 text-gray-600'
                                                        : profileStatus === 'Incomplete'
                                                            ? 'bg-amber-500/20 text-amber-600'
                                                            : profileStatus === 'Pending'
                                                                ? 'bg-amber-500/20 text-amber-600'
                                                                : profileStatus === 'Submitted'
                                                                    ? 'bg-blue-500/20 text-blue-600'
                                                                    : profileStatus === 'Under Review'
                                                                        ? 'bg-purple-500/20 text-purple-600'
                                                                        : profileStatus === 'Verified'
                                                                            ? 'bg-emerald-500/20 text-emerald-600'
                                                                            : profileStatus === 'Rejected'
                                                                                ? 'bg-rose-500/20 text-rose-600'
                                                                                : 'bg-gray-500/20 text-gray-600'
                                                        }`}>
                                                        {profileStatus}
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
                                                            ['familyDetails', 'panNumber'].includes(key) ? true : personalInfo[key]?.trim() !== '')
                                                    },
                                                    {
                                                        label: 'Bank Details', completed: Object.keys(bankDetails).every(key =>
                                                            ['accountType', 'upiId'].includes(key) ? true : bankDetails[key]?.trim() !== '')
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
                    <motion.button
                        whileHover={shouldDisableClearButton() ? {} : { scale: 1.05 }}
                        whileTap={shouldDisableClearButton() ? {} : { scale: 0.95 }}
                        onClick={handleResetForm}
                        disabled={shouldDisableClearButton()}
                        className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 ${shouldDisableClearButton()
                            ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'
                            : isDark
                                ? 'bg-violet-800/30 text-violet-200 hover:bg-violet-800/50 hover:text-violet-100'
                                : 'bg-violet-50 text-violet-800 hover:bg-violet-100 hover:text-violet-900'
                            }`}
                    >
                        <RefreshCw size={18} />
                        Clear Form
                    </motion.button>

                    <motion.button
                        whileHover={profileStatus === 'Verified' || profileStatus === 'Under Review' || profileStatus === 'Submitted' || completionPercentage < 100 ? {} : { scale: 1.05 }}
                        whileTap={profileStatus === 'Verified' || profileStatus === 'Under Review' || profileStatus === 'Submitted' || completionPercentage < 100 ? {} : { scale: 0.95 }}
                        onClick={handleSubmitVerification}
                        disabled={isLoading || completionPercentage < 100 || profileStatus === 'Submitted' || profileStatus === 'Under Review' || profileStatus === 'Verified'}
                        className={`px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 ${completionPercentage < 100 || profileStatus === 'Submitted' || profileStatus === 'Under Review' || profileStatus === 'Verified'
                            ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-600'
                            : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-xl hover:from-violet-700 hover:to-fuchsia-700'
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
                        ) : profileStatus === 'Submitted' || profileStatus === 'Under Review' || profileStatus === 'Verified' ? (
                            <>
                                <ShieldCheck size={18} />
                                {profileStatus === 'Verified' ? 'Verified' : 'Under Review'}
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
                    <p className="mt-1">Compliant with RBI KYC regulations and UIDAI guidelines.</p>
                    <p className="mt-1">Need help? Contact support at support@donationplatform.in</p>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfileVerificationPage;