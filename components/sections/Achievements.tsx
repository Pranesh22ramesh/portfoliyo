'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Award, Quote, Github, Code2, Shield, Cloud, Star } from 'lucide-react';
import {
  fadeUpVariant,
  staggerContainer,
  viewportOnce,
} from '@/lib/AnimationUtils';

const highlights = [
  {
    icon: Trophy,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.3)',
    label: 'Achievement',
    title: 'Hackwave 3.0.1',
    desc: 'Won Third Prize at Hackwave 3.0.1 — KEC 24-hour hackathon, competing against 50+ teams.',
  },
  {
    icon: Award,
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.3)',
    label: 'Certifications',
    title: '6 Key Certifications',
    desc: 'Oracle APEX Cloud, Cisco Cybersecurity, Cyber Threat Management, Ethical Hacking, Java DS, and NASSCOM QA.',
  },
  {
    icon: Quote,
    color: '#22d3ee',
    glow: 'rgba(34,211,238,0.3)',
    label: 'Industry Recognition',
    title: 'Expert Panel Acknowledgment',
    desc: 'Presented AI/ML project to a panel of industry experts at KEC — received recognition for real-world applicability and production readiness.',
  },
  {
    icon: Github,
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.3)',
    label: 'Open Source',
    title: 'Pranesh22ramesh',
    desc: 'Portfolio projects and code samples publicly available for deeper exploration.',
  },
];

const globalStats = [
  { icon: Code2, value: 5, suffix: '+', label: 'Projects Shipped', color: '#3b82f6' },
  { icon: Star, value: 3, label: 'Hackathons', color: '#f59e0b' },
  { icon: Shield, value: 5, suffix: '+', label: 'Certifications', color: '#06b6d4' },
  { icon: Cloud, value: 3, suffix: '+', label: 'Cloud Tools', color: '#8b5cf6' },
];

// ── Slot Machine Digit component ──
function SlotDigit({ digit, delay, inView }: { digit: number; delay: number; inView: boolean }) {
  return (
    <span className="inline-block overflow-hidden h-[1.2em] relative w-[0.65em] leading-none select-none">
      <motion.span
        initial={{ y: '0%' }}
        animate={inView ? { y: `${-digit * 10}%` } : { y: '0%' }}
        transition={{
          duration: 0.9,
          ease: [0.19, 1, 0.22, 1], // easeOutExpo
          delay: delay,
        }}
        className="flex flex-col absolute left-0 top-0 w-full"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="h-[1.2em] flex items-center justify-center">
            {n}
          </span>
        ))}
      </motion.span>
      {/* Invisible placeholder for size alignment */}
      <span className="invisible opacity-0 pointer-events-none">8</span>
    </span>
  );
}

// ── Slot Machine Number wrapper ──
function SlotNumber({ value, inView, color, suffix }: { value: number; inView: boolean; color: string; suffix: string }) {
  const digits = Math.abs(value).toString().split('').map(Number);
  return (
    <span className="inline-flex items-center text-2xl font-extrabold font-display leading-none" style={{ color }}>
      {digits.map((digit, idx) => (
        <SlotDigit key={idx} digit={digit} delay={idx * 0.08} inView={inView} />
      ))}
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
}

function StatBadge({ icon: Icon, value, suffix = '', label, color }: {
  icon: any; value: number; suffix?: string; label: string; color: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={wrapRef}
      whileHover={{ y: -4, scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className="flex items-center gap-4 glass px-6 py-5 rounded-2xl border border-white/8 hover:border-white/20 transition-colors cursor-default flex-1 min-w-[160px] will-change-transform"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}22`, color }}>
        <Icon size={20} />
      </div>
      <div>
        <div className="h-6 flex items-center">
          <SlotNumber value={value} suffix={suffix} inView={inView} color={color} />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

export default function Achievements() {
  return (
    <section id="achievements" className="relative py-32 px-4 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15], rotate: [0, 180, 360] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[900px] h-[350px] rounded-[100%] blur-[130px] bg-gradient-to-r from-blue-500/25 via-cyan-500/25 to-purple-500/25 will-change-transform"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Header — Fade Up */}
        <div className="text-center mb-20">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full glass border border-border/50"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">The Impact</span>
          </motion.div>

          <motion.h2
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4"
          >
            Career <span className="gradient-text italic pr-2">Highlights</span>
          </motion.h2>

          <motion.p
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-muted-foreground max-w-lg mx-auto"
          >
            A snapshot of what I&apos;ve built, earned, and achieved throughout my engineering journey.
          </motion.p>
        </div>

        {/* Stats row — Slot machine numbers */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-wrap gap-4 justify-center mb-16"
        >
          {globalStats.map((s) => (
            <StatBadge key={s.label} {...s} />
          ))}
        </motion.div>

        {/* Highlight cards — AOS stagger */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            const isTrophy = item.icon === Trophy;
            const isQuote = item.icon === Quote;
            const cardRef = useRef<HTMLDivElement>(null);

            // Shimmer border animation loop (Hackwave only)
            useEffect(() => {
              if (!isTrophy) return;
              let angle = 0;
              let frameId: number;
              const update = () => {
                angle = (angle + 1.5) % 360;
                if (cardRef.current) {
                  cardRef.current.style.setProperty('--rotate', `${angle}deg`);
                }
                frameId = requestAnimationFrame(update);
              };
              frameId = requestAnimationFrame(update);
              return () => cancelAnimationFrame(frameId);
            }, [isTrophy]);

            return (
              <div
                key={item.title}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                data-aos-duration="700"
              >
                <motion.div
                  style={{ perspective: '1000px' }}
                  className="h-full"
                >
                  <div
                    ref={cardRef}
                    className="group relative rounded-[2rem] p-8 border overflow-hidden cursor-default transition-all duration-200 h-full will-change-transform"
                    style={
                      isTrophy
                        ? {
                            border: '1px solid transparent',
                            background: `linear-gradient(rgba(5,8,22,1), rgba(5,8,22,1)) padding-box, linear-gradient(var(--rotate, 0deg), #f59e0b, #fbbf24, #ffffff80, #f97316, #f59e0b) border-box`,
                          }
                        : {
                            background: 'rgba(5,8,22,0.6)',
                            backdropFilter: 'blur(32px)',
                            borderColor: 'rgba(255,255,255,0.06)',
                          }
                    }
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
                      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
                      e.currentTarget.style.transform = `rotateX(${y}deg) rotateY(${x}deg) scale(1.04)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
                    }}
                  >
                    {/* Decorative quote mark for Panel Recognition card */}
                    {isQuote && (
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
                        className="absolute top-4 right-4 text-6xl text-cyan-400/20 font-serif leading-none pointer-events-none select-none will-change-transform"
                      >
                        &ldquo;
                      </motion.div>
                    )}

                    {/* Hover glow */}
                    <div
                      className="absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                      style={{ background: `radial-gradient(circle at center, ${item.glow}, transparent 70%)` }}
                    />
                    {/* Top border line */}
                    {!isTrophy && (
                      <div
                        className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
                      />
                    )}

                    {/* Icon float */}
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg will-change-transform"
                      style={{ background: `${item.color}1a`, color: item.color, border: `1px solid ${item.color}33` }}
                    >
                      <Icon size={26} />
                    </motion.div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: item.color }}>
                      {item.label}
                    </p>
                    <p className="font-display font-bold text-lg text-foreground mb-3 group-hover:text-white transition-colors leading-tight">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
