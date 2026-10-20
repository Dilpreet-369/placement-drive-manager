'use client';

import { useState, useEffect } from 'react';

const BRANCH_OPTIONS = ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT'];

export default function Home() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form State matching PlacementDrive schema
  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    driveDate: '',
    eligibleBranches: [],
  });

  // GET: Fetch saved placement drives
  const fetchDrives = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/drives');
      if (!res.ok) throw new Error('Failed to fetch drives');
      const data = await res.json();
      setDrives(data);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error loading placement drives.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  // Checkbox toggle for eligibleBranches
  const handleBranchToggle = (branch) => {
    setFormData((prev) => {
      const branches = prev.eligibleBranches.includes(branch)
        ? prev.eligibleBranches.filter((b) => b !== branch)
        : [...prev.eligibleBranches, branch];
      return { ...prev, eligibleBranches: branches };
    });
  };

  // POST: Add new placement drive
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.companyName.trim() || !formData.jobRole.trim() || !formData.driveDate) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }
    if (formData.eligibleBranches.length === 0) {
      setMessage({ type: 'error', text: 'Select at least one eligible branch.' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/drives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit drive');

      setMessage({ type: 'success', text: 'Placement drive saved successfully!' });
      setFormData({ companyName: '', jobRole: '', driveDate: '', eligibleBranches: [] });
      fetchDrives(); // Refresh drive list
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Placement Drive Manager</h1>
          <p className="text-slate-600 mt-1">Add and manage campus recruitment drives</p>
        </header>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`p-4 rounded-md text-sm font-medium ${
              message.type === 'error'
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-green-100 text-green-700 border border-green-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form Component */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Add Placement Drive</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Microsoft"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Job Role */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Role</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer"
                  value={formData.jobRole}
                  onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            {/* Drive Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Drive Date</label>
              <input
                type="date"
                value={formData.driveDate}
                onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Eligible Branches */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Eligible Branches</label>
              <div className="flex flex-wrap gap-4">
                {BRANCH_OPTIONS.map((branch) => (
                  <label key={branch} className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.eligibleBranches.includes(branch)}
                      onChange={() => handleBranchToggle(branch)}
                      className="rounded text-slate-900 focus:ring-slate-900"
                    />
                    <span>{branch}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-900 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-800 transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Submit Placement Drive'}
            </button>
          </form>
        </section>

        {/* Placement Drives List Display */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Saved Placement Drives</h2>

          {loading ? (
            <p className="text-slate-500 text-sm">Loading drives...</p>
          ) : drives.length === 0 ? (
            <p className="text-slate-500 text-sm">No placement drives found. Submit one above!</p>
          ) : (
            <div className="space-y-4">
              {drives.map((drive) => (
                <div key={drive.id} className="p-4 border border-slate-200 rounded-md bg-slate-50 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">{drive.companyName}</h3>
                    <span className="text-xs bg-slate-200 text-slate-800 px-2 py-1 rounded">
                      {new Date(drive.driveDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium text-slate-700">Role: {drive.jobRole}</p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Branches:</span>
                    <div className="flex flex-wrap gap-1">
                      {drive.eligibleBranches.map((branch) => (
                        <span key={branch} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {branch}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}