// src/components/layout/Sidebar.jsx
/**
 * Sidebar — Main navigation panel.
 * Sits inside its own CSS Grid area — never overlaps main content.
 * Dark gradient + glassmorphism nav + floating avatar + XP mini-bar.
 */
import React, { memo, useCallback } from 'react';
import {
  Map as MapIcon, Trophy, ListOrdered,
  Globe, Palette, ShieldCheck, Award, Crown, Star,
} from 'lucide-react';
import AudioManager from '../../services/AudioManager';
import GameEngine   from '../../services/GameEngine';

// ── Nav config ────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id:'map',         label:'خريطة المدينة',  Icon:MapIcon      },
  { id:'badges',      label:'الأوسمة',         Icon:Trophy       },
  { id:'leaderboard', label:'لوحة الشرف',      Icon:ListOrdered  },
  { id:'impact',      label:'التأثير الواقعي',  Icon:Globe        },
  { id:'profile',     label:'غرفة التجهيزات',  Icon:Palette      },
  { id:'parents',     label:'بوابة الآباء',    Icon:ShieldCheck, dividerBefore:true },
];

// ── Injected CSS ──────────────────────────────────────────────────────────

const CSS = `
  @keyframes sbFloat {
    0%,100% { transform:translateY(0px);  }
    50%      { transform:translateY(-7px); }
  }
  @keyframes sbGlow {
    0%,100% { box-shadow:0 0 0 3px rgba(251,191,36,0.28),0 8px 24px rgba(0,0,0,0.28); }
    50%      { box-shadow:0 0 0 6px rgba(251,191,36,0.52),0 8px 24px rgba(0,0,0,0.28); }
  }
  .sb-float { animation:sbFloat 4s ease-in-out infinite; }
  .sb-glow  { animation:sbGlow  2.8s ease-in-out infinite; }

  .sb-scroll::-webkit-scrollbar       { width:3px; }
  .sb-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.12);border-radius:3px; }

  .sb-btn {
    width:100%; display:flex; align-items:center; justify-content:flex-end;
    gap:10px; padding:11px 14px; border-radius:14px; border:none;
    cursor:pointer; font-family:'Cairo',sans-serif; font-size:13px;
    direction:rtl; position:relative; overflow:hidden;
    transition:background 0.2s,color 0.2s,box-shadow 0.2s;
    text-align:right;
  }
  .sb-btn:hover { background:rgba(255,255,255,0.08) !important; }
  .sb-btn.sb-active {
    background:linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08)) !important;
    box-shadow:inset 0 0 0 1px rgba(255,255,255,0.20),0 3px 10px rgba(0,0,0,0.15);
    color:#fff !important; font-weight:900 !important;
  }
`;

// ── Sub-components ────────────────────────────────────────────────────────

const NavBtn = memo(({ id, label, Icon, active, onClick }) => (
  <button
    className={`sb-btn${active ? ' sb-active' : ''}`}
    onClick={onClick}
    style={{ background:'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.58)', fontWeight: active ? 900 : 700 }}
  >
    {/* Active accent bar */}
    {active && (
      <span style={{
        position:'absolute', right:0, top:'50%', transform:'translateY(-50%)',
        width:4, height:26, background:'#fbbf24', borderRadius:'4px 0 0 4px',
        boxShadow:'0 0 8px rgba(251,191,36,0.8)',
      }} />
    )}
    <span style={{ position:'relative', zIndex:1 }}>{label}</span>
    <span style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', color: active ? '#fbbf24' : 'rgba(255,255,255,0.40)', transition:'color 0.2s' }}>
      <Icon size={18} />
    </span>
  </button>
));

