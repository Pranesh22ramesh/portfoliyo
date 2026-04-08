'use client';

import { motion } from 'framer-motion';
import { Code2, Wrench, Shield, BrainCircuit, Users, BadgeCheck } from 'lucide-react';

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
  'Ethical Hacking 101 — Beginners Guide',
  'Oracle APEX Cloud Developer Certified Professional',
  'Data Structures using Java',
  'Introduction to Cybersecurity (Cisco)',
  'Testing Tools / Selenium / API Testing (NASSCOM)',
];

interface SkillChipProps { skill: string; delay: number; color: string; }
function SkillChip({ skill, delay, color }: SkillChipProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.08, y: -3 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.04, duration: 0.35, type: 'spring', stiffness: 320, damping: 22 }}
      className="px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-default"
      style={{
        background: `${color}12`,
        borderColor: `${color}28`,
        color: color,
      }}
    >
      {skill}
    </motion.span>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.07)_0%,transparent_70%)]"
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], opacity: [0.04, 0.1, 0.04] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 right-1/4 w-96 h-96 rounded-full blur-[130px] bg-blue-500/30 pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 20, 0], opacity: [0.04, 0.1, 0.04] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-40 left-1/4 w-80 h-80 rounded-full blur-[110px] bg-purple-500/30 pointer-events-none"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="h-px w-12 bg-primary/60" />
            <span className="text-sm font-semibold text-primary tracking-[0.2em] uppercase">My Stack</span>
            <div className="h-px w-12 bg-primary/60" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-heading"
          >
            Technical <span className="gradient-text">Mastery</span>
          </motion.h2>
        </div>

        {/* Skills bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {skillCategories.map((cat, index) => {
            const Icon = cat.Icon;
            return (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className={`group relative rounded-[2rem] p-7 border border-white/8 overflow-hidden transition-all duration-500 hover:border-white/15 ${cat.wide ? 'sm:col-span-2 lg:col-span-2' : ''}`}
                style={{ background: 'rgba(5,8,22,0.6)', backdropFilter: 'blur(24px)' }}
              >
                {/* Corner accent */}
                <div
                  className="absolute top-0 left-0 w-48 h-48 -ml-16 -mt-16 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                  style={{ background: cat.color }}
                />

                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 transition-all duration-300 group-hover:scale-110"
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
                  {cat.skills.map((skill, idx) => (
                    <SkillChip key={skill} skill={skill} delay={idx} color={cat.color} />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
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

          <div className="flex flex-wrap gap-3">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, y: -2 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-2.5 text-sm text-foreground/80 glass px-5 py-2.5 rounded-xl border border-primary/15 hover:border-primary/30 transition-all cursor-default"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {cert}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
