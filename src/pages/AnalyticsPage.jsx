import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  DollarSign,
  Users,
  TrendingUp,
  Target,
  Download,
  FileText,
  PieChart,
  RefreshCw,
  Heart,
  Award,
  TrendingDown,
  Activity,
  BarChart4,
  LineChart
} from 'lucide-react';

// ==================== COMPREHENSIVE DUMMY DATA ====================
const generateDummyAnalyticsData = (timeRange) => {
  const baseData = {
    '7d': {
      overview: {
        totalRaised: 85000,
        totalDonors: 28,
        avgDonation: 3036,
        completionRate: 72,
        growthRate: 15.7,
        successRate: 85
      },
      trends: [
        { date: 'Mon', amount: 12000, donors: 8, requests: 2 },
        { date: 'Tue', amount: 8000, donors: 5, requests: 1 },
        { date: 'Wed', amount: 15000, donors: 10, requests: 3 },
        { date: 'Thu', amount: 20000, donors: 12, requests: 4 },
        { date: 'Fri', amount: 18000, donors: 9, requests: 2 },
        { date: 'Sat', amount: 12000, donors: 7, requests: 1 },
        { date: 'Sun', amount: 15000, donors: 11, requests: 3 }
      ],
      donorDemographics: [
        { age: '18-25', count: 8, percentage: 29, amount: 24000 },
        { age: '26-35', count: 15, percentage: 54, amount: 45000 },
        { age: '36-45', count: 12, percentage: 43, amount: 36000 },
        { age: '46-55', count: 7, percentage: 25, amount: 21000 },
        { age: '56+', count: 3, percentage: 11, amount: 9000 }
      ],
      categoryPerformance: [
        { category: 'Medical', amount: 45000, percentage: 53, color: '#3b82f6', donors: 18 },
        { category: 'Education', amount: 25000, percentage: 29, color: '#10b981', donors: 12 },
        { category: 'Emergency', amount: 12000, percentage: 14, color: '#f59e0b', donors: 8 },
        { category: 'Business', amount: 3000, percentage: 4, color: '#8b5cf6', donors: 3 }
      ],
      topDonors: [
        { name: 'Anonymous', amount: 25000, donations: 3, engagement: 95 },
        { name: 'Sarah Ali', amount: 18000, donations: 2, engagement: 85 },
        { name: 'Tech Corp', amount: 15000, donations: 1, engagement: 65 },
        { name: 'Dr. Ahmed', amount: 12000, donations: 2, engagement: 75 },
        { name: 'Family Trust', amount: 8000, donations: 1, engagement: 45 }
      ]
    },
    '30d': {
      overview: {
        totalRaised: 325000,
        totalDonors: 89,
        avgDonation: 3652,
        completionRate: 68,
        growthRate: 22.3,
        successRate: 82
      },
      trends: Array.from({ length: 30 }, (_, i) => {
        const date = new Date(2024, 0, i + 1);
        return {
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          amount: Math.floor(5000 + Math.random() * 15000),
          donors: Math.floor(3 + Math.random() * 8),
          requests: Math.floor(1 + Math.random() * 3)
        };
      }),
      donorDemographics: [
        { age: '18-25', count: 25, percentage: 28, amount: 85000 },
        { age: '26-35', count: 35, percentage: 39, amount: 125000 },
        { age: '36-45', count: 18, percentage: 20, amount: 75000 },
        { age: '46-55', count: 8, percentage: 9, amount: 30000 },
        { age: '56+', count: 3, percentage: 3, amount: 10000 }
      ],
      categoryPerformance: [
        { category: 'Medical', amount: 180000, percentage: 55, color: '#3b82f6', donors: 45 },
        { category: 'Education', amount: 85000, percentage: 26, color: '#10b981', donors: 25 },
        { category: 'Emergency', amount: 40000, percentage: 12, color: '#f59e0b', donors: 12 },
        { category: 'Business', amount: 20000, percentage: 6, color: '#8b5cf6', donors: 7 }
      ],
      topDonors: [
        { name: 'Anonymous', amount: 75000, donations: 8, engagement: 98 },
        { name: 'Sarah Ali', amount: 50000, donations: 5, engagement: 92 },
        { name: 'Tech Corp', amount: 45000, donations: 3, engagement: 78 },
        { name: 'Dr. Ahmed', amount: 35000, donations: 4, engagement: 85 },
        { name: 'Family Trust', amount: 30000, donations: 2, engagement: 65 }
      ]
    }
  };

  return baseData[timeRange] || baseData['30d'];
};

