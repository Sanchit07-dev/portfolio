// ─────────────────────────────────────────────
// TOY WORLD CONFIG
// Every tunable for the drivable portfolio lives here:
// palette, vehicle, camera, quality, playground, zones, circuit.
// ─────────────────────────────────────────────

export const TOY_PALETTE = {
  skyTop: '#F7C8A0',
  skyHorizon: '#C9E4F5',
  skyNight: '#1E2A4A',
  fogDay: '#E7F2FA',
  fogNight: '#243356',
  grass: '#8FBF7A',
  grassDark: '#6E9A62',
  dirt: '#C4A27A',
  sand: '#F0D7A8',
  water: '#7EC8C3',
  ocean: '#6AAEBE',
  road: '#E7D3A1',
  stone: '#D9D3C7',
  wood: '#C4844A',
  accent: '#F97316',
  accentDeep: '#EA580C',
  ink: '#3F342C',
  cream: '#FFF7ED',
  lantern: '#FFB703',
};

/** Google Fonts, SIL Open Font License. Loaded from index.html. */
export const TOY_FONTS = {
  body: 'Nunito',
  display: 'Caveat',
};

export const NATURE_SEED = 108;

export const QUALITY_PRESETS = {
  low: {
    label: 'Low',
    maxDpr: 1,
    shadows: false,
    shadowMap: 0,
    treeCount: 70,
    antialias: false,
    hemi: 0.7,
    sun: 1.05,
  },
  medium: {
    label: 'Medium',
    maxDpr: 1.25,
    shadows: true,
    shadowMap: 1024,
    treeCount: 140,
    antialias: true,
    hemi: 0.55,
    sun: 1.2,
  },
  high: {
    label: 'High',
    maxDpr: 1.5,
    shadows: true,
    shadowMap: 2048,
    treeCount: 220,
    antialias: true,
    hemi: 0.5,
    sun: 1.28,
  },
};

export const VEHICLE = {
  spawn: [0, 0, 6],
  radius: 1.05,
  accel: 28,
  boostAccel: 46,
  brakeDrag: 0.82,
  coastDrag: 0.985,
  grip: 6.5,
  maxSpeed: 18,
  boostSpeed: 28,
  reverseSpeed: 8,
  turnRate: 2.35,
  gravity: 28,
  jumpVelocity: 9.2,
  maxClimb: 1.15,
  bodyRest: 0.42,
  suspension: 9,
  tiltSteer: 0.18,
  tiltPitch: 0.04,
  fovBase: 52,
  fovBoost: 64,
  wheelRadius: 0.34,
};

export const CAMERA = {
  distance: 11,
  minDistance: 5,
  maxDistance: 20,
  height: 4.2,
  lookAtHeight: 1.1,
  follow: 4.2,
  orbitSpeed: 0.005,
  phi: 0.42,
  minPhi: 0.12,
  maxPhi: 1.15,
  zoomStep: 0.01,
};

export const INPUT_KEYS = {
  forward: ['KeyW', 'ArrowUp'],
  back: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  boost: ['ShiftLeft', 'ShiftRight'],
  brake: ['ControlLeft', 'ControlRight', 'KeyB'],
  jump: ['Space'],
  honk: ['KeyH'],
  interact: ['KeyE', 'Enter'],
  map: ['KeyM'],
  mute: ['KeyL'],
  respawn: ['KeyR'],
  menu: ['Escape'],
};

/** Up Up Down Down Left Right Left Right B A */
export const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA',
];

export const CAR_COLORS = [
  { id: 'amber', name: 'Amber', color: '#F97316', emissive: '#C2410C', unlock: null },
  { id: 'mint', name: 'Mint', color: '#7DCEA0', emissive: '#1E8449', unlock: 'zones' },
  { id: 'ink', name: 'Ink', color: '#3D405B', emissive: '#1A1A2E', unlock: 'flip' },
  { id: 'lilac', name: 'Lilac', color: '#CDB4DB', emissive: '#9B59B6', unlock: 'projects' },
];

export const TRAILS = [
  { id: 'none', name: 'None', color: null, unlock: null },
  { id: 'dust', name: 'Dust', color: '#E7D3A1', unlock: 'honk' },
  { id: 'spark', name: 'Spark', color: '#F97316', unlock: 'secrets' },
];

export const HORNS = [
  { id: 'beep', name: 'Beep', unlock: null },
  { id: 'toot', name: 'Toot', unlock: 'pins' },
  { id: 'chime', name: 'Chime', unlock: 'projects' },
];

/**
 * Terrain the car can drive onto.
 * Ramps rise along local +Z. Decks are flat. Pads launch upward.
 * yaw is radians around Y.
 */
export const TERRAIN_FEATURES = [
  { id: 'ramp-west', kind: 'ramp', x: -18, z: 18, hw: 3.2, hd: 7, height: 2.4, yaw: 0.4 },
  { id: 'deck-bridge', kind: 'deck', x: -8, z: 28, hw: 3.4, hd: 8, height: 2.4, yaw: 0.15 },
  { id: 'ramp-east', kind: 'ramp', x: 4, z: 38, hw: 3.2, hd: 7, height: 2.4, yaw: Math.PI + 0.2 },
  { id: 'jump-village', kind: 'pad', x: 14, z: 8, r: 2.1, power: 13 },
  { id: 'jump-farm', kind: 'pad', x: 48, z: 28, r: 2.1, power: 12 },
  { id: 'tunnel-a', kind: 'wall', x: 0, z: -28, hw: 0.8, hd: 4.2 },
  { id: 'tunnel-b', kind: 'wall', x: 7.2, z: -28, hw: 0.8, hd: 4.2 },
];

