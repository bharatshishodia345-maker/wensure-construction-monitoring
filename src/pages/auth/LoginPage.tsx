import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Logo } from '../../components/common/Logo';
import { UserRole } from '../../types';
import {
  Building,
  HardHat,
  Shield,
  ArrowRight,
  Info,
  Check,
  Play,
  AlertCircle,
} from 'lucide-react';

import { api } from '../../services/api';

export const LoginPage: React.FC = () => {
  const { setRole, showToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Read preselected role from query parameters
  const roleParam = searchParams.get('role');
  const initialRole: UserRole =
    roleParam && ['customer', 'contractor', 'admin'].includes(roleParam)
      ? (roleParam as UserRole)
      : 'customer';

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState(() => {
    if (initialRole === 'contractor') return 'apex@wensure.com';
    if (initialRole === 'admin') return 'admin@wensure.com';
    return 'bharat@wensure.com';
  });
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelect = React.useCallback((role: UserRole) => {
    setSelectedRole(role);
    setAuthError(null);
    if (role === 'customer') {
      setEmail('bharat@wensure.com');
    } else if (role === 'contractor') {
      setEmail('apex@wensure.com');
    } else if (role === 'admin') {
      setEmail('admin@wensure.com');
    }
  }, []);

  useEffect(() => {
    if (roleParam && ['customer', 'contractor', 'admin'].includes(roleParam)) {
      handleRoleSelect(roleParam as UserRole);
    }
  }, [roleParam, handleRoleSelect]);

  // Explicit demo sandbox session workflow
  const handleLaunchDemoSession = async () => {
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const demoAuth = await api.demoLogin(selectedRole).catch(() => null);
      if (demoAuth && demoAuth.role) {
        const derivedRole = demoAuth.role as UserRole;
        setRole(derivedRole);
        showToast(`Demo session active: ${demoAuth.full_name} (${derivedRole.toUpperCase()})`, 'success');
        navigate(`/${derivedRole === 'admin' ? 'admin' : derivedRole}/dashboard`);
        return;
      }

      // Offline demo sandbox fallback
      setRole(selectedRole);
      showToast(`[Demo Mode] Signed in to local sandbox as ${selectedRole.toUpperCase()}`, 'info');
      if (selectedRole === 'customer') {
        navigate('/customer/dashboard');
      } else if (selectedRole === 'contractor') {
        navigate('/contractor/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Standard authentication with actual user credentials
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!password.trim()) {
      setAuthError('Please enter your password or launch the instant demo session.');
      return;
    }

    setIsSubmitting(true);
    try {
      const authData = await api.login(email, password).catch((err) => {
        const msg = err instanceof Error ? err.message : 'Invalid credentials';
        throw new Error(msg);
      });

      if (authData && authData.role) {
        const derivedRole = (['customer', 'contractor', 'admin', 'inspector'].includes(authData.role)
          ? authData.role
          : selectedRole) as UserRole;
        setRole(derivedRole);
        showToast(`Authenticated as ${authData.full_name} (${derivedRole.toUpperCase()})`, 'success');
        navigate(`/${derivedRole === 'admin' ? 'admin' : derivedRole}/dashboard`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setAuthError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-wensure-warm-white">
      {/* Left Column: Architectural Branding Visual (5 cols) */}
      <div className="hidden lg:flex lg:col-span-5 bg-wensure-ink text-white relative flex-col justify-between p-12 overflow-hidden border-r border-white/10">
        <div className="relative z-10">
          <Logo variant="light" showTagline={true} />
          <div className="mt-16 space-y-4">
            <span className="text-[11px] uppercase tracking-widest text-wensure-teal font-semibold">
              Independent Third-Party Verification
            </span>
            <h1 className="font-display text-4xl text-white font-normal leading-tight">
              We Ensure What Was Promised.
            </h1>
            <p className="text-sm text-stone-300 font-light leading-relaxed max-w-sm">
              Providing homeowners and quality builders with indisputable civil evidence,
              milestone documentation, and objective quality audits.
            </p>
          </div>
        </div>

        {/* Ambient Architectural Image Backdrop */}
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1400&q=80"
            alt="WENSURE Architecture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-wensure-ink via-wensure-ink/80 to-transparent" />
        </div>

        {/* Bottom Proof Quote */}
        <div className="relative z-10 pt-8 border-t border-white/10 text-xs text-stone-400 space-y-2">
          <p className="italic">
            "Eliminating construction mistrust through systematic engineering audits and transparent milestone records."
          </p>
          <p className="font-semibold text-stone-200">
            WENSURE Civil Audit Framework • Pune West
          </p>
        </div>
      </div>

      {/* Right Column: Refined Form & Role Switcher (7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="lg:hidden">
              <Logo variant="dark" />
            </div>
            <div className="flex items-center gap-3 ml-auto text-xs text-wensure-muted-text">
              <Link
                to="/experience"
                className="hover:text-wensure-teal transition-colors flex items-center gap-1 font-medium"
              >
                ← 3D Journey
              </Link>
              <span>•</span>
              <Link
                to="/"
                className="hover:text-wensure-teal transition-colors"
              >
                Overview
              </Link>
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl text-wensure-ink">
              Sign In to WENSURE
            </h2>
            <p className="text-xs sm:text-sm text-wensure-muted-text mt-1">
              Select your role to access the unified project workspace.
            </p>
          </div>

          {/* Interactive Role Selector Cards */}
          <div className="space-y-2.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-wensure-muted-text block">
              Choose Workspace Role
            </span>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Customer */}
              <button
                type="button"
                onClick={() => handleRoleSelect('customer')}
                className={`p-3 rounded border text-left transition-all flex flex-col justify-between ${
                  selectedRole === 'customer'
                    ? 'border-wensure-teal bg-wensure-teal/5 shadow-xs ring-1 ring-wensure-teal'
                    : 'border-wensure-fine-divider bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Building
                    className={`w-4 h-4 ${
                      selectedRole === 'customer'
                        ? 'text-wensure-teal'
                        : 'text-wensure-muted-text'
                    }`}
                  />
                  {selectedRole === 'customer' && (
                    <Check className="w-3.5 h-3.5 text-wensure-teal" />
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-xs font-semibold text-wensure-ink">Homeowner</p>
                  <p className="text-[10px] text-wensure-muted-text truncate">
                    Bharat Shishodia
                  </p>
                </div>
              </button>

              {/* Contractor */}
              <button
                type="button"
                onClick={() => handleRoleSelect('contractor')}
                className={`p-3 rounded border text-left transition-all flex flex-col justify-between ${
                  selectedRole === 'contractor'
                    ? 'border-wensure-teal bg-wensure-teal/5 shadow-xs ring-1 ring-wensure-teal'
                    : 'border-wensure-fine-divider bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <HardHat
                    className={`w-4 h-4 ${
                      selectedRole === 'contractor'
                        ? 'text-wensure-teal'
                        : 'text-wensure-muted-text'
                    }`}
                  />
                  {selectedRole === 'contractor' && (
                    <Check className="w-3.5 h-3.5 text-wensure-teal" />
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-xs font-semibold text-wensure-ink">Contractor</p>
                  <p className="text-[10px] text-wensure-muted-text truncate">
                    Apex Structural Builders
                  </p>
                </div>
              </button>

              {/* Admin */}
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className={`p-3 rounded border text-left transition-all flex flex-col justify-between ${
                  selectedRole === 'admin'
                    ? 'border-wensure-teal bg-wensure-teal/5 shadow-xs ring-1 ring-wensure-teal'
                    : 'border-wensure-fine-divider bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Shield
                    className={`w-4 h-4 ${
                      selectedRole === 'admin'
                        ? 'text-wensure-teal'
                        : 'text-wensure-muted-text'
                    }`}
                  />
                  {selectedRole === 'admin' && (
                    <Check className="w-3.5 h-3.5 text-wensure-teal" />
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-xs font-semibold text-wensure-ink">Operations</p>
                  <p className="text-[10px] text-wensure-muted-text truncate">
                    Lead Auditor
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Authentication Error Feedback */}
          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-wensure-ink mb-1">
                Username or Email Address
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded bg-white border border-wensure-fine-divider text-xs text-wensure-ink focus:outline-hidden focus:border-wensure-teal focus:ring-1 focus:ring-wensure-teal"
                placeholder="Enter email or username"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-wensure-ink">
                  Password
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded bg-white border border-wensure-fine-divider text-xs text-wensure-ink focus:outline-hidden focus:border-wensure-teal focus:ring-1 focus:ring-wensure-teal"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-wensure-ink text-white hover:bg-wensure-forest rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
            >
              <span>Sign In with Credentials</span>
              <ArrowRight className="w-3.5 h-3.5 text-wensure-teal" />
            </button>
          </form>

          {/* Explicit Demo Workflow Option */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-wensure-fine-divider" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-semibold tracking-wider text-wensure-muted-text">
              <span className="bg-wensure-warm-white px-3">or instant demo access</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLaunchDemoSession}
            disabled={isSubmitting}
            className="w-full py-2.5 bg-wensure-teal/10 hover:bg-wensure-teal/20 text-wensure-forest border border-wensure-teal/30 rounded text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 text-wensure-teal" />
            <span>Launch Demo Workspace ({selectedRole.toUpperCase()})</span>
          </button>

          {/* Explicit Demo Environment Notice */}
          <div className="p-3.5 bg-wensure-soft-stone/70 border border-wensure-fine-divider rounded flex items-start gap-2.5 text-xs text-wensure-muted-text">
            <Info className="w-4 h-4 text-wensure-teal shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-wensure-ink">
                Demonstration Environment
              </p>
              <p className="text-[11px] leading-relaxed">
                Pre-loaded with canonical Pune villa project data{' '}
                <strong className="text-wensure-ink font-mono">WNS-PUN-2026-001</strong>. Click "Launch Demo Workspace" to explore without typing credentials, or sign in with your configured user account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
