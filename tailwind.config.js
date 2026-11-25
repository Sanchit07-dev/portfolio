/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          surface: 'var(--bg-surface)',
          subtle: 'var(--bg-subtle)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          light: 'var(--accent-light)',
          border: 'var(--accent-border)',
        },
        border: {
          DEFAULT: 'var(--border)',
          subtle: 'var(--border)',
          strong: '#D4D4D4',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: '#A3A3A3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'elevated': '0 20px 30px -10px rgba(0, 0, 0, 0.07)',
        'accent': '0 4px 14px 0 rgba(249, 115, 22, 0.25)',
      }
    },
  },
  plugins: [],
}
