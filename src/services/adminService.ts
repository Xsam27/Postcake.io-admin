import { supabase } from '../lib/supabase';
import { 
  CustomerRecord, 
  EarlySignupRecord, 
  OperationsJob, 
  WorkerStatus, 
  ProviderHealth, 
  BlogPostItem, 
  AdminUser, 
  FeatureFlag,
  PlanConfig,
  CustomerPlanOverride
} from '../types/admin';
import { auditService } from './auditService';

// Seed demo state for local/staging resilience
const initialCustomers: CustomerRecord[] = [
  {
    id: 'cust-101',
    name: 'Alex Morgan',
    email: 'alex@creatorhub.io',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    plan: 'pro',
    status: 'active',
    connected_platforms: ['Instagram', 'YouTube', 'TikTok', 'X (Twitter)'],
    posts_count: 342,
    last_active: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    signup_date: '2026-07-14',
    mrr_contribution: 24,
    notes_count: 2,
  },
  {
    id: 'cust-102',
    name: 'Sarah Chen',
    email: 'sarah@growthwave.agency',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    plan: 'team',
    status: 'active',
    connected_platforms: ['Instagram', 'LinkedIn', 'Facebook', 'Pinterest'],
    posts_count: 1289,
    last_active: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    signup_date: '2026-06-20',
    mrr_contribution: 79,
    notes_count: 4,
  },
  {
    id: 'cust-103',
    name: 'David Miller',
    email: 'david@solomedia.com',
    plan: 'free',
    status: 'active',
    connected_platforms: ['YouTube', 'X (Twitter)'],
    posts_count: 48,
    last_active: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    signup_date: '2026-08-01',
    mrr_contribution: 0,
    notes_count: 0,
  },
  {
    id: 'cust-104',
    name: 'Elena Rostova',
    email: 'elena@vividstudios.co',
    plan: 'enterprise',
    status: 'active',
    connected_platforms: ['Instagram', 'YouTube', 'TikTok', 'X (Twitter)', 'LinkedIn', 'Threads'],
    posts_count: 4210,
    last_active: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    signup_date: '2026-05-10',
    mrr_contribution: 249,
    notes_count: 6,
  },
  {
    id: 'cust-105',
    name: 'Marcus Vance',
    email: 'marcus@spamdrop.net',
    plan: 'free',
    status: 'suspended',
    connected_platforms: ['X (Twitter)'],
    posts_count: 12,
    last_active: '2026-08-10',
    signup_date: '2026-08-09',
    mrr_contribution: 0,
    notes_count: 1,
  },
];

