import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Activity, 
  Users, 
  Flame, 
  Layers, 
  Zap, 
  AlertOctagon, 
  Server, 
  HeartPulse, 
  FileText, 
  Image, 
  BarChart3, 
  Cpu, 
  Shield, 
  Key, 
  History, 
  Sliders
} from 'lucide-react';
import { PostcakeLogo } from './PostcakeLogo';

interface NavSection {
  title: string;
  items: {
    label: string;
    to: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

const navSections: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Command Center', to: '/', icon: Activity },
    ],
  },
  {
    title: 'CRM & CUSTOMERS',
    items: [
      { label: 'Customer Directory', to: '/crm/customers', icon: Users },
      { label: 'Early Access / Waitlist', to: '/crm/waitlist', icon: Flame, badge: 'HOT' },
      { label: 'Subscriptions & MRR', to: '/crm/subscriptions', icon: Layers },
    ],
  },
  {
    title: 'OPERATIONS & QUEUE',
    items: [
      { label: 'Live Dispatch Queue', to: '/operations/jobs', icon: Zap },
      { label: 'Failed Job Triage', to: '/operations/failed', icon: AlertOctagon },
      { label: 'Worker Fleet', to: '/operations/workers', icon: Server },
      { label: 'Provider API Health', to: '/operations/providers', icon: HeartPulse },
    ],
  },
  {
    title: 'CONTENT & CMS',
    items: [
      { label: 'Blog & SEO Studio', to: '/content/blog', icon: FileText },
      { label: 'Media Library', to: '/content/media', icon: Image },
    ],
  },
  {
    title: 'INTELLIGENCE & ANALYTICS',
    items: [
      { label: 'Business Analytics', to: '/analytics/business', icon: BarChart3 },
      { label: 'Platform Market Share', to: '/analytics/platforms', icon: Layers },
      { label: 'AI Token Usage & Cost', to: '/analytics/ai', icon: Cpu },
    ],
  },
  {
    title: 'SYSTEM & SECURITY',
    items: [
      { label: 'Admin Users', to: '/system/admins', icon: Shield },
      { label: 'Roles & RBAC Matrix', to: '/system/roles', icon: Key },
      { label: 'Audit Log Explorer', to: '/system/audit', icon: History },
      { label: 'Feature Flags & Settings', to: '/system/settings', icon: Sliders },
    ],
  },
];

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const isUnified = location.pathname.startsWith('/admin');

  const getTargetPath = (to: string) => {
    if (!isUnified) return to;
    return to === '/' ? '/admin' : `/admin${to}`;
  };

  return (
    <aside className="w-64 bg-white dark:bg-[#09090B] border-r-3 border-zinc-300 dark:border-zinc-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 font-sans z-40 select-none overflow-y-auto transition-colors">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-6 border-b-3 border-zinc-300 dark:border-zinc-800 flex items-center justify-between">
          <NavLink to={getTargetPath('/')} className="flex items-center gap-2">
            <PostcakeLogo iconSize={32} />
          </NavLink>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#FF7A00] text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            HQ
          </span>
        </div>

        {/* Navigation Sections */}
        <div className="p-4 space-y-6">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-1.5">
                {section.title}
              </div>
              {section.items.map((item, iIdx) => {
                const Icon = item.icon;
                const targetPath = getTargetPath(item.to);
                const isActive = item.to === '/'
                  ? (location.pathname === '/' || location.pathname === '/admin')
                  : location.pathname.startsWith(targetPath);

                return (
                  <NavLink
                    key={iIdx}
                    to={targetPath}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-black text-xs transition-all ${
                      isActive
                        ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-white border-2 border-black dark:border-white/20 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'text-zinc-600 hover:text-black hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF7A00]' : 'text-zinc-400 dark:text-zinc-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-rose-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t-2 border-zinc-200 dark:border-zinc-200 dark:border-zinc-900 text-center">
        <div className="text-[10px] font-black text-zinc-500 dark:text-zinc-600 uppercase tracking-widest">
          Postcake Command • v2.4.0
        </div>
        <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-600 mt-0.5">
          Production Environment
        </div>
      </div>
    </aside>
  );
};
