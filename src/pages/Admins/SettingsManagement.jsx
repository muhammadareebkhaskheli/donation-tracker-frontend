import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  RefreshCw,
  Download,
  Upload,
  Shield,
  Bell,
  DollarSign,
  Users,
  Mail,
  MessageCircle,
  Globe,
  Database,
  Server,
  Key,
  UserCheck,
  FileText,
  Clock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Copy,
  RotateCcw,
  TestTube,
  Cpu,
  Network,
  HardDrive,
  MemoryStick,
  Settings as SettingsIcon,
  Smartphone,
  Cloud,
  Lock,
  UserPlus,
  SmartphoneIcon,
  AlertCircle,
  ServerIcon,
  CloudDownload,
  Wifi,
  WifiOff,
} from 'lucide-react';

// Complete Settings Data Structure
const initialSettings = {
  // General Settings
  general: {
    appName: 'Donation Tracker',
    appVersion: '2.1.0',
    supportEmail: 'support@donationtracker.com',
    supportPhone: '+92-300-1234567',
    timezone: 'Asia/Karachi',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    language: 'en',
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    maintenanceMode: false,
    enableRegistration: true,
    enableGuestDonations: false,
    defaultUserRole: 'donor',
  },

  // Donation Settings
  donations: {
    maxDonationAmount: 1000000,
    minDonationAmount: 100,
    currency: 'PKR',
    currencySymbol: '₨',
    allowPartialDonations: true,
    allowRecurringDonations: true,
    defaultRecurringInterval: 'monthly',
    donationCategories: ['Medical', 'Education', 'Emergency', 'Food', 'Housing'],
    autoApproveDonations: false,
    receiptAutoSend: true,
    taxDeductibleEnabled: true,
    allowAnonymousDonations: true,
    donationFeePercentage: 2.5,
    enableDonationGoals: true,
    enableDonorComments: true,
  },

  // Security Settings
  security: {
    require2FA: false,
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    passwordExpiryDays: 90,
    ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
    sessionInactivityTimeout: 15,
    enableAuditLog: true,
    encryptSensitiveData: true,
    bruteForceProtection: true,
    enableCaptcha: true,
    allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
    maxFileSize: 10,
    enableIPBlocking: true,
    failedAttemptsBlock: 10,
    blockDuration: 30,
  },

  // Notification Settings
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    donorWelcomeEmail: true,
    recipientApprovalEmail: true,
    donationReceivedEmail: true,
    lowBalanceAlert: true,
    systemMaintenanceAlerts: true,
    adminDigestFrequency: 'weekly',
    autoDeleteReadNotifications: false,
    notificationRetentionDays: 30,
    enableBrowserNotifications: true,
    notificationSound: true,
    emailDigest: true,
    smsDigest: false,
    pushDigest: true,
  },

  // Approval Workflow Settings
  approvals: {
    enableCoApprovers: true,
    minApproversRequired: 2,
    maxApproversAllowed: 5,
    autoAssignApprovers: true,
    approvalTimeoutDays: 7,
    enableEscalation: true,
    escalationTimeHours: 48,
    allowForwarding: true,
    enableAutoApproval: false,
    autoApprovalAmount: 50000,
    requireDocumentVerification: true,
    enableQuickApprove: true,
    approvalStages: [
      { stage: 1, role: 'support_user', required: true },
      { stage: 2, role: 'co_approver', required: true },
      { stage: 3, role: 'approver', required: true },
    ],
  },

  // Email Settings
  email: {
    smtpHost: 'smtp.donationtracker.com',
    smtpPort: 587,
    smtpUsername: 'noreply@donationtracker.com',
    smtpPassword: '',
    smtpUseSSL: true,
    fromName: 'Donation Tracker',
    fromEmail: 'noreply@donationtracker.com',
    replyToEmail: 'support@donationtracker.com',
    enableEmailTracking: true,
    emailTemplates: {
      donorWelcome: true,
      donationReceipt: true,
      recipientApproval: true,
      passwordReset: true,
      accountVerification: true,
    },
  },

  // SMS Settings
  sms: {
    provider: 'twilio',
    twilioAccountSID: '',
    twilioAuthToken: '',
    twilioPhoneNumber: '',
    enableSMS: true,
    smsSenderId: 'DONATION',
    smsTemplates: {
      otpVerification: true,
      donationConfirmation: true,
      approvalNotification: true,
      emergencyAlert: true,
    },
    smsCharacterLimit: 160,
    enableUnicodeSMS: true,
  },

  // Mobile App Settings
  mobileApp: {
    enableMobileApp: true,
    appStoreLink: 'https://apps.apple.com/app/donation-tracker',
    playStoreLink: 'https://play.google.com/store/apps/details?id=com.donationtracker',
    latestVersion: '2.1.0',
    minSupportedVersion: '1.5.0',
    forceUpdate: false,
    enablePushNotifications: true,
    enableBiometricAuth: true,
    enableOfflineMode: true,
    cacheDuration: 24,
    enableLocationServices: false,
    enableCameraUpload: true,
    maxImageSize: 5,
    enableMobilePayments: true,
    enableDarkMode: true,
  },

  // API Settings
  api: {
    enableAPI: true,
    apiRateLimit: 1000,
    apiKeyExpiryDays: 365,
    enableSwagger: true,
    corsOrigins: ['https://donationtracker.com', 'https://admin.donationtracker.com'],
    webhookUrl: '',
    webhookSecret: '',
    enableMobileAPI: true,
    mobileApiRateLimit: 500,
    enableThirdPartyIntegrations: true,
    apiVersion: 'v1',
    enableApiDocumentation: true,
  },

  // Backup Settings
  backup: {
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    backupRetentionDays: 30,
    backupLocation: 'local',
    cloudStorageProvider: 'aws',
    encryptBackups: true,
    backupNotifications: true,
    enableCloudSync: false,
    backupCompression: true,
    includeMediaInBackup: true,
    backupVerification: true,
  },
};

