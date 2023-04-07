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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch