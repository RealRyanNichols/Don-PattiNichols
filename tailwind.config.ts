import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep teal — headers, footer, hero backgrounds
        deep: "#0a3d40",
        // Sea teal — links, buttons, accents
        sea: "#0e6b70",
        "sea-dark": "#0a4f53",
        // Warm sand — page background
        sand: "#faf6ef",
        "sand-dark": "#f1e9db",
        // Gold — give buttons, highlights, scripture accents
        gold: "#c9962e",
        "gold-dark": "#a87b1f",
        // Ink — body text
        ink: "#1c2a33",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
