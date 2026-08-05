import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UsageEvent, KpiData } from '@shared/types';
import { authClient } from '../../lib/auth-client';
import { Button } from '../../components/ui/Button';
import { formatFileSize } from '../../lib/file-validation';
import { ArrowLeft, Download, BarChart3, TrendingUp, PieChart, FileText } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [events, setEvents] = useState<UsageEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/admin/analytics/kpis', { headers: authClient.getAuthHeader() }).then(r => r.json()),
      fetch('http://localhost:5000/api/admin/analytics/usage-events', { headers: authClient.getAuthHeader() }).then(r => r.json())
    ])
      .then(([kpiData, eventData]) => {
        setKpis(kpiData);
        setEvents(eventData.events || []);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleExportCsv = () => {
    window.open('http://localhost:5000/api/admin/analytics/export-csv', '_blank');
  };

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
            Usage Analytics 📈
          </h1>
          <p style={{ color: 'var(--color-ink-500)', fontSize: '15px' }}>
            Detailed conversion metrics, tool popularity breakdown, and raw event exports
          </p>
        </div>

        <Button variant="primary" onClick={handleExportCsv}>
          <Download size={18} /> Export Report to CSV
        </Button>
      </div>

      {/* Top Tools Breakdown Cards */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1.5px solid var(--color-border)',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-card-default)'
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
          Top Tools Popularity Ranking
        </h3>

        {kpis?.topTools && kpis.topTools.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {kpis.topTools.map((t, idx) => (
              <div
                key={t.toolId}
                style={{
                  backgroundColor: 'var(--color-bg)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid var(--color-border)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>
                  #{idx + 1} MOST POPULAR
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-ink-900)' }}>
                  {t.toolId}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--color-ink-500)', marginTop: '4px' }}>
                  {t.count} conversions
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--color-ink-500)' }}>No usage data recorded yet.</div>
        )}
      </div>

      {/* Conversion Events Log Table */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1.5px solid var(--color-border)',
          padding: '32px',
          boxShadow: 'var(--shadow-card-default)'
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>
          Raw Conversion Log Events ({events.length})
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--color-border)', color: 'var(--color-ink-500)' }}>
                <th style={{ padding: '12px' }}>Event ID</th>
                <th style={{ padding: '12px' }}>User</th>
                <th style={{ padding: '12px' }}>IP Address</th>
                <th style={{ padding: '12px' }}>Tool</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Processing Time</th>
                <th style={{ padding: '12px' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 12px', fontFamily: 'monospace', fontSize: '12px' }}>{e.id}</td>
                  <td style={{ padding: '14px 12px', fontWeight: 600 }}>{e.userId || 'Anonymous Guest'}</td>
                  <td style={{ padding: '14px 12px', color: 'var(--color-ink-500)' }}>{e.ipAddress || '127.0.0.1'}</td>
                  <td style={{ padding: '14px 12px', fontWeight: 700 }}>{e.toolId}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ color: e.status === 'success' ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 700 }}>
                      {e.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px', color: 'var(--color-ink-500)' }}>{e.processingTimeMs} ms</td>
                  <td style={{ padding: '14px 12px', color: 'var(--color-ink-500)' }}>{new Date(e.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
