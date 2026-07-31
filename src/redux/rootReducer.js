import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import categoryReducer from "./features/category/categorySlice";
import productReducer from "./features/product/productSlice";
import orderReducer from "./features/order/orderSlice";
import billReducer from "./features/bill/billSlice";
import { adminApi } from "./services/adminApi";

import contactReducer from "./features/contact/contactSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  product: productReducer,
  order: orderReducer,
  bill: billReducer,
  contact: contactReducer,
  [adminApi.reducerPath]: adminApi.reducer,
});

export default rootReducer;