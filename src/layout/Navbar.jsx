import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Our Items", path: "/products" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b"
      style={{
        backgroundColor: "#FFF8EC",
        borderColor: "#E8C68A",
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5">
          <img src="/Mylogo/logo.png" alt="Ganguram Logo" className="h-12 object-contain" />
          <span className="text-2xl font-serif font-black tracking-wider bg-gradient-to-r from-[#a65827] via-[#DFA250] to-[#5C2A1A] bg-clip-text text-transparent">
            Maharaja
          </span>
        </NavLink>

        {/* Desktop Menu */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link, i) => (
            <motion.li
              key={link.name}
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: i * 0.05,
              }}
            >
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `text-lg font-semibold transition-all duration-300 ${isActive
                    ? "text-yellow-600"
                    : "text-[#5C2A1A] hover:text-yellow-600"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </motion.li>
          ))}
        </ul>

        {/* Contact Button */}
        <NavLink
          to="/contact"
          className="hidden md:flex items-center gap-2 rounded-full bg-yellow-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-yellow-600 transition"
        >
          <Phone size={16} />
          Contact Now
        </NavLink>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden"
          style={{ color: "#5C2A1A" }}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X size={28} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Menu size={28} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t md:hidden"
            style={{
              backgroundColor: "#FFF8EC",
              borderColor: "#E8C68A",
            }}
          >
            <ul className="space-y-2 p-4">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-3 font-semibold transition ${isActive
                        ? "bg-yellow-500 text-white"
                        : "text-[#5C2A1A] hover:bg-yellow-100"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}

              <li className="pt-2">
                <NavLink
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#8A2E2E] px-5 py-3 font-bold text-white"
                >
                  <Phone size={18} />
                  Contact Now
                </NavLink>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;