import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

const SOCIAL = {
  github:   'https://github.com/sanchitbaviskar',
  linkedin: 'https://linkedin.com/in/sanchitbaviskar',
  email:    'mailto:your@email.com',
};

const footerNav = [
  { label: 'Home',     href: '#home' },
  { label: 'About',    href: '#about' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact',  href: '#contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2">
            <a
              href="#home"
              onClick={e => handleNavClick(e, '#home')}
              className="inline-block text-xl font-bold tracking-tight text-neutral-900 mb-3"
            >
              Sanchit Baviskar<span className="text-orange-500">.</span>
            </a>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-sm mb-6">
              Full-stack developer building practical, scalable digital solutions for businesses, startups, and founders.
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href={SOCIAL.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:border-orange-500/40 hover:bg-orange-50/40 transition-all duration-200"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:border-orange-500/40 hover:bg-orange-50/40 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={SOCIAL.email}
                className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:border-orange-500/40 hover:bg-orange-50/40 transition-all duration-200"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wider mb-4">
              Navigation
            </p>
            <ul className="space-y-2.5">
              {footerNav.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={e => handleNavClick(e, href)}
                    className="text-sm text-neutral-600 hover:text-orange-600 transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Contact CTA */}
          <div>
            <p className="text-xs font-mono font-medium text-neutral-400 uppercase tracking-wider mb-4">
              Get In Touch
            </p>
            <p className="text-sm text-neutral-500 mb-3">
              Available for freelance web development and custom full-stack applications.
            </p>
            <a
              href="#contact"
              onClick={e => handleNavClick(e, '#contact')}
              className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700 group"
            >
              <span>Start a conversation</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <p>© {year} Sanchit Baviskar. All rights reserved.</p>
          <p>Pune, India · Available for Remote Work</p>
        </div>
      </div>
    </footer>
  );
}
