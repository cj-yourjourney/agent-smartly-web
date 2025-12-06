// shared/api/config.js - Enhanced with automatic token refresh

/**
 * Get the API base URL based on the environment
 */
export const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000'
  }
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
    SUBTOPICS: '/api/practice/subtopics/',
    TOPIC_STRUCTURE: '/api/practice/topic-structure/',
    QUESTIONS: '/api/practice/questions/',
    PRACTICE_EXAM: '/api/practice/practice-exam/',

    // Auth endpoints
    TOKEN_OBTAIN: '/api/users/token/',
    TOKEN_REFRESH: '/api/users/token/refresh/',
    USER_DETAIL: '/api/users/detail/',
    USER_AUTH: '/api/users/auth/',
    REGISTER: '/api/users/register/',

    // Progress endpoints
    PROGRESS: '/api/progress',
    ATTEMPTS: '/api/progress/attempts/',
    PROGRESS_SUMMARY: '/api/progress/summary/',
    PROGRESS_TOPICS: '/api/progress/topics/',
    PROGRESS_SUBTOPICS: '/api/progress/subtopics/',
    WEAK_AREAS: '/api/progress/weak-areas/',
    RECENT_ACTIVITY: '/api/progress/recent-activity/',

    // Exam endpoints
    EXAM_QUESTIONS: '/api/practice/exam/questions/',
    EXAM_SUBMIT: '/api/practice/exam/submit/',
    EXAM_STATS: '/api/practice/exam/stats/'
  }
}

/**
 * Get access token from localStorage
 */
export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken')
  }
  return null
}

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken')
  }
  return null
}

/**
 * Save tokens to localStorage
 */
export const saveTokens = (access, refresh) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', access)
    if (refresh) localStorage.setItem('refreshToken', refresh)
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
 * Check if token is expired or about to expire
 */
const isTokenExpired = (token) => {
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000
    const now = Date.now()

    // Token expired if it expires in less than 10 seconds
    return exp - now < 10000
  } catch (error) {
    console.error('Error checking token expiration:', error)
    return true
  }
}

// Track if we're currently refreshing to prevent multiple simultaneous refreshes
let isRefreshing = false
let refreshSubscribers = []

/**
 * Subscribe to token refresh
 */
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback)
}

/**
 * Notify all subscribers when token is refreshed
 */
const onTokenRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

/**
 * Refresh the access token
 */
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  try {
    console.log('🔄 Refreshing access token...')

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
    saveTokens(data.access, refreshToken)
    console.log('✅ Token refreshed successfully')

    return data.access
  } catch (error) {
    console.error('❌ Token refresh failed:', error)
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
 */
export const authenticatedFetch = async (
  endpoint,
  options = {},
  retry = true
) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  let token = getAccessToken()

  // Check if token needs refresh before making request
  if (token && isTokenExpired(token) && retry) {
    console.log('🔄 Token expired, refreshing before request...')

    // If already refreshing, wait for it to complete
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          // Retry with new token
          const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`,
            ...options.headers
          }

          fetch(url, { ...options, headers })
            .then(resolve)
            .catch(reject)
        })
      })
    }

    // Start refreshing
    isRefreshing = true

    try {
      token = await refreshAccessToken()
      onTokenRefreshed(token)
    } catch (error) {
      throw error
    } finally {
      isRefreshing = false
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
    ...options.headers
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    })

    // If unauthorized and we haven't retried yet, try to refresh token
    if (response.status === 401 && retry) {
      console.log('🔄 Got 401, attempting to refresh token...')

      // If already refreshing, wait for it
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(async (newToken) => {
            try {
              const retryHeaders = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${newToken}`,
                ...options.headers
              }

              const retryResponse = await fetch(url, {
                ...options,
                headers: retryHeaders
              })
              resolve(retryResponse)
            } catch (error) {
              reject(error)
            }
          })
        })
      }

      // Start refreshing
      isRefreshing = true

      try {
        const newToken = await refreshAccessToken()
        onTokenRefreshed(newToken)

        // Retry the request with new token
        return authenticatedFetch(endpoint, options, false)
      } catch (refreshError) {
        throw new Error('Authentication failed')
      } finally {
        isRefreshing = false
      }
    }

    return response
  } catch (error) {
    throw error
  }
}

/**
 * Generic API call wrapper with error handling
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
  get: async (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint

    return apiCall(url, {
      method: 'GET'
    })
  },

  post: async (endpoint, data = {}) => {
    return apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  put: async (endpoint, data = {}) => {
    return apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  patch: async (endpoint, data = {}) => {
    return apiCall(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  },

  delete: async (endpoint) => {
    return apiCall(endpoint, {
      method: 'DELETE'
    })
  }
}

export default API_CONFIG
