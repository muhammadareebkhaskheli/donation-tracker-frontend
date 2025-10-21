import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

  const dropdownRef = useRef(null);

  // Fixed credentials for testing
  const FIXED_CREDENTIALS = {
    email: "makhaskheli911@gmail.com",
    phone: "+923001234567",
    password: "Areeb@911"
  };

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

  // Enhanced Animation Variants
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

  // Back to login animation - FIXED to match other links
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

  // Icon animation for 2FA heading
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
    return password.length >= 8;
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

  const triggerShake = (fieldNames) => {
    setShakeFields(fieldNames);
    setTimeout(() => setShakeFields([]), 500);
  };

  // Check if credentials match our fixed ones
  const checkCredentials = () => {
    if (loginType === 'email') {
      return formData.email === FIXED_CREDENTIALS.email &&
        formData.password === FIXED_CREDENTIALS.password;
    } else {
      const fullPhone = phoneCode + formData.phone.replace(/\D/g, '');
      return fullPhone === FIXED_CREDENTIALS.phone &&
        formData.password === FIXED_CREDENTIALS.password;
    }
  };

  // Simulate 2FA code sending
  const sendTwoFactorCode = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  // Verify 2FA code - Accept "123456" for testing
  const verifyTwoFactorCode = async (code) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const isValid = code === "123456";
        resolve(isValid);
      }, 1000);
    });
  };

  const handleFirstStepSubmit = async (e) => {
    e.preventDefault();

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
    } else if (!validatePassword(formData.password)) {
      errors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      triggerShake(Object.keys(errors));
      setLoginAttempts(prev => prev + 1);
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (checkCredentials()) {
        await sendTwoFactorCode();
        setShowTwoFactor(true);
        setFieldErrors({});
      } else {
        throw new Error("Invalid email/phone or password");
      }

    } catch (error) {
      setFieldErrors({
        submit: "Invalid email/phone or password. Please try again."
      });
      setLoginAttempts(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault();

    if (!twoFactorCode || twoFactorCode.length !== 6) {
      setFieldErrors({ twoFactor: "Please enter a valid 6-digit code" });
      return;
    }

    setIsTwoFactorLoading(true);

    try {
      const isValid = await verifyTwoFactorCode(twoFactorCode);

      if (isValid) {
        console.log("Secure login successful with 2FA");
        navigate('/dashboard');
      } else {
        setFieldErrors({ twoFactor: "Invalid verification code" });
      }
    } catch (error) {
      setFieldErrors({ twoFactor: "Verification failed. Please try again." });
    } finally {
      setIsTwoFactorLoading(false);
    }
  };

  const selectedCountry = countryCodes.find(country => country.code === phoneCode);

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

        {/* Right Side - Login Form - RESTORED ORIGINAL WIDTH */}
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
                      <motion.a
                        href="#forgot"
                        variants={linkAnimation}
                        whileHover="hover"
                        whileTap="tap"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300 inline-flex items-center gap-1 group relative overflow-hidden"
                      >
                        Forgot password?
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                      </motion.a>
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

                      {formData.password && formData.password.length >= 8 && (
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
                      className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-400 transition-all duration-300"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-700 font-medium">
                      Remember this device for 30 days
                    </label>
                  </motion.div>

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

                  {/* Submit Button - WITH ANIMATIONS */}
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
                          Continue to 2FA
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
              /* STEP 2: 2FA Verification - WITH ANIMATED ICON AND FIXED BACK LINK */
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
                    Check your authenticator app for the code
                  </motion.p>

                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <p className="text-blue-800 text-sm font-medium">Two-Factor Authentication</p>
                        <p className="text-blue-600 text-xs">Enter the 6-digit verification code</p>
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
                  </motion.div>

                  {/* Verify Button - WITH ANIMATIONS */}
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

                  {/* Back to Login Button - FIXED ANIMATION TO MATCH OTHERS */}
                  {/* Back to Login Button - FIXED TO MATCH CREATE ACCOUNT EXACTLY */}
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

            {/* Sign Up Link - WITH ANIMATIONS */}
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