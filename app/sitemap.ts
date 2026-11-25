import type { MetadataRoute } from 'next';
import { credentials, projects, site } from '@/lib/portfolio';

export default function sitemap():MetadataRoute.Sitemap {
  return ['', '/blog', ...projects.map(p=>'/projects/'+p.id), ...credentials.map(c=>'/credentials/'+c.id)].map(path=>({url:site+path}));
}
