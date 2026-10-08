import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export const DEV_ADMIN_SESSION_KEY = 'postcake_admin_dev_session';

export const getDevAdminSession = (): Session | null => {
  try {
    const raw = localStorage.getItem(DEV_ADMIN_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setDevAdminSession = (email = 'mausam@postcake.io') => {
  const session: any = {
    access_token: 'postcake-dev-admin-token',
    token_type: 'bearer',
    expires_in: 604800,
    refresh_token: 'postcake-dev-admin-refresh',
    user: {
      id: 'usr-admin-mausam',
      app_metadata: { role: 'super_admin', provider: 'email' },
      user_metadata: { role: 'super_admin', name: 'Mausam Verma' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email,
      phone: '',
      role: 'super_admin',
      updated_at: new Date().toISOString(),
    },
  };
  localStorage.setItem(DEV_ADMIN_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event('postcake-admin-auth-change'));
  return session;
};

export const clearAdminSession = async () => {
  localStorage.removeItem(DEV_ADMIN_SESSION_KEY);
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event('postcake-admin-auth-change'));
};

export const useAuth = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        setSession(currentSession);
      } else {
        const devSession = getDevAdminSession();
        setSession(devSession);
      }
      setIsLoading(false);
    };

    syncSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (currentSession) {
        setSession(currentSession);
      } else {
        const devSession = getDevAdminSession();
        setSession(devSession);
      }
      setIsLoading(false);
    });

    const handleCustomAuthChange = () => {
      const devSession = getDevAdminSession();
      setSession(devSession);
      setIsLoading(false);
    };

    window.addEventListener('postcake-admin-auth-change', handleCustomAuthChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('postcake-admin-auth-change', handleCustomAuthChange);
    };
  }, []);

  return { session, isLoading };
};

