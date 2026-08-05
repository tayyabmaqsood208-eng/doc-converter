import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlobalSettings } from '@shared/types';
import { authClient } from '../../lib/auth-client';
import { API_BASE_URL } from '../../lib/api-base';
import { TOOLS_REGISTRY } from '@/data/tools-registry';
import { Button } from '../../components/ui/Button';
import { Toast } from '../../components/ui/Toast';
import { ArrowLeft, AlertTriangle, Sliders, Shield, ToggleLeft, ToggleRight } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [anonymousLimit, setAnonymousLimit] = useState(5);
  const [disabledTools, setDisabledTools] = useState<string[]>([]);
  const [reason, setReason] = useState('Admin configuration update');
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchSettings = () => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/admin/settings`, {
      headers: authClient.getAuthHeader()
    })
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setSettings(data.settings);
          setMaintenanceMessage(data.settings.maintenanceMessage || '');
          setAnonymousLimit(data.settings.globalAnonymousLimit || 5);
          setDisabledTools(data.settings.disabledTools || []);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (newMaintenanceState?: boolean) => {
    const isMaintenanceActive = newMaintenanceState !== undefined ? newMaintenanceState : settings?.maintenanceMode;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authClient.getAuthHeader() },
        body: JSON.stringify({
          maintenanceMode: isMaintenanceActive,
          maintenanceMessage,
          globalAnonymousLimit: anonymousLimit,
          disabledTools,
          reason
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSettings(data.settings);
      setToastMessage('Global settings updated successfully ✨');
    } catch (err: any) {
      setToastMessage(`Error: ${err.message}`);
    }
  };

  const toggleToolFeatureFlag = (toolId: string) => {
    const isCurrentlyDisabled = disabledTools.includes(toolId);
    const updated = isCurrentlyDisabled
      ? disabledTools.filter(id => id !== toolId)
      : [...disabledTools, toolId];
    setDisabledTools(updated);
  };

  if (isLoading || !settings) {
    return (
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        Loading global settings...
      </div>
    );
  }

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
          Global Settings & Feature Flags ⚙️
        </h1>
        <p style={{ color: 'var(--color-ink-500)', fontSize: '15px' }}>
          Toggle maintenance mode, set guest rate limits, and enable/disable individual tools site-wide
        </p>
      </div>

      {/* Maintenance Mode Card */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          border: settings.maintenanceMode ? '2px solid var(--color-error)' : '1.5px solid var(--color-border)',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-card-default)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={24} color={settings.maintenanceMode ? 'var(--color-error)' : 'var(--color-ink-500)'} />
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Maintenance Mode Toggle</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-ink-500)' }}>
                Blocks new document conversions site-wide and displays an alert banner to users
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => handleSaveSettings(!settings.maintenanceMode)}
            style={{
              backgroundColor: settings.maintenanceMode ? 'var(--color-success)' : 'var(--color-error)',
              boxShadow: 'none'
            }}
          >
            {settings.maintenanceMode ? 'Deactivate Maintenance Mode' : 'Enable Maintenance Mode ⚠️'}
          </Button>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
            Maintenance Banner Message:
          </label>
          <input
            type="text"
            value={maintenanceMessage}
            onChange={(e) => setMaintenanceMessage(e.target.value)}
            placeholder="Custom message shown to users..."
            style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
          />
        </div>
      </div>

      {/* Tool Feature Flags Grid */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Individual Tool Feature Flags</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-ink-500)' }}>
              Enable or disable specific tools site-wide (e.g. if an engine converter is under maintenance)
            </p>
          </div>
          <Button variant="primary" onClick={() => handleSaveSettings()}>
            Save Feature Flags ✨
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {TOOLS_REGISTRY.map(tool => {
            const isDisabled = disabledTools.includes(tool.id);
            return (
              <div
                key={tool.id}
                onClick={() => toggleToolFeatureFlag(tool.id)}
                style={{
                  backgroundColor: isDisabled ? 'var(--color-primary-light)' : 'var(--color-bg)',
                  borderRadius: '12px',
                  border: isDisabled ? '1.5px solid var(--color-error)' : '1px solid var(--color-border)',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{tool.name}</div>
                  <div style={{ fontSize: '12px', color: isDisabled ? 'var(--color-error)' : 'var(--color-success)', fontWeight: 700 }}>
                    {isDisabled ? '● DISABLED SITE-WIDE' : '● ACTIVE'}
                  </div>
                </div>
                {isDisabled ? <ToggleLeft size={28} color="var(--color-error)" /> : <ToggleRight size={28} color="var(--color-success)" />}
              </div>
            );
          })}
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
};
