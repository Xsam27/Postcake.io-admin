import { supabase } from '../lib/supabase';
import { AuditLogEntry } from '../types/admin';

class AuditLogger {
  private inMemoryLogs: AuditLogEntry[] = [
    {
      id: 'log-001',
      admin_email: 'mausam@postcake.io',
      action: 'SYSTEM_BOOT',
      target_resource: 'system_settings',
      details: { environment: 'production', version: '2.4.0' },
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      ip_address: '127.0.0.1',
    },
    {
      id: 'log-002',
      admin_email: 'mausam@postcake.io',
      action: 'GENERATED_PROMO_CODE',
      target_resource: 'early_signups',
      target_id: 'usr-142',
      details: { code: 'POSTCAKE-50-VIP', discount: '50% Lifetime' },
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      ip_address: '127.0.0.1',
    },
  ];

  async log(entry: Omit<AuditLogEntry, 'id' | 'created_at'>): Promise<AuditLogEntry> {
    const fullEntry: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
    };

    this.inMemoryLogs.unshift(fullEntry);
    if (this.inMemoryLogs.length > 500) this.inMemoryLogs.pop();

    try {
      await supabase.from('admin_audit_logs').insert([
        {
          admin_user_id: entry.admin_user_id,
          action: entry.action,
          target_resource: entry.target_resource,
          target_id: entry.target_id,
          details: { ...entry.details, admin_email: entry.admin_email },
          created_at: fullEntry.created_at,
        },
      ]);
    } catch (err) {
      console.warn('Supabase admin_audit_logs fallback:', err);
    }

    return fullEntry;
  }

  async getLogs(limit = 100): Promise<AuditLogEntry[]> {
    try {
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return (data as any[]).map((d: any) => ({
          id: d.id,
          admin_user_id: d.admin_user_id,
          admin_email: d.details?.admin_email || 'admin@postcake.io',
          action: d.action,
          target_resource: d.target_resource,
          target_id: d.target_id,
          details: d.details,
          created_at: d.created_at,
          ip_address: d.details?.ip_address,
        }));
      }
    } catch {}

    return this.inMemoryLogs.slice(0, limit);
  }
}

export const auditService = new AuditLogger();
