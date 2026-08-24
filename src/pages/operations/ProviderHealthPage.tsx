import React, { useState, useEffect } from 'react';
import { HeartPulse, CheckCircle2, RefreshCw, Zap } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { ProviderHealth } from '../../types/admin';

export const ProviderHealthPage: React.FC = () => {
  const [providers, setProviders] = useState<ProviderHealth[]>([]);

  useEffect(() => {
    adminService.getProviders().then(setProviders);
  }, []);

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
          <HeartPulse className="w-6 h-6 text-emerald-400" />
          Social & AI Provider API Health
        </h1>
        <p className="text-xs font-bold text-zinc-400 mt-1">
          Direct latency, error rate, and availability telemetry across external platform APIs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((p) => (
          <div key={p.id} className="bg-[#121216] border-3 border-zinc-800 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-emerald-400">Operational</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-500">{p.last_checked}</span>
            </div>

            <h3 className="font-display font-black text-base text-white">{p.name}</h3>

            <div className="mt-6 pt-4 border-t-2 border-zinc-800 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400 font-bold">API Latency:</span>
                <span className="text-white font-mono font-bold">{p.latency_ms}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 font-bold">24h Requests:</span>
                <span className="text-white font-black">{p.requests_24h.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 font-bold">Success Rate:</span>
                <span className="text-emerald-400 font-mono font-black">{p.success_rate_pct}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
