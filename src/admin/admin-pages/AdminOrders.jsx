import { useState, useEffect } from "react";
import { ClipboardList, Loader2, AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OrderHeader from "../admin-components/Order/OrderHeader";
import OrderFilters from "../admin-components/Order/OrderFilters";
import OrderTable from "../admin-components/Order/OrderTable";
import { getOrders, updateOrderStatus, generateInvoice } from "../../redux/features/order/orderThunk";
import { getSingleBill } from "../../redux/features/bill/billThunk";
import { getProducts } from "../../redux/features/product/productThunk";
import { useToast } from "../../context/ToastContext";

const AdminOrders = () => {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { orders = [], isLoading, error } = useSelector((state) => state.order);

  // Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeSource, setActiveSource] = useState("Website");

  // Fetch orders and products on mount
  useEffect(() => {
    dispatch(getOrders({ limit: 100 }));
    dispatch(getProducts());
  }, [dispatch]);

  // Query parameter redirect helper (for generating bill from detail page)
  const query = new URLSearchParams(window.location.search);
  const generateBillId = query.get("generateBill");
  useEffect(() => {
    if (generateBillId) {
      navigate(`/admin/billing/create?orderId=${generateBillId}`, { replace: true });
    }
  }, [generateBillId, navigate]);

  const handleUpdateStatus = async (id, newStatus) => {
    const order = orders.find((o) => o._id === id);
    if (!order) return;

    if (newStatus === "Preparing" && !order.billGenerated) {
      showToast("First generate the bill for this order!", "info");
      navigate(`/admin/billing/create?orderId=${order._id}`);
      return;
    }

    if (newStatus === "Preparing" && order.billGenerated) {
      showToast("Bill already generated for this order. Updating status...", "info");
    }

    try {
      const resultAction = await dispatch(updateOrderStatus({ orderId: id, orderStatus: newStatus })).unwrap();
      if (resultAction.success) {
        if (newStatus === "Cancelled") {
          showToast(`Order #${order.orderNumber || id.substring(18)} status set to Cancelled.`, "error");
        } else {
          showToast("Order status updated successfully!", "success");
        }
      }
    } catch (err) {
      showToast(err.message || "Failed to update order status", "error");
    }
  };

  const handleGenerateInvoice = async (order) => {
    if (!order.billGenerated || !order.bill) {
      navigate(`/admin/billing/create?orderId=${order._id}`);
      return;
    }

    showToast("Opening PDF invoice...", "info");
    try {
      const resultAction = await dispatch(getSingleBill(order.bill)).unwrap();
      if (resultAction.success && resultAction.data?.invoiceUrl) {
        window.open(resultAction.data.invoiceUrl, "_blank");
      } else {
        showToast("Invoice URL not found on bill details.", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to retrieve invoice details", "error");
    }
  };

  const handleOpenDetails = (order) => {
    navigate(`/admin/orders/${order._id}`);
  };

  // Filtered orders list based on backend fields
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.customerName.toLowerCase().includes(search.toLowerCase()) || 
      (o.orderNumber && o.orderNumber.toLowerCase().includes(search.toLowerCase())) ||
      o.customerMobile.includes(search);

    const matchesStatus = statusFilter === "All" || o.orderStatus === statusFilter;
    const matchesSource = activeSource === "All" || o.orderSource === activeSource;

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <OrderHeader onCreateClick={() => navigate("/admin/orders/create")} />

      {/* Search & Filters */}
      <OrderFilters 
        search={search} 
        setSearch={setSearch} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
        activeSource={activeSource}
        setActiveSource={setActiveSource}
      />

      {/* Content View */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-10 w-10 text-[#DFA250] animate-spin" />
          <span className="text-xs text-[#6E5A4F] font-semibold">Loading orders catalog...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50/50 p-8 rounded-3xl border border-red-200 flex flex-col items-center justify-center text-center space-y-2">
          <AlertTriangle className="h-10 w-10 text-red-600" />
          <span className="text-sm font-bold text-red-800">Connection Failed</span>
          <p className="text-xs text-red-655">Make sure your backend server is running and try again.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 text-center space-y-4 shadow-xs">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#DFA250] border border-[#E6CCB2]/20">
            <ClipboardList size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#3D271B]">No Orders Found</h3>
            <p className="text-xs text-[#6E5A4F]">Try adjusting your search criteria or create a new order.</p>
          </div>
        </div>
      ) : (
        <OrderTable 
          orders={filteredOrders}
          onViewDetails={handleOpenDetails}
          onUpdateStatus={handleUpdateStatus}
          onDownloadBill={handleGenerateInvoice}
        />
      )}
    </div>
  );
};

export default AdminOrders;
