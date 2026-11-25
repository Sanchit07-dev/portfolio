import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Button from './Button.jsx';

const navLinks = [
  { label: 'Home',     href: '#home' },
  { label: 'About',    href: '#about' },
  { label: 'Skills',   href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact',  href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive]     = useState('home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = navLinks.map(l => l.href.replace('#', ''));
      let current = 'home';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 140) {
          current = id;
        }
      }
      setActive(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-md border-b border-neutral-200/80 shadow-subtle'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-4 flex items-center justify-between">
          {/* Logo / Developer Name */}
          <a
            href="#home"
            onClick={e => handleNavClick(e, '#home')}
            className="flex items-center gap-1.5 text-lg font-bold tracking-tight text-neutral-900 group"
            aria-label="Sanchit Baviskar — Home"
          >
            <span>Sanchit</span>
            <span className="text-orange-500 font-extrabold group-hover:scale-125 transition-transform duration-200">.</span>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, href }) => {
              const id = href.replace('#', '');
              const isActive = active === id;
              return (
                <li key={label}>
                  <a
                    href={href}
                    onClick={e => handleNavClick(e, href)}
                    className={`relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-orange-600 font-semibold'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-orange-500/10 rounded-lg -z-10"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Action Button & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <Button
              href="#contact"
              onClick={e => handleNavClick(e, '#contact')}
              size="sm"
              className="hidden md:inline-flex"
            >
              Let's Talk
            </Button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:text-neutral-900 hover:border-orange-500/40 transition-all duration-200"
              aria-label="Toggle Navigation Menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-neutral-900/20 backdrop-blur-sm md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white border-l border-neutral-200 shadow-2xl flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                <span className="text-base font-bold text-neutral-900">
                  Sanchit<span className="text-orange-500">.</span>
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6">
                <ul className="space-y-1">
                  {navLinks.map(({ label, href }) => {
                    const id = href.replace('#', '');
                    const isActive = active === id;
                    return (
                      <li key={label}>
                        <a
                          href={href}
                          onClick={e => handleNavClick(e, href)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-orange-50 text-orange-600 font-semibold'
                              : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                          }`}
                        >
                          <span>{label}</span>
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="p-5 border-t border-neutral-100">
                <Button
                  href="#contact"
                  onClick={e => handleNavClick(e, '#contact')}
                  className="w-full justify-center"
                >
                  Let's Talk
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
