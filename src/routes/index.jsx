import { BrowserRouter, Routes } from "react-router-dom";
import { Suspense } from "react";
import AdminRoutes from "./admin.routes";
import PublicRoutes from "./public.routes";
import ScrollToTop from "../components/ScrollToTop";

const AppLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50/50 space-y-4">
    <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-sm font-semibold text-slate-400">Loading........</p>
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<AppLoading />}>
        <Routes>
          {PublicRoutes}
          {AdminRoutes}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;