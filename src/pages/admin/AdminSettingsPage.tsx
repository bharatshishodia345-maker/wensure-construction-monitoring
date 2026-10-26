import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Server, RefreshCw, Save } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useApp();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform configuration saved in demo state', 'success');
  };

  const handleResetData = () => {
    localStorage.removeItem('wensure_project_data');
    showToast('Canonical demo data reset. Please reload page.', 'info');
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <h1 className="font-display text-3xl text-wensure-ink">
          Operations & Platform Configuration
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Regional parameters, civil tolerance thresholds, and demo environment settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text flex items-center gap-2">
            <Shield className="w-4 h-4 text-wensure-teal" />
            <span>Inspection Tolerances (Indian Standard Standards)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-wensure-ink mb-1">
                Masonry Plumb Deviation Limit
              </label>
              <input
                type="text"
                defaultValue="3.0 mm per 3-meter height (IS 2185)"
                className="w-full px-3 py-2 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink"
              />
            </div>

            <div>
              <label className="block font-medium text-wensure-ink mb-1">
                Minimum Concealed MEP Plaster Cover
              </label>
              <input
                type="text"
                defaultValue="20.0 mm minimum clear thickness"
                className="w-full px-3 py-2 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text flex items-center gap-2">
            <Server className="w-4 h-4 text-wensure-teal" />
            <span>Interactive Demo Sandbox Controls</span>
          </h2>

          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-wensure-ink">Reset Demo Project State</p>
              <p className="text-wensure-muted-text">
                Clear browser storage and restore canonical initial project data (WNS-PUN-2026-001).
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetData}
              className="px-3.5 py-2 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-wensure-ink hover:bg-wensure-forest text-white rounded text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4 text-wensure-teal" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
