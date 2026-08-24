import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Search, 
  Send, 
  Check, 
  X, 
  Tag, 
  Download, 
  RefreshCw,
  MailCheck,
  Sparkles
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { EarlySignupRecord } from '../../types/admin';

export const WaitlistPage: React.FC = () => {
  const [waitlist, setWaitlist] = useState<EarlySignupRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchWaitlist = async () => {
    setLoading(true);
    try {
      const data = await adminService.getWaitlist();
      setWaitlist(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const filtered = waitlist.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) || 
                          w.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(w => w.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkInvite = async () => {
    if (selectedIds.length === 0) return;
    for (const id of selectedIds) {
      await adminService.updateWaitlistStatus(id, 'invited', 'POSTCAKE-50-VIP');
    }
    setActionSuccess(`Successfully sent VIP invites with 50% Lifetime Promo Codes to ${selectedIds.length} applicants!`);
    setSelectedIds([]);
    await fetchWaitlist();
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleSingleStatus = async (id: string, status: EarlySignupRecord['status']) => {
    await adminService.updateWaitlistStatus(id, status, 'POSTCAKE-50-VIP');
    await fetchWaitlist();
  };

  const exportWaitlistCSV = () => {
    const headers = ['Name,Email,Phone,Role,Accounts,Platforms,Status,InviteCode,CreatedAt\n'];
    const rows = filtered.map(w => `"${w.name}","${w.email}","${w.phone || ''}","${w.role || ''}","${w.account_count || ''}","${(w.platforms || []).join('; ')}","${w.status}","${w.invite_code || ''}","${w.created_at}"\n`);
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `postcake-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-[#FF7A00]" />
            <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight">
              Early Access & Waitlist HQ
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/40 font-black text-xs">
              {waitlist.length} Applicants
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-400 mt-1">
            Review incoming creator & agency waitlist applications, dispatch beta invites, and assign discount codes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportWaitlistCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900 border-2 border-zinc-700 hover:border-white text-xs font-black uppercase text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkInvite}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF7A00] hover:bg-[#e06c00] border-2 border-black text-xs font-black uppercase text-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Send VIP Invite ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/60 text-emerald-300 text-xs font-black flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)] animate-shake">
          <MailCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-[#121216] border-3 border-zinc-800 p-4 rounded-3xl flex flex-col md:flex-row gap-3 items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search waitlist name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border-2 border-zinc-700 text-white text-xs font-bold rounded-xl focus:outline-none focus:border-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border-2 border-zinc-700 text-xs font-black uppercase text-zinc-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses ({waitlist.length})</option>
            <option value="pending">Pending</option>
            <option value="invited">Invited</option>
            <option value="active">Active</option>
          </select>

          <button
            onClick={fetchWaitlist}
            className="p-2 rounded-xl bg-zinc-900 border-2 border-zinc-700 hover:border-white text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Waitlist Data Table */}
      <div className="bg-[#121216] border-3 border-zinc-800 rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-zinc-800 bg-[#09090B] text-zinc-400 font-black uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-zinc-700 text-[#FF7A00] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Applicant</th>
                <th className="py-3.5 px-4">Role & Scale</th>
                <th className="py-3.5 px-4">Channels</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Promo Code</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-bold text-zinc-300">
              {filtered.map((w) => (
                <tr key={w.id} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(w.id)}
                      onChange={() => toggleSelect(w.id)}
                      className="rounded border-zinc-700 text-[#FF7A00] focus:ring-0 cursor-pointer"
                    />
                  </td>

                  {/* Applicant */}
                  <td className="py-3.5 px-4">
                    <div className="font-black text-white">{w.name}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{w.email}</div>
                    {w.phone && <div className="text-[10px] text-zinc-500 font-mono">{w.phone}</div>}
                  </td>

                  {/* Role & Scale */}
                  <td className="py-3.5 px-4">
                    <div className="text-zinc-200 font-bold">{w.role || 'Content Creator'}</div>
                    <div className="text-[11px] text-[#FFB74D] font-bold">{w.account_count || '1 - 3 Accounts'}</div>
                  </td>

                  {/* Platforms */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {(w.platforms || []).map((p, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      w.status === 'invited' 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                        : w.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {w.status}
                    </span>
                  </td>

                  {/* Promo Code */}
                  <td className="py-3.5 px-4 font-mono text-zinc-300">
                    {w.invite_code ? (
                      <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[#FF7A00] font-black text-[10px]">
                        {w.invite_code}
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>

                  {/* Single Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {w.status !== 'invited' && (
                        <button
                          onClick={() => handleSingleStatus(w.id, 'invited')}
                          title="Invite with 50% Promo"
                          className="px-2.5 py-1 rounded-lg bg-[#FF7A00] hover:bg-[#e06c00] text-white font-black text-xs uppercase cursor-pointer"
                        >
                          Invite
                        </button>
                      )}
                      {w.status !== 'active' && (
                        <button
                          onClick={() => handleSingleStatus(w.id, 'active')}
                          title="Mark Active"
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-600 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
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
