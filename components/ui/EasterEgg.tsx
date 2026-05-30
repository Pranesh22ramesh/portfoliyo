'use client';

import { useEffect, useRef } from 'react';
import { showToast } from '@/components/ui/Toast';

const SECRET = 'pranesh';

export default function EasterEgg() {
  const buffer = useRef('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Skip when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return;

      buffer.current = (buffer.current + e.key).slice(-(SECRET.length));

      if (buffer.current.toLowerCase() === SECRET) {
        buffer.current = '';
        triggerEasterEgg();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return null;
}

async function triggerEasterEgg() {
  try {
    const confetti = (await import('canvas-confetti')).default;

    // First burst — full spread
    confetti({
      particleCount: 180,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#3b82f6', '#22d3ee', '#8b5cf6', '#f59e0b', '#f472b6'],
    });

    // Second burst — stars from left & right sides
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        shapes: ['star'],
        colors: ['#22d3ee', '#8b5cf6'],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        shapes: ['star'],
        colors: ['#3b82f6', '#f59e0b'],
      });
    }, 200);
  } catch {
    // canvas-confetti not available — graceful fallback
  }

  showToast({ message: "You found me! Pranesh was here 👋", emoji: '🎉', duration: 3000 });
}
