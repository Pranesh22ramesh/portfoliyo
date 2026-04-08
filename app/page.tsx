'use client';

import { motion } from 'framer-motion';
import { ReactNode, useEffect } from 'react';
import PageLoader from '@/components/ui/PageLoader';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Achievements from '@/components/sections/Achievements';
import Contact from '@/components/sections/Contact';

function AnimatedSection({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, filter: 'blur(10px)', scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ 
        duration: 1.2, 
        ease: [0.22, 1, 0.36, 1], // Cinematic cubic-bezier
        opacity: { duration: 1.5 },
        scale: { duration: 1 }
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  useEffect(() => {
    // Reset to top on load
    window.scrollTo(0, 0);
    
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    }
  }, []);

  return (
    <>
      <PageLoader />
      <main className="relative">
        <Hero />
        <AnimatedSection><About /></AnimatedSection>
        <AnimatedSection><Skills /></AnimatedSection>
        <AnimatedSection><Projects /></AnimatedSection>
        <AnimatedSection><Achievements /></AnimatedSection>
        <AnimatedSection><Contact /></AnimatedSection>
      </main>
    </>
  );
}
