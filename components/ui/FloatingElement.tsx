'use client';

import { motion } from 'framer-motion';

interface FloatingElementProps {
  children?: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'circle';
  distance?: number;
}

export default function FloatingElement({
  children,
  duration = 6,
  delay = 0,
  className = '',
  direction = 'up',
  distance = 20,
}: FloatingElementProps) {
  const getAnimation = () => {
    switch (direction) {
      case 'up':
        return {
          y: [0, -distance, 0],
        };
      case 'down':
        return {
          y: [0, distance, 0],
        };
      case 'left':
        return {
          x: [0, -distance, 0],
        };
      case 'right':
        return {
          x: [0, distance, 0],
        };
      case 'circle':
        return {
          x: [0, distance, 0, -distance, 0],
          y: [0, distance, 0, -distance, 0],
        };
      default:
        return { y: [0, -distance, 0] };
    }
  };

  return (
    <motion.div
      animate={getAnimation()}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
