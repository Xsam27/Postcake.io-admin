import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Users, 
  Layers, 
  FileText, 
  Activity, 
  Shield, 
  Zap, 
  Flame, 
  X, 
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isUnified = location.pathname.startsWith('/admin');

  const getTargetPath = (path: string) => {
    if (isUnified) {
      return path;
    }
    if (path === '/admin') return '/';
    return path.replace(/^\/admin/, '');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { label: 'Command Center Dashboard', path: '/admin', icon: Activity, group: 'Navigation' },
    { label: 'Customer Directory', path: '/admin/crm/customers', icon: Users, group: 'CRM' },
    { label: 'Early Access & Waitlist', path: '/admin/crm/waitlist', icon: Flame, group: 'CRM' },
    { label: 'Subscriptions & MRR', path: '/admin/crm/subscriptions', icon: Layers, group: 'CRM' },
    { label: 'Live Operations & Job Queue', path: '/admin/operations/jobs', icon: Zap, group: 'Operations' },
    { label: 'Failed Jobs Triage', path: '/admin/operations/failed', icon: Activity, group: 'Operations' },
    { label: 'Worker Fleet', path: '/admin/operations/workers', icon: Zap, group: 'Operations' },
    { label: 'Provider API Health', path: '/admin/operations/providers', icon: Activity, group: 'Operations' },
    { label: 'Blog & SEO Studio', path: '/admin/content/blog', icon: FileText, group: 'CMS' },
    { label: 'Create New Blog Post', path: '/admin/content/blog/new', icon: Sparkles, group: 'CMS' },
    { label: 'Media Library', path: '/admin/content/media', icon: Layers, group: 'CMS' },
    { label: 'Business & AI Analytics', path: '/admin/analytics/business', icon: Activity, group: 'Analytics' },
    { label: 'Admin Directory & Roles', path: '/admin/system/admins', icon: Shield, group: 'System' },
    { label: 'Audit Log Explorer', path: '/admin/system/audit', icon: Shield, group: 'System' },
    { label: 'Feature Flags & Settings', path: '/admin/system/settings', icon: Command, group: 'System' },
  ];

  const filtered = quickActions.filter(action =>
    action.label.toLowerCase().includes(query.toLowerCase()) ||
    action.group.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(getTargetPath(path));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4 font-sans animate-fade-in">
      <div className="bg-[#121216] border-4 border-white/20 rounded-3xl max-w-2xl w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center px-6 py-4 border-b-2 border-zinc-300 dark:border-zinc-800 bg-[#09090B]">
          <Search className="w-5 h-5 text-zinc-600 dark:text-zinc-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search customers, jobs, articles... (ESC to exit)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-white font-bold text-base focus:outline-none placeholder-zinc-500"
          />
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-zinc-800 text-left text-zinc-700 dark:text-zinc-300 hover:text-white transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-[#FF7A00] group-hover:border-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-black text-sm text-white">{item.label}</div>
                      <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{item.group}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-[#FF7A00] transition-opacity" />
                </button>
              );
            })
          ) : (
            <div className="py-12 text-center text-zinc-500 font-bold text-sm">
              No matching commands or resources found for "{query}".
            </div>
          )}
        </div>

        {/* Bottom Shortcut Bar */}
        <div className="px-6 py-3 bg-[#09090B] border-t-2 border-zinc-300 dark:border-zinc-800 flex items-center justify-between text-[11px] font-bold text-zinc-500">
          <div>Postcake Command Center • v2.4.0</div>
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
