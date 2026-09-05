import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBackendCart,
  addBackendCartItem,
  updateBackendCartItem,
  removeBackendCartItem,
  clearBackendCart,
} from "./cartThunk";

const recalculateTotals = (state) => {
  let totalQty = 0;
  let totalAmt = 0;

  for (const item of state.items) {
    totalQty += Number(item.quantity || 0);
    totalAmt += Number(item.price || 0) * Number(item.quantity || 0);
  }

  state.totalQuantity = totalQty;
  state.totalAmount = Math.round(totalAmt * 100) / 100;
};

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  isCartOpen: false,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const payload = action.payload;
      const product = payload.product || payload;
      const qtyToAdd = Number(payload.quantity || 1);

      const productId = product._id || product.id || product.productId;
      if (!productId) return;

      const existingIndex = state.items.findIndex(
        (item) => item.id === productId
      );

      const maxStock = typeof product.stock === "number" ? product.stock : 999;
      const price = Number(product.sellingPrice || product.price || 0);
      const mrp = Number(product.mrp || price);

      const primaryImage =
        product.image ||
        product.images?.find((img) => img.isPrimary)?.url ||
        product.images?.[0]?.url ||
        "";

      if (existingIndex > -1) {
        const currentQty = state.items[existingIndex].quantity;
        const newQty = Math.min(currentQty + qtyToAdd, maxStock);
        state.items[existingIndex].quantity = newQty;
        state.items[existingIndex].price = price;
        state.items[existingIndex].stock = maxStock;
      } else {
        const initialQty = Math.min(qtyToAdd, maxStock);
        state.items.push({
          id: productId,
          name: product.name || "Sweet",
          slug: product.slug || "",
          price,
          mrp,
          image: primaryImage,
          unit: product.unit || "Piece",
          weight: product.weight || "",
          weightUnit: product.weightUnit || "",
          stock: maxStock,
          isAvailable: product.isAvailable !== false,
          quantity: initialQty > 0 ? initialQty : 1,
        });
      }

      recalculateTotals(state);
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const targetQty = Number(quantity);

      if (targetQty <= 0) {
        state.items = state.items.filter((item) => item.id !== productId);
      } else {
        const item = state.items.find((i) => i.id === productId);
        if (item) {
          const maxStock = typeof item.stock === "number" ? item.stock : 999;
          item.quantity = Math.min(targetQty, maxStock);
        }
      }

      recalculateTotals(state);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      recalculateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },

    openCart: (state) => {
      state.isCartOpen = true;
    },

    closeCart: (state) => {
      state.isCartOpen = false;
    },

    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch backend cart
      .addCase(fetchBackendCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBackendCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && Array.isArray(action.payload.items)) {
          // If backend has items, sync with state
          if (action.payload.items.length > 0) {
            state.items = action.payload.items.map((it) => ({
              id: it.productId,
              name: it.name,
              slug: it.slug,
              price: it.price,
              mrp: it.mrp,
              image: it.image,
              unit: it.unit,
              weight: it.weight,
              weightUnit: it.weightUnit,
              stock: it.stock,
              isAvailable: it.isAvailable,
              quantity: it.quantity,
            }));
            recalculateTotals(state);
          }
        }
      })
      .addCase(fetchBackendCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch cart";
      })

      // Backend Add item
      .addCase(addBackendCartItem.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload.items)) {
          state.items = action.payload.items.map((it) => ({
            id: it.productId,
            name: it.name,
            slug: it.slug,
            price: it.price,
            mrp: it.mrp,
            image: it.image,
            unit: it.unit,
            weight: it.weight,
            weightUnit: it.weightUnit,
            stock: it.stock,
            isAvailable: it.isAvailable,
            quantity: it.quantity,
          }));
          recalculateTotals(state);
        }
      })

      // Backend Clear cart
      .addCase(clearBackendCart.fulfilled, (state) => {
        state.items = [];
        state.totalQuantity = 0;
        state.totalAmount = 0;
      });
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
} = cartSlice.actions;

export default cartSlice.reducer;
