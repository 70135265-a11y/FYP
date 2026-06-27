import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from '../../Components/Dashboard/Sidebar';
import { Upload, FileText, Download, Search, Trash2 } from 'lucide-react';

function ReportsPage() {
  const [reports, setReports] = useState([]);
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
    const fetchReports = async () => {
      try {
        const token = getToken();
        const response = await fetch('http://127.0.0.1:8000/api/reports/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Failed to load reports.');
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDelete = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    
    setDeleting(reportId);
    try {
      const token = getToken();
      const response = await fetch(`http://127.0.0.1:8000/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete report.');
      
      setReports(reports.filter(report => report.id !== reportId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const filteredReports = reports.filter(report => {
    const scan = report.scan || {};
    const matchesSearch = 
      scan.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.patient_id_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.patient_phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (scan.patient_cnic && scan.patient_cnic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      report.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterResult === 'all' ||
      (filterResult === 'normal' && scan.result === 'Normal') ||
      (filterResult === 'cirrhosis' && scan.result !== 'Normal') ||
      (filterResult === 'pending' && scan.result === 'Pending');
    
    return matchesSearch && matchesFilter;
  });

  const getResultBadge = (result) => {
    const r = (result || '').toLowerCase();
    if (r === 'pending') return 'bg-yellow-100 text-yellow-700';
    if (r.includes('cirrhosis') || r.includes('positive')) return 'bg-red-100 text-red-700';
    return 'bg-green-100 text-green-700';
  };

  const downloadPDF = (report) => {
    const doc = new jsPDF();
    const scan = report.scan;
    const date = new Date(report.created_at).toLocaleDateString('en-PK', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    doc.setFontSize(20);
    doc.setTextColor(29, 78, 216);
    doc.text('LiverAI — Medical Report', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report #${report.id}   |   Date: ${date}`, 14, 28);
    doc.line(14, 31, 196, 31);

    doc.setFontSize(13);
    doc.setTextColor(30);
    doc.text('Patient Information', 14, 40);

    autoTable(doc, {
      startY: 44,
      head: [['Field', 'Details']],
      body: [
        ['Patient Name', scan?.patient_name || '—'],
        ['Patient ID', scan?.patient_id_no || '—'],
        ['Patient Phone', scan?.patient_phone || '—'],
        ['Scan ID', `#${scan?.id || '—'}`],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [29, 78, 216] },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    });

    const afterPatient = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(13);
    doc.setTextColor(30);
    doc.text('Analysis Result', 14, afterPatient);

    autoTable(doc, {
      startY: afterPatient + 4,
      head: [['Field', 'Value']],
      body: [
        ['Result', scan?.result || '—'],
        ['Stage', scan?.stage || '—'],
        ['Confidence', `${((scan?.confidence || 0) * 100).toFixed(1)}%`],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [29, 78, 216] },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    });

    const afterResult = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(13);
    doc.setTextColor(30);
    doc.text('Report Details', 14, afterResult);

    autoTable(doc, {
      startY: afterResult + 4,
      head: [['Section', 'Content']],
      body: [
        ['Summary', report.summary || '—'],
        ['Recommendation', report.recommendation || '—'],
        ['Doctor Notes', report.doctor_notes || '—'],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [29, 78, 216] },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    });

    doc.save(`Report_${scan?.patient_name || 'patient'}_${report.id}.pdf`);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-700">Reports</h2>
            <p className="text-gray-500 mt-1">Click "Download PDF" to save any report.</p>
          </div>
          <Link
            to="/dashboard/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white font-semibold px-5 py-3 hover:bg-blue-700 transition"
          >
            <Upload className="w-5 h-5" /> Upload New Scan
          </Link>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, ID, phone, CNIC, or summary..."
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
            Loading reports...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-16 text-center shadow">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No reports yet</h3>
            <p className="text-gray-400 mb-6">Reports are auto-generated when you upload a scan.</p>
            <Link
              to="/dashboard/upload"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white font-semibold px-6 py-3 hover:bg-blue-700 transition"
            >
              Upload MRI Scan
            </Link>
          </div>
        )}

        {!loading && reports.length > 0 && filteredReports.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-16 text-center shadow">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No matching reports</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setFilterResult('all'); }}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white font-semibold px-6 py-3 hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && reports.length > 0 && filteredReports.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Report #</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Scan ID</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Patient Name</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Patient ID</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">CNIC</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Result</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-500 font-medium">#{report.id}</td>
                    <td className="px-6 py-4 text-gray-500">#{report.scan_id}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {report.scan?.patient_name || '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {report.scan?.patient_id_no || '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {report.scan?.patient_cnic || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getResultBadge(report.scan?.result || 'Pending')}`}>
                        {report.scan?.result || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(report.created_at).toLocaleDateString('en-PK', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => downloadPDF(report)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold px-4 py-2 hover:bg-blue-700 transition"
                        >
                          <Download className="w-4 h-4" /> Download
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          disabled={deleting === report.id}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-50"
                          title="Delete report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
              <span>Total: {reports.length} report{reports.length !== 1 ? 's' : ''}</span>
              <span>Showing: {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ReportsPage;
