import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ShoppingBag } from "lucide-react";
import { NavLink } from "react-router-dom";
import { openCart } from "../redux/features/cart/cartSlice";
import CartDrawer from "../web/web-components/CartDrawer";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Our Items", path: "/products" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { totalQuantity, totalAmount } = useSelector((state) => state.cart);

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
        <ul className="hidden items-center gap-8 lg:flex">
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

        {/* Desktop Right: Cart + Contact */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(openCart())}
            className="relative flex items-center gap-2 rounded-full border border-[#DFA250]/60 bg-white/90 px-4 py-2 text-sm font-bold text-[#5C2A1A] hover:border-[#8A2E2E] hover:text-[#8A2E2E] shadow-2xs transition cursor-pointer"
            aria-label="View Sweet Box"
          >
            <div className="relative">
              <ShoppingBag size={18} />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#8A2E2E] px-1 text-[10px] font-black text-white shadow-xs animate-pulse">
                  {totalQuantity}
                </span>
              )}
            </div>
            <span>Cart</span>
            {totalQuantity > 0 && (
              <span className="rounded-md bg-[#FAF0E6] px-1.5 py-0.5 text-xs font-mono font-extrabold text-[#8A2E2E]">
                ({totalQuantity})
              </span>
            )}
          </button>

          <NavLink
            to="/contact"
            className="flex items-center gap-2 rounded-full bg-yellow-500 px-5 py-2 text-sm font-bold text-white hover:bg-yellow-600 transition"
          >
            <Phone size={15} />
            Contact Now
          </NavLink>
        </div>

        {/* Mobile Right: Cart + Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => dispatch(openCart())}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#E8C68A] text-[#5C2A1A] cursor-pointer"
            aria-label="Open Sweet Box Cart"
          >
            <ShoppingBag size={19} />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#8A2E2E] px-1 text-[10px] font-black text-white">
                {totalQuantity}
              </span>
            )}
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="p-1 cursor-pointer"
            style={{ color: "#5C2A1A" }}
            aria-label="Toggle menu"
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
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t lg:hidden"
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

              <li className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    dispatch(openCart());
                  }}
                  className="flex items-center justify-between rounded-xl bg-white border border-[#E8C68A] px-4 py-3 font-bold text-[#5C2A1A] cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={18} className="text-[#8A2E2E]" />
                    <span>Your Sweet Box</span>
                  </div>
                  <span className="rounded-full bg-[#8A2E2E] px-2.5 py-0.5 text-xs text-white">
                    {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
                  </span>
                </button>

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

      {/* Slide-over Cart Drawer */}
      <CartDrawer />
    </motion.header>
  );
};

export default Navbar;