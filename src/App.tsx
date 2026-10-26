import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';

// Public & Auth Pages
import { CinematicLanding } from './pages/public/CinematicLanding';
import { HomePage } from './pages/public/HomePage';
import { LoginPage } from './pages/auth/LoginPage';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { ProjectOverviewPage } from './pages/customer/ProjectOverviewPage';
import { HousePlanPage } from './pages/customer/HousePlanPage';
import { ProgressPage } from './pages/customer/ProgressPage';
import { SiteGalleryPage } from './pages/customer/SiteGalleryPage';
import { InspectionsPage } from './pages/customer/InspectionsPage';
import { InspectionReportPage } from './pages/customer/InspectionReportPage';
import { BudgetPage } from './pages/customer/BudgetPage';
import { IssuesPage } from './pages/customer/IssuesPage';
import { ContractorsPage } from './pages/customer/ContractorsPage';
import { ContractorDetailPage } from './pages/customer/ContractorDetailPage';
import { NotificationsPage } from './pages/customer/NotificationsPage';
import { SettingsPage } from './pages/customer/SettingsPage';

// Contractor Pages
import { ContractorDashboard } from './pages/contractor/ContractorDashboard';
import { ContractorProjectsPage } from './pages/contractor/ContractorProjectsPage';
import { ContractorProjectDetailPage } from './pages/contractor/ContractorProjectDetailPage';
import { WorkUpdatesPage } from './pages/contractor/WorkUpdatesPage';
import { ContractorInspectionsPage } from './pages/contractor/ContractorInspectionsPage';
import { ContractorIssuesPage } from './pages/contractor/ContractorIssuesPage';
import { OpportunitiesPage } from './pages/contractor/OpportunitiesPage';
import { ContractorProfilePage } from './pages/contractor/ContractorProfilePage';
import { RatingsPage } from './pages/contractor/RatingsPage';
import { ContractorNotificationsPage } from './pages/contractor/ContractorNotificationsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminContractorsPage } from './pages/admin/AdminContractorsPage';
import { AdminInspectorsPage } from './pages/admin/AdminInspectorsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminVerificationPage } from './pages/admin/AdminVerificationPage';
import { AdminDisputesPage } from './pages/admin/AdminDisputesPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Public Website */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/overview" element={<HomePage />} />
          </Route>

          {/* 3D Cinematic Experience */}
          <Route path="/experience" element={<CinematicLanding />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />

          {/* Customer Workspace */}
          <Route path="/customer" element={<AppLayout />}>
            <Route index element={<Navigate to="/customer/dashboard" replace />} />
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="project" element={<ProjectOverviewPage />} />
            <Route path="house-plan" element={<HousePlanPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="site-gallery" element={<SiteGalleryPage />} />
            <Route path="inspections" element={<InspectionsPage />} />
            <Route path="inspections/:id" element={<InspectionReportPage />} />
            <Route path="budget" element={<BudgetPage />} />
            <Route path="issues" element={<IssuesPage />} />
            <Route path="contractors" element={<ContractorsPage />} />
            <Route path="contractors/:id" element={<ContractorDetailPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Contractor Workspace */}
          <Route path="/contractor" element={<AppLayout />}>
            <Route index element={<Navigate to="/contractor/dashboard" replace />} />
            <Route path="dashboard" element={<ContractorDashboard />} />
            <Route path="projects" element={<ContractorProjectsPage />} />
            <Route path="projects/:id" element={<ContractorProjectDetailPage />} />
            <Route path="work-updates" element={<WorkUpdatesPage />} />
            <Route path="inspections" element={<ContractorInspectionsPage />} />
            <Route path="issues" element={<ContractorIssuesPage />} />
            <Route path="opportunities" element={<OpportunitiesPage />} />
            <Route path="profile" element={<ContractorProfilePage />} />
            <Route path="ratings" element={<RatingsPage />} />
            <Route path="notifications" element={<ContractorNotificationsPage />} />
          </Route>

          {/* Admin / Operations Workspace */}
          <Route path="/admin" element={<AppLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="contractors" element={<AdminContractorsPage />} />
            <Route path="inspectors" element={<AdminInspectorsPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="verification" element={<AdminVerificationPage />} />
            <Route path="disputes" element={<AdminDisputesPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
