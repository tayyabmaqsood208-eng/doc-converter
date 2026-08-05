import React from 'react';
import { Link } from 'react-router-dom';
import { ToolDefinition } from '@shared/types';
import { ArrowRight } from 'lucide-react';

interface ToolCardProps {
  tool: ToolDefinition;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <Link to={tool.route} className="docflow-card" aria-label={tool.name}>
      <div className="badge-container">
        <div
          className="badge-icon badge-icon-primary"
          style={{ backgroundColor: tool.accentColorToken }}
        >
          {tool.badgeIcons.primary}
        </div>
        <div
          className="badge-icon badge-icon-secondary"
          style={{ backgroundColor: tool.accentColorToken }}
        >
          {tool.badgeIcons.secondary}
        </div>
      </div>

      <div style={{ flexGrow: 1 }}>
        <h3
          style={{
            fontSize: '18px',
            fontWeight: 700,
            marginBottom: '8px',
            color: 'var(--color-ink-900)'
          }}
        >
          {tool.name}
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: 'var(--color-ink-500)',
            lineHeight: '1.5'
          }}
        >
          {tool.shortDescription}
        </p>
      </div>

      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--color-primary)',
          fontWeight: 600,
          fontSize: '14px'
        }}
      >
        <span>Open Tool</span>
        <ArrowRight size={16} />
      </div>
    </Link>
  );
};
