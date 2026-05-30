'use client';

import { useAOS } from '@/lib/useAOS';

/** Mounts once at the root — kicks off AOS initialisation client-side. */
export default function AOSProvider() {
  useAOS();
  return null;
}
