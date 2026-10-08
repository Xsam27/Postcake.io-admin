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
  ChevronRight,
  Crown,
  Save,
  Loader2,
  Sliders
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { CustomerRecord } from '../../types/admin';

export const CustomerDirectoryPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  // Override Drawer State
  const [overridePlan, setOverridePlan] = useState<string>('pro');
  const [isAdminOverride, setIsAdminOverride] = useState<boolean>(false);
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [customAccounts, setCustomAccounts] = useState<number>(15);
  const [customPosts, setCustomPosts] = useState<number>(300);
  const [customRules, setCustomRules] = useState<number>(25);
  const [customDMs, setCustomDMs] = useState<number>(5000);
  const [customAITokens, setCustomAITokens] = useState<number>(500000);
  const [isSavingOverride, setIsSavingOverride] = useState(false);
  const [overrideSuccess, setOverrideSuccess] = useState<string | null>(null);

  useEffect(() => {
    adminService.getCustomers().then(setCustomers);
  }, []);

  const handleSelectCustomer = (c: CustomerRecord) => {
    setSelectedCustomer(c);
    setOverridePlan(c.plan || 'pro');
    setIsAdminOverride(Boolean(c.is_admin_override));
    setOverrideReason(c.override_reason || '');
    setCustomAccounts(c.custom_limits?.social_accounts || 15);
    setCustomPosts(c.custom_limits?.posts_per_month || 300);
    setCustomRules(c.custom_limits?.manychat_rules || 25);
    setCustomDMs(c.custom_limits?.dms_per_month || 5000);
    setCustomAITokens(c.custom_limits?.ai_tokens_per_month || 500000);
    setOverrideSuccess(null);
  };

  const handleSavePlanOverride = async () => {
    if (!selectedCustomer) return;
    setIsSavingOverride(true);
    setOverrideSuccess(null);
    try {
      await adminService.overrideCustomerPlan({
        workspaceId: selectedCustomer.id,
        planTier: overridePlan,
        isAdminOverride: isAdminOverride,
        reason: overrideReason,
        customLimits: isAdminOverride ? {
          social_accounts: customAccounts,
          posts_per_month: customPosts,
          manychat_rules: customRules,
          dms_per_month: customDMs,
          ai_tokens_per_month: customAITokens
        } : undefined
      });

      setOverrideSuccess(`Successfully updated plan to ${overridePlan.toUpperCase()}!`);
      const updated = await adminService.getCustomers();
      setCustomers(updated);
      const match = updated.find(c => c.id === selectedCustomer.id);
      if (match) setSelectedCustomer(match);
    } catch (err: any) {
      alert(`Error updating customer plan: ${err.message}`);
    } finally {
      setIsSavingOverride(false);
      setTimeout(() => setOverrideSuccess(null), 4000);
    }
  };

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
    <div className="space-y-6 font-sans animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#8C9EFF]" />
            Customer Directory & Entitlement Overrides
          </h1>
          <p className="text-xs font-bold text-zinc-400 mt-1">
            Manage user accounts, connected platforms, subscription tiers, and grant manual VIP plan overrides.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900 border-2 border-zinc-700 hover:border-white text-xs font-black uppercase text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV ({filtered.length})
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#121216] border-3 border-zinc-800 p-4 rounded-3xl flex flex-col md:flex-row gap-3 items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border-2 border-zinc-700 text-white text-xs font-bold rounded-xl focus:outline-none focus:border-white"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={e => setPlanFilter(e.target.value)}
            className="bg-zinc-900 border-2 border-zinc-700 text-xs font-black uppercase text-zinc-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="all">All Plans</option>
            <option value="free">Free Forever</option>
            <option value="starter">Starter ($29/mo)</option>
            <option value="pro">Pro Creator ($79/mo)</option>
            <option value="agency">Growth Agency ($199/mo)</option>
            <option value="enterprise">Enterprise ($999/mo)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border-2 border-zinc-700 text-xs font-black uppercase text-zinc-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="trialing">Trialing</option>
          </select>
        </div>
      </div>

      {/* Dense High-Performance Data Table */}
      <div className="bg-[#121216] border-3 border-zinc-800 rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-zinc-800 bg-[#09090B] text-zinc-400 font-black uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-4">Plan & Override</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Connected Platforms</th>
                <th className="py-3.5 px-4">Published</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-bold text-zinc-300">
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
                        <div className="text-[11px] text-zinc-400 font-mono">{c.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Plan & MRR */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white font-black text-[10px] uppercase">
                        {c.plan}
                      </span>
                      {c.is_admin_override && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black font-black text-[9px] uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                          👑 VIP
                        </span>
                      )}
                      <span className="font-mono text-zinc-400 font-bold">
                        ${c.mrr_contribution}/mo
                      </span>
                    </div>
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
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Published */}
                  <td className="py-3.5 px-4 font-mono text-zinc-300">
                    {c.posts_count.toLocaleString()} posts
                  </td>

                  {/* Last Active */}
                  <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                    {new Date(c.last_active).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => handleSelectCustomer(c)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs transition-colors cursor-pointer"
                    >
                      Manage Entitlements →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail & Entitlement Override Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-fade-in font-sans">
          <div className="bg-[#121216] border-l-4 border-zinc-700 w-full max-w-lg h-full p-8 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-4">
              <div>
                <h2 className="text-xl font-display font-black uppercase text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#FFD700]" />
                  Customer Entitlements
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5 font-bold">
                  Workspace: {selectedCustomer.name} ({selectedCustomer.id})
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-2.5 py-1"
              >
                Close (ESC)
              </button>
            </div>

            {/* Notification alert */}
            {overrideSuccess && (
              <div className="p-3 bg-emerald-950/60 border-2 border-emerald-500 rounded-xl text-emerald-400 text-xs font-black uppercase flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {overrideSuccess}
              </div>
            )}

            {/* Profile Overview */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#FF7A00]">Account Summary</div>
              <div className="text-base font-black text-white">{selectedCustomer.name}</div>
              <div className="text-xs text-zinc-400 font-mono">{selectedCustomer.email}</div>
            </div>

            {/* Plan Tier Override Section */}
            <div className="p-5 rounded-2xl bg-zinc-900/80 border-2 border-zinc-700 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-[#FFD700]" />
                  Plan & Quota Override Control
                </h3>
                <span className="text-[10px] uppercase font-bold text-zinc-400">
                  Current: <strong className="text-white">{selectedCustomer.plan.toUpperCase()}</strong>
                </span>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
                  Assign Plan Tier
                </label>
                <select
                  value={overridePlan}
                  onChange={(e) => setOverridePlan(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border-2 border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#FFD700]"
                >
                  <option value="free">Free Forever ($0)</option>
                  <option value="starter">Starter ($29/mo)</option>
                  <option value="pro">Pro Creator ($79/mo)</option>
                  <option value="agency">Growth Agency ($199/mo)</option>
                  <option value="enterprise">Enterprise Custom ($999/mo)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-zinc-800/80 border border-zinc-700 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAdminOverride}
                    onChange={(e) => setIsAdminOverride(e.target.checked)}
                    className="rounded border-zinc-700 text-[#FFD700] focus:ring-0"
                  />
                  <span className="text-xs font-black uppercase text-white">
                    Grant VIP Lifetime / Admin Manual Override
                  </span>
                </label>
                <p className="text-[10px] text-zinc-400 font-medium pl-5">
                  Bypasses Stripe subscription expiration and unlocks custom quota ceilings.
                </p>
              </div>

              {isAdminOverride && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
                      Reason for Override
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. VIP Creator Partner / Early Beta Tester"
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border-2 border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#FFD700]"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FFD700] block">
                      Custom Limits (Leave default or boost)
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[9px] text-zinc-400 uppercase font-bold block">Social Accounts</label>
                        <input
                          type="number"
                          value={customAccounts}
                          onChange={(e) => setCustomAccounts(parseInt(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-400 uppercase font-bold block">Monthly Posts</label>
                        <input
                          type="number"
                          value={customPosts}
                          onChange={(e) => setCustomPosts(parseInt(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-400 uppercase font-bold block">ManyChat Rules</label>
                        <input
                          type="number"
                          value={customRules}
                          onChange={(e) => setCustomRules(parseInt(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-400 uppercase font-bold block">Monthly DMs</label>
                        <input
                          type="number"
                          value={customDMs}
                          onChange={(e) => setCustomDMs(parseInt(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleSavePlanOverride}
                disabled={isSavingOverride}
                className="w-full py-2.5 rounded-xl border-2 border-[#FFD700] bg-[#FFD700] text-black font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:brightness-105 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                {isSavingOverride ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Plan & Override Entitlements
              </button>
            </div>

            {/* Account Safety Controls */}
            <div className="space-y-3 pt-4 border-t-2 border-zinc-800">
              <div className="text-xs font-black uppercase text-zinc-400">Security & Account Access</div>
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
