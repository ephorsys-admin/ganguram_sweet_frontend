import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChefHat, 
  Search, 
  X, 
  Loader2, 
  Star, 
  Minus, 
  Plus, 
  Truck, 
  ShieldCheck, 
  CheckCircle2,
  MapPin 
} from "lucide-react";
import ProductCard from "../web-components/Productcard";
import LocationPicker from "../web-components/LocationPicker";
import { 
  useGetProductsPublicQuery, 
  useGetCategoriesPublicQuery, 
  useGetProductDetailsPublicQuery 
} from "../../redux/services/adminApi";

// Product Details Modal Overlay Component
const ProductDetailsModal = ({ productId, onClose }) => {
  const { data: response, isLoading, isError } = useGetProductDetailsPublicQuery(productId);
  const product = response?.data;

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lon: longitude });
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          if (data && data.display_name) {
            setForm((prev) => ({
              ...prev,
              address: data.display_name
            }));
            setErrors((prev) => ({ ...prev, address: "" }));
          } else {
            setForm((prev) => ({
              ...prev,
              address: `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`
            }));
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          setForm((prev) => ({
            ...prev,
            address: `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`
          }));
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to get your location. Please check your browser location permissions.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleLocationChange = async (lat, lon) => {
    setCoords({ lat, lon });
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setForm((prev) => ({ 
          ...prev, 
          address: data.display_name 
        }));
        setErrors((prev) => ({ ...prev, address: "" }));
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (field === "address" && !e.target.value.trim()) {
      setCoords(null);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, "")))
      errs.phone = "Enter a valid 10-digit number";
    if (!form.address.trim()) errs.address = "Delivery address is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Simulate order submission API call
    console.log("Order inquiry submitted:", { productId: product._id, qty, ...form });
    setSubmitted(true);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
        <div className="bg-white p-8 rounded-3xl flex items-center justify-center min-w-[200px]">
          <Loader2 className="h-8 w-8 text-[#DFA250] animate-spin" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
        <div className="bg-white p-8 rounded-3xl text-center space-y-4 max-w-sm">
          <p className="font-serif font-black text-lg text-[#3D1F12]">Sweet product not found</p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#8A2E2E] hover:bg-[#5C2A1A] text-white rounded-xl font-semibold shadow-md transition cursor-pointer"
          >
            Close Dialog
          </button>
        </div>
      </div>
    );
  }

  const discount = product.mrp && product.sellingPrice 
    ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
    : 0;

  const BADGES = [
    { key: "isBestSeller", label: "Bestseller", color: "#8A2E2E" },
    { key: "isFeatured", label: "Featured", color: "#B8801F" },
    { key: "isTrending", label: "Trending", color: "#2E86DE" },
    { key: "isNewArrival", label: "New Arrival", color: "#2E8B3D" },
  ];
  const activeBadges = BADGES.filter((b) => product[b.key]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#FFFDF8] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col border border-[#E6CCB2]/30"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 hover:bg-slate-100 rounded-full transition text-[#5C2A1A] cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Modal Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery */}
            <div>
              <div
                className="relative aspect-square w-full overflow-hidden rounded-2xl border shadow-sm bg-white"
                style={{ borderColor: "#F0E4CC" }}
              >
                <img
                  src={product.images?.[activeImage]?.url || "/Mylogo/logo.png"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                {discount > 0 && (
                  <span
                    className="absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-bold text-white"
                    style={{ backgroundColor: "#8A2E2E" }}
                  >
                    {discount}% OFF
                  </span>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={img._id}
                      onClick={() => setActiveImage(i)}
                      className="h-16 w-16 overflow-hidden rounded-lg border-2 flex-shrink-0"
                      style={{ borderColor: i === activeImage ? "#8A2E2E" : "#F0E4CC" }}
                    >
                      <img src={img.url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#B8801F" }}>
                  {product.category?.name}
                </span>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl font-serif" style={{ color: "#3D1F12" }}>
                  {product.name}
                </h1>
                <p className="mt-2 text-sm text-[#7A5C4A] leading-relaxed">
                  {product.shortDescription}
                </p>

                {(product.totalReviews > 0 || activeBadges.length > 0) && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {product.totalReviews > 0 && (
                      <div className="flex items-center gap-1">
                        <Star size={14} fill="#2E8B3D" color="#2E8B3D" />
                        <span className="text-sm font-semibold" style={{ color: "#2E8B3D" }}>
                          {product.averageRating || 4.5}
                        </span>
                        <span className="text-sm text-[#9A8A78]">
                          ({product.totalReviews} reviews)
                        </span>
                      </div>
                    )}
                    {activeBadges.map((b) => (
                      <span
                        key={b.key}
                        className="rounded-full px-2.5 py-1 text-xs font-bold text-white"
                        style={{ backgroundColor: b.color }}
                      >
                        {b.label}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold" style={{ color: "#3D1F12" }}>
                    ₹{product.sellingPrice}
                  </span>
                  {product.mrp > product.sellingPrice && (
                    <span className="text-base line-through text-[#B0A18E]">
                      ₹{product.mrp}
                    </span>
                  )}
                  <span className="text-sm text-[#9A8A78]">
                    / {product.unit}
                  </span>
                </div>

                <p
                  className="mt-1 text-xs font-semibold"
                  style={{ color: product.isAvailable ? "#2E8B3D" : "#8A2E2E" }}
                >
                  {product.isAvailable ? `In stock (${product.stock} available)` : "Out of stock"}
                </p>

                {/* Quantity Selector */}
                <div className="mt-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: "#5C2A1A" }}>
                    Quantity
                  </p>
                  <div
                    className="inline-flex items-center gap-4 rounded-lg border border-[#E8C68A] px-3.5 py-2 bg-white shadow-inner"
                  >
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      style={{ color: "#8A2E2E" }}
                      className="cursor-pointer font-bold"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="min-w-4 text-center text-sm font-bold" style={{ color: "#3D1F12" }}>
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stock || 100, q + 1))}
                      aria-label="Increase quantity"
                      style={{ color: "#8A2E2E" }}
                      className="cursor-pointer font-bold"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
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
              </div>

              {/* Trust badges */}
              <div className="mt-5 flex flex-col gap-2">
                {product.homeDelivery && (
                  <div className="flex items-center gap-2 text-sm text-[#5C2A1A]">
                    <Truck size={16} className="text-[#8A2E2E]" />
                    Home delivery available
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-[#5C2A1A]">
                  <ShieldCheck size={16} className="text-[#8A2E2E]" />
                  Quality checked, freshly packed confections
                </div>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div
            className="mt-8 rounded-2xl border p-5 sm:p-8 bg-white border-[#F0E4CC]"
          >
            <h2 className="text-xl font-bold" style={{ color: "#3D1F12" }}>
              Place Your Order Inquiry
            </h2>
            <p className="mt-1 text-sm text-[#7A5C4A]">
              Fill in your details and we'll confirm your order shortly.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex flex-col items-center gap-2 rounded-xl py-10 text-center bg-[#FBF3E4]"
                >
                  <CheckCircle2 size={40} style={{ color: "#2E8B3D" }} />
                  <p className="text-base font-bold" style={{ color: "#3D1F12" }}>
                    Inquiry successfully submitted!
                  </p>
                  <p className="text-sm text-[#7A5C4A]">
                    We'll contact you at {form.email} shortly to confirm details.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 text-left"
                  noValidate
                >
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#5C2A1A]">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder="Your name"
                      className="w-full rounded-lg border border-[#E8C68A] px-3 py-2 text-sm outline-none bg-white focus:ring-1 focus:ring-[#8A2E2E]"
                      style={{ borderColor: errors.name ? "#8A2E2E" : "#E8C68A" }}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs font-semibold text-[#8A2E2E]">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#5C2A1A]">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-[#E8C68A] px-3 py-2 text-sm outline-none bg-white focus:ring-1 focus:ring-[#8A2E2E]"
                      style={{ borderColor: errors.email ? "#8A2E2E" : "#E8C68A" }}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs font-semibold text-[#8A2E2E]">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#5C2A1A]">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      placeholder="10-digit number"
                      className="w-full rounded-lg border border-[#E8C68A] px-3 py-2 text-sm outline-none bg-white focus:ring-1 focus:ring-[#8A2E2E]"
                      style={{ borderColor: errors.phone ? "#8A2E2E" : "#E8C68A" }}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs font-semibold text-[#8A2E2E]">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-[#5C2A1A]">
                        Delivery Address
                      </label>
                      <button
                        type="button"
                        onClick={handleLocateUser}
                        disabled={locating}
                        className="text-xs font-bold flex items-center gap-1 text-[#8A2E2E] hover:underline focus:outline-hidden disabled:opacity-50 cursor-pointer"
                      >
                        {locating ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            <span>Locating...</span>
                          </>
                        ) : (
                          <>
                            <MapPin size={12} />
                            <span>Use Current Location</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className={`grid grid-cols-1 ${coords ? "md:grid-cols-2" : ""} gap-4`}>
                      <div>
                        <input
                          type="text"
                          value={form.address}
                          onChange={handleChange("address")}
                          placeholder="Street address, city"
                          className="w-full rounded-lg border border-[#E8C68A] px-3 py-2 text-sm outline-none bg-white focus:ring-1 focus:ring-[#8A2E2E] font-sans"
                          style={{ borderColor: errors.address ? "#8A2E2E" : "#E8C68A" }}
                        />
                      </div>
                      {coords && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="h-[150px] rounded-lg overflow-hidden border border-[#E8C68A] relative shadow-xs bg-white"
                        >
                          <LocationPicker
                            coords={coords}
                            onLocationChange={handleLocationChange}
                          />
                        </motion.div>
                      )}
                    </div>

                    {errors.address && (
                      <p className="mt-1 text-xs font-semibold text-[#8A2E2E]">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-bold text-[#5C2A1A]">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={handleChange("notes")}
                      placeholder="E.g. eggless, less sweet, customized wrapping"
                      className="w-full rounded-lg border border-[#E8C68A] px-3 py-2 text-sm outline-none h-20 bg-white resize-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="w-full bg-[#8A2E2E] hover:bg-[#5C2A1A] text-white font-bold py-3 px-6 rounded-lg text-sm transition cursor-pointer"
                    >
                      Send Order Request
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const OurSweets = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Fetch products and categories
  const { data: prodResponse, isLoading: prodsLoading } = useGetProductsPublicQuery();
  const products = prodResponse?.data || [];

  const { data: catResponse, isLoading: catsLoading } = useGetCategoriesPublicQuery();
  const categories = catResponse?.data || [];

  // Filter products by search query and category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase().trim());
      const matchesCategory =
        selectedCategory === "All" || p.category?._id === selectedCategory;
      const isActive = p.status !== false;
      return matchesSearch && matchesCategory && isActive;
    });
  }, [products, search, selectedCategory]);

  const isLoading = prodsLoading || catsLoading;

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "#FFFDF8" }}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Style to hide horizontal scrollbar nicely */}
        <style>{`
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-none {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Title Banner */}
        <div className="text-center space-y-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#E6CCB2]/40 text-xs font-bold text-[#a65827] uppercase tracking-wider"
          >
            <ChefHat size={14} /> Our Sweet Heritage
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-serif font-black text-[#3D271B]"
          >
            Explore Our Items
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-[#6E5A4F] max-w-lg mx-auto"
          >
            Indulge in our range of authentic Bengali sweets, savouries, and premium gift boxes.
          </motion.p>
        </div>

        {/* Search Bar Container */}
        <div className="max-w-xl mx-auto bg-white p-3.5 rounded-3xl border border-[#E6CCB2]/30 shadow-xs">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sweets by name..."
              className="w-full pl-10 pr-10 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#a65827] text-xs text-slate-700 placeholder-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-100 rounded-full transition text-slate-400 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Circular Filters */}
        <div className="w-full py-4 border-b border-[#E6CCB2]/20">
          <div className="flex items-center gap-6 overflow-x-auto pb-3 pt-1 justify-start md:justify-center px-4 scrollbar-none">
            {/* "All Items" circular bubble */}
            <button
              onClick={() => setSelectedCategory("All")}
              className="flex flex-col items-center flex-shrink-0 focus:outline-none cursor-pointer group"
            >
              <div 
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all duration-300 bg-white ${
                  selectedCategory === "All" 
                    ? "border-[#a65827] shadow-md ring-2 ring-[#a65827]/15 scale-105" 
                    : "border-[#E6CCB2]/40 hover:border-[#a65827]/50"
                }`}
              >
                <img 
                  src="/Mylogo/logo.png" 
                  className="w-12 h-12 object-contain group-hover:scale-110 transition duration-300" 
                  alt="All Items" 
                />
              </div>
              <span className={`text-[11px] sm:text-xs font-bold mt-2 transition-colors duration-300 ${
                selectedCategory === "All" ? "text-[#a65827]" : "text-[#5C2A1A]"
              }`}>
                All Items
              </span>
            </button>

            {/* Dynamic categories circular bubbles */}
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat._id;
              return (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className="flex flex-col items-center flex-shrink-0 focus:outline-none cursor-pointer group"
                >
                  <div 
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all duration-300 bg-white ${
                      isSelected 
                        ? "border-[#a65827] shadow-md ring-2 ring-[#a65827]/15 scale-105" 
                        : "border-[#E6CCB2]/40 hover:border-[#a65827]/50"
                    }`}
                  >
                    <img 
                      src={cat.image?.url || "/Mylogo/logo.png"} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300" 
                      alt={cat.name} 
                    />
                  </div>
                  <span className={`text-[11px] sm:text-xs font-bold mt-2 transition-colors duration-300 ${
                    isSelected ? "text-[#a65827]" : "text-[#5C2A1A]"
                  }`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 text-[#DFA250] animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <p className="text-base font-bold text-[#3D271B]">No Sweets Found</p>
            <p className="text-xs text-[#6E5A4F]">Try adjusting your search filters or check back later.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 pt-4"
          >
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onViewDetails={(p) => setSelectedProductId(p._id)} 
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Product Details Inline Modal Dialog */}
      <AnimatePresence>
        {selectedProductId && (
          <ProductDetailsModal
            productId={selectedProductId}
            onClose={() => setSelectedProductId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OurSweets;
