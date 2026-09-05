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
// Thunk: Get All Products (Admin Panel)
// ==========================================
export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (_, thunkAPI) => {
    return await fetchWithAuth("/product/admin", { method: "GET" }, thunkAPI);
  }
);

// ==========================================
// Thunk: Get All Products (Public/Web)
// ==========================================
export const getProductsPublic = createAsyncThunk(
  "product/getProductsPublic",
  async (params, { rejectWithValue }) => {
    try {
      let queryString = "";
      if (params) {
        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            urlParams.append(key, value);
          }
        });
        const query = urlParams.toString();
        if (query) {
          queryString = `?${query}`;
        }
      }
      const response = await fetch(`${BASE_URL}/product${queryString}`);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || "Failed to load products" });
    }
  }
);

// ==========================================
// Thunk: Get Single Product details (Public)
// ==========================================
export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/product/${productId}`);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || "Failed to load product details" });
    }
  }
);

// ==========================================
// Thunk: Get Single Product details (Admin)
// ==========================================
export const getAdminProductById = createAsyncThunk(
  "product/getAdminProductById",
  async (productId, thunkAPI) => {
    return await fetchWithAuth(`/product/admin/${productId}`, { method: "GET" }, thunkAPI);
  }
);

// ==========================================
// Thunk: Create Product (Admin)
// ==========================================
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (formData, thunkAPI) => {
    // Note: Do not set Content-Type header manually when sending FormData,
    // the browser needs to set it automatically with the boundary parameter.
    return await fetchWithAuth(
      "/product/create",
      {
        method: "POST",
        body: formData,
      },
      thunkAPI
    );
  }
);

// ==========================================
// Thunk: Update Product Details (Admin)
// ==========================================
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ productId, body }, thunkAPI) => {
    return await fetchWithAuth(
      `/product/update/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
      thunkAPI
    );
  }
);

// ==========================================
// Thunk: Delete Product (Soft Delete - Admin)
// ==========================================
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, thunkAPI) => {
    return await fetchWithAuth(
      `/product/delete/${productId}`,
      {
        method: "DELETE",
      },
      thunkAPI
    );
  }
);

// ==========================================
// Thunk: Add Product Images (Admin)
// ==========================================
export const addProductImage = createAsyncThunk(
  "product/addProductImage",
  async ({ productId, formData }, thunkAPI) => {
    return await fetchWithAuth(
      `/product/${productId}/images`,
      {
        method: "POST",
        body: formData,
      },
      thunkAPI
    );
  }
);

// ==========================================
// Thunk: Delete Product Image (Admin)
// ==========================================
export const deleteProductImage = createAsyncThunk(
  "product/deleteProductImage",
  async ({ productId, publicId }, thunkAPI) => {
    return await fetchWithAuth(
      `/product/${productId}/images`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId }),
      },
      thunkAPI
    );
  }
);
