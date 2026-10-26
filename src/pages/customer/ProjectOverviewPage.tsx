import React from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  CreditCard,
  MapPin,
  ShieldCheck,
  User,
  FileCheck,
  CheckCircle2,
  Download,
} from 'lucide-react';

export const ProjectOverviewPage: React.FC = () => {
  const { project, showToast } = useApp();

  const handleDownloadDoc = (docName: string) => {
    showToast(`Downloading demo document: ${docName}`, 'info');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-teal">
            Project Dossier
          </span>
          <span className="text-xs text-wensure-muted-text font-mono">
            {project.code}
          </span>
        </div>
        <h1 className="font-display text-3xl text-wensure-ink">My Project Details</h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Complete contractual specifications, residential scope, and verified stakeholder records.
        </p>
      </div>

      {/* Main Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-wensure-fine-divider space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text">
            Property Specifications
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-wensure-muted-text block">Residence Name</span>
              <span className="font-semibold text-wensure-ink text-sm">{project.name}</span>
            </div>
            <div>
              <span className="text-wensure-muted-text block">Typology</span>
              <span className="font-medium text-wensure-ink">{project.type}</span>
            </div>
            <div>
              <span className="text-wensure-muted-text block">Built-Up Area</span>
              <span className="font-medium text-wensure-ink">4,200 sq.ft. (G+1 Villa with Terrace)</span>
            </div>
            <div>
              <span className="text-wensure-muted-text block">Site Address</span>
              <span className="font-medium text-wensure-ink">{project.address}, {project.city}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-wensure-fine-divider space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text">
            Contract & Commercials
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-wensure-muted-text block">Agreed Construction Budget</span>
              <span className="font-semibold text-wensure-ink text-sm">₹90,00,000 (Fixed Price Contract)</span>
            </div>
            <div>
              <span className="text-wensure-muted-text block">Recorded Expenditure</span>
              <span className="font-medium text-wensure-forest">₹54,00,000 (60% Disbursed)</span>
            </div>
            <div>
              <span className="text-wensure-muted-text block">Contract Execution Date</span>
              <span className="font-medium text-wensure-ink">{project.startDate}</span>
            </div>
            <div>
              <span className="text-wensure-muted-text block">Target Handover Date</span>
              <span className="font-medium text-wensure-ink">{project.targetCompletionDate}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-wensure-fine-divider space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text">
            Verification Protocol
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-wensure-muted-text block">Monitoring Tier</span>
              <span className="font-semibold text-wensure-teal text-sm">WENSURE Comprehensive Oversight</span>
            </div>
            <div>
              <span className="text-wensure-muted-text block">Lead Civil Auditor</span>
              <span className="font-medium text-wensure-ink">{project.leadInspector.name}</span>
            </div>
            <div>
              <span className="text-wensure-muted-text block">Accreditation</span>
              <span className="font-medium text-wensure-ink">{project.leadInspector.accreditation}</span>
            </div>
            <div>
              <span className="text-wensure-muted-text block">Audit Frequency</span>
              <span className="font-medium text-wensure-ink">Bi-Weekly & Milestone Gateways</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stakeholders Card */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-6">
        <h2 className="text-sm font-semibold text-wensure-ink uppercase tracking-wider">
          Key Project Stakeholders
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded bg-wensure-soft-stone/50 border border-wensure-fine-divider space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-wensure-teal block">
              Homeowner (Client)
            </span>
            <p className="font-semibold text-sm text-wensure-ink">{project.homeowner.name}</p>
            <p className="text-xs text-wensure-muted-text">{project.homeowner.location}</p>
            <p className="text-xs text-wensure-muted-text">{project.homeowner.email}</p>
          </div>

          <div className="p-4 rounded bg-wensure-soft-stone/50 border border-wensure-fine-divider space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-wensure-forest block">
              Contractor (Execution)
            </span>
            <p className="font-semibold text-sm text-wensure-ink">{project.contractor.name}</p>
            <p className="text-xs text-wensure-muted-text">Principal: {project.contractor.leadContact}</p>
            <p className="text-xs text-wensure-muted-text">License: {project.contractor.license}</p>
          </div>

          <div className="p-4 rounded bg-wensure-soft-stone/50 border border-wensure-fine-divider space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-wensure-ink block">
              Third-Party Auditor (Verification)
            </span>
            <p className="font-semibold text-sm text-wensure-ink">{project.leadInspector.name}</p>
            <p className="text-xs text-wensure-muted-text">{project.leadInspector.designation}</p>
            <p className="text-xs text-wensure-muted-text">{project.leadInspector.inspectionsCompleted} Verified Inspections</p>
          </div>
        </div>
      </div>

      {/* Project Documents Archive */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-4">
        <h2 className="text-sm font-semibold text-wensure-ink uppercase tracking-wider">
          Contractual & Architectural Drawings Archive
        </h2>
        <div className="divide-y divide-wensure-fine-divider">
          {[
            { name: 'Sanctioned Architectural G+1 Drawings (Sheet A01-A12)', size: '14.2 MB', date: '28 March 2026' },
            { name: 'Structural Framing & Column Rebar Layout Schedule (Sheet S01-S08)', size: '9.8 MB', date: '04 April 2026' },
            { name: 'Fixed Price Civil Contract & Milestone Payment Agreement', size: '2.4 MB', date: '01 April 2026' },
            { name: 'Soil Geotechnical Investigation & Bearing Capacity Certificate', size: '4.1 MB', date: '15 March 2026' },
          ].map((doc, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileCheck className="w-4 h-4 text-wensure-teal" />
                <div>
                  <p className="text-xs font-medium text-wensure-ink">{doc.name}</p>
                  <span className="text-[11px] text-wensure-muted-text">{doc.date} • {doc.size}</span>
                </div>
              </div>
              <button
                onClick={() => handleDownloadDoc(doc.name)}
                className="text-xs font-medium text-wensure-forest hover:text-wensure-teal flex items-center gap-1 p-1.5 rounded hover:bg-stone-100"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
