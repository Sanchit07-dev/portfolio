// ─────────────────────────────────────────────
// GAME STORE (ZUSTAND)
// Central reactive state for 3D navigation, quests, inventory, UI modes
// ─────────────────────────────────────────────

import { create } from 'zustand';
import { QUESTS, COLLECTIBLES, WORLD_LOCATIONS, DEVELOPER_PROFILE, existingProjects } from '../data/gameData';
import { soundManager } from '../utils/soundManager';
import { ACHIEVEMENTS, ZONE_IDS } from '../data/achievements';
import { CAR_COLORS, HORNS, SECRETS, TRAILS, VEHICLE, prefersLightweightDevice } from '../config/toyWorld';

const STORAGE_KEY = 'dev_quest_save_state_v1';
const TOY_KEY = 'toy_world_save_v1';
const VIEW_KEY = 'portfolio_view_pref';

// Load saved progress if available
const loadSavedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // LocalStorage unavailable
  }
  return null;
};

const loadToy = () => {
  try {
    const raw = localStorage.getItem(TOY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
};

// ── Save migration ──
// Every save carries a version. Known shapes are salvaged field-by-field so
// quest/collectible progress survives; unknown or corrupt shapes are reset.
const SAVE_VERSION = 2;
const TOY_VERSION = 2;

function migrateSaveState(parsed, targetVersion) {
  if (parsed === null || parsed === undefined) return null;
  const wipe = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    return null;
  };
  if (typeof parsed !== 'object' || Array.isArray(parsed)) return wipe();
  const version = Number(parsed.version) || 1;
  if (version > targetVersion) return wipe();

  const validQuest = (q) => q && typeof q.id === 'string' && typeof q.title === 'string'
    && typeof q.completed === 'boolean' && typeof q.reward === 'string';
  const validCollectible = (c) => c && typeof c.id === 'string' && typeof c.name === 'string'
    && Array.isArray(c.position) && c.position.length === 3 && c.position.every(Number.isFinite);

  const questsOk = Array.isArray(parsed.quests) && parsed.quests.every(validQuest);
  const collectiblesOk = Array.isArray(parsed.collectibles) && parsed.collectibles.every(validCollectible);

  // Salvage progress by id when a field's shape is outdated, so completed
  // quests and found collectibles survive a schema change where possible.
  const completedQuestIds = new Set(
    Array.isArray(parsed.quests)
      ? parsed.quests.filter((q) => q && typeof q.id === 'string' && q.completed === true).map((q) => q.id)
      : []
  );
  const collectedIds = new Set(
    Array.isArray(parsed.collectibles)
      ? parsed.collectibles.filter((c) => c && typeof c.id === 'string' && c.collected === true).map((c) => c.id)
      : []
  );

  const migrated = {
    version: targetVersion,
    quests: questsOk
      ? parsed.quests
      : QUESTS.map((q) => ({ ...q, completed: completedQuestIds.has(q.id) })),
    activeQuestId: typeof parsed.activeQuestId === 'string' ? parsed.activeQuestId : 'q1',
    completedQuests: Array.isArray(parsed.completedQuests)
      ? parsed.completedQuests.filter((id) => typeof id === 'string')
      : [],
    collectibles: collectiblesOk
      ? parsed.collectibles
      : COLLECTIBLES.map((c) => ({ ...c, collected: collectedIds.has(c.id) })),
    inventory: Array.isArray(parsed.inventory) ? parsed.inventory.filter(Boolean) : [],
    totalXP: Number.isFinite(parsed.totalXP) ? parsed.totalXP : 0,
  };
  if (version !== targetVersion || !questsOk || !collectiblesOk) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated)); } catch {}
  }
  return migrated;
}

