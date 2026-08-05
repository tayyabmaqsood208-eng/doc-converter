import React from 'react';

interface PillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const Pill: React.FC<PillProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`pill ${isActive ? 'active' : ''}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
};
