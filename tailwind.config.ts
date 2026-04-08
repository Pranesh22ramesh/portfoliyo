import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        border: 'hsl(var(--border))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
      },
      animation: {
        'gradient-shift': 'gradientShift 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'float-y': 'floatY 4s ease-in-out infinite',
        'float-x': 'floatX 6s ease-in-out infinite',
        'blur-out': 'blurOut 0.6s ease-out forwards',
        'blur-in': 'blurIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-down': 'slideDown 0.6s ease-out forwards',
        'vertical-shimmer': 'verticalShimmer 2s linear infinite',
        'morph-wave': 'morphWave 4s ease-in-out infinite',
        'scale-up': 'scaleUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'pan-left': 'panLeft 20s linear infinite',
        'pan-right': 'panRight 20s linear infinite',
        'gradient-cycle': 'gradientCycle 6s ease infinite',
        'neon-flicker': 'neonFlicker 4s ease-in-out infinite',
        'particle-float': 'particleFloat 15s ease-in-out infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(8, 145, 178, 0.1)' 
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(8, 145, 178, 0.3)' 
          },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        floatX: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(10px)' },
        },
        blurOut: {
          'from': { opacity: '1', filter: 'blur(0px)' },
          'to': { opacity: '0', filter: 'blur(10px)' },
        },
        blurIn: {
          'from': { opacity: '0', filter: 'blur(10px)' },
          'to': { opacity: '1', filter: 'blur(0px)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          'from': { opacity: '0', transform: 'translateY(-30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        verticalShimmer: {
          '0%': { backgroundPosition: '0% -1000px' },
          '100%': { backgroundPosition: '0% 1000px' },
        },
        morphWave: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '50%': { borderRadius: '70% 30% 40% 60% / 30% 60% 60% 40%' },
          '75%': { borderRadius: '40% 70% 60% 30% / 60% 40% 30% 70%' },
        },
        scaleUp: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        panLeft: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        panRight: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '0% center' },
        },
        gradientCycle: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        neonFlicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { 
            textShadow: '0 0 10px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.5)' 
          },
          '20%, 24%, 55%': { 
            textShadow: '0 0 5px rgba(59, 130, 246, 0.3)' 
          },
        },
        particleFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.8' },
          '25%': { transform: 'translate(20px, -20px) scale(1.1)', opacity: '0.6' },
          '50%': { transform: 'translate(-10px, -40px) scale(0.9)', opacity: '0.4' },
          '75%': { transform: 'translate(10px, -20px) scale(1.05)', opacity: '0.6' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundSize: {
        '300%': '300%',
      },
      perspective: {
        '500': '500px',
        '800': '800px',
        '1000': '1000px',
        '1200': '1200px',
        '2000': '2000px',
      },
    },
  },
  plugins: [
    function({ addUtilities }: { addUtilities: Function }) {
      addUtilities({
        '.perspective-500':  { perspective: '500px' },
        '.perspective-800':  { perspective: '800px' },
        '.perspective-1000': { perspective: '1000px' },
        '.perspective-1200': { perspective: '1200px' },
        '.perspective-2000': { perspective: '2000px' },
        '.preserve-3d':      { transformStyle: 'preserve-3d' },
        '.backface-hidden':  { backfaceVisibility: 'hidden' },
        '.text-pretty':      { textWrap: 'pretty' },
      });
    },
  ],
};

export default config;
