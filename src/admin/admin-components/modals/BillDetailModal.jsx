import { X, User, Calendar, MapPin, ShoppingBag, FileText, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BillDetailModal = ({ isOpen, bill, onClose }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-600";
      case "Generated":
        return "bg-blue-600";
      case "Cancelled":
      default:
        return "bg-slate-500";
    }
  };

  const handleInvoiceClick = () => {
    if (bill && bill.invoiceUrl) {
      window.open(bill.invoiceUrl, "_blank");
    }
  };

  const dateStr = bill && bill.createdAt 
    ? new Date(bill.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "—";

  const dobStr = bill && bill.customer?.dateOfBirth || bill?.dateOfBirth
    ? new Date(bill.customer?.dateOfBirth || bill?.dateOfBirth).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      })
    : "";

  return (
    <AnimatePresence>
      {isOpen && bill && (
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
            className="relative bg-white w-[92vw] sm:w-full sm:max-w-lg rounded-3xl border border-[#E6CCB2]/40 shadow-2xl p-6 md:p-8 z-10 space-y-6 text-xs text-slate-800 font-sans max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-[#FAF6F0] pb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-lg text-[#3D271B]">Bill Details</h3>
                <span className="font-mono text-xs text-[#a65827] bg-[#FAF6F0] px-2.5 py-1 rounded-lg font-bold">
                  {bill.invoiceNumber || bill._id.substring(18)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Grid: Customer and Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Customer Details */}
              <div className="bg-[#FAF6F0]/40 p-4 rounded-2xl border border-[#E6CCB2]/20 space-y-2.5">
                <h4 className="font-bold text-[#3D271B] flex items-center gap-1.5 border-b border-[#E6CCB2]/20 pb-1">
                  <User size={13} className="text-[#a65827]" /> Customer Info
                </h4>
                <div className="space-y-1">
                  <p className="font-bold text-[#3D271B]">{bill.customerName}</p>
                  <p className="text-[#6E5A4F]/85 font-mono">Mobile: {bill.mobile}</p>
                  {bill.whatsappNumber && (
                    <p className="text-[#6E5A4F]/85 font-mono flex items-center gap-1">
                      <PhoneCall size={10} className="text-emerald-600" /> WhatsApp: {bill.whatsappNumber}
                    </p>
                  )}
                  {bill.email && <p className="text-[#6E5A4F]/80">{bill.email}</p>}
                  {dobStr && <p className="text-[#6E5A4F]/75">DoB: {dobStr}</p>}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#FAF6F0]/40 p-4 rounded-2xl border border-[#E6CCB2]/20 space-y-2.5">
                <h4 className="font-bold text-[#3D271B] flex items-center gap-1.5 border-b border-[#E6CCB2]/20 pb-1">
                  <Calendar size={13} className="text-[#a65827]" /> Invoice Summary
                </h4>
                <div className="space-y-1.5 font-semibold">
                  <p className="text-[#6E5A4F]">Date: <span className="text-[#3D271B] font-mono">{dateStr}</span></p>
                  <p className="text-[#6E5A4F]">Type: <span className="text-[#3D271B] font-bold uppercase">{bill.billType}</span></p>
                  <p className="text-[#6E5A4F] flex items-center gap-1">Status: 
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold text-white uppercase tracking-wider
                      ${getStatusStyle(bill.status)}
                    `}>
                      {bill.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Address if provided */}
            {bill.address && (
              <div className="bg-[#FAF6F0]/40 p-4 rounded-2xl border border-[#E6CCB2]/20 space-y-1.5">
                <h4 className="font-bold text-[#3D271B] flex items-center gap-1.5 border-b border-[#E6CCB2]/20 pb-1">
                  <MapPin size={13} className="text-[#a65827]" /> Customer Address
                </h4>
                <p className="text-[#6E5A4F]/90 leading-relaxed font-semibold">{bill.address}</p>
              </div>
            )}

            {/* Items Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#3D271B] flex items-center gap-1.5 border-b border-[#FAF6F0] pb-1">
                <ShoppingBag size={13} className="text-[#a65827]" /> Items Billed
              </h4>
              <div className="border border-[#FAF6F0] rounded-xl overflow-hidden">
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
                    {bill.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2.5 font-bold">{item.productName}</td>
                        <td className="px-4 py-2.5 text-center font-bold font-mono">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right font-mono">₹{item.price}</td>
                        <td className="px-4 py-2.5 text-right font-bold font-mono">₹{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pricing Details */}
            <div className="bg-[#FAF6F0]/20 p-4.5 rounded-2xl border border-[#E6CCB2]/20 space-y-2">
              <div className="flex justify-between items-center text-[#6E5A4F] font-semibold">
                <span>Subtotal:</span>
                <span className="font-mono">₹{bill.subTotal}</span>
              </div>
              {bill.discountAmount > 0 && (
                <div className="flex justify-between items-center text-red-650 font-semibold">
                  <span>Discount ({bill.discountType === "PERCENTAGE" ? `${bill.discountValue}%` : "Flat"}):</span>
                  <span className="font-mono">-₹{bill.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-[#E6CCB2]/25 text-sm font-extrabold text-[#3D271B]">
                <span>Grand Total:</span>
                <span className="text-[#a65827] text-lg font-serif">₹{bill.finalAmount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2 justify-end">
              {bill.invoiceUrl && (
                <button
                  onClick={handleInvoiceClick}
                  className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-[#a65827] rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <FileText size={13} /> View Invoice PDF
                </button>
              )}
              <div className="flex-grow" />
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-[#3D271B] hover:bg-[#a65827] text-white rounded-xl font-semibold shadow-md transition cursor-pointer"
              >
                Close details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BillDetailModal;
