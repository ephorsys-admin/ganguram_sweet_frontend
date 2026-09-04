import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  closeCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../../redux/features/cart/cartSlice";
import {
  updateBackendCartItem,
  removeBackendCartItem,
  clearBackendCart,
} from "../../redux/features/cart/cartThunk";

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, totalQuantity, totalAmount, isCartOpen } = useSelector(
    (state) => state.cart
  );

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isCartOpen) {
        dispatch(closeCart());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, dispatch]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const handleUpdateQty = (productId, newQty) => {
    dispatch(updateQuantity({ productId, quantity: newQty }));
    dispatch(updateBackendCartItem({ productId, quantity: newQty }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
    dispatch(removeBackendCartItem(productId));
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to empty your cart?")) {
      dispatch(clearCart());
      dispatch(clearBackendCart());
    }
  };

  const handleProceedToCheckout = () => {
    dispatch(closeCart());
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-[#FFFDF8] shadow-2xl flex flex-col border-l border-[#E8C68A]/40"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0E4CC] bg-[#FFF8EC]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8A2E2E]/10 text-[#8A2E2E]">
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-serif font-black text-[#3D1F12] leading-tight">
                      Your Sweet Box
                    </h2>
                    <p className="text-xs font-semibold text-[#8A2E2E]">
                      {totalQuantity} {totalQuantity === 1 ? "item" : "items"} selected
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => dispatch(closeCart())}
                  className="rounded-full p-2 text-[#5C2A1A] hover:bg-[#F0E4CC]/50 transition cursor-pointer"
                  aria-label="Close cart"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Free delivery prompt */}
              <div className="bg-[#FAF6F0] px-5 py-2.5 border-b border-[#F0E4CC] flex items-center gap-2 text-xs font-semibold text-[#5C2A1A]">
                <Sparkles size={14} className="text-[#DFA250] flex-shrink-0" />
                <span>
                  Freshly prepared Ganguram sweets delivered directly to your doorstep.
                </span>
              </div>

              {/* Items List / Empty State */}
              <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-[#F0E4CC]">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
                    <div className="h-20 w-20 rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#8A2E2E] mb-4 shadow-inner">
                      <ShoppingBag size={36} />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-[#3D1F12] mb-1">
                      Your Sweet Box is Empty
                    </h3>
                    <p className="text-xs text-[#9A8A78] max-w-[240px] mb-6">
                      Explore our delicious traditional sweets and authentic snacks to fill your box!
                    </p>
                    <button
                      onClick={() => {
                        dispatch(closeCart());
                        navigate("/products");
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#8A2E2E] hover:bg-[#5C2A1A] text-white text-xs font-bold shadow-md transition cursor-pointer"
                    >
                      Explore Sweets
                    </button>
                  </div>
                ) : (
                  items.map((item) => {
                    const lineTotal = item.price * item.quantity;
                    const isMaxStock =
                      typeof item.stock === "number" && item.quantity >= item.stock;

                    return (
                      <div
                        key={item.id}
                        className="py-4 first:pt-0 last:pb-0 flex gap-3.5 items-center"
                      >
                        {/* Thumbnail */}
                        <div
                          onClick={() => {
                            dispatch(closeCart());
                            navigate(`/products/${item.id}`);
                          }}
                          className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-[#F0E4CC] bg-white cursor-pointer"
                        >
                          <img
                            src={item.image || "/Mylogo/logo.png"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4
                            onClick={() => {
                              dispatch(closeCart());
                              navigate(`/products/${item.id}`);
                            }}
                            className="text-xs sm:text-sm font-bold text-[#3D1F12] truncate cursor-pointer hover:underline"
                          >
                            {item.name}
                          </h4>

                          <p className="text-[11px] text-[#9A8A78]">
                            ₹{item.price} {item.unit ? `/ ${item.unit}` : ""}
                          </p>

                          {/* Stepper */}
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex items-center border border-[#E6CCB2] rounded-lg bg-white overflow-hidden shadow-2xs">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateQty(item.id, item.quantity - 1)
                                }
                                className="px-2 py-1 text-[#5C2A1A] hover:bg-[#FAF6F0] transition cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-2 text-xs font-bold font-mono text-[#3D1F12] min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                disabled={isMaxStock}
                                onClick={() =>
                                  handleUpdateQty(item.id, item.quantity + 1)
                                }
                                className="px-2 py-1 text-[#5C2A1A] hover:bg-[#FAF6F0] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemove(item.id)}
                              className="p-1 text-[#B0A18E] hover:text-[#8A2E2E] transition cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Price Total */}
                        <div className="text-right">
                          <span className="text-sm font-black font-mono text-[#a65827]">
                            ₹{lineTotal}
                          </span>
                          {item.mrp > item.price && (
                            <p className="text-[10px] text-[#B0A18E] line-through font-mono">
                              ₹{item.mrp * item.quantity}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              {items.length > 0 && (
                <div className="p-5 border-t border-[#F0E4CC] bg-[#FFF8EC] space-y-3">
                  <div className="flex items-center justify-between text-sm font-bold text-[#6E5A4F]">
                    <span>Items Subtotal</span>
                    <span className="text-lg font-black font-mono text-[#3D1F12]">
                      ₹{totalAmount}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#9A8A78]">
                    Standard delivery charge calculated based on store distance at checkout.
                  </p>

                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#8A2E2E] hover:bg-[#5C2A1A] py-3 px-4 text-sm font-bold text-white shadow-md shadow-[#8A2E2E]/20 transition cursor-pointer"
                  >
                    <span>Proceed to Order ({totalQuantity})</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={handleClear}
                    className="w-full text-center text-xs font-semibold text-[#8A2E2E] hover:underline cursor-pointer pt-1"
                  >
                    Empty Sweet Box
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
