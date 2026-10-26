import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  MapPin,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Heart,
  Info,
} from 'lucide-react';

export const OpportunitiesPage: React.FC = () => {
  const { opportunities, expressOpportunityInterest } = useApp();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-teal">
            Contractor Growth Corridor
          </span>
          <span className="text-xs text-wensure-muted-text font-mono">
            Pune West Residential Hub
          </span>
        </div>
        <h1 className="font-display text-3xl text-wensure-ink">
          Homeowner Construction Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Direct villa leads from verified homeowners seeking builders with documented WENSURE compliance track records.
        </p>
      </div>

      {/* Illustrative Notice */}
      <div className="p-3.5 bg-wensure-soft-stone/70 border border-wensure-fine-divider rounded flex items-center gap-2.5 text-xs text-wensure-muted-text">
        <Info className="w-4 h-4 text-wensure-teal shrink-0" />
        <span>
          <strong>Simulated Homeowner Opportunities:</strong> The leads presented below are illustrative demo cases intended to demonstrate contractor lead discovery and the "Express Interest" workflow.
        </span>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className={`bg-white rounded-lg border p-6 flex flex-col justify-between space-y-6 shadow-xs transition-all ${
              opp.interested
                ? 'border-wensure-teal ring-1 ring-wensure-teal'
                : 'border-wensure-fine-divider hover:shadow-md'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-wensure-forest bg-wensure-soft-stone px-2 py-0.5 rounded">
                  {opp.id}
                </span>
                <span className="text-xs font-bold text-wensure-forest">
                  {opp.budgetRange}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-base text-wensure-ink">
                  {opp.title}
                </h3>
                <p className="text-xs text-wensure-muted-text flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-wensure-teal" />
                  <span>{opp.location}</span>
                </p>
              </div>

              <div className="p-3 rounded bg-wensure-soft-stone/50 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-stone-700">
                  <span>Typology</span>
                  <span className="font-medium">{opp.propertyType}</span>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span>Built-up Area</span>
                  <span className="font-medium">{opp.areaSqFt}</span>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span>Target Timeline</span>
                  <span className="font-medium">{opp.estimatedTimeline}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-wensure-muted-text uppercase font-semibold text-[10px] block">
                  Project Scope
                </span>
                <p className="text-stone-700 leading-relaxed">
                  {opp.scopeSummary}
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-wensure-muted-text uppercase font-semibold text-[10px] block">
                  Contractor Pre-Requisite
                </span>
                <p className="text-stone-600 italic">
                  {opp.requiredExperience}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-wensure-fine-divider flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                {opp.bidsCount} builders interested
              </span>

              <button
                onClick={() => expressOpportunityInterest(opp.id)}
                className={`px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  opp.interested
                    ? 'bg-wensure-teal text-white'
                    : 'bg-wensure-ink text-white hover:bg-wensure-forest'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${opp.interested ? 'fill-current' : ''}`}
                />
                <span>{opp.interested ? 'Interest Expressed' : 'Express Interest'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
