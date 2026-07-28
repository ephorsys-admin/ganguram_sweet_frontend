import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

import storageModule from "redux-persist/lib/storage";
import rootReducer from "./rootReducer";
import { adminApi } from "./services/adminApi";

// Fix for Vite/ESM import issue
const storage = storageModule.default || storageModule;

// =============================================
// Persist Configuration
// =============================================

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

// =============================================
// Persist Reducer
// =============================================

const persistedReducer = persistReducer(persistConfig, rootReducer);

// =============================================
// Configure Redux Store
// =============================================

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(adminApi.middleware),
});

// =============================================
// Persistor
// =============================================

export const persistor = persistStore(store);
