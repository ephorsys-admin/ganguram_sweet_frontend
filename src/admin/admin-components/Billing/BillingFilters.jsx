import { Search } from "lucide-react";

export default function BillingFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  setPage,
}) {
  return (
    <div className="bg-[#FAF6F0]/40 border border-[#E6CCB2]/20 rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
      {/* Search */}
      <div className="relative w-full md:w-80 shrink-0">
        <input
          type="text"
          placeholder="Search by Invoice #, Customer or Mobile..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full bg-white border border-[#E6CCB2]/30 text-[#3D271B] rounded-xl pl-11 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 focus:border-[#a65827] transition font-semibold text-xs"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E5A4F]/50 pointer-events-none" />
      </div>

      {/* Type & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        {/* Bill Type Dropdown */}
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2 bg-white border border-[#E6CCB2]/30 text-[#3D271B] rounded-xl text-xs font-bold focus:outline-none w-full sm:w-auto cursor-pointer"
        >
          <option value="All">All Types</option>
          <option value="WALK_IN">Walk-In Receipts</option>
          <option value="ORDER">Order Invoices</option>
        </select>

        {/* Status Tabs */}
        <div className="flex bg-[#FAF6F0] p-1 rounded-xl border border-[#E6CCB2]/20 gap-1 justify-between sm:justify-start w-full sm:w-auto overflow-x-auto">
          {["All", "Generated", "Paid", "Cancelled"].map((status) => (
            <button
              type="button"
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex-1 sm:flex-none text-center ${
                statusFilter === status
                  ? "bg-[#3D271B] text-[#FAF6F0] shadow-xs"
                  : "text-[#6E5A4F] hover:text-[#3D271B]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
