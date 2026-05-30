import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LenisProvider } from '@/components/providers/LenisProvider';
import CustomCursor from '@/components/ui/CustomCursor';
import ScrollProgress from '@/components/ui/ScrollProgress';
import AIChatbot from '@/components/ui/AIChatbot';
import AOSProvider from '@/components/providers/AOSProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://github.com/Pranesh22ramesh'),
  title: 'Pranesh BR | Ultra-Premium Portfolio',
  description:
    'Portfolio of Pranesh BR - A passionate frontend developer, cybersecurity enthusiast, and AI explorer building secure, scalable, and beautiful web applications.',
  keywords: ['Pranesh BR', 'frontend developer', 'cybersecurity', 'React', 'portfolio', 'web developer India'],
  authors: [{ name: 'Pranesh BR', url: 'https://github.com/Pranesh22ramesh' }],
  creator: 'Pranesh BR',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Pranesh BR - Developer Portfolio',
    description: 'Frontend Developer, Cybersecurity Enthusiast & AI Explorer',
    siteName: 'Pranesh BR Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pranesh BR | Portfolio',
    description: 'Cinematic developer experience.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-background text-foreground selection:bg-primary/20`}>
        <ThemeProvider>
          <LenisProvider>
            <AOSProvider />
            <CustomCursor />
            <ScrollProgress />
            {children}
            <AIChatbot />
          </LenisProvider>
        </ThemeProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Pranesh BR",
              "url": "https://github.com/Pranesh22ramesh",
              "jobTitle": "Frontend Developer",
              "alumniOf": "Kongu Engineering College",
              "knowsAbout": ["Web Development", "Cybersecurity", "AI", "React", "Next.js"],
              "sameAs": [
                "https://github.com/Pranesh22ramesh",
                "https://www.linkedin.com/in/pranesh-ramesh-67a0a9246/"
              ]
            }),
          }}
        />
      </body>
    </html>
  );
}
