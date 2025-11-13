import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Camera,
  Save,
  Upload,
  Download,
  Bell,
  Lock,
  UserCheck,
  Award,
  Clock,
  Edit,
  X,
  Trash2,
  Smartphone,
  Globe,
  CreditCard,
  Heart,
  Users,
  DollarSign,
  FileText,
  Settings,
} from 'lucide-react';

// Mock user data
const userData = {
  id: 'USR-001',
  name: 'Andrew',
  email: 'admin@donationtracker.com',
  phone: '+92-300-1234567',
  address: 'Lahore, Pakistan',
  role: 'SUPER_ADMIN',
  joinDate: '2023-01-15',
  lastLogin: '2025-11-05T10:30:00Z',
  avatar: null,
  bio: 'System administrator with full access to all features and settings.',
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    language: 'en',
    timezone: 'Asia/Karachi',
    dateFormat: 'DD/MM/YYYY',
    theme: 'auto',
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: '2025-09-15',
    loginAttempts: 0,
    trustedDevices: [
      { id: 'dev1', name: 'Windows Desktop', lastUsed: '2025-11-05T10:30:00Z', ip: '192.168.1.100' },
      { id: 'dev2', name: 'Android Phone', lastUsed: '2025-11-04T15:20:00Z', ip: '192.168.1.101' },
    ],
  },
  activity: {
    totalLogins: 1247,
    lastActivity: '2025-11-05T10:30:00Z',
    sessions: [
      { id: 'sess1', device: 'Windows Chrome', location: 'Lahore, PK', loginTime: '2025-11-05T10:30:00Z', active: true },
      { id: 'sess2', device: 'Android App', location: 'Karachi, PK', loginTime: '2025-11-04T15:20:00Z', active: false },
    ],
  },
};

// Profile Section Component
const ProfileSection = ({ title, icon: Icon, children, isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-2xl p-6 shadow-2xl border ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
    }`}
  >
    <div className="flex items-center gap-3 mb-6">
      <Icon size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
      <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
    </div>
    {children}
  </motion.div>
);

// Input Field Component
const ProfileInput = ({ label, type = 'text', value, onChange, placeholder, helpText, disabled = false, isDark, icon: Icon }) => (
  <div className="space-y-2">
    <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon size={18} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
      )}
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
          isDark 
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
        } ${Icon ? 'pl-10' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
    {helpText && (
      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {helpText}
      </p>
    )}
  </div>
);

// Avatar Upload Component
const AvatarUpload = ({ user, onAvatarChange, isDark }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, you would upload the file and get a URL
      const reader = new FileReader();
      reader.onload = (e) => {
        onAvatarChange(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange({ target: { files: [file] } });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`relative w-32 h-32 rounded-full border-4 ${
          isDragging 
            ? 'border-blue-500 bg-blue-500/10' 
            : isDark 
              ? 'border-gray-600 bg-gray-700' 
              : 'border-gray-300 bg-gray-100'
        } transition-all duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User size={48} className="text-white" />
          </div>
        )}
        
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors border-2 border-white"
        >
          <Camera size={16} className="text-white" />
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="text-center">
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Click camera icon or drag & drop to upload
        </p>
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          JPG, PNG, GIF • Max 5MB
        </p>
      </div>
    </div>
  );
};

