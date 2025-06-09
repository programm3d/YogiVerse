/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Method 1: Quoted keys for hyphenated names
        "yoga-purple": "#8B5CF6",
        "yoga-pink": "#EC4899",
        "yoga-orange": "#F97316",
        "yoga-teal": "#14B8A6",

        // Method 2: Nested structure (creates bg-primary-500, etc.)
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
      },
    },
  },
  plugins: [],
};
