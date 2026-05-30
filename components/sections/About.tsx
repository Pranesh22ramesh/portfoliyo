'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  textRevealVariant,
  slideLeftVariant,
  slideRightVariant,
  viewportOnce,
} from '@/lib/AnimationUtils';

const sentence = 'Driven by frontend development, cybersecurity, cloud, and AI — I build practical products that stay usable, scalable, and reliable from interface to deployment.';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

const tickerItems = [
  { number: '5+', label: 'Projects' },
  { number: '3', label: 'Hackathons' },
  { number: '5+', label: 'Certifications' },
  { number: '2+', label: 'Years Building' },
];

const wheelSkills = [
  { name: 'React', color: '#3b82f6', desc: 'Component-driven frontend UI development.' },
  { name: 'Node.js', color: '#10b981', desc: 'Asynchronous event-driven server runtimes.' },
  { name: 'Python', color: '#eab308', desc: 'Data processing, scripting, and automation backend.' },
  { name: 'AWS', color: '#f97316', desc: 'Cloud infrastructure hosting and management.' },
  { name: 'TypeScript', color: '#3178c6', desc: 'Strict syntactical superset of JavaScript.' },
  { name: 'MongoDB', color: '#47a248', desc: 'Document-based NoSQL database engine.' },
  { name: 'Docker', color: '#2496ed', desc: 'Containerised application isolation and packaging.' },
  { name: 'TensorFlow', color: '#ff6f00', desc: 'Deep learning neural network modeling.' },
];

// ── Polar Math Helpers ──
const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
};

const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
};

