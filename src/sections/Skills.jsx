import { motion } from 'framer-motion';
import { 
  Code, 
  Server, 
  Database, 
  Terminal, 
  Wrench, 
  CheckCircle 
} from 'lucide-react';

const skillCategories = [
  {
    category: "Frontend Development",
    icon: Code,
    skills: ["React", "JavaScript (ES6+)", "HTML5", "CSS3", "Tailwind CSS"],
    description: "Responsive, accessible, and high-performance user interfaces."
  },
  {
    category: "Backend Development",
    icon: Server,
    skills: ["Node.js", "Express.js", "REST APIs", "Authentication"],
    description: "Secure application logic, routing, middleware, and services."
  },
  {
    category: "Databases",
    icon: Database,
    skills: ["PostgreSQL", "Relational Schema Design", "SQL Queries"],
    description: "Structured data storage, integrity constraints, and query efficiency."
  },
  {
    category: "Programming Languages",
    icon: Terminal,
    skills: ["JavaScript", "SQL", "HTML / CSS"],
    description: "Core languages used across client and server architectures."
  },
  {
    category: "Tools & Workflow",
    icon: Wrench,
    skills: ["Git", "GitHub", "Vite", "Postman", "Vercel"],
    description: "Version control, modern build tooling, and continuous deployment."
  },
];

export default function Skills() {
  return (
    <section id="skills" className="section-padding bg-neutral-50/60">
      <div className="section-wrapper">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="section-badge mb-4">Technical Stack</span>
          <h2 className="section-heading mb-4">
            Technologies I Use to <span className="text-orange-500">Deliver Value</span>.
          </h2>
          <p className="text-base text-neutral-500 leading-relaxed">
            A practical, proven stack focused on full-stack web development, reliable performance, and clean maintainability.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between transition-all duration-300 hover:border-orange-500/40 hover:shadow-card-hover group"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                    <cat.icon size={20} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors">
                    {cat.category}
                  </h3>
                </div>

                <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-100">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-xs text-neutral-700 bg-neutral-50 border border-neutral-200 px-2.5 py-1 rounded-md font-mono"
                  >
                    <CheckCircle size={11} className="text-orange-500" />
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
