// src/components/common/JellyButton.jsx
/**
 * JellyButton — A satisfying, springy button for children's UI.
 * Plays a click sound via AudioManager and applies a jelly press animation.
 *
 * Props:
 *   onClick     – handler
 *   children    – content
 *   variant     – 'primary' | 'success' | 'warning' | 'dark' | 'danger'
 *   size        – 'sm' | 'md' | 'lg'
 *   fullWidth   – boolean
 *   sound       – AudioManager key (default: 'click')
 *   style       – extra inline styles
 *   disabled    – boolean
 */
import React, { useCallback } from 'react';
import AudioManager from '../../services/AudioManager';

// ── Design tokens ─────────────────────────────────────────────────────────

const VARIANTS = {
  primary: {
    background: 'linear-gradient(135deg, #3ba2f8, #1d6ed8)',
    color: '#fff',
    shadow: 'rgba(59,162,248,0.45)',
  },
  success: {
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: '#fff',
    shadow: 'rgba(34,197,94,0.45)',
  },
  warning: {
    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    color: '#fff',
    shadow: 'rgba(251,191,36,0.45)',
  },
  dark: {
    background: 'linear-gradient(135deg, #334155, #1e293b)',
    color: '#fff',
    shadow: 'rgba(0,0,0,0.3)',
  },
  danger: {
    background: 'linear-gradient(135deg, #f87171, #ef4444)',
    color: '#fff',
    shadow: 'rgba(239,68,68,0.4)',
  },
};

const SIZES = {
  sm: { padding: '8px 18px',  fontSize: 13, borderRadius: 12 },
  md: { padding: '13px 24px', fontSize: 15, borderRadius: 16 },
  lg: { padding: '16px 32px', fontSize: 17, borderRadius: 18 },
};

const JELLY_KEYFRAMES = `
  @keyframes jellyPress {
    0%   { transform: scale(1); }
    30%  { transform: scale(0.90) scaleX(1.08); }
    60%  { transform: scale(1.06) scaleX(0.97); }
    80%  { transform: scale(0.98); }
    100% { transform: scale(1); }
  }
`;

// ── Component ─────────────────────────────────────────────────────────────

const JellyButton = ({
  onClick,
  children,
  variant   = 'primary',
  size      = 'md',
  fullWidth = false,
  sound     = 'click',
  style     = {},
  disabled  = false,
}) => {
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  const s = SIZES[size]       ?? SIZES.md;

  const handleClick = useCallback((e) => {
    if (disabled) return;

    // Jelly animation
    const el = e.currentTarget;
    el.style.animation = 'none';
    requestAnimationFrame(() => {
      el.style.animation = 'jellyPress 0.4s cubic-bezier(0.36,0.07,0.19,0.97)';
    });

    // Sound
    AudioManager.getInstance().play(sound);

    onClick?.(e);
  }, [disabled, sound, onClick]);

  return (
    <>
      <style>{JELLY_KEYFRAMES}</style>
      <button
        onClick={handleClick}
        disabled={disabled}
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            8,
          width:          fullWidth ? '100%' : 'auto',
          border:         'none',
          cursor:         disabled ? 'not-allowed' : 'pointer',
          fontFamily:     "'Cairo', sans-serif",
          fontWeight:     900,
          letterSpacing:  '0.01em',
          opacity:        disabled ? 0.55 : 1,
          boxShadow:      `0 4px 16px ${v.shadow}`,
          transition:     'box-shadow 0.2s, opacity 0.2s',
          ...v,
          ...s,
          ...style,
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.boxShadow = `0 8px 24px ${v.shadow}`;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `0 4px 16px ${v.shadow}`;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        onAnimationEnd={(e) => {
          e.currentTarget.style.animation = '';
        }}
      >
        {children}
      </button>
    </>
  );
};

export default JellyButton;
