import { useState, useEffect } from "react";
import { Loader2, AlertTriangle, Receipt } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BillingHeader from "../admin-components/Billing/BillingHeader";
import BillingFilters from "../admin-components/Billing/BillingFilters";
import BillingStats from "../admin-components/Billing/BillingStats";
import BillingTable from "../admin-components/Billing/BillingTable";
import BillDetailModal from "../admin-components/Billing/BillDetailModal";
import { getBills, deleteBill } from "../../redux/features/bill/billThunk";
import { useToast } from "../../context/ToastContext";

const AdminBilling = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const currentUser = useSelector((state) => state.auth.user);
  const isSuperAdmin = currentUser?.role === "super_admin";

  // Redux state
  const { bills = [], pagination, isLoading, error } = useSelector((state) => state.bill);

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

  const handleOpenDetails = (bill) => {
    setSelectedBill(bill);
    setDetailOpen(true);
  };

  const handleDeleteBill = async (billId) => {
    if (!window.confirm("Are you sure you want to delete this bill? This will update the order status and remove the bill.")) {
      return;
    }
    try {
      const result = await dispatch(deleteBill(billId)).unwrap();
      if (result.success) {
        showToast("Bill deleted successfully.", "success");
        setDetailOpen(false);
        // Refresh the bills list
        dispatch(getBills({
          page,
          limit: 10,
          search,
          status: statusFilter === "All" ? undefined : statusFilter,
          billType: typeFilter === "All" ? undefined : typeFilter
        }));
      }
    } catch (err) {
      showToast(err.message || "Failed to delete bill.", "error");
    }
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Header */}
      <BillingHeader onCreateClick={() => navigate("/admin/billing/create")} />

      {/* Stats Panel */}
      <BillingStats bills={bills} totalInvoicesCount={pagination?.total || bills.length} />

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
        <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-10 w-10 text-[#DFA250] animate-spin" />
          <span className="text-xs text-[#6E5A4F] font-semibold">Loading Invoices...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50/50 p-8 rounded-3xl border border-red-200 flex flex-col items-center justify-center text-center space-y-2">
          <AlertTriangle className="h-10 w-10 text-red-600" />
          <span className="text-sm font-bold text-red-800">Connection Failed</span>
          <p className="text-xs text-red-650">Make sure your backend server is running and try again.</p>
          <button 
            onClick={() => dispatch(getBills({ page, limit: 10, search, status: statusFilter === "All" ? undefined : statusFilter, billType: typeFilter === "All" ? undefined : typeFilter }))} 
            className="mt-2 px-4 py-2 bg-red-650 text-white font-semibold text-xs rounded-lg shadow-md hover:bg-red-750 transition"
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

      {/* Bill Details Modal */}
      <BillDetailModal 
        isOpen={detailOpen} 
        bill={selectedBill} 
        onClose={() => setDetailOpen(false)} 
        onDelete={handleDeleteBill}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
};

export default AdminBilling;