// All Settings Sections
const settingsSections = [
  {
    id: 'general',
    name: 'General Settings',
    icon: SettingsIcon,
    description: 'Basic application configuration and preferences',
  },
  {
    id: 'donations',
    name: 'Donation Settings',
    icon: DollarSign,
    description: 'Configure donation-related preferences and limits',
  },
  {
    id: 'security',
    name: 'Security Settings',
    icon: Shield,
    description: 'Security policies and authentication settings',
  },
  {
    id: 'notifications',
    name: 'Notification Settings',
    icon: Bell,
    description: 'Manage notification preferences and templates',
  },
  {
    id: 'approvals',
    name: 'Approval Workflow',
    icon: UserCheck,
    description: 'Configure approval processes and workflows',
  },
  {
    id: 'email',
    name: 'Email Settings',
    icon: Mail,
    description: 'SMTP configuration and email templates',
  },
  {
    id: 'sms',
    name: 'SMS Settings',
    icon: MessageCircle,
    description: 'SMS provider configuration and templates',
  },
  {
    id: 'mobileApp',
    name: 'Mobile App Settings',
    icon: SmartphoneIcon,
    description: 'Mobile application configuration and features',
  },
  {
    id: 'api',
    name: 'API Settings',
    icon: Globe,
    description: 'API configuration and access controls',
  },
  {
    id: 'backup',
    name: 'Backup Settings',
    icon: Database,
    description: 'Data backup and recovery configuration',
  },
];

// System Status Data
const systemStatus = {
  cpu: {
    usage: 45,
    cores: 8,
    temperature: 65,
  },
  memory: {
    usage: 68,
    total: 16,
    used: 10.9,
  },
  storage: {
    usage: 72,
    total: 500,
    used: 360,
  },
  network: {
    incoming: 1250,
    outgoing: 890,
  },
  database: {
    connections: 24,
    size: 2.4,
    queries: 1560,
  },
};

