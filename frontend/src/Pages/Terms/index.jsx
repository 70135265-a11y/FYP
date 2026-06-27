import React from 'react';
import Sidebar from '../../Components/Dashboard/Sidebar';
import { FileText, Shield, AlertCircle, Users, Mail } from 'lucide-react';

function TermsPage() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-700">Terms of Service</h1>
            <p className="text-gray-500 mt-1">Last updated: January 2025</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
                  <p className="text-gray-600 leading-relaxed">
                    By accessing and using LiverAI, you agree to be bound by these Terms of Service. 
                    If you do not agree to these terms, please do not use our service. These terms 
                    may be updated from time to time, and your continued use of the service constitutes 
                    acceptance of any changes.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Medical Disclaimer</h2>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    LiverAI is an AI-powered diagnostic assistance tool and is not intended to replace 
                    professional medical advice, diagnosis, or treatment. The analysis provided by our 
                    system should be used as a supplementary tool and must be reviewed by qualified 
                    healthcare professionals.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Always seek the advice of your physician or qualified health provider</li>
                    <li>Never disregard professional medical advice based on AI analysis</li>
                    <li>Results are not 100% accurate and may produce false positives/negatives</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">3. User Responsibilities</h2>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    As a user of LiverAI, you agree to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Provide accurate and complete information when registering</li>
                    <li>Maintain the confidentiality of your account credentials</li>
                    <li>Use the service only for legitimate medical purposes</li>
                    <li>Not attempt to reverse engineer or tamper with the AI algorithms</li>
                    <li>Comply with all applicable medical data regulations</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Usage and Storage</h2>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    We handle your medical data with the utmost care:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>All uploaded MRI scans are encrypted and stored securely</li>
                    <li>Data is used solely for analysis and improving our AI models</li>
                    <li>You retain ownership of all your medical data</li>
                    <li>Data may be retained for regulatory compliance purposes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Contact Information</h2>
                  <p className="text-gray-600 leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at 
                    <span className="text-blue-600 font-medium"> support@liverai.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TermsPage;
