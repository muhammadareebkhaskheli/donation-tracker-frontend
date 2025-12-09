import React, { useState, useEffect, useMemo, useRef } from 'react';
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
    Users,
    Calendar,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    MoreVertical,
    CheckCircle2,
    X,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    FileCheck,
    AlertTriangle,
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
    Target,
    Paperclip,
    Upload
} from 'lucide-react';

// ==================== MY REQUESTS COMPONENT (RECIPIENT VERSION) ====================
const MyRequests = ({ isDark, showCreateForm = false, onFormClose }) => {
    // Mock data for recipient requests - Include both Draft and Pending-Validation
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
            urgency: 'Medium',
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
            urgency: 'Medium',
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
            urgency: 'Low',
            featured: false,
            tags: ['business', 'expansion', 'grocery'],
            verificationStatus: 'Not Started',
            assignee: null,
            completionRate: 0,
        },
        // Add a submitted request to show how it looks
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
            urgency: 'Medium',
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
            urgency: 'High',
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
            urgency: 'High',
            featured: false,
            tags: ['medical', 'emergency', 'surgery'],
            verificationStatus: 'Not Started',
            assignee: null,
            completionRate: 0,
        },
        // Add these back to your mockRequestsData array
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
            urgency: 'Medium',
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
            urgency: 'High',
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
            urgency: 'Medium',
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
            urgency: 'Medium',
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
            urgency: 'Low',
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
            urgency: 'Medium',
            featured: false,
            tags: ['business', 'laptop', 'freelance'],
            verificationStatus: 'Not Started',
            assignee: null,
            completionRate: 0,
        }
    ];

    const [requests, setRequests] = useState(mockRequestsData);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedUrgency, setSelectedUrgency] = useState('All Urgency');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState(null);
    const [editingRequest, setEditingRequest] = useState(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);


    // Status options
    const statusOptions = [
        'All Status',
        'Draft',
        'Pending-Validation',
        'Validated',
        'Approved',
        'Rejected',
        'Closed',
        'In-Progress'
    ];

    // Category options
    const categoryOptions = [
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
    ];

    // Urgency options
    const urgencyOptions = ['All Urgency', 'High', 'Medium', 'Low'];

    // ==================== FIX: PROPERLY CONTROL CREATE MODAL BASED ON PROP ====================
    useEffect(() => {
        console.log('showCreateForm prop:', showCreateForm, 'showCreateModal state:', showCreateModal);

        if (showCreateForm && !showCreateModal) {
            // Only open modal if prop is true and modal is not already open
            setShowCreateModal(true);
            console.log('Opening create modal via prop');
        }

        // Don't auto-close based on prop change - let user control closing
    }, [showCreateForm]);

    // ==================== FIX: CLOSE MODAL AND NOTIFY PARENT ====================
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setEditingRequest(null);

        // Notify parent component that modal is closed
        if (onFormClose) {
            onFormClose();
        }

        console.log('Create modal closed, parent notified');
    };

    // Shake animation variants
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

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []); // Empty dependency array means this runs once on mount

    // Filter requests
    const filteredRequests = useMemo(() => {
        return requests.filter(request => {
            const matchesSearch =
                request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = selectedStatus === 'All Status' || request.status === selectedStatus;
            const matchesCategory = selectedCategory === 'All Categories' || request.category === selectedCategory;
            const matchesUrgency = selectedUrgency === 'All Urgency' || request.urgency === selectedUrgency;

            const matchesDateRange =
                (!dateRange.start || request.createdAt.split('T')[0] >= dateRange.start) &&
                (!dateRange.end || request.createdAt.split('T')[0] <= dateRange.end);

            return matchesSearch && matchesStatus && matchesCategory && matchesUrgency && matchesDateRange;
        });
    }, [requests, searchTerm, selectedStatus, selectedCategory, selectedUrgency, dateRange]);

    // Paginate requests
    const paginatedRequests = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredRequests, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedStatus, selectedCategory, selectedUrgency, dateRange]);

    // Scroll to top when component mounts
    useEffect(() => {
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 100);
    }, []);

    // Calculate statistics
    const stats = useMemo(() => {
        // Remove the filter for draftRequests
        const totalRequests = requests.length;  // Count ALL requests

        // For total amounts, you might want to filter based on what you need
        const draftRequests = requests.filter(r => r.status === 'Draft'); // Keep for draft-specific stats
        const totalAmountRequired = draftRequests.reduce((sum, r) => sum + r.requiredAmount, 0);
        const totalAmountDonated = draftRequests.reduce((sum, r) => sum + r.donatedAmount, 0);

        // Keep urgency counts for draft requests if that's what you want
        const highUrgencyRequests = draftRequests.filter(r => r.urgency === 'High').length;
        const mediumUrgencyRequests = draftRequests.filter(r => r.urgency === 'Medium').length;
        const lowUrgencyRequests = draftRequests.filter(r => r.urgency === 'Low').length;

        return {
            totalRequests,  // Now this includes ALL requests
            totalAmountRequired,
            totalAmountDonated,
            highUrgencyRequests,
            mediumUrgencyRequests,
            lowUrgencyRequests
        };
    }, [requests]);

    // Handle request deletion
    const handleDeleteRequest = (id) => {
        setRequests(prev => prev.filter(request => request.id !== id));
        setShowDeleteModal(false);
        setRequestToDelete(null);
        setSuccessMessage('Request deleted successfully');
        setShowSuccessDialog(true);
    };

    // Handle submit for validation
    const handleSubmitForValidation = (request) => {
        if (request.status === 'Draft') {
            setRequests(prev => prev.map(req =>
                req.id === request.id ? { ...req, status: 'Pending-Validation' } : req
            ));
            setSuccessMessage('Request submitted for validation successfully!');
            setShowSuccessDialog(true);
        }
    };

    // Get status color
    const getStatusColor = (status) => {
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
    };

    // Get urgency badge
    const getUrgencyBadge = (urgency) => {
        const urgencyMap = {
            'High': { bg: 'bg-rose-500/20', text: 'text-rose-600', border: 'border-rose-500/30', icon: AlertTriangle },
            'Medium': { bg: 'bg-amber-500/20', text: 'text-amber-600', border: 'border-amber-500/30', icon: Zap },
            'Low': { bg: 'bg-emerald-500/20', text: 'text-emerald-600', border: 'border-emerald-500/30', icon: CheckCircle }
        };
        return urgencyMap[urgency] || urgencyMap.Medium;
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-PK', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Update the useEffect for page changes
    useEffect(() => {
        // Don't scroll on initial mount when currentPage is 1
        if (currentPage !== 1) {
            // Scroll to the top of the requests section when page changes
            const requestsSection = document.querySelector('.requests-grid-container')?.parentElement;
            if (requestsSection) {
                const yOffset = -120; // Adjust this value (negative = scroll more up)
                const y = requestsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

                window.scrollTo({
                    top: Math.max(0, y),
                    behavior: 'smooth'
                });
            }
        }
    }, [currentPage]);

    // Progress Circle Component
    const ProgressCircle = ({ percentage, size = 80, isDark }) => {
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
    };

    // Success Dialog Component
    const SuccessDialog = ({ isDark, title, message, onClose }) => {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
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
    };

    // Confirmation Dialog Component
    const ConfirmationDialog = ({ isDark, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) => {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
                style={{ margin: 0, padding: 0 }}
                onClick={onCancel}
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
    };

    // Enhanced Stat Card Component
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
                contain: 'layout style', // Prevents layout reflow
                transform: 'translateZ(0)', // Hardware acceleration
            }}
        >
            {/* ADD THIS ROTATING GRADIENT ANIMATION (like in ModernStatCard) */}
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
                                (title.includes('Amount') || title.includes('Required') ? `₨${value.toLocaleString()}` : value.toLocaleString())
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

    const RequestCard = ({ request, index, isDark }) => {
        const [showActions, setShowActions] = useState(false);
        const menuRef = useRef(null);
        const buttonRef = useRef(null);
        const statusConfig = getStatusColor(request.status);
        const StatusIcon = statusConfig.icon;
        const urgencyBadge = getUrgencyBadge(request.urgency);
        const UrgencyIcon = urgencyBadge.icon;

        // State to control animation visibility
        const [isHovered, setIsHovered] = useState(false);
        // Use a ref to track hover state for immediate response
        const hoverRef = useRef(false);

        // Get category icon
        const getCategoryIcon = (category) => {
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
        };

        const getCategoryColor = (category) => {
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
        };

        const CategoryIcon = getCategoryIcon(request.category);

        // Close menu when clicking outside
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

        const handleViewDetails = () => {
            setSelectedRequest(request);
            setShowDetailModal(true);
        };

        const handleEditRequest = () => {
            setEditingRequest(request);
            setShowCreateModal(true);
        };

        const categoryColor = getCategoryColor(request.category);
        const getPrimaryColor = (color) => {
            if (color.includes('rose')) return '#f43f5e';
            if (color.includes('blue')) return '#3b82f6';
            if (color.includes('amber')) return '#f59e0b';
            if (color.includes('emerald')) return '#10b981';
            if (color.includes('violet')) return '#8b5cf6';
            if (color.includes('purple')) return '#8b5cf6';
            if (color.includes('cyan')) return '#06b6d4';
            if (color.includes('yellow')) return '#eab308';
            return '#6b7280';
        };

        const primaryColor = getPrimaryColor(categoryColor);

        // Handle hover with immediate state update
        const handleMouseEnter = () => {
            hoverRef.current = true;
            setIsHovered(true);
        };

        const handleMouseLeave = () => {
            hoverRef.current = false;
            setIsHovered(false);
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
            >
                {/* Floating Orbs Animation - Stop immediately */}
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
                                duration: isHovered ? Math.random() * 4 + 3 : 0.1, // Immediate stop
                                delay: isHovered ? i * 0.25 : 0,
                                repeat: isHovered ? Infinity : 0,
                                repeatDelay: isHovered ? Math.random() * 1.5 + 0.5 : 0,
                                ease: isHovered ? "easeOut" : "linear",
                            }}
                        />
                    ))}
                </div>

                {/* Floating Ring Animation - Stop immediately */}
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
                                duration: isHovered ? 5 + i : 0.1, // Immediate stop
                                delay: isHovered ? i * 0.4 : 0,
                                repeat: isHovered ? Infinity : 0,
                                ease: "linear"
                            }}
                        />
                    ))}
                </div>

                {/* Pulsing Glow Effect - Stop immediately */}
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
                        duration: isHovered ? 2.5 : 0.1, // Immediate stop
                        repeat: isHovered ? Infinity : 0,
                        ease: "easeInOut"
                    }}
                />

                {/* Shimmer Lines Animation - Stop immediately */}
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
                            duration: isHovered ? 1.8 : 0.1, // Immediate stop
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
                            duration: isHovered ? 2.2 : 0.1, // Immediate stop
                            delay: isHovered ? 0.3 : 0,
                            repeat: isHovered ? Infinity : 0,
                            repeatDelay: isHovered ? 0.8 : 0,
                            ease: "linear"
                        }}
                    />

                    {/* Additional diagonal shimmer lines - Stop immediately */}
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
                            duration: isHovered ? 2.5 : 0.1, // Immediate stop
                            delay: isHovered ? 0.5 : 0,
                            repeat: isHovered ? Infinity : 0,
                            repeatDelay: isHovered ? 2 : 0,
                            ease: "linear"
                        }}
                    />
                </div>

                {/* Light Background Overlay - Stop immediately */}
                <motion.div
                    className={`absolute inset-0 rounded-2xl ${categoryColor.split(' ')[0]}`}
                    style={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: isHovered ? 0.05 : 0,
                    }}
                    transition={{
                        duration: 0.1, // Very fast transition
                        ease: "easeInOut"
                    }}
                />

                {/* Particle Dots - Stop immediately */}
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
                                duration: isHovered ? Math.random() * 2 + 1 : 0.1, // Immediate stop
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
                                        duration: isHovered ? 1.5 : 0.1, // Immediate stop
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
                                            duration: isHovered ? 2 : 0.1, // Immediate stop
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
                                                    onClick={() => handleMenuAction(handleViewDetails)}
                                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-blue-500/20 text-gray-300' : 'hover:bg-blue-100 text-gray-700'
                                                        }`}
                                                >
                                                    <Eye size={16} />
                                                    View Details
                                                </button>

                                                <button
                                                    onClick={() => handleMenuAction(handleEditRequest)}
                                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-violet-500/20 text-gray-300' : 'hover:bg-violet-100 text-gray-700'
                                                        }`}
                                                >
                                                    <Edit size={16} />
                                                    Edit Request
                                                </button>

                                                <button
                                                    onClick={() => handleMenuAction(() => handleSubmitForValidation(request))}
                                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${isDark ? 'hover:bg-emerald-500/20 text-gray-300' : 'hover:bg-emerald-100 text-gray-700'
                                                        }`}
                                                >
                                                    <Send size={16} />
                                                    Submit for Validation
                                                </button>

                                                <div className={`my-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />

                                                <button
                                                    onClick={() => handleMenuAction(() => { setRequestToDelete(request); setShowDeleteModal(true); })}
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

                    {/* Status & Urgency Row */}
                    <div className="flex items-center gap-3 flex-wrap mb-6">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            animate={{
                                y: isHovered ? [0, -2, 0] : 0,
                            }}
                            transition={{
                                duration: isHovered ? 1 : 0.1, // Immediate stop
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
                        <motion.div
                            animate={{
                                scale: isHovered ? [1, 1.05, 1] : 1,
                            }}
                            transition={{
                                duration: isHovered ? 1.5 : 0.1, // Immediate stop
                                repeat: isHovered ? Infinity : 0,
                                repeatDelay: isHovered ? 0.5 : 0
                            }}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg ${urgencyBadge.bg} ${urgencyBadge.text} border ${urgencyBadge.border}`}
                        >
                            <UrgencyIcon size={12} />
                            {request.urgency}
                        </motion.div>
                    </div>

                    {/* Financial Info & Progress */}
                    <div className="flex items-center justify-between gap-6 mb-6">
                        <div className="flex-1 space-y-3 min-w-0">
                            <motion.div
                                animate={{
                                    x: isHovered ? [0, 2, 0] : 0,
                                }}
                                transition={{
                                    duration: isHovered ? 1.2 : 0.1, // Immediate stop
                                    repeat: isHovered ? Infinity : 0,
                                    repeatDelay: isHovered ? 0.8 : 0
                                }}
                                className="flex justify-between items-center"
                            >
                                <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Required
                                </span>
                                <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'} truncate ml-2`}>
                                    ₨{request.requiredAmount.toLocaleString()}
                                </span>
                            </motion.div>
                            <motion.div
                                animate={{
                                    x: isHovered ? [0, 3, 0] : 0,
                                }}
                                transition={{
                                    duration: isHovered ? 1.4 : 0.1, // Immediate stop
                                    repeat: isHovered ? Infinity : 0,
                                    repeatDelay: isHovered ? 1 : 0
                                }}
                                className="flex justify-between items-center"
                            >
                                <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Donated
                                </span>
                                <span className="text-lg font-bold text-emerald-500 truncate ml-2">
                                    ₨{request.donatedAmount.toLocaleString()}
                                </span>
                            </motion.div>
                            <motion.div
                                animate={{
                                    x: isHovered ? [0, 2, 0] : 0,
                                }}
                                transition={{
                                    duration: isHovered ? 1.6 : 0.1, // Immediate stop
                                    repeat: isHovered ? Infinity : 0,
                                    repeatDelay: isHovered ? 1.2 : 0
                                }}
                                className="flex justify-between items-center"
                            >
                                <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Balance
                                </span>
                                <span className="text-lg font-bold text-rose-500 truncate ml-2">
                                    ₨{request.remainingAmount.toLocaleString()}
                                </span>
                            </motion.div>
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
                                duration: isHovered ? 1 : 0.1, // Immediate stop
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
                                duration: isHovered ? 1 : 0.1, // Immediate stop
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

                    {/* Footer Buttons - Only View button now */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-700/20">
                        <motion.div
                            animate={{
                                scale: isHovered ? [1, 1.02, 1] : 1,
                            }}
                            transition={{
                                duration: isHovered ? 1.8 : 0.1, // Immediate stop
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
    };

    // Pagination Component
    const Pagination = ({ currentPage, totalPages, onPageChange, isDark }) => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Update the handlePageChange function in the Pagination component
        const handlePageChange = (page) => {
            // Only update if page actually changed
            if (page !== currentPage) {
                onPageChange(page);

                // Scroll to the top of the entire requests section
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
        };

        return (
            <div className="flex items-center justify-center gap-2 mt-8">
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

                {startPage > 1 && (
                    <>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePageChange(1)}
                            className={`px-3 py-2 rounded-xl text-sm font-medium ${isDark
                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                } border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
                        >
                            1
                        </motion.button>
                        {startPage > 2 && <span className={`px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>...</span>}
                    </>
                )}

                {pages.map(page => (
                    <motion.button
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium ${currentPage === page
                            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                            : isDark
                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            } border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
                    >
                        {page}
                    </motion.button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className={`px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>...</span>}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePageChange(totalPages)}
                            className={`px-3 py-2 rounded-xl text-sm font-medium ${isDark
                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                } border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
                        >
                            {totalPages}
                        </motion.button>
                    </>
                )}

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
        );
    };

    // Document Upload Component (similar to Recipients Management)
    const DocumentUpload = ({ documents, onDocumentsChange, isDark, fieldErrors, onFieldError, shakeFields }) => {
        const [dragActive, setDragActive] = useState(false);

        const handleDrag = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.type === "dragenter" || e.type === "dragover") {
                setDragActive(true);
            } else if (e.type === "dragleave") {
                setDragActive(false);
            }
        };

        const handleDrop = (e) => {
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
                // Clear document error when files are added
                if (onFieldError && newFiles.length > 0) {
                    onFieldError('documents', '');
                }
            }
        };

        const handleFileChange = (e) => {
            if (e.target.files) {
                const newFiles = Array.from(e.target.files).map(file => ({
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: formatFileSize(file.size),
                    type: file.type
                }));
                onDocumentsChange([...documents, ...newFiles]);
                // Clear document error when files are added
                if (onFieldError && newFiles.length > 0) {
                    onFieldError('documents', '');
                }
            }
        };

        const formatFileSize = (bytes) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };

        const removeDocument = (id) => {
            const newDocuments = documents.filter(doc => doc.id !== id);
            onDocumentsChange(newDocuments);
            // Set error if no documents left
            if (onFieldError && newDocuments.length === 0) {
                onFieldError('documents', 'Please upload at least one document');
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
    };

    // Create/Edit Request Modal - WITH COMPLETE VALIDATION FOR ALL FIELDS
    const CreateRequestModal = () => {
        const [formData, setFormData] = useState(editingRequest ? {
            title: editingRequest.title || '',
            description: editingRequest.description || '',
            category: editingRequest.category || '',
            requiredAmount: editingRequest.requiredAmount || 0,
            deadline: editingRequest.deadline || '',
            urgency: editingRequest.urgency || '',
            address: 'Karachi, Pakistan',
            phone: '+92-300-1234567',
            email: 'user@example.com',
            documents: editingRequest.documents || []
        } : {
            title: '',
            description: '',
            category: '',
            requiredAmount: 0,
            deadline: '',
            urgency: '',
            address: '',
            phone: '',
            email: '',
            documents: []
        });

        const [fieldErrors, setFieldErrors] = useState({});
        const [shakeFields, setShakeFields] = useState([]);
        const [selectedUrgency, setSelectedUrgency] = useState(editingRequest?.urgency || '');

        // Refs for scrolling
        const fieldRefs = {
            title: useRef(null),
            description: useRef(null),
            category: useRef(null),
            requiredAmount: useRef(null),
            deadline: useRef(null),
            urgency: useRef(null),
            documents: useRef(null)
        };

        // Scroll to first invalid field
        const scrollToFirstInvalidField = (invalidFields) => {
            if (invalidFields.length > 0) {
                const fieldOrder = [
                    'title', 'description', 'category', 'requiredAmount',
                    'deadline', 'urgency', 'documents'
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

                            const input = fieldRef.current.querySelector('input, select, textarea');
                            if (input) {
                                input.focus();
                                if (input.type !== 'file') {
                                    input.select();
                                }
                            }
                        }, 100);
                    }
                }
            }
        };

        // Helper function to check if string contains only alphabets and spaces
        const isValidName = (name) => {
            return /^[A-Za-z\s.,!?()-]+$/.test(name.trim());
        };

        // Helper function to check if description is valid
        const isValidDescription = (desc) => {
            return /^[A-Za-z0-9\s.,!?()-]+$/.test(desc.trim()) && desc.trim().length >= 10;
        };

        // Helper function to check if deadline is valid (not in past)
        const isValidDeadline = (dateString) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(dateString);
            selectedDate.setHours(0, 0, 0, 0);
            return selectedDate >= today;
        };

        const validateForm = () => {
            const errors = {};
            const invalidFields = [];

            setShakeFields([]);

            // Title validation - Only alphabets, spaces, and basic punctuation
            if (!formData.title.trim()) {
                errors.title = 'Title is required';
                invalidFields.push('title');
            } else if (!isValidName(formData.title)) {
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
            } else if (!isValidDescription(formData.description)) {
                errors.description = 'Description must contain only valid characters and be at least 10 characters long';
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
            if (formData.requiredAmount === '' || formData.requiredAmount === null || formData.requiredAmount === undefined) {
                errors.requiredAmount = 'Required amount is required';
                invalidFields.push('requiredAmount');
            } else {
                const reqAmount = Number(formData.requiredAmount);
                if (reqAmount <= 0) {
                    errors.requiredAmount = 'Required amount must be greater than 0';
                    invalidFields.push('requiredAmount');
                } else if (!/^\d+$/.test(formData.requiredAmount.toString())) {
                    errors.requiredAmount = 'Required amount must be a valid number';
                    invalidFields.push('requiredAmount');
                } else if (!Number.isInteger(reqAmount)) {
                    errors.requiredAmount = 'Amount must be a whole number without decimals';
                    invalidFields.push('requiredAmount');
                } else if (reqAmount > 10000000) {
                    errors.requiredAmount = 'Amount cannot exceed 10,000,000';
                    invalidFields.push('requiredAmount');
                }
            }

            // Deadline validation - Must be today or future date
            if (!formData.deadline) {
                errors.deadline = 'Deadline is required';
                invalidFields.push('deadline');
            } else if (!isValidDeadline(formData.deadline)) {
                errors.deadline = 'Deadline must be today or a future date';
                invalidFields.push('deadline');
            }

            // Urgency validation - Use selectedUrgency state instead of formData.urgency
            if (!selectedUrgency || selectedUrgency === '') {
                errors.urgency = 'Please select urgency level';
                invalidFields.push('urgency');
            }

            // Documents validation
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

            if (editingRequest) {
                setRequests(prev => prev.map(request =>
                    request.id === editingRequest.id ? {
                        ...request,
                        ...formData,
                        urgency: selectedUrgency, // Use selectedUrgency state
                        requiredAmount: parseFloat(formData.requiredAmount),
                        remainingAmount: parseFloat(formData.requiredAmount) - request.donatedAmount,
                        completionRate: Math.round((request.donatedAmount / parseFloat(formData.requiredAmount)) * 100),
                        updatedAt: new Date().toISOString()
                    } : request
                ));
                setSuccessMessage('Request updated successfully');
            } else {
                const newRequest = {
                    id: `REQ-${new Date().getFullYear()}-${String(requests.length + 1).padStart(3, '0')}`,
                    ...formData,
                    urgency: selectedUrgency, // Use selectedUrgency state
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
                setSuccessMessage('Request created successfully');
            }

            setShowCreateModal(false);
            setEditingRequest(null);
            setShowSuccessDialog(true);
        };

        // Handle change with validation for text fields
        const handleChange = (e) => {
            const { name, value } = e.target;

            let newValue = value;

            // For title field - Only allow letters, spaces, and basic punctuation
            if (name === 'title') {
                // Remove any characters that are not allowed
                newValue = value.replace(/[^A-Za-z\s.,!?()-]/g, '');
            }
            // For description field - Allow letters, numbers, spaces, and basic punctuation
            else if (name === 'description') {
                newValue = value.replace(/[^A-Za-z0-9\s.,!?()-]/g, '');
            }
            // For numeric fields
            else if (name === 'requiredAmount') {
                if (value === '') {
                    newValue = '0';
                } else if (/^\d+$/.test(value)) {
                    const numValue = parseInt(value, 10);
                    newValue = numValue.toString();
                    if (numValue < 0) {
                        newValue = '0';
                    }
                } else {
                    return;
                }
            }
            // For deadline field - No special handling, just set the value
            else if (name === 'deadline') {
                newValue = value;
            }
            // For other fields
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

        const handleUrgencySelect = (level) => {
            setSelectedUrgency(level);
            // Clear urgency error when urgency is selected
            if (fieldErrors.urgency) {
                setFieldErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.urgency;
                    return newErrors;
                });
            }
        };

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
                style={{ margin: 0, padding: 0 }}
                onClick={() => {
                    setShowCreateModal(false);
                    setEditingRequest(null);
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
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
                                    {editingRequest ? 'Edit Request' : 'Create New Request'}
                                </h2>
                                <p className="text-violet-100 text-sm font-medium">
                                    {editingRequest ? 'Update request information' : 'Create a new donation request'}
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setEditingRequest(null);
                                }}
                                className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                            >
                                <X size={20} className="text-white" />
                            </motion.button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Title Field - WITH RESTRICTIONS */}
                                    <div ref={fieldRefs.title}>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Request Title *
                                        </label>
                                        <motion.div
                                            animate={shakeFields.includes('title') ? "shake" : "initial"}
                                            variants={shakeAnimation}
                                            className="overflow-visible"
                                        >
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                maxLength={100}
                                                className={`w-full p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    } ${fieldErrors.title ? 'border-rose-500' : ''}`}
                                            />
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

                                    {/* Description Field - WITH RESTRICTIONS */}
                                    <div ref={fieldRefs.description}>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Description *
                                        </label>
                                        <motion.div
                                            animate={shakeFields.includes('description') ? "shake" : "initial"}
                                            variants={shakeAnimation}
                                            className="overflow-visible"
                                        >
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={4}
                                                maxLength={1000}
                                                className={`w-full p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    } ${fieldErrors.description ? 'border-rose-500' : ''}`}
                                            />
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

                                    {/* Category Field */}
                                    <div ref={fieldRefs.category}>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Category *
                                        </label>
                                        <motion.div
                                            animate={shakeFields.includes('category') ? "shake" : "initial"}
                                            variants={shakeAnimation}
                                            className="overflow-visible"
                                        >
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className={`w-full p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    } ${fieldErrors.category ? 'border-rose-500' : ''}`}
                                            >
                                                <option value="">Select Category</option>
                                                {categoryOptions.filter(opt => opt !== 'All Categories').map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </motion.div>
                                        {fieldErrors.category && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                                            >
                                                <XCircle size={12} />
                                                {fieldErrors.category}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Required Amount Field */}
                                    <div ref={fieldRefs.requiredAmount}>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Required Amount (PKR) *
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
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                className={`w-full p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    } ${fieldErrors.requiredAmount ? 'border-rose-500' : ''}`}
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

                                    {/* Deadline Field - WITH DATE RESTRICTION */}
                                    <div ref={fieldRefs.deadline}>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Deadline *
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
                                                onChange={handleChange}
                                                min={new Date().toISOString().split('T')[0]} // Today's date
                                                className={`w-full p-3 rounded-2xl border-2 focus:ring-4 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    } ${fieldErrors.deadline ? 'border-rose-500' : ''}`}
                                            />
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

                                    {/* Urgency Field */}
                                    <div ref={fieldRefs.urgency}>
                                        <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Urgency Level *
                                        </label>
                                        <motion.div
                                            animate={shakeFields.includes('urgency') ? "shake" : "initial"}
                                            variants={shakeAnimation}
                                            className="overflow-visible"
                                        >
                                            <div className="grid grid-cols-3 gap-2">
                                                {['High', 'Medium', 'Low'].map((level) => (
                                                    <button
                                                        key={level}
                                                        type="button"
                                                        onClick={() => handleUrgencySelect(level)}
                                                        className={`py-3 rounded-2xl border-2 transition-all ${selectedUrgency === level
                                                            ? (isDark
                                                                ? 'bg-violet-600 border-violet-500 text-white'
                                                                : 'bg-violet-500 border-violet-400 text-white')
                                                            : (isDark
                                                                ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                                                                : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400')
                                                            } ${fieldErrors.urgency ? 'border-rose-500' : ''}`}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                        {fieldErrors.urgency && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center gap-1 text-rose-600 text-xs font-medium mt-1"
                                            >
                                                <XCircle size={12} />
                                                {fieldErrors.urgency}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Document Upload Section */}
                            <div ref={fieldRefs.documents}>
                                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Supporting Documents *
                                </label>
                                <DocumentUpload
                                    documents={formData.documents}
                                    onDocumentsChange={handleDocumentsChange}
                                    isDark={isDark}
                                    fieldErrors={fieldErrors}
                                    onFieldError={handleFieldError}
                                    shakeFields={shakeFields}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <motion.button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingRequest(null);
                                    }}
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
    };

    // Detail Modal Component
    const DetailModal = () => {
        if (!selectedRequest) return null;

        const statusConfig = getStatusColor(selectedRequest.status);
        const StatusIcon = statusConfig.icon;
        const urgencyBadge = getUrgencyBadge(selectedRequest.urgency);
        const UrgencyIcon = urgencyBadge.icon;

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
                style={{ margin: 0, padding: 0 }}
                onClick={() => setShowDetailModal(false)}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
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
                                {/* Only show edit button for Draft status */}
                                {selectedRequest.status === 'Draft' && (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => {
                                            setEditingRequest(selectedRequest);
                                            setShowCreateModal(true);
                                            setShowDetailModal(false);
                                        }}
                                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                                        title="Edit Request"
                                    >
                                        <Edit size={18} className="text-white" />
                                    </motion.button>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowDetailModal(false)}
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
                                <div>
                                    <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Urgency
                                    </p>
                                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-lg ${urgencyBadge.bg} ${urgencyBadge.text} border ${urgencyBadge.border}`}>
                                        <UrgencyIcon size={12} />
                                        {selectedRequest.urgency}
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
                                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        ₨{selectedRequest.requiredAmount.toLocaleString()}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Donated Amount
                                    </p>
                                    <p className={`text-2xl font-bold text-emerald-500`}>
                                        ₨{selectedRequest.donatedAmount.toLocaleString()}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-xl text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Remaining Amount
                                    </p>
                                    <p className={`text-2xl font-bold text-rose-500`}>
                                        ₨{selectedRequest.remainingAmount.toLocaleString()}
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

                        {/* Action Buttons - Only show for Draft status */}
                        {selectedRequest.status === 'Draft' && (
                            <div className="flex gap-3 pt-4">
                                <motion.button
                                    onClick={() => {
                                        setShowDetailModal(false);
                                        // Add any other cancel logic here if needed
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex-1 px-6 py-3 rounded-2xl border-2 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${isDark
                                        ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                        }`}
                                >Cancel
                                </motion.button>
                                <motion.button
                                    onClick={() => handleSubmitForValidation(selectedRequest)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl text-sm font-semibold shadow-xl flex items-center justify-center gap-2"
                                >
                                    <Send size={16} />
                                    Submit for Validation
                                </motion.button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    return (
        <div className="space-y-8 px-4">
            {/* Create New Request Button Only - No Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-end"
            >
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold shadow-xl"
                >
                    <Plus size={16} />
                    Create New Request
                </motion.button>
            </motion.div>

            {/* Statistics Cards - Using EnhancedStatCard design */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <EnhancedStatCard
                    icon={FileText}
                    title="Draft Requests"
                    value={stats.totalRequests}
                    change={8.3}
                    changeType="increase"
                    color="from-blue-500 to-blue-600"
                    delay={0.1}
                    isDark={isDark}
                />
                <EnhancedStatCard
                    icon={DollarSign}
                    title="Total Required"
                    value={`${(stats.totalAmountRequired / 1000).toFixed(0)}K`}
                    change={15.7}
                    changeType="increase"
                    color="from-emerald-500 to-emerald-600"
                    delay={0.2}
                    isDark={isDark}
                />
                <EnhancedStatCard
                    icon={AlertTriangle}
                    title="High Urgency"
                    value={stats.highUrgencyRequests}
                    change={5.2}
                    changeType="increase"
                    color="from-amber-500 to-amber-600"
                    delay={0.3}
                    isDark={isDark}
                />
                <EnhancedStatCard
                    icon={Clock}
                    title="Medium Urgency"
                    value={stats.mediumUrgencyRequests}
                    change={2.1}
                    changeType="increase"
                    color="from-violet-500 to-violet-600"
                    delay={0.4}
                    isDark={isDark}
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
                        willChange: 'transform, opacity', // Add this
                        contain: 'layout paint', // Add this
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

                    <AnimatePresence mode="wait"> {/* Add mode="wait" here */}
                        {showFilters && (
                            <motion.div
                                key="filter-panel" // Add unique key
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                    height: { duration: 0.3 } // Explicit height animation
                                }}
                                className="overflow-hidden"
                                style={{
                                    willChange: 'height, opacity', // Performance optimization
                                    contain: 'content', // Prevent layout thrashing
                                }}
                            >
                                <div
                                    className={`p-6 rounded-2xl mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}
                                    style={{
                                        backfaceVisibility: 'hidden', // Smoother animation
                                        WebkitBackfaceVisibility: 'hidden',
                                        transform: 'translateZ(0)', // Hardware acceleration
                                        WebkitTransform: 'translateZ(0)',
                                    }}
                                >
                                    {/* First row - 3 filters */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Status
                                            </label>
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                                    ? 'bg-gray-800 border-gray-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    }`}
                                            >
                                                {statusOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Category
                                            </label>
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                                    ? 'bg-gray-800 border-gray-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    }`}
                                            >
                                                {categoryOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Urgency
                                            </label>
                                            <select
                                                value={selectedUrgency}
                                                onChange={(e) => setSelectedUrgency(e.target.value)}
                                                className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                                    ? 'bg-gray-800 border-gray-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    }`}
                                            >
                                                {urgencyOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
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
                                        </span>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSearchTerm('');
                                                setSelectedStatus('All Status');
                                                setSelectedCategory('All Categories');
                                                setSelectedUrgency('All Urgency');
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
                    {/* Add this wrapper div with class name */}
                    <div className="requests-grid-container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                        >
                            {paginatedRequests.map((request, index) => (
                                <RequestCard
                                    key={request.id}
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
                        onClick={() => setShowCreateModal(true)}
                        className="mt-6 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-sm font-semibold shadow-xl"
                    >
                        <Plus size={16} className="inline mr-2" />
                        Create New Request
                    </motion.button>
                </motion.div>
            )}

            {/* Tips Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
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
                <div>
                    <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Tips for Successful Requests
                    </h4>
                    <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Here's how to get the most out of your donation requests:
                    </p>
                    <ul className={`text-sm space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>Upload clear supporting documents to increase approval chances</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>Be specific about how funds will be used for transparency</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>Submit your draft request for validation to start receiving donations</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>Update progress regularly to keep donors informed</span>
                        </li>
                    </ul>
                </div>
            </motion.div>

            {/* Modals */}
            <AnimatePresence>
                {showCreateModal && (
                    <CreateRequestModal />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDetailModal && (
                    <DetailModal />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDeleteModal && requestToDelete && (
                    <ConfirmationDialog
                        isDark={isDark}
                        title="Delete Request"
                        message={`Are you sure you want to delete the request "${requestToDelete.title}"? This action cannot be undone.`}
                        onConfirm={() => handleDeleteRequest(requestToDelete.id)}
                        onCancel={() => {
                            setShowDeleteModal(false);
                            setRequestToDelete(null);
                        }}
                        confirmText="Delete Request"
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
                        onClose={() => setShowSuccessDialog(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyRequests;