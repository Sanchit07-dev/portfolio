// ─────────────────────────────────────────────
// PROJECT DATA
// Replace placeholder links with real URLs when available.
// ─────────────────────────────────────────────

export const projects = [
  {
    id: 1,
    title: "Assignment Management System",
    description:
      "A web application for managing assignments, deadlines, submissions, and administrative operations. Built with a React frontend, Node.js/Express backend, and PostgreSQL database.",
    tags: ["React", "Node.js", "Express", "PostgreSQL"],
    status: "completed",          // "completed" | "concept"
    statusLabel: "Completed",
    githubUrl: "https://github.com/sanchitbaviskar",   // ← Replace with actual repo URL
    liveUrl: null,                                       // ← Replace with actual live URL or leave null
    featured: true,
  },
  {
    id: 2,
    title: "Gym Management Platform",
    description:
      "A platform concept for managing gym memberships, member records, attendance, and enquiries. Designed to digitise gym operations for small fitness businesses.",
    tags: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"],
    status: "concept",
    statusLabel: "Concept / Prototype",
    githubUrl: null,
    liveUrl: null,
    featured: true,
  },
  {
    id: 3,
    title: "Coaching Institute Management System",
    description:
      "A web application concept for managing courses, student records, admissions, and enquiries for coaching institutes and educational centres.",
    tags: ["React", "Express", "PostgreSQL", "REST API"],
    status: "concept",
    statusLabel: "Concept / Prototype",
    githubUrl: null,
    liveUrl: null,
    featured: true,
  },
];
