import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Themeable accent: the R G B channels live in a CSS variable so every
        // `*-brand` utility (incl. opacity modifiers like bg-brand/90) re-themes
        // at once. Defaults to red; the Gratis view swaps in green (.theme-free).
        brand: "rgb(var(--accent-rgb) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};

export default config;
