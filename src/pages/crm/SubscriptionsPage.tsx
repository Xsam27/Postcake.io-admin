import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  DollarSign, 
  ArrowUpRight, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Save, 
  RefreshCw, 
  Sparkles, 
  Zap, 
  Crown, 
  Rocket, 
  CheckCircle2, 
  Sliders, 
  Edit3, 
  X,
  AlertCircle
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { PlanConfig } from '../../types/admin';

export const SubscriptionsPage: React.FC = () => {
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [summary, setSummary] = useState<any>({
    totalMRR: 0,
    totalARR: 0,
    totalPaidSubscribers: 0,
    churnRate: 1.4,
    planBreakdown: {}
  });
  const [loading, setLoading] = useState(true);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<PlanConfig>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedPlans, fetchedSummary] = await Promise.all([
        adminService.getPlanConfigs(),
        adminService.getSubscriptionsSummary()
      ]);
      setPlans(fetchedPlans);
      setSummary(fetchedSummary);
    } catch (err: any) {
      console.error('[SubscriptionsPage] Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartEdit = (plan: PlanConfig) => {
    setEditingPlanId(plan.plan_id);
    setEditFormData({
      ...plan,
      limits: { ...plan.limits },
      features: { ...plan.features }
    });
  };

  const handleSavePlan = async (planId: string) => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      await adminService.updatePlanConfig(planId, editFormData);
      setStatusMessage({ text: `Plan "${editFormData.name || planId}" updated successfully!`, type: 'success' });
      setEditingPlanId(null);
      await loadData();
    } catch (err: any) {
      setStatusMessage({ text: `Failed to save plan: ${err.message}`, type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const getTierIcon = (planId: string) => {
    switch (planId) {
      case 'starter': return Zap;
      case 'pro': return Crown;
      case 'agency': return Rocket;
      case 'enterprise': return ShieldCheck;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-8 font-sans animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-[#FFD700]" />
            Subscriptions & Plan Quota Control
          </h1>
          <p className="text-xs font-bold text-zinc-400 mt-1">
            Authoritative Postcake billing control: adjust plan limits, prices, and feature gates dynamically without code deployments.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border-2 border-zinc-700 text-xs font-black uppercase tracking-wider text-white hover:bg-zinc-800 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Sync Billing State
        </button>
      </div>

      {/* Notification Toast */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl border-2 text-xs font-black uppercase tracking-wider flex items-center gap-3 animate-in fade-in ${
          statusMessage.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-400' 
            : 'bg-rose-950/40 border-rose-500/60 text-rose-400'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          {statusMessage.text}
        </div>
      )}

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#121216] border-3 border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Monthly Recurring Revenue</div>
          <div className="text-3xl font-display font-black text-white mt-1">
            ${summary.totalMRR.toLocaleString()}
          </div>
          <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Live Stripe synchronization
          </div>
        </div>

        <div className="bg-[#121216] border-3 border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Annual Run Rate (ARR)</div>
          <div className="text-3xl font-display font-black text-[#FFD700] mt-1">
            ${summary.totalARR.toLocaleString()}
          </div>
          <div className="text-xs font-bold text-zinc-400 mt-1">Annualized billing velocity</div>
        </div>

        <div className="bg-[#121216] border-3 border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Active Paid Workspaces</div>
          <div className="text-3xl font-display font-black text-[#8C9EFF] mt-1">
            {summary.totalPaidSubscribers}
          </div>
          <div className="text-xs font-bold text-emerald-400 mt-1">Paying subscribers</div>
        </div>

        <div className="bg-[#121216] border-3 border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Churn Rate (30d)</div>
          <div className="text-3xl font-display font-black text-emerald-400 mt-1">
            {summary.churnRate}%
          </div>
          <div className="text-xs font-bold text-zinc-500 mt-1">Healthy baseline &lt; 3.0%</div>
        </div>
      </div>

      {/* Plan Configurations & Quota Controller */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#FF7A00]" />
              Active Plan Catalog & Quota Controller
            </h2>
            <p className="text-xs font-bold text-zinc-400">
              Changes saved here immediately apply to user entitlements, checkout sessions, and feature gating.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {plans.map((plan) => {
            const isEditing = editingPlanId === plan.plan_id;
            const PlanIcon = getTierIcon(plan.plan_id);
            const stats = summary.planBreakdown?.[plan.plan_id] || { count: 0, mrr: 0 };

            return (
              <div 
                key={plan.plan_id}
                className="bg-[#121216] border-3 border-zinc-800 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6"
              >
                {/* Plan Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-zinc-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-[#FFD700] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <PlanIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-display font-black uppercase text-white tracking-tight">
                          {plan.name}
                        </h3>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {plan.plan_id}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-zinc-400 mt-0.5">
                        ${plan.monthly_price_usd}/mo (${plan.annual_price_usd}/yr) · {stats.count} active workspaces · ${stats.mrr} MRR
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setEditingPlanId(null)}
                          className="px-3 py-1.5 rounded-xl border-2 border-zinc-700 text-xs font-bold uppercase text-zinc-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSavePlan(plan.plan_id)}
                          disabled={isSaving}
                          className="px-4 py-1.5 rounded-xl border-2 border-[#FFD700] bg-[#FFD700] text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:brightness-105 active:translate-y-0.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          {isSaving ? 'Saving...' : 'Save Plan'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(plan)}
                        className="px-4 py-1.5 rounded-xl border-2 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Quotas & Pricing
                      </button>
                    )}
                  </div>
                </div>

                {/* Edit Form or Read-only Display */}
                {isEditing ? (
                  <div className="space-y-6 pt-2">
                    {/* Pricing Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={editFormData.name || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-900 border-2 border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#FFD700]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
                          Monthly Price (USD)
                        </label>
                        <input
                          type="number"
                          value={editFormData.monthly_price_usd ?? 0}
                          onChange={(e) => setEditFormData({ ...editFormData, monthly_price_usd: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-zinc-900 border-2 border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#FFD700]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
                          Annual Price (USD)
                        </label>
                        <input
                          type="number"
                          value={editFormData.annual_price_usd ?? 0}
                          onChange={(e) => setEditFormData({ ...editFormData, annual_price_usd: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-zinc-900 border-2 border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#FFD700]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
                          Status
                        </label>
                        <select
                          value={editFormData.is_active ? 'active' : 'inactive'}
                          onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.value === 'active' })}
                          className="w-full px-3 py-2 bg-zinc-900 border-2 border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#FFD700]"
                        >
                          <option value="active">Active (Available for Checkout)</option>
                          <option value="inactive">Inactive / Hidden</option>
                        </select>
                      </div>
                    </div>

                    {/* Quota Limits Inputs */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#FFD700] mb-3">
                        Tier Quota Entitlements (Monthly Caps)
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                            Social Accounts
                          </label>
                          <input
                            type="number"
                            value={editFormData.limits?.social_accounts ?? 0}
                            onChange={(e) => setEditFormData({
                              ...editFormData,
                              limits: { ...editFormData.limits!, social_accounts: parseInt(e.target.value) || 0 }
                            })}
                            className="w-full px-3 py-2 bg-zinc-900 border-2 border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#FFD700]"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                            Monthly Posts
                          </label>
                          <input
                            type="number"
                            value={editFormData.limits?.posts_per_month ?? 0}
                            onChange={(e) => setEditFormData({
                              ...editFormData,
                              limits: { ...editFormData.limits!, posts_per_month: parseInt(e.target.value) || 0 }
                            })}
                            className="w-full px-3 py-2 bg-zinc-900 border-2 border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#FFD700]"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                            ManyChat Rules
                          </label>
                          <input
                            type="number"
                            value={editFormData.limits?.manychat_rules ?? 0}
                            onChange={(e) => setEditFormData({
                              ...editFormData,
                              limits: { ...editFormData.limits!, manychat_rules: parseInt(e.target.value) || 0 }
                            })}
                            className="w-full px-3 py-2 bg-zinc-900 border-2 border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#FFD700]"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                            Monthly DMs
                          </label>
                          <input
                            type="number"
                            value={editFormData.limits?.dms_per_month ?? 0}
                            onChange={(e) => setEditFormData({
                              ...editFormData,
                              limits: { ...editFormData.limits!, dms_per_month: parseInt(e.target.value) || 0 }
                            })}
                            className="w-full px-3 py-2 bg-zinc-900 border-2 border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#FFD700]"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-wider text-zinc-400 block mb-1">
                            AI Token Credits
                          </label>
                          <input
                            type="number"
                            value={editFormData.limits?.ai_tokens_per_month ?? 0}
                            onChange={(e) => setEditFormData({
                              ...editFormData,
                              limits: { ...editFormData.limits!, ai_tokens_per_month: parseInt(e.target.value) || 0 }
                            })}
                            className="w-full px-3 py-2 bg-zinc-900 border-2 border-zinc-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#FFD700]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Features Flags */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-[#FFD700] mb-3">
                        Feature Toggles
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <label className="flex items-center gap-2 p-2.5 rounded-xl border-2 border-zinc-700 bg-zinc-900 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(editFormData.features?.watermark_removal)}
                            onChange={(e) => setEditFormData({
                              ...editFormData,
                              features: { ...editFormData.features!, watermark_removal: e.target.checked }
                            })}
                            className="rounded border-zinc-700 text-[#FFD700] focus:ring-0"
                          />
                          <span className="font-bold text-zinc-200">Watermark Removal</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-xl border-2 border-zinc-700 bg-zinc-900 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(editFormData.features?.priority_support)}
                            onChange={(e) => setEditFormData({
                              ...editFormData,
                              features: { ...editFormData.features!, priority_support: e.target.checked }
                            })}
                            className="rounded border-zinc-700 text-[#FFD700] focus:ring-0"
                          />
                          <span className="font-bold text-zinc-200">Priority Support</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-xl border-2 border-zinc-700 bg-zinc-900 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(editFormData.features?.white_label)}
                            onChange={(e) => setEditFormData({
                              ...editFormData,
                              features: { ...editFormData.features!, white_label: e.target.checked }
                            })}
                            className="rounded border-zinc-700 text-[#FFD700] focus:ring-0"
                          />
                          <span className="font-bold text-zinc-200">White Label</span>
                        </label>
                        <label className="flex items-center gap-2 p-2.5 rounded-xl border-2 border-zinc-700 bg-zinc-900 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(editFormData.features?.webhooks)}
                            onChange={(e) => setEditFormData({
                              ...editFormData,
                              features: { ...editFormData.features!, webhooks: e.target.checked }
                            })}
                            className="rounded border-zinc-700 text-[#FFD700] focus:ring-0"
                          />
                          <span className="font-bold text-zinc-200">Webhooks & API</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Read-Only Quotas Grid */
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                    <div className="p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800">
                      <div className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Social Accounts</div>
                      <div className="text-base font-black text-white mt-1">{plan.limits?.social_accounts || 0}</div>
                    </div>
                    <div className="p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800">
                      <div className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Monthly Posts</div>
                      <div className="text-base font-black text-white mt-1">{plan.limits?.posts_per_month?.toLocaleString() || 0}</div>
                    </div>
                    <div className="p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800">
                      <div className="text-[9px] font-black uppercase tracking-wider text-zinc-400">ManyChat Rules</div>
                      <div className="text-base font-black text-white mt-1">{plan.limits?.manychat_rules || 0}</div>
                    </div>
                    <div className="p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800">
                      <div className="text-[9px] font-black uppercase tracking-wider text-zinc-400">Monthly DMs</div>
                      <div className="text-base font-black text-white mt-1">{plan.limits?.dms_per_month?.toLocaleString() || 0}</div>
                    </div>
                    <div className="p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800">
                      <div className="text-[9px] font-black uppercase tracking-wider text-zinc-400">AI Tokens / mo</div>
                      <div className="text-base font-black text-white mt-1">{plan.limits?.ai_tokens_per_month?.toLocaleString() || 0}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
