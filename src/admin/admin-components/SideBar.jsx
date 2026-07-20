import { LayoutDashboard, LogOut, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const SideBar = ({ sidebarOpen, setSidebarOpen }) => {

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
          fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0e1a] text-white flex flex-col transition-transform duration-300 border-r border-slate-800/60
          lg:relative lg:translate-x-0 lg:shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center justify-between px-6 py-4 bg-[#070b15]/60 border-b border-slate-800/60"
        >
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white p-0.5 rounded-xl flex items-center justify-center overflow-hidden shadow-inner border border-slate-700/10 transition-all duration-300 hover:scale-105">
              <img
                src="/Mylogo/logo.png"
                alt="Logo"
                className="w-full h-full object-contain scale-[1.1]"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
            <div>
              <p className="text-[17px] font-black tracking-wider leading-none bg-linear-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                YESODA
              </p>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Health Care</span>
            </div>
          </div>

          <button
            className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition text-slate-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map(({ path, label, icon: Icon }, i) => (
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
                    ? "bg-linear-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/20 font-bold scale-[1.02]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 hover:scale-[1.02]"
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
            whileHover={{ scale: 1.02, backgroundColor: "rgba(220, 38, 38, 0.15)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex cursor-pointer items-center gap-3 px-4 py-2.5 bg-red-950/20 hover:bg-red-900/30 border border-red-900/40 rounded-xl text-sm font-semibold text-red-200 transition-all duration-200"
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </motion.div>
      </aside>
    </>
  );
};

export default SideBar;