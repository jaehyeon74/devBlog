const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
    fontFamily: {
      sans: ["'Montserrat'"],
      mono: ["'Inconsolata'"],
    },
    screens: {
      xs: "390px",
      ...defaultTheme.screens,
    },
  },
  plugins: [],
};
