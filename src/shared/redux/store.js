// shared/redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import practiceReducer from '../../features/practice/state/practiceSlice'
import authReducer from '../../features/auth/state/authSlice'
import progressReducer from '../../features/progress/state/progressSlice'
import keyConceptsReducer from '../../features/key-concepts/state/keyConceptsSlice'
import subscriptionReducer from '../../features/subscription/state/subscriptionSlice'
import accountReducer from '../../features/account/state/accountSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    practice: practiceReducer,
    progress: progressReducer,
    keyConcepts: keyConceptsReducer,
    subscription: subscriptionReducer,
    account: accountReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export default store
