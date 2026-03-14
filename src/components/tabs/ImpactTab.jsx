// src/components/tabs/ImpactTab.jsx
import React from 'react';
import JellyButton from '../common/JellyButton';

const CSS = `
  .impact-stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 18px;
  }
  @media (max-width: 600px) {
    .impact-stat-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 360px) {
    .impact-stat-grid { grid-template-columns: 1fr; }
  }
`;

const ProgressBar = ({ label, value, count, color }) => (
  <div style={{ marginBottom:14 }}>
    <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700, fontSize:13, color:'#334155', marginBottom:5 }}>
      <span>{label}</span><span>{count}</span>
    </div>
    <div style={{ height:9, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${value}%`, background:color, borderRadius:99, transition:'width 1s ease-out' }} />
    </div>
  </div>
);

const ImpactTab = ({ userStats, completedCount, onDonate }) => {
  const helpedCount = Math.floor(userStats.kp / 50);

  return (
    <div>
      <style>{CSS}</style>

      <div style={{ background:'#fff', borderRadius:22, padding:'18px 24px', marginBottom:18, boxShadow:'0 4px 16px rgba(0,0,0,0.07)', textAlign:'center', direction:'rtl' }}>
        <h2 style={{ fontSize:24, fontWeight:900, color:'#1e293b', marginBottom:4 }}>🌍 التأثير الواقعي</h2>
        <p style={{ color:'#64748b', fontSize:13, fontWeight:600 }}>إليك كيف غيّرت حياة الناس من حولك</p>
      </div>

      <div className="impact-stat-grid">
        {[
          { number: completedCount, label:'مهمة مكتملة', color:'#3ba2f8', delay:0   },
          { number: userStats.impactScore, label:'نقطة تأثير',  color:'#10b981', delay:0.1 },
          { number: helpedCount,  label:'شخص ساعدته', color:'#f59e0b', delay:0.2 },
        ].map((card, i) => (
          <div key={i} style={{
            background:'#fff', borderRadius:20, padding:'20px 16px',
            textAlign:'center', boxShadow:'0 4px 14px rgba(0,0,0,0.07)',
            animation:'popIn 0.4s ease-out backwards',
            animationDelay:`${card.delay}s`, direction:'rtl',
          }}>
            <div style={{ fontSize:32, fontWeight:900, color:card.color, marginBottom:4 }}>{card.number}</div>
            <div style={{ fontSize:12, color:'#64748b', fontWeight:700 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Progress breakdown */}
      <div style={{ background:'#fff', borderRadius:20, padding:'22px 24px', boxShadow:'0 4px 14px rgba(0,0,0,0.07)', direction:'rtl', marginBottom:16 }}>
        <h3 style={{ fontSize:17, fontWeight:900, color:'#1e293b', marginBottom:14 }}>📊 تفاصيل تأثيرك</h3>
        <ProgressBar label="مساعدة المسنين"  count="12 مهمة" value={80} color="linear-gradient(90deg,#f87171,#ef4444)" />
        <ProgressBar label="دعم الأيتام"      count="7 مهام"  value={55} color="linear-gradient(90deg,#c084fc,#a855f7)" />
        <ProgressBar label="خدمة الحي"        count="18 مهمة" value={90} color="linear-gradient(90deg,#38bdf8,#1d6ed8)" />
        <ProgressBar label="العمل البيئي"      count="5 مهام"  value={40} color="linear-gradient(90deg,#4ade80,#16a34a)" />
      </div>

      {/* Donate */}
      {userStats.kp >= 50 && (
        <div style={{ background:'#fff', borderRadius:20, padding:'20px 24px', boxShadow:'0 4px 14px rgba(0,0,0,0.07)', direction:'rtl', textAlign:'center' }}>
          <h3 style={{ fontSize:17, fontWeight:900, color:'#1e293b', marginBottom:8 }}>💖 تبرع بنقاطك</h3>
          <p style={{ fontSize:13, color:'#64748b', fontWeight:600, marginBottom:14 }}>حوّل نقاط العطاء إلى تأثير حقيقي في مجتمعك!</p>
          <JellyButton variant="success" size="md" sound="reward" onClick={() => onDonate?.(50)}>
            تبرع بـ 50 KP 🌟
          </JellyButton>
        </div>
      )}
    </div>
  );
};

export default ImpactTab;
