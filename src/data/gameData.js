// ─────────────────────────────────────────────
// GAME DATA & PORTFOLIO CONTENT INTEGRATION
// Seamlessly merges existing portfolio data into RPG Quest systems
// ─────────────────────────────────────────────

import { projects as existingProjects } from './projects.js';
import { services as existingServices } from './services.js';

export const DEVELOPER_PROFILE = {
  name: "Sanchit Baviskar",
  title: "Full-Stack Developer & Freelance Engineer",
  role: "Full-Stack Web Architect",
  level: 42,
  class: "Code Sorcerer / Full-Stack Engineer",
  location: "Pune, India",
  email: "sanchitbaviskar07@gmail.com",
  github: "https://github.com/Sanchit07-dev/portfolio",
  linkedin: "https://www.linkedin.com/in/sanchit-baviskar-5a676b251",
  availableForHire: true,
  summary: "Building robust, production-grade web applications with React, Node.js, and PostgreSQL. Focused on clean architecture, performance, and business outcomes.",
  education: {
    institution: "Vishwakarma Institute of Technology, Pune",
    degree: "B.Tech in Artificial Intelligence & Data Science",
    period: "2022 - 2026",
    focus: "Full-stack web engineering, distributed systems, and machine learning."
  },
  principles: [
    {
      title: "Business-Driven Engineering",
      description: "Code exists to solve problems and deliver measurable outcomes, not for its own sake."
    },
    {
      title: "Reliable & Clean Architecture",
      description: "Maintainable components, modular APIs, and normalized schemas built to last."
    },
    {
      title: "Performance & Responsive Craft",
      description: "Fast page loads, fluid interactions, and mobile-friendly usability."
    }
  ]
};

// RPG Locations with updated 3D world coordinates across expanded map
export const WORLD_LOCATIONS = [
  {
    id: 'spawn',
    name: 'Village Square',
    category: 'Introduction',
    coordinates: [0, 0, 0],
    color: '#3B82F6',
    description: 'The starting plaza of Developer Quest. Where all journeys begin.',
    npcName: 'Guide Kenneth',
    npcTitle: 'Village Elder & Guide',
    dialogue: [
      "Welcome, Adventurer! You have arrived at Developer Quest.",
      "This world is an interactive realm exploring Sanchit Baviskar's work, code, and engineering journey.",
      "Explore the path ahead! Enter the Developer House to the west, inspect the Skill Grounds, brave Project Castle, check Farmland achievements, and send your transmission from the Signal Tower to the north!"
    ]
  },
  {
    id: 'house',
    name: 'Developer House',
    category: 'About Me',
    coordinates: [-35, 0, -22],
    color: '#10B981',
    description: 'A cozy cottage with open doors housing Sanchit\'s personal workshop, desk, and background.',
    npcName: 'Sanchit Baviskar',
    npcTitle: 'Full-Stack Developer',
    dialogue: [
      "Hey there! Welcome to my workshop.",
      "I am a full-stack engineer based in Pune, India, building modern web apps with React, Node.js, and PostgreSQL.",
      "Step right inside the doorway to inspect my background, education, and principles!"
    ]
  },
  {
    id: 'skills',
    name: 'Skill Training Grounds',
    category: 'Technical Skills',
    coordinates: [-55, 0, 24],
    color: '#8B5CF6',
    description: 'An ancient stone training dojo displaying verified technical abilities and weapon proficiencies.',
    npcName: 'Master Syntax',
    npcTitle: 'Training Master',
    dialogue: [
      "Welcome warrior! Here we hone languages, frontend arts, backend spells, and relational database schemas.",
      "Only battle-tested technologies are forged into these stones. Inspect the pillars to view Sanchit's technical arsenal!"
    ]
  },
  {
    id: 'castle',
    name: 'Project Castle',
    category: 'Featured Projects',
    coordinates: [55, 0, -52],
    color: '#F97316',
    description: 'A grand stone citadel safeguarding Sanchit\'s verified software projects and applications.',
    npcName: 'Archivist Thorne',
    npcTitle: 'Castle Curator',
    dialogue: [
      "Greetings! Within this fortress lie the chambers of completed works and architectural concepts.",
      "Approach each glowing treasure chest to inspect project blueprints, technology stacks, GitHub repositories, and live builds!"
    ]
  },
  {
    id: 'mountain',
    name: 'Achievement Highlands',
    category: 'Milestones & Services',
    coordinates: [62, 0, 48],
    color: '#EC4899',
    description: 'A majestic highland summit showcasing milestones, freelance capabilities, and client services.',
    npcName: 'Priestess Althea',
    npcTitle: 'Keeper of Records',
    dialogue: [
      "You have traveled far across the highlands! Here stand the monoliths of verified milestones and freelance offerings.",
      "From full-stack web builds to custom APIs and secure database integrations, discover what Sanchit delivers!"
    ]
  },
  {
    id: 'tower',
    name: 'Communication Tower',
    category: 'Contact & Hire',
    coordinates: [0, 0, -85],
    color: '#06B6D4',
    description: 'A towering beacon of signal crystals connecting this realm directly to Sanchit\'s inbox.',
    npcName: 'Beacon Operator Lyra',
    npcTitle: 'Communications Officer',
    dialogue: [
      "Transmission signal strong! This tower connects you directly to Sanchit Baviskar.",
      "Have an upcoming project, freelance inquiry, or engineering role? Send a transmission right now through the console!"
    ]
  }
];

