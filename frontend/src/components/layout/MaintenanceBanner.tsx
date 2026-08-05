import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export const MaintenanceBanner: React.FC = () => {
  const [maintenance, setMaintenance] = useState<{ active: boolean; message: string }>({
    active: false,
    message: ''
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings && data.settings.maintenanceMode) {
          setMaintenance({
            active: true,
            message: data.settings.maintenanceMessage || 'System maintenance active.'
          });
        }
      })
      .catch(() => {});
  }, []);

  if (!maintenance.active) return null;

  return (
    <div
      style={{
        backgroundColor: 'var(--color-error)',
        color: '#ffffff',
        padding: '10px 24px',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}
    >
      <AlertTriangle size={18} />
      <span>{maintenance.message}</span>
    </div>
  );
};
