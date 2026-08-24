import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AdminRole } from '../types/admin';

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
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
};
