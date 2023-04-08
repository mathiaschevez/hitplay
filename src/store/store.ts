import { configureStore } from '@reduxjs/toolkit'
import navigationSlice from './reducers/navigationSlice'
import creationSlice from './reducers/creationSlice'
import aiSlice from './reducers/aiSlice'

export const store = configureStore({
  reducer: {
    navigation: navigationSlice,
    creation: creationSlice,
    ai: aiSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch