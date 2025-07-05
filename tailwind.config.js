/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',  
        foreground: '#111827',    
        border: '#e5e7eb',        
      },
    },
  },
  plugins: [],
};

