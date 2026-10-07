import { configureStore } from '@reduxjs/toolkit'
import credentialsReducer from '../features/credentials/credentialsSlice'

export const store = configureStore({
  reducer: {
    credentials: credentialsReducer,
  },
})
