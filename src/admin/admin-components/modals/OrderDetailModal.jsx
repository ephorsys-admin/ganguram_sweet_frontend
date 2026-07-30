import { X, User, Calendar, MapPin, ShoppingBag, Trash2, FileText, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const OrderDetailModal = ({ isOpen, order, onClose, onDelete, onGenerateInvoice }) => {
  const [invoiceLoading, setInvoiceLoading] = useState(false);

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
      await onGenerateInvoice(order);
    } catch (e) {
      // Handled in parent
    } finally {
      setInvoiceLoading(false);
    }
  };

  const dateStr = order && order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "—";

  return (
    <AnimatePresence>
      {isOpen && order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white w-[92vw] sm:w-full sm:max-w-lg rounded-3xl border border-[#E6CCB2]/40 shadow-2xl p-5 sm:p-7 md:p-8 z-10 space-y-4 sm:space-y-5 text-xs text-slate-800 font-sans max-h-[92vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-[#FAF6F0] pb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-lg text-[#3D271B]">Order Details</h3>
                <span className="font-mono text-xs text-[#a65827] bg-[#FAF6F0] px-2.5 py-1 rounded-lg font-bold">
                  {order.orderNumber || order._id.substring(18)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Grid: Order Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Customer Details */}
              <div className="bg-[#FAF6F0]/40 p-4 rounded-2xl border border-[#E6CCB2]/20 space-y-2.5">
                <h4 className="font-bold text-[#3D271B] flex items-center gap-1.5 border-b border-[#E6CCB2]/20 pb-1">
                  <User size={13} className="text-[#a65827]" /> Customer Info
                </h4>
                <div className="space-y-1">
                  <p className="font-bold text-[#3D271B]">{order.customerName}</p>
                  {order.customerEmail && <p className="text-[#6E5A4F]/80">{order.customerEmail}</p>}
                  <p className="text-[#6E5A4F]/80 font-mono">{order.customerMobile}</p>
                  <p className="text-[10px] text-[#6E5A4F]/65 font-bold uppercase tracking-wide">
                    Source: {order.orderSource}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-[#FAF6F0]/40 p-4 rounded-2xl border border-[#E6CCB2]/20 space-y-2.5">
                <h4 className="font-bold text-[#3D271B] flex items-center gap-1.5 border-b border-[#E6CCB2]/20 pb-1">
                  <Calendar size={13} className="text-[#a65827]" /> Order Summary
                </h4>
                <div className="space-y-1.5 font-semibold">
                  <p className="text-[#6E5A4F]">Date: <span className="text-[#3D271B] font-mono">{dateStr}</span></p>
                  <p className="text-[#6E5A4F]">Payment: <span className="text-[#3D271B]">{order.paymentStatus}</span></p>
                  <p className="text-[#6E5A4F] flex items-center gap-1">Status: 
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white uppercase tracking-wider
                      ${getStatusStyle(order.orderStatus)}
                    `}>
                      {order.orderStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-[#FAF6F0]/40 p-4 rounded-2xl border border-[#E6CCB2]/20 space-y-1.5">
              <h4 className="font-bold text-[#3D271B] flex items-center gap-1.5 border-b border-[#E6CCB2]/20 pb-1">
                <MapPin size={13} className="text-[#a65827]" /> Delivery Address
              </h4>
              <p className="text-[#6E5A4F]/90 leading-relaxed font-semibold">{order.deliveryAddress}</p>
              {order.specialInstructions && (
                <div className="mt-2 text-[10px] text-[#a65827] italic bg-white p-2 rounded-lg border border-[#E6CCB2]/10">
                  Instructions: "{order.specialInstructions}"
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#3D271B] flex items-center gap-1.5 border-b border-[#FAF6F0] pb-1">
                <ShoppingBag size={13} className="text-[#a65827]" /> Items Ordered
              </h4>
              <div className="border border-[#FAF6F0] rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#FAF6F0]/40 text-[#6E5A4F] font-semibold border-b border-[#E6CCB2]/20">
                      <th className="px-4 py-2">Item Name</th>
                      <th className="px-4 py-2 text-center">Qty</th>
                      <th className="px-4 py-2 text-right">Price</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FAF6F0] text-[#3D271B]">
                    <tr>
                      <td className="px-4 py-2.5 font-bold">{order.productName}</td>
                      <td className="px-4 py-2.5 text-center font-bold font-mono">{order.quantity}</td>
                      <td className="px-4 py-2.5 text-right font-mono">₹{order.productPrice}</td>
                      <td className="px-4 py-2.5 text-right font-bold font-mono">₹{order.totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invoice Info & Grand Total */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#FAF6F0]">
              <div className="flex justify-between items-center text-sm font-bold text-[#3D271B]">
                <span>Grand Total:</span>
                <span className="text-[#a65827] text-lg font-serif">₹{order.totalAmount}</span>
              </div>
              {order.invoiceNumber && (
                <div className="flex justify-between items-center text-[10px] text-[#6E5A4F] font-semibold">
                  <span>Invoice: {order.invoiceNumber}</span>
                  <span>Generated At: {order.invoiceGeneratedAt ? new Date(order.invoiceGeneratedAt).toLocaleDateString() : ""}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2 justify-end flex-wrap">
              <button
                onClick={() => onDelete(order._id)}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-650 rounded-xl font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Trash2 size={13} /> Delete Order
              </button>

              <button
                onClick={handleInvoiceClick}
                disabled={invoiceLoading}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-[#a65827] rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                {invoiceLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <FileText size={13} />
                )}
                {order.billGenerated ? "View Invoice" : "Generate Invoice"}
              </button>

              <div className="flex-grow" />

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-[#3D271B] hover:bg-[#a65827] text-white rounded-xl font-semibold shadow-md transition cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailModal;
