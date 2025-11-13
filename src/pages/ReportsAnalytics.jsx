import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Filter,
  Calendar,
  Users,
  Heart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  FileText,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Eye,
  Printer,
  Mail,
  Share2,
  Settings,
  DownloadCloud,
  FileSpreadsheet,
  FileText as FileTextIcon,
} from 'lucide-react';

// Recharts imports
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Enhanced Dummy data for comprehensive reports
const reportsData = {
  // Summary Statistics
  summaryStats: {
    totalDonations: 1245780,
    totalDonors: 3456,
    totalRecipients: 892,
    activeRequests: 156,
    completedRequests: 734,
    rejectedRequests: 23,
    totalAmount: 8945600,
    avgDonationAmount: 2580,
    successRate: 94.5,
  },

  // Time-based data for different periods
  donationTrends: {
    daily: [
      { date: '2025-11-01', amount: 145000, donors: 45, recipients: 12 },
      { date: '2025-11-02', amount: 185000, donors: 52, recipients: 15 },
      { date: '2025-11-03', amount: 165000, donors: 48, recipients: 14 },
      { date: '2025-11-04', amount: 195000, donors: 55, recipients: 16 },
      { date: '2025-11-05', amount: 225000, donors: 62, recipients: 18 },
      { date: '2025-11-06', amount: 210000, donors: 58, recipients: 17 },
      { date: '2025-11-07', amount: 240000, donors: 65, recipients: 20 },
    ],
    weekly: [
      { week: 'Week 44', amount: 785000, donors: 220, recipients: 65 },
      { week: 'Week 45', amount: 895000, donors: 250, recipients: 72 },
      { week: 'Week 46', amount: 945000, donors: 265, recipients: 78 },
      { week: 'Week 47', amount: 1020000, donors: 285, recipients: 85 },
    ],
    monthly: [
      { month: 'Jan', amount: 1450000, donors: 340, recipients: 95 },
      { month: 'Feb', amount: 1850000, donors: 420, recipients: 112 },
      { month: 'Mar', amount: 1650000, donors: 380, recipients: 105 },
      { month: 'Apr', amount: 1950000, donors: 450, recipients: 125 },
      { month: 'May', amount: 2250000, donors: 520, recipients: 145 },
      { month: 'Jun', amount: 2100000, donors: 490, recipients: 138 },
    ],
    yearly: [
      { year: '2020', amount: 12500000, donors: 1200, recipients: 350 },
      { year: '2021', amount: 18500000, donors: 1800, recipients: 520 },
      { year: '2022', amount: 24500000, donors: 2400, recipients: 680 },
      { year: '2023', amount: 31500000, donors: 3000, recipients: 850 },
      { year: '2024', amount: 39500000, donors: 3600, recipients: 1050 },
    ],
  },

  // Category-wise distribution
  categoryDistribution: [
    { category: 'Medical', amount: 4560000, percentage: 51, count: 450 },
    { category: 'Education', amount: 2980000, percentage: 33, count: 280 },
    { category: 'Emergency', amount: 870000, percentage: 10, count: 95 },
    { category: 'Food', amount: 345000, percentage: 4, count: 45 },
    { category: 'Housing', amount: 200000, percentage: 2, count: 22 },
  ],

  // Status distribution
  statusDistribution: [
    { status: 'Approved', count: 734, percentage: 73.4, color: '#10b981' },
    { status: 'Pending', count: 156, percentage: 15.6, color: '#f59e0b' },
    { status: 'Validated', count: 89, percentage: 8.9, color: '#3b82f6' },
    { status: 'In Progress', count: 67, percentage: 6.7, color: '#8b5cf6' },
    { status: 'Rejected', count: 23, percentage: 2.3, color: '#ef4444' },
    { status: 'Draft', count: 45, percentage: 4.5, color: '#6b7280' },
  ],

  // Donor analytics
  donorAnalytics: {
    newDonors: 234,
    returningDonors: 3222,
    anonymousDonors: 567,
    topDonors: [
      { name: 'Anonymous', total: 450000, donations: 25, joinDate: '2023-01-15' },
      { name: 'Sarah Ali', total: 320000, donations: 18, joinDate: '2023-03-22' },
      { name: 'Muhammad Hassan', total: 285000, donations: 15, joinDate: '2023-05-10' },
      { name: 'Ayesha Khan', total: 210000, donations: 12, joinDate: '2023-07-30' },
      { name: 'Ali Raza', total: 180000, donations: 10, joinDate: '2023-09-05' },
    ],
    donorLocations: [
      { location: 'Karachi', donors: 1250, amount: 3450000 },
      { location: 'Lahore', donors: 980, amount: 2850000 },
      { location: 'Islamabad', donors: 650, amount: 1850000 },
      { location: 'Rawalpindi', donors: 320, amount: 950000 },
      { location: 'Other', donors: 256, amount: 745000 },
    ],
  },

  // Recipient analytics
  recipientAnalytics: {
    verified: 650,
    pendingVerification: 242,
    topRecipients: [
      { name: 'Ahmed Khan', received: 125000, category: 'Medical', completion: 95 },
      { name: 'Fatima Bibi', received: 98000, category: 'Education', completion: 88 },
      { name: 'Ali Hassan', received: 87000, category: 'Emergency', completion: 92 },
      { name: 'Zainab Malik', received: 76000, category: 'Food', completion: 85 },
      { name: 'Hassan Ahmed', received: 65000, category: 'Housing', completion: 90 },
    ],
    recipientLocations: [
      { location: 'Karachi', recipients: 320, amount: 2850000 },
      { location: 'Lahore', recipients: 280, amount: 2450000 },
      { location: 'Islamabad', recipients: 150, amount: 1850000 },
      { location: 'Rawalpindi', recipients: 85, amount: 950000 },
      { location: 'Other', recipients: 57, amount: 845000 },
    ],
  },

  // Payment analytics
  paymentAnalytics: {
    methods: [
      { method: 'Bank Transfer', count: 1567, amount: 4560000, percentage: 51 },
      { method: 'Credit Card', count: 1256, amount: 2980000, percentage: 33 },
      { method: 'Digital Wallet', count: 456, amount: 870000, percentage: 10 },
      { method: 'Cash', count: 177, amount: 535000, percentage: 6 },
    ],
    successRate: 96.8,
    failedTransactions: 45,
    avgProcessingTime: '2.3 hours',
  },

  // Recent activities
  recentActivities: [
    { id: 1, type: 'donation', description: 'New donation received from Anonymous', amount: 50000, timestamp: '2025-11-07 14:30' },
    { id: 2, type: 'approval', description: 'Request approved for Ahmed Khan', amount: null, timestamp: '2025-11-07 13:15' },
    { id: 3, type: 'registration', description: 'New donor registered: Ali Raza', amount: null, timestamp: '2025-11-07 12:45' },
    { id: 4, type: 'donation', description: 'Monthly donation from Sarah Ali', amount: 25000, timestamp: '2025-11-07 11:20' },
    { id: 5, type: 'verification', description: 'Recipient verified: Fatima Bibi', amount: null, timestamp: '2025-11-07 10:15' },
  ],
};

