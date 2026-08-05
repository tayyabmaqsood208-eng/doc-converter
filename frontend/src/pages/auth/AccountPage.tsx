import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserUsageSummary } from '@shared/types';
import { authClient } from '../../lib/auth-client';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { formatFileSize } from '../../lib/file-validation';
import { Shield, Sparkles, CheckCircle2, XCircle, Clock, FileText, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<UserUsageSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/account/usage', {
      headers: authClient.getAuthHeader()
    })
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '64px 0' }}>
        Loading account details...
      </div>
    );
  }

  if (!user || !summary) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '64px 0' }}>
        <h2>Account Session Required</h2>
        <p style={{ margin: '16px 0 24px' }}>Please log in to view your quota and conversion history.</p>
        <Link to="/auth/login">
          <Button variant="primary">Log In</Button>
        </Link>
      </div>
    );
  }

  const used = summary.conversionsUsedThisPeriod;
  const limit = summary.quotaLimit;
  const percentUsed = limit !== null ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <div className="container" style={{ padding: '40px 0 80px' }}>
      {/* Header Profile Box */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1.5px solid var(--color-border)',
          padding: '32px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: 'var(--shadow-card-default)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800 }}>{user.name}</h1>
            <span
              style={{
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 700,
                border: '1px solid var(--color-border)'
              }}
            >
              {summary.plan.name} Tier ✨
            </span>
          </div>
          <p style={{ color: 'var(--color-ink-500)', fontSize: '15px' }}>{user.email}</p>
        </div>

        <Link to="/">
          <Button variant="primary">Convert New Document ✨</Button>
        </Link>
      </div>

      {/* Quota Progress Card */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1.5px solid var(--color-border)',
          padding: '32px',
          marginBottom: '40px',
          boxShadow: 'var(--shadow-card-default)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
              Monthly Conversion Quota 💕
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-ink-500)' }}>
              {limit !== null 
                ? `You have used ${used} out of ${limit} conversions this monthly cycle.`
                : 'You have unlimited conversions on your staff tier.'}
            </p>
          </div>
          {limit !== null && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-primary)' }}>
                {summary.conversionsRemaining}
              </span>
              <span style={{ fontSize: '14px', color: 'var(--color-ink-500)', marginLeft: '4px' }}>
                remaining
              </span>
            </div>
          )}
        </div>

        {limit !== null && <ProgressBar progress={percentUsed} statusText={`${used} / ${limit} Conversions Used`} />}

        {user.tempQuotaBump && user.tempQuotaBump > 0 ? (
          <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600 }}>
            ✨ Includes +{user.tempQuotaBump} temporary quota bump granted by admin.
          </div>
        ) : null}
      </div>

      {/* Recent Conversions History Table */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1.5px solid var(--color-border)',
          padding: '32px',
          boxShadow: 'var(--shadow-card-default)'
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
          Recent Conversion History (Last 20)
        </h3>

        {summary.recentConversions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-ink-500)' }}>
            No conversions recorded yet. Choose a tool above to get started!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--color-border)', color: 'var(--color-ink-500)' }}>
                  <th style={{ padding: '12px' }}>Tool</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>File Size</th>
                  <th style={{ padding: '12px' }}>Duration</th>
                  <th style={{ padding: '12px' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentConversions.map(evt => (
                  <tr key={evt.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 700 }}>{evt.toolId}</td>
                    <td style={{ padding: '14px 12px' }}>
                      {evt.status === 'success' ? (
                        <span style={{ color: 'var(--color-success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={16} /> Success
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-error)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <XCircle size={16} /> {evt.status}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', color: 'var(--color-ink-500)' }}>
                      {evt.fileSizeBytes ? formatFileSize(evt.fileSizeBytes) : '-'}
                    </td>
                    <td style={{ padding: '14px 12px', color: 'var(--color-ink-500)' }}>
                      {evt.processingTimeMs} ms
                    </td>
                    <td style={{ padding: '14px 12px', color: 'var(--color-ink-500)' }}>
                      {new Date(evt.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
