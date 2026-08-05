import React from 'react';
import { ToolDefinition } from '@shared/types';
import { ToolCard } from './ToolCard';

interface ToolGridProps {
  tools: ToolDefinition[];
}

export const ToolGrid: React.FC<ToolGridProps> = ({ tools }) => {
  if (tools.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '48px 0',
          color: 'var(--color-ink-500)'
        }}
      >
        No document tools found in this category.
      </div>
    );
  }

  return (
    <div className="tool-grid">
      {tools.map(tool => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
};
