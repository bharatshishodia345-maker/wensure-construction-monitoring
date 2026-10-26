import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import {
  Search,
  ShieldCheck,
  Star,
} from 'lucide-react';

export const AdminContractorsPage: React.FC = () => {
  const { contractors } = useApp();
  const [query, setQuery] = useState('');

  const filtered = contractors.filter(
    (c) =>
      c.companyName.toLowerCase().includes(query.toLowerCase()) ||
      c.founderName.toLowerCase().includes(query.toLowerCase()) ||
      c.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <h1 className="font-display text-3xl text-wensure-ink">
          Contractors & Builders Directory
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Registered residential builders, independent accreditation statuses, and compliance track records.
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-wensure-fine-divider">
        <div className="relative">
          <Search className="w-4 h-4 text-wensure-muted-text absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search contractors by company name, founder, or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink focus:outline-hidden focus:border-wensure-teal"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-wensure-fine-divider overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-wensure-fine-divider text-[10px] uppercase font-bold tracking-wider text-wensure-muted-text">
              <th className="py-3 px-4">Company & Founder</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Accreditation Tier</th>
              <th className="py-3 px-4">Compliance Score</th>
              <th className="py-3 px-4">Rating / Reviews</th>
              <th className="py-3 px-4">Built Sq.Ft</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wensure-fine-divider">
            {filtered.map((b) => (
              <tr key={b.id} className="hover:bg-stone-50/50 transition-colors">
                <td className="py-4 px-4">
                  <span className="font-semibold text-wensure-ink block text-sm">
                    {b.companyName}
                  </span>
                  <span className="text-[10.5px] text-wensure-muted-text">
                    {b.founderName} • Est. {b.establishedYear}
                  </span>
                </td>
                <td className="py-4 px-4 text-stone-600">
                  {b.location}
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-wensure-forest text-white">
                    <ShieldCheck className="w-3 h-3 text-wensure-teal" />
                    <span>{b.verifiedTier}</span>
                  </span>
                </td>
                <td className="py-4 px-4 font-mono font-bold text-wensure-forest">
                  {b.inspectionComplianceRate}
                </td>
                <td className="py-4 px-4">
                  <span className="font-bold text-wensure-ink flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {b.rating} ({b.reviewCount})
                  </span>
                </td>
                <td className="py-4 px-4 font-mono text-stone-600">
                  {b.totalConstructedSqFt}
                </td>
                <td className="py-4 px-4 text-right">
                  <Link
                    to={`/customer/contractors/${b.id}`}
                    className="text-xs font-semibold text-wensure-teal hover:underline"
                  >
                    View Dossier →
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
