import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import { getPostBySlug, BlogPost } from '@/lib/blog';

// CSS for markdown content styling
const markdownStyles = `
  .prose {
    color: var(--muted-foreground);
    line-height: 1.8;
  }
  .prose h1, .prose h2, .prose h3 {
    color: var(--foreground);
    font-family: var(--font-display);
    margin-top: 2.5rem;
    margin-bottom: 1.5rem;
    font-weight: 700;
  }
  .prose h1 { font-size: 2.5rem; }
  .prose h2 { font-size: 1.8rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
  .prose h3 { font-size: 1.4rem; }
  .prose p { margin-bottom: 1.5rem; }
  .prose code { 
    background: var(--muted);
    padding: 0.2rem 0.4rem;
    border-radius: 0.4rem;
    font-size: 0.9em;
  }
  .prose pre {
    background: transparent !important;
    padding: 0 !important;
  }
  .prose pre code {
    background: #1e1e1e !important;
    padding: 1.5rem !important;
    display: block;
    overflow-x: auto;
    border-radius: 1rem;
    border: 1px solid var(--border);
    margin: 2rem 0;
  }
  .prose a {
    color: var(--primary);
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  .prose ul, .prose ol {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
  }
  .prose li {
    margin-bottom: 0.5rem;
  }
`;

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) return (
    <div className="pt-32 pb-24 px-4 min-h-screen text-center">
      <h1 className="text-2xl font-bold">Article not found</h1>
      <Link href="/blog" className="text-primary mt-4 inline-block">Back to Blog</Link>
    </div>
  );

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: markdownStyles }} />
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Back to Articles
          </Link>
        </div>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full glass text-xs font-semibold text-primary">
              {post.category}
            </span>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {new Date(post.date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> {post.readTime}
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-8 leading-tight">
            {post.title}
          </h1>
          
          <div className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden border border-border/40 shadow-2xl mb-12">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        <div className="prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeSlug]}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <footer className="mt-20 pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
              PB
            </div>
            <div>
              <p className="font-bold">Pranesh BR</p>
              <p className="text-sm text-muted-foreground">Frontend Dev & Security Researcher</p>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-6 py-3 rounded-full glass hover:border-primary/50 transition-colors">
            <Share2 size={18} /> Share Article
          </button>
        </footer>
      </div>
    </div>
  );
}
