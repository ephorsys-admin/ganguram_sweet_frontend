import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5501/api/v1";

// ==========================================================
// Helper: Authenticated Fetch with transparent token refresh
// ==========================================================
async function fetchWithAuth(url, options = {}, { getState, dispatch, rejectWithValue }) {
  const { token } = getState().auth;
  const headers = { ...options.headers };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    let response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // Check status 401, or status 500 containing JWT expired error message
    let shouldRefresh = response.status === 401;
    if (response.status === 500) {
      try {
        const responseClone = response.clone();
        const errorData = await responseClone.json();
        if (errorData && (errorData.message === "jwt expired" || errorData.message?.toLowerCase().includes("jwt"))) {
          shouldRefresh = true;
        }
      } catch (e) {
        // Ignore parsing error
      }
    }

    if (shouldRefresh) {
      const refreshResponse = await fetch(`${BASE_URL}/admin/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        dispatch({ type: "auth/setCredentials", payload: refreshData });

        const retryHeaders = {
          ...options.headers,
          "Authorization": `Bearer ${refreshData.accessToken}`,
        };
        response = await fetch(`${BASE_URL}${url}`, {
          ...options,
          headers: retryHeaders,
        });
      } else {
        dispatch({ type: "auth/logOut" });
        return rejectWithValue({ message: "Session expired" });
      }
    }

    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data);
    }
    return data;
  } catch (error) {
    return rejectWithValue({ message: error.message || "Something went wrong" });
  }
}

// ==========================================
// Thunk: Get All Orders (Admin Panel)
// ==========================================
export const getOrders = createAsyncThunk(
  "order/getOrders",
  async (params, thunkAPI) => {
    let queryString = "";
    if (params) {
      const urlParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          urlParams.append(key, value);
        }
      });
      const query = urlParams.toString();
      if (query) {
        queryString = `?${query}`;
      }
    }
    return await fetchWithAuth(`/order/admin/all${queryString}`, { method: "GET" }, thunkAPI);
  }
);

// ==========================================
// Thunk: Get Single Order Details (Admin)
// ==========================================
export const getSingleOrder = createAsyncThunk(
  "order/getSingleOrder",
  async (orderId, thunkAPI) => {
    return await fetchWithAuth(`/order/admin/${orderId}`, { method: "GET" }, thunkAPI);
  }
);

// ==========================================
// Thunk: Create Order (Admin)
// ==========================================
export const createAdminOrder = createAsyncThunk(
  "order/createAdminOrder",
  async (orderBody, thunkAPI) => {
    return await fetchWithAuth(
      "/order/admin/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderBody),
      },
      thunkAPI
    );
  }
);

// ==========================================
// Thunk: Update Order Status (Admin)
// ==========================================
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, orderStatus }, thunkAPI) => {
    return await fetchWithAuth(
      `/order/admin/status/${orderId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus }),
      },
      thunkAPI
    );
  }
);

// ==========================================
// Thunk: Request Delete Order (Admin)
// ==========================================
export const deleteOrderRequest = createAsyncThunk(
  "order/deleteOrderRequest",
  async ({ orderId, reason }, thunkAPI) => {
    return await fetchWithAuth(
      "/order/admin/delete-request",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, reason }),
      },
      thunkAPI
    );
  }
);

// ==========================================
// Thunk: Generate Invoice (Admin)
// ==========================================
export const generateInvoice = createAsyncThunk(
  "order/generateInvoice",
  async (orderId, thunkAPI) => {
    return await fetchWithAuth(
      `/order/admin/${orderId}/generate-invoice`,
      {
        method: "POST",
      },
      thunkAPI
    );
  }
);
