import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/auth'
import headerSlice from './slices/header'
import imageDeleteSlice from './slices/imageDelete'
import coachContextSlice from './slices/coachContext'

import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'

export const store: ToolkitStore = configureStore({
  reducer: {
    auth: authSlice,
    header: headerSlice,
    imageDelete: imageDeleteSlice,
    coachContext: coachContextSlice
  },
  devTools: true
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
