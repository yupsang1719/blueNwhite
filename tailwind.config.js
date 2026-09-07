/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',300:'#93c5fd',400:'#60a5fa',
          500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af',900:'#1e3a8a'
        },
        // Editorial redesign tokens — sourced from src/styles/tokens.css.
        // Namespaced so they don't collide with `primary`/default Tailwind
        // colors still used by pages this redesign hasn't reached yet.
        paper: {
          DEFAULT: 'var(--color-paper)',
          raised: 'var(--color-paper-raised)',
        },
        ink: {
          DEFAULT: 'var(--color-ink)',
          muted: 'var(--color-ink-muted)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          ink: 'var(--color-accent-ink)',
        },
        hero: {
          bg: 'var(--color-hero-bg)',
          fg: 'var(--color-hero-fg)',
          rule: 'var(--color-hero-rule)',
          // Contrast-checked against hero.bg specifically — the general
          // `accent` token is tuned for --color-paper instead, which fails
          // contrast on the hero in light mode. Use this, not `accent`, for
          // anything drawn on the hero.
          accent: 'var(--color-hero-accent)',
        },
        rule: 'var(--color-rule)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Editorial redesign body face — system stack, no new font load.
        ed: ['var(--font-body)'],
        // Editorial display serif (Playfair Display, added on request) —
        // headline/name-scale moments only. Namespaced so Tailwind's
        // default `font-serif` (unused so far, checked) stays untouched.
        'ed-serif': ['var(--font-serif)'],
      },
      fontSize: {
        // Editorial type scale — prefixed `ed-*` so default text-sm/text-lg
        // etc. keep working unchanged for pages not yet redesigned.
        'ed-xs': 'var(--text-xs)',
        'ed-sm': 'var(--text-sm)',
        'ed-base': 'var(--text-base)',
        'ed-md': 'var(--text-md)',
        'ed-lg': 'var(--text-lg)',
        'ed-xl': 'var(--text-xl)',
        'ed-2xl': 'var(--text-2xl)',
        'ed-3xl': 'var(--text-3xl)',
        'ed-4xl': 'var(--text-4xl)',
        'ed-5xl': 'var(--text-5xl)',
      },
      screens: {
        xs: '375px',
      },
      letterSpacing: {
        // Namespaced so default tracking-tight (already used by the global
        // h1-h3 rule in index.css and by Layout.jsx) is unaffected.
        'ed-tight': 'var(--tracking-tight)',
        'ed-normal': 'var(--tracking-normal)',
        'ed-wide': 'var(--tracking-wide)',
      },
      borderRadius: { xl: '1rem', '2xl': '1.25rem' },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }, // slide by half since we duplicate the row
        },
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
}