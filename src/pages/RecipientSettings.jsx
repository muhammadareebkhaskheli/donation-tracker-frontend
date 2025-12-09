import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Key,
  Eye,
  EyeOff,
  Camera,
  Save,
  Upload,
  Clock,
  Heart,
  CheckCircle,
  XCircle,
  Trash2,
  Smartphone,
  Award,
  Calendar,
  UserCheck,
  Bell,
  Globe,
  X,
  CheckCircle2,
} from 'lucide-react';

// Mock recipient data
const recipientData = {
  id: 'REC-001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+92-300-9876543',
  address: '123 Main Street, Lahore, Pakistan',
  role: 'RECIPIENT',
  joinDate: '2024-01-15',
  lastLogin: '2025-11-05T08:45:00Z',
  avatar: null,
  bio: 'I need financial assistance for my daughter\'s medical treatment. She has been diagnosed with a rare condition and requires specialized care.',
  
  verificationStatus: 'pending',
  
  donations: [
    { id: 'don1', donorName: 'Anonymous', amount: 10000, date: '2024-01-20', message: 'Get well soon!' },
    { id: 'don2', donorName: 'Sarah Ahmed', amount: 5000, date: '2024-01-18', message: 'Hope this helps' },
    { id: 'don3', donorName: 'Community Fund', amount: 10000, date: '2024-01-15', message: 'Community Support' },
  ],
  
  preferences: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    language: 'en',
    theme: 'auto',
    showContactInfo: true,
  },
  
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: '2024-01-10',
    loginAttempts: 0,
    trustedDevices: [
      { id: 'dev1', name: 'Android Phone', lastUsed: '2025-11-05T08:45:00Z', ip: '192.168.1.150' },
    ],
  },
  
  activity: {
    totalLogins: 45,
    lastActivity: '2025-11-05T08:45:00Z',
    profileViews: 128,
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
          <div className="w-full h-full rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
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
  const [passwordError, setPasswordError] = useState('');

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

  const handlePasswordUpdate = () => {
    if (!newPassword || !confirmPassword) {
      setPasswordError('Please fill in both password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    setPasswordError('');
    return true;
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

        {passwordError && (
          <p className="text-rose-500 text-sm">{passwordError}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePasswordUpdate}
          disabled={!newPassword || !confirmPassword}
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
      label: 'Profile Views',
      value: user.activity.profileViews,
      icon: Eye,
      color: 'text-green-500',
    },
    {
      label: 'Donations Received',
      value: user.donations.length,
      icon: Heart,
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

// Success Dialog Component (similar to MyRequests)
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
              <CheckCircle2 size={48} className="text-emerald-600" />
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

// Main RecipientSettings Component
const RecipientSettings = ({ isDark }) => {
  const [user, setUser] = useState(recipientData);
  const [originalUser, setOriginalUser] = useState(recipientData); // Store original data
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Store original data when component mounts
    setOriginalUser(JSON.parse(JSON.stringify(recipientData)));
  }, []);

  const handleUserUpdate = (field, value) => {
    // Only update local state, no auto-save
    setUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityUpdate = (security) => {
    // Only update local state, no auto-save
    setUser(prev => ({ ...prev, security }));
  };

  const handlePreferencesUpdate = (preferences) => {
    // Only update local state, no auto-save
    setUser(prev => ({ ...prev, preferences }));
  };

  const handleManualSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Profile saved:', user);
    
    // Update original user data
    setOriginalUser(JSON.parse(JSON.stringify(user)));
    
    setIsSaving(false);
    setSuccessMessage('Profile updated successfully!');
    setShowSuccessDialog(true);
  };

  const hasChanges = () => {
    return JSON.stringify(user) !== JSON.stringify(originalUser);
  };

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: Globe },
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
                  Your Story & Needs
                </label>
                <textarea
                  value={user.bio}
                  onChange={(e) => handleUserUpdate('bio', e.target.value)}
                  rows={6}
                  className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Share your story and explain why you need help..."
                />
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  This information will be visible to potential donors
                </p>
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
                  <Phone size={16} />
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
                  <Bell size={16} />
                  <span>Push Notifications</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Profile Preferences
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
              
              <label className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <input
                  type="checkbox"
                  checked={user.preferences.showContactInfo}
                  onChange={(e) => handlePreferencesUpdate({
                    ...user.preferences,
                    showContactInfo: e.target.checked
                  })}
                  className="w-4 h-4 rounded border focus:ring-2 focus:ring-blue-500"
                />
                <User size={16} />
                <span>Show Contact Information to Donors</span>
              </label>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6">
            <ActivityStats user={user} isDark={isDark} />
            
            <div>
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Account Activity
              </h4>
              <div className={`p-4 rounded-lg border ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Last Login</span>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {new Date(user.lastLogin).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Last Password Change</span>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {new Date(user.security.lastPasswordChange).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Account Created</span>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {new Date(user.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 shadow-2xl border ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
              : 'bg-gradient-to-br from-white to-gray-50 border-gray-100'
          }`}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
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
                <div className="flex items-center gap-3 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.verificationStatus === 'approved' 
                      ? (isDark ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700')
                      : user.verificationStatus === 'pending'
                      ? (isDark ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-700')
                      : (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')
                  }`}>
                    {user.verificationStatus.charAt(0).toUpperCase() + user.verificationStatus.slice(1)}
                  </span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {user.role} • Joined {new Date(user.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex flex-col items-end gap-3">
              {hasChanges() && (
                <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                }`}>
                  <span>You have unsaved changes</span>
                </div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleManualSave}
                disabled={isSaving || !hasChanges()}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  isSaving || !hasChanges()
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save All Changes'}
              </motion.button>
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
          title={tabs.find(tab => tab.id === activeTab)?.name || 'Settings'}
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
                Verification Status
              </h4>
              <p className={`font-medium ${
                user.verificationStatus === 'approved' 
                  ? (isDark ? 'text-green-400' : 'text-green-600')
                  : user.verificationStatus === 'pending'
                  ? (isDark ? 'text-amber-400' : 'text-amber-600')
                  : (isDark ? 'text-gray-400' : 'text-gray-600')
              }`}>
                {user.verificationStatus.charAt(0).toUpperCase() + user.verificationStatus.slice(1)}
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
              <Heart size={32} className="mx-auto mb-2 text-purple-500" />
              <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Donations Received
              </h4>
              <p className={`text-lg font-bold ${
                isDark ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {user.donations.length} donations
              </p>
            </div>
          </div>
        </motion.div>
      </div>

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

export default RecipientSettings;