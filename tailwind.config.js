/** @type {import('tailwindcss').Config} */
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
