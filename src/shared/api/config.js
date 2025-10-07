// shared/api/config.js

/**
 * Get the API base URL based on the environment
 * @returns {string} The API base URL
 */
export const getApiUrl = () => {
  // Check if we're in development mode
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000'
  }

  // Production URL
  return 'https://api.codifymate.com'
}

/**
 * API configuration object
 */
export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  ENDPOINTS: {
    PRACTICE: '/api/practice',
    TOPICS: '/api/practice/topics/',
    QUESTIONS: '/api/practice/questions/'
  }
}

export default API_CONFIG
