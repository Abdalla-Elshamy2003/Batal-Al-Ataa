// src/components/tabs/BadgesTab.jsx
import React from 'react';
import badgesData from '../../data/badgesData';

const CSS = `
  .badges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 14px;
  }
  @media (max-width: 480px) {
    .badges-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  }
`;

const BadgesTab = () => (
  <div>
    <style>{CSS}</style>

    <div style={{ background:'#fff', borderRadius:22, padding:'18px 24px', marginBottom:18, boxShadow:'0 4px 16px rgba(0,0,0,0.07)', textAlign:'center', direction:'rtl' }}>
      <h2 style={{ fontSize:24, fontWeight:900, color:'#1e293b', marginBottom:4 }}>🏆 الأوسمة والجوائز</h2>
      <p style={{ color:'#64748b', fontSize:13, fontWeight:600 }}>اجمع الأوسمة وأثبت بطولتك!</p>
    </div>

    <div className="badges-grid">
      {badgesData.map((badge, i) => (
        <div key={badge.id} style={{
          background:'#fff', borderRadius:18, padding:'20px 14px',
          textAlign:'center', boxShadow:'0 4px 14px rgba(0,0,0,0.07)',
          opacity: badge.earned ? 1 : 0.45,
          filter:  badge.earned ? 'none' : 'grayscale(1)',
          animation:'popIn 0.4s ease-out backwards',
          animationDelay:`${i * 0.06}s`,
          direction:'rtl', transition:'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 22px rgba(0,0,0,0.12)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 14px rgba(0,0,0,0.07)'; }}
        >
          <span style={{ fontSize:40, display:'block', marginBottom:8 }}>{badge.icon}</span>
          <div style={{ fontSize:13, fontWeight:900, color:'#1e293b', marginBottom:3 }}>{badge.name}</div>
          <div style={{ fontSize:10, color:'#94a3b8', fontWeight:600 }}>{badge.desc}</div>
          {badge.earned && (
            <span style={{ display:'inline-block', background:'#dcfce7', color:'#166534', fontSize:9, fontWeight:900, padding:'2px 8px', borderRadius:99, marginTop:6 }}>
              ✅ محققة
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default BadgesTab;
