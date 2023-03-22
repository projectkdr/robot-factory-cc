import { configureStore } from "@reduxjs/toolkit"
import robotSlice from './slices/robotSlice'

export type AppGetState = typeof store.getState
export type RootState = ReturnType<AppGetState>
export type AppDispatch = typeof store.dispatch

const store = configureStore({
  reducer: {
    robots: robotSlice,
  }
})

export default store