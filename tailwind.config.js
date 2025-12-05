/** @type {import('tailwindcss').Config} */
import { COLORS } from "./src/Constants.js";
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
      primarylightblue: COLORS.primarylightblue,
      // secondar:           its blue border
      blueBorder : COLORS.blueborder,
      yellowBorder: COLORS.yellowborder,
      redBorder: COLORS.redborder,
      greenBorder: COLORS.greenborder,
      purpleBorder: COLORS.purpleborder,
      grayBorder: COLORS.grayborder,
      blueBg: COLORS.bluebg,
      yellowBg: COLORS.yellowbg,  
      redBg: COLORS.redbg,
      greenBg: COLORS.greenbg,
      purpleBg: COLORS.purplebg,
      totalcountTextClr: COLORS.totalcounttextclr,
      openText: COLORS.opentext,
      lostText: COLORS.losttext,
      confirmedText: COLORS.confirmedtext,
      postponedText: COLORS.postponedtext,



    },

      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-10%)" },
        },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
      },

    },
  },
  plugins: [],
};
