'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Star, Folder } from 'lucide-react';
import Link from 'next/link';

interface ProjectCardProps {
  project: {
    id: number;
    name: string;
    description: string;
    html_url: string;
    homepage?: string;
    language?: string;
    stargazers_count?: number;
    forks_count?: number;
    topics?: string[];
  };
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const calcRotation = (clientX: number, clientY: number) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setRotate({
      x: -((y - rect.height / 2) / 12),
      y: (x - rect.width / 2) / 12,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: '1000px' }}
      className="group relative h-full"
    >
      {/* Ambient glow */}
      <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-500 to-purple-600 opacity-0 group-hover:opacity-25 blur-xl transition-all duration-500 pointer-events-none" />

      <div
        ref={cardRef}
        onMouseMove={(e) => { setIsHovered(true); calcRotation(e.clientX, e.clientY); }}
        onMouseLeave={() => { setIsHovered(false); setRotate({ x: 0, y: 0 }); }}
        onTouchMove={(e) => { const t = e.touches[0]; calcRotation(t.clientX, t.clientY); }}
        onTouchEnd={() => { setIsHovered(false); setRotate({ x: 0, y: 0 }); }}
        onClick={() => window.open(project.html_url, '_blank')}
        onKeyDown={(e) => e.key === 'Enter' && window.open(project.html_url, '_blank')}
        role="button"
        tabIndex={0}
        aria-label={`Open ${project.name} repository`}
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.03)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out',
          willChange: 'transform',
        }}
        className="cursor-pointer relative h-full rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {/* Card body */}
        <div
          className="relative h-full rounded-3xl overflow-hidden border border-white/10 group-hover:border-blue-500/40 transition-colors duration-500"
          style={{ background: 'rgba(5, 8, 22, 0.75)', backdropFilter: 'blur(24px)' }}
        >
          {/* Corner glow blob */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-blue-600/15 blur-3xl group-hover:bg-blue-500/25 transition-colors duration-500 pointer-events-none" />

          <div className="relative z-10 p-7 flex flex-col h-full gap-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-blue-500/20 bg-blue-500/10 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                <Folder size={22} />
              </div>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {project.html_url && (
                  <button
                    onClick={(e) => { e.stopPropagation(); window.open(project.html_url, '_blank'); }}
                    aria-label="View on GitHub"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-all"
                  >
                    <Github size={18} />
                  </button>
                )}
                {project.homepage && (
                  <button
                    onClick={(e) => { e.stopPropagation(); window.open(project.homepage, '_blank'); }}
                    aria-label="View live demo"
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-all"
                  >
                    <ExternalLink size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Title + description */}
            <div className="flex-grow">
              <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300 leading-tight">
                {project.name.replace(/-/g, ' ')}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
                {project.description || 'A unique project built with modern technologies.'}
              </p>
            </div>

            {/* Topic chips */}
            {project.topics && project.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.topics.slice(0, 4).map((topic) => (
                  <span
                    key={topic}
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 capitalize"
                  >
                    {topic}
                  </span>
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
              <Link
                href={`/projects/${project.name.toLowerCase()}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[11px] font-semibold text-blue-400/60 hover:text-blue-400 flex items-center gap-1 transition-colors"
              >
                Details <ExternalLink size={11} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
