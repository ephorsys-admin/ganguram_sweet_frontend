import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

/**
 * STATIC / DUMMY DATA — shaped exactly like the API response you shared.
 * Once your backend route is ready, replace this with a fetch:
 *
 *   const { slug } = useParams();
 *   const [product, setProduct] = useState(null);
 *   useEffect(() => {
 *     fetch(`/api/products/${slug}`)
 *       .then((res) => res.json())
 *       .then((res) => setProduct(res.data));
 *   }, [slug]);
 */
const STATIC_PRODUCT = {
  _id: "6a684083e60c11e504871645",
  name: "Kaju Katli2",
  category: {
    _id: "6a6469091aecf602e0714970",
    name: "Bengali Sweets",
    slug: "bengali-sweets",
  },
  shortDescription: "Premium Kaju Katli",
  description: "Made with pure cashews",
  images: [
    {
      url: "https://res.cloudinary.com/dpzocdvr3/image/upload/v1785217155/products/xczcl8p00ul3rnmzizif.png",
      publicId: "products/xczcl8p00ul3rnmzizif",
      _id: "6a684083e60c11e504871646",
    },
    {
      url: "https://res.cloudinary.com/dpzocdvr3/image/upload/v1785217156/products/wlshtj5dzzv5ljsd7sx0.png",
      publicId: "products/wlshtj5dzzv5ljsd7sx0",
      _id: "6a684083e60c11e504871647",
    },
  ],
  mrp: 600,
  sellingPrice: 550,
  stock: 100,
  unit: "Box",
  status: true,
  isAvailable: true,
  isFeatured: true,
  isTrending: false,
  isBestSeller: false,
  isNewArrival: false,
  homeDelivery: true,
  allowInquiry: true,
  averageRating: 0,
  totalReviews: 0,
  createdAt: "2026-07-28T05:39:15.610Z",
  updatedAt: "2026-07-28T05:39:15.610Z",
  slug: "kaju-katli2",
  __v: 0,
};

