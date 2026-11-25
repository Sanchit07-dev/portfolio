import { motion } from 'framer-motion';
import { Search, Compass, Code2, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Discovery & Scope',
    description: 'We explore your business goals, target audience, technical needs, and project parameters to establish a precise project roadmap.',
  },
  {
    icon: Compass,
    step: '02',
    title: 'Architecture & Design',
    description: 'Defining database schemas, API contracts, UI component hierarchy, and design direction before building.',
  },
  {
    icon: Code2,
    step: '03',
    title: 'Development & Testing',
    description: 'Writing maintainable code across frontend and backend with continuous validation, secure authentication, and query optimization.',
  },
  {
    icon: Rocket,
    step: '04',
    title: 'Deployment & Handover',
    description: 'Launching on high-performance cloud infrastructure (Vercel, Node servers, PostgreSQL), with documentation and smooth client handover.',
  },
];

export default function Process() {
  return (
    <section className="section-padding bg-white border-b border-neutral-200/80">
      <div className="section-wrapper">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="section-badge mb-4">Work Process</span>
          <h2 className="section-heading mb-4">
            A Transparent, <span className="text-orange-500">Structured Workflow</span>.
          </h2>
          <p className="text-base text-neutral-500 leading-relaxed">
            From the initial conversation to live deployment, every stage is organized for clarity, speed, and quality.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="bg-neutral-50/70 rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:border-orange-500/30 hover:bg-white hover:shadow-card-hover transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                    <item.icon size={20} strokeWidth={1.8} />
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-300">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-neutral-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
