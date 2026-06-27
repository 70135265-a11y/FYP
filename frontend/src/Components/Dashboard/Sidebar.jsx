import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Upload, FileText, BarChart3, User, LogOut } from 'lucide-react';

const items = [
  { label: 'Dashboard', to: '/dashboard', icon: Home },
  { label: 'Upload MRI Scans', to: '/dashboard/upload', icon: Upload },
  { label: 'Scans History', to: '/dashboard/history', icon: FileText },
  { label: 'Reports', to: '/dashboard/reports', icon: BarChart3 },
  { label: 'Profile', to: '/dashboard/profile', icon: User },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('authStorage');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-[280px] shrink-0 bg-white h-screen sticky top-0 p-6 shadow-lg border-r border-gray-200 overflow-y-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="LiverAI Logo" className="w-10 h-10 object-contain" />
          <div>
            <div className="text-blue-700 font-bold text-xl">LiverAI</div>
            <div className="text-gray-500 text-xs mt-0.5">Doctor Portal</div>
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
              <item.icon className="w-5 h-5" />
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
          onClick={handleLogout}
          className="flex items-center gap-3 w-full rounded-lg bg-red-50 text-red-600 hover:bg-red-100 px-4 py-3 font-medium transition border border-red-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

