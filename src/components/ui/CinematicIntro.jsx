// ─────────────────────────────────────────────
// CINEMATIC OPENING OVERLAY & PAUSE MENU
// Title: DEVELOPER QUEST
// Tagline: "Explore the World. Discover the Developer."
// Buttons: [ START ADVENTURE ] [ VIEW PORTFOLIO ]
// ─────────────────────────────────────────────

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { DEVELOPER_PROFILE } from '../../data/gameData';
import { Play, Eye, RotateCcw, Volume2, VolumeX, X, HelpCircle, Sparkles } from 'lucide-react';

export function CinematicIntro() {
  const gameState = useGameStore((state) => state.gameState);
  const gameMode = useGameStore((state) => state.gameMode);
  const startAdventure = useGameStore((state) => state.startAdventure);
  const switchToClassic = useGameStore((state) => state.switchToClassic);

  // Show intro only when in 'menu' state and not during initial asset loading
  if (gameState === 'loading' || (gameState !== 'menu' && gameMode !== 'intro')) return null;

  const handleStartClick = () => {
    startAdventure();
  };

  const handlePortfolioClick = () => {
    switchToClassic();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4 bg-gradient-to-b from-neutral-950/80 via-neutral-900/70 to-neutral-950/90 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-xl w-full text-center space-y-6"
      >
        {/* Game Title Crest */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold tracking-widest uppercase">
          <Sparkles size={14} />
          <span>Interactive 3D Portfolio</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase">
            DEVELOPER <span className="text-orange-500">QUEST</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 font-medium max-w-md mx-auto">
            "Every Developer Has a Story. This Is Mine."
          </p>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
            Explore my world, discover my skills, and inspect what I've built.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-neutral-400 font-medium">
          <span className="px-2.5 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700/60">
            Open World RPG
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700/60">
            Third-Person WASD
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700/60">
            Interactive Chests
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={handleStartClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-accent transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play size={16} fill="white" />
            <span>START ADVENTURE</span>
          </button>

          <button
            type="button"
            onClick={handlePortfolioClick}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white border border-neutral-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Eye size={16} />
            <span>VIEW PORTFOLIO</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function PauseMenu() {
  const gameState = useGameStore((state) => state.gameState);
  const isPaused = useGameStore((state) => state.isPaused);
  const activeModal = useGameStore((state) => state.activeModal);
  const setPaused = useGameStore((state) => state.setPaused);
  const switchToClassic = useGameStore((state) => state.switchToClassic);
  const openModal = useGameStore((state) => state.openModal);
  const isMuted = useGameStore((state) => state.isMuted);
  const toggleAudio = useGameStore((state) => state.toggleAudio);
  const graphicsQuality = useGameStore((state) => state.graphicsQuality);
  const setGraphicsQuality = useGameStore((state) => state.setGraphicsQuality);
  const respawnPlayer = useGameStore((state) => state.respawnPlayer);

  // If a modal (like castle or skills) is open, modal handles itself
  if ((!isPaused && gameState !== 'paused') || activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="max-w-sm w-full bg-white rounded-3xl border border-neutral-200 shadow-2xl p-6 space-y-5"
      >
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="font-bold text-base text-neutral-900">Game Paused</h3>
          <button
            onClick={() => setPaused(false)}
            className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200"
          >
            <X size={15} />
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setPaused(false)}
            className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-colors"
          >
            Resume Adventure
          </button>

          <button
            onClick={() => openModal('quests')}
            className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-colors"
          >
            Quest Journal
          </button>

          <button
            onClick={() => openModal('inventory')}
            className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-colors"
          >
            Adventurer Inventory
          </button>

          <button
            onClick={() => respawnPlayer()}
            className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-500/30 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw size={14} className="text-amber-600" />
            <span>I'm Stuck (Respawn - R)</span>
          </button>

          <button
            onClick={switchToClassic}
            className="w-full py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-semibold text-xs transition-colors"
          >
            Switch to Classic View
          </button>
        </div>

        {/* Audio & Graphics settings */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
          <button
            onClick={toggleAudio}
            className="flex items-center gap-1.5 font-medium hover:text-orange-600"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isMuted ? 'Muted' : 'Audio On'}</span>
          </button>

          <button
            onClick={() => setGraphicsQuality(graphicsQuality === 'high' ? 'low' : 'high')}
            className="font-medium hover:text-orange-600"
          >
            Quality: <span className="font-bold uppercase">{graphicsQuality}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
