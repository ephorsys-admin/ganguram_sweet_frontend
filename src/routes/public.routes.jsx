import { lazy } from "react";
import { Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

const HomePage = lazy(() => import("../web/webPages/HomePage"));
const NotFoundPage = lazy(() => import("../web/webPages/NotFoundPage"));

const PublicRoutes = (
  <Route path="/" element={<MainLayout />}>
    <Route index element={<HomePage />} />
    {/* <Route path="about" element={<AboutPage />} /> */}
    <Route path="*" element={<NotFoundPage />} />
  </Route>
);

export default PublicRoutes;
