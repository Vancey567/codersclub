// Create store
import { configureStore } from '@reduxjs/toolkit'


import auth from './authSlice'; // We need to register our slice here in our store as the store doesn't know that there's any slice out there. So import it and pass it inside the reducer.

export const store = configureStore({
  reducer: {
    auth, // Now our store knows that we have a slice named auth
  },
})