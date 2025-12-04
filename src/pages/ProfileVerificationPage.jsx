import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  CreditCard, 
  FileText, 
  Shield,
  Edit2,
  Save,
  Trash2,
  AlertCircle,
  Building,
  Calendar,
  Users,
  ChevronRight,
  ChevronLeft,
  Lock,
  TrendingUp,
  Download,
  RefreshCw
} from 'lucide-react';

// ==================== COMPREHENSIVE DUMMY DATA ====================
const generateDummyProfileData = () => ({
  personalInfo: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: '123 Main St, New York, NY 10001',
    dateOfBirth: '1990-01-01',
    familyDetails: 'Married with 2 children',
    occupation: 'Software Engineer'
  },
  bankDetails: {
    bankName: 'Global Bank International',
    accountNumber: '123456789012',
    iban: 'GB29NWBK60161331926819',
    accountHolderName: 'John Doe',
    verificationStatus: 'pending'
  },
  documents: {
    idProof: { 
      file: { name: 'passport.jpg', size: '2.4MB' }, 
      status: 'verified',
      preview: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop'
    },
    addressProof: { 
      file: { name: 'utility_bill.pdf', size: '1.8MB' }, 
      status: 'uploaded',
      preview: null
    },
    incomeProof: { 
      file: { name: 'salary_slip.pdf', size: '3.1MB' }, 
      status: 'rejected',
      preview: null
    }
  },
  verification: {
    currentStep: 2,
    progress: 75,
    status: 'in_review',
    adminComments: [
      { id: 1, text: 'ID document needs to be clearer', timestamp: '2024-01-10', admin: 'Admin1' },
      { id: 2, text: 'Bank details verified successfully', timestamp: '2024-01-09', admin: 'Admin2' },
      { id: 3, text: 'Income proof is outdated, please upload current document', timestamp: '2024-01-08', admin: 'Admin3' }
    ]
  }
});

// ==================== CLEAN CARD COMPONENT ====================
const Card = ({ children, className = "", padding = true, ...props }) => (
  <div
    className={`rounded-2xl border bg-white shadow-sm ${padding ? 'p-6' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

// ==================== CLEAN FORM FIELD ====================
const FormField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  error, 
  placeholder, 
  icon: Icon,
  required = false,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {Icon && <Icon size={16} className="text-blue-600" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className={`relative rounded-lg transition-all ${isFocused ? 'ring-2 ring-blue-500 ring-opacity-30' : ''}`}>
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`w-full px-4 py-3 rounded-lg bg-white border transition-all ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            } focus:outline-none resize-none text-gray-900`}
            rows="4"
            {...props}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`w-full px-4 py-3 rounded-lg bg-white border transition-all ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            } focus:outline-none text-gray-900`}
            {...props}
          />
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
};

// ==================== CLEAN STEP INDICATOR ====================
const StepIndicator = ({ step, label, icon: Icon, isActive, isCompleted, onClick, index }) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-center cursor-pointer ${isActive ? 'z-10' : ''}`}
  >
    <div className={`relative rounded-xl p-4 transition-all ${isActive
        ? 'bg-blue-600 text-white shadow-lg'
        : isCompleted
        ? 'bg-emerald-100 text-emerald-600'
        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
      }`}>
      {Icon && <Icon size={20} />}
      
      <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        isActive ? 'bg-blue-700' : isCompleted ? 'bg-emerald-500' : 'bg-gray-400'
      } text-white`}>
        {step}
      </div>
      
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center bg-emerald-500 rounded-xl">
          <CheckCircle size={16} className="text-white" />
        </div>
      )}
    </div>
    
    <span className={`mt-2 text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-gray-500'}`}>
      {label}
    </span>
    
    {index < 3 && (
      <div className={`h-0.5 w-16 mt-6 ${isCompleted ? 'bg-emerald-300' : 'bg-gray-200'}`} />
    )}
  </div>
);

