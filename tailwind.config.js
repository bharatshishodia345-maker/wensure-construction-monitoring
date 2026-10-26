/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wensure: {
          // Core Ink & Deep Forest
          ink: '#121917',
          'deep-ink': '#0D1412',
          forest: '#1C2E28',
          'forest-deep': '#14221E',
          'forest-light': '#2A443C',

          // Verification & Trust Teals
          teal: '#178F88',
          'teal-dark': '#0E746F',
          'teal-light': '#E8F6F5',
          'teal-subtle': '#D1EEEE',

          // Warm Ivory & Off-white Surfaces
          'warm-white': '#FAF8F5',
          ivory: '#FFFDF9',
          'ivory-muted': '#F5F2EB',
          'soft-stone': '#EEEAE1',
          'stone-muted': '#E4DFD4',
          'fine-divider': '#E5E0D5',
          'muted-text': '#6E756C',
          'muted-text-dark': '#484E46',

          // Construction Material Tones: Sandstone & Restrained Terracotta
          sandstone: '#E7E2D8',
          'sandstone-light': '#F6F3ED',
          'sandstone-dark': '#C8C0B2',
          terracotta: '#BC5438',
          'terracotta-dark': '#9F422B',
          'terracotta-light': '#FBF2EE',
          clay: '#8C4533',
          brick: '#A8482D',

          // Status & Operational States
          success: '#266E51',
          'success-light': '#EBF5F0',
          warning: '#B07525',
          'warning-light': '#FDF5EB',
          critical: '#AD413A',
          'critical-light': '#FDF2F0',
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.035em',
        tighter: '-0.02em',
        tight: '-0.01em',
        widest: '0.12em',
      }
    },
  },
  plugins: [],
}
