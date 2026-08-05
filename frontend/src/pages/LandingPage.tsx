import React, { useState } from 'react';
import { TOOLS_REGISTRY } from '@/data/tools-registry';
import { ToolCategory } from '@shared/types';
import { CategoryFilter } from '../components/layout/CategoryFilter';
import { ToolGrid } from '../components/tools/ToolGrid';
import { Sparkles, Heart } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');

  const filteredTools = activeCategory === 'all'
    ? TOOLS_REGISTRY
    : TOOLS_REGISTRY.filter(tool => tool.category === activeCategory);

  return (
    <div>
      {/* Chic Girly Hero Section */}
      <section
        style={{
          textAlign: 'center',
          padding: '64px 0 48px',
          maxWidth: '860px',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--gradient-hero-badge)',
            color: 'var(--color-primary)',
            padding: '8px 18px',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: 700,
            marginBottom: '24px',
            border: '1.5px solid var(--color-border)',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)'
          }}
        >
          <Sparkles size={16} />
          <span>The Chic & Easy PDF Suite ✨</span>
          <Heart size={14} fill="var(--color-primary)" color="var(--color-primary)" />
        </div>

        <h1 style={{ marginBottom: '20px', letterSpacing: '-0.03em' }}>
          Every tool you need to work with PDFs in one place 💖
        </h1>

        <p
          style={{
            fontSize: '18px',
            color: 'var(--color-ink-500)',
            maxWidth: '660px',
            margin: '0 auto 36px',
            lineHeight: '1.6',
            fontWeight: 500
          }}
        >
          DocFlow is 100% free, fast, and automatically purges all uploaded documents within 1 hour for maximum privacy.
        </p>
      </section>

      {/* Category Filter Pills & Grid */}
      <section className="container">
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        <ToolGrid tools={filteredTools} />
      </section>
    </div>
  );
};
