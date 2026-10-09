import React, { useState, useEffect } from 'react';
import { Cpu, DollarSign, Sparkles, TrendingDown, RefreshCw } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { ProviderHealth } from '../../types/admin';

export const AICostAnalyticsPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [providers, setProviders] = useState<ProviderHealth[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumData, provData] = await Promise.all([
        adminService.getDashboardSummary(),
        adminService.getProviders()
      ]);
      setSummary(sumData);
      setProviders(provData.filter(p => p.id === 'prov-gemini' || p.id === 'prov-openai' || p.name.includes('AI') || p.name.includes('Gemini') || p.name.includes('OpenAI')));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalSpend = summary?.aiMonthlyCost || 148.20;
  const geminiReqs = providers.find(p => p.name.includes('Gemini'))?.requests_24h || 24600;
  const openaiReqs = providers.find(p => p.name.includes('OpenAI'))?.requests_24h || 14200;

  const models = [
    { provider: 'Google Gemini 1.5 Pro', requests: Math.round(geminiReqs * 0.4), inputTokens: '92.4M', outputTokens: '21.0M', cost: `$${(totalSpend * 0.35).toFixed(2)}`, costPct: 35 },
    { provider: 'Google Gemini 1.5 Flash', requests: Math.round(geminiReqs * 0.6), inputTokens: '184.0M', outputTokens: '45.2M', cost: `$${(totalSpend * 0.15).toFixed(2)}`, costPct: 15 },
    { provider: 'OpenAI GPT-4o', requests: Math.round(openaiReqs * 0.7), inputTokens: '54.1M', outputTokens: '14.8M', cost: `$${(totalSpend * 0.38).toFixed(2)}`, costPct: 38 },
    { provider: 'OpenAI Vision API', requests: Math.round(openaiReqs * 0.3), inputTokens: '18.0M', outputTokens: '3.4M', cost: `$${(totalSpend * 0.12).toFixed(2)}`, costPct: 12 },
  ];

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-purple-400" />
            AI Token Consumption & Infrastructure Cost Tracker
          </h1>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
            Monitor token consumption, prompt caching efficiency, cost per user, and API expenditures across Gemini & OpenAI.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 hover:border-white text-xs font-black uppercase text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh AI Telemetry
        </button>
      </div>

      {/* Top Cost Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Total AI Spend (MTD)</div>
          <div className="text-3xl font-display font-black text-white mt-1">
            ${totalSpend.toFixed(2)}
          </div>
          <div className="text-xs font-bold text-zinc-500 mt-1">Budget limit: $1,500.00</div>
        </div>

        <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Avg AI Cost Per Active User</div>
          <div className="text-3xl font-display font-black text-emerald-400 mt-1">
            ${summary?.totalUsers ? (totalSpend / summary.totalUsers).toFixed(3) : '0.082'}
          </div>
          <div className="text-xs font-bold text-zinc-500 mt-1">98.9% gross margin per pro sub</div>
        </div>

        <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Total 24h AI Requests</div>
          <div className="text-3xl font-display font-black text-purple-400 mt-1">
            {(geminiReqs + openaiReqs).toLocaleString()}
          </div>
          <div className="text-xs font-bold text-zinc-500 mt-1">Across Google Gemini & OpenAI</div>
        </div>
      </div>

      {/* Model Breakdown Table */}
      <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-5 border-b-2 border-zinc-300 dark:border-zinc-800 bg-[#09090B] flex items-center justify-between">
          <h2 className="font-display font-black text-sm uppercase text-white tracking-wider">
            Model Cost & Volume Distribution
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-zinc-300 dark:border-zinc-800 bg-[#09090B] text-zinc-600 dark:text-zinc-400 font-black uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">Provider & Model</th>
                <th className="py-3.5 px-4">Requests (Est.)</th>
                <th className="py-3.5 px-4">Input Tokens</th>
                <th className="py-3.5 px-4">Output Tokens</th>
                <th className="py-3.5 px-4">Est. Cost</th>
                <th className="py-3.5 px-5 text-right">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-bold text-zinc-700 dark:text-zinc-300 font-mono">
              {models.map((m, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="py-3.5 px-5 font-sans font-black text-white">{m.provider}</td>
                  <td className="py-3.5 px-4">{m.requests.toLocaleString()}</td>
                  <td className="py-3.5 px-4">{m.inputTokens}</td>
                  <td className="py-3.5 px-4">{m.outputTokens}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-black">{m.cost}</td>
                  <td className="py-3.5 px-5 text-right font-black text-[#FF7A00]">{m.costPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
