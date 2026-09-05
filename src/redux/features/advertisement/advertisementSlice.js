import { createSlice } from "@reduxjs/toolkit";
import {
  getAdvertisements,
  getSingleAdvertisement,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  getPublicAdvertisements,
} from "./advertisementThunk";

const initialState = {
  advertisements: [],
  currentAdvertisement: null,
  isLoading: false,
  error: null,
};

const advertisementSlice = createSlice({
  name: "advertisement",
  initialState,
  reducers: {
    clearAdvertisementError: (state) => {
      state.error = null;
    },
    clearCurrentAdvertisement: (state) => {
      state.currentAdvertisement = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAdvertisements (Admin)
      .addCase(getAdvertisements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAdvertisements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.advertisements = action.payload.data || [];
        state.error = null;
      })
      .addCase(getAdvertisements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load advertisements";
      })

      // getSingleAdvertisement (Admin)
      .addCase(getSingleAdvertisement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSingleAdvertisement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAdvertisement = action.payload.data || null;
        state.error = null;
      })
      .addCase(getSingleAdvertisement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load advertisement details";
      })

      // createAdvertisement
      .addCase(createAdvertisement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAdvertisement.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.advertisements = [action.payload.data, ...state.advertisements];
        }
        state.error = null;
      })
      .addCase(createAdvertisement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to create advertisement";
      })

      // updateAdvertisement
      .addCase(updateAdvertisement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAdvertisement.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedAd = action.payload.data;
        if (updatedAd) {
          state.advertisements = state.advertisements.map((ad) =>
            ad._id === updatedAd._id ? updatedAd : ad
          );
        }
        state.error = null;
      })
      .addCase(updateAdvertisement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update advertisement";
      })

      // deleteAdvertisement
      .addCase(deleteAdvertisement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAdvertisement.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.meta.arg; // The advertisementId passed to the thunk
        state.advertisements = state.advertisements.filter((ad) => ad._id !== deletedId);
        state.error = null;
      })
      .addCase(deleteAdvertisement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to delete advertisement";
      })

      // getPublicAdvertisements
      .addCase(getPublicAdvertisements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPublicAdvertisements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.advertisements = action.payload.data || [];
        state.error = null;
      })
      .addCase(getPublicAdvertisements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load public advertisements";
      });
  },
});

export const { clearAdvertisementError, clearCurrentAdvertisement } = advertisementSlice.actions;

export default advertisementSlice.reducer;
