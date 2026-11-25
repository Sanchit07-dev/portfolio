// ─────────────────────────────────────────────
// PLAYER CONTROLS HOOK
// Listens to WASD, Arrow keys, Shift, Space, E, Esc with cross-platform support
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export function usePlayerControls() {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
  });

  const triggerInteract = useGameStore((state) => state.triggerInteract);
  const setPaused = useGameStore((state) => state.setPaused);
  const isPaused = useGameStore((state) => state.isPaused);
  const activeModal = useGameStore((state) => state.activeModal);
  const closeModal = useGameStore((state) => state.closeModal);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't capture keys if typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

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
        case 'Escape':
          if (activeModal) {
            closeModal();
          } else {
            setPaused(!isPaused);
          }
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

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerInteract, setPaused, isPaused, activeModal, closeModal]);

  return movement;
}
