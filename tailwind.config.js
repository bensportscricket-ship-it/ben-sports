/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0A0F0C',
          elevated: '#12180F',
          elevated2: '#182015',
        },
        pitch: {
          DEFAULT: '#1F9D55',
          dim: '#175E37',
          bright: '#3CD97B',
        },
        bail: {
          DEFAULT: '#E3B23C',
          dim: '#8A6A21',
        },
        ink: {
          DEFAULT: '#F4F6F2',
          muted: '#8B9389',
          faint: '#5B6258',
        },
        line: '#212B1E',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 24px -12px rgba(0,0,0,0.6)',
        glow: '0 0 24px rgba(60, 217, 123, 0.25)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
      },
      backgroundImage: {
        'seam-repeat': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='8' viewBox='0 0 24 8'%3E%3Cpath d='M0 4 L6 0 M6 8 L12 4 L18 0 M18 8 L24 4' stroke='%238A6A21' stroke-width='1' fill='none' opacity='0.5'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
