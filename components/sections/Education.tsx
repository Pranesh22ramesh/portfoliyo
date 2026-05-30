'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BookOpen, School, Rocket, Users } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  fadeUpVariant,
  textRevealVariant,
  slideLeftVariant,
  viewportOnce,
} from '@/lib/AnimationUtils';

gsap.registerPlugin(ScrollTrigger);

const timelineItems = [
  {
    year: '2023 – Present',
    title: 'Master of Science (Software Systems)',
    place: 'Kongu Engineering College, Perundurai',
    desc: 'Deepening expertise in full-stack architecture, AI integration, and large-scale systems. Current CGPA: 7.12.',
    icon: Rocket,
    color: '#3b82f6',
    current: true,
    coursework: ['DSA', 'Cloud Computing', 'Machine Learning', 'Web Technologies', 'Software Testing', 'DBMS'],
    clubNote: 'Active member of tech club — participated in DevOps & AI/ML seminars.'
  },
  {
    year: '2022 – 2023',
    title: 'Higher Secondary (HSC)',
    place: 'Bharani Park Matric Higher Secondary School, Karur',
    desc: 'Science stream with Computer Science. Scored in top 10% of school batch.',
    icon: School,
    color: '#0ea5e9',
    current: false,
  },
  {
    year: '2020 – 2021',
    title: 'Secondary School (SSLC)',
    place: 'Bharani Park Matric Higher Secondary School, Karur',
    desc: 'Achieved academic excellence with distinction in core subjects.',
    icon: BookOpen,
    color: '#06b6d4',
    current: false,
  },
];

