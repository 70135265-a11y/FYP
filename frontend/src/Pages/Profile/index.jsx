import React, { useState, useEffect } from 'react';
import Sidebar from '../../Components/Dashboard/Sidebar';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Trash2 } from 'lucide-react';
import API_BASE_URL from '../../config';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const getToken = () => {
    const authStorage = localStorage.getItem('authStorage');
    return authStorage === 'session'
      ? sessionStorage.getItem('token')
      : localStorage.getItem('token');
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to load profile.');
      setUser(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
  };

  const handleSave = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to update profile.');
      setUser(data);
      setEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone and will delete all your scans and reports.')) {
      return;
    }

    setDeleting(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to delete profile.');
      }

      // Clear local storage and redirect to login
      const authStorage = localStorage.getItem('authStorage');
      if (authStorage === 'session') {
        sessionStorage.removeItem('token');
      } else {
        localStorage.removeItem('token');
      }
      localStorage.removeItem('authStorage');
      window.location.href = '/login';
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  
  if (loading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 bg-gray-50 p-8">
          <div className="flex items-center justify-center py-24 text-gray-400 text-lg">
            Loading profile...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-blue-700">Profile</h2>
            <p className="text-gray-500 mt-1">Manage your account information.</p>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{user?.name || 'User'}</h3>
                  <p className="text-blue-100">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              {!editing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-semibold"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-800">{user?.name || '—'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-800">{user?.email || '—'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-800">{user?.phone || '—'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-800">{user?.address || '—'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Account Type</span>
                    <p className="text-gray-800 font-medium">Doctor</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Member Since</span>
                    <p className="text-gray-800 font-medium">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString('en-PK', {
                            year: 'numeric',
                            month: 'long',
                          })
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Danger Zone</h4>
                <p className="text-gray-500 text-sm mb-4">
                  Once you delete your account, there is no going back. All your scans and reports will be permanently deleted.
                </p>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
