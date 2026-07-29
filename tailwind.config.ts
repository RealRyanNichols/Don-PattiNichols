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
        ink: "#1c2a33",
        sea: { DEFAULT: "#0e6b70", dark: "#0a4f53" },
        deep: "#0a3d40",
        sand: { DEFAULT: "#faf6ef", dark: "#f1e9db" },
        gold: { DEFAULT: "#c9962e", dark: "#a87b1f" },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: { content: "72rem" },
    },
  },
  plugins: [],
};
export default config;
