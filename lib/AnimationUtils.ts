import type { Variants } from 'framer-motion';

// ─── Fade Up ──────────────────────────────────────────────────────────────────
export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Stagger container ────────────────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

// ─── Text Reveal (clip-path sweep, per-word) ──────────────────────────────────
export const textRevealVariant: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Zoom-in ──────────────────────────────────────────────────────────────────
export const zoomInVariant: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Slide from side ─────────────────────────────────────────────────────────
export const slideLeftVariant: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export const slideRightVariant: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Hover Card ──────────────────────────────────────────────────────────────
export const hoverLiftProps = {
  whileHover: { y: -6, scale: 1.02 },
  transition: { type: 'spring', stiffness: 300, damping: 22 },
} as const;

// ─── Parallax helper (pass to useTransform) ──────────────────────────────────
export const parallaxRanges = {
  slow: { input: [0, 1], output: ['0%', '20%'] },   // background blobs
  medium: { input: [0, 1], output: ['0%', '40%'] }, // mid layer
  fast: { input: [0, 1], output: ['0%', '60%'] },   // foreground
} as const;

// ─── Viewport config ─────────────────────────────────────────────────────────
export const viewportOnce = { once: true, margin: '-80px' };
export const viewportOnceNarrow = { once: true, margin: '-40px' };
