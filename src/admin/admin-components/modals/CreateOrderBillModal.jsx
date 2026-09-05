import { useState, useEffect } from "react";
import { X, ClipboardList, Loader2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CreateOrderBillModal = ({
  isOpen,
  order,
  onClose,
  onSubmit,
  isLoading,
}) => {
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
    if (!customerName.trim())
      tempErrors.customerName = "Customer name is required.";

    const mobileTrimmed = mobile.trim();
    if (!mobileTrimmed) {
      tempErrors.mobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(mobileTrimmed)) {
      tempErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = "Enter a valid email address.";
    }

    if (
      discountType === "PERCENTAGE" &&
      (discountValue < 0 || discountValue > 100)
    ) {
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
            className="relative bg-white w-full max-w-2xl rounded-3xl border border-[#E6CCB2]/40 shadow-2xl p-6 sm:p-8 z-10 space-y-6 text-slate-800 font-sans max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-[#FAF6F0] pb-4">
              <div className="flex items-center gap-3">
                <ClipboardList className="text-[#a65827] h-6 w-6 sm:h-7 sm:w-7 shrink-0" />
                <h3 className="font-serif font-black text-lg sm:text-xl md:text-2xl text-[#3D271B]">
                  Generate Bill for Order {order.orderNumber || order._id.substring(18)}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="p-2 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-amber-50/80 border border-[#DFA250]/40 rounded-2xl p-4 text-[#8B5E3C] font-semibold leading-relaxed text-xs sm:text-sm">
              ⚠️ To update this order status to "Preparing", a bill must be generated and verified first. Please review pre-filled details below:
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Customer Details */}
              <div className="bg-[#FAF6F0]/40 p-5 sm:p-6 rounded-2xl border border-[#E6CCB2]/30 space-y-4">
                <h4 className="font-bold text-[#3D271B] uppercase tracking-wider text-xs sm:text-sm border-b border-[#E6CCB2]/20 pb-2">
                  1. Customer Details (Edit if required)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm text-[#3D271B] font-bold">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="block w-full px-3.5 py-2.5 sm:py-3 bg-white border border-[#E6CCB2]/40 rounded-xl text-sm sm:text-base text-[#3D271B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827]"
                    />
                    {errors.customerName && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.customerName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm text-[#3D271B] font-bold">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) =>
                        setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      className="block w-full px-3.5 py-2.5 sm:py-3 bg-white border border-[#E6CCB2]/40 rounded-xl text-sm sm:text-base text-[#3D271B] font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827]"
                    />
                    {errors.mobile && (
                      <p className="text-xs font-bold text-red-500">
                        {errors.mobile}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm text-[#3D271B] font-bold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3.5 py-2.5 sm:py-3 bg-white border border-[#E6CCB2]/40 rounded-xl text-sm sm:text-base text-[#3D271B] font-medium focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827]"
                  />
                  {errors.email && (
                    <p className="text-xs font-bold text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm text-[#3D271B] font-bold">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full px-3.5 py-2.5 sm:py-3 bg-white border border-[#E6CCB2]/40 rounded-xl text-sm sm:text-base text-[#3D271B] font-medium focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827]"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="bg-[#FAF6F0]/40 p-5 sm:p-6 rounded-2xl border border-[#E6CCB2]/30 space-y-4">
                <h4 className="font-bold text-[#3D271B] uppercase tracking-wider text-xs sm:text-sm border-b border-[#E6CCB2]/20 pb-2 flex items-center gap-2">
                  <ShoppingBag size={16} className="text-[#a65827]" /> 2. Billed Sweet Items
                </h4>

                <div className="border border-[#E6CCB2]/30 rounded-xl overflow-hidden bg-white">
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
                          {orderItem.productName}
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold font-mono">
                          {orderItem.quantity}
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-semibold">
                          ₹{Number(orderItem.price || 0).toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5 text-right font-black font-mono text-[#a65827]">
                          ₹{Number(orderItem.total || 0).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Discount Section & Billing summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Discount config */}
                <div className="bg-[#FAF6F0]/40 p-5 sm:p-6 rounded-2xl border border-[#E6CCB2]/30 space-y-4 flex flex-col justify-between">
                  <h4 className="font-bold text-[#3D271B] uppercase tracking-wider text-xs sm:text-sm border-b border-[#E6CCB2]/20 pb-2">
                    3. Discount Config
                  </h4>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs sm:text-sm text-[#3D271B] font-bold">
                        Discount Type
                      </label>
                      <div className="flex gap-4 pt-1">
                        <label className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="orderDiscType"
                            value="FLAT"
                            checked={discountType === "FLAT"}
                            onChange={() => setDiscountType("FLAT")}
                            className="w-4 h-4 accent-[#a65827]"
                          />
                          Flat (₹)
                        </label>
                        <label className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="orderDiscType"
                            value="PERCENTAGE"
                            checked={discountType === "PERCENTAGE"}
                            onChange={() => setDiscountType("PERCENTAGE")}
                            className="w-4 h-4 accent-[#a65827]"
                          />
                          Percentage (%)
                        </label>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs sm:text-sm text-[#3D271B] font-bold">
                        Discount Value ({discountType === "PERCENTAGE" ? "%" : "₹"})
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={discountValue === 0 ? "" : discountValue}
                        placeholder="0"
                        onChange={(e) =>
                          setDiscountValue(
                            Math.max(0, Number(e.target.value) || 0)
                          )
                        }
                        className="block w-full px-3.5 py-2.5 bg-white border border-[#E6CCB2]/40 rounded-xl text-sm sm:text-base text-[#3D271B] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827]"
                      />
                      {errors.discount && (
                        <p className="text-xs font-bold text-red-500 mt-1">
                          {errors.discount}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Calculations */}
                <div className="bg-gradient-to-br from-[#FAF6F0] to-[#FAF0E6] p-5 sm:p-6 rounded-2xl border border-[#E6CCB2]/40 space-y-3 flex flex-col justify-between">
                  <h4 className="font-extrabold text-[#3D271B] border-b border-[#E6CCB2]/30 pb-2 text-xs sm:text-sm uppercase tracking-wider">
                    Billing Calculations
                  </h4>

                  <div className="space-y-2.5 text-xs sm:text-sm font-semibold">
                    <div className="flex justify-between items-center text-[#6E5A4F]">
                      <span>Subtotal:</span>
                      <span className="font-mono text-sm sm:text-base font-bold text-[#3D271B]">
                        ₹{Number(subTotal || 0).toFixed(2)}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center text-red-600 font-bold">
                        <span>Discount Amount:</span>
                        <span className="font-mono text-sm sm:text-base">
                          -₹{Number(discountAmount || 0).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t-2 border-[#E6CCB2]/30 text-sm sm:text-base font-black text-[#3D271B]">
                      <span>Grand Total:</span>
                      <span className="text-[#a65827] font-mono text-xl sm:text-2xl font-black">
                        ₹{Number(finalAmount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[#FAF6F0]">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl font-bold text-sm sm:text-base text-slate-700 transition cursor-pointer disabled:opacity-50 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#3D271B] to-[#a65827] hover:from-[#a65827] hover:to-[#DFA250] text-[#FAF6F0] rounded-xl font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Generating...
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
