// src/App.jsx
/**
 * App — Root component.
 * Responsive layout: sidebar slides to bottom drawer on mobile,
 * proper gap between sidebar and content on all screens.
 */
import React, { useState, useCallback } from 'react';
import useGameState        from './hooks/useGameState';
import GameEngine          from './services/GameEngine';
import AudioManager        from './services/AudioManager';

// Layout & common
import Sidebar             from './components/layout/Sidebar';
import StatBadge           from './components/common/StatBadge';
import Notification        from './components/common/Notification';
import RocketBackground    from './components/common/RocketBackground';
import ConfettiOverlay     from './components/common/ConfettiOverlay';

// Auth
import AuthScreen          from './components/auth/AuthScreen';

// Modals
import LevelUpModal        from './components/modals/LevelUpModal';
import TutorialModal       from './components/modals/TutorialModal';
import DailyRewardModal    from './components/modals/DailyRewardModal';
import ZoneDetailModal     from './components/modals/ZoneDetailModal';
import QuestModal          from './components/modals/QuestModal';

// Tabs
import MapTab              from './components/tabs/MapTab';
import BadgesTab           from './components/tabs/BadgesTab';
import LeaderboardTab      from './components/tabs/LeaderboardTab';
import ImpactTab           from './components/tabs/ImpactTab';
import ProfileTab          from './components/tabs/ProfileTab';
import ParentsTab          from './components/tabs/ParentsTab';

