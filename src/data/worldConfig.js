// ─────────────────────────────────────────────
// WORLD CONFIGURATION & DATA-DRIVEN REALM SPECIFICATION
// Expanded map (120m radius = ~5x area), 6 distinct zones,
// comprehensive structures, interactive NPCs, and physical colliders.
// ─────────────────────────────────────────────

export const WORLD_BOUNDS = {
  radius: 115, // Island radius
  waterRadius: 240,
};

// Player physical dimensions and pivot configuration
export const PLAYER_PHYSICS = {
  footOffset: 0.75,       // Height of hip joint from ground so shoe bottoms sit precisely at y = 0
  colliderRadius: 0.45,   // Horizontal collision radius
  walkSpeed: 7.0,
  sprintSpeed: 12.0,
  jumpStrength: 8.8,
  gravity: 24.0,
  stepInterval: 0.32,
};

// Distinct thematic zones across the larger realm
export const WORLD_ZONES = [
  { id: 'village', name: 'Village Square', center: [0, 0, 0], radius: 28, color: '#F97316' },
  { id: 'forest', name: 'Whispering Woods', center: [-55, 0, -45], radius: 45, color: '#2D5A27' },
  { id: 'farmland', name: 'Golden Farmlands', center: [55, 0, 45], radius: 40, color: '#EAB308' },
  { id: 'highlands', name: 'Rocky Highlands', center: [55, 0, -50], radius: 45, color: '#78716C' },
  { id: 'lake', name: 'Azure Lake & Pier', center: [-50, 0, 40], radius: 35, color: '#0284C7' },
  { id: 'beacon_hill', name: 'Signal Spire Peak', center: [0, 0, -80], radius: 35, color: '#06B6D4' }
];

// Data-driven safe respawn locations across the realm
export const RESPAWN_POINTS = [
  { id: 'village', name: 'Village Square', pos: [0, 0.6, 2.5] },
  { id: 'house', name: 'Developer Workshop', pos: [-32, 0.6, -18] },
  { id: 'skills', name: 'Training Grounds', pos: [-50, 0.6, 24] },
  { id: 'castle', name: 'Project Castle', pos: [50, 0.6, -45] },
  { id: 'tower', name: 'Signal Spire', pos: [0, 0.6, -78] },
  { id: 'lake', name: 'Azure Lake Pier', pos: [-45, 0.6, 36] },
  { id: 'farmland', name: 'Golden Farmlands', pos: [50, 0.6, 38] }
];

