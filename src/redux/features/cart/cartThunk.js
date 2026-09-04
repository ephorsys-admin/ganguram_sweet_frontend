import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5501/api/v1";

export const getOrCreateSessionId = () => {
  try {
    let sessionId = localStorage.getItem("ganguram_cart_session_id");
    if (!sessionId) {
      sessionId =
        "sess_" +
        Math.random().toString(36).substring(2, 10) +
        "_" +
        Date.now().toString(36);
      localStorage.setItem("ganguram_cart_session_id", sessionId);
    }
    return sessionId;
  } catch (e) {
    return "sess_fallback_" + Date.now();
  }
};

const getHeaders = () => {
  return {
    "Content-Type": "application/json",
    "x-session-id": getOrCreateSessionId(),
  };
};

export const fetchBackendCart = createAsyncThunk(
  "cart/fetchBackendCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart`, {
        method: "GET",
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data.data;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

export const addBackendCartItem = createAsyncThunk(
  "cart/addBackendCartItem",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data.data;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

export const updateBackendCartItem = createAsyncThunk(
  "cart/updateBackendCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/item`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data.data;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

export const removeBackendCartItem = createAsyncThunk(
  "cart/removeBackendCartItem",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/item/${productId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data.data;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);

export const clearBackendCart = createAsyncThunk(
  "cart/clearBackendCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/clear`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data.data;
    } catch (err) {
      return rejectWithValue({ message: err.message });
    }
  }
);
