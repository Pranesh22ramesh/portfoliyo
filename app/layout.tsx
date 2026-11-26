import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { github, linkedin, profile, site } from '@/lib/portfolio';

const description = 'Explore Pranesh B R’s full stack, AI and cloud portfolio in a playable 3D city, with projects, research and credentials.';

export const metadata: Metadata = {
  metadataBase:new URL(site),
  title:{default:`Developer World | ${profile.name}`,template:`%s | ${profile.name}`},
  description,
  icons:{icon:'/favicon.svg'},
  openGraph:{type:'website',url:site,title:`Developer World | ${profile.name}`,description,images:['/world-preview.webp']},
  twitter:{card:'summary_large_image',title:`Developer World | ${profile.name}`,description,images:['/world-preview.webp']},
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en" suppressHydrationWarning><body className="font-sans bg-background text-foreground">
    <ThemeProvider>{children}</ThemeProvider>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({
      '@context':'https://schema.org','@type':'Person',name:profile.name,alternateName:'Pranesh Ramesh',url:site,
      alumniOf:'Kongu Engineering College',sameAs:[github,linkedin],
    })}}/>
  </body></html>;
}
