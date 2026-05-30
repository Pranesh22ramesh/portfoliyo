'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, X } from 'lucide-react';
import ProjectCard from '@/components/ui/ProjectCard';
import { useAnimeCounter } from '@/lib/useAnime';
import {
  fadeUpVariant,
  staggerContainerFast,
  viewportOnce,
} from '@/lib/AnimationUtils';

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  impact: string;
  problem: string;
  solution: string;
  tech: string;
}

const GITHUB_USERNAME = 'Pranesh22ramesh';

const fallbackProjects = [
  {
    id: 1,
    name: 'Certificate-Generator',
    description: 'Developed a MERN-stack web application for intern management and secure certificate generation with QR verification, PDF export, analytics, and automated email notifications.',
    html_url: 'https://github.com/Pranesh22ramesh/Certificate-Generator',
    homepage: '',
    topics: ['mern', 'node', 'mongodb', 'express'],
    stargazers_count: 5,
    forks_count: 2,
    language: 'TypeScript',
    updated_at: new Date().toISOString(),
    impact: '80% faster processing',
    problem: 'Generating and dispatching high volumes of internship certificates manually was slow, insecure, and prone to formatting errors.',
    solution: 'Designed an automated dashboard allowing batch CSV upload, dynamic PDF generation, custom QR verification, and automated SMTP email dispatch.',
    tech: 'React, Express, Node.js, MongoDB, TypeScript, PDFKit, Nodemailer'
  },
  {
    id: 2,
    name: 'Bouquet-Shop-Web',
    description: 'Built a full-stack flower shop e-commerce website using MERN with product management, cart, order processing, admin dashboard, AI chatbot, and responsive UI.',
    html_url: 'https://github.com/Pranesh22ramesh',
    homepage: '',
    topics: ['mern', 'react', 'ecommerce', 'ai'],
    stargazers_count: 4,
    forks_count: 1,
    language: 'JavaScript',
    updated_at: new Date().toISOString(),
    impact: '24/7 AI support',
    problem: 'Small flower shops lack automated systems for handling customer requests, leading to lost sales during off-hours.',
    solution: 'Integrated a rule-based and AI-powered chatbot with the MERN checkout flow to provide real-time suggestions and capture orders.',
    tech: 'React, Node.js, Express, MongoDB, Tailwind CSS, Dialogflow API'
  },
  {
    id: 3,
    name: 'API-Downtime-Analyzer',
    description: 'Created a Python-based API monitoring system using LSTM and Autoencoder models for predictive downtime detection with real-time alerts and analytics dashboard.',
    html_url: 'https://github.com/Pranesh22ramesh',
    homepage: '',
    topics: ['python', 'ml', 'monitoring', 'api'],
    stargazers_count: 6,
    forks_count: 2,
    language: 'Python',
    updated_at: new Date().toISOString(),
    impact: '~90% accuracy',
    problem: 'Traditional alert monitors only react *after* an API goes offline, which results in system downtime and customer disruption.',
    solution: 'Trained an LSTM autoencoder anomaly detection model on API traffic response patterns to predict and alert on anomalies before actual failure.',
    tech: 'Python, TensorFlow, Django, Streamlit, Celery, Redis'
  },
  {
    id: 4,
    name: 'Sign-Language-Translator',
    description: 'Developed an AI system using TensorFlow, OpenCV, Django, and Streamlit for real-time sign language translation and facial emotion recognition.',
    html_url: 'https://github.com/Pranesh22ramesh',
    homepage: '',
    topics: ['tensorflow', 'opencv', 'django', 'streamlit'],
    stargazers_count: 3,
    forks_count: 1,
    language: 'Python',
    updated_at: new Date().toISOString(),
    impact: '20+ gestures live',
    problem: 'Communicational barriers between speech-impaired individuals and general staff hinder seamless collaboration in professional settings.',
    solution: 'Constructed an image classification pipeline running live OpenCV feeds through a trained CNN to translate gestures into English text.',
    tech: 'Python, OpenCV, TensorFlow, Keras, Django, Streamlit'
  },
  {
    id: 5,
    name: 'Rice-Amount-Calculation-App',
    description: 'Built a cross-platform React Native (Expo) mobile app for order management and customer collection tracking with reporting, authentication, and SMS notifications.',
    html_url: 'https://github.com/Pranesh22ramesh',
    homepage: '',
    topics: ['react-native', 'expo', 'mobile', 'sms'],
    stargazers_count: 2,
    forks_count: 1,
    language: 'TypeScript',
    updated_at: new Date().toISOString(),
    impact: '95% error reduction',
    problem: 'Rice mills and agricultural dealers often rely on paper registers to track massive shipments, causing billing mismatch and shipment delays.',
    solution: 'Created an offline-first mobile app that computes bag counts, total weight, and balances instantly, sending automated SMS updates on dispatch.',
    tech: 'React Native, Expo, SQLite, Twilio SMS API, TypeScript'
  }
];

