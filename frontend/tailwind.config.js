/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
          'blue-light': '#3B82F6',
          indigo: '#4F46E5',
          navy: '#0F172A',
          success: '#16A34A',
          warning: '#F59E0B',
          error: '#DC2626'
        },
        surface: {
          page: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          muted: '#64748B'
        }
      },
      boxShadow: {
        'card-soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
      }
    }
  },
  plugins: []
};
