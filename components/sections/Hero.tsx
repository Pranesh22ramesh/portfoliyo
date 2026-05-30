'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ArrowDown, FileText, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import MagneticButton from '@/components/ui/MagneticButton';
import { TypeAnimation } from 'react-type-animation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import {
  fadeUpVariant,
  staggerContainer,
  textRevealVariant,
  viewportOnce,
} from '@/lib/AnimationUtils';

gsap.registerPlugin(ScrollTrigger);

const ParticlesBackground = dynamic(() => import('@/components/ui/ParticlesBackground'), {
  ssr: false,
  loading: () => null,
});

// ─── Word-level clip-path text reveal ────────────────────────────────────────
function TextReveal({ text, className = '', delayStart = 0 }: { text: string; className?: string; delayStart?: number }) {
  const words = text.split(' ');
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1, delayChildren: delayStart } },
        hidden: {},
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={textRevealVariant}
          className="inline-block mr-[0.25em] will-change-transform"
          style={{ display: 'inline-block' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  // ── Parallax layers ─────────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  // Foreground content
  const contentY   = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  // Background orbs — slower parallax depth
  const blobY1 = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const blobY2 = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  // ── GSAP stagger reveal ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isMounted) return;
    const ctx = gsap.context(() => {
      gsap.from('.hero-reveal-item', {
        y: 48,
        opacity: 0,
        duration: 1.1,
        stagger: 0.18,
        ease: 'power4.out',
        clearProps: 'all',
        delay: 0.3,
      });
    }, containerRef);
    return () => ctx.revert();
  }, [isMounted]);

  const handleScroll = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <ParticlesBackground />

      {/* ── Background Orbs with Parallax depth ─────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div style={{ y: blobY1 }} className="absolute inset-0">
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.8, 1.2, 0.8], x: [0, 50, 0], y: [0, -50, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-[40%] -left-[20%] w-[1000px] h-[800px] rounded-full blur-[150px] will-change-transform"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.45), transparent)' }}
          />
          <motion.div
            animate={{ opacity: [0.15, 0.4, 0.15], scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 30, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            className="absolute -top-[20%] -right-[15%] w-[900px] h-[700px] rounded-full blur-[140px] will-change-transform"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35), transparent)' }}
          />
        </motion.div>

        <motion.div style={{ y: blobY2 }} className="absolute inset-0">
          <motion.div
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute -bottom-[30%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] rounded-full blur-[160px] will-change-transform"
            style={{ background: 'radial-gradient(circle, rgba(8,145,178,0.3), transparent)' }}
          />
          <motion.div
            animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 right-1/3 w-[400px] h-[400px] rounded-full blur-[120px] opacity-25 will-change-transform"
            style={{ background: 'conic-gradient(from 0deg, rgba(59,130,246,0.5), rgba(139,92,246,0.5), rgba(59,130,246,0.5))' }}
          />
        </motion.div>

        {/* 3D floating geometric shapes */}
        <motion.div
          animate={{ rotateX: [0, 360], rotateY: [0, 180], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[15%] right-[10%] w-24 h-24 border border-blue-500/20 rounded-xl will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        />
        <motion.div
          animate={{ rotateZ: [0, 360], y: [0, 20, 0], x: [0, 15, 0], opacity: [0.12, 0.3, 0.12] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-[20%] left-[8%] w-16 h-16 border border-purple-500/15 rotate-45 will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        />
        <motion.div
          animate={{ rotateY: [0, 360], scale: [0.9, 1.1, 0.9], opacity: [0.08, 0.22, 0.08] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[60%] right-[20%] w-32 h-32 rounded-full border border-cyan-500/10 will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        />
        <motion.div
          animate={{ rotateX: [45, 405], rotateZ: [0, 180], y: [0, -25, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-[30%] left-[15%] w-10 h-10 border border-blue-400/20 rounded-lg will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        />
      </div>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <motion.div
        style={{ scale: contentScale, opacity: contentOpacity, y: contentY }}
        className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center px-4 will-change-transform"
      >

        {/* Badge + Name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="hero-reveal-item flex flex-col items-center gap-4 mb-6"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="px-5 py-2 rounded-full glass border border-primary/30 text-primary font-medium text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(59,130,246,0.12)]"
          >
            Available for New Projects
          </motion.span>

          {/* ── Clip-path Text Reveal: Name ─── */}
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-medium text-foreground tracking-tight overflow-hidden py-2">
            <TextReveal text="PRANESH" delayStart={0.5} />
            {' '}
            <span className="text-blue-400 font-bold italic">
              <TextReveal text="RAMESH" delayStart={1.2} />
            </span>
          </h2>
        </motion.div>

        {/* Type animation */}
        <motion.div className="hero-reveal-item mb-8 max-w-4xl min-h-[160px] flex items-center justify-center">
          <TypeAnimation
            sequence={[
              "Hi, I'm Pranesh — Driven Software Systems student with practical experience in web development and UI optimization.",
              2500,
              "Hi, I'm Pranesh — Building scalable frontend solutions, cloud-based applications, and practical MERN products.",
              2500,
              "Hi, I'm Pranesh — Passionate about DevOps, cybersecurity, debugging, and modern full-stack development.",
              2500,
            ]}
            wrapper="h1"
            speed={35}
            className="hero-reveal-item font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-balance text-foreground neon-text-glow"
            repeat={Infinity}
            cursor={true}
          />
        </motion.div>

        {/* Sub-paragraph — Fade Up */}
        <motion.p
          variants={fadeUpVariant}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.0 }}
          className="hero-reveal-item text-lg md:text-xl text-muted-foreground/90 max-w-3xl mx-auto mb-10 tracking-wide leading-relaxed"
        >
          Eager to contribute to scalable frontend solutions and cloud-based applications while continually enhancing technical and professional skills in{' '}
          <span className="text-primary font-medium">DevOps</span>,{' '}
          <span className="text-primary font-medium">AI</span>, and{' '}
          <span className="text-primary font-medium">Full-Stack Development</span>.
        </motion.p>

        {/* Tags — Stagger */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="hero-reveal-item flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          {['Student', 'Tamil & English', 'MERN Stack', 'AWS', 'Cybersecurity'].map((item) => (
            <motion.span
              key={item}
              variants={fadeUpVariant}
              whileHover={{ scale: 1.08, y: -2 }}
              className="px-4 py-2 rounded-full glass border border-border/50 text-sm text-muted-foreground will-change-transform"
            >
              {item}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="hero-reveal-item flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <MagneticButton>
            <Link
              href="/#projects"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative px-8 py-4 bg-gradient-to-r from-primary via-blue-500 to-primary text-primary-foreground rounded-full font-bold overflow-hidden transition-all hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(59,130,246,0.4)] will-change-transform"
            >
              <span className="relative z-10 flex items-center gap-2">
                View Projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-500 to-primary rounded-full blur opacity-0 group-hover:opacity-75 transition duration-500 -z-10" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => handleScroll('#about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
      >
        <span className="text-xs tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">Discover</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-12 bg-gradient-to-b from-muted-foreground via-red-500 to-transparent will-change-transform"
        />
        <ArrowDown size={16} className="absolute bottom-0 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-8" />
      </motion.button>
    </section>
  );
}
