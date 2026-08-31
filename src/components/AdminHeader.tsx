import React, { useState } from 'react';
import { 
  Search, 
  User, 
  LogOut, 
  ShieldCheck, 
  Activity, 
  Command, 
  ExternalLink,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { supabase } from '../lib/supabase';
import { CommandPalette } from './CommandPalette';

export const AdminHeader: React.FC = () => {
  const { session } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const navigate = useNavigate();

  const userEmail = session?.user?.email || 'admin@postcake.io';
  const userName = session?.user?.user_metadata?.name || userEmail.split('@')[0];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <>
      <header className="h-16 bg-white dark:bg-[#09090B] border-b-3 border-zinc-200 dark:border-zinc-300 dark:border-zinc-800 px-6 flex items-center justify-between sticky top-0 z-30 font-sans transition-colors">
        {/* Left Search Trigger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCommandPalette(true)}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 text-zinc-700 dark:text-zinc-600 dark:text-zinc-400 text-xs font-bold transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group cursor-pointer"
          >
            <Search className="w-4 h-4 text-[#FF7A00]" />
            <span className="hidden sm:inline">Search customers, jobs, logs...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-300 dark:border-zinc-700 text-[10px] text-zinc-600 dark:text-zinc-600 dark:text-zinc-400">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>

          {/* Live System Status Dot */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 border-2 border-emerald-500/50 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All Systems Operational
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-300 dark:border-zinc-700 hover:border-[#FF7A00] text-zinc-700 dark:text-zinc-700 dark:text-zinc-300 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FFD54F]" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>

          <a
            href="https://www.postcake.io"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FF7A00] flex items-center justify-center text-white font-black text-xs border border-black">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-black text-black dark:text-white leading-tight capitalize">{userName}</div>
                <div className="text-[10px] font-bold text-[#FF7A00] uppercase tracking-widest">Super Admin</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-600 dark:text-zinc-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#121216] border-3 border-zinc-300 dark:border-white/20 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] py-2 z-50">
                <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-300 dark:border-zinc-800">
                  <div className="text-xs font-black text-black dark:text-white">{userName}</div>
                  <div className="text-[11px] text-zinc-500 font-bold truncate">{userEmail}</div>
                </div>
                <Link
                  to="/system/audit"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Activity className="w-4 h-4 text-[#FF7A00]" />
                  My Audit Activity
                </Link>
                <Link
                  to="/system/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
                  System Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-300 dark:border-zinc-800 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Cmd+K Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
    </>
  );
};