// All Interactive NPCs across the world
export const WORLD_NPCS = [
  {
    id: 'npc-guide',
    name: 'Guide Kenneth',
    title: 'Village Elder',
    locationId: 'spawn',
    position: [4, 0, 4],
    roleColor: '#3B82F6',
    dialogue: [
      "Welcome, Adventurer! You've arrived in Developer Quest.",
      "This world is an explorable landscape of Sanchit Baviskar's engineering craft.",
      "Follow the stone paths: visit Sanchit's House to the west, the Skill Grounds, the Project Castle in the highlands, and the Communication Tower to the north!"
    ]
  },
  {
    id: 'npc-sanchit',
    name: 'Sanchit Baviskar',
    title: 'Full-Stack Developer',
    locationId: 'house',
    position: [-32, 0, -22],
    roleColor: '#10B981',
    dialogue: [
      "Hello! Welcome to my digital workshop.",
      "I am a full-stack developer based in Pune, India, passionate about building robust web apps with React, Node.js, and PostgreSQL.",
      "Feel free to step inside my house to inspect my background, education at VIT Pune, and development principles!"
    ]
  },
  {
    id: 'npc-syntax',
    name: 'Master Syntax',
    title: 'Code Instructor',
    locationId: 'skills',
    position: [-52, 0, 24],
    roleColor: '#8B5CF6',
    dialogue: [
      "Greetings traveler! Welcome to the Skill Training Grounds.",
      "Here we sharpen languages, frontend react architectures, backend APIs, and database modeling.",
      "Inspect the rune pillars around this arena to see verified proficiencies!"
    ]
  },
  {
    id: 'npc-thorne',
    name: 'Archivist Thorne',
    title: 'Castle Curator',
    locationId: 'castle',
    position: [52, 0, -48],
    roleColor: '#F97316',
    dialogue: [
      "Welcome to Project Castle! Within these fortified stone walls lie Sanchit's software builds.",
      "Approach the glowing project chests to inspect blueprints, technology tags, GitHub repositories, and live demos."
    ]
  },
  {
    id: 'npc-althea',
    name: 'Priestess Althea',
    title: 'Keeper of Records',
    locationId: 'mountain',
    position: [62, 0, 48],
    roleColor: '#EC4899',
    dialogue: [
      "You have traveled far to the Farmland & Highlands! Here stand the records of freelance offerings and milestones.",
      "From full-stack web platforms and REST APIs to database modeling and security architectures, discover what Sanchit delivers!"
    ]
  },
  {
    id: 'npc-lyra',
    name: 'Beacon Operator Lyra',
    title: 'Communications Officer',
    locationId: 'tower',
    position: [3.5, 0, -82],
    roleColor: '#06B6D4',
    dialogue: [
      "Transmission signal locked! Welcome to the Communication Tower.",
      "Have an upcoming project, freelance inquiry, or engineering role?",
      "Interact with the terminal to transmit a direct message or retrieve Sanchit's GitHub, LinkedIn, and email address!"
    ]
  },
  {
    id: 'npc-farmer',
    name: 'Farmer Giles',
    title: 'Agricultural Engineer',
    locationId: 'farmland',
    position: [42, 0, 36],
    roleColor: '#EAB308',
    dialogue: [
      "Good day! Just like tending these crops, robust software requires clean foundation, daily testing, and regular maintenance.",
      "Take a look at the windmill and storage silo ahead!"
    ]
  },
  {
    id: 'npc-merchant',
    name: 'Merchant Felix',
    title: 'Town Trader',
    locationId: 'spawn',
    position: [-8, 0, 6],
    roleColor: '#F59E0B',
    dialogue: [
      "Greetings traveler! Looking for tools and services? Check out the market stalls around the village plaza."
    ]
  }
];

// Major Structures with positions, types, rotations and collision data
export const WORLD_STRUCTURES = [
  // 1. Enterable Developer House
  {
    id: 'developer_house',
    type: 'enterable_house',
    position: [-35, 0, -22],
    rotation: 0,
    title: 'Developer Workshop'
  },
  // 2. Town Hall / Showcase Hall
  {
    id: 'town_hall',
    type: 'town_hall',
    position: [0, 0, 16],
    rotation: Math.PI,
    title: 'Village Hall'
  },
  // 3. Project Castle
  {
    id: 'project_castle',
    type: 'project_castle',
    position: [55, 0, -52],
    rotation: -Math.PI / 6,
    title: 'Project Castle'
  },
  // 4. Skill Training Grounds Arena
  {
    id: 'skill_grounds',
    type: 'skill_grounds',
    position: [-55, 0, 24],
    rotation: 0,
    title: 'Training Grounds'
  },
  // 5. Communication Tower
  {
    id: 'comm_tower',
    type: 'comm_tower',
    position: [0, 0, -85],
    rotation: 0,
    title: 'Signal Spire'
  },
  // 6. Farm Windmill & Fields
  {
    id: 'windmill',
    type: 'windmill',
    position: [68, 0, 42],
    rotation: -Math.PI / 4,
    title: 'Farmland Windmill'
  },
  // 7. Stone Well in Village Center - shifted north to [0, 0, -6] so spawn point [0, 0, 2] is completely open
  {
    id: 'village_well',
    type: 'well',
    position: [0, 0, -6],
    rotation: 0
  },
  // 8. Village Market Stalls
  {
    id: 'stall_1',
    type: 'market_stall',
    position: [-10, 0, -7],
    rotation: Math.PI / 4
  },
  {
    id: 'stall_2',
    type: 'market_stall',
    position: [10, 0, -7],
    rotation: -Math.PI / 4
  },
  // 9. Campfire in the woods
  {
    id: 'woods_campfire',
    type: 'campfire',
    position: [-45, 0, -50],
    rotation: 0
  },
  // 10. Pier & Fishing Shack at the lake
  {
    id: 'lake_pier',
    type: 'pier',
    position: [-50, 0, 40],
    rotation: 0.3
  }
];