export const SKILL_CATEGORIES = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    icon: 'Layout',
    skills: [
      { name: 'React', level: 'Core', desc: 'Component architecture, hooks, state management, and modern SPA performance.' },
      { name: 'JavaScript (ES6+)', level: 'Advanced', desc: 'Asynchronous programming, event loop, functional patterns, DOM APIs.' },
      { name: 'HTML5 & Semantic Markup', level: 'Expert', desc: 'Accessible document structures, semantic elements, and SEO hygiene.' },
      { name: 'CSS3 & Modern Layouts', level: 'Advanced', desc: 'Flexbox, CSS Grid, animations, variables, and cross-browser styling.' },
      { name: 'Tailwind CSS', level: 'Advanced', desc: 'Utility-first rapid UI development, design tokens, responsive breakpoints.' },
      { name: 'Framer Motion', level: 'Intermediate', desc: 'Declarative animations, layout transitions, and interactive gestural UI.' }
    ]
  },
  {
    id: 'backend',
    title: 'Backend & Systems',
    icon: 'Server',
    skills: [
      { name: 'Node.js', level: 'Core', desc: 'Event-driven server runtimes, asynchronous I/O, streaming, backend services.' },
      { name: 'Express.js', level: 'Core', desc: 'RESTful API routing, middleware pipelines, error handling, input sanitization.' },
      { name: 'REST API Design', level: 'Advanced', desc: 'Resource modeling, HTTP semantics, stateless auth, JSON contract standards.' },
      { name: 'Authentication & Security', level: 'Proficient', desc: 'JWT tokens, bcrypt password hashing, CORS, protected route guards.' }
    ]
  },
  {
    id: 'database',
    title: 'Databases & Storage',
    icon: 'Database',
    skills: [
      { name: 'PostgreSQL', level: 'Core', desc: 'Relational schema design, foreign keys, normalization, joins, indexing.' },
      { name: 'SQL Query Craft', level: 'Advanced', desc: 'Complex joins, aggregations, transactional integrity, query tuning.' }
    ]
  },
  {
    id: 'tools',
    title: 'Developer Tools & Workflow',
    icon: 'Wrench',
    skills: [
      { name: 'Git & GitHub', level: 'Advanced', desc: 'Version control branching, pull requests, merge conflict resolution.' },
      { name: 'Vite & Build Tools', level: 'Proficient', desc: 'Module bundling, hot module replacement, dev server optimization.' },
      { name: 'Postman', level: 'Proficient', desc: 'API endpoint testing, request validation, environment configuration.' },
      { name: 'VS Code & Linux/Terminal', level: 'Advanced', desc: 'Shell scripting, workspace automation, modern CLI tooling.' }
    ]
  }
];

export const QUESTS = [
  {
    id: 'q1',
    title: 'Discover the Developer',
    targetLocation: 'house',
    locationName: 'Developer House',
    objective: 'Visit the Developer House to discover Sanchit\'s background and philosophy.',
    reward: 'Developer Crest & 100 XP',
    completed: false
  },
  {
    id: 'q2',
    title: 'Master the Skills',
    targetLocation: 'skills',
    locationName: 'Skill Training Grounds',
    objective: 'Inspect the ancient skill grounds to review verified tech stacks.',
    reward: 'Scroll of Knowledge & 150 XP',
    completed: false
  },
  {
    id: 'q3',
    title: 'Discover the Projects',
    targetLocation: 'castle',
    locationName: 'Project Castle',
    objective: 'Brave the Project Castle and open the chests containing real web projects.',
    reward: 'Architect\'s Crown & 200 XP',
    completed: false
  },
  {
    id: 'q4',
    title: 'Explore the Highlands',
    targetLocation: 'mountain',
    locationName: 'Achievement Highlands',
    objective: 'Reach the highland summit to inspect milestones, services, and engineering workflow.',
    reward: 'Peak Badge & 150 XP',
    completed: false
  },
  {
    id: 'q5',
    title: 'Establish Communication',
    targetLocation: 'tower',
    locationName: 'Communication Tower',
    objective: 'Reach the Communication Tower to the north and submit a transmission.',
    reward: 'Crystal Transmitter & 250 XP',
    completed: false
  }
];

export const COLLECTIBLES = [
  { id: 'badge-react', name: 'React Orb', icon: 'Atom', category: 'Frontend', desc: 'Mastery of reactive UI components and state.', position: [-16, 1, 10], collected: false },
  { id: 'badge-js', name: 'JavaScript Crystal', icon: 'FileCode', category: 'Language', desc: 'The bedrock tongue of the web universe.', position: [16, 1, -12], collected: false },
  { id: 'badge-node', name: 'Node.js Core', icon: 'Server', category: 'Backend', desc: 'Empowers server-side asynchronous execution.', position: [-38, 1, 30], collected: false },
  { id: 'badge-pg', name: 'Postgres Relic', icon: 'Database', category: 'Database', desc: 'Relational data permanence and query power.', position: [38, 1, 25], collected: false },
  { id: 'badge-git', name: 'Git Branch Key', icon: 'GitBranch', category: 'Tooling', desc: 'Time-travel and collaboration across dimensions.', position: [0, 1, -45], collected: false },
];

export { existingProjects, existingServices };
