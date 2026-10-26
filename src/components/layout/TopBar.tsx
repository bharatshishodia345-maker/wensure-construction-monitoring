import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Building2,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { UserRole } from '../../types';
import { api } from '../../services/api';

interface TopBarProps {
  onOpenMobileMenu: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileMenu }) => {
  const { currentRole, setRole, currentUser, notifications, project, backendConnected } = useApp();
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleRoleQuickSwitch = async (role: UserRole) => {
    if (backendConnected && role !== 'public') {
      await api.demoLogin(role).catch(() => {});
    }
    setRole(role);
    if (role === 'customer') navigate('/customer/dashboard');
    else if (role === 'contractor') navigate('/contractor/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <header className="h-16 bg-white border-b border-wensure-fine-divider flex items-center justify-between px-4 sm:px-8 z-30 sticky top-0 shadow-sm">
      {/* Left: Mobile Toggle + Project Identity Pill */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-wensure-ink hover:text-wensure-teal rounded"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Context */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-wensure-soft-stone flex items-center justify-center text-wensure-forest shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-wensure-ink truncate max-w-[150px] sm:max-w-none">
                {project.name}
              </span>
              <span className="text-[10px] font-mono bg-wensure-soft-stone text-wensure-muted-text px-1.5 py-0.5 rounded border border-wensure-fine-divider">
                {project.code}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-wensure-muted-text">
              <MapPin className="w-3 h-3 text-wensure-teal" />
              <span>{project.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Quick Role Switcher + Demo Tag + Notifications + Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Quick Role Switcher Pills for rapid pairing/testing */}
        <div className="hidden md:flex items-center bg-wensure-soft-stone p-1 rounded-md border border-wensure-fine-divider text-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-wensure-muted-text px-2">
            View as:
          </span>
          <button
            onClick={() => handleRoleQuickSwitch('customer')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              currentRole === 'customer'
                ? 'bg-wensure-ink text-white shadow-xs'
                : 'text-wensure-muted-text hover:text-wensure-ink'
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => handleRoleQuickSwitch('contractor')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              currentRole === 'contractor'
                ? 'bg-wensure-ink text-white shadow-xs'
                : 'text-wensure-muted-text hover:text-wensure-ink'
            }`}
          >
            Contractor
          </button>
          <button
            onClick={() => handleRoleQuickSwitch('admin')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              currentRole === 'admin'
                ? 'bg-wensure-ink text-white shadow-xs'
                : 'text-wensure-muted-text hover:text-wensure-ink'
            }`}
          >
            Operations / Admin
          </button>
        </div>

        {/* Backend / Demo Indicator */}
        <div
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium border ${
            backendConnected
              ? 'bg-teal-50 text-teal-800 border-teal-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
          title={backendConnected ? 'FastAPI + Database persistent live connection active' : 'Offline demo sandbox'}
        >
          <ShieldCheck className={`w-3 h-3 ${backendConnected ? 'text-teal-600' : 'text-wensure-success'}`} />
          <span>{backendConnected ? 'Live API Connected' : 'Demo Sandbox'}</span>
        </div>

        {/* Notifications Icon */}
        <Link
          to={
            currentRole === 'customer'
              ? '/customer/notifications'
              : currentRole === 'contractor'
              ? '/contractor/notifications'
              : '/admin/dashboard'
          }
          className="relative p-2 text-wensure-ink hover:text-wensure-teal rounded-full hover:bg-wensure-soft-stone transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-wensure-critical text-white text-[9px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User profile avatar */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-wensure-fine-divider">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-wensure-fine-divider"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-wensure-forest flex items-center justify-center text-xs font-semibold text-white">
              {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'W'}
            </div>
          )}
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-wensure-ink leading-tight">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-wensure-muted-text capitalize">
              {currentRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
