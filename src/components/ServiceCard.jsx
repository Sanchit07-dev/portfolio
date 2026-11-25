import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function ServiceCard({ service, index }) {
  const { icon: Icon, title, description, highlights } = service;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-2xl border border-neutral-200 p-6 md:p-7 flex flex-col justify-between transition-all duration-300 hover:border-orange-500/40 hover:shadow-card-hover"
    >
      <div>
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-600 mb-5 group-hover:scale-105 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
          <Icon size={22} strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-neutral-900 mb-2.5 group-hover:text-orange-600 transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-500 leading-relaxed mb-6">
          {description}
        </p>
      </div>

      {/* Highlights */}
      <ul className="space-y-2 pt-4 border-t border-neutral-100">
        {highlights.map((item) => (
          <li key={item} className="flex items-center gap-2 text-xs text-neutral-600">
            <Check size={14} className="text-orange-500 flex-shrink-0" strokeWidth={2.5} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
