import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Plus,
    Eye,
    Trash2,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    File,
    DollarSign,
    AlertTriangle,
    AlertCircle,
    Users,
    Calendar,
    ChevronDown,
    ChevronUp,
    MoreVertical,
    CheckCircle2,
    X,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    FileCheck,
    Zap,
    BarChart3,
    Activity,
    Award,
    Heart,
    Shield,
    Send,
    TrendingDown,
    RefreshCw,
    Edit,
    Upload
} from 'lucide-react';

// ==================== FORMAT VALUE FUNCTIONS ====================
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
    const currencyPrefix = isCurrency ? '₹ ' : '';

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

// ==================== MEMOIZED STATIC DATA ====================
const mockRequestsData = [
    {
        id: 'REQ-2024-007',
        title: 'School Fees for Children',
        description: 'School tuition fees for three children studying in schools.',
        requiredAmount: 90000,
        donatedAmount: 0,
        remainingAmount: 90000,
        currency: 'PKR',
        status: 'Draft',
        category: 'Education',
        createdAt: '2024-03-20T13:20:00',
        updatedAt: '2024-03-20T13:20:00',
        deadline: '2024-04-30',
        donorsCount: 0,
        documents: [
            { id: 1, name: 'school_fee_slips.pdf', size: '1.6 MB', type: 'application/pdf' }
        ],
        approvers: [],
        progress: 0,
        visibility: 'private',
        featured: false,
        tags: ['education', 'school', 'children'],
        verificationStatus: 'Not Started',
        assignee: null,
        completionRate: 0,
    },
    {
        id: 'REQ-2024-008',
        title: 'Medical Equipment Purchase',
        description: 'Purchase of medical equipment for home-based care.',
        requiredAmount: 350000,
        donatedAmount: 0,
        remainingAmount: 350000,
        currency: 'PKR',
        status: 'Draft',
        category: 'Medical',
        createdAt: '2024-03-25T10:15:00',
        updatedAt: '2024-03-25T10:15:00',
        deadline: '2024-06-30',
        donorsCount: 0,
        documents: [
            { id: 1, name: 'equipment_quotation.pdf', size: '2.1 MB', type: 'application/pdf' }
        ],
        approvers: [],
        progress: 0,
        visibility: 'public',
        featured: false,
        tags: ['medical', 'equipment', 'care'],
        verificationStatus: 'Not Started',
        assignee: null,
        completionRate: 0,
    },
    {
        id: 'REQ-2024-009',
        title: 'Business Expansion',
        description: 'Funds needed to expand small grocery store business.',
        requiredAmount: 200000,
        donatedAmount: 0,
        remainingAmount: 200000,
        currency: 'PKR',
        status: 'Draft',
        category: 'Business',
        createdAt: '2024-03-28T09:45:00',
        updatedAt: '2024-03-28T09:45:00',
        deadline: '2024-07-31',
        donorsCount: 0,
        documents: [
            { id: 1, name: 'business_plan.pdf', size: '3.2 MB', type: 'application/pdf' }
        ],
        approvers: [],
        progress: 0,
        visibility: 'public',
        featured: false,
        tags: ['business', 'expansion', 'grocery'],
        verificationStatus: 'Not Started',
        assignee: null,
        completionRate: 0,
    },
    {
        id: 'REQ-2024-006',
        title: 'Submitted Request Example',
        description: 'This request has been submitted for validation.',
        requiredAmount: 150000,
        donatedAmount: 0,
        remainingAmount: 150000,
        currency: 'PKR',
        status: 'Pending-Validation',
        category: 'Education',
        createdAt: '2024-03-15T10:00:00',
        updatedAt: '2024-03-15T10:00:00',
        deadline: '2024-05-30',
        donorsCount: 0,
        documents: [
            { id: 1, name: 'example_doc.pdf', size: '1.2 MB', type: 'application/pdf' }
        ],
        approvers: [],
        progress: 0,
        visibility: 'public',
        featured: false,
        tags: ['education', 'example'],
        verificationStatus: 'Not Started',
        assignee: null,
        completionRate: 0,
    },
    {
        id: 'REQ-2024-010',
        title: 'House Rent Assistance',
        description: 'Assistance for monthly house rent for a family of 4.',
        requiredAmount: 60000,
        donatedAmount: 0,
        remainingAmount: 60000,
        currency: 'PKR',
        status: 'Draft',
        category: 'Housing',
        createdAt: '2024-04-01T14:30:00',
        updatedAt: '2024-04-01T14:30:00',
        deadline: '2024-05-15',
        donorsCount: 0,
        documents: [
            { id: 1, name: 'rent_agreement.pdf', size: '1.8 MB', type: 'application/pdf' }
        ],
        approvers: [],
        progress: 0,
        visibility: 'public',
        featured: false,
        tags: ['housing', 'rent', 'assistance'],
        verificationStatus: 'Not Started',
        assignee: null,
        completionRate: 0,
    },
    {
        id: 'REQ-2024-011',
        title: 'Emergency Medical Treatment',
        description: 'Urgent funds needed for heart surgery at local hospital.',
        requiredAmount: 500000,
        donatedAmount: 0,
        remainingAmount: 500000,
        currency: 'PKR',
        status: 'Draft',
        category: 'Medical',
        createdAt: '2024-04-05T08:15:00',
        updatedAt: '2024-04-05T08:15:00',
        deadline: '2024-05-20',
        donorsCount: 0,
        documents: [
            { id: 1, name: 'medical_report.pdf', size: '2.4 MB', type: 'application/pdf' }
        ],
        approvers: [],
        progress: 0,
        visibility: 'public',
        featured: false,
        tags: ['medical', 'emergency', 'surgery'],
        verificationStatus: 'Not Started',
        assignee: null,
        completionRate: 0,
    },
    {
        id: 'REQ-2024-012',
        title: 'University Tuition Fees',
        description: 'Semester fees for engineering student at public university.',
        requiredAmount: 150000,
        donatedAmount: 0,
        remainingAmount: 150000,
        currency: 'PKR',
        status: 'Draft',
        category: 'Education',
        createdAt: '2024-04-10T11:30:00',
        updatedAt: '2024-04-10T11:30:00',
        deadline: '2024-05-30',
        donorsCount: 0,
        documents: [
            { id: 1, name: 'fee_voucher.pdf', size: '1.2 MB', type: 'application/pdf' }
        ],
        approvers: [],
        progress: 0,
        visibility: 'public',
        featured: false,
        tags: ['education', 'university', 'tuition'],
        verificationStatus: 'Not Started',
        assignee: null,
        completionRate: 0,
    },
    {
        id: 'REQ-2024-013',
        title: 'Food Supplies for Family',
        description: 'Monthly groceries and food supplies for large family of 8.',
        requiredAmount: 45000,
        donatedAmount: 0,
        remainingAmount: 45000,
        currency: 'PKR',
        status: 'Draft',
        category: 'Food',
        createdAt: '2024-04-12T14:45:00',
        updatedAt: '2024-04-12T14:45:00',
        deadline: '2024-05-10',
        donorsCount: 0,
        documents: [
            { id: 1, name: 'family_details.pdf', size: '0.8 MB', type: 'application/pdf' }
        ],
        approvers: [],
        progress: 0,
        visibility: 'public',
        featured: false,
        tags: ['food', 'groceries', 'family'],
        verificationStatus: 'Not Started',
        assignee: null,
        completionRate: 0,
    },
    {
        id: 'REQ-2024-014',
        title: 'Electricity Bill Payment',
        description: 'Clearance of pending electricity bills for 6 months.',
        requiredAmount: 35000,
        donatedAmount: 0,
        remainingAmount: 35000,
        currency: 'PKR',
        status: 'Draft',
        category: 'Utilities',
        createdAt: '2024-04-15T09:20:00',
        updatedAt: '2024-04-15T09:20:00',
        deadline: '2024-05-05',
        donorsCount: 0,
        documents: [
            { id: 1, name: 'electricity_bills.pdf', size: '2.0 MB', type: 'application/pdf' }
        ],
        approvers: [],
        progress: 0,
        visibility: 'public',
        featured: false,
        tags: ['utilities', 'electricity', 'bills'],
        verificationStatus: 'Not Started',
        assignee: null,
        completionRate: 0,
    },
    {
        id: 'REQ-2024-015',
        title: 'Transportation Vehicle Repair',
        description: 'Repair costs for rickshaw used as main source of income.',
        requiredAmount: 75000,
        donatedAmount: 0,
        remainingAmount: 75000,
        currency: 'PKR',
        status: 'Draft',
        category: 'Transportation',
        createdAt: '2024-04-18T16:10:00',
        updatedAt: '2024-04-18T16:10:00',
        deadline: '2024-06-15',
        donorsCount: 0,
        documents: [
            { id: 1, name: 'repair_estimate.pdf', size: '1.5 MB', type: 'application/pdf' }
        ],
        approvers: [],
        progress: 0,
        visibility: 'public',
        featured: false,
        tags: ['transportation', 'repair', 'income'],
        verificationStatus: 'Not Started',
        assignee: null,
        completionRate: 0,
    },
    {
        id: 'REQ-2024-016',
        title: 'Wedding Expenses Support',
        description: 'Assistance for simple wedding ceremony for daughter.',
        requiredAmount: 300000,
        donatedAmount: 0,
        remainingAmount: 300000,
        currency: 'PKR',
        status: 'Draft',
        category: 'Other',
        createdAt: '2024-04-20T13:00:00',
        updatedAt: '2024-04-20T13:00:00',
        deadline: '2024-08-30',
        donorsCount: 0,
        documents: [
            { id: 1, name: 'wedding_plan.pdf', size: '1.9 MB', type: 'application/pdf' }
        ],
        approvers: [],
        progress: 0,
        visibility: 'public',
        featured: false,
        tags: ['wedding', 'ceremony', 'family'],
        verificationStatus: 'Not Started',
        assignee: null,
        completionRate: 0,
    },
    {
        id: 'REQ-2024-017',
        title: 'Computer for Online Work',
        description: 'Laptop purchase for freelance online work opportunities.',
        requiredAmount: 120000,
        donatedAmount: 0,
        remainingAmount: 120000,
        currency: 'PKR',
        status: 'Draft',
        category: 'Business',
        createdAt: '2024-04-22T10:45:00',
        updatedAt: '2024-04-22T10:45:00',
        deadline: '2024-07-15',
        donorsCount: 0,
        documents: [
            { id: 1, name: 'laptop_quotation.pdf', size: '1.3 MB', type: 'application/pdf' }
        ],
        approvers: [],
        progress: 0,
        visibility: 'public',
        featured: false,
        tags: ['business', 'laptop', 'freelance'],
        verificationStatus: 'Not Started',
        assignee: null,
        completionRate: 0,
    },
    {
        id: 'REQ-2024-018',
        title: 'Medical Treatment for Cancer',
        description: 'Chemotherapy treatment for stage 2 cancer patient.',
        requiredAmount: 1200000,
        donatedAmount: 500000,
        remainingAmount: 700000,
        currency: 'PKR',
        status: 'Approved',
        category: 'Medical',
        createdAt: '2024-04-01T09:30:00',
        updatedAt: '2024-04-15T14:20:00',
        deadline: '2024-06-30',
        donorsCount: 3,
        documents: [
            { id: 1, name: 'medical_report.pdf', size: '2.5 MB', type: 'application/pdf' },
            { id: 2, name: 'treatment_quotation.pdf', size: '1.8 MB', type: 'application/pdf' }
        ],
        approvers: ['Admin1', 'Admin2'],
        progress: 42,
        visibility: 'public',
        featured: true,
        tags: ['medical', 'cancer', 'treatment'],
        verificationStatus: 'Completed',
        assignee: 'Admin1',
        completionRate: 42,
    },
    {
        id: 'REQ-2024-019',
        title: 'Home Renovation After Flood',
        description: 'Repair home damaged by recent floods.',
        requiredAmount: 800000,
        donatedAmount: 0,
        remainingAmount: 800000,
        currency: 'PKR',
        status: 'Validated',
        category: 'Housing',
        createdAt: '2024-04-03T11:45:00',
        updatedAt: '2024-04-10T10:15:00',
        deadline: '2024-08-31',
        donorsCount: 0,
        documents: [
            { id: 1, name: 'damage_assessment.pdf', size: '3.2 MB', type: 'application/pdf' }
        ],
        approvers: [],
        progress: 0,
        visibility: 'public',
        featured: false,
        tags: ['housing', 'flood', 'renovation'],
        verificationStatus: 'In Progress',
        assignee: 'Admin2',
        completionRate: 0,
    },
    {
        id: 'REQ-2024-020',
        title: 'Business Startup Funds',
        description: 'Starting a small grocery store business.',
        requiredAmount: 500000,
        donatedAmount: 0,
        remainingAmount: 500000,
        currency: 'PKR',
        status: 'Rejected',
        category: 'Business',
        createdAt: '2024-04-05T14:20:00',
        updatedAt: '2024-04-12T16:30:00',
        deadline: '2024-07-15',
        donorsCount: 0,
        documents: [
            { id: 1, name: 'business_plan.pdf', size: '2.1 MB', type: 'application/pdf' }
        ],
        approvers: ['Admin1'],
        progress: 0,
        visibility: 'private',
        featured: false,
        tags: ['business', 'startup'],
        verificationStatus: 'Completed',
        assignee: 'Admin1',
        completionRate: 0,
        rejectionReason: 'Business plan not feasible'
    },
    {
        id: 'REQ-2024-021',
        title: 'School Supplies for Orphanage',
        description: 'Purchase school supplies for 50 orphan children.',
        requiredAmount: 250000,
        donatedAmount: 150000,
        remainingAmount: 100000,
        currency: 'PKR',
        status: 'Approved',
        category: 'Education',
        createdAt: '2024-04-08T10:00:00',
        updatedAt: '2024-04-20T09:45:00',
        deadline: '2024-05-31',
        donorsCount: 5,
        documents: [
            { id: 1, name: 'orphanage_certificate.pdf', size: '1.5 MB', type: 'application/pdf' },
            { id: 2, name: 'supplies_list.pdf', size: '0.9 MB', type: 'application/pdf' }
        ],
        approvers: ['Admin1', 'Admin2', 'Admin3'],
        progress: 60,
        visibility: 'public',
        featured: true,
        tags: ['education', 'orphanage', 'children'],
        verificationStatus: 'Completed',
        assignee: 'Admin2',
        completionRate: 60,
    },
    {
        id: 'REQ-2024-022',
        title: 'Vehicle Purchase for Delivery',
        description: 'Purchase motorcycle for food delivery work.',
        requiredAmount: 300000,
        donatedAmount: 0,
        remainingAmount: 300000,
        currency: 'PKR',
        status: 'Rejected',
        category: 'Business',
        createdAt: '2024-04-10T13:15:00',
        updatedAt: '2024-04-18T11:30:00',
        deadline: '2024-06-30',
        donorsCount: 0,
        documents: [
            { id: 1, name: 'vehicle_quotation.pdf', size: '1.3 MB', type: 'application/pdf' }
        ],
        approvers: ['Admin2'],
        progress: 0,
        visibility: 'private',
        featured: false,
        tags: ['business', 'vehicle', 'delivery'],
        verificationStatus: 'Completed',
        assignee: 'Admin2',
        completionRate: 0,
        rejectionReason: 'Alternative transportation options available'
    }
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

const DocumentUpload = React.memo(({ documents, onDocumentsChange, isDark, fieldErrors, onFieldError, shakeFields }) => {
    const [dragActive, setDragActive] = useState(false);

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
            const newFiles = Array.from(e.dataTransfer.files).map(file => ({
                id: Date.now() + Math.random(),
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type
            }));
            onDocumentsChange([...documents, ...newFiles]);
            if (onFieldError && newFiles.length > 0) {
                onFieldError('documents', '');
            }
        }
    }, [documents, onDocumentsChange, onFieldError]);

    const formatFileSize = useCallback((bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }, []);

    const handleFileChange = useCallback((e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                id: Date.now() + Math.random(),
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type
            }));
            onDocumentsChange([...documents, ...newFiles]);
            if (onFieldError && newFiles.length > 0) {
                onFieldError('documents', '');
            }
        }
    }, [documents, formatFileSize, onDocumentsChange, onFieldError]);

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
                                ? 'border-gray-600 bg-gray-800 hover:border-violet-400'
                                : 'border-gray-300 bg-gray-50 hover:border-violet-400'
                            } ${fieldErrors?.documents ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : ''}`}
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
                                <p className={`text-sm sm:text-base font-semibold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                    {dragActive ? 'Drop files here' : 'Drop files or click to upload'}
                                </p>
                                <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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
                                        <p className={`text-xs sm:text-sm font-semibold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                            {doc.name}
                                        </p>
                                        <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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
    fullNumber,
    delay,
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
                duration: 8,
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
                        {typeof value === 'string' && value.includes('₹')
                            ? value
                            : typeof value === 'number'
                                ? (title.includes('Amount') || title.includes('Required')
                                    ? `₹ ${value.toLocaleString()}`
                                    : value.toLocaleString())
                                : value
                        }
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


const Pagination = React.memo(({ currentPage, totalPages, onPageChange, isDark, totalItems, itemsPerPage }) => {
    if (totalPages <= 1) return null;

    const handlePageChange = useCallback((page) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);

            setTimeout(() => {
                const requestsSection = document.querySelector('.requests-grid-container')?.parentElement;
                if (requestsSection) {
                    const yOffset = -100;
                    const y = requestsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

                    window.scrollTo({
                        top: Math.max(0, y),
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }, [currentPage, totalPages, onPageChange]);

    // Calculate range of items being shown
    const startItem = ((currentPage - 1) * itemsPerPage) + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Show max 5 dots
    const dots = [];
    const maxDots = 5;

    if (totalPages <= maxDots) {
        for (let i = 1; i <= totalPages; i++) {
            dots.push(i);
        }
    } else {
        // Always show first, last, and current with neighbors
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
            {/* Page info */}
            <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Page {currentPage} of {totalPages} • Showing {startItem}-{endItem} requests from {totalItems}
            </div>

            <div className="flex items-center gap-4">
                {/* Previous button */}
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

                {/* Page dots */}
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

                {/* Next button */}
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

// Move CreateRequestModal outside of the MyRequests component
const CreateRequestModal = React.memo(({
    isDark,
    editingRequest,
    formData,
    fieldErrors,
    shakeFields,
    onFormChange,
    onDocumentsChange,
    onClose,
    onSubmit,
    categoryOptions
}) => {
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        onSubmit();
    }, [onSubmit]);

    return (
        <motion.div
            key="create-request-modal"
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
                <div className="relative p-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-white mb-1">
                                {editingRequest ? 'Edit Request' : 'Create New Request'}
                            </h2>
                            <p className="text-violet-100 text-sm font-medium">
                                {editingRequest ? 'Update request information' : 'Create a new donation request'}
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

                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
                        <div className="space-y-4 sm:space-y-5">
                            {/* Row 1: Title and Required Amount */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Title Field */}
                                <div className="overflow-visible">
                                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        &nbsp;Title <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                                    </label>
                                    <motion.div
                                        animate={shakeFields.includes('title') ? "shake" : "initial"}
                                        variants={shakeAnimation}
                                        className="overflow-visible relative"
                                    >
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={onFormChange}
                                            placeholder="Heart surgery funding request"
                                            maxLength={100}
                                            autoComplete="off"
                                            className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 focus:outline-none text-sm font-medium ${isDark
                                                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                                } ${fieldErrors.title ? 'border-rose-500' : ''}`}
                                        />
                                        <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {formData.title.length}/100
                                        </div>
                                    </motion.div>
                                    {fieldErrors.title && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                                        >
                                            <XCircle size={12} />
                                            {fieldErrors.title}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Required Amount Field */}
                                <div className="overflow-visible">
                                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        &nbsp;Required Amount <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                                    </label>
                                    <motion.div
                                        animate={shakeFields.includes('requiredAmount') ? "shake" : "initial"}
                                        variants={shakeAnimation}
                                        className="overflow-visible"
                                    >
                                        <input
                                            type="number"
                                            name="requiredAmount"
                                            value={formData.requiredAmount}
                                            onChange={onFormChange}
                                            placeholder="300000"
                                            min="0"
                                            step="1"
                                            autoComplete="off"
                                            className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                                ? 'bg-gray-800 border-gray-600 text-white'
                                                : 'bg-white border-gray-200 text-gray-900'
                                                } ${fieldErrors.requiredAmount ? 'border-rose-500' : ''}`}
                                            style={{
                                                color: (!formData.requiredAmount || formData.requiredAmount === '0')
                                                    ? (isDark ? '#9CA3AF' : '#6B7280')
                                                    : (isDark ? '#FFFFFF' : '#111827')
                                            }}
                                        />
                                    </motion.div>
                                    {fieldErrors.requiredAmount && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                                        >
                                            <XCircle size={12} />
                                            {fieldErrors.requiredAmount}
                                        </motion.p>
                                    )}
                                </div>
                            </div>

                            {/* Row 2: Description (Full Width) */}
                            <div className="overflow-visible">
                                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    &nbsp;Description <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                                </label>
                                <motion.div
                                    animate={shakeFields.includes('description') ? "shake" : "initial"}
                                    variants={shakeAnimation}
                                    className="overflow-visible relative"
                                >
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={onFormChange}
                                        rows={4}
                                        placeholder="Please describe your situation in detail. Explain why you need funds, how they will be used, and your current circumstances."
                                        maxLength={1000}
                                        autoComplete="off"
                                        className={`w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium resize-none ${isDark
                                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                            } ${fieldErrors.description ? 'border-rose-500' : ''}`}
                                    />
                                    <div className={`absolute bottom-2 right-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {formData.description.length}/1000
                                    </div>
                                </motion.div>
                                {fieldErrors.description && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                                    >
                                        <XCircle size={12} />
                                        {fieldErrors.description}
                                    </motion.p>
                                )}
                            </div>

                            {/* Row 3: Deadline and Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Deadline Field */}
                                <div className="overflow-visible">
                                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        &nbsp;Deadline <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                                    </label>
                                    <motion.div
                                        animate={shakeFields.includes('deadline') ? "shake" : "initial"}
                                        variants={shakeAnimation}
                                        className="overflow-visible"
                                    >
                                        <input
                                            type="date"
                                            name="deadline"
                                            value={formData.deadline}
                                            onChange={onFormChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            autoComplete="off"
                                            className={`date-field w-full p-2 sm:p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                                ? 'bg-gray-800 border-gray-600 text-white'
                                                : 'bg-white border-gray-200 text-gray-900'
                                                } ${fieldErrors.deadline ? 'border-rose-500' : ''} 
                                                ${formData.deadline ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}
                                            style={{
                                                color: formData.deadline ? '' : (isDark ? '#9CA3AF' : '#6B7280')
                                            }}
                                        />
                                        <style jsx>{`
                                            .date-field::-webkit-calendar-picker-indicator {
                                                ${isDark
                                                ? 'filter: invert(39%) sepia(6%) saturate(1199%) hue-rotate(182deg) brightness(94%) contrast(87%);'
                                                : 'filter: invert(39%) sepia(6%) saturate(1199%) hue-rotate(182deg) brightness(94%) contrast(87%);'
                                            }
                                                cursor: pointer;
                                            }
                                        `}</style>
                                    </motion.div>
                                    {fieldErrors.deadline && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                                        >
                                            <XCircle size={12} />
                                            {fieldErrors.deadline}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Category Field */}
                                <div className="relative">
                                    <label className={`text-xs font-semibold uppercase tracking-wide mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        &nbsp;Category <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                                    </label>

                                    <motion.div
                                        animate={shakeFields.includes('category') ? "shake" : "initial"}
                                        variants={shakeAnimation}
                                        className="relative"
                                    >
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={onFormChange}
                                            autoComplete="off"
                                            className={`w-full p-3 rounded-2xl text-sm font-medium transition-all appearance-none ${isDark
                                                ? 'bg-gray-800 border-gray-600'
                                                : 'bg-white border-gray-200'
                                                } border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none ${formData.category === ""
                                                    ? (isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]')
                                                    : (isDark ? 'text-white' : 'text-gray-900')
                                                } ${fieldErrors.category ? 'border-rose-500' : ''}`}
                                        >
                                            <option value="">
                                                &nbsp;Select Category
                                            </option>
                                            {categoryOptions.filter(opt => opt !== 'All Categories').map(option => (
                                                <option
                                                    key={option}
                                                    value={option}
                                                    className={isDark ? 'text-white bg-gray-800' : 'text-gray-900 bg-white'}
                                                >
                                                    &nbsp;{option}
                                                </option>
                                            ))}
                                        </select>

                                        <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <ChevronDown size={16} />
                                        </div>
                                    </motion.div>

                                    {fieldErrors.category && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 text-rose-600 text-xs font-medium mt-1"
                                        >
                                            <AlertCircle size={12} />
                                            {fieldErrors.category}
                                        </motion.p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Document Upload Section */}
                        <div>
                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                &nbsp;Documents <span className="text-rose-500 font-normal normal-case">&nbsp;*</span>
                            </label>
                            <DocumentUpload
                                documents={formData.documents}
                                onDocumentsChange={onDocumentsChange}
                                isDark={isDark}
                                fieldErrors={fieldErrors}
                                onFieldError={(field, error) => {
                                    // This will be handled in parent
                                }}
                                shakeFields={shakeFields}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <motion.button
                                type="button"
                                onClick={onClose}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex-1 px-6 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${isDark
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
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold shadow-xl flex items-center justify-center gap-2"
                            >
                                {editingRequest ? (
                                    <>
                                        <CheckCircle size={16} />
                                        Update Request
                                    </>
                                ) : (
                                    <>
                                        <Plus size={16} />
                                        Create Request
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
});

// ==================== MAIN MY REQUESTS COMPONENT ====================
const MyRequests = ({ isDark, showCreateForm = false, onFormClose }) => {
    const [requests, setRequests] = useState(mockRequestsData);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState('All Titles');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [editingRequest, setEditingRequest] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [confirmationDialog, setConfirmationDialog] = useState({
        title: '',
        message: '',
        type: null,
        data: null,
        onConfirm: null
    });
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        requiredAmount: '',
        deadline: '',
        address: '',
        phone: '',
        email: '',
        documents: []
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [shakeFields, setShakeFields] = useState([]);
    const scrollPosition = useRef(0);

    // ==================== EFFECT FOR HANDLING MODAL SCROLL BAR ====================
useEffect(() => {
    const isAnyModalOpen =
        showCreateModal ||
        showDetailModal ||
        showSuccessDialog ||
        showConfirmationDialog;

    if (isAnyModalOpen) {
        // Save the current scroll position
        scrollPosition.current = window.pageYOffset || document.documentElement.scrollTop;
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'relative';
        document.body.style.height = '100%';
        
        // Calculate scrollbar width to prevent layout shift
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollBarWidth}px`;
        
        // Add a class for additional styling if needed
        document.body.classList.add('modal-open');
    } else {
        // Restore body scrolling
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.height = '';
        document.body.style.paddingRight = '';
        document.body.classList.remove('modal-open');

        // Restore scroll position if it was saved
        if (scrollPosition.current !== undefined) {
            window.scrollTo(0, scrollPosition.current);
        }
    }

    return () => {
        // Cleanup function to ensure styles are reset
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.height = '';
        document.body.style.paddingRight = '';
        document.body.classList.remove('modal-open');
    };
}, [
    showCreateModal,
    showDetailModal,
    showSuccessDialog,
    showConfirmationDialog
]);

    // ==================== REFS ====================
    const fieldRefs = useRef({
        title: null,
        description: null,
        category: null,
        requiredAmount: null,
        deadline: null,
        documents: null
    });

    const isMounted = useRef(true);
    const statsCache = useRef(null);

    // ==================== CONSTANTS ====================
    const statusOptions = useMemo(() => [
        'All Status',
        'Draft',
        'Pending-Validation',
        'Validated',
        'Approved',
        'Rejected',
        'Closed',
        'In-Progress'
    ], []);

    const categoryOptions = useMemo(() => [
        'All Categories',
        'Medical',
        'Education',
        'Emergency',
        'Food',
        'Housing',
        'Business',
        'Utilities',
        'Transportation',
        'Other'
    ], []);

    // ==================== EFFECTS ====================
    useEffect(() => {
        isMounted.current = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        if (showCreateForm && !showCreateModal) {
            setShowCreateModal(true);
        }
    }, [showCreateForm, showCreateModal]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedTitle, selectedStatus, selectedCategory, dateRange]);

    // ==================== MEMOIZED COMPUTATIONS ====================
    const filteredRequests = useMemo(() => {
        return requests.filter(request => {
            const matchesSearch =
                request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTitle = selectedTitle === 'All Titles' || request.title === selectedTitle;
            const matchesStatus = selectedStatus === 'All Status' || request.status === selectedStatus;
            const matchesCategory = selectedCategory === 'All Categories' || request.category === selectedCategory;
            const requestCreatedDate = request.createdAt.split('T')[0];
            const requestDeadline = request.deadline;
            const matchesStartDate = !dateRange.start || requestCreatedDate >= dateRange.start;
            const matchesEndDate = !dateRange.end || requestDeadline <= dateRange.end;
            return matchesSearch && matchesTitle && matchesStatus && matchesCategory && matchesStartDate && matchesEndDate;
        });
    }, [requests, searchTerm, selectedTitle, selectedStatus, selectedCategory, dateRange]);

    const paginatedRequests = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredRequests, currentPage, itemsPerPage]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredRequests.length / itemsPerPage);
    }, [filteredRequests.length, itemsPerPage]);

    const stats = useMemo(() => {
        if (statsCache.current && JSON.stringify(statsCache.current.source) === JSON.stringify(requests)) {
            return statsCache.current.data;
        }

        const totalRequests = requests.length;
        const draftRequests = requests.filter(r => r.status === 'Draft');
        const validatedRequests = requests.filter(r => r.status === 'Validated');
        const approvedRequests = requests.filter(r => r.status === 'Approved');
        const rejectedRequests = requests.filter(r => r.status === 'Rejected');
        const totalAmountDonated = requests.reduce((sum, r) => sum + r.donatedAmount, 0);

        const computedStats = {
            totalRequests,
            draftRequests: draftRequests.length,
            validatedRequests: validatedRequests.length,
            approvedRequests: approvedRequests.length,
            rejectedRequests: rejectedRequests.length,
            totalAmountDonated,
        };

        statsCache.current = {
            source: [...requests],
            data: computedStats
        };

        return computedStats;
    }, [requests]);

    // ==================== HELPER FUNCTIONS ====================
    const getStatusColor = useCallback((status) => {
        const statusMap = {
            'Draft': { gradient: 'from-slate-500 to-slate-600', icon: File },
            'Pending-Validation': { gradient: 'from-amber-500 to-orange-500', icon: Clock },
            'Validated': { gradient: 'from-blue-500 to-cyan-500', icon: FileCheck },
            'Approved': { gradient: 'from-emerald-500 to-green-500', icon: CheckCircle },
            'Rejected': { gradient: 'from-rose-500 to-red-500', icon: XCircle },
            'In-Progress': { gradient: 'from-violet-500 to-purple-500', icon: TrendingUp },
            'Closed': { gradient: 'from-gray-500 to-gray-600', icon: CheckCircle2 }
        };
        return statusMap[status] || { gradient: 'from-gray-500 to-gray-600', icon: FileText };
    }, []);

    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString('en-PK', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }, []);

    // ==================== MODAL HANDLERS ====================
    const openCreateModal = useCallback(() => {
        setShowCreateModal(true);
        setEditingRequest(null);
        setFormData({
            title: '',
            description: '',
            category: '',
            requiredAmount: '',
            deadline: '',
            address: '',
            phone: '',
            email: '',
            documents: []
        });
        setFieldErrors({});
        setShakeFields([]);
    }, []);

    const closeCreateModal = useCallback(() => {
        setShowCreateModal(false);
        setEditingRequest(null);
        setFormData({
            title: '',
            description: '',
            category: '',
            requiredAmount: '',
            deadline: '',
            address: '',
            phone: '',
            email: '',
            documents: []
        });
        setFieldErrors({});
        setShakeFields([]);

        if (onFormClose) {
            onFormClose();
        }
    }, [onFormClose]);

    const openDetailModal = useCallback((request) => {
        setSelectedRequest(request);
        setShowDetailModal(true);
    }, []);

    const closeDetailModal = useCallback(() => {
        setShowDetailModal(false);
        setSelectedRequest(null);
    }, []);

    const openEditModal = useCallback((request) => {
        setShowCreateModal(true);
        setEditingRequest(request);
        setFormData({
            title: request.title || '',
            description: request.description || '',
            category: request.category || '',
            requiredAmount: request.requiredAmount || '',
            deadline: request.deadline || '',
            address: 'Karachi, Pakistan',
            phone: '+92-300-1234567',
            email: 'user@example.com',
            documents: request.documents || []
        });
        setFieldErrors({});
        setShakeFields([]);
    }, []);

    // ==================== REQUEST HANDLERS ====================
    const handleSubmitForValidation = useCallback((request) => {
        if (request.status === 'Draft') {
            setConfirmationDialog({
                title: 'Submit for Validation',
                message: `Are you sure you want to submit the request "${request.title}" for validation? This will make it visible to administrators for review.`,
                type: 'submit',
                data: request,
                onConfirm: () => {
                    setRequests(prev => prev.map(req =>
                        req.id === request.id ? { ...req, status: 'Pending-Validation' } : req
                    ));
                    setShowSuccessDialog(true);
                    setSuccessMessage('Request submitted for validation successfully!');
                    setShowConfirmationDialog(false);
                }
            });
            setShowConfirmationDialog(true);
        }
    }, []);

    const handleDeleteRequest = useCallback((id) => {
        setConfirmationDialog({
            title: 'Delete Request',
            message: 'Are you sure you want to delete this request? This action cannot be undone.',
            type: 'delete',
            data: { id },
            onConfirm: () => {
                setRequests(prev => prev.filter(request => request.id !== id));
                setShowSuccessDialog(true);
                setSuccessMessage('Request deleted successfully');
                setShowConfirmationDialog(false);
            }
        });
        setShowConfirmationDialog(true);
    }, []);

    const handleCreateRequest = useCallback(() => {
        const newRequest = {
            id: `REQ-${new Date().getFullYear()}-${String(requests.length + 1).padStart(3, '0')}`,
            ...formData,
            requiredAmount: parseFloat(formData.requiredAmount),
            donatedAmount: 0,
            remainingAmount: parseFloat(formData.requiredAmount),
            status: 'Draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            donorsCount: 0,
            progress: 0,
            tags: [formData.category.toLowerCase()],
            approvers: [],
            verificationStatus: 'Not Started',
            assignee: null,
            completionRate: 0,
            featured: false,
            currency: 'PKR',
            visibility: 'public'
        };

        setRequests(prev => [newRequest, ...prev]);
        setShowSuccessDialog(true);
        setSuccessMessage('Request created successfully');
        setShowCreateModal(false);
        setEditingRequest(null);
        setFormData({
            title: '',
            description: '',
            category: '',
            requiredAmount: '',
            deadline: '',
            address: '',
            phone: '',
            email: '',
            documents: []
        });
        setFieldErrors({});
        setShakeFields([]);
    }, [formData, requests.length]);

    const handleUpdateRequest = useCallback(() => {
        setRequests(prev => prev.map(request =>
            request.id === editingRequest.id ? {
                ...request,
                ...formData,
                requiredAmount: parseFloat(formData.requiredAmount),
                remainingAmount: parseFloat(formData.requiredAmount) - request.donatedAmount,
                completionRate: Math.round((request.donatedAmount / parseFloat(formData.requiredAmount)) * 100),
                updatedAt: new Date().toISOString()
            } : request
        ));
        setShowSuccessDialog(true);
        setSuccessMessage('Request updated successfully');
        setShowCreateModal(false);
        setEditingRequest(null);
        setFormData({
            title: '',
            description: '',
            category: '',
            requiredAmount: '',
            deadline: '',
            address: '',
            phone: '',
            email: '',
            documents: []
        });
        setFieldErrors({});
        setShakeFields([]);
    }, [formData, editingRequest]);

    // ==================== FORM HANDLERS ====================
    const handleFormChange = useCallback((e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    }, [fieldErrors]);

    const handleDocumentsChange = useCallback((documents) => {
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
    }, [fieldErrors]);

    const validateForm = useCallback(() => {
        const errors = {};
        const invalidFields = [];

        setShakeFields([]);

        // Title validation
        if (!formData.title.trim()) {
            errors.title = 'Title is required';
            invalidFields.push('title');
        } else if (!/^[A-Za-z\s.,!?()-]+$/.test(formData.title.trim())) {
            errors.title = 'Title can only contain letters, spaces, and basic punctuation (.,!?-)';
            invalidFields.push('title');
        } else if (formData.title.trim().length < 5) {
            errors.title = 'Title must be at least 5 characters long';
            invalidFields.push('title');
        } else if (formData.title.trim().length > 100) {
            errors.title = 'Title cannot exceed 100 characters';
            invalidFields.push('title');
        }

        // Description validation
        if (!formData.description.trim()) {
            errors.description = 'Description is required';
            invalidFields.push('description');
        } else if (!/^[A-Za-z0-9\s.,!?()-]+$/.test(formData.description.trim())) {
            errors.description = 'Description must contain only valid characters';
            invalidFields.push('description');
        } else if (formData.description.trim().length < 10) {
            errors.description = 'Description must be at least 10 characters long';
            invalidFields.push('description');
        } else if (formData.description.trim().length > 1000) {
            errors.description = 'Description cannot exceed 1000 characters';
            invalidFields.push('description');
        }

        // Category validation
        if (!formData.category) {
            errors.category = 'Please select a category';
            invalidFields.push('category');
        }

        // Required Amount validation
        if (!formData.requiredAmount) {
            errors.requiredAmount = 'Required amount is required';
            invalidFields.push('requiredAmount');
        } else {
            const reqAmount = Number(formData.requiredAmount);
            if (isNaN(reqAmount) || reqAmount <= 0) {
                errors.requiredAmount = 'Required amount must be greater than 0';
                invalidFields.push('requiredAmount');
            } else if (!Number.isInteger(reqAmount)) {
                errors.requiredAmount = 'Amount must be a whole number without decimals';
                invalidFields.push('requiredAmount');
            } else if (reqAmount > 10000000) {
                errors.requiredAmount = 'Amount cannot exceed 10,000,000';
                invalidFields.push('requiredAmount');
            }
        }

        // Deadline validation
        if (!formData.deadline) {
            errors.deadline = 'Deadline is required';
            invalidFields.push('deadline');
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(formData.deadline);
            selectedDate.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                errors.deadline = 'Deadline must be today or a future date';
                invalidFields.push('deadline');
            }
        }

        if (formData.documents.length === 0) {
            errors.documents = 'Please upload at least one document';
            invalidFields.push('documents');
        }

        setFieldErrors(errors);

        if (invalidFields.length > 0) {
            setShakeFields([...invalidFields]);
            setTimeout(() => {
                setShakeFields([]);
            }, 600);
            return false;
        }

        return true;
    }, [formData]);

    const handleFormSubmit = useCallback(() => {
        if (!validateForm()) {
            return;
        }

        setConfirmationDialog({
            title: editingRequest ? 'Edit Request' : 'Create New Request',
            message: `Are you sure you want to ${editingRequest ? 'update' : 'create'} the request "${formData.title}"?`,
            type: editingRequest ? 'edit' : 'create',
            data: null,
            onConfirm: editingRequest ? handleUpdateRequest : handleCreateRequest
        });
        setShowConfirmationDialog(true);
    }, [formData, editingRequest, validateForm, handleUpdateRequest, handleCreateRequest]);

    // ==================== REQUEST CARD COMPONENT ====================
    const RequestCard = useCallback(({ request, index, isDark }) => {
        const [showActions, setShowActions] = useState(false);
        const [isHovered, setIsHovered] = useState(false);
        const menuRef = useRef(null);
        const buttonRef = useRef(null);

        const statusConfig = getStatusColor(request.status);
        const StatusIcon = statusConfig.icon;

        const getCategoryIcon = useCallback((category) => {
            const icons = {
                'Medical': Heart,
                'Education': Award,
                'Emergency': AlertTriangle,
                'Food': Users,
                'Housing': Shield,
                'Business': BarChart3,
                'Utilities': Zap,
                'Transportation': Activity,
                'Other': FileText
            };
            return icons[category] || FileText;
        }, []);

        const getCategoryColor = useCallback((category) => {
            const colors = {
                'Medical': 'from-rose-500 to-pink-600',
                'Education': 'from-blue-500 to-cyan-600',
                'Emergency': 'from-amber-500 to-orange-600',
                'Food': 'from-emerald-500 to-teal-600',
                'Housing': 'from-purple-500 to-violet-600',
                'Business': 'from-indigo-500 to-blue-600',
                'Utilities': 'from-yellow-500 to-amber-600',
                'Transportation': 'from-cyan-500 to-blue-600',
                'Other': 'from-gray-500 to-gray-600'
            };
            return colors[category] || 'from-gray-500 to-gray-600';
        }, []);

        const CategoryIcon = getCategoryIcon(request.category);
        const categoryColor = getCategoryColor(request.category);

        const getPrimaryColor = useCallback((color) => {
            if (color.includes('rose')) return '#f43f5e';
            if (color.includes('blue')) return '#3b82f6';
            if (color.includes('amber')) return '#f59e0b';
            if (color.includes('emerald')) return '#10b981';
            if (color.includes('violet')) return '#8b5cf6';
            if (color.includes('purple')) return '#8b5cf6';
            if (color.includes('cyan')) return '#06b6d4';
            if (color.includes('yellow')) return '#eab308';
            return '#6b7280';
        }, []);

        const primaryColor = getPrimaryColor(categoryColor);

        const handleViewDetails = useCallback(() => {
            openDetailModal(request);
            setShowActions(false);
        }, [request]);

        const handleEditRequest = useCallback(() => {
            openEditModal(request);
            setShowActions(false);
        }, [request]);

        const handleSubmitValidation = useCallback(() => {
            handleSubmitForValidation(request);
            setShowActions(false);
        }, [request]);

        const handleDelete = useCallback(() => {
            handleDeleteRequest(request.id);
            setShowActions(false);
        }, [request.id]);

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
                key={`request-card-${request.id}`}
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
                    className={`absolute inset-0 rounded-2xl ${categoryColor.split(' ')[0]}`}
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
                                    {request.title}
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
                                        className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} bg-gradient-to-r ${categoryColor} bg-clip-text text-transparent`}
                                    >
                                        {request.id}
                                    </motion.span>
                                    <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        • {request.category}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Menu - Only show for Draft status */}
                        {request.status === 'Draft' && (
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

                                                <button
                                                    onClick={() => {
                                                        handleEditRequest();
                                                        setShowActions(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-violet-500/20 text-gray-300' : 'hover:bg-violet-100 text-gray-700'
                                                        }`}
                                                >
                                                    <Edit size={16} />
                                                    Edit Request
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        handleSubmitValidation();
                                                        setShowActions(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-emerald-500/20 text-gray-300' : 'hover:bg-emerald-100 text-gray-700'
                                                        }`}
                                                >
                                                    <Send size={16} />
                                                    Submit for Validation
                                                </button>

                                                <div className={`my-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />

                                                <button
                                                    onClick={() => {
                                                        handleDelete();
                                                        setShowActions(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-rose-500/20 text-rose-400' : 'hover:bg-rose-100 text-rose-700'
                                                        }`}
                                                >
                                                    <Trash2 size={16} />
                                                    Delete Request
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} line-clamp-2`}>
                            {request.description}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap mb-6">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            animate={{
                                y: isHovered ? [0, -2, 0] : 0,
                            }}
                            transition={{
                                duration: isHovered ? 1 : 0.1,
                                repeat: isHovered ? Infinity : 0
                            }}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-gradient-to-r ${statusConfig.gradient} text-white shadow-lg`}
                            style={{
                                boxShadow: isHovered ? '0 8px 25px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.15)'
                            }}
                        >
                            <StatusIcon size={14} />
                            {request.status}
                        </motion.div>
                    </div>

                    {/* Financial Info & Progress */}
                    <div className="flex items-center justify-between gap-6 mb-6">
                        <div className="flex-1 space-y-3 min-w-0">
                            <div className="flex justify-between items-center">
                                <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Required
                                </span>
                                <span
                                    className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} truncate ml-2`}
                                    title={'₹ ' + getFullFormattedNumber(request.requiredAmount, false)}
                                >
                                    {formatValue(request.requiredAmount, true)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Donated
                                </span>
                                <span
                                    className="text-lg font-bold text-emerald-500 truncate ml-2"
                                    title={'₹ ' + getFullFormattedNumber(request.donatedAmount, false)}
                                >
                                    {formatValue(request.donatedAmount, true)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Remaining
                                </span>
                                <span
                                    className="text-lg font-bold text-rose-500 truncate ml-2"
                                    title={'₹ ' + getFullFormattedNumber(request.remainingAmount, false)}
                                >
                                    {formatValue(request.remainingAmount, true)}
                                </span>
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <ProgressCircle percentage={request.completionRate} size={80} isDark={isDark} />
                        </div>
                    </div>

                    {/* Additional Info Row */}
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
                            className={`p-3 rounded-xl text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
                        >
                            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Documents
                            </p>
                            <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {request.documents.length}
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
                            className={`p-3 rounded-xl text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
                        >
                            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Created
                            </p>
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {formatDate(request.createdAt)}
                            </p>
                        </motion.div>
                    </div>

                    {/* Footer Buttons */}
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
                                Deadline: {formatDate(request.deadline)}
                            </span>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        );
    }, [getStatusColor, formatDate, openDetailModal, openEditModal, handleSubmitForValidation, handleDeleteRequest]);

    // ==================== DETAIL MODAL ====================
    const DetailModal = useCallback(() => {
        if (!selectedRequest) return null;

        const statusConfig = getStatusColor(selectedRequest.status);
        const StatusIcon = statusConfig.icon;

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
                    <div className="relative p-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-t-3xl">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-bold text-white mb-1">
                                    Request Details
                                </h2>
                                <p className="text-violet-100 text-sm font-medium">
                                    View complete information about this request
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={closeDetailModal}
                                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                                >
                                    <X size={20} className="text-white" />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Request Overview */}
                        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {selectedRequest.title}
                            </h3>
                            <p className={`text-sm mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {selectedRequest.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Request ID
                                    </p>
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {selectedRequest.id}
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Category
                                    </p>
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {selectedRequest.category}
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Status
                                    </p>
                                    <div className={`inline-flex items-center gap-2 px-2 py-1 text-xs rounded-full bg-gradient-to-r ${statusConfig.gradient} text-white`}>
                                        <StatusIcon size={12} />
                                        {selectedRequest.status}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financial Information */}
                        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Financial Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Required Amount
                                    </p>
                                    <p
                                        className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                                        title={'₹ ' + getFullFormattedNumber(selectedRequest.requiredAmount, false)}
                                    >
                                        {formatValue(selectedRequest.requiredAmount, true)}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Donated Amount
                                    </p>
                                    <p
                                        className={`text-2xl font-bold text-emerald-500`}
                                        title={'₹ ' + getFullFormattedNumber(selectedRequest.donatedAmount, false)}
                                    >
                                        {formatValue(selectedRequest.donatedAmount, true)}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Remaining Amount
                                    </p>
                                    <p
                                        className={`text-2xl font-bold text-rose-500`}
                                        title={'₹ ' + getFullFormattedNumber(selectedRequest.remainingAmount, false)}
                                    >
                                        {formatValue(selectedRequest.remainingAmount, true)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline & Documents */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Timeline */}
                            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Timeline
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Created Date
                                        </p>
                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {formatDate(selectedRequest.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Last Updated
                                        </p>
                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {formatDate(selectedRequest.updatedAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Deadline
                                        </p>
                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {formatDate(selectedRequest.deadline)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Documents ({selectedRequest.documents.length})
                                </h3>
                                <div className="space-y-3">
                                    {selectedRequest.documents.map((doc, index) => (
                                        <div key={doc.id || index} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                                            <FileText size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {doc.name}
                                                </p>
                                                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {doc.size} • {doc.type}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        );
    }, [isDark, selectedRequest, getStatusColor, formatDate, closeDetailModal]);

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
                        Loading requests...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 px-4">
            {/* Create Request Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-end"
            >
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold shadow-xl"
                >
                    <Plus size={16} />
                    Create Request
                </motion.button>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <EnhancedStatCard
                    icon={FileText}
                    title="Draft Requests"
                    value={stats.draftRequests}
                    fullNumber={getFullFormattedNumber(stats.draftRequests, true)}
                    change={8.3}
                    changeType="increase"
                    color="from-blue-500 to-blue-600"
                    delay={0.1}
                    isDark={isDark}
                    iconColor="text-blue-500"
                />
                <EnhancedStatCard
                    icon={FileCheck}
                    title="Validated"
                    value={stats.validatedRequests}
                    fullNumber={getFullFormattedNumber(stats.validatedRequests, true)}
                    change={12.5}
                    changeType="increase"
                    color="from-amber-500 to-orange-600"
                    delay={0.2}
                    isDark={isDark}
                    iconColor="text-amber-500"
                />
                <EnhancedStatCard
                    icon={CheckCircle}
                    title="Approved"
                    value={stats.approvedRequests}
                    fullNumber={getFullFormattedNumber(stats.approvedRequests, true)}
                    change={5.2}
                    changeType="increase"
                    color="from-emerald-500 to-green-600"
                    delay={0.3}
                    isDark={isDark}
                    iconColor="text-emerald-500"
                />
                <EnhancedStatCard
                    icon={XCircle}
                    title="Rejected"
                    value={stats.rejectedRequests}
                    fullNumber={getFullFormattedNumber(stats.rejectedRequests, true)}
                    change={3.8}
                    changeType="decrease"
                    color="from-rose-500 to-red-600"
                    delay={0.4}
                    isDark={isDark}
                    iconColor="text-rose-600"
                />
            </motion.div>

            {/* Search and Filter Section */}
            <div className="filter-section">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
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
                                    placeholder="Search requests by title, ID, or description..."
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
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                        {/* Title Filter */}
                                        <div className="relative">
                                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Request Title
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={selectedTitle}
                                                    onChange={(e) => setSelectedTitle(e.target.value)}
                                                    className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium appearance-none ${isDark
                                                        ? 'bg-gray-800 border-gray-600 text-white'
                                                        : 'bg-white border-gray-200 text-gray-900'
                                                        } ${selectedTitle === 'All Titles'
                                                            ? (isDark ? 'text-gray-400' : 'text-gray-500')
                                                            : (isDark ? 'text-white' : 'text-gray-900')
                                                        }`}
                                                >
                                                    <option value="All Titles">Select Title</option>
                                                    {Array.from(new Set(requests.map(req => req.title))).map(title => (
                                                        <option key={title} value={title}>{title}</option>
                                                    ))}
                                                </select>
                                                <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                                                    <ChevronDown size={16} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Filter */}
                                        <div className="relative">
                                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Status
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                    className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium appearance-none ${isDark
                                                        ? 'bg-gray-800 border-gray-600 text-white'
                                                        : 'bg-white border-gray-200 text-gray-900'
                                                        } ${selectedStatus === 'All Status'
                                                            ? (isDark ? 'text-gray-400' : 'text-gray-500')
                                                            : (isDark ? 'text-white' : 'text-gray-900')
                                                        }`}
                                                >
                                                    {statusOptions.map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                                <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                                                    <ChevronDown size={16} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Category Filter */}
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
                                                        } ${selectedCategory === 'All Categories'
                                                            ? (isDark ? 'text-gray-400' : 'text-gray-500')
                                                            : (isDark ? 'text-white' : 'text-gray-900')
                                                        }`}
                                                >
                                                    {categoryOptions.map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                                <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
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
                                            Showing {filteredRequests.length} of {requests.length} requests
                                            {selectedTitle !== 'All Titles' && ` • Filtered by: ${selectedTitle}`}
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSearchTerm('');
                                                setSelectedTitle('All Titles');
                                                setSelectedStatus('All Status');
                                                setSelectedCategory('All Categories');
                                                setDateRange({ start: '', end: '' });
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

            {/* Requests Card Grid */}
            {paginatedRequests.length > 0 ? (
                <>
                    <div className="requests-grid-container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                        >
                            {paginatedRequests.map((request, index) => (
                                <RequestCard
                                    key={`request-${request.id}-${index}`}
                                    request={request}
                                    index={index}
                                    isDark={isDark}
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
                            totalItems={filteredRequests.length}
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
                        <FileText size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                    </motion.div>
                    <p className={`text-base font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        No requests found
                    </p>
                    <p className={`text-sm font-medium mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        Create your first donation request to get started
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={openCreateModal}
                        className="mt-6 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold shadow-xl"
                    >
                        <Plus size={16} className="inline mr-2" />
                        Create New Request
                    </motion.button>
                </motion.div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {showCreateModal && (
                    <CreateRequestModal
                        key="create-request-modal"
                        isDark={isDark}
                        editingRequest={editingRequest}
                        formData={formData}
                        fieldErrors={fieldErrors}
                        shakeFields={shakeFields}
                        onFormChange={handleFormChange}
                        onDocumentsChange={handleDocumentsChange}
                        onClose={closeCreateModal}
                        onSubmit={handleFormSubmit}
                        categoryOptions={categoryOptions}
                    />
                )}
                {showDetailModal && (
                    <DetailModal />
                )}
                {showConfirmationDialog && (
                    <ConfirmationDialog
                        isDark={isDark}
                        title={confirmationDialog.title}
                        message={confirmationDialog.message}
                        onConfirm={() => {
                            if (confirmationDialog.onConfirm) {
                                confirmationDialog.onConfirm();
                            }
                            setShowConfirmationDialog(false);
                        }}
                        onCancel={() => {
                            setShowConfirmationDialog(false);
                        }}
                        confirmText={
                            confirmationDialog.type === 'delete' ? 'Delete Request' :
                                confirmationDialog.type === 'submit' ? 'Submit for Validation' :
                                    confirmationDialog.type === 'edit' ? 'Update Request' :
                                        'Create Request'
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

export default React.memo(MyRequests);