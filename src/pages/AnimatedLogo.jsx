import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './AnimatedLogo.css'; // Create this CSS file

const DonationTrackerLogo = ({ 
  animated = true, 
  size = 200,
  withText = true,
  interactive = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.5 }
      }
    }
  };

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 200 }
    }
  };

  return (
    <motion.div 
      className="donation-logo-container"
      style={{ width: size, height: withText ? size + 60 : size }}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      variants={containerVariants}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      onClick={() => interactive && console.log('Logo clicked - Open dashboard')}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle with Gradient */}
        <defs>
          <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8F5E9" />
            <stop offset="50%" stopColor="#E3F2FD" />
            <stop offset="100%" stopColor="#F3E5F5" />
          </linearGradient>
          
          <linearGradient id="main-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2196F3" />
            <stop offset="50%" stopColor="#4CAF50" />
            <stop offset="100%" stopColor="#FF9800" />
          </linearGradient>
          
          <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2196F3" />
            <stop offset="100%" stopColor="#4CAF50" />
          </linearGradient>
          
          <radialGradient id="glow-effect" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Glow Effect */}
        <motion.circle
          cx="100"
          cy="100"
          r="95"
          fill="url(#glow-effect)"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Background Circle */}
        <motion.circle
          cx="100"
          cy="100"
          r="90"
          fill="url(#bg-gradient)"
          stroke="#E0E0E0"
          strokeWidth="2"
          variants={circleVariants}
        />

        {/* Main Infinity/Flow Symbol */}
        <motion.path
          d="M70,100 C70,70 100,60 100,100 C100,140 130,130 130,100 C130,70 100,60 100,100"
          stroke="url(#main-gradient)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          variants={pathVariants}
          animate={animated ? {
            pathLength: isHovered ? 0.8 : 1,
            strokeWidth: isHovered ? 12 : 10,
            rotate: isHovered ? [0, 5, -5, 0] : 0
          } : {}}
          transition={{
            pathLength: { duration: 0.3 },
            strokeWidth: { duration: 0.3 },
            rotate: { duration: 0.5 }
          }}
        />

        {/* Flow Arrow 1 (Give) */}
        <motion.g
          animate={animated ? {
            x: isHovered ? -2 : 0,
            y: isHovered ? -2 : 0
          } : {}}
        >
          <motion.path
            d="M85,85 L95,95 L85,105"
            stroke="#2196F3"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={animated ? {
              pathLength: 1,
              opacity: 1,
              rotate: isHovered ? 360 : 0
            } : { pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { delay: 0.5, duration: 1 },
              rotate: { duration: 2, repeat: Infinity, ease: "linear" }
            }}
          />
          <motion.text
            x="90"
            y="75"
            textAnchor="middle"
            fill="#2196F3"
            fontSize="10"
            fontWeight="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            Give
          </motion.text>
        </motion.g>

        {/* Flow Arrow 2 (Receive) */}
        <motion.g
          animate={animated ? {
            x: isHovered ? 2 : 0,
            y: isHovered ? 2 : 0
          } : {}}
        >
          <motion.path
            d="M115,115 L105,105 L115,95"
            stroke="#4CAF50"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={animated ? {
              pathLength: 1,
              opacity: 1,
              rotate: isHovered ? -360 : 0
            } : { pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { delay: 1, duration: 1 },
              rotate: { duration: 2, repeat: Infinity, ease: "linear" }
            }}
          />
          <motion.text
            x="110"
            y="130"
            textAnchor="middle"
            fill="#4CAF50"
            fontSize="10"
            fontWeight="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            Receive
          </motion.text>
        </motion.g>

        {/* Verification Checkmark */}
        <motion.path
          d="M60,140 L80,160 L140,100"
          stroke="#FF9800"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={animated ? { pathLength: isHovered ? 1 : 0.3 } : { pathLength: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Transaction/People Dots */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 100 + 75 * Math.cos(rad);
          const cy = 100 + 75 * Math.sin(rad);
          const color = angle < 180 ? "#2196F3" : "#4CAF50";
          
          return (
            <motion.circle
              key={index}
              cx={cx}
              cy={cy}
              r="3"
              fill={color}
              initial={{ scale: 0, opacity: 0 }}
              animate={animated ? {
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
                fill: isHovered ? "#FF4081" : color
              } : { scale: 1, opacity: 1 }}
              transition={{
                scale: {
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.1
                },
                opacity: {
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.1
                },
                fill: { duration: 0.3 }
              }}
            />
          );
        })}

        {/* Center Dot */}
        <motion.circle
          cx="100"
          cy="100"
          r="8"
          fill="url(#flow-gradient)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
        />
      </svg>

      {/* Logo Text */}
      {withText && (
        <motion.div 
          className="logo-text-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.h1
            className="logo-main-text"
            animate={animated ? {
              scale: isHovered ? 1.05 : 1,
              color: isHovered ? "#2196F3" : "#333"
            } : {}}
            transition={{ duration: 0.3 }}
          >
            FlowAid
          </motion.h1>
          <motion.p
            className="logo-subtext"
            animate={{ opacity: isHovered ? 1 : 0.8 }}
          >
            Secure Donation Tracker
          </motion.p>
          <motion.div 
            className="logo-tagline"
            initial={{ opacity: 0, width: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              width: isHovered ? "100%" : "0%"
            }}
            transition={{ duration: 0.5 }}
          >
            Transparency • Trust • Impact
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Loading Spinner Variant
const LogoSpinner = ({ size = 60 }) => {
  return (
    <motion.div
      className="logo-spinner"
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="#E3F2FD" />
        <motion.path
          d="M30,50 A20,20 0 1,1 70,50"
          stroke="url(#main-gradient)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset="100"
          animate={{
            strokeDashoffset: [100, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            strokeDashoffset: { duration: 2, repeat: Infinity },
            rotate: { duration: 4, repeat: Infinity, ease: "linear" }
          }}
        />
      </svg>
    </motion.div>
  );
};

// Header Logo Variant
const HeaderLogo = () => {
  return (
    <motion.div 
      className="header-logo"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-logo-icon">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="#2196F3" />
          <path
            d="M15,20 L18,23 L25,16"
            stroke="white"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="20" cy="13" r="2" fill="#4CAF50" />
          <circle cx="20" cy="27" r="2" fill="#FF9800" />
        </svg>
      </div>
      <div className="header-logo-text">
        <h3>FlowAid</h3>
        <span>Donation Tracker</span>
      </div>
    </motion.div>
  );
};

// Full Page Logo with Loading Animation
const FullPageLogo = ({ onAnimationComplete }) => {
  const [phase, setPhase] = useState('loading');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('building'), 1500);
    const timer2 = setTimeout(() => {
      setPhase('complete');
      onAnimationComplete?.();
    }, 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="full-page-logo">
      <motion.div
        className="logo-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated background particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? '#2196F3' : i % 3 === 1 ? '#4CAF50' : '#FF9800'
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </motion.div>

      {phase === 'loading' && (
        <motion.div
          className="loading-phase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LogoSpinner size={100} />
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Initializing Donation Tracker
          </motion.h2>
        </motion.div>
      )}

      {phase === 'building' && (
        <motion.div
          className="building-phase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="building-blocks">
            {['T', 'R', 'A', 'N', 'S', 'P', 'A', 'R', 'E', 'N', 'C', 'Y'].map((letter, i) => (
              <motion.div
                key={i}
                className="building-block"
                initial={{ y: -100, rotate: -180 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  delay: i * 0.05
                }}
              >
                {letter}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {phase === 'complete' && (
        <motion.div
          className="complete-phase"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <DonationTrackerLogo 
            size={300} 
            withText={true} 
            interactive={true}
          />
          <motion.p
            className="welcome-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Welcome to Secure Donation Management
          </motion.p>
        </motion.div>
      )}
    </div>
  );
};

// Main App Component Example
const App = () => {
  const [showLogo, setShowLogo] = useState(true);

  const handleLogoComplete = () => {
    setTimeout(() => setShowLogo(false), 2000);
  };

  return (
    <div className="app-container">
      {showLogo ? (
        <FullPageLogo onAnimationComplete={handleLogoComplete} />
      ) : (
        <div className="dashboard">
          <header>
            <HeaderLogo />
          </header>
          <main>
            <h1>Recipient Dashboard</h1>
            {/* Your dashboard content here */}
            <div className="logo-preview">
              <DonationTrackerLogo size={150} />
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export { DonationTrackerLogo, LogoSpinner, HeaderLogo, FullPageLogo };