// ==================== CLEAN PROGRESS BAR ====================
const ProgressBar = ({ progress, label, showLabel = true }) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="space-y-3">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-lg font-bold text-blue-600">
            {Math.round(displayProgress)}%
          </span>
        </div>
      )}
      
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${displayProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// ==================== CLEAN DOCUMENT UPLOAD ====================
const DocumentUpload = ({ 
  title, 
  description, 
  status, 
  file, 
  onChange, 
  onRemove, 
  docType, 
  isDragging, 
  onDragOver, 
  onDrop, 
  progress 
}) => {
  const fileInputRef = useRef(null);
  
  const getStatusConfig = (status) => {
    switch(status) {
      case 'verified':
        return { 
          color: 'bg-emerald-50 border-emerald-200',
          textColor: 'text-emerald-700',
          icon: CheckCircle,
          text: 'Verified'
        };
      case 'rejected':
        return { 
          color: 'bg-red-50 border-red-200',
          textColor: 'text-red-700',
          icon: XCircle,
          text: 'Rejected'
        };
      case 'uploaded':
        return { 
          color: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-700',
          icon: CheckCircle,
          text: 'Uploaded'
        };
      default:
        return { 
          color: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-700',
          icon: Clock,
          text: 'Pending'
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className={`rounded-xl border p-5 transition-all ${statusConfig.color} ${isDragging ? 'border-blue-400 ring-2 ring-blue-100' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            {title}
          </h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusConfig.textColor}`}>
          <StatusIcon size={12} />
          <span>{statusConfig.text}</span>
        </div>
      </div>

      <div
        className={`rounded-lg border-2 border-dashed transition-all ${
          file ? 'border-gray-300 bg-white' : 'border-gray-300 hover:border-gray-400 bg-white'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={onChange}
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
        />

        {progress !== undefined ? (
          <div className="p-6 text-center">
            <div className="relative w-16 h-16 mx-auto mb-3">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
              <div
                className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent"
                style={{ transform: 'rotate(45deg)' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">{progress}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : file ? (
          <div className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-sm text-gray-500">{file.size}</p>
                {status === 'rejected' && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Please upload a clearer document
                  </p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Trash2 size={18} className="text-gray-500 hover:text-red-500" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="inline-block p-3 rounded-lg bg-blue-50 mb-3">
              <Upload size={24} className="text-blue-600" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-900">Drag & drop files here</p>
              <p className="text-sm text-gray-600">or click to browse</p>
              <p className="text-xs text-gray-500">Max size: 5MB • JPG, PNG, PDF</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== CLEAN VERIFICATION STATUS ====================
const VerificationStatusCard = ({ status, progress, adminComments }) => {
  const getStatusConfig = (status) => {
    switch(status) {
      case 'verified':
        return {
          color: 'bg-emerald-50 border-emerald-100',
          icon: Shield,
          title: 'Verified Successfully',
          description: 'All documents verified and approved'
        };
      case 'in_review':
        return {
          color: 'bg-blue-50 border-blue-100',
          icon: Clock,
          title: 'Under Review',
          description: 'Your documents are being reviewed by our team'
        };
      case 'pending':
        return {
          color: 'bg-amber-50 border-amber-100',
          icon: Clock,
          title: 'Pending Submission',
          description: 'Complete all steps to submit for verification'
        };
      case 'rejected':
        return {
          color: 'bg-red-50 border-red-100',
          icon: XCircle,
          title: 'Verification Failed',
          description: 'Some documents need attention'
        };
      default:
        return {
          color: 'bg-gray-50 border-gray-100',
          icon: Clock,
          title: 'Processing',
          description: 'Your verification is being processed'
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className={statusConfig.color}>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-100">
            <StatusIcon size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{statusConfig.title}</h3>
            <p className="text-gray-600">{statusConfig.description}</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="flex items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{progress}%</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {['Personal Info', 'Bank Details', 'Documents', 'Verification'].map((stage, index) => (
              <div key={stage} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${(progress / 25) > index ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <span className={`text-sm ${(progress / 25) > index ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                  {stage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Comments */}
        {adminComments.length > 0 && (
          <div className="mt-8">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Edit2 size={20} className="text-blue-600" />
              Admin Comments
            </h4>
            
            <div className="space-y-3">
              {adminComments.map((comment, index) => (
                <div key={comment.id} className="bg-white border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                        {comment.admin.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{comment.admin}</span>
                    </div>
                    <span className="text-sm text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// ==================== CLEAN BUTTON ====================
const Button = ({ 
  children, 
  onClick, 
  variant = 'primary',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-5 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
        variants[variant]
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={18} />
      ) : null}
      {children}
    </button>
  );
};

// ==================== MAIN PROFILE COMPONENT ====================
const ProfileVerificationPage = () => {
  // State Management
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form States
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    familyDetails: '',
    occupation: ''
  });
  
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    iban: '',
    accountHolderName: '',
    verificationStatus: 'pending'
  });
  
  const [documents, setDocuments] = useState({
    idProof: { file: null, status: 'pending', progress: null },
    addressProof: { file: null, status: 'pending', progress: null },
    incomeProof: { file: null, status: 'pending', progress: null }
  });
  
  const [verification, setVerification] = useState({
    progress: 25,
    status: 'pending',
    adminComments: []
  });
  
  const [errors, setErrors] = useState({});
  const [draggingDoc, setDraggingDoc] = useState(null);

  // Calculate progress
  useEffect(() => {
    const calculateProgress = () => {
      let progress = 0;
      
      // Personal Info (25%)
      const personalInfoFields = Object.values(personalInfo);
      const personalInfoComplete = personalInfoFields.filter(val => val.trim() !== '').length;
      progress += (personalInfoComplete / personalInfoFields.length) * 25;
      
      // Bank Details (25%)
      if (bankDetails.bankName && bankDetails.accountNumber && bankDetails.accountHolderName) {
        progress += 25;
      }
      
      // Documents (50%)
      const docsCount = Object.values(documents).filter(doc => doc.file).length;
      progress += (docsCount * 50) / 3;
      
      setVerification(prev => ({ ...prev, progress }));
    };
    
    calculateProgress();
  }, [personalInfo, bankDetails, documents]);

  // Auto-save functionality
  useEffect(() => {
    if (currentStep <= 3) {
      const timeout = setTimeout(() => {
        setIsSaving(true);
        setTimeout(() => {
          localStorage.setItem('profileDraft', JSON.stringify({
            personalInfo,
            bankDetails,
            documents,
            currentStep
          }));
          setIsSaving(false);
        }, 500);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [personalInfo, bankDetails, documents, currentStep]);

  // Handle form validation
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!personalInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!personalInfo.email.includes('@')) newErrors.email = 'Valid email is required';
      if (!personalInfo.phone.match(/^\+?[\d\s-]{10,}$/)) newErrors.phone = 'Valid phone number is required';
    }
    
    if (step === 2) {
      if (!bankDetails.bankName.trim()) newErrors.bankName = 'Bank name is required';
      if (!bankDetails.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
      if (!bankDetails.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
    }
    
    return newErrors;
  };

  // Handle file upload
  const handleFileUpload = (docType, file) => {
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024;
    
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, [docType]: 'Only JPG, PNG, and PDF files are allowed' }));
      return;
    }
    
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, [docType]: 'File size must be less than 5MB' }));
      return;
    }
    
    setErrors(prev => ({ ...prev, [docType]: '' }));
    
    // Simulate upload progress
    setDocuments(prev => ({
      ...prev,
      [docType]: { ...prev[docType], progress: 0 }
    }));
    
    const interval = setInterval(() => {
      setDocuments(prev => {
        const newProgress = prev[docType].progress + 25;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDocuments(prev => ({
              ...prev,
              [docType]: {
                file: { name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)}MB` },
                status: newProgress === 100 ? 'uploaded' : 'pending',
                progress: null
              }
            }));
          }, 500);
        }
        
        return {
          ...prev,
          [docType]: { ...prev[docType], progress: newProgress }
        };
      });
    }, 200);
  };

  // Handle drag and drop
  const handleDragOver = (e, docType) => {
    e.preventDefault();
    setDraggingDoc(docType);
  };

  const handleDrop = (e, docType) => {
    e.preventDefault();
    setDraggingDoc(null);
    const file = e.dataTransfer.files[0];
    handleFileUpload(docType, file);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);
    const stepErrors = validateStep(currentStep);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      setIsLoading(false);
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowSuccess(true);
      setVerification(prev => ({ ...prev, status: 'in_review' }));
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
    
    setIsLoading(false);
  };

  // Steps configuration
  const steps = [
    { id: 1, label: 'Personal Info', icon: User },
    { id: 2, label: 'Bank Details', icon: CreditCard },
    { id: 3, label: 'Documents', icon: FileText },
    { id: 4, label: 'Verification', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-emerald-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-3">
              <CheckCircle size={24} />
              <div>
                <p className="font-semibold">Success!</p>
                <p className="text-sm">Profile submitted for verification</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Profile & Verification
            </h1>
            <p className="text-gray-600 mt-2">
              Complete your profile verification to start receiving assistance
            </p>
          </div>
          
          {/* Auto-save indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg">
            {isSaving ? (
              <>
                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-blue-600">Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle size={14} className="text-emerald-500" />
                <span className="text-sm text-gray-600">Auto-saved</span>
              </>
            )}
          </div>
        </div>

        {/* Step Indicators */}
        <Card>
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <StepIndicator
                key={step.id}
                step={step.id}
                label={step.label}
                icon={step.icon}
                isActive={currentStep === step.id}
                isCompleted={currentStep > step.id}
                onClick={() => setCurrentStep(step.id)}
                index={index}
              />
            ))}
          </div>
        </Card>

        {/* Progress Bar */}
        <Card>
          <ProgressBar
            progress={verification.progress}
            label={`Completion Progress: Step ${currentStep} of 4`}
          />
        </Card>

        {/* Main Content */}
        <div>
          {currentStep === 1 && (
            <Card>
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <User size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                    <p className="text-gray-600">Tell us about yourself</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Full Name"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                    error={errors.fullName}
                    placeholder="John Doe"
                    required
                    icon={User}
                  />
                  
                  <FormField
                    label="Email Address"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                    error={errors.email}
                    placeholder="john@example.com"
                    required
                    icon={User}
                  />
                  
                  <FormField
                    label="Phone Number"
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                    error={errors.phone}
                    placeholder="+1234567890"
                    required
                    icon={User}
                  />
                  
                  <FormField
                    label="Date of Birth"
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    icon={Calendar}
                  />
                  
                  <div className="md:col-span-2">
                    <FormField
                      label="Address"
                      type="textarea"
                      value={personalInfo.address}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="123 Main St, City, Country"
                      icon={Building}
                    />
                  </div>
                  
                  <FormField
                    label="Occupation"
                    value={personalInfo.occupation}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, occupation: e.target.value }))}
                    placeholder="Software Engineer"
                    icon={TrendingUp}
                  />
                  
                  <div className="md:col-span-2">
                    <FormField
                      label="Family Details"
                      type="textarea"
                      value={personalInfo.familyDetails}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, familyDetails: e.target.value }))}
                      placeholder="Tell us about your family members and dependents"
                      icon={Users}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <CreditCard size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Bank Details</h2>
                    <p className="text-gray-600">Secure bank information for transfers</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Bank Name"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, bankName: e.target.value }))}
                    error={errors.bankName}
                    placeholder="Global Bank International"
                    required
                    icon={Building}
                  />
                  
                  <FormField
                    label="Account Number"
                    value={bankDetails.accountNumber}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                    error={errors.accountNumber}
                    placeholder="123456789012"
                    required
                    icon={CreditCard}
                  />
                  
                  <FormField
                    label="IBAN"
                    value={bankDetails.iban}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, iban: e.target.value }))}
                    placeholder="GB29NWBK60161331926819"
                    icon={CreditCard}
                  />
                  
                  <FormField
                    label="Account Holder Name"
                    value={bankDetails.accountHolderName}
                    onChange={(e) => setBankDetails(prev => ({ ...prev, accountHolderName: e.target.value }))}
                    error={errors.accountHolderName}
                    placeholder="John Doe"
                    required
                    icon={User}
                  />
                </div>

                {/* Security Info */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Lock size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Security Notice</h4>
                      <p className="text-sm text-gray-600">
                        Your bank details are encrypted and stored securely. 
                        We use bank-level security protocols to protect your information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <FileText size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Document Upload</h2>
                    <p className="text-gray-600">Upload required documents for verification</p>
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Upload Requirements</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Maximum file size: 5MB per document</li>
                        <li>• Accepted formats: JPG, PNG, PDF</li>
                        <li>• Documents should be clear and legible</li>
                        <li>• All documents must be valid and current</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Document Upload Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <DocumentUpload
                    title="ID Proof"
                    description="Passport, Driver's License, or National ID"
                    status={documents.idProof.status}
                    file={documents.idProof.file}
                    onChange={(e) => handleFileUpload('idProof', e.target.files[0])}
                    onRemove={() => setDocuments(prev => ({ 
                      ...prev, 
                      idProof: { file: null, status: 'pending', progress: null }
                    }))}
                    docType="idProof"
                    isDragging={draggingDoc === 'idProof'}
                    onDragOver={(e) => handleDragOver(e, 'idProof')}
                    onDrop={(e) => handleDrop(e, 'idProof')}
                    progress={documents.idProof.progress}
                  />
                  
                  <DocumentUpload
                    title="Address Proof"
                    description="Utility bill or Bank statement"
                    status={documents.addressProof.status}
                    file={documents.addressProof.file}
                    onChange={(e) => handleFileUpload('addressProof', e.target.files[0])}
                    onRemove={() => setDocuments(prev => ({ 
                      ...prev, 
                      addressProof: { file: null, status: 'pending', progress: null }
                    }))}
                    docType="addressProof"
                    isDragging={draggingDoc === 'addressProof'}
                    onDragOver={(e) => handleDragOver(e, 'addressProof')}
                    onDrop={(e) => handleDrop(e, 'addressProof')}
                    progress={documents.addressProof.progress}
                  />
                  
                  <DocumentUpload
                    title="Income Proof"
                    description="Salary slip, Tax return, or Bank statement"
                    status={documents.incomeProof.status}
                    file={documents.incomeProof.file}
                    onChange={(e) => handleFileUpload('incomeProof', e.target.files[0])}
                    onRemove={() => setDocuments(prev => ({ 
                      ...prev, 
                      incomeProof: { file: null, status: 'pending', progress: null }
                    }))}
                    docType="incomeProof"
                    isDragging={draggingDoc === 'incomeProof'}
                    onDragOver={(e) => handleDragOver(e, 'incomeProof')}
                    onDrop={(e) => handleDrop(e, 'incomeProof')}
                    progress={documents.incomeProof.progress}
                  />
                </div>

                {/* Upload Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-gray-50 border">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {Object.values(documents).filter(d => d.file).length}/3
                    </div>
                    <p className="text-sm text-gray-600">Documents Uploaded</p>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-gray-50 border">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">
                      {Object.values(documents).filter(d => d.status === 'verified').length}
                    </div>
                    <p className="text-sm text-gray-600">Verified</p>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-gray-50 border">
                    <div className="text-2xl font-bold text-amber-600 mb-1">
                      24-48h
                    </div>
                    <p className="text-sm text-gray-600">Verification Time</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {currentStep === 4 && (
            <VerificationStatusCard
              status={verification.status}
              progress={verification.progress}
              adminComments={verification.adminComments}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          {currentStep > 1 ? (
            <Button
              onClick={() => setCurrentStep(prev => prev - 1)}
              variant="secondary"
              icon={ChevronLeft}
            >
              Previous
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                const draft = { personalInfo, bankDetails, documents, currentStep };
                localStorage.setItem('profileDraft', JSON.stringify(draft));
                alert('Draft saved successfully!');
              }}
              variant="outline"
              icon={Save}
            >
              Save Draft
            </Button>

            <Button
              onClick={handleSubmit}
              loading={isLoading}
              icon={currentStep === 4 ? Shield : ChevronRight}
              className="min-w-[160px]"
            >
              {isLoading ? 'Processing...' : 
               currentStep === 4 ? 'Submit Verification' : 'Next Step'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileVerificationPage;