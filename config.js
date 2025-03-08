// Configuration for GitHub Pages static site
// For security, we're not exposing the actual API key in the client-side code
// In a real production environment, you would use a proxy server to make API calls

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// For GitHub Pages demo, we'll use a placeholder or restricted API key
// The actual key should be kept in .env and used server-side only
window.APP_CONFIG = {
  // Use a placeholder or restricted API key for client-side code
  // The actual key is stored in .env file and should only be used server-side
  googleMapsApiKey: 'YOUR_API_KEY_HERE', // Replace with a restricted key if needed for demo
  appName: 'Food Application',
  isProduction: true,
  isGitHubPages: true,
  apiBaseUrl: 'https://example.com/api' // This won't be used in the static demo
}; 
