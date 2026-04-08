'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  type?: 'fade' | 'scale' | 'rotate' | 'slide' | 'blur';
}

export default function ScrollAnimation({
  children,
  className = '',
  type = 'fade',
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  let transforms: Record<string, any> = {};

  switch (type) {
    case 'fade':
      transforms = {
        opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]),
      };
      break;
    case 'scale':
      transforms = {
        scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]),
        opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]),
      };
      break;
    case 'rotate':
      transforms = {
        rotate: useTransform(scrollYProgress, [0, 1], [0, 360]),
        opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]),
      };
      break;
    case 'slide':
      transforms = {
        x: useTransform(scrollYProgress, [0, 0.5, 1], [-100, 0, 100]),
        opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]),
      };
      break;
    case 'blur':
      transforms = {
        filter: useTransform(scrollYProgress, [0, 0.5, 1], ['blur(20px)', 'blur(0px)', 'blur(20px)']),
        opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]),
      };
      break;
  }

  return (
    <motion.div ref={ref} className={className} style={transforms}>
      {children}
    </motion.div>
  );
}
