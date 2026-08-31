import React from 'react';
import { Layers, CheckCircle2, TrendingUp } from 'lucide-react';

export const PlatformAnalyticsPage: React.FC = () => {
  const platforms = [
    { name: 'Instagram', share: 48, accounts: 9840, postsMonth: 84200, successRate: '99.8%' },
    { name: 'YouTube', share: 22, accounts: 4420, postsMonth: 38400, successRate: '99.9%' },
    { name: 'TikTok', share: 14, accounts: 3120, postsMonth: 24100, successRate: '99.4%' },
    { name: 'X (Twitter)', share: 9, accounts: 2200, postsMonth: 19800, successRate: '99.6%' },
    { name: 'LinkedIn', share: 5, accounts: 1100, postsMonth: 8200, successRate: '99.9%' },
    { name: 'Facebook', share: 2, accounts: 480, postsMonth: 3400, successRate: '99.7%' },
  ];

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
          <Layers className="w-6 h-6 text-[#FF7A00]" />
          Platform Share & Dispatch Distribution
        </h1>
        <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
          Connected account market share, scheduled post volumes, and API delivery success rates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((p, idx) => (
          <div key={idx} className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-black text-lg text-white">{p.name}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] font-black text-xs font-mono">
                  {p.share}% Share
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden my-3">
                <div className="h-full bg-[#FF7A00]" style={{ width: `${p.share * 2}%` }} />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t-2 border-zinc-300 dark:border-zinc-800 space-y-2 text-xs font-bold">
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Connected Accounts:</span>
                <span className="text-white font-mono font-black">{p.accounts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Monthly Posts:</span>
                <span className="text-white font-mono font-black">{p.postsMonth.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">API Dispatch Success:</span>
                <span className="text-emerald-400 font-mono font-black">{p.successRate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
