import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plan } from '@shared/types';
import { authClient } from '../../lib/auth-client';
import { API_BASE_URL } from '../../lib/api-base';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import { ArrowLeft, Plus, Sliders, CheckCircle2 } from 'lucide-react';

export const AdminPlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchPlans = () => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/admin/plans`, {
      headers: authClient.getAuthHeader()
    })
      .then(res => res.json())
      .then(data => setPlans(data.plans || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="container" style={{ padding: '40px 0 80px' }}>
      <Link
        to="/admin"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--color-ink-500)',
          textDecoration: 'none',
          marginBottom: '20px',
          fontWeight: 600,
          fontSize: '14px'
        }}
      >
        <ArrowLeft size={16} /> Admin Dashboard
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '4px' }}>
            Tier & Quota Management 👑
          </h1>
          <p style={{ color: 'var(--color-ink-500)', fontSize: '15px' }}>
            Manage rate limits, monthly quotas, file size limits, and default signup tiers
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {plans.map(plan => (
          <div
            key={plan.id}
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-card)',
              border: plan.isDefault ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
              padding: '28px',
              boxShadow: 'var(--shadow-card-default)',
              position: 'relative'
            }}
          >
            {plan.isDefault && (
              <span
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700
                }}
              >
                Default Signup Tier ✨
              </span>
            )}

            <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
              {plan.name}
            </h3>

            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '16px' }}>
              {plan.conversionsPerMonth !== null ? `${plan.conversionsPerMonth} conv/mo` : 'Unlimited'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--color-ink-700)', marginBottom: '24px' }}>
              <div><strong>Max File Size:</strong> {plan.maxFileSizeMB} MB</div>
              <div><strong>Max Concurrent Jobs:</strong> {plan.maxConcurrentJobs}</div>
              <div><strong>File Retention:</strong> {plan.retentionHours} Hours</div>
              <div><strong>Allowed Tools:</strong> {plan.toolsAllowed === 'all' ? 'All 14 PDF Tools' : String(plan.toolsAllowed)}</div>
            </div>
          </div>
        ))}
      </div>

      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
};
