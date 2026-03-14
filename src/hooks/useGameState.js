// src/hooks/useGameState.js
/**
 * useGameState — Central React hook for all game state.
 * Delegates all business calculations to GameEngine (OOP service).
 * Delegates audio to AudioManager (OOP singleton).
 */
import { useState, useCallback } from 'react';
import GameEngine   from '../services/GameEngine';
import AudioManager from '../services/AudioManager';

// ── Initial state ─────────────────────────────────────────────────────────

const INITIAL_STATE = {
  appState:       'auth',   // 'auth' | 'game'
  activeTab:      'map',
  activeZone:     null,
  activeQuest:    null,
  showTutorial:   false,
  showDailyReward: false,
  showLevelUp:    false,
  levelUpData:    { level: 1, title: GameEngine.titleForLevel(1) },
  notification:   null,
  userStats: {
    name:        'البطل أحمد',
    title:       GameEngine.titleForLevel(1),
    level:       1,
    xp:          0,
    xpNeeded:    1000,
    kp:          0,
    impactScore: 0,
  },
  avatarTheme: {
    bg:        '00bcd4',
    accessory: 'crown',
  },
  completedQuests: new Set(),
};

// ── Storage helpers ───────────────────────────────────────────────────────

const storage = {
  get: (key)        => { try { return localStorage.getItem(key); }    catch { return null; } },
  set: (key, value) => { try { localStorage.setItem(key, value); }    catch {} },
};

// ── Hook ──────────────────────────────────────────────────────────────────

export default function useGameState() {
  const [state, setState] = useState(INITIAL_STATE);

  /** Shallow-merge patch into top-level state */
  const patch = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  // ── Notification ──────────────────────────────────────────────────────────
  const notify = useCallback((msg, delay = 3000) => {
    patch({ notification: msg });
    setTimeout(() => patch({ notification: null }), delay);
  }, [patch]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = useCallback(({ name }) => {
    const isReturning = storage.get('madina_visited') === 'true';
    storage.set('madina_visited', 'true');

    setState((prev) => ({
      ...prev,
      appState:        'game',
      userStats:       { ...prev.userStats, name: name || 'البطل الشجاع' },
      showTutorial:    !isReturning,
      showDailyReward: isReturning,
    }));
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────────
  const setActiveTab = useCallback((tab) => patch({ activeTab: tab }), [patch]);

  // ── Zone / Quest ──────────────────────────────────────────────────────────
  const openZone   = useCallback((zone)  => patch({ activeZone: zone }),   [patch]);
  const closeZone  = useCallback(()      => patch({ activeZone: null }),    [patch]);
  const openQuest  = useCallback((quest) => patch({ activeQuest: quest }),  [patch]);
  const closeQuest = useCallback(()      => patch({ activeQuest: null }),   [patch]);

  // ── Complete Quest ────────────────────────────────────────────────────────
  const completeQuest = useCallback((quest, bonusKP = 0) => {
    setState((prev) => {
      const { stats: newStats, leveledUp } = GameEngine.applyQuestReward(
        prev.userStats,
        quest,
        bonusKP,
      );

      const completedQuests = new Set(prev.completedQuests);
      completedQuests.add(quest.id);

      return {
        ...prev,
        activeQuest:    null,
        activeZone:     null,
        completedQuests,
        userStats:      newStats,
        showLevelUp:    leveledUp,
        levelUpData:    leveledUp
          ? { level: newStats.level, title: newStats.title }
          : prev.levelUpData,
        notification: `🎉 أحسنت! +${quest.kp + bonusKP} KP و +${quest.xp} XP`,
      };
    });

    setTimeout(() => patch({ notification: null }), 3000);
  }, [patch]);

  // ── Level-up modal ────────────────────────────────────────────────────────
  const setShowLevelUp = useCallback((val) => patch({ showLevelUp: val }), [patch]);

  // ── Avatar customisation ──────────────────────────────────────────────────
  const setAvatarColor = useCallback((color) => {
    setState((prev) => ({
      ...prev,
      avatarTheme:  { ...prev.avatarTheme, bg: color },
      notification: '🎨 تم تغيير اللون!',
    }));
    setTimeout(() => patch({ notification: null }), 3000);
  }, [patch]);

  const setAvatarAccessory = useCallback((accessory) => {
    setState((prev) => ({
      ...prev,
      avatarTheme:  { ...prev.avatarTheme, accessory },
      notification: '✅ تم حفظ التغيير!',
    }));
    setTimeout(() => patch({ notification: null }), 3000);
  }, [patch]);

  // ── Tutorial ──────────────────────────────────────────────────────────────
  const finishTutorial = useCallback(() => patch({ showTutorial: false }), [patch]);

  // ── Daily Reward ──────────────────────────────────────────────────────────
  const claimDailyReward = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showDailyReward: false,
      userStats:       {
        ...prev.userStats,
        kp: prev.userStats.kp + GameEngine.DAILY_REWARD_KP,
      },
      notification: `🎁 استلمت هديتك اليومية! +${GameEngine.DAILY_REWARD_KP} KP`,
    }));
    setTimeout(() => patch({ notification: null }), 3000);
  }, [patch]);

  // ── Donate ────────────────────────────────────────────────────────────────
  const handleDonate = useCallback((amount) => {
    setState((prev) => ({
      ...prev,
      userStats: {
        ...prev.userStats,
        kp:          Math.max(0, prev.userStats.kp - amount),
        impactScore: prev.userStats.impactScore + amount * 2,
      },
      notification: `💖 تبرعت بـ ${amount} KP!`,
    }));
    setTimeout(() => patch({ notification: null }), 3000);
  }, [patch]);

  return {
    state,
    actions: {
      login,
      setActiveTab,
      openZone,
      closeZone,
      openQuest,
      closeQuest,
      completeQuest,
      notify,
      setShowLevelUp,
      setAvatarColor,
      setAvatarAccessory,
      finishTutorial,
      claimDailyReward,
      handleDonate,
    },
  };
}
