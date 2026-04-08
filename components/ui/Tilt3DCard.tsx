'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
}

export default function Tilt3DCard({
  children,
  className = '',
  glowColor = 'rgba(59,130,246,0.3)',
  intensity = 15,
}: Tilt3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMove = (clientX: number, clientY: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setRotate({
      x: -((y - rect.height / 2) / rect.height) * intensity,
      y: ((x - rect.width / 2) / rect.width) * intensity,
    });
  };

  return (
    <div style={{ perspective: '1200px' }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={(e) => { setIsHovered(true); handleMove(e.clientX, e.clientY); }}
        onMouseLeave={() => { setIsHovered(false); setRotate({ x: 0, y: 0 }); }}
        onTouchMove={(e) => { const t = e.touches[0]; handleMove(t.clientX, t.clientY); }}
        onTouchEnd={() => { setIsHovered(false); setRotate({ x: 0, y: 0 }); }}
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out',
          willChange: 'transform',
        }}
        className="relative rounded-3xl"
      >
        {/* Ambient glow */}
        <div
          className="absolute -inset-1 rounded-3xl opacity-0 blur-xl transition-opacity duration-500 pointer-events-none"
          style={{ background: glowColor, opacity: isHovered ? 0.4 : 0 }}
        />
        {children}
      </motion.div>
    </div>
  );
}
