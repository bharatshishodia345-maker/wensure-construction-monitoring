import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  Building,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  X,
  Send,
} from 'lucide-react';

export const ContractorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { contractors, showToast } = useApp();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const builder =
    contractors.find((c) => c.id === id) || contractors[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setContactModalOpen(false);
    setContactMessage('');
    showToast(
      `Inquiry transmitted to ${builder.companyName}. A supervisor will contact you shortly.`,
      'success'
    );
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Back Link */}
      <div>
        <Link
          to="/customer/contractors"
          className="inline-flex items-center gap-2 text-xs font-semibold text-wensure-forest hover:text-wensure-teal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Contractor Directory</span>
        </Link>
      </div>

      {/* Hero Visual Banner */}
      <div className="relative rounded-lg overflow-hidden border border-wensure-fine-divider bg-stone-900 h-64 sm:h-80">
        <img
          src={builder.heroImageUrl}
          alt={builder.companyName}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wensure-ink/90 via-wensure-ink/30 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-wensure-teal bg-wensure-ink/80 px-2 py-0.5 rounded border border-wensure-teal/30">
                {builder.verifiedTier}
              </span>
              <span className="text-xs text-stone-300">
                Established {builder.establishedYear}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl text-white">
              {builder.companyName}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 flex items-center gap-1.5 font-light">
              <MapPin className="w-3.5 h-3.5 text-wensure-teal" />
              <span>{builder.location}</span>
            </p>
          </div>

          <button
            onClick={() => setContactModalOpen(true)}
            className="px-5 py-2.5 rounded bg-wensure-teal text-white text-xs font-semibold uppercase tracking-wider hover:bg-wensure-teal-dark transition-colors shadow-lg self-start sm:self-auto"
          >
            Contact Builder
          </button>
        </div>
      </div>

      {/* Compliance & Track Record Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider text-center space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-wensure-muted-text block">
            Quality Compliance
          </span>
          <span className="text-2xl font-display text-wensure-forest">
            {builder.inspectionComplianceRate}
          </span>
          <span className="text-[10.5px] text-wensure-muted-text block">
            Audit Pass Rate
          </span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider text-center space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-wensure-muted-text block">
            Client Rating
          </span>
          <div className="flex items-center justify-center gap-1 text-2xl font-display text-wensure-ink">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>{builder.rating}</span>
          </div>
          <span className="text-[10.5px] text-wensure-muted-text block">
            {builder.reviewCount} Verified Reviews
          </span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider text-center space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-wensure-muted-text block">
            Total Built Area
          </span>
          <span className="text-2xl font-display text-wensure-ink">
            {builder.totalConstructedSqFt}
          </span>
          <span className="text-[10.5px] text-wensure-muted-text block">
            {builder.verifiedProjectsCount} Completed Homes
          </span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-wensure-fine-divider text-center space-y-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-wensure-muted-text block">
            Dispute Ratio
          </span>
          <span className="text-2xl font-display text-emerald-700">
            {builder.disputeRate}
          </span>
          <span className="text-[10.5px] text-wensure-muted-text block">
            Zero Formal Claims
          </span>
        </div>
      </div>

      {/* About Company & Specializations */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-semibold text-base text-wensure-ink uppercase tracking-wider">
            About the Builder & Engineering Approach
          </h2>
          <p className="text-xs sm:text-sm text-wensure-muted-text leading-relaxed mt-2">
            {builder.aboutText}
          </p>
        </div>

        <div className="pt-4 border-t border-wensure-fine-divider space-y-3">
          <span className="text-xs font-semibold text-wensure-ink uppercase tracking-wider block">
            Certified Core Competencies
          </span>
          <div className="flex flex-wrap gap-2">
            {builder.specializations.map((spec) => (
              <span
                key={spec}
                className="px-3 py-1 bg-wensure-soft-stone text-wensure-ink text-xs rounded font-medium border border-wensure-fine-divider"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Documented Portfolio Projects */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-semibold text-base text-wensure-ink">
            Documented Construction Portfolio
          </h2>
          <p className="text-xs text-wensure-muted-text">
            Residential projects monitored and signed off under the WENSURE inspection protocol.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {builder.recentProjects.map((p, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-wensure-fine-divider overflow-hidden bg-stone-50 space-y-3"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 pt-0 space-y-1">
                <h3 className="font-semibold text-sm text-wensure-ink">{p.title}</h3>
                <p className="text-xs text-wensure-muted-text">{p.location}</p>
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 font-mono">
                  <span>{p.sqFt}</span>
                  <span className="text-wensure-forest font-semibold">{p.completedYear}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Homeowner Reviews */}
      <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-semibold text-base text-wensure-ink">
            Verified Homeowner Testimonials
          </h2>
          <p className="text-xs text-wensure-muted-text">
            Direct feedback from homeowners who built homes with {builder.companyName}.
          </p>
        </div>

        <div className="space-y-4">
          {builder.reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-5 rounded bg-wensure-soft-stone/40 border border-wensure-fine-divider space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-wensure-ink">{rev.author}</span>
                  <span className="text-[11px] text-wensure-muted-text ml-2">
                    {rev.role} • {rev.projectReference}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{rev.rating}</span>
                </div>
              </div>
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Modal */}
      {contactModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setContactModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg border border-wensure-fine-divider max-w-md w-full p-6 space-y-5 text-wensure-ink shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-wensure-fine-divider">
              <div>
                <h3 className="font-semibold text-base text-wensure-ink">
                  Inquire with {builder.companyName}
                </h3>
                <span className="text-xs text-wensure-muted-text">
                  Direct message through WENSURE Platform
                </span>
              </div>
              <button
                onClick={() => setContactModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-wensure-ink mb-1">
                  Your Project Scope & Location
                </label>
                <input
                  type="text"
                  defaultValue="New Residential Villa Construction, Baner / Pune"
                  className="w-full px-3 py-2 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-wensure-ink mb-1">
                  Message / Inquiries
                </label>
                <textarea
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Share details regarding your plot area, architectural readiness, or intended start date..."
                  className="w-full px-3 py-2 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink focus:outline-hidden focus:border-wensure-teal"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setContactModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-wensure-ink hover:bg-wensure-forest text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-wensure-teal" />
                  <span>Transmit Inquiry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
