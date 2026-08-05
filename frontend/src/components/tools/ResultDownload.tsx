import React from 'react';
import { Download, RefreshCw, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatFileSize } from '../../lib/file-validation';

interface ResultDownloadProps {
  downloadUrl: string;
  fileName: string;
  fileSize?: number;
  onReset: () => void;
}

export const ResultDownload: React.FC<ResultDownloadProps> = ({
  downloadUrl,
  fileName,
  fileSize,
  onReset
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
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}
      >
        <CheckCircle2 size={36} />
      </div>

      <h3 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>
        Your Document is Ready!
      </h3>
      
      <p style={{ color: 'var(--color-ink-500)', fontSize: '15px', marginBottom: '24px' }}>
        Conversion completed with high fidelity. Click below to download your file.
      </p>

      <div
        style={{
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid var(--color-border)'
        }}
      >
        <div style={{ textAlign: 'left', overflow: 'hidden' }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: '15px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {fileName}
          </div>
          {fileSize && (
            <div style={{ fontSize: '13px', color: 'var(--color-ink-500)' }}>
              {formatFileSize(fileSize)}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <a
          href={downloadUrl}
          download={fileName}
          style={{ textDecoration: 'none', width: '100%' }}
        >
          <Button variant="primary" size="lg" style={{ width: '100%' }}>
            <Download size={20} /> Download File
          </Button>
        </a>

        <Button variant="secondary" size="md" onClick={onReset} style={{ width: '100%' }}>
          <RefreshCw size={18} /> Convert Another File
        </Button>
      </div>

      <div
        style={{
          marginTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '13px',
          color: 'var(--color-ink-500)'
        }}
      >
        <Shield size={16} color="var(--color-success)" />
        <span>File will be auto-deleted from servers in 1 hour.</span>
      </div>
    </div>
  );
};
