import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5500/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  let shouldRefresh = result.error && result.error.status === 401;
  if (result.error && result.error.status === 500) {
    const errorMsg = result.error.data?.message || "";
    if (errorMsg === "jwt expired" || errorMsg.toLowerCase().includes("jwt")) {
      shouldRefresh = true;
    }
  }

  if (shouldRefresh) {
    // Automatically trigger refresh token flow
    const refreshResult = await baseQuery(
      {
        url: "/admin/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data && refreshResult.data.success) {
      // Store the new credentials
      api.dispatch(setCredentials(refreshResult.data));
      // Retry the original request with new credentials
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, clean up auth credentials
      api.dispatch(logOut());
    }
  }

  return result;
};

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["AdminProfile", "Category", "Product"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/admin/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (details) => ({
        url: "/admin/register",
        method: "POST",
        body: details,
      }),
    }),
    profile: builder.query({
      query: () => "/admin/profile",
      providesTags: ["AdminProfile"],
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/admin/forgot-password",
        method: "POST",
        body,
      }),
    }),
    verifyForgotOtp: builder.mutation({
      query: (body) => ({
        url: "/admin/verify-forgot-otp",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/admin/reset-password",
        method: "POST",
        body,
      }),
    }),
    getCategories: builder.query({
      query: () => "/categories/admin",
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (formData) => ({
        url: "/categories/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: ({ categoryId, formData }) => ({
        url: `/categories/update/${categoryId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),
    getProducts: builder.query({
      query: () => "/product/admin",
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation({
      query: (formData) => ({
        url: "/product/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ productId, body }) => ({
        url: `/product/update/${productId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/product/delete/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    addProductImage: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `/product/${productId}/images`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProductImage: builder.mutation({
      query: ({ productId, publicId }) => ({
        url: `/product/${productId}/images`,
        method: "DELETE",
        body: { publicId },
      }),
      invalidatesTags: ["Product"],
    }),
    getCategoriesPublic: builder.query({
      query: () => "/categories",
      providesTags: ["Category"],
    }),
    getProductsPublic: builder.query({
      query: (params) => ({
        url: "/product",
        params,
      }),
      providesTags: ["Product"],
    }),
    getProductDetailsPublic: builder.query({
      query: (productId) => `/product/${productId}`,
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useProfileQuery,
  useForgotPasswordMutation,
  useVerifyForgotOtpMutation,
  useResetPasswordMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddProductImageMutation,
  useDeleteProductImageMutation,
  useGetCategoriesPublicQuery,
  useGetProductsPublicQuery,
  useGetProductDetailsPublicQuery,
} = adminApi;
