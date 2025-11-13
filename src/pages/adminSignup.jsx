import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import {
    Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight,
    ShieldCheck, CheckCircle, XCircle, Key, Shield,
    Users, Settings, Database, ChevronDown
} from "lucide-react";

export default function AdminSignup() {
    const location = useLocation();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginType, setLoginType] = useState("email");
    const [phoneCode, setPhoneCode] = useState("+92");
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        adminCode: "",
        agreeTerms: false
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [shakeFields, setShakeFields] = useState([]);

    // REAL API Integration States
    const [currentStep, setCurrentStep] = useState('signup');
    const [verificationCode, setVerificationCode] = useState("");
    const [twoFactorCode, setTwoFactorCode] = useState("");
    const [verificationMethod, setVerificationMethod] = useState("email");
    const [isVerifying, setIsVerifying] = useState(false);
    const [twoFactorSecret, setTwoFactorSecret] = useState("");
    const [twoFactorQRCode, setTwoFactorQRCode] = useState("");
    const [isTwoFactorVerifying, setIsTwoFactorVerifying] = useState(false);
    const [currentUserIdentifier, setCurrentUserIdentifier] = useState("");

    // Timer state for code expiration
    const [timer, setTimer] = useState(60);
    const [isTimerActive, setIsTimerActive] = useState(false);

    const dropdownRef = useRef(null);

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

    // Start timer when moving to verification step
    useEffect(() => {
        if (currentStep === 'verify') {
            setTimer(60);
            setIsTimerActive(true);
        }
    }, [currentStep]);

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

    // Auto scroll to top when step changes
    useEffect(() => {
        scrollToTop();
    }, [currentStep]);

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

    const pulseAnimation = {
        initial: { boxShadow: "0 0 0 0 rgba(139, 92, 246, 0.7)" },
        hover: {
            boxShadow: [
                "0 0 0 0 rgba(139, 92, 246, 0.7)",
                "0 0 0 10px rgba(139, 92, 246, 0)",
                "0 0 0 0 rgba(139, 92, 246, 0)"
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

    // Admin-specific benefits
    const adminBenefits = [
        {
            icon: Users,
            title: "User Management",
            description: "Approve, reject, and manage recipient requests with full control",
            color: "from-purple-500 to-pink-400"
        },
        {
            icon: Database,
            title: "Advanced Reporting",
            description: "Generate comprehensive reports in XLSX and PDF formats",
            color: "from-blue-500 to-cyan-400"
        },
        {
            icon: Settings,
            title: "System Configuration",
            description: "Configure donation limits, approver settings, and system parameters",
            color: "from-green-500 to-emerald-400"
        },
        {
            icon: Shield,
            title: "Security Controls",
            description: "Manage user roles, permissions, and security settings",
            color: "from-orange-500 to-red-400"
        }
    ];

    // Admin roles information
    const adminRoles = [
        {
            role: "Super Admin",
            permissions: "Full system access, user management, configuration",
            color: "from-purple-600 to-pink-500"
        },
        {
            role: "Approver",
            permissions: "Review and approve/reject recipient requests",
            color: "from-blue-600 to-cyan-500"
        },
        {
            role: "Co-Approver",
            permissions: "Collaborate with other approvers in the approval workflow",
            color: "from-green-600 to-emerald-500"
        },
        {
            role: "Support Staff",
            permissions: "Register requests and assist donors/recipients",
            color: "from-orange-600 to-red-500"
        }
    ];

    // Auto scroll to top function
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\+?[\d\s-()]{10,}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    const validateAdminCode = (code) => {
        return code.length >= 8;
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                return value ? validateEmail(value) : false;
            case 'phone':
                return value ? validatePhone(value) : true;
            case 'password':
                return value.length >= 8;
            case 'confirmPassword':
                return value === formData.password;
            case 'adminCode':
                return validateAdminCode(value);
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

    // 🔧 ADD THIS MISSING FUNCTION - Fix the white page issue
    const handleAdminCodeChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: null }));
        }

        // Validate admin code in real-time (if needed)
        if (name === 'adminCode' && value.length >= 8) {
            try {
                const response = await authAPI.validateInvitation(value);
                if (response.data.valid) {
                    setFieldErrors(prev => ({ ...prev, adminCode: null }));
                } else {
                    setFieldErrors(prev => ({
                        ...prev,
                        adminCode: response.data.message || 'Invalid invitation code'
                    }));
                }
            } catch (error) {
                console.error("Invitation validation error:", error);
                // Don't show error for network issues during typing
            }
        }
    };

    const triggerShake = (fieldNames) => {
        setShakeFields(fieldNames);
        setTimeout(() => setShakeFields([]), 500);
    };

    // 🔄 REAL API INTEGRATION - Admin signup handler
    const handleAdminSignup = async (e) => {
        e.preventDefault();

        // Validate all fields
        const errors = {};
        const requiredFields = ['firstName', 'lastName', 'password', 'confirmPassword', 'adminCode', 'agreeTerms'];

        if (loginType === 'email') {
            requiredFields.push('email');
            if (!validateEmail(formData.email)) {
                errors.email = "Please enter a valid email address";
            }
        } else {
            requiredFields.push('phone');
            if (!validatePhone(phoneCode + formData.phone)) {
                errors.phone = "Please enter a valid phone number with country code";
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

        if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        if (!validateAdminCode(formData.adminCode)) {
            errors.adminCode = "Invalid admin invitation code";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            triggerShake(Object.keys(errors));
            return;
        }

        setIsLoading(true);

        try {
            const adminRegistrationData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
                userType: 'admin',
                adminCode: formData.adminCode,
                role: 'admin'
            };

            if (loginType === 'email') {
                adminRegistrationData.email = formData.email;
                adminRegistrationData.phone = null;
            } else {
                adminRegistrationData.phone = phoneCode + formData.phone;
                adminRegistrationData.email = null;
            }

            console.log("Sending admin registration data:", adminRegistrationData);

            const response = await authAPI.registerAdmin({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                adminCode: formData.adminCode,
                userType: 'admin'
            });

            // Add this function to validate invitation code
            const validateAdminCode = async (code) => {
                try {
                    const response = await authAPI.validateInvitation(code);
                    if (response.data.valid) {
                        return { isValid: true, role: response.data.role };
                    } else {
                        return { isValid: false, error: response.data.message || 'Invalid invitation code' };
                    }
                } catch (error) {
                    return { isValid: false, error: 'Failed to validate invitation code' };
                }
            };

            // Use it in your form validation
            const handleAdminCodeChange = async (e) => {
                const code = e.target.value;
                setFormData(prev => ({ ...prev, adminCode: code }));

                if (code.length >= 8) {
                    const validation = await validateAdminCode(code);
                    if (!validation.isValid) {
                        setFieldErrors({ adminCode: validation.error });
                    } else {
                        setFieldErrors(prev => ({ ...prev, adminCode: null }));
                    }
                }
            };

            if (response.data.success) {
                const identifier = loginType === 'email' ? formData.email : phoneCode + formData.phone;
                setCurrentUserIdentifier(identifier);
                setVerificationMethod(loginType);
                setCurrentStep('verify');
                setFieldErrors({});

                console.log("Admin registration successful, moving to verification:", response.data);
                scrollToTop();

            } else {
                throw new Error(response.data.message || "Admin registration failed");
            }

        } catch (error) {
            console.error("Admin registration error:", error);
            setFieldErrors({
                submit: error.response?.data?.message || "Admin registration failed. Please check your invitation code and information."
            });
        } finally {
            setIsLoading(false);
        }
    };

    // 🔄 REAL API INTEGRATION - Verification code submission
    const handleVerificationSubmit = async (e) => {
        e.preventDefault();

        if (!verificationCode || verificationCode.length !== 6) {
            setFieldErrors({ verification: "Please enter a valid 6-digit code" });
            return;
        }

        setIsVerifying(true);

        try {
            let response;

            if (verificationMethod === 'email') {
                response = await authAPI.verifyEmail(currentUserIdentifier, verificationCode);
            } else {
                response = await authAPI.verifyPhone(currentUserIdentifier, verificationCode);
            }

            if (response.data.success) {
                // Move to 2FA setup
                const twoFactorResponse = await authAPI.setupAuthenticator({
                    [verificationMethod]: currentUserIdentifier
                });

                if (twoFactorResponse.data.success) {
                    setTwoFactorSecret(twoFactorResponse.data.secret);
                    setTwoFactorQRCode(twoFactorResponse.data.qrCodeUrl);
                    setCurrentStep('setup2fa');
                    setVerificationCode("");
                    setTwoFactorCode("");
                    setFieldErrors({});

                    console.log("Admin verification successful, moving to 2FA setup");
                    scrollToTop();
                } else {
                    throw new Error("Failed to setup authenticator");
                }
            } else {
                setFieldErrors({ verification: response.data.message || "Invalid verification code" });
            }
        } catch (error) {
            console.error("Admin verification error:", error);
            setFieldErrors({
                verification: error.response?.data?.message || "Verification failed. Please try again."
            });
        } finally {
            setIsVerifying(false);
        }
    };

    // 🔄 REAL API INTEGRATION - 2FA setup verification
    const handleTwoFactorSetup = async (e) => {
        e.preventDefault();

        if (!twoFactorCode || twoFactorCode.length !== 6) {
            setFieldErrors({ twoFactor: "Please enter a valid 6-digit code" });
            return;
        }

        setIsTwoFactorVerifying(true);

        try {
            const response = await authAPI.verifyAuthenticatorSetup({
                [verificationMethod]: currentUserIdentifier,
                code: twoFactorCode,
                secret: twoFactorSecret
            });

            if (response.data.success) {
                setCurrentStep('complete');
                console.log("Admin 2FA setup completed successfully");
                scrollToTop();
            } else {
                setFieldErrors({ twoFactor: response.data.message || "Invalid authentication code" });
            }
        } catch (error) {
            console.error("Admin 2FA verification error:", error);
            setFieldErrors({
                twoFactor: error.response?.data?.message || "Setup failed. Please try again."
            });
        } finally {
            setIsTwoFactorVerifying(false);
        }
    };

    // Handle completion and redirect to admin login
    const handleCompletion = () => {
        scrollToTop();
        setTimeout(() => {
            navigate('/signin');
        }, 100);
    };

    // Handle back button
    const handleBackToSignup = () => {
        setCurrentStep('signup');
        setVerificationCode("");
        setTwoFactorCode("");
        setIsTimerActive(false);
        setFieldErrors({});
        scrollToTop();
    };

    // Handle back from 2FA setup
    const handleBackToVerification = () => {
        setCurrentStep('verify');
        setTwoFactorCode("");
        setFieldErrors({});
        scrollToTop();
    };

    // Resend verification code
    const handleResendVerification = async () => {
        if (isTimerActive && timer > 0) {
            setFieldErrors({ verification: `Please wait ${timer} seconds before resending` });
            return;
        }

        try {
            const response = await authAPI.resendVerification({
                [verificationMethod]: currentUserIdentifier,
                type: verificationMethod === 'email' ? 'email_verification' : 'phone_verification'
            });

            if (response.data.success) {
                console.log("Verification code resent successfully");
                setTimer(60);
                setIsTimerActive(true);
                setFieldErrors({});
            } else {
                throw new Error("Failed to resend verification code");
            }
        } catch (error) {
            console.error("Resend verification error:", error);
            setFieldErrors({
                verification: "Failed to resend verification code. Please try again."
            });
        }
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

    // Mobile Benefits Section
    const MobileBenefits = () => (
        <motion.div
            variants={fadeInUp}
            className="lg:hidden mb-6 space-y-4"
        >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
                <h3 className="font-bold text-gray-800 text-center mb-3 text-lg">
                    Admin Benefits
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {adminBenefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100"
                            whileHover={{ scale: 1.05 }}
                        >
                            <motion.div
                                className={`w-10 h-10 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg`}
                            >
                                <benefit.icon className="w-5 h-5 text-white" />
                            </motion.div>
                            <p className="text-xs text-gray-700 font-semibold leading-tight">{benefit.title}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );

    // Verification Step
    const renderVerificationStep = () => (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
            >
                <motion.div
                    variants={iconAnimation}
                    initial="initial"
                    animate="animate"
                    className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500 to-pink-400 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl"
                >
                    <Mail className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </motion.div>

                <motion.h2
                    className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent mb-3"
                >
                    Verify Admin Account
                </motion.h2>
                <motion.p
                    className="text-gray-600 text-base lg:text-lg mb-4"
                >
                    We sent a 6-digit code to your {verificationMethod}
                </motion.p>

                <div className="bg-purple-50 rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-purple-200">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
                        <div className="text-left">
                            <p className="text-purple-800 text-sm font-medium">Admin Account Verification</p>
                            <p className="text-purple-600 text-xs">Enter the code sent to {currentUserIdentifier}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <form onSubmit={handleVerificationSubmit} className="space-y-4 lg:space-y-5">
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
                        className="w-full px-4 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl text-center text-lg lg:text-xl font-mono tracking-widest focus:outline-none focus:border-purple-400 focus:ring-2 lg:focus:ring-4 focus:ring-purple-100"
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

                {/* Resend Code Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
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
                            : "text-purple-600 hover:text-purple-700"
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
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Continue Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    type="submit"
                    disabled={isVerifying || verificationCode.length !== 6}
                    whileHover="hover"
                    whileTap="tap"
                    className="w-full py-4 lg:py-5 px-6 bg-gradient-to-r from-purple-600 to-pink-500 
                   text-white font-bold text-base lg:text-lg rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl hover:shadow-2xl lg:hover:shadow-3xl
                   transform transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                    <span className="relative z-10 flex items-center gap-3">
                        {isVerifying ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full"
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
                                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                                </motion.div>
                            </>
                        )}
                    </span>
                </motion.button>

                {/* Back Button */}
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
                        className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-300 inline-flex items-center gap-1 group relative overflow-hidden text-sm lg:text-base"
                    >
                        <motion.span
                            animate={{ x: [0, -3, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="group-hover:-translate-x-1 transition-transform duration-300"
                        >
                            ←
                        </motion.span>
                        Back to admin signup
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
                    </motion.button>
                </motion.div>
            </form>
        </>
    );

    // 2FA Setup Step with QR Code
    const renderTwoFactorSetupStep = () => (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
            >
                <motion.div
                    variants={iconAnimation}
                    initial="initial"
                    animate="animate"
                    className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl"
                >
                    <Shield className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </motion.div>

                <motion.h2
                    className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent mb-3"
                >
                    Setup Two-Factor Authentication
                </motion.h2>
                <motion.p
                    className="text-gray-600 text-base lg:text-lg mb-4"
                >
                    Secure your admin account with 2FA (Mandatory)
                </motion.p>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-green-200">
                    <div className="flex items-center gap-3">
                        <Key className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                        <div className="text-left">
                            <p className="text-green-800 text-sm font-medium">Enhanced Security Required</p>
                            <p className="text-green-600 text-xs">2FA is mandatory for all admin accounts</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="space-y-4 lg:space-y-6">
                {/* QR Code Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 border-2 border-gray-100 text-center"
                >
                    <h3 className="font-bold text-gray-800 mb-3 lg:mb-4">Scan QR Code</h3>
                    <div className="bg-gray-50 rounded-lg lg:rounded-xl p-3 lg:p-4 inline-block mb-3 lg:mb-4">
                        {twoFactorQRCode ? (
                            <img
                                src={twoFactorQRCode}
                                alt="QR Code for 2FA Setup"
                                className="w-40 h-40 lg:w-48 lg:h-48 rounded-lg"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    const fallback = e.target.parentElement.querySelector('.qr-fallback');
                                    if (fallback) fallback.style.display = 'block';
                                }}
                            />
                        ) : null}
                        <div className={`w-40 h-40 lg:w-48 lg:h-48 bg-gray-200 rounded-lg flex items-center justify-center qr-fallback ${twoFactorQRCode ? 'hidden' : 'block'}`}>
                            <span className="text-gray-500 text-sm">Generating QR Code...</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 lg:mb-4">
                        Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                    <div className="bg-blue-50 rounded-lg lg:rounded-xl p-2 lg:p-3">
                        <p className="text-xs text-blue-700 font-mono break-all">
                            Secret: {twoFactorSecret}
                        </p>
                    </div>
                </motion.div>

                {/* Manual Setup Form */}
                <form onSubmit={handleTwoFactorSetup} className="space-y-4 lg:space-y-5">
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
                            value={twoFactorCode}
                            onChange={(e) => {
                                setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                if (fieldErrors.twoFactor) {
                                    setFieldErrors(prev => ({ ...prev, twoFactor: null }));
                                }
                            }}
                            className="w-full px-4 py-3 lg:py-4 border-2 border-gray-200 rounded-xl lg:rounded-2xl text-center text-lg lg:text-xl font-mono tracking-widest focus:outline-none focus:border-green-400 focus:ring-2 lg:focus:ring-4 focus:ring-green-100"
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
                        disabled={isTwoFactorVerifying || twoFactorCode.length !== 6}
                        whileHover="hover"
                        whileTap="tap"
                        className="w-full py-4 lg:py-5 px-6 bg-gradient-to-r from-green-600 to-emerald-500 
                     text-white font-bold text-base lg:text-lg rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl hover:shadow-2xl lg:hover:shadow-3xl
                     transform transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                        <span className="relative z-10 flex items-center gap-3">
                            {isTwoFactorVerifying ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full"
                                    />
                                    Verifying 2FA...
                                </>
                            ) : (
                                <>
                                    Complete Admin Setup
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
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
                            onClick={handleBackToVerification}
                            variants={backLinkAnimation}
                            whileHover="hover"
                            whileTap="tap"
                            className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-300 inline-flex items-center gap-1 group relative overflow-hidden text-sm lg:text-base"
                        >
                            <motion.span
                                animate={{ x: [0, -3, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="group-hover:-translate-x-1 transition-transform duration-300"
                            >
                                ←
                            </motion.span>
                            Back to verification
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
                        </motion.button>
                    </motion.div>
                </form>
            </div>
        </>
    );

    // Completion Step
    const renderCompletionStep = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 lg:py-8"
        >
            <motion.div
                variants={iconAnimation}
                initial="initial"
                animate="animate"
                className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-4 lg:mb-6 shadow-2xl"
            >
                <CheckCircle className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent mb-3 lg:mb-4"
            >
                Admin Account Created!
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600 text-base lg:text-lg mb-6 lg:mb-8 leading-relaxed"
            >
                Your admin account has been created and secured with two-factor authentication.
                <br className="hidden lg:block" />
                You can now access the admin dashboard.
            </motion.p>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-green-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-green-200 mb-6 lg:mb-8"
            >
                <div className="flex items-center gap-3 justify-center">
                    <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                    <div>
                        <p className="text-green-800 font-semibold text-sm lg:text-base">Admin Security Features Enabled</p>
                        <p className="text-green-600 text-xs lg:text-sm">Email verification • Two-factor authentication • Encrypted data • Role-based access</p>
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
                className="w-full py-4 lg:py-5 px-6 bg-gradient-to-r from-purple-600 to-pink-500 
                 text-white font-bold text-base lg:text-lg rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl hover:shadow-2xl lg:hover:shadow-3xl
                 transform transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <span className="relative z-10 flex items-center gap-3">
                    Access Admin Dashboard
                    <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                    </motion.div>
                </span>
            </motion.button>
        </motion.div>
    );

    // Main Admin Signup Step
    const renderSignupStep = () => (
        <>
            <motion.div
                variants={fadeInUp}
                className="text-center mb-6 lg:mb-8"
            >
                <motion.h2
                    variants={fadeInUp}
                    className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent mb-2 lg:mb-3"
                >
                    Admin Portal Access
                </motion.h2>
                <motion.p
                    variants={fadeInUp}
                    className="text-gray-600 text-base lg:text-lg"
                >
                    Create your administrator account with enhanced security
                </motion.p>
            </motion.div>

            {/* Mobile Benefits */}
            <MobileBenefits />

            {/* Admin Code Field */}
            <motion.div
                variants={fadeInUp}
                className="mb-4 lg:mb-6"
            >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Invitation Code *
                </label>
                <motion.div
                    variants={shakeFields.includes('adminCode') ? shakeAnimation : {}}
                    animate={shakeFields.includes('adminCode') ? "shake" : "animate"}
                    className="relative group"
                >
                    <Key className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-purple-500 z-10" />
                    <input
                        type="text"
                        name="adminCode"
                        value={formData.adminCode}
                        onChange={handleAdminCodeChange}
                        className={`w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-4 border-2 rounded-xl lg:rounded-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm
              focus:outline-none focus:border-purple-400 focus:ring-2 lg:focus:ring-4 focus:ring-purple-100 focus:ring-opacity-50
              focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] focus:shadow-purple-200
              hover:border-purple-300 hover:bg-white
              ${fieldErrors.adminCode
                                ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100 focus:shadow-red-200'
                                : 'border-gray-200'
                            }`}
                        placeholder="Enter admin invitation code"
                    />
                    {fieldErrors.adminCode && (
                        <XCircle className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-red-500" />
                    )}
                </motion.div>
                {fieldErrors.adminCode && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {fieldErrors.adminCode}
                    </motion.p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                    You need a valid admin invitation code to create an account
                </p>
            </motion.div>

            {/* Login Type Toggle */}
            <motion.div
                variants={fadeInUp}
                className="flex bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl lg:rounded-2xl p-1 mb-4 lg:mb-6 border border-purple-100"
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
                        className={`flex-1 flex items-center justify-center gap-2 py-2 lg:py-3 px-3 lg:px-4 rounded-lg lg:rounded-xl transition-all duration-300 ${loginType === type.id
                            ? "bg-gradient-to-r from-purple-500 to-pink-400 text-white shadow-lg"
                            : "text-gray-600 hover:text-gray-800 hover:bg-white/60"
                            }`}
                    >
                        <type.icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{type.label}</span>
                    </motion.button>
                ))}
            </motion.div>

            {/* Signup Form */}
            <form onSubmit={handleAdminSignup} className="space-y-4 lg:space-y-5">
                {/* Full Name - Split into First and Last */}
                <motion.div
                    variants={fadeInUp}
                    className="grid grid-cols-2 gap-3 lg:gap-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                        </label>
                        <motion.div
                            variants={shakeFields.includes('firstName') ? shakeAnimation : {}}
                            animate={shakeFields.includes('firstName') ? "shake" : "animate"}
                            className="relative group"
                        >
                            <User className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-purple-500 z-10" />
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleAdminCodeChange}
                                className={`w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-4 border-2 rounded-xl lg:rounded-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm
                  focus:outline-none focus:border-purple-400 focus:ring-2 lg:focus:ring-4 focus:ring-purple-100 focus:ring-opacity-50
                  focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] focus:shadow-purple-200
                  hover:border-purple-300 hover:bg-white
                  ${fieldErrors.firstName
                                        ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100 focus:shadow-red-200'
                                        : 'border-gray-200'
                                    }`}
                                placeholder="First name"
                            />
                            {fieldErrors.firstName && (
                                <XCircle className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-red-500" />
                            )}
                        </motion.div>
                        {fieldErrors.firstName && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                <XCircle className="w-4 h-4" /> {fieldErrors.firstName}
                            </motion.p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                        </label>
                        <motion.div
                            variants={shakeFields.includes('lastName') ? shakeAnimation : {}}
                            animate={shakeFields.includes('lastName') ? "shake" : "animate"}
                            className="relative group"
                        >
                            <User className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-purple-500 z-10" />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleAdminCodeChange}
                                className={`w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-4 border-2 rounded-xl lg:rounded-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm
                  focus:outline-none focus:border-purple-400 focus:ring-2 lg:focus:ring-4 focus:ring-purple-100 focus:ring-opacity-50
                  focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] focus:shadow-purple-200
                  hover:border-purple-300 hover:bg-white
                  ${fieldErrors.lastName
                                        ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100 focus:shadow-red-200'
                                        : 'border-gray-200'
                                    }`}
                                placeholder="Last name"
                            />
                            {fieldErrors.lastName && (
                                <XCircle className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-red-500" />
                            )}
                        </motion.div>
                        {fieldErrors.lastName && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                <XCircle className="w-4 h-4" /> {fieldErrors.lastName}
                            </motion.p>
                        )}
                    </div>
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
                            <Mail className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-purple-500 z-10" />
                        ) : (
                            <>
                                <Phone className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-purple-500 z-10" />

                                {/* Phone Code Dropdown */}
                                <div className="absolute left-10 lg:left-12 h-full flex items-center z-20" ref={dropdownRef}>
                                    <div className="relative">
                                        <motion.button
                                            type="button"
                                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                            variants={buttonAnimation}
                                            whileHover="hover"
                                            whileTap="tap"
                                            className="flex items-center gap-1 lg:gap-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none bg-white px-2 lg:px-3 py-1 lg:py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                                        >
                                            <span className="text-base">{selectedCountry?.flag}</span>
                                            <span className="font-medium text-xs lg:text-sm">{selectedCountry?.code}</span>
                                            <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                                        </motion.button>

                                        {/* Dropdown Menu */}
                                        {showCountryDropdown && (
                                            <div className="absolute top-full left-0 mt-1 w-40 lg:w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-30 max-h-48 lg:max-h-60 overflow-y-auto">
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
                                                        className={`w-full text-left px-3 lg:px-4 py-2 lg:py-3 hover:bg-purple-50 transition-colors flex items-center gap-2 lg:gap-3 border-b border-gray-100 last:border-b-0 ${phoneCode === country.code ? 'bg-purple-50 text-purple-600' : 'text-gray-700'
                                                            }`}
                                                    >
                                                        <span className="text-base">{country.flag}</span>
                                                        <span className="flex-1 font-medium text-xs lg:text-sm">{country.country}</span>
                                                        <span className="text-gray-500 text-xs lg:text-sm">{country.code}</span>
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
                            onChange={handleAdminCodeChange}
                            className={`w-full rounded-xl lg:rounded-2xl border-2 transition-all duration-300 bg-white/80 backdrop-blur-sm
                focus:outline-none focus:border-purple-400 focus:ring-2 lg:focus:ring-4 focus:ring-purple-100 focus:ring-opacity-50
                focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] focus:shadow-purple-200
                hover:border-purple-300 hover:bg-white
                ${loginType === 'phone' ? 'pl-24 lg:pl-[9.5rem]' : 'pl-10 lg:pl-12'}
                pr-10 lg:pr-12 py-3 lg:py-4
                ${fieldErrors[loginType]
                                    ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100 focus:shadow-red-200'
                                    : 'border-gray-200'
                                }`}
                            placeholder={loginType === 'email' ? 'Enter your email' : 'Enter your phone'}
                        />
                        {formData[loginType] && validateField(loginType, formData[loginType]) && (
                            <CheckCircle className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-green-500 z-10" />
                        )}
                        {fieldErrors[loginType] && (
                            <XCircle className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-red-500 z-10" />
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
                        <Lock className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-purple-500 z-10" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleAdminCodeChange}
                            className={`w-full pl-10 lg:pl-12 pr-10 lg:pr-12 py-3 lg:py-4 border-2 rounded-xl lg:rounded-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm
                focus:outline-none focus:border-purple-400 focus:ring-2 lg:focus:ring-4 focus:ring-purple-100 focus:ring-opacity-50
                focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] focus:shadow-purple-200
                hover:border-purple-300 hover:bg-white
                ${fieldErrors.password
                                    ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100 focus:shadow-red-200'
                                    : 'border-gray-200'
                                }`}
                            placeholder="Create a strong password (min. 8 characters)"
                        />

                        {/* Eye button */}
                        <div className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 z-10">
                            <motion.button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                variants={eyeButtonAnimation}
                                whileHover="hover"
                                whileTap="tap"
                                className="text-gray-400 hover:text-purple-500 transition-colors duration-300"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />}
                            </motion.button>
                        </div>

                        {fieldErrors.password && (
                            <XCircle className="absolute right-10 lg:right-12 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-red-500 z-10" />
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
                        <Lock className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-purple-500 z-10" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleAdminCodeChange}
                            className={`w-full pl-10 lg:pl-12 pr-10 lg:pr-12 py-3 lg:py-4 border-2 rounded-xl lg:rounded-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm
                focus:outline-none focus:border-purple-400 focus:ring-2 lg:focus:ring-4 focus:ring-purple-100 focus:ring-opacity-50
                focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] focus:shadow-purple-200
                hover:border-purple-300 hover:bg-white
                ${fieldErrors.confirmPassword
                                    ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100 focus:shadow-red-200'
                                    : 'border-gray-200'
                                }`}
                            placeholder="Confirm your password"
                        />

                        {/* Eye button */}
                        <div className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 z-10">
                            <motion.button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                variants={eyeButtonAnimation}
                                whileHover="hover"
                                whileTap="tap"
                                className="text-gray-400 hover:text-purple-500 transition-colors duration-300"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Eye className="w-4 h-4 lg:w-5 lg:h-5" />}
                            </motion.button>
                        </div>

                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                            <CheckCircle className="absolute right-10 lg:right-12 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-green-500 z-10" />
                        )}
                        {fieldErrors.confirmPassword && (
                            <XCircle className="absolute right-10 lg:right-12 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-red-500 z-10" />
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
                    className="flex items-start gap-3 p-3 lg:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl lg:rounded-2xl border-2 border-purple-100 group hover:border-purple-200 transition-all duration-300"
                >
                    <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleAdminCodeChange}
                        className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 focus:border-purple-400 mt-0.5 flex-shrink-0 transition-all duration-300"
                    />
                    <label className="text-sm text-gray-700">
                        I agree to the{" "}
                        <a
                            href="#terms"
                            className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-300"
                        >
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                            href="#privacy"
                            className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-300"
                        >
                            Privacy Policy
                        </a>
                    </label>
                </motion.div>
                {fieldErrors.agreeTerms && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm -mt-2 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> {fieldErrors.agreeTerms}
                    </motion.p>
                )}

                {/* Submit Error */}
                {fieldErrors.submit && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-xl lg:rounded-2xl p-3 lg:p-4"
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
                    className="w-full py-4 lg:py-5 px-6 bg-gradient-to-r from-purple-600 to-pink-500 
                   text-white font-bold text-base lg:text-lg rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl hover:shadow-2xl lg:hover:shadow-3xl
                   transform transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                    <span className="relative z-10 flex items-center gap-3">
                        {isLoading ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full"
                                />
                                Creating Admin Account...
                            </>
                        ) : (
                            <>
                                Create Admin Account
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                                </motion.div>
                            </>
                        )}
                    </span>
                </motion.button>
            </form>

            {/* Login Link */}
            <motion.div
                variants={fadeInUp}
                className="text-center mt-4 lg:mt-6 pt-4 lg:pt-6 border-t border-gray-200"
            >
                <p className="text-gray-600 text-sm lg:text-base">
                    Already have an admin account?{" "}
                    <Link
                        to="/login"
                        className="text-purple-600 font-semibold hover:text-purple-700 transition-colors duration-300 inline-flex items-center gap-1 group relative overflow-hidden"
                    >
                        Sign in
                        <motion.span
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="group-hover:translate-x-1 transition-transform duration-300"
                        >
                            →
                        </motion.span>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full" />
                    </Link>
                </p>
            </motion.div>
        </>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 flex items-center justify-center p-4 lg:p-8"
        >
            <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">

                {/* Left Side - Admin Features & Benefits (Desktop Only) */}
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={staggerContainer}
                    className="hidden lg:block relative"
                >
                    {/* Floating background elements */}
                    <motion.div
                        className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 blur-xl"
                        animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute bottom-20 right-20 w-24 h-24 bg-pink-200 rounded-full opacity-20 blur-xl"
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
                                    className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Shield className="w-10 h-10 text-white" />
                                </motion.div>
                                <div>
                                    <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-700 bg-clip-text text-transparent">
                                        Admin Portal
                                    </h1>
                                    <p className="text-xl text-gray-600 mt-2">
                                        Secure administrative access
                                    </p>
                                </div>
                            </motion.div>

                            <motion.p
                                variants={fadeInUp}
                                className="text-2xl text-gray-700 leading-relaxed font-light"
                            >
                                Manage the donation platform with comprehensive administrative controls and advanced security features.
                            </motion.p>
                        </motion.div>

                        {/* Admin Roles Information */}
                        <motion.div
                            variants={fadeInUp}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl"
                        >
                            <h3 className="font-bold text-gray-800 text-lg mb-4">Available Admin Roles</h3>
                            <div className="space-y-3">
                                {adminRoles.map((role, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${role.color}`} />
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800 text-sm">{role.role}</p>
                                            <p className="text-gray-600 text-xs">{role.permissions}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Benefits Grid */}
                        <motion.div
                            variants={staggerContainer}
                            className="grid grid-cols-2 gap-4"
                        >
                            {adminBenefits.map((benefit, index) => (
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

                        {/* Security Notice */}
                        <motion.div
                            variants={fadeInUp}
                            className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200"
                        >
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-purple-600" />
                                <div>
                                    <h4 className="font-bold text-purple-800 text-sm">Enterprise Security</h4>
                                    <p className="text-purple-600 text-xs">Multi-factor authentication and role-based access control</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Right Side - Dynamic Form Content */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-lg lg:max-w-full mx-auto"
                >
                    <motion.div
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        className="bg-white rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl p-5 lg:p-8 border border-white/20 backdrop-blur-sm relative overflow-hidden"
                    >
                        {/* Animated border */}
                        <motion.div
                            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-400"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                        />

                        {/* Security Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute top-3 lg:top-4 right-3 lg:right-4 flex items-center gap-2 bg-green-50 text-green-700 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium border border-green-200"
                        >
                            <ShieldCheck className="w-3 h-3 lg:w-4 lg:h-4" />
                            Secure
                        </motion.div>

                        {/* Render current step */}
                        {renderStep()}
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}