import { createSlice } from "@reduxjs/toolkit";
import {
  getBills,
  getSingleBill,
  createWalkinBill,
  createOrderBill,
  deleteBill,
} from "./billThunk";

const initialState = {
  bills: [],
  pagination: null,
  currentBill: null,
  isLoading: false,
  error: null,
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    clearBillError: (state) => {
      state.error = null;
    },
    clearCurrentBill: (state) => {
      state.currentBill = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getBills
      .addCase(getBills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bills = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
        state.error = null;
      })
      .addCase(getBills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load bills";
      })

      // getSingleBill
      .addCase(getSingleBill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSingleBill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBill = action.payload.data || null;
        state.error = null;
      })
      .addCase(getSingleBill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load bill details";
      })

      // createWalkinBill
      .addCase(createWalkinBill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createWalkinBill.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.bills.unshift(action.payload.data);
        }
        state.error = null;
      })
      .addCase(createWalkinBill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to generate bill";
      })

      // createOrderBill
      .addCase(createOrderBill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrderBill.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.bills.unshift(action.payload.data);
        }
        state.error = null;
      })
      .addCase(createOrderBill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to generate order bill";
      })

      // deleteBill
      .addCase(deleteBill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.meta.arg;
        state.bills = state.bills.filter((b) => b._id !== deletedId);
        if (state.currentBill && state.currentBill._id === deletedId) {
          state.currentBill = null;
        }
        state.error = null;
      })
      .addCase(deleteBill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to delete bill";
      });
  },
});

export const { clearBillError, clearCurrentBill } = billSlice.actions;

export default billSlice.reducer;
