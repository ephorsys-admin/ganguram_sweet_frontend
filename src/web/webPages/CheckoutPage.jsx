import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  MapPin,
  Home,
  AlertCircle,
  ShoppingBag,
  Clock,
  ShieldCheck,
  Check,
  ChevronRight,
  SearchX,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../../redux/features/cart/cartSlice";
import {
  updateBackendCartItem,
  removeBackendCartItem,
  clearBackendCart,
  getOrCreateSessionId,
} from "../../redux/features/cart/cartThunk";
import { createPublicOrder } from "../../redux/features/order/orderThunk";
import LocationPicker from "../web-components/LocationPicker";

/* =========================================================
   STORE LOCATION & DELIVERY CHARGE CONFIGURATION
   ========================================================= */

const STORE_LOCATION = {
  lat: 20.280948,
  lon: 85.798344,
};

function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateDeliveryCharge(distanceKm) {
  if (distanceKm <= 2) return 0; // free delivery
  if (distanceKm <= 5) return 20;
  if (distanceKm <= 10) return 40;
  if (distanceKm <= 15) return 60;
  return null; // out of range
}

/* =========================================================
   ADDRESS AUTOCOMPLETE HOOK
   ========================================================= */

const LOCALITY_SUFFIXES =
  /\b(post office|po|gram panchayat|panchayat|village|nagar panchayat|tehsil|block|dist(?:rict)?|taluka|mandal)\b/gi;

function stripLocalitySuffixes(query) {
  return query.replace(LOCALITY_SUFFIXES, "").replace(/\s+/g, " ").trim();
}

