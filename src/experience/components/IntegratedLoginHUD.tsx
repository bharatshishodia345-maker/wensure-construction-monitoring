import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Building,
  HardHat,
  Shield,
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  Info,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface IntegratedLoginHUDProps {
  progress: number;
  onScrollToTop: () => void;
}

export const IntegratedLoginHUD: React.FC<IntegratedLoginHUDProps> = ({
  progress,
  onScrollToTop,
}) => {
  const { setRole, showToast } = useApp();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('aarav.sharma@example.com');
  const [password, setPassword] = useState('demo-wensure-2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active at the final stage of the journey (0.93 -> 1.00)
  if (progress < 0.93) return null;

  // Smooth fade-in
  const opacity = Math.min(1, (progress - 0.93) / 0.05);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === 'customer') {
      setEmail('aarav.sharma@example.com');
    } else if (role === 'contractor') {
      setEmail('rajesh@vermaconstructions.in');
    } else if (role === 'admin') {
      setEmail('audit-ops@wensure.in');
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email/username and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      setRole(selectedRole);
      showToast(`Welcome! Signed in as ${selectedRole.toUpperCase()} identity`, 'success');

      if (selectedRole === 'customer') {
        navigate('/customer/dashboard');
      } else if (selectedRole === 'contractor') {
        navigate('/contractor/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    }, 450);
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center p-4 sm:p-6 lg:p-10 transition-all duration-700"
      style={{ opacity }}
    >
      <div className="pointer-events-auto max-w-lg w-full bg-wensure-ink/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-500">
        {/* Header Branding */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-wensure-teal flex items-center justify-center text-white font-serif font-bold text-base shadow-lg shadow-wensure-teal/30">
              W
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-wensure-teal font-semibold block">
                WELCOME TO WENSURE
              </span>
              <h3 className="font-display text-xl sm:text-2xl text-white font-normal">
                Sign In to Workspace
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded font-semibold">
            Villa Completed
          </span>
        </div>

        {/* Supporting Hook */}
        <p className="text-xs text-stone-300 leading-relaxed font-light">
          Your project. Your visibility. Select your identity to explore the unified Baner villa workspace.
        </p>

        {/* Role Selector Cards */}
        <div className="space-y-2">
          <span className="text-[10.5px] uppercase font-mono tracking-wider text-stone-400 block font-semibold">
            Select Workspace Role
          </span>
          <div className="grid grid-cols-3 gap-2">
            {/* Customer */}
            <button
              type="button"
              onClick={() => handleRoleSelect('customer')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                selectedRole === 'customer'
                  ? 'border-wensure-teal bg-wensure-teal/20 text-white shadow-md ring-1 ring-wensure-teal'
                  : 'border-white/10 bg-white/5 text-stone-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <Building
                  className={`w-4 h-4 ${
                    selectedRole === 'customer' ? 'text-wensure-teal' : 'text-stone-400'
                  }`}
                />
                {selectedRole === 'customer' && <Check className="w-3.5 h-3.5 text-wensure-teal" />}
              </div>
              <div className="mt-2.5">
                <p className="text-xs font-semibold text-white">Homeowner</p>
                <p className="text-[10px] text-stone-400 truncate">Aarav Sharma</p>
              </div>
            </button>

            {/* Contractor */}
            <button
              type="button"
              onClick={() => handleRoleSelect('contractor')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                selectedRole === 'contractor'
                  ? 'border-wensure-teal bg-wensure-teal/20 text-white shadow-md ring-1 ring-wensure-teal'
                  : 'border-white/10 bg-white/5 text-stone-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <HardHat
                  className={`w-4 h-4 ${
                    selectedRole === 'contractor' ? 'text-wensure-teal' : 'text-stone-400'
                  }`}
                />
                {selectedRole === 'contractor' && <Check className="w-3.5 h-3.5 text-wensure-teal" />}
              </div>
              <div className="mt-2.5">
                <p className="text-xs font-semibold text-white">Contractor</p>
                <p className="text-[10px] text-stone-400 truncate">Rajesh Verma</p>
              </div>
            </button>

            {/* Admin */}
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                selectedRole === 'admin'
                  ? 'border-wensure-teal bg-wensure-teal/20 text-white shadow-md ring-1 ring-wensure-teal'
                  : 'border-white/10 bg-white/5 text-stone-300 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <Shield
                  className={`w-4 h-4 ${
                    selectedRole === 'admin' ? 'text-wensure-teal' : 'text-stone-400'
                  }`}
                />
                {selectedRole === 'admin' && <Check className="w-3.5 h-3.5 text-wensure-teal" />}
              </div>
              <div className="mt-2.5">
                <p className="text-xs font-semibold text-white">Operations</p>
                <p className="text-[10px] text-stone-400 truncate">Lead Auditor</p>
              </div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="space-y-3.5">
          {errorMessage && (
            <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-lg text-xs text-red-200">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              Username or Registered Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-stone-400 focus:outline-hidden focus:border-wensure-teal focus:ring-1 focus:ring-wensure-teal transition-all"
              placeholder="name@domain.com"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-stone-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-stone-400 hover:text-wensure-teal flex items-center gap-1 transition-colors"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-stone-400 focus:outline-hidden focus:border-wensure-teal focus:ring-1 focus:ring-wensure-teal transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-wensure-teal to-wensure-teal-dark hover:brightness-110 disabled:opacity-50 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-wensure-teal/30 mt-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Enter {selectedRole.toUpperCase()} Dashboard</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>
        </form>

        {/* Canonical Project Reference & Replay Journey */}
        <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-wensure-teal shrink-0" />
            <span>Resolves to Pune Villa #WNS-PUN-2026-001</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onScrollToTop}
              className="hover:text-wensure-teal inline-flex items-center gap-1 transition-colors"
              title="Replay 3D Construction Journey"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Journey</span>
            </button>

            <Link
              to="/overview"
              className="hover:text-wensure-teal inline-flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Platform Overview</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
