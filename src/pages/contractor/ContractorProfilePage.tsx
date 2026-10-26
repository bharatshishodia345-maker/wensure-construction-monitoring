import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building,
  MapPin,
  ShieldCheck,
  Star,
  Award,
  Calendar,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

export const ContractorProfilePage: React.FC = () => {
  const { contractors } = useApp();
  const builder = contractors[0]; // Rajesh Verma Constructions

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <h1 className="font-display text-3xl text-wensure-ink">
          Company Portfolio & Audit Credentials
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Public profile visible to prospective homeowners across the WENSURE network.
        </p>
      </div>

      {/* Hero Profile Header */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-xs">
        <img
          src={builder.avatarUrl}
          alt={builder.companyName}
          className="w-20 h-20 rounded-full object-cover border-2 border-wensure-teal"
        />

        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-wensure-ink">
              {builder.companyName}
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-wensure-forest text-white">
              {builder.verifiedTier}
            </span>
          </div>
          <p className="text-xs text-wensure-muted-text">
            Founder & Principal: {builder.founderName} • Established {builder.establishedYear}
          </p>
          <p className="text-xs text-wensure-muted-text flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-wensure-teal" />
            <span>{builder.location}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
          <span className="text-2xl font-display text-wensure-ink font-bold flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            {builder.rating}
          </span>
          <span className="text-xs text-wensure-muted-text">
            {builder.reviewCount} Homeowner Audits
          </span>
        </div>
      </div>

      {/* Track Record Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider text-center space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-wensure-muted-text block">
            Compliance Score
          </span>
          <span className="text-2xl font-display text-wensure-forest font-bold">
            {builder.inspectionComplianceRate}
          </span>
          <span className="text-[10.5px] text-wensure-muted-text block">
            Independent Quality Audits
          </span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider text-center space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-wensure-muted-text block">
            Verified Projects
          </span>
          <span className="text-2xl font-display text-wensure-ink font-bold">
            {builder.verifiedProjectsCount}
          </span>
          <span className="text-[10.5px] text-wensure-muted-text block">
            Villas Completed
          </span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider text-center space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-wensure-muted-text block">
            Area Constructed
          </span>
          <span className="text-2xl font-display text-wensure-ink font-bold">
            {builder.totalConstructedSqFt}
          </span>
          <span className="text-[10.5px] text-wensure-muted-text block">
            Pune West
          </span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider text-center space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-wensure-muted-text block">
            Dispute Ratio
          </span>
          <span className="text-2xl font-display text-emerald-700 font-bold">
            {builder.disputeRate}
          </span>
          <span className="text-[10.5px] text-wensure-muted-text block">
            Zero Formal Claims
          </span>
        </div>
      </div>

      {/* Specializations & Bio */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-4">
        <h3 className="font-semibold text-sm text-wensure-ink uppercase tracking-wider">
          Company Overview & Civil Credentials
        </h3>
        <p className="text-xs sm:text-sm text-wensure-muted-text leading-relaxed">
          {builder.aboutText}
        </p>

        <div className="pt-4 border-t border-wensure-fine-divider">
          <span className="text-xs font-semibold text-wensure-ink uppercase tracking-wider block mb-2">
            Verified Specializations
          </span>
          <div className="flex flex-wrap gap-2">
            {builder.specializations.map((spec) => (
              <span
                key={spec}
                className="px-3 py-1 bg-wensure-soft-stone text-wensure-ink text-xs rounded font-medium border border-wensure-fine-divider"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
