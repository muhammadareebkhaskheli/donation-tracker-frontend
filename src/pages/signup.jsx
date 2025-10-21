import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, 
  HeartHandshake, ShieldCheck, TrendingUp, Star, Zap, Target,
  CheckCircle, XCircle, Globe, Smartphone, Gift, HandHeart,
  Key, Shield, Clock, Fingerprint
} from "lucide-react";

export default function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get URL parameters
  const getUrlParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('type');
  };
  
  const urlUserType = getUrlParams();
  
  // Initialize userType with URL parameter or default to 'donor'
  const [userType, setUserType] = useState(urlUserType === 'recipient' ? 'recipient' : 'donor');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState("email");
  const [phoneCode, setPhoneCode] = useState("+92");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);

  // NEW: Verification and 2FA States
  const [currentStep, setCurrentStep] = useState('signup'); // 'signup', 'verify', 'setup2fa', 'complete'
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("email");
  const [isVerifying, setIsVerifying] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState("");
  const [twoFactorQRCode, setTwoFactorQRCode] = useState("");
  const [twoFactorBackupCodes, setTwoFactorBackupCodes] = useState([]);
  const [twoFactorSetupCode, setTwoFactorSetupCode] = useState("");
  const [isTwoFactorVerifying, setIsTwoFactorVerifying] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update userType when URL parameter changes
  useEffect(() => {
    const currentUserType = getUrlParams();
    if (currentUserType === 'recipient') {
      setUserType('recipient');
    } else {
      setUserType('donor');
    }
  }, [location.search]);

  // Phone country codes
  const countryCodes = [
    { code: "+1", country: "US", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+92", country: "Pakistan", flag: "🇵🇰" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+966", country: "KSA", flag: "🇸🇦" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" }
  ];

  // Enhanced Animation Variants
  const fadeInUp = {
    initial: { y: 40, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const scaleIn = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        duration: 0.8,
        delay: 0.2 
      }
    }
  };

  const shakeAnimation = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    }
  };

  // Premium Button Animations
  const buttonAnimation = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.98 }
  };

  const eyeButtonAnimation = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.9 }
  };

  const primaryButtonAnimation = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      y: -2,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.95 }
  };

  const linkAnimation = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 15 
      }
    },
    tap: { scale: 0.98 }
  };

  const backLinkAnimation = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      x: -2,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    },
    tap: { scale: 0.98 }
  };

  // Icon animation for verification steps
  const iconAnimation = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.8
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Pulse animation for primary buttons
  const pulseAnimation = {
    initial: { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.7)" },
    hover: { 
      boxShadow: [
        "0 0 0 0 rgba(59, 130, 246, 0.7)",
        "0 0 0 10px rgba(59, 130, 246, 0)",
        "0 0 0 0 rgba(59, 130, 246, 0)"
      ],
      transition: { duration: 1.5, repeat: Infinity }
    }
  };

  // User type options with simple attractive icons
  const userTypeOptions = [
    { 
      id: "donor", 
      label: "I Want to Help", 
      sub: "Support others",
      icon: Gift,
      iconColor: "from-blue-500 to-cyan-400"
    },
    { 
      id: "recipient", 
      label: "I Need Support", 
      sub: "Receive help",
      icon: HandHeart,
      iconColor: "from-green-500 to-emerald-400"
    }
  ];

  // Benefits data
  const benefits = {
    donor: [
      {
        icon: TrendingUp,
        title: "Real-time Impact Tracking",
        description: "Watch your donations transform lives with live updates",
        color: "from-green-500 to-emerald-400"
      },
      {
        icon: Target,
        title: "Targeted Giving",
        description: "Support specific causes that match your passion",
        color: "from-blue-500 to-cyan-400"
      },
      {
        icon: ShieldCheck,
        title: "100% Verified Recipients",
        description: "Every recipient is thoroughly authenticated and validated",
        color: "from-purple-500 to-pink-400"
      },
      {
        icon: Star,
        title: "Premium Features",
        description: "Access exclusive donor tools and analytics",
        color: "from-yellow-500 to-orange-400"
      }
    ],
    recipient: [
      {
        icon: ShieldCheck,
        title: "Bank-Level Security",
        description: "Your personal information is encrypted and protected",
        color: "from-blue-500 to-cyan-400"
      },
      {
        icon: Zap,
        title: "Instant Support",
        description: "Receive help quickly from our donor community",
        color: "from-yellow-500 to-orange-400"
      },
      {
        icon: HeartHandshake,
        title: "Direct Connections",
        description: "Build relationships with compassionate donors",
        color: "from-pink-500 to-rose-400"
      },
      {
        icon: Globe,
        title: "Global Reach",
        description: "Access support from donors worldwide",
        color: "from-green-500 to-emerald-400"
      }
    ]
  };

  // Security Features for 2FA Setup
  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: "Bank-Level Encryption",
      description: "All data protected with AES-256 encryption",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: Key,
      title: "Multi-Factor Authentication",
      description: "2FA required for all account access",
      color: "from-green-500 to-emerald-400"
    },
    {
      icon: Fingerprint,
      title: "Identity Verification",
      description: "Multi-step verification process",
      color: "from-purple-500 to-pink-400"
    },
    {
      icon: Clock,
      title: "Real-time Monitoring",
      description: "24/7 security monitoring and alerts",
      color: "from-yellow-500 to-orange-400"
    }
  ];

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return value ? validateEmail(value) : false;
      case 'phone':
        return value ? validatePhone(value) : true;
      case 'password':
        return value.length >= 6;
      case 'confirmPassword':
        return value === formData.password;
      default:
        return value.length > 0;
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const triggerShake = (fieldNames) => {
    setShakeFields(fieldNames);
    setTimeout(() => setShakeFields([]), 500);
  };

  // NEW: Send verification code
  const sendVerificationCode = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In real app, this would call your backend API
        console.log(`Sending verification code to: ${formData[loginType]}`);
        resolve(true);
      }, 1500);
    });
  };

  // NEW: Verify account with code
  const verifyAccount = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Accept "123456" for testing
        const isValid = verificationCode === "123456";
        resolve(isValid);
      }, 1000);
    });
  };

  // NEW: Generate 2FA setup data
  const generateTwoFactorSetup = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In real app, this would come from your backend
        const mockData = {
          secret: "JBSWY3DPEHPK3PXP",
          qrCode: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==",
          backupCodes: ["12345678", "23456789", "34567890", "45678901", "56789012"]
        };
        resolve(mockData);
      }, 1000);
    });
  };

  // NEW: Verify 2FA setup code
  const verifyTwoFactorSetup = async (code) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Accept "123456" for testing
        const isValid = code === "123456";
        resolve(isValid);
      }, 1000);
    });
  };

  // NEW: Complete registration and save to database
  const completeRegistration = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In real app, this would save to your database
        const userData = {
          ...formData,
          userType,
          phoneCode: loginType === 'phone' ? phoneCode : null,
          twoFactorEnabled: true,
          twoFactorSecret,
          isVerified: true
        };
        console.log("Saving to database:", userData);
        resolve(true);
      }, 1500);
    });
  };

  // UPDATED: Main signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {};
    const requiredFields = ['fullName', 'password', 'confirmPassword', 'agreeTerms'];
    
    if (loginType === 'email') {
      requiredFields.push('email');
      if (!validateEmail(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
    } else {
      requiredFields.push('phone');
      if (!validatePhone(formData.phone)) {
        errors.phone = "Please enter a valid phone number";
      }
    }

    requiredFields.forEach(field => {
      if (field === 'agreeTerms') {
        if (!formData.agreeTerms) {
          errors.agreeTerms = "You must agree to the terms";
        }
      } else if (!formData[field]) {
        errors[field] = "This field is required";
      }
    });

    if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      triggerShake(Object.keys(errors));
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Send verification code
      const verificationSent = await sendVerificationCode();
      
      if (verificationSent) {
        setVerificationMethod(loginType);
        setCurrentStep('verify');
        setFieldErrors({});
      }
    } catch (error) {
      setFieldErrors({ submit: "Failed to send verification code. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Handle verification code submission
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      setFieldErrors({ verification: "Please enter a valid 6-digit code" });
      return;
    }

    setIsVerifying(true);

    try {
      const isValid = await verifyAccount();

      if (isValid) {
        // Move to 2FA setup
        const twoFactorData = await generateTwoFactorSetup();
        setTwoFactorSecret(twoFactorData.secret);
        setTwoFactorQRCode(twoFactorData.qrCode);
        setTwoFactorBackupCodes(twoFactorData.backupCodes);
        setCurrentStep('setup2fa');
        setFieldErrors({});
      } else {
        setFieldErrors({ verification: "Invalid verification code" });
      }
    } catch (error) {
      setFieldErrors({ verification: "Verification failed. Please try again." });
    } finally {
      setIsVerifying(false);
    }
  };

  // NEW: Handle 2FA setup verification
  const handleTwoFactorSetup = async (e) => {
    e.preventDefault();

    if (!twoFactorSetupCode || twoFactorSetupCode.length !== 6) {
      setFieldErrors({ twoFactor: "Please enter a valid 6-digit code" });
      return;
    }

    setIsTwoFactorVerifying(true);

    try {
      const isValid = await verifyTwoFactorSetup(twoFactorSetupCode);

      if (isValid) {
        // Complete registration
        await completeRegistration();
        setCurrentStep('complete');
      } else {
        setFieldErrors({ twoFactor: "Invalid authentication code" });
      }
    } catch (error) {
      setFieldErrors({ twoFactor: "Setup failed. Please try again." });
    } finally {
      setIsTwoFactorVerifying(false);
    }
  };

  // NEW: Handle completion and redirect to login
  const handleCompletion = () => {
    navigate('/login');
  };

  const selectedCountry = countryCodes.find(country => country.code === phoneCode);

  // Render different steps
  const renderStep = () => {
    switch (currentStep) {
      case 'verify':
        return renderVerificationStep();
      case 'setup2fa':
        return renderTwoFactorSetupStep();
      case 'complete':
        return renderCompletionStep();
      default:
        return renderSignupStep();
    }
  };

  // NEW: Verification Step
  const renderVerificationStep = () => (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          variants={iconAnimation}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl cursor-pointer"
        >
          <Mail className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h2
          className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3"
        >
          Verify Your Account
        </motion.h2>
        <motion.p
          className="text-gray-600 text-lg mb-6"
        >
          We sent a 6-digit code to your {verificationMethod}
        </motion.p>

        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <p className="text-blue-800 text-sm font-medium">Account Verification</p>
              <p className="text-blue-600 text-xs">Enter the code sent to {formData[loginType]}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleVerificationSubmit} className="space-y-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code *
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
              if (fieldErrors.verification) {
                setFieldErrors(prev => ({ ...prev, verification: null }));
              }
            }}
            className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-center text-xl font-mono tracking-widest focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            placeholder="000000"
            maxLength={6}
            autoFocus
          />
          {fieldErrors.verification && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <XCircle className="w-4 h-4" /> {fieldErrors.verification}
            </motion.p>
          )}
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          type="submit"
          disabled={isVerifying || verificationCode.length !== 6}
          whileHover="hover"
          whileTap="tap"
          className="w-full py-5 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 
                   text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl
                   transform transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-blue-400"
            variants={pulseAnimation}
            whileHover="hover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

          <span className="relative z-10 flex items-center gap-3">
            {isVerifying ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
                Verifying...
              </>
            ) : (
              <>
                Continue to Security Setup
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </>
            )}
          </span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <motion.button
            type="button"
            onClick={() => {
              setCurrentStep('signup');
              setVerificationCode("");
              setFieldErrors({});
            }}
            variants={backLinkAnimation}
            whileHover="hover"
            whileTap="tap"
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 inline-flex items-center gap-1 group relative overflow-hidden"
          >
            <motion.span
              animate={{ x: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            >
              ←
            </motion.span>
            Back to signup
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
          </motion.button>
        </motion.div>
      </form>
    </>
  );

  // NEW: 2FA Setup Step
  const renderTwoFactorSetupStep = () => (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          variants={iconAnimation}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl cursor-pointer"
        >
          <Shield className="w-10 h-10 text-white" />
        </motion.div>

        <motion.h2
          className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent mb-3"
        >
          Setup Two-Factor Authentication
        </motion.h2>
        <motion.p
          className="text-gray-600 text-lg mb-6"
        >
          Secure your account with 2FA (Mandatory)
        </motion.p>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <p className="text-green-800 text-sm font-medium">Enhanced Security</p>
              <p className="text-green-600 text-xs">2FA is required for all account logins</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* QR Code Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-6 border-2 border-gray-100 text-center"
        >
          <h3 className="font-bold text-gray-800 mb-4">Scan QR Code</h3>
          <div className="bg-gray-50 rounded-xl p-4 inline-block mb-4">
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">QR Code would appear here</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
          </p>
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-xs text-blue-700 font-mono break-all">
              Secret: {twoFactorSecret}
            </p>
          </div>
        </motion.div>

        {/* Manual Setup Form */}
        <form onSubmit={handleTwoFactorSetup} className="space-y-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter 6-digit code from authenticator *
            </label>
            <input
              type="text"
              value={twoFactorSetupCode}
              onChange={(e) => {
                setTwoFactorSetupCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                if (fieldErrors.twoFactor) {
                  setFieldErrors(prev => ({ ...prev, twoFactor: null }));
                }
              }}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-center text-xl font-mono tracking-widest focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100"
              placeholder="000000"
              maxLength={6}
              autoFocus
            />
            {fieldErrors.twoFactor && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <XCircle className="w-4 h-4" /> {fieldErrors.twoFactor}
              </motion.p>
            )}
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            type="submit"
            disabled={isTwoFactorVerifying || twoFactorSetupCode.length !== 6}
            whileHover="hover"
            whileTap="tap"
            className="w-full py-5 px-6 bg-gradient-to-r from-green-600 to-emerald-500 
                     text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl
                     transform transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-green-400"
              variants={pulseAnimation}
              whileHover="hover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <span className="relative z-10 flex items-center gap-3">
              {isTwoFactorVerifying ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                  Verifying 2FA...
                </>
              ) : (
                <>
                  Complete Setup & Create Account
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </>
              )}
            </span>
          </motion.button>
        </form>
      </div>
    </>
  );

  // NEW: Completion Step
  // NEW: Completion Step - FIXED ICON ANIMATION
