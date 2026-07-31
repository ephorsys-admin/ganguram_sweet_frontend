import { LayoutDashboard, Layers, ChefHat, ClipboardList, MessageSquare, LogOut, X, Receipt, Trash2, Megaphone } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LogoutConfirmationModal from "./modals/LogoutConfirmationModal";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/features/auth/authSlice";
import { useToast } from "../../context/ToastContext";

const NAV_ITEMS = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/categories", label: "Categories", icon: Layers },
  { path: "/admin/products", label: "Products", icon: ChefHat },
  { path: "/admin/orders", label: "Orders", icon: ClipboardList },
  { path: "/admin/billing", label: "Billing", icon: Receipt },
  { path: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { path: "/admin/advertisements", label: "Advertisements", icon: Megaphone },
];

const SideBar = ({ sidebarOpen, setSidebarOpen }) => {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const admin = useSelector((state) => state.auth.user);
  const isSuperAdmin = admin?.role === "super_admin";

  const dynamicNavItems = [
    ...NAV_ITEMS,
    ...(isSuperAdmin ? [{ path: "/admin/delete-requests", label: "Delete Requests", icon: Trash2 }] : []),
  ];

  const triggerLogout = () => {
    setIsLogoutModalOpen(true);
    setSidebarOpen(false); // Close sidebar on mobile
  };

  const handleLogout = () => {
    dispatch(logOut());
    showToast("Logged out successfully. Secure session terminated.", "info");
    navigate("/admin");
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#2A1A12] text-[#FAF6F0] flex flex-col transition-transform duration-300 border-r border-[#FAF6F0]/10
          lg:relative lg:translate-x-0 lg:shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center justify-between px-5 py-4 bg-[#1E110A] border-b border-[#FAF6F0]/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white p-0.5 rounded-xl flex items-center justify-center overflow-hidden shadow-inner border border-white/10 transition-all duration-300 hover:scale-105">
              <img
                src="/Mylogo/logo.png"
                alt="Logo"
                className="w-full h-full object-contain scale-[1.1]"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
            <div>
              <p className="text-[16px] font-serif font-black tracking-wider leading-none text-[#DFA250]">
                GANGURAM
              </p>
              <span className="text-[9px] text-[#E6CCB2]/75 font-bold uppercase tracking-widest mt-1 block">Sweet Heritage</span>
            </div>
          </div>

          <button
            className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition text-[#E6CCB2]"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {dynamicNavItems.map(({ path, label, icon: Icon }, i) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.04, duration: 0.25, ease: "easeOut" }}
            >
              <NavLink
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                  ${isActive
                    ? "bg-[#DFA250] text-[#3D271B] shadow-lg shadow-[#DFA250]/15 font-bold scale-[1.02]"
                    : "text-[#E6CCB2]/80 hover:text-[#FAF6F0] hover:bg-white/5 hover:scale-[1.02]"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="px-4 pb-6"
        >
          <motion.button
            onClick={triggerLogout}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(223, 162, 80, 0.12)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex cursor-pointer items-center gap-3 px-4 py-2.5 bg-[#a65827]/10 hover:bg-[#a65827]/20 border border-[#a65827]/20 rounded-xl text-sm font-semibold text-[#FAF6F0] transition-all duration-200"
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </motion.div>
      </aside>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default SideBar;