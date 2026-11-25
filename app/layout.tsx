import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { github, linkedin, site } from '@/lib/portfolio';

const description = 'Explore Pranesh Ramesh’s software portfolio in a playable 3D city, or jump straight to projects, internships and credentials.';

export const metadata: Metadata = {
  metadataBase:new URL(site),
  title:{default:'Developer World | Pranesh Ramesh',template:'%s | Pranesh Ramesh'},
  description,
  icons:{icon:'/favicon.svg'},
  openGraph:{type:'website',url:site,title:'Developer World | Pranesh Ramesh',description,images:['/world-preview.webp']},
  twitter:{card:'summary_large_image',title:'Developer World | Pranesh Ramesh',description,images:['/world-preview.webp']},
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en" suppressHydrationWarning><body className="font-sans bg-background text-foreground">
    <ThemeProvider>{children}</ThemeProvider>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({
      '@context':'https://schema.org','@type':'Person',name:'Pranesh Ramesh',url:site,
      alumniOf:'Kongu Engineering College',sameAs:[github,linkedin],
    })}}/>
  </body></html>;
}
