'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Code2, Wrench, Shield, BrainCircuit, Users, BadgeCheck } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  fadeUpVariant,
  staggerContainer,
  staggerContainerFast,
  viewportOnce,
  viewportOnceNarrow,
} from '@/lib/AnimationUtils';

gsap.registerPlugin(ScrollTrigger);

let animeInstance: any = null;
const getAnime = async () => {
  if (animeInstance) return animeInstance;
  const mod = await import('animejs');
  animeInstance = mod.default;
  return animeInstance;
};

interface SkillCategory {
  category: string;
  Icon: any;
  color: string;
  desc: string;
  skills: string[];
  wide?: boolean;
}

const skillCategories: SkillCategory[] = [
  {
    category: 'Specialized In',
    Icon: Code2,
    color: '#3b82f6',
    desc: 'Core engineering strengths across programming, frontend, backend, and DevOps.',
    skills: ['React', 'Next.js', 'Node.js', 'Express', 'JavaScript', 'TypeScript', 'Python', 'MongoDB', 'MySQL', 'HTML/CSS', 'AWS', 'DevOps', 'C', 'C++', 'Java', 'PHP'],
    wide: true,
  },
  {
    category: 'Technical Tools',
    Icon: Wrench,
    color: '#0ea5e9',
    desc: 'Everyday tools for building, shipping, and collaborating.',
    skills: ['Git & GitHub', 'VS Code', 'Figma', 'Docker', 'Jenkins', 'Jira', 'Wireshark'],
  },
  {
    category: 'Testing & Security',
    Icon: Shield,
    color: '#06b6d4',
    desc: 'Testing, QA, and security-focused workflows.',
    skills: ['Selenium (Java & Python)', 'API Testing', 'Debugging', 'Ethical Hacking', 'Cybersecurity'],
  },
  {
    category: 'Cloud, Data & AI',
    Icon: BrainCircuit,
    color: '#8b5cf6',
    desc: 'Applied cloud and intelligent systems work.',
    skills: ['AWS (EC2, S3, RDS)', 'TensorFlow', 'OpenCV', 'Django', 'Streamlit', 'LSTM', 'Autoencoder'],
  },
  {
    category: 'Professional Skills',
    Icon: Users,
    color: '#0ea5e9',
    desc: 'How I work with teams and deliver results.',
    skills: ['Agile / Scrum', 'Problem Solving', 'Team Collaboration', 'Adaptability', 'UX Thinking'],
  },
];

const certifications = [
  { name: 'Ethical Hacking 101 — Beginners Guide', shortName: 'Ethical Hacking 101', issuer: 'SkillsUp', year: 2024 },
  { name: 'Oracle APEX Cloud Developer Certified Professional', shortName: 'Oracle APEX Cloud Developer', issuer: 'Oracle', year: 2024 },
  { name: 'Data Structures using Java', shortName: 'Data Structures using Java', issuer: 'Online', year: 2023 },
  { name: 'Introduction to Cybersecurity (Cisco)', shortName: 'Introduction to Cybersecurity', issuer: 'Cisco', year: 2023 },
  { name: 'Cyber Threat Management (Cisco)', shortName: 'Cyber Threat Management', issuer: 'Cisco', year: 2024 },
  { name: 'Testing Tools / Selenium / API Testing (NASSCOM)', shortName: 'Testing Tools / Selenium / API Testing', issuer: 'NASSCOM', year: 2024 }
];

const masteryMap: Record<string, number> = {
  React: 92,
  'Next.js': 88,
  'Node.js': 85,
  TypeScript: 82,
  Python: 80,
  MongoDB: 78,
  AWS: 70,
  Docker: 68,
  default: 60
};

function SkillChip({ skill, color }: { skill: string; color: string }) {
  const mastery = masteryMap[skill] || masteryMap['default'];
  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -3 }}
      transition={{ type: 'spring', stiffness: 380, damping: 20 }}
      className="skill-chip px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors cursor-default will-change-transform flex flex-col justify-center items-center overflow-hidden"
      style={{
        background: `${color}12`,
        borderColor: `${color}28`,
        color: color,
      }}
    >
      <span>{skill}</span>
      {/* Mastery Bar */}
      <div className="w-10 h-[2px] mt-1 bg-white/5 overflow-hidden rounded-full relative">
        <div
          className="mastery-bar h-full w-0 rounded-full"
          data-mastery={mastery}
          style={{
            background: `${color}cc`,
          }}
        />
      </div>
    </motion.div>
  );
}

