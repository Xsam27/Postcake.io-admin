import React, { useState, useEffect } from 'react';
import { History, Search, ShieldAlert, Download, RefreshCw, FileText } from 'lucide-react';
import { auditService } from '../../services/auditService';
import { AuditLogEntry } from '../../types/admin';

export const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    const data = await auditService.getLogs(100);
    setLogs(data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.admin_email.toLowerCase().includes(search.toLowerCase()) ||
    l.target_resource.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-[#FF7A00]" />
            Immutable Admin Audit Log
          </h1>
          <p className="text-xs font-bold text-zinc-400 mt-1">
            Tamper-resistant audit log capturing every administrative mutation, job retry, security suspension, and publication event.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900 border-2 border-zinc-700 hover:border-white text-xs font-black uppercase text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Audit Trail
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#121216] border-3 border-zinc-800 p-4 rounded-3xl flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search action, admin email, or target resource..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border-2 border-zinc-700 text-white text-xs font-bold rounded-xl focus:outline-none focus:border-white"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#121216] border-3 border-zinc-800 rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-zinc-800 bg-[#09090B] text-zinc-400 font-black uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-4">Admin</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Target Resource</th>
                <th className="py-3.5 px-5">Details / Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-bold text-zinc-300">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-black text-white font-mono">{log.admin_email}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[#FF7A00] font-black text-[10px] uppercase">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400 text-[11px]">
                    {log.target_resource} {log.target_id ? `(${log.target_id})` : ''}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-[11px] text-zinc-400">
                    {JSON.stringify(log.details || {})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
