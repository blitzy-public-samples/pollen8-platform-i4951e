// Tailwind CSS configuration for Pollen8 application

module.exports = {
  // Purge unused styles in production
  purge: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  
  // Disable dark mode
  darkMode: false,
  
  // Extend default theme
  theme: {
    extend: {
      // Custom color palette
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        accent: '#808080'
      },
      
      // Custom font family
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      
      // Additional spacing utilities
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem'
      },
      
      // Custom border radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem'
      }
    }
  },
  
  // Extend variants for specific use cases
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['active', 'disabled'],
      textColor: ['active', 'disabled']
    }
  },
  
  // No plugins used
  plugins: []
}