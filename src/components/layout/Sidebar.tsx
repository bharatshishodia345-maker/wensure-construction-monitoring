import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FolderGit2,
  MapPin,
  TrendingUp,
  Image as ImageIcon,
  ClipboardCheck,
  CreditCard,
  AlertTriangle,
  Search,
  Bell,
  Settings,
  UploadCloud,
  Briefcase,
  Star,
  Users,
  ShieldCheck,
  BarChart3,
  Scale,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { currentRole, setRole, currentUser, notifications, project } = useApp();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    setRole('public');
    navigate('/login');
  };

  // Build role-specific navigation items
  const getNavLinks = () => {
    switch (currentRole) {
      case 'customer':
        return [
          { name: 'Dashboard', to: '/customer/dashboard', icon: LayoutDashboard },
          { name: 'My Project', to: '/customer/project', icon: FolderGit2 },
          { name: 'House Plan & Map', to: '/customer/house-plan', icon: MapPin },
          { name: 'Construction Progress', to: '/customer/progress', icon: TrendingUp },
          { name: 'Site Gallery', to: '/customer/site-gallery', icon: ImageIcon },
          { name: 'Inspections & Reports', to: '/customer/inspections', icon: ClipboardCheck },
          { name: 'Budget & Payments', to: '/customer/budget', icon: CreditCard },
          {
            name: 'Issues & Observations',
            to: '/customer/issues',
            icon: AlertTriangle,
            badge: project.openObservationsCount > 0 ? project.openObservationsCount : undefined,
            badgeColor: 'bg-wensure-warning text-white',
          },
          { name: 'Find Contractors', to: '/customer/contractors', icon: Search },
          {
            name: 'Notifications',
            to: '/customer/notifications',
            icon: Bell,
            badge: unreadCount > 0 ? unreadCount : undefined,
            badgeColor: 'bg-wensure-teal text-white',
          },
          { name: 'Settings', to: '/customer/settings', icon: Settings },
        ];

      case 'contractor':
        return [
          { name: 'Dashboard', to: '/contractor/dashboard', icon: LayoutDashboard },
          { name: 'My Projects', to: '/contractor/projects', icon: FolderGit2 },
          { name: 'Submit Work Update', to: '/contractor/work-updates', icon: UploadCloud },
          { name: 'Scheduled Inspections', to: '/contractor/inspections', icon: ClipboardCheck },
          {
            name: 'Issues & Rectification',
            to: '/contractor/issues',
            icon: AlertTriangle,
            badge: project.openObservationsCount > 0 ? project.openObservationsCount : undefined,
            badgeColor: 'bg-wensure-critical text-white',
          },
          { name: 'Opportunities', to: '/contractor/opportunities', icon: Briefcase },
          { name: 'Company Profile', to: '/contractor/profile', icon: Users },
          { name: 'Ratings & Audit Track', to: '/contractor/ratings', icon: Star },
          {
            name: 'Notifications',
            to: '/contractor/notifications',
            icon: Bell,
            badge: unreadCount > 0 ? unreadCount : undefined,
            badgeColor: 'bg-wensure-teal text-white',
          },
        ];

      case 'admin':
        return [
          { name: 'Operations Command', to: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Projects Register', to: '/admin/projects', icon: FolderGit2 },
          { name: 'Customer Accounts', to: '/admin/customers', icon: Users },
          { name: 'Contractors Directory', to: '/admin/contractors', icon: Briefcase },
          { name: 'Field Auditors', to: '/admin/inspectors', icon: ClipboardCheck },
          { name: 'Audit Reports', to: '/admin/reports', icon: ShieldCheck },
          { name: 'Contractor Verification', to: '/admin/verification', icon: ShieldCheck },
          { name: 'Disputes & Resolutions', to: '/admin/disputes', icon: Scale },
          { name: 'Analytics & Trends', to: '/admin/analytics', icon: BarChart3 },
          { name: 'System Settings', to: '/admin/settings', icon: Settings },
        ];

      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-64 bg-wensure-ink text-stone-300 flex flex-col h-full border-r border-white/10 shrink-0">
      {/* Top Header */}
      <div className="p-5 border-b border-white/10">
        <Logo variant="light" showTagline={false} />
        <div className="mt-3 flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-wensure-teal bg-wensure-teal/10 px-2 py-0.5 rounded border border-wensure-teal/20">
            {currentRole === 'customer'
              ? 'Homeowner Portal'
              : currentRole === 'contractor'
              ? 'Contractor Workspace'
              : 'Operations & Audit'}
          </div>
          <span className="text-[10px] text-stone-400 font-mono">DEMO v1.0</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-wensure-forest text-white shadow-sm border-l-2 border-wensure-teal'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0 text-stone-400 group-hover:text-wensure-teal" />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Profile Area & Switcher */}
      <div className="p-4 border-t border-white/10 bg-black/30">
        <div className="flex items-center gap-3 mb-3">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-white/20"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-wensure-forest border border-white/20 flex items-center justify-center text-xs font-semibold text-white">
              {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'W'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-[10.5px] text-stone-400 truncate">{currentUser.roleTitle}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <button
            onClick={() => navigate('/login')}
            className="text-[11px] text-stone-400 hover:text-wensure-teal flex items-center gap-1 transition-colors"
          >
            <span>Switch Role</span>
            <ChevronRight className="w-3 h-3" />
          </button>
          <button
            onClick={handleLogout}
            className="text-[11px] text-stone-400 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
