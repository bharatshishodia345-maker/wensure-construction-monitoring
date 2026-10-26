import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Star,
  ShieldCheck,
  Building,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';

export const ContractorsPage: React.FC = () => {
  const { contractors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');

  const specializations = [
    'All',
    'Luxury Villas',
    'Turnkey Construction',
    'Exposed Brickwork',
    'RCC Framed Structures',
  ];

  const tiers = ['All', 'Independent Platinum', 'Independent Gold'];

  const filtered = contractors.filter((c) => {
    const matchesSearch =
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.founderName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpec =
      selectedSpecialization === 'All' ||
      c.specializations.includes(selectedSpecialization);

    const matchesTier = selectedTier === 'All' || c.verifiedTier === selectedTier;

    return matchesSearch && matchesSpec && matchesTier;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-teal">
            Verified Builder Discovery
          </span>
          <span className="text-xs text-wensure-muted-text font-mono">
            Pune West Corridor
          </span>
        </div>
        <h1 className="font-display text-3xl text-wensure-ink">
          Find Documented & Verified Contractors
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Evaluate residential builders based on third-party inspection compliance scores, completed square footage, and verified client outcomes.
        </p>
      </div>

      {/* Illustrative Demo Notice */}
      <div className="p-3.5 bg-wensure-soft-stone/70 border border-wensure-fine-divider rounded flex items-center gap-2.5 text-xs text-wensure-muted-text">
        <Info className="w-4 h-4 text-wensure-teal shrink-0" />
        <span>
          <strong>Illustrative Contractor Dossiers:</strong> Builder profiles and compliance metrics are structured demo models designed to demonstrate third-party verification workflow.
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-wensure-muted-text absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by builder name, location, or founder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink focus:outline-hidden focus:border-wensure-teal focus:ring-1 focus:ring-wensure-teal"
            />
          </div>

          {/* Specialization Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-3 py-2.5 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink focus:outline-hidden focus:border-wensure-teal"
            >
              {specializations.map((s) => (
                <option key={s} value={s}>
                  Specialization: {s}
                </option>
              ))}
            </select>
          </div>

          {/* Tier Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-3 py-2.5 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink focus:outline-hidden focus:border-wensure-teal"
            >
              {tiers.map((t) => (
                <option key={t} value={t}>
                  Tier: {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contractor Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((builder) => (
          <div
            key={builder.id}
            className="bg-white rounded-lg border border-wensure-fine-divider overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header Image + Avatar */}
              <div className="h-48 overflow-hidden relative bg-stone-900">
                <img
                  src={builder.heroImageUrl}
                  alt={builder.companyName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-wensure-ink/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded backdrop-blur-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-wensure-teal" />
                  <span>{builder.verifiedTier}</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  Est. {builder.establishedYear}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-wensure-ink">
                      {builder.companyName}
                    </h3>
                    <p className="text-xs text-wensure-muted-text flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-wensure-teal shrink-0" />
                      <span>{builder.location}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded text-xs font-bold text-amber-900 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{builder.rating}</span>
                    <span className="font-normal text-stone-500">
                      ({builder.reviewCount})
                    </span>
                  </div>
                </div>

                <p className="text-xs text-wensure-muted-text line-clamp-2">
                  {builder.tagline}
                </p>

                {/* Performance Metrics Row */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-wensure-soft-stone/50 rounded border border-wensure-fine-divider text-center text-xs">
                  <div>
                    <span className="text-[10px] text-wensure-muted-text uppercase block">
                      Compliance
                    </span>
                    <span className="font-semibold text-wensure-forest">
                      {builder.inspectionComplianceRate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-wensure-muted-text uppercase block">
                      Verified Area
                    </span>
                    <span className="font-semibold text-wensure-ink">
                      {builder.totalConstructedSqFt}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-wensure-muted-text uppercase block">
                      Dispute Rate
                    </span>
                    <span className="font-semibold text-emerald-700">
                      {builder.disputeRate}
                    </span>
                  </div>
                </div>

                {/* Specialization Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {builder.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="text-[10px] bg-wensure-soft-stone text-wensure-ink px-2 py-0.5 rounded font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Footer Action */}
            <div className="p-6 pt-0 border-t border-wensure-fine-divider mt-4">
              <div className="pt-4 flex items-center justify-between text-xs">
                <span className="text-wensure-muted-text">
                  {builder.verifiedProjectsCount} audited residential completions
                </span>
                <Link
                  to={`/customer/contractors/${builder.id}`}
                  className="font-semibold text-wensure-ink hover:text-wensure-teal flex items-center gap-1"
                >
                  <span>View Full Portfolio & Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
