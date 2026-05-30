'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';

import {
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  Home,
  User,
  Cpu,
  Briefcase,
  Award,
  Mail
} from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

const navLinks = [
  { name: 'Home', href: '/', id: 'home', icon: Home, desc: 'Intro & Resume' },
  { name: 'About', href: '/#about', id: 'about', icon: User, desc: 'Background & Bio' },
  { name: 'Skills', href: '/#skills', id: 'skills', icon: Cpu, desc: 'Tech Stack & Tools' },
  { name: 'Projects', href: '/#projects', id: 'projects', icon: Briefcase, desc: 'Shipped Products' },
  { name: 'Highlights', href: '/#achievements', id: 'achievements', icon: Award, desc: 'Honors & Trophies' },
  { name: 'Contact', href: '/#contact', id: 'contact', icon: Mail, desc: 'Get in Touch' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const { theme, toggleTheme } = useTheme();
  const lastScrollY = useRef(0);

  // Active section detection via IntersectionObserver
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.id).filter(Boolean);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id!);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id!); },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastScrollY.current;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 20);
    lastScrollY.current = latest;
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setProgress(latest);
  });

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('/#')) {
      const targetId = href.substring(2);
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 w-full z-50 py-4 sm:py-6 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-center pointer-events-auto">
        <div className={`glass h-14 sm:h-16 rounded-full px-4 sm:px-8 flex items-center justify-between border border-border/40 backdrop-blur-xl transition-all duration-500 w-full max-w-4xl ${
          scrolled ? 'shadow-[0_0_30px_rgba(59,130,246,0.15)] border-primary/20 bg-background/40' : ''
        }`}>
          {/* Logo */}
          <Link 
            href="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-lg sm:text-2xl font-display font-black tracking-tighter gradient-text hover:scale-105 transition-transform"
          >
            Pranesh.
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="relative"
              >
                <Link
                  href={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className={`text-sm font-medium transition-all hover:text-primary relative group py-2 ${
                    activeSection === link.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <motion.span
                    whileHover={{ letterSpacing: '0.05em' }}
                    transition={{ duration: 0.3 }}
                    className="inline-block will-change-transform"
                  >
                    {link.name}
                  </motion.span>
                  {/* Shared layoutId underline — slides between active links */}
                  {activeSection === link.id ? (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-primary to-blue-500 rounded-full will-change-transform"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-full transition-all duration-300" />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <AnimatePresence>
              {progress > 0.1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 20 }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-semibold text-primary uppercase tracking-wider"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  ~{Math.max(1, Math.ceil(3 * (1 - progress)))} min read
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full glass flex items-center justify-center hover:border-primary/50 transition-all active:scale-95"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'dark' ? <Sun size={16} className="sm:w-[18px]" /> : <Moon size={16} className="sm:w-[18px]" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/#contact"
                onClick={() => handleLinkClick('/#contact')}
                className="hidden sm:flex px-5 py-2 rounded-full bg-gradient-to-r from-primary to-blue-500 text-primary-foreground text-xs font-bold hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all hover:-translate-y-0.5"
              >
                Let&apos;s Talk
              </Link>
            </motion.div>

            {/* Mobile Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full glass flex items-center justify-center hover:border-primary/50"
              onClick={() => setIsOpen(!isOpen)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X size={18} /> : <Menu size={18} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-[80px] left-0 w-full px-4 sm:px-6 md:hidden overflow-hidden"
          >
            <div className="glass-heavy rounded-[2rem] p-5 sm:p-6 border border-border/40 shadow-2xl">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => handleLinkClick(link.href)}
                        className={`flex flex-col p-4 rounded-2xl border backdrop-blur-md transition-all duration-300 group text-left ${
                          activeSection === link.id
                            ? 'bg-primary/10 border-primary/40 text-primary shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                            : 'bg-white/5 border-white/10 hover:border-primary/30 text-foreground hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className={`p-2 rounded-xl transition-colors ${
                            activeSection === link.id ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10'
                          }`}>
                            <Icon size={18} />
                          </div>
                          <ArrowRight className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-primary" size={14} />
                        </div>
                        <span className="text-sm font-semibold font-display tracking-tight">{link.name}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 group-hover:text-foreground/75 transition-colors">{link.desc}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