// Fixed SettingInput Component
const SettingInput = ({ label, type = 'text', value, onChange, placeholder, helpText, disabled = false, isDark, options = [] }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={4}
            className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        );
      
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={disabled}
            className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleInputChange(e.target.checked)}
              disabled={disabled}
              className={`w-4 h-4 rounded border focus:ring-2 focus:ring-blue-500 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-blue-500' 
                  : 'bg-white border-gray-300 text-blue-600'
              }`}
            />
          </div>
        );
      
      case 'password':
        return (
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={value || ''}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className={`w-full p-3 pr-10 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value || 0}
            onChange={(e) => handleInputChange(parseFloat(e.target.value))}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        );
      
      default:
        return (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      {renderInput()}
      {helpText && (
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {helpText}
        </p>
      )}
    </div>
  );
};

// System Status Card Component
const SystemStatusCard = ({ title, value, maxValue, unit, icon: Icon, color, isDark, details }) => {
  const percentage = (value / maxValue) * 100;
  
  const getStatusColor = (percent) => {
    if (percent < 60) return 'text-emerald-500';
    if (percent < 80) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`rounded-xl p-4 shadow-lg border ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={20} className={color} />
          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {title}
          </span>
        </div>
        <span className={`text-lg font-bold ${getStatusColor(percentage)}`}>
          {percentage.toFixed(0)}%
        </span>
      </div>
      
      <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, type: "spring" }}
          className={`h-2 rounded-full ${
            percentage < 60 ? 'bg-emerald-500' : 
            percentage < 80 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
        />
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {value} {unit} / {maxValue} {unit}
        </span>
        {details && (
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {details}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// Complete SettingsSection Component with ALL sections
const SettingsSection = ({ section, settings, onSettingsChange, isDark }) => {
  const sectionSettings = settings[section.id];

  const handleSettingChange = (key, value) => {
    const updatedSettings = { ...sectionSettings, [key]: value };
    onSettingsChange(section.id, updatedSettings);
  };

  const addApprovalStage = () => {
    const newStage = {
      stage: sectionSettings.approvalStages.length + 1,
      role: 'support_user',
      required: true
    };
    const updatedStages = [...sectionSettings.approvalStages, newStage];
    handleSettingChange('approvalStages', updatedStages);
  };

  const removeApprovalStage = (index) => {
    const updatedStages = sectionSettings.approvalStages.filter((_, i) => i !== index);
    handleSettingChange('approvalStages', updatedStages);
  };

  const updateApprovalStage = (index, field, value) => {
    const updatedStages = [...sectionSettings.approvalStages];
    updatedStages[index] = { ...updatedStages[index], [field]: value };
    handleSettingChange('approvalStages', updatedStages);
  };

  const renderSectionContent = () => {
    switch (section.id) {
      case 'general':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingInput
              label="Application Name"
              type="text"
              value={sectionSettings.appName}
              onChange={(value) => handleSettingChange('appName', value)}
              helpText="The name displayed throughout the application"
              isDark={isDark}
            />
            <SettingInput
              label="Support Email"
              type="email"
              value={sectionSettings.supportEmail}
              onChange={(value) => handleSettingChange('supportEmail', value)}
              helpText="Email address for user support inquiries"
              isDark={isDark}
            />
            <SettingInput
              label="Support Phone"
              type="text"
              value={sectionSettings.supportPhone}
              onChange={(value) => handleSettingChange('supportPhone', value)}
              helpText="Phone number for user support"
              isDark={isDark}
            />
            <SettingInput
              label="Timezone"
              type="select"
              value={sectionSettings.timezone}
              onChange={(value) => handleSettingChange('timezone', value)}
              options={[
                { value: 'Asia/Karachi', label: 'Pakistan Standard Time' },
                { value: 'UTC', label: 'UTC' },
                { value: 'America/New_York', label: 'Eastern Time' },
              ]}
              isDark={isDark}
            />
            <SettingInput
              label="Date Format"
              type="select"
              value={sectionSettings.dateFormat}
              onChange={(value) => handleSettingChange('dateFormat', value)}
              options={[
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
              ]}
              isDark={isDark}
            />
            <SettingInput
              label="Enable User Registration"
              type="checkbox"
              value={sectionSettings.enableRegistration}
              onChange={(value) => handleSettingChange('enableRegistration', value)}
              helpText="Allow new users to register accounts"
              isDark={isDark}
            />
            <SettingInput
              label="Max Login Attempts"
              type="number"
              value={sectionSettings.maxLoginAttempts}
              onChange={(value) => handleSettingChange('maxLoginAttempts', value)}
              helpText="Maximum allowed failed login attempts before lockout"
              isDark={isDark}
            />
            <SettingInput
              label="Session Timeout (minutes)"
              type="number"
              value={sectionSettings.sessionTimeout}
              onChange={(value) => handleSettingChange('sessionTimeout', value)}
              helpText="User session timeout in minutes"
              isDark={isDark}
            />
            <SettingInput
              label="Maintenance Mode"
              type="checkbox"
              value={sectionSettings.maintenanceMode}
              onChange={(value) => handleSettingChange('maintenanceMode', value)}
              helpText="Enable to put the application in maintenance mode"
              isDark={isDark}
            />
          </div>
        );

      case 'donations':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingInput
              label="Maximum Donation Amount (₨)"
              type="number"
              value={sectionSettings.maxDonationAmount}
              onChange={(value) => handleSettingChange('maxDonationAmount', value)}
              helpText="Maximum allowed donation amount to avoid regulatory issues"
              isDark={isDark}
            />
            <SettingInput
              label="Minimum Donation Amount (₨)"
              type="number"
              value={sectionSettings.minDonationAmount}
              onChange={(value) => handleSettingChange('minDonationAmount', value)}
              helpText="Minimum allowed donation amount"
              isDark={isDark}
            />
            <SettingInput
              label="Allow Partial Donations"
              type="checkbox"
              value={sectionSettings.allowPartialDonations}
              onChange={(value) => handleSettingChange('allowPartialDonations', value)}
              helpText="Allow donors to contribute partial amounts to recipients"
              isDark={isDark}
            />
            <SettingInput
              label="Allow Recurring Donations"
              type="checkbox"
              value={sectionSettings.allowRecurringDonations}
              onChange={(value) => handleSettingChange('allowRecurringDonations', value)}
              helpText="Enable recurring donation functionality"
              isDark={isDark}
            />
            <SettingInput
              label="Auto Approve Donations"
              type="checkbox"
              value={sectionSettings.autoApproveDonations}
              onChange={(value) => handleSettingChange('autoApproveDonations', value)}
              helpText="Automatically approve donations without manual review"
              isDark={isDark}
            />
            <SettingInput
              label="Auto Send Receipts"
              type="checkbox"
              value={sectionSettings.receiptAutoSend}
              onChange={(value) => handleSettingChange('receiptAutoSend', value)}
              helpText="Automatically send receipts to donors after donation"
              isDark={isDark}
            />
            <SettingInput
              label="Allow Anonymous Donations"
              type="checkbox"
              value={sectionSettings.allowAnonymousDonations}
              onChange={(value) => handleSettingChange('allowAnonymousDonations', value)}
              helpText="Allow donors to donate without revealing their identity"
              isDark={isDark}
            />
            <SettingInput
              label="Donation Fee Percentage"
              type="number"
              value={sectionSettings.donationFeePercentage}
              onChange={(value) => handleSettingChange('donationFeePercentage', value)}
              helpText="Platform fee percentage applied to donations"
              isDark={isDark}
              step="0.1"
            />
          </div>
        );

      case 'security':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingInput
              label="Require Two-Factor Authentication"
              type="checkbox"
              value={sectionSettings.require2FA}
              onChange={(value) => handleSettingChange('require2FA', value)}
              helpText="Enable 2FA for all admin users"
              isDark={isDark}
            />
            <SettingInput
              label="Minimum Password Length"
              type="number"
              value={sectionSettings.passwordMinLength}
              onChange={(value) => handleSettingChange('passwordMinLength', value)}
              helpText="Minimum characters required for passwords"
              isDark={isDark}
            />
            <SettingInput
              label="Require Uppercase Letters"
              type="checkbox"
              value={sectionSettings.passwordRequireUppercase}
              onChange={(value) => handleSettingChange('passwordRequireUppercase', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Require Lowercase Letters"
              type="checkbox"
              value={sectionSettings.passwordRequireLowercase}
              onChange={(value) => handleSettingChange('passwordRequireLowercase', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Require Numbers"
              type="checkbox"
              value={sectionSettings.passwordRequireNumbers}
              onChange={(value) => handleSettingChange('passwordRequireNumbers', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Require Special Characters"
              type="checkbox"
              value={sectionSettings.passwordRequireSpecialChars}
              onChange={(value) => handleSettingChange('passwordRequireSpecialChars', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Password Expiry (Days)"
              type="number"
              value={sectionSettings.passwordExpiryDays}
              onChange={(value) => handleSettingChange('passwordExpiryDays', value)}
              helpText="Number of days before passwords expire"
              isDark={isDark}
            />
            <SettingInput
              label="Session Inactivity Timeout (minutes)"
              type="number"
              value={sectionSettings.sessionInactivityTimeout}
              onChange={(value) => handleSettingChange('sessionInactivityTimeout', value)}
              helpText="Auto logout after period of inactivity"
              isDark={isDark}
            />
            <SettingInput
              label="Enable CAPTCHA"
              type="checkbox"
              value={sectionSettings.enableCaptcha}
              onChange={(value) => handleSettingChange('enableCaptcha', value)}
              helpText="Enable CAPTCHA for login and registration"
              isDark={isDark}
            />
            <SettingInput
              label="Max File Size (MB)"
              type="number"
              value={sectionSettings.maxFileSize}
              onChange={(value) => handleSettingChange('maxFileSize', value)}
              helpText="Maximum file size for uploads"
              isDark={isDark}
            />
          </div>
        );

      case 'notifications':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingInput
              label="Enable Email Notifications"
              type="checkbox"
              value={sectionSettings.emailNotifications}
              onChange={(value) => handleSettingChange('emailNotifications', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Enable SMS Notifications"
              type="checkbox"
              value={sectionSettings.smsNotifications}
              onChange={(value) => handleSettingChange('smsNotifications', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Enable Push Notifications"
              type="checkbox"
              value={sectionSettings.pushNotifications}
              onChange={(value) => handleSettingChange('pushNotifications', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Send Donor Welcome Email"
              type="checkbox"
              value={sectionSettings.donorWelcomeEmail}
              onChange={(value) => handleSettingChange('donorWelcomeEmail', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Send Recipient Approval Email"
              type="checkbox"
              value={sectionSettings.recipientApprovalEmail}
              onChange={(value) => handleSettingChange('recipientApprovalEmail', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Send Donation Received Email"
              type="checkbox"
              value={sectionSettings.donationReceivedEmail}
              onChange={(value) => handleSettingChange('donationReceivedEmail', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Low Balance Alerts"
              type="checkbox"
              value={sectionSettings.lowBalanceAlert}
              onChange={(value) => handleSettingChange('lowBalanceAlert', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Admin Digest Frequency"
              type="select"
              value={sectionSettings.adminDigestFrequency}
              onChange={(value) => handleSettingChange('adminDigestFrequency', value)}
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
              ]}
              isDark={isDark}
            />
            <SettingInput
              label="Notification Retention Days"
              type="number"
              value={sectionSettings.notificationRetentionDays}
              onChange={(value) => handleSettingChange('notificationRetentionDays', value)}
              helpText="Number of days to keep notifications"
              isDark={isDark}
            />
          </div>
        );

      case 'approvals':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SettingInput
                label="Enable Co-Approvers"
                type="checkbox"
                value={sectionSettings.enableCoApprovers}
                onChange={(value) => handleSettingChange('enableCoApprovers', value)}
                helpText="Enable the co-approver system for requests"
                isDark={isDark}
              />
              <SettingInput
                label="Minimum Approvers Required"
                type="number"
                value={sectionSettings.minApproversRequired}
                onChange={(value) => handleSettingChange('minApproversRequired', value)}
                helpText="Minimum number of approvers needed to approve a request"
                isDark={isDark}
              />
              <SettingInput
                label="Maximum Approvers Allowed"
                type="number"
                value={sectionSettings.maxApproversAllowed}
                onChange={(value) => handleSettingChange('maxApproversAllowed', value)}
                helpText="Maximum number of approvers that can be assigned"
                isDark={isDark}
              />
              <SettingInput
                label="Auto Assign Approvers"
                type="checkbox"
                value={sectionSettings.autoAssignApprovers}
                onChange={(value) => handleSettingChange('autoAssignApprovers', value)}
                helpText="Automatically assign approvers to new requests"
                isDark={isDark}
              />
              <SettingInput
                label="Approval Timeout (Days)"
                type="number"
                value={sectionSettings.approvalTimeoutDays}
                onChange={(value) => handleSettingChange('approvalTimeoutDays', value)}
                helpText="Number of days before approval request times out"
                isDark={isDark}
              />
              <SettingInput
                label="Enable Escalation"
                type="checkbox"
                value={sectionSettings.enableEscalation}
                onChange={(value) => handleSettingChange('enableEscalation', value)}
                helpText="Enable automatic escalation of stuck approvals"
                isDark={isDark}
              />
              <SettingInput
                label="Enable Auto Approval"
                type="checkbox"
                value={sectionSettings.enableAutoApproval}
                onChange={(value) => handleSettingChange('enableAutoApproval', value)}
                helpText="Automatically approve requests below threshold"
                isDark={isDark}
              />
              <SettingInput
                label="Auto Approval Amount (₨)"
                type="number"
                value={sectionSettings.autoApprovalAmount}
                onChange={(value) => handleSettingChange('autoApprovalAmount', value)}
                helpText="Amount threshold for auto approval"
                isDark={isDark}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Approval Stages
                </h4>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addApprovalStage}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm"
                >
                  <Plus size={16} />
                  Add Stage
                </motion.button>
              </div>
              <div className="space-y-3">
                {sectionSettings.approvalStages.map((stage, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Stage {stage.stage}
                      </span>
                      {sectionSettings.approvalStages.length > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeApprovalStage(index)}
                          className="p-1 text-rose-500 hover:text-rose-600"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <SettingInput
                        label="Stage Number"
                        type="number"
                        value={stage.stage}
                        onChange={(value) => updateApprovalStage(index, 'stage', parseInt(value))}
                        isDark={isDark}
                      />
                      <SettingInput
                        label="Role"
                        type="select"
                        value={stage.role}
                        onChange={(value) => updateApprovalStage(index, 'role', value)}
                        options={[
                          { value: 'support_user', label: 'Support User' },
                          { value: 'co_approver', label: 'Co-Approver' },
                          { value: 'approver', label: 'Approver' },
                          { value: 'admin', label: 'Admin' },
                        ]}
                        isDark={isDark}
                      />
                      <SettingInput
                        label="Required"
                        type="checkbox"
                        value={stage.required}
                        onChange={(value) => updateApprovalStage(index, 'required', value)}
                        isDark={isDark}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'email':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingInput
              label="SMTP Host"
              type="text"
              value={sectionSettings.smtpHost}
              onChange={(value) => handleSettingChange('smtpHost', value)}
              isDark={isDark}
            />
            <SettingInput
              label="SMTP Port"
              type="number"
              value={sectionSettings.smtpPort}
              onChange={(value) => handleSettingChange('smtpPort', value)}
              isDark={isDark}
            />
            <SettingInput
              label="SMTP Username"
              type="text"
              value={sectionSettings.smtpUsername}
              onChange={(value) => handleSettingChange('smtpUsername', value)}
              isDark={isDark}
            />
            <SettingInput
              label="SMTP Password"
              type="password"
              value={sectionSettings.smtpPassword}
              onChange={(value) => handleSettingChange('smtpPassword', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Use SSL"
              type="checkbox"
              value={sectionSettings.smtpUseSSL}
              onChange={(value) => handleSettingChange('smtpUseSSL', value)}
              isDark={isDark}
            />
            <SettingInput
              label="From Name"
              type="text"
              value={sectionSettings.fromName}
              onChange={(value) => handleSettingChange('fromName', value)}
              isDark={isDark}
            />
            <SettingInput
              label="From Email"
              type="email"
              value={sectionSettings.fromEmail}
              onChange={(value) => handleSettingChange('fromEmail', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Reply To Email"
              type="email"
              value={sectionSettings.replyToEmail}
              onChange={(value) => handleSettingChange('replyToEmail', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Enable Email Tracking"
              type="checkbox"
              value={sectionSettings.enableEmailTracking}
              onChange={(value) => handleSettingChange('enableEmailTracking', value)}
              helpText="Track email opens and clicks"
              isDark={isDark}
            />
          </div>
        );

      case 'sms':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingInput
              label="Enable SMS"
              type="checkbox"
              value={sectionSettings.enableSMS}
              onChange={(value) => handleSettingChange('enableSMS', value)}
              isDark={isDark}
            />
            <SettingInput
              label="SMS Provider"
              type="select"
              value={sectionSettings.provider}
              onChange={(value) => handleSettingChange('provider', value)}
              options={[
                { value: 'twilio', label: 'Twilio' },
                { value: 'nexmo', label: 'Nexmo' },
                { value: 'plivo', label: 'Plivo' },
              ]}
              isDark={isDark}
            />
            <SettingInput
              label="Twilio Account SID"
              type="text"
              value={sectionSettings.twilioAccountSID}
              onChange={(value) => handleSettingChange('twilioAccountSID', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Twilio Auth Token"
              type="password"
              value={sectionSettings.twilioAuthToken}
              onChange={(value) => handleSettingChange('twilioAuthToken', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Twilio Phone Number"
              type="text"
              value={sectionSettings.twilioPhoneNumber}
              onChange={(value) => handleSettingChange('twilioPhoneNumber', value)}
              isDark={isDark}
            />
            <SettingInput
              label="SMS Sender ID"
              type="text"
              value={sectionSettings.smsSenderId}
              onChange={(value) => handleSettingChange('smsSenderId', value)}
              helpText="Sender name for SMS messages"
              isDark={isDark}
            />
            <SettingInput
              label="SMS Character Limit"
              type="number"
              value={sectionSettings.smsCharacterLimit}
              onChange={(value) => handleSettingChange('smsCharacterLimit', value)}
              helpText="Maximum characters per SMS"
              isDark={isDark}
            />
            <SettingInput
              label="Enable Unicode SMS"
              type="checkbox"
              value={sectionSettings.enableUnicodeSMS}
              onChange={(value) => handleSettingChange('enableUnicodeSMS', value)}
              helpText="Support for non-English characters"
              isDark={isDark}
            />
          </div>
        );

      case 'mobileApp':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingInput
              label="Enable Mobile App"
              type="checkbox"
              value={sectionSettings.enableMobileApp}
              onChange={(value) => handleSettingChange('enableMobileApp', value)}
              helpText="Enable mobile application features"
              isDark={isDark}
            />
            <SettingInput
              label="App Store Link"
              type="text"
              value={sectionSettings.appStoreLink}
              onChange={(value) => handleSettingChange('appStoreLink', value)}
              helpText="iOS App Store download link"
              isDark={isDark}
            />
            <SettingInput
              label="Play Store Link"
              type="text"
              value={sectionSettings.playStoreLink}
              onChange={(value) => handleSettingChange('playStoreLink', value)}
              helpText="Android Play Store download link"
              isDark={isDark}
            />
            <SettingInput
              label="Latest Version"
              type="text"
              value={sectionSettings.latestVersion}
              onChange={(value) => handleSettingChange('latestVersion', value)}
              helpText="Current mobile app version"
              isDark={isDark}
            />
            <SettingInput
              label="Minimum Supported Version"
              type="text"
              value={sectionSettings.minSupportedVersion}
              onChange={(value) => handleSettingChange('minSupportedVersion', value)}
              helpText="Oldest app version that can connect"
              isDark={isDark}
            />
            <SettingInput
              label="Force Update"
              type="checkbox"
              value={sectionSettings.forceUpdate}
              onChange={(value) => handleSettingChange('forceUpdate', value)}
              helpText="Force users to update to latest version"
              isDark={isDark}
            />
            <SettingInput
              label="Enable Push Notifications"
              type="checkbox"
              value={sectionSettings.enablePushNotifications}
              onChange={(value) => handleSettingChange('enablePushNotifications', value)}
              helpText="Enable push notifications for mobile app"
              isDark={isDark}
            />
            <SettingInput
              label="Enable Biometric Auth"
              type="checkbox"
              value={sectionSettings.enableBiometricAuth}
              onChange={(value) => handleSettingChange('enableBiometricAuth', value)}
              helpText="Enable fingerprint/face ID authentication"
              isDark={isDark}
            />
            <SettingInput
              label="Enable Offline Mode"
              type="checkbox"
              value={sectionSettings.enableOfflineMode}
              onChange={(value) => handleSettingChange('enableOfflineMode', value)}
              helpText="Allow app to work without internet connection"
              isDark={isDark}
            />
            <SettingInput
              label="Cache Duration (hours)"
              type="number"
              value={sectionSettings.cacheDuration}
              onChange={(value) => handleSettingChange('cacheDuration', value)}
              helpText="How long to cache data locally"
              isDark={isDark}
            />
            <SettingInput
              label="Enable Camera Upload"
              type="checkbox"
              value={sectionSettings.enableCameraUpload}
              onChange={(value) => handleSettingChange('enableCameraUpload', value)}
              helpText="Allow document upload via camera"
              isDark={isDark}
            />
            <SettingInput
              label="Max Image Size (MB)"
              type="number"
              value={sectionSettings.maxImageSize}
              onChange={(value) => handleSettingChange('maxImageSize', value)}
              helpText="Maximum image size for uploads"
              isDark={isDark}
            />
          </div>
        );

      case 'api':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingInput
              label="Enable API"
              type="checkbox"
              value={sectionSettings.enableAPI}
              onChange={(value) => handleSettingChange('enableAPI', value)}
              isDark={isDark}
            />
            <SettingInput
              label="API Rate Limit"
              type="number"
              value={sectionSettings.apiRateLimit}
              onChange={(value) => handleSettingChange('apiRateLimit', value)}
              helpText="Maximum API requests per hour"
              isDark={isDark}
            />
            <SettingInput
              label="API Key Expiry (Days)"
              type="number"
              value={sectionSettings.apiKeyExpiryDays}
              onChange={(value) => handleSettingChange('apiKeyExpiryDays', value)}
              helpText="Number of days before API keys expire"
              isDark={isDark}
            />
            <SettingInput
              label="Enable Swagger Documentation"
              type="checkbox"
              value={sectionSettings.enableSwagger}
              onChange={(value) => handleSettingChange('enableSwagger', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Enable Mobile API"
              type="checkbox"
              value={sectionSettings.enableMobileAPI}
              onChange={(value) => handleSettingChange('enableMobileAPI', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Mobile API Rate Limit"
              type="number"
              value={sectionSettings.mobileApiRateLimit}
              onChange={(value) => handleSettingChange('mobileApiRateLimit', value)}
              helpText="Maximum mobile API requests per hour"
              isDark={isDark}
            />
            <SettingInput
              label="Webhook URL"
              type="text"
              value={sectionSettings.webhookUrl}
              onChange={(value) => handleSettingChange('webhookUrl', value)}
              helpText="URL for receiving webhook notifications"
              isDark={isDark}
            />
            <SettingInput
              label="Webhook Secret"
              type="password"
              value={sectionSettings.webhookSecret}
              onChange={(value) => handleSettingChange('webhookSecret', value)}
              helpText="Secret key for webhook verification"
              isDark={isDark}
            />
          </div>
        );

      case 'backup':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingInput
              label="Auto Backup"
              type="checkbox"
              value={sectionSettings.autoBackup}
              onChange={(value) => handleSettingChange('autoBackup', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Backup Frequency"
              type="select"
              value={sectionSettings.backupFrequency}
              onChange={(value) => handleSettingChange('backupFrequency', value)}
              options={[
                { value: 'hourly', label: 'Hourly' },
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
              ]}
              isDark={isDark}
            />
            <SettingInput
              label="Backup Time"
              type="text"
              value={sectionSettings.backupTime}
              onChange={(value) => handleSettingChange('backupTime', value)}
              helpText="Time to run backups (24-hour format)"
              isDark={isDark}
            />
            <SettingInput
              label="Backup Retention (Days)"
              type="number"
              value={sectionSettings.backupRetentionDays}
              onChange={(value) => handleSettingChange('backupRetentionDays', value)}
              helpText="Number of days to keep backups"
              isDark={isDark}
            />
            <SettingInput
              label="Backup Location"
              type="select"
              value={sectionSettings.backupLocation}
              onChange={(value) => handleSettingChange('backupLocation', value)}
              options={[
                { value: 'local', label: 'Local Server' },
                { value: 'cloud', label: 'Cloud Storage' },
                { value: 'both', label: 'Both' },
              ]}
              isDark={isDark}
            />
            <SettingInput
              label="Cloud Storage Provider"
              type="select"
              value={sectionSettings.cloudStorageProvider}
              onChange={(value) => handleSettingChange('cloudStorageProvider', value)}
              options={[
                { value: 'aws', label: 'AWS S3' },
                { value: 'google', label: 'Google Cloud' },
                { value: 'azure', label: 'Azure Blob' },
              ]}
              isDark={isDark}
            />
            <SettingInput
              label="Encrypt Backups"
              type="checkbox"
              value={sectionSettings.encryptBackups}
              onChange={(value) => handleSettingChange('encryptBackups', value)}
              isDark={isDark}
            />
            <SettingInput
              label="Backup Notifications"
              type="checkbox"
              value={sectionSettings.backupNotifications}
              onChange={(value) => handleSettingChange('backupNotifications', value)}
              helpText="Send notifications for backup status"
              isDark={isDark}
            />
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Settings configuration for {section.name} is fully implemented.
            </p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <section.icon size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
        <div>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {section.name}
          </h3>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {section.description}
          </p>
        </div>
      </div>

      {renderSectionContent()}
    </motion.div>
  );
};

// Main SettingsManagement Component (same as before, but complete)
const SettingsManagement = ({ isDark }) => {
  const [settings, setSettings] = useState(initialSettings);
  const [activeSection, setActiveSection] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [backupHistory, setBackupHistory] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSettingsChange = (section, newSettings) => {
    setSettings(prev => ({
      ...prev,
      [section]: newSettings
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSaving(false);
    setHasUnsavedChanges(false);
    console.log('Settings saved:', settings);
  };

  const handleResetSettings = () => {
    setSettings(initialSettings);
    setHasUnsavedChanges(false);
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'donation-tracker-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(importedSettings);
          setHasUnsavedChanges(true);
        } catch (error) {
          alert('Error importing settings: Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleCreateBackup = () => {
    const newBackup = {
      id: `backup-${Date.now()}`,
      timestamp: new Date().toISOString(),
      size: '2.1 MB',
      status: 'completed'
    };
    setBackupHistory(prev => [newBackup, ...prev.slice(0, 4)]);
  };

  const activeSectionData = settingsSections.find(section => section.id === activeSection);

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 shadow-2xl border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}
      >
        <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          System Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <SystemStatusCard
            title="CPU Usage"
            value={systemStatus.cpu.usage}
            maxValue={100}
            unit="%"
            icon={Cpu}
            color="text-blue-500"
            isDark={isDark}
            details={`${systemStatus.cpu.cores} cores`}
          />
          <SystemStatusCard
            title="Memory"
            value={systemStatus.memory.usage}
            maxValue={100}
            unit="%"
            icon={MemoryStick}
            color="text-green-500"
            isDark={isDark}
            details={`${systemStatus.memory.used}GB used`}
          />
          <SystemStatusCard
            title="Storage"
            value={systemStatus.storage.usage}
            maxValue={100}
            unit="%"
            icon={HardDrive}
            color="text-amber-500"
            isDark={isDark}
            details={`${systemStatus.storage.used}GB used`}
          />
          <SystemStatusCard
            title="Network"
            value={75}
            maxValue={100}
            unit="%"
            icon={Network}
            color="text-purple-500"
            isDark={isDark}
            details={`${systemStatus.network.incoming}KB/s in`}
          />
          <SystemStatusCard
            title="Database"
            value={65}
            maxValue={100}
            unit="%"
            icon={Database}
            color="text-rose-500"
            isDark={isDark}
            details={`${systemStatus.database.connections} connections`}
          />
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:w-80 flex-shrink-0 rounded-2xl shadow-2xl border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}
        >
          <div className="p-6 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Settings Categories
            </h3>
          </div>
          <div className="p-4 space-y-2">
            {settingsSections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl text-left transition-all ${
                  activeSection === section.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : isDark
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <section.icon size={20} />
                <div className="flex-1">
                  <div className="font-medium text-sm">{section.name}</div>
                  <div className="text-xs opacity-75">{section.description}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex-1 rounded-2xl shadow-2xl border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}
        >
          <div className="p-6 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {activeSectionData?.name}
                </h2>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {activeSectionData?.description}
                </p>
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResetSettings}
                  className={`px-4 py-2 rounded-lg border font-medium ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <RotateCcw size={16} className="inline mr-2" />
                  Reset
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveSettings}
                  disabled={!hasUnsavedChanges || isSaving}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            </div>

            {hasUnsavedChanges && !isSaving && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-amber-500 text-white rounded-lg flex items-center gap-2"
              >
                <Bell size={16} />
                <span className="text-sm">You have unsaved changes</span>
              </motion.div>
            )}
          </div>

          <div className="p-6">
            <SettingsSection
              section={activeSectionData}
              settings={settings}
              onSettingsChange={handleSettingsChange}
              isDark={isDark}
            />
          </div>
        </motion.div>
      </div>

      {/* Quick Actions Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 shadow-2xl border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}
      >
        <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportSettings}
            className={`p-4 rounded-xl border text-left ${
              isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Download size={24} className="text-blue-500 mb-2" />
            <div className="font-medium">Export Settings</div>
            <div className="text-sm opacity-75">Download current configuration</div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('import-settings').click()}
            className={`p-4 rounded-xl border text-left ${
              isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Upload size={24} className="text-green-500 mb-2" />
            <div className="font-medium">Import Settings</div>
            <div className="text-sm opacity-75">Upload configuration file</div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateBackup}
            className={`p-4 rounded-xl border text-left ${
              isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Database size={24} className="text-amber-500 mb-2" />
            <div className="font-medium">Create Backup</div>
            <div className="text-sm opacity-75">Backup current data</div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-xl border text-left ${
              isDark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <TestTube size={24} className="text-purple-500 mb-2" />
            <div className="font-medium">Clear Cache</div>
            <div className="text-sm opacity-75">Refresh system cache</div>
          </motion.button>
        </div>

        {/* Hidden file input for import */}
        <input
          id="import-settings"
          type="file"
          accept=".json"
          onChange={handleImportSettings}
          className="hidden"
        />
      </motion.div>
    </div>
  );
};

export default SettingsManagement;