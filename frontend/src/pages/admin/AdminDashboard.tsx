import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { KpiData } from '@shared/types';
import { authClient } from '../../lib/auth-client';
import { API_BASE_URL } from '../../lib/api-base';
import { Users, BarChart3, Shield, Sliders, FileText, Activity, AlertCircle, ArrowUpRight } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/analytics/kpis`, {
      headers: authClient.getAuthHeader()
    })
      .then(res => res.json())
      .then(data => setKpis(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0 80px' }}>
      {/* Dashboard Title */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '6px' }}>
          Admin Dashboard 👑
        </h1>
        <p style={{ color: 'var(--color-ink-500)', fontSize: '15px' }}>
          Overview of platform KPIs, user activity, usage statistics, and system settings
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            border: '1.5px solid var(--color-border)',
            padding: '24px',
            boxShadow: 'var(--shadow-card-default)'
          }}
        >
          <div style={{ color: 'var(--color-ink-500)', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
            Total Registered Users
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-primary)' }}>
            {kpis?.totalUsers || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-ink-500)', marginTop: '4px' }}>
            {kpis?.activeUsers30d || 0} active (30d)
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            border: '1.5px solid var(--color-border)',
            padding: '24px',
            boxShadow: 'var(--shadow-card-default)'
          }}
        >
          <div style={{ color: 'var(--color-ink-500)', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
            Conversions Today
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--accent-word)' }}>
            {kpis?.totalConversionsToday || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-ink-500)', marginTop: '4px' }}>
            {kpis?.totalConversionsThisMonth || 0} this month
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            border: '1.5px solid var(--color-border)',
            padding: '24px',
            boxShadow: 'var(--shadow-card-default)'
          }}
        >
          <div style={{ color: 'var(--color-ink-500)', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
            Failure Rate
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: kpis?.failureRatePercent! > 5 ? 'var(--color-error)' : 'var(--color-success)' }}>
            {kpis?.failureRatePercent || 0}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-ink-500)', marginTop: '4px' }}>
            High-fidelity execution
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            border: '1.5px solid var(--color-border)',
            padding: '24px',
            boxShadow: 'var(--shadow-card-default)'
          }}
        >
          <div style={{ color: 'var(--color-ink-500)', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
            Job Queue Depth
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--accent-security)' }}>
            {kpis?.currentJobQueueDepth || 0}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-success)', marginTop: '4px', fontWeight: 600 }}>
            ● Engine Running Clean
          </div>
        </div>
      </div>

      {/* Admin Modules Navigation Grid */}
      <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '20px' }}>
        Administration Modules
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}
      >
        <Link
          to="/admin/users"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            border: '1.5px solid var(--color-border)',
            padding: '24px',
            textDecoration: 'none',
            color: 'inherit',
            boxShadow: 'var(--shadow-card-default)',
            transition: 'transform 200ms ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={22} />
            </div>
            <ArrowUpRight size={20} color="var(--color-ink-500)" />
          </div>
          <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>User Management</h4>
          <p style={{ fontSize: '14px', color: 'var(--color-ink-500)' }}>
            Search users, grant temporary quota bumps, change plans, or suspend accounts.
          </p>
        </Link>

        <Link
          to="/admin/plans"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            border: '1.5px solid var(--color-border)',
            padding: '24px',
            textDecoration: 'none',
            color: 'inherit',
            boxShadow: 'var(--shadow-card-default)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sliders size={22} />
            </div>
            <ArrowUpRight size={20} color="var(--color-ink-500)" />
          </div>
          <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Tier Management</h4>
          <p style={{ fontSize: '14px', color: 'var(--color-ink-500)' }}>
            Configure usage tiers, monthly conversion limits, and default plans for signups.
          </p>
        </Link>

        <Link
          to="/admin/usage-analytics"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            border: '1.5px solid var(--color-border)',
            padding: '24px',
            textDecoration: 'none',
            color: 'inherit',
            boxShadow: 'var(--shadow-card-default)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={22} />
            </div>
            <ArrowUpRight size={20} color="var(--color-ink-500)" />
          </div>
          <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Usage Analytics</h4>
          <p style={{ fontSize: '14px', color: 'var(--color-ink-500)' }}>
            View time-series charts, top tool usage breakdowns, and export reports to CSV.
          </p>
        </Link>

        <Link
          to="/admin/audit-log"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            border: '1.5px solid var(--color-border)',
            padding: '24px',
            textDecoration: 'none',
            color: 'inherit',
            boxShadow: 'var(--shadow-card-default)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={22} />
            </div>
            <ArrowUpRight size={20} color="var(--color-ink-500)" />
          </div>
          <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Audit Log</h4>
          <p style={{ fontSize: '14px', color: 'var(--color-ink-500)' }}>
            Read-only accountability trail logging every administrative edit and quota override.
          </p>
        </Link>

        <Link
          to="/admin/settings"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            border: '1.5px solid var(--color-border)',
            padding: '24px',
            textDecoration: 'none',
            color: 'inherit',
            boxShadow: 'var(--shadow-card-default)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={22} />
            </div>
            <ArrowUpRight size={20} color="var(--color-ink-500)" />
          </div>
          <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Global Settings</h4>
          <p style={{ fontSize: '14px', color: 'var(--color-ink-500)' }}>
            Toggle maintenance mode, set guest conversion limits, and manage tool feature flags.
          </p>
        </Link>
      </div>
    </div>
  );
};
