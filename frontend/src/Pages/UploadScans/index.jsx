import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../Components/Dashboard/Sidebar';
import API_BASE_URL from '../../config';

function UploadScansPage() {
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientIdNo, setPatientIdNo] = useState('');
  const [patientCnic, setPatientCnic] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [analysing, setAnalysing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const folderRef = useRef(null);

  const getToken = () => {
    const authStorage = localStorage.getItem('authStorage');
    return authStorage === 'session'
      ? sessionStorage.getItem('token')
      : localStorage.getItem('token');
  };

  const isDicom = (f) => f.name.toLowerCase().endsWith('.dcm');

  const addFiles = (newFiles) => {
    const valid = Array.from(newFiles).filter(
      (f) => f.type.startsWith('image/') || isDicom(f)
    );
    if (!valid.length) return;
    setFiles((prev) => [...prev, ...valid]);
    setResult(null);
    setError('');
  };

  const handleFileChange = (e) => { if (e.target.files) addFiles(e.target.files); };
  const handleDrop = (e) => { e.preventDefault(); if (e.dataTransfer.files) addFiles(e.dataTransfer.files); };

  const handleUpload = () => {
    if (!patientName.trim()) { setError('Patient name is required.'); return; }
    if (!patientPhone.trim()) { setError('Patient phone is required.'); return; }
    if (!/^\d+$/.test(patientPhone.trim())) { setError('Patient phone must contain only numbers.'); return; }
    if (!patientIdNo.trim()) { setError('Patient ID is required.'); return; }
    if (patientCnic.trim() && !/^\d+$/.test(patientCnic.trim())) { setError('Patient CNIC must contain only numbers.'); return; }
    if (!files.length) { setError('Please select at least one scan.'); return; }

    setUploading(true);
    setUploadPct(0);
    setAnalysing(false);
    setError('');
    setResult(null);

    const token = getToken();
    const formData = new FormData();
    formData.append('patient_name', patientName.trim());
    formData.append('patient_phone', patientPhone.trim());
    formData.append('patient_id_no', patientIdNo.trim());
    if (patientCnic.trim()) {
      formData.append('patient_cnic', patientCnic.trim());
    }
    files.forEach((f) => formData.append('files', f));

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/api/scans/upload-folder`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setUploadPct(pct);
        if (pct === 100) { setUploading(false); setAnalysing(true); }
      }
    };

    xhr.onload = () => {
      setUploading(false);
      setAnalysing(false);
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          setResult(data);
        } else {
          setError(data.detail || 'Upload failed.');
        }
      } catch {
        setError('Unexpected server response.');
      }
    };

    xhr.onerror = () => { setUploading(false); setAnalysing(false); setError('Network error. Is the server running?'); };
    xhr.send(formData);
  };

  const handleReset = () => {
    setPatientName('');
    setPatientCnic('');
    setPatientPhone('');
    setPatientIdNo('');
    setFiles([]);
    setResult(null);
    setError('');
    setUploadPct(0);
    setAnalysing(false);
    if (folderRef.current) folderRef.current.value = '';
  };

  const busy = uploading || analysing;

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">Upload MRI Scan Series</h2>
        <p className="text-gray-500 mb-8">Select all DICOM slices for one patient — the AI analyses every slice and returns a single diagnosis.</p>

        {!result ? (
          <div className="max-w-2xl space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow space-y-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name <span className="text-red-500">*</span></label>
                  <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Ali Hassan"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Phone <span className="text-red-500">*</span></label>
                  <input type="tel" value={patientPhone} onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setPatientPhone(value);
                  }}
                    placeholder="e.g. 0300-1234567"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID <span className="text-red-500">*</span></label>
                  <input type="text" value={patientIdNo} onChange={(e) => setPatientIdNo(e.target.value)}
                    placeholder="e.g. PAT-001 or CNIC"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient CNIC <span className="text-red-500">*</span></label>
                  <input type="text" value={patientCnic} onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setPatientCnic(value);
                  }}
                    placeholder="e.g. 12345-1234567-1"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition" />
                </div>
              </div>

              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-blue-300 rounded-xl p-10 text-center hover:border-blue-400 hover:bg-blue-50 transition"
              >
                <div className="text-5xl mb-3">🩻</div>
                <p className="text-blue-600 font-semibold">Select all slices for one patient's liver scan</p>
                <div className="mt-4 flex justify-center gap-3">
                  <button type="button" onClick={() => folderRef.current?.click()}
                    className="rounded-lg bg-indigo-600 text-white text-xs font-semibold px-4 py-2 hover:bg-indigo-700 transition">
                    🗂️ Select Folder
                  </button>
                </div>
                <p className="text-gray-400 text-sm mt-3">Select a folder containing DICOM (.dcm), JPG, or PNG slices — all files treated as one scan</p>
                <input ref={folderRef} type="file" multiple webkitdirectory="" className="hidden" onChange={handleFileChange} />
              </div>

              {files.length > 0 && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-4 flex items-center gap-4">
                  <span className="text-3xl">🩻</span>
                  <div className="flex-1">
                    <div className="font-semibold text-indigo-800">{files.length} slice{files.length !== 1 ? 's' : ''} ready</div>
                    <div className="text-xs text-indigo-500 mt-0.5 truncate">{files[0].name}{files.length > 1 ? ` … ${files[files.length - 1].name}` : ''}</div>
                  </div>
                  <button onClick={() => { setFiles([]); if (folderRef.current) folderRef.current.value = ''; }}
                    className="text-xs text-red-400 hover:text-red-600 font-medium">Clear</button>
                </div>
              )}

              {busy && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-blue-600 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span className="text-sm font-semibold text-blue-700">
                      {analysing ? `Analysing ${files.length} slices with AI…` : `Uploading ${files.length} slices… ${uploadPct}%`}
                    </span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-300 ${analysing ? 'bg-indigo-500 w-full animate-pulse' : 'bg-blue-600'}`}
                      style={!analysing ? { width: `${uploadPct}%` } : {}} />
                  </div>
                  {analysing && (
                    <p className="text-xs text-indigo-500">This may take a moment depending on the number of slices…</p>
                  )}
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <div className="flex gap-3">
                <button onClick={handleUpload} disabled={busy || !files.length}
                  className="flex-1 rounded-xl bg-blue-600 text-white font-semibold py-3 hover:bg-blue-700 transition disabled:opacity-50">
                  {busy ? (analysing ? 'Analysing…' : `Uploading… ${uploadPct}%`) : `Analyse Scan Series${files.length ? ` (${files.length} slices)` : ''}`}
                </button>
                {files.length > 0 && !busy && (
                  <button onClick={handleReset}
                    className="rounded-xl border border-gray-200 px-5 py-3 text-gray-600 hover:bg-gray-100 transition">
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl ${result.result === 'Normal' ? 'bg-green-100' : 'bg-orange-100'}`}>
                  {result.result === 'Normal' ? '✅' : '⚠️'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Scan Series Analysed</h3>
                  <p className="text-gray-500 text-sm">Scan ID: #{result.id} · {files.length} slices processed</p>
                </div>
              </div>

              <div className={`rounded-xl p-5 text-center ${result.result === 'Normal' ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
                <div className={`text-3xl font-extrabold mb-1 ${result.result === 'Normal' ? 'text-green-700' : 'text-orange-700'}`}>
                  {result.result}
                </div>
                <div className={`text-sm font-medium ${result.result === 'Normal' ? 'text-green-600' : 'text-orange-600'}`}>
                  {result.stage}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-xs text-blue-500 font-medium mb-1">Patient Name</div>
                  <div className="font-bold text-gray-800">{result.patient_name}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-xs text-blue-500 font-medium mb-1">Patient Phone</div>
                  <div className="font-bold text-gray-800">{result.patient_phone}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-xs text-blue-500 font-medium mb-1">Patient ID</div>
                  <div className="font-bold text-gray-800">{result.patient_id_no}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 font-medium mb-1">AI Confidence</div>
                  <div className="font-bold text-gray-800">{(result.confidence * 100).toFixed(1)}%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 font-medium mb-1">Slices Analysed</div>
                  <div className="font-bold text-gray-800">{files.length}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 font-medium mb-1">Date</div>
                  <div className="font-bold text-gray-800">{new Date(result.created_at).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={handleReset}
                  className="flex-1 rounded-xl bg-blue-600 text-white font-semibold py-3 hover:bg-blue-700 transition">
                  New Scan
                </button>
                <Link to="/dashboard/history"
                  className="flex-1 text-center rounded-xl border border-gray-200 px-5 py-3 text-gray-700 font-semibold hover:bg-gray-50 transition">
                  View History
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UploadScansPage;
