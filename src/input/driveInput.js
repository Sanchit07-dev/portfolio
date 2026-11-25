// Shared drive / UI input. Written by keyboard, touch and gamepad.
// Read from the vehicle frame loop so steering does not re-render React.

import { INPUT_KEYS, KONAMI } from '../config/toyWorld';

export const driveInput = {
  throttle: 0,
  steer: 0,
  boost: false,
  brake: false,
  jump: false,
  analogThrottle: null,
  analogSteer: null,
};

const held = {
  forward: false,
  back: false,
  left: false,
  right: false,
};

let konamiIndex = 0;
let onKonami = () => {};
let onHonk = () => {};
let onInteract = () => {};
let onMap = () => {};
let onMute = () => {};
let onRespawn = () => {};
let onMenu = () => {};

function recomputeDigital() {
  driveInput.throttle = (held.forward ? 1 : 0) + (held.back ? -1 : 0);
  driveInput.steer = (held.left ? 1 : 0) + (held.right ? -1 : 0);
}

function matches(code, list) {
  return list.includes(code);
}

function feedKonami(code) {
  if (code === KONAMI[konamiIndex]) {
    konamiIndex += 1;
    if (konamiIndex >= KONAMI.length) {
      konamiIndex = 0;
      onKonami();
    }
  } else {
    konamiIndex = code === KONAMI[0] ? 1 : 0;
  }
}

export function readDriveInput() {
  const throttle = driveInput.analogThrottle ?? driveInput.throttle;
  const steer = driveInput.analogSteer ?? driveInput.steer;
  return {
    throttle,
    steer,
    boost: driveInput.boost,
    brake: driveInput.brake,
    jump: driveInput.jump,
  };
}

export function setAnalog(throttle, steer) {
  driveInput.analogThrottle = throttle;
  driveInput.analogSteer = steer;
}

export function clearAnalog() {
  driveInput.analogThrottle = null;
  driveInput.analogSteer = null;
}

export function bindDriveActions(actions) {
  onKonami = actions.onKonami || onKonami;
  onHonk = actions.onHonk || onHonk;
  onInteract = actions.onInteract || onInteract;
  onMap = actions.onMap || onMap;
  onMute = actions.onMute || onMute;
  onRespawn = actions.onRespawn || onRespawn;
  onMenu = actions.onMenu || onMenu;
}

function typingTarget(event) {
  const tag = event.target?.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

export function attachDriveKeyboard() {
  const down = (event) => {
    if (typingTarget(event)) return;
    const { code } = event;
    if (
      matches(code, INPUT_KEYS.forward) ||
      matches(code, INPUT_KEYS.back) ||
      matches(code, INPUT_KEYS.jump) ||
      matches(code, INPUT_KEYS.menu)
    ) {
      event.preventDefault();
    }
    if (event.repeat) {
      if (matches(code, INPUT_KEYS.honk)) return;
    }
    if (matches(code, INPUT_KEYS.forward)) held.forward = true;
    if (matches(code, INPUT_KEYS.back)) held.back = true;
    if (matches(code, INPUT_KEYS.left)) held.left = true;
    if (matches(code, INPUT_KEYS.right)) held.right = true;
    if (matches(code, INPUT_KEYS.boost)) driveInput.boost = true;
    if (matches(code, INPUT_KEYS.brake)) driveInput.brake = true;
    if (matches(code, INPUT_KEYS.jump)) driveInput.jump = true;
    if (matches(code, INPUT_KEYS.honk) && !event.repeat) onHonk();
    if (matches(code, INPUT_KEYS.interact) && !event.repeat) onInteract();
    if (matches(code, INPUT_KEYS.map) && !event.repeat) onMap();
    if (matches(code, INPUT_KEYS.mute) && !event.repeat) onMute();
    if (matches(code, INPUT_KEYS.respawn) && !event.repeat) onRespawn();
    if (matches(code, INPUT_KEYS.menu) && !event.repeat) onMenu();
    feedKonami(code);
    recomputeDigital();
  };

  const up = (event) => {
    const { code } = event;
    if (matches(code, INPUT_KEYS.forward)) held.forward = false;
    if (matches(code, INPUT_KEYS.back)) held.back = false;
    if (matches(code, INPUT_KEYS.left)) held.left = false;
    if (matches(code, INPUT_KEYS.right)) held.right = false;
    if (matches(code, INPUT_KEYS.boost)) driveInput.boost = false;
    if (matches(code, INPUT_KEYS.brake)) driveInput.brake = false;
    if (matches(code, INPUT_KEYS.jump)) driveInput.jump = false;
    recomputeDigital();
  };

  window.addEventListener('keydown', down);
  window.addEventListener('keyup', up);
  return () => {
    window.removeEventListener('keydown', down);
    window.removeEventListener('keyup', up);
  };
}

/** Poll the standard gamepad. Left stick drives, RT boosts, A jumps, B brakes, X honks. */
export function pollGamepad(honkLatch) {
  const pads = navigator.getGamepads?.() || [];
  const pad = Array.from(pads).find((entry) => entry && entry.connected);
  if (!pad) {
    if (driveInput.analogThrottle !== null && driveInput._gamepad) clearAnalog();
    driveInput._gamepad = false;
    return;
  }
  const steer = Math.abs(pad.axes[0]) > 0.18 ? -pad.axes[0] : 0;
  const throttleAxis = Math.abs(pad.axes[1]) > 0.18 ? -pad.axes[1] : 0;
  driveInput._gamepad = true;
  setAnalog(throttleAxis, steer);
  driveInput.boost = pad.buttons[7]?.pressed || pad.buttons[5]?.pressed || false;
  driveInput.brake = pad.buttons[1]?.pressed || pad.buttons[6]?.pressed || false;
  driveInput.jump = pad.buttons[0]?.pressed || false;
  const honk = pad.buttons[2]?.pressed;
  if (honk && !honkLatch.current) onHonk();
  honkLatch.current = Boolean(honk);
  if (pad.buttons[3]?.pressed && !honkLatch.interact) onInteract();
  honkLatch.interact = Boolean(pad.buttons[3]?.pressed);
}
