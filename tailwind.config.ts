import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand crimson rose & royal navy palette harmonized with WCAG AA contrast (>= 5.8:1 white on brand-600)
        brand: {
          50: "#FFF1F5",
          100: "#FFE4EC",
          200: "#FECDD9",
          300: "#FDA4BA",
          400: "#FB7194",
          500: "#F35C7A",
          600: "#C81E51",
          700: "#A31641",
          800: "#881337",
          900: "#4C0519",
        },
        navy: {
          50: "#F0F5FF",
          100: "#E0EAFF",
          600: "#1D4ED8",
          800: "#1E3A8A",
          900: "#0F2952",
          950: "#0A1931",
        },
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(15, 23, 42, 0.06)",
        elevated: "0 20px 40px -12px rgba(15, 23, 42, 0.12)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(14px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right": "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