// Enhanced Stat Card for Reports
const ReportStatCard = ({ icon: Icon, title, value, change, changeType, color, delay, isDark, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.5, type: "spring" }}
    whileHover={{ y: -8, scale: 1.03 }}
    className={`rounded-2xl p-6 shadow-2xl border relative overflow-hidden group ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}
  >
    {/* Animated Background Gradient */}
    <motion.div
      className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    />
    
    <div className="flex items-start justify-between relative z-10">
      <div className="flex-1">
        <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{title}</p>
        <motion.h3 
          className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring" }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </motion.h3>
        {description && (
          <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>
        )}
        {change && (
          <motion.div 
            className="flex items-center gap-1"
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
            <span className={`text-xs ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>vs last period</span>
          </motion.div>
        )}
      </div>
      
      {/* Icon with animations */}
      <motion.div
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className={`p-3 rounded-xl`}
          style={{
            backgroundColor: color.includes('blue') ? 'rgba(59, 130, 246, 0.1)' : 
                           color.includes('emerald') ? 'rgba(16, 185, 129, 0.1)' :
                           color.includes('violet') ? 'rgba(139, 92, 246, 0.1)' :
                           color.includes('amber') ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)'
          }}
        >
          <Icon 
            size={24} 
            strokeWidth={2.5}
            style={{
              color: color.includes('blue') ? '#3b82f6' : 
                     color.includes('emerald') ? '#10b981' :
                     color.includes('violet') ? '#8b5cf6' :
                     color.includes('amber') ? '#f59e0b' : '#3b82f6'
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  </motion.div>
);

// Enhanced Chart Card Component
const ReportChartCard = ({ title, children, actions, height = "400px", isDark, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, type: "spring" }}
    className={`rounded-2xl p-6 shadow-2xl border ${className} ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}
    style={{ height }}
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
    {children}
  </motion.div>
);

// Date Range Picker Component
const DateRangePicker = ({ dateRange, onDateRangeChange, isDark }) => {
  return (
    <div className="flex gap-3">
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          From Date
        </label>
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => onDateRangeChange(prev => ({ ...prev, start: e.target.value }))}
          className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
      </div>
      <div>
        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          To Date
        </label>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => onDateRangeChange(prev => ({ ...prev, end: e.target.value }))}
          className={`px-3 py-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
      </div>
    </div>
  );
};

