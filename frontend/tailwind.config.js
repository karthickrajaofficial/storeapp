// tailwind.config.js

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#ff69b4', // Extend colors with neon pink
        'yellow': '#FFD700', // Define a custom yellow color
      },
      boxShadow: {
        'neon': '0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4', // Example of extending box-shadow with neon effect
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'], // Define Montserrat as a custom font family
        poppins: ['Poppins', 'sans-serif'], // Define Poppins as another custom font family
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.neon-pink': {
          backgroundColor: '#ff69b4',
          boxShadow: '0 0 10px #ff69b4, 0 0 20px #ff69b4, 0 0 30px #ff69b4',
        },
      };

      addUtilities(newUtilities, ['hover', 'pink']); // Include these utilities for hover and dark mode
    },
    // Other plugins as needed
  ],
};
