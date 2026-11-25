import { 
  Globe, 
  Layers, 
  ShieldCheck, 
  Database, 
  Server, 
  LayoutDashboard 
} from 'lucide-react';

export const services = [
  {
    id: 1,
    icon: Layers,
    title: "Full-Stack Website Development",
    description:
      "End-to-end web applications built from scratch with modern frontend frameworks, robust backends, and reliable cloud deployments.",
    highlights: ["React & Node.js architecture", "Component-driven design", "Production deployment", "Performance-tuned"],
  },
  {
    id: 2,
    icon: Globe,
    title: "Business Websites",
    description:
      "Modern, fast-loading, responsive websites designed to establish your brand credibility, communicate value, and turn visitors into clients.",
    highlights: ["Responsive & mobile-first", "SEO optimized structure", "Fast load times", "Clean editorial layouts"],
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: "Authentication & Authorization Systems",
    description:
      "Secure user login systems, role-based access control, session management, and encrypted credential handling to safeguard your user data.",
    highlights: ["JWT & session auth", "Role-based permissions", "Password hashing & security", "Protected API endpoints"],
  },
  {
    id: 4,
    icon: Database,
    title: "Database Design & Integration",
    description:
      "Normalized relational database schemas, efficient query optimization, and structured data modelling using PostgreSQL.",
    highlights: ["PostgreSQL schemas", "Data integrity & migrations", "Optimized queries", "Secure connections"],
  },
  {
    id: 5,
    icon: Server,
    title: "REST API Development",
    description:
      "Structured, documented, and resilient RESTful APIs built with Express.js to power web applications, third-party integrations, and mobile clients.",
    highlights: ["Clean endpoint architecture", "JSON request/response validation", "Error handling & logging", "Scalable routing"],
  },
  {
    id: 6,
    icon: LayoutDashboard,
    title: "Dashboard & Admin Panel Development",
    description:
      "Intuitive back-office panels and management dashboards to track metrics, manage users, handle enquiries, and streamline daily business operations.",
    highlights: ["CRUD operational workflows", "Data tables & filtering", "Actionable statistics", "Clean UX for teams"],
  },
];
