// API Configuration with production fallback
export const API_CONFIG = {
  // Try environment variable first, then production URL, then development URL
  BASE_URL: import.meta.env.VITE_API_URL || 
            (import.meta.env.PROD ? 'https://uniflow4895.onrender.com/api' : 'http://localhost:5000/api'),
  
  // Helper to get full URL
  getFullUrl: (endpoint) => {
    const baseUrl = API_CONFIG.BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  },
  
  // Environment check
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Debug logging (only in development)
  logConfig: () => {
    if (API_CONFIG.isDevelopment) {
      console.log('🔧 API Configuration:', {
        BASE_URL: API_CONFIG.BASE_URL,
        ENV_VAR: import.meta.env.VITE_API_URL,
        MODE: import.meta.env.MODE,
        PROD: import.meta.env.PROD
      });
    }
  }
};

// Log configuration on import (development only)
API_CONFIG.logConfig();

export default API_CONFIG;
