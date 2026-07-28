import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ShoppingBag, X, Home, UtensilsCrossed, BookOpen, PhoneCall, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Track scroll position for navbar background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body & html scroll when side drawer is open, and listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Close mobile/slide drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Sweets Menu", path: "/menu", icon: UtensilsCrossed },
    { name: "Our Story", path: "/about", icon: BookOpen },
    { name: "Contact Us", path: "/contact", icon: PhoneCall },
  ];

  // Framer motion variants for side drawer links stagger entrance
  const navContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -25 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-400 ease-in-out ${
        isScrolled
          ? "bg-[#FAF0E6]/95 backdrop-blur-md shadow-md border-b border-[#a65827]/15 py-2.5 sm:py-3.5"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-11 sm:h-13">
          
          {/* LEFT: HOME TEXT BUTTON */}
          <div className="flex items-center justify-start flex-1">
            <button
              onClick={() => setIsOpen(true)}
              className="text-xs sm:text-sm font-serif font-medium tracking-[0.3em] text-[#3D271B] uppercase hover:text-[#a65827] transition-all focus:outline-none cursor-pointer py-2 px-2.5 rounded-xl hover:bg-[#a65827]/10 active:scale-95 touch-manipulation group"
              aria-label="Open Navigation Side Menu"
              aria-expanded={isOpen}
            >
              <span className="inline-block transition-all duration-300 group-hover:tracking-[0.4em]">
                HOME
              </span>
            </button>
          </div>

          {/* CENTER: Text Logo (At Top) -> Image Logo (On Scroll) */}
          <div className="flex justify-center items-center flex-1">
            <Link to="/" className="relative flex items-center justify-center focus:outline-none group py-1">
              <AnimatePresence mode="wait">
                {!isScrolled ? (
                  /* Initial Top State: Clean Text-only Logo */
                  <motion.div
                    key="text-logo"
                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center text-center"
                  >
                    <span className="font-serif text-base sm:text-2xl md:text-3xl font-normal tracking-[0.3em] text-[#a65827] uppercase leading-none truncate">
                      M A H A R A J A
                    </span>
                    <span className="text-[8px] sm:text-[10px] font-sans tracking-[0.25em] text-[#3D271B]/75 uppercase mt-0.5 font-medium">
                      Ganguram Sweets
                    </span>
                  </motion.div>
                ) : (
                  /* Scrolled State: Original Image Logo */
                  <motion.div
                    key="image-logo"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center"
                  >
                    <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-full overflow-hidden border border-[#a65827]/40 bg-white shadow-xs group-hover:scale-105 transition-transform duration-300 p-0.5">
                      <img
                        src="/Mylogo/logo.png"
                        alt="Maharaja Ganguram Sweets Logo"
                        className="h-full w-full object-contain rounded-full"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* RIGHT: ACCOUNT & Shopping Bag Icon with counter badge */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-5 flex-1">
            <Link
              to="/admin/login"
              className="text-xs sm:text-sm font-serif font-medium tracking-[0.25em] text-[#3D271B] hover:text-[#a65827] uppercase transition-colors py-2 px-2.5 rounded-xl hover:bg-[#a65827]/10 touch-manipulation"
            >
              <span>ACCOUNT</span>
            </Link>

            {/* Shopping Bag Icon with counter badge */}
            <button
              aria-label="Shopping Bag"
              className="relative p-2 text-[#3D271B] hover:text-[#a65827] transition-colors focus:outline-none cursor-pointer rounded-full hover:bg-[#a65827]/10 touch-manipulation"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#a65827] text-white text-[9px] font-serif font-bold flex items-center justify-center shadow-xs">
                0
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* FULLY RESPONSIVE SLIDE-OUT DRAWER NAVIGATION SIDEBAR WITH STAGGER TRANSITIONS */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#3D271B]/60 backdrop-blur-sm z-50 w-full h-full"
            />

            {/* Slide Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed top-0 left-0 bottom-0 w-80 sm:w-96 max-w-[88vw] h-[100dvh] bg-[#FAF6F0] z-[60] border-r-2 border-[#D4AF37]/50 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto"
            >
              {/* Top Header of Sidebar Drawer */}
              <div>
                <div className="flex items-center justify-between border-b border-[#a65827]/20 pb-5 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full border border-[#a65827]/30 bg-white p-0.5 shadow-xs overflow-hidden shrink-0">
                      <img
                        src="/Mylogo/logo.png"
                        alt="Maharaja Ganguram Sweets"
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-serif text-lg font-normal tracking-[0.25em] text-[#a65827] uppercase leading-tight">
                        MAHARAJA
                      </span>
                      <span className="text-[9px] font-sans tracking-[0.2em] text-[#3D271B]/60 uppercase mt-0.5">
                        Ganguram Sweets
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full text-[#3D271B]/80 hover:text-[#a65827] hover:bg-[#a65827]/10 transition-colors focus:outline-none cursor-pointer touch-manipulation"
                    aria-label="Close Side Navigation"
                  >
                    <X className="w-6 h-6 stroke-[2]" />
                  </button>
                </div>

                {/* Staggered Animated Navigation Links List */}
                <motion.nav
                  variants={navContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col space-y-3"
                >
                  <span className="text-[10px] font-serif tracking-[0.3em] text-[#a65827] uppercase font-bold mb-1">
                    N A V I G A T I O N
                  </span>

                  {navLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <motion.div key={link.name} variants={navItemVariants}>
                        <NavLink
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm tracking-[0.2em] uppercase transition-all duration-300 font-serif ${
                              isActive
                                ? "bg-[#a65827] text-white font-semibold shadow-md translate-x-1"
                                : "text-[#3D271B]/90 hover:bg-[#a65827]/10 hover:text-[#a65827] hover:translate-x-1"
                            }`
                          }
                        >
                          <IconComponent className="w-4 h-4 shrink-0" />
                          <span>{link.name}</span>
                        </NavLink>
                      </motion.div>
                    );
                  })}
                </motion.nav>
              </div>

              {/* Sidebar Drawer Footer (Pure Ghee box removed as requested) */}
              <div className="border-t border-[#a65827]/20 pt-6 mt-8 space-y-4">
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 text-xs tracking-[0.2em] font-serif text-[#a65827] uppercase hover:underline pt-1"
                >
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span>ACCOUNT / ADMIN LOGIN</span>
                </Link>

                <div className="pt-2 border-t border-[#a65827]/10 text-[10px] font-serif italic text-[#3D271B]/60 flex items-center justify-between">
                  <span>“Royal Heritage Sweets”</span>
                  <span>Est. 2014</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;