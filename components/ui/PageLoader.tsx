'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Fail-safe: Force hide loader after 5 seconds
    const failSafe = setTimeout(() => {
      setLoading(false);
    }, 5000);

    // Simulate load progress
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 18 + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => setLoading(false), 800);
      } else {
        setProgress(Math.floor(current));
      }
    }, 60);

    return () => {
      clearInterval(interval);
      clearTimeout(failSafe);
    };
  }, []);

  if (!isMounted) return null;

  const letters = "PRANESH RAMESH".split("");

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
          style={{ background: 'hsl(222 47% 4%)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Name reveal */}
          <div className="flex gap-1 md:gap-2 mb-8">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                className="font-display font-bold text-5xl md:text-7xl"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 20px #6366f180)',
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-64 md:w-80 h-px bg-white/10 relative overflow-hidden rounded-full">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
                boxShadow: '0 0 10px #6366f1',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 80, damping: 20 }}
            />
          </div>

          {/* Percentage */}
          <motion.p
            className="text-white/30 text-sm font-mono mt-4 tabular-nums"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {progress}%
          </motion.p>

          {/* Tagline */}
          <motion.p
            className="text-white/20 text-xs mt-2 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading Portfolio
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
