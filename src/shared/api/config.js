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
    // Practice endpoints
    PRACTICE: '/api/practice',
    TOPICS: '/api/practice/topics/',
    QUESTIONS: '/api/practice/questions/',

    // Auth endpoints
    TOKEN_OBTAIN: '/api/users/token/',
    TOKEN_REFRESH: '/api/users/token/refresh/',
    USER_DETAIL: '/api/users/detail/',
    USER_AUTH: '/api/users/auth/',
    REGISTER: '/api/users/register/'
  }
}

/**
 * Get access token from localStorage
 * @returns {string|null} Access token
 */
export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken')
  }
  return null
}

/**
 * Get refresh token from localStorage
 * @returns {string|null} Refresh token
 */
export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken')
  }
  return null
}

/**
 * Save tokens to localStorage
 * @param {string} access - Access token
 * @param {string} refresh - Refresh token
 */
export const saveTokens = (access, refresh) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
  }
}

/**
 * Remove tokens from localStorage
 */
export const removeTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

/**
 * Get authorization header with access token
 * @returns {Object} Authorization header object
 */
export const getAuthHeader = () => {
  const token = getAccessToken()
  if (token) {
    return {
      Authorization: `Bearer ${token}`
    }
  }
  return {}
}

/**
 * Refresh the access token
 * @returns {Promise<string>} New access token
 */
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TOKEN_REFRESH}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh: refreshToken })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const data = await response.json()

    // Save the new access token
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', data.access)
    }

    return data.access
  } catch (error) {
    // If refresh fails, clear tokens and redirect to login
    removeTokens()
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw error
  }
}

/**
 * Make an authenticated API request with automatic token refresh
 * @param {string} endpoint - The API endpoint (from API_CONFIG.ENDPOINTS)
 * @param {Object} options - Fetch options
 * @param {boolean} retry - Internal flag for retry logic
 * @returns {Promise<Response>} Fetch response
 */
export const authenticatedFetch = async (
  endpoint,
  options = {},
  retry = true
) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    })

    // If unauthorized and we haven't retried yet, try to refresh token
    if (response.status === 401 && retry) {
      try {
        await refreshAccessToken()
        // Retry the request with new token
        return authenticatedFetch(endpoint, options, false)
      } catch (refreshError) {
        // Token refresh failed, throw the original 401 error
        throw new Error('Authentication failed')
      }
    }

    return response
  } catch (error) {
    throw error
  }
}

/**
 * Generic API call wrapper with error handling
 * @param {string} endpoint - The API endpoint (from API_CONFIG.ENDPOINTS)
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Parsed JSON response
 */
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await authenticatedFetch(endpoint, options)

    // Parse JSON response
    const data = await response.json()

    // Check if response is ok
    if (!response.ok) {
      throw {
        status: response.status,
        message: data.detail || data.message || 'An error occurred',
        data: data
      }
    }

    return data
  } catch (error) {
    // Re-throw with consistent error structure
    if (error.status) {
      throw error
    }
    throw {
      status: 500,
      message: error.message || 'Network error occurred',
      data: null
    }
  }
}

/**
 * API helper methods for common HTTP operations
 */
export const api = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>}
   */
  get: async (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint

    return apiCall(url, {
      method: 'GET'
    })
  },

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise<Object>}
   */
  post: async (endpoint, data = {}) => {
    return apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise<Object>}
   */
  put: async (endpoint, data = {}) => {
    return apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise<Object>}
   */
  patch: async (endpoint, data = {}) => {
    return apiCall(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  },

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise<Object>}
   */
  delete: async (endpoint) => {
    return apiCall(endpoint, {
      method: 'DELETE'
    })
  }
}

export default API_CONFIG
