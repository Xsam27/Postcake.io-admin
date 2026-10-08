import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, clearAdminSession } from '../hooks/useAuth';
import { AdminRole } from '../types/admin';
import { supabase } from '../lib/supabase';
import { ShieldAlert, LogOut } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
  allowedRoles?: AdminRole[];
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ 
  children, 
  allowedRoles = ['super_admin', 'operations_admin', 'content_admin', 'support_admin'] 
}) => {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-xs font-black uppercase tracking-widest text-slate-400">
          Authenticating Postcake Admin Clearance...
        </div>
      </div>
    );
  }

  if (!session) {
    const isUnifiedApp = location.pathname.startsWith('/admin');
    const loginRedirect = isUnifiedApp ? '/admin/login' : '/login';
    return <Navigate to={`${loginRedirect}?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Authoritative role evaluation (app_metadata first, fallback to user_metadata)
  const userRole = (session.user.app_metadata?.role || session.user.user_metadata?.role) as AdminRole | undefined;
  const isOwner = session.user.email === 'mausam@postcake.io' || session.user.email?.endsWith('@postcake.io');
  const effectiveRole = isOwner ? 'super_admin' : userRole;
  const isAuthorized = effectiveRole && allowedRoles.includes(effectiveRole as AdminRole);

  if (!isAuthorized) {
    const isUnifiedApp = location.pathname.startsWith('/admin');
    const returnLoginPath = isUnifiedApp ? '/admin/login' : '/login';

    return (
      <div className="min-h-screen bg-[#09090B] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#121216] border-4 border-rose-600 rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(225,29,72,0.6)] text-center space-y-6">
          <div className="w-16 h-16 bg-rose-500/20 border-2 border-rose-500 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
              Clearance Denied
            </h1>
            <p className="text-xs font-bold text-zinc-400 leading-relaxed">
              Your authenticated account (<span className="text-rose-400">{session.user.email}</span>) does not possess verified administrative clearance for Postcake HQ.
            </p>
          </div>
          <div className="p-3 bg-rose-950/40 border border-rose-900 rounded-xl text-[11px] font-mono text-zinc-400 text-left">
            <div><strong className="text-rose-300">Identity:</strong> {session.user.id}</div>
            <div><strong className="text-rose-300">Active Role:</strong> {effectiveRole || 'standard_customer (unprivileged)'}</div>
            <div><strong className="text-rose-300">Required:</strong> {allowedRoles.join(', ')}</div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await clearAdminSession();
              window.location.href = returnLoginPath;
            }}
            className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out & Return to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
