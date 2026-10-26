import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  CheckCircle2,
  Calendar,
  Camera,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const WorkUpdatesPage: React.FC = () => {
  const { project, submitWorkUpdate } = useApp();
  const navigate = useNavigate();

  const [selectedMilestone, setSelectedMilestone] = useState('MS-05');
  const [progressPercent, setProgressPercent] = useState(92);
  const [workNotes, setWorkNotes] = useState(
    'Stairwell distribution board chase deepening completed to 25mm depth. Wall grooving vacuum cleaned and ready for PVC conduit seating. Fiber mesh applied across Master Ensuite plumbing chases.'
  );
  const [photoTitle, setPhotoTitle] = useState('Stairwell DB Chasing Deepened & Primed');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitWorkUpdate({
      milestoneId: selectedMilestone,
      progressPercent: Number(progressPercent),
      notes: workNotes,
      photoTitle,
      photoUrl,
    });
    navigate('/contractor/dashboard');
  };

  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-teal">
            Site Progress Reporting
          </span>
          <span className="text-xs text-wensure-muted-text font-mono">
            {project.code}
          </span>
        </div>
        <h1 className="font-display text-3xl text-wensure-ink">
          Submit Contractor Work Update
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Log milestone progress entries, site photographs, and daily civil notes for third-party audit review.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Project Selector */}
        <div>
          <label className="block text-xs font-semibold text-wensure-ink uppercase tracking-wider mb-1.5">
            Target Project
          </label>
          <select
            defaultValue={project.id}
            className="w-full px-3 py-2.5 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink focus:outline-hidden focus:border-wensure-teal"
          >
            <option value={project.id}>
              {project.name} ({project.code}) — Baner, Pune
            </option>
          </select>
        </div>

        {/* Milestone Selector */}
        <div>
          <label className="block text-xs font-semibold text-wensure-ink uppercase tracking-wider mb-1.5">
            Milestone In Focus
          </label>
          <select
            value={selectedMilestone}
            onChange={(e) => setSelectedMilestone(e.target.value)}
            className="w-full px-3 py-2.5 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink focus:outline-hidden focus:border-wensure-teal"
          >
            {project.milestones.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id}: {m.name} (Current: {m.actualProgress}%)
              </option>
            ))}
          </select>
        </div>

        {/* Updated Progress Percentage Slider & Number */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-wensure-ink uppercase tracking-wider">
              Updated Milestone Completion
            </label>
            <span className="text-sm font-mono font-bold text-wensure-forest">
              {progressPercent}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progressPercent}
            onChange={(e) => setProgressPercent(Number(e.target.value))}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-wensure-teal"
          />
          <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1 font-mono">
            <span>0% (Not Started)</span>
            <span>50% (Halfway)</span>
            <span>100% (Completed & Ready for Audit)</span>
          </div>
        </div>

        {/* Work Description Notes */}
        <div>
          <label className="block text-xs font-semibold text-wensure-ink uppercase tracking-wider mb-1.5">
            Supervisor Field Notes & Rectification Log
          </label>
          <textarea
            rows={4}
            value={workNotes}
            onChange={(e) => setWorkNotes(e.target.value)}
            className="w-full px-3 py-2.5 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink focus:outline-hidden focus:border-wensure-teal leading-relaxed"
            placeholder="Describe executed work, material batches used, and test observations..."
            required
          />
        </div>

        {/* Photo Upload Simulation */}
        <div className="space-y-3 pt-2 border-t border-wensure-fine-divider">
          <label className="block text-xs font-semibold text-wensure-ink uppercase tracking-wider">
            Site Evidence Photograph
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-wensure-muted-text block mb-1">
                Photo Caption / Location
              </span>
              <input
                type="text"
                value={photoTitle}
                onChange={(e) => setPhotoTitle(e.target.value)}
                className="w-full px-3 py-2 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink"
                required
              />
            </div>
            <div>
              <span className="text-[11px] text-wensure-muted-text block mb-1">
                Evidence Image URL (Demo Preset)
              </span>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full px-3 py-2 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink font-mono"
                required
              />
            </div>
          </div>

          {/* Photo Preview */}
          <div className="h-44 rounded overflow-hidden border border-wensure-fine-divider bg-stone-900 relative">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
                Provide photo URL above to preview evidence
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
              Preview: {photoTitle || 'Site Update'}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-wensure-ink hover:bg-wensure-forest text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
          >
            <UploadCloud className="w-4 h-4 text-wensure-teal" />
            <span>Transmit Work Update to Platform</span>
          </button>
        </div>
      </form>
    </div>
  );
};
