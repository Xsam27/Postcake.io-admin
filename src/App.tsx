import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminGuard } from './auth/AdminGuard';
import { AdminLoginPage } from './pages/AdminLoginPage';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const CustomerDirectoryPage = lazy(() => import('./pages/crm/CustomerDirectoryPage').then(m => ({ default: m.CustomerDirectoryPage })));
const WaitlistPage = lazy(() => import('./pages/crm/WaitlistPage').then(m => ({ default: m.WaitlistPage })));
const SubscriptionsPage = lazy(() => import('./pages/crm/SubscriptionsPage').then(m => ({ default: m.SubscriptionsPage })));
const LiveJobsPage = lazy(() => import('./pages/operations/LiveJobsPage').then(m => ({ default: m.LiveJobsPage })));
const FailedJobsPage = lazy(() => import('./pages/operations/FailedJobsPage').then(m => ({ default: m.FailedJobsPage })));
const WorkersPage = lazy(() => import('./pages/operations/WorkersPage').then(m => ({ default: m.WorkersPage })));
const ProviderHealthPage = lazy(() => import('./pages/operations/ProviderHealthPage').then(m => ({ default: m.ProviderHealthPage })));
const BlogListPage = lazy(() => import('./pages/content/BlogListPage').then(m => ({ default: m.BlogListPage })));
const BlogEditorPage = lazy(() => import('./pages/content/BlogEditorPage').then(m => ({ default: m.BlogEditorPage })));
const MediaLibraryPage = lazy(() => import('./pages/content/MediaLibraryPage').then(m => ({ default: m.MediaLibraryPage })));
const BusinessAnalyticsPage = lazy(() => import('./pages/analytics/BusinessAnalyticsPage').then(m => ({ default: m.BusinessAnalyticsPage })));
const PlatformAnalyticsPage = lazy(() => import('./pages/analytics/PlatformAnalyticsPage').then(m => ({ default: m.PlatformAnalyticsPage })));
const AICostAnalyticsPage = lazy(() => import('./pages/analytics/AICostAnalyticsPage').then(m => ({ default: m.AICostAnalyticsPage })));
const AdminUsersPage = lazy(() => import('./pages/system/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const RolesPermissionsPage = lazy(() => import('./pages/system/RolesPermissionsPage').then(m => ({ default: m.RolesPermissionsPage })));
const AuditLogPage = lazy(() => import('./pages/system/AuditLogPage').then(m => ({ default: m.AuditLogPage })));
const SystemSettingsPage = lazy(() => import('./pages/system/SystemSettingsPage').then(m => ({ default: m.SystemSettingsPage })));

const FallbackLoader = () => (
  <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-white">
    <div className="w-8 h-8 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin" />
  </div>
);

export function App() {
  return (
    <Routes>
      {/* Public Admin Auth Route */}
      <Route path="/login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
      <Route
        path="/"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        <Route index element={<Suspense fallback={<FallbackLoader />}><AdminDashboard /></Suspense>} />
        
        {/* CRM */}
        <Route path="crm/customers" element={<Suspense fallback={<FallbackLoader />}><CustomerDirectoryPage /></Suspense>} />
        <Route path="crm/waitlist" element={<Suspense fallback={<FallbackLoader />}><WaitlistPage /></Suspense>} />
        <Route path="crm/subscriptions" element={<Suspense fallback={<FallbackLoader />}><SubscriptionsPage /></Suspense>} />

        {/* Operations */}
        <Route path="operations/jobs" element={<Suspense fallback={<FallbackLoader />}><LiveJobsPage /></Suspense>} />
        <Route path="operations/failed" element={<Suspense fallback={<FallbackLoader />}><FailedJobsPage /></Suspense>} />
        <Route path="operations/workers" element={<Suspense fallback={<FallbackLoader />}><WorkersPage /></Suspense>} />
        <Route path="operations/providers" element={<Suspense fallback={<FallbackLoader />}><ProviderHealthPage /></Suspense>} />

        {/* Content */}
        <Route path="content/blog" element={<Suspense fallback={<FallbackLoader />}><BlogListPage /></Suspense>} />
        <Route path="content/blog/new" element={<Suspense fallback={<FallbackLoader />}><BlogEditorPage /></Suspense>} />
        <Route path="content/blog/:id" element={<Suspense fallback={<FallbackLoader />}><BlogEditorPage /></Suspense>} />
        <Route path="content/media" element={<Suspense fallback={<FallbackLoader />}><MediaLibraryPage /></Suspense>} />

        {/* Analytics */}
        <Route path="analytics/business" element={<Suspense fallback={<FallbackLoader />}><BusinessAnalyticsPage /></Suspense>} />
        <Route path="analytics/platforms" element={<Suspense fallback={<FallbackLoader />}><PlatformAnalyticsPage /></Suspense>} />
        <Route path="analytics/ai" element={<Suspense fallback={<FallbackLoader />}><AICostAnalyticsPage /></Suspense>} />

        {/* System */}
        <Route path="system/admins" element={<Suspense fallback={<FallbackLoader />}><AdminUsersPage /></Suspense>} />
        <Route path="system/roles" element={<Suspense fallback={<FallbackLoader />}><RolesPermissionsPage /></Suspense>} />
        <Route path="system/audit" element={<Suspense fallback={<FallbackLoader />}><AuditLogPage /></Suspense>} />
        <Route path="system/settings" element={<Suspense fallback={<FallbackLoader />}><SystemSettingsPage /></Suspense>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
