import React from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Building,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const ContractorProjectsPage: React.FC = () => {
  const { project } = useApp();

  const projects = [
    {
      id: project.id,
      name: project.name,
      type: project.type,
      customer: project.homeowner.name,
      location: project.city,
      stage: 'MS-05: Internal Plaster & Rough-Ins',
      recordedProgress: project.recordedProgress,
      plannedProgress: project.plannedProgress,
      upcomingMilestone: 'MS-06: Terrace Waterproofing',
      openObservations: project.openObservationsCount,
      nextInspection: project.nextInspectionDate,
      active: true,
    },
    {
      id: 'WNS-PUN-2025-019',
      name: 'The Kothrud Pavilion Villa',
      type: 'Contemporary Villa (G+2)',
      customer: 'Sunita & Vikram Joshi',
      location: 'Kothrud, Pune',
      stage: 'Handover & Snagging Completed',
      recordedProgress: 100,
      plannedProgress: 100,
      upcomingMilestone: 'Archived Handover',
      openObservations: 0,
      nextInspection: 'Completed',
      active: false,
    },
    {
      id: 'WNS-PUN-2024-008',
      name: 'Bavdhan Hillside Residence',
      type: 'Luxury Villa (4,800 sq.ft)',
      customer: 'Dr. Nikhil Sahasrabuddhe',
      location: 'Bavdhan, Pune',
      stage: 'Handover & Snagging Completed',
      recordedProgress: 100,
      plannedProgress: 100,
      upcomingMilestone: 'Archived Handover',
      openObservations: 0,
      nextInspection: 'Completed',
      active: false,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <h1 className="font-display text-3xl text-wensure-ink">
          Contractor Projects Register
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Active supervised construction sites and archived milestone delivery track record.
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className={`bg-white rounded-lg border p-6 sm:p-8 space-y-6 shadow-xs ${
              p.active ? 'border-wensure-teal/60 ring-1 ring-wensure-teal/20' : 'border-wensure-fine-divider'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-wensure-fine-divider">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-wensure-forest bg-wensure-soft-stone px-2 py-0.5 rounded">
                    {p.id}
                  </span>
                  {p.active ? (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Under Active Execution
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      Certified Complete & Handed Over
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-xl text-wensure-ink">
                  {p.name}
                </h3>
                <p className="text-xs text-wensure-muted-text">
                  Client: {p.customer} • Typology: {p.type}
                </p>
              </div>

              <Link
                to={`/contractor/projects/${p.id}`}
                className="px-4 py-2 bg-wensure-ink text-white hover:bg-wensure-forest rounded text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <span>Open Project Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 text-wensure-teal" />
              </Link>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-wensure-muted-text block mb-0.5">Location</span>
                <span className="font-medium text-wensure-ink flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-wensure-teal" />
                  {p.location}
                </span>
              </div>

              <div>
                <span className="text-wensure-muted-text block mb-0.5">Current Stage</span>
                <span className="font-medium text-wensure-ink">{p.stage}</span>
              </div>

              <div>
                <span className="text-wensure-muted-text block mb-0.5">Certified Progress</span>
                <span className="font-semibold text-wensure-forest">
                  {p.recordedProgress}% (Target: {p.plannedProgress}%)
                </span>
              </div>

              <div>
                <span className="text-wensure-muted-text block mb-0.5">Open Observations</span>
                <span
                  className={`font-semibold ${
                    p.openObservations > 0 ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {p.openObservations} pending rectification
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
