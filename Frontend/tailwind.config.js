/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'system-ui', 'sans-serif'],
        dm: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Legacy primary kept for any missed refs
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        aurora: {
          indigo: '#6366f1',
          violet: '#8b5cf6',
          cyan:   '#22d3ee',
          pink:   '#f472b6',
          emerald:'#34d399',
          amber:  '#fbbf24',
        },
        dark: {
          950: '#080b14',
          900: '#0d1020',
          800: '#131729',
          700: '#1a2035',
          600: '#1e2540',
        },
      },
      animation: {
        // Aurora ambiance
        'aurora-1':       'aurora-drift-1 18s ease-in-out infinite alternate',
        'aurora-2':       'aurora-drift-2 24s ease-in-out infinite alternate',
        'aurora-3':       'aurora-drift-3 20s ease-in-out infinite alternate',
        // UI
        'fade-up':        'fade-up 0.5s ease-out both',
        'fade-in':        'fade-in 0.3s ease-out both',
        'slide-up':       'slide-up 0.4s ease-out both',
        'slide-in-left':  'slide-in-left 0.35s ease-out both',
        'pulse-glow':     'pulse-glow 2s ease-in-out infinite',
        'pulse-glow-red': 'pulse-glow-red 1s ease-in-out infinite',
        'spin-slow':      'spin 3s linear infinite',
        'bounce-dot':     'bounce-dot 1.2s ease-in-out infinite',
        'waveform':       'waveform 0.8s ease-in-out infinite alternate',
        'border-march':   'border-march 3s linear infinite',
        'float':          'float 6s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
        'live-pulse':     'live-pulse 2s ease-in-out infinite',
        'count-up':       'fade-in 1s ease-out both',
      },
      keyframes: {
        'aurora-drift-1': {
          '0%':   { transform: 'translate(0%, 0%) scale(1)',    opacity: '0.55' },
          '50%':  { transform: 'translate(8%, -6%) scale(1.1)', opacity: '0.7'  },
          '100%': { transform: 'translate(-4%, 8%) scale(0.95)',opacity: '0.5'  },
        },
        'aurora-drift-2': {
          '0%':   { transform: 'translate(0%, 0%) scale(1)',    opacity: '0.45' },
          '50%':  { transform: 'translate(-10%, 8%) scale(1.15)',opacity: '0.65'},
          '100%': { transform: 'translate(6%, -5%) scale(0.9)', opacity: '0.4' },
        },
        'aurora-drift-3': {
          '0%':   { transform: 'translate(0%, 0%) scale(1)',    opacity: '0.4'  },
          '50%':  { transform: 'translate(5%, 10%) scale(1.08)',opacity: '0.6'  },
          '100%': { transform: 'translate(-8%, -4%) scale(1.05)',opacity: '0.35'},
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)'    },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)'     },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(99,102,241,0)' },
          '50%':      { boxShadow: '0 0 20px 4px rgba(99,102,241,0.35)' },
        },
        'pulse-glow-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0)' },
          '50%':      { boxShadow: '0 0 16px 6px rgba(239,68,68,0.4)' },
        },
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'translateY(0)',    opacity: '0.4' },
          '40%':           { transform: 'translateY(-8px)', opacity: '1'   },
        },
        'waveform': {
          '0%':   { transform: 'scaleY(0.3)' },
          '100%': { transform: 'scaleY(1.0)' },
        },
        'border-march': {
          '0%':   { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)'   },
          '50%':      { transform: 'translateY(-10px)'  },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        'live-pulse': {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)'    },
          '50%':      { opacity: '0.5', transform: 'scale(0.85)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
