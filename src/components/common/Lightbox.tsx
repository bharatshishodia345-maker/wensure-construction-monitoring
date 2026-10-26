import React from 'react';
import { X, CheckCircle, Calendar, MapPin, Shield } from 'lucide-react';
import { SitePhoto } from '../../types';

interface LightboxProps {
  photo: SitePhoto | null;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-wensure-ink/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-wensure-ink border border-white/20 rounded-md max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden text-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-wensure-teal font-semibold">
              {photo.stage} Stage Evidence
            </span>
            <h3 className="text-base font-semibold text-white truncate max-w-lg">
              {photo.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Image + Inspection details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto max-h-[78vh]">
          {/* Main Image */}
          <div className="lg:col-span-8 bg-black/70 flex items-center justify-center min-h-[350px] lg:min-h-[500px] p-2">
            <img
              src={photo.url}
              alt={photo.title}
              className="max-h-[70vh] w-auto max-w-full object-contain rounded"
            />
          </div>

          {/* Metadata Sidebar */}
          <div className="lg:col-span-4 p-6 bg-wensure-forest/20 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 space-y-6">
            <div className="space-y-5">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1">
                  Verification Status
                </span>
                {photo.isVerified ? (
                  <div className="inline-flex items-center gap-1.5 bg-wensure-success/20 text-emerald-300 border border-wensure-success/40 px-2.5 py-1 rounded text-xs font-medium">
                    <Shield className="w-3.5 h-3.5 text-wensure-teal" />
                    <span>Independently Verified by {photo.verifiedBy || 'Auditor'}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded text-xs font-medium">
                    <span>Contractor Uploaded — Audit Pending</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-stone-300">
                  <Calendar className="w-3.5 h-3.5 text-wensure-teal" />
                  <span>Timestamp: {photo.date}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-300">
                  <MapPin className="w-3.5 h-3.5 text-wensure-teal" />
                  <span>Location Tag: {photo.locationTag}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1">
                  Site Audit Notes
                </span>
                <p className="text-xs text-stone-300 leading-relaxed font-normal bg-black/30 p-3 rounded border border-white/5">
                  {photo.notes}
                </p>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 border-t border-white/10 pt-4">
              Cryptographically timestamped & preserved in canonical project record WNS-PUN-2026-001.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
