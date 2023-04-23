import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'

interface NavigationState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
}

// Define the initial state using that type
const initialState: NavigationState = {
  sidebarOpen: true,
  theme: 'dark'
}

export const navigationSlice = createSlice({
  name: 'navigation',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSideBarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
  }
})

export const { setSideBarOpen, setTheme } = navigationSlice.actions

export const selectSideBarOpen = (state: RootState) => state.navigation.sidebarOpen
export const selectTheme = (state: RootState) => state.navigation.theme

export default navigationSlice.reducer