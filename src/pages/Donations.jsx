import React, { useState, useEffect, useMemo, useRef } from 'react';
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
    DollarSign,
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
    CircleDollarSign,
    HandCoins,
    Send
} from 'lucide-react';

// ==================== DONATIONS COMPONENT (RECIPIENT VERSION) ====================
const Donations = ({ isDark }) => {
    // Add success dialog state
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Update the handleSendThankYou function in the main component
    const handleSendThankYou = (donationId) => {
        setDonations(prevDonations =>
            prevDonations.map(donation =>
                donation.id === donationId
                    ? { ...donation, thanked: true }
                    : donation
            )
        );

        // Show success message
        setSuccessMessage('Thank you sent successfully! Donor will receive your gratitude message.');
        setShowSuccessDialog(true);

        // Optionally close the action menu
        setShowActions && setShowActions(false);
    };

    // Mock data for donations received by recipient
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
            currency: 'PKR',
            status: 'Completed',
            paymentMethod: 'Credit Card',
            transactionId: 'TXN78901234',
            date: '2024-03-25T14:30:00',
            message: 'Wishing your mother a speedy recovery. My prayers are with you.',
            donorEmail: 'sarah.j@email.com',
            donorPhone: '+1-555-0123',
            location: 'New York, USA',
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
            currency: 'PKR',
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
            currency: 'PKR',
            status: 'Completed',
            paymentMethod: 'PayPal',
            transactionId: 'TXN78901236',
            date: '2024-03-27T16:45:00',
            message: 'From one human to another. Get well soon!',
            donorEmail: 'mike.chen@email.com',
            donorPhone: '+44-7911-123456',
            location: 'London, UK',
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
            currency: 'PKR',
            status: 'Completed',
            paymentMethod: 'Bank Transfer',
            transactionId: 'TXN78901237',
            date: '2024-04-02T11:20:00',
            message: 'Providing housing stability for families in need.',
            donorEmail: 'info@communityhope.org',
            donorPhone: '+92-21-1234567',
            location: 'Karachi, Pakistan',
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
            currency: 'PKR',
            status: 'Completed',
            paymentMethod: 'Bank Transfer',
            transactionId: 'TXN78901238',
            date: '2024-04-06T10:00:00',
            message: 'Emergency medical support for urgent cases.',
            donorEmail: 'support@healthcareheroes.org',
            donorPhone: '+92-42-7654321',
            location: 'Lahore, Pakistan',
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
            currency: 'PKR',
            status: 'Completed',
            paymentMethod: 'Credit Card',
            transactionId: 'TXN78901239',
            date: '2024-04-11T13:45:00',
            message: 'Investing in education is investing in the future.',
            donorEmail: 'contact@educationforall.org',
            donorPhone: '+92-51-9876543',
            location: 'Islamabad, Pakistan',
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
            donorName: 'Food Bank Pakistan',
            donorType: 'Organization',
            isAnonymous: false,
            amount: 20000,
            currency: 'PKR',
            status: 'Completed',
            paymentMethod: 'Bank Transfer',
            transactionId: 'TXN78901240',
            date: '2024-04-13T15:30:00',
            message: 'No family should go hungry. We stand with you.',
            donorEmail: 'support@foodbank.pk',
            donorPhone: '+92-22-1122334',
            location: 'Karachi, Pakistan',
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
            donorName: 'Ahmed Raza',
            donorType: 'Individual',
            isAnonymous: false,
            amount: 15000,
            currency: 'PKR',
            status: 'Completed',
            paymentMethod: 'JazzCash',
            transactionId: 'TXN78901241',
            date: '2024-04-19T17:20:00',
            message: 'Hope this helps get your rickshaw back on the road!',
            donorEmail: 'ahmed.raza@email.com',
            donorPhone: '+92-300-9876543',
            location: 'Karachi, Pakistan',
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
            donorName: 'Dr. James Wilson',
            donorType: 'Individual',
            isAnonymous: false,
            amount: 75000,
            currency: 'PKR',
            status: 'Completed',
            paymentMethod: 'Credit Card',
            transactionId: 'TXN78901242',
            date: '2024-03-28T20:10:00',
            message: 'As a doctor, I understand the importance of timely medical care. Best wishes.',
            donorEmail: 'james.wilson@email.com',
            donorPhone: '+1-555-9876',
            location: 'Boston, USA',
            taxReceipt: true,
            receiptSent: true,
            isRecurring: false,
            category: 'Medical',
            tags: ['medical', 'doctor', 'international'],
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
            currency: 'PKR',
            status: 'Completed',
            paymentMethod: 'Bank Transfer',
            transactionId: 'TXN78901243',
            date: '2024-04-03T14:00:00',
            message: 'Our community stands together.',
            donorEmail: 'community@localgroup.pk',
            donorPhone: '+92-321-4567890',
            location: 'Karachi, Pakistan',
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
            currency: 'PKR',
            status: 'Completed',
            paymentMethod: 'Bank Transfer',
            transactionId: 'TXN78901244',
            date: '2024-04-21T12:30:00',
            message: 'Every family deserves a beautiful beginning.',
            donorEmail: 'info@familysupport.pk',
            donorPhone: '+92-42-3344556',
            location: 'Lahore, Pakistan',
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
            donorName: 'Tech for Good',
            donorType: 'Organization',
            isAnonymous: false,
            amount: 60000,
            currency: 'PKR',
            status: 'Completed',
            paymentMethod: 'Credit Card',
            transactionId: 'TXN78901245',
            date: '2024-04-23T09:45:00',
            message: 'Empowering digital livelihoods. Good luck with your online work!',
            donorEmail: 'contact@techforgood.org',
            donorPhone: '+92-51-7788990',
            location: 'Islamabad, Pakistan',
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

    // Mock requests data to calculate progress
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

    const [donations, setDonations] = useState(mockDonationsData);
    const [requests] = useState(mockRequests);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState('All Requests');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    // Status options
    const statusOptions = [
        'All Status',
        'Completed',
        'Pending',
        'Failed',
        'Refunded'
    ];

    // Category options
    const categoryOptions = [
        'All Categories',
        'Medical',
        'Education',
        'Housing',
        'Food',
        'Business',
        'Transportation',
        'Other'
    ];

    // Sort options
    const sortOptions = [
        { value: 'date', label: 'Date (Newest First)' },
        { value: 'amount', label: 'Amount (High to Low)' },
        { value: 'amount-asc', label: 'Amount (Low to High)' },
        { value: 'name', label: 'Donor Name (A-Z)' }
    ];

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
    }, []);

    // Calculate statistics
    const stats = useMemo(() => {
        const totalDonations = donations.length;
        const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
        const averageDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;

        const individualDonors = donations.filter(d => d.donorType === 'Individual').length;
        const organizationDonors = donations.filter(d => d.donorType === 'Organization').length;
        const anonymousDonors = donations.filter(d => d.isAnonymous).length;

        const recurringDonations = donations.filter(d => d.isRecurring).length;
        const internationalDonations = donations.filter(d =>
            d.location && !d.location.includes('Pakistan')
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
        const requestProgress = requests.map(request => {
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

        return {
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
    }, [donations, requests]);

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

    // Paginate donations
    const paginatedDonations = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredDonations.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredDonations, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedRequest, selectedCategory, dateRange, sortBy, sortOrder]);

    // Get category color
    const getCategoryColor = (category) => {
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
    };

    // Get donor type color
    const getDonorTypeColor = (type) => {
        const colors = {
            'Individual': { bg: 'bg-blue-500/20', text: 'text-blue-600', border: 'border-blue-500/30', icon: User },
            'Organization': { bg: 'bg-purple-500/20', text: 'text-purple-600', border: 'border-purple-500/30', icon: Users },
            'Anonymous': { bg: 'bg-gray-500/20', text: 'text-gray-600', border: 'border-gray-500/30', icon: Eye }
        };
        return colors[type] || colors.Individual;
    };

    const getPrimaryColor = (gradient = '') => {
        if (!gradient) return '#6b7280';
        if (gradient.includes('rose')) return '#f43f5e';
        if (gradient.includes('blue')) return '#3b82f6';
        if (gradient.includes('purple')) return '#8b5cf6';
        if (gradient.includes('emerald')) return '#10b981';
        if (gradient.includes('cyan')) return '#06b6d4';
        if (gradient.includes('amber')) return '#f59e0b';
        return '#6b7280';
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-PK', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format amount
    const formatAmount = (amount) => {
        return `₨${amount.toLocaleString()}`;
    };

    // Get request by ID
    const getRequestById = (requestId) => {
        return requests.find(request => request.id === requestId);
    };

    // Progress Circle Component
    const ProgressCircle = ({ percentage, size = 60, isDark }) => {
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
                        strokeWidth="4"
                        fill="none"
                    />
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={getColor()}
                        strokeWidth="4"
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
                    <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {percentage}%
                    </span>
                </div>
            </div>
        );
    };

    // Enhanced Stat Card Component (updated)
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
                contain: 'layout style',
                transform: 'translateZ(0)',
            }}
        >
            {/* Rotating Gradient Animation */}
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
                            className={`text-2xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent ${color.includes('emerald') ? 'from-emerald-500 to-teal-500' :
                                color.includes('violet') ? 'from-violet-500 to-purple-500' :
                                    color.includes('blue') ? 'from-blue-500 to-cyan-500' :
                                        color.includes('amber') ? 'from-amber-500 to-orange-500' :
                                            'from-rose-500 to-pink-500'
                                }`}
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: delay + 0.2, type: "spring" }}
                        >
                            {/* Value is already formatted when passed */}
                            {value}
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
                                    color.includes('emerald') ? 'text-emerald-500' :
                                        color.includes('violet') ? 'text-violet-500' :
                                            color.includes('blue') ? 'text-blue-500' :
                                                color.includes('amber') ? 'text-amber-500' :
                                                    'text-rose-500'
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

    const DonationCard = ({ donation, index, isDark }) => {
        const [showActions, setShowActions] = useState(false);
        const menuRef = useRef(null);
        const buttonRef = useRef(null);
        const [isHovered, setIsHovered] = useState(false);
        const hoverRef = useRef(false);

        const request = getRequestById(donation.requestId);
        const categoryColor = getCategoryColor(donation.category);
        const CategoryIcon = categoryColor.icon;
        const donorTypeColor = getDonorTypeColor(donation.donorType);
        const DonorTypeIcon = donorTypeColor.icon;

        const primaryColor = getPrimaryColor(categoryColor.gradient);

        // Handle hover with immediate state update
        const handleMouseEnter = () => {
            hoverRef.current = true;
            setIsHovered(true);
        };

        const handleMouseLeave = () => {
            hoverRef.current = false;
            setIsHovered(false);
        };

        const handleViewDetails = () => {
            setSelectedDonation(donation);
            setShowDetailModal(true);
        };

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
                {/* EXACT SAME ANIMATIONS AS MY REQUESTS CARDS */}

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
                                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2)'
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
                                                        handleSendThankYou(donation.id);
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
                                                    // Implement download receipt
                                                    console.log('Download receipt for:', donation.donationId);
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
                        >
                            {formatAmount(donation.amount)}
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

                    {/* Request Progress with EXACT SAME animation as My Requests */}
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
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    ₨{request.donatedAmount.toLocaleString()}
                                </span>
                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                    ₨{request.requiredAmount.toLocaleString()}
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

        const handlePageChange = (page) => {
            if (page !== currentPage) {
                onPageChange(page);

                setTimeout(() => {
                    const donationsSection = document.querySelector('.donations-grid-container')?.parentElement;
                    if (donationsSection) {
                        const yOffset = -100;
                        const y = donationsSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

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

    // Detail Modal Component
    const DetailModal = () => {
        if (!selectedDonation) return null;

        const request = getRequestById(selectedDonation.requestId);
        const categoryColor = getCategoryColor(selectedDonation.category);
        const CategoryIcon = categoryColor.icon;
        const donorTypeColor = getDonorTypeColor(selectedDonation.donorType);
        const DonorTypeIcon = donorTypeColor.icon;

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
                                onClick={() => setShowDetailModal(false)}
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
                                    <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {formatAmount(selectedDonation.amount)}
                                    </h3>
                                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Donated to: <span className="font-semibold">{selectedDonation.requestTitle}</span>
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
                                        {selectedDonation.donationId}
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Transaction ID
                                    </p>
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {selectedDonation.transactionId}
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Status
                                    </p>
                                    <div className={`inline-flex items-center gap-2 px-2 py-1 text-xs rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white`}>
                                        <CheckCircle size={12} />
                                        {selectedDonation.status}
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
                                            {selectedDonation.donorName}
                                        </p>
                                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {selectedDonation.donorType}
                                        </p>
                                    </div>
                                </div>

                                {!selectedDonation.isAnonymous && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedDonation.donorEmail && (
                                            <div className="flex items-center gap-2">
                                                <Mail size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {selectedDonation.donorEmail}
                                                </span>
                                            </div>
                                        )}
                                        {selectedDonation.donorPhone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {selectedDonation.donorPhone}
                                                </span>
                                            </div>
                                        )}
                                        {selectedDonation.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                                                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {selectedDonation.location}
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
                                            {selectedDonation.paymentMethod}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Date & Time
                                        </p>
                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {formatDate(selectedDonation.date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Type
                                        </p>
                                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {selectedDonation.isRecurring ? 'Recurring Donation' : 'One-time Donation'}
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
                                                    <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                        ₨{request.donatedAmount.toLocaleString()}/₨{request.requiredAmount.toLocaleString()}
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
                                    {selectedDonation.impact && (
                                        <div>
                                            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                This Donation's Impact
                                            </p>
                                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {selectedDonation.impact}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Donor Message */}
                        {selectedDonation.message && (
                            <div className={`p-6 rounded-2xl ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'} border`}>
                                <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Donor Message
                                </h3>
                                <div className="flex items-start gap-3">
                                    <MessageSquare size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                    <p className={`text-base italic ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                                        "{selectedDonation.message}"
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        {!selectedDonation.isAnonymous && selectedDonation.donorEmail && (
                            <div className="flex gap-3 pt-4">
                                <motion.button
                                    onClick={() => {
                                        setShowDetailModal(false);
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex-1 px-6 py-3 rounded-2xl border-2 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${isDark
                                        ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                        }`}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={() => {
                                        // Implement download receipt
                                        console.log('Download receipt');
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl text-sm font-semibold shadow-xl flex items-center justify-center gap-2"
                                >
                                    <Download size={16} />
                                    Download Receipt
                                </motion.button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    // Success Dialog Component - SAME AS MY REQUESTS
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

    return (
        <div className="space-y-8 px-4">


            {/* Statistics Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <EnhancedStatCard
                    icon={Coins}
                    title="Total Received"
                    value={formatAmount(stats.totalAmount)}
                    change={12.5}
                    changeType="increase"
                    color="from-emerald-500 to-emerald-600"
                    delay={0.1}
                    isDark={isDark}
                    subtitle="From all donations"
                />
                <EnhancedStatCard
                    icon={Users}
                    title="Total Donors"
                    value={stats.totalDonations}
                    change={8.3}
                    changeType="increase"
                    color="from-blue-500 to-blue-600"
                    delay={0.2}
                    isDark={isDark}
                    subtitle="Unique donations"
                />
                <EnhancedStatCard
                    icon={Wallet}
                    title="Average Donation"
                    value={formatAmount(Math.round(stats.averageDonation))}
                    change={5.7}
                    changeType="increase"
                    color="from-violet-500 to-violet-600"
                    delay={0.3}
                    isDark={isDark}
                    subtitle="Per donor"
                />
                <EnhancedStatCard
                    icon={TrendingUpIcon}
                    title="Recent Donations"
                    value={stats.recentDonations}
                    change={15.2}
                    changeType="increase"
                    color="from-amber-500 to-amber-600"
                    delay={0.4}
                    isDark={isDark}
                    subtitle="Last 30 days"
                />
            </motion.div>

            {/* Search and Filter Section */}
            <div className="filter-section">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
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
                                    {/* First row - 3 filters (removed donor type) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                        <div>
                                            <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Request
                                            </label>
                                            <select
                                                value={selectedRequest}
                                                onChange={(e) => setSelectedRequest(e.target.value)}
                                                className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                                    ? 'bg-gray-800 border-gray-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    }`}
                                            >
                                                <option value="All Requests">All Requests</option>
                                                {requests.map(request => (
                                                    <option key={request.id} value={request.id}>
                                                        {request.title}
                                                    </option>
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
                                                Sort By
                                            </label>
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
                                                className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 focus:outline-none text-sm font-medium ${isDark
                                                    ? 'bg-gray-800 border-gray-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    }`}
                                            >
                                                {sortOptions.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
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
                            transition={{ delay: 0.5 }}
                            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                        >
                            {paginatedDonations.map((donation, index) => (
                                <DonationCard
                                    key={donation.id}
                                    donation={donation}
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
                        Gratitude Tips for Recipients
                    </h4>
                    <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Show appreciation to your donors and build lasting relationships:
                    </p>
                    <ul className={`text-sm space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>Send thank you messages to donors who share their contact information</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>Share progress updates to show donors the impact of their contributions</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>Respect donor privacy - never share donor information without permission</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>Keep donors informed about how their donations are being used</span>
                        </li>
                    </ul>
                </div>
            </motion.div>

            {/* Detail Modal */}
            <AnimatePresence>
                {showDetailModal && (
                    <DetailModal />
                )}
            </AnimatePresence>


            <AnimatePresence>
                {showSuccessDialog && (
                    <SuccessDialog
                        isDark={isDark}
                        title="Thank You Sent!"
                        message={successMessage}
                        onClose={() => setShowSuccessDialog(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Donations;