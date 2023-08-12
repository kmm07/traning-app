import { createSlice } from '@reduxjs/toolkit'

interface Data {
  id: 1
  name: string
  email: string
  access_token: string
  expires_in: number
}

interface InitialState {
  data: Data | null
}
const initialState: InitialState = {
  data: null
}
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const data = action.payload
      localStorage.setItem('user', JSON.stringify(data))

      state.data = data
    },

    logOut: (state) => {
      localStorage.setItem('user', JSON.stringify({}))
      state.data = null
    }
  }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: {
  auth: {
    data: Data | null
  }
}) => state.auth.data

export const selectAuthData = (state: { auth: Data }) => state.auth

export const selectCurrentToken = (state: { auth: { data: Data | null } }) =>
  state.auth.data?.access_token