// ── Global CSS ────────────────────────────────────────────────────────────

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Cairo', sans-serif; overflow-x: hidden; }

  /* ── Animations ── */
  @keyframes popIn {
    0%   { transform: scale(0.75); opacity: 0; }
    80%  { transform: scale(1.06); }
    100% { transform: scale(1);    opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes slideInDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0);     }
  }
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  /* ── XP fill shimmer ── */
  .xp-fill {
    background: linear-gradient(90deg, #38bdf8, #3ba2f8, #1d6ed8, #38bdf8);
    background-size: 200% auto;
    animation: shimmer 2.5s linear infinite;
  }

  /* ── Tab transition ── */
  .tab-enter { animation: slideInDown 0.28s ease-out; }

  /* ── App layout: desktop side-by-side, mobile stacked ── */
  .app-layout {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 244px 1fr;
    grid-template-rows: 1fr auto;
    grid-template-areas: "sidebar main";
    gap: 0 24px;
    padding: 24px 24px 24px 24px;
    position: relative;
  }

  .app-sidebar-area { grid-area: sidebar; }
  .app-main-area    { grid-area: main;    min-width: 0; }

  /* ── Mobile bottom nav ── */
  .mobile-nav-bar {
    display: none;
  }

  /* ── Stats header wrapping ── */
  .stats-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }
  .stats-badges {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  /* ── Responsive breakpoints ── */

  /* Tablet: 768px–1100px — sidebar narrower */
  @media (max-width: 1100px) {
    .app-layout {
      grid-template-columns: 200px 1fr;
      gap: 0 16px;
      padding: 16px 16px 16px 16px;
    }
  }

  /* Mobile: collapse sidebar into bottom nav */
  @media (max-width: 768px) {
    .app-layout {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr auto;
      grid-template-areas:
        "main"
        "sidebar";
      gap: 0;
      padding: 12px 12px 80px 12px;
    }

    /* Hide full sidebar on mobile */
    .app-sidebar-area .sidebar-desktop {
      display: none;
    }

    /* Show bottom nav bar */
    .mobile-nav-bar {
      display: flex;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: linear-gradient(135deg, #1b3a5c, #122540);
      border-top: 1px solid rgba(255,255,255,0.1);
      padding: 8px 4px 12px;
      z-index: 50;
      justify-content: space-around;
      align-items: center;
      box-shadow: 0 -8px 32px rgba(0,0,0,0.25);
    }

    .stats-header {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
    .stats-badges {
      justify-content: center;
    }
  }

  /* Very small: 480px */
  @media (max-width: 480px) {
    .app-layout { padding: 10px 10px 80px; }
  }
`;

// ── XP Header ────────────────────────────────────────────────────────────

const XpHeader = ({ userStats }) => {
  const pct = GameEngine.xpPercent(userStats.xp, userStats.xpNeeded);
  return (
    <div style={{ flex: 1, minWidth: 180 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8, gap:8, flexWrap:'wrap' }}>
        <span style={{ display:'flex', alignItems:'center', gap:6, background:'#fef9c3', color:'#854d0e', padding:'4px 12px', borderRadius:99, fontSize:12, fontWeight:900, whiteSpace:'nowrap' }}>
          ✨ تقدم الخبرة
        </span>
        <span style={{ background:'#eff6ff', color:'#1d6ed8', padding:'4px 12px', borderRadius:99, fontSize:12, fontWeight:900, whiteSpace:'nowrap' }}>
          {userStats.xp} / {userStats.xpNeeded} XP
        </span>
      </div>
      <div style={{ height:20, background:'#f1f5f9', borderRadius:99, overflow:'hidden', border:'2px solid #e2e8f0' }}>
        <div className="xp-fill" style={{ height:'100%', width:`${Math.max(pct,5)}%`, borderRadius:99, transition:'width 1s ease-out' }} />
      </div>
    </div>
  );
};

// ── Mobile Nav Bar ────────────────────────────────────────────────────────

const MOBILE_NAV_ITEMS = [
  { id:'map',         emoji:'🗺️', label:'الخريطة'  },
  { id:'badges',      emoji:'🏆', label:'الأوسمة'  },
  { id:'leaderboard', emoji:'🥇', label:'الشرف'    },
  { id:'impact',      emoji:'🌍', label:'التأثير'  },
  { id:'profile',     emoji:'🎨', label:'تجهيزات'  },
  { id:'parents',     emoji:'🛡️', label:'الآباء'   },
];

const MobileNavBar = ({ activeTab, setActiveTab }) => (
  <nav className="mobile-nav-bar">
    {MOBILE_NAV_ITEMS.map((item) => {
      const active = activeTab === item.id;
      return (
        <button
          key={item.id}
          onClick={() => { AudioManager.getInstance().play('nav'); setActiveTab(item.id); }}
          style={{
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            2,
            background:     active ? 'rgba(255,255,255,0.12)' : 'transparent',
            border:         'none',
            borderRadius:   12,
            padding:        '6px 10px',
            cursor:         'pointer',
            transition:     'all 0.18s',
            minWidth:       44,
          }}
        >
          <span style={{ fontSize: active ? 22 : 18, transition:'font-size 0.18s' }}>{item.emoji}</span>
          <span style={{ fontSize:9, fontWeight:900, color: active ? '#fbbf24' : 'rgba(255,255,255,0.5)', fontFamily:"'Cairo',sans-serif", whiteSpace:'nowrap' }}>
            {item.label}
          </span>
          {active && (
            <span style={{ width:4, height:4, borderRadius:'50%', background:'#fbbf24', marginTop:1 }} />
          )}
        </button>
      );
    })}
  </nav>
);

// ── App ───────────────────────────────────────────────────────────────────

export default function App() {
  const { state, actions } = useGameState();

  const {
    appState, activeTab, activeZone, activeQuest,
    showLevelUp, showTutorial, showDailyReward,
    levelUpData, userStats, avatarTheme,
    completedQuests, notification,
  } = state;

  const {
    login, setActiveTab,
    openZone, closeZone,
    openQuest, closeQuest,
    completeQuest, setShowLevelUp,
    setAvatarColor, setAvatarAccessory,
    finishTutorial, claimDailyReward, handleDonate,
  } = actions;

  if (appState === 'auth') {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <AuthScreen onLogin={login} />
      </>
    );
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div
        dir="rtl"
        className="app-layout"
        style={{ background: 'linear-gradient(135deg, #3ba2f8 0%, #1d6ed8 100%)' }}
      >
        <RocketBackground />

        {/* ── Sidebar (desktop) ── */}
        <div className="app-sidebar-area" style={{ position:'relative', zIndex:2 }}>
          <div className="sidebar-desktop">
            <Sidebar state={state} actions={actions} />
          </div>
        </div>

        {/* ── Main Content ── */}
        <main className="app-main-area" style={{ display:'flex', flexDirection:'column', position:'relative', zIndex:1 }}>

          {/* Stats header */}
          <header style={{
            background:'#fff', borderRadius:24, padding:'18px 22px',
            boxShadow:'0 4px 20px rgba(0,0,0,0.08)',
            marginBottom:20,
          }}>
            <div className="stats-header">
              <XpHeader userStats={userStats} />
              <div className="stats-badges">
                <StatBadge icon="⭐" label="نقاط العطاء (KP)" value={userStats.kp}         color="#ca8a04" />
                <StatBadge icon="🌍" label="نقاط التأثير"     value={userStats.impactScore} color="#059669" />
              </div>
            </div>
          </header>

          {/* Tab content */}
          <div className="tab-enter" key={activeTab} style={{ flex:1 }}>
            {activeTab === 'map'         && <MapTab         completedQuests={completedQuests} onOpenZone={openZone} />}
            {activeTab === 'badges'      && <BadgesTab />}
            {activeTab === 'leaderboard' && <LeaderboardTab userKP={userStats.kp} />}
            {activeTab === 'impact'      && <ImpactTab      userStats={userStats} completedCount={completedQuests.size} onDonate={handleDonate} />}
            {activeTab === 'profile'     && <ProfileTab     avatarTheme={avatarTheme} onSetColor={setAvatarColor} onSetAccessory={setAvatarAccessory} />}
            {activeTab === 'parents'     && <ParentsTab     userStats={userStats} />}
          </div>
        </main>

        {/* ── Mobile bottom nav ── */}
        <MobileNavBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* ── Modals ── */}
        {showTutorial                   && <TutorialModal  onFinish={finishTutorial} />}
        {showDailyReward && !showTutorial && <DailyRewardModal onClaim={claimDailyReward} />}
        {showLevelUp && (
          <LevelUpModal level={levelUpData.level} title={levelUpData.title} onClose={() => setShowLevelUp(false)} />
        )}
        {activeZone && (
          <ZoneDetailModal zone={activeZone} completedQuests={completedQuests} onClose={closeZone}
            onOpenQuest={(q) => { closeZone(); openQuest(q); }} />
        )}
        {activeQuest && (
          <QuestModal quest={activeQuest} onClose={closeQuest} onComplete={completeQuest} />
        )}

        <ConfettiOverlay active={showLevelUp} />
        <Notification message={notification} />
      </div>
    </>
  );
}
