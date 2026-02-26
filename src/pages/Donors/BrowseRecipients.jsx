import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    FileText,
    User,
    Calendar,
    ChevronDown,
    ChevronUp,
    MoreVertical,
    CheckCircle2,
    X,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    FileCheck,
    AlertTriangle,
    Send,
    RefreshCw,
    Plus,
    UserCheck,
    Forward,
    Users,
    Home,
    Briefcase,
    Heart,
    Award,
    Zap,
    Activity,
    Settings,
    Download,
    AlertCircle,
    Phone,
    Mail,
    MessageSquare,
    Upload,
    IdCard,
    Trash2,
    FileSpreadsheet,
    FileDown,
    UserPlus,
    CreditCard,
    MapPin,
    Edit,
    Car,
    Stethoscope,
    Cpu,
    ShoppingBag,
    Sprout,
    Building,
    GraduationCap,
    IndianRupee,
    Shield,
    ShieldCheck,
    ShieldX,
    Banknote,
    Wallet,
    Building2
} from 'lucide-react';

// Format value function (same as in your example)
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
    const currencyPrefix = isCurrency ? '₹ ' : '';

    let displayValue;
    let suffix;

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

// ==================== MOCK RECIPIENT DATA ====================
const mockRecipients = [
    {
        id: 'REC-2024-001',
        requestId: 'REQ-2024-001',
        name: 'Rajesh',
        fullName: 'Rajesh Kumar',
        donationHistory: [
            {
                id: 'DON-001',
                donationDate: '2024-04-15T14:30:00',
                amount: 25000,
                paymentMethod: 'UPI',
                transactionId: 'TXN-001234567890',
                paymentStatus: 'Successful',
                receiptGenerated: true,
                receiptUrl: '#',
                requestTitle: 'Medical Treatment for Cancer',
                requiredAmount: 1200000,
                recipientVerified: true,
                requestApproved: true,
                category: 'Medical',
                donorId: 'USER-001',
                role: 'donor',
                name: 'John Doe',
                email: 'john@example.com'
            },

        ],
        age: 45,
        location: 'Mumbai, Maharashtra',
        occupation: 'Business Owner',
        familyDetails: 'Wife and 2 children',
        requestTitle: 'Medical Treatment for Cancer',
        description: 'Chemotherapy treatment for stage 2 cancer patient. Requires funding for 6 cycles of chemotherapy and supportive medication.',
        requiredAmount: 1200000,
        donatedAmount: 500000,
        remainingAmount: 700000,
        category: 'Medical',
        urgency: 'High',
        requestStatus: 'Approved',
        deadline: '2024-06-30',
        profileStatus: 'Verified',
        profileCompletion: 95,
        verificationStatus: {
            aadhaar: 'verified',
            pan: 'verified',
            addressProof: 'verified',
            incomeProof: 'pending',
            bankProof: 'verified'
        },
        supportingDocuments: {
            medicalReport: 'available',
            treatmentQuotation: 'available'
        },
        bankDetails: {
            bankName: 'State Bank of India',
            accountNumber: 'XXXXXX9012',
            fullAccountNumber: '123456789012',
            ifscCode: 'SBIN0001234',
            accountHolderName: 'Rajesh Kumar',
            upiId: 'rajesh.kumar@upi'
        },
        createdAt: '2024-04-01T09:30:00',
        donorsCount: 3,
        progress: 42,
        tags: ['medical', 'cancer', 'treatment']
    },
    {
        id: 'REC-2024-002',
        requestId: 'REQ-2024-002',
        name: 'Priya',
        donationHistory: [
            {
                id: 'DON-002',
                donationDate: '2024-04-10T11:20:00',
                amount: 15000,
                paymentMethod: 'Bank Transfer',
                transactionId: 'TXN-009876543210',
                paymentStatus: 'Successful',
                receiptGenerated: true,
                receiptUrl: '#',
                requestTitle: 'Medical Treatment for Cancer',
                requiredAmount: 1200000,
                recipientVerified: true,
                requestApproved: true,
                category: 'Medical',
                donorId: 'USER-001',
                role: 'donor',
                name: 'John Doe',
                email: 'john@example.com'
            }
        ],
        fullName: 'Priya Sharma',
        age: 32,
        location: 'Delhi, Delhi',
        occupation: 'Teacher',
        familyDetails: 'Living with elderly parents',
        requestTitle: 'Home Renovation After Flood',
        description: 'Repair home damaged by recent floods. Roof repair, wall reconstruction, and furniture replacement needed.',
        requiredAmount: 800000,
        donatedAmount: 200000,
        remainingAmount: 600000,
        category: 'Housing',
        urgency: 'Medium',
        requestStatus: 'Validated',
        deadline: '2024-08-31',
        profileStatus: 'Verified',
        profileCompletion: 88,
        verificationStatus: {
            aadhaar: 'verified',
            pan: 'verified',
            addressProof: 'verified',
            incomeProof: 'verified',
            bankProof: 'verified'
        },
        supportingDocuments: {
            medicalReport: 'not-available',
            treatmentQuotation: 'not-available'
        },
        bankDetails: {
            bankName: 'HDFC Bank',
            accountNumber: 'XXXXXX3456',
            fullAccountNumber: '987654321012',
            ifscCode: 'HDFC0000123',
            accountHolderName: 'Priya Sharma',
            upiId: 'priya.sharma@upi'
        },
        createdAt: '2024-04-03T11:45:00',
        donorsCount: 1,
        progress: 25,
        tags: ['housing', 'flood', 'renovation']
    },
    {
        id: 'REC-2024-003',
        requestId: 'REQ-2024-003',
        name: 'Arun',
        fullName: 'Arun Singh',
        donationHistory: [
            {
                id: 'DON-003',
                donationDate: '2024-04-05T09:45:00',
                amount: 10000,
                paymentMethod: 'Credit Card',
                transactionId: 'TXN-005678912345',
                paymentStatus: 'Successful',
                receiptGenerated: false,
                receiptUrl: null,
                requestTitle: 'Medical Treatment for Cancer',
                requiredAmount: 1200000,
                recipientVerified: true,
                requestApproved: true,
                category: 'Medical',
                donorId: 'USER-001',
                role: 'donor',
                name: 'John Doe',
                email: 'john@example.com'
            }
        ],
        age: 28,
        location: 'Bangalore, Karnataka',
        occupation: 'Software Engineer',
        familyDetails: 'Single, living alone',
        requestTitle: 'Education Fund for Sister',
        description: 'Funding for sister\'s engineering college fees for the next academic year.',
        requiredAmount: 300000,
        donatedAmount: 0,
        remainingAmount: 300000,
        category: 'Education',
        urgency: 'Low',
        requestStatus: 'Approved',
        deadline: '2024-07-15',
        profileStatus: 'Unverified',
        profileCompletion: 75,
        verificationStatus: {
            aadhaar: 'verified',
            pan: 'pending',
            addressProof: 'verified',
            incomeProof: 'pending',
            bankProof: 'verified'
        },
        supportingDocuments: {
            medicalReport: 'not-available',
            treatmentQuotation: 'not-available'
        },
        bankDetails: {
            bankName: 'ICICI Bank',
            accountNumber: 'XXXXXX7890',
            fullAccountNumber: '567890123456',
            ifscCode: 'ICIC0004567',
            accountHolderName: 'Arun Singh',
            upiId: 'arun.singh@upi'
        },
        createdAt: '2024-04-05T14:20:00',
        donorsCount: 0,
        progress: 0,
        tags: ['education', 'college', 'fees']
    },
    {
        id: 'REC-2024-004',
        requestId: 'REQ-2024-004',
        name: 'Meena',
        fullName: 'Meena Patel',
        age: 55,
        location: 'Ahmedabad, Gujarat',
        occupation: 'Housewife',
        familyDetails: 'Widow with 3 children',
        requestTitle: 'Emergency Surgery for Heart',
        description: 'Emergency bypass surgery required. Hospital has given immediate admission.',
        requiredAmount: 1500000,
        donatedAmount: 750000,
        remainingAmount: 750000,
        category: 'Medical',
        urgency: 'High',
        requestStatus: 'Approved',
        deadline: '2024-05-15',
        profileStatus: 'Verified',
        profileCompletion: 92,
        verificationStatus: {
            aadhaar: 'verified',
            pan: 'verified',
            addressProof: 'verified',
            incomeProof: 'verified',
            bankProof: 'verified'
        },
        supportingDocuments: {
            medicalReport: 'available',
            treatmentQuotation: 'available'
        },
        bankDetails: {
            bankName: 'Axis Bank',
            accountNumber: 'XXXXXX2345',
            fullAccountNumber: '234567890123',
            ifscCode: 'UTIB0001234',
            accountHolderName: 'Meena Patel',
            upiId: 'meena.patel@axisbank'
        },
        createdAt: '2024-03-20T10:15:00',
        donorsCount: 5,
        progress: 50,
        tags: ['medical', 'surgery', 'emergency']
    },
    {
        id: 'REC-2024-005',
        requestId: 'REQ-2024-005',
        name: 'Vikram',
        fullName: 'Vikram Joshi',
        age: 40,
        location: 'Pune, Maharashtra',
        occupation: 'Shopkeeper',
        familyDetails: 'Wife and 1 child',
        requestTitle: 'Business Recovery Fund',
        description: 'Funds needed to restock shop after fire incident damaged inventory.',
        requiredAmount: 500000,
        donatedAmount: 100000,
        remainingAmount: 400000,
        category: 'Business',
        urgency: 'Medium',
        requestStatus: 'Validated',
        deadline: '2024-09-30',
        profileStatus: 'Verified',
        profileCompletion: 85,
        verificationStatus: {
            aadhaar: 'verified',
            pan: 'verified',
            addressProof: 'verified',
            incomeProof: 'verified',
            bankProof: 'pending'
        },
        supportingDocuments: {
            medicalReport: 'not-available',
            treatmentQuotation: 'not-available'
        },
        bankDetails: {
            bankName: 'Bank of Baroda',
            accountNumber: 'XXXXXX5678',
            fullAccountNumber: '345678901234',
            ifscCode: 'BARB0PUNEXX',
            accountHolderName: 'Vikram Joshi',
            upiId: 'vikram.joshi@bob'
        },
        createdAt: '2024-04-10T13:45:00',
        donorsCount: 2,
        progress: 20,
        tags: ['business', 'recovery', 'fire']
    },
    {
        id: 'REC-2024-006',
        requestId: 'REQ-2024-006',
        name: 'Sanya',
        fullName: 'Sanya Verma',
        age: 22,
        location: 'Lucknow, Uttar Pradesh',
        occupation: 'Student',
        familyDetails: 'Living with parents',
        requestTitle: 'Higher Studies Abroad',
        description: 'Tuition fees for Masters program in Computer Science at University of Melbourne.',
        requiredAmount: 2500000,
        donatedAmount: 500000,
        remainingAmount: 2000000,
        category: 'Education',
        urgency: 'Medium',
        requestStatus: 'Approved',
        deadline: '2024-12-31',
        profileStatus: 'Verified',
        profileCompletion: 90,
        verificationStatus: {
            aadhaar: 'verified',
            pan: 'pending',
            addressProof: 'verified',
            incomeProof: 'verified',
            bankProof: 'verified'
        },
        supportingDocuments: {
            medicalReport: 'not-available',
            treatmentQuotation: 'available'
        },
        bankDetails: {
            bankName: 'Kotak Mahindra Bank',
            accountNumber: 'XXXXXX9011',
            fullAccountNumber: '456789012345',
            ifscCode: 'KKBK0001234',
            accountHolderName: 'Sanya Verma',
            upiId: 'sanya.verma@kotak'
        },
        createdAt: '2024-03-15T09:20:00',
        donorsCount: 3,
        progress: 20,
        tags: ['education', 'abroad', 'masters']
    },
    {
        id: 'REC-2024-007',
        requestId: 'REQ-2024-007',
        name: 'Amit',
        fullName: 'Amit Verma',
        age: 38,
        location: 'Chennai, Tamil Nadu',
        occupation: 'Taxi Driver',
        familyDetails: 'Wife and 2 children',
        requestTitle: 'Vehicle Repair After Accident',
        description: 'Funds needed to repair taxi damaged in a road accident. This is the only source of income for the family.',
        requiredAmount: 250000,
        donatedAmount: 50000,
        remainingAmount: 200000,
        category: 'Transport',
        urgency: 'High',
        requestStatus: 'Approved',
        deadline: '2024-05-30',
        profileStatus: 'Verified',
        profileCompletion: 80,
        verificationStatus: {
            aadhaar: 'verified',
            pan: 'verified',
            addressProof: 'verified',
            incomeProof: 'verified',
            bankProof: 'verified'
        },
        supportingDocuments: {
            medicalReport: 'not-available',
            treatmentQuotation: 'available'
        },
        bankDetails: {
            bankName: 'Indian Bank',
            accountNumber: 'XXXXXX1122',
            fullAccountNumber: '112233445566',
            ifscCode: 'IDIB000C123',
            accountHolderName: 'Amit Verma',
            upiId: 'amit.verma@indianbank'
        },
        createdAt: '2024-04-12T08:00:00',
        donorsCount: 2,
        progress: 20,
        tags: ['transport', 'accident', 'vehicle']
    },
    {
        id: 'REC-2024-008',
        requestId: 'REQ-2024-008',
        name: 'Geeta',
        fullName: 'Geeta Reddy',
        age: 50,
        location: 'Hyderabad, Telangana',
        occupation: 'Farmer',
        familyDetails: 'Husband passed away, 3 children',
        requestTitle: 'Agricultural Equipment Purchase',
        description: 'Need to purchase new farming equipment after old equipment broke down. This is essential for the next crop season.',
        requiredAmount: 400000,
        donatedAmount: 100000,
        remainingAmount: 300000,
        category: 'Agriculture',
        urgency: 'Medium',
        requestStatus: 'Validated',
        deadline: '2024-08-15',
        profileStatus: 'Verified',
        profileCompletion: 85,
        verificationStatus: {
            aadhaar: 'verified',
            pan: 'pending',
            addressProof: 'verified',
            incomeProof: 'verified',
            bankProof: 'verified'
        },
        supportingDocuments: {
            medicalReport: 'not-available',
            treatmentQuotation: 'available'
        },
        bankDetails: {
            bankName: 'Andhra Bank',
            accountNumber: 'XXXXXX3344',
            fullAccountNumber: '223344556677',
            ifscCode: 'ANDB0001234',
            accountHolderName: 'Geeta Reddy',
            upiId: 'geeta.reddy@andhrabank'
        },
        createdAt: '2024-04-08T14:30:00',
        donorsCount: 1,
        progress: 25,
        tags: ['agriculture', 'farmer', 'equipment']
    },
    {
        id: 'REC-2024-009',
        requestId: 'REQ-2024-009',
        name: 'Rohan',
        fullName: 'Rohan Malhotra',
        age: 19,
        location: 'Chandigarh, Punjab',
        occupation: 'Student',
        familyDetails: 'Parents are daily wage workers',
        requestTitle: 'Engineering College Admission',
        description: 'First year engineering college fees for a bright student from economically weaker section.',
        requiredAmount: 150000,
        donatedAmount: 30000,
        remainingAmount: 120000,
        category: 'Education',
        urgency: 'Medium',
        requestStatus: 'Approved',
        deadline: '2024-07-01',
        profileStatus: 'Verified',
        profileCompletion: 90,
        verificationStatus: {
            aadhaar: 'verified',
            pan: 'pending',
            addressProof: 'verified',
            incomeProof: 'verified',
            bankProof: 'verified'
        },
        supportingDocuments: {
            medicalReport: 'not-available',
            treatmentQuotation: 'available'
        },
        bankDetails: {
            bankName: 'Punjab National Bank',
            accountNumber: 'XXXXXX5566',
            fullAccountNumber: '334455667788',
            ifscCode: 'PUNB0123400',
            accountHolderName: 'Rohan Malhotra',
            upiId: 'rohan.malhotra@pnb'
        },
        createdAt: '2024-04-14T10:00:00',
        donorsCount: 3,
        progress: 20,
        tags: ['education', 'engineering', 'college']
    },
    {
        id: 'REC-2024-010',
        requestId: 'REQ-2024-010',
        name: 'Sunita',
        fullName: 'Sunita Desai',
        age: 60,
        location: 'Nagpur, Maharashtra',
        occupation: 'Retired Teacher',
        familyDetails: 'Living alone',
        requestTitle: 'Knee Replacement Surgery',
        description: 'Total knee replacement surgery needed due to severe arthritis affecting mobility.',
        requiredAmount: 300000,
        donatedAmount: 0,
        remainingAmount: 300000,
        category: 'Medical',
        urgency: 'High',
        requestStatus: 'Approved',
        deadline: '2024-06-15',
        profileStatus: 'Verified',
        profileCompletion: 88,
        verificationStatus: {
            aadhaar: 'verified',
            pan: 'verified',
            addressProof: 'verified',
            incomeProof: 'verified',
            bankProof: 'verified'
        },
        supportingDocuments: {
            medicalReport: 'available',
            treatmentQuotation: 'available'
        },
        bankDetails: {
            bankName: 'Union Bank of India',
            accountNumber: 'XXXXXX7788',
            fullAccountNumber: '445566778899',
            ifscCode: 'UBIN0534567',
            accountHolderName: 'Sunita Desai',
            upiId: 'sunita.desai@unionbank'
        },
        createdAt: '2024-04-02T16:45:00',
        donorsCount: 0,
        progress: 0,
        tags: ['medical', 'surgery', 'elderly']
    },
    {
        id: 'REC-2024-011',
        requestId: 'REQ-2024-011',
        name: 'Kiran',
        fullName: 'Kiran Bansal',
        age: 35,
        location: 'Jaipur, Rajasthan',
        occupation: 'Small Business Owner',
        familyDetails: 'Wife and 1 child',
        requestTitle: 'Shop Renovation After Earthquake',
        description: 'Shop damaged in recent earthquake. Needs structural repair and restocking of goods.',
        requiredAmount: 600000,
        donatedAmount: 150000,
        remainingAmount: 450000,
        category: 'Business',
        urgency: 'High',
        requestStatus: 'Validated',
        deadline: '2024-08-31',
        profileStatus: 'Verified',
        profileCompletion: 82,
        verificationStatus: {
            aadhaar: 'verified',
            pan: 'verified',
            addressProof: 'verified',
            incomeProof: 'verified',
            bankProof: 'pending'
        },
        supportingDocuments: {
            medicalReport: 'not-available',
            treatmentQuotation: 'available'
        },
        bankDetails: {
            bankName: 'Bank of Rajasthan',
            accountNumber: 'XXXXXX9900',
            fullAccountNumber: '556677889900',
            ifscCode: 'BORR0123456',
            accountHolderName: 'Kiran Bansal',
            upiId: 'kiran.bansal@bor'
        },
        createdAt: '2024-03-25T11:20:00',
        donorsCount: 2,
        progress: 25,
        tags: ['business', 'earthquake', 'renovation']
    },
    {
        id: 'REC-2024-012',
        requestId: 'REQ-2024-012',
        name: 'Deepak',
        fullName: 'Deepak Sharma',
        age: 29,
        location: 'Patna, Bihar',
        occupation: 'Government Clerk',
        familyDetails: 'Parents and younger sister',
        requestTitle: 'Sister\'s Wedding Expenses',
        description: 'Funds needed for younger sister\'s wedding. Family has limited income.',
        requiredAmount: 500000,
        donatedAmount: 100000,
        remainingAmount: 400000,
        category: 'Other',
        urgency: 'Low',
        requestStatus: 'Pending',
        deadline: '2024-10-31',
        profileStatus: 'Verified',
        profileCompletion: 75,
        verificationStatus: {
            aadhaar: 'verified',
            pan: 'verified',
            addressProof: 'verified',
            incomeProof: 'verified',
            bankProof: 'verified'
        },
        supportingDocuments: {
            medicalReport: 'not-available',
            treatmentQuotation: 'not-available'
        },
        bankDetails: {
            bankName: 'State Bank of Patiala',
            accountNumber: 'XXXXXX0011',
            fullAccountNumber: '667788990011',
            ifscCode: 'STBP0001234',
            accountHolderName: 'Deepak Sharma',
            upiId: 'deepak.sharma@sbp'
        },
        createdAt: '2024-04-07T13:15:00',
        donorsCount: 1,
        progress: 20,
        tags: ['wedding', 'family', 'celebration']
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

const EnhancedStatCard = React.memo(({
    icon: Icon,
    title,
    value,
    change,
    changeType,
    color,
    delay,
    isDark,
    fullNumber,
    subtitle,
    iconColor,
    isCurrency = false
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
                        className={`text-2xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent ${color.includes('blue') ? 'from-blue-500 to-cyan-500' :
                            color.includes('emerald') ? 'from-emerald-500 to-teal-500' :
                                color.includes('violet') ? 'from-violet-500 to-purple-500' :
                                    color.includes('cyan') ? 'from-cyan-500 to-blue-500' :
                                        color.includes('rose') ? 'from-rose-500 to-pink-500' :
                                            color.includes('purple') || color.includes('indigo') ? 'from-purple-500 to-indigo-600' :
                                                'from-amber-500 to-orange-500'
                            }`}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: delay + 0.2, type: "spring" }}
                        title={fullNumber}
                    >
                        {isCurrency ? formatValue(value, true) : formatValue(value, false)}
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
                                        color.includes('violet') || color.includes('purple') || color.includes('indigo') ? 'text-violet-500' :
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

const DonationHistory = React.memo(({ isDark, recipient, currentUser }) => {
    const [showDonationHistory, setShowDonationHistory] = useState(false);
    const [donationHistory, setDonationHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            // Filter donations for current user to this specific recipient
            const userDonations = recipient.donationHistory?.filter(
                donation => donation.donorId === currentUser?.id
            ) || [];

            setDonationHistory(userDonations);
            setLoading(false);
        }, 500);
    }, [recipient.id, recipient.donationHistory, currentUser?.id]);

    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    const handleDownloadReceipt = useCallback((donation) => {
        if (donation.receiptGenerated) {
            alert(`Downloading receipt for donation ${donation.id}`);
        }
    }, []);

    // Don't show anything if no donations
    if (donationHistory.length === 0) {
        return null;
    }

    // Calculate total donated to this recipient
    const totalDonated = donationHistory.reduce((sum, donation) => sum + donation.amount, 0);

    return (
        <div className="space-y-4">
            {/* Header with collapsible toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h4 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Banknote size={20} className="text-emerald-500" />
                        Your Donation History to {recipient.name}
                    </h4>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                        {donationHistory.length} donation{donationHistory.length > 1 ? 's' : ''}
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDonationHistory(!showDonationHistory)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold ${isDark
                        ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                >
                    {showDonationHistory ? (
                        <>
                            <ChevronUp size={16} />
                            Hide Details
                        </>
                    ) : (
                        <>
                            <ChevronDown size={16} />
                            Show Details
                        </>
                    )}
                </motion.button>
            </div>

            {/* Summary Stats (Always visible) */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'}`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h5 className={`text-sm font-bold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Total Donated to {recipient.name}
                        </h5>
                        <p className={`text-2xl font-bold text-emerald-600`}>
                            {formatValue(totalDonated, true)}
                        </p>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className={`p-2 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                            <Banknote size={24} className="text-emerald-500" />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Collapsible Donation Details */}
            <AnimatePresence>
                {showDonationHistory && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-4">
                            {/* Donation List */}
                            <h5 className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Donation Details ({donationHistory.length} transactions)
                            </h5>

                            {donationHistory.map((donation, index) => (
                                <motion.div
                                    key={donation.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                                >
                                    {/* Rest of your donation card code... */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                Donation #{donationHistory.length - index}
                                            </p>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {formatDate(donation.donationDate)}
                                            </p>
                                        </div>
                                        <span className={`text-lg font-bold text-emerald-600`}>
                                            {formatValue(donation.amount, true)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Payment Method
                                            </label>
                                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {donation.paymentMethod}
                                            </p>
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Transaction ID
                                            </label>
                                            <p className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} truncate`} title={donation.transactionId}>
                                                {donation.transactionId}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Payment Status
                                            </label>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${donation.paymentStatus === 'Successful'
                                                ? 'bg-emerald-500/20 text-emerald-600'
                                                : donation.paymentStatus === 'Pending'
                                                    ? 'bg-amber-500/20 text-amber-600'
                                                    : 'bg-rose-500/20 text-rose-600'
                                                }`}>
                                                {donation.paymentStatus === 'Successful' ? (
                                                    <CheckCircle size={10} />
                                                ) : donation.paymentStatus === 'Pending' ? (
                                                    <Clock size={10} />
                                                ) : (
                                                    <XCircle size={10} />
                                                )}
                                                {donation.paymentStatus}
                                            </span>
                                        </div>
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Receipt
                                            </label>
                                            {donation.receiptGenerated ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDownloadReceipt(donation)}
                                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${isDark
                                                        ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                        }`}
                                                >
                                                    <Download size={10} />
                                                    Download Receipt
                                                </motion.button>
                                            ) : (
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                                                    <X size={10} />
                                                    Not Generated
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Purpose and Verification */}
                                    <div className={`pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <div className="mb-2">
                                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Purpose / Request
                                            </label>
                                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {donation.requestTitle}
                                            </p>
                                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Your contribution: {formatValue(donation.amount, true)} of {formatValue(donation.requiredAmount, true)} required
                                                ({((donation.amount / donation.requiredAmount) * 100).toFixed(1)}%)
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Recipient Verified
                                                </label>
                                                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${donation.recipientVerified
                                                    ? 'text-emerald-600'
                                                    : 'text-rose-600'
                                                    }`}>
                                                    {donation.recipientVerified ? (
                                                        <>
                                                            <CheckCircle size={12} />
                                                            Yes
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle size={12} />
                                                            No
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Request Approved
                                                </label>
                                                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${donation.requestApproved
                                                    ? 'text-emerald-600'
                                                    : 'text-rose-600'
                                                    }`}>
                                                    {donation.requestApproved ? (
                                                        <>
                                                            <CheckCircle size={12} />
                                                            Yes
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle size={12} />
                                                            No
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

const Pagination = React.memo(({ currentPage, totalPages, onPageChange, isDark, totalItems, itemsPerPage }) => {
    if (totalPages <= 1) return null;

    const handlePageChange = useCallback((page) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);

            // Add smooth scroll to top of recipients section after page change
            setTimeout(() => {
                const recipientsSection = document.querySelector('.recipients-grid-container')?.parentElement;
                if (recipientsSection) {
                    const yOffset = -100;
                    const y = recipientsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

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
                Page {currentPage} of {totalPages} • Showing {startItem}-{endItem} recipients from {totalItems}
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

const SuccessDialog = React.memo(({ isDark, title, message, onClose }) => {
    return (
        <motion.div
            key="success-dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={onClose}
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
            onClick={onCancel}
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

// ==================== OCCUPATION CONFIGURATION ====================
const getOccupationConfig = (occupation) => {
    // Normalize occupation string for matching
    const normalizedOccupation = occupation?.toString().toLowerCase().trim() || '';

    const configs = {
        // Medical/Healthcare
        'doctor': {
            icon: Stethoscope,
            color: '#ec4899', // Pink
            gradient: 'from-pink-500 to-rose-500',
            textColor: 'text-pink-600',
            bgColor: 'bg-pink-500/20',
            borderColor: 'border-pink-500'
        },
        'medical': {
            icon: Heart,
            color: '#ec4899',
            gradient: 'from-pink-500 to-rose-500',
            textColor: 'text-pink-600',
            bgColor: 'bg-pink-500/20',
            borderColor: 'border-pink-500'
        },
        'patient': {
            icon: Heart,
            color: '#ec4899',
            gradient: 'from-pink-500 to-rose-500',
            textColor: 'text-pink-600',
            bgColor: 'bg-pink-500/20',
            borderColor: 'border-pink-500'
        },

        // Business/Entrepreneur
        'business': {
            icon: Briefcase,
            color: '#8b5cf6', // Violet
            gradient: 'from-violet-500 to-purple-500',
            textColor: 'text-violet-600',
            bgColor: 'bg-violet-500/20',
            borderColor: 'border-violet-500'
        },
        'entrepreneur': {
            icon: Briefcase,
            color: '#8b5cf6',
            gradient: 'from-violet-500 to-purple-500',
            textColor: 'text-violet-600',
            bgColor: 'bg-violet-500/20',
            borderColor: 'border-violet-500'
        },
        'business owner': {
            icon: Briefcase,
            color: '#8b5cf6',
            gradient: 'from-violet-500 to-purple-500',
            textColor: 'text-violet-600',
            bgColor: 'bg-violet-500/20',
            borderColor: 'border-violet-500'
        },

        // Education
        'student': {
            icon: GraduationCap,
            color: '#3b82f6', // Blue
            gradient: 'from-blue-500 to-cyan-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-500/20',
            borderColor: 'border-blue-500'
        },
        'teacher': {
            icon: UserPlus,
            color: '#10b981', // Emerald
            gradient: 'from-emerald-500 to-green-500',
            textColor: 'text-emerald-600',
            bgColor: 'bg-emerald-500/20',
            borderColor: 'border-emerald-500'
        },
        'education': {
            icon: Award,
            color: '#3b82f6',
            gradient: 'from-blue-500 to-cyan-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-500/20',
            borderColor: 'border-blue-500'
        },

        // Shopkeeper/Merchant
        'shopkeeper': {
            icon: ShoppingBag,
            color: '#f59e0b', // Amber
            gradient: 'from-amber-500 to-orange-500',
            textColor: 'text-amber-600',
            bgColor: 'bg-amber-500/20',
            borderColor: 'border-amber-500'
        },
        'merchant': {
            icon: ShoppingBag,
            color: '#f59e0b',
            gradient: 'from-amber-500 to-orange-500',
            textColor: 'text-amber-600',
            bgColor: 'bg-amber-500/20',
            borderColor: 'border-amber-500'
        },

        // Farmer/Agriculture
        'farmer': {
            icon: Sprout,
            color: '#22c55e', // Green
            gradient: 'from-green-500 to-emerald-500',
            textColor: 'text-green-600',
            bgColor: 'bg-green-500/20',
            borderColor: 'border-green-500'
        },
        'agriculture': {
            icon: Sprout,
            color: '#22c55e',
            gradient: 'from-green-500 to-emerald-500',
            textColor: 'text-green-600',
            bgColor: 'bg-green-500/20',
            borderColor: 'border-green-500'
        },

        // Driver/Transport
        'driver': {
            icon: Car,
            color: '#6366f1', // Indigo
            gradient: 'from-indigo-500 to-blue-500',
            textColor: 'text-indigo-600',
            bgColor: 'bg-indigo-500/20',
            borderColor: 'border-indigo-500'
        },
        'transport': {
            icon: Car,
            color: '#6366f1',
            gradient: 'from-indigo-500 to-blue-500',
            textColor: 'text-indigo-600',
            bgColor: 'bg-indigo-500/20',
            borderColor: 'border-indigo-500'
        },

        // Engineer/Tech
        'engineer': {
            icon: Cpu,
            color: '#0ea5e9', // Sky Blue
            gradient: 'from-sky-500 to-cyan-500',
            textColor: 'text-sky-600',
            bgColor: 'bg-sky-500/20',
            borderColor: 'border-sky-500'
        },
        'tech': {
            icon: Cpu,
            color: '#0ea5e9',
            gradient: 'from-sky-500 to-cyan-500',
            textColor: 'text-sky-600',
            bgColor: 'bg-sky-500/20',
            borderColor: 'border-sky-500'
        },

        // Bank/Finance
        'bank': {
            icon: Banknote,
            color: '#8b5cf6', // Violet
            gradient: 'from-violet-500 to-purple-500',
            textColor: 'text-violet-600',
            bgColor: 'bg-violet-500/20',
            borderColor: 'border-violet-500'
        },
        'finance': {
            icon: Banknote,
            color: '#8b5cf6',
            gradient: 'from-violet-500 to-purple-500',
            textColor: 'text-violet-600',
            bgColor: 'bg-violet-500/20',
            borderColor: 'border-violet-500'
        },

        // Government/Officer
        'government': {
            icon: Building,
            color: '#6b7280', // Gray
            gradient: 'from-gray-500 to-slate-500',
            textColor: 'text-gray-600',
            bgColor: 'bg-gray-500/20',
            borderColor: 'border-gray-500'
        },
        'officer': {
            icon: Building,
            color: '#6b7280',
            gradient: 'from-gray-500 to-slate-500',
            textColor: 'text-gray-600',
            bgColor: 'bg-gray-500/20',
            borderColor: 'border-gray-500'
        },

        // Emergency
        'emergency': {
            icon: AlertTriangle,
            color: '#ef4444', // Red
            gradient: 'from-red-500 to-rose-500',
            textColor: 'text-red-600',
            bgColor: 'bg-red-500/20',
            borderColor: 'border-red-500'
        },

        // Housing
        'housing': {
            icon: Home,
            color: '#f97316', // Orange
            gradient: 'from-orange-500 to-amber-500',
            textColor: 'text-orange-600',
            bgColor: 'bg-orange-500/20',
            borderColor: 'border-orange-500'
        },

        // Default
        'default': {
            icon: User,
            color: '#8b5cf6', // Violet (default)
            gradient: 'from-violet-500 to-purple-500',
            textColor: 'text-violet-600',
            bgColor: 'bg-violet-500/20',
            borderColor: 'border-violet-500'
        }
    };

    // Find matching config
    for (const [key, config] of Object.entries(configs)) {
        if (normalizedOccupation.includes(key)) {
            return config;
        }
    }

    // Return default if no match found
    return configs.default;
};

const RecipientCard = React.memo(({
    recipient,
    index,
    isDark,
    onViewDetails,
    onDonate,
    currentUser
}) => {
    const [showActions, setShowActions] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    // Get occupation config for this recipient
    const occupationConfig = useMemo(() => getOccupationConfig(recipient.occupation), [recipient.occupation]);
    const primaryColor = occupationConfig.color;
    const categoryColor = occupationConfig.gradient;
    const Icon = occupationConfig.icon;

    const getStatusColor = useCallback((status) => {
        const statusMap = {
            'Approved': { gradient: 'from-emerald-500 to-green-500', icon: CheckCircle, color: '#10b981' },
            'Validated': { gradient: 'from-blue-500 to-cyan-500', icon: FileCheck, color: '#3b82f6' },
            'Pending': { gradient: 'from-amber-500 to-orange-500', icon: Clock, color: '#f59e0b' },
            'Rejected': { gradient: 'from-rose-500 to-red-500', icon: XCircle, color: '#ef4444' }
        };
        return statusMap[status] || { gradient: 'from-gray-500 to-gray-600', icon: FileText, color: '#6b7280' };
    }, []);

    const getUrgencyColor = useCallback((urgency) => {
        const urgencyMap = {
            'High': 'bg-rose-500/20 text-rose-600 border-rose-500/30',
            'Medium': 'bg-amber-500/20 text-amber-600 border-amber-500/30',
            'Low': 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
        };
        return urgencyMap[urgency] || 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }, []);

    const getCategoryIcon = useCallback((category) => {
        const icons = {
            'Medical': Heart,
            'Education': Award,
            'Housing': Home,
            'Business': Briefcase,
            'Other': FileText
        };
        return icons[category] || FileText;
    }, []);

    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }, []);

    const CategoryIcon = getCategoryIcon(recipient.category);
    const statusConfig = getStatusColor(recipient.requestStatus);
    const StatusIcon = statusConfig.icon;
    const urgencyColor = getUrgencyColor(recipient.urgency);

    const handleViewDetails = useCallback(() => {
        onViewDetails(recipient);
        setShowActions(false);
    }, [recipient, onViewDetails]);

    const handleDonate = useCallback(() => {
        onDonate(recipient);
        setShowActions(false);
    }, [recipient, onDonate]);

    // Calculate verification percentage
    const verificationPercentage = useMemo(() => {
        const verificationFields = Object.values(recipient.verificationStatus || {});
        const verifiedCount = verificationFields.filter(status => status === 'verified').length;
        return Math.round((verifiedCount / verificationFields.length) * 100);
    }, [recipient.verificationStatus]);

    // Calculate completion percentage for progress
    const completionPercentage = useMemo(() => {
        const baseProgress = recipient.progress || 0;
        const verificationWeight = verificationPercentage * 0.3; // 30% weight for verification
        const donationWeight = baseProgress * 0.7; // 70% weight for donations
        return Math.round(verificationWeight + donationWeight);
    }, [recipient.progress, verificationPercentage]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showActions && menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowActions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showActions]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.5, type: "spring" }}
            whileHover={{ y: -5, scale: 1.02 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
            {/* ========== FLOATING ORBS ANIMATION ========== */}
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

            {/* ========== FLOATING RING ANIMATION ========== */}
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

            {/* ========== PULSING GLOW EFFECT ========== */}
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

            {/* ========== SHIMMER LINES ANIMATION ========== */}
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

            {/* ========== LIGHT BACKGROUND OVERLAY ========== */}
            <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${categoryColor}`}
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

            {/* ========== PARTICLE DOTS ========== */}
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
                                <Icon
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
                                {recipient.name}
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
                                    {recipient.id}
                                </motion.span>
                                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    • {recipient.occupation}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ========== ACTION MENU ========== */}
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
                                            onClick={handleViewDetails}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-blue-500/20 text-gray-300' : 'hover:bg-blue-100 text-gray-700'
                                                }`}
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </button>

                                        <button
                                            onClick={handleDonate}
                                            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-emerald-500/20 text-gray-300' : 'hover:bg-emerald-100 text-gray-700'}`}
                                        >
                                            <Banknote size={16} />
                                            Donate Now
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} line-clamp-2`}>
                        {recipient.requestTitle}
                    </p>
                </div>

                {/* Status & Urgency Badges */}
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
                        {recipient.requestStatus}
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
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium ${urgencyColor}`}
                    >
                        <AlertTriangle size={12} />
                        {recipient.urgency}
                    </motion.div>
                </div>

                {/* Financial Info */}
                <div className="flex items-center justify-between gap-6 mb-6">
                    <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex justify-between items-center">
                            <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Required
                            </span>
                            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} truncate ml-2`}>
                                {formatValue(recipient.requiredAmount, true)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Donated
                            </span>
                            <span className="text-lg font-bold text-emerald-500 truncate ml-2">
                                {formatValue(recipient.donatedAmount, true)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Remaining
                            </span>
                            <span className="text-lg font-bold text-rose-500 truncate ml-2">
                                {formatValue(recipient.remainingAmount, true)}
                            </span>
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        <ProgressCircle percentage={completionPercentage} size={80} isDark={isDark} />
                    </div>
                </div>

                {/* Additional Info Grid */}
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
                            Age
                        </p>
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {recipient.age} years
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
                            {formatDate(recipient.createdAt)}
                        </p>
                    </motion.div>
                </div>

                {/* Verification & Category */}
                <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                        <Shield size={12} />
                        {verificationPercentage}% Verified
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium ${isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>
                        <CategoryIcon size={12} />
                        {recipient.category}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/20">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar size={14} className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                            Deadline: {formatDate(recipient.deadline)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <MapPin size={14} className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                            {recipient.location.split(',')[0]}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

// ==================== VIEW RECIPIENT DETAILS MODAL ====================
const ViewRecipientModal = React.memo(({ isDark, recipient, onClose, currentUser }) => {
    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }, []);

    return (
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
                                Recipient Details
                            </h2>
                            <p className="text-violet-100 text-sm font-medium">
                                {recipient.requestId} • {recipient.requestTitle}
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
                    <div className="p-6 space-y-8">
                        {/* Personal Information Section */}
                        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                            <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <User size={20} className="text-blue-500" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Full Name
                                        </label>
                                        <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {recipient.fullName}
                                        </p>
                                    </div>
                                    <div>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Age
                                        </label>
                                        <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {recipient.age} years
                                        </p>
                                    </div>
                                    <div>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Location
                                        </label>
                                        <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {recipient.location}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Occupation
                                        </label>
                                        <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {recipient.occupation}
                                        </p>
                                    </div>
                                    <div>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Family Details
                                        </label>
                                        <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {recipient.familyDetails}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Profile Verification Section */}
                        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                            <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <Shield size={20} className="text-emerald-500" />
                                Profile Verification
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Profile Status
                                        </label>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${recipient.profileStatus === 'Verified' ?
                                            'bg-emerald-500/20 text-emerald-600' :
                                            'bg-rose-500/20 text-rose-600'
                                            }`}>
                                            {recipient.profileStatus}
                                        </span>
                                    </div>
                                    <div>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Profile Completion
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                                <div
                                                    className={`h-full rounded-full ${recipient.profileCompletion >= 75 ? 'bg-emerald-500' :
                                                        recipient.profileCompletion >= 50 ? 'bg-blue-500' :
                                                            'bg-amber-500'
                                                        }`}
                                                    style={{ width: `${recipient.profileCompletion}%` }}
                                                />
                                            </div>
                                            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {recipient.profileCompletion}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className={`text-sm font-bold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Verification Status
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Aadhaar</span>
                                            <span className={`text-sm font-semibold ${recipient.verificationStatus.aadhaar === 'verified' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {recipient.verificationStatus.aadhaar === 'verified' ? '✓ Verified' : '✗ Pending'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>PAN</span>
                                            <span className={`text-sm font-semibold ${recipient.verificationStatus.pan === 'verified' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {recipient.verificationStatus.pan === 'verified' ? '✓ Verified' : '✗ Pending'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Address Proof</span>
                                            <span className={`text-sm font-semibold ${recipient.verificationStatus.addressProof === 'verified' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {recipient.verificationStatus.addressProof === 'verified' ? '✓ Verified' : '✗ Pending'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Income Proof</span>
                                            <span className={`text-sm font-semibold ${recipient.verificationStatus.incomeProof === 'verified' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {recipient.verificationStatus.incomeProof === 'verified' ? '✓ Verified' : '✗ Pending'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Bank Proof</span>
                                            <span className={`text-sm font-semibold ${recipient.verificationStatus.bankProof === 'verified' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {recipient.verificationStatus.bankProof === 'verified' ? '✓ Verified' : '✗ Pending'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Request Information Section */}
                        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                            <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <FileText size={20} className="text-violet-500" />
                                Request Information
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Request Title
                                    </label>
                                    <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {recipient.requestTitle}
                                    </p>
                                </div>
                                <div>
                                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Description
                                    </label>
                                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {recipient.description}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Required Amount
                                        </label>
                                        <p className={`text-xl font-bold text-violet-600`}>
                                            {formatValue(recipient.requiredAmount, true)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Donated Amount
                                        </label>
                                        <p className={`text-xl font-bold text-emerald-600`}>
                                            {formatValue(recipient.donatedAmount, true)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Remaining Amount
                                        </label>
                                        <p className={`text-xl font-bold text-rose-600`}>
                                            {formatValue(recipient.remainingAmount, true)}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Category
                                        </label>
                                        <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {recipient.category}
                                        </p>
                                    </div>
                                    <div>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Urgency
                                        </label>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${recipient.urgency === 'High' ? 'bg-rose-500/20 text-rose-600' :
                                            recipient.urgency === 'Medium' ? 'bg-amber-500/20 text-amber-600' :
                                                recipient.urgency === 'Low' ? 'bg-emerald-500/20 text-emerald-600' :
                                                    'bg-gray-500/20 text-gray-600'
                                            }`}>
                                            {recipient.urgency}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Request Status
                                        </label>
                                        <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {recipient.requestStatus}
                                        </p>
                                    </div>
                                    <div>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Deadline
                                        </label>
                                        <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {formatDate(recipient.deadline)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Supporting Documents Section */}
                        <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                            <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <FileText size={20} className="text-amber-500" />
                                Supporting Documents
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Medical Report
                                    </label>
                                    <span className={`text-sm font-semibold ${recipient.supportingDocuments.medicalReport === 'available' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {recipient.supportingDocuments.medicalReport === 'available' ? '✓ Available' : '✗ Not Available'}
                                    </span>
                                </div>
                                <div>
                                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Treatment Quotation
                                    </label>
                                    <span className={`text-sm font-semibold ${recipient.supportingDocuments.treatmentQuotation === 'available' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {recipient.supportingDocuments.treatmentQuotation === 'available' ? '✓ Available' : '✗ Not Available'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Donation History Section (only shown to donors) */}
                        {currentUser && currentUser.role === 'donor' && recipient.donationHistory?.some(
                            donation => donation.donorId === currentUser.id
                        ) && (
                                <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                    <DonationHistory
                                        isDark={isDark}
                                        recipient={recipient}
                                        currentUser={currentUser}
                                    />
                                </div>
                            )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
});

// ==================== DONATE MODAL ====================
const DonateModal = React.memo(({ isDark, recipient, onClose, onConfirmDonation }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleConfirmDonation = () => {
        setShowConfirmation(true);
    };

    const handleFinalConfirm = () => {
        onConfirmDonation(recipient);
        setShowConfirmation(false);
        onClose();
    };

    return (
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
                className={`rounded-3xl w-full max-w-md mx-4 ${isDark
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
                <div className="relative p-6 bg-gradient-to-r from-emerald-600 to-green-600 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">
                                {showConfirmation ? 'Confirm Donation' : 'Bank Details for Donation'}
                            </h2>
                            <p className="text-emerald-100 text-sm font-medium">
                                {showConfirmation ? 'Please confirm your donation' : 'Transfer funds to recipient account'}
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
                    <div className="p-6">
                        {!showConfirmation ? (
                            <>
                                <div className="mb-6">
                                    <p className={`text-base font-medium mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Please transfer funds to the following bank account:
                                    </p>

                                    <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                        <div className="space-y-4">
                                            <div>
                                                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Bank Name
                                                </label>
                                                <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {recipient.bankDetails.bankName}
                                                </p>
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Account Number
                                                </label>
                                                <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {recipient.bankDetails.accountNumber}
                                                </p>
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    IFSC Code
                                                </label>
                                                <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {recipient.bankDetails.ifscCode}
                                                </p>
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Account Holder Name
                                                </label>
                                                <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {recipient.bankDetails.accountHolderName}
                                                </p>
                                            </div>
                                            <div>
                                                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    UPI ID
                                                </label>
                                                <p className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {recipient.bankDetails.upiId}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <motion.button
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
                                        onClick={handleConfirmDonation}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl text-sm font-semibold shadow-xl"
                                    >
                                        I've Transferred Funds
                                    </motion.button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mb-6">
                                    <p className={`text-base font-medium mb-6 text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Have you successfully transferred the funds to the recipient's account?
                                    </p>
                                    <div className="flex justify-center mb-6">
                                        <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                            <p className={`text-sm font-semibold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                Recipient: {recipient.fullName}
                                            </p>
                                            <p className={`text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Account: {recipient.bankDetails.accountNumber}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <motion.button
                                        onClick={() => setShowConfirmation(false)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex-1 px-6 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${isDark
                                            ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                            }`}
                                    >
                                        Back
                                    </motion.button>
                                    <motion.button
                                        onClick={handleFinalConfirm}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl text-sm font-semibold shadow-xl"
                                    >
                                        Yes, I've Donated
                                    </motion.button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
});

const ProgressCircle = React.memo(({ percentage, size = 80, isDark }) => {
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = (percent) => {
        if (percent >= 75) return '#10b981'; // emerald
        if (percent >= 50) return '#3b82f6'; // blue
        if (percent >= 25) return '#f59e0b'; // amber
        return '#ef4444'; // red
    };

    const color = getColor(percentage);

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={isDark ? '#374151' : '#e5e7eb'}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{
                        transition: 'stroke-dashoffset 1s ease-in-out',
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                    >
                        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {percentage}%
                        </span>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
});

// ==================== BROWSE RECIPIENTS COMPONENT ====================
const BrowseRecipients = ({ isDark, currentUser }) => {
    const actualCurrentUser = currentUser || {
        id: 'USER-001',
        role: 'donor',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91-98765-43210'
    };
    const [recipients, setRecipients] = useState(mockRecipients);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedUrgency, setSelectedUrgency] = useState('All Urgency');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDonateModal, setShowDonateModal] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [confirmationDialog, setConfirmationDialog] = useState({
        show: false,
        title: '',
        message: '',
        type: null,
        data: null,
        onConfirm: null
    });

    const scrollPosition = useRef(0);

    // ==================== SCROLL HANDLING EFFECT ====================
    useEffect(() => {
        const isAnyModalOpen =
            showDetailModal ||
            showDonateModal ||
            showSuccessDialog ||
            confirmationDialog.show;

        if (isAnyModalOpen) {
            // Save current scroll position
            scrollPosition.current = window.pageYOffset || document.documentElement.scrollTop;

            // Disable scrolling
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'relative';
            document.body.style.height = '100%';

            // Calculate scrollbar width to prevent layout shift
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollBarWidth}px`;

            document.body.classList.add('modal-open');
        } else {
            // Re-enable scrolling
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

        // Cleanup function
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.height = '';
            document.body.style.paddingRight = '';
            document.body.classList.remove('modal-open');
        };
    }, [showDetailModal, showDonateModal, showSuccessDialog, confirmationDialog.show]);

    // ==================== EFFECTS ====================
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, selectedUrgency, selectedStatus]);

    // ==================== MEMOIZED COMPUTATIONS ====================
    const filteredRecipients = useMemo(() => {
        return recipients.filter(recipient => {
            const matchesSearch =
                recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipient.requestTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipient.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recipient.location.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategory === 'All Categories' || recipient.category === selectedCategory;
            const matchesUrgency = selectedUrgency === 'All Urgency' || recipient.urgency === selectedUrgency;
            const matchesStatus = selectedStatus === 'All Status' || recipient.requestStatus === selectedStatus;

            return matchesSearch && matchesCategory && matchesUrgency && matchesStatus;
        });
    }, [recipients, searchTerm, selectedCategory, selectedUrgency, selectedStatus]);

    const paginatedRecipients = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredRecipients.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredRecipients, currentPage, itemsPerPage]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredRecipients.length / itemsPerPage);
    }, [filteredRecipients.length, itemsPerPage]);

    const stats = useMemo(() => {
        const totalRecipients = recipients.length;
        const urgentRequests = recipients.filter(r => r.urgency === 'High').length;
        const totalDonations = recipients.reduce((sum, r) => sum + r.donatedAmount, 0);
        const totalRequired = recipients.reduce((sum, r) => sum + r.requiredAmount, 0);
        const totalRemaining = recipients.reduce((sum, r) => sum + r.remainingAmount, 0);
        const avgProgress = recipients.reduce((sum, r) => sum + r.progress, 0) / recipients.length;

        return {
            totalRecipients,
            urgentRequests,
            totalDonations,
            totalRequired,
            totalRemaining,
            avgProgress
        };
    }, [recipients]);

    // ==================== MODAL HANDLERS ====================
    const openDetailModal = useCallback((recipient) => {
        setSelectedRecipient(recipient);
        setShowDetailModal(true);
    }, []);

    const closeDetailModal = useCallback(() => {
        setShowDetailModal(false);
        setSelectedRecipient(null);
    }, []);

    const openDonateModal = useCallback((recipient) => {
        setSelectedRecipient(recipient);
        setShowDonateModal(true);
    }, []);

    const closeDonateModal = useCallback(() => {
        setShowDonateModal(false);
        setSelectedRecipient(null);
    }, []);

    // ==================== DONATION HANDLER ====================
    const handleConfirmDonation = useCallback((recipient) => {
        setConfirmationDialog({
            show: true,
            title: 'Confirm Donation',
            message: `Are you sure you want to mark a donation for ${recipient.name}? This action will update their donation records.`,
            type: 'donate',
            data: { recipient },
            onConfirm: () => {
                // Update the recipient's donation amount (mock increase by 10%)
                const donationAmount = Math.min(100000, recipient.remainingAmount * 0.1);

                setRecipients(prev => prev.map(r => {
                    if (r.id === recipient.id) {
                        const newDonatedAmount = r.donatedAmount + donationAmount;
                        const newRemainingAmount = Math.max(0, r.remainingAmount - donationAmount);
                        const newProgress = Math.min(100, (newDonatedAmount / r.requiredAmount) * 100);

                        return {
                            ...r,
                            donatedAmount: newDonatedAmount,
                            remainingAmount: newRemainingAmount,
                            progress: newProgress,
                            donorsCount: r.donorsCount + 1
                        };
                    }
                    return r;
                }));

                setSuccessMessage(`Donation of ${formatValue(donationAmount, true)} recorded successfully for ${recipient.name}!`);
                setShowSuccessDialog(true);
                setShowDonateModal(false);
                setSelectedRecipient(null);
            }
        });
    }, []);

    // ==================== FILTER OPTIONS ====================
    const categoryOptions = useMemo(() => [
        'All Categories',
        'Medical',
        'Education',
        'Housing',
        'Business',
        'Emergency',
        'Other'
    ], []);

    const urgencyOptions = useMemo(() => [
        'All Urgency',
        'High',
        'Medium',
        'Low'
    ], []);

    const statusOptions = useMemo(() => [
        'All Status',
        'Approved',
        'Validated',
        'Pending'
    ], []);

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
                        Loading recipients...
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
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <EnhancedStatCard
                    icon={Users}
                    title="Total Recipients"
                    value={stats.totalRecipients}
                    change={8.5}
                    changeType="increase"
                    color="from-blue-500 to-blue-600"
                    delay={0.1}
                    isDark={isDark}
                    iconColor="text-blue-500"
                />
                <EnhancedStatCard
                    icon={AlertTriangle}
                    title="Immediate Needs"
                    value={stats.urgentRequests}
                    change={18.2}
                    changeType="increase"
                    color="from-rose-500 to-red-600"
                    delay={0.2}
                    isDark={isDark}
                    iconColor="text-rose-500"
                />
                <EnhancedStatCard
                    icon={IndianRupee}
                    title="Total Required"
                    value={stats.totalDonations}
                    change={15.7}
                    changeType="increase"
                    color="from-purple-500 to-indigo-600"
                    delay={0.3}
                    isDark={isDark}
                    iconColor="text-purple-500"
                    isCurrency={true}
                />
                <EnhancedStatCard
                    icon={IndianRupee}
                    title="Total Remaining"
                    value={stats.totalRemaining}
                    change={-5.2}
                    changeType="decrease"
                    color="from-amber-500 to-orange-600"
                    delay={0.4}
                    isDark={isDark}
                    iconColor="text-amber-500"
                    isCurrency={true}
                />
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`rounded-3xl p-6 ${isDark
                    ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900'
                    : 'bg-gradient-to-br from-white via-white to-gray-50'
                    }`}
                style={{
                    boxShadow: isDark
                        ? '0 10px 40px rgba(0, 0, 0, 0.3)'
                        : '0 10px 40px rgba(0, 0, 0, 0.08)'
                }}
            >
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <motion.div whileHover={{ scale: 1.01 }} className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-violet-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search recipients by name, location, request title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
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
                        className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 text-sm font-semibold ${showFilters
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

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className={`p-6 rounded-2xl mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
                                            Urgency
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={selectedUrgency}
                                                onChange={(e) => setSelectedUrgency(e.target.value)}
                                                className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium appearance-none ${isDark
                                                    ? 'bg-gray-800 border-gray-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    }`}
                                            >
                                                {urgencyOptions.map(option => (
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
                                            Status
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium appearance-none ${isDark
                                                    ? 'bg-gray-800 border-gray-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    }`}
                                            >
                                                {statusOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                <ChevronDown size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Showing {filteredRecipients.length} of {recipients.length} recipients
                                    </span>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCategory('All Categories');
                                            setSelectedUrgency('All Urgency');
                                            setSelectedStatus('All Status');
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

            {/* Recipients Grid */}
            {paginatedRecipients.length > 0 ? (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 recipients-grid-container"
                    >
                        {paginatedRecipients.map((recipient, index) => (
                            <RecipientCard
                                key={`recipient-${recipient.id}-${index}`}
                                recipient={recipient}
                                index={index}
                                isDark={isDark}
                                currentUser={currentUser}
                                onViewDetails={openDetailModal}
                                onDonate={openDonateModal}
                            />
                        ))}
                    </motion.div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            isDark={isDark}
                            totalItems={filteredRecipients.length}
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
                >
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <Users size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                    </motion.div>
                    <p className={`text-base font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        No recipients found matching your criteria
                    </p>
                    <p className={`text-sm font-medium mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        Try adjusting your filters or search terms
                    </p>
                </motion.div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {showDetailModal && selectedRecipient && (
                    <ViewRecipientModal
                        isDark={isDark}
                        recipient={selectedRecipient}
                        onClose={closeDetailModal}
                        currentUser={actualCurrentUser}
                    />
                )}

                {showDonateModal && selectedRecipient && (
                    <DonateModal
                        isDark={isDark}
                        recipient={selectedRecipient}
                        onClose={closeDonateModal}
                        onConfirmDonation={handleConfirmDonation}
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

                {confirmationDialog.show && (
                    <ConfirmationDialog
                        isDark={isDark}
                        title={confirmationDialog.title}
                        message={confirmationDialog.message}
                        onConfirm={() => {
                            setConfirmationDialog(prev => ({ ...prev, show: false }));
                            if (confirmationDialog.onConfirm) {
                                confirmationDialog.onConfirm();
                            }
                        }}
                        onCancel={() => setConfirmationDialog(prev => ({ ...prev, show: false }))}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default React.memo(BrowseRecipients);