// Static colliders: cylinder [x, z, radius] and AABB box [x, z, halfWidth, halfDepth]
export const STATIC_COLLIDERS = [
  // Village Well placed at [0, 0, -6]
  { type: 'circle', x: 0, z: -6, r: 1.8 },

  // Enterable House Wall Colliders (leaving doorway open at x: -35, z: -18)
  // Back wall (z = -26)
  { type: 'box', x: -35, z: -26, hw: 5.2, hd: 0.5 },
  // Left wall (x = -40)
  { type: 'box', x: -40, z: -22, hw: 0.5, hd: 4.2 },
  // Right wall (x = -30)
  { type: 'box', x: -30, z: -22, hw: 0.5, hd: 4.2 },
  // Front wall Left section (x: -40 to -36.5)
  { type: 'box', x: -38.5, z: -18, hw: 1.8, hd: 0.5 },
  // Front wall Right section (x: -33.5 to -30)
  { type: 'box', x: -31.5, z: -18, hw: 1.8, hd: 0.5 },

  // Town Hall
  { type: 'box', x: 0, z: 18, hw: 6.5, hd: 5.0 },

  // Market Stalls
  { type: 'circle', x: -10, z: -7, r: 2.0 },
  { type: 'circle', x: 10, z: -7, r: 2.0 },

  // Project Castle
  { type: 'circle', x: 55, z: -52, r: 10.0 },

  // Skill Grounds arena perimeter
  { type: 'circle', x: -55, z: 24, r: 8.5 },

  // Communication Tower
  { type: 'circle', x: 0, z: -85, r: 4.5 },

  // Windmill
  { type: 'circle', x: 68, z: 42, r: 4.2 },

  // Campfire rocks
  { type: 'circle', x: -45, z: -50, r: 1.5 },
];

// Procedural seeded pseudo-random generator
export function createRNG(seed = 123456) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Generate natural vegetation and rock positions with collision data
export function generateVegetationAndRocks(count = 220, seed = 42) {
  const rng = createRNG(seed);
  const trees = [];
  const rocks = [];
  const dynamicColliders = [];

  for (let i = 0; i < count; i++) {
    const angle = rng() * Math.PI * 2;
    const dist = 14 + rng() * 95; // clear of spawn plaza
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;

    // Avoid spawning on roads, village square, or structures
    const distCenter = Math.hypot(x, z);
    const distHouse = Math.hypot(x - (-35), z - (-22));
    const distCastle = Math.hypot(x - 55, z - (-52));
    const distSkills = Math.hypot(x - (-55), z - 24);
    const distTower = Math.hypot(x - 0, z - (-85));
    const distWindmill = Math.hypot(x - 68, z - 42);
    const distTownHall = Math.hypot(x - 0, z - 18);

    if (
      distCenter > 16 &&
      distHouse > 9 &&
      distCastle > 14 &&
      distSkills > 11 &&
      distTower > 9 &&
      distWindmill > 8 &&
      distTownHall > 9
    ) {
      if (i % 3 === 0) {
        const scale = 0.85 + rng() * 0.6;
        trees.push({ type: 'pine', pos: [x, 0, z], scale, rot: rng() * Math.PI });
        dynamicColliders.push({ type: 'circle', x, z, r: 0.65 * scale });
      } else if (i % 3 === 1) {
        const scale = 0.8 + rng() * 0.5;
        trees.push({ type: 'oak', pos: [x, 0, z], scale, rot: rng() * Math.PI });
        dynamicColliders.push({ type: 'circle', x, z, r: 0.7 * scale });
      } else {
        const scale = 0.7 + rng() * 0.7;
        rocks.push({
          pos: [x, 0.3 * scale, z],
          scale: [scale, scale * (0.6 + rng() * 0.4), scale],
          rot: [rng(), rng() * 3, rng()]
        });
        dynamicColliders.push({ type: 'circle', x, z, r: 0.85 * scale });
      }
    }
  }

  return { trees, rocks, dynamicColliders };
}
