import React from 'react';
import Sidebar from '../../Components/Dashboard/Sidebar';
import { Shield, Lock, Eye, Database, Trash2, Users } from 'lucide-react';

function PrivacyPage() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-700">Privacy Policy</h1>
            <p className="text-gray-500 mt-1">Last updated: January 2025</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    LiverAI collects the following types of information:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li><strong>Personal Information:</strong> Name, email, phone number, and address</li>
                    <li><strong>Medical Data:</strong> MRI scans, analysis results, and medical history</li>
                    <li><strong>Account Information:</strong> Registration date, login history, and preferences</li>
                    <li><strong>Usage Data:</strong> How you interact with our platform and features</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Data Security</h2>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    We implement industry-standard security measures to protect your data:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>All data is encrypted in transit using TLS 1.3</li>
                    <li>Medical images are encrypted at rest using AES-256</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Role-based access control for all personnel</li>
                    <li>Compliance with HIPAA and GDPR standards</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">3. How We Use Your Data</h2>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    Your data is used for the following purposes:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Providing AI-powered liver disease analysis</li>
                    <li>Generating and storing medical reports</li>
                    <li>Improving our AI algorithms and accuracy</li>
                    <li>Communicating important service updates</li>
                    <li>Complying with legal and regulatory requirements</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Sharing</h2>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    We do not sell your personal or medical data. We may share data only in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>With your explicit consent for research purposes</li>
                    <li>With healthcare providers you authorize</li>
                    <li>As required by law or court order</li>
                    <li>With trusted third-party service providers (under strict confidentiality)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Data Retention</h2>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    Your data retention policy:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Medical scans are retained for 7 years (regulatory requirement)</li>
                    <li>Account data is retained until account deletion</li>
                    <li>Anonymized data may be retained indefinitely for research</li>
                    <li>You can request data deletion at any time</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Your Rights</h2>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    You have the following rights regarding your data:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Access to your personal and medical data</li>
                    <li>Correction of inaccurate information</li>
                    <li>Deletion of your account and associated data</li>
                    <li>Export of your data in a machine-readable format</li>
                    <li>Opt-out of non-essential data processing</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Contact Us</h2>
                  <p className="text-gray-600 leading-relaxed">
                    For any privacy-related inquiries or to exercise your rights, please contact us at 
                    <span className="text-blue-600 font-medium"> privacy@liverai.com</span>
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

export default PrivacyPage;
