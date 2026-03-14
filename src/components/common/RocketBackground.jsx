// src/components/common/RocketBackground.jsx
/**
 * RocketBackground — Full-screen decorative background layer.
 * Renders the animated rocket, clouds, and stars.
 * Pure presentational, no props needed.
 */
import React, { memo } from 'react';

// ── Sub-components ────────────────────────────────────────────────────────

const Cloud = memo(({ style }) => (
  <div style={{
    position: 'absolute',
    fontSize: 60,
    pointerEvents: 'none',
    userSelect: 'none',
    ...style,
  }}>☁️</div>
));

const Star = memo(({ style }) => (
  <div style={{
    position: 'absolute',
    color: 'rgba(255,255,255,0.6)',
    pointerEvents: 'none',
    userSelect: 'none',
    ...style,
  }}>✦</div>
));

const Rocket = memo(() => (
  <div style={{
    position: 'absolute',
    bottom: '8%',
    left: '6%',
    fontSize: 80,
    pointerEvents: 'none',
    userSelect: 'none',
    animation: 'rocketFly 6s ease-in-out infinite',
    transformOrigin: 'center center',
    filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.25))',
    zIndex: 0,
  }}>🚀</div>
));

// ── Static decoration data ────────────────────────────────────────────────

const CLOUDS = [
  { top: '4%',  left: '4%',  opacity: 0.18, animation: 'cloudFloat1 9s ease-in-out infinite',          animationDelay: '0s'   },
  { top: '10%', right: '5%', opacity: 0.13, animation: 'cloudFloat1 11s ease-in-out infinite',         animationDelay: '2s'   },
  { top: '45%', left: '1%',  opacity: 0.10, animation: 'cloudFloat1 8s  ease-in-out infinite',         animationDelay: '3.5s' },
  { top: '68%', right: '3%', opacity: 0.08, animation: 'cloudFloat1 10s ease-in-out infinite',         animationDelay: '1s'   },
];

const STARS = [
  { top: '22%', left: '38%',  fontSize: 18, animation: 'starTwinkle 3s ease-in-out infinite',          animationDelay: '0s'   },
  { top: '55%', left: '28%',  fontSize: 14, animation: 'starTwinkle 3s ease-in-out infinite',          animationDelay: '1.2s' },
  { top: '15%', right: '18%', fontSize: 16, animation: 'starTwinkle 3s ease-in-out infinite',          animationDelay: '0.6s' },
  { top: '75%', right: '12%', fontSize: 12, animation: 'starTwinkle 3s ease-in-out infinite',          animationDelay: '2s'   },
  { top: '35%', left: '15%',  fontSize: 10, animation: 'starTwinkle 3s ease-in-out infinite',          animationDelay: '1.8s' },
];

// ── Keyframes (injected once) ─────────────────────────────────────────────

const BG_KEYFRAMES = `
  @keyframes rocketFly {
    0%   { transform: translateY(0px)   rotate(-35deg); }
    25%  { transform: translateY(-30px) rotate(-30deg); }
    50%  { transform: translateY(-55px) rotate(-40deg); }
    75%  { transform: translateY(-30px) rotate(-32deg); }
    100% { transform: translateY(0px)   rotate(-35deg); }
  }
  @keyframes cloudFloat1 {
    0%, 100% { transform: translateX(0)   translateY(0);   }
    33%       { transform: translateX(10px) translateY(-8px); }
    66%       { transform: translateX(-6px) translateY(5px);  }
  }
  @keyframes starTwinkle {
    0%, 100% { opacity: 0.25; transform: scale(1);    }
    50%       { opacity: 0.70; transform: scale(1.35); }
  }
`;

// ── Main component ────────────────────────────────────────────────────────

const RocketBackground = () => (
  <>
    <style>{BG_KEYFRAMES}</style>

    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
    }}>
      {CLOUDS.map((s, i) => <Cloud key={`cloud-${i}`} style={s} />)}
      {STARS.map((s, i)  => <Star  key={`star-${i}`}  style={s} />)}
      <Rocket />
    </div>
  </>
);

export default memo(RocketBackground);
