// shared/redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import practiceReducer from '../../features/practice/state/practiceSlice'
import authReducer from '../../features/auth/state/authSlice'
import progressReducer from '../../features/progress/state/progressSlice'
import examReducer from '../../features/exam/state/examSlice'
import keyConceptsReducer from '../../features/key-concepts/state/keyConceptsSlice'

export const store = configureStore({
  reducer: {
    practice: practiceReducer,
    auth: authReducer,
    exam: examReducer,
    progress: progressReducer,
    keyConcepts: keyConceptsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export default store
