'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Star, GitFork, Search, Filter, Folder, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import ProjectCard from '@/components/ui/ProjectCard';

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
    updated_at: new Date().toISOString()
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
    updated_at: new Date().toISOString()
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
    updated_at: new Date().toISOString()
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
    updated_at: new Date().toISOString()
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
    updated_at: new Date().toISOString()
  }
];

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [activeTopics, setActiveTopics] = useState<string[]>(['All']);

  useEffect(() => {
    let isMounted = true;
    async function fetchRepos() {
      try {
        setLoading(true);
        const res = await fetch('https://api.github.com/users/Pranesh22ramesh/repos?sort=updated&per_page=100');
        
        if (!res.ok) {
          if (res.status === 403) {
            console.warn('GitHub API rate limit reached, using fallbacks');
          }
          throw new Error(`GitHub API error: ${res.status}`);
        }
        
        const data = await res.json();
        const validData = data as any[];
        
        // Filter out forks and ensure they have a description and stars
        const filtered = validData.filter((repo) => 
          !repo.fork && 
          (repo.stargazers_count > 0 || repo.topics?.length > 0)
        );

        if (isMounted) {
          setRepos(filtered.length > 0 ? filtered : fallbackProjects);
          
          // Extract unique topics and languages
          const topics = new Set<string>(['All']);
          filtered.forEach((repo: Repo) => {
            if (repo.language) topics.add(repo.language);
            repo.topics?.forEach(t => topics.add(t));
          });
          setActiveTopics(Array.from(topics).slice(0, 8));
        }
      } catch (error) {
        console.error('Error fetching repos, using fallback data:', error);
        if (isMounted) {
          setRepos(fallbackProjects);
          // Set some common topics for the fallback projects
          setActiveTopics(['All', 'MERN', 'Python', 'AI', 'Mobile']);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchRepos();
    return () => { isMounted = false; };
  }, []);

  const filteredRepos = filter === 'All' 
    ? repos 
    : repos.filter(repo => repo.language?.toLowerCase() === filter.toLowerCase() || repo.topics?.includes(filter.toLowerCase()));

  return (
    <section id="projects" className="relative py-32 px-4 min-h-screen">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ 
            opacity: [0.05, 0.12, 0.05],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 right-1/3 w-96 h-96 rounded-full blur-[120px] bg-blue-500/40"
        />
        
        <motion.div
          animate={{ 
            opacity: [0.05, 0.1, 0.05],
            scale: [1.1, 1, 1.1]
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-[100px] bg-purple-500/30"
        />
      </div>

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-12 bg-primary/60" />
              <span className="text-sm font-medium text-primary tracking-[0.2em] uppercase">Showcase</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-7xl font-display font-medium tracking-tight text-balance"
            >
              Featured <span className="gradient-text italic pr-2">Work</span>
            </motion.h2>
          </div>
        </div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {activeTopics.map((topic, idx) => (
            <motion.button
              key={topic}
              onClick={() => setFilter(topic)}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300 }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === topic 
                  ? 'bg-gradient-to-r from-primary to-blue-500 text-primary-foreground shadow-[0_0_20px_rgba(59,130,246,0.5)]' 
                  : 'glass border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
              }`}
            >
              {topic}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 glass rounded-3xl animate-pulse bg-muted/20" />
            ))}
          </div>
        )}

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredRepos.map((repo, i) => (
              <ProjectCard key={repo.id} project={repo} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