const XpMiniBar = memo(({ xp, xpNeeded }) => {
  const pct = GameEngine.xpPercent(xp, xpNeeded);
  return (
    <div style={{ padding:'0 14px 12px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
        <span style={{ fontSize:10, color:'rgba(255,255,255,0.40)', fontWeight:700 }}>XP</span>
        <span style={{ fontSize:10, color:'rgba(255,255,255,0.60)', fontWeight:900 }}>{xp}/{xpNeeded}</span>
      </div>
      <div style={{ height:5, background:'rgba(255,255,255,0.10)', borderRadius:99, overflow:'hidden' }}>
        <div style={{
          height:'100%', width:`${Math.max(pct,4)}%`,
          background:'linear-gradient(90deg,#fbbf24,#f59e0b)',
          borderRadius:99, transition:'width 0.9s ease-out',
          boxShadow:'0 0 6px rgba(251,191,36,0.7)',
        }} />
      </div>
    </div>
  );
});

const Divider = () => (
  <div style={{ height:1, margin:'6px 6px', background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.09),transparent)' }} />
);

// ── Sidebar ───────────────────────────────────────────────────────────────

const Sidebar = ({ state, actions }) => {
  const {
    userStats   = { name:'البطل', title:'مبتدئ', level:1, xp:0, xpNeeded:1000, kp:0 },
    avatarTheme = { bg:'00bcd4', accessory:'crown' },
    activeTab   = 'map',
  } = state ?? {};

  const { setActiveTab = () => {} } = actions ?? {};

  const handleNav = useCallback((id) => {
    AudioManager.getInstance().play('nav');
    setActiveTab(id);
  }, [setActiveTab]);

  return (
    <>
      <style>{CSS}</style>

      <aside style={{
        width:          '100%',       /* fills its grid column */
        background:     'linear-gradient(175deg,#1b3a5c 0%,#172f4a 45%,#122540 100%)',
        display:        'flex',
        flexDirection:  'column',
        borderRadius:   24,
        boxShadow:      '0 20px 60px rgba(0,0,0,0.30),0 4px 16px rgba(0,0,0,0.15)',
        border:         '1px solid rgba(255,255,255,0.07)',
        fontFamily:     "'Cairo',sans-serif",
        direction:      'rtl',
        height:         'fit-content',
        minHeight:      540,
        position:       'sticky',
        top:            24,
        overflow:       'hidden',
      }}>

        {/* Top radial glow */}
        <div style={{
          position:'absolute', top:-60, left:'50%', transform:'translateX(-50%)',
          width:200, height:200,
          background:'radial-gradient(circle,rgba(59,162,248,0.20) 0%,transparent 70%)',
          pointerEvents:'none',
        }} />

        {/* Profile block */}
        <div style={{ padding:'26px 16px 0', textAlign:'center', position:'relative' }}>

          {/* Avatar */}
          <div className="sb-float" style={{ position:'relative', width:84, height:84, margin:'0 auto 10px' }}>
            <div className="sb-glow" style={{
              width:84, height:84, borderRadius:'50%',
              border:'3px solid rgba(251,191,36,0.62)', overflow:'hidden', background:'#fff',
            }}>
              <img
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userStats.name)}&backgroundColor=${avatarTheme.bg}`}
                alt="avatar"
                style={{ width:'100%', height:'100%', objectFit:'cover' }}
              />
            </div>
            {avatarTheme.accessory === 'crown' && (
              <Crown size={26} fill="#fbbf24" style={{
                position:'absolute', top:-18, left:'50%', transform:'translateX(-50%)',
                color:'#fbbf24', filter:'drop-shadow(0 2px 5px rgba(251,191,36,0.7))',
              }} />
            )}
            {avatarTheme.accessory === 'star' && (
              <Star size={22} fill="#fbbf24" style={{
                position:'absolute', top:-16, left:'50%', transform:'translateX(-50%)', color:'#fbbf24',
              }} />
            )}
          </div>

          {/* Level */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:4,
            background:'linear-gradient(135deg,#fbbf24,#f59e0b)',
            color:'#1e293b', fontSize:11, fontWeight:900,
            padding:'2px 12px', borderRadius:99, marginBottom:6,
            boxShadow:'0 2px 8px rgba(251,191,36,0.40)',
          }}>⚡ مستوى {userStats.level}</div>

          {/* Name */}
          <div style={{ color:'#fff', fontSize:15, fontWeight:900, marginBottom:4, textShadow:'0 2px 6px rgba(0,0,0,0.3)' }}>
            {userStats.name}
          </div>

          {/* Title */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:4,
            color:'rgba(186,230,253,0.80)', fontSize:10, fontWeight:700,
            background:'rgba(255,255,255,0.07)', padding:'2px 10px', borderRadius:99,
            border:'1px solid rgba(255,255,255,0.09)', marginBottom:12,
          }}>
            <Award size={9} /> {userStats.title}
          </div>

          {/* KP */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}>
            <div style={{
              display:'flex', flexDirection:'column', alignItems:'center',
              background:'rgba(255,255,255,0.06)',
              borderRadius:14, padding:'8px 20px',
              border:'1px solid rgba(255,255,255,0.08)',
            }}>
              <span style={{ fontSize:19, fontWeight:900, color:'#fbbf24', lineHeight:1 }}>
                {userStats.kp.toLocaleString()}
              </span>
              <span style={{ fontSize:9, color:'rgba(255,255,255,0.42)', fontWeight:700, marginTop:2, letterSpacing:'0.03em' }}>
                نقاط العطاء ⭐
              </span>
            </div>
          </div>

          <Divider />
        </div>

        {/* XP bar */}
        <XpMiniBar xp={userStats.xp} xpNeeded={userStats.xpNeeded} />

        {/* Nav */}
        <nav className="sb-scroll" style={{
          flex:1, padding:'2px 10px 14px',
          display:'flex', flexDirection:'column', gap:2, overflowY:'auto',
        }}>
          {NAV_ITEMS.map((item) => (
            <React.Fragment key={item.id}>
              {item.dividerBefore && <Divider />}
              <NavBtn
                id={item.id}
                label={item.label}
                Icon={item.Icon}
                active={activeTab === item.id}
                onClick={() => handleNav(item.id)}
              />
            </React.Fragment>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default memo(Sidebar);
