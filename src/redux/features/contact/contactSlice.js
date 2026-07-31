import { createSlice } from "@reduxjs/toolkit";
import {
  createContact,
  getAllContacts,
  getSingleContact,
  updateContactStatus,
  deleteContact,
} from "./contactThunk";

const initialState = {
  contacts: [],
  contact: null,
  isLoading: false,
  error: null,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearContact: (state) => {
      state.contact = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createContact
      .addCase(createContact.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createContact.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to create contact";
      })
      // getAllContacts
      .addCase(getAllContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = action.payload.contacts || [];
        state.error = null;
      })
      .addCase(getAllContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch contacts";
      })
      // getSingleContact
      .addCase(getSingleContact.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSingleContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contact = action.payload.data;
        state.error = null;
      })
      .addCase(getSingleContact.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch contact details";
      })
      // updateContactStatus
      .addCase(updateContactStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedContact = action.payload.data;
        state.contacts = state.contacts.map((c) =>
          c._id === updatedContact._id ? updatedContact : c
        );
        if (state.contact && state.contact._id === updatedContact._id) {
          state.contact = updatedContact;
        }
        state.error = null;
      })
      .addCase(updateContactStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update contact status";
      })
      // deleteContact
      .addCase(deleteContact.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.isLoading = false;
        // The backend marks as isDeleted: true instead of actual deletion from array
        // We will remove it from the list for simplicity in UI
        const contactId = action.meta.arg;
        state.contacts = state.contacts.filter((c) => c._id !== contactId);
        if (state.contact && state.contact._id === contactId) {
          state.contact = null;
        }
        state.error = null;
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to delete contact";
      });
  },
});

export const { clearError, clearContact } = contactSlice.actions;

export default contactSlice.reducer;
