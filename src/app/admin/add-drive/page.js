'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BRANCH_OPTIONS = ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT'];

export default function AddDrivePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    driveDate: '',
    eligibleBranches: [],
  });

  const handleBranchToggle = (branch) => {
    setFormData((prev) => {
      const branches = prev.eligibleBranches.includes(branch)
        ? prev.eligibleBranches.filter((b) => b !== branch)
        : [...prev.eligibleBranches, branch];
      return { ...prev, eligibleBranches: branches };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

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
      if (!res.ok) throw new Error(data.error || 'Failed to submit placement drive.');

      setMessage({ type: 'success', text: 'Placement drive saved successfully! Redirecting...' });
      
      // Redirect back to Home Page after successful submission
      setTimeout(() => {
        router.push('/');
      }, 1200);

    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Navigation Link */}
        <div>
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
            &larr; Back to Drive List
          </Link>
        </div>

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

        {/* Form Container */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Add Placement Drive</h1>
          <p className="text-sm text-slate-600 mb-6">Enter recruitment drive details below</p>

          <form onSubmit={handleSubmit} className="space-y-4 text-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Drive Date</label>
              <input
                type="date"
                value={formData.driveDate}
                onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Eligible Branches</label>
              <div className="grid grid-cols-3 gap-3">
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
              className="w-full bg-slate-900 text-white font-semibold py-2.5 px-4 rounded-md hover:bg-slate-800 transition disabled:opacity-50 mt-4"
            >
              {submitting ? 'Saving Drive...' : 'Save Placement Drive'}
            </button>
          </form>
        </section>

      </div>
    </main>
  );
}