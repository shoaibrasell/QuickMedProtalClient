/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}" // Adjust this to include your file paths
  ],

  theme: {
    extend: {}
  },
  plugins: [require("daisyui")]
};
