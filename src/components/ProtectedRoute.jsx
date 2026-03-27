// donation-tracker-frontend/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedUserTypes }) => {
  // Get user session from localStorage
  const userSession = JSON.parse(localStorage.getItem('userSession'));
  
  // Check if user is logged in
  if (!userSession || !userSession.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check if token exists
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user type is allowed for this route
  const userType = (userSession.userType || '').toLowerCase();
  
  if (allowedUserTypes && !allowedUserTypes.includes(userType)) {
    // Redirect to appropriate dashboard based on user type
    if (userType === 'donor') {
      return <Navigate to="/DonorDashboard" replace />;
    } else if (userType === 'recipient') {
      return <Navigate to="/RecipientDashboard" replace />;
    } else if (userType === 'admin') {
      return <Navigate to="/AdminDashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;