import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';

interface ProcessingStateProps {
  toolName: string;
  progress: number; // 0 to 100
  statusMessage?: string;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({
  toolName,
  progress,
  statusMessage = 'Converting your file...'
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--color-border)',
        padding: '48px 32px',
        maxWidth: '560px',
        margin: '0 auto',
        textAlign: 'center',
        boxShadow: 'var(--shadow-card-default)'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 24px',
          borderRadius: '50%',
          border: '4px solid var(--color-primary-light)',
          borderTopColor: 'var(--color-primary)',
          animation: 'spin 1s linear infinite'
        }}
      />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
        {toolName} in Progress
      </h3>
      
      <p style={{ color: 'var(--color-ink-500)', fontSize: '15px', marginBottom: '24px' }}>
        {statusMessage}
      </p>

      <ProgressBar progress={progress} />

      <p style={{ fontSize: '13px', color: 'var(--color-ink-500)', marginTop: '16px' }}>
        Please do not close this browser window. Your download will start automatically once ready.
      </p>
    </div>
  );
};
