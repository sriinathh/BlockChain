/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A1F44", // Deep Navy
        secondary: "#1C3A63", // Government Blue
        neutralDark: "#212529",
        neutralLight: "#F8F9FA",
        gray: "#E9ECEF",
        accent: "#00B4D8"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Poppins", "ui-sans-serif", "system-ui"],
        mono: ["IBM Plex Sans", "ui-monospace", "SFMono-Regular"]
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.08)"
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px"
      }
    }
  },
  plugins: []
};
