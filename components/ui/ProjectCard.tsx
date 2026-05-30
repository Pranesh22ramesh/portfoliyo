'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Star, Folder } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage?: string;
  language?: string;
  stargazers_count?: number;
  forks_count?: number;
  topics?: string[];
  impact: string;
  problem: string;
  solution: string;
  tech: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  onSpotlight: (name: string) => void;
  spotlightActive: boolean;
  anySpotlightActive: boolean;
}

export default function ProjectCard({
  project,
  onSpotlight,
  spotlightActive,
  anySpotlightActive,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // ── 3D tilt calculation ───────────────────────────────────────────────────
  const calcRotation = (clientX: number, clientY: number) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setRotate({
      x: -((clientY - rect.top - rect.height / 2) / 12),
      y: ((clientX - rect.left - rect.width / 2) / 12),
    });
  };

  // ── Anime.js shimmer on top border ───────────────────────────────────────
  const handleMouseEnter = async () => {
    setIsHovered(true);
    if (!topBarRef.current) return;
    const anime = (await import('animejs')).default;
    anime({
      targets: topBarRef.current,
      backgroundPosition: ['200% center', '-200% center'],
      duration: 900,
      easing: 'easeInOutSine',
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      layoutId={`project-card-container-${project.id}`}
      className={`group relative h-full transition-all duration-400 ease-out ${
        anySpotlightActive && !spotlightActive ? 'opacity-[0.18] pointer-events-none blur-[2px]' : ''
      }`}
      style={{ perspective: '1000px' }}
    >
      {/* Ambient glow — GPU-composited */}
      <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-500 to-purple-600 opacity-0 group-hover:opacity-25 blur-xl transition-all duration-500 pointer-events-none will-change-opacity" />

      <div
        ref={cardRef}
        onMouseMove={(e) => {
          setIsHovered(true);
          calcRotation(e.clientX, e.clientY);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={(e) => {
          const t = e.touches[0];
          calcRotation(t.clientX, t.clientY);
        }}
        onTouchEnd={handleMouseLeave}
        onClick={() => onSpotlight(project.name)}
        onKeyDown={(e) => e.key === 'Enter' && onSpotlight(project.name)}
        role="button"
        tabIndex={0}
        aria-label={`Show details for ${project.name}`}
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.03)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out',
          willChange: 'transform',
        }}
        className="cursor-pointer relative h-full rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 overflow-hidden"
      >
        {/* Card body */}
        <div
          className="relative h-full rounded-3xl overflow-hidden border border-white/10 group-hover:border-blue-500/40 transition-colors duration-500"
          style={{ background: 'rgba(5, 8, 22, 0.75)', backdropFilter: 'blur(24px)' }}
        >
          {/* ── Anime.js shimmer top bar ── */}
          <div
            ref={topBarRef}
            className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, #3b82f6, #06b6d4, #8b5cf6, transparent)',
              backgroundSize: '200% auto',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />

          {/* Corner glow blob */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-600/15 blur-3xl group-hover:bg-blue-500/25 transition-colors duration-500 pointer-events-none" />

          <div className="relative z-10 p-7 flex flex-col h-full gap-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <motion.div
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-11 h-11 rounded-xl flex items-center justify-center border border-blue-500/20 bg-blue-500/10 text-blue-400 will-change-transform"
              >
                <Folder size={22} />
              </motion.div>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {project.html_url && (
                  <motion.a
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={project.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="View on GitHub"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-all will-change-transform flex items-center justify-center"
                  >
                    <Github size={18} />
                  </motion.a>
                )}
                {project.homepage && (
                  <motion.a
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={project.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="View live demo"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-all will-change-transform flex items-center justify-center"
                  >
                    <ExternalLink size={18} />
                  </motion.a>
                )}
              </div>
            </div>

            {/* Title + description */}
            <div className="flex-grow">
              <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300 leading-tight">
                {project.name.replace(/-/g, ' ')}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                {project.description}
              </p>
            </div>

            {/* Topic chips — Stagger on hover */}
            {project.topics && project.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.topics.slice(0, 4).map((topic, i) => (
                  <motion.span
                    key={topic}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 capitalize"
                  >
                    {topic}
                  </motion.span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {project.language && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                    {project.language}
                  </span>
                )}
                {project.stargazers_count !== undefined && project.stargazers_count > 0 && (
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400/70" />
                    {project.stargazers_count}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold text-blue-400/60 hover:text-blue-400 flex items-center gap-1 transition-colors">
                Details <ExternalLink size={11} />
              </span>
            </div>
          </div>

          {/* Cinematic Impact Overlay */}
          {project.impact && (
            <div className="absolute inset-x-0 bottom-0 w-full h-0 group-hover:h-[45%] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] z-20 flex flex-col items-center justify-center border-t border-white/10 glass-heavy pointer-events-none">
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold block mb-1">Impact</span>
              <p className="text-xl md:text-2xl font-display font-bold gradient-text leading-none text-center px-4">
                {project.impact}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
