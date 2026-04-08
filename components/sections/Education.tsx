import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { GraduationCap, BookOpen, School, Rocket, Sparkles } from 'lucide-react';

const timelineItems = [
  {
    year: '2023 â€“ Present',
    title: 'Master of Science (Software Systems)',
    place: 'Kongu Engineering College, Perundurai',
    desc: 'Deepening expertise in full-stack architecture, AI integration, and large-scale systems. Current CGPA: 7.12.',
    icon: Rocket,
    color: '#3b82f6',
    current: true,
  },
  {
    year: '2022 â€“ 2023',
    title: 'Higher Secondary (HSC)',
    place: 'Bharani Park Matric Higher Secondary School, Karur',
    desc: 'Specialized in Computer Science and Mathematics, laying the technical foundation for software engineering.',
    icon: School,
    color: '#0ea5e9',
    current: false,
  },
  {
    year: '2020 â€“ 2021',
    title: 'Secondary School (SSLC)',
    place: 'Bharani Park Matric Higher Secondary School, Karur',
    desc: 'Achieved academic excellence with distinction in core subjects.',
    icon: BookOpen,
    color: '#06b6d4',
    current: false,
  },
];

export default function Education() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="education" className="relative py-24 md:py-32 px-4 overflow-hidden" ref={containerRef}>
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            opacity: [0.05, 0.15, 0.05],
            scale: [0.9, 1.1, 0.9],
            x: [0, 30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" 
        />
        
        <motion.div 
          animate={{ 
            opacity: [0.05, 0.12, 0.05],
            scale: [1.1, 0.9, 1.1],
            x: [0, -30, 0]
          }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute left-0 top-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" 
        />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-12 bg-primary/60" />
            <span className="text-sm font-medium text-primary tracking-widest uppercase">Academic Journey</span>
            <div className="h-px w-12 bg-primary/60" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-heading"
          >
            Formative <span className="gradient-text">Years</span>
          </motion.h2>
        </div>

        <div className="relative mt-20 px-4 md:px-0">
          {/* Animated Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2" />
          <motion.div 
            className="absolute left-8 md:left-1/2 top-0 w-[2px] bg-gradient-to-bottom from-primary to-accent -translate-x-1/2 z-0"
            style={{ 
              scaleY, 
              originY: 0,
              height: '100%',
              background: 'linear-gradient(to bottom, #3b82f6, #06b6d4)'
            }}
          />

          <div className="space-y-24 md:space-y-32">
            {timelineItems.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={item.title} className="relative">
                  {/* Central Node - Enhanced */}
                  <div className="absolute left-8 md:left-1/2 top-0 -translate-x-1/2 z-20">
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-xl relative overflow-hidden cursor-pointer"
                      style={{ 
                        background: '#030303',
                        border: `2px solid ${item.color}44`
                      }}
                    >
                      <div 
                        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity"
                        style={{ background: item.color }}
                      />
                      <Icon className="relative z-10 transition-all" style={{ color: item.color }} />
                    </motion.div>
                    
                    {item.current && (
                      <>
                        <motion.div 
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-2xl bg-primary/40 z-10"
                        />
                        <motion.div
                          animate={{ scale: [1.2, 1.8, 1.2], opacity: [0.3, 0, 0.3] }}
                          transition={{ duration: 2.5, repeat: Infinity, delay: 0.2 }}
                          className="absolute -inset-2 rounded-2xl border-2 border-primary/50 z-0"
                        />
                      </>
                    )}
                  </div>

                  {/* Content Card - Enhanced */}
                  <div className={`flex flex-col md:flex-row items-start w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    <div className="w-full md:w-1/2 pl-20 md:pl-0">
                      <motion.div
                        initial={{ opacity: 0, x: isEven ? 50 : -50, scale: 0.9 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={`glass p-6 md:p-8 rounded-[2rem] border border-white/5 relative group hover:border-primary/40 transition-all duration-500 ${
                          isEven ? 'md:mr-16' : 'md:ml-16'
                        }`}
                      >
                        {/* Animated glow on hover */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-accent/50 rounded-[2rem] opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 -z-10 pointer-events-none" />
                        
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                          <motion.span 
                            whileHover={{ scale: 1.05 }}
                            className="text-xs font-bold tracking-widest text-primary uppercase px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
                          >
                            {item.year}
                          </motion.span>
                          {item.current && (
                            <motion.div 
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="flex items-center gap-2"
                            >
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[10px] font-bold text-emerald-500 tracking-tighter uppercase">Current</span>
                            </motion.div>
                          )}
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm font-semibold text-muted-foreground/80 mb-4 flex items-center gap-2">
                           <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                             <School size={14} className="text-primary/60" />
                           </motion.div> 
                           {item.place}
                        </p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {item.desc}
                        </p>
                        
                        {/* Shadow accent */}
                        <div 
                          className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-25 transition-opacity duration-700 pointer-events-none"
                          style={{ background: item.color }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
