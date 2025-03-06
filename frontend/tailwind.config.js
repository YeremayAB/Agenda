/** @type {import('tailwindcss').Config} */
export default {
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGreen: "#5B7D83",
      },
      borderRadius: {
        '20px': '20px', 
      },
    },
  },
  plugins: [],
  important: true, // Añade esto
}