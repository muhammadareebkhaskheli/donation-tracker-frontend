import { useState, useRef, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, HeartHandshake, ShieldCheck, TrendingUp, Star, Zap,
  Target, CheckCircle, XCircle, Globe, Gift, HandHeart, Shield, Clock, AlertCircle
} from "lucide-react";
import { authAPI } from "../services/api";

const shakeAnimation = {
  initial: {
    x: 0
  },
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

const PasswordStrengthIndicator = memo(({ password, isDark }) => {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;
    return score;
  };

  const strength = getStrength();
  const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength - 1] || 'Very Weak';
  const strengthColor = strength <= 2 ? 'text-rose-500' : strength <= 3 ? 'text-amber-500' : 'text-emerald-500';
  const strengthBg = strength <= 2 ? 'bg-rose-500' : strength <= 3 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Password Strength</span>
        <span className={strengthColor}>{strengthText}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <motion.div
          className={`h-full ${strengthBg}`}
          initial={{ width: 0 }}
          animate={{ width: `${strength * 20}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
});

export default function Signup() {
  const location = useLocation();
  const navigate = useNavigate();

  const getUrlParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('type');
  };

  const urlUserType = getUrlParams();
  const [userType, setUserType] = useState(urlUserType === 'recipient' ? 'recipient' : 'donor');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [inputsReady, setInputsReady] = useState(false);
  const [loginType, setLoginType] = useState("email");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeFields, setShakeFields] = useState([]);
  const [currentStep, setCurrentStep] = useState('signup');
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("email");
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentUserIdentifier, setCurrentUserIdentifier] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const passwordsMatch = formData.password && formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  const fieldRefs = {
    firstName: useRef(null),
    lastName: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
    agreeTerms: useRef(null)
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
    const t = setTimeout(() => setInputsReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (currentStep === 'verify') {
      setTimer(60);
      setIsTimerActive(true);
    }
  }, [currentStep]);

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
    scrollToTop();
  }, [currentStep]);

  useEffect(() => {
    const currentUserType = getUrlParams();
    if (currentUserType === 'recipient') {
      setUserType('recipient');
    } else {
      setUserType('donor');
    }
  }, [location.search]);

  const handleEnhancedFocus = (e) => {
    const input = e.target;
    const fieldName = input.name;

    if (['firstName', 'lastName', 'phone', 'email'].includes(fieldName)) {
      input.setAttribute('readonly', 'readonly');
      setTimeout(() => {
        input.removeAttribute('readonly');
      }, 5);
      input.setAttribute('autocomplete', 'off-' + Math.random().toString(36).substring(7));
    }
  };

  const handleInput = (e) => {
    const input = e.target;
    const fieldName = input.name;

    if (['firstName', 'lastName', 'phone', 'email'].includes(fieldName)) {
      input.setAttribute('data-autofill-prevent', Math.random().toString(36).substring(7));
      input.setAttribute('autocomplete', 'off-' + Math.random().toString(36).substring(7));
      setTimeout(() => {
        input.setAttribute('autocomplete', 'off');
      }, 5);
    }
  };

  const handleKeyDown = (e) => {
    const input = e.target;
    const fieldName = input.name;

    if (['firstName', 'lastName', 'phone', 'email'].includes(fieldName)) {
      input.setAttribute('data-typing', 'true');
    }
  };

  const handlePaste = (e) => {
    const input = e.target;
    const fieldName = input.name;

    if (['firstName', 'lastName', 'phone', 'email'].includes(fieldName)) {
      e.stopPropagation();
    }
  };

  const handleMouseDown = (e) => {
    const input = e.target;
    const fieldName = input.name;

    if (['firstName', 'lastName', 'phone', 'email'].includes(fieldName)) {
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
    background-color: white !important;
  }
  
  input[type="password"]:-webkit-autofill,
  input[type="password"]:-webkit-autofill:hover,
  input[type="password"]:-webkit-autofill:focus,
  input[type="password"]:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    box-shadow: 0 0 0 30px white inset !important;
    -webkit-text-fill-color: #000 !important;
    transition: background-color 5000s ease-in-out 0s;
    background-color: white !important;
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
    autocomplete: off !important;
  }
  
  input:-internal-autofill-selected {
    background-color: white !important;
  }
`;

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

  const benefits = {
    donor: [
      {
        icon: TrendingUp,
        title: "Real-time Impact",
        description: "Watch your donations transform lives with live updates",
        color: "from-green-500 to-emerald-400"
      },
      {
        icon: Target,
        title: "Targeted Giving",
        description: "Support causes that match your passion and interests",
        color: "from-blue-500 to-cyan-400"
      },
      {
        icon: ShieldCheck,
        title: "Verified Recipients",
        description: "Every recipient is thoroughly authenticated before receiving help",
        color: "from-purple-500 to-pink-400"
      },
      {
        icon: Star,
        title: "Donation History",
        description: "View all your contributions and their impact over time",
        color: "from-yellow-500 to-orange-400"
      }
    ],
    recipient: [
      {
        icon: Shield,
        title: "Privacy Focused",
        description: "Your personal information is kept confidential and safe",
        color: "from-blue-500 to-cyan-400"
      },
      {
        icon: Zap,
        title: "Quick Support",
        description: "Receive help from donors when you need it",
        color: "from-yellow-500 to-orange-400"
      },
      {
        icon: HeartHandshake,
        title: "Direct Help",
        description: "Connect with donors ready to support your needs",
        color: "from-pink-500 to-rose-400"
      },
      {
        icon: Globe,
        title: "Pan-India Access",
        description: "Support from generous donors across the country",
        color: "from-green-500 to-emerald-400"
      }
    ]
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isValidEmail = (email) => {
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

  const isValidPhone = (phone) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        return value ? isValidEmail(value) : false;
      case 'phone':
        return value ? isValidPhone(value) : true;
      case 'password':
        return value.length >= 6;
      case 'confirmPassword':
        return value === formData.password;
      default:
        return value.length > 0;
    }
  };

  const validatePasswordField = (password) => {
    if (!password) return false;
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/\d/.test(password)) return false;
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
    return true;
  };

  const triggerShake = (fieldNames) => {
    setShakeFields(fieldNames);
    setShakeKey(prev => prev + 1);

    if (fieldNames.includes('password')) {
      setTimeout(() => {
        fieldRefs.password.current?.focus();
      }, 100);
    } else if (fieldNames.includes('confirmPassword')) {
      setTimeout(() => {
        fieldRefs.confirmPassword.current?.focus();
      }, 100);
    }

    setTimeout(() => setShakeFields([]), 600);
  };

  const scrollToFirstInvalidField = (invalidFields) => {
    if (invalidFields.length > 0) {
      const fieldOrder = [
        'firstName', 'lastName', 'email', 'phone', 'password',
        'confirmPassword', 'agreeTerms'
      ];

      const firstInvalidField = fieldOrder.find(field =>
        invalidFields.includes(field)
      );

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    if (name === 'firstName' || name === 'lastName') {
      processedValue = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (name === 'phone') {
      processedValue = value.replace(/\D/g, '');
      if (processedValue.length > 0) {
        if (processedValue.length > 10) {
          processedValue = processedValue.slice(0, 10);
        }
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

    const previousValue = formData[name];
    if (previousValue !== processedValue) {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : processedValue
      }));

      if (fieldErrors[name]) {
        setFieldErrors(prev => ({
          ...prev,
          [name]: null
        }));
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const errors = {};
    const invalidFields = [];

    setShakeFields([]);

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
      invalidFields.push('firstName');
    } else if (!/^[A-Za-z\s]+$/.test(formData.firstName.trim())) {
      errors.firstName = "Name can only contain alphabets and spaces";
      invalidFields.push('firstName');
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
      invalidFields.push('lastName');
    } else if (!/^[A-Za-z\s]+$/.test(formData.lastName.trim())) {
      errors.lastName = "Name can only contain alphabets and spaces";
      invalidFields.push('lastName');
    }

    if (loginType === 'email') {
      if (!formData.email) {
        errors.email = "Email is required";
        invalidFields.push('email');
      } else if (!isValidEmail(formData.email)) {
        errors.email = "Please enter a valid email address";
        invalidFields.push('email');
      }
    }

    if (loginType === 'phone') {
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
    } else if (!validatePassword(formData.password)) {
      errors.password = "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
      invalidFields.push('password');
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      invalidFields.push('confirmPassword');
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      invalidFields.push('confirmPassword');
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = "You must agree to the terms";
      invalidFields.push('agreeTerms');
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
      const signupData = {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: loginType === 'email' ? formData.email : null,
        password: formData.password,
        userType: userType.toUpperCase(),
        phone: loginType === 'phone' ? `+91${formData.phone.replace(/\D/g, '')}` : null
      };

      if (!signupData.email) delete signupData.email;
      if (!signupData.phone) delete signupData.phone;

      const response = await authAPI.signup(signupData);
      if (response.data.verificationToken) {
        setVerificationToken(response.data.verificationToken);
      }

      const identifier = loginType === 'email' ? formData.email : `+91${formData.phone.replace(/\D/g, '')}`;
      setCurrentUserIdentifier(identifier);
      setVerificationMethod(loginType);
      setCurrentStep('verify');
      setVerificationMessage(response.data.message || "Verification code sent to your email");

    } catch (error) {
      console.error('Signup error:', error);

      if (error.type === 'VALIDATION') {
        if (error.message.includes('Email is already in use')) {
          setFieldErrors({ email: 'This email is already registered' });
          triggerShake(['email']);
          scrollToFirstInvalidField(['email']);
        } else if (error.message.includes('Phone number is already in use')) {
          setFieldErrors({ phone: 'This phone number is already registered' });
          triggerShake(['phone']);
          scrollToFirstInvalidField(['phone']);
        } else {
          setFieldErrors({ submit: error.message });
        }
      } else if (error.type === 'NETWORK') {
        setFieldErrors({ submit: 'Network error. Please check your connection and try again.' });
      } else {
        setFieldErrors({ submit: error.message || 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
      scrollToTop();
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      setFieldErrors({ verification: "Please enter a valid 6-digit code" });
      triggerShake(['verification']);
      return;
    }

    setIsVerifying(true);
    setFieldErrors({});

    try {
      const response = await authAPI.verifyEmail({
        email: formData.email,
        code: verificationCode
      });

      setCurrentStep('complete');
      setVerificationCode("");

    } catch (error) {
      console.error('Verification error:', error);

      if (error.type === 'VALIDATION') {
        if (error.message.includes('Invalid or expired')) {
          setFieldErrors({ verification: 'Invalid or expired verification code' });
        } else {
          setFieldErrors({ verification: error.message });
        }
      } else if (error.type === 'NETWORK') {
        setFieldErrors({ verification: 'Network error. Please check your connection.' });
      } else {
        setFieldErrors({ verification: 'Verification failed. Please try again.' });
      }

      triggerShake(['verification']);
    } finally {
      setIsVerifying(false);
      scrollToTop();
    }
  };

  const handleResendVerification = async () => {
  if (isTimerActive && timer > 0) {
    setFieldErrors({ verification: `Please wait ${timer} seconds before resending` });
    return;
  }
  
  setIsResending(true);
  setFieldErrors({});

  try {
    await authAPI.resendVerification(formData.email);
    
    setTimer(60);
    setIsTimerActive(true);
    
  } catch (error) {
    console.error('Resend error:', error);

    if (error.type === 'VALIDATION') {
      if (error.message.includes('already verified')) {
        setFieldErrors({ verification: 'This email is already verified. Please login.' });
      } else {
        setFieldErrors({ verification: error.message || 'Failed to resend code' });
      }
    } else if (error.type === 'NETWORK') {
      setFieldErrors({ verification: 'Network error. Please check your connection.' });
    } else {
      setFieldErrors({ verification: 'Failed to resend code. Please try again.' });
    }

    triggerShake(['verification']);
  } finally {
    setIsResending(false);
  }
};

  const getMaskedEmail = (email) => {
    if (!email) return "";
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) return email;
    return `${localPart.slice(0, 3)}***@${domain}`;
  };

  const handleCompletion = () => {
    scrollToTop();
    setTimeout(() => {
      navigate('/login');
    }, 100);
  };

  const handleBackToSignup = () => {
    setCurrentStep('signup');
    setVerificationCode("");
    setIsTimerActive(false);
    setFieldErrors({});
    scrollToTop();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'verify':
        return renderVerificationStep();
      case 'complete':
        return renderCompletionStep();
      default:
        return renderSignupStep();
    }
  };

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
            <p className="text-blue-600 text-xs">Enter the code sent to {getMaskedEmail(currentUserIdentifier)}</p>
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
          key={`verification-${shakeKey}`}
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
            autoComplete="off"
            className={`w-full px-4 py-4 border-2 rounded-2xl text-center text-xl font-mono tracking-widest focus:outline-none focus:ring-4 transition-all
            ${fieldErrors.verification
                ? 'border-rose-500 bg-white-50 focus:border-rose-500 focus:ring-rose-100'
                : 'border-gray-200 focus:border-blue-400 focus:ring-blue-100'
              }`}
            placeholder="------"
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
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <motion.button
          type="button"
          onClick={handleResendVerification}
          disabled={isTimerActive && timer > 0 || isResending || isVerifying}
          variants={linkAnimation}
          whileHover="hover"
          whileTap="tap"
          className={`font-semibold transition-colors duration-300 inline-flex items-center gap-1 group relative overflow-hidden ${
            isTimerActive && timer > 0 || isResending || isVerifying
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-700"
          }`}
        >
          {isResending ? (
            "Sending..."
          ) : isVerifying ? (
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
        transition={{ delay: 0.4 }}
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
              Complete Verification
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
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <motion.button
          type="button"
          onClick={handleBackToSignup}
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
            Sign In account
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
    </form>
  </>
);

  const renderCompletionStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <motion.div
        variants={iconAnimation}
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl cursor-pointer"
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
        Your account has been verified successfully.
        <br />
        You can now sign in to your account.
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
            <p className="text-green-800 font-semibold">Account Ready</p>
            <p className="text-green-600 text-sm">Email verified • Account active • Ready to use</p>
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

  const renderSignupStep = () => (
    <>
      <motion.div
        variants={fadeInUp}
        className="text-center mb-8"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-3 mt-6"
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
              className={`py-4 px-3 rounded-xl text-center transition-all duration-200 ${userType === type.id
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
                <p className="text-xs text-gray-700 font-medium mb-1">{benefit.title}</p>
                <p className="text-xs text-gray-500">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

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

      <form onSubmit={handleSignup} className="space-y-5" autoComplete="off">
        <motion.div
          variants={fadeInUp}
        >
          <div ref={fieldRefs.firstName} className="overflow-visible">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              &nbsp;First Name <span className="text-rose-600 font-normal normal-case">&nbsp;*</span>
            </label>
            <motion.div
              animate={shakeFields.includes('firstName') ? "shake" : "initial"}
              variants={shakeAnimation}
              className="overflow-visible relative group"
            >
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-10" />
              <input
                type="text"
                name="firstName"
                disabled={!inputsReady}
                value={formData.firstName}
                onChange={handleChange}
                onFocus={handleEnhancedFocus}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onMouseDown={handleMouseDown}
                maxLength={50}
                autoComplete="off"
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl bg-white/80 backdrop-blur-sm
                focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:shadow-blue-200
                hover:bg-white outline-none
                ${fieldErrors.firstName
                    ? 'border-rose-500 bg-red-50/50 focus:border-rose-500 focus:ring-rose-100 focus:shadow-rose-200'
                    : 'border-gray-200'
                  }`}
                placeholder="Enter your first name"
              />
              <div className="absolute bottom-2 right-3 text-xs text-gray-500">
                {formData.firstName.length}/50
              </div>
            </motion.div>
            {fieldErrors.firstName && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-600 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {fieldErrors.firstName}
              </motion.p>
            )}
          </div>

          <div ref={fieldRefs.lastName} className="overflow-visible mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              &nbsp;Last Name <span className="text-rose-600 font-normal normal-case">&nbsp;*</span>
            </label>
            <motion.div
              animate={shakeFields.includes('lastName') ? "shake" : "initial"}
              variants={shakeAnimation}
              className="overflow-visible relative group"
            >
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-10" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onFocus={handleEnhancedFocus}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onMouseDown={handleMouseDown}
                maxLength={50}
                autoComplete="off"
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl bg-white/80 backdrop-blur-sm
                focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:shadow-blue-200
                outline-none
                ${fieldErrors.lastName
                    ? 'border-rose-500 bg-red-50/50 focus:border-rose-500 focus:ring-rose-100 focus:shadow-rose-200'
                    : 'border-gray-200'
                  }`}
                placeholder="Enter your last name"
              />
              <div className="absolute bottom-2 right-3 text-xs text-gray-500">
                {formData.lastName.length}/50
              </div>
            </motion.div>
            {fieldErrors.lastName && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-600 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {fieldErrors.lastName}
              </motion.p>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
        >
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
                  disabled={!inputsReady}
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
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl bg-white/80 backdrop-blur-sm
                  focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                  focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:shadow-blue-200
                  outline-none no-underline
                  ${fieldErrors.email
                      ? 'border-rose-500 bg-red-50/50 focus:border-rose-500 focus:ring-rose-100 focus:shadow-rose-200'
                      : 'border-gray-200'
                    }`}
                  placeholder="Enter your email"
                />
                <div className="absolute bottom-2 right-3 text-xs text-gray-500">
                  {formData.email.length}/100
                </div>
                {formData.email && validateField('email', formData.email) && (
                  <CheckCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 z-10" />
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
                      focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:shadow-blue-200
                      outline-none no-underline
                      ${fieldErrors.phone
                          ? 'border-rose-500 bg-red-50/50 focus:border-rose-500 focus:ring-rose-100 focus:shadow-rose-200'
                          : 'border-gray-200'
                        }`}
                    />
                    <div className={`absolute bottom-2 right-3 text-xs ${fieldErrors.phone ? 'text-rose-600' : 'text-gray-500'}`}>
                      {formData.phone.replace(/\D/g, '').length}/10
                    </div>
                    {formData.phone && validateField('phone', formData.phone) && (
                      <CheckCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 z-10" />
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            &nbsp;Password <span className="text-rose-600 font-normal normal-case">&nbsp;*</span>
          </label>
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
                maxLength={50}
                autoComplete="off"
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                data-ignore="true"
                readOnly={false}
                onFocus={(e) => {
                  e.target.removeAttribute('readonly');
                  e.target.setAttribute('autocomplete', 'off');
                }}
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl bg-white/80 backdrop-blur-sm
        focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
        focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:shadow-blue-200
        outline-none no-underline
        ${fieldErrors.password
                    ? 'border-rose-500 bg-red-50/50 focus:border-rose-500 focus:ring-rose-100 focus:shadow-rose-200'
                    : 'border-gray-200'
                  }`}
                placeholder="Create a strong password"
              />

              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 flex items-center gap-1">
                {formData.password && validatePassword(formData.password) && (
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

        {formData.password && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200"
          >
            <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-700">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              Password Requirements:
            </h4>
            <ul className="text-xs space-y-2">
              {[
                { check: formData.password.length >= 8, text: "At least 8 characters" },
                { check: /[A-Z]/.test(formData.password), text: "One uppercase letter" },
                { check: /[a-z]/.test(formData.password), text: "One lowercase letter" },
                { check: /\d/.test(formData.password), text: "One number" },
                { check: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password), text: "One special character" }
              ].map((req, index) => (
                <motion.li
                  key={index}
                  className={`flex items-center gap-2 ${req.check
                    ? 'text-emerald-600'
                    : 'text-gray-500'
                    }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {req.check ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  {req.text}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {formData.password && (
          <PasswordStrengthIndicator password={formData.password} isDark={false} />
        )}

        <motion.div variants={fadeInUp}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            &nbsp;Confirm Password <span className="text-rose-600 font-normal normal-case">&nbsp;*</span>
          </label>
          <div ref={fieldRefs.confirmPassword} className="overflow-visible">
            <motion.div
              key={`confirmPassword-${shakeKey}`}
              animate={shakeFields.includes('confirmPassword') ? "shake" : "initial"}
              variants={shakeAnimation}
              className="overflow-visible relative group"
            >
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-10" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                maxLength={50}
                autoComplete="off"
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                data-ignore="true"
                readOnly={false}
                onFocus={(e) => {
                  e.target.removeAttribute('readonly');
                  e.target.setAttribute('autocomplete', 'off');
                }}
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl bg-white/80 backdrop-blur-sm
        focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
        focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:shadow-blue-200
        outline-none no-underline
        ${fieldErrors.confirmPassword
                    ? 'border-rose-500 bg-red-50/50 focus:border-rose-500 focus:ring-rose-100 focus:shadow-rose-200'
                    : 'border-gray-200'
                  }`}
                placeholder="Confirm your password"
              />

              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 flex items-center gap-1">
                {passwordsMatch && formData.confirmPassword && (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                )}
                {fieldErrors.confirmPassword && (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  variants={eyeButtonAnimation}
                  whileHover="hover"
                  whileTap="tap"
                  className="text-gray-400 hover:text-blue-500 transition-colors duration-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
            </motion.div>
          </div>
          {fieldErrors.confirmPassword && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-600 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> {fieldErrors.confirmPassword}
            </motion.p>
          )}
        </motion.div>

        {formData.confirmPassword && !passwordsMatch && formData.password && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-rose-600 text-sm mt-2 flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            Passwords do not match yet
          </motion.p>
        )}

        <motion.div
          variants={fadeInUp}
          className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100 group hover:border-blue-200 transition-all duration-300"
        >
          <div ref={fieldRefs.agreeTerms} className="overflow-visible w-full">
            <motion.div
              animate={shakeFields.includes('agreeTerms') ? "shake" : "initial"}
              variants={shakeAnimation}
              className="overflow-visible flex items-start gap-3 w-full"
            >
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                autoComplete="off"
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
          </div>
        </motion.div>
        {fieldErrors.agreeTerms && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-600 text-sm -mt-3 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {fieldErrors.agreeTerms}
          </motion.p>
        )}

        {fieldErrors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-rose-500 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 text-rose-700">
              <Shield className="w-4 h-4" />
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
                Creating Account...
              </>
            ) : (
              <>
                Create Account
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
            Sign in
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
                className="text-2xl text-gray-700 leading-relaxed font-light text-justify"
              >
                Choose your path and start making a meaningful impact today. Every action counts.
              </motion.p>
            </motion.div>

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
                    className={`p-6 rounded-2xl text-center transition-all duration-300 ${userType === type.id
                        ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50 border border-transparent hover:border-white/30"
                      }`}
                  >
                    <motion.div
                      variants={iconAnimation}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      className={`w-12 h-12 bg-gradient-to-br ${type.iconColor} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg cursor-pointer`}
                    >
                      <type.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="font-bold text-lg mb-1">{type.label}</div>
                    <div className="text-sm opacity-80">{type.sub}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {benefits[userType].map((benefit, index) => (
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
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute top-4 right-4 flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200"
            >
              <ShieldCheck className="w-4 h-4" />
              Secure
            </motion.div>

            {renderStep()}
          </motion.div>
        </motion.div>
      </div>
      <style>
        {autofillStyles}
      </style>
    </motion.div>
  );
}