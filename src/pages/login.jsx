import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users, EyeOff, Shield, Lock, ArrowRight, HeartHandshake, ShieldCheck, TrendingUp, CheckCircle, XCircle,
  Phone, Mail, Eye, AlertCircle
} from "lucide-react";
import { authAPI } from "../services/api";

const shakeAnimation = {
  initial: { x: 0 },
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.6, ease: "easeInOut" }
  }
};

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState("email");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: ""
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);
  const [shakeKey, setShakeKey] = useState(0);
  const [inputsReady, setInputsReady] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [loginContextToken, setLoginContextToken] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const fieldRefs = {
    email: useRef(null),
    phone: useRef(null),
    password: useRef(null)
  };

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

  useEffect(() => {
    const handleBackButton = (event) => {
      if (showVerification) {
        handleBackToLogin();
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [showVerification]);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail
      }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setInputsReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleInput = (e) => {
    const input = e.target;
    const fieldName = input.name;

    if (['email', 'phone', 'password'].includes(fieldName)) {
      input.setAttribute('data-autofill-prevent', Math.random().toString(36).substring(7));
      input.setAttribute('autocomplete', 'off-' + Math.random().toString(36).substring(7));
      setTimeout(() => {
        input.setAttribute('autocomplete', 'off');
      }, 5);
    }
  };

  const handleEnhancedFocus = (e) => {
    const input = e.target;
    const fieldName = input.name;

    if (['email', 'phone', 'password'].includes(fieldName)) {
      input.setAttribute('readonly', 'readonly');
      setTimeout(() => {
        input.removeAttribute('readonly');
      }, 5);
      input.setAttribute('autocomplete', 'off-' + Math.random().toString(36).substring(7));
    }
  };

  const handleKeyDown = (e) => {
    const input = e.target;
    const fieldName = input.name;

    if (['email', 'phone', 'password'].includes(fieldName)) {
      input.setAttribute('data-typing', 'true');
    }
  };

  const handlePaste = (e) => {
    const input = e.target;
    const fieldName = input.name;

    if (['email', 'phone', 'password'].includes(fieldName)) {
      e.stopPropagation();
    }
  };

  const handleMouseDown = (e) => {
    const input = e.target;
    const fieldName = input.name;

    if (['email', 'phone', 'password'].includes(fieldName)) {
      input.setAttribute('readonly', 'readonly');
      setTimeout(() => {
        input.removeAttribute('readonly');
      }, 5);
    }
  };

  const autofillStyles = `
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px white inset !important;
      box-shadow: 0 0 0 30px white inset !important;
      -webkit-text-fill-color: #000 !important;
      transition: background-color 5000s ease-in-out 0s;
    }
    
    input::-webkit-contacts-auto-fill-button,
    input::-webkit-credentials-auto-fill-button {
      visibility: hidden;
      display: none !important;
      pointer-events: none;
      height: 0;
      width: 0;
      margin: 0;
    }

    input {
      autocomplete: off;
    }

    input[type="text"],
    input[type="email"],
    input[type="password"],
    input[type="tel"] {
      -webkit-autofill: off;
      autocomplete: off;
    }
  `;

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

  const securityFeatures = [
    {
      icon: HeartHandshake,
      title: "Connect & Care",
      description: "A trusted platform connecting donors with verified recipients",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: TrendingUp,
      title: "Track Impact",
      description: "See donation progress and the difference you're making",
      color: "from-green-500 to-emerald-400"
    },
    {
      icon: Users,
      title: "Strong Community",
      description: "Join a growing network of compassionate people across India",
      color: "from-purple-500 to-pink-400"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your information is handled with care and respect",
      color: "from-yellow-500 to-orange-400"
    }
  ];

  const isValidGmail = (email) => {
    email = email.trim().toLowerCase();

    if (!email) return false;
    
    if (!email.endsWith('@gmail.com')) return false;
    
    const username = email.slice(0, -10);
    
    if (username.length === 0) return false;
    if (username.length > 64) return false;
    
    const usernameRegex = /^[a-z0-9._]+$/;
    if (!usernameRegex.test(username)) return false;
    
    if (username.includes('..')) return false;
    
    if (username.startsWith('.') || username.endsWith('.')) return false;
    
    if (username.startsWith('_')) return false;
    
    if (email.split('@gmail.com').length !== 2) return false;
    
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    
    const domain = parts[1];
    if (domain !== 'gmail.com') return false;
    
    return true;
  };

  const validatePhone = (phone) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    if (name === 'phone') {
      processedValue = value.replace(/\D/g, '');
      if (processedValue.length > 10) {
        processedValue = processedValue.slice(0, 10);
      }
      if (processedValue.length > 0) {
        if (processedValue.length <= 3) {
        } else if (processedValue.length <= 6) {
          processedValue = `${processedValue.slice(0, 3)}-${processedValue.slice(3)}`;
        } else {
          processedValue = `${processedValue.slice(0, 3)}-${processedValue.slice(3, 6)}-${processedValue.slice(6)}`;
        }
      }
    } else if (name === 'email') {
      processedValue = value.toLowerCase().replace(/\s/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
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
    setShakeKey(prev => prev + 1);
    setTimeout(() => setShakeFields([]), 500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToFirstInvalidField = (invalidFields) => {
    if (invalidFields.length > 0) {
      const fieldOrder = ['email', 'phone', 'password'];
      const firstInvalidField = fieldOrder.find(field => invalidFields.includes(field));

      if (firstInvalidField) {
        const fieldRef = fieldRefs[firstInvalidField];
        if (fieldRef && fieldRef.current) {
          setTimeout(() => {
            fieldRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            });

            const input = fieldRef.current.querySelector('input, select, textarea');
            if (input) {
              input.focus();
              if (input.type !== 'checkbox' && input.type !== 'file') {
                input.select();
              }
            }
          }, 100);
        }
      }
    }
  };

  const saveEmailToStorage = (email) => {
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  };

  const clearRememberedEmail = () => {
    localStorage.removeItem('rememberedEmail');
    setRememberMe(false);
  };

  const getDeviceInfo = () => {
    return navigator.userAgent;
};

  const handleFirstStepSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const errors = {};
    const invalidFields = [];

    if (loginType === 'email') {
      if (!formData.email) {
        errors.email = "Email is required";
        invalidFields.push('email');
      } else if (!isValidGmail(formData.email)) {
        errors.email = "Please enter a valid email address";
        invalidFields.push('email');
      }
    } else {
      if (!formData.phone) {
        errors.phone = "Phone number is required";
        invalidFields.push('phone');
      } else {
        const digitsOnly = formData.phone.replace(/\D/g, '');
        if (digitsOnly.length !== 10) {
          errors.phone = "Please enter a valid 10-digit phone number";
          invalidFields.push('phone');
        }
      }
    }

    if (!formData.password) {
      errors.password = "Password is required";
      invalidFields.push('password');
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      invalidFields.push('password');
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      triggerShake(invalidFields);
      scrollToFirstInvalidField(invalidFields);
      return;
    }

    setIsLoading(true);
    setFieldErrors({});

    try {
      const emailToUse = loginType === 'email'
        ? formData.email.trim().toLowerCase()
        : `+91${formData.phone.replace(/\D/g, '')}`;

      const loginData = {
        email: emailToUse,
        password: formData.password
      };

      const response = await authAPI.login(loginData);

      if (response.data.status === "VERIFICATION_REQUIRED") {
        setCurrentUserEmail(emailToUse);
        setLoginContextToken(response.data.loginContextToken);
        setShowVerification(true);
        setTimer(60);
        setIsTimerActive(true);
        scrollToTop();
        setFieldErrors({});
        setVerificationMessage(response.data.message || "Verification code sent to your email");
      } else {
        handleSuccessfulLogin(response.data);
      }

    } catch (error) {
      if (error.type === 'LOCKED') {
        setFieldErrors({ submit: error.message });
      } else if (error.type === 'AUTH') {
        setFieldErrors({ submit: error.message || "Invalid email or password" });
      } else if (error.type === 'NETWORK') {
        setFieldErrors({ submit: error.message });
      } else if (error.response) {
        const message = error.response.data?.message || "Login failed";
        setFieldErrors({ submit: message });
      } else {
        setFieldErrors({ submit: "An error occurred. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      setFieldErrors({ verification: "Please enter a valid 6-digit code" });
      triggerShake(['verification']);
      return;
    }

    setIsVerificationLoading(true);
    setFieldErrors({});

    try {
      const verifyData = {
        loginContextToken: loginContextToken,
        code: verificationCode,
        deviceInfo: getDeviceInfo()
      };

      const response = await authAPI.verifyLoginCode(verifyData);

      if (rememberMe && loginType === 'email') {
        saveEmailToStorage(formData.email);
      }

      handleSuccessfulLogin(response.data);

    } catch (error) {
      if (error.response) {
        const message = error.response.data?.message || "Verification failed";
        setFieldErrors({ verification: message });
      } else {
        setFieldErrors({ verification: "Verification failed. Please try again." });
      }
      triggerShake(['verification']);
    } finally {
      setIsVerificationLoading(false);
    }
  };

  const handleSuccessfulLogin = (responseData) => {
    localStorage.setItem('userSession', JSON.stringify({
      isLoggedIn: true,
      loginTime: Date.now(),
      ...responseData
    }));

    localStorage.setItem('token', responseData.token);

    setTimeout(() => {
      if (responseData.userType === 'RECIPIENT') {
        navigate('/RecipientDashboard');
      } else if (responseData.userType === 'DONOR') {
        navigate('/DonorDashboard');
      } else if (responseData.userType === 'ADMIN') {
        navigate('/AdminDashboard');
      } else {
        navigate('/DonorDashboard');
      }
    }, 100);
  };
  
  const handleResendVerification = async () => {
    if (isTimerActive && timer > 0) {
      setFieldErrors({
        verification: `Please wait ${timer} seconds before resending`
      });
      return;
    }

    setIsResendLoading(true);

    try {
      await authAPI.resendLoginCode(currentUserEmail);

      setTimer(60);
      setIsTimerActive(true);
      
      setFieldErrors({});

    } catch (error) {
      setFieldErrors({
        verification: "Failed to resend code. Please try again."
      });
    } finally {
      setIsResendLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    scrollToTop();
    navigate('/ForgotPassword');
  };

  const handleClearRememberedData = () => {
    clearRememberedEmail();
    setFormData({
      email: "",
      phone: "",
      password: ""
    });
  };

  const handleBackToLogin = () => {
    setShowVerification(false);
    setVerificationCode("");
    setCurrentUserEmail("");
    setLoginContextToken("");
    setFieldErrors({});
    scrollToTop();
  };

  const getMaskedEmail = (email) => {
    if (!email) return "";
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) return email;
    return `${localPart.slice(0, 3)}***@${domain}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 flex items-center justify-center p-4 lg:p-8"
    >
      <style>{autofillStyles}</style>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="hidden lg:block relative"
        >
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
                    Login to Continue
                  </h1>
                  <p className="text-xl text-gray-600 mt-2">
                    We're glad to see you again
                  </p>
                </div>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="text-2xl text-gray-700 leading-relaxed font-light text-justify"
              >
                A transparent donation platform connecting verified recipients with trusted donors. Track contributions, monitor needs, and see real impact all in one place.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.5,
                    type: "spring",
                    default: { duration: 0.2 }
                  }}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.1 }
                  }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/20 shadow-lg hover:shadow-xl"
                >
                  <motion.div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">{feature.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

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
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute top-4 right-4 flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200"
            >
              <ShieldCheck className="w-4 h-4" />
              Secure
            </motion.div>

            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />

            {!showVerification ? (
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
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <feature.icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <p className="text-xs text-gray-700 font-medium">{feature.title}</p>
                          <p className="text-xs text-gray-500">{feature.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {fieldErrors.success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-500 rounded-2xl p-4 mb-6"
                  >
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{fieldErrors.success}</span>
                    </div>
                  </motion.div>
                )}

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
                      type="button"
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

                <form onSubmit={handleFirstStepSubmit} className="space-y-5" autoComplete="off">
                  <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, overflow: 'hidden' }} aria-hidden="true">
                    <input type="text" name="username" autoComplete="username" tabIndex="-1" />
                    <input type="email" name="email" autoComplete="email" tabIndex="-1" />
                    <input type="password" name="fake-password" autoComplete="new-password" tabIndex="-1" />
                  </div>

                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {loginType === 'email' ? (
                        <>&nbsp;Email Address <span className="text-rose-600 font-normal normal-case">&nbsp;*</span></>
                      ) : (
                        <>&nbsp;Phone Number <span className="text-rose-600 font-normal normal-case">&nbsp;*</span></>
                      )}
                    </label>

                    {loginType === 'email' ? (
                      <div ref={fieldRefs.email} className="overflow-visible">
                        <motion.div
                          animate={shakeFields.includes('email') ? "shake" : "initial"}
                          variants={shakeAnimation}
                          className="overflow-visible relative group"
                        >
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-10" />
                          <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={handleEnhancedFocus}
                            onInput={handleInput}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                            onMouseDown={handleMouseDown}
                            maxLength={100}
                            autoComplete="off"
                            data-form-type="other"
                            data-lpignore="true"
                            data-1p-ignore="true"
                            placeholder="Enter your email"
                            className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl bg-white/80 backdrop-blur-sm
                              focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                              focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]
                              ${fieldErrors.email
                                ? 'border-rose-500 bg-red-50/50'
                                : 'border-gray-200'
                              }`}
                          />
                          <div className="absolute bottom-2 right-3 text-xs text-gray-500">
                            {formData.email.length}/100
                          </div>
                          {formData.email && isValidGmail(formData.email) && (
                            <CheckCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 z-10" />
                          )}
                          {fieldErrors.email && (
                            <XCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-rose-500 z-10" />
                          )}
                        </motion.div>
                        {fieldErrors.email && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-600 text-sm mt-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {fieldErrors.email}
                          </motion.p>
                        )}
                      </div>
                    ) : (
                      <div ref={fieldRefs.phone} className="overflow-visible">
                        <motion.div
                          animate={shakeFields.includes('phone') ? "shake" : "initial"}
                          variants={shakeAnimation}
                          className="overflow-visible"
                        >
                          <div className="flex gap-2">
                            <div className="flex-shrink-0">
                              <div className={`h-[56px] flex items-center px-4 rounded-2xl border-2 text-sm ${fieldErrors.phone
                                ? 'border-rose-500 bg-white/80'
                                : 'border-gray-200 bg-white/80'
                                }`}>
                                <div className={`flex items-center gap-2 ${formData.phone && formData.phone.replace(/\D/g, '').length > 0
                                  ? 'text-gray-900'
                                  : 'text-gray-500'
                                  }`}>
                                  <span className="text-lg">🇮🇳</span>
                                  <span className="text-sm">+91</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex-1 relative">
                              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-10" />
                              <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onFocus={handleEnhancedFocus}
                                onInput={handleInput}
                                onKeyDown={handleKeyDown}
                                onPaste={handlePaste}
                                onMouseDown={handleMouseDown}
                                placeholder="Enter your phone"
                                maxLength={12}
                                autoComplete="off"
                                data-form-type="other"
                                data-lpignore="true"
                                data-1p-ignore="true"
                                className={`w-full pl-12 pr-12 h-[56px] border-2 rounded-2xl bg-white/80 backdrop-blur-sm
                                  focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                                  focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]
                                  ${fieldErrors.phone
                                    ? 'border-rose-500 bg-red-50/50'
                                    : 'border-gray-200'
                                  }`}
                              />
                              <div className={`absolute bottom-2 right-3 text-xs ${fieldErrors.phone ? 'text-rose-600' : 'text-gray-500'
                                }`}>
                                {formData.phone.replace(/\D/g, '').length}/10
                              </div>
                              {formData.phone && formData.phone.replace(/\D/g, '').length === 10 && (
                                <CheckCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 z-10" />
                              )}
                              {fieldErrors.phone && (
                                <XCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-rose-500 z-10" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                        {fieldErrors.phone && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-600 text-sm mt-2 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" /> {fieldErrors.phone}
                          </motion.p>
                        )}
                      </div>
                    )}
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        &nbsp;Password <span className="text-rose-600 font-normal normal-case">&nbsp;*</span>
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
                    <div ref={fieldRefs.password} className="overflow-visible">
                      <motion.div
                        key={`password-${shakeKey}`}
                        animate={shakeFields.includes('password') ? "shake" : "initial"}
                        variants={shakeAnimation}
                        className="overflow-visible relative group"
                      >
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-10" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={handleEnhancedFocus}
                          onInput={handleInput}
                          onKeyDown={handleKeyDown}
                          onPaste={handlePaste}
                          onMouseDown={handleMouseDown}
                          maxLength={50}
                          autoComplete="new-password"
                          data-form-type="other"
                          data-lpignore="true"
                          data-1p-ignore="true"
                          data-autofill-prevent="true"
                          aria-autocomplete="none"
                          placeholder="Enter your password"
                          className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl bg-white/80 backdrop-blur-sm
                            focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                            focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]
                            ${fieldErrors.password
                              ? 'border-rose-500 bg-red-50/50'
                              : 'border-gray-200'
                            }`}
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 flex items-center gap-1">
                          {formData.password && formData.password.length >= 6 && (
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                          )}
                          {fieldErrors.password && (
                            <XCircle className="w-5 h-5 text-rose-600" />
                          )}
                          <motion.button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            variants={eyeButtonAnimation}
                            whileHover="hover"
                            whileTap="tap"
                            className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                    {fieldErrors.password && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-600 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {fieldErrors.password}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    variants={fadeInUp}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100 group hover:border-blue-200 transition-all duration-300"
                  >
                    <div className="overflow-visible w-full">
                      <motion.div
                        className="overflow-visible flex items-start gap-3 w-full"
                      >
                        <input
                          type="checkbox"
                          id="remember"
                          checked={rememberMe}
                          onChange={handleRememberMeChange}
                          autoComplete="off"
                          className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-0.5 flex-shrink-0 transition-all duration-300"
                        />
                        <label htmlFor="remember" className="text-sm text-gray-700 font-medium flex-1">
                          Remember me on this device
                        </label>

                        {localStorage.getItem('rememberedEmail') && (
                          <motion.button
                            type="button"
                            onClick={handleClearRememberedData}
                            variants={linkAnimation}
                            whileHover="hover"
                            whileTap="tap"
                            className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors duration-300"
                          >
                            Clear
                          </motion.button>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>

                  {rememberMe && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4"
                    >
                      <div className="flex items-center gap-2 text-yellow-700">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Your email will be remembered on this device. Do not use this option on shared devices.
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {fieldErrors.submit && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-rose-50 border border-rose-500 rounded-2xl p-4"
                    >
                      <div className="flex items-center gap-2 text-rose-700">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{fieldErrors.submit}</span>
                      </div>
                    </motion.div>
                  )}

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
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-blue-400"
                      variants={pulseAnimation}
                      whileHover="hover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                    <span className="relative z-10 flex items-center gap-3">
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                          />
                          Logging in...
                        </>
                      ) : (
                        <>
                          Login
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
                    <Shield className="w-10 h-10 text-white" />
                  </motion.div>

                  <motion.h2
                    className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3"
                  >
                    Verify It's You
                  </motion.h2>
                  <motion.p
                    className="text-gray-600 text-lg mb-6"
                  >
                    We sent a 6-digit code to your email
                  </motion.p>

                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <p className="text-blue-800 text-sm font-medium">Verification Required</p>
                        <p className="text-blue-600 text-xs">
                          Enter the code sent to {getMaskedEmail(currentUserEmail)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {verificationMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-green-600 text-sm"
                    >
                      {verificationMessage}
                    </motion.div>
                  )}
                </motion.div>

                <form onSubmit={handleVerificationSubmit} className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      &nbsp;Verification Code <span className="text-rose-600 font-normal normal-case">&nbsp;*</span>
                    </label>
                    <motion.div
                      animate={shakeFields.includes('verification') ? "shake" : "initial"}
                      variants={shakeAnimation}
                      className="overflow-visible"
                    >
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => {
                          setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                          if (fieldErrors.verification) {
                            setFieldErrors(prev => ({ ...prev, verification: null }));
                          }
                        }}
                        onFocus={handleEnhancedFocus}
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        onMouseDown={handleMouseDown}
                        autoComplete="off"
                        data-form-type="other"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        placeholder="------"
                        className={`w-full px-4 py-4 border-2 rounded-2xl text-center text-xl font-mono tracking-widest focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                          ${fieldErrors.verification
                            ? 'border-rose-500 bg-white-50 focus:border-rose-500 focus:ring-rose-100'
                            : 'border-gray-200 focus:border-blue-400 focus:ring-blue-100'
                          }`}
                        maxLength={6}
                        autoFocus
                      />
                    </motion.div>
                    {fieldErrors.verification && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-600 text-sm mt-2 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {fieldErrors.verification}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="text-center"
                  >
                    <motion.button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isTimerActive && timer > 0 || isResendLoading || isVerificationLoading}
                      variants={linkAnimation}
                      whileHover="hover"
                      whileTap="tap"
                      className={`font-semibold transition-colors duration-300 inline-flex items-center gap-1 group relative overflow-hidden ${
                        (isTimerActive && timer > 0) || isResendLoading || isVerificationLoading
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-blue-600 hover:text-blue-700"
                      }`}
                    >
                      {isResendLoading || isVerificationLoading ? (
                        "Sending..."
                      ) : isTimerActive && timer > 0 ? (
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

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    type="submit"
                    disabled={isVerificationLoading || verificationCode.length !== 6}
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
                      {isVerificationLoading ? (
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
                          Verify & Continue
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
                      onClick={handleBackToLogin}
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
                      Back to login
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                    </motion.button>
                  </motion.div>
                </form>
              </>
            )}

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