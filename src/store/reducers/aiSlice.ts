import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'


// Define a type for the slice state
interface NavigationState {
  recommendedTracks: { title: string, artist: string }[]
}

// Define the initial state using that type
const initialState: NavigationState = {
  recommendedTracks: []
}

export const aiSlice = createSlice({
  name: 'ai',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRecommendedTracks: (state, action: PayloadAction<{ title: string, artist: string }[]>) => {
      state.recommendedTracks = action.payload
    }
  }
})

export const { setRecommendedTracks } = aiSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectedRecommendedTracks = (state: RootState) => state.ai.recommendedTracks

export default aiSlice.reducer