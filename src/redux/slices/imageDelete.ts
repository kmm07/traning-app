import { createSlice } from '@reduxjs/toolkit'

const imageDeleteSlice = createSlice({
  name: 'imageDelete',
  initialState: { isImageDelete: false },
  reducers: {
    setImageDelete: (state, action) => {
      state.isImageDelete = action.payload
    }
  }
})

export const { setImageDelete } = imageDeleteSlice.actions

export const selectIsImageDelete = (state: {
  imageDelete: { isImageDelete: boolean }
}) => state.imageDelete.isImageDelete

export default imageDeleteSlice.reducer
