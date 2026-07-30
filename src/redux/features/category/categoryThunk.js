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
// Thunk: Get All Categories (Admin Panel)
// ==========================================
export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, thunkAPI) => {
    return await fetchWithAuth("/categories/admin", { method: "GET" }, thunkAPI);
  }
);

// ==========================================
// Thunk: Get All Categories (Public/Web)
// ==========================================
export const getCategoriesPublic = createAsyncThunk(
  "category/getCategoriesPublic",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/categories`);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || "Failed to load categories" });
    }
  }
);

// ==========================================
// Thunk: Get Single Category (Public)
// ==========================================
export const getSingleCategory = createAsyncThunk(
  "category/getSingleCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/categories/${categoryId}`);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || "Failed to load category details" });
    }
  }
);

// ==========================================
// Thunk: Get Single Category (Admin)
// ==========================================
export const getSingleAdminCategory = createAsyncThunk(
  "category/getSingleAdminCategory",
  async (categoryId, thunkAPI) => {
    return await fetchWithAuth(`/categories/admin/${categoryId}`, { method: "GET" }, thunkAPI);
  }
);

// ==========================================
// Thunk: Create Category (Admin)
// ==========================================
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (formData, thunkAPI) => {
    // Note: Do not manually set Content-Type header when passing FormData,
    // the browser needs to set it automatically with the boundary parameter.
    return await fetchWithAuth(
      "/categories/create",
      {
        method: "POST",
        body: formData,
      },
      thunkAPI
    );
  }
);

// ==========================================
// Thunk: Update Category (Admin)
// ==========================================
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ categoryId, formData }, thunkAPI) => {
    // Note: Do not manually set Content-Type header when passing FormData.
    return await fetchWithAuth(
      `/categories/update/${categoryId}`,
      {
        method: "PUT",
        body: formData,
      },
      thunkAPI
    );
  }
);
