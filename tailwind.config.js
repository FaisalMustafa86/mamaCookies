/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Mama's Cookies brand palette (from packaging + logo)
        brand: {
          red: "#E11D29", // primary scarlet (box + wordmark)
          dark: "#B0121C", // deep red for hovers / shadows
          ink: "#1A1208", // near-black outlines / text
        },
        cream: "#FBF6EC", // off-white packaging surface
        crust: "#C98A4B", // baked cookie tone (logo "C")
        choc: "#5A3A21", // chocolate chunk brown
        blush: {
          DEFAULT: "#F9C9D4", // soft pink backdrop
          light: "#FDEBEF",
        },
        muted: "#6B635A",
      },
      fontFamily: {
        script: ['"Pacifico"', "cursive"],
        display: ['"Anton"', "sans-serif"],
        heading: ['"Poppins"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(26, 18, 8, 0.18)",
        lift: "0 18px 40px -16px rgba(225, 29, 41, 0.35)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        blob: "blob 14s ease-in-out infinite",
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};
