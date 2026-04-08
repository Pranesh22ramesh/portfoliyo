'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Star, GitFork, ArrowLeft, Calendar, User } from 'lucide-react';
import Link from 'next/link';

interface Repo {
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  created_at: string;
  owner: { login: string; avatar_url: string };
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [repo, setRepo] = useState<Repo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    async function fetchRepo() {
      try {
        setLoading(true);
        // Try direct fetch first (exact match)
        let res = await fetch(`https://api.github.com/repos/Pranesh22ramesh/${id}`);
        
        if (res.ok) {
          const data = await res.json();
          setRepo(data);
        } else {
          // If direct fetch fails, search in all repos (case-insensitive)
          const searchRes = await fetch(`https://api.github.com/users/Pranesh22ramesh/repos`);
          if (searchRes.ok) {
            const data = await searchRes.json();
            const found = (data as any[]).find(r => r.name.toLowerCase() === (id as string).toLowerCase());
            if (found) {
              setRepo(found);
            }
          }
        }
      } catch (error) {
        console.error("Project fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchRepo();
  }, [id]);

  if (!isMounted) return null;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
    </div>
  );

  if (!repo) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-12 rounded-[2.5rem] border border-white/10"
      >
        <h1 className="text-4xl font-display font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          The requested project could not be found or the repository has been moved.
        </p>
        <Link 
          href="/#projects"
          className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          Return to Projects
        </Link>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] -ml-64 -mb-64" />
      </div>

      <div className="relative pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <Link 
              href="/#projects"
              className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all"
            >
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                <ArrowLeft size={16} />
              </div>
              Back to Showroom
            </Link>
          </motion.div>

          {/* Hero Section */}
          <div className="grid lg:grid-cols-5 gap-16 items-start">
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                    Project Analysis
                  </span>
                  <div className="h-px flex-grow bg-gradient-to-r from-blue-500/20 to-transparent" />
                </div>

                <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-8 leading-[1.1] text-balance">
                  {repo.name.replace(/-/g, ' ')}
                </h1>

                <div className="flex flex-wrap gap-8 mb-12">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={18} className="text-blue-500/50" />
                    <span className="text-sm">Created {new Date(repo.created_at).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star size={18} className="text-yellow-500/50" />
                    <span className="text-sm font-bold">{repo.stargazers_count} stars</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GitFork size={18} className="text-purple-500/50" />
                    <span className="text-sm font-bold">{repo.forks_count} forks</span>
                  </div>
                </div>

                {/* Abstract Preview Area */}
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20 mb-12 shadow-2xl group">
                  <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                     <Github size={120} className="text-blue-500/10 drop-shadow-[0_0_80px_rgba(59,130,246,0.3)]" />
                  </div>
                  <div className="absolute inset-0 bg-grid-white/[0.02]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  
                  {/* Floating Elements Animation Mockup */}
                  <div className="absolute bottom-12 left-12 right-12">
                    <div className="flex items-end justify-between">
                      <div className="space-y-4">
                        <div className="h-1.5 w-32 bg-blue-500/20 rounded-full overflow-hidden">
                          <motion.div 
                            animate={{ x: ['-100%', '100%'] }} 
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            className="h-full w-full bg-blue-500" 
                          />
                        </div>
                        <div className="h-1.5 w-48 bg-purple-500/20 rounded-full overflow-hidden">
                          <motion.div 
                            animate={{ x: ['100%', '-100%'] }} 
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                            className="h-full w-full bg-purple-500" 
                          />
                        </div>
                      </div>
                      <div className="px-6 py-3 rounded-2xl glass-heavy border border-white/10 text-xs font-mono text-blue-400">
                        REPOSITORY_STATUS: ACTIVE
                      </div>
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <h2 className="text-2xl font-display font-medium mb-6">Overview</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-pretty">
                    {repo.description || "An innovative solution designed with scalability and performance in mind, pushing the boundaries of what's possible on the modern web."}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Sidebar Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 space-y-8 lg:sticky lg:top-32"
            >
              <div className="glass-heavy rounded-[2rem] p-8 border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-[40px] -mr-8 -mt-8" />
                
                <h3 className="font-display font-bold text-xl mb-8 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Technology Stack
                </h3>
                <div className="flex flex-wrap gap-2.5 mb-10">
                  {repo.topics?.map(topic => (
                    <span 
                      key={topic} 
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold hover:border-blue-500/40 hover:bg-blue-500/5 transition-all cursor-default"
                    >
                      {topic}
                    </span>
                  ))}
                  {!repo.topics?.length && (
                     <div className="py-8 text-center w-full border border-dashed border-white/10 rounded-2xl text-sm text-muted-foreground italic">
                       No tags available
                     </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <a 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white text-black hover:bg-white/90 transition-all font-bold group"
                  >
                    <Github size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs uppercase tracking-widest">Source</span>
                  </a>
                  {repo.homepage && (
                    <a 
                      href={repo.homepage} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl glass-heavy border border-white/10 hover:border-blue-500/50 transition-all font-bold group"
                    >
                      <ExternalLink size={24} className="text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs uppercase tracking-widest">Live</span>
                    </a>
                  )}
                  {!repo.homepage && (
                    <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl glass-heavy border border-white/5 opacity-50 cursor-not-allowed">
                      <ExternalLink size={24} className="text-gray-500" />
                      <span className="text-xs uppercase tracking-widest">Demo N/A</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Developer Insights */}
              <div className="p-8 border-l border-blue-500/20 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden">
                    <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Architect</p>
                    <p className="text-sm font-display font-medium">{repo.owner.login}</p>
                  </div>
                </div>
                <p className="text-sm italic text-muted-foreground leading-relaxed">
                  "Excellence is not a skill, it is an attitude. This repository reflects a commitment to clean code and user-centric architecture."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
