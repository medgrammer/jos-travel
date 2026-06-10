import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#ecfeff",
          100: "#cffafe",
          300: "#67e8f9",
          500: "#06b6d4",
          700: "#0e7490",
          950: "#082f49"
        },
        palm: {
          100: "#dcfce7",
          400: "#4ade80",
          600: "#16a34a",
          900: "#14532d"
        },
        sun: {
          300: "#fbbf24",
          500: "#f97316",
          600: "#ea580c"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(6, 182, 212, 0.22)",
        lift: "0 18px 60px rgba(8, 47, 73, 0.16)"
      },
      backgroundImage: {
        "jos-radial": "radial-gradient(circle at 20% 15%, rgba(103,232,249,.28), transparent 28%), radial-gradient(circle at 82% 18%, rgba(249,115,22,.22), transparent 24%), linear-gradient(135deg, #f8fdff 0%, #eefcff 44%, #ffffff 100%)"
      }
    }
  },
  plugins: []
};

export default config;
