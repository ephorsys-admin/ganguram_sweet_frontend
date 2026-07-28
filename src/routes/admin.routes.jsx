import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./protected.route";
import AdminLayout from "../layout/Adminlayout";

const AdminLogin = lazy(() => import("../admin/admin-pages/AdminLogin"));
const AdminDashboard = lazy(() => import("../admin/admin-pages/AdminDashboard"));
const AdminCategories = lazy(() => import("../admin/admin-pages/AdminCategories"));
const AdminProducts = lazy(() => import("../admin/admin-pages/AdminProducts"));
const AdminOrders = lazy(() => import("../admin/admin-pages/AdminOrders"));
const AdminInquiries = lazy(() => import("../admin/admin-pages/AdminInquiries"));

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
        {/* Products */}
        <Route
          path="products"
          element={<AdminProducts />}
        />
        {/* Orders */}
        <Route
          path="orders"
          element={<AdminOrders />}
        />
        {/* Inquiries */}
        <Route
          path="inquiries"
          element={<AdminInquiries />}
        />
      </Route>
    </Route>
  </Route>
);

export default AdminRoutes;