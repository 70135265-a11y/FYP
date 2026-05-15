import React from 'react';
import Sidebar from '../../Components/Dashboard/Sidebar';
import { Link } from 'react-router-dom';

function DashboardHome() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
            <div>
              <h2 className="text-3xl font-bold text-blue-700">Dashboard</h2>
              <p className="text-gray-500 mt-2 text-lg">Upload MRI scans, track history, and view reports.</p>
            </div>

            <Link
              to="/dashboard/upload"
              className="inline-flex items-center gap-2 justify-center rounded-lg bg-blue-600 text-white font-semibold px-6 py-3 hover:bg-blue-700 transition"
            >
              <span className="text-xl">📤</span>
              Upload MRI Scan
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-500 text-sm font-medium">Latest scan</div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                  🩺
                </div>
              </div>
              <div className="text-4xl font-bold text-blue-700 mt-1">—</div>
              <div className="text-gray-500 text-sm mt-3">Upload to get started.</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-500 text-sm font-medium">Scans in history</div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                  📋
                </div>
              </div>
              <div className="text-4xl font-bold text-blue-700 mt-1">0</div>
              <div className="text-gray-500 text-sm mt-3">No scans yet.</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-gray-500 text-sm font-medium">Reports available</div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                  📊
                </div>
              </div>
              <div className="text-4xl font-bold text-blue-700 mt-1">0</div>
              <div className="text-gray-500 text-sm mt-3">Generate reports after upload.</div>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow">
            <h3 className="text-xl font-bold text-blue-700 mb-4">Quick actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/dashboard/upload"
                className="rounded-lg border border-blue-200 bg-blue-50 px-5 py-4 font-semibold text-blue-700 hover:bg-blue-100 transition flex items-center gap-3"
              >
                <span className="text-2xl">📤</span>
                <span>Upload MRI Scans</span>
              </Link>
              <Link
                to="/dashboard/history"
                className="rounded-lg border border-gray-200 bg-white px-5 py-4 font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
              >
                <span className="text-2xl">📋</span>
                <span>Scans History</span>
              </Link>
              <Link
                to="/dashboard/reports"
                className="rounded-lg border border-gray-200 bg-white px-5 py-4 font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
              >
                <span className="text-2xl">📊</span>
                <span>Reports</span>
              </Link>
            </div>
          </div>
        </main>
    </div>
  );
}

function DashboardSection({ title, description }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <h2 className="text-3xl font-bold text-blue-700">{title}</h2>
        <p className="text-gray-500 mt-2 text-lg">{description}</p>

        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow">
          <div className="text-sm text-gray-500">Placeholder content — connect backend later.</div>
        </div>
      </main>
    </div>
  );
}

export const UploadMriScans = () => (
  <DashboardSection
    title="Upload MRI Scans"
    description="Upload a medical image scan and run liver cirrhosis detection."
  />
);

export const ScansHistory = () => (
  <DashboardSection
    title="Scans History"
    description="Browse your past scans and their results."
  />
);

export const Reports = () => (
  <DashboardSection title="Reports" description="View and download generated PDF reports." />
);

export default DashboardHome;

