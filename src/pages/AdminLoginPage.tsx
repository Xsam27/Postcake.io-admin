import React, { useState } from 'react';
import { Navigate, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth, setDevAdminSession } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Shield, AlertCircle, ArrowRight, Lock, Sun, Moon, CheckCircle2, Zap, KeyRound, Copy } from 'lucide-react';
import { PostcakeIcon } from '../components/PostcakeLogo';
import { AdminRole } from '../types/admin';

const ALLOWED_ADMIN_ROLES: AdminRole[] = ['super_admin', 'operations_admin', 'content_admin', 'support_admin'];

export const AdminLoginPage: React.FC = () => {
  const { session, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isDevEnvironment = 
    import.meta.env.DEV || 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1';

  const defaultRedirect = location.pathname.startsWith('/admin') ? '/admin' : '/';
  const redirectUrl = searchParams.get('redirect') || defaultRedirect;

  // If already authenticated and has admin clearance, redirect to dashboard
  if (!isLoading && session) {
    const role = (session.user.app_metadata?.role || session.user.user_metadata?.role) as AdminRole | undefined;
    const isOwner = session.user.email === 'mausam@postcake.io' || session.user.email?.endsWith('@postcake.io');
    const effectiveRole = isOwner ? 'super_admin' : role;
    if (effectiveRole && ALLOWED_ADMIN_ROLES.includes(effectiveRole as AdminRole)) {
      return <Navigate to={redirectUrl} replace />;
    }
  }

  const handleDevQuickLogin = () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      setDevAdminSession('mausam@postcake.io');
      setSuccessMessage('Dev Super Admin session established! Redirecting to HQ...');
      setTimeout(() => {
        navigate(redirectUrl, { replace: true });
      }, 300);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initialize dev admin session.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillOwnerCredentials = () => {
    setEmail('mausam@postcake.io');
    setPassword('YourNewPassword123!');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.session) {
        const user = data.session.user;
        const role = (user.app_metadata?.role || user.user_metadata?.role) as AdminRole | undefined;
        const isOwner = user.email === 'mausam@postcake.io' || user.email?.endsWith('@postcake.io');
        const effectiveRole = isOwner ? 'super_admin' : role;

        if (!effectiveRole || !ALLOWED_ADMIN_ROLES.includes(effectiveRole as AdminRole)) {
          // Immediately sign out unprivileged customers attempting admin login
          await supabase.auth.signOut();
          throw new Error('Access Denied: Your account does not possess verified administrative clearance.');
        }

        navigate(redirectUrl, { replace: true });
      }
    } catch (err: any) {
      console.error('Admin auth error:', err);
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EE] dark:bg-[#09090B] text-zinc-900 dark:text-white flex flex-col items-center justify-center p-6 font-sans relative selection:bg-[#FF7A00] selection:text-white transition-colors">
      {/* Top Right Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 hover:border-[#FF7A00] text-zinc-700 dark:text-zinc-300 font-bold text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-[#FFD54F]" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-zinc-700" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF7A00]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-[#121216] border-4 border-black dark:border-zinc-800 rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10 space-y-6 transition-colors">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <PostcakeIcon size={64} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF7A00] text-[10px] font-black uppercase tracking-widest">
            <Lock className="w-3 h-3" /> HQ Operations Clearance
          </div>
          <h1 className="text-2xl font-display font-black uppercase tracking-tight text-black dark:text-white">
            Postcake Command Center
          </h1>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
            Sign in with authorized administrative credentials.
          </p>
        </div>

        {/* Local Dev Fast Access Banner */}
        {isDevEnvironment && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-dashed border-[#FF7A00] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#FF7A00]">
                <Zap className="w-4 h-4 fill-[#FF7A00]" /> Local Development Bypass
              </span>
              <span className="text-[10px] font-black bg-[#FF7A00] text-black px-2 py-0.5 rounded-full uppercase">
                Active
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
              Instantly access Command HQ as Super Admin without requiring Supabase Auth roundtrip.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleDevQuickLogin}
                className="py-2.5 px-3 bg-[#FF7A00] hover:bg-[#e06c00] text-black font-black text-[11px] uppercase tracking-wider rounded-xl border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Zap className="w-3.5 h-3.5 fill-black" /> 1-Click Login
              </button>
              <button
                type="button"
                onClick={handleFillOwnerCredentials}
                className="py-2.5 px-3 bg-white dark:bg-zinc-800 hover:bg-zinc-100 text-zinc-900 dark:text-white font-black text-[11px] uppercase tracking-wider rounded-xl border-2 border-zinc-300 dark:border-zinc-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#FF7A00]" /> Fill Form
              </button>
            </div>
          </div>
        )}

        {/* Default Credentials Reference Drawer (Local Dev only) */}
        {isDevEnvironment && (
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/80 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>Verified Admin Credentials (Dev Reference)</span>
              <span className="text-emerald-500 font-mono text-[9px]">super_admin</span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between bg-white dark:bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-500 text-[10px] font-sans font-bold">Email:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-zinc-900 dark:text-white">mausam@postcake.io</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('mausam@postcake.io', 'email')}
                    className="text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                    title="Copy email"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white dark:bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-500 text-[10px] font-sans font-bold">Password:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-zinc-900 dark:text-white">YourNewPassword123!</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('YourNewPassword123!', 'pass')}
                    className="text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                    title="Copy password"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            {copiedKey && (
              <div className="text-[10px] text-emerald-500 font-bold text-center">
                ✓ Copied {copiedKey} to clipboard!
              </div>
            )}
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/50 border-2 border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>{successMessage}</div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/50 border-2 border-rose-500/60 text-rose-300 text-xs font-bold flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-400 mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              placeholder="mausam@postcake.io"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 text-black dark:text-white font-bold text-xs rounded-2xl focus:outline-none focus:border-[#FF7A00] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 text-black dark:text-white font-bold text-xs rounded-2xl focus:outline-none focus:border-[#FF7A00] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#FF7A00] hover:bg-[#e06c00] border-2 border-black text-black font-black text-xs uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In with Supabase Auth
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="p-3 bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-300 dark:border-zinc-800 rounded-xl text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            <Shield className="w-3.5 h-3.5 text-[#FF7A00]" /> Role-Based Access Control
          </div>
          <p className="text-[10px] text-zinc-500">
            Accounts ending in <span className="font-bold text-zinc-700 dark:text-zinc-300">@postcake.io</span> automatically inherit Super Admin clearance. Regular customer accounts are denied entry.
          </p>
        </div>
      </div>
    </div>
  );
};

