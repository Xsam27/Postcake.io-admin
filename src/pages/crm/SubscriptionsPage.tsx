import React, { useState } from 'react';
import { Layers, DollarSign, ArrowUpRight, TrendingUp, Users, ShieldCheck, Download } from 'lucide-react';

export const SubscriptionsPage: React.FC = () => {
  const plans = [
    { name: 'Free Tier', price: '$0', subscribers: 10420, mrr: 0, growth: '+18.4%', badge: 'Free' },
    { name: 'Pro Creator', price: '$24/mo', subscribers: 540, mrr: 12960, growth: '+24.1%', badge: 'Popular' },
    { name: 'Team / Agency', price: '$79/mo', subscribers: 62, mrr: 4898, growth: '+12.0%', badge: 'High LTV' },
    { name: 'Enterprise Custom', price: '$249/mo', subscribers: 4, mrr: 996, growth: '+33.3%', badge: 'Dedicated' },
  ];

  return (
    <div className="space-y-8 font-sans animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
          <Layers className="w-6 h-6 text-[#FFD700]" />
          Subscriptions & MRR Analytics
        </h1>
        <p className="text-xs font-bold text-zinc-400 mt-1">
          Monitor recurring revenue, plan conversion velocities, churn rates, and Stripe billing subscriptions.
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#121216] border-3 border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total MRR</div>
          <div className="text-3xl font-display font-black text-white mt-1">$18,854</div>
          <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +21.4% vs last month
          </div>
        </div>

        <div className="bg-[#121216] border-3 border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Annual Run Rate (ARR)</div>
          <div className="text-3xl font-display font-black text-[#FFD700] mt-1">$226,248</div>
          <div className="text-xs font-bold text-zinc-400 mt-1">Projected end-of-year</div>
        </div>

        <div className="bg-[#121216] border-3 border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Paid Subscriber Base</div>
          <div className="text-3xl font-display font-black text-[#8C9EFF] mt-1">606</div>
          <div className="text-xs font-bold text-emerald-400 mt-1">5.5% Paid conversion rate</div>
        </div>

        <div className="bg-[#121216] border-3 border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Churn Rate (30d)</div>
          <div className="text-3xl font-display font-black text-emerald-400 mt-1">1.8%</div>
          <div className="text-xs font-bold text-zinc-500 mt-1">Industry benchmark: 4.2%</div>
        </div>
      </div>

      {/* Plan Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p, idx) => (
          <div key={idx} className="bg-[#121216] border-3 border-zinc-800 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {p.badge}
                </span>
                <span className="text-xs font-black text-emerald-400">{p.growth}</span>
              </div>
              <h3 className="font-display font-black text-lg text-white uppercase">{p.name}</h3>
              <div className="text-2xl font-black text-[#FF7A00] mt-1">{p.price}</div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-zinc-800/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400 font-bold">Subscribers:</span>
                <span className="text-white font-black">{p.subscribers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 font-bold">MRR Contribution:</span>
                <span className="text-white font-black">${p.mrr.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
