import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import {
  Eye, EyeOff, Mail, Lock, ArrowRight, HeartHandshake,
  ShieldCheck, TrendingUp, Star, Zap, Target, Globe,
  CheckCircle, XCircle, Phone, User, Shield, Key, Fingerprint, Clock
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState("email");
  const [phoneCode, setPhoneCode] = useState("+92");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: ""
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // MANDATORY 2FA - Always enabled
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isTwoFactorLoading, setIsTwoFactorLoading] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState("email"); // email, phone, or authenticator

  // NEW: Remember me state
  const [rememberMe, setRememberMe] = useState(false);

  const dropdownRef = useRef(null);

  const [currentUserIdentifier, setCurrentUserIdentifier] = useState("");

  // Add these with your other state variables
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Timer effect - ONLY for resend cooldown
  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // Start timer when moving to 2FA step
  useEffect(() => {
    if (showTwoFactor && verificationMethod !== 'authenticator') {
      setTimer(60); // 60 seconds cooldown for resend
      setIsTimerActive(true);
    }
  }, [showTwoFactor, verificationMethod]);

  // Fix for browser back button scroll position
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const handlePageShow = (event) => {
      if (event.persisted) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  // Handle browser back button when in 2FA mode
  useEffect(() => {
    const handleBackButton = (event) => {
      if (showTwoFactor) {
        setShowTwoFactor(false);
        setTwoFactorCode("");
        setFieldErrors({});
        scrollToTop();
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [showTwoFactor]);

  // Load remembered credentials on component mount
  useEffect(() => {
    const rememberedCredentials = localStorage.getItem('rememberedCredentials');
    if (rememberedCredentials) {
      try {
        const credentials = JSON.parse(rememberedCredentials);
        setFormData({
          email: credentials.email || "",
          phone: credentials.phone || "",
          password: ""
        });
        setRememberMe(true);
      } catch (error) {
        console.error('Error loading remembered credentials:', error);
      }
    }
  }, []);

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

  // Animation Variants
  const fadeInUp = {
    initial: { y: 40, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
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

  // Security Features
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

  // Enhanced Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+\d{1,4}[\d\s-()]{8,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validatePassword = (password) => {
    return password.length > 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const triggerShake = (fieldNames) => {
    setShakeFields(fieldNames);
    setTimeout(() => setShakeFields([]), 500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveCredentialsToStorage = () => {
    if (rememberMe) {
      const credentialsToSave = {
        email: formData.email,
        phone: formData.phone,
        timestamp: Date.now()
      };
      localStorage.setItem('rememberedCredentials', JSON.stringify(credentialsToSave));
    } else {
      localStorage.removeItem('rememberedCredentials');
    }
  };

  const clearRememberedCredentials = () => {
    localStorage.removeItem('rememberedCredentials');
    setRememberMe(false);
  };

  // 🔄 FIXED: First step login handler with better error handling
const handleFirstStepSubmit = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("🔄 Login form submitted");

  if (loginAttempts >= 5) {
    setFieldErrors({
      submit: "Too many login attempts. Please try again in 15 minutes."
    });
    return;
  }

  const errors = {};

  if (loginType === 'email') {
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
  } else {
    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!validatePhone(phoneCode + formData.phone)) {
      errors.phone = "Please enter a valid phone number with country code";
    }
  }

  if (!formData.password) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    console.log("❌ Form validation errors:", errors);
    setFieldErrors(errors);
    triggerShake(Object.keys(errors));
    setLoginAttempts(prev => prev + 1);
    return;
  }

  setIsLoading(true);
  console.log("🔄 Starting API call...");

  try {
    const loginData = {
      password: formData.password,
    };

    if (loginType === 'email') {
      loginData.email = formData.email;
    } else {
      loginData.phone = phoneCode + formData.phone;
    }

    console.log("📤 Sending login data:", { ...loginData, password: '***' });

    const response = await authAPI.login(loginData);
    console.log("📥 Login API response:", response);

    if (response.data.success) {
      console.log("✅ Login successful, moving to 2FA");
      saveCredentialsToStorage();

      const identifier = loginType === 'email' ? formData.email : phoneCode + formData.phone;
      setCurrentUserIdentifier(identifier);

      const verificationMethod = response.data.verificationMethod || 'email';
      setVerificationMethod(verificationMethod);

      setShowTwoFactor(true);
      setFieldErrors({});
      scrollToTop();

      window.history.pushState({ showTwoFactor: true }, '', window.location.pathname);

    } else {
      console.log("❌ Login failed in response:", response.data);
      throw new Error(response.data.message || "Login failed");
    }

  } catch (error) {
    console.error("🔥 CATCH BLOCK - Login error:", {
      name: error.name,
      message: error.message,
      response: error.response,
      stack: error.stack
    });

    // Check if this is a network error or actual API error
    if (!error.response) {
      console.log("🌐 Network error - no response received");
      setFieldErrors({
        submit: "Network error. Please check your connection and try again."
      });
    } else {
      console.log("📡 API error with response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });

      let errorMessage = "Invalid email/phone or password. Please try again.";
      
      if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.status === 401) {
        errorMessage = "Invalid credentials. Please check your email/phone and password.";
      } else if (error.response.status === 404) {
        errorMessage = "No account found with this email/phone. Please sign up first.";
      } else if (error.response.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }

      setFieldErrors({ submit: errorMessage });
    }
    
    setLoginAttempts(prev => prev + 1);
  } finally {
    console.log("🏁 Login process completed");
    setIsLoading(false);
  }
};

  // 🔄 COMPLETELY FIXED: 2FA verification handler
  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault();

    if (!twoFactorCode || twoFactorCode.length !== 6) {
      setFieldErrors({ twoFactor: "Please enter a valid 6-digit code" });
      return;
    }

    setIsTwoFactorLoading(true);
    setFieldErrors({});

    try {
      let response;
      const verificationData = {
        code: twoFactorCode
      };

      console.log("Starting 2FA verification with method:", verificationMethod);

      // 🔄 FIXED: Use the correct verification method determined from login response
      switch (verificationMethod) {
        case 'email':
          verificationData.email = currentUserIdentifier;
          response = await authAPI.verifyLoginEmail(verificationData);
          break;

        case 'phone':
          verificationData.phone = currentUserIdentifier;
          response = await authAPI.verifyLoginPhone(verificationData);
          break;

        case 'authenticator':
          // For authenticator, we need to use the authenticator-specific endpoint
          verificationData.email = loginType === 'email' ? currentUserIdentifier : undefined;
          verificationData.phone = loginType === 'phone' ? currentUserIdentifier : undefined;
          response = await authAPI.verifyAuthenticatorLogin(verificationData);
          break;

        default:
          // Fallback to email if method not specified
          verificationData.email = currentUserIdentifier;
          response = await authAPI.verifyLoginEmail(verificationData);
      }

      console.log("2FA verification response:", response.data);

      if (response.data.success) {
        // 🔄 FIXED: Handle successful verification
        handleSuccessfulLogin(response.data);
      } else {
        // 🔄 FIXED: Handle backend error messages properly
        const errorMessage = response.data.message || "Invalid verification code";

        if (errorMessage.includes('authenticator') || errorMessage.includes('Authenticator')) {
          setFieldErrors({
            twoFactor: "This account uses authenticator. Please use your authenticator app code."
          });
          setVerificationMethod('authenticator');
        } else if (errorMessage.includes('expired') || errorMessage.includes('Expired')) {
          setFieldErrors({
            twoFactor: "Verification code has expired. Please request a new one."
          });
        } else if (errorMessage.includes('attempts') || errorMessage.includes('Attempts')) {
          setFieldErrors({
            twoFactor: "Too many failed attempts. Please request a new code."
          });
        } else {
          setFieldErrors({ twoFactor: errorMessage });
        }
      }

    } catch (error) {
      console.error("2FA verification error:", error);

      // 🔄 FIXED: Enhanced error handling with specific messages
      if (error.response?.status === 401) {
        setFieldErrors({
          twoFactor: "Invalid verification code. Please check the code and try again."
        });
      } else if (error.response?.status === 410) {
        setFieldErrors({
          twoFactor: "Verification code has expired. Please request a new code."
        });
      } else if (error.response?.status === 429) {
        setFieldErrors({
          twoFactor: "Too many verification attempts. Please wait before trying again."
        });
      } else if (error.response?.status === 400) {
        setFieldErrors({
          twoFactor: error.response.data?.message || "Invalid request. Please check your input."
        });
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        setFieldErrors({
          twoFactor: "Network error. Please check your connection and try again."
        });
      } else if (error.response?.data?.message) {
        setFieldErrors({
          twoFactor: error.response.data.message
        });
      } else {
        setFieldErrors({
          twoFactor: "Verification failed. Please try again."
        });
      }
    } finally {
      setIsTwoFactorLoading(false);
    }
  };

  // Handle successful login
  const handleSuccessfulLogin = (responseData) => {
    console.log("Secure login successful with 2FA");

    const loginSession = {
      isLoggedIn: true,
      loginTime: Date.now(),
      rememberMe: rememberMe,
      userType: responseData.user?.userType || 'authenticated',
      userData: responseData.user || {},
      token: responseData.token
    };

    localStorage.setItem('userSession', JSON.stringify(loginSession));

    if (responseData.token) {
      localStorage.setItem('authToken', responseData.token);
    }

    scrollToTop();
    setTimeout(() => {
      navigate('/AdminDashboard');
    }, 100);
  };

  // 🔄 FIXED: Resend verification functionality with timer
  const handleResendVerification = async () => {
    // Check if timer is active
    if (isTimerActive && timer > 0) {
      setFieldErrors({
        twoFactor: `Please wait ${timer} seconds before resending`
      });
      return;
    }

    try {
      setFieldErrors({});

      const resendData = {
        type: 'login'
      };

      // Add identifier based on login type
      if (loginType === 'email') {
        resendData.email = currentUserIdentifier;
      } else {
        resendData.phone = currentUserIdentifier;
      }

      console.log("Resending verification to:", currentUserIdentifier);

      const response = await authAPI.resendVerification(resendData);

      if (response.data.success) {
        console.log("Verification code resent successfully");

        // Start the timer
        setTimer(60);
        setIsTimerActive(true);

        setFieldErrors({
          success: "New verification code sent successfully!"
        });

        setTimeout(() => {
          setFieldErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.success;
            return newErrors;
          });
        }, 3000);

      } else {
        throw new Error(response.data.message || "Failed to resend verification code");
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      setFieldErrors({
        twoFactor: error.response?.data?.message ||
          "Failed to resend verification code. Please try again."
      });
    }
  };

  const handleForgotPasswordClick = () => {
    scrollToTop();
    navigate('/forgot-password');
  };

  const handleClearRememberedData = () => {
    clearRememberedCredentials();
    setFormData({
      email: "",
      phone: "",
      password: ""
    });
  };

  const selectedCountry = countryCodes.find(country => country.code === phoneCode);

  // 🔄 FIXED: Get display text for verification method
  const getVerificationMethodText = () => {
    switch (verificationMethod) {
      case 'email':
        return 'email';
      case 'phone':
        return 'phone';
      case 'authenticator':
        return 'authenticator app';
      default:
        return 'email';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 flex items-center justify-center p-4 lg:p-8"
    >
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        {/* Left Side - Brand & Security Benefits */}
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
                  <Shield className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-cyan-700 bg-clip-text text-transparent">
                    Secure Login
                  </h1>
                  <p className="text-xl text-gray-600 mt-2">
                    Enhanced security verification
                  </p>
                </div>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="text-2xl text-gray-700 leading-relaxed font-light"
              >
                Your security is our top priority. We use enterprise-grade encryption and multi-factor authentication to protect your account.
              </motion.p>
            </motion.div>

            {/* Security Features Grid */}
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4"
            >
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <motion.div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="font-bold text-gray-800 text-sm mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Security Notice */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-bold text-blue-800 text-sm">Enhanced Security Protocol</h4>
                  <p className="text-blue-600 text-xs">Multi-factor authentication ensures account protection</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
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
            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute top-4 right-4 flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200"
            >
              <ShieldCheck className="w-4 h-4" />
              Secure
            </motion.div>

            {/* Animated border */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />

            {/* STEP 1: Email/Password Form */}
            {!showTwoFactor ? (
              <>
                <motion.div
                  variants={fadeInUp}
                  className="text-center mb-8"
                >
                  <motion.h2
                    variants={fadeInUp}
                    className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3 mt-6"
                  >
                    Welcome Back
                  </motion.h2>
                  <motion.p
                    variants={fadeInUp}
                    className="text-gray-600 text-lg"
                  >
                    Sign in to your account
                  </motion.p>
                </motion.div>

                {/* Mobile Security Features */}
                <motion.div
                  variants={fadeInUp}
                  className="lg:hidden mb-6"
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
                    <h3 className="font-bold text-gray-800 text-center mb-4">
                      Security Features
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {securityFeatures.map((feature, index) => (
                        <motion.div
                          key={index}
                          className="text-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <motion.div
                            className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg`}
                          >
                            <feature.icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <p className="text-xs text-gray-700 font-medium">{feature.title}</p>
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
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 ${loginType === type.id
                        ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-800 hover:bg-white/60"
                        }`}
                    >
                      <type.icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{type.label}</span>
                    </motion.button>
                  ))}
                </motion.div>

                <form onSubmit={handleFirstStepSubmit} className="space-y-5">
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
                                      className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0 ${phoneCode === country.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
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
                      {formData[loginType] && (
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
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Password *
                      </label>
                      <motion.button
                        type="button"
                        onClick={handleForgotPasswordClick}
                        variants={linkAnimation}
                        whileHover="hover"
                        whileTap="tap"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300 inline-flex items-center gap-1 group relative overflow-hidden"
                      >
                        Forgot password?
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                      </motion.button>
                    </div>
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
                        placeholder="Enter your password"
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

                      {formData.password && formData.password.length >= 1 && (
                        <CheckCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 z-10" />
                      )}
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

                  {/* Remember Me */}
                  <motion.div
                    variants={fadeInUp}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100 group hover:border-blue-200 transition-all duration-300"
                  >
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                      className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-400 transition-all duration-300 cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-700 font-medium cursor-pointer flex-1">
                      Remember this device for 30 days
                    </label>

                    {/* Clear remembered data button - only show if there are remembered credentials */}
                    {localStorage.getItem('rememberedCredentials') && (
                      <motion.button
                        type="button"
                        onClick={handleClearRememberedData}
                        variants={linkAnimation}
                        whileHover="hover"
                        whileTap="tap"
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors duration-300"
                      >
                        Clear
                      </motion.button>
                    )}
                  </motion.div>

                  {/* Security Notice for Remember Me */}
                  {rememberMe && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4"
                    >
                      <div className="flex items-center gap-2 text-yellow-700">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Your email/phone will be remembered on this device for 30 days. Do not use this option on shared devices.
                        </span>
                      </div>
                    </motion.div>
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
                          Verifying...
                        </>
                      ) : (
                        <>
                          Continue to Verify
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
            ) : (
              /* STEP 2: 2FA Verification */
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-8"
                >
                  {/* ANIMATED ICON FOR 2FA HEADING */}
                  <motion.div
                    variants={iconAnimation}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl cursor-pointer"
                  >
                    <ShieldCheck className="w-10 h-10 text-white" />
                  </motion.div>

                  <motion.h2
                    className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3"
                  >
                    Security Verification Required
                  </motion.h2>
                  <motion.p
                    className="text-gray-600 text-lg mb-6"
                  >
                    {verificationMethod === 'authenticator'
                      ? 'Check your authenticator app for the verification code'
                      : `Check your ${getVerificationMethodText()} for the verification code`
                    }
                  </motion.p>

                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <p className="text-blue-800 text-sm font-medium">Verify It's You</p>
                        <p className="text-blue-600 text-xs">
                          {verificationMethod === 'authenticator'
                            ? 'Enter the 6-digit code from your authenticator app'
                            : `Enter the 6-digit code sent to ${currentUserIdentifier}`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <form onSubmit={handleTwoFactorSubmit} className="space-y-5">
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
                      value={twoFactorCode}
                      onChange={(e) => {
                        setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                        if (fieldErrors.twoFactor) {
                          setFieldErrors(prev => ({ ...prev, twoFactor: null }));
                        }
                      }}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-center text-xl font-mono tracking-widest focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                      placeholder="000000"
                      maxLength={6}
                      autoFocus
                    />
                    {fieldErrors.twoFactor && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {fieldErrors.twoFactor}
                      </motion.p>
                    )}

                    {/* Success message for resend */}
                    {fieldErrors.success && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500 text-sm mt-2 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> {fieldErrors.success}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Resend Code Option - Only show for email/phone, not authenticator */}
                  {verificationMethod !== 'authenticator' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="text-center"
                    >
                      <motion.button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={isTimerActive && timer > 0}
                        variants={linkAnimation}
                        whileHover="hover"
                        whileTap="tap"
                        className={`font-semibold transition-colors duration-300 inline-flex items-center gap-1 group relative overflow-hidden ${isTimerActive && timer > 0
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-blue-600 hover:text-blue-700"
                          }`}
                      >
                        {isTimerActive && timer > 0 ? (
                          `Resend available in ${timer}s`
                        ) : (
                          <>
                            Didn't receive code? Resend
                            <motion.span
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="group-hover:translate-x-1 transition-transform duration-300"
                            >
                              →
                            </motion.span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Verify Button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    type="submit"
                    disabled={isTwoFactorLoading || twoFactorCode.length !== 6}
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full py-5 px-6 bg-gradient-to-r from-green-600 to-emerald-500 
                             text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl
                             transform transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                  >
                    {/* Pulse Ring Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-green-400"
                      variants={pulseAnimation}
                      whileHover="hover"
                    />

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                    <span className="relative z-10 flex items-center gap-3">
                      {isTwoFactorLoading ? (
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
                          Verify & Login to Your Account
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

                  {/* Back to Login Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                  >
                    <motion.button
                      type="button"
                      onClick={() => {
                        setShowTwoFactor(false);
                        setTwoFactorCode("");
                        setFieldErrors({});
                        scrollToTop();
                        window.history.back();
                      }}
                      variants={linkAnimation}
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
                      Back to login
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                    </motion.button>
                  </motion.div>
                </form>
              </>
            )}

            {/* Sign Up Link */}
            <motion.div
              variants={fadeInUp}
              className="text-center mt-6 pt-6 border-t border-gray-200"
            >
              <p className="text-gray-600">
                Don't have an account?{" "}
                <motion.a
                  href="/signup"
                  variants={linkAnimation}
                  whileHover="hover"
                  whileTap="tap"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 inline-flex items-center gap-1 group relative overflow-hidden"
                >
                  Create account
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  >
                    →
                  </motion.span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                </motion.a>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}