import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Star,
  Truck,
  ShieldCheck,
  BadgeCheck,
  Heart,
  Share2,
  Loader2,
  PackageCheck,
  RotateCcw,
  Plus,
  Minus,
  ShoppingBag,
  Check,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useGetProductDetailsPublicQuery } from "../../redux/services/adminApi";
import { addToCart, openCart } from "../../redux/features/cart/cartSlice";
import { addBackendCartItem } from "../../redux/features/cart/cartThunk";

const BADGES = [
  { key: "isBestSeller", label: "Bestseller", color: "#8A2E2E" },
  { key: "isFeatured", label: "Featured", color: "#B8801F" },
  { key: "isTrending", label: "Trending", color: "#2E86DE" },
  { key: "isNewArrival", label: "New Arrival", color: "#2E8B3D" },
];

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { data: response, isLoading, isError } = useGetProductDetailsPublicQuery(productId);

  // API sometimes returns `data` as a list (e.g. [{...}]) and sometimes as a
  // single object — support both shapes safely.
  const product = useMemo(() => {
    const raw = response?.data;
    if (Array.isArray(raw)) return raw[0] ?? null;
    return raw ?? null;
  }, [response]);

  const dispatch = useDispatch();
  const [selectedQty, setSelectedQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { items: cartItems } = useSelector((state) => state.cart);
  const cartItem = cartItems.find(
    (item) => item.id === productId || item.id === product?._id
  );
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAddToCart = (openDrawer = false) => {
    if (!product || !product.isAvailable) return;
    dispatch(addToCart({ product, quantity: selectedQty }));
    dispatch(
      addBackendCartItem({
        productId: product._id || productId,
        quantity: selectedQty,
      })
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
    if (openDrawer) {
      dispatch(openCart());
    }
  };

  const handleBuyNow = () => {
    if (!product || !product.isAvailable) return;
    dispatch(addToCart({ product, quantity: selectedQty }));
    dispatch(
      addBackendCartItem({
        productId: product._id || productId,
        quantity: selectedQty,
      })
    );
    navigate("/checkout");
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard may be unavailable — fail silently
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center" style={{ backgroundColor: "#FFFDF8" }}>
        <Loader2 className="h-8 w-8 text-[#DFA250] animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center gap-4" style={{ backgroundColor: "#FFFDF8" }}>
        <p className="font-serif font-black text-lg text-[#3D1F12]">Sweet product not found</p>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 bg-[#8A2E2E] hover:bg-[#5C2A1A] text-white rounded-xl font-semibold shadow-md transition cursor-pointer"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const rating = product?.averageRating || 0;
  const reviews = product?.totalReviews || 0;
  const hasRating = reviews > 0;

  const discount = product.mrp && product.sellingPrice && product.mrp > product.sellingPrice
    ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
    : 0;
  const activeBadges = BADGES.filter((b) => product[b.key]);
  const images = product.images?.length ? product.images : [{ _id: "placeholder", url: "/Mylogo/logo.png" }];

  const lowStock = product.isAvailable && product.stock > 0 && product.stock <= 10;

  return (
    <div className="w-full pb-24 md:pb-0" style={{ backgroundColor: "#FFFDF8" }}>
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-3 flex items-center gap-1 text-xs font-semibold text-[#9A8A78]">
          <button onClick={() => navigate("/")} className="hover:text-[#8A2E2E] cursor-pointer">
            Home
          </button>
          {product.category?.name && (
            <>
              <ChevronRight size={12} />
              <span>{product.category.name}</span>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-[#5C2A1A]">{product.name}</span>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1.5 text-sm font-bold cursor-pointer"
          style={{ color: "#5C2A1A" }}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start bg-white rounded-3xl border border-[#E6CCB2]/30 p-6 md:p-8 shadow-xs">
          {/* Gallery */}
          <div className="md:sticky md:top-4">
            <motion.div
              key={images[activeImage]?._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              className="relative aspect-square w-full overflow-hidden rounded-2xl border shadow-sm bg-white cursor-zoom-in"
              style={{ borderColor: "#F0E4CC" }}
            >
              <img
                src={images[activeImage]?.url}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-200"
                style={
                  isZoomed
                    ? { transform: "scale(1.9)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                    : undefined
                }
              />
              {discount > 0 && (
                <span
                  className="absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: "#8A2E2E" }}
                >
                  {discount}% OFF
                </span>
              )}

              <div className="absolute right-3 top-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLiked((l) => !l);
                  }}
                  aria-label="Save to wishlist"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur cursor-pointer"
                >
                  <Heart size={16} fill={liked ? "#8A2E2E" : "none"} color="#8A2E2E" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  aria-label="Copy link to share"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur cursor-pointer"
                >
                  <Share2 size={15} color="#5C2A1A" />
                </button>
              </div>

              {copied && (
                <span className="absolute right-3 top-14 rounded-md bg-[#3D1F12] px-2 py-1 text-[10px] font-semibold text-white">
                  Link copied
                </span>
              )}
            </motion.div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img._id}
                    onClick={() => setActiveImage(i)}
                    className="h-16 w-16 overflow-hidden rounded-lg border-2 flex-shrink-0 transition"
                    style={{ borderColor: i === activeImage ? "#8A2E2E" : "#F0E4CC" }}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col"
          >
            {product.category?.name && (
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#B8801F" }}>
                {product.category.name}
              </span>
            )}

            <h1 className="mt-1 text-2xl font-bold sm:text-3xl font-serif" style={{ color: "#3D1F12" }}>
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-[#7A5C4A] leading-relaxed">
              {product.shortDescription}
            </p>

            {(hasRating || activeBadges.length > 0) && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {hasRating && (
                  <div className="flex items-center gap-1 rounded-full bg-[#F1F8F0] px-2 py-1">
                    <Star size={14} fill="#2E8B3D" color="#2E8B3D" />
                    <span className="text-sm font-semibold" style={{ color: "#2E8B3D" }}>
                      {rating}
                    </span>
                    <span className="text-sm text-[#9A8A78]">({reviews} reviews)</span>
                  </div>
                )}
                {activeBadges.map((b) => (
                  <span
                    key={b.key}
                    className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold text-white"
                    style={{ backgroundColor: b.color }}
                  >
                    <BadgeCheck size={12} />
                    {b.label}
                  </span>
                ))}
              </div>
            )}

            {/* Price block */}
            <div className="mt-5 rounded-2xl bg-[#FAF6F0] px-4 py-4 border border-[#F0E4CC]">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-extrabold" style={{ color: "#3D1F12" }}>
                  ₹{product.sellingPrice}
                </span>
                {product.mrp > product.sellingPrice && (
                  <>
                    <span className="text-base line-through text-[#B0A18E]">₹{product.mrp}</span>
                    <span className="text-sm font-bold" style={{ color: "#2E8B3D" }}>
                      Save ₹{product.mrp - product.sellingPrice}
                    </span>
                  </>
                )}
                <span className="text-sm text-[#9A8A78]">/ {product.unit}</span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: product.isAvailable ? "#2E8B3D" : "#8A2E2E" }}
                />
                <p
                  className="text-xs font-semibold"
                  style={{ color: product.isAvailable ? "#2E8B3D" : "#8A2E2E" }}
                >
                  {product.isAvailable
                    ? lowStock
                      ? `Only ${product.stock} left — order soon`
                      : `In stock (${product.stock} available)`
                    : "Out of stock"}
                </p>
              </div>
            </div>

            {/* CTA with Quantity Selection */}
            <div className="mt-5 hidden md:flex flex-col gap-3.5">
              {/* Quantity Selector Row */}
              {product.isAvailable && (
                <div className="flex items-center justify-between bg-[#FAF6F0] rounded-xl p-3 border border-[#F0E4CC]">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#6E5A4F]">Select Quantity</span>
                    <span className="text-xs font-mono font-bold text-[#a65827]">
                      Subtotal: ₹{product.sellingPrice * selectedQty}
                    </span>
                  </div>

                  <div className="flex items-center border border-[#E6CCB2] rounded-xl bg-white overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      disabled={selectedQty <= 1}
                      onClick={() => setSelectedQty((prev) => Math.max(1, prev - 1))}
                      className="px-3 py-2 text-[#5C2A1A] hover:bg-[#FAF6F0] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="px-4 text-sm font-black font-mono text-[#3D1F12] min-w-[28px] text-center">
                      {selectedQty}
                    </span>
                    <button
                      type="button"
                      disabled={Boolean(product.stock && selectedQty >= product.stock)}
                      onClick={() =>
                        setSelectedQty((prev) =>
                          product.stock ? Math.min(product.stock, prev + 1) : prev + 1
                        )
                      }
                      className="px-3 py-2 text-[#5C2A1A] hover:bg-[#FAF6F0] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAddToCart(true)}
                  disabled={!product.isAvailable}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#8A2E2E] bg-[#FFF8EC] py-3.5 px-4 text-sm font-bold text-[#8A2E2E] hover:bg-[#8A2E2E] hover:text-white transition shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {justAdded ? (
                    <>
                      <Check size={18} />
                      <span>Added to Box!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Add to Cart ({selectedQty})</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBuyNow}
                  disabled={!product.isAvailable}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#8A2E2E] hover:bg-[#5C2A1A] py-3.5 px-4 text-sm font-bold text-white shadow-md shadow-[#8A2E2E]/20 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Order Now</span>
                </motion.button>
              </div>

              {inCartQty > 0 && (
                <p className="text-xs text-center font-bold text-[#2E8B3D] bg-[#F1F8F0] py-1.5 px-3 rounded-lg">
                  ✓ You currently have {inCartQty} in your sweet box
                </p>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {product.homeDelivery && (
                <div className="flex items-center gap-2 text-sm text-[#5C2A1A] rounded-xl bg-[#FAF6F0] px-3 py-2.5">
                  <Truck size={16} className="text-[#8A2E2E] flex-shrink-0" />
                  Home delivery available
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-[#5C2A1A] rounded-xl bg-[#FAF6F0] px-3 py-2.5">
                <ShieldCheck size={16} className="text-[#8A2E2E] flex-shrink-0" />
                Quality checked & freshly packed
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5C2A1A] rounded-xl bg-[#FAF6F0] px-3 py-2.5">
                <PackageCheck size={16} className="text-[#8A2E2E] flex-shrink-0" />
                Securely packaged for transit
              </div>
              {product.allowInquiry && (
                <div className="flex items-center gap-2 text-sm text-[#5C2A1A] rounded-xl bg-[#FAF6F0] px-3 py-2.5">
                  <RotateCcw size={16} className="text-[#8A2E2E] flex-shrink-0" />
                  Custom inquiries welcome
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-6 border-t pt-5 border-[#F0E4CC]">
              <h2 className="text-sm font-bold" style={{ color: "#3D1F12" }}>
                Description
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[#7A5C4A]">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="mt-6 border-t pt-5 border-[#F0E4CC]">
              <h2 className="text-sm font-bold mb-2.5" style={{ color: "#3D1F12" }}>
                Specifications
              </h2>
              <dl className="divide-y divide-[#F0E4CC] text-sm rounded-xl border border-[#F0E4CC] overflow-hidden">
                {[
                  ["Category", product.category?.name],
                  ["Unit", product.unit],
                  ["Available Stock", `${product.stock}`],
                  ["Home Delivery", product.homeDelivery ? "Yes" : "No"],
                ]
                  .filter(([, v]) => v !== undefined && v !== null && v !== "")
                  .map(([label, value]) => (
                    <div key={label} className="flex justify-between px-3.5 py-2.5 bg-white">
                      <dt className="text-[#9A8A78] font-medium">{label}</dt>
                      <dd className="text-[#3D1F12] font-semibold">{value}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#F0E4CC] bg-white/95 backdrop-blur px-3 py-2.5 md:hidden"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
            {/* Price & Quantity Stepper */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-1">
                <span className="text-base font-black text-[#3D1F12]">
                  ₹{product.sellingPrice * selectedQty}
                </span>
                <span className="text-[10px] font-medium text-[#9A8A78]">
                  ({selectedQty} {product.unit || "pc"})
                </span>
              </div>

              {product.isAvailable && (
                <div className="flex items-center border border-[#E6CCB2] rounded-lg bg-white overflow-hidden mt-1 w-fit shadow-2xs">
                  <button
                    type="button"
                    disabled={selectedQty <= 1}
                    onClick={() => setSelectedQty((prev) => Math.max(1, prev - 1))}
                    className="px-2 py-0.5 text-[#5C2A1A] hover:bg-[#FAF6F0] disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-2 text-xs font-bold font-mono text-[#3D1F12] min-w-[18px] text-center">
                    {selectedQty}
                  </span>
                  <button
                    type="button"
                    disabled={Boolean(product.stock && selectedQty >= product.stock)}
                    onClick={() =>
                      setSelectedQty((prev) =>
                        product.stock ? Math.min(product.stock, prev + 1) : prev + 1
                      )
                    }
                    className="px-2 py-0.5 text-[#5C2A1A] hover:bg-[#FAF6F0] disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddToCart(true)}
                disabled={!product.isAvailable}
                className="flex items-center justify-center gap-1 rounded-xl border border-[#8A2E2E] bg-[#FFF8EC] py-2.5 px-3 text-xs font-bold text-[#8A2E2E] active:scale-95 disabled:opacity-50"
              >
                <ShoppingBag size={14} />
                <span>{justAdded ? "Added!" : "Add"}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!product.isAvailable}
                className="flex-shrink-0 bg-[#8A2E2E] hover:bg-[#5C2A1A] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition active:scale-95 disabled:opacity-60 shadow-xs"
              >
                {product.isAvailable ? "Order Now" : "Out of Stock"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ProductDetails;