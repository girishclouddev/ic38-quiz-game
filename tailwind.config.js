/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.98)", opacity: "0" },
          "40%": { transform: "scale(1.03)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-3px)" }
        }
      },
      animation: {
        pop: "pop 240ms ease-out",
        wiggle: "wiggle 600ms ease-in-out",
        float: "float 4s ease-in-out infinite"
      }
    },
  },
  plugins: [],
};

