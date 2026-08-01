import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, User, Calendar, MapPin, ShoppingBag, Trash2, FileText, Loader2, Navigation } from "lucide-react";
import { getSingleOrder, deleteOrderRequest, approveDeleteRequest } from "../../redux/features/order/orderThunk";
import { getSingleBill } from "../../redux/features/bill/billThunk";
import { useToast } from "../../context/ToastContext";

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { currentOrder: order, isLoading, error } = useSelector((state) => state.order);
  const currentUser = useSelector((state) => state.auth.user);
  const isSuperAdmin = currentUser?.role === "super_admin";
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      dispatch(getSingleOrder(orderId));
    }
  }, [dispatch, orderId]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-600";
      case "Out For Delivery":
        return "bg-purple-600";
      case "Preparing":
        return "bg-orange-500";
      case "Confirmed":
        return "bg-blue-600";
      case "Pending":
        return "bg-amber-500";
      case "Cancelled":
      default:
        return "bg-slate-500";
    }
  };

  const handleInvoiceClick = async () => {
    if (!order) return;
    setInvoiceLoading(true);
    try {
      if (!order.billGenerated || !order.bill) {
        // Bill generation flow ke liye orders page pe redirect, modal wahin open hoga
        showToast("Generating bill for order. Redirecting...", "info");
        navigate(`/admin/orders?generateBill=${order._id}`);
        return;
      }

      const resultAction = await dispatch(getSingleBill(order.bill)).unwrap();
      if (resultAction.success && resultAction.data?.invoiceUrl) {
        window.open(resultAction.data.invoiceUrl, "_blank");
      } else {
        showToast("Invoice URL not found on bill details.", "error");
      }
    } catch (err) {
      showToast(err.message || "Failed to retrieve invoice details", "error");
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!order) return;
    const actionText = isSuperAdmin ? "deleting" : "requesting deletion of";
    const reason = window.prompt(`Please enter the reason for ${actionText} this order (minimum 5 characters):`);
    if (reason === null) return;

    if (reason.trim().length < 5) {
      showToast("Delete reason must be at least 5 characters.", "error");
      return;
    }

    try {
      const resultAction = await dispatch(deleteOrderRequest({ orderId: order._id, reason: reason.trim() })).unwrap();
      if (resultAction.success) {
        if (isSuperAdmin) {
          const requestId = resultAction.data?._id;
          if (requestId) {
            await dispatch(approveDeleteRequest(requestId)).unwrap();
            showToast("Order deleted successfully!", "success");
          } else {
            showToast("Order deletion request created, but request ID was not found.", "error");
          }
        } else {
          showToast("Order delete request submitted to Super Admin successfully!", "success");
        }
        navigate("/admin/orders");
      }
    } catch (err) {
      showToast(err.message || "Failed to process delete operation", "error");
    }
  };

  if (isLoading || !order) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="h-10 w-10 text-[#DFA250] animate-spin" />
        <span className="text-xs text-[#6E5A4F] font-semibold">Loading Order Details...</span>
      </div>
    );
  }

  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : "—";

  // subTotal/deliveryCharge backend se seedhe aa rahe hain, ab in hi ko use karenge
  // (pehle hardcoded ₹0 tax dikha rahe the, ab actual delivery charge dikhega)
  const subTotal = order.subTotal ?? order.totalAmount;
  const deliveryCharge = order.deliveryCharge ?? 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Back Action */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/orders")}
            className="p-2 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-xl border border-[#E6CCB2]/20 transition shadow-xs"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-black text-[#3D271B] flex items-center gap-2">
              Order Detail
              <span className="font-mono text-xs text-[#a65827] bg-[#FAF6F0] px-2.5 py-1 rounded-lg font-bold">
                {order.orderNumber || order._id.substring(18)}
              </span>
            </h1>
            <p className="text-[10px] sm:text-xs text-[#6E5A4F] font-sans">Placed on {dateStr}</p>
          </div>
        </div>
        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider ${getStatusStyle(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Details Cards */}
        <div className="md:col-span-2 space-y-6">
          {/* Customer & Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Details */}
            <div className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-md space-y-3">
              <h4 className="font-bold text-[#3D271B] flex items-center gap-1.5 border-b border-[#FAF6F0] pb-2 text-xs uppercase tracking-wider">
                <User size={14} className="text-[#a65827]" /> Customer Info
              </h4>
              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-[#3D271B] text-sm">{order.customerName}</p>
                {order.customerEmail && <p className="text-[#6E5A4F]">{order.customerEmail}</p>}
                <p className="text-[#6E5A4F] font-mono font-semibold">{order.customerMobile}</p>
                <p className="text-[10px] text-[#6E5A4F]/65 font-bold uppercase tracking-wider mt-1">
                  Source Channel: {order.orderSource}
                </p>
              </div>
            </div>

            {/* Summary Details */}
            <div className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-md space-y-3">
              <h4 className="font-bold text-[#3D271B] flex items-center gap-1.5 border-b border-[#FAF6F0] pb-2 text-xs uppercase tracking-wider">
                <Calendar size={14} className="text-[#a65827]" /> Order Summary
              </h4>
              <div className="space-y-1.5 text-xs font-semibold">
                <p className="text-[#6E5A4F]">
                  Payment Status: <span className="text-[#3D271B] font-bold">{order.paymentStatus}</span>
                </p>
                <p className="text-[#6E5A4F]">
                  Bill Generated:{" "}
                  <span className={order.billGenerated ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                    {order.billGenerated ? "Yes" : "No"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-md space-y-3">
            <h4 className="font-bold text-[#3D271B] flex items-center gap-1.5 border-b border-[#FAF6F0] pb-2 text-xs uppercase tracking-wider">
              <MapPin size={14} className="text-[#a65827]" /> Shipping & Delivery
            </h4>
            <div className="text-xs space-y-3">
              <p className="text-[#6E5A4F] leading-relaxed font-semibold">{order.deliveryAddress}</p>

              {/* landmark aur distance - dono response me the but UI me nahi the */}
              <div className="flex flex-wrap items-center gap-3">
                {order.landmark && order.landmark.toLowerCase() !== "na" && (
                  <span className="text-[10px] text-[#6E5A4F] bg-[#FAF6F0]/50 px-2.5 py-1 rounded-lg font-bold border border-[#E6CCB2]/15">
                    Landmark: {order.landmark}
                  </span>
                )}
                {typeof order.distanceKm === "number" && (
                  <span className="text-[10px] text-[#a65827] bg-amber-50 px-2.5 py-1 rounded-lg font-bold border border-[#E6CCB2]/15 flex items-center gap-1">
                    <Navigation size={10} /> {order.distanceKm} km from store
                  </span>
                )}
              </div>

              {order.specialInstructions && (
                <div className="text-[10px] text-[#a65827] italic bg-[#FAF6F0]/30 p-3 rounded-xl border border-[#E6CCB2]/15">
                  <strong>Special Instructions:</strong> "{order.specialInstructions}"
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-md space-y-3">
            <h4 className="font-bold text-[#3D271B] flex items-center gap-1.5 border-b border-[#FAF6F0] pb-2 text-xs uppercase tracking-wider">
              <ShoppingBag size={14} className="text-[#a65827]" /> Items Ordered
            </h4>
            <div className="border border-[#FAF6F0] rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF6F0]/40 text-[#6E5A4F] font-semibold border-b border-[#E6CCB2]/20">
                    <th className="px-4 py-3">Sweet Product</th>
                    <th className="px-4 py-3 text-center">Quantity</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF6F0] text-[#3D271B]">
                  <tr>
                    <td className="px-4 py-4 font-bold">
                      <div className="flex items-center gap-3">
                        {/* productImage seedhe order response me aa raha hai, product.images[0].url ka fallback bhi rakh diya */}
                        {(order.productImage || order.product?.images?.[0]?.url) && (
                          <img
                            src={order.productImage || order.product.images[0].url}
                            alt={order.productName}
                            className="w-10 h-10 rounded-lg object-cover border border-[#E6CCB2]/30 shrink-0"
                          />
                        )}
                        <span>{order.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center font-bold font-mono text-slate-700">{order.quantity}</td>
                    <td className="px-4 py-4 text-right font-mono text-slate-700">₹{order.productPrice}</td>
                    <td className="px-4 py-4 text-right font-extrabold font-mono text-[#a65827]">₹{order.totalAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations & Actions */}
        <div className="space-y-6">
          {/* Calculations Summary */}
          <div className="bg-[#FAF6F0]/45 p-6 rounded-3xl border border-[#E6CCB2]/30 shadow-md space-y-4">
            <h4 className="font-extrabold text-[#3D271B] border-b border-[#E6CCB2]/25 pb-2 text-xs uppercase tracking-wider">
              Billing summary
            </h4>

            <div className="space-y-2.5 text-xs font-semibold text-[#6E5A4F]">
              <div className="flex justify-between items-center">
                <span>Subtotal:</span>
                <span className="font-mono">₹{subTotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery Charge:</span>
                <span className="font-mono">₹{deliveryCharge}</span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-[#E6CCB2]/25 text-sm font-extrabold text-[#3D271B]">
                <span>Grand Total:</span>
                <span className="text-[#a65827] font-mono text-lg">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Invoice Info Card */}
          {order.invoiceNumber && (
            <div className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-md space-y-2 text-xs">
              <h4 className="font-extrabold text-[#3D271B] border-b border-[#FAF6F0] pb-2 uppercase tracking-wider text-[10px]">
                Invoice Record
              </h4>
              <div className="space-y-1 text-[#6E5A4F] font-semibold">
                <p>
                  Invoice No: <span className="text-[#3D271B] font-mono">{order.invoiceNumber}</span>
                </p>
                {order.invoiceGeneratedAt && <p>Date: {new Date(order.invoiceGeneratedAt).toLocaleDateString()}</p>}
              </div>
            </div>
          )}

          {/* Quick Actions Panel */}
          <div className="bg-white p-6 rounded-3xl border border-[#E6CCB2]/30 shadow-md space-y-4">
            <h4 className="font-extrabold text-[#3D271B] border-b border-[#FAF6F0] pb-2 text-xs uppercase tracking-wider">
              Management Actions
            </h4>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleInvoiceClick}
                disabled={invoiceLoading}
                className="w-full px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-[#a65827] rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50 text-xs shadow-xs"
              >
                {invoiceLoading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                {order.billGenerated ? "View Invoice PDF" : "Generate Invoice Bill"}
              </button>

              <button
                onClick={handleDeleteOrder}
                className="w-full px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-650 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer text-xs shadow-xs"
              >
                <Trash2 size={14} /> {isSuperAdmin ? "Delete Order" : "Request Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;