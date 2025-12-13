/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        // primary: "",
        secondary: "#0EA5E9",
        accent: "#F97316",
        dark: "#1E293B",
        light: "#F1F5F9",
        textGray: "#6B7280",
      },
    },
  },
  plugins: [],
}