import React, { useState, useEffect } from 'react';
import { Layers, CheckCircle2, TrendingUp, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { ProviderHealth, OperationsJob } from '../../types/admin';

export const PlatformAnalyticsPage: React.FC = () => {
  const [providers, setProviders] = useState<ProviderHealth[]>([]);
  const [jobs, setJobs] = useState<OperationsJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [provData, jobsData] = await Promise.all([
        adminService.getProviders(),
        adminService.getJobs('all')
      ]);
      setProviders(provData);
      setJobs(jobsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalJobs = jobs.length || 1;

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-[#FF7A00]" />
            Platform Share & Dispatch Distribution
          </h1>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
            Connected account market share, scheduled post volumes, and API delivery success rates.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 hover:border-white text-xs font-black uppercase text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Providers
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((p) => {
          const platformJobs = jobs.filter(j => j.provider.toLowerCase().includes(p.name.split(' ')[0].toLowerCase()));
          const share = jobs.length > 0 ? Math.round((platformJobs.length / totalJobs) * 100) : 20;

          return (
            <div key={p.id} className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-black text-lg text-white">{p.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] font-black text-xs font-mono">
                    {p.status}
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden my-3">
                  <div className="h-full bg-[#FF7A00]" style={{ width: `${Math.max(share, 15)}%` }} />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t-2 border-zinc-300 dark:border-zinc-800 space-y-2 text-xs font-bold">
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">24h Requests:</span>
                  <span className="text-white font-mono font-black">{p.requests_24h.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Latency:</span>
                  <span className="text-white font-mono font-black">{p.latency_ms}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">API Dispatch Success:</span>
                  <span className="text-emerald-400 font-mono font-black">{p.success_rate_pct}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
