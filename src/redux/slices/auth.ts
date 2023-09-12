import { createSlice } from "@reduxjs/toolkit";

interface Data {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    access_token: string;
    expires_in: number;
    created_at: string;
    updated_at: string;
  };
}

interface InitialState {
  data: Data | null;
}
const initialState: InitialState = {
  data: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const data = action.payload;
      localStorage.setItem("user", JSON.stringify(data));

      state.data = data;
    },

    logOut: (state) => {
      localStorage.setItem("user", JSON.stringify({}));
      state.data = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectAuthData = (state: { auth: InitialState }) =>
  state.auth.data;

export const selectCurrentToken = (state: { auth: InitialState }) =>
  state.auth.data?.token;
