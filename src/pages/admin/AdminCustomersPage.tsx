import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminCustomersPage: React.FC = () => {
  const { project } = useApp();
  const [search, setSearch] = useState('');

  const customers = [
    {
      id: 'CUST-001',
      name: project.homeowner.name,
      email: project.homeowner.email,
      phone: project.homeowner.phone,
      location: project.homeowner.location,
      projectCode: project.code,
      projectName: project.name,
      status: 'Active Supervision',
      joinedDate: 'March 2026',
    },
    {
      id: 'CUST-002',
      name: 'Dr. Nikhil Sahasrabuddhe',
      email: 'nikhil.sahasra@example.com',
      phone: '+91 94220 11928',
      location: 'Pune / Bavdhan',
      projectCode: 'WNS-PUN-2024-008',
      projectName: 'Bavdhan Hillside Residence',
      status: 'Completed & Handed Over',
      joinedDate: 'January 2024',
    },
    {
      id: 'CUST-003',
      name: 'Sunita & Vikram Joshi',
      email: 'joshi.dubai@example.com',
      phone: '+971 50 882 1920',
      location: 'Dubai, UAE (NRI)',
      projectCode: 'WNS-PUN-2025-019',
      projectName: 'The Kothrud Pavilion Villa',
      status: 'Completed & Handed Over',
      joinedDate: 'June 2024',
    },
  ];

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.projectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <h1 className="font-display text-3xl text-wensure-ink">
          Homeowner Accounts & Project Association
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Registered homeowners receiving remote construction monitoring and verified audit reports.
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-wensure-fine-divider">
        <div className="relative">
          <Search className="w-4 h-4 text-wensure-muted-text absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search homeowners by name, location, or associated villa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink focus:outline-hidden focus:border-wensure-teal"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-wensure-fine-divider overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-wensure-fine-divider text-[10px] uppercase font-bold tracking-wider text-wensure-muted-text">
                <th className="py-3 px-4">Homeowner Name</th>
                <th className="py-3 px-4">Contact & Location</th>
                <th className="py-3 px-4">Associated Villa Project</th>
                <th className="py-3 px-4">Supervision Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wensure-fine-divider">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-semibold text-wensure-ink block text-sm">
                      {c.name}
                    </span>
                    <span className="text-[10.5px] text-wensure-muted-text font-mono">
                      ID: {c.id} • Member since {c.joinedDate}
                    </span>
                  </td>
                  <td className="py-4 px-4 space-y-0.5">
                    <p className="text-wensure-ink">{c.email}</p>
                    <p className="text-wensure-muted-text">{c.phone}</p>
                    <p className="text-[10.5px] text-stone-500">{c.location}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-wensure-ink block">
                      {c.projectName}
                    </span>
                    <span className="font-mono text-[10.5px] text-wensure-forest">
                      {c.projectCode}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.status.includes('Active')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      to="/customer/dashboard"
                      className="text-xs font-semibold text-wensure-teal hover:underline"
                    >
                      Open View →
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
