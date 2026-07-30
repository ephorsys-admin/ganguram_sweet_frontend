import { createSlice } from "@reduxjs/toolkit";
import {
  getCategories,
  getCategoriesPublic,
  getSingleCategory,
  getSingleAdminCategory,
  createCategory,
  updateCategory,
} from "./categoryThunk";

const initialState = {
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getCategories (Admin)
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data || [];
        state.error = null;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load categories";
      })

      // getCategoriesPublic
      .addCase(getCategoriesPublic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoriesPublic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data || [];
        state.error = null;
      })
      .addCase(getCategoriesPublic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load public categories";
      })

      // getSingleCategory
      .addCase(getSingleCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSingleCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload.data || null;
        state.error = null;
      })
      .addCase(getSingleCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load category details";
      })

      // getSingleAdminCategory
      .addCase(getSingleAdminCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSingleAdminCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCategory = action.payload.data || null;
        state.error = null;
      })
      .addCase(getSingleAdminCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load admin category details";
      })

      // createCategory
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.categories.push(action.payload.data);
        }
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to create category";
      })

      // updateCategory
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedCat = action.payload.data;
        if (updatedCat) {
          state.categories = state.categories.map((cat) =>
            cat._id === updatedCat._id ? updatedCat : cat
          );
        }
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update category";
      });
  },
});

export const { clearCategoryError, clearCurrentCategory } = categorySlice.actions;

export default categorySlice.reducer;
