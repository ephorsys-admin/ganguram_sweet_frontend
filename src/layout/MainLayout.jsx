import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";


const MainLayout = () => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div>
      {!isAdminRoute && <Navbar />}
      <main className="min-h-screen">
        <Outlet />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );

};

export default MainLayout;