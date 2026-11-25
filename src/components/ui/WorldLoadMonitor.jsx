// ─────────────────────────────────────────────
// WORLD LOAD MONITOR
// Shows real loading progress from the three.js loading manager and a hard
// 15s timeout escape hatch, so loading can never hang forever with no way out.
// ─────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { useGameStore } from '../../store/gameStore';

export function WorldLoadMonitor() {
  const { active, progress } = useProgress();
  const gameMode = useGameStore((state) => state.gameMode);
  const setBootProgress = useGameStore((state) => state.setBootProgress);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    setBootProgress(Math.round(progress));
  }, [progress, setBootProgress]);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  if (gameMode !== 'intro' && gameMode !== 'playing') return null;
  if (!active || progress >= 100) return null;

  return (
    <div
      data-testid="world-loading-overlay"
      className="absolute inset-x-0 bottom-24 z-30 flex flex-col items-center gap-2 px-4 pointer-events-none"
    >
      <div className="w-56 h-1.5 rounded-full bg-neutral-800/80 overflow-hidden border border-neutral-700/60">
        <div
          className="h-full bg-orange-500 transition-all duration-300"
          style={{ width: `${Math.max(8, Math.round(progress))}%` }}
        />
      </div>
      <p className="text-[11px] font-semibold text-neutral-300 tracking-wide uppercase">
        Building world… {Math.round(progress)}%
      </p>
      {timedOut && (
        <div
          data-testid="world-loading-timeout"
          className="pointer-events-auto flex items-center gap-3 rounded-xl bg-neutral-900/90 border border-neutral-700 px-4 py-2.5"
        >
          <span className="text-[11px] text-neutral-300">Still loading — something may be stuck.</span>
          <TimeoutEscapeButton />
        </div>
      )}
    </div>
  );
}

function TimeoutEscapeButton() {
  const switchToClassic = useGameStore((state) => state.switchToClassic);
  return (
    <button
      onClick={switchToClassic}
      data-testid="loading-switch-classic-button"
      className="text-[11px] font-bold text-orange-400 hover:text-orange-300 transition-colors"
    >
      Switch to Classic View
    </button>
  );
}