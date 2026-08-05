import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  statusText?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, statusText }) => {
  return (
    <div style={{ width: '100%', margin: '16px 0' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--color-ink-700)'
        }}
      >
        <span>{statusText || 'Processing...'}</span>
        <span>{Math.min(100, Math.max(0, Math.round(progress)))}%</span>
      </div>
      <div
        style={{
          width: '100%',
          height: '10px',
          backgroundColor: 'var(--color-border)',
          borderRadius: '5px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, Math.max(0, progress))}%`,
            backgroundColor: 'var(--color-primary)',
            transition: 'width 200ms ease-in-out'
          }}
        />
      </div>
    </div>
  );
};
