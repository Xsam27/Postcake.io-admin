export type AdminRole = 'super_admin' | 'operations_admin' | 'content_admin' | 'support_admin';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatar_url?: string;
  status: 'active' | 'disabled';
  last_login?: string;
  created_at: string;
}

export type PermissionKey =
  | 'users.read'
  | 'users.write'
  | 'users.suspend'
  | 'waitlist.read'
  | 'waitlist.write'
  | 'waitlist.invite'
  | 'jobs.read'
  | 'jobs.retry'
  | 'jobs.cancel'
  | 'blog.read'
  | 'blog.write'
  | 'blog.publish'
  | 'blog.delete'
  | 'analytics.read'
  | 'admins.read'
  | 'admins.write'
  | 'settings.read'
  | 'settings.write'
  | 'audit.read';

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  plan: 'free' | 'starter' | 'pro' | 'agency' | 'team' | 'enterprise';
  status: 'active' | 'suspended' | 'trialing' | 'cancelled';
  connected_platforms: string[];
  posts_count: number;
  last_active: string;
  signup_date: string;
  mrr_contribution: number;
  notes_count?: number;
  is_admin_override?: boolean;
  override_reason?: string;
  custom_limits?: Record<string, any>;
}

export interface EarlySignupRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  account_count?: string;
  platforms?: string[];
  status: 'pending' | 'invited' | 'active' | 'rejected';
  invite_code?: string;
  created_at: string;
}

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'retrying';
export type JobType = 'social_publish' | 'ai_generation' | 'media_processing' | 'scheduling' | 'batch_publishing' | 'email';

export interface JobAttempt {
  attempt_number: number;
  status: 'success' | 'failed';
  error_code?: string;
  error_message?: string;
  timestamp: string;
  duration_ms: number;
}

export interface OperationsJob {
  id: string;
  job_type: JobType;
  provider: string;
  user_email: string;
  user_id: string;
  status: JobStatus;
  payload: Record<string, any>;
  result?: Record<string, any>;
  error_code?: string;
  error_message?: string;
  attempts: JobAttempt[];
  created_at: string;
  scheduled_for?: string;
  started_at?: string;
  completed_at?: string;
  duration_ms?: number;
}

export interface WorkerStatus {
  id: string;
  name: string;
  status: 'online' | 'degraded' | 'offline';
  last_heartbeat: string;
  jobs_processed_24h: number;
  jobs_failed_24h: number;
  avg_latency_ms: number;
  current_load_pct: number;
}

export interface ProviderHealth {
  id: string;
  name: string;
  icon: string;
  status: 'operational' | 'degraded' | 'outage';
  latency_ms: number;
  error_rate_pct: number;
  requests_24h: number;
  success_rate_pct: number;
  last_checked: string;
  last_incident?: string;
}

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  author_name: string;
  category: string;
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  target_keyword?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  status: 'draft' | 'in_review' | 'scheduled' | 'published' | 'archived';
  scheduled_at?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  word_count?: number;
  reading_time_minutes?: number;
}

export interface AuditLogEntry {
  id: string;
  admin_user_id?: string;
  admin_email: string;
  action: string;
  target_resource: string;
  target_id?: string;
  details?: Record<string, any>;
  created_at: string;
  ip_address?: string;
}

export interface FeatureFlag {
  id: string;
  key: string;
  description: string;
  enabled: boolean;
  environment: 'production' | 'staging' | 'all';
  updated_at: string;
}

export interface PlanConfig {
  id?: string;
  plan_id: string;
  name: string;
  monthly_price_usd: number;
  annual_price_usd: number;
  razorpay_plan_id_monthly?: string | null;
  razorpay_plan_id_annual?: string | null;
  stripe_price_id_monthly?: string | null;
  stripe_price_id_annual?: string | null;
  limits: {
    social_accounts: number;
    posts_per_month: number;
    manychat_rules: number;
    dms_per_month: number;
    ai_tokens_per_month: number;
  };
  features: {
    analytics: string;
    team_seats: number;
    watermark_removal: boolean;
    priority_support: boolean;
    white_label?: boolean;
    webhooks?: boolean;
    api_access?: boolean;
    dedicated_sla?: boolean;
    custom_contracts?: boolean;
  };
  is_active: boolean;
  sort_order: number;
}

export interface CustomerPlanOverride {
  workspaceId: string;
  planTier: string;
  isAdminOverride: boolean;
  reason?: string;
  customLimits?: {
    social_accounts?: number;
    posts_per_month?: number;
    manychat_rules?: number;
    dms_per_month?: number;
    ai_tokens_per_month?: number;
  };
}
