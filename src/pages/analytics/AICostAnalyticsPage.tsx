import React from 'react';
import { Cpu, DollarSign, Sparkles, TrendingDown } from 'lucide-react';

export const AICostAnalyticsPage: React.FC = () => {
  const models = [
    { provider: 'Google Gemini 1.5 Pro', requests: 48200, inputTokens: '184.2M', outputTokens: '42.1M', cost: '$412.40', costPct: 32 },
    { provider: 'Google Gemini 1.5 Flash', requests: 142000, inputTokens: '492.0M', outputTokens: '89.4M', cost: '$184.10', costPct: 14 },
    { provider: 'OpenAI GPT-4o', requests: 19400, inputTokens: '72.1M', outputTokens: '21.0M', cost: '$482.00', costPct: 38 },
    { provider: 'OpenAI Vision API', requests: 8400, inputTokens: '34.0M', outputTokens: '4.8M', cost: '$206.00', costPct: 16 },
  ];

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-purple-400" />
          AI Token Consumption & Infrastructure Cost Tracker
        </h1>
        <p className="text-xs font-bold text-zinc-400 mt-1">
          Monitor token consumption, prompt caching efficiency, cost per user, and API expenditures across Gemini & OpenAI.
        </p>
      </div>

      {/* Top Cost Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#121216] border-3 border-zinc-800 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total AI Spend (MTD)</div>
          <div className="text-3xl font-display font-black text-white mt-1">$1,284.50</div>
          <div className="text-xs font-bold text-zinc-500 mt-1">Budget limit: $3,000.00</div>
        </div>

        <div className="bg-[#121216] border-3 border-zinc-800 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Avg AI Cost Per Active User</div>
          <div className="text-3xl font-display font-black text-emerald-400 mt-1">$0.103</div>
          <div className="text-xs font-bold text-zinc-500 mt-1">98.9% gross margin per pro sub</div>
        </div>

        <div className="bg-[#121216] border-3 border-zinc-800 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Tokens Processed</div>
          <div className="text-3xl font-display font-black text-purple-400 mt-1">832.4M</div>
          <div className="text-xs font-bold text-zinc-500 mt-1">218k generation requests</div>
        </div>
      </div>

      {/* Model Breakdown Table */}
      <div className="bg-[#121216] border-3 border-zinc-800 rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-5 border-b-2 border-zinc-800 bg-[#09090B] flex items-center justify-between">
          <h2 className="font-display font-black text-sm uppercase text-white tracking-wider">
            Model Cost & Volume Distribution
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-zinc-800 bg-[#09090B] text-zinc-400 font-black uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">Provider & Model</th>
                <th className="py-3.5 px-4">Requests (30d)</th>
                <th className="py-3.5 px-4">Input Tokens</th>
                <th className="py-3.5 px-4">Output Tokens</th>
                <th className="py-3.5 px-4">Total Cost</th>
                <th className="py-3.5 px-5 text-right">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-bold text-zinc-300 font-mono">
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
