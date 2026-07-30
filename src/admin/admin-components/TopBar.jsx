import {
  Menu,
  User,
  LogOut,
  Maximize,
  Minimize,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../redux/features/auth/authSlice";
import LogoutConfirmationModal from "./modals/LogoutConfirmationModal";
import { useToast } from "../../context/ToastContext";

const TopBar = ({ setSidebarOpen }) => {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.auth.user);

  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const name = admin?.name || "Admin User";
  const role = admin?.role === "super_admin" ? "Super Admin" : "Admin";

  // Initials
  const initials = name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "A";

  const triggerLogout = () => {
    setIsLogoutModalOpen(true);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    dispatch(logOut());
    showToast("Logged out successfully. Secure session terminated.", "info");
    navigate("/admin");
    setIsLogoutModalOpen(false);
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative z-10 bg-white border-b border-[#E6CCB2]/30 px-6 h-15 flex items-center justify-between shrink-0"
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.92 }}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={18} />
        </motion.button>

        <span className="text-[12px] sm:text-[14px] font-semibold tracking-wider text-slate-700 font-sans">
          GANGURAM <span className="hidden sm:inline">ADMIN CONTROL PORTAL</span>
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Fullscreen */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={toggleFullscreen}
          className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition cursor-pointer"
        >
          {isFullscreen ? (
            <Minimize size={18} />
          ) : (
            <Maximize size={18} />
          )}
        </motion.button>

        {/* Profile */}
        <div
          className="relative"
          ref={dropdownRef}
        >
          <motion.button
            onClick={() =>
              setProfileOpen((prev) => !prev)
            }
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="hidden sm:block text-right">
              <p className="text-[13px] font-semibold text-slate-800 leading-tight">
                {name}
              </p>

              <p className="text-[11px] uppercase tracking-wider text-[#a65827] font-semibold leading-tight mt-0.5">
                {role}
              </p>
            </div>

            <div className="w-9 h-9 rounded-full bg-[#FAF6F0] border border-[#E6CCB2] flex items-center justify-center text-[13px] font-bold text-[#3D271B]">
              {initials}
            </div>
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className="absolute right-0 mt-2.5 w-52 bg-white border border-[#E6CCB2]/30 rounded-xl shadow-lg overflow-hidden z-50"
              >
                {/* Identity */}
                <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-slate-100 bg-[#FAF6F0]/50">
                  <div className="w-9 h-9 rounded-full bg-[#3D271B] text-[#FAF6F0] flex items-center justify-center text-[13px] font-bold shrink-0">
                    {initials}
                  </div>

                  <div>
                    <p className="text-[13px] font-bold text-slate-800 leading-tight">
                      {name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium truncate max-w-[120px] mt-0.5" title={admin?.email}>
                      {admin?.email}
                    </p>
                    <p className="text-[10px] text-[#a65827] font-bold uppercase tracking-wider mt-1.5">
                      {role}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-1.5">
                  <motion.button
                    whileHover={{
                      backgroundColor: "#f8fafc",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-slate-700 transition text-left"
                  >
                    <User
                      size={15}
                      className="text-slate-400"
                    />
                    My Profile
                  </motion.button>
                </div>

                {/* Logout */}
                <div className="border-t border-slate-100 p-1.5 bg-[#FAF6F0]/20">
                  <motion.button
                    onClick={triggerLogout}
                    whileHover={{
                      backgroundColor: "#fef2f2",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-red-600 transition text-left cursor-pointer font-semibold"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </motion.header>
  );
};

export default TopBar;