const renderCompletionStep = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-8"
  >
    {/* FIXED: Icon with proper animation */}
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 15,
        duration: 0.8 
      }}
      className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
    >
      <CheckCircle className="w-12 h-12 text-white" />
    </motion.div>

    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent mb-4"
    >
      Account Created Successfully!
    </motion.h2>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="text-gray-600 text-lg mb-8"
    >
      Your account has been secured with two-factor authentication.
      <br />
      You can now sign in with enhanced security.
    </motion.p>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="bg-green-50 rounded-2xl p-6 border border-green-200 mb-8"
    >
      <div className="flex items-center gap-3 justify-center">
        <ShieldCheck className="w-6 h-6 text-green-600" />
        <div>
          <p className="text-green-800 font-semibold">Security Features Enabled</p>
          <p className="text-green-600 text-sm">Email verification • Two-factor authentication • Encrypted data</p>
        </div>
      </div>
    </motion.div>

    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      onClick={handleCompletion}
      whileHover="hover"
      whileTap="tap"
      className="w-full py-5 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 
               text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl
               transform transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
    >
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-blue-400"
        variants={pulseAnimation}
        whileHover="hover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

      <span className="relative z-10 flex items-center gap-3">
        Continue to Login
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.div>
      </span>
    </motion.button>
  </motion.div>
);

  // Original Signup Step
  const renderSignupStep = () => (
    <>
      <motion.div
        variants={fadeInUp}
        className="text-center mb-8"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3"
        >
          Start Your Journey
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="text-gray-600 text-lg"
        >
          Join as a {userType} and make a difference
        </motion.p>
      </motion.div>

      {/* Mobile User Type Toggle */}
      <motion.div
        variants={fadeInUp}
        className="lg:hidden mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-lg"
      >
        <div className="grid grid-cols-2 gap-2">
          {userTypeOptions.map((type) => (
            <motion.button
              key={type.id}
              onClick={() => setUserType(type.id)}
              variants={buttonAnimation}
              whileHover="hover"
              whileTap="tap"
              className={`py-4 px-3 rounded-xl text-center transition-all duration-200 ${
                userType === type.id
                  ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <motion.div
                className={`w-10 h-10 bg-gradient-to-br ${type.iconColor} rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg`}
              >
                <type.icon className="w-5 h-5 text-white" />
              </motion.div>
              <div className="font-semibold text-sm">{type.label}</div>
              <div className="text-xs opacity-80 mt-1">{type.sub}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Mobile Benefits Section */}
      <motion.div
        variants={fadeInUp}
        className="lg:hidden mb-6"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
          <h3 className="font-bold text-gray-800 text-center mb-4">
            Benefits for {userType === "donor" ? "Donors" : "Recipients"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {benefits[userType].map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg`}
                >
                  <benefit.icon className="w-6 h-6 text-white" />
                </motion.div>
                <p className="text-xs text-gray-700 font-medium">{benefit.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Login Type Toggle */}
      <motion.div
        variants={fadeInUp}
        className="flex bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-1 mb-6 border border-blue-100"
      >
        {[
          { id: "email", label: "Email", icon: Mail },
          { id: "phone", label: "Phone", icon: Phone }
        ].map((type) => (
          <motion.button
            key={type.id}
            onClick={() => setLoginType(type.id)}
            variants={buttonAnimation}
            whileHover="hover"
            whileTap="tap"
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 ${
              loginType === type.id
                ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-800 hover:bg-white/60"
            }`}
          >
            <type.icon className="w-4 h-4" />
            <span className="font-medium text-sm">{type.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Signup Form */}
      <form onSubmit={handleSignup} className="space-y-5">
        {/* Full Name */}
        <motion.div
          variants={fadeInUp}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <motion.div
            variants={shakeFields.includes('fullName') ? shakeAnimation : {}}
            animate={shakeFields.includes('fullName') ? "shake" : "animate"}
            className="relative group"
          >
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-10" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm
                focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:shadow-blue-200
                hover:border-blue-300 hover:bg-white
                ${fieldErrors.fullName 
                  ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100 focus:shadow-red-200' 
                  : 'border-gray-200'
                }`}
              placeholder="Enter your full name"
            />
            {fieldErrors.fullName && (
              <XCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
            )}
          </motion.div>
          {fieldErrors.fullName && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <XCircle className="w-4 h-4" /> {fieldErrors.fullName}
            </motion.p>
          )}
        </motion.div>

        {/* Email or Phone */}
        <motion.div
          variants={fadeInUp}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {loginType === 'email' ? 'Email Address *' : 'Phone Number *'}
          </label>
          <motion.div
            variants={shakeFields.includes(loginType) ? shakeAnimation : {}}
            animate={shakeFields.includes(loginType) ? "shake" : "animate"}
            className="relative group"
          >
            {loginType === 'email' ? (
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-10" />
            ) : (
              <>
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-10" />
                
                {/* Phone Code Dropdown */}
                <div className="absolute left-12 h-full flex items-center z-20" ref={dropdownRef}>
                  <div className="relative">
                    <motion.button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      variants={buttonAnimation}
                      whileHover="hover"
                      whileTap="tap"
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <span className="text-base">{selectedCountry?.flag}</span>
                      <span className="font-medium">{selectedCountry?.code}</span>
                      <svg className={`w-3 h-3 text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.button>
                    
                    {/* Dropdown Menu */}
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-30 max-h-60 overflow-y-auto">
                        {countryCodes.map((country) => (
                          <motion.button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setPhoneCode(country.code);
                              setShowCountryDropdown(false);
                            }}
                            variants={linkAnimation}
                            whileHover="hover"
                            whileTap="tap"
                            className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0 ${
                              phoneCode === country.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            <span className="text-base">{country.flag}</span>
                            <span className="flex-1 font-medium">{country.country}</span>
                            <span className="text-gray-500 text-sm">{country.code}</span>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            <input
              type={loginType === 'email' ? 'email' : 'tel'}
              name={loginType}
              value={formData[loginType]}
              onChange={handleChange}
              className={`w-full rounded-2xl border-2 transition-all duration-300 bg-white/80 backdrop-blur-sm
                focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:shadow-blue-200
                hover:border-blue-300 hover:bg-white
                ${loginType === 'phone' ? 'pl-[9.5rem]' : 'pl-12'}
                pr-12 py-4
                ${fieldErrors[loginType] 
                  ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100 focus:shadow-red-200' 
                  : 'border-gray-200'
                }`}
              placeholder={loginType === 'email' ? 'Enter your email' : 'Enter your phone'}
            />
            {formData[loginType] && validateField(loginType, formData[loginType]) && (
              <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 z-10" />
            )}
            {fieldErrors[loginType] && (
              <XCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 z-10" />
            )}
          </motion.div>
          {fieldErrors[loginType] && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <XCircle className="w-4 h-4" /> {fieldErrors[loginType]}
            </motion.p>
          )}
        </motion.div>

        {/* Password */}
        <motion.div
          variants={fadeInUp}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <motion.div
            variants={shakeFields.includes('password') ? shakeAnimation : {}}
            animate={shakeFields.includes('password') ? "shake" : "animate"}
            className="relative group"
          >
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-10" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm
                focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:shadow-blue-200
                hover:border-blue-300 hover:bg-white
                ${fieldErrors.password 
                  ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100 focus:shadow-red-200' 
                  : 'border-gray-200'
                }`}
              placeholder="Create a strong password"
            />
            
            {/* Eye button */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                variants={eyeButtonAnimation}
                whileHover="hover"
                whileTap="tap"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-300 mt-2"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </motion.button>
            </div>
            
            {fieldErrors.password && (
              <XCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 z-10" />
            )}
          </motion.div>
          {fieldErrors.password && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <XCircle className="w-4 h-4" /> {fieldErrors.password}
            </motion.p>
          )}
        </motion.div>

        {/* Confirm Password */}
        <motion.div
          variants={fadeInUp}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
          <motion.div
            variants={shakeFields.includes('confirmPassword') ? shakeAnimation : {}}
            animate={shakeFields.includes('confirmPassword') ? "shake" : "animate"}
            className="relative group"
          >
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-10" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm
                focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:shadow-blue-200
                hover:border-blue-300 hover:bg-white
                ${fieldErrors.confirmPassword 
                  ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100 focus:shadow-red-200' 
                  : 'border-gray-200'
                }`}
              placeholder="Confirm your password"
            />
            
            {/* Eye button */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
              <motion.button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                variants={eyeButtonAnimation}
                whileHover="hover"
                whileTap="tap"
                className="text-gray-400 hover:text-blue-500 transition-colors duration-300  mt-2"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </motion.button>
            </div>
            
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <CheckCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 z-10" />
            )}
            {fieldErrors.confirmPassword && (
              <XCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 z-10" />
            )}
          </motion.div>
          {fieldErrors.confirmPassword && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <XCircle className="w-4 h-4" /> {fieldErrors.confirmPassword}
            </motion.p>
          )}
        </motion.div>

        {/* Terms Checkbox */}
        <motion.div
          variants={fadeInUp}
          className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100 group hover:border-blue-200 transition-all duration-300"
        >
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-400 mt-0.5 flex-shrink-0 transition-all duration-300"
          />
          <label className="text-sm text-gray-700">
            I agree to the{" "}
            <motion.a
              href="#terms"
              variants={linkAnimation}
              whileHover="hover"
              whileTap="tap"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 inline-flex items-center gap-1 group/terms relative overflow-hidden"
            >
              Terms of Service
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover/terms:w-full" />
            </motion.a>{" "}
            and{" "}
            <motion.a
              href="#privacy"
              variants={linkAnimation}
              whileHover="hover"
              whileTap="tap"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 inline-flex items-center gap-1 group/privacy relative overflow-hidden"
            >
              Privacy Policy
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover/privacy:w-full" />
            </motion.a>
          </label>
        </motion.div>
        {fieldErrors.agreeTerms && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm -mt-3 flex items-center gap-1">
            <XCircle className="w-4 h-4" /> {fieldErrors.agreeTerms}
          </motion.p>
        )}

        {/* Submit Error */}
        {fieldErrors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 text-red-700">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">{fieldErrors.submit}</span>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          variants={fadeInUp}
          type="submit"
          disabled={isLoading}
          whileHover="hover"
          whileTap="tap"
          className="w-full py-5 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 
                   text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl
                   transform transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          {/* Pulse Ring Effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-blue-400"
            variants={pulseAnimation}
            whileHover="hover"
          />
          
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          
          <span className="relative z-10 flex items-center gap-3">
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
                Sending Verification Code...
              </>
            ) : (
              <>
                Continue to Verification
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </>
            )}
          </span>
        </motion.button>
      </form>
    </>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 flex items-center justify-center p-4 lg:p-8"
    >
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* Left Side - Brand & Benefits */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="hidden lg:block relative"
        >
          {/* Floating background elements */}
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-xl"
            animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-24 h-24 bg-cyan-200 rounded-full opacity-20 blur-xl"
            animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="space-y-8 relative z-10">
            {/* Brand Section */}
            <motion.div
              variants={fadeInUp}
              className="space-y-6"
            >
              <motion.div
                className="flex items-center gap-4"
                variants={scaleIn}
              >
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <HeartHandshake className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-cyan-700 bg-clip-text text-transparent">
                    Join Us
                  </h1>
                  <p className="text-xl text-gray-600 mt-2">
                    Become part of something bigger
                  </p>
                </div>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="text-2xl text-gray-700 leading-relaxed font-light"
              >
                Choose your path and start making a meaningful impact today. Every action counts.
              </motion.p>
            </motion.div>

            {/* User Type Toggle */}
            <motion.div
              variants={fadeInUp}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-3 border border-white/20 shadow-2xl"
            >
              <div className="grid grid-cols-2 gap-3">
                {userTypeOptions.map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => setUserType(type.id)}
                    variants={buttonAnimation}
                    whileHover="hover"
                    whileTap="tap"
                    className={`p-6 rounded-2xl text-center transition-all duration-300 ${
                      userType === type.id
                        ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50 border border-transparent hover:border-white/30"
                    }`}
                  >
                    <motion.div
                      className={`w-12 h-12 bg-gradient-to-br ${type.iconColor} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <type.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="font-bold text-lg mb-1">{type.label}</div>
                    <div className="text-sm opacity-80">{type.sub}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Benefits Grid */}
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4"
            >
              {benefits[userType].map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <motion.div
                    className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <benefit.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="font-bold text-gray-800 text-sm mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Dynamic Form Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full"
        >
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8 border border-white/20 backdrop-blur-sm relative overflow-hidden"
          >
            {/* Animated border */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />

            {/* Security Badge - Only show on verification steps */}
            {(currentStep === 'verify' || currentStep === 'setup2fa') && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-4 right-4 flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200"
              >
                <ShieldCheck className="w-4 h-4" />
                Secure
              </motion.div>
            )}

            {/* Render current step */}
            {renderStep()}

            {/* Login Link - Only show on signup step */}
            {currentStep === 'signup' && (
              <motion.div
                variants={fadeInUp}
                className="text-center mt-6 pt-6 border-t border-gray-200"
              >
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <motion.a
                    href="/login"
                    variants={linkAnimation}
                    whileHover="hover"
                    whileTap="tap"
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 inline-flex items-center gap-1 group relative overflow-hidden"
                  >
                    Sign in here
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    >
                      →
                    </motion.span>
                    {/* Animated underline */}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                  </motion.a>
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}