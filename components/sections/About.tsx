'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, Variants } from 'framer-motion';
import { useCountUp } from '@/lib/useCountUp';

const sentence = 'Driven by frontend development, cybersecurity, cloud, and AI — I build practical products that stay usable, scalable, and reliable from interface to deployment.';

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

function AnimatedText({ text, delayOffset = 0 }: { text: string; delayOffset?: number }) {
  const words = text.split(' ');
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: delayOffset } } }}
      className="flex flex-wrap gap-x-2 gap-y-1"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.9] }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

function StatCard({ value, suffix, label, delay }: { value: number; suffix?: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const count = useCountUp(value, 1600, inView);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMove = (cx: number, cy: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setRot({
      x: -((cy - r.top - r.height / 2) / r.height) * 18,
      y: ((cx - r.left - r.width / 2) / r.width) * 18,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 300, damping: 22, delay }}
      style={{ perspective: '800px' }}
    >
      <div
        ref={ref}
        onMouseMove={(e) => { setHovered(true); handleMove(e.clientX, e.clientY); }}
        onMouseLeave={() => { setHovered(false); setRot({ x: 0, y: 0 }); }}
        style={{
          transform: hovered
            ? `rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(1.06)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out',
        }}
        className="glass px-6 py-5 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors hover:shadow-[0_0_30px_rgba(59,130,246,0.25)] cursor-default"
      >
        <p className="text-primary font-extrabold text-3xl leading-none mb-1 font-display">
          {count}{suffix}
        </p>
        <p className="text-[11px] text-muted-foreground uppercase tracking-widest">{label}</p>
      </div>
    </motion.div>
  );
}

const stats = [
  { value: 5, suffix: '+', label: 'Core Projects', delay: 0 },
  { value: 2, label: 'Languages', delay: 0.1 },
  { value: 5, suffix: '+', label: 'Certifications', delay: 0.2 },
  { value: 2, suffix: '+', label: 'Years of Building', delay: 0.3 },
];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const layer1Y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacityFade = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-screen py-32 px-4 flex items-center justify-center overflow-hidden"
    >
      {/* Background effects */}
      <motion.div
        style={{ y: layer1Y, opacity: opacityFade }}
        className="absolute inset-0 pointer-events-none flex justify-center items-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          className="w-[700px] h-[700px] rounded-full border border-primary/8 [mask-image:radial-gradient(circle,white_20%,transparent_80%)]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[500px] h-[500px] rounded-full border border-accent/8 [mask-image:radial-gradient(circle,white_20%,transparent_80%)]"
        />
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-0 top-1/4 w-96 h-96 rounded-full blur-[130px] bg-gradient-to-br from-blue-600 to-cyan-400 pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, 25, 0], y: [0, -25, 0], opacity: [0.04, 0.12, 0.04] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-40 bottom-1/3 w-80 h-80 rounded-full blur-[110px] bg-gradient-to-tr from-purple-600 to-transparent pointer-events-none"
      />

      <div className="max-w-5xl mx-auto relative z-10 w-full">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-16"
        >
          <div className="h-px w-12 bg-primary/60" />
          <span className="text-sm font-medium text-primary tracking-[0.2em] uppercase">About Me</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight leading-[1.1] text-balance">
              Software Systems student with{' '}
              <span className="gradient-text italic">practical experience</span>.
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I have hands-on experience in{' '}
                <span className="text-foreground font-medium">web development</span>,{' '}
                <span className="text-foreground font-medium">UI optimization</span>, debugging, AWS cloud services,
                and DevOps practices. My focus is building scalable frontend experiences that feel polished.
              </p>
              <p>
                Based in <span className="text-primary font-medium">Karur, Tamil Nadu</span>, I enjoy solving
                product problems across the stack with MERN, React Native, and Python. I communicate in Tamil and English,
                growing continuously through real projects and certifications.
              </p>
            </div>

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-full glass border border-green-500/20 bg-green-500/5"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
              </span>
              <span className="text-sm font-medium text-green-400">Open to new opportunities</span>
            </motion.div>
          </motion.div>

          {/* Right column — animated stats */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-xl sm:text-2xl text-muted-foreground leading-relaxed text-balance"
            >
              <AnimatedText text={sentence} delayOffset={0.3} />
            </motion.div>

            {/* Stat grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <StatCard key={s.label} value={s.value} suffix={s.suffix} label={s.label} delay={s.delay} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
