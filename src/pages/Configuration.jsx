import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save,
    RefreshCw,
    Shield,
    Mail,
    Bell,
    CreditCard,
    Users,
    FileText,
    Lock,
    Globe,
    Database,
    Server,
    Smartphone,
    MessageCircle,
    Send,
    Download,
    Upload,
    CheckCircle,
    XCircle,
    AlertCircle,
    Settings,
    X,
    Eye,
    EyeOff,
    Key,
    UserCheck,
    Clock,
    DollarSign,
    Percent,
    Calendar,
    Filter,
    Search,
    Plus,
    Edit,
    Trash2,
    MoreVertical
} from 'lucide-react';

// Configuration data structure
const initialConfigData = {
    // System Settings
    system: {
        appName: 'Donation Tracker',
        version: '1.0.0',
        maintenanceMode: false,
        maxLoginAttempts: 5,
        sessionTimeout: 30, // minutes
        passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true
        }
    },

    // Donation Settings
    donations: {
        maxDonationAmount: 1000000,
        minDonationAmount: 100,
        currency: 'PKR',
        allowedPaymentMethods: ['Bank Transfer', 'Credit Card', 'Digital Wallet', 'Cash'],
        autoApproveDonations: false,
        donationReceiptTemplate: 'Thank you for your donation of {amount} to {recipient}.',
        taxDeductibleEnabled: true,
        taxPercentage: 0
    },

    // Approval Workflow
    approval: {
        requiredApprovers: 2,
        coApproversRequired: 1,
        autoForwardEnabled: true,
        approvalTimeout: 7, // days
        escalationEnabled: true,
        escalationTime: 48, // hours
        statusFlow: ['Draft', 'Pending-Validation', 'Validated', 'Approved', 'Closed']
    },

    // Notification Settings
    notifications: {
        emailEnabled: true,
        smsEnabled: true,
        pushEnabled: false,
        donorWelcomeEmail: true,
        recipientApprovalEmail: true,
        donationReceiptEmail: true,
        adminAlerts: true,
        lowBalanceAlert: true,
        alertThreshold: 100000 // amount
    },

    // Email Settings
    email: {
        smtpHost: 'smtp.example.com',
        smtpPort: 587,
        smtpUsername: 'noreply@donationtracker.com',
        smtpPassword: 'encrypted_password',
        fromName: 'Donation Tracker',
        fromEmail: 'noreply@donationtracker.com',
        useSSL: true,
        useTLS: true
    },

    // SMS Settings
    sms: {
        provider: 'twilio', // twilio, plivo, etc.
        accountSid: 'your_account_sid',
        authToken: 'encrypted_auth_token',
        fromNumber: '+1234567890',
        enabled: true,
        costPerSMS: 2.5 // in currency
    },

    // Security Settings
    security: {
        twoFactorAuth: true,
        ipWhitelist: ['192.168.1.0/24'],
        allowedDomains: ['donationtracker.com'],
        sessionEncryption: true,
        dataEncryption: true,
        auditLogRetention: 365, // days
        loginHistoryRetention: 90, // days
        passwordExpiry: 90, // days
        forceLogout: false
    },

    // Backup Settings
    backup: {
        autoBackup: true,
        backupFrequency: 'daily', // daily, weekly, monthly
        backupTime: '02:00',
        retentionPeriod: 30, // days
        cloudBackup: true,
        localBackup: true,
        backupPath: '/backups',
        encryption: true,
        compression: true
    },

    // API Settings
    api: {
        enabled: true,
        rateLimit: 100, // requests per minute
        apiKeyExpiry: 90, // days
        webhookUrl: 'https://api.donationtracker.com/webhook',
        webhookSecret: 'encrypted_secret',
        corsOrigins: ['https://donationtracker.com'],
        enableSwagger: true
    },

    // Mobile App Settings
    mobile: {
        latestVersion: '1.0.0',
        minSupportedVersion: '1.0.0',
        forceUpdate: false,
        maintenanceMode: false,
        appStoreLink: 'https://apps.apple.com/app/id',
        playStoreLink: 'https://play.google.com/store/apps/details?id=',
        enableBiometric: true,
        sessionTimeout: 30 // minutes
    }
};

// Configuration Sections
const configSections = [
    {
        id: 'system',
        name: 'System Settings',
        icon: Settings,
        description: 'General system configuration and basic settings',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'donations',
        name: 'Donation Settings',
        icon: DollarSign,
        description: 'Donation limits, payment methods, and financial settings',
        color: 'from-green-500 to-emerald-500'
    },
    {
        id: 'approval',
        name: 'Approval Workflow',
        icon: UserCheck,
        description: 'Request approval process and workflow settings',
        color: 'from-purple-500 to-pink-500'
    },
    {
        id: 'notifications',
        name: 'Notifications',
        icon: Bell,
        description: 'Email, SMS, and push notification settings',
        color: 'from-orange-500 to-red-500'
    },
    {
        id: 'email',
        name: 'Email Settings',
        icon: Mail,
        description: 'SMTP configuration and email templates',
        color: 'from-indigo-500 to-blue-500'
    },
    {
        id: 'sms',
        name: 'SMS Settings',
        icon: MessageCircle,
        description: 'SMS provider configuration and settings',
        color: 'from-teal-500 to-green-500'
    },
    {
        id: 'security',
        name: 'Security',
        icon: Shield,
        description: 'Security policies and access controls',
        color: 'from-red-500 to-orange-500'
    },
    {
        id: 'backup',
        name: 'Backup & Recovery',
        icon: Database,
        description: 'Data backup and recovery settings',
        color: 'from-gray-500 to-blue-500'
    },
    {
        id: 'api',
        name: 'API Settings',
        icon: Server,
        description: 'API configuration and webhook settings',
        color: 'from-yellow-500 to-orange-500'
    },
    {
        id: 'mobile',
        name: 'Mobile App',
        icon: Smartphone,
        description: 'Mobile application settings and updates',
        color: 'from-cyan-500 to-blue-500'
    }
];

