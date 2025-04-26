// tailwind.config.ts
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: "#1e3a8a", // Navy blue
            light: "#3b82f6",
            dark: "#1e40af",
          },
          secondary: {
            DEFAULT: "#0d9488", // Teal
            light: "#5eead4",
          },
          background: {
            DEFAULT: "#f8fafc", // Light gray
            dark: "#e2e8f0",
          },
          text: {
            primary: "#1f2937", // Dark gray
            secondary: "#6b7280",
          },
        },
        fontFamily: {
          sans: ["Inter", "sans-serif"],
        },
        boxShadow: {
          card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          modal: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
        borderRadius: {
          card: "0.75rem",
          button: "0.5rem",
        },
      },
    },
    plugins: [],
  };