const initialJobs: OperationsJob[] = [
  {
    id: 'job-9821',
    job_type: 'social_publish',
    provider: 'Instagram',
    user_email: 'sarah@growthwave.agency',
    user_id: 'cust-102',
    status: 'failed',
    payload: { caption: '🔥 Top 5 SaaS Trends for Q3 2026! Layer your stack.', media_urls: ['https://cdn.postcake.io/m/saas.png'], post_type: 'carousel' },
    error_code: 'ERR_IG_RATE_LIMIT',
    error_message: '429 Rate limit exceeded: Meta Graph API requests capped for current hour.',
    attempts: [
      { attempt_number: 1, status: 'failed', error_code: '429', error_message: 'Rate limit exceeded', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), duration_ms: 420 },
      { attempt_number: 2, status: 'failed', error_code: '429', error_message: 'Rate limit exceeded', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), duration_ms: 380 },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    scheduled_for: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    started_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'job-9822',
    job_type: 'social_publish',
    provider: 'YouTube',
    user_email: 'alex@creatorhub.io',
    user_id: 'cust-101',
    status: 'processing',
    payload: { title: 'How to Automate 7 Social Channels at Once', privacy: 'public', tags: ['social media', 'automation'] },
    attempts: [
      { attempt_number: 1, status: 'success', timestamp: new Date(Date.now() - 1000 * 30).toISOString(), duration_ms: 1200 },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    scheduled_for: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    started_at: new Date(Date.now() - 1000 * 30).toISOString(),
  },
  {
    id: 'job-9823',
    job_type: 'ai_generation',
    provider: 'Gemini',
    user_email: 'elena@vividstudios.co',
    user_id: 'cust-104',
    status: 'completed',
    payload: { prompt: 'Generate 5 high-converting viral hooks for TikTok creator', model: 'gemini-1.5-pro' },
    result: { hooks: ['The #1 secret to 10x your organic reach...', 'Why your scheduling workflow is costing you hours...'] },
    attempts: [
      { attempt_number: 1, status: 'success', timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(), duration_ms: 840 },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
    started_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    completed_at: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
    duration_ms: 840,
  },
  {
    id: 'job-9824',
    job_type: 'social_publish',
    provider: 'X (Twitter)',
    user_email: 'alex@creatorhub.io',
    user_id: 'cust-101',
    status: 'queued',
    payload: { text: 'Stacking media layers like pancakes 🥞 Scheduling 20 posts in 5 minutes with @Postcake_io' },
    attempts: [],
    created_at: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    scheduled_for: new Date(Date.now() + 1000 * 60 * 20).toISOString(),
  },
  {
    id: 'job-9825',
    job_type: 'media_processing',
    provider: 'Postcake Transcoder',
    user_email: 'sarah@growthwave.agency',
    user_id: 'cust-102',
    status: 'completed',
    payload: { file_name: 'product_launch_4k.mp4', target_formats: ['9:16_1080p', '1:1_1080p', '16:9_4k'] },
    result: { compressed_size_mb: 42.4, status: 'ready' },
    attempts: [
      { attempt_number: 1, status: 'success', timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), duration_ms: 3400 },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    completed_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    duration_ms: 3400,
  },
];

const initialWorkers: WorkerStatus[] = [
  { id: 'w-1', name: 'Publisher Worker 01 (Meta/TikTok)', status: 'online', last_heartbeat: '5s ago', jobs_processed_24h: 3840, jobs_failed_24h: 7, avg_latency_ms: 310, current_load_pct: 34 },
  { id: 'w-2', name: 'Publisher Worker 02 (YouTube/X)', status: 'online', last_heartbeat: '3s ago', jobs_processed_24h: 2910, jobs_failed_24h: 3, avg_latency_ms: 420, current_load_pct: 28 },
  { id: 'w-3', name: 'AI Dispatch Engine (Gemini/OpenAI)', status: 'online', last_heartbeat: '2s ago', jobs_processed_24h: 7420, jobs_failed_24h: 1, avg_latency_ms: 680, current_load_pct: 48 },
  { id: 'w-4', name: 'Cron Scheduler Service', status: 'online', last_heartbeat: '1s ago', jobs_processed_24h: 14200, jobs_failed_24h: 0, avg_latency_ms: 45, current_load_pct: 12 },
  { id: 'w-5', name: 'Media Transcoder & CDN Cache', status: 'degraded', last_heartbeat: '45s ago', jobs_processed_24h: 980, jobs_failed_24h: 12, avg_latency_ms: 2800, current_load_pct: 86 },
];

const initialProviders: ProviderHealth[] = [
  { id: 'p-1', name: 'Instagram & Facebook (Meta Graph API)', icon: 'instagram', status: 'operational', latency_ms: 184, error_rate_pct: 0.18, requests_24h: 14820, success_rate_pct: 99.82, last_checked: '1m ago' },
  { id: 'p-2', name: 'YouTube Data API v3', icon: 'youtube', status: 'operational', latency_ms: 240, error_rate_pct: 0.05, requests_24h: 6840, success_rate_pct: 99.95, last_checked: '1m ago' },
  { id: 'p-3', name: 'X / Twitter API v2', icon: 'twitter', status: 'operational', latency_ms: 310, error_rate_pct: 0.42, requests_24h: 9420, success_rate_pct: 99.58, last_checked: '2m ago' },
  { id: 'p-4', name: 'TikTok Content Posting API', icon: 'video', status: 'operational', latency_ms: 390, error_rate_pct: 0.65, requests_24h: 4210, success_rate_pct: 99.35, last_checked: '1m ago' },
  { id: 'p-5', name: 'Google Gemini Pro / Flash AI', icon: 'sparkles', status: 'operational', latency_ms: 540, error_rate_pct: 0.02, requests_24h: 18490, success_rate_pct: 99.98, last_checked: '30s ago' },
  { id: 'p-6', name: 'OpenAI GPT-4o / Vision API', icon: 'bot', status: 'operational', latency_ms: 680, error_rate_pct: 0.12, requests_24h: 12100, success_rate_pct: 99.88, last_checked: '30s ago' },
];

const initialAdmins: AdminUser[] = [
  { id: 'adm-1', name: 'Mausam Verma', email: 'mausam@postcake.io', role: 'super_admin', status: 'active', created_at: '2026-01-01', last_login: 'Just now' },
  { id: 'adm-2', name: 'Operations Lead', email: 'ops@postcake.io', role: 'operations_admin', status: 'active', created_at: '2026-03-15', last_login: '2 hours ago' },
  { id: 'adm-3', name: 'Content Strategist', email: 'content@postcake.io', role: 'content_admin', status: 'active', created_at: '2026-04-10', last_login: 'Yesterday' },
  { id: 'adm-4', name: 'Support Specialist', email: 'support@postcake.io', role: 'support_admin', status: 'active', created_at: '2026-05-01', last_login: '3 days ago' },
];

const initialFeatureFlags: FeatureFlag[] = [
  { id: 'ff-1', key: 'ai_smart_repurpose_v2', description: 'Enable multi-format AI smart re-purposing engine', enabled: true, environment: 'all', updated_at: '2026-08-20' },
  { id: 'ff-2', key: 'tiktok_direct_publishing', description: 'Allow 1-click direct TikTok video scheduling', enabled: true, environment: 'all', updated_at: '2026-08-15' },
  { id: 'ff-3', key: 'bluesky_integration_beta', description: 'Early beta integration for Bluesky AT Protocol', enabled: false, environment: 'staging', updated_at: '2026-08-22' },
  { id: 'ff-4', key: 'enterprise_sso_saml', description: 'Okta & Google Workspace SAML SSO login', enabled: true, environment: 'production', updated_at: '2026-07-30' },
];

class AdminService {
  private customers = [...initialCustomers];
  private jobs = [...initialJobs];
  private workers = [...initialWorkers];
  private providers = [...initialProviders];
  private admins = [...initialAdmins];
  private featureFlags = [...initialFeatureFlags];

  // 1. Dashboard Metrics (Live Backend Telemetry & Database Analytics)
  async getDashboardSummary() {
    try {
      const res = await fetch('/api/admin/metrics');
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[AdminService] Backend metrics fetch error, fallback to Supabase direct query:', err);
    }

    // Direct live Supabase query fallback
    let waitlistCount = 0;
    try {
      const { count } = await supabase.from('early_signups').select('*', { count: 'exact', head: true });
      if (typeof count === 'number') waitlistCount = count;
    } catch {}

    let queuedJobs = 0;
    let processingJobs = 0;
    let failedJobs = 0;
    try {
      const { data: pJobs } = await supabase.from('publish_jobs').select('status');
      if (Array.isArray(pJobs)) {
        queuedJobs = pJobs.filter((j: any) => j.status === 'queued').length;
        processingJobs = pJobs.filter((j: any) => j.status === 'processing').length;
        failedJobs = pJobs.filter((j: any) => j.status === 'failed' || j.status === 'reconciliation_required').length;
      }
    } catch {}

    let totalUsers = 1;
    let activeMRR = 0;
    try {
      const { data: ws } = await supabase.from('workspaces').select('plan_tier, subscription_status');
      if (Array.isArray(ws) && ws.length > 0) {
        totalUsers = ws.length;
        activeMRR = ws.reduce((acc: number, w: any) => {
          if (w.subscription_status === 'active') {
            const tier = (w.plan_tier || 'starter').toLowerCase();
            if (tier === 'pro') return acc + 29;
            if (tier === 'team') return acc + 79;
            if (tier === 'enterprise') return acc + 249;
          }
          return acc;
        }, 0);
      }
    } catch {}

    return {
      totalUsers,
      activeMRR,
      waitlistCount,
      queuedJobs,
      processingJobs,
      failedJobs,
      aiMonthlyCost: 0,
      systemStatus: 'healthy',
    };
  }

  // 2. Customers CRM (Live Workspaces & Users)
  async getCustomers(): Promise<CustomerRecord[]> {
    try {
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[AdminService] Customers fetch fallback:', err);
    }

    try {
      const { data: workspaces } = await supabase.from('workspaces').select('*').limit(50);
      if (Array.isArray(workspaces) && workspaces.length > 0) {
        return workspaces.map((w: any) => ({
          id: w.id,
          name: w.name || `Workspace ${w.id.substring(0, 6)}`,
          email: `workspace-${w.id.substring(0, 6)}@postcake.io`,
          plan: w.plan_tier || 'starter',
          status: 'active',
          connected_platforms: [],
          posts_count: 0,
          last_active: w.updated_at || new Date().toISOString(),
          signup_date: w.created_at ? w.created_at.split('T')[0] : '2026-09-01',
          mrr_contribution: (w.plan_tier === 'pro' ? 29 : w.plan_tier === 'team' ? 79 : w.plan_tier === 'enterprise' ? 249 : 0),
          notes_count: 0,
        }));
      }
    } catch {}

    return [
      {
        id: 'admin-mausam',
        name: 'Mausam Verma',
        email: 'mausam@postcake.io',
        plan: 'enterprise',
        status: 'active',
        connected_platforms: ['Instagram', 'YouTube', 'TikTok', 'X (Twitter)', 'LinkedIn'],
        posts_count: 0,
        last_active: new Date().toISOString(),
        signup_date: '2026-09-10',
        mrr_contribution: 0,
        notes_count: 1,
      }
    ];
  }

  async getCustomerById(id: string) {
    const customers = await this.getCustomers();
    return customers.find(c => c.id === id) || null;
  }

  async updateCustomerStatus(id: string, status: CustomerRecord['status'], reason?: string) {
    const cust = this.customers.find(c => c.id === id);
    if (cust) {
      cust.status = status;
      await auditService.log({
        admin_email: 'mausam@postcake.io',
        action: `CUSTOMER_${status.toUpperCase()}`,
        target_resource: 'customers',
        target_id: id,
        details: { email: cust.email, reason },
      });
    }
    return cust;
  }

  // 3. Early Access & Waitlist
  async getWaitlist(): Promise<EarlySignupRecord[]> {
    try {
      const { data, error } = await supabase.from('early_signups').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return (data as any[]).map((d: any) => ({
          id: d.id,
          name: d.name,
          email: d.email,
          phone: d.phone,
          role: d.role,
          account_count: d.account_count,
          platforms: d.platforms || [],
          status: d.status || 'pending',
          invite_code: d.invite_code,
          created_at: d.created_at,
        }));
      }
    } catch {}

    return [];
  }

  async updateWaitlistStatus(id: string, status: EarlySignupRecord['status'], inviteCode = 'POSTCAKE-50-VIP') {
    try {
      await supabase.from('early_signups').update({ status, invite_code: inviteCode }).eq('id', id);
    } catch {}

    await auditService.log({
      admin_email: 'mausam@postcake.io',
      action: `WAITLIST_${status.toUpperCase()}`,
      target_resource: 'early_signups',
      target_id: id,
      details: { status, inviteCode },
    });
    return true;
  }

  // 4. Operations Jobs (Live Queue from publish_jobs)
  async getJobs(statusFilter?: string): Promise<OperationsJob[]> {
    try {
      const res = await fetch(`/api/admin/jobs?status=${encodeURIComponent(statusFilter || 'all')}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[AdminService] Jobs fetch fallback:', err);
    }

    try {
      let query = supabase.from('publish_jobs').select('*').order('created_at', { ascending: false }).limit(50);
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        return data.map((j: any) => ({
          id: j.id,
          job_type: 'social_publish',
          provider: j.platform || 'General',
          user_email: j.locked_by || 'system_worker',
          user_id: j.post_id,
          status: j.status,
          payload: { caption: `Job ${j.id}` },
          error_code: j.last_error_code,
          error_message: j.last_error_message,
          attempts: [],
          created_at: j.created_at,
          scheduled_for: j.scheduled_for,
          started_at: j.locked_at,
          completed_at: j.status === 'completed' ? j.updated_at : undefined,
        }));
      }
    } catch {}

    return [];
  }

  async getJobById(id: string) {
    const jobs = await this.getJobs();
    return jobs.find(j => j.id === id) || null;
  }

  async retryJob(id: string) {
    try {
      await supabase.from('publish_jobs').update({
        status: 'queued',
        locked_by: null,
        locked_at: null,
        scheduled_for: new Date().toISOString()
      }).eq('id', id);
    } catch {}

    await auditService.log({
      admin_email: 'mausam@postcake.io',
      action: 'RETRY_JOB',
      target_resource: 'jobs',
      target_id: id,
      details: { jobId: id },
    });

    return { id, status: 'queued' };
  }

  async cancelJob(id: string) {
    try {
      await supabase.from('publish_jobs').update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      }).eq('id', id);
    } catch {}

    await auditService.log({
      admin_email: 'mausam@postcake.io',
      action: 'CANCEL_JOB',
      target_resource: 'jobs',
      target_id: id,
      details: { jobId: id },
    });
    return { id, status: 'cancelled' };
  }

  // 5. Workers & Providers Telemetry
  async getWorkers(): Promise<WorkerStatus[]> {
    try {
      const res = await fetch('/api/admin/workers');
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    // Fallback: ping health readiness
    let isHealthy = true;
    try {
      const hRes = await fetch('/health/readiness');
      if (hRes.ok) {
        const hData = await hRes.json();
        isHealthy = hData.status === 'ready';
      }
    } catch {}

    return [
      {
        id: 'worker-01',
        name: 'Publisher Daemon 01 (Postgres SKIP LOCKED)',
        status: isHealthy ? 'online' : 'offline',
        last_heartbeat: 'Just now',
        jobs_processed_24h: 0,
        jobs_failed_24h: 0,
        avg_latency_ms: 120,
        current_load_pct: 12,
      },
      {
        id: 'worker-02',
        name: 'Cron Scheduler Service (Bounded 60s Poller)',
        status: 'online',
        last_heartbeat: 'Just now',
        jobs_processed_24h: 0,
        jobs_failed_24h: 0,
        avg_latency_ms: 45,
        current_load_pct: 4,
      }
    ];
  }

  async getProviders(): Promise<ProviderHealth[]> {
    try {
      const res = await fetch('/api/admin/providers');
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    return [
      { id: 'p-1', name: 'Instagram & Facebook (Meta Graph API)', icon: 'instagram', status: 'operational', latency_ms: 95, error_rate_pct: 0.0, requests_24h: 0, success_rate_pct: 100, last_checked: 'Just now' },
      { id: 'p-2', name: 'YouTube Data API v3', icon: 'youtube', status: 'operational', latency_ms: 140, error_rate_pct: 0.0, requests_24h: 0, success_rate_pct: 100, last_checked: 'Just now' },
      { id: 'p-3', name: 'X / Twitter API v2', icon: 'twitter', status: 'operational', latency_ms: 85, error_rate_pct: 0.0, requests_24h: 0, success_rate_pct: 100, last_checked: 'Just now' },
      { id: 'p-4', name: 'TikTok Content Posting API', icon: 'video', status: 'operational', latency_ms: 125, error_rate_pct: 0.0, requests_24h: 0, success_rate_pct: 100, last_checked: 'Just now' },
      { id: 'p-5', name: 'Google Gemini Pro / Flash AI', icon: 'sparkles', status: 'operational', latency_ms: 380, error_rate_pct: 0.0, requests_24h: 0, success_rate_pct: 100, last_checked: 'Just now' },
      { id: 'p-6', name: 'OpenAI GPT-4o / Vision API', icon: 'bot', status: 'operational', latency_ms: 480, error_rate_pct: 0.0, requests_24h: 0, success_rate_pct: 100, last_checked: 'Just now' },
    ];
  }

  // 6. Blog CMS
  async getBlogPosts(): Promise<BlogPostItem[]> {
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return (data as any[]).map((d: any) => ({
          id: d.id,
          title: d.title,
          slug: d.slug,
          content: d.content,
          excerpt: d.excerpt,
          cover_image: d.cover_image,
          author_name: d.author_name || 'Postcake Team',
          category: d.category || 'Social Strategy',
          tags: d.tags || [],
          seo_title: d.seo_title,
          seo_description: d.seo_description,
          canonical_url: d.canonical_url,
          target_keyword: d.target_keyword,
          og_title: d.og_title,
          og_description: d.og_description,
          og_image: d.og_image,
          status: d.status || 'draft',
          scheduled_at: d.scheduled_at,
          published_at: d.published_at,
          created_at: d.created_at,
          updated_at: d.updated_at,
          word_count: d.content ? d.content.split(/\s+/).length : 0,
          reading_time_minutes: Math.ceil((d.content ? d.content.split(/\s+/).length : 0) / 200),
        }));
      }
    } catch {}

    return [
      {
        id: 'post-1',
        title: 'Multi-Channel Scheduling Architecture: The Layered Canvas Approach',
        slug: 'multi-channel-scheduling-architecture',
        content: '# Multi-Channel Scheduling Architecture\n\nScheduling across 7+ social media networks requires resilient dispatch pipelines...',
        excerpt: 'How Postcake builds high-concurrency dispatching across Meta, YouTube, TikTok, and X.',
        cover_image: '/hero-2.png',
        author_name: 'Postcake Engineering',
        category: 'Architecture',
        tags: ['Engineering', 'Social Media', 'Scaling'],
        seo_title: 'Multi-Channel Scheduling Architecture — Postcake Blog',
        seo_description: 'Discover how Postcake schedules and dispatches social posts with zero rate-limit drops.',
        status: 'published',
        published_at: '2026-08-20T10:00:00Z',
        created_at: '2026-08-18T12:00:00Z',
        updated_at: '2026-08-20T10:00:00Z',
        word_count: 1420,
        reading_time_minutes: 7,
      },
      {
        id: 'post-2',
        title: 'The 2026 Creator Playbook: Automating Content Repurposing',
        slug: '2026-creator-playbook-content-repurposing',
        content: '# The 2026 Creator Playbook\n\nTransforming 1 long-form YouTube video into 10 Shorts, Tweets, and Reels seamlessly...',
        excerpt: 'Step-by-step blueprint to 10x your content output without spending 40 hours a week editing.',
        cover_image: '/hero-3.png',
        author_name: 'Sarah Content',
        category: 'Growth & Strategy',
        tags: ['Creators', 'Automation', 'TikTok'],
        seo_title: 'The 2026 Creator Playbook: Automating Content Repurposing',
        seo_description: 'Complete guide for creators and agencies to automate social repurposing.',
        status: 'published',
        published_at: '2026-08-15T09:00:00Z',
        created_at: '2026-08-14T15:30:00Z',
        updated_at: '2026-08-15T09:00:00Z',
        word_count: 1850,
        reading_time_minutes: 9,
      },
    ];
  }

  async saveBlogPost(post: Partial<BlogPostItem>) {
    const id = post.id || `post-${Date.now()}`;
    const wordCount = post.content ? post.content.split(/\s+/).length : 0;
    const fullPost: BlogPostItem = {
      id,
      title: post.title || 'Untitled Article',
      slug: post.slug || `post-${Date.now()}`,
      content: post.content || '',
      excerpt: post.excerpt || '',
      cover_image: post.cover_image || '/hero-2.png',
      author_name: post.author_name || 'Postcake Team',
      category: post.category || 'Social Strategy',
      tags: post.tags || ['Social Media'],
      seo_title: post.seo_title || post.title,
      seo_description: post.seo_description || post.excerpt,
      canonical_url: post.canonical_url || `https://www.postcake.io/blog/${post.slug}`,
      target_keyword: post.target_keyword,
      og_title: post.og_title || post.title,
      og_description: post.og_description || post.excerpt,
      og_image: post.og_image || post.cover_image,
      status: post.status || 'draft',
      scheduled_at: post.scheduled_at,
      published_at: post.status === 'published' ? (post.published_at || new Date().toISOString()) : undefined,
      created_at: post.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      word_count: wordCount,
      reading_time_minutes: Math.ceil(wordCount / 200),
    };

    try {
      await supabase.from('blog_posts').upsert([
        {
          id: fullPost.id,
          title: fullPost.title,
          slug: fullPost.slug,
          content: fullPost.content,
          excerpt: fullPost.excerpt,
          cover_image: fullPost.cover_image,
          author_name: fullPost.author_name,
          category: fullPost.category,
          tags: fullPost.tags,
          seo_title: fullPost.seo_title,
          seo_description: fullPost.seo_description,
          canonical_url: fullPost.canonical_url,
          target_keyword: fullPost.target_keyword,
          og_title: fullPost.og_title,
          og_description: fullPost.og_description,
          og_image: fullPost.og_image,
          status: fullPost.status,
          scheduled_at: fullPost.scheduled_at,
          published_at: fullPost.published_at,
          updated_at: fullPost.updated_at,
        }
      ]);
    } catch {}

    await auditService.log({
      admin_email: 'mausam@postcake.io',
      action: post.id ? 'UPDATE_BLOG_POST' : 'CREATE_BLOG_POST',
      target_resource: 'blog_posts',
      target_id: fullPost.id,
      details: { title: fullPost.title, slug: fullPost.slug, status: fullPost.status },
    });

    return fullPost;
  }

  // 7. System Admins & Settings
  async getAdmins() {
    return [...this.admins];
  }

  async getFeatureFlags() {
    return [...this.featureFlags];
  }

  async toggleFeatureFlag(id: string, enabled: boolean) {
    const flag = this.featureFlags.find(f => f.id === id);
    if (flag) {
      flag.enabled = enabled;
      flag.updated_at = new Date().toISOString();
      await auditService.log({
        admin_email: 'mausam@postcake.io',
        action: enabled ? 'ENABLE_FEATURE_FLAG' : 'DISABLE_FEATURE_FLAG',
        target_resource: 'feature_flags',
        target_id: id,
        details: { key: flag.key, enabled },
      });
    }
    return flag;
  }

  // 8. Plan Configurations & Quota Control (Postcake Billing Engine)
  async getPlanConfigs(): Promise<PlanConfig[]> {
    try {
      const { data, error } = await supabase
        .from('plan_configs')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data as PlanConfig[];
      }
    } catch (err: any) {
      console.warn('[AdminService] plan_configs query fallback:', err.message);
    }

    // Default seeded fallback if remote schema is empty
    return [
      {
        plan_id: 'free',
        name: 'Free Forever',
        monthly_price_usd: 0,
        annual_price_usd: 0,
        limits: { social_accounts: 2, posts_per_month: 10, manychat_rules: 1, dms_per_month: 50, ai_tokens_per_month: 5000 },
        features: { analytics: 'basic', team_seats: 1, watermark_removal: false, priority_support: false },
        is_active: true,
        sort_order: 1
      },
      {
        plan_id: 'starter',
        name: 'Starter Workspace',
        monthly_price_usd: 29,
        annual_price_usd: 276,
        limits: { social_accounts: 5, posts_per_month: 60, manychat_rules: 5, dms_per_month: 500, ai_tokens_per_month: 50000 },
        features: { analytics: 'standard', team_seats: 2, watermark_removal: true, priority_support: false },
        is_active: true,
        sort_order: 2
      },
      {
        plan_id: 'pro',
        name: 'Pro Creator',
        monthly_price_usd: 79,
        annual_price_usd: 756,
        limits: { social_accounts: 15, posts_per_month: 300, manychat_rules: 25, dms_per_month: 5000, ai_tokens_per_month: 500000 },
        features: { analytics: 'advanced', team_seats: 5, watermark_removal: true, priority_support: true, webhooks: true },
        is_active: true,
        sort_order: 3
      },
      {
        plan_id: 'agency',
        name: 'Growth Agency',
        monthly_price_usd: 199,
        annual_price_usd: 1908,
        limits: { social_accounts: 50, posts_per_month: 2000, manychat_rules: 100, dms_per_month: 25000, ai_tokens_per_month: 2500000 },
        features: { analytics: 'custom_reports', team_seats: 25, watermark_removal: true, priority_support: true, white_label: true, api_access: true },
        is_active: true,
        sort_order: 4
      },
      {
        plan_id: 'enterprise',
        name: 'Enterprise Custom',
        monthly_price_usd: 999,
        annual_price_usd: 9990,
        limits: { social_accounts: 500, posts_per_month: 100000, manychat_rules: 1000, dms_per_month: 1000000, ai_tokens_per_month: 50000000 },
        features: { analytics: 'enterprise_bi', team_seats: 999, watermark_removal: true, priority_support: true, white_label: true, dedicated_sla: true, custom_contracts: true },
        is_active: true,
        sort_order: 5
      }
    ];
  }

  async updatePlanConfig(planId: string, updates: Partial<PlanConfig>) {
    try {
      const { error } = await supabase
        .from('plan_configs')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('plan_id', planId);

      if (error) throw error;
    } catch (err: any) {
      console.warn('[AdminService] Supabase plan_configs update fallback:', err.message);
    }

    await auditService.log({
      admin_email: 'mausam@postcake.io',
      action: 'UPDATE_PLAN_CONFIG',
      target_resource: 'plan_configs',
      target_id: planId,
      details: updates,
    });

    return updates;
  }

  async overrideCustomerPlan(override: CustomerPlanOverride) {
    const { workspaceId, planTier, isAdminOverride, reason, customLimits } = override;

    try {
      // 1. Update subscriptions table
      await supabase
        .from('subscriptions')
        .upsert({
          workspace_id: workspaceId,
          plan_tier: planTier,
          admin_override: isAdminOverride,
          override_reason: reason || null,
          custom_limits: customLimits || null,
          status: 'active',
          updated_at: new Date().toISOString()
        }, { onConflict: 'workspace_id' });

      // 2. Sync workspace table plan_tier
      await supabase
        .from('workspaces')
        .update({
          plan_tier: planTier,
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', workspaceId);
    } catch (err: any) {
      console.warn('[AdminService] Customer override DB error:', err.message);
    }

    await auditService.log({
      admin_email: 'mausam@postcake.io',
      action: 'OVERRIDE_CUSTOMER_PLAN',
      target_resource: 'subscriptions',
      target_id: workspaceId,
      details: { planTier, isAdminOverride, reason, customLimits },
    });

    return true;
  }

  async getSubscriptionsSummary() {
    let totalMRR = 0;
    let totalPaidSubscribers = 0;
    let planBreakdown: Record<string, { count: number; mrr: number }> = {
      free: { count: 0, mrr: 0 },
      starter: { count: 0, mrr: 0 },
      pro: { count: 0, mrr: 0 },
      agency: { count: 0, mrr: 0 },
      enterprise: { count: 0, mrr: 0 }
    };

    try {
      const { data: workspaces } = await supabase
        .from('workspaces')
        .select('plan_tier, subscription_status');

      if (Array.isArray(workspaces)) {
        workspaces.forEach((w: any) => {
          let tier = (w.plan_tier || 'free').toLowerCase();
          if (tier === 'team') tier = 'agency';

          if (!planBreakdown[tier]) {
            planBreakdown[tier] = { count: 0, mrr: 0 };
          }
          planBreakdown[tier].count++;

          if (w.subscription_status === 'active' && tier !== 'free') {
            totalPaidSubscribers++;
            const price = tier === 'starter' ? 29 : tier === 'pro' ? 79 : tier === 'agency' ? 199 : tier === 'enterprise' ? 999 : 0;
            planBreakdown[tier].mrr += price;
            totalMRR += price;
          }
        });
      }
    } catch (err: any) {
      console.warn('[AdminService] Subscriptions summary calculation fallback:', err.message);
    }

    return {
      totalMRR,
      totalARR: totalMRR * 12,
      totalPaidSubscribers,
      churnRate: 1.4,
      planBreakdown
    };
  }
}

export const adminService = new AdminService();
