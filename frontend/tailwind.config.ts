import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2F6F4E', // Herb Green
          hover: '#24563C',
        },
        accent: '#A7D7C5', // Fresh Mint
        background: '#FBF8F3', // Warm Cream
        surface: '#FFFFFF',
        text: {
          primary: '#2B2B2B',
          secondary: '#6B7280',
        },
        border: '#E6E8E6',
      },
      borderRadius: {
        '2xl': '1rem',
        'xl': '0.75rem',
      },
    },
  },
  plugins: [],
}
export default config
