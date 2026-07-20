import {
  Menu,
  User,
  LogOut,
  Maximize,
  Minimize,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TopBar = ({ setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isFullscreen, setIsFullscreen] = useState(false);


  // Initials
  // const initials =
  //   admin?.name
  //     ?.split(" ")
  //     .map((word) => word[0])
  //     .join("")
  //     .toUpperCase() || "A";

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
      className="relative z-10 bg-white border-b border-slate-200 px-6 h-15 flex items-center justify-between shrink-0"
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

        <span className="text-[15px] font-medium tracking-widest text-slate-800">
          name
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
              <p className="text-[13px] font-medium text-slate-800 leading-tight">
                name
              </p>

              <p className="text-[11px] uppercase tracking-wider text-slate-400 leading-tight">
                role
              </p>
            </div>

            <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[13px] font-medium text-blue-700">
              M
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
                className="absolute right-0 mt-2.5 w-52 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden z-50"
              >
                {/* Identity */}
                <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[13px] font-medium text-blue-700 shrink-0">
                    {/* {initials} */} M
                  </div>

                  <div>
                    <p className="text-[13px] font-medium text-slate-800">
                      name
                    </p>

                    <p className="text-[11px] text-slate-400 capitalize">
                      role
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
                <div className="border-t border-slate-100 p-1.5">
                  <motion.button
                    whileHover={{
                      backgroundColor: "#fef2f2",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-red-500 transition text-left cursor-pointer"
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
    </motion.header>
  );
};

export default TopBar;