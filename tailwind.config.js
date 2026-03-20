/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./store/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        medical: {
          50:  "#F0F7FF",
          100: "#E0EFFF",
          200: "#B8DBFF",
          300: "#7ABFFF",
          400: "#3A9FFF",
          500: "#1A7FE8",
          600: "#0D60BF",
          700: "#0A4A94",
          800: "#083A75",
          900: "#062D5C",
        },
        warning: {
          low:      "#22C55E",
          medium:   "#F59E0B",
          high:     "#EF4444",
          critical: "#991B1B",
        },
      },
    },
  },
  plugins: [],
};