const BADGES = [
  { key: "isBestSeller", label: "Bestseller", color: "#8A2E2E" },
  { key: "isFeatured", label: "Featured", color: "#B8801F" },
  { key: "isTrending", label: "Trending", color: "#2E86DE" },
  { key: "isNewArrival", label: "New Arrival", color: "#2E8B3D" },
];

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Static for now — `slug` from the URL will later select the right product.
  const product = STATIC_PRODUCT;

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const discount = Math.round(
    ((product.mrp - product.sellingPrice) / product.mrp) * 100
  );
  const activeBadges = BADGES.filter((b) => product[b.key]);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

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

    // TODO: replace with your real order API call
    // await fetch("/api/orders", { method: "POST", body: JSON.stringify({ productId: product._id, qty, ...form }) })
    console.log("Order submitted:", { productId: product._id, qty, ...form });
    setSubmitted(true);
  };

  return (
    <div className="w-full" style={{ backgroundColor: "#FFFDF8" }}>
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1.5 text-sm font-bold"
          style={{ color: "#5C2A1A" }}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Gallery */}
          <div>
            <motion.div
              key={product.images[activeImage]?._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-square w-full overflow-hidden rounded-2xl border shadow-sm"
              style={{ borderColor: "#F0E4CC" }}
            >
              <img
                src={product.images[activeImage]?.url}
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
            </motion.div>

            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={img._id}
                    onClick={() => setActiveImage(i)}
                    className="h-16 w-16 overflow-hidden rounded-lg border-2"
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
          >
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#B8801F" }}>
              {product.category?.name}
            </span>

            <h1 className="mt-1 text-2xl font-bold sm:text-3xl" style={{ color: "#3D1F12" }}>
              {product.name}
            </h1>
            <p className="mt-2 text-sm sm:text-base" style={{ color: "#7A5C4A" }}>
              {product.shortDescription}
            </p>

            {(product.totalReviews > 0 || activeBadges.length > 0) && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {product.totalReviews > 0 && (
                  <div className="flex items-center gap-1">
                    <Star size={14} fill="#2E8B3D" color="#2E8B3D" />
                    <span className="text-sm font-semibold" style={{ color: "#2E8B3D" }}>
                      {product.averageRating}
                    </span>
                    <span className="text-sm" style={{ color: "#9A8A78" }}>
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
                <span className="text-base line-through" style={{ color: "#B0A18E" }}>
                  ₹{product.mrp}
                </span>
              )}
              <span className="text-sm" style={{ color: "#9A8A78" }}>
                / {product.unit}
              </span>
            </div>

            <p
              className="mt-1 text-xs font-semibold"
              style={{ color: product.isAvailable ? "#2E8B3D" : "#8A2E2E" }}
            >
              {product.isAvailable ? `In stock (${product.stock} available)` : "Out of stock"}
            </p>

            {/* Quantity */}
            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: "#5C2A1A" }}>
                Quantity
              </p>
              <div
                className="inline-flex items-center gap-4 rounded-lg border-2 px-3 py-2"
                style={{ borderColor: "#E8C68A" }}
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  style={{ color: "#8A2E2E" }}
                >
                  <Minus size={16} />
                </button>
                <span className="min-w-4 text-center text-sm font-bold" style={{ color: "#3D1F12" }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  aria-label="Increase quantity"
                  style={{ color: "#8A2E2E" }}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 border-t pt-5" style={{ borderColor: "#F0E4CC" }}>
              <h2 className="text-sm font-bold" style={{ color: "#3D1F12" }}>
                Description
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                {product.description}
              </p>
            </div>

            {/* Trust badges */}
            <div className="mt-5 flex flex-col gap-2">
              {product.homeDelivery && (
                <div className="flex items-center gap-2 text-sm" style={{ color: "#5C2A1A" }}>
                  <Truck size={16} style={{ color: "#8A2E2E" }} />
                  Home delivery available
                </div>
              )}
              <div className="flex items-center gap-2 text-sm" style={{ color: "#5C2A1A" }}>
                <ShieldCheck size={16} style={{ color: "#8A2E2E" }} />
                Quality checked, freshly packed
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-12 rounded-2xl border p-5 sm:p-8"
          style={{ borderColor: "#F0E4CC", backgroundColor: "#FFFFFF" }}
        >
          <h2 className="text-xl font-bold" style={{ color: "#3D1F12" }}>
            Place Your Order
          </h2>
          <p className="mt-1 text-sm" style={{ color: "#7A5C4A" }}>
            Fill in your details and we'll confirm your order shortly.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex flex-col items-center gap-2 rounded-xl py-10 text-center"
                style={{ backgroundColor: "#FBF3E4" }}
              >
                <CheckCircle2 size={40} style={{ color: "#2E8B3D" }} />
                <p className="text-base font-bold" style={{ color: "#3D1F12" }}>
                  Order request received!
                </p>
                <p className="text-sm" style={{ color: "#7A5C4A" }}>
                  We'll contact you at {form.email} shortly to confirm.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
                noValidate
              >
                <div>
                  <label className="mb-1 block text-xs font-bold" style={{ color: "#5C2A1A" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Your name"
                    className="w-full rounded-lg border-2 px-3 py-2 text-sm outline-none"
                    style={{ borderColor: errors.name ? "#8A2E2E" : "#E8C68A" }}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs font-semibold" style={{ color: "#8A2E2E" }}>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold" style={{ color: "#5C2A1A" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border-2 px-3 py-2 text-sm outline-none"
                    style={{ borderColor: errors.email ? "#8A2E2E" : "#E8C68A" }}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs font-semibold" style={{ color: "#8A2E2E" }}>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold" style={{ color: "#5C2A1A" }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="98765 43210"
                    className="w-full rounded-lg border-2 px-3 py-2 text-sm outline-none"
                    style={{ borderColor: errors.phone ? "#8A2E2E" : "#E8C68A" }}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs font-semibold" style={{ color: "#8A2E2E" }}>
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold" style={{ color: "#5C2A1A" }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={qty}
                    min={1}
                    max={product.stock}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-lg border-2 px-3 py-2 text-sm outline-none"
                    style={{ borderColor: "#E8C68A" }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold" style={{ color: "#5C2A1A" }}>
                    Delivery Address
                  </label>
                  <textarea
                    value={form.address}
                    onChange={handleChange("address")}
                    placeholder="House no., street, city, pincode"
                    rows={3}
                    className="w-full rounded-lg border-2 px-3 py-2 text-sm outline-none"
                    style={{ borderColor: errors.address ? "#8A2E2E" : "#E8C68A" }}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs font-semibold" style={{ color: "#8A2E2E" }}>
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-bold" style={{ color: "#5C2A1A" }}>
                    Special Instructions (optional)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={handleChange("notes")}
                    placeholder="e.g. less sweet, eggless packaging, gift wrap..."
                    rows={2}
                    className="w-full rounded-lg border-2 px-3 py-2 text-sm outline-none"
                    style={{ borderColor: "#E8C68A" }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-lg py-3 text-sm font-bold text-white shadow-sm"
                    style={{ backgroundColor: "#8A2E2E" }}
                  >
                    Place Order — ₹{product.sellingPrice * qty}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;