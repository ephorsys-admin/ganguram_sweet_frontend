import { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./protected.route";
import AdminLayout from "../layout/Adminlayout";

const AdminLogin = lazy(() => import("../admin/admin-pages/AdminLogin"));
const AdminDashboard = lazy(() => import("../admin/admin-Pages/AdminDashboard"));

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
      </Route>
    </Route>
  </Route>
);

export default AdminRoutes;