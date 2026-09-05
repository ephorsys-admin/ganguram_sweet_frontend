import { createSlice } from "@reduxjs/toolkit";
import { getDashboardStats } from "./dashboardThunk";

const initialState = {
  stats: null,
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data || null;
        state.error = null;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load dashboard statistics";
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;

export default dashboardSlice.reducer;
