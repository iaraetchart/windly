/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kumbhsans: ["Kumbh Sans", "sans-serif"],
        gowundodum: ["Gowun Dodum", "sans-serif"],
      },
    },
  },
  plugins: [],
};