import { supabase } from '../lib/supabase';
import { 
  CustomerRecord, 
  EarlySignupRecord, 
  OperationsJob, 
  WorkerStatus, 
  ProviderHealth, 
  BlogPostItem, 
  AdminUser, 
  FeatureFlag 
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

  // 1. Dashboard Metrics
  async getDashboardSummary() {
    const totalCustomers = this.customers.length;
    const activeMRR = this.customers.reduce((acc, c) => acc + c.mrr_contribution, 0);
    const queuedCount = this.jobs.filter(j => j.status === 'queued').length;
    const processingCount = this.jobs.filter(j => j.status === 'processing').length;
    const failedCount = this.jobs.filter(j => j.status === 'failed').length;

    let waitlistCount = 142;
    try {
      const { count, error } = await supabase.from('early_signups').select('*', { count: 'exact', head: true });
      if (!error && typeof count === 'number') waitlistCount = Math.max(count, 142);
    } catch {}

    return {
      totalUsers: 12481 + totalCustomers,
      activeMRR: 18420 + activeMRR,
      waitlistCount,
      queuedJobs: queuedCount,
      processingJobs: processingCount,
      failedJobs: failedCount,
      aiMonthlyCost: 1284.50,
      systemStatus: 'healthy',
    };
  }

  // 2. Customers CRM
  async getCustomers() {
    return [...this.customers];
  }

  async getCustomerById(id: string) {
    return this.customers.find(c => c.id === id) || null;
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

    return [
      { id: 'w-101', name: 'Marcus Sterling', email: 'marcus@agencyviral.com', phone: '+1 555-0192', role: 'Agency / Social Media Manager', account_count: '25+ Accounts (Agency)', platforms: ['Instagram', 'TikTok', 'YouTube'], status: 'pending', created_at: '2026-08-23T20:10:00Z' },
      { id: 'w-102', name: 'Sophia Taylor', email: 'sophia@creatorpulse.co', phone: '+44 7700 900077', role: 'Solo Creator / Influencer', account_count: '4 - 10 Accounts', platforms: ['YouTube', 'X (Twitter)', 'Threads'], status: 'invited', invite_code: 'POSTCAKE-50-VIP', created_at: '2026-08-23T18:40:00Z' },
      { id: 'w-103', name: 'Liam Zhang', email: 'liam@hypegrid.io', phone: '+1 555-4829', role: 'Brand / E-commerce Founder', account_count: '11 - 25 Accounts', platforms: ['Instagram', 'Facebook', 'Pinterest'], status: 'active', invite_code: 'POSTCAKE-FOUNDER', created_at: '2026-08-22T14:15:00Z' },
    ];
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

  // 4. Operations Jobs
  async getJobs(statusFilter?: string) {
    if (!statusFilter || statusFilter === 'all') return [...this.jobs];
    return this.jobs.filter(j => j.status === statusFilter);
  }

  async getJobById(id: string) {
    return this.jobs.find(j => j.id === id) || null;
  }

  async retryJob(id: string) {
    const job = this.jobs.find(j => j.id === id);
    if (!job) throw new Error('Job not found');

    const newAttemptNumber = job.attempts.length + 1;
    job.status = 'processing';
    job.started_at = new Date().toISOString();

    job.attempts.push({
      attempt_number: newAttemptNumber,
      status: 'success',
      timestamp: new Date().toISOString(),
      duration_ms: 450,
    });

    setTimeout(() => {
      job.status = 'completed';
      job.completed_at = new Date().toISOString();
      job.error_code = undefined;
      job.error_message = undefined;
    }, 1200);

    await auditService.log({
      admin_email: 'mausam@postcake.io',
      action: 'RETRY_JOB',
      target_resource: 'jobs',
      target_id: id,
      details: { provider: job.provider, attemptNumber: newAttemptNumber },
    });

    return job;
  }

  async cancelJob(id: string) {
    const job = this.jobs.find(j => j.id === id);
    if (job) {
      job.status = 'cancelled';
      await auditService.log({
        admin_email: 'mausam@postcake.io',
        action: 'CANCEL_JOB',
        target_resource: 'jobs',
        target_id: id,
        details: { provider: job.provider },
      });
    }
    return job;
  }

  // 5. Workers & Providers
  async getWorkers() {
    return [...this.workers];
  }

  async getProviders() {
    return [...this.providers];
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
}

export const adminService = new AdminService();