// ── Clip-path word reveal (GPU-efficient) ────────────────────────────────────
function TextReveal({ text, delayOffset = 0 }: { text: string; delayOffset?: number }) {
  const words = text.split(' ');
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={{
        visible: { transition: { staggerChildren: 0.045, delayChildren: delayOffset } },
        hidden: {},
      }}
      className="flex flex-wrap gap-x-[0.3em] gap-y-1"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={textRevealVariant}
          className="inline-block will-change-transform"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<SVGGElement>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState(false);

  // ── GitHub Heatmap Fetch ──
  useEffect(() => {
    fetch('https://github-contributions-api.jogruber.de/v4/Pranesh22ramesh')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (data && data.contributions) {
          const sorted = data.contributions.sort((a: any, b: any) => a.date.localeCompare(b.date));
          setContributions(sorted.slice(-168));
        } else {
          throw new Error('Data format incorrect');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching contributions:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  // ── Skill Wheel Rotation Loop ──
  useEffect(() => {
    let rotation = 0;
    let frameId: number;
    const update = () => {
      rotation = (rotation + 0.15) % 360;
      if (wheelRef.current) {
        wheelRef.current.setAttribute('transform', `rotate(${rotation}, 120, 120)`);
      }
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // ── Parallax logic ──
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const blobFarY   = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const blobNearY  = useTransform(scrollYProgress, [0, 1], ['0%', '55%']);
  const opacityFade = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  // Weeks grid setup
  const placeholder: ContributionDay[] = Array.from({ length: 168 }, (_, i) => ({
    date: '',
    count: 0,
    level: 0,
  }));
  const gridCells = contributions.length === 168 ? contributions : placeholder;
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < 24; i++) {
    weeks.push(gridCells.slice(i * 7, (i + 1) * 7));
  }

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-screen py-32 px-4 flex items-center justify-center overflow-hidden"
    >
      {/* ── Parallax background ─────────────────────────────────────────────── */}
      <motion.div style={{ opacity: opacityFade }} className="absolute inset-0 pointer-events-none">
        {/* Far layer — rotational ring */}
        <motion.div style={{ y: blobFarY }} className="absolute inset-0 flex justify-center items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            className="w-[700px] h-[700px] rounded-full border border-primary/8 [mask-image:radial-gradient(circle,white_20%,transparent_80%)] will-change-transform"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[500px] h-[500px] rounded-full border border-accent/8 [mask-image:radial-gradient(circle,white_20%,transparent_80%)] will-change-transform"
          />
        </motion.div>

        {/* Near layer — colour glows */}
        <motion.div style={{ y: blobNearY }} className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.06, 0.14, 0.06] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-0 top-1/4 w-96 h-96 rounded-full blur-[130px] bg-gradient-to-br from-blue-600 to-cyan-400 will-change-transform"
          />
          <motion.div
            animate={{ x: [0, 25, 0], y: [0, -25, 0], opacity: [0.04, 0.12, 0.04] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-40 bottom-1/3 w-80 h-80 rounded-full blur-[110px] bg-gradient-to-tr from-purple-600 to-transparent will-change-transform"
          />
        </motion.div>
      </motion.div>

      <div className="max-w-5xl mx-auto relative z-10 w-full">
        {/* Section label — Fade Up via AOS */}
        <div
          data-aos="fade-up"
          data-aos-duration="700"
          className="flex items-center gap-3 mb-16"
        >
          <div className="h-px w-12 bg-primary/60" />
          <span className="text-sm font-medium text-primary tracking-[0.2em] uppercase">About Me</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — AOS slide in from left */}
          <motion.div
            variants={slideLeftVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="space-y-8"
          >
            {/* ── Clip-path heading reveal ── */}
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight leading-[1.1] text-balance overflow-hidden">
              <motion.span
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } }, hidden: {} }}
                className="flex flex-wrap gap-x-[0.3em]"
              >
                {['Software', 'Systems', 'student', 'with'].map((w, i) => (
                  <motion.span key={i} variants={textRevealVariant} className="inline-block will-change-transform">{w}</motion.span>
                ))}
                {' '}
                <span className="gradient-text italic">
                  <motion.span
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.45 } }, hidden: {} }}
                    className="flex flex-wrap gap-x-[0.3em]"
                  >
                    {['practical', 'experience.'].map((w, i) => (
                      <motion.span key={i} variants={textRevealVariant} className="inline-block will-change-transform">{w}</motion.span>
                    ))}
                  </motion.span>
                </span>
              </motion.span>
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p data-aos="fade-up" data-aos-delay="100">
                I have hands-on experience in{' '}
                <span className="text-foreground font-medium">web development</span>,{' '}
                <span className="text-foreground font-medium">UI optimization</span>, debugging, AWS cloud services,
                and DevOps practices. My focus is building scalable frontend experiences that feel polished.
              </p>
              <p data-aos="fade-up" data-aos-delay="200">
                Based in <span className="text-primary font-medium">Karur, Tamil Nadu</span>, I enjoy solving
                product problems across the stack with MERN, React Native, and Python. I communicate in Tamil and English,
                growing continuously through real projects and certifications.
              </p>
            </div>

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              whileHover={{ scale: 1.04, y: -2 }}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-full glass border border-green-500/20 bg-green-500/5 will-change-transform"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
              </span>
              <span className="text-sm font-medium text-green-400">Open to new opportunities</span>
            </motion.div>

            {/* GitHub Heatmap Grid */}
            <div className="space-y-3 pt-6 border-t border-white/5">
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">GitHub Activity</div>
              <div className="flex gap-[3px] overflow-x-auto pb-2 scrollbar-none select-none max-w-full">
                {weeks.map((week, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-[3px] flex-shrink-0">
                    {week.map((day, rowIdx) => {
                      const cellIndex = colIdx * 7 + rowIdx;
                      return (
                        <motion.div
                          key={day.date || cellIndex}
                          custom={cellIndex}
                          variants={{
                            hidden: { scale: 0 },
                            visible: (i: number) => ({
                              scale: 1,
                              transition: {
                                delay: i * 0.005,
                                type: 'spring',
                                stiffness: 300,
                                damping: 20,
                              },
                            }),
                          }}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, margin: '-20px' }}
                          className={`w-2 h-2 rounded-sm will-change-transform ${
                            day.count === 0
                              ? 'bg-muted/5'
                              : day.count <= 3
                              ? 'bg-primary/20'
                              : day.count <= 7
                              ? 'bg-primary/50'
                              : 'bg-primary/90'
                          }`}
                          title={day.date ? `${day.date}: ${day.count} contributions` : undefined}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — AOS slide in from right */}
          <motion.div
            variants={slideRightVariant}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="space-y-12"
          >
            <div className="text-xl sm:text-2xl text-muted-foreground leading-relaxed text-balance">
              <TextReveal text={sentence} delayOffset={0.2} />
            </div>

            {/* Stat Ticker (Horizontal Marquee) */}
            <div className="w-full overflow-hidden relative py-4 border-y border-white/5">
              {/* Fade gradients on the sides */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

              <div className="ticker-track flex gap-4">
                {[...tickerItems, ...tickerItems].map((item, idx) => (
                  <div
                    key={idx}
                    className="glass px-6 py-4 rounded-2xl text-center flex-shrink-0 w-44 border border-border/50 select-none"
                  >
                    <p className="text-primary text-2xl font-bold font-display">{item.number}</p>
                    <p className="text-muted-foreground text-[10px] uppercase tracking-widest mt-1 font-medium">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Wheel */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-[240px] h-[240px] flex items-center justify-center">
                <svg width="240" height="240" viewBox="0 0 240 240" className="w-full h-full">
                  <g ref={wheelRef}>
                    {wheelSkills.map((skill, idx) => {
                      const startAngle = idx * 45 + 2.5;
                      const endAngle = (idx + 1) * 45 - 2.5;
                      const pathD = describeArc(120, 120, 90, startAngle, endAngle);

                      return (
                        <path
                          key={skill.name}
                          d={pathD}
                          fill="none"
                          stroke={skill.color}
                          strokeWidth={18}
                          strokeLinecap="butt"
                          className="cursor-pointer transition-all duration-300"
                          style={{
                            strokeOpacity: hoveredIndex === idx ? 1 : 0.6,
                            filter: hoveredIndex === idx ? 'brightness(1.5)' : 'none',
                          }}
                          onMouseEnter={() => setHoveredIndex(idx)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        />
                      );
                    })}

                    {/* Render labels at radius 68 */}
                    {wheelSkills.map((skill, idx) => {
                      const startAngle = idx * 45 + 2.5;
                      const endAngle = (idx + 1) * 45 - 2.5;
                      const midAngle = startAngle + (endAngle - startAngle) / 2;
                      const labelPos = polarToCartesian(120, 120, 68, midAngle);

                      return (
                        <text
                          key={`label-${skill.name}`}
                          x={labelPos.x}
                          y={labelPos.y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="fill-foreground font-display font-semibold pointer-events-none select-none"
                          style={{
                            fontSize: '9px',
                            opacity: hoveredIndex === idx ? 1 : 0.8,
                          }}
                        >
                          {skill.name}
                        </text>
                      );
                    })}
                  </g>
                </svg>

                {/* Tooltip in the hollow center of the wheel */}
                {hoveredIndex === null ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Skills</span>
                    <span className="text-[9px] text-muted-foreground/60 mt-0.5">Hover to explore</span>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="glass px-3 py-2 rounded-xl border border-white/15 max-w-[130px] pointer-events-none"
                    >
                      <p className="text-[10px] font-bold text-primary leading-tight">{wheelSkills[hoveredIndex].name}</p>
                      <p className="text-[8px] text-muted-foreground leading-normal mt-0.5">{wheelSkills[hoveredIndex].desc}</p>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
