import { X, User, Calendar, MapPin, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const OrderDetailModal = ({ isOpen, order, onClose, onDelete }) => {
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
            className="relative bg-white w-full max-w-lg rounded-3xl border border-[#E6CCB2]/40 shadow-2xl p-6 md:p-8 z-10 space-y-6 text-xs text-slate-800 font-sans"
          >
            <div className="flex justify-between items-center border-b border-[#FAF6F0] pb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-lg text-[#3D271B]">Order Details</h3>
                <span className="font-mono text-xs text-[#a65827] bg-[#FAF6F0] px-2 py-0.5 rounded-md font-bold">{order.id}</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-lg transition"
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
                  <p className="text-[#6E5A4F]/80">{order.email}</p>
                  <p className="text-[#6E5A4F]/80">{order.phone}</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-[#FAF6F0]/40 p-4 rounded-2xl border border-[#E6CCB2]/20 space-y-2.5">
                <h4 className="font-bold text-[#3D271B] flex items-center gap-1.5 border-b border-[#E6CCB2]/20 pb-1">
                  <Calendar size={13} className="text-[#a65827]" /> Order Summary
                </h4>
                <div className="space-y-1 font-semibold">
                  <p className="text-[#6E5A4F]">Date: <span className="text-[#3D271B] font-mono">{order.date}</span></p>
                  <p className="text-[#6E5A4F]">Payment: <span className="text-[#3D271B]">{order.paymentMethod}</span></p>
                  <p className="text-[#6E5A4F] flex items-center gap-1">Status: 
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold text-white
                      ${order.status === "Completed" ? "bg-emerald-600" : ""}
                      ${order.status === "Processing" ? "bg-amber-500" : ""}
                      ${order.status === "Pending" ? "bg-red-500" : ""}
                      ${order.status === "Cancelled" ? "bg-slate-500" : ""}
                    `}>
                      {order.status}
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
              <p className="text-[#6E5A4F]/90 leading-relaxed font-semibold">{order.address}</p>
            </div>

            {/* Items Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#3D271B] flex items-center gap-1.5 border-b border-[#FAF6F0] pb-1">
                <ShoppingBag size={13} className="text-[#a65827]" /> Items Ordered
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
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2.5 font-bold">{item.name}</td>
                        <td className="px-4 py-2.5 text-center font-bold font-mono">{item.qty}</td>
                        <td className="px-4 py-2.5 text-right font-mono">₹{item.price}</td>
                        <td className="px-4 py-2.5 text-right font-bold font-mono">₹{item.qty * item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center pt-4 border-t border-[#FAF6F0] text-sm font-bold text-[#3D271B]">
              <span>Grand Total:</span>
              <span className="text-[#a65827] text-lg font-serif">₹{order.amount}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2 justify-end">
              <button
                onClick={() => onDelete(order.id)}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Trash2 size={13} /> Delete Record
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