// Time Period Selector Component
const TimePeriodSelector = ({ period, onPeriodChange, isDark }) => {
  const periods = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'custom', label: 'Custom Range' },
  ];

  return (
    <select
      value={period}
      onChange={(e) => onPeriodChange(e.target.value)}
      className={`px-4 py-2 rounded-lg border focus:ring-2 focus:ring-violet-500 focus:outline-none ${
        isDark 
          ? 'bg-gray-700 border-gray-600 text-white' 
          : 'bg-white border-gray-300 text-gray-900'
      }`}
    >
      {periods.map(p => (
        <option key={p.value} value={p.value}>{p.label}</option>
      ))}
    </select>
  );
};

// Export Options Component
const ExportOptions = ({ onExport, isDark }) => {
  const [showOptions, setShowOptions] = useState(false);

  const exportOptions = [
    { format: 'xlsx', label: 'Excel (.xlsx)', icon: FileSpreadsheet, color: 'text-green-600' },
    { format: 'pdf', label: 'PDF Report', icon: FileTextIcon, color: 'text-rose-600' },
    { format: 'csv', label: 'CSV Data', icon: FileText, color: 'text-blue-600' },
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-lg font-semibold"
      >
        <Download size={18} />
        Export
        <ChevronDown size={16} />
      </motion.button>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className={`absolute top-12 right-0 w-48 rounded-lg shadow-xl border z-50 ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="p-2 space-y-1">
              {exportOptions.map((option) => (
                <button
                  key={option.format}
                  onClick={() => {
                    onExport(option.format);
                    setShowOptions(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                    isDark 
                      ? 'hover:bg-gray-700 text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <option.icon size={16} className={option.color} />
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Donation Trends Chart Component
const DonationTrendsChart = ({ data, period, isDark }) => {
  const xAxisKey = period === 'yearly' ? 'year' : period === 'monthly' ? 'month' : period === 'weekly' ? 'week' : 'date';
  const xAxisLabel = period === 'yearly' ? 'Year' : period === 'monthly' ? 'Month' : period === 'weekly' ? 'Week' : 'Date';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="amountGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={isDark ? '#374151' : '#e5e7eb'} 
          vertical={false}
        />
        <XAxis 
          dataKey={xAxisKey} 
          stroke={isDark ? '#d1d5db' : '#6b7280'} 
          fontSize={12}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          stroke={isDark ? '#d1d5db' : '#6b7280'} 
          fontSize={12}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `₨${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
            border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '12px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            color: isDark ? '#fff' : '#000',
          }}
          formatter={(value) => [`₨${value.toLocaleString()}`, 'Amount']}
          labelFormatter={(label) => `${xAxisLabel}: ${label}`}
        />
        <Area 
          type="monotone" 
          dataKey="amount" 
          stroke="#8b5cf6" 
          fill="url(#amountGradient)" 
          strokeWidth={3}
          dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="donors" 
          stroke="#10b981" 
          strokeWidth={2}
          strokeDasharray="3 3"
          dot={{ fill: '#10b981', r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Category Distribution Chart Component
const CategoryDistributionChart = ({ data, isDark }) => {
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="amount"
          nameKey="category"
          label={({ category, percentage }) => `${category} (${percentage}%)`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
            border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '12px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            color: isDark ? '#fff' : '#000',
          }}
          formatter={(value, name) => [`₨${value.toLocaleString()}`, name]}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

// Status Distribution Chart Component
const StatusDistributionChart = ({ data, isDark }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={isDark ? '#374151' : '#e5e7eb'} 
          vertical={false}
        />
        <XAxis 
          dataKey="status" 
          stroke={isDark ? '#d1d5db' : '#6b7280'} 
          fontSize={12}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          stroke={isDark ? '#d1d5db' : '#6b7280'} 
          fontSize={12}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
            border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
            borderRadius: '12px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            color: isDark ? '#fff' : '#000',
          }}
          formatter={(value) => [value, 'Count']}
        />
        <Bar 
          dataKey="count" 
          radius={[4, 4, 0, 0]}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// Enhanced Data Table Component
const DataTable = ({ data, columns, title, isDark, onExport }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return paginatedData;
    
    return [...paginatedData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [paginatedData, sortConfig]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <ReportChartCard 
      title={title}
      actions={<ExportOptions onExport={onExport} isDark={isDark} />}
      isDark={isDark}
      className="min-h-[500px]"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`text-left py-3 px-4 text-xs font-semibold uppercase cursor-pointer ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {sortConfig.key === column.key && (
                      <ChevronDown 
                        size={14} 
                        className={`transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className={`border-b ${
                  isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
                } transition-colors`}
              >
                {columns.map((column) => (
                  <td 
                    key={column.key} 
                    className={`py-3 px-4 text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={`flex justify-between items-center mt-4 pt-4 border-t ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-4">
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, data.length)} of {data.length}
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className={`px-2 py-1 rounded border text-sm ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded text-sm ${
              currentPage === 1
                ? (isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400')
                : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50')
            }`}
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === page
                    ? 'bg-violet-600 text-white'
                    : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50')
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded text-sm ${
              currentPage === totalPages
                ? (isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400')
                : (isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50')
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </ReportChartCard>
  );
};

// Main Reports & Analytics Component
const ReportsAnalytics = ({ isDark }) => {
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [dateRange, setDateRange] = useState({ start: '2025-01-01', end: '2025-11-07' });
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    paymentMethod: 'all',
  });

  // Get data based on selected time period
  const getTrendData = () => {
    return reportsData.donationTrends[timePeriod] || reportsData.donationTrends.monthly;
  };

  // Handle export functionality
  const handleExport = (format) => {
    console.log(`Exporting ${activeTab} report as ${format}`);
    alert(`Exporting ${activeTab} report as ${format} format`);
    
    const data = {
      format,
      tab: activeTab,
      period: timePeriod,
      dateRange,
      filters,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Export data:', data);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Refresh data (simulated)
  const handleRefresh = () => {
    console.log('Refreshing report data...');
    alert('Report data refreshed!');
  };

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'donations', label: 'Donations', icon: DollarSign },
    { id: 'donors', label: 'Donors', icon: Users },
    { id: 'recipients', label: 'Recipients', icon: Heart },
    { id: 'financial', label: 'Financial', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 shadow-2xl border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Reports & Analytics
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive insights and analytics for your donation platform
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <TimePeriodSelector 
              period={timePeriod} 
              onPeriodChange={setTimePeriod} 
              isDark={isDark} 
            />
            
            {timePeriod === 'custom' && (
              <DateRangePicker 
                dateRange={dateRange} 
                onDateRangeChange={setDateRange} 
                isDark={isDark} 
              />
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <RefreshCw size={18} />
              Refresh
            </motion.button>
            
            <ExportOptions onExport={handleExport} isDark={isDark} />
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-lg'
                  : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <ReportStatCard
              icon={DollarSign}
              title="Total Donations"
              value={reportsData.summaryStats.totalDonations}
              change={12.5}
              changeType="increase"
              color="from-emerald-500 to-teal-500"
              delay={0.1}
              isDark={isDark}
              description="All time donations"
            />
            <ReportStatCard
              icon={Users}
              title="Total Donors"
              value={reportsData.summaryStats.totalDonors}
              change={8.3}
              changeType="increase"
              color="from-blue-500 to-cyan-500"
              delay={0.2}
              isDark={isDark}
              description="Registered donors"
            />
            <ReportStatCard
              icon={Heart}
              title="Recipients Helped"
              value={reportsData.summaryStats.totalRecipients}
              change={15.7}
              changeType="increase"
              color="from-violet-500 to-purple-500"
              delay={0.3}
              isDark={isDark}
              description="People supported"
            />
            <ReportStatCard
              icon={TrendingUp}
              title="Success Rate"
              value={`${reportsData.summaryStats.successRate}%`}
              change={2.1}
              changeType="increase"
              color="from-amber-500 to-orange-500"
              delay={0.4}
              isDark={isDark}
              description="Completed requests"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donation Trends */}
            <ReportChartCard 
              title="Donation Trends"
              actions={
                <select 
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className={`px-3 py-1.5 rounded-lg border text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              }
              isDark={isDark}
            >
              <DonationTrendsChart 
                data={getTrendData()} 
                period={timePeriod}
                isDark={isDark} 
              />
            </ReportChartCard>

            {/* Category Distribution */}
            <ReportChartCard title="Category Distribution" isDark={isDark}>
              <CategoryDistributionChart 
                data={reportsData.categoryDistribution} 
                isDark={isDark} 
              />
            </ReportChartCard>
          </div>

          {/* Status Distribution and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportChartCard title="Request Status Distribution" isDark={isDark}>
              <StatusDistributionChart 
                data={reportsData.statusDistribution} 
                isDark={isDark} 
              />
            </ReportChartCard>

            {/* Recent Activity */}
            <ReportChartCard 
              title="Recent Activity"
              actions={
                <button className={`text-sm ${isDark ? 'text-violet-400' : 'text-violet-600'} hover:underline`}>
                  View All
                </button>
              }
              isDark={isDark}
            >
              <div className="space-y-3">
                {reportsData.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'donation' ? 'bg-green-500' :
                      activity.type === 'approval' ? 'bg-blue-500' :
                      activity.type === 'registration' ? 'bg-purple-500' : 'bg-amber-500'
                    }`} />
                    <div className="flex-1">
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {activity.description}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {activity.timestamp}
                      </p>
                    </div>
                    {activity.amount && (
                      <span className={`text-sm font-semibold ${
                        isDark ? 'text-green-400' : 'text-green-600'
                      }`}>
                        ₨{activity.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </ReportChartCard>
          </div>
        </div>
      )}

      {/* Donations Tab */}
      {activeTab === 'donations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportChartCard title="Donation Trends Over Time" isDark={isDark}>
              <DonationTrendsChart 
                data={getTrendData()} 
                period={timePeriod}
                isDark={isDark} 
              />
            </ReportChartCard>
            
            <ReportChartCard title="Payment Methods" isDark={isDark}>
              <CategoryDistributionChart 
                data={reportsData.paymentAnalytics.methods.map(method => ({
                  ...method,
                  category: method.method,
                  percentage: method.percentage,
                }))} 
                isDark={isDark} 
              />
            </ReportChartCard>
          </div>

          {/* Donations Data Table */}
          <DataTable
            data={reportsData.donationTrends.daily}
            columns={[
              { key: 'date', label: 'Date' },
              { key: 'amount', label: 'Amount', render: (value) => `₨${value.toLocaleString()}` },
              { key: 'donors', label: 'Donors' },
              { key: 'recipients', label: 'Recipients' },
            ]}
            title="Daily Donation Details"
            isDark={isDark}
            onExport={handleExport}
          />
        </div>
      )}

      {/* Donors Tab */}
      {activeTab === 'donors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportChartCard title="Donor Locations" isDark={isDark}>
              <CategoryDistributionChart 
                data={reportsData.donorAnalytics.donorLocations.map(location => ({
                  ...location,
                  category: location.location,
                  amount: location.amount,
                  percentage: Math.round((location.donors / reportsData.donorAnalytics.donorLocations.reduce((sum, loc) => sum + loc.donors, 0)) * 100),
                }))} 
                isDark={isDark} 
              />
            </ReportChartCard>
            
            <ReportChartCard title="Donor Statistics" isDark={isDark}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>New Donors:</span>
                  <span className="font-semibold text-green-500">{reportsData.donorAnalytics.newDonors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Returning Donors:</span>
                  <span className="font-semibold text-blue-500">{reportsData.donorAnalytics.returningDonors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Anonymous Donors:</span>
                  <span className="font-semibold text-purple-500">{reportsData.donorAnalytics.anonymousDonors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Total Donors:</span>
                  <span className="font-semibold text-violet-500">{reportsData.summaryStats.totalDonors}</span>
                </div>
              </div>
            </ReportChartCard>
          </div>

          {/* Top Donors Table */}
          <DataTable
            data={reportsData.donorAnalytics.topDonors}
            columns={[
              { key: 'name', label: 'Donor Name' },
              { key: 'total', label: 'Total Donated', render: (value) => `₨${value.toLocaleString()}` },
              { key: 'donations', label: 'Total Donations' },
              { key: 'joinDate', label: 'Join Date' },
            ]}
            title="Top Donors"
            isDark={isDark}
            onExport={handleExport}
          />
        </div>
      )}

      {/* Recipients Tab */}
      {activeTab === 'recipients' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportChartCard title="Recipient Verification Status" isDark={isDark}>
              <StatusDistributionChart 
                data={[
                  { status: 'Verified', count: reportsData.recipientAnalytics.verified, color: '#10b981' },
                  { status: 'Pending', count: reportsData.recipientAnalytics.pendingVerification, color: '#f59e0b' },
                ]} 
                isDark={isDark} 
              />
            </ReportChartCard>
            
            <ReportChartCard title="Recipient Locations" isDark={isDark}>
              <CategoryDistributionChart 
                data={reportsData.recipientAnalytics.recipientLocations.map(location => ({
                  ...location,
                  category: location.location,
                  amount: location.amount,
                  percentage: Math.round((location.recipients / reportsData.recipientAnalytics.recipientLocations.reduce((sum, loc) => sum + loc.recipients, 0)) * 100),
                }))} 
                isDark={isDark} 
              />
            </ReportChartCard>
          </div>

          {/* Top Recipients Table */}
          <DataTable
            data={reportsData.recipientAnalytics.topRecipients}
            columns={[
              { key: 'name', label: 'Recipient Name' },
              { key: 'received', label: 'Amount Received', render: (value) => `₨${value.toLocaleString()}` },
              { key: 'category', label: 'Category' },
              { key: 'completion', label: 'Completion Rate', render: (value) => `${value}%` },
            ]}
            title="Top Recipients"
            isDark={isDark}
            onExport={handleExport}
          />
        </div>
      )}

      {/* Financial Tab */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportChartCard title="Financial Overview" isDark={isDark}>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <span>Total Amount:</span>
                  <span className="font-bold">₨{reportsData.summaryStats.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Average Donation:</span>
                  <span className="font-semibold">₨{reportsData.summaryStats.avgDonationAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Payment Success Rate:</span>
                  <span className="font-semibold text-green-500">{reportsData.paymentAnalytics.successRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Failed Transactions:</span>
                  <span className="font-semibold text-rose-500">{reportsData.paymentAnalytics.failedTransactions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Avg Processing Time:</span>
                  <span className="font-semibold text-blue-500">{reportsData.paymentAnalytics.avgProcessingTime}</span>
                </div>
              </div>
            </ReportChartCard>
            
            <ReportChartCard title="Category-wise Financial Distribution" isDark={isDark}>
              <CategoryDistributionChart 
                data={reportsData.categoryDistribution} 
                isDark={isDark} 
              />
            </ReportChartCard>
          </div>

          {/* Payment Methods Table */}
          <DataTable
            data={reportsData.paymentAnalytics.methods}
            columns={[
              { key: 'method', label: 'Payment Method' },
              { key: 'count', label: 'Transaction Count' },
              { key: 'amount', label: 'Total Amount', render: (value) => `₨${value.toLocaleString()}` },
              { key: 'percentage', label: 'Percentage', render: (value) => `${value}%` },
            ]}
            title="Payment Methods Analysis"
            isDark={isDark}
            onExport={handleExport}
          />
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;