import React, { useState, useEffect } from 'react';
import { Server, RefreshCw, Activity, Cpu, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { WorkerStatus } from '../../types/admin';

export const WorkersPage: React.FC = () => {
  const [workers, setWorkers] = useState<WorkerStatus[]>([]);

  useEffect(() => {
    adminService.getWorkers().then(setWorkers);
  }, []);

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
          <Server className="w-6 h-6 text-[#FF7A00]" />
          Worker & Daemon Fleet Monitor
        </h1>
        <p className="text-xs font-bold text-zinc-400 mt-1">
          Monitor background worker heartbeats, load distribution, dispatch throughput, and processing latencies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map((w) => (
          <div key={w.id} className="bg-[#121216] border-3 border-zinc-800 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-zinc-500 font-bold">{w.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  w.status === 'online' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {w.status}
                </span>
              </div>
              <h3 className="font-display font-black text-base text-white">{w.name}</h3>
              <div className="text-xs text-zinc-400 font-bold mt-1">Heartbeat: {w.last_heartbeat}</div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400 font-bold">24h Throughput:</span>
                <span className="text-white font-black">{w.jobs_processed_24h.toLocaleString()} jobs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 font-bold">Avg Latency:</span>
                <span className="text-white font-black font-mono">{w.avg_latency_ms}ms</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-zinc-400 font-bold">Current Load:</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-[#FF7A00]" style={{ width: `${w.current_load_pct}%` }} />
                  </div>
                  <span className="text-white font-mono font-bold text-[11px]">{w.current_load_pct}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
