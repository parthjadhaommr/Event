/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",       // root App entry
    "./app/**/*.{js,jsx,ts,tsx}",  // all files inside app/
    "./components/**/*.{js,jsx,ts,tsx}", // all files inside components/
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};