import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChefHat, Search, X, Loader2 } from "lucide-react";
import ProductCard from "../web-components/Productcard";
import { useGetProductsPublicQuery, useGetCategoriesPublicQuery } from "../../redux/services/adminApi";

const OurSweets = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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
            Explore Our Sweets
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

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col md:flex-row gap-4 items-center max-w-4xl mx-auto">
          {/* Search bar */}
          <div className="relative w-full md:flex-1">
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

          {/* Category Filter */}
          <div className="w-full md:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl focus:outline-none text-xs font-semibold text-[#3D271B]"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
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
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OurSweets;
