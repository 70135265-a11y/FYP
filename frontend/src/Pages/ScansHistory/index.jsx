import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../Components/Dashboard/Sidebar';
import { Upload, ScanLine, Search, Trash2 } from 'lucide-react';
import API_BASE_URL from '../../config';

function ScansHistoryPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterResult, setFilterResult] = useState('all');
  const [deleting, setDeleting] = useState(null);

  const getToken = () => {
    const authStorage = localStorage.getItem('authStorage');
    return authStorage === 'session'
      ? sessionStorage.getItem('token')
      : localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/api/scans/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Failed to load history.');
        setScans(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (scanId) => {
    if (!window.confirm('Are you sure you want to delete this scan?')) return;
    
    setDeleting(scanId);
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/scans/${scanId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete scan.');
      
      setScans(scans.filter(scan => scan.id !== scanId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const filteredScans = scans.filter(scan => {
    const matchesSearch = 
      scan.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.patient_id_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.patient_phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (scan.patient_cnic && scan.patient_cnic.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = 
      filterResult === 'all' ||
      (filterResult === 'normal' && scan.result === 'Normal') ||
      (filterResult === 'cirrhosis' && scan.result !== 'Normal') ||
      (filterResult === 'pending' && scan.result === 'Pending');
    
    return matchesSearch && matchesFilter;
  });

  const getResultBadge = (result) => {
    const lower = result.toLowerCase();
    if (lower === 'pending') return 'bg-yellow-100 text-yellow-700';
    if (lower.includes('cirrhosis') || lower.includes('positive')) return 'bg-red-100 text-red-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-700">Scans History</h2>
            <p className="text-gray-500 mt-1">All your previously uploaded MRI scans.</p>
          </div>
          <Link
            to="/dashboard/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white font-semibold px-5 py-3 hover:bg-blue-700 transition"
          >
            <Upload className="w-5 h-5" /> Upload New
          </Link>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, ID, phone, or CNIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
          <select
            value={filterResult}
            onChange={(e) => setFilterResult(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          >
            <option value="all">All Results</option>
            <option value="normal">Normal</option>
            <option value="cirrhosis">Cirrhosis</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24 text-gray-400 text-lg">
            Loading scans...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && scans.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-16 text-center shadow">
            <ScanLine className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No scans yet</h3>
            <p className="text-gray-400 mb-6">Upload your first MRI scan to get started.</p>
            <Link
              to="/dashboard/upload"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white font-semibold px-6 py-3 hover:bg-blue-700 transition"
            >
              Upload MRI Scan
            </Link>
          </div>
        )}

        {!loading && scans.length > 0 && filteredScans.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-16 text-center shadow">
            <ScanLine className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No matching scans</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterResult('all'); }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white font-semibold px-6 py-3 hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && scans.length > 0 && filteredScans.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">#</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Patient Name</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Patient ID</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">CNIC</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Phone</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Result</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Stage</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Confidence</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredScans.map((scan, index) => (
                  <tr key={scan.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{scan.patient_name}</td>
                    <td className="px-6 py-4 text-gray-600">{scan.patient_id_no}</td>
                    <td className="px-6 py-4 text-gray-600">{scan.patient_cnic || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{scan.patient_phone}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getResultBadge(scan.result)}`}>
                        {scan.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{scan.stage}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${(scan.confidence * 100).toFixed(0)}%` }}
                          />
                        </div>
                        <span className="text-gray-600 text-xs">{(scan.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(scan.created_at).toLocaleDateString('en-PK', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(scan.id)}
                        disabled={deleting === scan.id}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-50"
                        title="Delete scan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
              <span>Total: {scans.length} scan{scans.length !== 1 ? 's' : ''}</span>
              <span>Showing: {filteredScans.length} scan{filteredScans.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ScansHistoryPage;
