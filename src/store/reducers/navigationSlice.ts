import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { type RootState } from '../store'


// Define a type for the slice state
interface NavigationState {
  sidebarOpen: boolean
}

// Define the initial state using that type
const initialState: NavigationState = {
  sidebarOpen: true
}

export const navigationSlice = createSlice({
  name: 'navigation',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSideBarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    }
  }
})

export const { setSideBarOpen } = navigationSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectSideBarOpen = (state: RootState) => state.navigation.sidebarOpen

export default navigationSlice.reducer