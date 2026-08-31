import React, { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Shield, AlertCircle, ArrowRight, Lock, Sun, Moon, UserPlus, CheckCircle2 } from 'lucide-react';
import { PostcakeIcon } from '../components/PostcakeLogo';

export const AdminLoginPage: React.FC = () => {
  const { session, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const redirectUrl = searchParams.get('redirect') || '/';

  // If already authenticated, redirect to dashboard
  if (!isLoading && session) {
    return <Navigate to={redirectUrl} replace />;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data?.session) {
          navigate(redirectUrl, { replace: true });
        }
      } else {
        // Create Admin Account
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name.trim() || email.split('@')[0],
              role: 'super_admin',
            },
          },
        });
        if (error) throw error;
        if (data?.session) {
          navigate(redirectUrl, { replace: true });
        } else {
          setSuccessMessage('Admin account created! Please confirm your email (if required by Supabase), then sign in.');
          setMode('signin');
        }
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
            {mode === 'signin' ? 'Sign in with authorized administrative credentials.' : 'Register a new Administrator account.'}
          </p>
        </div>

        {/* Auth Mode Switcher Tabs */}
        <div className="flex rounded-2xl bg-zinc-100 dark:bg-zinc-900 p-1 border-2 border-zinc-300 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-[#FF7A00] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#FF7A00] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Create Admin
          </button>
        </div>

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
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-400 mb-1.5">
                Admin Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Mausam Verma"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 text-black dark:text-white font-bold text-xs rounded-2xl focus:outline-none focus:border-[#FF7A00] transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-400 mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@postcake.io"
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
            ) : mode === 'signin' ? (
              <>
                Sign In to Command HQ
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Register Admin Account
              </>
            )}
          </button>
        </form>

        {/* Security Info */}
        <div className="text-center text-[10px] font-bold text-zinc-600 dark:text-zinc-500 pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
          Super Admin clearance required. All administrative actions are recorded.
        </div>
      </div>
    </div>
  );
};
