import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SitePhoto } from '../../types';
import { Lightbox } from '../../components/common/Lightbox';
import { ArchitecturalImage, ConstructionStageType } from '../../components/common/ArchitecturalImage';
import {
  ShieldCheck,
  Calendar,
  MapPin,
  Filter,
  Eye,
  Camera,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const SiteGalleryPage: React.FC = () => {
  const { project } = useApp();
  const [selectedPhoto, setSelectedPhoto] = useState<SitePhoto | null>(null);
  const [stageFilter, setStageFilter] = useState<string>('All');

  const stages = ['All', 'Structure', 'Masonry', 'Plaster & Services', 'Foundation'];

  const filteredPhotos =
    stageFilter === 'All'
      ? project.sitePhotos
      : project.sitePhotos.filter((p) => p.stage === stageFilter);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-teal">
            Photographic Evidence Dossier
          </span>
          <span className="text-xs text-wensure-muted-text font-mono">
            {project.code}
          </span>
        </div>
        <h1 className="font-display text-3xl text-wensure-ink">Site Gallery</h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          High-resolution, timestamped photographs captured during independent quality audits and contractor updates.
        </p>
      </div>

      {/* Stage Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg border border-wensure-fine-divider">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-wensure-teal" />
          <span className="text-xs font-semibold text-wensure-ink">Filter by Stage:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => setStageFilter(stage)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                stageFilter === stage
                  ? 'bg-wensure-ink text-white'
                  : 'bg-wensure-soft-stone text-wensure-muted-text hover:text-wensure-ink'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>

        <div className="text-xs text-wensure-muted-text font-mono">
          Showing {filteredPhotos.length} site evidence logs
        </div>
      </div>

      {/* Photography Grid (Image-Led) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group bg-white rounded-lg border border-wensure-fine-divider overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="h-64 overflow-hidden relative bg-stone-900">
                {(() => {
                  let mappedStage: ConstructionStageType = 'villa';
                  if (photo.stage === 'Foundation') mappedStage = 'foundation';
                  else if (photo.stage === 'Structure') mappedStage = 'rcc-structure';
                  else if (photo.stage === 'Masonry' || photo.stage === 'Plaster & Services') mappedStage = 'brickwork';
                  return (
                    <ArchitecturalImage
                      src={photo.url}
                      alt={photo.title}
                      stage={mappedStage}
                      fallbackLabel={photo.title}
                      demoLabel={`Logged ${photo.date} • ${photo.stage}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  );
                })()}

                {/* Overlaid Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-wensure-ink/80 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded backdrop-blur-xs">
                    {photo.stage}
                  </span>
                  {photo.isVerified ? (
                    <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Auditor Verified</span>
                    </span>
                  ) : (
                    <span className="bg-amber-950/80 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-xs border border-amber-500/30">
                      Audit Pending
                    </span>
                  )}
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 bg-white/90 text-wensure-ink rounded text-xs font-semibold flex items-center gap-1.5 shadow-md">
                    <Eye className="w-3.5 h-3.5 text-wensure-teal" />
                    <span>Examine Evidence</span>
                  </span>
                </div>
              </div>

              {/* Information Strip */}
              <div className="p-5 space-y-2.5">
                <h3 className="font-semibold text-sm text-wensure-ink group-hover:text-wensure-teal transition-colors line-clamp-1">
                  {photo.title}
                </h3>
                <p className="text-xs text-wensure-muted-text line-clamp-2">
                  {photo.notes}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-wensure-fine-divider mt-2">
              <div className="pt-3 flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-wensure-teal" />
                  {photo.date}
                </span>
                <span className="flex items-center gap-1 truncate max-w-[150px]">
                  <MapPin className="w-3 h-3 text-wensure-teal" />
                  {photo.locationTag}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  );
};
