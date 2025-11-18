/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",       // Todas las pantallas y layouts
    "./components/**/*.{js,jsx,ts,tsx}", // Componentes reutilizables
    "./hooks/**/*.{js,ts}",              // Si querés usar clases en hooks (menos común)
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}