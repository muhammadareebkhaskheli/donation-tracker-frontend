import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import AdminDashboard from './pages/AdminDashboard';
import RecipientDashboard from './pages/RecipientDashboard';
import DonorDashboard from './pages/DonorDashboard';
import Signup from './pages/signup';
import LandingPage from './pages/LandingPage';
import ForgotPassword from './pages/ForgotPassword';
import AdminSignup from './pages/adminSignup';
import React from 'react';

const ProtectedRoute = ({ children, allowedUserTypes = [] }) => {
  const sessionStr = localStorage.getItem('userSession');
  const token = localStorage.getItem('token');

  if (!sessionStr || !token) {
    return <Navigate to="/login" />;
  }

  try {
    const session = JSON.parse(sessionStr);
    const userType = session.userType?.toLowerCase() || session.user?.userType?.toLowerCase();

    if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(userType)) {

      switch (userType) {
        case 'admin':
          return <Navigate to="/AdminDashboard" />;
        case 'recipient':
          return <Navigate to="/RecipientDashboard" />;
        case 'donor':
          return <Navigate to="/DonorDashboard" />;
        default:
          return <Navigate to="/login" />;
      }
    }

    return React.cloneElement(children, { user: session });
  } catch (error) {
    console.error('Error parsing session:', error);
    localStorage.removeItem('userSession');
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }
};

const DashboardRouter = () => {
  const location = window.location.pathname.toLowerCase();

  if (location === '/recipient-dashboard') {
    return <Navigate to="/RecipientDashboard" />;
  }
  if (location === '/donor-dashboard') {
    return <Navigate to="/DonorDashboard" />;
  }
  if (location === '/admin-dashboard') {
    return <Navigate to="/AdminDashboard" />;
  }
  return null;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/AdminSignup" element={<AdminSignup />} />

        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute allowedUserTypes={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/RecipientDashboard"
          element={
            <ProtectedRoute allowedUserTypes={['recipient']}>
              <RecipientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/DonorDashboard"
          element={
            <ProtectedRoute allowedUserTypes={['donor']}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/recipient-dashboard" element={<Navigate to="/RecipientDashboard" />} />
        <Route path="/donor-dashboard" element={<Navigate to="/DonorDashboard" />} />
        <Route path="/admin-dashboard" element={<Navigate to="/AdminDashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;