'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Award, Languages, Github, Code2, Shield, Cloud, Star } from 'lucide-react';
import { useCountUp } from '@/lib/useCountUp';

const highlights = [
  {
    icon: Trophy,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.3)',
    label: 'Achievement',
    title: 'Hackwave 3.0.1',
    desc: 'Won Third Prize in Hackwave 3.0.1 at KEC — a 24-hour competitive hackathon.',
  },
  {
    icon: Award,
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.3)',
    label: 'Certifications',
    title: '5 Key Certifications',
    desc: 'Oracle APEX Cloud, Cisco Cybersecurity, Ethical Hacking, Java DS, and NASSCOM QA.',
  },
  {
    icon: Languages,
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.3)',
    label: 'Communication',
    title: 'Tamil & English',
    desc: 'Comfortable communicating, collaborating, and presenting in both languages.',
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

function StatBadge({ icon: Icon, value, suffix, label, color }: { icon: any; value: number; suffix?: string; label: string; color: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const count = useCountUp(value, 1400, inView);
  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -4, scale: 1.04 }}
      className="flex items-center gap-4 glass px-6 py-5 rounded-2xl border border-white/8 hover:border-white/20 transition-all cursor-default flex-1 min-w-[160px]"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}22`, color }}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-extrabold font-display leading-none" style={{ color }}>
          {count}{suffix}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

export default function Achievements() {
  return (
    <section id="achievements" className="relative py-32 px-4 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15], rotate: [0, 180, 360] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[900px] h-[350px] rounded-[100%] blur-[130px] bg-gradient-to-r from-blue-500/25 via-cyan-500/25 to-purple-500/25 pointer-events-none"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full glass border border-border/50"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">The Impact</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4"
          >
            Career <span className="gradient-text italic pr-2">Highlights</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-lg mx-auto"
          >
            A snapshot of what I've built, earned, and achieved throughout my engineering journey.
          </motion.p>
        </div>

        {/* Global stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-4 justify-center mb-16"
        >
          {globalStats.map((s) => (
            <StatBadge key={s.label} {...s} />
          ))}
        </motion.div>

        {/* Highlight cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ perspective: '1000px' }}
              >
                <div
                  className="group relative rounded-[2rem] p-8 border overflow-hidden cursor-default transition-all duration-200"
                  style={{
                    background: 'rgba(5,8,22,0.6)',
                    backdropFilter: 'blur(32px)',
                    borderColor: 'rgba(255,255,255,0.06)',
                  }}
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
                {/* Hover glow */}
                <div
                  className="absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                  style={{ background: `radial-gradient(circle at center, ${item.glow}, transparent 70%)` }}
                />
                {/* Icon top border line */}
                <div className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
                />

                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
