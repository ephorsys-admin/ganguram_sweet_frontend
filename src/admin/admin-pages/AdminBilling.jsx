import { useState, useEffect } from "react";
import { Receipt, Search, Filter, Plus, Loader2, AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BillTable from "../admin-components/BillTable";
import BillDetailModal from "../admin-components/modals/BillDetailModal";
import { getBills } from "../../redux/features/bill/billThunk";

const AdminBilling = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { bills = [], isLoading, error } = useSelector((state) => state.bill);

  // Filters State
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  // Detail Modal State
  const [selectedBill, setSelectedBill] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    dispatch(getBills());
  }, [dispatch]);

  const handleOpenDetails = (bill) => {
    setSelectedBill(bill);
    setDetailOpen(true);
  };

  // Filtered bills list
  const filteredBills = bills.filter((b) => {
    const matchesSearch = 
      b.customerName.toLowerCase().includes(search.toLowerCase()) || 
      b.mobile.toLowerCase().includes(search.toLowerCase()) || 
      (b.invoiceNumber && b.invoiceNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesType = typeFilter === "All" || b.billType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3D271B] flex items-center gap-2">
            <Receipt className="text-[#a65827] h-8 w-8" />
            Billing & Invoices
          </h1>
          <p className="text-xs text-[#6E5A4F] mt-1">Generate walk-in receipts, audit transactional invoices, and view order receipts.</p>
        </div>

        <button
          onClick={() => navigate("/admin/billing/create")}
          className="px-4 py-2.5 bg-gradient-to-r from-[#3D271B] to-[#a65827] hover:from-[#a65827] hover:to-[#DFA250] text-[#FAF6F0] text-xs font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={16} /> New Walk-in Bill
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6CCB2]/30 shadow-xs flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full lg:flex-1">
          <Search className="absolute inset-y-0 left-3.5 my-auto text-[#6E5A4F]/50 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by Customer Name, Mobile, or Invoice No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] placeholder-[#6E5A4F]/40 focus:outline-none focus:ring-2 focus:ring-[#a65827]/10"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
          <Filter size={15} className="text-[#a65827]" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="block w-full lg:w-48 px-3 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="WALK_IN">Walk-In Receipts</option>
            <option value="ORDER">Order Invoices</option>
          </select>
        </div>
      </div>

      {/* Bills View Area */}
      {isLoading && bills.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-10 w-10 text-[#DFA250] animate-spin" />
          <span className="text-xs text-[#6E5A4F] font-semibold">Loading Invoices...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50/50 p-8 rounded-3xl border border-red-200 flex flex-col items-center justify-center text-center space-y-2">
          <AlertTriangle className="h-10 w-10 text-red-600" />
          <span className="text-sm font-bold text-red-800">Connection Failed</span>
          <p className="text-xs text-red-600/80">Make sure your backend server is running and try again.</p>
          <button 
            onClick={() => dispatch(getBills())} 
            className="mt-2 px-4 py-2 bg-red-650 text-white font-semibold text-xs rounded-lg shadow-md hover:bg-red-700 transition"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredBills.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 text-center space-y-4 shadow-xs">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#DFA250] border border-[#E6CCB2]/20">
            <Receipt size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#3D271B]">No Invoices Found</h3>
            <p className="text-xs text-[#6E5A4F]">Try adjusting your search criteria or generate a new walk-in bill.</p>
          </div>
        </div>
      ) : (
        <BillTable bills={filteredBills} onViewDetails={handleOpenDetails} />
      )}

      {/* Bill Details Modal */}
      <BillDetailModal isOpen={detailOpen} bill={selectedBill} onClose={() => setDetailOpen(false)} />
    </div>
  );
};

export default AdminBilling;
