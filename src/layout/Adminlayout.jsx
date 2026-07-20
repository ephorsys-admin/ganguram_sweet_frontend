import { Outlet } from "react-router-dom";
import { useState } from "react";
import TopBar from "../admin/admin-components/TopBar";
import SideBar from "../admin/admin-components/SideBar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);




  return (
    <div className="flex h-screen bg-slate-50">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;