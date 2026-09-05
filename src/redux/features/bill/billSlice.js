import { createSlice } from "@reduxjs/toolkit";
import {
  getBills,
  getBillsForStats,
  getSingleBill,
  createWalkinBill,
  createOrderBill,
  getCustomerSummary,
} from "./billThunk";

const initialState = {
  bills: [],
  pagination: null,
  currentBill: null,
  isLoading: false,
  error: null,
  customerSummary: null,
  customerSummaryLoading: false,
  statsBills: [],
  statsLoading: false,
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
    clearCustomerSummary: (state) => {
      state.customerSummary = null;
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

      // getBillsForStats
      .addCase(getBillsForStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(getBillsForStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.statsBills = action.payload.data || [];
        state.error = null;
      })
      .addCase(getBillsForStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload?.message || "Failed to load stats bills";
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

      // getCustomerSummary
      .addCase(getCustomerSummary.pending, (state) => {
        state.customerSummaryLoading = true;
        state.error = null;
      })
      .addCase(getCustomerSummary.fulfilled, (state, action) => {
        state.customerSummaryLoading = false;
        state.customerSummary = action.payload.data || null;
        state.error = null;
      })
      .addCase(getCustomerSummary.rejected, (state, action) => {
        state.customerSummaryLoading = false;
        state.error = action.payload?.message || "Failed to load customer summary";
      });
  },
});

export const { clearBillError, clearCurrentBill, clearCustomerSummary } = billSlice.actions;

export default billSlice.reducer;
