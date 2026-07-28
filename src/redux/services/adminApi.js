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

  if (result.error && result.error.status === 401) {
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
  tagTypes: ["AdminProfile", "Category"],
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
} = adminApi;
