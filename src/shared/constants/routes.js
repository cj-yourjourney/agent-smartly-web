// src/shared/constants/routes.js

/**
 * Application route constants
 * Central place to manage all route URLs in the application
 */

// Public routes
export const ROUTES = {
  HOME: '/',

  // Auth routes
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup'
  },

  // Learning routes
  LEARNING: {
    PRACTICE: '/learning/practice',
    PROGRESS: '/learning/progress',
    KEY_CONCEPTS: '/learning/key-concepts'
  },

  // Community routes
  COMMUNITY: {
    STUDY_GROUP: '/community/study-group'
  }
}

// Helper function to check if a route is active
export const isRouteActive = (currentPath, targetPath) => {
  return currentPath === targetPath
}

// Helper function to check if route belongs to a specific section
export const isInSection = (currentPath, sectionPrefix) => {
  return currentPath.startsWith(sectionPrefix)
}

export default ROUTES
