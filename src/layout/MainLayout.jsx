import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingContact from "../web/web-components/FloatingContact";

const MainLayout = () => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
        <Outlet />
      </main>

      {!isAdminRoute && (
        <>
          <Footer />
          <FloatingContact />
        </>
      )}
    </div>
  );
};

export default MainLayout;