"use client";

import { motion } from "framer-motion";
import Header from "../components/Header";
import Accordion from "../components/Accordion";
import Hero from "../components/Hero";
import { HeartHandshake, UserCheck, ArrowRight, TrendingUp, Shield, Users } from "lucide-react";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Popup } from "react-map-gl";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { useEffect, useRef } from "react";

const TwitterX = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.217-6.817-5.97 6.817H2.67l7.73-8.823L2.25 2.25h6.75l4.713 6.231L18.244 2.25z" />
  </svg>
);

// Enhanced Animation Variants
const fadeInUp = {
  initial: { y: 80, opacity: 0 },
  animate: { y: 0, opacity: 1 },
};

const fadeInLeft = {
  initial: { x: -80, opacity: 0 },
  animate: { x: 0, opacity: 1 },
};

const fadeInRight = {
  initial: { x: 80, opacity: 0 },
  animate: { x: 0, opacity: 1 },
};

const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const floatAnimation = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function LandingPage() {
  const homeRef = useRef(null);

  useEffect(() => {
    // Simple fix: Always scroll to top on home navigation
    const handleNavClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href === '#home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const homeLinks = document.querySelectorAll('a[href="#home"]');
    homeLinks.forEach(link => {
      link.addEventListener('click', handleNavClick);
    });

    // Reset to top on initial load
    if (!window.location.hash || window.location.hash === '#home') {
      window.scrollTo(0, 0);
    }

    return () => {
      homeLinks.forEach(link => {
        link.removeEventListener('click', handleNavClick);
      });
    };
  }, []);

  // Stats data
  const stats = [
    { number: "50K+", label: "Lives Impacted", icon: Users },
    { number: "₹10M+", label: "Total Donations", icon: TrendingUp },
    { number: "2K+", label: "Verified Recipients", icon: Shield },
    { number: "98%", label: "Success Rate", icon: HeartHandshake }
  ];

  return (
    <div className="font-sans text-gray-900 overflow-x-hidden">
      <Header />

      <main className="pt-16">
        {/* HERO SECTION with ref fix */}
        <div ref={homeRef}>
          <Hero />
        </div>

        {/* STATS SECTION - Premium floating stats */}
        <section className="py-16 bg-gradient-to-br from-white to-blue-50/20 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-40"
              animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-16 h-16 bg-cyan-100 rounded-full opacity-40"
              animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="container relative z-10">
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  className="text-center group"
                >
                  <motion.div
                    className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 border border-white/20 backdrop-blur-sm"
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <stat.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <motion.h3
                      className="text-3xl font-bold text-gray-800 mb-2"
                      initial={{ scale: 0.5 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    >
                      {stat.number}
                    </motion.h3>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ABOUT SECTION - Enhanced with premium elements */}
        <section
          id="about"
          className="min-h-[90vh] flex items-center py-10 scroll-mt-16 bg-gradient-to-br from-white to-gray-50/30"
        >
          <div className="container">
            <motion.div
              className="grid gap-8 lg:grid-cols-2 items-stretch"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Text Content */}
              <motion.div
                variants={fadeInLeft}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col relative" // ✅ ADDED 'relative' BACK HERE
              >
                {/* Premium decorative elements */}
                <div className="absolute -top-4 -left-4 w-4 h-20 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full z-10"></div>
                <motion.div
                  className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl opacity-10"
                  animate={{ rotate: [0, 90, 180, 270, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                <div className="bg-white rounded-3xl shadow-2xl p-12 relative overflow-hidden border border-white/20 backdrop-blur-sm flex-1 flex flex-col justify-center">
                  {/* Animated top border */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />

                  <motion.h2
                    className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                  >
                    Why We Built This Platform
                  </motion.h2>

                  <motion.p
                    className="text-xl text-gray-600 leading-relaxed mb-8 flex-1"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                  >
                    Our mission is to create a transparent and reliable platform
                    where donors can directly support those in need. Every rupee is
                    tracked and every story is verified.
                  </motion.p>

                  <motion.div
                    className="flex flex-wrap gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                  >
                    {["Transparency", "Security", "Impact", "Trust"].map((feature, idx) => (
                      <motion.span
                        key={feature}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                        whileHover={{ scale: 1.05, backgroundColor: "#3B82F6", color: "white" }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {feature}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Animated underline */}
                  <motion.div
                    className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: 80 }}
                    transition={{ delay: 1, duration: 0.8 }}
                  />
                </div>
              </motion.div>

              {/* Image Content */}
              <motion.div
                variants={fadeInRight}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col"
              >
                <div className="relative rounded-3xl shadow-2xl overflow-hidden flex-1 group">
                  <motion.img
                    src="/about.png"
                    alt="About our donation platform"
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    initial={{ scale: 1.1 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Floating element */}
                  <motion.div
                    className="absolute bottom-6 right-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-2xl flex items-center justify-center"
                    initial={{ scale: 0, rotate: -45 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <HeartHandshake className="w-10 h-10 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* SERVICES SECTION - Premium cards with enhanced animations */}
        <section id="services" className="py-10 bg-gradient-to-br from-gray-50 to-white scroll-mt-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500 rounded-full blur-3xl"></div>
          </div>

          <div className="container relative z-10">
            {/* Section Header */}
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Our Services
              </motion.h2>
              <motion.p
                className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                We designed this platform to help donors and recipients connect in a transparent and meaningful way.
              </motion.p>
            </motion.div>

            {/* Services Cards */}
            <motion.div
              className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              {[
                {
                  icon: HeartHandshake,
                  title: "For Donors",
                  description: "View recipient needs, donate securely, and track your impact with complete transparency.",
                  color: "blue",
                  features: ["Secure Payments", "Real-time Tracking", "Tax Receipts", "Impact Reports"]
                },
                {
                  icon: UserCheck,
                  title: "For Recipients",
                  description: "Register, verify your documents, and receive donations directly to your account.",
                  color: "green",
                  features: ["Easy Registration", "Document Verification", "Direct Transfers", "24/7 Support"]
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                  className="relative group"
                >
                  <motion.div
                    className={`
                      relative bg-white rounded-3xl shadow-2xl p-12 min-h-[400px] flex flex-col justify-center
                      border border-white/20 backdrop-blur-sm overflow-hidden
                      transform transition-all duration-500 group-hover:shadow-3xl
                      ${service.color === 'blue' ? 'hover:border-blue-200' : 'hover:border-green-200'}
                    `}
                    whileHover={{ y: -15, scale: 1.02 }}
                  >
                    {/* Animated border gradient */}
                    <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
                      bg-gradient-to-r ${service.color === 'blue' ? 'from-blue-500 to-cyan-400' : 'from-green-500 to-emerald-400'} 
                      p-[2px] -m-[2px]`}>
                      <div className="w-full h-full bg-white rounded-3xl" />
                    </div>

                    <div className="relative z-10 text-center">
                      {/* Icon */}
                      <motion.div
                        className={`
                          w-24 h-24 rounded-3xl mb-8 mx-auto flex items-center justify-center shadow-2xl
                          ${service.color === 'blue'
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-400'
                            : 'bg-gradient-to-br from-green-500 to-emerald-400'
                          }
                        `}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <service.icon className="w-12 h-12 text-white" />
                      </motion.div>

                      {/* Content */}
                      <motion.h3
                        className="text-2xl lg:text-3xl font-bold mb-4 text-gray-800"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
                      >
                        {service.title}
                      </motion.h3>

                      <motion.p
                        className="text-gray-600 text-lg leading-relaxed mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                      >
                        {service.description}
                      </motion.p>

                      {/* Features */}
                      <motion.div
                        className="flex flex-wrap justify-center gap-2 mb-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.2 }}
                      >
                        {service.features.map((feature, idx) => (
                          <motion.span
                            key={idx}
                            className={`
                              px-3 py-1 rounded-full text-sm font-medium border
                              ${service.color === 'blue'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-green-50 text-green-700 border-green-200'
                              }
                            `}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {feature}
                          </motion.span>
                        ))}
                      </motion.div>

                      {/* CTA Button */}
                      <motion.button
                        className={`
                          inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300
                          ${service.color === 'blue'
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                          } shadow-lg hover:shadow-xl transform hover:scale-105
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* IMPACT SECTION - Enhanced charts */}
        <section id="progress" className="py-10 bg-gradient-to-br from-slate-50 to-blue-50/30 scroll-mt-16">
          <div className="container">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Our Impact
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Tracking the difference we make together through transparent data and real impact.
              </motion.p>
            </motion.div>

            <motion.div
              className="grid gap-8 lg:grid-cols-2"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Pie Chart */}
              <motion.div
                variants={fadeInLeft}
                className="bg-white rounded-3xl shadow-2xl p-8 border border-white/20 backdrop-blur-sm hover:shadow-3xl transition-all duration-500"
                whileHover={{ y: -5 }}
              >
                <h4 className="font-bold text-2xl mb-6 text-gray-800">Donations by Category</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Education", value: 400 },
                          { name: "Healthcare", value: 300 },
                          { name: "Food", value: 300 },
                          { name: "Emergency", value: 200 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#6366F1" />
                        <Cell fill="#22C55E" />
                        <Cell fill="#F59E0B" />
                        <Cell fill="#EF4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Line Chart */}
              <motion.div
                variants={fadeInRight}
                className="bg-white rounded-3xl shadow-2xl p-8 border border-white/20 backdrop-blur-sm hover:shadow-3xl transition-all duration-500"
                whileHover={{ y: -5 }}
              >
                <h4 className="font-bold text-2xl mb-6 text-gray-800">Monthly Donation Trend</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", donations: 400 },
                        { month: "Feb", donations: 300 },
                        { month: "Mar", donations: 500 },
                        { month: "Apr", donations: 700 },
                        { month: "May", donations: 600 },
                        { month: "Jun", donations: 800 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                          background: 'white'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="donations"
                        stroke="url(#lineGradient)"
                        strokeWidth={4}
                        dot={{ r: 6, fill: "#2563EB" }}
                        activeDot={{ r: 8, fill: "#2563EB" }}
                      />
                      <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ SECTION - Enhanced */}
        <section id="faqs" className="py-10 bg-gradient-to-br from-white to-gray-50 scroll-mt-16">
          <div className="container max-w-4xl">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Frequently Asked Questions
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Everything you need to know about our platform
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-6"
            >
              {[
                {
                  title: "How does the donation process work?",
                  content: "Donors choose a cause, set an amount, and complete payment through our secure gateway. Recipients receive funds once verification is complete."
                },
                {
                  title: "What documents are required for recipients?",
                  content: "Recipients must provide valid identification and supporting documents related to their need. Our team reviews these for authenticity before approval."
                },
                {
                  title: "Can I track where my donation goes?",
                  content: "Yes, you will receive updates about the recipient and how your donation has been utilized."
                },
                {
                  title: "Are there any fees for donors or recipients?",
                  content: "Donors are not charged any extra fees. A minimal service fee may apply to recipients to cover platform maintenance and verification costs."
                },
                {
                  title: "Can international donors contribute?",
                  content: "Yes, we accept donations from most countries. Payment options vary by region."
                },
                {
                  title: "How do you ensure transparency?",
                  content: "Every transaction is logged, verified, and available for donors to review. We prioritize accountability at every step."
                },
                {
                  title: "What payment methods are supported?",
                  content: "We support credit/debit cards, bank transfers, and popular digital wallets."
                },
                {
                  title: "Can I set up recurring donations?",
                  content: "Yes, you can choose to donate on a monthly or yearly basis to support a cause regularly."
                },
                {
                  title: "What happens if a recipient is found to provide false information?",
                  content: "Their account will be suspended immediately, and donations will not be released."
                },
                {
                  title: "How do I contact support?",
                  content: "You can reach us anytime through our support page or email. Our team is available to assist with questions or concerns."
                },
                {
                  title: "How long does it take for a recipient to receive funds?",
                  content: "Once documents are verified and the donation is confirmed, funds are typically released within 3–5 business days."
                },
                {
                  title: "Can I donate specific items instead of money?",
                  content: "At this stage, our platform supports monetary donations only. We may expand to item-based donations in the future."
                },
                {
                  title: "Is my personal information shared with recipients?",
                  content: "No, your personal details remain private unless you choose to share them."
                },
                {
                  title: "Can organizations also register as recipients?",
                  content: "Yes, registered NGOs and organizations can also apply as recipients after document verification."
                },
                {
                  title: "What if I face issues during payment?",
                  content: "If your transaction fails or you face technical issues, contact our support team. We'll assist you in completing your donation."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Accordion title={faq.title}>
                    {faq.content}
                  </Accordion>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CONTACT SECTION - Premium design */}
        <section id="contact" className="py-10 bg-gradient-to-br from-blue-50 to-cyan-50 scroll-mt-16">
          <div className="container">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Get In Touch
              </motion.h2>
              <motion.p
                className="text-xl text-gray-700 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                We would love to hear from you. Fill out the form and we will get back to you soon.
              </motion.p>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto items-stretch">
              {/* Contact Form - LEFT SIDE */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col"
              >
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/20 backdrop-blur-sm flex-1 flex flex-col">
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-6 flex-1 flex flex-col">
                    <div className="flex-1 space-y-6">
                      {["Name", "Email", "Phone"].map((field, index) => (
                        <motion.div
                          key={field}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <input
                            className="w-full p-4 rounded-2xl border border-gray-200 
                     focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                     placeholder-gray-400 transition-all duration-300 shadow-sm
                     bg-white/50 backdrop-blur-sm hover:shadow-md"
                            placeholder={field}
                          />
                        </motion.div>
                      ))}

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="flex-1"
                      >
                        <textarea
                          className="w-full h-full min-h-[120px] p-4 rounded-2xl border border-gray-200
                   focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                   placeholder-gray-400 transition-all duration-300 shadow-sm
                   bg-white/50 backdrop-blur-sm resize-none hover:shadow-md"
                          placeholder="Message"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-shrink-0"
                    >
                      <button
                        className="w-full px-8 py-4 text-lg font-semibold text-white rounded-2xl
                 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600
                 shadow-xl hover:shadow-2xl 
                 hover:from-cyan-600 hover:via-blue-700 hover:to-violet-700
                 transform transition-all duration-400 ease-out
                 relative overflow-hidden group"
                      >
                        <span className="relative z-10">Send Message</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>

              {/* Map - RIGHT SIDE - Clean Map Only */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col"
              >
                <div className="rounded-3xl shadow-2xl overflow-hidden flex-1">
                  <Map
                    initialViewState={{
                      longitude: 67.0011,
                      latitude: 24.8607,
                      zoom: 12,
                    }}
                    style={{ width: "100%", height: "100%" }}
                    mapStyle="mapbox://styles/mapbox/light-v11"
                    mapboxAccessToken="pk.eyJ1IjoibWFyZWVia2hhcyIsImEiOiJjbWc5Y3o3MzcwMG9lMmlzYWtuMmM1Z3JzIn0.YrZjHOwQcKc6kbwXBn-v6w" // Enter your Token here please
                  >
                    <Marker longitude={67.0011} latitude={24.8607} color="#3B82F6" />
                    <Popup longitude={67.0011} latitude={24.8607} anchor="top">
                      📍 Karachi, Pakistan
                    </Popup>
                  </Map>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FOOTER - Enhanced */}
        <motion.footer
          className="bg-gradient-to-r from-blue-950 via-gray-900 to-black text-white pt-6 pb-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="container">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid gap-10 md:grid-cols-4"
            >
              {/* Brand */}
              <motion.div variants={fadeInUp}>
                <div className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                  Donation Tracker
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Making donation tracking transparent, secure, and easy for everyone.
                </p>
              </motion.div>

              {/* Quick Links */}
              <motion.div variants={fadeInUp}>
                <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
                <ul className="space-y-3 text-sm">
                  {["Home", "About", "Services", "Progress", "FAQs", "Contact"].map((item, idx) => (
                    <li key={idx}>
                      <motion.a
                        href={`#${item.toLowerCase()}`}
                        className="text-gray-400 hover:text-blue-400 transition-colors 
                         inline-block relative group"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {item}
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full duration-300"></span>
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Contact */}
              <motion.div variants={fadeInUp}>
                <h4 className="font-semibold text-lg mb-6">Contact</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                  {[
                    { icon: MapPin, text: "Karachi, Pakistan" },
                    { icon: Mail, text: "support@donationtracker.example" },
                    { icon: Phone, text: "+92 300 1234567" }
                  ].map((item, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-center gap-3"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <item.icon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span>{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Social */}
              <motion.div variants={fadeInUp}>
                <h4 className="font-semibold text-lg mb-6">Follow Us</h4>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, color: "hover:bg-blue-600" },
                    { icon: Instagram, color: "hover:bg-pink-500" },
                    { icon: TwitterX, color: "hover:bg-sky-500" },
                    { icon: Youtube, color: "hover:bg-red-600" },
                  ].map((item, idx) => (
                    <motion.a
                      key={idx}
                      href="#"
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-800 
                       ${item.color} transition-all duration-300 
                       hover:shadow-lg backdrop-blur-sm`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <item.icon className="w-5 h-5 text-white" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Bottom bar */}
            <motion.div
              className="mt-4 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              © 2025 Donation Tracker. All rights reserved.
            </motion.div>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}