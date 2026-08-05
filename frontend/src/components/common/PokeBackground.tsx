import React from 'react';

// Animated Fluttering Butterfly Component
const ButterflySvg: React.FC<{ size: number; color1: string; color2: string }> = ({ size, color1, color2 }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
    <defs>
      <linearGradient id={`wingGrad-${color1.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color1} />
        <stop offset="100%" stopColor={color2} />
      </linearGradient>
    </defs>
    
    {/* Left Wing */}
    <g style={{ transformOrigin: '50px 40px', animation: 'wingFlapLeft 0.35s infinite ease-in-out alternate' }}>
      <path
        d="M 50 40 C 20 5, 0 15, 5 45 C 10 65, 35 65, 50 45 Z"
        fill={`url(#wingGrad-${color1.replace('#', '')})`}
        opacity="0.85"
      />
      <circle cx="28" cy="30" r="6" fill="#FFFFFF" opacity="0.6" />
      <circle cx="22" cy="48" r="3" fill="#FFFFFF" opacity="0.7" />
    </g>

    {/* Right Wing */}
    <g style={{ transformOrigin: '50px 40px', animation: 'wingFlapRight 0.35s infinite ease-in-out alternate' }}>
      <path
        d="M 50 40 C 80 5, 100 15, 95 45 C 90 65, 65 65, 50 45 Z"
        fill={`url(#wingGrad-${color1.replace('#', '')})`}
        opacity="0.85"
      />
      <circle cx="72" cy="30" r="6" fill="#FFFFFF" opacity="0.6" />
      <circle cx="78" cy="48" r="3" fill="#FFFFFF" opacity="0.7" />
    </g>

    {/* Butterfly Body & Antennae */}
    <ellipse cx="50" cy="42" rx="3" ry="16" fill="#4B5563" />
    <circle cx="50" cy="24" r="3.5" fill="#374151" />
    <path d="M 50 22 C 45 14, 40 12, 36 10" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M 50 22 C 55 14, 60 12, 64 10" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <circle cx="36" cy="10" r="1.5" fill="#FF5E93" />
    <circle cx="64" cy="10" r="1.5" fill="#FF5E93" />
  </svg>
);

// Cute Floating Balloon Component (Heart & Round shapes)
const BalloonSvg: React.FC<{ size: number; color: string; isHeart?: boolean }> = ({ size, color, isHeart }) => (
  <svg width={size} height={size * 1.6} viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id={`balloonGlow-${color.replace('#', '')}`} cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
        <stop offset="100%" stopColor={color} stopOpacity="1" />
      </radialGradient>
    </defs>
    
    {isHeart ? (
      <path
        d="M 50 85 C 20 60, 5 35, 25 15 C 40 0, 50 15, 50 20 C 50 15, 60 0, 75 15 C 95 35, 80 60, 50 85 Z"
        fill={`url(#balloonGlow-${color.replace('#', '')})`}
      />
    ) : (
      <ellipse cx="50" cy="45" rx="38" ry="45" fill={`url(#balloonGlow-${color.replace('#', '')})`} />
    )}

    {/* Balloon Shiny Highlight */}
    <ellipse cx="36" cy="28" rx="8" ry="14" fill="#FFFFFF" opacity="0.45" transform="rotate(-20 36 28)" />

    {/* Balloon Knot */}
    <polygon points="46,88 54,88 50,94" fill={color} />

    {/* Balloon String (Wavy) */}
    <path
      d="M 50 94 Q 42 115, 54 135 T 48 158"
      stroke="rgba(156, 163, 175, 0.6)"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

// Cute Teddy Bear Face Component
const TeddyBearSvg: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer Bear Ears */}
    <circle cx="22" cy="24" r="16" fill="#D97706" />
    <circle cx="22" cy="24" r="10" fill="#FDE68A" />

    <circle cx="78" cy="24" r="16" fill="#D97706" />
    <circle cx="78" cy="24" r="10" fill="#FDE68A" />

    {/* Bear Head */}
    <circle cx="50" cy="52" r="36" fill="#F59E0B" />

    {/* Snout Area */}
    <ellipse cx="50" cy="62" rx="16" ry="12" fill="#FEF3C7" />
    <ellipse cx="50" cy="57" rx="7" ry="5" fill="#78350F" />
    <path d="M 50 62 L 50 67 M 45 68 Q 50 72, 55 68" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Bear Eyes & Blush */}
    <circle cx="36" cy="46" r="4.5" fill="#451A03" />
    <circle cx="34.5" cy="44.5" r="1.5" fill="#FFFFFF" />

    <circle cx="64" cy="46" r="4.5" fill="#451A03" />
    <circle cx="62.5" cy="44.5" r="1.5" fill="#FFFFFF" />

    {/* Rosy Cheeks */}
    <ellipse cx="28" cy="58" rx="6" ry="4" fill="#FF5E93" opacity="0.6" />
    <ellipse cx="72" cy="58" rx="6" ry="4" fill="#FF5E93" opacity="0.6" />

    {/* Cute Ribbon Bow */}
    <path d="M 42 85 C 32 78, 30 92, 44 88 Z" fill="#FF3366" />
    <path d="M 58 85 C 68 78, 70 92, 56 88 Z" fill="#FF3366" />
    <circle cx="50" cy="86" r="4" fill="#FF99B5" />
  </svg>
);

