import { createSlice } from "@reduxjs/toolkit";
import {
  getProducts,
  getProductsPublic,
  getProductById,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  deleteProductImage,
} from "./productThunk";

const initialState = {
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getProducts (Admin)
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data || [];
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load products";
      })

      // getProductsPublic
      .addCase(getProductsPublic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductsPublic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data || [];
        state.error = null;
      })
      .addCase(getProductsPublic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load public products";
      })

      // getProductById (Public)
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.data || null;
        state.error = null;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load product details";
      })

      // getAdminProductById
      .addCase(getAdminProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAdminProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload.data || null;
        state.error = null;
      })
      .addCase(getAdminProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to load admin product details";
      })

      // createProduct
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.products.push(action.payload.data);
        }
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to create product";
      })

      // updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedProd = action.payload.data;
        if (updatedProd) {
          state.products = state.products.map((prod) =>
            prod._id === updatedProd._id ? updatedProd : prod
          );
          if (state.currentProduct && state.currentProduct._id === updatedProd._id) {
            state.currentProduct = updatedProd;
          }
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update product";
      })

      // deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        // The backend might return the deleted product or id. If we do soft delete:
        // We filter out the deleted product or set its status, let's filter it out.
        const deletedId = action.meta.arg; // action.meta.arg contains the productId passed to deleteProduct
        state.products = state.products.filter((prod) => prod._id !== deletedId);
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to delete product";
      })

      // addProductImage
      .addCase(addProductImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProductImage.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedProd = action.payload.data;
        if (updatedProd) {
          state.products = state.products.map((prod) =>
            prod._id === updatedProd._id ? updatedProd : prod
          );
          if (state.currentProduct && state.currentProduct._id === updatedProd._id) {
            state.currentProduct = updatedProd;
          }
        }
        state.error = null;
      })
      .addCase(addProductImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to add product image";
      })

      // deleteProductImage
      .addCase(deleteProductImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedProd = action.payload.data;
        if (updatedProd) {
          state.products = state.products.map((prod) =>
            prod._id === updatedProd._id ? updatedProd : prod
          );
          if (state.currentProduct && state.currentProduct._id === updatedProd._id) {
            state.currentProduct = updatedProd;
          }
        }
        state.error = null;
      })
      .addCase(deleteProductImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to delete product image";
      });
  },
});

export const { clearProductError, clearCurrentProduct } = productSlice.actions;

export default productSlice.reducer;
