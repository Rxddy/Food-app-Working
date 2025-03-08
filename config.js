// Load environment variables from .env file
try {
  const dotenv = require('dotenv');
  const result = dotenv.config();
  if (result.error) {
    console.warn('Error loading .env file. Using default or environment values.');
  }
} catch (error) {
  console.warn('dotenv module not found. Using default or environment values.');
}

// Export configuration variables
const config = {
  // Google Maps API Key
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  
  // JWT Secret (for future backend implementation)
  jwtSecret: process.env.JWT_SECRET_KEY || 'default_jwt_secret',
  
  // Database config (for future implementation)
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'food_app_db'
  },
  
  // Other API keys (add as needed)
  // stripeApiKey: process.env.STRIPE_API_KEY || '',
  // twilioApiKey: process.env.TWILIO_API_KEY || '',
};

// For browser usage, create a safe config object with only public keys
const publicConfig = {
  googleMapsApiKey: config.googleMapsApiKey,
  // Add other public keys as needed
};

// Make config available globally for browser scripts
if (typeof window !== 'undefined') {
  window.APP_CONFIG = publicConfig;
}

// For Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
} 