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
    <div className="bg-white border border-[#E6CCB2]/40 rounded-3xl p-4 sm:p-5 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 shadow-xs">
      {/* Search */}
      <div className="relative w-full xl:w-96 shrink-0">
        <input
          type="text"
          placeholder="Search by Invoice #, Customer or Mobile..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full bg-[#FAF6F0]/30 border border-[#E6CCB2]/40 text-[#3D271B] placeholder-[#6E5A4F]/60 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827] transition font-semibold text-sm sm:text-base"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E5A4F]/60 pointer-events-none" />
      </div>

      {/* Type & Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
        {/* Bill Type Dropdown */}
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-3 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 text-[#3D271B] rounded-2xl text-sm sm:text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 w-full sm:w-auto shrink-0 cursor-pointer"
        >
          <option value="All">All Types</option>
          <option value="WALK_IN">Walk-In Receipts</option>
          <option value="ORDER">Order Invoices</option>
        </select>

        {/* Status Tabs */}
        <div className="flex bg-[#FAF6F0] p-1.5 rounded-2xl border border-[#E6CCB2]/30 gap-1 justify-between sm:justify-start w-full sm:w-auto overflow-x-auto">
          {["All", "Generated", "Paid", "Cancelled"].map((status) => (
            <button
              type="button"
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex-1 sm:flex-none text-center ${
                statusFilter === status
                  ? "bg-[#3D271B] text-[#FAF6F0] shadow-sm"
                  : "text-[#6E5A4F] hover:text-[#3D271B] hover:bg-white/50"
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
