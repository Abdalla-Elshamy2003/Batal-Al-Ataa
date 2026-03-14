// src/components/tabs/LeaderboardTab.jsx
import React from 'react';
import leaderboardData from '../../data/leaderboardData';

const RANK_EMOJI = ['🥇','🥈','🥉'];
const RANK_COLOR = ['#f59e0b','#94a3b8','#cd7c2f'];

const LeaderboardTab = ({ userKP }) => {
  const rows = leaderboardData
    .map((p) => ({ ...p, kp: p.isMe ? userKP : p.kp }))
    .sort((a, b) => b.kp - a.kp);

  return (
    <div>
      <div style={{ background:'#fff', borderRadius:22, padding:'18px 24px', marginBottom:18, boxShadow:'0 4px 16px rgba(0,0,0,0.07)', textAlign:'center', direction:'rtl' }}>
        <h2 style={{ fontSize:24, fontWeight:900, color:'#1e293b', marginBottom:4 }}>🥇 لوحة الشرف</h2>
        <p style={{ color:'#64748b', fontSize:13, fontWeight:600 }}>المتطوعون الأكثر عطاءً هذا الأسبوع</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {rows.map((player, i) => (
          <div key={player.id} style={{
            background: player.isMe ? 'linear-gradient(135deg,#eff6ff,#dbeafe)' : '#fff',
            border:     player.isMe ? '2px solid #bfdbfe' : '2px solid transparent',
            borderRadius:16, padding:'12px 18px',
            display:'flex', alignItems:'center', gap:12,
            boxShadow:'0 2px 10px rgba(0,0,0,0.06)',
            direction:'rtl',
            animation:'popIn 0.3s ease-out backwards',
            animationDelay:`${i * 0.07}s`,
          }}>
            <div style={{ fontSize:18, fontWeight:900, minWidth:34, textAlign:'center', color: i < 3 ? RANK_COLOR[i] : '#94a3b8' }}>
              {i < 3 ? RANK_EMOJI[i] : i + 1}
            </div>
            <div style={{ width:40, height:40, borderRadius:'50%', border:'2px solid #e2e8f0', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
              {player.emoji}
            </div>
            <div style={{ flex:1, fontWeight:900, fontSize:14, color:'#1e293b', minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {player.name}{player.isMe ? ' (أنت)' : ''}
            </div>
            <div style={{ fontWeight:900, fontSize:15, color:'#ca8a04', background:'#fef9c3', padding:'4px 12px', borderRadius:99, whiteSpace:'nowrap', flexShrink:0 }}>
              ⭐ {player.kp.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardTab;