function migrateToyState(parsed, targetVersion) {
  if (parsed === null || parsed === undefined) return null;
  const wipe = () => {
    try { localStorage.removeItem(TOY_KEY); } catch {}
    return null;
  };
  if (typeof parsed !== 'object' || Array.isArray(parsed)) return wipe();
  const version = Number(parsed.version) || 1;
  if (version > targetVersion) return wipe();

  const strArr = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);
  const migrated = {
    version: targetVersion,
    visitedZones: strArr(parsed.visitedZones),
    openedProjects: strArr(parsed.openedProjects),
    foundSecrets: strArr(parsed.foundSecrets),
    honkCount: Number.isFinite(parsed.honkCount) ? parsed.honkCount : 0,
    didFlip: parsed.didFlip === true,
    pinsCleared: parsed.pinsCleared === true,
    konamiFound: parsed.konamiFound === true,
    unlockedAchievements: strArr(parsed.unlockedAchievements),
    carColorId: typeof parsed.carColorId === 'string' ? parsed.carColorId : 'amber',
    trailId: typeof parsed.trailId === 'string' ? parsed.trailId : 'none',
    hornId: typeof parsed.hornId === 'string' ? parsed.hornId : 'beep',
    circuitBestMs: Number.isFinite(parsed.circuitBestMs) ? parsed.circuitBestMs : null,
  };
  if (version !== targetVersion) {
    try { localStorage.setItem(TOY_KEY, JSON.stringify(migrated)); } catch {}
  }
  return migrated;
}

const saved = migrateSaveState(loadSavedState(), SAVE_VERSION);
const toySaved = migrateToyState(loadToy(), TOY_VERSION);

const initialView = (() => {
  try {
    const pref = localStorage.getItem(VIEW_KEY);
    if (pref === 'classic') return 'classic';
    if (pref === '3d') return 'intro';
  } catch {
    // ignore
  }
  return prefersLightweightDevice() ? 'classic' : 'intro';
})();

const lightweight = prefersLightweightDevice();

function rememberView(mode) {
  try {
    localStorage.setItem(VIEW_KEY, mode === 'classic' ? 'classic' : '3d');
  } catch {
    // ignore
  }
}

