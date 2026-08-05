import React from 'react';
import { TOOL_CATEGORIES } from '@/data/tools-registry';
import { ToolCategory } from '@shared/types';
import { Pill } from '../ui/Pill';

interface CategoryFilterProps {
  activeCategory: ToolCategory;
  onSelectCategory: (category: ToolCategory) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory
}) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '32px',
        scrollbarWidth: 'none'
      }}
    >
      {TOOL_CATEGORIES.map(cat => (
        <Pill
          key={cat.id}
          label={cat.label}
          isActive={activeCategory === cat.id}
          onClick={() => onSelectCategory(cat.id)}
        />
      ))}
    </div>
  );
};
