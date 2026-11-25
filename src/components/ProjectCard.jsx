import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';

export default function ProjectCard({ project, index }) {
  const { title, description, tags, status, statusLabel, githubUrl, liveUrl } = project;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-orange-500/40 hover:shadow-card-hover"
    >
      <div className="p-6 sm:p-7">
        {/* Top bar: status & action links */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
              status === 'completed'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {statusLabel}
          </span>

          <div className="flex items-center gap-2">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:border-orange-500/50 hover:bg-neutral-50 transition-all duration-200"
                aria-label={`GitHub repository for ${title}`}
                title="View GitHub Repository"
              >
                <Github size={15} />
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:border-orange-500/50 hover:bg-neutral-50 transition-all duration-200"
                aria-label={`Live demo for ${title}`}
                title="View Live Demo"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Project Title */}
        <h3 className="text-xl font-semibold text-neutral-900 mb-2.5 group-hover:text-orange-600 transition-colors duration-200 flex items-center justify-between">
          <span>{title}</span>
          <ArrowUpRight size={16} className="text-neutral-300 group-hover:text-orange-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
        </h3>

        {/* Project Description */}
        <p className="text-sm text-neutral-500 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Tech Tags */}
      <div className="px-6 pb-6 pt-4 border-t border-neutral-100 flex flex-wrap gap-1.5 bg-neutral-50/50">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs text-neutral-600 bg-white px-2.5 py-1 rounded-md border border-neutral-200 font-mono"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
