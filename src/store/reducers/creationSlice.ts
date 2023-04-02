import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'
import { type Track } from '~/utils/types'


// Define a type for the slice state
interface CreationState {
  selectedTracks: Track[]
}

// Define the initial state using that type
const initialState: CreationState = {
  selectedTracks: []
}

export const creationSlice = createSlice({
  name: 'creation',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addSelectedTrack: (state, action: PayloadAction<Track>) => {
      state.selectedTracks.push(action.payload)
    },
    removeSelectedTrack: (state, action: PayloadAction<{trackId: string}>) => {
      state.selectedTracks = state.selectedTracks.filter(track => track.id !== action.payload.trackId)
    },
    clearSelectedTracks: (state) => {
      state.selectedTracks = []
    }
  }
})

export const { addSelectedTrack, removeSelectedTrack, clearSelectedTracks } = creationSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectSelectedTracks = (state: RootState) => state.creation.selectedTracks

export default creationSlice.reducer