// Enhanced Stat Card for Configuration
const ConfigStatCard = ({ icon: Icon, title, value, description, color, delay, isDark }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay, duration: 0.5, type: "spring" }}
        whileHover={{ y: -8, scale: 1.03 }}
        className={`rounded-2xl p-6 shadow-2xl border relative overflow-hidden group ${isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-100'
            }`}
    >
        <div className="flex items-start justify-between relative z-10">
            <div className="flex-1">
                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{title}</p>
                <motion.h3
                    className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: delay + 0.2, type: "spring" }}
                >
                    {value}
                </motion.h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
            </div>

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
                    className={`p-3 rounded-xl bg-gradient-to-br ${color}`}
                >
                    <Icon size={24} className="text-white" strokeWidth={2.5} />
                </motion.div>
            </motion.div>
        </div>
    </motion.div>
);

// Configuration Item Component
const ConfigItem = ({ label, description, children, isDark, required = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
    >
        <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
                <label className={`block text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {label}
                    {required && <span className="text-rose-500 ml-1">*</span>}
                </label>
                {description && (
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {description}
                    </p>
                )}
            </div>
        </div>
        {children}
    </motion.div>
);

// Toggle Switch Component - FIXED
const ToggleSwitch = ({ enabled, onChange, label, description, isDark }) => (
    <div className="flex items-center justify-between">
        <div className="flex-1">
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {label}
            </span>
            {description && (
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {description}
                </p>
            )}
        </div>
        <button
            type="button"
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
            onClick={() => onChange(!enabled)}
            role="switch"
            aria-checked={enabled}
        >
            <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                style={{ marginTop: '2px' }}
            />
        </button>
    </div>
);

// Input Field Component - FIXED
const ConfigInput = ({ type = 'text', value, onChange, placeholder, unit, isDark, ...props }) => (
    <div className="relative">
        <input
            type={type}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all ${isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
            {...props}
        />
        {unit && (
            <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                {unit}
            </span>
        )}
    </div>
);

// Select Component
const ConfigSelect = ({ value, onChange, options, isDark, placeholder }) => (
    <select
        value={value || ''}
        onChange={onChange}
        className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all ${isDark
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-gray-900'
            }`}
    >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
);

// Password Input with Show/Hide - FIXED POSITION
const ConfigPassword = ({ value, onChange, placeholder, isDark }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <input
                type={showPassword ? 'text' : 'password'}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full p-3 pr-10 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-opacity-20 transition-colors ${isDark 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
                style={{ 
                    width: '28px', 
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    );
};

// Multi-select Component
const ConfigMultiSelect = ({ values, onChange, options, isDark, placeholder }) => {
    const toggleOption = (optionValue) => {
        const newValues = values.includes(optionValue)
            ? values.filter(v => v !== optionValue)
            : [...values, optionValue];
        onChange(newValues);
    };

    return (
        <div className="space-y-2">
            <div className={`p-3 rounded-lg border min-h-[48px] ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}>
                {values.length === 0 ? (
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{placeholder}</span>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {values.map(value => {
                            const option = options.find(opt => opt.value === value);
                            return (
                                <motion.span
                                    key={value}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                                        }`}
                                >
                                    {option?.label}
                                    <button
                                        type="button"
                                        onClick={() => toggleOption(value)}
                                        className="hover:opacity-70"
                                    >
                                        <X size={12} />
                                    </button>
                                </motion.span>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-2">
                {options.map(option => (
                    <label key={option.value} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={values.includes(option.value)}
                            onChange={() => toggleOption(option.value)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

// IP Address List Component
const IPList = ({ values, onChange, isDark, placeholder }) => {
    const [newIP, setNewIP] = useState('');

    const addIP = () => {
        if (newIP && !values.includes(newIP)) {
            onChange([...values, newIP]);
            setNewIP('');
        }
    };

    const removeIP = (ipToRemove) => {
        onChange(values.filter(ip => ip !== ipToRemove));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addIP();
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <ConfigInput
                    value={newIP}
                    onChange={(e) => setNewIP(e.target.value)}
                    placeholder={placeholder}
                    isDark={isDark}
                    onKeyPress={handleKeyPress}
                />
                <motion.button
                    onClick={addIP}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
                >
                    <Plus size={16} />
                </motion.button>
            </div>
            <div className="space-y-2">
                {values.map((ip, index) => (
                    <motion.div
                        key={ip}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                    >
                        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{ip}</span>
                        <motion.button
                            onClick={() => removeIP(ip)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            className={`p-1 ${isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'}`}
                        >
                            <X size={14} />
                        </motion.button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// Main Configuration Component
const Configuration = ({ isDark }) => {
    const [activeSection, setActiveSection] = useState('system');
    const [configData, setConfigData] = useState(initialConfigData);
    const [savedConfig, setSavedConfig] = useState(initialConfigData);
    const [hasChanges, setHasChanges] = useState(false);
    const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, success, error
    const [backupStatus, setBackupStatus] = useState('idle');
    const [testEmailStatus, setTestEmailStatus] = useState('idle');
    const [testSMSStatus, setTestSMSStatus] = useState('idle');
    const [testPhone, setTestPhone] = useState('');

    // Check for changes
    useEffect(() => {
        const changesExist = JSON.stringify(configData) !== JSON.stringify(savedConfig);
        setHasChanges(changesExist);
    }, [configData, savedConfig]);

    // Handle input changes - FIXED
    const handleInputChange = (section, key, value) => {
        setConfigData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    // Handle nested input changes - FIXED
    const handleNestedChange = (section, parentKey, key, value) => {
        setConfigData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [parentKey]: {
                    ...prev[section][parentKey],
                    [key]: value
                }
            }
        }));
    };

    // Handle array changes - FIXED
    const handleArrayChange = (section, key, values) => {
        setConfigData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: values
            }
        }));
    };

    // Save configuration
    const handleSave = async () => {
        setSaveStatus('saving');
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSavedConfig(configData);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    // Reset to saved configuration
    const handleReset = () => {
        setConfigData(savedConfig);
    };

    // Export configuration
    const handleExport = () => {
        const dataStr = JSON.stringify(configData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `configuration-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Import configuration
    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedConfig = JSON.parse(e.target.result);
                    setConfigData(importedConfig);
                } catch (error) {
                    alert('Invalid configuration file');
                }
            };
            reader.readAsText(file);
        }
        event.target.value = '';
    };

    // Create backup
    const handleBackup = async () => {
        setBackupStatus('saving');
        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            setBackupStatus('success');
            setTimeout(() => setBackupStatus('idle'), 3000);
        } catch (error) {
            setBackupStatus('error');
            setTimeout(() => setBackupStatus('idle'), 3000);
        }
    };

    // Test email configuration
    const handleTestEmail = async () => {
        setTestEmailStatus('saving');
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setTestEmailStatus('success');
            setTimeout(() => setTestEmailStatus('idle'), 3000);
        } catch (error) {
            setTestEmailStatus('error');
            setTimeout(() => setTestEmailStatus('idle'), 3000);
        }
    };

    // Test SMS configuration
    const handleTestSMS = async () => {
        setTestSMSStatus('saving');
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setTestSMSStatus('success');
            setTimeout(() => setTestSMSStatus('idle'), 3000);
        } catch (error) {
            setTestSMSStatus('error');
            setTimeout(() => setTestSMSStatus('idle'), 3000);
        }
    };

    // Get current section data
    const currentSection = configSections.find(section => section.id === activeSection);
    const sectionData = configData[activeSection];

    // Render configuration form based on active section
    const renderConfigurationForm = () => {
        switch (activeSection) {
            case 'system':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <ConfigItem label="Application Name" description="The name displayed throughout the application" isDark={isDark}>
                            <ConfigInput
                                value={sectionData.appName}
                                onChange={(e) => handleInputChange('system', 'appName', e.target.value)}
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Maintenance Mode" description="Put the application in maintenance mode" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.maintenanceMode}
                                onChange={(value) => handleInputChange('system', 'maintenanceMode', value)}
                                label="Enable maintenance mode"
                                description="When enabled, users will see a maintenance page"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Session Timeout" description="Automatic logout after inactivity" isDark={isDark}>
                            <ConfigInput
                                type="number"
                                value={sectionData.sessionTimeout}
                                onChange={(e) => handleInputChange('system', 'sessionTimeout', parseInt(e.target.value) || 0)}
                                unit="minutes"
                                isDark={isDark}
                                min="5"
                                max="240"
                            />
                        </ConfigItem>

                        <ConfigItem label="Maximum Login Attempts" description="Number of failed login attempts before lockout" isDark={isDark}>
                            <ConfigInput
                                type="number"
                                value={sectionData.maxLoginAttempts}
                                onChange={(e) => handleInputChange('system', 'maxLoginAttempts', parseInt(e.target.value) || 0)}
                                isDark={isDark}
                                min="1"
                                max="10"
                            />
                        </ConfigItem>

                        <ConfigItem label="Password Policy" description="Requirements for user passwords" isDark={isDark}>
                            <div className="space-y-4">
                                <ConfigInput
                                    type="number"
                                    value={sectionData.passwordPolicy.minLength}
                                    onChange={(e) => handleNestedChange('system', 'passwordPolicy', 'minLength', parseInt(e.target.value) || 0)}
                                    placeholder="Minimum password length"
                                    isDark={isDark}
                                    min="6"
                                    max="20"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <ToggleSwitch
                                        enabled={sectionData.passwordPolicy.requireUppercase}
                                        onChange={(value) => handleNestedChange('system', 'passwordPolicy', 'requireUppercase', value)}
                                        label="Require uppercase letters"
                                        isDark={isDark}
                                    />
                                    <ToggleSwitch
                                        enabled={sectionData.passwordPolicy.requireLowercase}
                                        onChange={(value) => handleNestedChange('system', 'passwordPolicy', 'requireLowercase', value)}
                                        label="Require lowercase letters"
                                        isDark={isDark}
                                    />
                                    <ToggleSwitch
                                        enabled={sectionData.passwordPolicy.requireNumbers}
                                        onChange={(value) => handleNestedChange('system', 'passwordPolicy', 'requireNumbers', value)}
                                        label="Require numbers"
                                        isDark={isDark}
                                    />
                                    <ToggleSwitch
                                        enabled={sectionData.passwordPolicy.requireSpecialChars}
                                        onChange={(value) => handleNestedChange('system', 'passwordPolicy', 'requireSpecialChars', value)}
                                        label="Require special characters"
                                        isDark={isDark}
                                    />
                                </div>
                            </div>
                        </ConfigItem>
                    </motion.div>
                );

            case 'donations':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <ConfigItem label="Maximum Donation Amount" description="Maximum allowed donation amount to avoid regulatory issues" isDark={isDark}>
                            <ConfigInput
                                type="number"
                                value={sectionData.maxDonationAmount}
                                onChange={(e) => handleInputChange('donations', 'maxDonationAmount', parseInt(e.target.value) || 0)}
                                unit="PKR"
                                isDark={isDark}
                                min="1000"
                            />
                        </ConfigItem>

                        <ConfigItem label="Minimum Donation Amount" description="Minimum allowed donation amount" isDark={isDark}>
                            <ConfigInput
                                type="number"
                                value={sectionData.minDonationAmount}
                                onChange={(e) => handleInputChange('donations', 'minDonationAmount', parseInt(e.target.value) || 0)}
                                unit="PKR"
                                isDark={isDark}
                                min="1"
                            />
                        </ConfigItem>

                        <ConfigItem label="Currency" description="Default currency for all transactions" isDark={isDark}>
                            <ConfigSelect
                                value={sectionData.currency}
                                onChange={(e) => handleInputChange('donations', 'currency', e.target.value)}
                                options={[
                                    { value: 'PKR', label: 'Pakistani Rupee (PKR)' },
                                    { value: 'USD', label: 'US Dollar (USD)' },
                                    { value: 'EUR', label: 'Euro (EUR)' },
                                    { value: 'GBP', label: 'British Pound (GBP)' }
                                ]}
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Allowed Payment Methods" description="Payment methods available for donors" isDark={isDark}>
                            <ConfigMultiSelect
                                values={sectionData.allowedPaymentMethods}
                                onChange={(values) => handleArrayChange('donations', 'allowedPaymentMethods', values)}
                                options={[
                                    { value: 'Bank Transfer', label: 'Bank Transfer' },
                                    { value: 'Credit Card', label: 'Credit Card' },
                                    { value: 'Digital Wallet', label: 'Digital Wallet' },
                                    { value: 'Cash', label: 'Cash' }
                                ]}
                                isDark={isDark}
                                placeholder="Select payment methods..."
                            />
                        </ConfigItem>

                        <ConfigItem label="Auto-approve Donations" description="Automatically approve donations without manual review" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.autoApproveDonations}
                                onChange={(value) => handleInputChange('donations', 'autoApproveDonations', value)}
                                label="Enable auto-approval"
                                description="Small donations can be auto-approved"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Tax Deductible" description="Enable tax deduction features" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.taxDeductibleEnabled}
                                onChange={(value) => handleInputChange('donations', 'taxDeductibleEnabled', value)}
                                label="Enable tax deductible donations"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        {sectionData.taxDeductibleEnabled && (
                            <ConfigItem label="Tax Percentage" description="Tax percentage applied to donations" isDark={isDark}>
                                <ConfigInput
                                    type="number"
                                    value={sectionData.taxPercentage}
                                    onChange={(e) => handleInputChange('donations', 'taxPercentage', parseFloat(e.target.value) || 0)}
                                    unit="%"
                                    isDark={isDark}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                />
                            </ConfigItem>
                        )}

                        <ConfigItem label="Donation Receipt Template" description="Template for donation receipt emails" isDark={isDark}>
                            <textarea
                                value={sectionData.donationReceiptTemplate}
                                onChange={(e) => handleInputChange('donations', 'donationReceiptTemplate', e.target.value)}
                                rows="4"
                                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    }`}
                                placeholder="Enter receipt template..."
                            />
                            <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Available variables: {'{amount}'}, {'{recipient}'}, {'{donor}'}, {'{date}'}, {'{transactionId}'}
                            </p>
                        </ConfigItem>
                    </motion.div>
                );

            case 'approval':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <ConfigItem label="Required Approvers" description="Number of approvers required to approve a request" isDark={isDark}>
                            <ConfigInput
                                type="number"
                                value={sectionData.requiredApprovers}
                                onChange={(e) => handleInputChange('approval', 'requiredApprovers', parseInt(e.target.value) || 0)}
                                isDark={isDark}
                                min="1"
                                max="5"
                            />
                        </ConfigItem>

                        <ConfigItem label="Co-approvers Required" description="Number of co-approvers needed for approval" isDark={isDark}>
                            <ConfigInput
                                type="number"
                                value={sectionData.coApproversRequired}
                                onChange={(e) => handleInputChange('approval', 'coApproversRequired', parseInt(e.target.value) || 0)}
                                isDark={isDark}
                                min="0"
                                max="3"
                            />
                        </ConfigItem>

                        <ConfigItem label="Auto Forward" description="Automatically forward requests to available approvers" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.autoForwardEnabled}
                                onChange={(value) => handleInputChange('approval', 'autoForwardEnabled', value)}
                                label="Enable auto-forwarding"
                                description="Automatically distribute requests among approvers"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Approval Timeout" description="Days before a pending approval expires" isDark={isDark}>
                            <ConfigInput
                                type="number"
                                value={sectionData.approvalTimeout}
                                onChange={(e) => handleInputChange('approval', 'approvalTimeout', parseInt(e.target.value) || 0)}
                                unit="days"
                                isDark={isDark}
                                min="1"
                                max="30"
                            />
                        </ConfigItem>

                        <ConfigItem label="Escalation" description="Automatically escalate stuck approvals" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.escalationEnabled}
                                onChange={(value) => handleInputChange('approval', 'escalationEnabled', value)}
                                label="Enable escalation"
                                description="Escalate approvals that are stuck"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        {sectionData.escalationEnabled && (
                            <ConfigItem label="Escalation Time" description="Hours before escalation occurs" isDark={isDark}>
                                <ConfigInput
                                    type="number"
                                    value={sectionData.escalationTime}
                                    onChange={(e) => handleInputChange('approval', 'escalationTime', parseInt(e.target.value) || 0)}
                                    unit="hours"
                                    isDark={isDark}
                                    min="1"
                                    max="168"
                                />
                            </ConfigItem>
                        )}

                        <ConfigItem label="Status Flow" description="The sequence of statuses for requests" isDark={isDark}>
                            <div className={`p-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
                                <div className="flex items-center gap-2 overflow-x-auto">
                                    {sectionData.statusFlow.map((status, index) => (
                                        <motion.div
                                            key={status}
                                            className="flex items-center"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {status}
                                            </span>
                                            {index < sectionData.statusFlow.length - 1 && (
                                                <span className={`mx-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>→</span>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </ConfigItem>
                    </motion.div>
                );

            case 'notifications':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <ConfigItem label="Email Notifications" description="Enable or disable email notifications" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.emailEnabled}
                                onChange={(value) => handleInputChange('notifications', 'emailEnabled', value)}
                                label="Enable email notifications"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="SMS Notifications" description="Enable or disable SMS notifications" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.smsEnabled}
                                onChange={(value) => handleInputChange('notifications', 'smsEnabled', value)}
                                label="Enable SMS notifications"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Push Notifications" description="Enable or disable push notifications" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.pushEnabled}
                                onChange={(value) => handleInputChange('notifications', 'pushEnabled', value)}
                                label="Enable push notifications"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ConfigItem label="Donor Welcome Email" description="Send welcome email to new donors" isDark={isDark}>
                                <ToggleSwitch
                                    enabled={sectionData.donorWelcomeEmail}
                                    onChange={(value) => handleInputChange('notifications', 'donorWelcomeEmail', value)}
                                    label="Send welcome email"
                                    isDark={isDark}
                                />
                            </ConfigItem>

                            <ConfigItem label="Recipient Approval Email" description="Notify recipients when approved" isDark={isDark}>
                                <ToggleSwitch
                                    enabled={sectionData.recipientApprovalEmail}
                                    onChange={(value) => handleInputChange('notifications', 'recipientApprovalEmail', value)}
                                    label="Send approval notifications"
                                    isDark={isDark}
                                />
                            </ConfigItem>

                            <ConfigItem label="Donation Receipt Email" description="Send receipt after donation" isDark={isDark}>
                                <ToggleSwitch
                                    enabled={sectionData.donationReceiptEmail}
                                    onChange={(value) => handleInputChange('notifications', 'donationReceiptEmail', value)}
                                    label="Send donation receipts"
                                    isDark={isDark}
                                />
                            </ConfigItem>

                            <ConfigItem label="Admin Alerts" description="Send alerts to administrators" isDark={isDark}>
                                <ToggleSwitch
                                    enabled={sectionData.adminAlerts}
                                    onChange={(value) => handleInputChange('notifications', 'adminAlerts', value)}
                                    label="Enable admin alerts"
                                    isDark={isDark}
                                />
                            </ConfigItem>
                        </div>

                        <ConfigItem label="Low Balance Alert" description="Alert when system balance is low" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.lowBalanceAlert}
                                onChange={(value) => handleInputChange('notifications', 'lowBalanceAlert', value)}
                                label="Enable low balance alerts"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        {sectionData.lowBalanceAlert && (
                            <ConfigItem label="Alert Threshold" description="Balance amount that triggers alerts" isDark={isDark}>
                                <ConfigInput
                                    type="number"
                                    value={sectionData.alertThreshold}
                                    onChange={(e) => handleInputChange('notifications', 'alertThreshold', parseInt(e.target.value) || 0)}
                                    unit="PKR"
                                    isDark={isDark}
                                    min="0"
                                />
                            </ConfigItem>
                        )}
                    </motion.div>
                );

            case 'email':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <ConfigItem label="SMTP Host" description="Your email server host address" isDark={isDark} required>
                            <ConfigInput
                                value={sectionData.smtpHost}
                                onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
                                placeholder="smtp.example.com"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="SMTP Port" description="Port for SMTP connection" isDark={isDark} required>
                            <ConfigInput
                                type="number"
                                value={sectionData.smtpPort}
                                onChange={(e) => handleInputChange('email', 'smtpPort', parseInt(e.target.value) || 0)}
                                placeholder="587"
                                isDark={isDark}
                                min="1"
                                max="65535"
                            />
                        </ConfigItem>

                        <ConfigItem label="SMTP Username" description="Username for SMTP authentication" isDark={isDark} required>
                            <ConfigInput
                                value={sectionData.smtpUsername}
                                onChange={(e) => handleInputChange('email', 'smtpUsername', e.target.value)}
                                placeholder="noreply@yourdomain.com"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="SMTP Password" description="Password for SMTP authentication" isDark={isDark} required>
                            <ConfigPassword
                                value={sectionData.smtpPassword}
                                onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
                                placeholder="Enter SMTP password"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="From Name" description="Display name for sent emails" isDark={isDark}>
                            <ConfigInput
                                value={sectionData.fromName}
                                onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
                                placeholder="Donation Tracker"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="From Email" description="Sender email address" isDark={isDark}>
                            <ConfigInput
                                type="email"
                                value={sectionData.fromEmail}
                                onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
                                placeholder="noreply@yourdomain.com"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <div className="grid grid-cols-2 gap-6">
                            <ConfigItem label="Use SSL" description="Enable SSL encryption" isDark={isDark}>
                                <ToggleSwitch
                                    enabled={sectionData.useSSL}
                                    onChange={(value) => handleInputChange('email', 'useSSL', value)}
                                    label="Enable SSL"
                                    isDark={isDark}
                                />
                            </ConfigItem>

                            <ConfigItem label="Use TLS" description="Enable TLS encryption" isDark={isDark}>
                                <ToggleSwitch
                                    enabled={sectionData.useTLS}
                                    onChange={(value) => handleInputChange('email', 'useTLS', value)}
                                    label="Enable TLS"
                                    isDark={isDark}
                                />
                            </ConfigItem>
                        </div>

                        <ConfigItem label="Test Email Configuration" description="Send a test email to verify settings" isDark={isDark}>
                            <motion.button
                                type="button"
                                onClick={handleTestEmail}
                                disabled={testEmailStatus === 'saving'}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${testEmailStatus === 'saving'
                                    ? 'bg-gray-500 text-white cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                                    }`}
                            >
                                {testEmailStatus === 'saving' ? (
                                    <RefreshCw size={16} className="animate-spin" />
                                ) : testEmailStatus === 'success' ? (
                                    <CheckCircle size={16} />
                                ) : testEmailStatus === 'error' ? (
                                    <XCircle size={16} />
                                ) : (
                                    <Send size={16} />
                                )}
                                {testEmailStatus === 'saving' ? 'Sending...' :
                                    testEmailStatus === 'success' ? 'Sent!' :
                                        testEmailStatus === 'error' ? 'Failed' : 'Send Test Email'}
                            </motion.button>
                        </ConfigItem>
                    </motion.div>
                );

            case 'sms':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <ConfigItem label="SMS Service" description="Enable or disable SMS notifications" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.enabled}
                                onChange={(value) => handleInputChange('sms', 'enabled', value)}
                                label="Enable SMS service"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        {sectionData.enabled && (
                            <>
                                <ConfigItem label="SMS Provider" description="Select your SMS service provider" isDark={isDark}>
                                    <ConfigSelect
                                        value={sectionData.provider}
                                        onChange={(e) => handleInputChange('sms', 'provider', e.target.value)}
                                        options={[
                                            { value: 'twilio', label: 'Twilio' },
                                            { value: 'plivo', label: 'Plivo' },
                                            { value: 'nexmo', label: 'Nexmo' },
                                            { value: 'custom', label: 'Custom Provider' }
                                        ]}
                                        isDark={isDark}
                                    />
                                </ConfigItem>

                                <ConfigItem label="Account SID" description="Your SMS provider account SID" isDark={isDark}>
                                    <ConfigInput
                                        value={sectionData.accountSid}
                                        onChange={(e) => handleInputChange('sms', 'accountSid', e.target.value)}
                                        placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx"
                                        isDark={isDark}
                                    />
                                </ConfigItem>

                                <ConfigItem label="Auth Token" description="Your SMS provider authentication token" isDark={isDark}>
                                    <ConfigPassword
                                        value={sectionData.authToken}
                                        onChange={(e) => handleInputChange('sms', 'authToken', e.target.value)}
                                        placeholder="Enter auth token"
                                        isDark={isDark}
                                    />
                                </ConfigItem>

                                <ConfigItem label="From Number" description="Sender phone number" isDark={isDark}>
                                    <ConfigInput
                                        value={sectionData.fromNumber}
                                        onChange={(e) => handleInputChange('sms', 'fromNumber', e.target.value)}
                                        placeholder="+1234567890"
                                        isDark={isDark}
                                    />
                                </ConfigItem>

                                <ConfigItem label="Cost per SMS" description="Cost per SMS message for budgeting" isDark={isDark}>
                                    <ConfigInput
                                        type="number"
                                        value={sectionData.costPerSMS}
                                        onChange={(e) => handleInputChange('sms', 'costPerSMS', parseFloat(e.target.value) || 0)}
                                        unit="PKR"
                                        isDark={isDark}
                                        min="0"
                                        step="0.01"
                                    />
                                </ConfigItem>

                                <ConfigItem label="Test SMS" description="Send a test SMS to verify settings" isDark={isDark}>
                                    <div className="flex gap-4">
                                        <ConfigInput
                                            value={testPhone}
                                            onChange={(e) => setTestPhone(e.target.value)}
                                            placeholder="Phone number"
                                            isDark={isDark}
                                            className="flex-1"
                                        />
                                        <motion.button
                                            type="button"
                                            onClick={handleTestSMS}
                                            disabled={testSMSStatus === 'saving' || !testPhone}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${testSMSStatus === 'saving' || !testPhone
                                                ? 'bg-gray-500 text-white cursor-not-allowed'
                                                : 'bg-gradient-to-r from-green-600 to-emerald-500 text-white'
                                                }`}
                                        >
                                            {testSMSStatus === 'saving' ? (
                                                <RefreshCw size={16} className="animate-spin" />
                                            ) : testSMSStatus === 'success' ? (
                                                <CheckCircle size={16} />
                                            ) : testSMSStatus === 'error' ? (
                                                <XCircle size={16} />
                                            ) : (
                                                <Send size={16} />
                                            )}
                                            {testSMSStatus === 'saving' ? 'Sending...' :
                                                testSMSStatus === 'success' ? 'Sent!' :
                                                    testSMSStatus === 'error' ? 'Failed' : 'Send Test SMS'}
                                        </motion.button>
                                    </div>
                                </ConfigItem>
                            </>
                        )}
                    </motion.div>
                );

            case 'security':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <ConfigItem label="Two-Factor Authentication" description="Require 2FA for all user accounts" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.twoFactorAuth}
                                onChange={(value) => handleInputChange('security', 'twoFactorAuth', value)}
                                label="Enable 2FA"
                                description="Adds an extra layer of security to user accounts"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Session Encryption" description="Encrypt user session data" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.sessionEncryption}
                                onChange={(value) => handleInputChange('security', 'sessionEncryption', value)}
                                label="Encrypt sessions"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Data Encryption" description="Encrypt sensitive data at rest" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.dataEncryption}
                                onChange={(value) => handleInputChange('security', 'dataEncryption', value)}
                                label="Encrypt data"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Force Logout" description="Force logout users on security policy changes" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.forceLogout}
                                onChange={(value) => handleInputChange('security', 'forceLogout', value)}
                                label="Force logout"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Password Expiry" description="Days before passwords expire" isDark={isDark}>
                            <ConfigInput
                                type="number"
                                value={sectionData.passwordExpiry}
                                onChange={(e) => handleInputChange('security', 'passwordExpiry', parseInt(e.target.value) || 0)}
                                unit="days"
                                isDark={isDark}
                                min="1"
                                max="365"
                            />
                        </ConfigItem>

                        <ConfigItem label="IP Whitelist" description="Allowed IP addresses for admin access" isDark={isDark}>
                            <IPList
                                values={sectionData.ipWhitelist}
                                onChange={(values) => handleArrayChange('security', 'ipWhitelist', values)}
                                isDark={isDark}
                                placeholder="Enter IP address or CIDR (e.g., 192.168.1.0/24)"
                            />
                        </ConfigItem>

                        <ConfigItem label="Allowed Domains" description="Domains allowed for user registration" isDark={isDark}>
                            <IPList
                                values={sectionData.allowedDomains}
                                onChange={(values) => handleArrayChange('security', 'allowedDomains', values)}
                                isDark={isDark}
                                placeholder="Enter domain (e.g., company.com)"
                            />
                        </ConfigItem>

                        <ConfigItem label="Audit Log Retention" description="Days to keep audit logs" isDark={isDark}>
                            <ConfigInput
                                type="number"
                                value={sectionData.auditLogRetention}
                                onChange={(e) => handleInputChange('security', 'auditLogRetention', parseInt(e.target.value) || 0)}
                                unit="days"
                                isDark={isDark}
                                min="1"
                                max="1095"
                            />
                        </ConfigItem>

                        <ConfigItem label="Login History Retention" description="Days to keep login history" isDark={isDark}>
                            <ConfigInput
                                type="number"
                                value={sectionData.loginHistoryRetention}
                                onChange={(e) => handleInputChange('security', 'loginHistoryRetention', parseInt(e.target.value) || 0)}
                                unit="days"
                                isDark={isDark}
                                min="1"
                                max="365"
                            />
                        </ConfigItem>
                    </motion.div>
                );

            case 'backup':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <ConfigItem label="Automatic Backup" description="Enable automatic system backups" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.autoBackup}
                                onChange={(value) => handleInputChange('backup', 'autoBackup', value)}
                                label="Enable auto backup"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        {sectionData.autoBackup && (
                            <>
                                <ConfigItem label="Backup Frequency" description="How often to perform backups" isDark={isDark}>
                                    <ConfigSelect
                                        value={sectionData.backupFrequency}
                                        onChange={(e) => handleInputChange('backup', 'backupFrequency', e.target.value)}
                                        options={[
                                            { value: 'daily', label: 'Daily' },
                                            { value: 'weekly', label: 'Weekly' },
                                            { value: 'monthly', label: 'Monthly' }
                                        ]}
                                        isDark={isDark}
                                    />
                                </ConfigItem>

                                <ConfigItem label="Backup Time" description="Time to perform backups (24-hour format)" isDark={isDark}>
                                    <ConfigInput
                                        type="time"
                                        value={sectionData.backupTime}
                                        onChange={(e) => handleInputChange('backup', 'backupTime', e.target.value)}
                                        isDark={isDark}
                                    />
                                </ConfigItem>
                            </>
                        )}

                        <ConfigItem label="Cloud Backup" description="Backup to cloud storage" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.cloudBackup}
                                onChange={(value) => handleInputChange('backup', 'cloudBackup', value)}
                                label="Enable cloud backup"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Local Backup" description="Backup to local storage" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.localBackup}
                                onChange={(value) => handleInputChange('backup', 'localBackup', value)}
                                label="Enable local backup"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Backup Path" description="Local directory for backups" isDark={isDark}>
                            <ConfigInput
                                value={sectionData.backupPath}
                                onChange={(e) => handleInputChange('backup', 'backupPath', e.target.value)}
                                placeholder="/backups"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Retention Period" description="Days to keep backup files" isDark={isDark}>
                            <ConfigInput
                                type="number"
                                value={sectionData.retentionPeriod}
                                onChange={(e) => handleInputChange('backup', 'retentionPeriod', parseInt(e.target.value) || 0)}
                                unit="days"
                                isDark={isDark}
                                min="1"
                                max="365"
                            />
                        </ConfigItem>

                        <ConfigItem label="Backup Encryption" description="Encrypt backup files" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.encryption}
                                onChange={(value) => handleInputChange('backup', 'encryption', value)}
                                label="Encrypt backups"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Backup Compression" description="Compress backup files to save space" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.compression}
                                onChange={(value) => handleInputChange('backup', 'compression', value)}
                                label="Compress backups"
                                isDark={isDark}
                            />
                        </ConfigItem>
                    </motion.div>
                );

            case 'api':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <ConfigItem label="API Access" description="Enable or disable API access" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.enabled}
                                onChange={(value) => handleInputChange('api', 'enabled', value)}
                                label="Enable API"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        {sectionData.enabled && (
                            <>
                                <ConfigItem label="Rate Limit" description="Maximum API requests per minute" isDark={isDark}>
                                    <ConfigInput
                                        type="number"
                                        value={sectionData.rateLimit}
                                        onChange={(e) => handleInputChange('api', 'rateLimit', parseInt(e.target.value) || 0)}
                                        unit="requests/min"
                                        isDark={isDark}
                                        min="1"
                                        max="1000"
                                    />
                                </ConfigItem>

                                <ConfigItem label="API Key Expiry" description="Days before API keys expire" isDark={isDark}>
                                    <ConfigInput
                                        type="number"
                                        value={sectionData.apiKeyExpiry}
                                        onChange={(e) => handleInputChange('api', 'apiKeyExpiry', parseInt(e.target.value) || 0)}
                                        unit="days"
                                        isDark={isDark}
                                        min="1"
                                        max="365"
                                    />
                                </ConfigItem>

                                <ConfigItem label="Webhook URL" description="URL for receiving webhook notifications" isDark={isDark}>
                                    <ConfigInput
                                        value={sectionData.webhookUrl}
                                        onChange={(e) => handleInputChange('api', 'webhookUrl', e.target.value)}
                                        placeholder="https://api.example.com/webhook"
                                        isDark={isDark}
                                    />
                                </ConfigItem>

                                <ConfigItem label="Webhook Secret" description="Secret for webhook verification" isDark={isDark}>
                                    <ConfigPassword
                                        value={sectionData.webhookSecret}
                                        onChange={(e) => handleInputChange('api', 'webhookSecret', e.target.value)}
                                        placeholder="Enter webhook secret"
                                        isDark={isDark}
                                    />
                                </ConfigItem>

                                <ConfigItem label="CORS Origins" description="Allowed origins for cross-origin requests" isDark={isDark}>
                                    <IPList
                                        values={sectionData.corsOrigins}
                                        onChange={(values) => handleArrayChange('api', 'corsOrigins', values)}
                                        isDark={isDark}
                                        placeholder="Enter origin URL (e.g., https://app.example.com)"
                                    />
                                </ConfigItem>

                                <ConfigItem label="Swagger Documentation" description="Enable API documentation" isDark={isDark}>
                                    <ToggleSwitch
                                        enabled={sectionData.enableSwagger}
                                        onChange={(value) => handleInputChange('api', 'enableSwagger', value)}
                                        label="Enable Swagger UI"
                                        isDark={isDark}
                                    />
                                </ConfigItem>
                            </>
                        )}
                    </motion.div>
                );

            case 'mobile':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <ConfigItem label="Latest Version" description="Current version of the mobile app" isDark={isDark}>
                            <ConfigInput
                                value={sectionData.latestVersion}
                                onChange={(e) => handleInputChange('mobile', 'latestVersion', e.target.value)}
                                placeholder="1.0.0"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Minimum Supported Version" description="Oldest version that can connect" isDark={isDark}>
                            <ConfigInput
                                value={sectionData.minSupportedVersion}
                                onChange={(e) => handleInputChange('mobile', 'minSupportedVersion', e.target.value)}
                                placeholder="1.0.0"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Force Update" description="Require users to update the app" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.forceUpdate}
                                onChange={(value) => handleInputChange('mobile', 'forceUpdate', value)}
                                label="Force app update"
                                description="Users must update to the latest version"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Mobile Maintenance" description="Put mobile app in maintenance mode" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.maintenanceMode}
                                onChange={(value) => handleInputChange('mobile', 'maintenanceMode', value)}
                                label="Enable maintenance mode"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Biometric Authentication" description="Enable fingerprint/face ID login" isDark={isDark}>
                            <ToggleSwitch
                                enabled={sectionData.enableBiometric}
                                onChange={(value) => handleInputChange('mobile', 'enableBiometric', value)}
                                label="Enable biometric auth"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Mobile Session Timeout" description="Automatic logout after inactivity" isDark={isDark}>
                            <ConfigInput
                                type="number"
                                value={sectionData.sessionTimeout}
                                onChange={(e) => handleInputChange('mobile', 'sessionTimeout', parseInt(e.target.value) || 0)}
                                unit="minutes"
                                isDark={isDark}
                                min="1"
                                max="1440"
                            />
                        </ConfigItem>

                        <ConfigItem label="App Store Link" description="Link to iOS App Store" isDark={isDark}>
                            <ConfigInput
                                value={sectionData.appStoreLink}
                                onChange={(e) => handleInputChange('mobile', 'appStoreLink', e.target.value)}
                                placeholder="https://apps.apple.com/app/id"
                                isDark={isDark}
                            />
                        </ConfigItem>

                        <ConfigItem label="Play Store Link" description="Link to Google Play Store" isDark={isDark}>
                            <ConfigInput
                                value={sectionData.playStoreLink}
                                onChange={(e) => handleInputChange('mobile', 'playStoreLink', e.target.value)}
                                placeholder="https://play.google.com/store/apps/details?id="
                                isDark={isDark}
                            />
                        </ConfigItem>
                    </motion.div>
                );

            default:
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`rounded-2xl p-8 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                            }`}
                    >
                        <Settings size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                        <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {currentSection?.name} Configuration
                        </h3>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            Configuration options for {currentSection?.name?.toLowerCase()} will be displayed here.
                        </p>
                    </motion.div>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Configuration Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`rounded-2xl p-6 shadow-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                    }`}
            >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            System Configuration
                        </h1>
                        <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Manage all system settings and configurations in one place
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleExport}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold ${isDark
                                ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Download size={18} />
                            Export
                        </motion.button>

                        <motion.label
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold cursor-pointer"
                        >
                            <Upload size={18} />
                            Import
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="hidden"
                            />
                        </motion.label>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBackup}
                            disabled={backupStatus === 'saving'}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${backupStatus === 'saving'
                                ? 'bg-gray-500 text-white cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-600 to-emerald-500 text-white'
                                }`}
                        >
                            {backupStatus === 'saving' ? (
                                <RefreshCw size={18} className="animate-spin" />
                            ) : backupStatus === 'success' ? (
                                <CheckCircle size={18} />
                            ) : backupStatus === 'error' ? (
                                <XCircle size={18} />
                            ) : (
                                <Database size={18} />
                            )}
                            {backupStatus === 'saving' ? 'Backing up...' :
                                backupStatus === 'success' ? 'Backed up!' :
                                    backupStatus === 'error' ? 'Error' : 'Backup'}
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`rounded-2xl shadow-2xl border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                        }`}
                >
                    <div className="p-4 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Configuration Sections
                        </h3>
                    </div>

                    <div className="p-2">
                        <AnimatePresence mode="wait">
                            {configSections.map((section, index) => (
                                <motion.button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all ${activeSection === section.id
                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                                        : isDark
                                            ? 'text-gray-300 hover:bg-gray-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    whileHover={{ x: 4, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <section.icon size={20} strokeWidth={2} />
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">{section.name}</div>
                                        <div className={`text-xs ${activeSection === section.id ? 'text-blue-100' :
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                            {section.description}
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Main Configuration Area */}
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`rounded-2xl shadow-2xl border xl:col-span-3 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                        }`}
                >
                    <div className="p-6 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            <div>
                                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {currentSection?.name}
                                </h2>
                                <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {currentSection?.description}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                {hasChanges && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleReset}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium ${isDark
                                            ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <RefreshCw size={16} />
                                        Reset
                                    </motion.button>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSave}
                                    disabled={saveStatus === 'saving' || !hasChanges}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${saveStatus === 'saving' || !hasChanges
                                        ? 'bg-gray-500 text-white cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-600 to-emerald-500 text-white'
                                        }`}
                                >
                                    {saveStatus === 'saving' ? (
                                        <RefreshCw size={16} className="animate-spin" />
                                    ) : saveStatus === 'success' ? (
                                        <CheckCircle size={16} />
                                    ) : saveStatus === 'error' ? (
                                        <XCircle size={16} />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    {saveStatus === 'saving' ? 'Saving...' :
                                        saveStatus === 'success' ? 'Saved!' :
                                            saveStatus === 'error' ? 'Error' : 'Save Changes'}
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderConfigurationForm()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Configuration;