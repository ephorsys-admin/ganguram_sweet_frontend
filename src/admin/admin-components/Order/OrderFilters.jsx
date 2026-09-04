import { Search, Filter, Globe, UserCog } from "lucide-react";

const OrderFilters = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  activeSource,
  setActiveSource,
}) => {
  return (
    <div className="space-y-4">
      {/* Source Tabs */}
      <div className="flex bg-[#FAF6F0] p-1.5 rounded-2xl border border-[#E6CCB2]/30 w-full sm:w-fit gap-1.5 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSource("Website")}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 cursor-pointer flex-1 sm:flex-none ${
            activeSource === "Website"
              ? "bg-[#3D271B] text-[#FAF6F0] shadow-md shadow-[#3D271B]/15"
              : "text-[#6E5A4F] hover:text-[#3D271B] hover:bg-white/60"
          }`}
        >
          <Globe size={18} className={activeSource === "Website" ? "text-[#DFA250]" : "text-[#a65827]"} />
          <span>Website Orders</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSource("Admin")}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 cursor-pointer flex-1 sm:flex-none ${
            activeSource === "Admin"
              ? "bg-[#3D271B] text-[#FAF6F0] shadow-md shadow-[#3D271B]/15"
              : "text-[#6E5A4F] hover:text-[#3D271B] hover:bg-white/60"
          }`}
        >
          <UserCog size={18} className={activeSource === "Admin" ? "text-[#DFA250]" : "text-[#a65827]"} />
          <span>Admin Orders</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full lg:flex-1">
          <Search className="absolute inset-y-0 left-4 my-auto text-[#6E5A4F]/60 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name, or Mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 bg-[#FAF6F0]/30 border border-[#E6CCB2]/40 rounded-2xl text-sm sm:text-base text-[#3D271B] placeholder-[#6E5A4F]/50 focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827] font-semibold"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0">
          <Filter size={18} className="text-[#a65827] shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full lg:w-56 px-4 py-3 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl text-sm sm:text-base text-[#3D271B] font-bold focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Out For Delivery">Out For Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
