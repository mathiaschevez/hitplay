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
  initialState,
  reducers: {
    setAiRecommendedTracks: (state, action: PayloadAction<{ title: string, artist: string }[]>) => {
      console.log(action.payload, 'HERE IS THE PAYLOAD ACTION')
      state.recommendedTracks = action.payload
    }
  }
})

export const { setAiRecommendedTracks } = aiSlice.actions

export const selectAiRecommendedTracks = (state: RootState) => state.ai.recommendedTracks

export default aiSlice.reducer