function SkillCard({ cat }: { cat: SkillCategory }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const animeInstanceRef = useRef<any>(null);
  const Icon = cat.Icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mx', `${x}px`);
    cardRef.current.style.setProperty('--my', `${y}px`);
  };

  const handleMouseEnter = async () => {
    const el = cardRef.current;
    if (!el) return;

    // Anime.js Border Glow
    const anime = await getAnime();
    anime({
      targets: el,
      boxShadow: [`0 0 0px ${cat.color}00`, `0 0 28px ${cat.color}60`],
      borderColor: [`${cat.color}28`, `${cat.color}80`],
      duration: 350,
      easing: 'easeOutQuad',
    });

    // Anime.js Background Gradient Angle Cycle
    if (animeInstanceRef.current) animeInstanceRef.current.pause();
    const obj = { angle: 0 };
    animeInstanceRef.current = anime({
      targets: obj,
      angle: 360,
      duration: 3000,
      easing: 'linear',
      loop: true,
      update: () => {
        setAngle(obj.angle);
      }
    });

    // Anime.js Mastery Bars Fill
    anime({
      targets: el.querySelectorAll('.mastery-bar'),
      width: (target: HTMLElement) => target.getAttribute('data-mastery') + '%',
      duration: 400,
      easing: 'easeOutQuad',
    });
  };

  const handleMouseLeave = async () => {
    const el = cardRef.current;
    if (!el) return;

    // Anime.js Reverse Border Glow
    const anime = await getAnime();
    anime({
      targets: el,
      boxShadow: [`0 0 28px ${cat.color}60`, `0 0 0px ${cat.color}00`],
      borderColor: [`${cat.color}80`, `${cat.color}28`],
      duration: 350,
      easing: 'easeOutQuad',
    });

    // Stop Background Gradient Angle Cycle
    if (animeInstanceRef.current) {
      animeInstanceRef.current.pause();
      animeInstanceRef.current = null;
    }
    setAngle(0);

    // Anime.js Reverse Mastery Bars Collapse
    anime({
      targets: el.querySelectorAll('.mastery-bar'),
      width: '0%',
      duration: 350,
      easing: 'easeOutQuad',
    });
  };

  return (
    <motion.div
      ref={cardRef}
      variants={fadeUpVariant}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative rounded-[2rem] p-7 border border-white/8 overflow-hidden transition-colors duration-500 hover:border-white/15 cursor-default select-none will-change-transform ${cat.wide ? 'sm:col-span-2 lg:col-span-2' : ''}`}
      style={{
        backgroundImage: `linear-gradient(${angle}deg, rgba(5,8,22,0.6) 0%, rgba(5,8,22,0.85) 100%)`,
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Holographic Sheen Radial Gradient */}
      <div
        className="absolute inset-0 rounded-[2rem] pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at var(--mx, 0px) var(--my, 0px), hsla(220,100%,70%,0.12) 0%, transparent 60%)`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Corner accent */}
      <div
        className="absolute top-0 left-0 w-48 h-48 -ml-16 -mt-16 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
        style={{ background: cat.color }}
      />

      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 transition-all duration-300 group-hover:scale-110 will-change-transform"
          style={{ background: `${cat.color}18`, color: cat.color, border: `1px solid ${cat.color}30` }}
        >
          <Icon size={22} />
        </div>
        <div>
          <h3 className="text-base font-display font-bold">{cat.category}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {cat.skills.map((skill) => (
          <SkillChip key={skill} skill={skill} color={cat.color} />
        ))}
      </div>
    </motion.div>
  );
}

function CertFlipCard({ name, shortName, issuer, year }: { name: string; shortName: string; issuer: string; year: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="w-[200px] h-[80px] select-none"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative w-full h-full duration-500"
        style={{
          transform: hovered ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s ease',
        }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 w-full h-full glass rounded-xl border border-primary/15 flex items-center gap-2.5 p-3"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <BadgeCheck size={18} className="text-primary flex-shrink-0 animate-pulse" />
          <span className="text-xs font-semibold text-foreground/90 line-clamp-2" title={name}>
            {shortName}
          </span>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 w-full h-full glass-heavy rounded-xl border border-green-500/20 bg-green-950/20 flex flex-col justify-center items-center p-2 text-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <p className="text-[10px] font-bold text-white line-clamp-1">{issuer}</p>
          <p className="text-[9px] text-muted-foreground mt-0.5">{year}</p>
          <span className="mt-1 px-2 py-0.5 text-[8px] font-black text-green-400 bg-green-500/10 border border-green-500/20 rounded-full uppercase tracking-widest">
            Verified ✓
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  // Preload animejs on mount for instant hover animations
  useEffect(() => {
    getAnime();
  }, []);

  // ── GSAP ScrollTrigger stagger for all chips ──────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skill-chip', {
        opacity: 0,
        scale: 0.8,
        y: 12,
        duration: 0.4,
        ease: 'power3.out',
        stagger: {
          each: 0.025,
          from: 'start',
        },
        scrollTrigger: {
          trigger: '.skill-chips-container',
          start: 'top 85%',
          once: true,
          invalidateOnRefresh: true,
        },
        clearProps: 'all',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="relative py-24 md:py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.07)_0%,transparent_70%)] will-change-transform"
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], opacity: [0.04, 0.1, 0.04] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 right-1/4 w-96 h-96 rounded-full blur-[130px] bg-blue-500/30 will-change-transform"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 20, 0], opacity: [0.04, 0.1, 0.04] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-40 left-1/4 w-80 h-80 rounded-full blur-[110px] bg-purple-500/30 will-change-transform"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header — Fade Up */}
        <div className="text-center mb-16 px-4">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="h-px w-12 bg-primary/60" />
            <span className="text-sm font-semibold text-primary tracking-[0.2em] uppercase">My Stack</span>
            <div className="h-px w-12 bg-primary/60" />
          </motion.div>
          <motion.h2
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="section-heading"
          >
            Technical <span className="gradient-text">Mastery</span>
          </motion.h2>
        </div>

        {/* Skills bento grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnceNarrow}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12 skill-chips-container"
        >
          {skillCategories.map((cat) => (
            <SkillCard key={cat.category} cat={cat} />
          ))}
        </motion.div>

        {/* Certifications — AOS fade-up */}
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="rounded-[2rem] p-8 border border-primary/15 bg-primary/4 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10 text-primary border border-primary/20">
              <BadgeCheck size={22} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg">Certifications</h3>
              <p className="text-sm text-muted-foreground">Formal credentials supporting my technical journey</p>
            </div>
          </div>

          <motion.div
            variants={staggerContainerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-wrap gap-4 justify-center"
          >
            {certifications.map((cert) => (
              <motion.div key={cert.name} variants={fadeUpVariant}>
                <CertFlipCard {...cert} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
