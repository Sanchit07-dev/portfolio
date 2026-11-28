// ─────────────────────────────────────────────
// REAL ASSET LOADING SCREEN & TRANSITION
// Uses @react-three/drei useProgress to reflect real loading progress
// ─────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Sparkles, Compass, Shield } from 'lucide-react';

const TIPS = [
  "Tip: Press 'R' at any time to instantly teleport back to the nearest safe ground.",
  "Tip: Hold Shift to sprint across the expansive zones.",
  "Tip: Drag with the mouse or touch screen to orbit your third-person view.",
  "Tip: Inspect chests and talk with NPCs to discover Sanchit's full-stack projects.",
  "Tip: Switch to Classic View in the top-right hotbar for a streamlined website layout."
];

export function LoadingScreen() {
  const { active, progress, loaded, total } = useProgress();
  const gameState = useGameStore((state) => state.gameState);
  const finishLoading = useGameStore((state) => state.finishLoading);
  const [tipIndex, setTipIndex] = useState(0);

  // Cycle tips every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // When assets are 100% loaded, transition from 'loading' to 'menu'
  useEffect(() => {
    if (progress >= 100 && !active && gameState === 'loading') {
      const timeout = setTimeout(() => {
        finishLoading();
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [progress, active, gameState, finishLoading]);

  if (gameState !== 'loading') return null;

  const displayProgress = Math.min(100, Math.round(progress || 0));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-[#0C0A09] text-white select-none pointer-events-auto"
      >
        {/* Top Header Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-widest mt-4">
          <Sparkles size={14} />
          <span>Interactive 3D Portfolio</span>
        </div>

        {/* Center Title & Crest */}
        <div className="flex flex-col items-center text-center max-w-md w-full space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 flex items-center justify-center border-2 border-amber-300 shadow-2xl">
            <Compass size={32} className="text-white animate-spin-slow" />
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              DEVELOPER <span className="text-orange-500">QUEST</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-medium">
              Initializing Rapier Physics & Biome Realm
            </p>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full space-y-2 pt-4">
            <div className="w-full h-2.5 rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden relative shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${displayProgress}%` }}
                transition={{ ease: 'easeOut', duration: 0.3 }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 px-1">
              <span>{loaded > 0 ? `${loaded}/${total} assets loaded` : "Loading shaders & textures..."}</span>
              <span className="font-bold text-amber-400">{displayProgress}%</span>
            </div>
          </div>
        </div>

        {/* Bottom Lore & Tip */}
        <div className="max-w-md text-center space-y-2 mb-4">
          <p className="text-xs sm:text-sm text-neutral-300 font-medium italic min-h-[3rem] flex items-center justify-center px-4">
            "{TIPS[tipIndex]}"
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
            <Shield size={12} className="text-amber-500" />
            <span>Sanchit Baviskar • Full-Stack Developer</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
