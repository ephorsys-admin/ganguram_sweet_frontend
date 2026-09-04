import {
  X,
  User,
  Calendar,
  MapPin,
  ShoppingBag,
  Trash2,
  FileText,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const OrderDetailModal = ({
  isOpen,
  order,
  onClose,
  onDelete,
  onGenerateInvoice,
}) => {
  const [invoiceLoading, setInvoiceLoading] = useState(false);

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
      await onGenerateInvoice(order);
    } catch (e) {
      // Handled in parent
    } finally {
      setInvoiceLoading(false);
    }
  };

  const dateStr =
    order && order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
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
            className="relative bg-white w-full max-w-2xl rounded-3xl border border-[#E6CCB2]/40 shadow-2xl p-6 sm:p-8 z-10 space-y-6 text-slate-800 font-sans max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-[#FAF6F0] pb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-serif font-black text-xl sm:text-2xl text-[#3D271B]">
                  Order Details
                </h3>
                <span className="font-mono text-xs sm:text-sm text-[#a65827] bg-[#FAF6F0] border border-[#E6CCB2]/40 px-3 py-1 rounded-xl font-bold">
                  {order.orderNumber || order._id.substring(18)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-xl transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Grid: Order Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Details */}
              <div className="bg-[#FAF6F0]/40 p-5 rounded-2xl border border-[#E6CCB2]/30 space-y-3">
                <h4 className="font-bold text-[#3D271B] flex items-center gap-2 border-b border-[#E6CCB2]/20 pb-2 text-xs uppercase tracking-wider">
                  <User size={15} className="text-[#a65827]" /> Customer Info
                </h4>
                <div className="space-y-1.5 text-sm">
                  <p className="font-bold text-[#3D271B] text-base">
                    {order.customerName}
                  </p>
                  {order.customerEmail && (
                    <p className="text-[#6E5A4F]">{order.customerEmail}</p>
                  )}
                  <p className="text-[#6E5A4F] font-mono font-bold">
                    {order.customerMobile}
                  </p>
                  <p className="text-xs text-[#a65827] font-bold uppercase tracking-wider pt-1">
                    Source: {order.orderSource}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-[#FAF6F0]/40 p-5 rounded-2xl border border-[#E6CCB2]/30 space-y-3">
                <h4 className="font-bold text-[#3D271B] flex items-center gap-2 border-b border-[#E6CCB2]/20 pb-2 text-xs uppercase tracking-wider">
                  <Calendar size={15} className="text-[#a65827]" /> Order Summary
                </h4>
                <div className="space-y-2 text-sm font-semibold">
                  <p className="text-[#6E5A4F] flex justify-between">
                    <span>Date:</span>
                    <span className="text-[#3D271B] font-mono">{dateStr}</span>
                  </p>
                  <p className="text-[#6E5A4F] flex justify-between">
                    <span>Payment:</span>
                    <span className="text-[#3D271B]">{order.paymentStatus}</span>
                  </p>
                  <div className="text-[#6E5A4F] flex justify-between items-center pt-1">
                    <span>Status:</span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-[#FAF6F0]/40 p-5 rounded-2xl border border-[#E6CCB2]/30 space-y-2">
              <h4 className="font-bold text-[#3D271B] flex items-center gap-2 border-b border-[#E6CCB2]/20 pb-2 text-xs uppercase tracking-wider">
                <MapPin size={15} className="text-[#a65827]" /> Delivery Address
              </h4>
              <p className="text-[#3D271B] leading-relaxed font-medium text-sm sm:text-base">
                {order.deliveryAddress}
              </p>
              {order.specialInstructions && (
                <div className="mt-2 text-xs sm:text-sm text-[#a65827] italic bg-white p-3 rounded-xl border border-[#E6CCB2]/20">
                  Instructions: "{order.specialInstructions}"
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#3D271B] flex items-center gap-2 border-b border-[#FAF6F0] pb-2 text-xs uppercase tracking-wider">
                <ShoppingBag size={15} className="text-[#a65827]" /> Items Ordered
              </h4>
              <div className="border border-[#E6CCB2]/30 rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-sm sm:text-base">
                  <thead>
                    <tr className="bg-[#FAF6F0]/60 text-[#6E5A4F] font-bold text-xs uppercase tracking-wider border-b border-[#E6CCB2]/20">
                      <th className="px-4 py-3">Item Name</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FAF6F0] text-[#3D271B]">
                    <tr>
                      <td className="px-4 py-3.5 font-bold">
                        {order.productName}
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold font-mono">
                        {order.quantity}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono">
                        ₹{Number(order.productPrice || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-black font-mono text-[#a65827]">
                        ₹{Number(order.totalAmount || 0).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invoice Info & Grand Total */}
            <div className="flex flex-col gap-2 pt-3 border-t border-[#FAF6F0]">
              <div className="flex justify-between items-center text-base sm:text-lg font-black text-[#3D271B]">
                <span>Grand Total:</span>
                <span className="text-[#a65827] text-2xl sm:text-3xl font-mono font-black">
                  ₹{Number(order.totalAmount || 0).toFixed(2)}
                </span>
              </div>
              {order.invoiceNumber && (
                <div className="flex justify-between items-center text-xs sm:text-sm text-[#6E5A4F] font-semibold">
                  <span>Invoice: #{order.invoiceNumber}</span>
                  <span>
                    Generated:{" "}
                    {order.invoiceGeneratedAt
                      ? new Date(order.invoiceGeneratedAt).toLocaleDateString(
                          "en-IN"
                        )
                      : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#FAF6F0] justify-end">
              <button
                onClick={() => onDelete(order._id)}
                className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer text-sm"
              >
                <Trash2 size={16} /> Delete Order
              </button>

              <button
                onClick={handleInvoiceClick}
                disabled={invoiceLoading}
                className="px-5 py-2.5 bg-amber-50 hover:bg-amber-100 text-[#a65827] rounded-xl font-bold flex items-center gap-2 transition cursor-pointer disabled:opacity-50 text-sm border border-[#DFA250]/30"
              >
                {invoiceLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <FileText size={16} />
                )}
                {order.billGenerated ? "View Invoice" : "Generate Invoice"}
              </button>

              <div className="flex-grow" />

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#3D271B] hover:bg-[#a65827] text-white rounded-xl font-bold shadow-md transition cursor-pointer text-sm"
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
