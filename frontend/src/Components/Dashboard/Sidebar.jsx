import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const items = [
  { label: 'Dashboard', to: '/dashboard', icon: '🏠' },
  { label: 'Upload MRI Scans', to: '/dashboard/upload', icon: '📤' },
  { label: 'Scans History', to: '/dashboard/history', icon: '📋' },
  { label: 'Reports', to: '/dashboard/reports', icon: '📊' },
  { label: 'Profile', to: '/dashboard/profile', icon: '👤' },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-[280px] shrink-0 bg-white h-screen sticky top-0 p-6 shadow-lg border-r border-gray-200 overflow-y-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🏥</div>
          <div>
            <div className="text-blue-700 font-bold text-xl">LiverAI</div>
            <div className="text-gray-500 text-xs mt-0.5">Patient Portal</div>
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const active =
            location.pathname === item.to ||
            (item.to !== '/dashboard' && location.pathname.startsWith(item.to));

          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                active
                  ? 'flex items-center gap-3 w-full rounded-lg bg-blue-600 text-white px-4 py-3 font-medium'
                  : 'flex items-center gap-3 w-full rounded-lg text-gray-700 hover:bg-blue-50 px-4 py-3 font-medium transition'
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="text-blue-700 text-xs font-medium mb-1">Quick Tip</div>
          <div className="text-gray-600 text-xs leading-relaxed">
            Upload your MRI scans to get instant AI-powered analysis.
          </div>
        </div>

        <button
          className="flex items-center gap-3 w-full rounded-lg bg-red-50 text-red-600 hover:bg-red-100 px-4 py-3 font-medium transition border border-red-200"
        >
          <span className="text-lg">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

