import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Minus,
  Plus,
  CheckCircle2,
  Loader2,
  MapPin,
  Home,
  AlertCircle,
  SearchX,
} from "lucide-react";
import { useGetProductDetailsPublicQuery } from "../../redux/services/adminApi";
import { useDispatch } from "react-redux";
import { createPublicOrder } from "../../redux/features/order/orderThunk";
import LocationPicker from "./LocationPicker";

/* =========================================================
   STORE LOCATION + DISTANCE + DELIVERY CHARGE UTILITIES
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
  return null; // out of delivery range
}

/* =========================================================
   ADDRESS AUTOCOMPLETE HOOK (Nominatim /search)

   Nominatim frequently indexes small localities (villages, post
   offices, panchayats) only by their bare name — a query like
   "Sundarpada Post Office" can return nothing even though
   "Sundarpada" alone would match. To make search actually find
   these places we:
     1. Bias results toward the store's region with a viewbox
        (without hard-restricting to it, via bounded=0).
     2. If the raw query returns nothing, retry after stripping
        generic locality words (Post Office, Panchayat, Village...).
     3. If that still returns nothing, retry once more with
        ", India" appended to help disambiguate short place names.
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

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
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

        // Ignore stale responses if the user kept typing
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

/* =========================================================
   SUGGESTION TYPE LABEL — turns Nominatim's raw `type`/`class`
   into a short readable tag (Village, Post Office, Town...)
   ========================================================= */

const TYPE_LABELS = {
  post_office: "Post Office",
  village: "Village",
  hamlet: "Hamlet",
  town: "Town",
  city: "City",
  suburb: "Suburb",
  neighbourhood: "Neighbourhood",
  administrative: "Area",
  county: "District",
  state_district: "District",
};

