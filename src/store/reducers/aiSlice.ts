import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'
import { type Track } from '~/utils/types'



// Define a type for the slice state
interface NavigationState {
  recommendedTracks: Track[]
}

// Define the initial state using that type
const initialState: NavigationState = {
  recommendedTracks: []
}

export const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setAiRecommendedTracks: (state, action: PayloadAction<Track[]>) => {
      state.recommendedTracks = action.payload
    },
    removeAiRecommendedTracks: (state) => {
      state.recommendedTracks = []
    }
  }
})

export const { setAiRecommendedTracks, removeAiRecommendedTracks } = aiSlice.actions

export const selectAiRecommendedTracks = (state: RootState) => state.ai.recommendedTracks

export default aiSlice.reducer