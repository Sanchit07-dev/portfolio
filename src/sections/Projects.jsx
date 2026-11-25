import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProjectCard from '../components/ProjectCard.jsx';
import { projects } from '../data/projects.js';
import Button from '../components/Button.jsx';

export default function Projects() {
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="projects" className="section-padding bg-neutral-50/70 border-b border-neutral-200/80">
      <div className="section-wrapper">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <span className="section-badge mb-4">Featured Work</span>
            <h2 className="section-heading">
              Practical Solutions, <span className="text-orange-500">Real Architecture</span>.
            </h2>
            <p className="section-subheading">
              A showcase of applications and functional prototypes designed to solve administrative, operational, and business challenges.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button
              href="#contact"
              onClick={e => handleNavClick(e, '#contact')}
              variant="secondary"
              size="md"
            >
              Start a New Project
              <ArrowRight size={15} />
            </Button>
          </motion.div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-8 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Completed Application
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Concept / Prototype
          </span>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
