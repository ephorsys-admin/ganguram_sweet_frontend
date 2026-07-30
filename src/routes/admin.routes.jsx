import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./protected.route";
import AdminLayout from "../layout/Adminlayout";

const AdminLogin = lazy(() => import("../admin/admin-pages/AdminLogin"));
const AdminDashboard = lazy(() => import("../admin/admin-pages/AdminDashboard"));
const AdminCategories = lazy(() => import("../admin/admin-pages/AdminCategories"));
const AdminCategoryForm = lazy(() => import("../admin/admin-pages/AdminCategoryForm"));
const AdminProducts = lazy(() => import("../admin/admin-pages/AdminProducts"));
const AdminProductForm = lazy(() => import("../admin/admin-pages/AdminProductForm"));
const AdminOrders = lazy(() => import("../admin/admin-pages/AdminOrders"));
const AdminCreateOrder = lazy(() => import("../admin/admin-pages/AdminCreateOrder"));
const AdminOrderDetail = lazy(() => import("../admin/admin-pages/AdminOrderDetail"));
const AdminInquiries = lazy(() => import("../admin/admin-pages/AdminInquiries"));
const AdminBilling = lazy(() => import("../admin/admin-pages/AdminBilling"));
const AdminCreateBill = lazy(() => import("../admin/admin-pages/AdminCreateBill"));
const AdminDeleteRequests = lazy(() => import("../admin/admin-pages/AdminDeleteRequests"));

const AdminRoutes = (
  <Route path="/admin">
    {/* Public Route */}
    <Route
      index
      element={<AdminLogin />}
    />

    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
      <Route element={<AdminLayout />}>
        {/* Dashboard */}
        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />
        {/* Categories */}
        <Route
          path="categories"
          element={<AdminCategories />}
        />
        <Route
          path="categories/create"
          element={<AdminCategoryForm />}
        />
        <Route
          path="categories/edit/:categoryId"
          element={<AdminCategoryForm />}
        />
        {/* Products */}
        <Route
          path="products"
          element={<AdminProducts />}
        />
        <Route
          path="products/create"
          element={<AdminProductForm />}
        />
        <Route
          path="products/edit/:productId"
          element={<AdminProductForm />}
        />
        {/* Orders */}
        <Route
          path="orders"
          element={<AdminOrders />}
        />
        <Route
          path="orders/create"
          element={<AdminCreateOrder />}
        />
        <Route
          path="orders/:orderId"
          element={<AdminOrderDetail />}
        />
        {/* Billing */}
        <Route
          path="billing"
          element={<AdminBilling />}
        />
        <Route
          path="billing/create"
          element={<AdminCreateBill />}
        />
        {/* Inquiries */}
        <Route
          path="inquiries"
          element={<AdminInquiries />}
        />
        {/* Delete Requests */}
        <Route
          path="delete-requests"
          element={<AdminDeleteRequests />}
        />
      </Route>
    </Route>
  </Route>
);

export default AdminRoutes;