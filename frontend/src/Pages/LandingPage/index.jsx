import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Zap, FileText } from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-blue-600 px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 text-white text-xl font-bold">
          <img src="/logo.png" alt="LiverAI Logo" className="w-8 h-8 object-contain" />
          LiverAI
        </div>
        <div className="flex gap-4">
          <Link className="text-white hover:text-blue-200 transition" to="/">
            Home
          </Link>
          <Link className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition" to="/login">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold border border-white hover:bg-blue-700 transition"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-24 px-4">
        <h1 className="text-5xl font-bold text-blue-700 mb-4">Liver Cirrhosis Detection</h1>
        <p className="text-gray-500 text-lg max-w-xl mb-8">AI powered MRI analysis to detect and classify liver cirrhosis stages with high accuracy.</p>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition">
            Learn More
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-blue-50 py-16 px-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">Why LiverAI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <Brain className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">AI Powered</h3>
            <p className="text-gray-500">Deep learning model trained on real MRI scans for accurate detection.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <Zap className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Fast Results</h3>
            <p className="text-gray-500">Get instant cirrhosis stage detection in seconds.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold text-blue-700 mb-2">PDF Reports</h3>
            <p className="text-gray-500">Download detailed medical reports for every scan.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-4">
        <p>© 2025 LiverAI — FYP Project</p>
      </footer>
    </div>
  );
}

export default LandingPage;