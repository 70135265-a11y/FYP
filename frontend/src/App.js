import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import DashboardHome from './Pages/Dashboard';
import ReportsPage from './Pages/Reports';
import ScansHistoryPage from './Pages/ScansHistory';
import UploadScansPage from './Pages/UploadScans';
import ProfilePage from './Pages/Profile';
import ChatWidget from './Components/ChatWidget/ChatWidget';

function ProtectedRoute({ children }) {
  const authStorage = localStorage.getItem('authStorage');
  const token = authStorage === 'session' ? sessionStorage.getItem('token') : localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const authStorage = localStorage.getItem('authStorage');
  const token = authStorage === 'session' ? sessionStorage.getItem('token') : localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
        <Route path="/dashboard/upload" element={<ProtectedRoute><UploadScansPage /></ProtectedRoute>} />
        <Route path="/dashboard/history" element={<ProtectedRoute><ScansHistoryPage /></ProtectedRoute>} />
        <Route path="/dashboard/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
      {token && <ChatWidget />}
    </Router>
  );
}

export default App;

