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
      <div className="flex bg-[#FAF6F0]/60 p-1 rounded-2xl border border-[#E6CCB2]/20 w-fit gap-1">
        <button
          type="button"
          onClick={() => setActiveSource("Website")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
            activeSource === "Website"
              ? "bg-[#3D271B] text-[#FAF6F0] shadow-md shadow-[#3D271B]/15"
              : "text-[#6E5A4F] hover:text-[#3D271B] hover:bg-[#FAF6F0]"
          }`}
        >
          <Globe size={14} className={activeSource === "Website" ? "text-[#DFA250]" : "text-[#a65827]"} />
          Website Orders
        </button>
        <button
          type="button"
          onClick={() => setActiveSource("Admin")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
            activeSource === "Admin"
              ? "bg-[#3D271B] text-[#FAF6F0] shadow-md shadow-[#3D271B]/15"
              : "text-[#6E5A4F] hover:text-[#3D271B] hover:bg-[#FAF6F0]"
          }`}
        >
          <UserCog size={14} className={activeSource === "Admin" ? "text-[#DFA250]" : "text-[#a65827]"} />
          Admin Orders
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6CCB2]/30 shadow-xs flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full lg:flex-1">
          <Search className="absolute inset-y-0 left-3.5 my-auto text-[#6E5A4F]/50 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] placeholder-[#6E5A4F]/40 focus:outline-none focus:ring-2 focus:ring-[#a65827]/10"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
          <Filter size={15} className="text-[#a65827]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full lg:w-48 px-3 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none"
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
