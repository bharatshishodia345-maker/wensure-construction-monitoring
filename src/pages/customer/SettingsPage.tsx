import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Bell, Shield, Lock, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser, showToast } = useApp();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Preferences updated successfully in demo state', 'success');
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-wensure-fine-divider pb-5">
        <h1 className="font-display text-3xl text-wensure-ink">
          Profile & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
          Manage homeowner profile details, remote notification alerts, and security settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text flex items-center gap-2">
            <User className="w-4 h-4 text-wensure-teal" />
            <span>Homeowner Profile Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-wensure-ink mb-1">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={currentUser.name}
                className="w-full px-3 py-2 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-wensure-ink mb-1">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={currentUser.email}
                className="w-full px-3 py-2 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-wensure-ink mb-1">
                Phone Number
              </label>
              <input
                type="text"
                defaultValue="+91 98201 44520"
                className="w-full px-3 py-2 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-wensure-ink mb-1">
                Current Residence (Remote Monitoring Location)
              </label>
              <input
                type="text"
                defaultValue="London, United Kingdom (NRI Account)"
                className="w-full px-3 py-2 rounded bg-stone-50 border border-wensure-fine-divider text-xs text-wensure-ink"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-lg border border-wensure-fine-divider p-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-wensure-muted-text flex items-center gap-2">
            <Bell className="w-4 h-4 text-wensure-teal" />
            <span>Notification & Dispatch Preferences</span>
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-wensure-teal" />
              <span>Instant WhatsApp alert on high-severity inspection observations</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-wensure-teal" />
              <span>Weekly synthesized milestone summary & photo digest via Email</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-wensure-teal" />
              <span>Notification when contractor submits rectification proof</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-wensure-ink hover:bg-wensure-forest text-white rounded text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4 text-wensure-teal" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
