// src/components/tabs/MapTab.jsx
import React, { memo, useState, useCallback } from 'react';
import zonesData    from '../../data/zonesData';
import AudioManager from '../../services/AudioManager';

const COLOR_BORDER = {
  rose:    { idle:'#fecdd3', hover:'#fb7185' },
  purple:  { idle:'#e9d5ff', hover:'#a855f7' },
  amber:   { idle:'#fde68a', hover:'#f59e0b' },
  sky:     { idle:'#bae6fd', hover:'#38bdf8' },
  indigo:  { idle:'#c7d2fe', hover:'#6366f1' },
  emerald: { idle:'#a7f3d0', hover:'#10b981' },
  red:     { idle:'#fecaca', hover:'#ef4444' },
  orange:  { idle:'#fed7aa', hover:'#f97316' },
};

const COLOR_ICON_BG = {
  rose:'#fff1f2', purple:'#faf5ff', amber:'#fffbeb',
  sky:'#f0f9ff',  indigo:'#eef2ff', emerald:'#f0fdf4',
  red:'#fef2f2',  orange:'#fff7ed',
};

const MAP_CSS = `
  .zones-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 16px;
  }
  @media (max-width: 600px) {
    .zones-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
  }
  @media (max-width: 360px) {
    .zones-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const ZoneCard = memo(({ zone, availableCount, onOpen, index }) => {
  const [hovered, setHovered] = useState(false);
  const borders = COLOR_BORDER[zone.color] ?? { idle:'#e2e8f0', hover:'#94a3b8' };

  const handleClick = useCallback(() => {
    AudioManager.getInstance().play('click');
    onOpen(zone);
  }, [zone, onOpen]);

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:     '#fff',
        borderRadius:   20,
        padding:        '24px 16px 20px',
        textAlign:      'center',
        cursor:         'pointer',
        border:         `2px solid ${hovered ? borders.hover : borders.idle}`,
        boxShadow:      hovered ? '0 10px 28px rgba(0,0,0,0.14)' : '0 3px 12px rgba(0,0,0,0.07)',
        transform:      hovered ? 'translateY(-5px) scale(1.02)' : 'translateY(0) scale(1)',
        transition:     'all 0.22s ease',
        position:       'relative',
        animation:      'popIn 0.4s ease-out backwards',
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {availableCount > 0 && (
        <div style={{
          position:'absolute', top:-10, left:-10,
          width:26, height:26,
          background:'#ef4444', color:'#fff',
          borderRadius:'50%', fontSize:12, fontWeight:900,
          display:'flex', alignItems:'center', justifyContent:'center',
          border:'2px solid #fff', boxShadow:'0 2px 8px rgba(239,68,68,0.4)',
        }}>{availableCount}</div>
      )}

      <div style={{
        width:70, height:70, borderRadius:'50%',
        background: COLOR_ICON_BG[zone.color] ?? '#f8fafc',
        display:'flex', alignItems:'center', justifyContent:'center',
        margin:'0 auto 12px', fontSize:34,
        transition:'transform 0.22s',
        transform: hovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1)',
      }}>
        {zone.emoji}
      </div>

      <div style={{ fontSize:14, fontWeight:900, color:'#1e293b', marginBottom:3 }}>{zone.title}</div>
      <div style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>{zone.desc}</div>
    </div>
  );
});

const MapTab = ({ completedQuests, onOpenZone }) => (
  <div>
    <style>{MAP_CSS}</style>

    <div style={{
      background:'#fff', borderRadius:22, padding:'18px 24px',
      marginBottom:18, boxShadow:'0 4px 16px rgba(0,0,0,0.07)',
      textAlign:'center', direction:'rtl',
    }}>
      <h2 style={{ fontSize:24, fontWeight:900, color:'#1e293b', marginBottom:4, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
        🗺️ مدينة العطاء
      </h2>
      <p style={{ color:'#64748b', fontSize:13, fontWeight:600 }}>
        اختر مبنى من المدينة لتستكشف المهام الممتعة بالداخل!
      </p>
    </div>

    <div className="zones-grid">
      {zonesData.map((zone, i) => {
        const available = zone.quests.filter((q) => !completedQuests.has(q.id)).length;
        return (
          <ZoneCard
            key={zone.id}
            zone={zone}
            availableCount={available}
            onOpen={onOpenZone}
            index={i}
          />
        );
      })}
    </div>
  </div>
);

export default memo(MapTab);