export default function Education() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineTrackRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // ── Multi-depth parallax via Framer Motion ──────────────────────────────
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const blobRight = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const blobLeft = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);

  // ── GSAP scrub timeline line ─────────────────────────────────────────────
  useEffect(() => {
    if (!lineTrackRef.current || !lineFillRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineFillRef.current,
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: lineTrackRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── Anime.js Float Loop for coursework chips (KEC card only) ──────────────
  useEffect(() => {
    import('animejs').then((mod) => {
      const anime = mod.default;
      const coursework = ['DSA', 'Cloud Computing', 'Machine Learning', 'Web Technologies', 'Software Testing', 'DBMS'];
      coursework.forEach((_, idx) => {
        const el = document.getElementById(`course-chip-${idx}`);
        if (!el) return;
        const baseOffset = -8 + (idx * 3.7) % 16.5;
        anime({
          targets: el,
          translateY: [baseOffset - 4, baseOffset + 4],
          duration: 3000 + (idx * 370) % 2000,
          direction: 'alternate',
          loop: true,
          easing: 'easeInOutSine',
        });
      });
    });
  }, []);

  return (
    <section id="education" ref={sectionRef} className="relative py-24 md:py-32 px-4 overflow-hidden">
      {/* Parallax background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ y: blobRight }}
          animate={{ opacity: [0.05, 0.15, 0.05], scale: [0.9, 1.1, 0.9], x: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] will-change-transform"
        />
        <motion.div
          style={{ y: blobLeft }}
          animate={{ opacity: [0.05, 0.12, 0.05], scale: [1.1, 0.9, 1.1], x: [0, -30, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute left-0 top-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] will-change-transform"
        />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header — Fade Up */}
        <div className="text-center mb-16 px-4">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-12 bg-primary/60" />
            <span className="text-sm font-medium text-primary tracking-widest uppercase">Academic Journey</span>
            <div className="h-px w-12 bg-primary/60" />
          </motion.div>

          <motion.h2
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="section-heading"
          >
            Formative <span className="gradient-text">Years</span>
          </motion.h2>
        </div>

        {/* Timeline */}
        <div ref={containerRef} className="relative mt-20 px-4 md:px-0">
          {/* Track (static grey) */}
          <div ref={lineTrackRef} className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2" />
          {/* Fill (GSAP scrub) */}
          <div
            ref={lineFillRef}
            className="absolute left-8 md:left-1/2 top-0 w-[2px] h-full -translate-x-1/2 z-10 will-change-transform"
            style={{ background: 'linear-gradient(to bottom, #3b82f6, #06b6d4)', transformOrigin: 'top center' }}
          />

          <div className="space-y-24 md:space-y-32">
            {timelineItems.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;
              const isKEC = item.current && item.coursework;

              return (
                <div
                  key={item.title}
                  className="relative"
                  data-aos="fade-up"
                  data-aos-delay={index * 120}
                >
                  {/* Node */}
                  <div className="absolute left-8 md:left-1/2 top-0 -translate-x-1/2 z-20">
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden cursor-pointer will-change-transform"
                      style={{ background: '#030303', border: `2px solid ${item.color}44` }}
                    >
                      <div className="absolute inset-0 opacity-20" style={{ background: item.color }} />
                      <Icon className="relative z-10" style={{ color: item.color }} />
                    </motion.div>

                    {item.current && (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-2xl bg-primary/40 z-10 will-change-transform"
                        />
                        <motion.div
                          animate={{ scale: [1.2, 1.8, 1.2], opacity: [0.3, 0, 0.3] }}
                          transition={{ duration: 2.5, repeat: Infinity, delay: 0.2 }}
                          className="absolute -inset-2 rounded-2xl border-2 border-primary/50 z-0 will-change-transform"
                        />
                      </>
                    )}
                  </div>

                  {/* Card */}
                  <div className={`flex flex-col md:flex-row items-start w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    <div className="w-full md:w-1/2 pl-20 md:pl-0">
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? 50 : -50, scale: 0.92 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={`glass p-6 md:p-8 rounded-[2rem] border border-white/5 relative group hover:border-primary/40 transition-all duration-500 will-change-transform ${isEven ? 'md:mr-16' : 'md:ml-16'}`}
                      >
                        {/* Glow on hover */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-accent/50 rounded-[2rem] opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 -z-10 pointer-events-none" />

                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="text-xs font-bold tracking-widest text-primary uppercase px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
                          >
                            {item.year}
                          </motion.span>
                          {item.current && (
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="flex items-center gap-2 will-change-transform"
                            >
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[10px] font-bold text-emerald-500 tracking-tighter uppercase">Current</span>
                            </motion.div>
                          )}
                        </div>

                        {/* Text Reveal on card title */}
                        <h3 className="text-xl md:text-2xl font-display font-bold mb-2 overflow-hidden">
                          <motion.span
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } }, hidden: {} }}
                            className="flex flex-wrap gap-x-[0.25em]"
                          >
                            {item.title.split(' ').map((w, wi) => (
                              <motion.span key={wi} variants={textRevealVariant} className="inline-block will-change-transform">
                                {w}
                              </motion.span>
                            ))}
                          </motion.span>
                        </h3>

                        <p className="text-sm font-semibold text-muted-foreground/80 mb-4 flex items-center gap-2">
                          <motion.span animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity }} className="will-change-transform">
                            <School size={14} className="text-primary/60" />
                          </motion.span>
                          {item.place}
                        </p>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.desc}</p>

                        {/* ── KEC Card Extra Features ── */}
                        {isKEC && (
                          <div className="mt-6 space-y-6 pt-6 border-t border-white/5">
                            {/* CGPA Radial Gauge Dial */}
                            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 bg-white/[0.02] p-5 rounded-2xl border border-white/5 select-none">
                              <div className="relative w-[120px] h-[120px] flex items-center justify-center">
                                <svg width="120" height="120" viewBox="0 0 120 120" className="w-full h-full">
                                  <defs>
                                    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                      <stop offset="0%" stopColor="#3b82f6" />
                                      <stop offset="100%" stopColor="#22d3ee" />
                                    </linearGradient>
                                  </defs>
                                  {/* Background gauge arc (circumference = 289.03) */}
                                  <circle
                                    cx="60"
                                    cy="60"
                                    r="46"
                                    stroke="rgba(255,255,255,0.06)"
                                    strokeWidth="6"
                                    fill="none"
                                    strokeDasharray="216.77 289.03"
                                    transform="rotate(135 60 60)"
                                    strokeLinecap="round"
                                  />
                                  {/* Foreground progress arc */}
                                  <motion.circle
                                    cx="60"
                                    cy="60"
                                    r="46"
                                    stroke="url(#gaugeGrad)"
                                    strokeWidth="6"
                                    fill="none"
                                    strokeDasharray="216.77 289.03"
                                    initial={{ strokeDashoffset: 216.77 }}
                                    whileInView={{ strokeDashoffset: 216.77 * (1 - 0.712) }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
                                    transform="rotate(135 60 60)"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                {/* Center labels */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-xl font-black text-foreground leading-none">7.12</span>
                                  <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">/ 10 CGPA</span>
                                </div>
                              </div>
                              <div className="text-center sm:text-left">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 block">Academic Standing</span>
                                <p className="text-sm font-semibold text-foreground mt-1">Excellent Progress</p>
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold mt-2">
                                  Trending Up ↑
                                </span>
                              </div>
                            </div>

                            {/* Coursework Chip Cloud */}
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 block mb-3">
                                Relevant Coursework
                              </span>
                              <motion.div
                                variants={{
                                  hidden: {},
                                  visible: { transition: { staggerChildren: 0.1 } }
                                }}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="flex flex-wrap gap-2 py-4 justify-center items-center min-h-[90px] relative overflow-hidden"
                              >
                                {item.coursework.map((chip, idx) => {
                                  const baseOffset = -8 + (idx * 3.7) % 16.5;
                                  return (
                                    <motion.span
                                      id={`course-chip-${idx}`}
                                      key={chip}
                                      variants={{
                                        hidden: { opacity: 0, scale: 0.7, translateY: baseOffset },
                                        visible: { opacity: 1, scale: 1, translateY: baseOffset }
                                      }}
                                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                      className="coursework-chip glass px-3 py-1.5 rounded-full text-[11px] font-semibold text-primary border border-primary/20 will-change-transform"
                                      style={{ transform: `translateY(${baseOffset}px)` }}
                                    >
                                      {chip}
                                    </motion.span>
                                  );
                                })}
                              </motion.div>
                            </div>

                            {/* Tech Club Callout */}
                            <motion.div
                              variants={slideLeftVariant}
                              transition={{ delay: 0.4 }}
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true }}
                              className="glass px-4 py-3 flex items-center gap-3 border border-y-white/5 border-r-white/5 border-l-2 border-l-primary/40 rounded-xl rounded-l-none select-none"
                            >
                              <Users size={16} className="text-primary flex-shrink-0" />
                              <span className="text-[11px] text-muted-foreground/90 font-medium leading-relaxed">
                                {item.clubNote}
                              </span>
                            </motion.div>
                          </div>
                        )}

                        {/* Shadow accent */}
                        <div
                          className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-25 transition-opacity duration-700 pointer-events-none"
                          style={{ background: item.color }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