const augmentRepo = (repo: any): Repo => {
  const fallback = fallbackProjects.find(f => f.name.toLowerCase() === repo.name.toLowerCase());
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description || 'A unique project built with modern technologies.',
    html_url: repo.html_url,
    homepage: repo.homepage || '',
    topics: repo.topics || [],
    stargazers_count: repo.stargazers_count || 0,
    forks_count: repo.forks_count || 0,
    language: repo.language || 'JavaScript',
    updated_at: repo.updated_at || new Date().toISOString(),
    impact: fallback?.impact || 'Production ready setup',
    problem: fallback?.problem || 'Traditional configurations require manual efforts, causing deployment scaling friction.',
    solution: fallback?.solution || 'Designed a modular, scalable architecture with automated workflows and complete type safety.',
    tech: fallback?.tech || repo.language || 'TypeScript, Node.js'
  };
};

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [activeTopics, setActiveTopics] = useState<string[]>(['All']);
  const [spotlightId, setSpotlightId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchRepos() {
      try {
        setLoading(true);
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);

        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.status}`);
        }

        const data = await res.json();
        const validData = data as any[];
        const filtered = validData.filter((repo) =>
          !repo.fork && (repo.stargazers_count > 0 || repo.topics?.length > 0)
        );

        if (isMounted) {
          const augmented = (filtered.length > 0 ? filtered : fallbackProjects).map(augmentRepo);
          setRepos(augmented);
          const topics = new Set<string>(['All']);
          augmented.forEach((repo: Repo) => {
            if (repo.language) topics.add(repo.language);
            repo.topics?.forEach((t) => {
              if (t.length < 12) topics.add(t.charAt(0).toUpperCase() + t.slice(1));
            });
          });
          setActiveTopics(Array.from(topics).slice(0, 8));
        }
      } catch {
        if (isMounted) {
          setRepos(fallbackProjects);
          setActiveTopics(['All', 'MERN', 'Python', 'AI', 'Mobile']);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchRepos();
    return () => { isMounted = false; };
  }, []);

  // Handle ESC key to clear spotlight modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSpotlightId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const starsRef = useAnimeCounter(totalStars, '', !loading && totalStars > 0);

  const filteredRepos = filter === 'All'
    ? repos
    : repos.filter((repo) =>
        repo.language?.toLowerCase() === filter.toLowerCase() ||
        repo.topics?.some(t => t.toLowerCase() === filter.toLowerCase())
      );

  return (
    <section id="projects" className="relative py-32 px-4 min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ opacity: [0.05, 0.12, 0.05], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 right-1/3 w-96 h-96 rounded-full blur-[120px] bg-blue-500/40 will-change-transform"
        />
        <motion.div
          animate={{ opacity: [0.05, 0.1, 0.05], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-[100px] bg-purple-500/30 will-change-transform"
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <motion.div
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-12 bg-primary/60" />
              <span className="text-sm font-medium text-primary tracking-[0.2em] uppercase">Showcase</span>
            </motion.div>

            <div className="flex flex-wrap items-center gap-6">
              <motion.h2
                variants={fadeUpVariant}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                className="text-4xl md:text-5xl lg:text-7xl font-display font-medium tracking-tight text-balance"
              >
                Featured <span className="gradient-text italic pr-2">Work</span>
              </motion.h2>
              
              {!loading && totalStars > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.4 }}
                  className="glass px-4 py-2 rounded-full text-sm font-bold text-primary flex items-center gap-1.5 border border-primary/20 select-none shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                >
                  <span>★</span>
                  <span ref={starsRef as any}>0</span>
                  <span>GitHub Stars</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Filter pills — Stagger */}
        <motion.div
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-wrap gap-2 mb-12"
        >
          {activeTopics.map((topic) => {
            const count = repos.filter(repo =>
              topic === 'All' ||
              repo.language?.toLowerCase() === topic.toLowerCase() ||
              repo.topics?.some(t => t.toLowerCase() === topic.toLowerCase())
            ).length;

            return (
              <motion.button
                key={topic}
                variants={fadeUpVariant}
                onClick={() => setFilter(topic)}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 will-change-transform flex items-center gap-2 ${
                  filter === topic
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.45)]'
                    : 'glass border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                }`}
              >
                <span>{topic}</span>
                <motion.sup
                  key={filter === topic ? 'active' : 'inactive'}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="text-[9px] font-bold opacity-80"
                >
                  {count}
                </motion.sup>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 glass rounded-3xl animate-pulse bg-muted/20" />
            ))}
          </div>
        )}

        {/* Project cards — AOS zoom-in */}
        {!loading && (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredRepos.map((repo, i) => (
                <div
                  key={repo.id}
                  data-aos="zoom-in"
                  data-aos-delay={Math.min(i * 80, 400)}
                  data-aos-duration="600"
                >
                  <ProjectCard
                    project={repo}
                    index={i}
                    onSpotlight={(name) => setSpotlightId(name)}
                    spotlightActive={spotlightId === repo.name}
                    anySpotlightActive={spotlightId !== null}
                  />
                </div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Spotlight Details Modal */}
      <AnimatePresence>
        {spotlightId && (() => {
          const spotlightProject = repos.find(r => r.name === spotlightId);
          if (!spotlightProject) return null;
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSpotlightId(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />

              {/* Spotlight Card */}
              <motion.div
                layoutId={`project-card-container-${spotlightProject.id}`}
                className="relative z-10 w-full max-w-3xl glass-heavy rounded-[2rem] border border-white/15 overflow-hidden p-8 md:p-10 shadow-2xl"
                style={{ background: 'rgba(5, 8, 22, 0.95)', backdropFilter: 'blur(32px)' }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSpotlightId(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>

                {/* Header */}
                <div className="mb-8">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Project Spotlight</span>
                  <h3 className="text-3xl font-display font-black text-white">{spotlightProject.name.replace(/-/g, ' ')}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{spotlightProject.description}</p>
                </div>

                {/* 4-column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/5">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">Problem</h4>
                    <p className="text-xs text-muted-foreground/90 leading-relaxed">
                      {spotlightProject.problem}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Solution</h4>
                    <p className="text-xs text-muted-foreground/90 leading-relaxed">
                      {spotlightProject.solution}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">Tech Stack</h4>
                    <p className="text-xs text-muted-foreground/90 leading-relaxed capitalize">
                      {spotlightProject.tech}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Impact</h4>
                    <p className="text-lg font-display font-black gradient-text">
                      {spotlightProject.impact}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/5">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={spotlightProject.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-semibold transition-colors"
                  >
                    <Github size={16} /> Code
                  </motion.a>
                  {spotlightProject.homepage && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={spotlightProject.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 transition-all"
                    >
                      <ExternalLink size={16} /> Live Demo
                    </motion.a>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
