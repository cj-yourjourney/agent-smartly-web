// shared/redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import practiceReducer from '../../features/practice/state/practiceSlice'
import authReducer from '../../features/auth/state/authSlice'
import progressReducer from '../../features/progress/state/progressSlice'

export const store = configureStore({
  reducer: {
    practice: practiceReducer,
    auth: authReducer,
    progress: progressReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export default store
