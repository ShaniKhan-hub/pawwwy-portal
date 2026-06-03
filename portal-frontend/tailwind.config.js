/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Refined-minimal warm palette. Tokens use CSS variables under the hood
      // so light/dark themes swap via a single `.dark` class on <html>.
      colors: {
        // Surfaces
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        elevated: 'rgb(var(--elevated) / <alpha-value>)',

        // Ink (text)
        ink: 'rgb(var(--ink) / <alpha-value>)',
        'ink-muted': 'rgb(var(--ink-muted) / <alpha-value>)',
        'ink-faint': 'rgb(var(--ink-faint) / <alpha-value>)',

        // Lines
        line: 'rgb(var(--line) / <alpha-value>)',
        'line-strong': 'rgb(var(--line-strong) / <alpha-value>)',

        // Accent — terracotta
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-soft': 'rgb(var(--accent-soft) / <alpha-value>)',
      },
      fontFamily: {
        // Display — Fraunces (refined editorial serif with optical sizes)
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        // Body — Geist (geometric sans, less generic than Inter)
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Slightly tightened sizes for editorial feel
        'display-xl': ['clamp(3rem, 6vw + 1rem, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(2.25rem, 4vw + 0.75rem, 4rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(1.75rem, 2.5vw + 0.75rem, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        'page': '72rem',
        'prose-tight': '40rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
        'rise-in': 'riseIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to':   { opacity: '1' },
        },
        riseIn: {
          'from': { opacity: '0', transform: 'translateY(0.75rem)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
