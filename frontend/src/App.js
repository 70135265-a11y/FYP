import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import DashboardHome, { UploadMriScans, ScansHistory, Reports } from './Pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/upload" element={<UploadMriScans />} />
        <Route path="/dashboard/history" element={<ScansHistory />} />
        <Route path="/dashboard/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}

export default App;

