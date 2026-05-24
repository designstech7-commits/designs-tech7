import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette
        ink: {
          DEFAULT: "#0a0a0a",
          50: "#f5f5f5",
          100: "#e8e8e8",
          200: "#d0d0d0",
          300: "#a8a8a8",
          400: "#707070",
          500: "#484848",
          600: "#303030",
          700: "#1a1a1a",
          800: "#111111",
          900: "#0a0a0a",
        },
        // Acid accent
        acid: {
          DEFAULT: "#c8ff00",
          dim: "#9abf00",
          glow: "#d4ff1a",
        },
        // Warm accent
        ember: {
          DEFAULT: "#ff4400",
          light: "#ff6633",
          dark: "#cc3300",
        },
        // Platinum
        platinum: {
          DEFAULT: "#e8e6e1",
          warm: "#f0ede6",
          cool: "#dfe0e3",
        },
        // Glass
        glass: {
          white: "rgba(255,255,255,0.06)",
          dark: "rgba(10,10,10,0.6)",
          border: "rgba(255,255,255,0.08)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        editorial: ["var(--font-editorial)", "serif"],
      },
      fontSize: {
        "10xl": ["10rem", { lineHeight: "0.85", letterSpacing: "-0.04em" }],
        "11xl": ["12rem", { lineHeight: "0.82", letterSpacing: "-0.05em" }],
        "12xl": ["14rem", { lineHeight: "0.80", letterSpacing: "-0.06em" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "112": "28rem",
        "128": "32rem",
        "144": "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "grain": "grain 0.5s steps(2) infinite",
        "marquee": "marquee 20s linear infinite",
        "marquee-reverse": "marquee-reverse 20s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
        "fade-in": "fadeIn 0.6s ease forwards",
        "slide-up": "slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down": "slideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "blur-in": "blurIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -10%)" },
          "20%": { transform: "translate(-15%, 5%)" },
          "30%": { transform: "translate(7%, -25%)" },
          "40%": { transform: "translate(-5%, 25%)" },
          "50%": { transform: "translate(-15%, 10%)" },
          "60%": { transform: "translate(15%, 0%)" },
          "70%": { transform: "translate(0%, 15%)" },
          "80%": { transform: "translate(3%, 35%)" },
          "90%": { transform: "translate(-10%, 10%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        blurIn: {
          "0%": { filter: "blur(20px)", opacity: "0" },
          "100%": { filter: "blur(0)", opacity: "1" },
        },
      },
      backgroundImage: {
        "noise": "url('/noise.svg')",
        "grid-dark": "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "radial-glow": "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
      },
      backgroundSize: {
        "grid": "60px 60px",
      },
      screens: {
        "3xl": "1920px",
      },
      transitionTimingFunction: {
        "expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
