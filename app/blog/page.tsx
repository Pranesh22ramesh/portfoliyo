import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { getAllPosts, BlogPost } from '@/lib/blog';

export default async function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-primary/60" />
            <span className="text-sm font-medium text-primary tracking-[0.2em] uppercase">Insights</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-medium tracking-tight">
            The <span className="gradient-text italic pr-2">Blog</span>
          </h1>
          <p className="text-muted-foreground text-lg mt-6 max-w-2xl">
            Exploring the intersection of web engineering, security, and artificial intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <Link 
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group glass-heavy rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500 shadow-xl hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 rounded-full glass-heavy text-xs font-semibold text-primary backdrop-blur-md">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {new Date(post.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {post.readTime}
                  </span>
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  Read Article <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
