import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button.jsx';

function HeroVisual() {
  const codeLines = [
    { num: 1, text: '// Developer Profile', comment: true },
    { num: 2, text: 'const sanchit = {', accent: true },
    { num: 3, text: "  role: 'Full-Stack Developer',", indent: 1 },
    { num: 4, text: "  location: 'Pune, India',", indent: 1 },
    { num: 5, text: "  stack: ['React', 'Node.js', 'PostgreSQL'],", indent: 1 },
    { num: 6, text: '  builds: [', indent: 1 },
    { num: 7, text: "    'Business Websites',", indent: 2 },
    { num: 8, text: "    'Custom Web Applications',", indent: 2 },
    { num: 9, text: "    'REST APIs & Databases',", indent: 2 },
    { num: 10, text: '  ],', indent: 1 },
    { num: 11, text: '  availableForHire: true', highlight: true, indent: 1 },
    { num: 12, text: '};' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
      className="relative w-full max-w-lg lg:max-w-none"
    >
      {/* Background subtle geometric glow */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/5 via-amber-500/5 to-transparent rounded-3xl blur-2xl -z-10" />

      {/* Code Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-card overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-50/80 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
          </div>
          <span className="text-xs font-mono text-neutral-400">developer.config.ts</span>
          <div className="w-8" />
        </div>

        {/* Code Content */}
        <div className="p-5 sm:p-6 font-mono text-xs sm:text-[13px] leading-6 bg-white overflow-x-auto">
          {codeLines.map((line) => (
            <div key={line.num} className="flex items-start">
              <span className="w-6 text-neutral-300 select-none flex-shrink-0 text-right pr-3 text-[11px]">
                {line.num}
              </span>
              <span
                style={{ paddingLeft: `${(line.indent || 0) * 1}rem` }}
                className={
                  line.comment
                    ? 'text-neutral-400 italic'
                    : line.accent
                    ? 'text-orange-600 font-semibold'
                    : line.highlight
                    ? 'text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded font-medium'
                    : 'text-neutral-700'
                }
              >
                {line.text}
              </span>
            </div>
          ))}
        </div>

        {/* Card footer status badge */}
        <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Ready to deploy</span>
          </div>
          <span className="font-mono text-neutral-400 text-[11px]">Production ready</span>
        </div>
      </div>

      {/* Floating Pill: Full-Stack */}
      <motion.div
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden sm:flex absolute -bottom-4 -left-4 bg-white rounded-xl border border-neutral-200 px-3.5 py-2 shadow-card items-center gap-2.5"
      >
        <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
          <CheckCircle2 size={15} />
        </div>
        <div>
          <p className="text-xs font-semibold text-neutral-900">Modern Architecture</p>
          <p className="text-[10px] text-neutral-500">React · Node · PostgreSQL</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="section-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7">
            {/* Availability Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
              <span className="text-xs font-medium text-orange-800 tracking-wide">
                Available for Freelance Projects
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.12] mb-6"
            >
              I Build Digital Experiences That{' '}
              <span className="text-orange-500">Drive Business Growth.</span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-neutral-600 leading-relaxed mb-9 max-w-xl"
            >
              I'm <span className="font-semibold text-neutral-900">Sanchit Baviskar</span>, a full-stack developer specializing in modern websites, custom web applications, secure backends, and responsive digital products.
            </motion.p>

            {/* Two CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3.5 mb-10"
            >
              <Button
                href="#projects"
                onClick={e => handleNavClick(e, '#projects')}
                size="lg"
              >
                View My Work
                <ArrowRight size={16} />
              </Button>
              <Button
                href="#contact"
                onClick={e => handleNavClick(e, '#contact')}
                variant="secondary"
                size="lg"
              >
                Let's Talk
              </Button>
            </motion.div>

            {/* Social Links & Location */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-6 pt-6 border-t border-neutral-200/70"
            >
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/sanchitbaviskar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-orange-600 hover:border-orange-500/50 hover:bg-orange-50/50 transition-all duration-200"
                  aria-label="GitHub Profile"
                  title="GitHub"
                >
                  <Github size={17} />
                </a>
                <a
                  href="https://linkedin.com/in/sanchitbaviskar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-orange-600 hover:border-orange-500/50 hover:bg-orange-50/50 transition-all duration-200"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn"
                >
                  <Linkedin size={17} />
                </a>
              </div>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs font-medium text-neutral-500">
                Based in Pune, India · Available Worldwide
              </span>
            </motion.div>
          </div>

          {/* Right Visual Element */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <HeroVisual />
          </div>

        </div>
      </div>
    </section>
  );
}
