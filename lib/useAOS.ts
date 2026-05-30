'use client';

import { useEffect } from 'react';

export function useAOS() {
  useEffect(() => {
    // Dynamically import AOS to avoid SSR issues
    const initAOS = async () => {
      const AOS = (await import('aos')).default;
      AOS.init({
        once: true,           // animate only once
        duration: 700,
        easing: 'ease-out-cubic',
        offset: 80,           // px from bottom of window
        delay: 0,
        disable: () => {
          // Disable on low-power / reduced-motion preference
          if (typeof window === 'undefined') return false;
          return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        },
      });
    };
    initAOS();
  }, []);
}
