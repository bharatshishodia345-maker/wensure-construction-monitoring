import React from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  FolderGit2,
  Calendar,
  Users,
  Scale,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { DEMO_DISPUTES, DEMO_INSPECTORS } from '../../data/demoData';

export const AdminDashboard: React.FC = () => {
  const { project, inspectionReports } = useApp();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-teal bg-wensure-teal-light px-2.5 py-0.5 rounded">
              Platform Oversight & Operations
            </span>
            <span className="text-xs text-wensure-muted-text font-mono">
              Regional Command: Pune Hub
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-wensure-ink">
            Operations & Quality Governance Command
          </h1>
          <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
            Supervising independent civil audits, contractor accreditation pipelines, and milestone dispute arbitrations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/reports"
            className="text-xs font-semibold px-4 py-2.5 bg-wensure-soft-stone hover:bg-stone-200 text-wensure-ink rounded transition-colors"
          >
            Review Audit Reports
          </Link>
          <Link
            to="/admin/verification"
            className="text-xs font-semibold px-4 py-2.5 bg-wensure-ink text-white hover:bg-wensure-forest rounded transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-wensure-teal" />
            <span>Verification Queue</span>
          </Link>
        </div>
      </div>

      {/* Operational Risk Overview (Not generic KPI clutter) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-lg border border-wensure-warning/50 space-y-2">
          <span className="text-xs uppercase font-semibold text-wensure-warning block">
            Projects Requiring Intervention
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display text-wensure-warning">1</span>
            <span className="text-xs text-stone-600">Active Site</span>
          </div>
          <p className="text-[11px] text-stone-600 truncate">
            {project.name} (-2% schedule variance)
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider space-y-2">
          <span className="text-xs uppercase font-semibold text-wensure-muted-text block">
            Upcoming Audits Scheduled
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display text-wensure-ink">2</span>
            <span className="text-xs text-wensure-muted-text">This Week</span>
          </div>
          <p className="text-[11px] text-wensure-muted-text">
            Lead: Er. Neha Kulkarni on 16 Oct
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider space-y-2">
          <span className="text-xs uppercase font-semibold text-wensure-muted-text block">
            Contractors Under Audit
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display text-wensure-forest">1</span>
            <span className="text-xs text-wensure-muted-text">In Queue</span>
          </div>
          <p className="text-[11px] text-wensure-muted-text">
            Pinnacle Civil Tech (Annual Renewal)
          </p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider space-y-2">
          <span className="text-xs uppercase font-semibold text-wensure-muted-text block">
            Active Mediated Disputes
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display text-stone-700">
              {DEMO_DISPUTES.filter((d) => d.status.includes('Review')).length}
            </span>
            <span className="text-xs text-wensure-muted-text">Formal Review</span>
          </div>
          <p className="text-[11px] text-wensure-muted-text">
            Exterior waterproofing warranty check
          </p>
        </div>
      </div>

      {/* Main Operational Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 cols: High Priority Project Interventions */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-wensure-fine-divider">
            <div>
              <h2 className="font-semibold text-base text-wensure-ink">
                Priority Project Monitor: {project.name}
              </h2>
              <p className="text-xs text-wensure-muted-text">
                ID: {project.code} • Contractor: {project.contractor.name}
              </p>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs font-semibold text-wensure-teal hover:underline"
            >
              All Projects Register →
            </Link>
          </div>

          <div className="p-4 bg-wensure-warning-light/50 border border-wensure-warning/30 rounded text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-wensure-ink flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-wensure-warning" />
                <span>3 Open Quality Observations Flagged on Milestone 05</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-wensure-warning bg-white px-2 py-0.5 rounded">
                Pending Re-Inspection
              </span>
            </div>
            <p className="text-wensure-muted-text leading-relaxed">
              Auditor Er. Neha Kulkarni placed a conditional hold on final gypsum plastering due to electrical DB conduit depth cover (OBS-03: 8mm measured vs 20mm spec) and localized plumbing chase micro-fracture (OBS-01). Contractor submitted fiber-mesh rectification plan; physical re-inspection booked for 16 October 2026.
            </p>
          </div>

          {/* Key Project Status Table */}
          <div className="grid grid-cols-3 gap-3 text-xs bg-wensure-soft-stone/40 p-4 rounded border border-wensure-fine-divider text-center">
            <div>
              <span className="text-wensure-muted-text block text-[10.5px]">Recorded Progress</span>
              <span className="font-semibold text-wensure-forest text-sm">{project.recordedProgress}%</span>
            </div>
            <div>
              <span className="text-wensure-muted-text block text-[10.5px]">Schedule Variance</span>
              <span className="font-semibold text-amber-700 text-sm">{project.scheduleVariance}%</span>
            </div>
            <div>
              <span className="text-wensure-muted-text block text-[10.5px]">Disbursed Amount</span>
              <span className="font-semibold text-wensure-ink text-sm">₹54.0L of ₹90.0L</span>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Operational Pipeline Status */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-wensure-fine-divider">
            <h2 className="font-semibold text-base text-wensure-ink">
              Recent Operational Activity Log
            </h2>
            <Activity className="w-4 h-4 text-wensure-teal" />
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-wensure-teal mt-1.5 shrink-0" />
              <div>
                <p className="font-medium text-wensure-ink">
                  Contractor rectification plan received for OBS-2026-089
                </p>
                <span className="text-[10.5px] text-wensure-muted-text">
                  Rajesh Verma Constructions • 2 hours ago
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <div>
                <p className="font-medium text-wensure-ink">
                  Field audit report INS-RPT-2026-003 generated & sealed
                </p>
                <span className="text-[10.5px] text-wensure-muted-text">
                  Er. Neha Kulkarni • Yesterday at 04:15 PM
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-stone-400 mt-1.5 shrink-0" />
              <div>
                <p className="font-medium text-wensure-ink">
                  Mediation settlement completed for Koregaon Villa 09 (DSP-01)
                </p>
                <span className="text-[10.5px] text-wensure-muted-text">
                  Agreed adjustment to ₹1.45L • 14 Sept 2026
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-wensure-fine-divider">
            <Link
              to="/admin/analytics"
              className="w-full block text-center text-xs font-semibold py-2.5 bg-wensure-soft-stone hover:bg-stone-200 text-wensure-ink rounded transition-colors"
            >
              Examine Operational Analytics & Trends →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
