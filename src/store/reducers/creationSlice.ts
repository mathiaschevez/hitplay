import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'
import { type Playlist, type Track } from '~/utils/types'

interface CreationState {
  selectedTracks: Track[],
  selectedPlaylist: Playlist | null
}

const initialState: CreationState = {
  selectedTracks: [],
  selectedPlaylist: null
}

export const creationSlice = createSlice({
  name: 'creation',
  initialState,
  reducers: {
    addSelectedTrack: (state, action: PayloadAction<Track>) => {
      state.selectedTracks.push(action.payload)
    },
    addMultipleTracks(state, action: PayloadAction<Track[]>) {
      state.selectedTracks = [...state.selectedTracks, ...action.payload]
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

export const { 
  addSelectedTrack, removeSelectedTrack, clearSelectedTracks, 
  setSelectedPlaylist, clearSelectedPlaylist, addMultipleTracks
} = creationSlice.actions

export const selectSelectedTracks = (state: RootState) => state.creation.selectedTracks
export const selectSelectedPlaylist = (state: RootState) => state.creation.selectedPlaylist

export default creationSlice.reducer