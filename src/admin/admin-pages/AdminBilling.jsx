import { useState, useEffect } from "react";
import { Loader2, AlertTriangle, Receipt } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BillingHeader from "../admin-components/Billing/BillingHeader";
import BillingFilters from "../admin-components/Billing/BillingFilters";
import BillingStats from "../admin-components/Billing/BillingStats";
import BillingTable from "../admin-components/Billing/BillingTable";
import BillDetailModal from "../admin-components/Billing/BillDetailModal";
import { getBills, getBillsForStats } from "../../redux/features/bill/billThunk";
import { useToast } from "../../context/ToastContext";

const AdminBilling = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const currentUser = useSelector((state) => state.auth.user);
  const isSuperAdmin = currentUser?.role === "super_admin";

  // Redux state
  const { bills = [], pagination, isLoading, error, statsBills = [] } = useSelector((state) => state.bill);

  // Filters State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // Detail Modal State
  const [selectedBill, setSelectedBill] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Fetch data on filters/pagination change
  useEffect(() => {
    dispatch(getBills({
      page,
      limit: 10,
      search,
      status: statusFilter === "All" ? undefined : statusFilter,
      billType: typeFilter === "All" ? undefined : typeFilter
    }));
  }, [dispatch, page, search, statusFilter, typeFilter]);

  // Fetch all bills for stats calculation (without page and status, and with high limit)
  useEffect(() => {
    dispatch(getBillsForStats({
      limit: 100000,
      search,
      billType: typeFilter === "All" ? undefined : typeFilter
    }));
  }, [dispatch, search, typeFilter]);

  const handleOpenDetails = (bill) => {
    setSelectedBill(bill);
    setDetailOpen(true);
  };



  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <BillingHeader onCreateClick={() => navigate("/admin/billing/create")} />

      {/* Stats Panel */}
      <BillingStats
        bills={statsBills}
        totalInvoicesCount={statsBills.length}
        isSuperAdmin={isSuperAdmin}
      />

      {/* Filters */}
      <BillingFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        setPage={setPage}
      />

      {/* Bills View Area */}
      {isLoading && bills.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center space-y-4 min-h-[300px]">
          <Loader2 className="h-12 w-12 text-[#DFA250] animate-spin" />
          <span className="text-sm md:text-base text-[#6E5A4F] font-semibold">Loading Invoices...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50/60 p-8 rounded-3xl border border-red-200 flex flex-col items-center justify-center text-center space-y-3">
          <AlertTriangle className="h-12 w-12 text-red-600" />
          <span className="text-base font-bold text-red-800">Connection Failed</span>
          <p className="text-sm text-red-600">Make sure your backend server is running and try again.</p>
          <button 
            onClick={() => dispatch(getBills({ page, limit: 10, search, status: statusFilter === "All" ? undefined : statusFilter, billType: typeFilter === "All" ? undefined : typeFilter }))} 
            className="mt-2 px-6 py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl shadow-md hover:bg-red-700 transition cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <BillingTable 
          bills={bills} 
          pagination={pagination}
          setPage={setPage}
          onViewDetails={handleOpenDetails}
          search={search}
          statusFilter={statusFilter}
        />
      )}

      <BillDetailModal 
        isOpen={detailOpen} 
        bill={selectedBill} 
        onClose={() => setDetailOpen(false)} 
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
};

export default AdminBilling;
