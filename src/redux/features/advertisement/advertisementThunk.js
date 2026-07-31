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
// Thunk: Get All Advertisements (Admin Panel)
// ==========================================
export const getAdvertisements = createAsyncThunk(
  "advertisement/getAdvertisements",
  async (_, thunkAPI) => {
    return await fetchWithAuth("/advertisement/admin/all", { method: "GET" }, thunkAPI);
  }
);

// ==========================================
// Thunk: Get Single Advertisement (Admin)
// ==========================================
export const getSingleAdvertisement = createAsyncThunk(
  "advertisement/getSingleAdvertisement",
  async (advertisementId, thunkAPI) => {
    return await fetchWithAuth(`/advertisement/admin/${advertisementId}`, { method: "GET" }, thunkAPI);
  }
);

// ==========================================
// Thunk: Create Advertisement (Admin)
// ==========================================
export const createAdvertisement = createAsyncThunk(
  "advertisement/createAdvertisement",
  async (formData, thunkAPI) => {
    return await fetchWithAuth(
      "/advertisement/create",
      {
        method: "POST",
        body: formData,
      },
      thunkAPI
    );
  }
);

// ==========================================
// Thunk: Update Advertisement (Admin)
// ==========================================
export const updateAdvertisement = createAsyncThunk(
  "advertisement/updateAdvertisement",
  async ({ advertisementId, formData }, thunkAPI) => {
    return await fetchWithAuth(
      `/advertisement/update/${advertisementId}`,
      {
        method: "PUT",
        body: formData,
      },
      thunkAPI
    );
  }
);

// ==========================================
// Thunk: Delete Advertisement (Admin)
// ==========================================
export const deleteAdvertisement = createAsyncThunk(
  "advertisement/deleteAdvertisement",
  async (advertisementId, thunkAPI) => {
    return await fetchWithAuth(
      `/advertisement/delete/${advertisementId}`,
      {
        method: "DELETE",
      },
      thunkAPI
    );
  }
);

// ==========================================
// Thunk: Get Public Advertisements (Public/Web)
// ==========================================
export const getPublicAdvertisements = createAsyncThunk(
  "advertisement/getPublicAdvertisements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/advertisement/public`);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || "Failed to load advertisements" });
    }
  }
);
