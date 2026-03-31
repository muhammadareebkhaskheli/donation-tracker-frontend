import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Mail, Phone, Key, ArrowRight, ArrowLeft,
    CheckCircle, XCircle, Eye, EyeOff, Clock, ShieldCheck,
    User, Fingerprint, Zap, Target, Lock, AlertCircle
} from "lucide-react";
import { authAPI } from "../services/api";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [resetMethod, setResetMethod] = useState("email");
    const [isLoading, setIsLoading] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
    const [shakeKey, setShakeKey] = useState(0);
    const [inputsReady, setInputsReady] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        verificationCode: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [shakeFields, setShakeFields] = useState([]);
    const [codeSent, setCodeSent] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isResending, setIsResending] = useState(false);
    const [currentUserEmail, setCurrentUserEmail] = useState("");
    const verificationCodeRef = useRef(null);
    const containerRef = useRef(null);
    const newPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const fieldRefs = {
        email: useRef(null),
        phone: useRef(null),
    };

    useEffect(() => {
        const t = setTimeout(() => setInputsReady(true), 100);
        return () => clearTimeout(t);
    }, []);

    // Countdown timer effect
    useEffect(() => {
        let interval;
        if (countdown > 0) {
            interval = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [countdown]);

    // Focus management when step changes
    useEffect(() => {
        const focusTimer = setTimeout(() => {
            switch (currentStep) {
                case 2:
                    if (verificationCodeRef.current) {
                        verificationCodeRef.current.focus();
                    }
                    break;
                case 3:
                    if (newPasswordRef.current) {
                        newPasswordRef.current.focus();
                    }
                    break;
                default:
                    break;
            }
        }, 150);
        return () => clearTimeout(focusTimer);
    }, [currentStep]);

    const fadeInUp = {
        initial: { y: 40, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
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
        initial: { x: 0 },
        shake: {
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.6, ease: "easeInOut" }
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

    const stepTransition = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
        transition: { duration: 0.5, ease: "easeInOut" }
    };

    const progressAnimation = {
        initial: { width: "0%" },
        animate: {
            width: `${(currentStep - 1) * 25}%`,
            transition: { duration: 0.8, ease: "easeOut" }
        }
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
        return true;
    };

    const isValidPhone = (phone) => {
        const digitsOnly = phone.replace(/\D/g, '');
        return digitsOnly.length === 10;
    };

    const validatePassword = (password) => {
        const hasMinLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    };

    const passwordsMatch = formData.newPassword && formData.confirmPassword &&
        formData.newPassword === formData.confirmPassword;

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === 'email') {
            processedValue = value.toLowerCase().replace(/\s/g, '');
        } else if (name === 'phone') {
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
        } else if (name === 'verificationCode') {
            processedValue = value.replace(/\D/g, '').slice(0, 6);
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const triggerShake = (fieldNames) => {
        setShakeFields(fieldNames);
        setShakeKey(prev => prev + 1);
        setTimeout(() => setShakeFields([]), 600);
    };

    const getIdentifierForApi = () => {
        if (resetMethod === 'email') {
            return formData.email;
        } else {
            return `+91${formData.phone.replace(/\D/g, '')}`;
        }
    };

    const getMaskedIdentifier = () => {
        if (resetMethod === 'email') {
            const email = formData.email;
            if (!email) return "";
            const [localPart, domain] = email.split('@');
            if (localPart.length <= 3) return email;
            return `${localPart.slice(0, 3)}***@${domain}`;
        } else {
            const phone = formData.phone.replace(/\D/g, '');
            if (!phone) return "";
            if (phone.length <= 4) return phone;
            return `${phone.slice(0, 2)}****${phone.slice(-2)}`;
        }
    };

    // Step 1: Send password reset code
    const handleSendCode = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFieldErrors({});

        try {
            const errors = {};

            if (resetMethod === 'email') {
                if (!formData.email) {
                    errors.email = "Email Address is required";
                } else if (!isValidEmail(formData.email)) {
                    errors.email = "Please enter a valid email address";
                }
            } else {
                if (!formData.phone) {
                    errors.phone = "Phone Number is required";
                } else {
                    const digitsOnly = formData.phone.replace(/\D/g, '');
                    if (!isValidPhone(digitsOnly)) {
                        errors.phone = "Please enter a valid 10-digit phone number";
                    }
                }
            }

            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                triggerShake(Object.keys(errors));
                return;
            }

            // Prepare the email for API
            const emailForApi = resetMethod === 'email'
                ? formData.email.trim().toLowerCase()
                : `+91${formData.phone.replace(/\D/g, '')}`;

            setCurrentUserEmail(emailForApi);

            // Call the forgot password API
            await authAPI.forgotPassword(emailForApi);

            setCodeSent(true);
            setCountdown(60);
            setCurrentStep(2);
            setFieldErrors({});

        } catch (error) {
            console.error("Forgot password error:", error);
            if (error.type === 'NOT_FOUND') {
                setFieldErrors({ submit: "Account not found with this email/phone. Please check your credentials." });
            } else if (error.type === 'NETWORK') {
                setFieldErrors({ submit: "Network error. Please check your connection and try again." });
            } else {
                setFieldErrors({ submit: error.message || "Failed to send reset code. Please try again." });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify reset code
    // In ForgotPassword.jsx - Update handleVerifyCode
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

        // Call the verify reset code API - now returns resetToken
        const response = await authAPI.verifyResetCode({
            email: currentUserEmail,
            code: formData.verificationCode
        });

        if (response.data.verified && response.data.resetToken) {
            // Store the reset token for the password reset step
            localStorage.setItem('resetToken', response.data.resetToken);
            setCodeVerified(true);
            setCurrentStep(3);
            setFieldErrors({});
        } else {
            throw new Error("Verification failed");
        }

    } catch (error) {
        console.error("Verification error:", error);
        if (error.type === 'VALIDATION') {
            setFieldErrors({ verificationCode: "Invalid or expired verification code. Please try again." });
        } else if (error.type === 'NETWORK') {
            setFieldErrors({ verificationCode: "Network error. Please check your connection." });
        } else {
            setFieldErrors({ verificationCode: error.message || "Verification failed. Please try again." });
        }
        triggerShake(['verificationCode']);
    } finally {
        setIsLoading(false);
    }
};

// Update handleResetPassword
const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});

    try {
        const errors = {};

        if (!formData.newPassword) {
            errors.newPassword = "New Password is required";
        } else if (!validatePassword(formData.newPassword)) {
            errors.newPassword = "Password must be at least 8 characters with uppercase, lowercase, number, and special character";
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = "Confirm New Password is required";
        } else if (formData.newPassword !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            triggerShake(Object.keys(errors));
            return;
        }

        // Get the reset token from localStorage
        const resetToken = localStorage.getItem('resetToken');
        
        if (!resetToken) {
            throw new Error("Reset session expired. Please request a new code.");
        }

        // Call the reset password API with reset token
        await authAPI.resetPassword({
            email: currentUserEmail,
            code: formData.verificationCode,
            resetToken: resetToken,
            newPassword: formData.newPassword
        });

        // Clear the reset token
        localStorage.removeItem('resetToken');
        
        setPasswordResetSuccess(true);
        setCurrentStep(4);
        setFieldErrors({});

    } catch (error) {
        console.error("Password reset error:", error);
        if (error.type === 'VALIDATION') {
            setFieldErrors({ submit: error.message || "Invalid or expired reset session. Please request a new code." });
            // Clear invalid token
            localStorage.removeItem('resetToken');
        } else if (error.type === 'NETWORK') {
            setFieldErrors({ submit: "Network error. Please check your connection." });
        } else {
            setFieldErrors({ submit: error.message || "Password reset failed. Please try again." });
        }
    } finally {
        setIsLoading(false);
    }
};

    // Resend verification code
    const resendCode = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setFieldErrors({});
    
    try {
        await authAPI.forgotPassword(currentUserEmail);
        setCountdown(60);
        setTimeout(() => setVerificationMessage(""), 3000);
    } catch (error) {
        setFieldErrors({ submit: "Failed to resend code. Please try again." });
    } finally {
        setIsResending(false);
    }
};

    const stepIcons = [
        { icon: User, color: "from-blue-500 to-cyan-400" },
        { icon: Mail, color: "from-green-500 to-emerald-400" },
        { icon: Key, color: "from-orange-500 to-red-400" },
        { icon: CheckCircle, color: "from-green-500 to-emerald-400" }
    ];

    const stepTitles = [
        "Reset Method",
        "Verification Code",
        "New Password",
        "Success"
    ];

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

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 flex items-center justify-center p-4 lg:p-8 overflow-auto"
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

            <div className="w-full max-w-md relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-white rounded-3xl shadow-2xl p-8 border border-white/20 backdrop-blur-sm relative overflow-hidden"
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
                            Step {currentStep} of 4: {stepTitles[currentStep - 1]}
                        </motion.p>

                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                            <motion.div
                                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full"
                                variants={progressAnimation}
                                initial="initial"
                                animate="animate"
                            />
                        </div>

                        <div className="flex justify-between items-center px-4">
                            {[1, 2, 3, 4].map((step) => {
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

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={stepTransition}
                        >

                            {currentStep === 1 && (
                                <motion.div variants={staggerContainer} initial="initial" animate="animate">
                                    <div className="flex bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-1 mb-6 border border-blue-100">
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
                                    </div>

                                    <form onSubmit={handleSendCode} className="space-y-5" autoComplete="off">
                                        <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, overflow: 'hidden' }} aria-hidden="true">
                                            <input type="text" name="username" autoComplete="username" tabIndex="-1" />
                                            <input type="email" name="email" autoComplete="email" tabIndex="-1" />
                                            <input type="password" name="fake-password" autoComplete="new-password" tabIndex="-1" />
                                        </div>
                                        <motion.div variants={fadeInUp}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                &nbsp;{resetMethod === 'email' ? 'Email Address' : 'Phone Number'} <span className="text-rose-600 font-normal normal-case">&nbsp;*</span>
                                            </label>
                                            <motion.div
                                                key={`${resetMethod}-${shakeKey}`}
                                                animate={shakeFields.includes(resetMethod) ? "shake" : "initial"}
                                                variants={shakeAnimation}
                                                className="overflow-visible"
                                            >
                                                {resetMethod === 'email' ? (
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
                                                            {formData.email && isValidEmail(formData.email) && (
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
                                                                disabled={!inputsReady}
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
                                                            {formData.phone && isValidPhone(formData.phone.replace(/\D/g, '')) && (
                                                                <CheckCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 z-10" />
                                                            )}
                                                            {fieldErrors.phone && (
                                                                <XCircle className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-rose-500 z-10" />
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                            {fieldErrors[resetMethod] && (
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-rose-500 text-sm mt-2 flex items-center gap-1"
                                                >
                                                    <AlertCircle className="w-4 h-4" /> {fieldErrors[resetMethod]}
                                                </motion.p>
                                            )}
                                        </motion.div>

                                        {fieldErrors.submit && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-red-50 border border-rose-500 rounded-2xl p-4"
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
                                                        Reseting Password...
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
                                            Verify It's You
                                        </motion.h3>
                                        <motion.p
                                            variants={fadeInUp}
                                            className="text-gray-600 mb-2"
                                        >
                                            We sent a 6-digit code to your {resetMethod === 'email' ? 'email' : 'phone'}:
                                        </motion.p>
                                        <motion.p
    variants={fadeInUp}
    className="text-sm text-blue-600 font-medium"
>
    {getMaskedIdentifier()}
</motion.p>

{verificationMessage && (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 text-green-600 text-sm"
    >
        {verificationMessage}
    </motion.div>
)}
                                    </motion.div>

                                    <form onSubmit={handleVerifyCode} className="space-y-5">
                                        <motion.div variants={fadeInUp}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                &nbsp;Verification Code <span className="text-rose-600 font-normal normal-case">&nbsp;*</span>
                                            </label>
                                            <motion.div
                                                key={`verification-${shakeKey}`}
                                                animate={shakeFields.includes('verificationCode') ? "shake" : "initial"}
                                                variants={shakeAnimation}
                                                className="overflow-visible"
                                            >
                                                <input
                                                    ref={verificationCodeRef}
                                                    type="text"
                                                    name="verificationCode"
                                                    value={formData.verificationCode}
                                                    onChange={handleChange}
                                                    maxLength={6}
                                                    autoComplete="off"
                                                    className={`w-full px-4 py-4 border-2 rounded-2xl text-center text-xl font-mono tracking-widest focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                                                    ${fieldErrors.verificationCode
                                                            ? 'border-rose-500 bg-red-50/50 focus:border-rose-500 focus:ring-rose-100'
                                                            : 'border-gray-200'
                                                        }`}
                                                    placeholder="------"
                                                />
                                            </motion.div>
                                            {fieldErrors.verificationCode && (
                                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-sm mt-2 flex items-center gap-1">
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
        disabled={countdown > 0 || isResending || isLoading}
        variants={linkAnimation}
        whileHover="hover"
        whileTap="tap"
        className={`font-semibold transition-colors duration-300 inline-flex items-center gap-1 group relative overflow-hidden ${
            countdown > 0 || isResending || isLoading
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:text-blue-700"
        }`}
    >
        {isResending || isLoading ? (
            "Sending..."
        ) : countdown > 0 ? (
            `Resend code in ${countdown}s`
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
                                    </form>
                                </motion.div>
                            )}

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
            <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    &nbsp;New Password <span className="text-rose-600 font-normal normal-case">&nbsp;*</span>
                </label>
                <motion.div
                    key={`newPassword-${shakeKey}`}
                    animate={shakeFields.includes('newPassword') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="overflow-visible relative group"
                >
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-10" />
                    <input
                        ref={newPasswordRef}
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        maxLength={50}
                        autoComplete="off"
                        data-form-type="other"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        data-bwignore="true"
                        data-ignore="true"
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl bg-white/80 backdrop-blur-sm
                        focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                        focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:shadow-blue-200
                        outline-none no-underline
                        ${fieldErrors.newPassword
                                ? 'border-rose-500 bg-red-50/50 focus:border-rose-500 focus:ring-rose-100 focus:shadow-rose-200'
                                : 'border-gray-200'
                            }`}
                        placeholder="Enter new password"
                    />

                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 z-20">
                        {formData.newPassword && validatePassword(formData.newPassword) && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {fieldErrors.newPassword && (
                            <XCircle className="w-5 h-5 text-rose-500" />
                        )}
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
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {fieldErrors.newPassword}
                    </motion.p>
                )}
            </motion.div>

            {/* Password Requirements Section - Appears when user starts typing */}
            {formData.newPassword && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
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
            )}

            <motion.div variants={fadeInUp}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    &nbsp;Confirm New Password <span className="text-rose-600 font-normal normal-case">&nbsp;*</span>
                </label>
                <motion.div
                    key={`confirmPassword-${shakeKey}`}
                    animate={shakeFields.includes('confirmPassword') ? "shake" : "initial"}
                    variants={shakeAnimation}
                    className="overflow-visible relative group"
                >
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 z-10" />
                    <input
                        ref={confirmPasswordRef}
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
                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl bg-white/80 backdrop-blur-sm
                        focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:ring-opacity-50
                        focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] focus:shadow-blue-200
                        outline-none no-underline
                        ${fieldErrors.confirmPassword
                                ? 'border-rose-500 bg-red-50/50 focus:border-rose-500 focus:ring-rose-100 focus:shadow-rose-200'
                                : 'border-gray-200'
                            }`}
                        placeholder="Confirm new password"
                    />

                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 z-20">
                        {passwordsMatch && formData.confirmPassword && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {fieldErrors.confirmPassword && (
                            <XCircle className="w-5 h-5 text-rose-500" />
                        )}
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
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-sm mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {fieldErrors.confirmPassword}
                    </motion.p>
                )}
            </motion.div>

            {formData.confirmPassword && !passwordsMatch && formData.newPassword && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-rose-500 text-sm mt-2 flex items-center gap-1"
                >
                    <Clock className="w-3 h-3" />
                    Passwords do not match
                </motion.p>
            )}

            {fieldErrors.submit && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-rose-500 rounded-2xl p-4"
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

                            {currentStep === 4 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="text-center"
                                >
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
                                        <motion.button
                                            onClick={() => navigate('/login')}
                                            whileHover="hover"
                                            whileTap="tap"
                                            className="w-full py-5 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 
                                                    text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl
                                                    transform transition-all duration-300
                                                    flex items-center justify-center gap-3 relative overflow-hidden group"
                                        >
                                            <motion.div
                                                className="absolute inset-0 rounded-2xl border-2 border-blue-400"
                                                variants={pulseAnimation}
                                                whileHover="hover"
                                            />

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

                    {currentStep > 1 && currentStep < 4 && (
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

                    {currentStep < 4 && (
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
            <style>{autofillStyles}</style>
        </motion.div>
    );
}