function getTypeLabel(place) {
  const key = place.type || place.class;
  if (!key) return null;
  return TYPE_LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function splitDisplayName(displayName) {
  const parts = (displayName || "").split(",").map((p) => p.trim());
  return {
    primary: parts[0] || displayName,
    secondary: parts.slice(1).join(", "),
  };
}

const OrderPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: response, isLoading, isError } = useGetProductDetailsPublicQuery(productId);

  // API sometimes returns `data` as a list ([{...}]) and sometimes as a
  // single object — support both shapes safely.
  const product = useMemo(() => {
    const raw = response?.data;
    if (Array.isArray(raw)) return raw[0] ?? null;
    return raw ?? null;
  }, [response]);

  const [qty, setQty] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  const { suggestions, searching, noResults, searchAddress, setSuggestions, setNoResults } = useAddressSearch();

  // Close dropdown on outside click
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

  const itemsTotal = (product?.sellingPrice || 0) * qty;
  const grandTotal = itemsTotal + (deliveryCharge || 0);

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
        setForm((prev) => ({ ...prev, address: data.display_name }));
        setErrors((prev) => ({ ...prev, address: "" }));
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  const handleAddressInput = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, address: value }));
    setCoords(null);
    setShowDropdown(true);
    searchAddress(value);
    if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
  };

  const handleSelectSuggestion = (place) => {
    setForm((prev) => ({ ...prev, address: place.display_name }));
    setCoords({ lat: parseFloat(place.lat), lon: parseFloat(place.lon) });
    setSuggestions([]);
    setNoResults(false);
    setShowDropdown(false);
    setErrors((prev) => ({ ...prev, address: "" }));
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
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, "")))
      errs.phone = "Enter a valid 10-digit number";
    if (!form.address.trim()) errs.address = "Delivery address is required";
    else if (form.address.trim().length < 10) errs.address = "Address must be at least 10 characters";
    else if (!coords) errs.address = "Please select an address from the suggestions list";
    else if (outOfRange) errs.address = "Sorry, we don't deliver to this location";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);

    try {
      const resultAction = await dispatch(
        createPublicOrder({
          product: product._id,
          quantity: qty,
          customerName: form.name.trim(),
          customerEmail: form.email.trim(),
          customerMobile: form.phone.trim(),
          deliveryAddress: form.address.trim(),
          landmark: form.landmark.trim(),
          specialInstructions: form.notes.trim(),
          deliveryLat: coords?.lat,
          deliveryLon: coords?.lon,
          distanceKm: distanceKm ? Number(distanceKm.toFixed(2)) : null,
          deliveryCharge: deliveryCharge || 0,
          itemsTotal,
          grandTotal,
        })
      ).unwrap();

      if (resultAction.success) {
        setSubmitted(true);
      } else {
        alert(resultAction.message || "Failed to place order. Please try again.");
      }
    } catch (err) {
      alert(err.message || "Something went wrong while placing your order. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center" style={{ backgroundColor: "#FFFDF8" }}>
        <Loader2 className="h-8 w-8 text-[#DFA250] animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-4" style={{ backgroundColor: "#FFFDF8" }}>
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

  return (
    <div className="w-full" style={{ backgroundColor: "#FFFDF8" }}>
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1.5 text-sm font-bold cursor-pointer"
          style={{ color: "#5C2A1A" }}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Mini product summary */}
        <div className="flex items-center gap-3 rounded-2xl border border-[#E6CCB2]/30 bg-white p-4 shadow-xs">
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-[#F0E4CC]">
            <img
              src={product.images?.[0]?.url || "/Mylogo/logo.png"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-serif text-base font-bold" style={{ color: "#3D1F12" }}>
              {product.name}
            </p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-sm font-bold" style={{ color: "#3D1F12" }}>
                ₹{product.sellingPrice}
              </span>
              {product.mrp > product.sellingPrice && (
                <span className="text-xs line-through text-[#B0A18E]">₹{product.mrp}</span>
              )}
              <span className="text-xs text-[#9A8A78]">/ {product.unit}</span>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 rounded-2xl border p-5 sm:p-8 bg-white border-[#F0E4CC]"
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
                <button
                  onClick={() => navigate("/")}
                  className="mt-3 rounded-lg bg-[#8A2E2E] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#5C2A1A] cursor-pointer"
                >
                  Continue Shopping
                </button>
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
                {/* Quantity Selector */}
                <div className="sm:col-span-2">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: "#5C2A1A" }}>
                    Quantity
                  </p>
                  <div className="inline-flex items-center gap-4 rounded-lg border border-[#E8C68A] px-3.5 py-2 bg-white shadow-inner">
                    <button
                      type="button"
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
                      type="button"
                      onClick={() => setQty((q) => Math.min(product.stock || 100, q + 1))}
                      aria-label="Increase quantity"
                      style={{ color: "#8A2E2E" }}
                      className="cursor-pointer font-bold"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

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
                    <p className="mt-1 text-xs font-semibold text-[#8A2E2E]">{errors.name}</p>
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
                    <p className="mt-1 text-xs font-semibold text-[#8A2E2E]">{errors.email}</p>
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
                    <p className="mt-1 text-xs font-semibold text-[#8A2E2E]">{errors.phone}</p>
                  )}
                </div>

                {/* House No. / Landmark */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#5C2A1A]">
                    House No. / Landmark (Optional)
                  </label>
                  <div className="relative">
                    <Home size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A18E]" />
                    <input
                      type="text"
                      value={form.landmark}
                      onChange={handleChange("landmark")}
                      placeholder="e.g. House No. 12, Near Shiv Mandir"
                      className="w-full rounded-lg border border-[#E8C68A] pl-8 pr-3 py-2 text-sm outline-none bg-white focus:ring-1 focus:ring-[#8A2E2E]"
                    />
                  </div>
                </div>

                {/* ---------------- Address with Autocomplete ---------------- */}
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
                    <div className="relative address-search-wrapper">
                      <input
                        type="text"
                        value={form.address}
                        onChange={handleAddressInput}
                        onFocus={() => setShowDropdown(true)}
                        placeholder="Search village, post office, town, landmark..."
                        autoComplete="off"
                        className="w-full rounded-lg border border-[#E8C68A] px-3 py-2 text-sm outline-none bg-white focus:ring-1 focus:ring-[#8A2E2E] font-sans"
                        style={{ borderColor: errors.address ? "#8A2E2E" : "#E8C68A" }}
                      />

                      {searching && (
                        <Loader2
                          size={14}
                          className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[#8A2E2E]"
                        />
                      )}

                      {showDropdown && suggestions.length > 0 && (
                        <div className="absolute z-30 mt-1 w-full bg-white border border-[#E8C68A] rounded-lg shadow-lg max-h-64 overflow-y-auto">
                          {suggestions.map((place) => {
                            const { primary, secondary } = splitDisplayName(place.display_name);
                            const typeLabel = getTypeLabel(place);
                            return (
                              <button
                                type="button"
                                key={place.place_id}
                                onClick={() => handleSelectSuggestion(place)}
                                className="w-full text-left px-3 py-2.5 hover:bg-[#FAF6F0] border-b border-[#F0E4CC] last:border-0 flex items-start gap-2 cursor-pointer"
                              >
                                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-[#8A2E2E]" />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="truncate text-xs font-semibold text-[#3D1F12]">
                                      {primary}
                                    </span>
                                    {typeLabel && (
                                      <span className="flex-shrink-0 rounded-full bg-[#F1E4CC] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#B8801F]">
                                        {typeLabel}
                                      </span>
                                    )}
                                  </div>
                                  {secondary && (
                                    <p className="mt-0.5 truncate text-[11px] text-[#9A8A78]">{secondary}</p>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {showDropdown && !searching && noResults && form.address.trim().length >= 3 && (
                        <div className="absolute z-30 mt-1 w-full rounded-lg border border-[#E8C68A] bg-white p-3 shadow-lg">
                          <div className="flex items-start gap-2">
                            <SearchX size={16} className="mt-0.5 flex-shrink-0 text-[#B0A18E]" />
                            <p className="text-xs text-[#9A8A78]">
                              No matching places found. Try just the village/town name, a nearby
                              landmark, or your PIN code — you can always add exact details in
                              "House No. / Landmark" above.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {coords && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="h-[150px] rounded-lg overflow-hidden border border-[#E8C68A] relative shadow-xs bg-white"
                      >
                        <LocationPicker coords={coords} onLocationChange={handleLocationChange} />
                      </motion.div>
                    )}
                  </div>

                  {errors.address && (
                    <p className="mt-1 text-xs font-semibold text-[#8A2E2E] flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.address}
                    </p>
                  )}

                  {/* Distance & Delivery Charge Info */}
                  {coords && distanceKm !== null && (
                    <div
                      className="mt-2 rounded-lg px-3 py-2 text-xs font-semibold flex items-center justify-between"
                      style={{
                        backgroundColor: outOfRange ? "#FBEAEA" : "#F1F8F0",
                        color: outOfRange ? "#8A2E2E" : "#2E8B3D",
                      }}
                    >
                      <span>Distance from store: {distanceKm.toFixed(1)} km</span>
                      {outOfRange ? (
                        <span>Outside delivery range</span>
                      ) : deliveryCharge === 0 ? (
                        <span>Free Delivery 🎉</span>
                      ) : (
                        <span>Delivery Charge: ₹{deliveryCharge}</span>
                      )}
                    </div>
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

                {/* Price Summary */}
                <div className="sm:col-span-2 rounded-lg bg-[#FAF6F0] px-4 py-3 text-sm text-[#3D1F12] space-y-1">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span className="font-semibold">₹{itemsTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="font-semibold">
                      {coords ? `₹${deliveryCharge || 0}` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#E6CCB2]/50 pt-1 mt-1 font-bold">
                    <span>Grand Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting || outOfRange}
                    className="w-full bg-[#8A2E2E] hover:bg-[#5C2A1A] text-white font-bold py-3 px-6 rounded-lg text-sm transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" /> Placing Order...
                      </>
                    ) : (
                      `Place Order — ₹${grandTotal}`
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderPage;