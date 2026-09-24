import React from 'react';

/** Subtle ambient background — no floating toys/sparkles. */
export const PokeBackground: React.FC = () => {
  return (
    <div className="cute-bg-container" aria-hidden="true">
      <div
        className="cute-ambient-orb"
        style={{
          width: '420px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(255, 182, 193, 0.14) 0%, transparent 70%)',
          top: '-100px',
          left: '-80px'
        }}
      />
      <div
        className="cute-ambient-orb"
        style={{
          width: '480px',
          height: '480px',
          background: 'radial-gradient(circle, rgba(221, 214, 254, 0.12) 0%, transparent 70%)',
          bottom: '-120px',
          right: '-100px'
        }}
      />
    </div>
  );
};

export default PokeBackground;
