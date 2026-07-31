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

    if (response.status === 401) {
      return rejectWithValue({ message: "Session expired. Please log in again." });
    }

    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data);
    }
    return data;
  } catch (error) {
    return rejectWithValue({ message: error.message || "Network Error" });
  }
}

// ==========================================
// Thunk: Create Contact
// ==========================================
export const createContact = createAsyncThunk(
  "contact/createContact",
  async (contactData, thunkAPI) => {
    try {
      const response = await fetch(`${BASE_URL}/contact/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const data = await response.json();
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message || "Network Error" });
    }
  }
);

// ==========================================
// Thunk: Get All Contacts (Admin)
// ==========================================
export const getAllContacts = createAsyncThunk(
  "contact/getAllContacts",
  async (_, thunkAPI) => {
    return await fetchWithAuth("/contact/admin/all", { method: "GET" }, thunkAPI);
  }
);

// ==========================================
// Thunk: Get Single Contact (Admin)
// ==========================================
export const getSingleContact = createAsyncThunk(
  "contact/getSingleContact",
  async (contactId, thunkAPI) => {
    return await fetchWithAuth(`/contact/admin/${contactId}`, { method: "GET" }, thunkAPI);
  }
);

// ==========================================
// Thunk: Update Contact Status (Admin)
// ==========================================
export const updateContactStatus = createAsyncThunk(
  "contact/updateContactStatus",
  async ({ contactId, status }, thunkAPI) => {
    return await fetchWithAuth(
      `/contact/admin/status/${contactId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      },
      thunkAPI
    );
  }
);

// ==========================================
// Thunk: Delete Contact (Admin)
// ==========================================
export const deleteContact = createAsyncThunk(
  "contact/deleteContact",
  async (contactId, thunkAPI) => {
    return await fetchWithAuth(
      `/contact/admin/delete/${contactId}`,
      { method: "DELETE" },
      thunkAPI
    );
  }
);
