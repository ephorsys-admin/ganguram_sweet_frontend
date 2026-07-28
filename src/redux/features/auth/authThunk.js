import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5501/api/v1";

// ==========================================
// Thunk: Login User
// ==========================================
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

// ==========================================
// Thunk: Get Profile (With Transparent Re-auth)
// ==========================================
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      let response = await fetch(`${BASE_URL}/admin/profile`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Handle transparent re-authentication if token expired (401)
      if (response.status === 401) {
        const refreshResponse = await fetch(`${BASE_URL}/admin/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          // Dispatch action directly by string type to avoid circular dependency
          dispatch({ type: "auth/setCredentials", payload: refreshData });

          // Retry with the new access token
          response = await fetch(`${BASE_URL}/admin/profile`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${refreshData.accessToken}`,
              "Content-Type": "application/json",
            },
          });
        } else {
          // Dispatch logout directly by string type
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
      return rejectWithValue({ message: error.message });
    }
  }
);

// ==========================================
// Thunk: Forgot Password
// ==========================================
export const forgotPasswordUser = createAsyncThunk(
  "auth/forgotPasswordUser",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

// ==========================================
// Thunk: Verify OTP
// ==========================================
export const verifyForgotOtpUser = createAsyncThunk(
  "auth/verifyForgotOtpUser",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/verify-forgot-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

// ==========================================
// Thunk: Reset Password
// ==========================================
export const resetPasswordUser = createAsyncThunk(
  "auth/resetPasswordUser",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);
