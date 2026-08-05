import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MaintenanceBanner } from './components/layout/MaintenanceBanner';
import { LandingPage } from './pages/LandingPage';
import { ToolPage } from './pages/ToolPage';

import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { AccountPage } from './pages/auth/AccountPage';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminUserDetail } from './pages/admin/AdminUserDetail';
import { AdminPlans } from './pages/admin/AdminPlans';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminAuditLog } from './pages/admin/AdminAuditLog';
import { AdminSettings } from './pages/admin/AdminSettings';

import { PokeBackground } from './components/common/PokeBackground';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <PokeBackground />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <MaintenanceBanner />
        <Navbar />
        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tools/:toolId" element={<ToolPage />} />

            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/account" element={<AccountPage />} />

            {/* Admin Panel Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id" element={<AdminUserDetail />} />
            <Route path="/admin/plans" element={<AdminPlans />} />
            <Route path="/admin/usage-analytics" element={<AdminAnalytics />} />
            <Route path="/admin/audit-log" element={<AdminAuditLog />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
