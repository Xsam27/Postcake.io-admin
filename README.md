# 🥞 Postcake Admin Backoffice & CRM Command Center

The dedicated administrative and operations platform for Postcake (`admin.postcake.io`).

---

## 🚀 Features

- **Command Center Dashboard**: Live fleet health, real-time KPI metrics (MRR, Queue, Failures, AI Spend).
- **Customer CRM**: High-density table with search, tier filtering, and deep-dive customer dossiers.
- **Early Access / Waitlist**: Review applications, batch invite users with `POSTCAKE-50-VIP` codes, and CSV export.
- **Subscriptions & MRR**: Monitor plan conversion, revenue growth, and churn rate metrics.
- **Live Dispatch Queue**: Real-time queue inspector with formatted JSON viewer and protected retry.
- **Failed Job Triage**: Group error clusters (429 Rate Limit, Token Expired) for 1-click batch retries.
- **Worker & Provider Health**: Live status, latency, and uptime telemetry for Meta, YouTube, X, TikTok, OpenAI, and Gemini.
- **Blog & SEO Content Studio**: Markdown editor with live Google SERP snippet and OpenGraph social previews.
- **Media Library**: Supabase Storage asset management with 1-click URL copying.
- **AI Cost Tracker**: Monitor OpenAI vs Gemini token consumption and per-user economics ($0.10/user).
- **System & Security**: Admin team management, granular RBAC permission matrix, immutable audit log, and feature flags.
- **Global Command Palette (`Cmd/Ctrl + K`)**: Instant keyboard search across all tools, customers, jobs, and settings.

---

## 🛠️ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Start local development server
npm run dev

# 4. Build for production
npm run build
```
