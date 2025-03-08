// Configuration management for the application
// This file loads environment variables and provides configuration to the app

// Check if we're running in a browser environment
const isBrowser = typeof window !== 'undefined';

// Configuration for server-side (Node.js)
if (!isBrowser) {
  // Load environment variables from .env file in Node.js environment
  require('dotenv').config();
}

// Create a configuration object with defaults
const config = {
  // API keys and secrets
  googleMapsApiKey: isBrowser 
    ? window.GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY' 
    : process.env.GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
  
  jwtSecret: isBrowser 
    ? 'JWT_SECRET_NOT_USED_IN_BROWSER' 
    : process.env.JWT_SECRET || 'default_jwt_secret_for_development',
  
  // Database configuration
  dbConfig: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'food_app',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  },
  
  // Server configuration
  serverPort: process.env.PORT || 3000,
  
  // Application settings
  appName: 'Food Application',
  isProduction: process.env.NODE_ENV === 'production',
  
  // GitHub Pages detection
  isGitHubPages: isBrowser && window.location.hostname.includes('github.io'),
};

// For browser environment, create a global config object
if (isBrowser) {
  // Create a public subset of config that's safe to expose to the browser
  window.APP_CONFIG = {
    googleMapsApiKey: config.googleMapsApiKey,
    appName: config.appName,
    isProduction: config.isProduction,
    isGitHubPages: config.isGitHubPages,
    apiBaseUrl: config.isGitHubPages 
      ? 'https://your-api-server.com' // Replace with your actual API server if you have one
      : 'http://localhost:3000'
  };
} else {
  // Export the config for Node.js
  module.exports = config;
} 