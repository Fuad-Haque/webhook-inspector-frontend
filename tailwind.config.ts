import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0F",
        "bg-2": "#111118",
        surface: "#16161F",
        elevated: "#1C1C28",
        accent: "#6C63FF",
        teal: "#00D4AA",
        border: "#2A2A3F",
        "text-primary": "#F0F0FF",
        "text-secondary": "#8888AA",
        "text-muted": "#4A4A6A",
      },
      fontFamily: {
        sans: ["Sora", "system-ui"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "pulse-dot": "pulse 1.5s ease-in-out infinite",
        "slide-in": "slideIn 0.2s ease-out",
        "fade-in": "fadeIn 0.15s ease-out",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(-8px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;