import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, ArrowRight, HeartHandshake,
  ShieldCheck, TrendingUp, Star, Zap, Target, Globe,
  CheckCircle, XCircle, Phone, User
} from "lucide-react";

export default function Login() {
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

  // Enhanced Animation Variants - Fixed stacking issue
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

  // FIXED: Eye button animation without any position changes
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

  // FIXED: Better link animation without stacking
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

  // Benefits data
  const benefits = [
    {
      icon: ShieldCheck,
      title: "Bank-Level Security",
      description: "Your data is protected with enterprise-grade encryption",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: TrendingUp,
      title: "Real-time Dashboard",
      description: "Track your impact and donations in real-time",
      color: "from-green-500 to-emerald-400"
    },
    {
      icon: Target,
      title: "Smart Matching",
      description: "Connect with causes that match your interests",
      color: "from-purple-500 to-pink-400"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Join thousands making a difference worldwide",
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
      default:
        return value.length > 0;
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      } else if (!validatePhone(formData.phone)) {
        errors.phone = "Please enter a valid phone number";
      }
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      triggerShake(Object.keys(errors));
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    console.log("Login successful:", { ...formData, phoneCode });
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
                    Welcome Back
                  </h1>
                  <p className="text-xl text-gray-600 mt-2">
                    Continue your journey of impact
                  </p>
                </div>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="text-2xl text-gray-700 leading-relaxed font-light"
              >
                Your dedication is changing lives. Sign in to continue making a difference in your community and beyond.
              </motion.p>
            </motion.div>

            {/* Benefits Grid */}
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4"
            >
              {benefits.map((benefit, index) => (
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
            {/* Animated border */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />

            {/* Form Header */}
            <motion.div
              variants={fadeInUp}
              className="text-center mb-8"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3"
              >
                Welcome Back
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-gray-600 text-lg"
              >
                Sign in to continue your impact journey
              </motion.p>
            </motion.div>

            {/* Mobile Benefits Section */}
            <motion.div
              variants={fadeInUp}
              className="lg:hidden mb-6"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
                <h3 className="font-bold text-gray-800 text-center mb-4">
                  Why Sign In?
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {benefits.map((benefit, index) => (
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

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
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

              {/* Password - FIXED: Eye button positioning */}
              <motion.div
                variants={fadeInUp}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  {/* FIXED: Better underline animation without stacking */}
                  <motion.a
                    href="#forgot"
                    variants={linkAnimation}
                    whileHover="hover"
                    whileTap="tap"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300 inline-flex items-center gap-1 group relative overflow-hidden"
                  >
                    Forgot password?
                    {/* Simple CSS transition for underline - more reliable */}
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

                  {/* FIXED: Eye button with proper positioning */}
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
                  Remember me for 30 days
                </label>
              </motion.div>

              {/* Submit Button - Enhanced with pulse animation */}
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
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In to Your Account
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

            {/* Divider */}
            <motion.div
              variants={fadeInUp}
              className="my-6 flex items-center"
            >
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <span className="px-4 text-sm text-gray-500 font-medium">Or continue with</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </motion.div>

            {/* Google Login Button - Matching Login Button Style */}
            <motion.button
              variants={fadeInUp}
              whileHover={{
                scale: 1.02,
                y: -2,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 bg-white border-2 border-gray-200 
             rounded-2xl hover:border-blue-300 hover:bg-blue-50/50 
             transition-all duration-300 group shadow-lg hover:shadow-xl 
             relative overflow-hidden flex items-center justify-center gap-3"
            >
              {/* Animated background gradient - matching login button style */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
              />

              {/* Shine Effect - matching login button */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

              {/* Google Icon */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </motion.div>

              {/* Text - matching login button typography */}
              <span className="text-gray-700 font-semibold group-hover:text-gray-900 transition-colors duration-300 relative z-10">
                Continue with Google
              </span>
            </motion.button>

            {/* Sign Up Link - FIXED: Better underline animation */}
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
                  {/* Simple CSS transition for underline - more reliable */}
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