// ==================== ENHANCED STAT CARD (Same as Dashboard) ====================
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
}) => {
  // Get the correct icon color based on the card color
  const getIconColor = () => {
    if (color.includes('blue')) return 'text-blue-500';
    if (color.includes('emerald')) return 'text-emerald-500';
    if (color.includes('violet')) return 'text-violet-500';
    if (color.includes('amber')) return 'text-amber-500';
    return 'text-blue-500';
  };

  // Get gradient colors for the icon background
  const getIconGradient = () => {
    if (color.includes('blue')) return 'from-blue-500 to-cyan-500';
    if (color.includes('emerald')) return 'from-emerald-500 to-teal-500';
    if (color.includes('violet')) return 'from-violet-500 to-purple-500';
    if (color.includes('amber')) return 'from-amber-500 to-orange-500';
    return 'from-blue-500 to-cyan-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`rounded-2xl p-6 shadow-xl border relative overflow-hidden group cursor-pointer ${isDark
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
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

      {/* Floating Particles - BUBBLE ANIMATION */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={false}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full opacity-40`}
            style={{
              backgroundColor: color.includes('blue') ? '#3b82f6' :
                color.includes('emerald') ? '#10b981' :
                  color.includes('violet') ? '#8b5cf6' :
                    color.includes('amber') ? '#f59e0b' : '#3b82f6',
              left: `${15 + i * 17}%`,
              top: '25%',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 15 : -15, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2.5 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>

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
        <Icon size={80} className={getIconColor()} />
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
                (title.includes('Amount') || title.includes('Raised') ? `₨${value.toLocaleString()}` : value.toLocaleString())
                : value
              }
            </motion.h3>
            {subtitle && (
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Icon with proper green color for Users icon */}
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
                className={getIconColor()}
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
};

// ==================== PROFESSIONAL DONATION TRENDS CHART ====================
const DonationTrendsChart = ({ data, isDark, loading }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (loading) {
    return (
      <div className="h-72 flex items-center justify-center">
        <div className="animate-pulse w-full">
          <div className={`h-56 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center">
        <BarChart4 size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          No donation data available
        </p>
      </div>
    );
  }

  const maxAmount = Math.max(...data.map(item => item.amount));

  return (
    <div className="h-72">
      {/* Y-axis labels */}
      <div className="flex h-56">
        <div className="flex flex-col justify-between pr-4">
          {[0, 25, 50, 75, 100].map((percent) => (
            <span key={percent} className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              ₨{Math.round((percent / 100) * maxAmount).toLocaleString()}
            </span>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1">
          <div className="flex items-end justify-between h-56 gap-2 px-4">
            {data?.map((item, index) => {
              const heightPercentage = (item.amount / maxAmount) * 100;
              return (
                <div key={index} className="flex flex-col items-center flex-1 relative">
                  {/* Grid line */}
                  <div className={`absolute inset-x-0 top-0 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />

                  {/* Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercentage}%` }}
                    transition={{ delay: index * 0.05, duration: 0.8, type: "spring" }}
                    className={`w-full max-w-16 rounded-t-lg relative cursor-pointer group ${isDark ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-gradient-to-t from-blue-500 to-blue-300'
                      }`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 5,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Hover Tooltip */}
                    {hoveredIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`absolute -top-16 left-1/2 transform -translate-x-1/2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${isDark ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900 shadow-lg border border-gray-200'
                          } z-50`}
                      >
                        <div className="font-bold text-sm">₨{item.amount.toLocaleString()}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`} />
                          <span className="text-xs opacity-75">{item.donors} donors</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* X-axis label */}
                  <span className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* X-axis line */}
      <div className={`h-px w-full mt-2 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
    </div>
  );
};

// ==================== PROFESSIONAL PIE CHART FOR CATEGORIES ====================
const CategoryPerformanceChart = ({ data, isDark, loading }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  if (loading) {
    return (
      <div className="h-72 flex items-center justify-center">
        <div className="animate-pulse">
          <div className={`w-48 h-48 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center">
        <PieChart size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          No category data available
        </p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.amount, 0);
  let currentAngle = 0;

  return (
    <div className="h-72">
      <div className="flex items-center h-56">
        {/* Pie Chart */}
        <div className="w-1/2 flex justify-center">
          <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.amount / total) * 100;
              const angle = (percentage / 100) * 360;
              const largeArcFlag = angle > 180 ? 1 : 0;

              const x1 = 90 + 70 * Math.cos(currentAngle * Math.PI / 180);
              const y1 = 90 + 70 * Math.sin(currentAngle * Math.PI / 180);
              const x2 = 90 + 70 * Math.cos((currentAngle + angle) * Math.PI / 180);
              const y2 = 90 + 70 * Math.sin((currentAngle + angle) * Math.PI / 180);

              const pathData = [
                `M 90 90`,
                `L ${x1} ${y1}`,
                `A 70 70 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');

              const segment = (
                <motion.path
                  key={item.category}
                  d={pathData}
                  fill={item.color}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.15, duration: 0.8, type: "spring" }}
                  whileHover={{ scale: 1.05, opacity: 0.9 }}
                  onMouseEnter={() => setSelectedCategory(item)}
                  onMouseLeave={() => setSelectedCategory(null)}
                  className="cursor-pointer transition-all"
                />
              );

              currentAngle += angle;
              return segment;
            })}

            {/* Center Circle */}
            <circle cx="90" cy="90" r="35" fill={isDark ? "#1f2937" : "#f9fafb"} />
            <text
              x="90"
              y="90"
              textAnchor="middle"
              dy=".3em"
              className={`text-sm font-bold ${isDark ? 'fill-gray-300' : 'fill-gray-700'}`}
            >
              Total
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="w-1/2 space-y-3">
          {data.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${selectedCategory?.category === category.category
                  ? (isDark ? 'bg-gray-700' : 'bg-gray-100')
                  : ''
                }`}
              onMouseEnter={() => setSelectedCategory(category)}
              onMouseLeave={() => setSelectedCategory(null)}
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                    {category.category}
                  </span>
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {category.percentage}%
                  </span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: index * 0.2, duration: 1 }}
                  className={`h-2 rounded-full mt-1 ${isDark ? 'bg-gray-600' : 'bg-gray-200'
                    }`}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ delay: index * 0.3, duration: 1.5, type: "spring" }}
                    className="h-full rounded-full relative"
                    style={{ backgroundColor: category.color }}
                  >
                    {/* Shimmer Effect on hover */}
                    {selectedCategory?.category === category.category && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </motion.div>
                </motion.div>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  ₨{category.amount.toLocaleString()} • {category.donors} donors
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== ENHANCED ANIMATED DONOR DEMOGRAPHICS ====================
const DonorDemographicsChart = ({ data, isDark, loading }) => {
  const [hoveredDemo, setHoveredDemo] = useState(null);

  if (loading) {
    return (
      <div className="h-72 space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-20 h-4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
              <div className={`w-16 h-4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
            </div>
            <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center">
        <Users size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          No demographic data available
        </p>
      </div>
    );
  }

  return (
    <div className="h-72 space-y-4">
      {data?.map((demo, index) => (
        <motion.div
          key={demo.age}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-2 group"
          onMouseEnter={() => setHoveredDemo(demo.age)}
          onMouseLeave={() => setHoveredDemo(null)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.5 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-violet-500/20' : 'bg-violet-100'
                  }`}
              >
                <Users size={18} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
              </motion.div>
              <div>
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {demo.age} years
                </span>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {demo.count} donors
                </p>
              </div>
            </div>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className={`text-sm font-bold px-3 py-1 rounded-full ${isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'
                }`}
            >
              {demo.percentage}%
            </motion.span>
          </div>

          <div className={`w-full h-2.5 rounded-full relative overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${demo.percentage}%` }}
              transition={{ delay: index * 0.2, duration: 1, type: "spring" }}
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400 relative"
            >
              {/* Floating particles inside the progress bar */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/50 rounded-full"
                  style={{
                    left: `${15 + i * 25}%`,
                    top: '30%',
                  }}
                  animate={{
                    y: [0, -3, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}

              {/* Shimmer Effect on hover */}
              {hoveredDemo === demo.age && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.div>
          </div>

          <div className="flex items-center justify-between">
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              ₨{demo.amount.toLocaleString()} total donations
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.4 }}
              className="flex items-center gap-1"
            >
              <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-violet-400' : 'bg-violet-500'}`} />
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Age group
              </span>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ==================== ENHANCED ANIMATED TOP DONORS LIST ====================
const TopDonorsList = ({ data, isDark, loading }) => {
  const [hoveredDonor, setHoveredDonor] = useState(null);
  const [pulseDonor, setPulseDonor] = useState(null);

  // Rotate through donors for pulse effect
  useEffect(() => {
    if (!data || data.length === 0) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * data.length);
      setPulseDonor(randomIndex);
      setTimeout(() => setPulseDonor(null), 1000);
    }, 4000);

    return () => clearInterval(interval);
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="animate-pulse p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className={`w-24 h-4 rounded mb-2 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
                <div className={`w-20 h-3 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
              </div>
              <div className={`w-16 h-4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex flex-col items-center justify-center">
        <Heart size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          No donor data available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data?.map((donor, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center justify-between p-4 rounded-xl backdrop-blur-sm border transition-all cursor-pointer relative overflow-hidden ${isDark
              ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
              : 'bg-gray-100/50 border-gray-200 hover:bg-gray-200/50'
            } ${hoveredDonor === index ? 'scale-[1.02]' : ''}`}
          onMouseEnter={() => setHoveredDonor(index)}
          onMouseLeave={() => setHoveredDonor(null)}
          whileHover={{ scale: 1.02 }}
        >
          {/* Pulse effect for active donor */}
          {pulseDonor === index && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-500/20 to-transparent"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          )}

          <div className="flex items-center gap-4 relative z-10">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center relative ${isDark ? 'bg-gray-700' : 'bg-white'
                } shadow-lg`}
            >
              {/* Crown for top donor */}
              {index === 0 && (
                <motion.div
                  animate={{ y: [0, -3, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2 text-amber-500"
                >
                  <Award size={14} fill="currentColor" />
                </motion.div>
              )}

              <Heart
                size={20}
                className={
                  index === 0 ? 'text-rose-500' :
                    index === 1 ? 'text-amber-500' :
                      index === 2 ? 'text-emerald-500' : 'text-blue-500'
                }
              />

              {/* Rank badge */}
              <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                } shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                #{index + 1}
              </div>
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {donor.name}
                </p>
                {index < 3 && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-rose-500' :
                        index === 1 ? 'bg-amber-500' :
                          'bg-emerald-500'
                      }`}
                  />
                )}
              </div>

              {/* Progress bar for engagement - with shimmer animation */}
              <div className="mt-3">
                <div className={`w-full h-2.5 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'
                  }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${donor.engagement}%` }}
                    transition={{ delay: index * 0.3, duration: 1.5, type: "spring" }}
                    className={`h-full rounded-full relative ${index === 0 ? 'bg-gradient-to-r from-rose-500 to-pink-400' :
                        index === 1 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                          index === 2 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                            'bg-gradient-to-r from-blue-500 to-cyan-400'
                      }`}
                  >
                    {/* Floating particles inside the progress bar */}
                    {[...Array(2)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/50 rounded-full"
                        style={{
                          left: `${20 + i * 30}%`,
                          top: '30%',
                        }}
                        animate={{
                          y: [0, -3, 0],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 2 + i * 0.5,
                          repeat: Infinity,
                          delay: i * 0.4,
                        }}
                      />
                    ))}

                    {/* Shimmer Effect on hover */}
                    {hoveredDonor === index && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </motion.div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {donor.donations} donation{donor.donations > 1 ? 's' : ''}
                  </span>
                  <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {donor.engagement}% engagement
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className={`font-bold text-lg bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent text-right`}
            >
              ₨{donor.amount.toLocaleString()}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.4 }}
              className="flex items-center justify-end gap-1 mt-1"
            >
              <TrendingUp size={12} className="text-emerald-500" />
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Top {index < 3 ? 'supporter' : 'donor'}
              </span>
            </motion.div>
          </div>

          {/* Hover effect line */}
          {hoveredDonor === index && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ==================== UNIFIED ANALYTICS PAGE COMPONENT ====================
const AnalyticsPage = ({ isDark }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Fetch analytics data
  const fetchAnalyticsData = async (range, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = generateDummyAnalyticsData(range);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle export with loading state
  const handleExport = async (format) => {
    setExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (format === 'PDF') {
      // PDF export logic here
      alert('PDF export functionality would be implemented here');
    } else {
      // Excel export logic here
      alert('Excel export functionality would be implemented here');
    }

    setExporting(false);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchAnalyticsData(timeRange, true);
  };

  // Initial data load
  useEffect(() => {
    fetchAnalyticsData(timeRange);
  }, [timeRange]);

  // Stats cards matching dashboard style
  const stats = [
    {
      title: "Total Raised",
      value: analyticsData?.overview?.totalRaised || 0,
      change: "+15.7%",
      changeType: "increase",
      icon: DollarSign,
      color: "from-blue-500 to-blue-600",
      delay: 0.1,
      subtitle: "All time donations"
    },
    {
      title: "Total Donors",
      value: analyticsData?.overview?.totalDonors || 0,
      change: "+8.3%",
      changeType: "increase",
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
      delay: 0.2,
      subtitle: "Active supporters"
    },
    {
      title: "Avg Donation",
      value: analyticsData?.overview?.avgDonation || 0,
      change: "+12.5%",
      changeType: "increase",
      icon: TrendingUp,
      color: "from-violet-500 to-violet-600",
      delay: 0.3,
      subtitle: "Per donation"
    },
    {
      title: "Completion Rate",
      value: analyticsData?.overview?.completionRate || 0,
      change: "+5.2%",
      changeType: "increase",
      icon: Target,
      color: "from-amber-500 to-amber-600",
      delay: 0.4,
      subtitle: "Request success"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header Controls */}
      <div className="flex items-center justify-end">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${isDark
                ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
              }`}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          <motion.button
            onClick={handleRefresh}
            disabled={refreshing}
            whileHover={!refreshing ? { scale: 1.05 } : {}}
            whileTap={!refreshing ? { scale: 0.95 } : {}}
            className={`p-3 rounded-xl border flex items-center gap-2 ${isDark
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              } ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <motion.div
              animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={refreshing ?
                { duration: 1, repeat: Infinity, ease: "linear" } :
                { duration: 0.3 }
              }
            >
              <RefreshCw size={18} />
            </motion.div>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </motion.button>
        </motion.div>
      </div>

      {/* Stats Grid - Matching Dashboard Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <EnhancedStatCard
            key={stat.title}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            color={stat.color}
            delay={stat.delay}
            isDark={isDark}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl p-6 shadow-xl border ${isDark
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Donation Trends
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Daily donation amounts over time
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                }`}>
                Last {timeRange === '7d' ? '7' : '30'} days
              </div>
            </div>
          </div>
          <DonationTrendsChart
            data={analyticsData?.trends?.slice(timeRange === '7d' ? -7 : -30)}
            isDark={isDark}
            loading={loading}
          />
        </motion.div>

        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl p-6 shadow-xl border ${isDark
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Category Performance
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Distribution across donation categories
              </p>
            </div>
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <PieChart size={18} className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />
            </div>
          </div>
          <CategoryPerformanceChart
            data={analyticsData?.categoryPerformance}
            isDark={isDark}
            loading={loading}
          />
        </motion.div>

        {/* Donor Demographics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`rounded-2xl p-6 shadow-xl border ${isDark
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Donor Demographics
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Age distribution of donors
              </p>
            </div>
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Users size={18} className={isDark ? 'text-violet-400' : 'text-violet-600'} />
            </div>
          </div>
          <DonorDemographicsChart
            data={analyticsData?.donorDemographics}
            isDark={isDark}
            loading={loading}
          />
        </motion.div>

        {/* Top Donors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`rounded-2xl p-6 shadow-xl border ${isDark
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Top Donors
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Most generous supporters
              </p>
            </div>
            <div className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Activity size={18} className={isDark ? 'text-amber-400' : 'text-amber-600'} />
            </div>
          </div>
          <TopDonorsList
            data={analyticsData?.topDonors}
            isDark={isDark}
            loading={loading}
          />
        </motion.div>
      </div>

      {/* Export Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`rounded-2xl p-6 shadow-xl border ${isDark
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Export Analytics
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Download reports for further analysis
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={() => handleExport('PDF')}
              disabled={exporting}
              whileHover={!exporting ? { scale: 1.05 } : {}}
              whileTap={!exporting ? { scale: 0.95 } : {}}
              className={`px-6 py-3 rounded-xl border flex items-center gap-3 ${isDark
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } ${exporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Download size={18} />
              {exporting ? 'Exporting...' : 'PDF Report'}
            </motion.button>

            <motion.button
              onClick={() => handleExport('Excel')}
              disabled={exporting}
              whileHover={!exporting ? { scale: 1.05 } : {}}
              whileTap={!exporting ? { scale: 0.95 } : {}}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white flex items-center gap-3 shadow-lg"
            >
              <FileText size={18} />
              {exporting ? 'Exporting...' : 'Excel Data'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsPage;