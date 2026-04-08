'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const outer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check for touch device
    if (window.matchMedia('(hover: none)').matches) return;

    const handleMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);
    const handleDown = () => setIsClicking(true);
    const handleUp = () => setIsClicking(false);

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);
    document.addEventListener('mousedown', handleDown);
    document.addEventListener('mouseup', handleUp);

    const interactives = document.querySelectorAll('a, button, [data-cursor-hover]');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    // Outer cursor follows with spring lag
    let raf: number;
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const animate = () => {
      outer.current.x = lerp(outer.current.x, pos.current.x, 0.12);
      outer.current.y = lerp(outer.current.y, pos.current.y, 0.12);
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outer.current.x - 20}px, ${outer.current.y - 20}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('mouseup', handleUp);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, []);

  return (
    <>
      {/* Outer glow ring */}
      <div
        ref={outerRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
        style={{ willChange: 'transform' }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 2.2 : isClicking ? 0.8 : 1,
            opacity: isVisible ? 1 : 0,
            borderColor: isHovering ? 'hsl(199 89% 48%)' : 'hsl(217 91% 60% / 0.6)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="w-10 h-10 rounded-full border-2"
          style={{
            background: isHovering
              ? 'hsl(199 89% 48% / 0.1)'
              : 'hsl(217 91% 60% / 0.05)',
            boxShadow: isHovering
              ? '0 0 20px hsl(199 89% 48% / 0.4)'
              : '0 0 15px hsl(217 91% 60% / 0.3)',
          }}
        />
      </div>

      {/* Inner dot */}
      <div
        ref={innerRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
        style={{ willChange: 'transform' }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 1.5 : 1,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
          className="w-2 h-2 rounded-full bg-[hsl(217_91%_60%)]"
          style={{ boxShadow: '0 0 8px hsl(217 91% 60%)' }}
        />
      </div>
    </>
  );
}
