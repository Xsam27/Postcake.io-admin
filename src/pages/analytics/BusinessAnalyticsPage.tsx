import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, ArrowUpRight, Award } from 'lucide-react';

export const BusinessAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8 font-sans animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-[#8C9EFF]" />
          Executive Business & Growth Analytics
        </h1>
        <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
          Track Net MRR movements, customer acquisition velocities, cohort retention, and lifetime value metrics.
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Net New MRR (30d)</div>
          <div className="text-3xl font-display font-black text-emerald-400 mt-1">+$3,420</div>
          <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">+18.5% Growth rate</div>
        </div>

        <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Customer Lifetime Value (LTV)</div>
          <div className="text-3xl font-display font-black text-white mt-1">$482</div>
          <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">Based on 20.4 mo avg retention</div>
        </div>

        <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Customer Acq. Cost (CAC)</div>
          <div className="text-3xl font-display font-black text-[#FFD700] mt-1">$42</div>
          <div className="text-xs font-bold text-emerald-400 mt-1">LTV:CAC ratio of 11.4x</div>
        </div>

        <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-5 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Gross Margin</div>
          <div className="text-3xl font-display font-black text-purple-400 mt-1">87.4%</div>
          <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">After infra & AI costs</div>
        </div>
      </div>

      {/* Cohort & Conversion Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-display font-black text-base uppercase text-white mb-4">
            Signup to Paid Conversion Funnel
          </h2>
          <div className="space-y-4 text-xs font-bold">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-600 dark:text-zinc-400">Landing Page Visitors:</span>
                <span className="text-white font-mono">142,000 (100%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-zinc-900 border border-zinc-300 dark:border-zinc-700 overflow-hidden">
                <div className="h-full bg-[#8C9EFF] w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-600 dark:text-zinc-400">Waitlist / Registrations:</span>
                <span className="text-white font-mono">12,481 (8.8%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-zinc-900 border border-zinc-300 dark:border-zinc-700 overflow-hidden">
                <div className="h-full bg-[#FF7A00] w-[35%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-600 dark:text-zinc-400">Activated Paid Subscribers:</span>
                <span className="text-white font-mono">606 (4.8% of signups)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-zinc-900 border border-zinc-300 dark:border-zinc-700 overflow-hidden">
                <div className="h-full bg-emerald-400 w-[18%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-display font-black text-base uppercase text-white mb-4">
            Top Referral & Acquisition Channels
          </h2>
          <div className="space-y-3 text-xs font-bold">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex justify-between">
              <span className="text-white">Direct / Viral Organic (X & YouTube)</span>
              <span className="text-[#FF7A00] font-mono font-black">54.2%</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex justify-between">
              <span className="text-white">SEO Guides & Blog Articles</span>
              <span className="text-[#8C9EFF] font-mono font-black">28.4%</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-300 dark:border-zinc-800 flex justify-between">
              <span className="text-white">VIP Waitlist Referral Share Program</span>
              <span className="text-emerald-400 font-mono font-black">17.4%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
