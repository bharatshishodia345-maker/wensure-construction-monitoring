import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  Download,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';

export const InspectionReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { inspectionReports, project, showToast } = useApp();

  const report =
    inspectionReports.find((r) => r.id === id || r.reportCode === id) ||
    inspectionReports[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast(`Downloading certified PDF for ${report.reportCode}`, 'info');
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Action Bar (hidden on print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-wensure-fine-divider no-print">
        <Link
          to="/customer/inspections"
          className="inline-flex items-center gap-2 text-xs font-semibold text-wensure-forest hover:text-wensure-teal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Inspections Register</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-wensure-soft-stone hover:bg-stone-200 text-wensure-ink text-xs font-semibold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-wensure-ink text-white hover:bg-wensure-forest text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-wensure-teal" />
            <span>Download Certified PDF</span>
          </button>
        </div>
      </div>

      {/* Certified Engineering Report Document Sheet */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-8 sm:p-12 space-y-10 shadow-lg text-wensure-ink">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-8 border-b-2 border-wensure-ink gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-wensure-teal" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-wensure-forest">
                WENSURE INDEPENDENT CIVIL QUALITY AUDIT
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-wensure-ink">
              Quality Audit Certificate
            </h1>
            <p className="text-xs text-wensure-muted-text">
              Project: {project.name} • {project.code} • {project.address}, {project.city}
            </p>
          </div>

          <div className="bg-wensure-soft-stone p-4 rounded text-xs space-y-1 text-right sm:min-w-[220px]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-wensure-muted-text block">
              Audit Report ID
            </span>
            <span className="font-mono text-sm font-bold text-wensure-ink block">
              {report.reportCode}
            </span>
            <span className="text-[11px] text-stone-500 block">
              Inspection Date: {report.inspectionDate}
            </span>
          </div>
        </div>

        {/* Audit Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 bg-wensure-soft-stone/40 rounded border border-wensure-fine-divider text-xs">
          <div>
            <span className="text-wensure-muted-text uppercase font-semibold text-[10px] block mb-0.5">
              Lead Auditor
            </span>
            <p className="font-semibold text-wensure-ink text-sm">{report.inspectorName}</p>
            <span className="text-wensure-muted-text">{report.inspectorLicense}</span>
          </div>

          <div>
            <span className="text-wensure-muted-text uppercase font-semibold text-[10px] block mb-0.5">
              Milestone Inspected
            </span>
            <p className="font-semibold text-wensure-ink text-sm">{report.milestoneChecked}</p>
            <span className="text-wensure-muted-text">Quality Benchmark: IS 2185 & NBC 2016</span>
          </div>

          <div>
            <span className="text-wensure-muted-text uppercase font-semibold text-[10px] block mb-0.5">
              Audit Verdict
            </span>
            <span className="inline-block mt-0.5 font-bold px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-800">
              {report.verificationStatus}
            </span>
            <span className="text-wensure-muted-text block mt-1">Score: {report.overallScore}/100</span>
          </div>
        </div>

        {/* 1. Scope of Investigation */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-wensure-forest pb-1 border-b border-wensure-fine-divider">
            1. Scope of Examination
          </h2>
          <p className="text-xs sm:text-sm text-wensure-muted-text leading-relaxed">
            {report.scopeSummary}
          </p>
        </div>

        {/* 2. Recorded Civil Findings (Distinguished from Recommendations) */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-wensure-forest pb-1 border-b border-wensure-fine-divider">
            2. Recorded Civil Findings
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm">
            {report.keyFindings.map((finding, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-wensure-teal shrink-0 mt-2" />
                <span className="leading-relaxed text-wensure-ink/90">{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Photographic Evidence Grid */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-wensure-forest pb-1 border-b border-wensure-fine-divider">
            3. Photographic Evidence Logs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {report.photos.map((photo, idx) => (
              <div
                key={idx}
                className="rounded border border-wensure-fine-divider overflow-hidden bg-stone-50"
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3 space-y-1">
                  <p className="text-[11px] font-semibold text-wensure-ink line-clamp-2">
                    {photo.caption}
                  </p>
                  <span className="text-[10px] text-wensure-muted-text font-mono block">
                    {photo.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Engineer Recommendations */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-wensure-forest pb-1 border-b border-wensure-fine-divider">
            4. Independent Engineer Recommendations & Corrective Mandates
          </h2>
          <ul className="space-y-2 text-xs sm:text-sm bg-wensure-soft-stone/60 p-4 rounded border border-wensure-fine-divider">
            {report.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-wensure-warning shrink-0 mt-0.5" />
                <span className="leading-relaxed text-wensure-ink font-medium">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 5. Contractor Formal Response */}
        <div className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-wensure-forest pb-1 border-b border-wensure-fine-divider">
            5. Contractor Formal Rectification Commitment
          </h2>
          <div className="p-4 rounded bg-stone-50 border border-stone-200 text-xs space-y-1">
            <span className="font-semibold text-wensure-ink">
              Response from Rajesh Verma Constructions:
            </span>
            <p className="text-wensure-muted-text italic">
              "{report.contractorResponseNote}"
            </p>
            <span className="text-[11px] text-wensure-teal font-medium block pt-1">
              Re-inspection scheduled with Lead Auditor: {report.nextAuditDate}
            </span>
          </div>
        </div>

        {/* Sign-off Seal & Legal Disclaimer */}
        <div className="pt-8 border-t-2 border-wensure-fine-divider flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-wensure-forest flex items-center justify-center text-wensure-forest font-serif font-bold text-lg">
              W
            </div>
            <div>
              <p className="text-xs font-semibold text-wensure-ink uppercase tracking-wider">
                Certified Quality Auditor Sign-Off
              </p>
              <p className="text-xs text-wensure-muted-text">
                {report.inspectorName} • Licensed Civil Engineer
              </p>
            </div>
          </div>

          <div className="text-[11px] text-stone-400 font-mono text-left sm:text-right max-w-xs">
            Digital Hash Verification: SHA256:7f4a...92b1 • Immutable WENSURE Record
          </div>
        </div>
      </div>
    </div>
  );
};
