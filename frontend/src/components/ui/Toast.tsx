import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'warning';
  onClose: () => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'error',
  onClose,
  durationMs = 5000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [onClose, durationMs]);

  const bgColors: Record<string, string> = {
    error: 'var(--color-error)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)'
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: bgColors[type],
        color: '#ffffff',
        padding: '14px 20px',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-modal)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '400px',
        fontSize: '14px',
        fontWeight: 500
      }}
    >
      <span style={{ flexGrow: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#ffffff',
          fontWeight: 700,
          cursor: 'pointer',
          fontSize: '16px',
          lineHeight: 1
        }}
        aria-label="Close alert"
      >
        ×
      </button>
    </div>
  );
};
