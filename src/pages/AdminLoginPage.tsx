import React, { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Shield, AlertCircle, ArrowRight, Lock } from 'lucide-react';
import { PostcakeLogo, PostcakeIcon } from '../components/PostcakeLogo';

export const AdminLoginPage: React.FC = () => {
  const { session, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const redirectUrl = searchParams.get('redirect') || '/';

  // If already authenticated as admin, go straight to dashboard
  if (!isLoading && session) {
    return <Navigate to={redirectUrl} replace />;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data?.session) {
        navigate(redirectUrl, { replace: true });
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      setErrorMessage(err.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectUrl}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to initialize Google login.');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col items-center justify-center p-6 font-sans selection:bg-[#FF7A00] selection:text-white">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF7A00]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#121216] border-4 border-zinc-800 rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <PostcakeIcon size={64} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF7A00] text-[10px] font-black uppercase tracking-widest">
            <Lock className="w-3 h-3" /> HQ Operations Clearance
          </div>
          <h1 className="text-2xl font-display font-black uppercase tracking-tight text-white">
            Postcake Command Center
          </h1>
          <p className="text-xs font-bold text-zinc-400">
            Sign in with authorized administrative credentials.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/50 border-2 border-rose-500/60 text-rose-300 text-xs font-bold flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Direct Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@postcake.io"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 bg-zinc-900 border-2 border-zinc-700 text-white font-bold text-xs rounded-2xl focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-zinc-900 border-2 border-zinc-700 text-white font-bold text-xs rounded-2xl focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#FF7A00] hover:bg-[#e06c00] border-2 border-black text-black font-black text-xs uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In to Command HQ
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-zinc-800" />
          <span className="px-3 text-[10px] font-black uppercase text-zinc-500 tracking-wider">
            Or
          </span>
          <div className="flex-grow border-t border-zinc-800" />
        </div>

        {/* Google OAuth Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-zinc-900 border-2 border-zinc-700 hover:border-white text-white font-black text-xs uppercase tracking-wider transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Security Warning Footer */}
        <div className="text-center text-[10px] font-bold text-zinc-500 pt-2">
          Unauthorized access attempts are monitored and recorded to the immutable audit trail.
        </div>
      </div>
    </div>
  );
};
