/** @type {import('tailwindcss').Config} */
import { COLORS } from "./src/Constants.js";
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
      primarylightblue: COLORS.primarylightblue,
      // secondar:           its blue border
      yellowBorder: COLORS.yellowborder,
      redBorder: COLORS.redborder,
      greenBorder: COLORS.greenborder,
      purpleBorder: COLORS.purpleborder,
      grayBorder: COLORS.grayborder,


    },

      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
      },

    },
  },
  plugins: [],
};
