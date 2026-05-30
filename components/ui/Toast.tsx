'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  emoji?: string;
  duration?: number;
}

let toastDispatch: ((msg: Omit<ToastMessage, 'id'>) => void) | null = null;

/** Call this from anywhere (outside React) to show a toast. */
export function showToast(msg: Omit<ToastMessage, 'id'>) {
  toastDispatch?.(msg);
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    toastDispatch = (msg) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { ...msg, id }]);
      const duration = msg.duration ?? 5000;
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };
    return () => { toastDispatch = null; };
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] flex flex-col gap-3 items-center pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 40, scale: 0.88 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: 20,  scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl glass border border-primary/20
                       shadow-[0_0_30px_rgba(59,130,246,0.2)] text-sm font-medium text-foreground max-w-xs text-center"
          >
            {t.emoji && <span className="text-base">{t.emoji}</span>}
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
