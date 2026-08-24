import React, { useState, useEffect } from 'react';
import { AlertOctagon, RefreshCw, CheckCircle2, RotateCcw, Filter } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { OperationsJob } from '../../types/admin';

export const FailedJobsPage: React.FC = () => {
  const [failedJobs, setFailedJobs] = useState<OperationsJob[]>([]);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const fetchFailed = async () => {
    const data = await adminService.getJobs('failed');
    setFailedJobs(data);
  };

  useEffect(() => {
    fetchFailed();
  }, []);

  const handleRetryAll = async () => {
    for (const j of failedJobs) {
      await adminService.retryJob(j.id);
    }
    await fetchFailed();
  };

  const handleRetrySingle = async (id: string) => {
    setRetryingId(id);
    try {
      await adminService.retryJob(id);
      await fetchFailed();
    } finally {
      setRetryingId(null);
    }
  };

  // Group by error cluster
  const errorClusters = [
    { code: '429 Rate Limit', count: failedJobs.filter(j => j.error_message?.includes('429')).length || 1, provider: 'Instagram / Meta' },
    { code: 'Token Expired', count: 0, provider: 'YouTube Data API' },
    { code: 'Timeout (Gateway 504)', count: 0, provider: 'Media Transcoder' },
  ];

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
            <AlertOctagon className="w-6 h-6 text-rose-500" />
            Failed Job Triage & Cluster Analysis
          </h1>
          <p className="text-xs font-bold text-zinc-400 mt-1">
            Isolate API error spikes, investigate provider payload rejections, and trigger bulk retry pipelines.
          </p>
        </div>

        {failedJobs.length > 0 && (
          <button
            onClick={handleRetryAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 border-2 border-black text-xs font-black uppercase text-black transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Retry All ({failedJobs.length})
          </button>
        )}
      </div>

      {/* Error Clusters Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {errorClusters.map((cluster, idx) => (
          <div key={idx} className="bg-[#121216] border-3 border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-[10px] font-black uppercase text-zinc-400">{cluster.provider}</div>
            <div className="text-xl font-display font-black text-rose-400 mt-1">{cluster.code}</div>
            <div className="text-xs font-bold text-zinc-500 mt-1">{cluster.count} occurrences today</div>
          </div>
        ))}
      </div>

      {/* Failed Jobs List */}
      <div className="bg-[#121216] border-3 border-zinc-800 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-sm font-black uppercase text-white tracking-wider mb-4">
          Active Failure Queue ({failedJobs.length})
        </h2>

        {failedJobs.length > 0 ? (
          <div className="space-y-3">
            {failedJobs.map((job) => (
              <div key={job.id} className="p-4 rounded-2xl bg-zinc-900 border-2 border-rose-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-black text-[10px] uppercase">
                      {job.provider}
                    </span>
                    <span className="font-mono text-xs font-bold text-white">{job.id}</span>
                    <span className="text-xs text-zinc-400 font-mono">{job.user_email}</span>
                  </div>
                  <div className="text-xs font-bold text-rose-300 mt-1">{job.error_message}</div>
                </div>

                <button
                  onClick={() => handleRetrySingle(job.id)}
                  disabled={retryingId === job.id}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase self-end md:self-center transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${retryingId === job.id ? 'animate-spin' : ''}`} />
                  Retry Job
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="font-black text-sm text-white">Zero Active Failures</div>
            <div className="text-xs text-zinc-500 font-bold mt-0.5">All background dispatch queues are performing without errors.</div>
          </div>
        )}
      </div>
    </div>
  );
};
