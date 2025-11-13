import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Mail, Phone, Shield, Key, Lock, ArrowRight, ArrowLeft,
    CheckCircle, XCircle, Eye, EyeOff, Clock, ShieldCheck,
    User, Fingerprint, Zap, Target
} from "lucide-react";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [resetMethod, setResetMethod] = useState("email");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        verificationCode: "",
        twoFactorCode: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [shakeFields, setShakeFields] = useState([]);
    const [phoneCode, setPhoneCode] = useState("+92");
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);
    const [twoFactorVerified, setTwoFactorVerified] = useState(false);
    const [resetToken, setResetToken] = useState("");
    const [countdown, setCountdown] = useState(0);

    const dropdownRef = useRef(null);
    const verificationCodeRef = useRef(null);
    const twoFactorCodeRef = useRef(null);
    const containerRef = useRef(null);

    // Country codes
    const countryCodes = [
        { code: "+1", country: "US", flag: "🇺🇸" },
        { code: "+44", country: "UK", flag: "🇬🇧" },
        { code: "+91", country: "India", flag: "🇮🇳" },
        { code: "+92", country: "Pakistan", flag: "🇵🇰" },
        { code: "+971", country: "UAE", flag: "🇦🇪" },
        { code: "+966", country: "KSA", flag: "🇸🇦" }
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

    // Icon animations
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

    // Step transition animations
    const stepTransition = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
        transition: { duration: 0.5, ease: "easeInOut" }
    };

    // Progress bar animation
    const progressAnimation = {
        initial: { width: "0%" },
        animate: {
            width: `${(currentStep - 1) * 25}%`,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    // Success page animation
    const successAnimation = {
        initial: { scale: 0, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.8
            }
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowCountryDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // FIXED: AUTO SCROLL TO TOP AND FOCUS MANAGEMENT
    useEffect(() => {
        // Use requestAnimationFrame for immediate scroll
        requestAnimationFrame(() => {
            // Scroll to top of the window
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant'
            });

            // Also scroll any scrollable containers to top
            const scrollableContainers = document.querySelectorAll('.overflow-auto, .overflow-y-auto');
            scrollableContainers.forEach(container => {
                container.scrollTo({
                    top: 0,
                    behavior: 'instant'
                });
            });
        });

        // Focus management with better timing - wait for render cycle
        const focusTimer = setTimeout(() => {
            switch (currentStep) {
                case 2:
                    if (verificationCodeRef.current) {
                        verificationCodeRef.current.focus();
                        // Force cursor to end of input
                        const value = verificationCodeRef.current.value;
                        verificationCodeRef.current.setSelectionRange(value.length, value.length);
                    }
                    break;
                case 3:
                    if (twoFactorCodeRef.current) {
                        twoFactorCodeRef.current.focus();
                        // Force cursor to end of input
                        const value = twoFactorCodeRef.current.value;
                        twoFactorCodeRef.current.setSelectionRange(value.length, value.length);
                    }
                    break;
                case 4:
                    const newPasswordInput = document.querySelector('input[name="newPassword"]');
                    if (newPasswordInput) {
                        newPasswordInput.focus();
                        // Force cursor to end of input
                        const value = newPasswordInput.value;
                        newPasswordInput.setSelectionRange(value.length, value.length);
                    }
                    break;
                default:
                    break;
            }
        }, 150); // Slightly longer delay to ensure DOM is ready

        return () => clearTimeout(focusTimer);
    }, [currentStep]);

    // Validation functions
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => /^\+\d{1,4}[\d\s-()]{8,}$/.test(phone.replace(/\s/g, ''));
    const validatePassword = (password) => {
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    };

    // Check if passwords match
    const passwordsMatch = formData.newPassword && formData.confirmPassword &&
        formData.newPassword === formData.confirmPassword;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const triggerShake = (fieldNames) => {
        setShakeFields(fieldNames);
        setTimeout(() => setShakeFields([]), 500);
    };

    // Step 1: Send verification code
    const handleSendCode = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFieldErrors({});

        try {
            // Enhanced validation with specific field errors
            const errors = {};

            if (resetMethod === 'email') {
                if (!formData.email) {
                    errors.email = "Email is required";
                } else if (!validateEmail(formData.email)) {
                    errors.email = "Please enter a valid email address";
                }
            } else {
                if (!formData.phone) {
                    errors.phone = "Phone number is required";
                } else if (!validatePhone(phoneCode + formData.phone)) {
                    errors.phone = "Please enter a valid phone number";
                }
            }

            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                triggerShake(Object.keys(errors));
                return;
            }

            // REAL API CALL (your existing code)
            const requestData = {};
            if (resetMethod === 'email') {
                requestData.email = formData.email;
            } else {
                requestData.phone = phoneCode + formData.phone;
            }

            console.log("Sending forgot password request:", requestData);

            const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();

            console.log("Forgot password response:", data);

            if (response.ok && data.success) {
                setCodeSent(true);
                setCountdown(60);
                setCurrentStep(2);
                setFieldErrors({});
            } else {
                if (response.status === 400) {
                    throw new Error(data.message || "Account validation failed");
                } else {
                    throw new Error(data.message || "Failed to send verification code");
                }
            }

        } catch (error) {
            console.error("Forgot password error:", error);
            setFieldErrors({ submit: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify code - UPDATE THIS FUNCTION
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFieldErrors({});

        try {
            if (!formData.verificationCode || formData.verificationCode.length !== 6) {
                setFieldErrors({ verificationCode: "Please enter a valid 6-digit code" });
                triggerShake(['verificationCode']);
                return;
            }

            console.log("Verifying code:", formData.verificationCode);

            // ✅ REAL API CALL - Replace simulation
            const verifyData = {
                code: formData.verificationCode
            };

            if (resetMethod === 'email') {
                verifyData.email = formData.email;
            } else {
                verifyData.phone = phoneCode + formData.phone;
            }

            console.log("Sending verification request:", verifyData);

            const endpoint = resetMethod === 'email'
                ? '/api/auth/verify-password-reset-email'
                : '/api/auth/verify-password-reset-phone';

            const response = await fetch(`http://localhost:8080${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(verifyData)
            });

            const data = await response.json();

            console.log("Verification response:", data);

            if (response.ok && data.success) {
                setCodeVerified(true);
                setCurrentStep(3);
                setFieldErrors({});
                setResetToken(btoa(`${Date.now()}:${Math.random().toString(36).substr(2, 9)}`));
            } else {
                throw new Error(data.message || "Invalid verification code");
            }

        } catch (error) {
            console.error("Verification error:", error);
            setFieldErrors({ verificationCode: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    // Step 3: 2FA Verification - UPDATE THIS FUNCTION
    const handleTwoFactorVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFieldErrors({});

        try {
            if (!formData.twoFactorCode || formData.twoFactorCode.length !== 6) {
                setFieldErrors({ twoFactorCode: "Please enter a valid 6-digit 2FA code" });
                triggerShake(['twoFactorCode']);
                return;
            }

            console.log("Verifying 2FA code:", formData.twoFactorCode);

            // ✅ REAL API CALL - Replace simulation
            const verifyData = {
                code: formData.twoFactorCode
            };

            // Add identifier based on reset method
            if (resetMethod === 'email') {
                verifyData.email = formData.email;
            } else {
                verifyData.phone = phoneCode + formData.phone;
            }

            console.log("Sending 2FA verification request:", verifyData);

            // Use the correct endpoint for password reset 2FA
            const response = await fetch('http://localhost:8080/api/auth/verify-password-reset-authenticator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(verifyData)
            });

            const data = await response.json();

            console.log("2FA verification response:", data);

            if (response.ok && data.success) {
                setTwoFactorVerified(true);
                setCurrentStep(4);
                setFieldErrors({});
            } else {
                throw new Error(data.message || "Invalid 2FA code");
            }

        } catch (error) {
            console.error("2FA verification error:", error);
            setFieldErrors({ twoFactorCode: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    // Step 4: Reset password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFieldErrors({});

        try {
            // Enhanced validation with specific field errors
            const errors = {};

            if (!formData.newPassword) {
                errors.newPassword = "New password is required";
            } else if (!validatePassword(formData.newPassword)) {
                errors.newPassword = "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
            }

            if (!formData.confirmPassword) {
                errors.confirmPassword = "Please confirm your password";
            } else if (formData.newPassword !== formData.confirmPassword) {
                errors.confirmPassword = "Passwords do not match";
            }

            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                triggerShake(Object.keys(errors));
                return;
            }

            console.log("Resetting password...");

            // ✅ FIX: REAL API CALL to reset password
            const resetData = {
                newPassword: formData.newPassword
            };

            // Add identifier based on reset method
            if (resetMethod === 'email') {
                resetData.email = formData.email;
            } else {
                resetData.phone = phoneCode + formData.phone;
            }

            console.log("Sending password reset request:", resetData);

            const response = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resetData)
            });

            const data = await response.json();

            console.log("Password reset response:", data);

            if (response.ok && data.success) {
                // Show success page
                setPasswordResetSuccess(true);
                setCurrentStep(5);
                setFieldErrors({});
            } else {
                throw new Error(data.message || "Failed to reset password");
            }

        } catch (error) {
            console.error("Password reset error:", error);
            setFieldErrors({ submit: error.message || "Password reset failed. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const resendCode = async () => {
        if (countdown > 0) return;

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCountdown(60);
            setFieldErrors({});
        } catch (error) {
            setFieldErrors({ submit: "Failed to resend code. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const selectedCountry = countryCodes.find(country => country.code === phoneCode);

    const stepIcons = [
        { icon: User, color: "from-blue-500 to-cyan-400" },
        { icon: Mail, color: "from-green-500 to-emerald-400" },
        { icon: Shield, color: "from-purple-500 to-pink-400" },
        { icon: Key, color: "from-orange-500 to-red-400" },
        { icon: CheckCircle, color: "from-green-500 to-emerald-400" }
    ];

    const stepTitles = [
        "Reset Method",
        "Verification Code",
        "2FA Authentication",
        "New Password",
        "Success"
    ];

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 flex items-center justify-center p-4 lg:p-8 overflow-auto"
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

            <div className="w-full max-w-md relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-white rounded-3xl shadow-2xl p-8 border border-white/20 backdrop-blur-sm relative overflow-hidden"
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

                    {/* Progress Header */}
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={fadeInUp}
                        className="text-center mb-8"
                    >
                        <motion.div
                            variants={iconAnimation}
                            initial="initial"
                            animate="animate"
                            whileHover="hover"
                            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl cursor-pointer"
                        >
                            <Key className="w-10 h-10 text-white" />
                        </motion.div>

                        <motion.h2
                            variants={fadeInUp}
                            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2"
                        >
                            Password Recovery
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="text-gray-600 text-lg mb-6"
                        >
                            Step {currentStep} of 5: {stepTitles[currentStep - 1]}
                        </motion.p>

                        {/* Animated Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                            <motion.div
                                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full"
                                variants={progressAnimation}
                                initial="initial"
                                animate="animate"
                            />
                        </div>

                        {/* FIXED: Progress Steps with Circular Icons Only */}
                        <div className="flex justify-between items-center px-4">
                            {[1, 2, 3, 4, 5].map((step) => {
                                const StepIcon = stepIcons[step - 1].icon;
                                const stepColor = stepIcons[step - 1].color;

                                return (
                                    <motion.div
                                        key={step}
                                        className="flex flex-col items-center"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <motion.div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step
                                                ? `bg-gradient-to-br ${stepColor} text-white shadow-lg`
                                                : 'bg-gray-200 text-gray-400'
                                                }`}
                                            whileHover={{ scale: currentStep >= step ? 1.1 : 1.05 }}
                                        >
                                            {currentStep > step ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                <StepIcon className="w-5 h-5" />
                                            )}
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={stepTransition}
                        >
                            {/* Step 1: Choose Method */}
                            {currentStep === 1 && (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                >
                                    <motion.div
                                        variants={fadeInUp}
                                        className="text-center mb-8"
                                    >
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                            How would you like to reset your password?
                                        </h3>
                                        <p className="text-gray-600">
                                            Choose your preferred verification method
                                        </p>
                                    </motion.div>

                                    {/* Method Selection */}
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
                                                onClick={() => setResetMethod(type.id)}
                                                variants={buttonAnimation}
                                                whileHover="hover"
                                                whileTap="tap"
                                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all duration-300 ${resetMethod === type.id
                                                    ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg"
                                                    : "text-gray-600 hover:text-gray-800 hover:bg-white/60"
                                                    }`}
                                            >
                                                <type.icon className="w-4 h-4" />
                                                <span className="font-medium text-sm">{type.label}</span>
                                            </motion.button>
                                        ))}
                                    </motion.div>

                                    <form onSubmit={handleSendCode} className="space-y-5">
                                        {/* Email or Phone Input */}
                                        <motion.div variants={fadeInUp}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {resetMethod === 'email' ? 'Email Address *' : 'Phone Number *'}
                                            </label>
                                            <motion.div
                                                variants={shakeFields.includes(resetMethod) ? shakeAnimation : {}}
                                                animate={shakeFields.includes(resetMethod) ? "shake" : "animate"}
                                                className="relative group"
                                            >
                                                {resetMethod === 'email' ? (
                                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-10" />
                                                ) : (
                                                    <>
                                                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-10" />
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

                                                                {showCountryDropdown && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: -10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-30 max-h-60 overflow-y-auto"
                                                                    >
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
                                                                    </motion.div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                <input
                                                    type={resetMethod === 'email' ? 'email' : 'tel'}
                                                    name={resetMethod}
                                                    value={formData[resetMethod]}
                                                    onChange={handleChange}
                                                    className={`w-full rounded-2xl border-2 transition-all duration-300 bg-white/80 backdrop-blur-sm
                            focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                            focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:shadow-blue-200
                            hover:border-blue-300 hover:bg-white
                            ${resetMethod === 'phone' ? 'pl-[9.5rem]' : 'pl-12'}
                            pr-12 py-4
                            ${fieldErrors[resetMethod]
                                                            ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100 focus:shadow-red-200'
                                                            : 'border-gray-200'
                                                        }`}
                                                    placeholder={resetMethod === 'email' ? 'Enter your email' : 'Enter your phone'}
                                                />
                                                {/* FIXED: Check button similar to signup page */}
                                                {formData[resetMethod] && (
                                                    resetMethod === 'email' ?
                                                        validateEmail(formData.email) && (
                                                            <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 z-10" />
                                                        ) :
                                                        validatePhone(phoneCode + formData.phone) && (
                                                            <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 z-10" />
                                                        )
                                                )}
                                                {fieldErrors[resetMethod] && (
                                                    <XCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 z-10" />
                                                )}
                                            </motion.div>
                                            {/* Show specific field error message */}
                                            {fieldErrors[resetMethod] && (
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-red-500 text-sm mt-2 flex items-center gap-1"
                                                >
                                                    <XCircle className="w-4 h-4" /> {fieldErrors[resetMethod]}
                                                </motion.p>
                                            )}
                                        </motion.div>

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
                                                        Sending Code...
                                                    </>
                                                ) : (
                                                    <>
                                                        Send Verification Code
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
                                </motion.div>
                            )}

                            {/* Step 2: Verify Code */}
                            {currentStep === 2 && (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                >
                                    <motion.div
                                        variants={fadeInUp}
                                        className="text-center mb-8"
                                    >
                                        <motion.div
                                            variants={iconAnimation}
                                            initial="initial"
                                            animate="animate"
                                            whileHover="hover"
                                            className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl cursor-pointer"
                                        >
                                            <Mail className="w-10 h-10 text-white" />
                                        </motion.div>
                                        <motion.h3
                                            variants={fadeInUp}
                                            className="text-2xl font-bold text-gray-900 mb-2"
                                        >
                                            Check Your {resetMethod === 'email' ? 'Email' : 'Phone'}
                                        </motion.h3>
                                        <motion.p
                                            variants={fadeInUp}
                                            className="text-gray-600 mb-2"
                                        >
                                            We sent a 6-digit verification code to:
                                        </motion.p>
                                        <motion.p
                                            variants={fadeInUp}
                                            className="text-sm text-blue-600 font-medium"
                                        >
                                            {resetMethod === 'email' ? formData.email : phoneCode + formData.phone}
                                        </motion.p>
                                    </motion.div>

                                    <form onSubmit={handleVerifyCode} className="space-y-5">
                                        <motion.div variants={fadeInUp}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Verification Code *
                                            </label>
                                            <motion.div
                                                variants={shakeFields.includes('verificationCode') ? shakeAnimation : {}}
                                                animate={shakeFields.includes('verificationCode') ? "shake" : "animate"}
                                            >
                                                <input
                                                    ref={verificationCodeRef}
                                                    type="text"
                                                    name="verificationCode"
                                                    value={formData.verificationCode}
                                                    onChange={handleChange}
                                                    maxLength={6}
                                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-center text-xl font-mono tracking-widest focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                                                    placeholder="000000"
                                                />
                                            </motion.div>
                                            {fieldErrors.verificationCode && (
                                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                    <XCircle className="w-4 h-4" /> {fieldErrors.verificationCode}
                                                </motion.p>
                                            )}
                                        </motion.div>

                                        <motion.div
                                            variants={fadeInUp}
                                            className="text-center"
                                        >
                                            <motion.button
                                                type="button"
                                                onClick={resendCode}
                                                disabled={countdown > 0 || isLoading}
                                                variants={linkAnimation}
                                                whileHover="hover"
                                                whileTap="tap"
                                                className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-1 group"
                                            >
                                                {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
                                                {countdown === 0 && (
                                                    <motion.span
                                                        animate={{ x: [0, 3, 0] }}
                                                        transition={{ duration: 1.5, repeat: Infinity }}
                                                        className="group-hover:translate-x-1 transition-transform"
                                                    >
                                                        →
                                                    </motion.span>
                                                )}
                                            </motion.button>
                                        </motion.div>

                                        <motion.button
                                            variants={fadeInUp}
                                            type="submit"
                                            disabled={isLoading || formData.verificationCode.length !== 6}
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
                                                        Verify Code
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
                                </motion.div>
                            )}

                            {/* Step 3: 2FA Verification */}
                            {currentStep === 3 && (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                >
                                    <motion.div
                                        variants={fadeInUp}
                                        className="text-center mb-8"
                                    >
                                        <motion.div
                                            variants={iconAnimation}
                                            initial="initial"
                                            animate="animate"
                                            whileHover="hover"
                                            className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl cursor-pointer"
                                        >
                                            <Shield className="w-10 h-10 text-white" />
                                        </motion.div>
                                        <motion.h3
                                            variants={fadeInUp}
                                            className="text-2xl font-bold text-gray-900 mb-2"
                                        >
                                            Two-Factor Authentication
                                        </motion.h3>
                                        <motion.p
                                            variants={fadeInUp}
                                            className="text-gray-600"
                                        >
                                            Enter the 6-digit code from your authenticator app
                                        </motion.p>
                                    </motion.div>

                                    <form onSubmit={handleTwoFactorVerify} className="space-y-5">
                                        <motion.div variants={fadeInUp}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                2FA Code *
                                            </label>
                                            <motion.div
                                                variants={shakeFields.includes('twoFactorCode') ? shakeAnimation : {}}
                                                animate={shakeFields.includes('twoFactorCode') ? "shake" : "animate"}
                                            >
                                                <input
                                                    ref={twoFactorCodeRef}
                                                    type="text"
                                                    name="twoFactorCode"
                                                    value={formData.twoFactorCode}
                                                    onChange={handleChange}
                                                    maxLength={6}
                                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-center text-xl font-mono tracking-widest focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
                                                    placeholder="000000"
                                                />
                                            </motion.div>
                                            {fieldErrors.twoFactorCode && (
                                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                    <XCircle className="w-4 h-4" /> {fieldErrors.twoFactorCode}
                                                </motion.p>
                                            )}
                                        </motion.div>

                                        <motion.button
                                            variants={fadeInUp}
                                            type="submit"
                                            disabled={isLoading || formData.twoFactorCode.length !== 6}
                                            whileHover="hover"
                                            whileTap="tap"
                                            className="w-full py-5 px-6 bg-gradient-to-r from-purple-600 to-pink-500 
                                                text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl
                                                transform transition-all duration-300
                                                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                                        >
                                            <motion.div
                                                className="absolute inset-0 rounded-2xl border-2 border-purple-400"
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
                                                        Verifying...
                                                    </>
                                                ) : (
                                                    <>
                                                        Verify 2FA
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
                                </motion.div>
                            )}

                            {/* Step 4: Set New Password - FIXED EYE ICON POSITIONING */}
                            {currentStep === 4 && (
                                <motion.div
                                    variants={staggerContainer}
                                    initial="initial"
                                    animate="animate"
                                >
                                    <motion.div
                                        variants={fadeInUp}
                                        className="text-center mb-8"
                                    >
                                        <motion.div
                                            variants={iconAnimation}
                                            initial="initial"
                                            animate="animate"
                                            whileHover="hover"
                                            className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl cursor-pointer"
                                        >
                                            <Key className="w-10 h-10 text-white" />
                                        </motion.div>
                                        <motion.h3
                                            variants={fadeInUp}
                                            className="text-2xl font-bold text-gray-900 mb-2"
                                        >
                                            Create New Password
                                        </motion.h3>
                                        <motion.p
                                            variants={fadeInUp}
                                            className="text-gray-600"
                                        >
                                            Enter a strong new password for your account
                                        </motion.p>
                                    </motion.div>

                                    <form onSubmit={handleResetPassword} className="space-y-5">
                                        {/* New Password */}
                                        <motion.div variants={fadeInUp}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Password *
                                            </label>
                                            <motion.div
                                                variants={shakeFields.includes('newPassword') ? shakeAnimation : {}}
                                                animate={shakeFields.includes('newPassword') ? "shake" : "animate"}
                                                className="relative group"
                                            >
                                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-10" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="newPassword"
                                                    value={formData.newPassword}
                                                    onChange={handleChange}
                                                    className={`w-full pl-12 pr-16 py-4 border-2 rounded-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm
                            focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                            focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:shadow-blue-200
                            hover:border-blue-300 hover:bg-white
                            ${fieldErrors.newPassword
                                                            ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100 focus:shadow-red-200'
                                                            : 'border-gray-200'
                                                        }`}
                                                    placeholder="Enter new password"
                                                />

                                                {/* FIXED: Proper icon positioning with proper spacing */}
                                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 z-20">
                                                    {/* Check/X icons - positioned first */}
                                                    {formData.newPassword && validatePassword(formData.newPassword) && (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    )}
                                                    {fieldErrors.newPassword && (
                                                        <XCircle className="w-5 h-5 text-red-500" />
                                                    )}

                                                    {/* Eye icon - positioned second with proper spacing */}
                                                    <motion.button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        variants={eyeButtonAnimation}
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                        className="text-gray-400 hover:text-blue-500 transition-colors duration-300 flex items-center justify-center"
                                                    >
                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                            {fieldErrors.newPassword && (
                                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                    <XCircle className="w-4 h-4" /> {fieldErrors.newPassword}
                                                </motion.p>
                                            )}
                                        </motion.div>

                                        {/* Confirm Password */}
                                        <motion.div variants={fadeInUp}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm New Password *
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
                                                    className={`w-full pl-12 pr-16 py-4 border-2 rounded-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm
                            focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                            focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:shadow-blue-200
                            hover:border-blue-300 hover:bg-white
                            ${fieldErrors.confirmPassword
                                                            ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100 focus:shadow-red-200'
                                                            : 'border-gray-200'
                                                        }`}
                                                    placeholder="Confirm new password"
                                                />

                                                {/* FIXED: Proper icon positioning with proper spacing */}
                                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 z-20">
                                                    {/* Check/X icons - positioned first */}
                                                    {passwordsMatch && formData.confirmPassword && (
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                    )}
                                                    {fieldErrors.confirmPassword && (
                                                        <XCircle className="w-5 h-5 text-red-500" />
                                                    )}

                                                    {/* Eye icon - positioned second with proper spacing */}
                                                    <motion.button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        variants={eyeButtonAnimation}
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                        className="text-gray-400 hover:text-blue-500 transition-colors duration-300 flex items-center justify-center"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                            {fieldErrors.confirmPassword && (
                                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                    <XCircle className="w-4 h-4" /> {fieldErrors.confirmPassword}
                                                </motion.p>
                                            )}
                                        </motion.div>

                                        {/* Password Requirements */}
                                        <motion.div
                                            variants={fadeInUp}
                                            className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200"
                                        >
                                            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-blue-600" />
                                                Password Requirements:
                                            </h4>
                                            <ul className="text-sm text-gray-600 space-y-2">
                                                {[
                                                    { check: formData.newPassword.length >= 8, text: "At least 8 characters" },
                                                    { check: /[A-Z]/.test(formData.newPassword), text: "One uppercase letter" },
                                                    { check: /[a-z]/.test(formData.newPassword), text: "One lowercase letter" },
                                                    { check: /\d/.test(formData.newPassword), text: "One number" },
                                                    { check: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.newPassword), text: "One special character" }
                                                ].map((req, index) => (
                                                    <motion.li
                                                        key={index}
                                                        className={`flex items-center gap-2 ${req.check ? 'text-green-600' : 'text-gray-500'}`}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        {req.check ? (
                                                            <CheckCircle className="w-4 h-4" />
                                                        ) : (
                                                            <Clock className="w-4 h-4" />
                                                        )}
                                                        {req.text}
                                                    </motion.li>
                                                ))}
                                            </ul>
                                        </motion.div>

                                        <motion.button
                                            variants={fadeInUp}
                                            type="submit"
                                            disabled={isLoading}
                                            whileHover="hover"
                                            whileTap="tap"
                                            className="w-full py-5 px-6 bg-gradient-to-r from-orange-600 to-red-500 
                    text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl
                    transform transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                                        >
                                            <motion.div
                                                className="absolute inset-0 rounded-2xl border-2 border-orange-400"
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
                                                        Resetting Password...
                                                    </>
                                                ) : (
                                                    <>
                                                        Reset Password
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
                                </motion.div>
                            )}

                            {/* Step 5: Success Page - FIXED ICON SIZE */}
                            {currentStep === 5 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="text-center"
                                >
                                    {/* FIXED: Smaller success icon but same rectangular shape */}
                                    <motion.div
                                        variants={iconAnimation}
                                        initial="initial"
                                        animate="animate"
                                        whileHover="hover"
                                        className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl cursor-pointer"
                                    >
                                        <CheckCircle className="w-10 h-10 text-white" />
                                    </motion.div>

                                    <motion.h3
                                        className="text-3xl font-bold text-gray-900 mb-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.6 }}
                                    >
                                        Password Reset Successful!
                                    </motion.h3>

                                    <motion.p
                                        className="text-gray-600 text-lg mb-8"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.6 }}
                                    >
                                        Your password has been successfully reset. You can now login with your new password.
                                    </motion.p>

                                    <motion.div
                                        className="space-y-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7, duration: 0.6 }}
                                    >
                                        {/* Login button */}
                                        <motion.button
                                            onClick={() => navigate('/login')}
                                            whileHover="hover"
                                            whileTap="tap"
                                            className="w-full py-5 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 
                    text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl
                    transform transition-all duration-300
                    flex items-center justify-center gap-3 relative overflow-hidden group"
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
                                                Go to Login
                                                <motion.div
                                                    animate={{ x: [0, 5, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                >
                                                    <ArrowRight className="w-5 h-5" />
                                                </motion.div>
                                            </span>
                                        </motion.button>

                                        <motion.button
                                            onClick={() => navigate('/')}
                                            variants={linkAnimation}
                                            whileHover="hover"
                                            whileTap="tap"
                                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 inline-flex items-center gap-1 group relative overflow-hidden"
                                        >
                                            Back to Homepage
                                            <motion.span
                                                animate={{ x: [0, 3, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className="group-hover:translate-x-1 transition-transform duration-300"
                                            >
                                                →
                                            </motion.span>
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                                        </motion.button>
                                    </motion.div>

                                    <motion.div
                                        className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="w-5 h-5 text-green-600" />
                                            <div className="text-left">
                                                <h4 className="font-bold text-green-800 text-sm">Security Notice</h4>
                                                <p className="text-green-600 text-xs">Your account is now secured with the new password. Make sure to keep it safe.</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Back Button */}
                    {currentStep > 1 && currentStep < 5 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-center mt-6"
                        >
                            <motion.button
                                type="button"
                                onClick={() => setCurrentStep(currentStep - 1)}
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
                                Back
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Back to Login - Only show on first 4 steps */}
                    {currentStep < 5 && (
                        <motion.div
                            variants={fadeInUp}
                            className="text-center mt-6 pt-6 border-t border-gray-200"
                        >
                            <p className="text-gray-600">
                                Remember your password?{" "}
                                <motion.button
                                    onClick={() => navigate('/login')}
                                    variants={linkAnimation}
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300 inline-flex items-center gap-1 group relative overflow-hidden"
                                >
                                    Back to login
                                    <motion.span
                                        animate={{ x: [0, 3, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="group-hover:translate-x-1 transition-transform duration-300"
                                    >
                                        →
                                    </motion.span>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                                </motion.button>
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}