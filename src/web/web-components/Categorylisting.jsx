import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, X, Loader2 } from "lucide-react";
import ProductCard from "./Productcard";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesPublic } from "../../redux/features/category/categoryThunk";
import { getProductsPublic } from "../../redux/features/product/productThunk";

const CategoryListing = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");

  const { categories = [], isLoading: catsLoading } = useSelector((state) => state.category);
  const { products = [], isLoading: prodsLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getCategoriesPublic());
    dispatch(getProductsPublic());
  }, [dispatch]);

  const category = categories.find((c) => c._id === categoryId);

  const filtered = useMemo(() => {
    const base = products.filter((p) => p.category?._id === categoryId && p.status !== false);
    if (!query.trim()) return base;
    return base.filter((p) =>
      p.name.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [categoryId, products, query]);

  const isLoading = catsLoading || prodsLoading;

  return (
    <div className="w-full" style={{ backgroundColor: "#FFFDF8" }}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-3 flex items-center gap-1.5 text-sm font-bold cursor-pointer"
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
            {category?.name || "Products"}
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
            placeholder={`Search in ${category?.name || "this category"}...`}
            className="w-full rounded-full border-2 py-2.5 pl-10 pr-9 text-sm outline-none"
            style={{ borderColor: "#E8C68A", color: "#3D1F12" }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              style={{ color: "#9A8A78" }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Product grid */}
        {isLoading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-8 w-8 text-[#DFA250] animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p
            className="mt-16 text-center text-sm font-semibold"
            style={{ color: "#9A8A78" }}
          >
            No sweets matched "{query}" in {category?.name || "this category"}.
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoryListing;