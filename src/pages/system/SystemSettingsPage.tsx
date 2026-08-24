import React, { useState, useEffect } from 'react';
import { Sliders, CheckCircle2, ShieldAlert, Zap, ToggleLeft, ToggleRight } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { FeatureFlag } from '../../types/admin';

export const SystemSettingsPage: React.FC = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    adminService.getFeatureFlags().then(setFlags);
  }, []);

  const handleToggleFlag = async (id: string, current: boolean) => {
    await adminService.toggleFeatureFlag(id, !current);
    const updated = await adminService.getFeatureFlags();
    setFlags(updated);
  };

  return (
    <div className="space-y-8 font-sans animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
          <Sliders className="w-6 h-6 text-[#FF7A00]" />
          System Settings & Feature Flags
        </h1>
        <p className="text-xs font-bold text-zinc-400 mt-1">
          Control platform-wide feature rollouts, API rate-limit thresholds, and maintenance state.
        </p>
      </div>

      {/* Feature Flags Module */}
      <div className="bg-[#121216] border-3 border-zinc-800 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
        <h2 className="font-display font-black text-base uppercase text-white">
          Active Feature Flags
        </h2>

        <div className="divide-y divide-zinc-800">
          {flags.map((flag) => (
            <div key={flag.id} className="py-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-white">{flag.key}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {flag.environment}
                  </span>
                </div>
                <div className="text-xs text-zinc-400 font-bold mt-0.5">{flag.description}</div>
              </div>

              <button
                onClick={() => handleToggleFlag(flag.id, flag.enabled)}
                className={`p-1.5 rounded-2xl border-2 transition-all flex items-center gap-2 text-xs font-black uppercase px-3 cursor-pointer ${
                  flag.enabled
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-500'
                }`}
              >
                {flag.enabled ? (
                  <>
                    <ToggleRight className="w-5 h-5 text-emerald-400" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-5 h-5 text-zinc-600" />
                    <span>Disabled</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency & Maintenance Controls */}
      <div className="bg-[#121216] border-3 border-rose-900/60 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <div className="flex items-center gap-2.5 text-rose-400">
          <ShieldAlert className="w-5 h-5" />
          <h2 className="font-display font-black text-base uppercase">
            Emergency Maintenance State
          </h2>
        </div>
        <p className="text-xs font-bold text-zinc-400">
          Toggling maintenance mode will gracefully pause all non-critical background dispatch cron jobs and present a scheduled upgrade banner to end-users.
        </p>

        <button
          onClick={() => setMaintenanceMode(!maintenanceMode)}
          className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 cursor-pointer ${
            maintenanceMode 
              ? 'bg-rose-600 hover:bg-rose-700 text-white border-black' 
              : 'bg-zinc-900 border-zinc-700 hover:border-white text-zinc-300'
          }`}
        >
          {maintenanceMode ? '⚠️ Maintenance Mode Active (Click to Disable)' : 'Enable Maintenance Mode'}
        </button>
      </div>
    </div>
  );
};
