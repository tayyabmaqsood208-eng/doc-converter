import React from 'react';
import { ShieldCheck, Lock, Clock, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-surface)',
        borderTop: '1.5px solid var(--color-border)',
        marginTop: '80px',
        padding: '56px 0 36px'
      }}
    >
      <div className="container">
        {/* Retention & Privacy Policy Highlight Box */}
        <div
          style={{
            background: 'var(--gradient-hero-badge)',
            borderRadius: 'var(--radius-card)',
            padding: '28px 36px',
            marginBottom: '44px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
            border: '1.5px solid var(--color-border)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <Clock size={26} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-ink-900)', marginBottom: '4px' }}>
                Automated 1-Hour File Retention Policy ✨
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--color-ink-700)', lineHeight: '1.5' }}>
                All uploaded documents and converted results are automatically and permanently deleted from our servers 1 hour after processing by our automated cleanup engine.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <Lock size={26} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-ink-900)', marginBottom: '4px' }}>
                High-Fidelity Server-Side Conversion 💖
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--color-ink-700)', lineHeight: '1.5' }}>
                Documents are processed with high-fidelity server-side conversion engines. We perform real magic-byte file signature validation to protect against corrupt or invalid files.
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            paddingTop: '24px',
            borderTop: '1.5px solid var(--color-border)',
            color: 'var(--color-ink-500)',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          <p>© {new Date().getFullYear()} DocFlow ✨ Made with care for your documents.</p>
          <div style={{ display: 'flex', gap: '20px', fontWeight: 600 }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>API & Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
