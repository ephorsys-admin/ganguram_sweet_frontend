import { createSlice } from "@reduxjs/toolkit";
import {
  getOrders,
  getSingleOrder,
  createAdminOrder,
  updateOrderStatus,
  deleteOrderRequest,
  generateInvoice,
  getAllDeleteRequests,
  approveDeleteRequest,
  rejectDeleteRequest,
  createPublicOrder,
} from "./orderThunk";

const initialState = {
  orders: [],
  pagination: null,
  currentOrder: null,
  deleteRequests: [],
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getOrders
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders || [];
        state.pagination = action.payload.pagination || null;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load orders";
      })

      // getSingleOrder
      .addCase(getSingleOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSingleOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload.data || null;
        state.error = null;
      })
      .addCase(getSingleOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load order details";
      })

      // createAdminOrder
      .addCase(createAdminOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAdminOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.orders.unshift(action.payload.data);
        }
        state.error = null;
      })
      .addCase(createAdminOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to create order";
      })

      // updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload.data;
        if (updatedOrder) {
          state.orders = state.orders.map((o) =>
            o._id === updatedOrder._id ? updatedOrder : o
          );
          if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
            state.currentOrder = updatedOrder;
          }
        }
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update order status";
      })

      // deleteOrderRequest
      .addCase(deleteOrderRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteOrderRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteOrderRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to submit delete request";
      })

      // generateInvoice
      .addCase(generateInvoice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateInvoice.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload.data;
        if (updatedOrder) {
          state.orders = state.orders.map((o) =>
            o._id === updatedOrder._id ? updatedOrder : o
          );
          if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
            state.currentOrder = updatedOrder;
          }
        }
        state.error = null;
      })
      .addCase(generateInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to generate invoice";
      })

      // getAllDeleteRequests
      .addCase(getAllDeleteRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllDeleteRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteRequests = action.payload.data || [];
        state.error = null;
      })
      .addCase(getAllDeleteRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to get delete requests";
      })

      // approveDeleteRequest
      .addCase(approveDeleteRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(approveDeleteRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const approvedRequest = action.payload.data;
        if (approvedRequest) {
          state.deleteRequests = state.deleteRequests.filter(
            (r) => r._id !== approvedRequest._id
          );
          state.orders = state.orders.filter(
            (o) => o._id !== approvedRequest.itemId
          );
          if (state.currentOrder && state.currentOrder._id === approvedRequest.itemId) {
            state.currentOrder = null;
          }
        }
        state.error = null;
      })
      .addCase(approveDeleteRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to approve delete request";
      })

      // rejectDeleteRequest
      .addCase(rejectDeleteRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectDeleteRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const rejectedRequest = action.payload.data;
        if (rejectedRequest) {
          state.deleteRequests = state.deleteRequests.filter(
            (r) => r._id !== rejectedRequest._id
          );
        }
        state.error = null;
      })
      .addCase(rejectDeleteRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to reject delete request";
      })

      // createPublicOrder
      .addCase(createPublicOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPublicOrder.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createPublicOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to place order inquiry";
      });
  },
});

export const { clearOrderError, clearCurrentOrder } = orderSlice.actions;

export default orderSlice.reducer;
