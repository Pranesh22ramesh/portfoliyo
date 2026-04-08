'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface AnimatedBadgeProps {
  text: string;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles = {
  default: 'bg-slate-700/50 text-white border-slate-600/50',
  primary: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  accent: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

const sizeStyles = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3.5 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export default function AnimatedBadge({
  text,
  variant = 'default',
  size = 'md',
  animated = true,
  icon,
  className = '',
}: AnimatedBadgeProps) {
  return (
    <motion.div
      initial={animated ? { opacity: 0, scale: 0.8, y: 10 } : { opacity: 1, scale: 1, y: 0 }}
      whileInView={animated ? { opacity: 1, scale: 1, y: 0 } : undefined}
      whileHover={animated ? { scale: 1.05, y: -2 } : undefined}
      viewport={{ once: true }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className={`inline-flex items-center gap-2 rounded-full border backdrop-blur-sm transition-all ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="font-medium">{text}</span>
      
      {/* Glow effect */}
      <motion.div
        animate={animated ? { opacity: [0.5, 1, 0.5] } : { opacity: 0 }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full blur-md -z-10 opacity-0"
        style={{
          background:
            variant === 'primary'
              ? 'rgba(59, 130, 246, 0.3)'
              : variant === 'accent'
                ? 'rgba(139, 92, 246, 0.3)'
                : variant === 'success'
                  ? 'rgba(16, 185, 129, 0.3)'
                  : 'rgba(217, 119, 6, 0.3)',
        }}
      />
    </motion.div>
  );
}
