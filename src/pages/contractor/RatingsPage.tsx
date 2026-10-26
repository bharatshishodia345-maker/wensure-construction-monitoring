import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Award,
  Scale,
  FileCheck,
} from 'lucide-react';

export const RatingsPage: React.FC = () => {
  const { contractors } = useApp();
  const builder = contractors[0]; // Rajesh Verma Constructions

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <h1 className="font-display text-3xl text-wensure-ink">
          Ratings, Audit Scores & Verified Track Record
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Objective compliance metrics broken down into verifiable dimensions. Zero algorithmic black-boxes.
        </p>
      </div>

      {/* Granular Dimension Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dimension 1: Third-Party Audit Compliance */}
        <div className="bg-white p-6 rounded-lg border border-wensure-fine-divider space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text">
              1. Engineering Compliance
            </span>
            <ShieldCheck className="w-4 h-4 text-wensure-teal" />
          </div>
          <div className="text-4xl font-display text-wensure-forest">
            98.4%
          </div>
          <p className="text-xs text-wensure-muted-text leading-relaxed">
            Percentage of structural tolerance, cube test, and plumbing checks passed on first or second audit gateway.
          </p>
        </div>

        {/* Dimension 2: Client Satisfaction */}
        <div className="bg-white p-6 rounded-lg border border-wensure-fine-divider space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text">
              2. Homeowner Reviews
            </span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display text-wensure-ink">
              4.88
            </span>
            <span className="text-xs text-stone-500">out of 5.0 (24 reviews)</span>
          </div>
          <p className="text-xs text-wensure-muted-text leading-relaxed">
            Verified post-handover evaluations from homeowners with recorded project completions.
          </p>
        </div>

        {/* Dimension 3: Dispute Index */}
        <div className="bg-white p-6 rounded-lg border border-wensure-fine-divider space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text">
              3. Dispute Status
            </span>
            <Scale className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-4xl font-display text-emerald-700">
            0.0%
          </div>
          <p className="text-xs text-wensure-muted-text leading-relaxed">
            Zero unresolved disputes or escrow payment withholdings across 19 monitored projects.
          </p>
        </div>
      </div>

      {/* Detailed Client Reviews Dossier */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-semibold text-base text-wensure-ink">
            Documented Client Review History
          </h2>
          <p className="text-xs text-wensure-muted-text">
            Feedback tied to verified completed project codes.
          </p>
        </div>

        <div className="divide-y divide-wensure-fine-divider">
          {builder.reviews.map((rev, idx) => (
            <div key={idx} className="py-5 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-wensure-ink">{rev.author}</h4>
                  <span className="text-[11px] text-wensure-muted-text">
                    {rev.role} • Project: {rev.projectReference} • {rev.date}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{rev.rating}</span>
                </div>
              </div>
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
