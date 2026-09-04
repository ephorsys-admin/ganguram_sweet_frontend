import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  User,
  Calendar,
  MapPin,
  ShoppingBag,
  FileText,
  Loader2,
  Navigation,
} from "lucide-react";
import { getSingleOrder } from "../../redux/features/order/orderThunk";
import { getSingleBill } from "../../redux/features/bill/billThunk";
import { useToast } from "../../context/ToastContext";

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { currentOrder: order, isLoading } = useSelector(
    (state) => state.order
  );
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      dispatch(getSingleOrder(orderId));
    }
  }, [dispatch, orderId]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-600 text-white";
      case "Out For Delivery":
        return "bg-purple-600 text-white";
      case "Preparing":
        return "bg-orange-500 text-white";
      case "Confirmed":
        return "bg-blue-600 text-white";
      case "Pending":
        return "bg-amber-500 text-white";
      case "Cancelled":
      default:
        return "bg-slate-600 text-white";
    }
  };

  const handleInvoiceClick = async () => {
    if (!order) return;
    setInvoiceLoading(true);
    try {
      if (!order.billGenerated || !order.bill) {
        showToast("Generating bill for order. Redirecting...", "info");
        navigate(`/admin/orders?generateBill=${order._id}`);
        return;
      }

      const resultAction = await dispatch(
        getSingleBill(order.bill)
      ).unwrap();
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

  if (isLoading || !order) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-12 w-12 text-[#DFA250] animate-spin" />
        <span className="text-sm md:text-base text-[#6E5A4F] font-semibold">
          Loading Order Details...
        </span>
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

  const subTotal = order.subTotal ?? order.totalAmount;
  const deliveryCharge = order.deliveryCharge ?? 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* Header & Back Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#E6CCB2]/30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/orders")}
            className="p-3 hover:bg-white text-[#6E5A4F] hover:text-[#3D271B] rounded-2xl border border-[#E6CCB2]/40 transition shadow-xs cursor-pointer active:scale-95"
            title="Back to Orders"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#3D271B] flex flex-wrap items-center gap-3">
              Order Detail
              <span className="font-mono text-xs sm:text-sm text-[#a65827] bg-[#FAF6F0] border border-[#E6CCB2]/40 px-3 py-1 rounded-xl font-bold">
                {order.orderNumber || order._id.substring(18)}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6E5A4F] font-medium mt-1">
              Placed on {dateStr}
            </p>
          </div>
        </div>

        <div>
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-xs ${getStatusStyle(
              order.orderStatus
            )}`}
          >
            {order.orderStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: Details Cards */}
        <div className="md:col-span-2 space-y-6">
          {/* Customer & Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {/* Customer Details */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E6CCB2]/40 shadow-sm space-y-4">
              <h4 className="font-bold text-[#3D271B] flex items-center gap-2 border-b border-[#FAF6F0] pb-3 text-xs sm:text-sm uppercase tracking-wider">
                <User size={16} className="text-[#a65827]" /> Customer Info
              </h4>
              <div className="space-y-2 text-sm sm:text-base">
                <p className="font-extrabold text-[#3D271B] text-base sm:text-lg">
                  {order.customerName}
                </p>
                {order.customerEmail && (
                  <p className="text-[#6E5A4F] font-medium">{order.customerEmail}</p>
                )}
                <p className="text-[#6E5A4F] font-mono font-bold">
                  {order.customerMobile}
                </p>
                <div className="pt-1">
                  <span className="inline-block text-xs text-[#a65827] bg-[#FAF6F0] px-3 py-1 rounded-lg font-bold uppercase tracking-wider border border-[#E6CCB2]/30">
                    Source: {order.orderSource}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Details */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E6CCB2]/40 shadow-sm space-y-4">
              <h4 className="font-bold text-[#3D271B] flex items-center gap-2 border-b border-[#FAF6F0] pb-3 text-xs sm:text-sm uppercase tracking-wider">
                <Calendar size={16} className="text-[#a65827]" /> Order Summary
              </h4>
              <div className="space-y-3 text-sm sm:text-base font-semibold">
                <div className="flex justify-between items-center">
                  <span className="text-[#6E5A4F]">Payment Status:</span>
                  <span className="text-[#3D271B] font-bold px-2.5 py-0.5 bg-slate-100 rounded-lg text-xs sm:text-sm">
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6E5A4F]">Bill Generated:</span>
                  <span
                    className={`font-bold px-2.5 py-0.5 rounded-lg text-xs sm:text-sm ${
                      order.billGenerated
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {order.billGenerated ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E6CCB2]/40 shadow-sm space-y-4">
            <h4 className="font-bold text-[#3D271B] flex items-center gap-2 border-b border-[#FAF6F0] pb-3 text-xs sm:text-sm uppercase tracking-wider">
              <MapPin size={16} className="text-[#a65827]" /> Shipping & Delivery
            </h4>
            <div className="text-sm sm:text-base space-y-3">
              <p className="text-[#3D271B] leading-relaxed font-medium">
                {order.deliveryAddress}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {order.landmark && order.landmark.toLowerCase() !== "na" && (
                  <span className="text-xs sm:text-sm text-[#6E5A4F] bg-[#FAF6F0] px-3 py-1.5 rounded-xl font-bold border border-[#E6CCB2]/30">
                    Landmark: {order.landmark}
                  </span>
                )}
                {typeof order.distanceKm === "number" && (
                  <span className="text-xs sm:text-sm text-[#a65827] bg-amber-50/80 px-3 py-1.5 rounded-xl font-bold border border-[#DFA250]/30 flex items-center gap-1.5">
                    <Navigation size={14} /> {order.distanceKm} km from store
                  </span>
                )}
              </div>

              {order.specialInstructions && (
                <div className="text-xs sm:text-sm text-[#a65827] italic bg-[#FAF6F0] p-4 rounded-2xl border border-[#E6CCB2]/30 mt-2">
                  <strong className="font-bold">Special Instructions:</strong> "
                  {order.specialInstructions}"
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E6CCB2]/40 shadow-sm space-y-4">
            <h4 className="font-bold text-[#3D271B] flex items-center gap-2 border-b border-[#FAF6F0] pb-3 text-xs sm:text-sm uppercase tracking-wider">
              <ShoppingBag size={16} className="text-[#a65827]" /> Items Ordered
            </h4>
            <div className="border border-[#E6CCB2]/30 rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead>
                  <tr className="bg-[#FAF6F0]/60 text-[#6E5A4F] font-bold text-xs sm:text-sm uppercase tracking-wider border-b border-[#E6CCB2]/30">
                    <th className="px-5 py-3.5">Sweet Product</th>
                    <th className="px-5 py-3.5 text-center">Quantity</th>
                    <th className="px-5 py-3.5 text-right">Price</th>
                    <th className="px-5 py-3.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FAF6F0] text-[#3D271B]">
                  <tr>
                    <td className="px-5 py-4 font-bold">
                      <div className="flex items-center gap-3.5">
                        {(order.productImage ||
                          order.product?.images?.[0]?.url) && (
                          <img
                            src={
                              order.productImage ||
                              order.product.images[0].url
                            }
                            alt={order.productName}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E6CCB2]/30 shrink-0 shadow-xs"
                          />
                        )}
                        <span className="font-bold text-base text-[#3D271B]">
                          {order.productName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center font-bold font-mono text-slate-700">
                      {order.quantity}
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-semibold text-slate-700">
                      ₹{Number(order.productPrice || 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-right font-black font-mono text-[#a65827] text-base">
                      ₹{Number(order.totalAmount || 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations & Actions */}
        <div className="space-y-6">
          {/* Calculations Summary */}
          <div className="bg-gradient-to-br from-[#FAF6F0] to-[#FAF0E6] p-6 sm:p-7 rounded-3xl border border-[#E6CCB2]/50 shadow-sm space-y-4">
            <h4 className="font-extrabold text-[#3D271B] border-b border-[#E6CCB2]/30 pb-3 text-xs sm:text-sm uppercase tracking-wider">
              Billing summary
            </h4>

            <div className="space-y-3 text-sm sm:text-base font-semibold text-[#6E5A4F]">
              <div className="flex justify-between items-center">
                <span>Subtotal:</span>
                <span className="font-mono text-base font-bold text-[#3D271B]">
                  ₹{Number(subTotal || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery Charge:</span>
                <span className="font-mono text-base font-bold text-[#3D271B]">
                  ₹{Number(deliveryCharge || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3.5 border-t-2 border-[#E6CCB2]/40 text-base sm:text-lg font-black text-[#3D271B]">
                <span>Grand Total:</span>
                <span className="text-[#a65827] font-mono text-2xl sm:text-3xl font-black">
                  ₹{Number(order.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Invoice Info Card */}
          {order.invoiceNumber && (
            <div className="bg-white p-6 rounded-3xl border border-[#E6CCB2]/40 shadow-sm space-y-3 text-sm">
              <h4 className="font-extrabold text-[#3D271B] border-b border-[#FAF6F0] pb-2 uppercase tracking-wider text-xs sm:text-sm">
                Invoice Record
              </h4>
              <div className="space-y-2 text-[#6E5A4F] font-semibold">
                <p className="flex justify-between items-center">
                  <span>Invoice No:</span>
                  <span className="text-[#a65827] font-mono font-bold">
                    #{order.invoiceNumber}
                  </span>
                </p>
                {order.invoiceGeneratedAt && (
                  <p className="flex justify-between items-center text-xs">
                    <span>Date:</span>
                    <span>
                      {new Date(order.invoiceGeneratedAt).toLocaleDateString(
                        "en-IN"
                      )}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions Panel */}
          <div className="bg-white p-6 rounded-3xl border border-[#E6CCB2]/40 shadow-sm space-y-4">
            <h4 className="font-extrabold text-[#3D271B] border-b border-[#FAF6F0] pb-2 text-xs sm:text-sm uppercase tracking-wider">
              Management Actions
            </h4>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleInvoiceClick}
                disabled={invoiceLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#3D271B] to-[#a65827] hover:from-[#a65827] hover:to-[#DFA250] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 text-sm sm:text-base shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                {invoiceLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <FileText size={18} />
                )}
                {order.billGenerated
                  ? "View Invoice PDF"
                  : "Generate Invoice Bill"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;