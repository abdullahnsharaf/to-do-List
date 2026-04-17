import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f9f9f9",
        "surface-low": "#f3f3f3",
        "surface-card": "#ffffff",
        "surface-high": "#e8e8e8",
        "surface-dim": "#dadada",
        "text-base": "#1a1c1c",
        "text-soft": "#474747",
        "outline-soft": "#c6c6c6",
        primary: "#000000",
        "primary-soft": "#3c3b3b",
        danger: "#ba1a1a",
        "danger-soft": "#ffdad6",
        "muted-chip": "#d5d4d4"
      },
      boxShadow: {
        ambient: "0 8px 32px rgba(26, 28, 28, 0.04)"
      },
      borderRadius: {
        "2xl": "1.5rem",
        "3xl": "2rem"
      },
      fontFamily: {
        sans: ["var(--font-ibm-plex-arabic)"]
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top right, rgba(0, 0, 0, 0.08), transparent 28%), linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(243, 243, 243, 0.92))"
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out"
      }
    }
  },
  plugins: [forms]
};

export default config;
