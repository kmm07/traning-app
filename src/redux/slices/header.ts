import { createSlice } from '@reduxjs/toolkit'

const headerSlice = createSlice({
  name: 'header',
  initialState: { label: null },
  reducers: {
    setHeader: (state, action) => {
      state.label = action.payload
    }
  }
})

export const { setHeader } = headerSlice.actions

export const selectHeader = (state: { header: { label: string | null } }) =>
  state.header.label

export default headerSlice.reducer
