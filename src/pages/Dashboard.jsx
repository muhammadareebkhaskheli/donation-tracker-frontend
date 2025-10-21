import { motion } from "framer-motion";
import { HeartHandshake, Users, TrendingUp, ShieldCheck } from "lucide-react";

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30"
    >
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <HeartHandshake className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-gray-600 text-sm">Welcome back!</p>
              </div>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Profile
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { icon: Users, label: "Total Donations", value: "1,234", color: "from-blue-500 to-cyan-400" },
            { icon: TrendingUp, label: "Impact Score", value: "98%", color: "from-green-500 to-emerald-400" },
            { icon: HeartHandshake, label: "Lives Impacted", value: "5,678", color: "from-purple-500 to-pink-400" },
            { icon: ShieldCheck, label: "Success Rate", value: "99.9%", color: "from-yellow-500 to-orange-400" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg mb-8"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-4">
            Welcome to Your Dashboard!
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            You have successfully signed in. This is your personalized dashboard where you can track your impact, 
            manage donations, and see the difference you're making in people's lives.
          </p>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              "Successfully donated to Education Fund",
              "Updated your profile information", 
              "Received thank you message from recipient",
              "Completed security verification"
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">{activity}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}