// Security Settings Component
const SecuritySettings = ({ user, onSecurityChange, isDark }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEnable2FA = () => {
    onSecurityChange({ ...user.security, twoFactorEnabled: true });
  };

  const handleDisable2FA = () => {
    onSecurityChange({ ...user.security, twoFactorEnabled: false });
  };

  const handleRevokeDevice = (deviceId) => {
    const updatedDevices = user.security.trustedDevices.filter(device => device.id !== deviceId);
    onSecurityChange({ ...user.security, trustedDevices: updatedDevices });
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <div className={`p-4 rounded-lg border ${
        isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Two-Factor Authentication
            </h4>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Add an extra layer of security to your account
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user.security.twoFactorEnabled ? (
              <>
                <CheckCircle size={20} className="text-green-500" />
                <span className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  Enabled
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDisable2FA}
                  className="px-3 py-1 text-sm bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                >
                  Disable
                </motion.button>
              </>
            ) : (
              <>
                <XCircle size={20} className="text-rose-500" />
                <span className={`text-sm font-medium ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
                  Disabled
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEnable2FA}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Enable
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div className="space-y-4">
        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Change Password
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className={`w-full p-3 pr-10 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 ${
                isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!newPassword || newPassword !== confirmPassword}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Update Password
        </motion.button>
      </div>

      {/* Trusted Devices */}
      <div>
        <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Trusted Devices
        </h4>
        <div className="space-y-3">
          {user.security.trustedDevices.map((device) => (
            <div
              key={device.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Smartphone size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {device.name}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {device.ip} • Last used: {new Date(device.lastUsed).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleRevokeDevice(device.id)}
                className="p-2 text-rose-500 hover:text-rose-600 rounded-lg hover:bg-rose-500/10"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Activity Stats Component
const ActivityStats = ({ user, isDark }) => {
  const stats = [
    {
      label: 'Total Logins',
      value: user.activity.totalLogins,
      icon: UserCheck,
      color: 'text-blue-500',
    },
    {
      label: 'Active Sessions',
      value: user.activity.sessions.filter(s => s.active).length,
      icon: Shield,
      color: 'text-green-500',
    },
    {
      label: 'Trusted Devices',
      value: user.security.trustedDevices.length,
      icon: Smartphone,
      color: 'text-purple-500',
    },
    {
      label: 'Account Age',
      value: Math.floor((new Date() - new Date(user.joinDate)) / (1000 * 60 * 60 * 24)) + ' days',
      icon: Calendar,
      color: 'text-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`p-4 rounded-xl border text-center ${
            isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <stat.icon size={24} className={`mx-auto mb-2 ${stat.color}`} />
          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {stat.value}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

// Main Profile Management Component
const ProfileManagement = ({ isDark }) => {
  const [user, setUser] = useState(userData);
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleUserUpdate = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSecurityUpdate = (security) => {
    setUser(prev => ({ ...prev, security }));
    setHasChanges(true);
  };

  const handlePreferencesUpdate = (preferences) => {
    setUser(prev => ({ ...prev, preferences }));
    setHasChanges(true);
  };

  const handleSaveProfile = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setHasChanges(false);
    setIsEditing(false);
    console.log('Profile saved:', user);
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(user, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profile-data-${user.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'activity', name: 'Activity', icon: Clock },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <AvatarUpload 
                user={user} 
                onAvatarChange={(avatar) => handleUserUpdate('avatar', avatar)}
                isDark={isDark}
              />
            </div>
            
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileInput
                  label="Full Name"
                  value={user.name}
                  onChange={(value) => handleUserUpdate('name', value)}
                  placeholder="Enter your full name"
                  isDark={isDark}
                  icon={User}
                />
                <ProfileInput
                  label="Email"
                  type="email"
                  value={user.email}
                  onChange={(value) => handleUserUpdate('email', value)}
                  placeholder="Enter your email"
                  isDark={isDark}
                  icon={Mail}
                />
                <ProfileInput
                  label="Phone"
                  type="tel"
                  value={user.phone}
                  onChange={(value) => handleUserUpdate('phone', value)}
                  placeholder="Enter your phone number"
                  isDark={isDark}
                  icon={Phone}
                />
                <ProfileInput
                  label="Address"
                  value={user.address}
                  onChange={(value) => handleUserUpdate('address', value)}
                  placeholder="Enter your address"
                  isDark={isDark}
                  icon={MapPin}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Bio
                </label>
                <textarea
                  value={user.bio}
                  onChange={(e) => handleUserUpdate('bio', e.target.value)}
                  rows={4}
                  className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <SecuritySettings 
            user={user} 
            onSecurityChange={handleSecurityUpdate}
            isDark={isDark}
          />
        );

      case 'preferences':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Notification Preferences
              </h4>
              
              <div className="space-y-3">
                <label className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={user.preferences.emailNotifications}
                    onChange={(e) => handlePreferencesUpdate({
                      ...user.preferences,
                      emailNotifications: e.target.checked
                    })}
                    className="w-4 h-4 rounded border focus:ring-2 focus:ring-blue-500"
                  />
                  <Mail size={16} />
                  <span>Email Notifications</span>
                </label>
                
                <label className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={user.preferences.smsNotifications}
                    onChange={(e) => handlePreferencesUpdate({
                      ...user.preferences,
                      smsNotifications: e.target.checked
                    })}
                    className="w-4 h-4 rounded border focus:ring-2 focus:ring-blue-500"
                  />
                  <Bell size={16} />
                  <span>SMS Notifications</span>
                </label>
                
                <label className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={user.preferences.pushNotifications}
                    onChange={(e) => handlePreferencesUpdate({
                      ...user.preferences,
                      pushNotifications: e.target.checked
                    })}
                    className="w-4 h-4 rounded border focus:ring-2 focus:ring-blue-500"
                  />
                  <Smartphone size={16} />
                  <span>Push Notifications</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Display Preferences
              </h4>
              
              <ProfileInput
                label="Language"
                value={user.preferences.language}
                onChange={(value) => handlePreferencesUpdate({
                  ...user.preferences,
                  language: value
                })}
                isDark={isDark}
                icon={Globe}
              />
              
              <ProfileInput
                label="Timezone"
                value={user.preferences.timezone}
                onChange={(value) => handlePreferencesUpdate({
                  ...user.preferences,
                  timezone: value
                })}
                isDark={isDark}
                icon={Clock}
              />
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Theme
                </label>
                <select
                  value={user.preferences.theme}
                  onChange={(e) => handlePreferencesUpdate({
                    ...user.preferences,
                    theme: e.target.value
                  })}
                  className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6">
            <ActivityStats user={user} isDark={isDark} />
            
            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Recent Sessions
              </h4>
              <div className="space-y-3">
                {user.activity.sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        session.active ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {session.device}
                        </p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {session.location} • {new Date(session.loginTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {session.active && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'
                      }`}>
                        Active
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 shadow-2xl border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
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
            <div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user.name}
              </h2>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {user.role} • Joined {new Date(user.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportData}
              className={`px-4 py-2 rounded-lg border font-medium ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Download size={16} className="inline mr-2" />
              Export Data
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg border font-medium ${
                isEditing
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : isDark
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Edit size={16} className="inline mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </motion.button>

            {hasChanges && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2"
              >
                <Save size={16} />
                Save Changes
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl p-6 shadow-2xl border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : isDark
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tab.icon size={18} />
              {tab.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <ProfileSection
        title={tabs.find(tab => tab.id === activeTab)?.name || 'Profile'}
        icon={tabs.find(tab => tab.id === activeTab)?.icon || User}
        isDark={isDark}
      >
        {renderTabContent()}
      </ProfileSection>

      {/* Account Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-2xl p-6 shadow-2xl border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Award size={32} className="mx-auto mb-2 text-amber-500" />
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Account Status
            </h4>
            <p className={isDark ? 'text-green-400' : 'text-green-600'}>
              Verified & Active
            </p>
          </div>
          
          <div className="text-center">
            <Shield size={32} className="mx-auto mb-2 text-green-500" />
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Security Level
            </h4>
            <p className={isDark ? 'text-blue-400' : 'text-blue-600'}>
              {user.security.twoFactorEnabled ? 'Enhanced' : 'Standard'}
            </p>
          </div>
          
          <div className="text-center">
            <Clock size={32} className="mx-auto mb-2 text-purple-500" />
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Last Activity
            </h4>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {new Date(user.activity.lastActivity).toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileManagement;