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
    CreditCard as CardIcon,
    Globe,
    Heart,
    DollarSign,
    TrendingUp,
    Award,
    BadgeCheck,
    FileDigit,
    Receipt,
    Building2,
    Target
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
const determineDonorStatus = (formData, documents) => {
    // Check if any field is filled
    const hasAnyFieldFilled = () => {
        const fieldsToCheck = [
            'fullName', 'email', 'phone', 'dateOfBirth', 'address', 
            'occupation', 'companyName', 'designation', 'annualIncome',
            'taxIdentificationNumber', 'donationPreferences', 'preferredCategories',
            'bankName', 'accountNumber', 'ifscCode', 'accountHolderName',
            'branchName', 'upiId', 'accountType'
        ];

        // Check if any field has content
        const hasFieldContent = fieldsToCheck.some(field => {
            const value = formData[field];
            return value && value.toString().trim() !== '';
        });

        // Check if there are documents
        const hasDocuments = Object.values(documents).some(doc => doc && doc.files && doc.files.length > 0);

        return hasFieldContent || hasDocuments;
    };

    // Check if all required fields are filled
    const areAllRequiredFieldsFilled = () => {
        const requiredFields = [
            'fullName', 'email', 'phone', 'dateOfBirth', 'address',
            'occupation', 'annualIncome', 'taxIdentificationNumber'
        ];

        // Check all required fields
        const allRequiredFilled = requiredFields.every(field => {
            const value = formData[field];
            return value && value.toString().trim() !== '';
        });

        // Check if all required documents are uploaded
        const allRequiredDocuments = Object.values(documents)
            .filter(doc => doc && doc.required)
            .every(doc => doc && doc.files && doc.files.length > 0);

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

// Add this helper function
const checkIfAnyFieldFilled = (personalInfo, professionalInfo, financialInfo, bankDetails, documents) => {
    // Check personal info fields
    const personalFields = Object.values(personalInfo);
    const hasPersonalInfo = personalFields.some(field =>
        field && field.toString().trim() !== ''
    );

    // Check professional info fields
    const professionalFields = Object.values(professionalInfo);
    const hasProfessionalInfo = professionalFields.some(field =>
        field && field.toString().trim() !== ''
    );

    // Check financial info fields
    const financialFields = Object.values(financialInfo);
    const hasFinancialInfo = financialFields.some(field =>
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

    return hasPersonalInfo || hasProfessionalInfo || hasFinancialInfo || hasBankDetails || hasDocuments;
};

// Add this to calculate profile completion percentage
const calculateProfileCompletion = (personalInfo, professionalInfo, financialInfo, bankDetails, documents) => {
    let totalFields = 0;
    let completedFields = 0;

    const personalInfoFields = [
        'fullName', 'email', 'phone', 'dateOfBirth', 'address', 'occupation'
    ];

    personalInfoFields.forEach(field => {
        totalFields++;
        if (personalInfo[field] && personalInfo[field].toString().trim() !== '') {
            completedFields++;
        }
    });

    const professionalInfoFields = [
        'companyName', 'designation'
    ];

    professionalInfoFields.forEach(field => {
        totalFields++;
        if (professionalInfo[field] && professionalInfo[field].toString().trim() !== '') {
            completedFields++;
        }
    });

    const financialInfoFields = [
        'annualIncome', 'taxIdentificationNumber'
    ];

    financialInfoFields.forEach(field => {
        totalFields++;
        if (financialInfo[field] && financialInfo[field].toString().trim() !== '') {
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

    // Donation preferences (count as one field)
    totalFields++;
    if (financialInfo.donationPreferences && financialInfo.donationPreferences.length > 0) {
        completedFields++;
    }

    // Preferred categories (count as one field)
    totalFields++;
    if (financialInfo.preferredCategories && financialInfo.preferredCategories.length > 0) {
        completedFields++;
    }

    // Documents (count as one field)
    totalFields++;
    const hasDocuments = Object.values(documents).some(doc => doc && doc.files && doc.files.length > 0);
    if (hasDocuments) {
        completedFields++;
    }

    return Math.round((completedFields / totalFields) * 100);
};

// Update the generateDummyProfileData function for donor
const generateDummyDonorProfileData = () => ({
    personalInfo: {
        fullName: 'Amit Sharma',
        email: 'amit.sharma@example.com',
        phone: '+91-9876543210',
        address: 'Flat No. 501, Skyline Apartments, Bandra West, Mumbai 400050',
        dateOfBirth: '1980-05-20',
        familyDetails: 'Married with 1 child',
        occupation: 'Investment Banker'
    },
    professionalInfo: {
        companyName: 'Global Finance Corp',
        designation: 'Vice President',
        workExperience: '15 years in finance',
        linkedInProfile: 'linkedin.com/in/amitsharma',
        website: 'amitsharma.com'
    },
    financialInfo: {
        annualIncome: '₹75,00,000',
        taxIdentificationNumber: 'ABCDE1234F',
        donationPreferences: ['Monthly', 'One-time'],
        preferredCategories: ['Education', 'Healthcare', 'Women Empowerment'],
        maxDonationAmount: '₹50,000',
        preferredPaymentMethod: 'UPI',
        panNumber: 'ABCDE1234F'
    },
    bankDetails: {
        bankName: 'HDFC Bank',
        accountNumber: '987654321012',
        ifscCode: 'HDFC0001234',
        accountHolderName: 'Amit Sharma',
        branchName: 'Bandra Branch',
        accountType: 'Savings',
        verificationStatus: 'pending',
        upiId: 'amit.sharma@hdfcbank'
    },
    documents: {
        panCard: {
            id: 1,
            name: 'pan_card.pdf',
            size: '1.8 MB',
            type: 'application/pdf',
            status: 'verified',
            uploadedAt: '2024-01-10',
            preview: null
        },
        addressProof: {
            id: 2,
            name: 'electricity_bill.pdf',
            size: '3.1 MB',
            type: 'application/pdf',
            status: 'uploaded',
            uploadedAt: '2024-01-11',
            preview: null
        },
        incomeProof: {
            id: 3,
            name: 'salary_slip.pdf',
            size: '4.2 MB',
            type: 'application/pdf',
            status: 'uploaded',
            uploadedAt: '2024-01-12',
            preview: null
        },
        bankProof: {
            id: 4,
            name: 'cancelled_cheque.jpg',
            size: '1.5 MB',
            type: 'image/jpeg',
            status: 'pending',
            uploadedAt: '2024-01-13',
            preview: null
        },
        taxReturn: {
            id: 5,
            name: 'tax_return_2023.pdf',
            size: '5.2 MB',
            type: 'application/pdf',
            status: 'pending',
            uploadedAt: '2024-01-14',
            preview: null
        }
    },
    donorStats: {
        totalDonations: 12,
        totalAmountDonated: '₹2,45,000',
        favoriteCategory: 'Education',
        lastDonationDate: '2024-01-15',
        verificationLevel: 'Level 2',
        donorSince: '2023-01-01'
    },
    verification: {
        progress: 80,
        status: 'in_review',
        submittedAt: '2024-01-10T10:30:00',
        estimatedCompletion: '2024-01-17',
        adminComments: [
            {
                id: 1,
                text: 'PAN card verified successfully',
                timestamp: '2024-01-10',
                admin: 'Admin Priya',
                type: 'approval'
            },
            {
                id: 2,
                text: 'Income proof document needs to be from current employer',
                timestamp: '2024-01-09',
                admin: 'Admin Amit',
                type: 'document_issue'
            },
            {
                id: 3,
                text: 'Tax identification number verified',
                timestamp: '2024-01-08',
                admin: 'Admin Rohan',
                type: 'approval'
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
                {Icon && <Icon size={14} className={isDark ? 'text-blue-400' : 'text-blue-600'} />}
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
                            } border-2 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none resize-none ${error ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : ''
                            } ${isFocused && !error ? 'border-blue-500 ring-2 ring-blue-500/20' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                        rows="4"
                        {...props}
                    />
                ) : type === 'select' ? (
                    <select
                        value={value}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={handleBlur}
                        disabled={disabled}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all ${isDark
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                            } border-2 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none ${error ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : ''
                            } ${isFocused && !error ? 'border-blue-500 ring-2 ring-blue-500/20' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                        {...props}
                    >
                        {props.children}
                    </select>
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
                                } border-2 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none ${error ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : ''
                                } ${isFocused && !error ? 'border-blue-500 ring-2 ring-blue-500/20' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''
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

// ==================== MULTI-SELECT COMPONENT ====================
const MultiSelect = ({
    label,
    options,
    selected = [],
    onChange,
    error,
    placeholder = "Select options...",
    required = false,
    isDark = false,
    icon: Icon,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOption = (option) => {
        if (disabled) return;
        
        const newSelected = selected.includes(option)
            ? selected.filter(item => item !== option)
            : [...selected, option];
        
        onChange(newSelected);
    };

    return (
        <div className="space-y-2">
            <label className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                {Icon && <Icon size={14} className={isDark ? 'text-blue-400' : 'text-blue-600'} />}
                {label}
                {required && <span className="text-rose-500">*</span>}
            </label>

            <div className="relative">
                <div
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                        } border-2 ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : ''} ${error ? 'border-rose-500' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-1">
                            {selected.length === 0 ? (
                                <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>{placeholder}</span>
                            ) : (
                                selected.map(option => (
                                    <span
                                        key={option}
                                        className={`px-2 py-1 rounded-md text-xs ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}
                                    >
                                        {option}
                                    </span>
                                ))
                            )}
                        </div>
                        <ChevronDown size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                    </div>
                </div>

                {isOpen && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`absolute z-10 w-full mt-1 rounded-xl border shadow-xl ${isDark
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-white border-gray-200'
                            }`}
                    >
                        <div className="p-2 max-h-60 overflow-y-auto">
                            {options.map(option => (
                                <div
                                    key={option}
                                    onClick={() => toggleOption(option)}
                                    className={`px-3 py-2 rounded-lg cursor-pointer transition-all ${selected.includes(option)
                                        ? isDark
                                            ? 'bg-blue-900/30 text-blue-300'
                                            : 'bg-blue-50 text-blue-700'
                                        : isDark
                                            ? 'hover:bg-gray-700 text-gray-300'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${selected.includes(option)
                                            ? 'bg-blue-500 border-blue-500'
                                            : isDark
                                                ? 'border-gray-600'
                                                : 'border-gray-300'
                                            }`}>
                                            {selected.includes(option) && (
                                                <CheckCircle size={12} className="text-white" />
                                            )}
                                        </div>
                                        <span className="text-sm">{option}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

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
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                    : isDark
                        ? 'border-gray-600 bg-gray-800 hover:border-blue-500'
                        : 'border-gray-300 bg-gray-50 hover:border-blue-400'
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
                                    stroke="#3b82f6"
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
                                        <FileText size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
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
                            <Upload size={28} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
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

// ==================== DONOR STATS CARD ====================
const DonorStatsCard = ({ stats, isDark }) => {
    const statItems = [
        {
            label: 'Total Donations',
            value: stats.totalDonations,
            icon: Heart,
            color: 'from-rose-500 to-pink-500',
            bgColor: 'bg-rose-500/20',
            textColor: 'text-rose-600'
        },
        {
            label: 'Amount Donated',
            value: stats.totalAmountDonated,
            icon: DollarSign,
            color: 'from-emerald-500 to-green-500',
            bgColor: 'bg-emerald-500/20',
            textColor: 'text-emerald-600'
        },
        {
            label: 'Favorite Category',
            value: stats.favoriteCategory,
            icon: Target,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/20',
            textColor: 'text-blue-600'
        },
        {
            label: 'Verification Level',
            value: stats.verificationLevel,
            icon: BadgeCheck,
            color: 'from-purple-500 to-fuchsia-500',
            bgColor: 'bg-purple-500/20',
            textColor: 'text-purple-600'
        },
        {
            label: 'Last Donation',
            value: new Date(stats.lastDonationDate).toLocaleDateString(),
            icon: Calendar,
            color: 'from-amber-500 to-orange-500',
            bgColor: 'bg-amber-500/20',
            textColor: 'text-amber-600'
        },
        {
            label: 'Donor Since',
            value: new Date(stats.donorSince).toLocaleDateString(),
            icon: TrendingUp,
            color: 'from-indigo-500 to-violet-500',
            bgColor: 'bg-indigo-500/20',
            textColor: 'text-indigo-600'
        }
    ];

    return (
        <Card isDark={isDark} className="relative overflow-hidden">
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10"
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
                <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-blue-100'}`}>
                        <Award size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                    </div>
                    <div>
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Donor Statistics
                        </h2>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Your contribution journey
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                                    <item.icon size={18} className={item.textColor} />
                                </div>
                                <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {item.label}
                                </span>
                            </div>
                            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {item.value}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

// Validation functions for donor
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

    annualIncome: (value) => {
        if (!value.trim()) return 'Annual Income is required';
        if (!/^₹?\d+(,\d{3})*(\.\d{2})?$/.test(value)) return 'Please enter a valid income amount';
        return null;
    },

    taxIdentificationNumber: (value) => {
        if (!value.trim()) return 'Tax Identification Number is required';
        return null;
    },

    companyName: (value) => {
        if (value && value.trim().length > 100) return 'Company name cannot exceed 100 characters';
        return null;
    },

    designation: (value) => {
        if (value && value.trim().length > 50) return 'Designation cannot exceed 50 characters';
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
                <div className="relative p-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">
                                {title}
                            </h2>
                            <p className="text-blue-100 text-sm font-medium">
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
                            className="p-3 bg-blue-100 rounded-full"
                        >
                            <CheckCircle size={48} className="text-blue-600" />
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
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl text-sm font-semibold shadow-xl"
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
    const handleCancel = (e) => {
        e?.stopPropagation();
        if (onCancel) {
            onCancel();
        }
    };

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
            onClick={handleCancel}
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
                <div className="relative p-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">
                                {title}
                            </h2>
                            <p className="text-blue-100 text-sm font-medium">
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
                            className="flex-1 min-w-[100px] px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl text-sm font-semibold shadow-xl"
                        >
                            {confirmText}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
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

// Main Donor Profile Component
const DonorProfileVerificationPage = ({ isDark = false }) => {
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
        professionalInfo: false,
        financialInfo: false,
        bankDetails: false,
        documents: false,
        donorStats: false,
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

    const [professionalInfo, setProfessionalInfo] = useState({
        companyName: '',
        designation: '',
        workExperience: '',
        linkedInProfile: '',
        website: ''
    });

    const [financialInfo, setFinancialInfo] = useState({
        annualIncome: '',
        taxIdentificationNumber: '',
        donationPreferences: [],
        preferredCategories: [],
        maxDonationAmount: '',
        preferredPaymentMethod: '',
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
        panCard: { files: [], status: 'pending', progress: null, required: true },
        addressProof: { files: [], status: 'pending', progress: null, required: true },
        incomeProof: { files: [], status: 'pending', progress: null, required: true },
        bankProof: { files: [], status: 'pending', progress: null, required: false },
        taxReturn: { files: [], status: 'pending', progress: null, required: false }
    });

    const [donorStats, setDonorStats] = useState({
        totalDonations: 0,
        totalAmountDonated: '₹0',
        favoriteCategory: 'None',
        lastDonationDate: null,
        verificationLevel: 'Level 0',
        donorSince: null
    });

    const [profileStatus, setProfileStatus] = useState('Unknown');
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [completionChecklist, setCompletionChecklist] = useState({
        personalInfo: false,
        professionalInfo: false,
        financialInfo: false,
        bankDetails: false,
        requiredDocuments: false
    });

    // Validation States
    const [errors, setErrors] = useState({
        personalInfo: {},
        professionalInfo: {},
        financialInfo: {},
        bankDetails: {},
        documents: {}
    });

    const [shakeFields, setShakeFields] = useState({
        personalInfo: [],
        professionalInfo: [],
        financialInfo: [],
        bankDetails: [],
        documents: []
    });

    const [touchedFields, setTouchedFields] = useState({
        personalInfo: {},
        professionalInfo: {},
        financialInfo: {},
        bankDetails: {}
    });

    const [verification, setVerification] = useState({
        progress: 25,
        status: 'pending',
        submittedAt: null,
        estimatedCompletion: null,
        adminComments: []
    });

    // Initialize with dummy data
    useEffect(() => {
        const dummyData = generateDummyDonorProfileData();
        setPersonalInfo(dummyData.personalInfo);
        setProfessionalInfo(dummyData.professionalInfo);
        setFinancialInfo(dummyData.financialInfo);
        setBankDetails(dummyData.bankDetails);
        setDonorStats(dummyData.donorStats);
        setVerification(dummyData.verification);

        // Format documents data
        const formatFileSize = (sizeString) => {
            const match = sizeString?.match(/(\d+\.?\d*)\s*(MB|KB|B)/i);
            if (match) {
                const size = parseFloat(match[1]);
                const unit = match[2].toUpperCase();
                return { size, unit };
            }
            return { size: 0, unit: 'B' };
        };

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

        const dummyDocs = dummyData.documents;
        setDocuments({
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
            },
            taxReturn: {
                files: dummyDocs.taxReturn ? [
                    createMockFile(
                        dummyDocs.taxReturn.name,
                        dummyDocs.taxReturn.size,
                        dummyDocs.taxReturn.type
                    )
                ] : [],
                status: dummyDocs.taxReturn?.status || 'pending',
                progress: null,
                required: false
            }
        });
    }, []);

    // Calculate completion percentage
    useEffect(() => {
        const percentage = calculateProfileCompletion(
            personalInfo,
            professionalInfo,
            financialInfo,
            bankDetails,
            documents
        );
        setCompletionPercentage(percentage);

        // Calculate checklist
        const checklist = {
            personalInfo: ['fullName', 'email', 'phone', 'dateOfBirth', 'address', 'occupation'].every(
                field => personalInfo[field] && personalInfo[field].toString().trim() !== ''
            ),
            professionalInfo: ['companyName', 'designation'].some(
                field => professionalInfo[field] && professionalInfo[field].toString().trim() !== ''
            ),
            financialInfo: ['annualIncome', 'taxIdentificationNumber'].every(
                field => financialInfo[field] && financialInfo[field].toString().trim() !== ''
            ),
            bankDetails: ['bankName', 'accountNumber', 'ifscCode', 'accountHolderName', 'branchName', 'accountType'].every(
                field => bankDetails[field] && bankDetails[field].toString().trim() !== ''
            ),
            requiredDocuments: Object.values(documents)
                .filter(doc => doc && doc.required)
                .every(doc => doc && doc.files && doc.files.length > 0)
        };
        setCompletionChecklist(checklist);

        // Determine status
        const combinedFormData = {
            ...personalInfo,
            ...professionalInfo,
            ...financialInfo,
            ...bankDetails
        };
        const newStatus = determineDonorStatus(combinedFormData, documents);
        setProfileStatus(newStatus);
    }, [personalInfo, professionalInfo, financialInfo, bankDetails, documents]);

    // Auto-save functionality
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsSaving(true);
            setTimeout(() => {
                const draft = {
                    personalInfo,
                    professionalInfo,
                    financialInfo,
                    bankDetails,
                    documents,
                    donorStats,
                    verification
                };
                localStorage.setItem('donorProfileVerificationDraft', JSON.stringify(draft));
                setIsSaving(false);
            }, 500);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [personalInfo, professionalInfo, financialInfo, bankDetails, documents, donorStats, verification]);

    // Load draft on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem('donorProfileVerificationDraft');
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                setPersonalInfo(draft.personalInfo || personalInfo);
                setProfessionalInfo(draft.professionalInfo || professionalInfo);
                setFinancialInfo(draft.financialInfo || financialInfo);
                setBankDetails(draft.bankDetails || bankDetails);
                setDocuments(draft.documents || documents);
                setDonorStats(draft.donorStats || donorStats);
                setVerification(draft.verification || verification);
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    }, []);

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

    // Handle field changes
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
            default:
                break;
        }

        setPersonalInfo(prev => ({ ...prev, [field]: processedValue }));

        if (errors.personalInfo && errors.personalInfo[field]) {
            setErrors(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, [field]: null }
            }));
        }
    };

    const handleProfessionalInfoChange = (field, value) => {
        setProfessionalInfo(prev => ({ ...prev, [field]: value }));

        if (errors.professionalInfo && errors.professionalInfo[field]) {
            setErrors(prev => ({
                ...prev,
                professionalInfo: { ...prev.professionalInfo, [field]: null }
            }));
        }
    };

    const handleFinancialInfoChange = (field, value) => {
        let processedValue = value;

        switch (field) {
            case 'annualIncome':
                processedValue = value.replace(/[^₹0-9,.]/g, '');
                break;
            case 'panNumber':
                processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
                break;
            default:
                break;
        }

        setFinancialInfo(prev => ({ ...prev, [field]: processedValue }));

        if (errors.financialInfo && errors.financialInfo[field]) {
            setErrors(prev => ({
                ...prev,
                financialInfo: { ...prev.financialInfo, [field]: null }
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
                case 'occupation':
                    if (value && value.trim().length > 50) {
                        error = 'Occupation cannot exceed 50 characters';
                    }
                    break;
                default:
                    break;
            }
        } else if (section === 'professionalInfo') {
            switch (field) {
                case 'companyName':
                    error = validation.companyName(value);
                    break;
                case 'designation':
                    error = validation.designation(value);
                    break;
                default:
                    break;
            }
        } else if (section === 'financialInfo') {
            switch (field) {
                case 'annualIncome':
                    error = validation.annualIncome(value);
                    break;
                case 'taxIdentificationNumber':
                    error = validation.taxIdentificationNumber(value);
                    break;
                case 'panNumber':
                    error = validation.panNumber(value);
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
                    error = validation.accountHolderName(value);
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
            id: Date.now() + Math.random(),
            fileObject: file
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
        setDocuments(prev => ({
            ...prev,
            [docType]: {
                ...(prev[docType] || {}),
                files: (prev[docType]?.files || []).filter(file => file.name !== fileName)
            }
        }));
    };

    const shouldDisableFormFields = () => {
        return profileStatus === 'Verified' || profileStatus === 'Under Review' || profileStatus === 'Submitted';
    };

    const handleSubmitVerification = async () => {
        if (profileStatus === 'Verified' || profileStatus === 'Under Review' || profileStatus === 'Submitted') {
            showDialogWithMessage('Profile already submitted or verified');
            return;
        }

        if (completionPercentage < 100) {
            showDialogWithMessage('Please complete all required fields and upload all documents before submitting');
            return;
        }

        setConfirmationConfig({
            title: 'Submit for Verification',
            message: 'Are you sure you want to submit your donor profile for verification? You will not be able to edit after submission.',
            onConfirm: async () => {
                setShowConfirmation(false);
                setIsLoading(true);

                await new Promise(resolve => setTimeout(resolve, 2000));

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
                            text: 'Donor profile submitted for verification',
                            timestamp: new Date().toISOString().split('T')[0],
                            admin: 'System',
                            type: 'submission'
                        }
                    ]
                }));

                setIsLoading(false);
                showDialogWithMessage('Donor profile submitted for verification successfully!');
            },
            confirmText: 'Submit',
            cancelText: 'Cancel'
        });

        setShowConfirmation(true);
    };

    const handleResetForm = () => {
        if (profileStatus === 'Verified' || profileStatus === 'Under Review' || profileStatus === 'Submitted') {
            showDialogWithMessage('Cannot reset form after submission or verification');
            return;
        }

        setConfirmationConfig({
            title: 'Clear Form',
            message: 'Are you sure you want to clear all form data? This action cannot be undone.',
            onConfirm: () => {
                setPersonalInfo({
                    fullName: '',
                    email: '',
                    phone: '',
                    address: '',
                    dateOfBirth: '',
                    familyDetails: '',
                    occupation: ''
                });

                setProfessionalInfo({
                    companyName: '',
                    designation: '',
                    workExperience: '',
                    linkedInProfile: '',
                    website: ''
                });

                setFinancialInfo({
                    annualIncome: '',
                    taxIdentificationNumber: '',
                    donationPreferences: [],
                    preferredCategories: [],
                    maxDonationAmount: '',
                    preferredPaymentMethod: '',
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
                    panCard: { files: [], status: 'pending', progress: null, required: true },
                    addressProof: { files: [], status: 'pending', progress: null, required: true },
                    incomeProof: { files: [], status: 'pending', progress: null, required: true },
                    bankProof: { files: [], status: 'pending', progress: null, required: false },
                    taxReturn: { files: [], status: 'pending', progress: null, required: false }
                });

                setErrors({
                    personalInfo: {},
                    professionalInfo: {},
                    financialInfo: {},
                    bankDetails: {},
                    documents: {}
                });

                localStorage.removeItem('donorProfileVerificationDraft');
                setShowConfirmation(false);
                showDialogWithMessage('Form cleared successfully!');
            },
            confirmText: 'Clear All',
            cancelText: 'Cancel'
        });

        setShowConfirmation(true);
    };

    const showDialogWithMessage = (message) => {
        if (autoCloseTimeoutRef.current) {
            clearTimeout(autoCloseTimeoutRef.current);
            autoCloseTimeoutRef.current = null;
        }

        setSuccessMessage(message);
        setShowSuccess(true);

        if (message.includes('fix all errors')) {
            autoCloseTimeoutRef.current = setTimeout(() => {
                setShowSuccess(false);
            }, 4000);
        }
    };

    const handleDialogClose = () => {
        setShowSuccess(false);
        if (autoCloseTimeoutRef.current) {
            clearTimeout(autoCloseTimeoutRef.current);
            autoCloseTimeoutRef.current = null;
        }
    };

    const toggleSection = (section) => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const uploadedDocsCount = Object.values(documents || {}).reduce((total, doc) => {
        return total + (doc?.files?.length || 0);
    }, 0);
    const verifiedDocsCount = Object.values(documents || {}).filter(d => d && d.status === 'verified').length || 0;

    // Donation preference options
    const donationPreferenceOptions = ['Monthly', 'Quarterly', 'Yearly', 'One-time', 'On specific occasions'];
    
    // Preferred category options
    const categoryOptions = [
        'Education', 'Healthcare', 'Women Empowerment', 'Child Welfare',
        'Elderly Care', 'Disability Support', 'Environment', 'Animal Welfare',
        'Disaster Relief', 'Rural Development', 'Arts & Culture', 'Sports'
    ];

    return (
        <div className="min-h-screen p-4 md:p-8">
            <AnimatePresence mode="wait">
                {showSuccess && (
                    <SuccessDialog
                        isDark={isDark}
                        title="Success"
                        message={successMessage}
                        onClose={handleDialogClose}
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
                            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10"
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
                                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Donor Verification Progress
                                    </h2>
                                    <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Complete your profile to enable donation features and get verified donor status
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
                    <Card isDark={isDark}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    <User size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Personal Information
                                    </h2>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Basic details about yourself
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => toggleSection('personalInfo')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                {collapsedSections.personalInfo ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                            </button>
                        </div>

                        {!collapsedSections.personalInfo && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    label="Full Name"
                                    value={personalInfo.fullName}
                                    onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                                    onBlur={() => handleFieldBlur('personalInfo', 'fullName', personalInfo.fullName)}
                                    error={errors.personalInfo?.fullName}
                                    placeholder="Amit Sharma"
                                    required
                                    icon={User}
                                    isDark={isDark}
                                    disabled={shouldDisableFormFields()}
                                />

                                <FormField
                                    label="Email Address"
                                    type="email"
                                    value={personalInfo.email}
                                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                                    onBlur={() => handleFieldBlur('personalInfo', 'email', personalInfo.email)}
                                    error={errors.personalInfo?.email}
                                    placeholder="amit.sharma@example.com"
                                    required
                                    icon={Mail}
                                    isDark={isDark}
                                    disabled={shouldDisableFormFields()}
                                />

                                <FormField
                                    label="Phone Number"
                                    value={personalInfo.phone}
                                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                                    onBlur={() => handleFieldBlur('personalInfo', 'phone', personalInfo.phone)}
                                    error={errors.personalInfo?.phone}
                                    placeholder="+91-9876543210"
                                    required
                                    icon={Phone}
                                    isDark={isDark}
                                    disabled={shouldDisableFormFields()}
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
                                    disabled={shouldDisableFormFields()}
                                />

                                <div className="md:col-span-2">
                                    <FormField
                                        label="Address"
                                        type="textarea"
                                        value={personalInfo.address}
                                        onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                                        onBlur={() => handleFieldBlur('personalInfo', 'address', personalInfo.address)}
                                        error={errors.personalInfo?.address}
                                        placeholder="Flat No. 501, Skyline Apartments, Bandra West, Mumbai 400050"
                                        required
                                        icon={MapPin}
                                        isDark={isDark}
                                        disabled={shouldDisableFormFields()}
                                    />
                                </div>

                                <FormField
                                    label="Occupation"
                                    value={personalInfo.occupation}
                                    onChange={(e) => handlePersonalInfoChange('occupation', e.target.value)}
                                    onBlur={() => handleFieldBlur('personalInfo', 'occupation', personalInfo.occupation)}
                                    error={errors.personalInfo?.occupation}
                                    placeholder="Investment Banker"
                                    required
                                    icon={Briefcase}
                                    isDark={isDark}
                                    disabled={shouldDisableFormFields()}
                                />

                                <div className="md:col-span-2">
                                    <FormField
                                        label="Family Details (Optional)"
                                        type="textarea"
                                        value={personalInfo.familyDetails}
                                        onChange={(e) => handlePersonalInfoChange('familyDetails', e.target.value)}
                                        placeholder="Tell us about your family"
                                        icon={Users}
                                        isDark={isDark}
                                        disabled={shouldDisableFormFields()}
                                    />
                                </div>
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Professional Information Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card isDark={isDark}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    <Building2 size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Professional Information
                                    </h2>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Your work and career details
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => toggleSection('professionalInfo')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                {collapsedSections.professionalInfo ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                            </button>
                        </div>

                        {!collapsedSections.professionalInfo && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    label="Company Name"
                                    value={professionalInfo.companyName}
                                    onChange={(e) => handleProfessionalInfoChange('companyName', e.target.value)}
                                    onBlur={() => handleFieldBlur('professionalInfo', 'companyName', professionalInfo.companyName)}
                                    error={errors.professionalInfo?.companyName}
                                    placeholder="Global Finance Corp"
                                    icon={Building}
                                    isDark={isDark}
                                    disabled={shouldDisableFormFields()}
                                />

                                <FormField
                                    label="Designation"
                                    value={professionalInfo.designation}
                                    onChange={(e) => handleProfessionalInfoChange('designation', e.target.value)}
                                    onBlur={() => handleFieldBlur('professionalInfo', 'designation', professionalInfo.designation)}
                                    error={errors.professionalInfo?.designation}
                                    placeholder="Vice President"
                                    icon={Briefcase}
                                    isDark={isDark}
                                    disabled={shouldDisableFormFields()}
                                />

                                <FormField
                                    label="Work Experience (Optional)"
                                    value={professionalInfo.workExperience}
                                    onChange={(e) => handleProfessionalInfoChange('workExperience', e.target.value)}
                                    placeholder="15 years in finance"
                                    icon={Clock}
                                    isDark={isDark}
                                    disabled={shouldDisableFormFields()}
                                />

                                <FormField
                                    label="LinkedIn Profile (Optional)"
                                    value={professionalInfo.linkedInProfile}
                                    onChange={(e) => handleProfessionalInfoChange('linkedInProfile', e.target.value)}
                                    placeholder="linkedin.com/in/username"
                                    icon={Globe}
                                    isDark={isDark}
                                    disabled={shouldDisableFormFields()}
                                />

                                <div className="md:col-span-2">
                                    <FormField
                                        label="Website/Portfolio (Optional)"
                                        value={professionalInfo.website}
                                        onChange={(e) => handleProfessionalInfoChange('website', e.target.value)}
                                        placeholder="https://yourwebsite.com"
                                        icon={Globe}
                                        isDark={isDark}
                                        disabled={shouldDisableFormFields()}
                                    />
                                </div>
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Financial Information Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card isDark={isDark}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    <DollarSign size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Financial Information
                                    </h2>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Income and donation preferences
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => toggleSection('financialInfo')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                {collapsedSections.financialInfo ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                            </button>
                        </div>

                        {!collapsedSections.financialInfo && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        label="Annual Income"
                                        value={financialInfo.annualIncome}
                                        onChange={(e) => handleFinancialInfoChange('annualIncome', e.target.value)}
                                        onBlur={() => handleFieldBlur('financialInfo', 'annualIncome', financialInfo.annualIncome)}
                                        error={errors.financialInfo?.annualIncome}
                                        placeholder="₹75,00,000"
                                        required
                                        icon={DollarSign}
                                        isDark={isDark}
                                        disabled={shouldDisableFormFields()}
                                    />

                                    <FormField
                                        label="Tax Identification Number"
                                        value={financialInfo.taxIdentificationNumber}
                                        onChange={(e) => handleFinancialInfoChange('taxIdentificationNumber', e.target.value)}
                                        onBlur={() => handleFieldBlur('financialInfo', 'taxIdentificationNumber', financialInfo.taxIdentificationNumber)}
                                        error={errors.financialInfo?.taxIdentificationNumber}
                                        placeholder="TIN Number"
                                        required
                                        icon={FileDigit}
                                        isDark={isDark}
                                        disabled={shouldDisableFormFields()}
                                    />

                                    <FormField
                                        label="PAN Number"
                                        value={financialInfo.panNumber}
                                        onChange={(e) => handleFinancialInfoChange('panNumber', e.target.value)}
                                        onBlur={() => handleFieldBlur('financialInfo', 'panNumber', financialInfo.panNumber)}
                                        error={errors.financialInfo?.panNumber}
                                        placeholder="ABCDE1234F"
                                        icon={IdCard}
                                        isDark={isDark}
                                        disabled={shouldDisableFormFields()}
                                    />

                                    <FormField
                                        label="Max Donation Amount"
                                        value={financialInfo.maxDonationAmount}
                                        onChange={(e) => handleFinancialInfoChange('maxDonationAmount', e.target.value)}
                                        placeholder="₹50,000"
                                        icon={DollarSign}
                                        isDark={isDark}
                                        disabled={shouldDisableFormFields()}
                                    />

                                    <FormField
                                        label="Preferred Payment Method"
                                        value={financialInfo.preferredPaymentMethod}
                                        onChange={(e) => handleFinancialInfoChange('preferredPaymentMethod', e.target.value)}
                                        placeholder="UPI"
                                        icon={CreditCard}
                                        isDark={isDark}
                                        disabled={shouldDisableFormFields()}
                                    />
                                </div>

                                <MultiSelect
                                    label="Donation Preferences"
                                    options={donationPreferenceOptions}
                                    selected={financialInfo.donationPreferences}
                                    onChange={(selected) => setFinancialInfo(prev => ({ ...prev, donationPreferences: selected }))}
                                    icon={Heart}
                                    isDark={isDark}
                                    disabled={shouldDisableFormFields()}
                                />

                                <MultiSelect
                                    label="Preferred Donation Categories"
                                    options={categoryOptions}
                                    selected={financialInfo.preferredCategories}
                                    onChange={(selected) => setFinancialInfo(prev => ({ ...prev, preferredCategories: selected }))}
                                    icon={Target}
                                    isDark={isDark}
                                    disabled={shouldDisableFormFields()}
                                />
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Bank Details Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card isDark={isDark}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    <CreditCard size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Bank Details
                                    </h2>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        For donation transfers and receipts
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => toggleSection('bankDetails')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                {collapsedSections.bankDetails ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                            </button>
                        </div>

                        {!collapsedSections.bankDetails && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    label="Bank Name"
                                    value={bankDetails.bankName}
                                    onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                                    onBlur={() => handleFieldBlur('bankDetails', 'bankName', bankDetails.bankName)}
                                    error={errors.bankDetails?.bankName}
                                    placeholder="HDFC Bank"
                                    required
                                    icon={Landmark}
                                    isDark={isDark}
                                    disabled={shouldDisableFormFields()}
                                />

                                <FormField
                                    label="Account Number"
                                    value={bankDetails.accountNumber}
                                    onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                                    onBlur={() => handleFieldBlur('bankDetails', 'accountNumber', bankDetails.accountNumber)}
                                    error={errors.bankDetails?.accountNumber}
                                    placeholder="987654321012"
                                    required
                                    icon={Hash}
                                    isDark={isDark}
                                    disabled={shouldDisableFormFields()}
                                />

                                <FormField
                                    label="IFSC Code"
                                    value={bankDetails.ifscCode}
                                    onChange={(e) => handleBankDetailsChange('ifscCode', e.target.value)}
                                    onBlur={() => handleFieldBlur('bankDetails', 'ifscCode', bankDetails.ifscCode)}
                                    error={errors.bankDetails?.ifscCode}
                                    placeholder="HDFC0001234"
                                    required
                                    icon={Hash}
                                    isDark={isDark}
                                    disabled={shouldDisableFormFields()}
                                />

                                <FormField
                                    label="Account Holder Name"
                                    value={bankDetails.accountHolderName}
                                    onChange={(e) => handleBankDetailsChange('accountHolderName', e.target.value)}
                                    onBlur={() => handleFieldBlur('bankDetails', 'accountHolderName', bankDetails.accountHolderName)}
                                    error={errors.bankDetails?.accountHolderName}
                                    placeholder="Amit Sharma"
                                    required
                                    icon={User}
                                    isDark={isDark}
                                    disabled={shouldDisableFormFields()}
                                />

                                <FormField
                                    label="Branch Name"
                                    value={bankDetails.branchName}
                                    onChange={(e) => handleBankDetailsChange('branchName', e.target.value)}
                                    onBlur={() => handleFieldBlur('bankDetails', 'branchName', bankDetails.branchName)}
                                    error={errors.bankDetails?.branchName}
                                    placeholder="Bandra Branch"
                                    required
                                    icon={Building}
                                    isDark={isDark}
                                    disabled={shouldDisableFormFields()}
                                />

                                <FormField
                                    label="UPI ID (Optional)"
                                    value={bankDetails.upiId}
                                    onChange={(e) => handleBankDetailsChange('upiId', e.target.value)}
                                    placeholder="amit.sharma@hdfcbank"
                                    icon={CreditCard}
                                    isDark={isDark}
                                    disabled={shouldDisableFormFields()}
                                />

                                <div className="md:col-span-2">
                                    <FormField
                                        label="Account Type"
                                        type="select"
                                        value={bankDetails.accountType}
                                        onChange={(e) => setBankDetails(prev => ({ ...prev, accountType: e.target.value }))}
                                        onBlur={() => handleFieldBlur('bankDetails', 'accountType', bankDetails.accountType)}
                                        error={errors.bankDetails?.accountType}
                                        required
                                        icon={Landmark}
                                        isDark={isDark}
                                        disabled={shouldDisableFormFields()}
                                    >
                                        <option value="">Select Account Type</option>
                                        <option value="Savings">Savings Account</option>
                                        <option value="Current">Current Account</option>
                                        <option value="Salary">Salary Account</option>
                                        <option value="Joint">Joint Account</option>
                                        <option value="NRI">NRI Account</option>
                                    </FormField>
                                </div>
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Documents Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card isDark={isDark}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    <FileText size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Documents Upload
                                    </h2>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Upload required documents for donor verification
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => toggleSection('documents')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                {collapsedSections.documents ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                            </button>
                        </div>

                        {!collapsedSections.documents && (
                            <div className="space-y-6">
                                <div className={`p-5 rounded-xl border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-amber-50 border-amber-100'}`}>
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-600' : 'bg-amber-100'}`}>
                                            <AlertTriangle size={20} className={isDark ? 'text-amber-400' : 'text-amber-600'} />
                                        </div>
                                        <div>
                                            <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                Upload Requirements
                                            </h4>
                                            <ul className={`text-sm space-y-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
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

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <DocumentCard
                                        title="PAN Card"
                                        description="PAN Card copy (Clear image of front side)"
                                        required={true}
                                        file={documents.panCard?.files}
                                        status={documents.panCard?.status}
                                        onUpload={(files) => handleDocumentUpload('panCard', files)}
                                        onRemove={(fileName) => handleDocumentRemove('panCard', fileName)}
                                        error={errors.documents?.panCard}
                                        isDark={isDark}
                                        progress={documents.panCard?.progress}
                                        disabled={shouldDisableFormFields()}
                                    />

                                    <DocumentCard
                                        title="Address Proof"
                                        description="Utility bill, Bank Statement, or Passport not older than 3 months"
                                        required={true}
                                        file={documents.addressProof?.files}
                                        status={documents.addressProof?.status}
                                        onUpload={(files) => handleDocumentUpload('addressProof', files)}
                                        onRemove={(fileName) => handleDocumentRemove('addressProof', fileName)}
                                        error={errors.documents?.addressProof}
                                        isDark={isDark}
                                        progress={documents.addressProof?.progress}
                                        disabled={shouldDisableFormFields()}
                                    />

                                    <DocumentCard
                                        title="Income Proof"
                                        description="Salary slip, Income Certificate, or Bank Statement (not older than 3 months)"
                                        required={true}
                                        file={documents.incomeProof?.files}
                                        status={documents.incomeProof?.status}
                                        onUpload={(files) => handleDocumentUpload('incomeProof', files)}
                                        onRemove={(fileName) => handleDocumentRemove('incomeProof', fileName)}
                                        error={errors.documents?.incomeProof}
                                        isDark={isDark}
                                        progress={documents.incomeProof?.progress}
                                        disabled={shouldDisableFormFields()}
                                    />

                                    <DocumentCard
                                        title="Bank Proof (Optional)"
                                        description="Cancelled cheque or Bank passbook first page"
                                        required={false}
                                        file={documents.bankProof?.files}
                                        status={documents.bankProof?.status}
                                        onUpload={(files) => handleDocumentUpload('bankProof', files)}
                                        onRemove={(fileName) => handleDocumentRemove('bankProof', fileName)}
                                        error={errors.documents?.bankProof}
                                        isDark={isDark}
                                        progress={documents.bankProof?.progress}
                                        disabled={shouldDisableFormFields()}
                                    />

                                    <div className="lg:col-span-2">
                                        <DocumentCard
                                            title="Tax Return (Optional)"
                                            description="Last year's tax return filing acknowledgement"
                                            required={false}
                                            file={documents.taxReturn?.files}
                                            status={documents.taxReturn?.status}
                                            onUpload={(files) => handleDocumentUpload('taxReturn', files)}
                                            onRemove={(fileName) => handleDocumentRemove('taxReturn', fileName)}
                                            error={errors.documents?.taxReturn}
                                            isDark={isDark}
                                            progress={documents.taxReturn?.progress}
                                            disabled={shouldDisableFormFields()}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                    <div className={`text-center p-5 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                        <div className={`text-2xl font-bold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                            {uploadedDocsCount}/5
                                        </div>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Documents Uploaded
                                        </p>
                                    </div>

                                    <div className={`text-center p-5 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                        <div className={`text-2xl font-bold mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                            {verifiedDocsCount}
                                        </div>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Verified
                                        </p>
                                    </div>

                                    <div className={`text-center p-5 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                        <div className={`text-2xl font-bold mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                                            24-48h
                                        </div>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Verification Time
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Donor Statistics Section */}
                {donorStats.totalDonations > 0 && (
                    <DonorStatsCard stats={donorStats} isDark={isDark} />
                )}

                {/* Verification Status Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Card isDark={isDark}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    <ShieldCheck size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Verification Status
                                    </h2>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Track your verification progress
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => toggleSection('verification')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                {collapsedSections.verification ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                            </button>
                        </div>

                        {!collapsedSections.verification && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            Current Status
                                        </h3>
                                        <div className="space-y-4">
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
                                                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
                                        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            Completion Checklist
                                        </h3>
                                        <div className="space-y-3">
                                            {[
                                                {
                                                    label: 'Personal Information',
                                                    completed: completionChecklist.personalInfo
                                                },
                                                {
                                                    label: 'Financial Information',
                                                    completed: completionChecklist.financialInfo
                                                },
                                                {
                                                    label: 'Bank Details',
                                                    completed: completionChecklist.bankDetails
                                                },
                                                {
                                                    label: 'Required Documents',
                                                    completed: completionChecklist.requiredDocuments
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

                                {verification.adminComments && verification.adminComments.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            Admin Comments
                                        </h3>
                                        <div className="space-y-4">
                                            {verification.adminComments.map((comment, index) => (
                                                <motion.div
                                                    key={comment.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
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
                                                                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                                    {comment.admin || 'Admin'}
                                                                </p>
                                                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                    Administrator
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-700/20"
                >
                    <motion.button
                        whileHover={profileStatus === 'Verified' || profileStatus === 'Under Review' || profileStatus === 'Submitted' ? {} : { scale: 1.05 }}
                        whileTap={profileStatus === 'Verified' || profileStatus === 'Under Review' || profileStatus === 'Submitted' ? {} : { scale: 0.95 }}
                        onClick={handleResetForm}
                        disabled={profileStatus === 'Verified' || profileStatus === 'Under Review' || profileStatus === 'Submitted'}
                        className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 ${profileStatus === 'Verified' || profileStatus === 'Under Review' || profileStatus === 'Submitted'
                            ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'
                            : isDark
                                ? 'bg-blue-800/30 text-blue-200 hover:bg-blue-800/50 hover:text-blue-100'
                                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 hover:text-blue-900'
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
                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xl hover:from-blue-700 hover:to-cyan-700'
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
                    transition={{ delay: 0.9 }}
                    className={`text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}
                >
                    <p>Your information is secure and encrypted. Verification usually takes 24-48 hours.</p>
                    <p className="mt-1">Compliant with Income Tax regulations and financial guidelines.</p>
                    <p className="mt-1">Verified donors receive tax exemption certificates for donations.</p>
                    <p className="mt-1">Need help? Contact support at donorsupport@donationplatform.in</p>
                </motion.div>
            </div>
        </div>
    );
};

export default DonorProfileVerificationPage;