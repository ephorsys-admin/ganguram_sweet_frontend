import { useState, useEffect } from "react";
import { ClipboardList, Search, Filter, Plus, Loader2, AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OrderTable from "../admin-components/OrderTable";
import CreateOrderBillModal from "../admin-components/modals/CreateOrderBillModal";
import { getOrders, updateOrderStatus, deleteOrderRequest, generateInvoice, createAdminOrder } from "../../redux/features/order/orderThunk";
import { createOrderBill, getSingleBill } from "../../redux/features/bill/billThunk";
import { getProducts } from "../../redux/features/product/productThunk";
import { useToast } from "../../context/ToastContext";

const AdminOrders = () => {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { orders = [], isLoading, error } = useSelector((state) => state.order);
  const { products = [] } = useSelector((state) => state.product);

  // Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Order Bill Generation Modal State
  const [orderBillModalOpen, setOrderBillModalOpen] = useState(false);
  const [selectedOrderForBill, setSelectedOrderForBill] = useState(null);
  const [isBillGenerating, setIsBillGenerating] = useState(false);

  // Fetch orders and products on mount
  useEffect(() => {
    dispatch(getOrders());
    dispatch(getProducts());
  }, [dispatch]);

  // Query parameter redirect helper (for generating bill from detail page)
  const query = new URLSearchParams(window.location.search);
  const generateBillId = query.get("generateBill");
  useEffect(() => {
    if (generateBillId && orders.length > 0) {
      const targetOrder = orders.find((o) => o._id === generateBillId);
      if (targetOrder && !targetOrder.billGenerated) {
        setSelectedOrderForBill(targetOrder);
        setOrderBillModalOpen(true);
        // Clear query parameter
        navigate("/admin/orders", { replace: true });
      }
    }
  }, [generateBillId, orders, navigate]);



  const handleUpdateStatus = async (id, newStatus) => {
    const order = orders.find((o) => o._id === id);
    if (!order) return;

    if (newStatus === "Preparing" && !order.billGenerated) {
      setSelectedOrderForBill(order);
      setOrderBillModalOpen(true);
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

  const handleCreateOrderBillSubmit = async (billForm) => {
    setIsBillGenerating(true);
    try {
      const resultAction = await dispatch(createOrderBill(billForm)).unwrap();
      if (resultAction.success) {
        showToast("Order bill generated successfully!", "success");
        
        // Open the generated PDF receipt from Cloudinary in a new browser tab
        if (resultAction.data?.invoiceUrl) {
          window.open(resultAction.data.invoiceUrl, "_blank");
        }

        // Shift status to Preparing
        const statusResult = await dispatch(
          updateOrderStatus({ orderId: billForm.orderId, orderStatus: "Preparing" })
        ).unwrap();

        if (statusResult.success) {
          showToast("Order status shifted to Preparing!", "success");
          setOrderBillModalOpen(false);
          dispatch(getOrders());
        }
      }
    } catch (err) {
      showToast(err.message || "Failed to generate bill or update status", "error");
    } finally {
      setIsBillGenerating(false);
    }
  };

  const handleDeleteOrder = async (id) => {
    const reason = window.prompt("Please enter the reason for deleting this order (minimum 5 characters):");
    if (reason === null) return; // user cancelled prompt

    if (reason.trim().length < 5) {
      showToast("Delete reason must be at least 5 characters.", "error");
      return;
    }

    try {
      const resultAction = await dispatch(deleteOrderRequest({ orderId: id, reason: reason.trim() })).unwrap();
      if (resultAction.success) {
        showToast("Order delete request submitted to Super Admin successfully!", "success");
        setDetailsOpen(false);
      }
    } catch (err) {
      showToast(err.message || "Failed to submit delete request", "error");
    }
  };

  const handleGenerateInvoice = async (order) => {
    if (!order.billGenerated || !order.bill) {
      setSelectedOrderForBill(order);
      setOrderBillModalOpen(true);
      return;
    }

    showToast("Bill already generated for this order. Opening PDF invoice...", "info");
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
      o._id.toLowerCase().includes(search.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3D271B] flex items-center gap-2">
            <ClipboardList className="text-[#a65827] h-8 w-8" />
            Manage Orders
          </h1>
          <p className="text-xs text-[#6E5A4F] mt-1">Audit transactions, manage delivery statuses, and view customer details.</p>
        </div>

        <button
          onClick={() => navigate("/admin/orders/create")}
          className="px-4 py-2.5 bg-gradient-to-r from-[#3D271B] to-[#a65827] hover:from-[#a65827] hover:to-[#DFA250] text-[#FAF6F0] text-xs font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={16} /> Create Order
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

      {/* Orders Grid/Table Component */}
      {isLoading && orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-10 w-10 text-[#DFA250] animate-spin" />
          <span className="text-xs text-[#6E5A4F] font-semibold">Loading Sweet Orders...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50/50 p-8 rounded-3xl border border-red-200 flex flex-col items-center justify-center text-center space-y-2">
          <AlertTriangle className="h-10 w-10 text-red-600" />
          <span className="text-sm font-bold text-red-800">Connection Failed</span>
          <p className="text-xs text-red-600/80">Make sure your backend server is running and try again.</p>
          <button 
            onClick={() => dispatch(getOrders())} 
            className="mt-2 px-4 py-2 bg-red-650 text-white font-semibold text-xs rounded-lg shadow-md hover:bg-red-700 transition"
          >
            Retry Connection
          </button>
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
        />
      )}



      {/* Order Bill Generation Modal Component */}
      <CreateOrderBillModal
        isOpen={orderBillModalOpen}
        order={selectedOrderForBill}
        onClose={() => setOrderBillModalOpen(false)}
        onSubmit={handleCreateOrderBillSubmit}
        isLoading={isBillGenerating}
      />
    </div>
  );
};

export default AdminOrders;
