import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  Zap, 
  AlertOctagon, 
  Cpu, 
  Flame, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { OperationsJob, ProviderHealth, WorkerStatus } from '../types/admin';

export const AdminDashboard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [jobs, setJobs] = useState<OperationsJob[]>([]);
  const [providers, setProviders] = useState<ProviderHealth[]>([]);
  const [workers, setWorkers] = useState<WorkerStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumData, jobsData, provData, workData] = await Promise.all([
        adminService.getDashboardSummary(),
        adminService.getJobs('all'),
        adminService.getProviders(),
        adminService.getWorkers(),
      ]);
      setSummary(sumData);
      setJobs(jobsData);
      setProviders(provData);
      setWorkers(workData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleQuickRetry = async (id: string) => {
    setRetryingId(id);
    try {
      await adminService.retryJob(id);
      await fetchData();
    } finally {
      setRetryingId(null);
    }
  };

  const failedJobs = jobs.filter(j => j.status === 'failed');

  return (
    <div className="space-y-8 font-sans animate-fade-in">
      {/* Top Banner: Real-time Health Status */}
      <div className="border-3 border-black bg-gradient-to-r from-white to-zinc-50 dark:from-[#121216] dark:to-[#1A1A22] p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-3.5 w-3.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            <h1 className="text-xl lg:text-2xl font-display font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              Postcake Command Center
            </h1>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Live Production
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
            "Is Postcake healthy right now, and what needs my attention?"
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 hover:border-white text-xs font-black uppercase text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Fleet
          </button>
          <Link
            to="/admin/operations/jobs"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF7A00] hover:bg-[#e06c00] border-2 border-black text-xs font-black uppercase text-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <Zap className="w-3.5 h-3.5" />
            Live Queue ({summary?.queuedJobs || 0})
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Users */}
        <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest">Total Users</span>
            <Users className="w-4 h-4 text-[#8C9EFF]" />
          </div>
          <div className="text-2xl lg:text-3xl font-display font-black text-white">
            {summary?.totalUsers !== undefined ? summary.totalUsers.toLocaleString() : '0'}
          </div>
          <div className="text-[11px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live Registered Users
          </div>
        </div>

        {/* MRR */}
        <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest">Monthly MRR</span>
            <DollarSign className="w-4 h-4 text-[#FFD700]" />
          </div>
          <div className="text-2xl lg:text-3xl font-display font-black text-white">
            ${summary?.activeMRR !== undefined ? summary.activeMRR.toLocaleString() : '0.00'}
          </div>
          <div className="text-[11px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> ARR: ${((summary?.activeMRR || 0) * 12).toLocaleString()}
          </div>
        </div>

        {/* Waitlist Queue */}
        <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest">VIP Waitlist</span>
            <Flame className="w-4 h-4 text-[#FF7A00]" />
          </div>
          <div className="text-2xl lg:text-3xl font-display font-black text-[#FF7A00]">
            {summary?.waitlistCount !== undefined ? summary.waitlistCount.toLocaleString() : '0'}
          </div>
          <Link to="/admin/crm/waitlist" className="text-[11px] font-black text-zinc-600 dark:text-zinc-400 hover:text-white mt-1 block">
            Review Applications →
          </Link>
        </div>

        {/* Failed Jobs */}
        <div className={`border-3 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${failedJobs.length > 0 ? 'bg-rose-950/30 border-rose-600/60 text-rose-200' : 'bg-[#121216] border-zinc-300 dark:border-zinc-800 text-white'}`}>
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest">Failed Jobs (24h)</span>
            <AlertOctagon className={`w-4 h-4 ${failedJobs.length > 0 ? 'text-rose-400' : 'text-zinc-500'}`} />
          </div>
          <div className="text-2xl lg:text-3xl font-display font-black">
            {failedJobs.length}
          </div>
          <div className="text-[11px] font-bold mt-1 text-zinc-600 dark:text-zinc-400">
            {failedJobs.length > 0 ? 'Action needed' : '0 errors (All Nominal)'}
          </div>
        </div>

        {/* AI Operating Cost */}
        <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest">AI Spend (MTD)</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-display font-black text-white">
            ${summary?.aiMonthlyCost !== undefined ? summary.aiMonthlyCost.toFixed(2) : '0.00'}
          </div>
          <div className="text-[11px] font-bold text-zinc-500 mt-1">
            Gemini & OpenAI API
          </div>
        </div>
      </div>

      {/* Grid: Live Operations & Provider Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Failed Jobs Triage & Queue Monitor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Failed Jobs Box */}
          <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="w-5 h-5 text-rose-500" />
                <h2 className="font-display font-black text-base uppercase text-white">
                  Failed Job Triage
                </h2>
              </div>
              <Link to="/admin/operations/failed" className="text-xs font-black text-[#FF7A00] hover:underline">
                View All Failures →
              </Link>
            </div>

            {failedJobs.length > 0 ? (
              <div className="space-y-3">
                {failedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl bg-zinc-900/80 border-2 border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-black text-[10px] uppercase">
                          {job.provider}
                        </span>
                        <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300 font-bold">
                          {job.id}
                        </span>
                        <span className="text-xs text-zinc-600 dark:text-zinc-400 font-bold truncate max-w-xs">
                          {job.user_email}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-rose-300 leading-relaxed">
                        {job.error_message}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleQuickRetry(job.id)}
                        disabled={retryingId === job.id}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 border border-black text-black font-black text-xs uppercase transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${retryingId === job.id ? 'animate-spin' : ''}`} />
                        Retry Now
                      </button>
                      <Link
                        to={`/admin/operations/jobs`}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs"
                      >
                        Inspect
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <div className="font-black text-sm text-white">0 Failed Dispatch Jobs</div>
                <div className="text-xs text-zinc-500 font-bold mt-0.5">All scheduled posts and AI tasks are completing successfully.</div>
              </div>
            )}
          </div>

          {/* Active Workers Fleet */}
          <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-[#FF7A00]" />
                <h2 className="font-display font-black text-base uppercase text-white">
                  Worker & Fleet Health
                </h2>
              </div>
              <Link to="/admin/operations/workers" className="text-xs font-black text-zinc-600 dark:text-zinc-400 hover:text-white">
                Worker Logs →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {workers.slice(0, 4).map((worker) => (
                <div key={worker.id} className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <div className="font-black text-xs text-white">{worker.name}</div>
                    <div className="text-[11px] font-bold text-zinc-500 mt-0.5">
                      {worker.jobs_processed_24h.toLocaleString()} jobs • {worker.avg_latency_ms}ms avg
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${worker.status === 'online' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                    {worker.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Provider API Live Status Board */}
        <div className="space-y-6">
          <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-black text-base uppercase text-white">
                Provider Health
              </h2>
              <span className="text-[10px] font-bold text-zinc-500">Live 30s checks</span>
            </div>

            <div className="space-y-3">
              {providers.map((p) => (
                <div key={p.id} className="p-3 rounded-2xl bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <div className="font-black text-xs text-white">{p.name}</div>
                      <div className="text-[10px] font-bold text-zinc-500">{p.latency_ms}ms latency • {p.success_rate_pct}% uptime</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase">
                    100%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="font-display font-black text-xs uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-3">
              Admin Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                to="/admin/content/blog/new"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white transition-colors"
              >
                <span>Write Blog / SEO Article</span>
                <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              </Link>
              <Link
                to="/admin/crm/waitlist"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white transition-colors"
              >
                <span>Batch Invite Early Access (50% Promo)</span>
                <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              </Link>
              <Link
                to="/admin/system/audit"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white transition-colors"
              >
                <span>Inspect Audit Log Activity</span>
                <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
