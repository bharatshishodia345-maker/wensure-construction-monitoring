import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Send,
} from 'lucide-react';

export const ContractorIssuesPage: React.FC = () => {
  const { project, submitObservationResponse } = useApp();
  const [activeIssueId, setActiveIssueId] = useState<string>(project.observations[0]?.id || '');
  const [responseText, setResponseText] = useState('');
  const [planText, setPlanText] = useState('');

  const activeObs = project.observations.find((o) => o.id === activeIssueId) || project.observations[0];

  const handleResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    submitObservationResponse(activeIssueId, responseText, planText);
    setResponseText('');
    setPlanText('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <h1 className="font-display text-3xl text-wensure-ink">
          Observations & Rectification Submissions
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Review auditor quality observations, submit corrective execution proof, and track re-inspection clearance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 5 cols: Issue Selector List */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-wensure-fine-divider divide-y divide-wensure-fine-divider overflow-hidden">
          <div className="p-4 bg-wensure-soft-stone/60 font-semibold text-xs text-wensure-ink uppercase tracking-wider">
            Active Observation Queue ({project.observations.length})
          </div>

          {project.observations.map((obs) => (
            <button
              key={obs.id}
              onClick={() => {
                setActiveIssueId(obs.id);
                setResponseText(obs.contractorResponse || '');
                setPlanText(obs.rectificationPlan || '');
              }}
              className={`w-full text-left p-4 transition-all block ${
                activeIssueId === obs.id
                  ? 'bg-wensure-teal/5 border-l-4 border-wensure-teal'
                  : 'hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-wensure-forest">
                  {obs.code}
                </span>
                <span
                  className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    obs.severity === 'Critical'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {obs.severity}
                </span>
              </div>
              <h4 className="font-semibold text-xs text-wensure-ink truncate">
                {obs.title}
              </h4>
              <div className="flex items-center justify-between text-[11px] text-wensure-muted-text mt-2">
                <span>{obs.location.split('(')[0]}</span>
                <span className="font-medium text-wensure-teal">{obs.status}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right 7 cols: Rectification Detail & Submission Workspace */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-6">
          {activeObs ? (
            <>
              {/* Header */}
              <div className="pb-4 border-b border-wensure-fine-divider space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-wensure-forest bg-wensure-soft-stone px-2 py-0.5 rounded">
                    {activeObs.code}
                  </span>
                  <span className="text-xs text-wensure-muted-text">
                    Logged on {activeObs.detectedDate} by {activeObs.inspectorName}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-wensure-ink">
                  {activeObs.title}
                </h3>
                <p className="text-xs text-wensure-muted-text leading-relaxed">
                  {activeObs.description}
                </p>
                <div className="text-[11px] text-stone-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-wensure-teal" />
                  <span>Location: {activeObs.location}</span>
                </div>
              </div>

              {/* Mandated Action Box */}
              <div className="p-4 bg-wensure-warning-light/50 border border-wensure-warning/30 rounded text-xs space-y-1">
                <span className="font-semibold text-wensure-ink block">
                  Mandated Auditor Corrective Requirement:
                </span>
                <p className="text-stone-700 leading-relaxed font-medium">
                  {activeObs.rectificationPlan}
                </p>
              </div>

              {/* Response Submission Form */}
              <form onSubmit={handleResponseSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-wensure-ink uppercase tracking-wider mb-1">
                    Contractor Action Response / Status Update
                  </label>
                  <textarea
                    rows={4}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Detail the mechanical rework executed on site, material reinforcements deployed, and readiness for re-audit..."
                    className="w-full px-3 py-2.5 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink focus:outline-hidden focus:border-wensure-teal"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-wensure-muted-text font-mono">
                    Target Resolution: {activeObs.targetResolutionDate}
                  </span>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-wensure-ink hover:bg-wensure-forest text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 text-wensure-teal" />
                    <span>Submit Rectification for Re-Audit</span>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <p className="text-xs text-wensure-muted-text text-center py-12">
              Select an observation from the queue to review and submit rectification response.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
