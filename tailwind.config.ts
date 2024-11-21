import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

    theme: {
      extend: {
        backgroundImage: {
          'conic-gradient': 'conic-gradient(from -160deg at 50% 50%, #e92a67, #a853ba, #2a8af6, #2a8af600 360deg)',
        },
        animation: {
          spinner: 'spinner 4s linear infinite',
        },
        keyframes: {
          spinner: {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
        },
      },
    },
  
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [ 
      "nord",
      "retro",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "garden",
      "valentine",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "acid",
      "lemonade",
      "coffee",
      "winter",
      ], // Add your themes here
  },
};
export default config;
