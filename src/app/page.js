"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/drives");
      if (!res.ok) throw new Error("Failed to fetch placement drives.");
      const data = await res.json();
      setDrives(data);
    } catch (err) {
      setError(err.message || "Error loading placement drives.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredDrives = drives.filter((drive) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const matchesCompany = drive.companyName.toLowerCase().includes(query);
    const matchesRole = drive.jobRole.toLowerCase().includes(query);
    const matchesBranch = drive.eligibleBranches.some((branch) =>
      branch.toLowerCase().includes(query),
    );

    return matchesCompany || matchesRole || matchesBranch;
  });

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by company name, role, or branch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Navigation & Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Placement Drive Portal
            </h1>
            <p className="text-slate-600 mt-1">
              View ongoing and upcoming campus recruitment drives
            </p>
          </div>
          <Link
            href="/admin/add-drive"
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-md text-sm transition whitespace-nowrap"
          >
            + Add New Drive
          </Link>
        </header>

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Placement Drives List */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Available Placement Drives
          </h2>

          {loading ? (
            <p className="text-slate-500 text-sm py-4">
              Loading placement drives...
            </p>
          ) : drives.length === 0 ? (
            <p className="text-slate-500 text-sm py-4">
              No placement drives found at the moment.
            </p>
          ) : (
            <div className="space-y-6">
              {filteredDrives.map((drive) => {
                const formattedDate = new Date(
                  drive.driveDate,
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });

                // Show up to 3 branches, then summarize the rest with a badge
                const visibleBranches = drive.eligibleBranches.slice(0, 3);
                const extraBranchesCount = drive.eligibleBranches.length - 3;

                return (
                  <div
                    key={drive.id}
                    className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
                  >
                    {/* Top Header Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
                      <span className="bg-slate-100 text-slate-700 font-medium px-3 py-1 rounded-lg text-xs">
                        Placement Announcement
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 uppercase tracking-tight">
                      REGISTRATIONS FOR {drive.companyName} ({formattedDate})
                    </h2>

                    {/* Branch Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      {visibleBranches.map((branch) => (
                        <span
                          key={branch}
                          className="bg-slate-200 text-slate-800 font-semibold text-xs px-3 py-1 rounded-md"
                        >
                          {branch}
                        </span>
                      ))}
                      {extraBranchesCount > 0 && (
                        <span className="text-blue-600 font-semibold text-xs">
                          +{extraBranchesCount}
                        </span>
                      )}
                    </div>

                    {/* Description Body */}
                    <div className="text-slate-600 text-sm leading-relaxed space-y-3 pt-1">
                      <p>
                        It is to inform students that{" "}
                        <strong className="text-slate-800">
                          {drive.companyName}
                        </strong>{" "}
                        is going to conduct a campus placement drive for the
                        role of{" "}
                        <strong className="text-slate-800">
                          {drive.jobRole}
                        </strong>
                        .
                      </p>
                      <p>
                        <strong className="text-slate-800">
                          {drive.companyName}
                        </strong>
                        , a leading organisation, is inviting applications from
                        eligible batch candidates.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
