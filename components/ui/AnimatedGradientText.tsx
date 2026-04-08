'use client';

import { motion } from 'framer-motion';

interface AnimatedGradientTextProps {
  text: string;
  className?: string;
  colors?: string[];
  animated?: boolean;
}

export default function AnimatedGradientText({
  text,
  className = '',
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  animated = true,
}: AnimatedGradientTextProps) {
  const backgroundGradient = `linear-gradient(90deg, ${colors.join(',')})`;

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      animate={
        animated
          ? {
              backgroundPosition: ['0% center', '100% center', '0% center'],
            }
          : {}
      }
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'ease-in-out',
      }}
      style={
        animated
          ? {
              backgroundImage: backgroundGradient,
              backgroundSize: '200% auto',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
            }
          : {
              backgroundImage: backgroundGradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
            }
      }
    >
      {text}
    </motion.div>
  );
}
