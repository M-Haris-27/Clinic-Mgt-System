import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Stores user info
  isAuthenticated: false, // Tracks login status
  loading: true, // Indicates if the app is restoring authentication state
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    restoreAuthStart: (state) => {
      state.loading = true;
    },
    restoreAuthSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    restoreAuthFailure: (state) => {
      state.loading = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, restoreAuthStart, restoreAuthSuccess, restoreAuthFailure } = authSlice.actions;
export default authSlice.reducer;