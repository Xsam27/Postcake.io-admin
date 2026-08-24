import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  RefreshCw, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  RotateCcw, 
  Ban, 
  X,
  Code,
  ArrowRight
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { OperationsJob, JobStatus } from '../../types/admin';

export const LiveJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<OperationsJob[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<OperationsJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await adminService.getJobs(statusFilter);
      setJobs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const handleRetry = async (id: string) => {
    setRetryingId(id);
    try {
      await adminService.retryJob(id);
      await fetchJobs();
      if (selectedJob?.id === id) {
        setSelectedJob(await adminService.getJobById(id));
      }
    } finally {
      setRetryingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    await adminService.cancelJob(id);
    await fetchJobs();
    if (selectedJob?.id === id) {
      setSelectedJob(await adminService.getJobById(id));
    }
  };

  const filtered = jobs.filter(j => 
    j.user_email.toLowerCase().includes(search.toLowerCase()) ||
    j.provider.toLowerCase().includes(search.toLowerCase()) ||
    j.id.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase">Completed</span>;
      case 'processing':
        return <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-black uppercase flex items-center gap-1"><RefreshCw className="w-2.5 h-2.5 animate-spin" /> Processing</span>;
      case 'failed':
        return <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black uppercase">Failed</span>;
      case 'queued':
        return <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase">Queued</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-[#FF7A00]" />
            Live Dispatch Queue & Operations
          </h1>
          <p className="text-xs font-bold text-zinc-400 mt-1">
            Real-time monitor for social publishing, AI repurposing, media processing, and cron scheduling jobs.
          </p>
        </div>

        <button
          onClick={fetchJobs}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900 border-2 border-zinc-700 hover:border-white text-xs font-black uppercase text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Queue
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[#121216] border-3 border-zinc-800 p-4 rounded-3xl flex flex-col md:flex-row gap-3 items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['all', 'queued', 'processing', 'failed', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-[#FF7A00] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border-2 border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search job ID, email, or provider..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border-2 border-zinc-700 text-white text-xs font-bold rounded-xl focus:outline-none focus:border-white"
          />
        </div>
      </div>

      {/* Jobs Data Table */}
      <div className="bg-[#121216] border-3 border-zinc-800 rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-zinc-800 bg-[#09090B] text-zinc-400 font-black uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Job ID & Type</th>
                <th className="py-3.5 px-4">Provider</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Attempts</th>
                <th className="py-3.5 px-4">Created / Scheduled</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-bold text-zinc-300">
              {filtered.map((job) => (
                <tr key={job.id} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-white font-black">{job.id}</div>
                    <div className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider">{job.job_type.replace('_', ' ')}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-white font-bold text-[11px]">
                      {job.provider}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-zinc-400">
                    {job.user_email}
                  </td>

                  <td className="py-3.5 px-4">
                    {getStatusBadge(job.status)}
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className="text-white">{job.attempts.length}</span> attempt(s)
                  </td>

                  <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                    {new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {job.status === 'failed' && (
                        <button
                          onClick={() => handleRetry(job.id)}
                          disabled={retryingId === job.id}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-black text-[11px] uppercase cursor-pointer"
                        >
                          Retry
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-[11px] cursor-pointer"
                      >
                        Inspect →
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Job Details Drawer with JSON Viewer */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-fade-in font-sans">
          <div className="bg-[#121216] border-l-4 border-zinc-700 w-full max-w-xl h-full p-8 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#FF7A00] text-black">
                  {selectedJob.job_type}
                </span>
                <h2 className="text-xl font-display font-black uppercase text-white mt-1">
                  Job Inspector • {selectedJob.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-2.5 py-1 cursor-pointer"
              >
                Close (ESC)
              </button>
            </div>

            {/* Error Banner if failed */}
            {selectedJob.status === 'failed' && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border-2 border-rose-500/60 space-y-1">
                <div className="text-[10px] font-black uppercase text-rose-400">Error Code: {selectedJob.error_code || 'API_DISPATCH_FAILURE'}</div>
                <div className="text-xs font-bold text-rose-200">{selectedJob.error_message}</div>
              </div>
            )}

            {/* Attempt History */}
            <div className="space-y-2">
              <div className="text-xs font-black uppercase text-zinc-400">Attempt Timeline ({selectedJob.attempts.length})</div>
              {selectedJob.attempts.map((att, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-white font-bold">Attempt #{att.attempt_number}</span>
                    <span className="text-zinc-500 ml-2">({att.duration_ms}ms)</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase ${att.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {att.status}
                  </span>
                </div>
              ))}
            </div>

            {/* JSON Payload Viewer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-zinc-400">Payload Payload</span>
                <Code className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <pre className="p-4 rounded-2xl bg-[#09090B] border-2 border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto">
                {JSON.stringify(selectedJob.payload, null, 2)}
              </pre>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t-2 border-zinc-800 flex gap-3">
              {selectedJob.status === 'failed' && (
                <button
                  onClick={() => handleRetry(selectedJob.id)}
                  disabled={retryingId === selectedJob.id}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Execute Protected Retry
                </button>
              )}
              {selectedJob.status === 'queued' && (
                <button
                  onClick={() => handleCancel(selectedJob.id)}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ban className="w-4 h-4" />
                  Cancel Queue Job
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
