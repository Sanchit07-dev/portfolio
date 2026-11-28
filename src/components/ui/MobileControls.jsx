// ─────────────────────────────────────────────
// ON-SCREEN TOUCH JOYSTICK & CONTROLS FOR MOBILE / TABLET
// ─────────────────────────────────────────────

import React, { useRef, useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

export function MobileControls() {
  const gameMode = useGameStore((state) => state.gameMode);
  const triggerInteract = useGameStore((state) => state.triggerInteract);
  const nearbyInteractable = useGameStore((state) => state.nearbyInteractable);

  if (gameMode !== 'playing') return null;

  const simulateKey = (code, isDown) => {
    const eventType = isDown ? 'keydown' : 'keyup';
    window.dispatchEvent(new KeyboardEvent(eventType, { code }));
  };

  return (
    <div className="sm:hidden absolute inset-0 pointer-events-none z-30 flex flex-col justify-end p-4">
      <div className="flex items-end justify-between w-full">
        {/* Directional Pad */}
        <div className="pointer-events-auto grid grid-cols-3 gap-1.5 w-36 h-36 bg-white/70 backdrop-blur-md p-2 rounded-2xl border border-neutral-200/80 shadow-card">
          <div />
          <button
            onTouchStart={() => simulateKey('KeyW', true)}
            onTouchEnd={() => simulateKey('KeyW', false)}
            className="rounded-xl bg-white active:bg-orange-500 active:text-white border border-neutral-200 flex items-center justify-center font-bold text-sm text-neutral-700 shadow-sm"
          >
            W
          </button>
          <div />
          <button
            onTouchStart={() => simulateKey('KeyA', true)}
            onTouchEnd={() => simulateKey('KeyA', false)}
            className="rounded-xl bg-white active:bg-orange-500 active:text-white border border-neutral-200 flex items-center justify-center font-bold text-sm text-neutral-700 shadow-sm"
          >
            A
          </button>
          <button
            onTouchStart={() => simulateKey('KeyS', true)}
            onTouchEnd={() => simulateKey('KeyS', false)}
            className="rounded-xl bg-white active:bg-orange-500 active:text-white border border-neutral-200 flex items-center justify-center font-bold text-sm text-neutral-700 shadow-sm"
          >
            S
          </button>
          <button
            onTouchStart={() => simulateKey('KeyD', true)}
            onTouchEnd={() => simulateKey('KeyD', false)}
            className="rounded-xl bg-white active:bg-orange-500 active:text-white border border-neutral-200 flex items-center justify-center font-bold text-sm text-neutral-700 shadow-sm"
          >
            D
          </button>
        </div>

        {/* Action Buttons: Jump & Interact */}
        <div className="pointer-events-auto flex flex-col gap-2.5 items-end">
          {nearbyInteractable && (
            <button
              onClick={triggerInteract}
              className="w-14 h-14 rounded-2xl bg-orange-600 active:bg-orange-700 text-white font-bold text-base shadow-xl flex items-center justify-center border-2 border-white"
            >
              E
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onTouchStart={() => simulateKey('ShiftLeft', true)}
              onTouchEnd={() => simulateKey('ShiftLeft', false)}
              className="w-12 h-12 rounded-xl bg-white/80 active:bg-neutral-800 active:text-white border border-neutral-200 text-xs font-bold text-neutral-700 shadow-card flex items-center justify-center"
            >
              Run
            </button>
            <button
              onTouchStart={() => simulateKey('Space', true)}
              onTouchEnd={() => simulateKey('Space', false)}
              className="w-14 h-14 rounded-2xl bg-white/90 active:bg-orange-500 active:text-white border border-neutral-200 text-xs font-bold text-neutral-800 shadow-card flex items-center justify-center"
            >
              Jump
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
