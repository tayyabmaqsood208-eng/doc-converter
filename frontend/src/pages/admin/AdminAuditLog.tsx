import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminAuditEntry } from '@shared/types';
import { authClient } from '../../lib/auth-client';
import { ArrowLeft, Shield, FileText, Lock } from 'lucide-react';

export const AdminAuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/audit-log', {
      headers: authClient.getAuthHeader()
    })
      .then(res => res.json())
      .then(data => setLogs(data.auditLog || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
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

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '4px' }}>
          Admin Audit Log 🛡️
        </h1>
        <p style={{ color: 'var(--color-ink-500)', fontSize: '15px' }}>
          Immutable accountability trail logging every administrative plan override, quota bump, and setting update
        </p>
      </div>

      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: '1.5px solid var(--color-border)',
          padding: '32px',
          boxShadow: 'var(--shadow-card-default)'
        }}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>Loading audit log entries...</div>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-ink-500)' }}>
            No admin actions logged yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--color-border)', color: 'var(--color-ink-500)' }}>
                  <th style={{ padding: '12px' }}>Timestamp</th>
                  <th style={{ padding: '12px' }}>Admin</th>
                  <th style={{ padding: '12px' }}>Action</th>
                  <th style={{ padding: '12px' }}>Details</th>
                  <th style={{ padding: '12px' }}>Reason</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 12px', color: 'var(--color-ink-500)', fontSize: '13px' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 12px', fontWeight: 700 }}>
                      {log.adminEmail}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span
                        style={{
                          backgroundColor: 'var(--color-primary-light)',
                          color: 'var(--color-primary)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          fontSize: '12px'
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', color: 'var(--color-ink-900)' }}>
                      {log.details}
                    </td>
                    <td style={{ padding: '14px 12px', color: 'var(--color-ink-500)', fontStyle: 'italic' }}>
                      {log.reason || 'N/A'}
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
