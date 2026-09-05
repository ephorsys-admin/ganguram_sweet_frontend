import { Search, Filter } from "lucide-react";

const ProductFilters = ({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  categories,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-[#E6CCB2]/30 shadow-xs flex flex-col lg:flex-row gap-4 items-center">
      {/* Search */}
      <div className="relative w-full lg:flex-1">
        <Search className="absolute inset-y-0 left-3.5 my-auto text-[#6E5A4F]/50 h-4 w-4" />
        <input
          type="text"
          placeholder="Search sweets by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] placeholder-[#6E5A4F]/40 focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 focus:border-[#a65827] transition"
        />
      </div>

      {/* Filter Dropdown */}
      <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
        <Filter size={15} className="text-[#a65827]" />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="block w-full lg:w-48 px-3 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 focus:border-[#a65827] transition"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;
