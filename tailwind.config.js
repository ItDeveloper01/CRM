/** @type {import('tailwindcss').Config} */
import { COLORS } from "./src/Constants.js";
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
      brandYellow: "#facc15",
      brandGreen: "#42f905e4",
      brandRed: "#f30518ff",
      brandPurple: "#9b5de5",
      brandGray: "#d1d5db",
      brandBlue: "#3b82f6",
      primary: COLORS.primary,
    },
    },
  },
  plugins: [],
};