export const LAKE = { x: -50, z: 40, radius: 18, speedScale: 0.62 };

/** Portfolio zones. modalId matches existing GameModals / quests. */
export const PORTFOLIO_ZONES = [
  { id: 'about', name: 'About', modalId: 'house', position: [-35, 0, -14], color: '#7DCEA0', radius: 3.2 },
  { id: 'skills', name: 'Skills', modalId: 'skills', position: [-55, 0, 14], color: '#CDB4DB', radius: 3.2 },
  { id: 'projects', name: 'Projects', modalId: 'castle', position: [55, 0, -38], color: '#F97316', radius: 3.4 },
  { id: 'experience', name: 'Experience', modalId: 'mountain', position: [62, 0, 36], color: '#F6BD60', radius: 3.2 },
  { id: 'testimonials', name: 'Testimonials', modalId: 'testimonials', position: [22, 0, 52], color: '#F28482', radius: 3.2 },
  { id: 'contact', name: 'Contact', modalId: 'tower', position: [0, 0, -74], color: '#7EB6D9', radius: 3.2 },
];

/** Offsets from the project castle for one landmark per entry in src/data/projects.js. */
export const PROJECT_PAD_LAYOUT = [
  [42, 0, -42],
  [68, 0, -44],
  [55, 0, -34],
  [40, 0, -58],
  [70, 0, -58],
  [55, 0, -66],
];

export const CHECKPOINTS = [
  { id: 'spawn', position: [0, 0, 6] },
  ...PORTFOLIO_ZONES.map((z) => ({ id: z.id, position: [z.position[0], 0, z.position[2] + 4] })),
];

export const CIRCUIT_GATES = [
  { id: 'start', x: 0, z: 10, r: 3.2 },
  { id: 'west', x: -24, z: -6, r: 3.2 },
  { id: 'skills', x: -48, z: 18, r: 3.4 },
  { id: 'north', x: 0, z: -48, r: 3.2 },
  { id: 'castle', x: 40, z: -30, r: 3.4 },
  { id: 'farm', x: 46, z: 32, r: 3.2 },
];

export const SECRETS = [
  { id: 'windmill-shadow', name: 'Behind the windmill', position: [76, 0.6, 48], radius: 2.2 },
  { id: 'bridge-shadow', name: 'Under the bridge', position: [-8, 0.5, 28], radius: 2.4 },
  { id: 'lake-reeds', name: 'Lake reeds', position: [-66, 0.5, 52], radius: 2.2 },
];

export const WHISPER_SIGN = { position: [8, 0, -2], radius: 2.6 };

const LETTERS = 'SANCHIT'.split('');
export const PLAYGROUND_PROPS = [
  ...LETTERS.map((letter, i) => ({
    id: `letter-${letter}-${i}`,
    kind: 'box',
    letter,
    x: -4.2 + i * 1.45,
    z: 14,
    hw: 0.55,
    hd: 0.55,
    hh: 0.55,
    mass: 0.8,
    color: i % 2 === 0 ? '#F97316' : '#FFF7ED',
  })),
  { id: 'crate-a', kind: 'box', x: 18, z: -4, hw: 0.7, hd: 0.7, hh: 0.7, mass: 1.2, color: '#E09F3E' },
  { id: 'crate-b', kind: 'box', x: 19.2, z: -3.2, hw: 0.55, hd: 0.55, hh: 0.55, mass: 0.7, color: '#C4844A' },
  { id: 'crate-c', kind: 'box', x: 18.4, z: -4.6, hw: 0.45, hd: 0.45, hh: 0.45, mass: 0.45, color: '#F6BD60', y: 1.2 },
  { id: 'barrel', kind: 'cylinder', x: -14, z: 6, r: 0.55, hh: 0.7, mass: 1.4, color: '#A35D3A' },
  { id: 'ball', kind: 'sphere', x: 10, z: 16, r: 0.62, mass: 0.45, color: '#F28482' },
  { id: 'cone-a', kind: 'cone', x: 6, z: -12, r: 0.42, hh: 0.7, mass: 0.35, color: '#F97316' },
  { id: 'cone-b', kind: 'cone', x: 8, z: -13, r: 0.42, hh: 0.7, mass: 0.35, color: '#FFFFFF' },
  { id: 'cone-c', kind: 'cone', x: -6, z: -14, r: 0.42, hh: 0.7, mass: 0.35, color: '#F97316' },
  ...[0, 1, 2, 3, 4, 5].map((i) => ({
    id: `pin-${i}`,
    kind: 'pin',
    x: 24 + (i % 3) * 0.7,
    z: 16 + Math.floor(i / 3) * 0.75,
    r: 0.22,
    hh: 0.7,
    mass: 0.3,
    color: '#FFFFFF',
  })),
];

export const DAY_CYCLE = {
  /** Seconds for a full day when the clock is unlocked. */
  seconds: 90,
  start: 0.32,
};

export function prefersLightweightDevice() {
  if (typeof window === 'undefined') return false;
  const coarse = window.matchMedia?.('(pointer: coarse)')?.matches;
  const narrow = window.innerWidth < 820;
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;
  return (coarse && narrow) || cores <= 4 || memory <= 4;
}
