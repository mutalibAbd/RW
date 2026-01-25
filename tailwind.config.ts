import type { Config } from 'tailwindcss';

/**
 * Tailwind Configuration - "Apple Retail" Design System
 * 
 * Design Philosophy:
 * - Clean, minimal, whitespace-heavy
 * - Ultra-soft shadows with large diffuse radius
 * - System fonts (San Francisco / Inter)
 * - Smooth, organic animations
 */
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ======================================================================
      // Colors - Apple Palette
      // ======================================================================
      colors: {
        // Backgrounds
        'apple-white': '#FFFFFF',
        'apple-offwhite': '#F5F5F7',
        'apple-gray': {
          50: '#FAFAFA',
          100: '#F5F5F7',
          200: '#E8E8ED',
          300: '#D2D2D7',
          400: '#86868B',
          500: '#6E6E73',
          600: '#424245',
          700: '#333336',
          800: '#1D1D1F',
          900: '#000000',
        },
        // Accent - System Blue
        'apple-blue': {
          DEFAULT: '#007AFF',
          hover: '#0066CC',
          light: '#5AC8FA',
        },
        // Status Colors
        'apple-green': '#34C759',
        'apple-red': '#FF3B30',
        'apple-orange': '#FF9500',
      },

      // ======================================================================
      // Typography - System Fonts
      // ======================================================================
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'San Francisco',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Inter',
          'sans-serif',
        ],
        mono: [
          'SF Mono',
          'Monaco',
          'Cascadia Code',
          'Roboto Mono',
          'monospace',
        ],
      },

      // ======================================================================
      // Shadows - Ultra-soft, diffuse
      // ======================================================================
      boxShadow: {
        // Apple-style soft shadows
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'apple': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'apple-md': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'apple-lg': '0 12px 40px rgba(0, 0, 0, 0.1)',
        'apple-xl': '0 20px 60px rgba(0, 0, 0, 0.12)',
        // Card hover effect
        'apple-hover': '0 16px 48px rgba(0, 0, 0, 0.12)',
        // Glassmorphism shadow
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08)',
      },

      // ======================================================================
      // Border Radius - Rounded corners
      // ======================================================================
      borderRadius: {
        'apple': '12px',
        'apple-lg': '16px',
        'apple-xl': '20px',
        'apple-2xl': '24px',
        'apple-3xl': '32px',
      },

      // ======================================================================
      // Animations - Smooth, organic motion
      // ======================================================================
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        'apple-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'apple-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
        'slower': '600ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-apple forwards',
        'slide-up': 'slideUp 0.5s ease-apple forwards',
        'scale-in': 'scaleIn 0.3s ease-apple forwards',
        'spin-slow': 'spin 1.5s linear infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },

      // ======================================================================
      // Spacing - Generous whitespace
      // ======================================================================
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },

      // ======================================================================
      // Backdrop Blur - Glassmorphism
      // ======================================================================
      backdropBlur: {
        'apple': '20px',
        'apple-lg': '40px',
      },
    },
  },
  plugins: [],
};

export default config;
