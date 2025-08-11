/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          400: "#49795aff",
          300: "#7ca884ff",
          200: "#aac6a2ff",
          100: "#cfdccbff",
          50: "#edf4efff",
        },
        black: {
          900: "#252525",
        },
        green: {
          500: "#4e704fff",
        },
      },
    },
  },
  plugins: [],
};
