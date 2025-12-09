import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import AdminDashboard from './pages/AdminDashboard';
import RecipientDashboard from './pages/RecipientDashboard';
import Signup from './pages/signup';
import LandingPage from './pages/LandingPage';
import ForgotPassword from './pages/ForgotPassword';
import AdminSignup from './pages/adminSignup';

// Add a simple route protection component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('userSession');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/AdminDashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/RecipientDashboard" 
          element={
            <ProtectedRoute>
              <RecipientDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/AdminSignup" element={<AdminSignup />} />
      </Routes>
    </Router>
  );
}

export default App;