import React from 'react';
import { Key, Check, X, Shield } from 'lucide-react';

export const RolesPermissionsPage: React.FC = () => {
  const permissions = [
    { key: 'users.read', label: 'View Customers & Profiles', super: true, ops: true, content: false, support: true },
    { key: 'users.write', label: 'Edit Customer Tiers & Status', super: true, ops: false, content: false, support: false },
    { key: 'users.suspend', label: 'Suspend / Ban Accounts', super: true, ops: false, content: false, support: false },
    { key: 'waitlist.invite', label: 'Batch Invite Early Access', super: true, ops: true, content: false, support: false },
    { key: 'jobs.read', label: 'View Queue & Logs', super: true, ops: true, content: false, support: false },
    { key: 'jobs.retry', label: 'Execute Protected Job Retry', super: true, ops: true, content: false, support: false },
    { key: 'jobs.cancel', label: 'Cancel Background Queue Job', super: true, ops: true, content: false, support: false },
    { key: 'blog.write', label: 'Create & Edit SEO Articles', super: true, ops: false, content: true, support: false },
    { key: 'blog.publish', label: 'Publish Blog Content Live', super: true, ops: false, content: true, support: false },
    { key: 'analytics.read', label: 'View Financial & AI Costs', super: true, ops: true, content: false, support: false },
    { key: 'admins.write', label: 'Manage Admin Clearance', super: true, ops: false, content: false, support: false },
    { key: 'settings.write', label: 'Toggle Feature Flags', super: true, ops: false, content: false, support: false },
    { key: 'audit.read', label: 'Inspect Audit Activity Logs', super: true, ops: true, content: true, support: true },
  ];

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
          <Key className="w-6 h-6 text-[#FFD700]" />
          Role-Based Access Control (RBAC) Matrix
        </h1>
        <p className="text-xs font-bold text-zinc-400 mt-1">
          Granular permission matrix enforced across frontend navigation, API edge functions, and Supabase RLS policies.
        </p>
      </div>

      <div className="bg-[#121216] border-3 border-zinc-800 rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-zinc-800 bg-[#09090B] text-zinc-400 font-black uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5">Permission Scope</th>
                <th className="py-3.5 px-4 text-center">Super Admin</th>
                <th className="py-3.5 px-4 text-center">Operations</th>
                <th className="py-3.5 px-4 text-center">Content</th>
                <th className="py-3.5 px-4 text-center">Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-bold text-zinc-300">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-black text-white">{p.label}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{p.key}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center">{p.super ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-zinc-600 mx-auto" />}</td>
                  <td className="py-3.5 px-4 text-center">{p.ops ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-zinc-600 mx-auto" />}</td>
                  <td className="py-3.5 px-4 text-center">{p.content ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-zinc-600 mx-auto" />}</td>
                  <td className="py-3.5 px-4 text-center">{p.support ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-zinc-600 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
