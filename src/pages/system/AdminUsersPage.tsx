import React, { useState, useEffect } from 'react';
import { Shield, Plus, Key, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { AdminUser, AdminRole } from '../../types/admin';

export const AdminUsersPage: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('operations_admin');

  useEffect(() => {
    adminService.getAdmins().then(setAdmins);
  }, []);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const newAdmin: AdminUser = {
      id: `adm-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'active',
      created_at: new Date().toISOString().split('T')[0],
      last_login: 'Pending invite acceptance',
    };
    setAdmins([...admins, newAdmin]);
    setShowInviteModal(false);
    setInviteEmail('');
  };

  return (
    <div className="space-y-6 font-sans animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black uppercase text-white tracking-tight flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-[#FF7A00]" />
            Administrative Clearance & Team Directory
          </h1>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
            Manage admin users, role permissions, multi-factor security clearance, and command center access.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF7A00] hover:bg-[#e06c00] border-2 border-black text-xs font-black uppercase text-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Grant Admin Access
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {admins.map((adm) => (
          <div key={adm.id} className="bg-[#121216] border-3 border-zinc-300 dark:border-zinc-800 p-6 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/40 font-mono">
                  {adm.role.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-black uppercase text-emerald-400">
                  {adm.status}
                </span>
              </div>

              <h3 className="font-display font-black text-lg text-white capitalize">{adm.name}</h3>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 font-mono font-bold mt-0.5">{adm.email}</div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-zinc-300 dark:border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-bold">Last active: {adm.last_login}</span>
              <span className="text-[11px] font-mono text-zinc-500 font-bold">ID: {adm.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Admin Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border-4 border-zinc-300 dark:border-zinc-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="font-display font-black text-lg uppercase text-white">Grant Admin Access</h2>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-zinc-600 dark:text-zinc-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="admin@postcake.io"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 text-white text-xs font-bold rounded-xl focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-zinc-600 dark:text-zinc-400 mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as AdminRole)}
                  className="w-full px-4 py-2.5 bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-700 text-white text-xs font-bold rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="super_admin">Super Admin (Full Access)</option>
                  <option value="operations_admin">Operations Admin (Jobs & Fleet)</option>
                  <option value="content_admin">Content Admin (Blog & SEO)</option>
                  <option value="support_admin">Support Admin (CRM & Customers)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#e06c00] text-white font-black text-xs uppercase"
                >
                  Confirm & Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
