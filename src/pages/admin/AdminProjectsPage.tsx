import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export const AdminProjectsPage: React.FC = () => {
  const { project } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    {
      id: project.id,
      name: project.name,
      customer: project.homeowner.name,
      contractor: project.contractor.name,
      location: project.city,
      budget: project.totalBudget,
      progress: project.recordedProgress,
      variance: project.scheduleVariance,
      openObs: project.openObservationsCount,
      nextInspection: project.nextInspectionDate,
      status: 'Supervised In-Progress',
    },
    {
      id: 'WNS-PUN-2026-004',
      name: 'Aundh Row House 3',
      customer: 'Meera Nair',
      contractor: 'Artisan Finishes',
      location: 'Aundh, Pune',
      budget: 6500000,
      progress: 95,
      variance: -1,
      openObs: 1,
      nextInspection: '18 October 2026',
      status: 'Snagging Phase',
    },
    {
      id: 'WNS-PUN-2025-014',
      name: 'Koregaon Villa 09',
      customer: 'Sunil Mehta',
      contractor: 'Apex Infrastructure',
      location: 'Koregaon Park, Pune',
      budget: 14000000,
      progress: 100,
      variance: 0,
      openObs: 0,
      nextInspection: 'Archived Handover',
      status: 'Completed',
    },
  ];

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <h1 className="font-display text-3xl text-wensure-ink">
          Master Projects Register
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Complete operational portfolio of monitored residential builds, schedule variances, and audit dates.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-lg border border-wensure-fine-divider">
        <div className="relative">
          <Search className="w-4 h-4 text-wensure-muted-text absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search projects by ID, customer name, builder, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink focus:outline-hidden focus:border-wensure-teal"
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-wensure-fine-divider text-[10px] uppercase font-bold tracking-wider text-wensure-muted-text">
                <th className="py-3 px-4">Project ID & Name</th>
                <th className="py-3 px-4">Homeowner</th>
                <th className="py-3 px-4">Contractor</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Progress / Variance</th>
                <th className="py-3 px-4">Observations</th>
                <th className="py-3 px-4">Next Audit</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wensure-fine-divider">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono font-bold text-wensure-forest block text-[11px]">
                      {p.id}
                    </span>
                    <span className="font-semibold text-wensure-ink">{p.name}</span>
                    <span className="text-[10.5px] text-wensure-muted-text block">{p.location}</span>
                  </td>
                  <td className="py-4 px-4 font-medium text-wensure-ink">
                    {p.customer}
                  </td>
                  <td className="py-4 px-4 text-wensure-muted-text">
                    {p.contractor}
                  </td>
                  <td className="py-4 px-4 font-mono font-semibold text-wensure-ink">
                    ₹{(p.budget / 100000).toFixed(1)} Lakhs
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-wensure-forest">{p.progress}%</span>
                    <span
                      className={`ml-2 text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        p.variance < 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {p.variance}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`font-semibold ${
                        p.openObs > 0 ? 'text-amber-700' : 'text-emerald-700'
                      }`}
                    >
                      {p.openObs} Open
                    </span>
                  </td>
                  <td className="py-4 px-4 text-stone-600 whitespace-nowrap">
                    {p.nextInspection}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      to="/customer/dashboard"
                      className="text-xs font-semibold text-wensure-teal hover:underline"
                    >
                      Inspect →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
