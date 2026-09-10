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
    /** دلالتُها منذ ٧ سبتمبر ٢٠٢٦: **مديرٌ أعلى**. الاسم منشورٌ فبقي. */
    is_admin: boolean;
    is_super: boolean;
    /** مفاتيحُ الأقسام المسموحة — يرسم بها الشريطُ الجانبيّ نفسه. */
    permissions: string[];
    /** مفتاحُ القسم => تسميتُه العربية، من سجلّ الخادم لا مكتوبةً هنا. */
    sections: Record<string, string>;
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
      localStorage.setItem("userLogin", JSON.stringify(data));

      state.data = data;
    },

    logOut: (state) => {
      localStorage.setItem("userLogin", JSON.stringify({}));
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
