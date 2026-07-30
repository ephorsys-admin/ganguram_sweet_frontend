import { useState, useEffect } from "react";
import { X, ClipboardList, Loader2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CreateOrderBillModal = ({ isOpen, order, onClose, onSubmit, isLoading }) => {
  // Customer Info (Pre-populated from order)
  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Discount
  const [discountType, setDiscountType] = useState("FLAT");
  const [discountValue, setDiscountValue] = useState(0);

  // Errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && order) {
      setCustomerName(order.customerName || "");
      setMobile(order.customerMobile || "");
      setEmail(order.customerEmail || "");
      setAddress(order.deliveryAddress || "");
      setDiscountType("FLAT");
      setDiscountValue(0);
      setErrors({});
    }
  }, [isOpen, order]);

  if (!order) return null;

  // Items info from order
  const orderItem = {
    productId: order.product?._id || order.product,
    productName: order.productName,
    quantity: order.quantity,
    price: order.productPrice,
    total: order.totalAmount,
  };

  const subTotal = orderItem.total;
  let discountAmount = 0;
  if (discountType === "PERCENTAGE") {
    discountAmount = (subTotal * discountValue) / 100;
  } else {
    discountAmount = Number(discountValue) || 0;
  }
  const finalAmount = Math.max(0, subTotal - discountAmount);

  const validateForm = () => {
    const tempErrors = {};
    if (!customerName.trim()) tempErrors.customerName = "Customer name is required.";
    
    const mobileTrimmed = mobile.trim();
    if (!mobileTrimmed) {
      tempErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(mobileTrimmed)) {
      tempErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = "Enter a valid email address.";
    }

    if (discountType === "PERCENTAGE" && (discountValue < 0 || discountValue > 100)) {
      tempErrors.discount = "Discount percentage must be between 0 and 100.";
    } else if (discountType === "FLAT" && discountValue < 0) {
      tempErrors.discount = "Discount value cannot be negative.";
    } else if (discountType === "FLAT" && discountValue > subTotal) {
      tempErrors.discount = "Flat discount cannot exceed order subtotal.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      orderId: order._id,
      customerName: customerName.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      address: address.trim(),
      items: [
        {
          productId: orderItem.productId,
          productName: orderItem.productName,
          quantity: orderItem.quantity,
          price: orderItem.price,
        },
      ],
      discountType,
      discountValue: Number(discountValue),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => !isLoading && onClose()}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white w-[92vw] sm:w-full sm:max-w-xl rounded-3xl border border-[#E6CCB2]/40 shadow-2xl p-5 sm:p-7 md:p-8 z-10 space-y-5 text-xs text-slate-800 font-sans max-h-[92vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-[#FAF6F0] pb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="text-[#a65827] h-5 w-5" />
                <h3 className="font-serif font-black text-base sm:text-lg text-[#3D271B]">
                  Generate Bill for Order {order.orderNumber || order._id.substring(18)}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="p-1.5 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-lg transition disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-850 font-bold leading-relaxed text-[10px]">
              ⚠️ To update this order status to "Preparing", a bill must be generated and verified first. Please review pre-filled details below:
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Customer Details */}
              <div className="bg-[#FAF6F0]/25 p-4 rounded-2xl border border-[#E6CCB2]/15 space-y-3">
                <h4 className="font-bold text-[#3D271B] uppercase tracking-wider text-[9px] border-b border-[#E6CCB2]/20 pb-1">
                  1. Customer Details (Edit if required)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-[#6E5A4F] font-bold">Customer Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="block w-full px-3 py-2 bg-white border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none"
                    />
                    {errors.customerName && <p className="text-[10px] font-bold text-red-655">{errors.customerName}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[#6E5A4F] font-bold">Mobile Number *</label>
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="block w-full px-3 py-2 bg-white border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono focus:outline-none"
                    />
                    {errors.mobile && <p className="text-[10px] font-bold text-red-650">{errors.mobile}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[#6E5A4F] font-bold">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3 py-2 bg-white border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] focus:outline-none"
                  />
                  {errors.email && <p className="text-[10px] font-bold text-red-650">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-[#6E5A4F] font-bold">Delivery Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full px-3 py-2 bg-white border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="bg-[#FAF6F0]/25 p-4 rounded-2xl border border-[#E6CCB2]/15 space-y-3">
                <h4 className="font-bold text-[#3D271B] uppercase tracking-wider text-[9px] border-b border-[#E6CCB2]/20 pb-1 flex items-center gap-1">
                  <ShoppingBag size={12} className="text-[#a65827]" /> 2. Billed Sweet Items
                </h4>

                <div className="border border-[#E6CCB2]/20 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#FAF6F0]/40 text-[#6E5A4F] font-semibold border-b border-[#E6CCB2]/20">
                        <th className="px-4 py-2">Item Name</th>
                        <th className="px-4 py-2 text-center">Qty</th>
                        <th className="px-4 py-2 text-right">Price</th>
                        <th className="px-4 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#3D271B]">
                      <tr>
                        <td className="px-4 py-2 font-bold">{orderItem.productName}</td>
                        <td className="px-4 py-2 text-center font-bold font-mono">{orderItem.quantity}</td>
                        <td className="px-4 py-2 text-right font-mono">₹{orderItem.price}</td>
                        <td className="px-4 py-2 text-right font-bold font-mono">₹{orderItem.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Discount Section & Billing summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Discount config */}
                <div className="bg-[#FAF6F0]/25 p-4 rounded-2xl border border-[#E6CCB2]/15 space-y-3 flex flex-col justify-between">
                  <h4 className="font-bold text-[#3D271B] uppercase tracking-wider text-[9px] border-b border-[#E6CCB2]/20 pb-1">
                    3. Discount config
                  </h4>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[#6E5A4F] font-bold">Discount Type</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="orderDiscType"
                            value="FLAT"
                            checked={discountType === "FLAT"}
                            onChange={() => setDiscountType("FLAT")}
                            className="accent-[#a65827]"
                          />
                          Flat (₹)
                        </label>
                        <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="orderDiscType"
                            value="PERCENTAGE"
                            checked={discountType === "PERCENTAGE"}
                            onChange={() => setDiscountType("PERCENTAGE")}
                            className="accent-[#a65827]"
                          />
                          Percentage (%)
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[#6E5A4F] font-bold">
                        Discount Value ({discountType === "PERCENTAGE" ? "%" : "₹"})
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={discountValue === 0 ? "" : discountValue}
                        placeholder="0"
                        onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value) || 0))}
                        className="block w-full px-3 py-2 bg-white border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono focus:outline-none"
                      />
                      {errors.discount && <p className="text-[10px] font-bold text-red-650 mt-1">{errors.discount}</p>}
                    </div>
                  </div>
                </div>

                {/* calculations */}
                <div className="bg-[#FAF6F0]/50 p-4 rounded-2xl border border-[#E6CCB2]/30 space-y-2 flex flex-col justify-between">
                  <h4 className="font-extrabold text-[#3D271B] border-b border-[#E6CCB2]/20 pb-1">Billing calculations</h4>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[#6E5A4F] font-semibold">
                      <span>Subtotal:</span>
                      <span className="font-mono">₹{subTotal}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center text-red-655 font-semibold">
                        <span>Discount Amount:</span>
                        <span className="font-mono">-₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-[#E6CCB2]/25 text-sm font-extrabold text-[#3D271B]">
                      <span>Grand Total:</span>
                      <span className="text-[#a65827] font-mono text-base font-extrabold">₹{finalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#FAF6F0]">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 bg-gradient-to-r from-[#3D271B] to-[#a65827] hover:from-[#a65827] hover:to-[#DFA250] text-[#FAF6F0] rounded-xl font-bold shadow-md transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Generating...
                    </>
                  ) : (
                    "Generate Bill & Set Preparing"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateOrderBillModal;
