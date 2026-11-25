// ─────────────────────────────────────────────
// GAME STORE (ZUSTAND)
// Central reactive state for 3D navigation, quests, inventory, UI modes
// ─────────────────────────────────────────────

import { create } from 'zustand';
import { QUESTS, COLLECTIBLES, WORLD_LOCATIONS, DEVELOPER_PROFILE } from '../data/gameData';
import { soundManager } from '../utils/soundManager';

const STORAGE_KEY = 'dev_quest_save_state_v1';

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

const saved = loadSavedState();

export const useGameStore = create((set, get) => ({
  // Core game flow state
  gameMode: 'intro', // 'intro' | 'cinematic' | 'playing' | 'classic'
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
  graphicsQuality: 'high', // 'high' | 'low'
  touchControls: false,

  // Actions
  setGameMode: (mode) => set({ gameMode: mode }),
  
  startAdventure: () => {
    soundManager.init();
    soundManager.startAmbientMusic();
    set({ gameMode: 'playing', ambientStarted: true });
    soundManager.playInteract();
  },

  switchToClassic: () => {
    soundManager.stopAmbientMusic();
    set({ gameMode: 'classic', activeModal: null, isPaused: false });
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
    const locationId = nearby.locationId || nearby.id;
    get().openModal(locationId, nearby.data);

    // Check if this fulfills a quest
    get().checkQuestProgress(locationId);
  },

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

  setGraphicsQuality: (quality) => set({ graphicsQuality: quality })
}));
