import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import { adminApi } from "./services/adminApi";

const rootReducer = combineReducers({
  auth: authReducer,
  [adminApi.reducerPath]: adminApi.reducer,
});

export default rootReducer;