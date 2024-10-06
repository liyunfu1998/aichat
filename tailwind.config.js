/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#20AB6E",
        lime: "#D7FFD4",
        pink: "#F655FF",
        brown: "#29271D",
        sky: "#E5EDFF",
        teal: "#0E4D45",
        yellow: "#FCBB80",
        orange: "#EF580B",
        blue: "#0000FA",
        green: "#172E15",
        light: "#FFFCFF",
        grey: "#242026",
        greyLight: "#B8B3BA",
        input: "#EEE9F0",
        selected: "#F7F2F9",
        dark: "#2F2D32",
      },
    },
  },
  plugins: [],
};