// Twinkling Star Component
const StarSvg: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 25 0 Q 25 25, 50 25 Q 25 25, 25 50 Q 25 25, 0 25 Q 25 25, 25 0 Z"
      fill={color}
    />
  </svg>
);

export const PokeBackground: React.FC = () => {
  // Fluttering Butterflies
  const butterflies = [
    { size: 55, color1: '#FF5E93', color2: '#FFB800', top: '15%', left: '8%', duration: '14s', delay: '0s' },
    { size: 65, color1: '#8B5CF6', color2: '#EC4899', top: '60%', left: '85%', duration: '18s', delay: '2s' },
    { size: 48, color1: '#06B6D4', color2: '#3B82F6', top: '75%', left: '12%', duration: '16s', delay: '1s' },
    { size: 60, color1: '#F59E0B', color2: '#EF4444', top: '25%', left: '78%', duration: '15s', delay: '3s' },
    { size: 42, color1: '#EC4899', color2: '#F43F5E', top: '45%', left: '48%', duration: '12s', delay: '4s' },
  ];

  // Cute Floating Balloons
  const balloons = [
    { size: 70, color: '#FF5E93', isHeart: true, left: '5%', duration: '18s', delay: '0s' },
    { size: 85, color: '#3B82F6', isHeart: false, left: '22%', duration: '22s', delay: '5s' },
    { size: 75, color: '#F59E0B', isHeart: true, left: '72%', duration: '19s', delay: '2s' },
    { size: 90, color: '#8B5CF6', isHeart: false, left: '90%', duration: '24s', delay: '8s' },
    { size: 65, color: '#10B981', isHeart: true, left: '42%', duration: '20s', delay: '12s' },
  ];

  // Cute Teddy Bears
  const bears = [
    { size: 75, top: '20%', left: '88%', duration: '8s', delay: '0s' },
    { size: 85, top: '68%', left: '6%', duration: '9.5s', delay: '1s' },
    { size: 65, top: '10%', left: '38%', duration: '7.5s', delay: '2s' },
    { size: 70, top: '80%', left: '62%', duration: '8.5s', delay: '3s' },
  ];

  // Twinkling Stars
  const stars = [
    { size: 24, color: '#FBBF24', top: '12%', left: '18%', duration: '3s', delay: '0s' },
    { size: 30, color: '#FF5E93', top: '28%', left: '68%', duration: '4s', delay: '1s' },
    { size: 20, color: '#A78BFA', top: '78%', left: '28%', duration: '3.5s', delay: '0.5s' },
    { size: 26, color: '#38BDF8', top: '82%', left: '80%', duration: '2.8s', delay: '1.5s' },
    { size: 22, color: '#F472B6', top: '48%', left: '92%', duration: '3.2s', delay: '2s' },
    { size: 28, color: '#FBBF24', top: '52%', left: '4%', duration: '4.2s', delay: '0.8s' },
  ];

  return (
    <div className="cute-bg-container">
      {/* Soft Ambient Light Orbs */}
      <div
        className="cute-ambient-orb"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255, 182, 193, 0.22) 0%, rgba(255, 230, 240, 0.05) 70%, transparent 100%)',
          top: '-120px',
          left: '-100px'
        }}
      />
      <div
        className="cute-ambient-orb"
        style={{
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(221, 214, 254, 0.2) 0%, rgba(254, 243, 199, 0.05) 70%, transparent 100%)',
          bottom: '-140px',
          right: '-120px'
        }}
      />

      {/* Floating Teddy Bears */}
      {bears.map((bear, idx) => (
        <div
          key={`bear-${idx}`}
          className="cute-element"
          style={{
            top: bear.top,
            left: bear.left,
            animation: `bearFloat ${bear.duration} infinite ease-in-out ${bear.delay}`,
            opacity: 0.42,
            filter: 'drop-shadow(0 6px 16px rgba(217, 119, 6, 0.2))'
          }}
        >
          <TeddyBearSvg size={bear.size} />
        </div>
      ))}

      {/* Fluttering Butterflies */}
      {butterflies.map((bf, idx) => (
        <div
          key={`bf-${idx}`}
          className="cute-element"
          style={{
            top: bf.top,
            left: bf.left,
            animation: `butterflyFly ${bf.duration} infinite ease-in-out ${bf.delay}`,
            opacity: 0.75,
            filter: 'drop-shadow(0 4px 12px rgba(255, 94, 147, 0.3))'
          }}
        >
          <ButterflySvg size={bf.size} color1={bf.color1} color2={bf.color2} />
        </div>
      ))}

      {/* Rising Cute Balloons */}
      {balloons.map((b, idx) => (
        <div
          key={`balloon-${idx}`}
          className="cute-element"
          style={{
            left: b.left,
            bottom: '-120px',
            animation: `balloonRise ${b.duration} infinite linear ${b.delay}`,
            opacity: 0.55,
            filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.12))'
          }}
        >
          <BalloonSvg size={b.size} color={b.color} isHeart={b.isHeart} />
        </div>
      ))}

      {/* Twinkling Stars & Sparkles */}
      {stars.map((s, idx) => (
        <div
          key={`star-${idx}`}
          className="cute-element"
          style={{
            top: s.top,
            left: s.left,
            animation: `starTwinkle ${s.duration} infinite ease-in-out ${s.delay}`
          }}
        >
          <StarSvg size={s.size} color={s.color} />
        </div>
      ))}
    </div>
  );
};

export default PokeBackground;
