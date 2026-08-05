import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserUsageSummary } from '@shared/types';
import { authClient } from '../../lib/auth-client';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import { formatFileSize } from '../../lib/file-validation';
import { ArrowLeft, UserCheck, UserX, Shield, Zap, Trash2, Plus, CheckCircle2, XCircle } from 'lucide-react';

export const AdminUserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [summary, setSummary] = useState<UserUsageSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Action Modals State
  const [selectedPlanId, setSelectedPlanId] = useState('plan-registered');
  const [planReason, setPlanReason] = useState('');
  const [showPlanModal, setShowPlanModal] = useState(false);

  const [bumpAmount, setBumpAmount] = useState(50);
  const [bumpReason, setBumpReason] = useState('Customer support quota bump');
  const [showBumpModal, setShowBumpModal] = useState(false);

  const fetchUserDetail = () => {
    setIsLoading(true);
    fetch(`http://localhost:5000/api/admin/users/${id}`, {
      headers: authClient.getAuthHeader()
    })
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        if (data.user) setSelectedPlanId(data.user.planId);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (id) fetchUserDetail();
  }, [id]);

  const handleChangePlan = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authClient.getAuthHeader() },
        body: JSON.stringify({ planId: selectedPlanId, reason: planReason })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setToastMessage({ text: 'User plan updated successfully ✨', type: 'success' });
      setShowPlanModal(false);
      fetchUserDetail();
    } catch (err: any) {
      setToastMessage({ text: err.message || 'Failed to update plan', type: 'error' });
    }
  };

  const handleGrantQuotaBump = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}/quota-bump`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authClient.getAuthHeader() },
        body: JSON.stringify({ bumpAmount, reason: bumpReason })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setToastMessage({ text: `Granted +${bumpAmount} temporary quota bump 💕`, type: 'success' });
      setShowBumpModal(false);
      fetchUserDetail();
    } catch (err: any) {
      setToastMessage({ text: err.message || 'Failed to grant bump', type: 'error' });
    }
  };

  const handleToggleSuspension = async () => {
    if (!summary?.user) return;
    const suspend = !summary.user.isSuspended;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authClient.getAuthHeader() },
        body: JSON.stringify({ suspend, reason: suspend ? 'Account suspended by admin' : 'Account reactivated' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setToastMessage({ text: suspend ? 'Account suspended.' : 'Account reactivated ✨', type: 'success' });
      fetchUserDetail();
    } catch (err: any) {
      setToastMessage({ text: err.message || 'Failed to toggle status', type: 'error' });
    }
  };

  const handleForcePurgeFiles = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}/purge-files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authClient.getAuthHeader() },
        body: JSON.stringify({ reason: 'Admin manual file purge' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setToastMessage({ text: data.message || 'Force file purge completed', type: 'success' });
    } catch (err: any) {
      setToastMessage({ text: err.message || 'Failed to purge files', type: 'error' });
    }
  };

  if (isLoading || !summary) {
    return (
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        Loading user detail view...
      </div>
    );
  }

  const { user, plan } = summary;

  return (
    <div className="container" style={{ padding: '40px 0 80px' }}>
      <Link
        to="/admin/users"
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
        <ArrowLeft size={16} /> Back to User Directory
      </Link>

      {/* Header Info & Action Controls */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800 }}>{user.name}</h1>
              {user.isSuspended ? (
                <span style={{ backgroundColor: 'var(--color-error)', color: '#ffffff', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                  SUSPENDED
                </span>
              ) : (
                <span style={{ backgroundColor: 'var(--color-success)', color: '#ffffff', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                  ACTIVE
                </span>
              )}
            </div>
            <p style={{ color: 'var(--color-ink-500)', fontSize: '15px' }}>{user.email} (ID: {user.id})</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button variant="secondary" size="sm" onClick={() => setShowPlanModal(true)}>
              Change Plan
            </Button>

            <Button variant="secondary" size="sm" onClick={() => setShowBumpModal(true)}>
              <Plus size={16} /> Quota Bump (+50)
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleToggleSuspension}
              style={{ color: user.isSuspended ? 'var(--color-success)' : 'var(--color-error)' }}
            >
              {user.isSuspended ? <UserCheck size={16} /> : <UserX size={16} />}
              {user.isSuspended ? 'Reactivate' : 'Suspend'}
            </Button>

            <Button variant="secondary" size="sm" onClick={handleForcePurgeFiles} style={{ color: 'var(--color-error)' }}>
              <Trash2 size={16} /> Purge Files
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', paddingTop: '20px', borderTop: '1px solid var(--color-border)' }}>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--color-ink-500)' }}>Current Tier</span>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)' }}>{plan.name}</div>
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--color-ink-500)' }}>Conversions Used</span>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>{summary.conversionsUsedThisPeriod}</div>
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--color-ink-500)' }}>Quota Limit</span>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>
              {summary.quotaLimit !== null ? `${summary.quotaLimit} / month` : 'Unlimited'}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '13px', color: 'var(--color-ink-500)' }}>Temp Quota Bump</span>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)' }}>
              +{user.tempQuotaBump || 0} conversions
            </div>
          </div>
        </div>
      </div>

      {/* User Conversion History */}
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
          Full Conversion History
        </h3>

        {summary.recentConversions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-ink-500)' }}>
            No conversion history logged for this user.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--color-border)', color: 'var(--color-ink-500)' }}>
                  <th style={{ padding: '12px' }}>Tool</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>File Size</th>
                  <th style={{ padding: '12px' }}>Processing Time</th>
                  <th style={{ padding: '12px' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentConversions.map(evt => (
                  <tr key={evt.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 700 }}>{evt.toolId}</td>
                    <td style={{ padding: '14px 12px' }}>
                      {evt.status === 'success' ? (
                        <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>Success</span>
                      ) : (
                        <span style={{ color: 'var(--color-error)', fontWeight: 700 }}>{evt.status}</span>
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

      {/* Change Plan Modal */}
      <Modal isOpen={showPlanModal} title="Change User Plan" onClose={() => setShowPlanModal(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
              Select New Tier:
            </label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
            >
              <option value="plan-anonymous">Anonymous / Guest (5 conv/mo)</option>
              <option value="plan-registered">Registered User (50 conv/mo)</option>
              <option value="plan-staff">Internal / Staff (Unlimited)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
              Audit Reason (Required):
            </label>
            <input
              type="text"
              value={planReason}
              onChange={(e) => setPlanReason(e.target.value)}
              placeholder="e.g. VIP plan upgrade requested"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
            />
          </div>

          <Button variant="primary" onClick={handleChangePlan} style={{ marginTop: '8px' }}>
            Confirm Plan Update
          </Button>
        </div>
      </Modal>

      {/* Quota Bump Modal */}
      <Modal isOpen={showBumpModal} title="Grant Temporary Quota Bump" onClose={() => setShowBumpModal(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
              Bump Amount (Conversions):
            </label>
            <input
              type="number"
              value={bumpAmount}
              onChange={(e) => setBumpAmount(parseInt(e.target.value, 10))}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
              Audit Reason:
            </label>
            <input
              type="text"
              value={bumpReason}
              onChange={(e) => setBumpReason(e.target.value)}
              placeholder="e.g. Special project allowance"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
            />
          </div>

          <Button variant="primary" onClick={handleGrantQuotaBump} style={{ marginTop: '8px' }}>
            Grant Quota Bump 💕
          </Button>
        </div>
      </Modal>

      {toastMessage && (
        <Toast message={toastMessage.text} type={toastMessage.type} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
};