export const useGameStore = create((set, get) => ({
  // Core game flow state
  gameMode: initialView, // 'intro' | 'cinematic' | 'playing' | 'classic'
  isPaused: false,
  activeModal: null, // null | 'house' | 'skills' | 'castle' | 'mountain' | 'tower' | 'project-detail' | 'inventory' | 'quests' | 'map'
  activeProject: null,
  
  // Audio state
  isMuted: false,
  ambientStarted: false,

  // Player position & movement
  playerPos: [0, 0, 0],
  playerRotation: 0,
  currentLocation: WORLD_LOCATIONS[0],
  nearbyInteractable: null, // { id, name, type, actionText, data }

  // Quests & progress
  quests: saved?.quests || QUESTS,
  activeQuestId: saved?.activeQuestId || 'q1',
  completedQuests: saved?.completedQuests || [],
  questNotification: null, // { title, message }

  // Inventory & Collectibles
  collectibles: saved?.collectibles || COLLECTIBLES,
  inventory: saved?.inventory || [],
  totalXP: saved?.totalXP || 0,
  level: DEVELOPER_PROFILE.level,

  // UI settings
  graphicsQuality: lightweight ? 'low' : 'high', // 'high' | 'medium' | 'low'
  touchControls: false,
  movementMode: 'drive', // 'drive' | 'walk'
  reduceMotion: false,
  lockTime: false,
  timeOfDay: 0.32,
  showPlayerCard: false,
  showQuestTracker: false,
  activePanel: null,
  suggestLightweight: lightweight,
  bootProgress: 12,
  visitedZones: toySaved?.visitedZones || [],
  openedProjects: toySaved?.openedProjects || [],
  foundSecrets: toySaved?.foundSecrets || [],
  honkCount: toySaved?.honkCount || 0,
  didFlip: toySaved?.didFlip || false,
  pinsCleared: toySaved?.pinsCleared || false,
  konamiFound: toySaved?.konamiFound || false,
  unlockedAchievements: toySaved?.unlockedAchievements || [],
  carColorId: toySaved?.carColorId || 'amber',
  trailId: toySaved?.trailId || 'none',
  hornId: toySaved?.hornId || 'beep',
  circuitBestMs: toySaved?.circuitBestMs || null,
  circuitRun: null,
  toasts: [],
  respawnNonce: 0,
  resetNonce: 0,
  teleportTo: null,
  konamiNonce: 0,

  // 3D scene health — set by SceneErrorBoundary, shown by the DOM fallback
  sceneError: null,
  sceneNonce: 0,

  // Actions
  setGameMode: (mode) => set({ gameMode: mode }),

  reportSceneError: (message) => set({ sceneError: message }),
  retryScene: () => set({ sceneError: null, sceneNonce: get().sceneNonce + 1 }),
  
  startAdventure: () => {
    // Audio is optional — never let a failure here block the game from starting
    try {
      soundManager.init();
      soundManager.startAmbientMusic();
      soundManager.startEngine();
    } catch {
      // Audio unavailable or blocked
    }
    rememberView('3d');
    set({ gameMode: 'playing', ambientStarted: true, activePanel: null, isPaused: false, sceneError: null });
    try {
      soundManager.playInteract();
    } catch {
      // Ignore
    }
  },

  enterWorldPreview: () => {
    rememberView('3d');
    set({ gameMode: 'intro', activeModal: null, activePanel: null, isPaused: false });
  },

  switchToClassic: () => {
    try {
      soundManager.stopAmbientMusic();
      soundManager.stopEngine();
    } catch {
      // Audio may not be initialized
    }
    rememberView('classic');
    set({ gameMode: 'classic', activeModal: null, activePanel: null, isPaused: false, sceneError: null });
  },

  setPaused: (isPaused) => {
    soundManager.playClick();
    set({ isPaused });
  },

  toggleAudio: () => {
    soundManager.init();
    const muted = soundManager.toggleMute();
    set({ isMuted: muted });
  },

  setPlayerPos: (pos) => set({ playerPos: pos }),
  setPlayerRotation: (rot) => set({ playerRotation: rot }),
  
  setCurrentLocation: (loc) => {
    if (get().currentLocation?.id !== loc.id) {
      set({ currentLocation: loc });
    }
  },

  setNearbyInteractable: (interactable) => set({ nearbyInteractable: interactable }),

  openModal: (modalId, projectData = null) => {
    soundManager.playInteract();
    set({ activeModal: modalId, activeProject: projectData, isPaused: true });
  },

  closeModal: () => {
    soundManager.playClick();
    set({ activeModal: null, activeProject: null, isPaused: false });
  },

  triggerInteract: () => {
    const nearby = get().nearbyInteractable;
    if (!nearby) return;

    soundManager.playInteract();

    if (nearby.type === 'project') {
      get().openProject(nearby.data);
      return;
    }
    if (nearby.type === 'whispers') {
      get().openPanel('whispers');
      return;
    }
    if (nearby.type === 'zone') {
      get().visitZone(nearby.zoneId);
    }

    const locationId = nearby.locationId || nearby.id;
    if (locationId === 'testimonials') {
      get().openPanel('testimonials');
      return;
    }
    get().openModal(locationId, nearby.data);
    get().checkQuestProgress(locationId);
  },

  openPanel: (panel) => {
    soundManager.playClick();
    set({ activePanel: panel, isPaused: true });
  },

  closePanel: () => {
    soundManager.playClick();
    set({ activePanel: null, isPaused: false });
  },

  togglePanel: (panel) => {
    if (get().activePanel === panel) get().closePanel();
    else get().openPanel(panel);
  },

  setMovementMode: (movementMode) => {
    soundManager.playClick();
    set({ movementMode });
  },

  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
  setLockTime: (lockTime) => set({ lockTime }),
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  setShowPlayerCard: (showPlayerCard) => set({ showPlayerCard }),
  setShowQuestTracker: (showQuestTracker) => set({ showQuestTracker }),
  setBootProgress: (bootProgress) => set({ bootProgress }),

  toast: (message) => {
    const id = `${Date.now()}-${Math.random()}`;
    set({ toasts: [...get().toasts, { id, message }].slice(-4) });
    setTimeout(() => {
      set({ toasts: get().toasts.filter((item) => item.id !== id) });
    }, 3600);
  },

  saveToy: () => {
    try {
      const state = get();
      localStorage.setItem(TOY_KEY, JSON.stringify({
        version: TOY_VERSION,
        visitedZones: state.visitedZones,
        openedProjects: state.openedProjects,
        foundSecrets: state.foundSecrets,
        honkCount: state.honkCount,
        didFlip: state.didFlip,
        pinsCleared: state.pinsCleared,
        konamiFound: state.konamiFound,
        unlockedAchievements: state.unlockedAchievements,
        carColorId: state.carColorId,
        trailId: state.trailId,
        hornId: state.hornId,
        circuitBestMs: state.circuitBestMs,
      }));
    } catch {
      // ignore
    }
  },

  evaluateAchievements: () => {
    const state = get();
    const have = new Set(state.unlockedAchievements);
    const checks = {
      zones: ZONE_IDS.every((id) => state.visitedZones.includes(id)),
      projects: existingProjects.every((project) => state.openedProjects.includes(project.id)),
      honk: state.honkCount >= 10,
      flip: state.didFlip,
      secrets: SECRETS.every((secret) => state.foundSecrets.includes(secret.id)) && state.konamiFound,
      pins: state.pinsCleared,
    };
    let changed = false;
    let xp = state.totalXP;
    for (const achievement of ACHIEVEMENTS) {
      if (have.has(achievement.id) || !checks[achievement.id]) continue;
      have.add(achievement.id);
      changed = true;
      xp += achievement.xp;
      get().toast(`${achievement.title} — ${achievement.description}`);
      soundManager.playQuestComplete();
    }
    if (changed) {
      set({ unlockedAchievements: [...have], totalXP: xp });
      get().saveToy();
      get().saveProgress();
    }
  },

  visitZone: (zoneId) => {
    if (!zoneId || get().visitedZones.includes(zoneId)) return;
    set({ visitedZones: [...get().visitedZones, zoneId] });
    get().saveToy();
    get().evaluateAchievements();
  },

  openProject: (project) => {
    if (!project) return;
    const opened = get().openedProjects.includes(project.id)
      ? get().openedProjects
      : [...get().openedProjects, project.id];
    set({
      openedProjects: opened,
      activeProject: project,
      activePanel: 'case-study',
      isPaused: true,
    });
    get().saveToy();
    get().checkQuestProgress('castle');
    get().evaluateAchievements();
  },

  findSecret: (id) => {
    if (get().foundSecrets.includes(id)) return;
    set({ foundSecrets: [...get().foundSecrets, id] });
    get().toast('You found a quiet corner.');
    soundManager.playCollect();
    get().saveToy();
    get().evaluateAchievements();
  },

  registerHonk: () => {
    set({ honkCount: get().honkCount + 1 });
    soundManager.playHorn(get().hornId);
    if (get().honkCount % 5 === 0) get().saveToy();
    get().evaluateAchievements();
  },

  registerFlip: () => {
    if (get().didFlip) return;
    set({ didFlip: true });
    get().toast('The car went all the way over.');
    get().saveToy();
    get().evaluateAchievements();
  },

  registerPins: () => {
    if (get().pinsCleared) return;
    set({ pinsCleared: true });
    get().toast('Every pin is down.');
    get().saveToy();
    get().evaluateAchievements();
  },

  triggerKonami: () => {
    set({ konamiFound: true, konamiNonce: get().konamiNonce + 1 });
    get().toast('A giant ball rolled into the square.');
    soundManager.playCollect();
    get().saveToy();
    get().evaluateAchievements();
  },

  setReward: (key, id) => {
    const unlocked = new Set(get().unlockedAchievements);
    const table = key === 'carColorId' ? CAR_COLORS : key === 'trailId' ? TRAILS : HORNS;
    const item = table.find((entry) => entry.id === id);
    if (!item || (item.unlock && !unlocked.has(item.unlock))) return;
    set({ [key]: id });
    get().saveToy();
  },

  noteCircuitStart: (now) => set({ circuitRun: { startedAt: now, nextIndex: 1 } }),
  noteCircuitGate: (index, now) => {
    const run = get().circuitRun;
    if (!run || run.nextIndex !== index) return;
    if (index >= 5) {
      const ms = now - run.startedAt;
      const best = get().circuitBestMs == null ? ms : Math.min(get().circuitBestMs, ms);
      set({ circuitRun: null, circuitBestMs: best });
      get().toast(`Lap ${ (ms / 1000).toFixed(2) }s`);
      get().saveToy();
    } else {
      set({ circuitRun: { ...run, nextIndex: index + 1 } });
    }
  },
  clearCircuit: () => set({ circuitRun: null }),

  requestRespawn: () => set({ respawnNonce: get().respawnNonce + 1, isPaused: false, activePanel: null }),
  requestResetWorld: () => set({
    resetNonce: get().resetNonce + 1,
    teleportTo: [...VEHICLE.spawn],
    respawnNonce: get().respawnNonce + 1,
  }),
  requestTeleport: (position) => set({
    teleportTo: position,
    respawnNonce: get().respawnNonce + 1,
    activePanel: null,
    isPaused: false,
  }),

  collectItem: (id) => {
    const { collectibles, inventory, totalXP } = get();
    const item = collectibles.find((c) => c.id === id);
    if (!item || item.collected) return;

    soundManager.playCollect();
    const updatedCollectibles = collectibles.map((c) =>
      c.id === id ? { ...c, collected: true } : c
    );
    const updatedInventory = [...inventory, item];
    const newXP = totalXP + 50;

    set({
      collectibles: updatedCollectibles,
      inventory: updatedInventory,
      totalXP: newXP,
      questNotification: {
        title: 'Artifact Found!',
        message: `Discovered [${item.name}] (+50 XP)`
      }
    });

    get().saveProgress();

    setTimeout(() => {
      if (get().questNotification?.title === 'Artifact Found!') {
        set({ questNotification: null });
      }
    }, 4000);
  },

  checkQuestProgress: (locationId) => {
    const { quests, completedQuests, totalXP } = get();
    const currentQuest = quests.find((q) => q.targetLocation === locationId && !q.completed);
    
    if (currentQuest) {
      soundManager.playQuestComplete();
      const updatedQuests = quests.map((q) =>
        q.id === currentQuest.id ? { ...q, completed: true } : q
      );
      const newCompleted = [...completedQuests, currentQuest.id];
      const nextQuest = updatedQuests.find((q) => !q.completed);
      const newXP = totalXP + 100;

      set({
        quests: updatedQuests,
        completedQuests: newCompleted,
        activeQuestId: nextQuest ? nextQuest.id : null,
        totalXP: newXP,
        questNotification: {
          title: 'Quest Completed!',
          message: `${currentQuest.title} - ${currentQuest.reward}`
        }
      });

      get().saveProgress();

      setTimeout(() => {
        set({ questNotification: null });
      }, 5000);
    }
  },

  saveProgress: () => {
    try {
      const state = {
        version: SAVE_VERSION,
        quests: get().quests,
        completedQuests: get().completedQuests,
        activeQuestId: get().activeQuestId,
        collectibles: get().collectibles,
        inventory: get().inventory,
        totalXP: get().totalXP
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore
    }
  },

  resetProgress: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    set({
      quests: QUESTS,
      completedQuests: [],
      activeQuestId: 'q1',
      collectibles: COLLECTIBLES,
      inventory: [],
      totalXP: 0,
      questNotification: {
        title: 'Progress Reset',
        message: 'Your quest logs and relics have been renewed.'
      }
    });
    setTimeout(() => set({ questNotification: null }), 3000);
  },

  setGraphicsQuality: (quality) => set({ graphicsQuality: quality }),
}));
