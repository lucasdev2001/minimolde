/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      "corporate"
      /* {
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          primary: "#4b6bfb",
        },
      }, */
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
