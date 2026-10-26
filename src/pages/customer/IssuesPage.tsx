import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin,
  Camera,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { Lightbox } from '../../components/common/Lightbox';
import { SitePhoto } from '../../types';

export const IssuesPage: React.FC = () => {
  const { project, resolveObservationAdmin, currentRole } = useApp();
  const [selectedEvidence, setSelectedEvidence] = useState<SitePhoto | null>(null);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-teal">
            Civil Quality Assurance
          </span>
          <span className="text-xs text-wensure-muted-text font-mono">
            {project.code}
          </span>
        </div>
        <h1 className="font-display text-3xl text-wensure-ink">
          Observations & Defect Rectification Register
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Independent observations identified during site audits, contractor rectification commitments, and scheduled re-inspections.
        </p>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider space-y-1">
          <span className="text-xs text-wensure-muted-text uppercase font-semibold">
            Open Observations
          </span>
          <div className="text-3xl font-display text-wensure-ink">
            {project.openObservationsCount}
          </div>
          <p className="text-[11px] text-amber-700 font-medium">
            1 Critical • 1 Warning • 1 Moderate
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider space-y-1">
          <span className="text-xs text-wensure-muted-text uppercase font-semibold">
            Contractor Response Rate
          </span>
          <div className="text-3xl font-display text-wensure-forest">
            100%
          </div>
          <p className="text-[11px] text-emerald-800 font-medium">
            All 3 have logged repair plans
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider space-y-1">
          <span className="text-xs text-wensure-muted-text uppercase font-semibold">
            Next Field Re-Inspection
          </span>
          <div className="text-3xl font-display text-wensure-teal">
            16 Oct
          </div>
          <p className="text-[11px] text-wensure-muted-text">
            Er. Neha Kulkarni on-site audit
          </p>
        </div>
      </div>

      {/* Observations Detailed Register */}
      <div className="space-y-6">
        {project.observations.map((obs) => (
          <div
            key={obs.id}
            className={`bg-white rounded-lg border p-6 sm:p-8 space-y-6 shadow-xs ${
              obs.severity === 'Critical'
                ? 'border-rose-300'
                : obs.severity === 'Warning'
                ? 'border-amber-300'
                : 'border-wensure-fine-divider'
            }`}
          >
            {/* Top Row: Code, Title, Severity & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-wensure-fine-divider">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-wensure-forest bg-wensure-soft-stone px-2 py-0.5 rounded">
                    {obs.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      obs.severity === 'Critical'
                        ? 'bg-rose-100 text-rose-800'
                        : obs.severity === 'Warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {obs.severity} Severity
                  </span>
                  <span className="text-xs text-wensure-muted-text">
                    Category: {obs.category}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-wensure-ink">
                  {obs.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded ${
                    obs.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  Status: {obs.status}
                </span>

                {currentRole === 'admin' && obs.status !== 'Resolved' && (
                  <button
                    onClick={() => resolveObservationAdmin(obs.id)}
                    className="text-xs bg-wensure-forest text-white px-3 py-1 rounded font-medium hover:bg-wensure-ink transition-colors"
                  >
                    Simulate Sign-Off
                  </button>
                )}
              </div>
            </div>

            {/* Middle Grid: Description & Evidence Visual */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Description & Location (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-muted-text block mb-1">
                    Auditor Observation & Engineering Deficit
                  </span>
                  <p className="text-xs sm:text-sm text-wensure-ink leading-relaxed">
                    {obs.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-wensure-muted-text">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-wensure-teal" />
                    {obs.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-wensure-teal" />
                    Logged on {obs.detectedDate} by {obs.inspectorName}
                  </span>
                </div>

                {/* Mandated Corrective Action */}
                <div className="p-4 rounded bg-wensure-soft-stone/70 border border-wensure-fine-divider space-y-1">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-wensure-forest block">
                    Mandated Rectification Plan
                  </span>
                  <p className="text-xs text-wensure-ink font-medium leading-relaxed">
                    {obs.rectificationPlan}
                  </p>
                </div>

                {/* Contractor Formal Response */}
                {obs.contractorResponse && (
                  <div className="p-4 rounded bg-emerald-50/60 border border-emerald-200/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-900 block flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                        Contractor Execution Commitment
                      </span>
                      {obs.contractorResponseDate && (
                        <span className="text-[10px] text-emerald-800 font-mono">
                          Submitted {obs.contractorResponseDate}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-800 italic leading-relaxed">
                      "{obs.contractorResponse}"
                    </p>
                  </div>
                )}
              </div>

              {/* Evidence Photograph (4 cols) */}
              <div className="lg:col-span-4 space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-muted-text block">
                  Logged Site Evidence
                </span>
                <div
                  onClick={() =>
                    setSelectedEvidence({
                      id: obs.id,
                      url: obs.evidenceImageUrl,
                      title: obs.title,
                      stage: obs.category,
                      date: obs.detectedDate,
                      locationTag: obs.location,
                      isVerified: true,
                      verifiedBy: obs.inspectorName,
                      notes: obs.description,
                    })
                  }
                  className="rounded border border-wensure-fine-divider overflow-hidden relative group cursor-pointer h-44 bg-stone-900"
                >
                  <img
                    src={obs.evidenceImageUrl}
                    alt={obs.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                    <Camera className="w-4 h-4 text-wensure-teal" />
                    <span>Zoom Evidence</span>
                  </div>
                </div>
                <div className="text-[11px] text-stone-500 flex items-center justify-between">
                  <span>Target Closure: {obs.targetResolutionDate}</span>
                  <span className="text-wensure-teal font-medium">Re-check: 16 Oct</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        photo={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  );
};
