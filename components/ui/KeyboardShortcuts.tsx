'use client';

import { useEffect, useRef } from 'react';
import { showToast } from '@/components/ui/Toast';

const HINT_KEY = 'shortcuts-hint-shown';

export default function KeyboardShortcuts() {
  const shown = useRef(false);

  useEffect(() => {
    // Show one-time hint on first visit
    if (!localStorage.getItem(HINT_KEY) && !shown.current) {
      shown.current = true;
      setTimeout(() => {
        showToast({
          message: 'Press G · L · R · / for quick actions',
          emoji: '⌨️',
          duration: 5000,
        });
        localStorage.setItem(HINT_KEY, '1');
      }, 3500);
    }

    const handler = (e: KeyboardEvent) => {
      // Ignore when typing in an input / textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return;

      switch (e.key.toLowerCase()) {
        case 'g':
          window.open('https://github.com/Pranesh22ramesh', '_blank');
          showToast({ message: 'Opening GitHub…', emoji: '🐙', duration: 2500 });
          break;
        case 'l':
          window.open('https://www.linkedin.com/in/pranesh-ramesh-67a0a9246/', '_blank');
          showToast({ message: 'Opening LinkedIn…', emoji: '💼', duration: 2500 });
          break;
        case 'r': {
          const dl = document.querySelector<HTMLAnchorElement>('#resume-download');
          dl?.click();
          showToast({ message: 'Downloading resume…', emoji: '📄', duration: 2500 });
          break;
        }
        case '/': {
          e.preventDefault();
          const input = document.querySelector<HTMLElement>('#chatbot-input');
          input?.focus();
          showToast({ message: 'AI chatbot focused', emoji: '🤖', duration: 2000 });
          break;
        }
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return null;
}
