import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'
import { type Playlist, type Track } from '~/utils/types'


// Define a type for the slice state
interface CreationState {
  selectedTracks: Track[],
  selectedPlaylist: Playlist | null
}

// Define the initial state using that type
const initialState: CreationState = {
  selectedTracks: [],
  selectedPlaylist: null
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
    },
    setSelectedPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.selectedPlaylist = action.payload
    },
    clearSelectedPlaylist: (state) => {
      state.selectedPlaylist = null
    }
  }
})

export const { addSelectedTrack, removeSelectedTrack, clearSelectedTracks, setSelectedPlaylist, clearSelectedPlaylist } = creationSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectSelectedTracks = (state: RootState) => state.creation.selectedTracks
export const selectSelectedPlaylist = (state: RootState) => state.creation.selectedPlaylist

export default creationSlice.reducer