import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, X } from "lucide-react";
import { CATEGORIES } from "./ShopByCategory";
import ProductCard from "./Productcard";

/**
 * DUMMY DATA — replace with your API response, e.g.
 *   fetch(`/api/products?category=${categoryId}`)
 * Keep the same field names so ProductCard keeps working untouched.
 */
const DUMMY_PRODUCTS = [
  { id: 1, name: "Besan Ladoo", slug: "besan-ladoo", category: "sweets", weight: "500g Box", price: 349, mrp: 449, rating: 4.5, reviews: 210, tag: "Bestseller", bg: "linear-gradient(135deg,#FFE9B8,#D9962E)" },
  { id: 2, name: "Kaju Katli", slug: "kaju-katli", category: "artisanal", weight: "250g Box", price: 399, mrp: 499, rating: 4.7, reviews: 340, tag: "Premium", bg: "linear-gradient(135deg,#FBF3DD,#B8912F)" },
  { id: 3, name: "Gulab Jamun", slug: "gulab-jamun", category: "sweets", weight: "1kg Tin", price: 299, mrp: 349, rating: 4.6, reviews: 512, tag: "Bestseller", bg: "linear-gradient(135deg,#C98B5E,#7A3E22)" },
  { id: 4, name: "Rasgulla", slug: "rasgulla", category: "sweets", weight: "1kg Tin", price: 279, mrp: 320, rating: 4.4, reviews: 189, tag: null, bg: "linear-gradient(135deg,#FFF9EF,#D9BE8A)" },
  { id: 5, name: "Mixture", slug: "mixture", category: "savouries", weight: "400g Pack", price: 149, mrp: 179, rating: 4.3, reviews: 98, tag: null, bg: "linear-gradient(135deg,#F7D154,#C98B22)" },
  { id: 6, name: "Dry Fruit Barfi", slug: "dry-fruit-barfi", category: "artisanal", weight: "400g Box", price: 449, mrp: 549, rating: 4.8, reviews: 156, tag: "New", bg: "linear-gradient(135deg,#F3E3C3,#D9BE8A)" },
  { id: 7, name: "Rasmalai", slug: "rasmalai", category: "sweets", weight: "500g Tub", price: 259, mrp: 299, rating: 4.6, reviews: 231, tag: "Bestseller", bg: "linear-gradient(135deg,#FDEFD8,#E3C079)" },
  { id: 8, name: "Kovilpatti Kadalai Mittai", slug: "kovilpatti-mittai", category: "kovilpatti", weight: "300g Box", price: 149, mrp: 199, rating: 4.5, reviews: 87, tag: "Traditional", bg: "linear-gradient(135deg,#F2A65A,#B85E1F)" },
  { id: 9, name: "Festive Gift Hamper", slug: "festive-gift-hamper", category: "gifting", weight: "1.5kg Hamper", price: 899, mrp: 1099, rating: 4.9, reviews: 88, tag: "Premium", bg: "linear-gradient(135deg,#4C4FCE,#241E5E)" },
  { id: 10, name: "Mango Thokku", slug: "mango-thokku", category: "pickles", weight: "250g Jar", price: 129, mrp: 159, rating: 4.4, reviews: 64, tag: null, bg: "linear-gradient(135deg,#3E8E5A,#D9622E)" },
  { id: 11, name: "Choco Ladoo", slug: "choco-ladoo", category: "newin", weight: "400g Box", price: 329, mrp: 399, rating: 4.6, reviews: 42, tag: "New In", bg: "linear-gradient(135deg,#F0C79A,#B87A3E)" },
  { id: 12, name: "Soan Papdi", slug: "soan-papdi", category: "sweets", weight: "400g Box", price: 199, mrp: 249, rating: 4.2, reviews: 143, tag: null, bg: "linear-gradient(135deg,#FFF3D6,#E0A233)" },
];

const CategoryListing = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const category = CATEGORIES.find((c) => c.id === categoryId);

  const filtered = useMemo(() => {
    const base = DUMMY_PRODUCTS.filter((p) => p.category === categoryId);
    if (!query.trim()) return base;
    return base.filter((p) =>
      p.name.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [categoryId, query]);

  return (
    <div className="w-full" style={{ backgroundColor: "#FFFDF8" }}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-3 flex items-center gap-1.5 text-sm font-bold"
          style={{ color: "#5C2A1A" }}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: "#3D1F12" }}>
            {category?.label || "Products"}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#7A5C4A" }}>
            {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
          </p>
        </motion.div>

        {/* Search field */}
        <div className="relative mt-5 max-w-md">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#9A8A78" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search in ${category?.label || "this category"}...`}
            className="w-full rounded-full border-2 py-2.5 pl-10 pr-9 text-sm outline-none"
            style={{ borderColor: "#E8C68A", color: "#3D1F12" }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "#9A8A78" }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p
            className="mt-16 text-center text-sm font-semibold"
            style={{ color: "#9A8A78" }}
          >
            No sweets matched "{query}" in {category?.label || "this category"}.
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryListing;