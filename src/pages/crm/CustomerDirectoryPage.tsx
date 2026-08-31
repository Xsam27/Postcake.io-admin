import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert,
  ArrowUpDown,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { CustomerRecord } from '../../types/admin';

export const CustomerDirectoryPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  useEffect(() => {
    adminService.getCustomers().then(setCustomers);
  }, []);

  const filtered = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === 'all' || c.plan === planFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Name,Email,Plan,Status,Platforms,Posts Count,MRR,Signup Date\n'];
    const rows = filtered.map(c => `"${c.name}","${c.email}","${c.plan}","${c.status}","${c.connected_platforms.join('; ')}",${c.posts_count},$${c.mrr_contribution},"${c.signup_date}"\n`);
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `postcake-customers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleStatusChange = async (id: string, newStatus: CustomerRecord['status']) => {
    await adminService.updateCustomerStatus(id, newStatus);
    const updated = await adminService.getCustomers();
    setCustomers(updated);
    if (selectedCustomer?.id === id) {
      setSelectedCustomer(updated.find(c => c.id === id) || null);
    }
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#8C9EFF]" />
            Customer Directory
          </h1>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
            Manage user accounts, connected platforms, subscription tiers, and account security.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 hover:border-white text-xs font-black uppercase text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV ({filtered.length})
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-4 rounded-3xl flex flex-col md:flex-row gap-3 items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-600 dark:text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 text-white text-xs font-bold rounded-xl focus:outline-none focus:border-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={e => setPlanFilter(e.target.value)}
            className="bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 text-xs font-black uppercase text-zinc-700 dark:text-zinc-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="pro">Pro ($24/mo)</option>
            <option value="team">Team ($79/mo)</option>
            <option value="enterprise">Enterprise ($249/mo)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 text-xs font-black uppercase text-zinc-700 dark:text-zinc-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="trialing">Trialing</option>
          </select>
        </div>
      </div>

      {/* Dense High-Performance Data Table */}
      <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-zinc-300 dark:border-zinc-800 bg-[#09090B] text-zinc-600 dark:text-zinc-400 font-black uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-4">Plan & MRR</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Connected Platforms</th>
                <th className="py-3.5 px-4">Published</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-bold text-zinc-700 dark:text-zinc-300">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-900/60 transition-colors">
                  {/* Customer Info */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF7A00] to-[#FFB74D] flex items-center justify-center text-black font-black text-xs border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-white">{c.name}</div>
                        <div className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">{c.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Plan & MRR */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-white font-black text-[10px] uppercase">
                      {c.plan}
                    </span>
                    <span className="ml-2 font-mono text-zinc-600 dark:text-zinc-400 font-bold">
                      ${c.mrr_contribution}/mo
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      c.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {c.status}
                    </span>
                  </td>

                  {/* Platforms */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {c.connected_platforms.map((p, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Published */}
                  <td className="py-3.5 px-4 font-mono text-zinc-700 dark:text-zinc-300">
                    {c.posts_count.toLocaleString()} posts
                  </td>

                  {/* Last Active */}
                  <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 text-[11px]">
                    {new Date(c.last_active).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs transition-colors cursor-pointer"
                    >
                      Inspect Drawer →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-fade-in font-sans">
          <div className="bg-[#121216] border-l-4 border-zinc-300 dark:border-zinc-700 w-full max-w-lg h-full p-8 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-zinc-300 dark:border-zinc-800 pb-4">
              <h2 className="text-xl font-display font-black uppercase text-white">
                Customer Dossier
              </h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-2.5 py-1"
              >
                Close (ESC)
              </button>
            </div>

            {/* Profile Overview */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-300 dark:border-zinc-800 space-y-2">
              <div className="text-xs font-black uppercase text-[#FF7A00]">Account Summary</div>
              <div className="text-lg font-black text-zinc-900 dark:text-white">{selectedCustomer.name}</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">{selectedCustomer.email}</div>
              <div className="text-xs text-zinc-500 font-bold">Customer ID: {selectedCustomer.id}</div>
            </div>

            {/* Connected Accounts Details */}
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Connected Channels</div>
              <div className="space-y-2">
                {selectedCustomer.connected_platforms.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{p}</span>
                    <span className="text-[10px] font-black text-emerald-400 uppercase">Token Active</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Controls */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-300 dark:border-zinc-800 space-y-3">
              <div className="text-xs font-black uppercase text-zinc-600 dark:text-zinc-400">Subscription & Billing</div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-600 dark:text-zinc-400">Current Plan:</span>
                <span className="font-black text-white uppercase">{selectedCustomer.plan} (${selectedCustomer.mrr_contribution}/mo)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-600 dark:text-zinc-400">Account Status:</span>
                <span className="font-black text-white uppercase">{selectedCustomer.status}</span>
              </div>
            </div>

            {/* Account Safety Controls */}
            <div className="space-y-3 pt-4 border-t-2 border-zinc-300 dark:border-zinc-800">
              <div className="text-xs font-black uppercase text-zinc-600 dark:text-zinc-400">Security & Enforcement</div>
              {selectedCustomer.status === 'active' ? (
                <button
                  onClick={() => handleStatusChange(selectedCustomer.id, 'suspended')}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                  Suspend Customer Account
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange(selectedCustomer.id, 'active')}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                  Restore & Activate Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
