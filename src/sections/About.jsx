import { motion } from 'framer-motion';
import { Target, Shield, Cpu, ArrowRight } from 'lucide-react';
import Button from '../components/Button.jsx';

export default function About() {
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const principles = [
    {
      icon: Target,
      title: "Business-Driven Development",
      description: "Technology should serve measurable business outcomes, not complexity for its own sake.",
    },
    {
      icon: Shield,
      title: "Reliability & Clean Code",
      description: "Building scalable, maintainable architectures with clean separation of concerns and robust data flow.",
    },
    {
      icon: Cpu,
      title: "Full-Stack Execution",
      description: "Seamlessly bridging frontend UI/UX with secure backend APIs, authentication, and database schemas.",
    },
  ];

  return (
    <section id="about" className="section-padding bg-white border-y border-neutral-200/80">
      <div className="section-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6"
          >
            <span className="section-badge mb-4">About Me</span>
            <h2 className="section-heading mb-6">
              Building Technology That Solves <span className="text-orange-500">Real Problems</span>.
            </h2>

            <div className="space-y-4 text-base text-neutral-600 leading-relaxed">
              <p>
                I am a full-stack web developer based in Pune, India, passionate about transforming business requirements into dependable, intuitive digital software.
              </p>
              <p>
                My focus spans the entire development lifecycle: architecting responsive user interfaces with React and Tailwind CSS, writing secure RESTful APIs with Node.js and Express, and designing structured relational databases with PostgreSQL.
              </p>
              <p>
                Whether partnering with small businesses, gym owners, educational institutes, or startups, my commitment is always the same: delivering clean code, practical features, and a seamless client handover.
              </p>
            </div>

            <div className="mt-8">
              <Button
                href="#contact"
                onClick={e => handleNavClick(e, '#contact')}
                variant="secondary"
              >
                Work With Me
                <ArrowRight size={15} />
              </Button>
            </div>
          </motion.div>

          {/* Right Column: Key Pillars & Working Approach */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-6 space-y-4"
          >
            {principles.map((item, idx) => (
              <div
                key={item.title}
                className="bg-neutral-50/70 border border-neutral-200/90 rounded-2xl p-6 transition-all duration-200 hover:border-orange-500/30 hover:bg-white hover:shadow-subtle"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-4">
                  <item.icon size={20} strokeWidth={1.9} />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
