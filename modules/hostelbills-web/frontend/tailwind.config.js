/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas:        'rgb(var(--canvas) / <alpha-value>)',
        surface:       'rgb(var(--surface) / <alpha-value>)',
        elevated:      'rgb(var(--elevated) / <alpha-value>)',
        ink:           'rgb(var(--ink) / <alpha-value>)',
        'ink-muted':   'rgb(var(--ink-muted) / <alpha-value>)',
        'ink-faint':   'rgb(var(--ink-faint) / <alpha-value>)',
        line:          'rgb(var(--line) / <alpha-value>)',
        'line-strong': 'rgb(var(--line-strong) / <alpha-value>)',
        accent:        'rgb(var(--accent) / <alpha-value>)',
        'accent-soft': 'rgb(var(--accent-soft) / <alpha-value>)',
        'paid':        'rgb(var(--paid) / <alpha-value>)',
        'unpaid':      'rgb(var(--unpaid) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans:    ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['Geist Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-lg': ['clamp(2rem, 3vw + 0.75rem, 3rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
};