async function fetchNominatim(query) {
  const params = new URLSearchParams({
    format: "json",
    addressdetails: "1",
    namedetails: "1",
    extratags: "1",
    dedupe: "1",
    limit: "8",
    countrycodes: "in",
    bounded: "0",
    viewbox: [
      STORE_LOCATION.lon - 1.5,
      STORE_LOCATION.lat + 1.5,
      STORE_LOCATION.lon + 1.5,
      STORE_LOCATION.lat - 1.5,
    ].join(","),
    q: query,
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`
  );
  if (!response.ok) return [];
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

function useAddressSearch() {
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  const searchAddress = useCallback((query) => {
    clearTimeout(debounceRef.current);

    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      setNoResults(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const requestId = ++requestIdRef.current;
      setSearching(true);
      setNoResults(false);
      try {
        let results = await fetchNominatim(query.trim());

        if (!results.length) {
          const cleaned = stripLocalitySuffixes(query.trim());
          if (cleaned && cleaned.toLowerCase() !== query.trim().toLowerCase()) {
            results = await fetchNominatim(cleaned);
          }
        }

        if (!results.length) {
          results = await fetchNominatim(`${query.trim()}, India`);
        }

        if (requestId !== requestIdRef.current) return;

        setSuggestions(results);
        setNoResults(results.length === 0);
      } catch (err) {
        console.error("Address search error:", err);
        if (requestId === requestIdRef.current) {
          setSuggestions([]);
          setNoResults(true);
        }
      } finally {
        if (requestId === requestIdRef.current) setSearching(false);
      }
    }, 400);
  }, []);

  return { suggestions, searching, noResults, searchAddress, setSuggestions, setNoResults };
}

function splitDisplayName(displayName) {
  const parts = (displayName || "").split(",").map((p) => p.trim());
  return {
    primary: parts[0] || displayName,
    secondary: parts.slice(1).join(", "),
  };
}

/* =========================================================
   MAIN CHECKOUT PAGE COMPONENT
   ========================================================= */

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, totalAmount, totalQuantity } = useSelector((state) => state.cart);

  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const { suggestions, searching, noResults, searchAddress, setSuggestions, setNoResults } =
    useAddressSearch();

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".address-search-wrapper")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const distanceKm = useMemo(() => {
    if (!coords) return null;
    return getDistanceInKm(STORE_LOCATION.lat, STORE_LOCATION.lon, coords.lat, coords.lon);
  }, [coords]);

  const deliveryCharge = useMemo(() => {
    if (distanceKm === null) return 0;
    return calculateDeliveryCharge(distanceKm);
  }, [distanceKm]);

  const outOfRange = coords !== null && deliveryCharge === null;
  const grandTotal = totalAmount + (deliveryCharge || 0);

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
            setForm((prev) => ({ ...prev, address: data.display_name }));
            setErrors((prev) => ({ ...prev, address: "" }));
          } else {
            setForm((prev) => ({
              ...prev,
              address: `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`,
            }));
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          setForm((prev) => ({
            ...prev,
            address: `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`,
          }));
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to get your location. Please check browser location permissions.");
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
        setForm((prev) => ({ ...prev, address: data.display_name }));
        setErrors((prev) => ({ ...prev, address: "" }));
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  const handleSelectSuggestion = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    setCoords({ lat, lon });
    setForm((prev) => ({ ...prev, address: place.display_name }));
    setErrors((prev) => ({ ...prev, address: "" }));
    setShowDropdown(false);
    setSuggestions([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "address") {
      setShowDropdown(true);
      searchAddress(value);
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Customer name is required";
    if (!form.phone.trim()) {
      errs.phone = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      errs.phone = "Please enter a valid 10-digit Indian mobile number";
    }
    if (!form.address.trim() || form.address.trim().length < 5) {
      errs.address = "Please enter complete delivery address";
    }
    if (outOfRange) {
      errs.address =
        "Your location is outside our 15km delivery range. Please choose a nearby address.";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your sweet box is empty. Please add sweets before ordering.");
      return;
    }

    const errs = validateForm();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);

    try {
      const payload = {
        items: items.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
        customerName: form.name.trim(),
        customerEmail: form.email.trim(),
        customerMobile: form.phone.trim(),
        deliveryAddress: form.address.trim(),
        landmark: form.landmark.trim(),
        specialInstructions: form.notes.trim(),
        deliveryLat: coords?.lat || null,
        deliveryLon: coords?.lon || null,
        distanceKm: distanceKm ? Number(distanceKm.toFixed(2)) : null,
        deliveryCharge: deliveryCharge || 0,
        itemsTotal: totalAmount,
        grandTotal,
        sessionId: getOrCreateSessionId(),
      };

      const resultAction = await dispatch(createPublicOrder(payload)).unwrap();

      if (resultAction.success) {
        setSubmittedOrder(resultAction.data);
        dispatch(clearCart());
        dispatch(clearBackendCart());
      } else {
        alert(resultAction.message || "Failed to place order. Please try again.");
      }
    } catch (err) {
      alert(
        err.message ||
          "Something went wrong while placing your order. Please check your connection."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     RENDER: ORDER SUCCESS RECEIPT
     ========================================================= */

  if (submittedOrder) {
    const orderItems = submittedOrder.items || [];

    return (
      <div className="w-full min-h-[75vh] py-12 px-4" style={{ backgroundColor: "#FFFDF8" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-2xl rounded-3xl border border-[#E6CCB2]/50 bg-white p-6 sm:p-10 shadow-lg"
        >
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 shadow-inner">
              <CheckCircle2 size={36} />
            </div>

            <span className="text-xs font-extrabold uppercase tracking-widest text-[#B8801F]">
              Order Confirmed
            </span>

            <h1 className="mt-1 text-2xl sm:text-3xl font-serif font-black text-[#3D1F12]">
              Thank You for Your Order!
            </h1>

            <p className="mt-1 text-sm text-[#7A5C4A]">
              We have received your sweet order and our master confectioners are preparing it.
            </p>

            <div className="mt-4 rounded-xl bg-[#FAF6F0] px-4 py-2 border border-[#F0E4CC]">
              <span className="text-xs font-bold text-[#6E5A4F]">Order ID: </span>
              <span className="text-sm font-black font-mono text-[#8A2E2E]">
                {submittedOrder.orderNumber || "GS100001"}
              </span>
            </div>
          </div>

          {/* Itemized summary */}
          <div className="mt-8 border-t border-[#F0E4CC] pt-6">
            <h3 className="text-sm font-serif font-bold text-[#3D1F12] mb-3">
              Ordered Sweets ({submittedOrder.quantity || totalQuantity} items)
            </h3>

            <div className="divide-y divide-[#F0E4CC] rounded-2xl border border-[#F0E4CC] bg-[#FFFDF8] overflow-hidden">
              {orderItems.length > 0 ? (
                orderItems.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 text-sm">
                    <div className="flex items-center gap-3">
                      {it.productImage && (
                        <img
                          src={it.productImage}
                          alt={it.productName}
                          className="h-10 w-10 rounded-lg object-cover border border-[#F0E4CC]"
                        />
                      )}
                      <div>
                        <p className="font-bold text-[#3D1F12]">{it.productName}</p>
                        <p className="text-xs text-[#9A8A78]">
                          Qty: {it.quantity} × ₹{it.productPrice}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold font-mono text-[#a65827]">
                      ₹{it.subTotal || it.quantity * it.productPrice}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3.5 flex justify-between text-sm">
                  <span className="font-bold text-[#3D1F12]">
                    {submittedOrder.productName} (x{submittedOrder.quantity})
                  </span>
                  <span className="font-bold font-mono text-[#a65827]">
                    ₹{submittedOrder.subTotal}
                  </span>
                </div>
              )}
            </div>

            {/* Calculations */}
            <div className="mt-4 space-y-2 text-sm text-[#6E5A4F]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono font-bold text-[#3D1F12]">
                  ₹{submittedOrder.subTotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-mono font-bold text-[#3D1F12]">
                  {submittedOrder.deliveryCharge > 0 ? `₹${submittedOrder.deliveryCharge}` : "FREE"}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-[#3D1F12] border-t border-[#F0E4CC] pt-2">
                <span>Total Amount (COD)</span>
                <span className="font-mono text-xl text-[#8A2E2E]">
                  ₹{submittedOrder.totalAmount}
                </span>
              </div>
            </div>

            {/* Delivery address snapshot */}
            <div className="mt-6 rounded-2xl bg-[#FAF6F0] p-4 border border-[#F0E4CC] text-xs space-y-1">
              <p className="font-bold text-[#3D1F12]">Delivering to:</p>
              <p className="font-semibold text-[#5C2A1A]">
                {submittedOrder.customerName} ({submittedOrder.customerMobile})
              </p>
              <p className="text-[#7A5C4A]">{submittedOrder.deliveryAddress}</p>
              {submittedOrder.landmark && (
                <p className="text-[#9A8A78]">Landmark: {submittedOrder.landmark}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 rounded-xl bg-[#8A2E2E] hover:bg-[#5C2A1A] text-white text-sm font-bold shadow-md transition cursor-pointer"
            >
              Order More Sweets
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-xl border border-[#E6CCB2] bg-white text-[#5C2A1A] text-sm font-bold hover:bg-[#FAF6F0] transition cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* =========================================================
     RENDER: EMPTY CART STATE
     ========================================================= */

  if (items.length === 0) {
    return (
      <div className="w-full min-h-[65vh] flex flex-col items-center justify-center py-16 px-4" style={{ backgroundColor: "#FFFDF8" }}>
        <div className="h-24 w-24 rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#8A2E2E] mb-5 shadow-inner">
          <ShoppingBag size={42} />
        </div>
        <h2 className="text-2xl font-serif font-black text-[#3D1F12]">Your Sweet Box is Empty</h2>
        <p className="text-sm text-[#9A8A78] max-w-sm text-center mt-2 mb-6">
          Looks like you haven't added any sweets to your box yet. Browse our handcrafted traditional sweets to place an order!
        </p>
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-3 rounded-full bg-[#8A2E2E] hover:bg-[#5C2A1A] text-white text-sm font-bold shadow-md transition cursor-pointer"
        >
          Explore Our Sweets
        </button>
      </div>
    );
  }

  /* =========================================================
     RENDER: CHECKOUT FORM & MULTI-ITEM ORDER SUMMARY
     ========================================================= */

  return (
    <div className="w-full" style={{ backgroundColor: "#FFFDF8" }}>
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-bold cursor-pointer text-[#5C2A1A] hover:text-[#8A2E2E] transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#9A8A78]">
            <Link to="/" className="hover:text-[#8A2E2E]">Home</Link>
            <ChevronRight size={12} />
            <Link to="/products" className="hover:text-[#8A2E2E]">Sweets</Link>
            <ChevronRight size={12} />
            <span className="text-[#8A2E2E]">Checkout ({totalQuantity})</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#3D1F12] mb-6">
          Checkout & Order Confirmation
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =========================================================
             LEFT COLUMN: CUSTOMER & DELIVERY FORM (7 Cols)
             ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-[#E6CCB2]/40 bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2 pb-4 border-b border-[#F0E4CC] mb-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8A2E2E]/10 text-[#8A2E2E]">
                  <MapPin size={18} />
                </div>
                <div>
                  <h2 className="text-base font-serif font-bold text-[#3D1F12]">
                    Delivery & Customer Details
                  </h2>
                  <p className="text-xs text-[#9A8A78]">
                    Please provide your contact and delivery location
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-[#3D1F12] mb-1">
                    Your Full Name <span className="text-[#8A2E2E]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition outline-none ${
                      errors.name
                        ? "border-rose-400 bg-rose-50/40"
                        : "border-[#E6CCB2] bg-[#FFFDF8] focus:border-[#8A2E2E]"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{errors.name}</p>
                  )}
                </div>

                {/* Mobile & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#3D1F12] mb-1">
                      Mobile Number <span className="text-[#8A2E2E]">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition outline-none ${
                        errors.phone
                          ? "border-rose-400 bg-rose-50/40"
                          : "border-[#E6CCB2] bg-[#FFFDF8] focus:border-[#8A2E2E]"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-rose-500 font-medium">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3D1F12] mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. ramesh@example.com"
                      className="w-full rounded-xl border border-[#E6CCB2] bg-[#FFFDF8] px-3.5 py-2.5 text-sm transition outline-none focus:border-[#8A2E2E]"
                    />
                  </div>
                </div>

                {/* Address Autocomplete & GPS Locate */}
                <div className="relative address-search-wrapper">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#3D1F12]">
                      Delivery Address <span className="text-[#8A2E2E]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleLocateUser}
                      disabled={locating}
                      className="flex items-center gap-1 text-xs font-bold text-[#8A2E2E] hover:underline cursor-pointer disabled:opacity-50"
                    >
                      {locating ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Detecting GPS...</span>
                        </>
                      ) : (
                        <>
                          <MapPin size={13} />
                          <span>Use My Current Location</span>
                        </>
                      )}
                    </button>
                  </div>

                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowDropdown(true);
                    }}
                    placeholder="Search your street, area, or locality..."
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition outline-none ${
                      errors.address
                        ? "border-rose-400 bg-rose-50/40"
                        : "border-[#E6CCB2] bg-[#FFFDF8] focus:border-[#8A2E2E]"
                    }`}
                  />
                  {searching && (
                    <div className="absolute right-3 top-9">
                      <Loader2 size={16} className="animate-spin text-[#DFA250]" />
                    </div>
                  )}

                  {/* Autocomplete suggestions dropdown */}
                  {showDropdown && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-[#E6CCB2] bg-white shadow-lg">
                      {suggestions.map((place) => {
                        const { primary, secondary } = splitDisplayName(place.display_name);
                        return (
                          <div
                            key={place.place_id}
                            onClick={() => handleSelectSuggestion(place)}
                            className="flex cursor-pointer items-start gap-2.5 border-b border-[#FAF6F0] p-3 hover:bg-[#FFF8EC] transition last:border-b-0"
                          >
                            <MapPin size={16} className="mt-0.5 text-[#8A2E2E] shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-[#3D1F12] truncate">{primary}</p>
                              {secondary && (
                                <p className="text-[11px] text-[#9A8A78] truncate">{secondary}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {showDropdown && noResults && !searching && (
                    <div className="absolute left-0 right-0 top-full z-30 mt-1 rounded-xl border border-[#E6CCB2] bg-white p-3 shadow-lg flex items-center gap-2 text-xs text-[#9A8A78]">
                      <SearchX size={15} className="text-[#DFA250]" />
                      <span>No matching address found. Please type manually or use GPS.</span>
                    </div>
                  )}

                  {errors.address && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{errors.address}</p>
                  )}
                </div>

                {/* House No / Landmark */}
                <div>
                  <label className="block text-xs font-bold text-[#3D1F12] mb-1">
                    House / Flat No., Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={form.landmark}
                    onChange={handleChange}
                    placeholder="e.g. Flat 302, Green Valley Apartments, Near Temple"
                    className="w-full rounded-xl border border-[#E6CCB2] bg-[#FFFDF8] px-3.5 py-2.5 text-sm transition outline-none focus:border-[#8A2E2E]"
                  />
                </div>

                {/* Distance & Delivery Calculation Indicator */}
                {distanceKm !== null && (
                  <div className="rounded-2xl bg-[#FAF6F0] p-4 border border-[#F0E4CC]">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#6E5A4F]">Calculated Store Distance:</span>
                      <span className="font-mono text-[#3D1F12]">
                        {distanceKm.toFixed(1)} km from store
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-[#6E5A4F]">Delivery Charge:</span>
                      {outOfRange ? (
                        <span className="font-bold text-rose-600">
                          Out of 15km Delivery Range
                        </span>
                      ) : deliveryCharge === 0 ? (
                        <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800">
                          FREE DELIVERY (Within 2km)
                        </span>
                      ) : (
                        <span className="font-mono font-bold text-[#a65827]">
                          ₹{deliveryCharge}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Location Map View */}
                {coords && (
                  <div className="space-y-1.5 pt-2">
                    <label className="block text-xs font-bold text-[#6E5A4F]">
                      Pinpoint Location (Drag marker to adjust):
                    </label>
                    <div className="h-44 w-full overflow-hidden rounded-2xl border border-[#E6CCB2]">
                      <LocationPicker coords={coords} onLocationChange={handleLocationChange} />
                    </div>
                  </div>
                )}

                {/* Notes / Special Instructions */}
                <div>
                  <label className="block text-xs font-bold text-[#3D1F12] mb-1">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Any specific instructions for packaging or delivery..."
                    className="w-full rounded-xl border border-[#E6CCB2] bg-[#FFFDF8] px-3.5 py-2 text-sm transition outline-none focus:border-[#8A2E2E] resize-none"
                  />
                </div>

                {/* Payment method banner */}
                <div className="flex items-center gap-2 rounded-2xl bg-[#FAF0E6] p-3 border border-[#E8C68A]/50 text-xs font-semibold text-[#5C2A1A]">
                  <ShieldCheck size={18} className="text-[#8A2E2E] shrink-0" />
                  <span>
                    Payment Method: <strong>Cash on Delivery (COD)</strong> upon receipt of fresh sweets.
                  </span>
                </div>

                {/* Mobile submit button */}
                <div className="pt-2 lg:hidden">
                  <button
                    type="submit"
                    disabled={submitting || outOfRange}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#8A2E2E] hover:bg-[#5C2A1A] py-3.5 px-6 font-bold text-white shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Placing Your Order...</span>
                      </>
                    ) : (
                      <span>Place Order • ₹{grandTotal}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* =========================================================
             RIGHT COLUMN: SWEET BOX SUMMARY (5 Cols)
             ========================================================= */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-[#E6CCB2]/40 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0E4CC] mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8A2E2E]/10 text-[#8A2E2E]">
                    <ShoppingBag size={17} />
                  </div>
                  <h2 className="text-base font-serif font-bold text-[#3D1F12]">
                    Order Summary
                  </h2>
                </div>
                <span className="rounded-full bg-[#8A2E2E] px-2.5 py-0.5 text-xs font-bold text-white">
                  {totalQuantity} {totalQuantity === 1 ? "Item" : "Items"}
                </span>
              </div>

              {/* Items List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-[#F0E4CC] pr-1">
                {items.map((item) => {
                  const lineTotal = item.price * item.quantity;
                  const isMax =
                    typeof item.stock === "number" && item.quantity >= item.stock;

                  return (
                    <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex gap-3 items-center">
                      <img
                        src={item.image || "/Mylogo/logo.png"}
                        alt={item.name}
                        className="h-14 w-14 rounded-xl object-cover border border-[#F0E4CC] bg-white shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#3D1F12] truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#9A8A78]">
                          ₹{item.price} {item.unit ? `/ ${item.unit}` : ""}
                        </p>

                        {/* Stepper on checkout */}
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex items-center border border-[#E6CCB2] rounded-md bg-[#FFFDF8] overflow-hidden">
                            <button
                              type="button"
                              onClick={() => {
                                const newQty = item.quantity - 1;
                                dispatch(updateQuantity({ productId: item.id, quantity: newQty }));
                                dispatch(updateBackendCartItem({ productId: item.id, quantity: newQty }));
                              }}
                              className="px-1.5 py-0.5 text-[#5C2A1A] hover:bg-[#FAF6F0] transition"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="px-2 text-xs font-mono font-bold text-[#3D1F12]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={isMax}
                              onClick={() => {
                                const newQty = item.quantity + 1;
                                dispatch(updateQuantity({ productId: item.id, quantity: newQty }));
                                dispatch(updateBackendCartItem({ productId: item.id, quantity: newQty }));
                              }}
                              className="px-1.5 py-0.5 text-[#5C2A1A] hover:bg-[#FAF6F0] transition disabled:opacity-40"
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              dispatch(removeFromCart(item.id));
                              dispatch(removeBackendCartItem(item.id));
                            }}
                            className="p-1 text-[#B0A18E] hover:text-[#8A2E2E] transition"
                            title="Remove item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-black font-mono text-[#a65827]">
                          ₹{lineTotal}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="mt-5 space-y-2.5 border-t border-[#F0E4CC] pt-4 text-xs font-bold text-[#6E5A4F]">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-mono text-[#3D1F12] text-sm">₹{totalAmount}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Estimated Delivery</span>
                  {distanceKm === null ? (
                    <span className="font-medium text-[#9A8A78]">Calculated at address</span>
                  ) : deliveryCharge === 0 ? (
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-emerald-800 font-extrabold">
                      FREE
                    </span>
                  ) : (
                    <span className="font-mono text-[#3D1F12] text-sm">₹{deliveryCharge}</span>
                  )}
                </div>

                <div className="flex justify-between items-baseline border-t border-[#F0E4CC] pt-3 text-sm font-black text-[#3D1F12]">
                  <span>Total Amount</span>
                  <span className="text-2xl font-mono text-[#8A2E2E]">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Desktop Place Order Button */}
              <div className="mt-6 hidden lg:block">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || outOfRange}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#8A2E2E] hover:bg-[#5C2A1A] py-3.5 px-6 font-bold text-white shadow-md shadow-[#8A2E2E]/20 transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Confirming Order...</span>
                    </>
                  ) : (
                    <span>Confirm & Place Order</span>
                  )}
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#9A8A78]">
                <Clock size={13} className="text-[#DFA250]" />
                <span>Estimated preparation & dispatch: 30-45 mins</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
