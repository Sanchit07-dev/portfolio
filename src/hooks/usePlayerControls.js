// ─────────────────────────────────────────────
// PLAYER CONTROLS HOOK
// Listens to WASD, Arrow keys, Shift, Space, E, Esc with cross-platform support
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

const IDLE_MOVEMENT = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  sprint: false,
};

export function usePlayerControls() {
  const [movement, setMovement] = useState(IDLE_MOVEMENT);

  const gameMode = useGameStore((state) => state.gameMode);
  const triggerInteract = useGameStore((state) => state.triggerInteract);
  const setPaused = useGameStore((state) => state.setPaused);
  const isPaused = useGameStore((state) => state.isPaused);
  const activeModal = useGameStore((state) => state.activeModal);
  const activePanel = useGameStore((state) => state.activePanel);
  const closeModal = useGameStore((state) => state.closeModal);
  const closePanel = useGameStore((state) => state.closePanel);

  useEffect(() => {
    // Disable game controls while intro overlay, classic view, or modals are active
    if (gameMode !== 'playing') {
      setMovement(IDLE_MOVEMENT);
      return undefined;
    }

    const handleKeyDown = (e) => {
      // Don't capture keys if typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.code === 'Escape') {
        if (activeModal) {
          closeModal();
        } else if (activePanel) {
          closePanel();
        } else {
          setPaused(!isPaused);
        }
        return;
      }

      // Ignore movement/interaction keys while paused or modal/panel open
      if (isPaused || activeModal || activePanel) return;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovement((m) => ({ ...m, forward: true }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMovement((m) => ({ ...m, backward: true }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMovement((m) => ({ ...m, left: true }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMovement((m) => ({ ...m, right: true }));
          break;
        case 'Space':
          e.preventDefault();
          setMovement((m) => ({ ...m, jump: true }));
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          setMovement((m) => ({ ...m, sprint: true }));
          break;
        case 'KeyE':
          triggerInteract();
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setMovement((m) => ({ ...m, forward: false }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setMovement((m) => ({ ...m, backward: false }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setMovement((m) => ({ ...m, left: false }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setMovement((m) => ({ ...m, right: false }));
          break;
        case 'Space':
          setMovement((m) => ({ ...m, jump: false }));
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          setMovement((m) => ({ ...m, sprint: false }));
          break;
        default:
          break;
      }
    };

    const handleBlur = () => {
      setMovement(IDLE_MOVEMENT);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [gameMode, triggerInteract, setPaused, isPaused, activeModal, activePanel, closeModal, closePanel]);

  return movement;
}
