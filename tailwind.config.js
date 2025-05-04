/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: "#F05A28", // основной акцент
          black: "#000000",  // основной текст
          gray: "#F5F5F5",   // фон
          border: "#CCCCCC", // границы полей
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

