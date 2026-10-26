import React from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import {
  Bell,
  Calendar,
  AlertTriangle,
  Briefcase,
  CheckCheck,
  ExternalLink,
} from 'lucide-react';

export const ContractorNotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-wensure-fine-divider">
        <div>
          <h1 className="font-display text-3xl text-wensure-ink">
            Contractor Action Dispatch & Reminders
          </h1>
          <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
            Inspection alerts, observation deadlines, and new project opportunity notifications.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="inline-flex items-center gap-2 px-3 py-2 bg-wensure-soft-stone hover:bg-stone-200 text-wensure-ink rounded text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4 text-wensure-teal" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-wensure-fine-divider divide-y divide-wensure-fine-divider shadow-xs overflow-hidden">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={`p-5 flex items-start gap-4 transition-colors cursor-pointer ${
              n.isRead ? 'bg-white' : 'bg-wensure-soft-stone/30'
            }`}
          >
            <div className="p-2.5 rounded-full bg-wensure-teal/10 text-wensure-teal shrink-0">
              <Bell className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-wensure-ink">{n.title}</h3>
                <span className="text-[10px] text-wensure-muted-text font-mono">
                  {n.timestamp}
                </span>
              </div>
              <p className="text-xs text-wensure-muted-text leading-relaxed">
                {n.description}
              </p>
              <div className="pt-2 flex items-center justify-between">
                <Link
                  to={n.linkTo}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-wensure-teal hover:underline"
                >
                  <span>Open Task Details</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                {!n.isRead && <span className="w-2 h-2 rounded-full bg-wensure-teal" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
