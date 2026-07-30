import { useState, useEffect } from "react";
import { X, ClipboardList, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const OrderModal = ({ isOpen, products = [], onClose, onSubmit, isLoading }) => {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  
  // Validation errors state
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setProductId("");
      setQuantity(1);
      setCustomerName("");
      setCustomerEmail("");
      setCustomerMobile("");
      setDeliveryAddress("");
      setSpecialInstructions("");
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const tempErrors = {};
    if (!productId) tempErrors.product = "Please select a sweet product.";
    if (!quantity || quantity < 1) tempErrors.quantity = "Quantity must be at least 1.";
    if (!customerName.trim()) tempErrors.customerName = "Customer name is required.";
    
    const mobileTrimmed = customerMobile.trim();
    if (!mobileTrimmed) {
      tempErrors.customerMobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(mobileTrimmed)) {
      tempErrors.customerMobile = "Enter a valid 10-digit Indian mobile number.";
    }

    if (customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      tempErrors.customerEmail = "Enter a valid email address.";
    }

    const addressTrimmed = deliveryAddress.trim();
    if (!addressTrimmed) {
      tempErrors.deliveryAddress = "Delivery address is required.";
    } else if (addressTrimmed.length < 10) {
      tempErrors.deliveryAddress = "Address details must be at least 10 characters.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    onSubmit({
      product: productId,
      quantity: Number(quantity),
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerMobile: customerMobile.trim(),
      deliveryAddress: deliveryAddress.trim(),
      specialInstructions: specialInstructions.trim(),
    });
  };

  // Find selected product to compute total pricing
  const selectedProduct = products.find((p) => p._id === productId);
  const totalAmount = selectedProduct ? selectedProduct.sellingPrice * quantity : 0;

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
            className="relative bg-white w-[92vw] sm:w-full sm:max-w-lg rounded-3xl border border-[#E6CCB2]/40 shadow-2xl p-6 md:p-8 z-10 space-y-5 text-xs text-slate-800 font-sans max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-[#FAF6F0] pb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="text-[#a65827] h-5 w-5" />
                <h3 className="font-serif font-black text-lg text-[#3D271B]">Create Admin Order</h3>
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

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Product Selection */}
              <div className="space-y-1">
                <label className="block text-[#6E5A4F] font-bold">Select Sweet Product <span className="text-red-500">*</span></label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#a65827]/10"
                >
                  <option value="">-- Choose Sweet --</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (₹{p.sellingPrice} / {p.unit})
                    </option>
                  ))}
                </select>
                {errors.product && <p className="text-[10px] font-bold text-red-650">{errors.product}</p>}
              </div>

              {/* Quantity */}
              <div className="space-y-1">
                <label className="block text-[#6E5A4F] font-bold">Quantity <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="block w-full px-3.5 py-2 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono focus:outline-none focus:ring-2 focus:ring-[#a65827]/10"
                />
                {errors.quantity && <p className="text-[10px] font-bold text-red-650">{errors.quantity}</p>}
              </div>

              {/* Customer Name */}
              <div className="space-y-1">
                <label className="block text-[#6E5A4F] font-bold">Customer Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="block w-full px-3.5 py-2 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#a65827]/10"
                />
                {errors.customerName && <p className="text-[10px] font-bold text-red-655">{errors.customerName}</p>}
              </div>

              {/* Grid: Mobile and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[#6E5A4F] font-bold">Mobile Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="10-digit number"
                    value={customerMobile}
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    className="block w-full px-3.5 py-2 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono focus:outline-none focus:ring-2 focus:ring-[#a65827]/10"
                  />
                  {errors.customerMobile && <p className="text-[10px] font-bold text-red-650">{errors.customerMobile}</p>}
                </div>

                <div className="space-y-1">
                  <label className="block text-[#6E5A4F] font-bold">Email Address</label>
                  <input
                    type="email"
                    placeholder="optional"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="block w-full px-3.5 py-2 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] focus:outline-none focus:ring-2 focus:ring-[#a65827]/10"
                  />
                  {errors.customerEmail && <p className="text-[10px] font-bold text-red-650">{errors.customerEmail}</p>}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1">
                <label className="block text-[#6E5A4F] font-bold">Delivery Address <span className="text-red-500">*</span></label>
                <textarea
                  rows="2"
                  placeholder="Full shipping address (min 10 characters)"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="block w-full px-3.5 py-2 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#a65827]/10"
                />
                {errors.deliveryAddress && <p className="text-[10px] font-bold text-red-650">{errors.deliveryAddress}</p>}
              </div>

              {/* Special Instructions */}
              <div className="space-y-1">
                <label className="block text-[#6E5A4F] font-bold">Special Instructions</label>
                <textarea
                  rows="1"
                  placeholder="e.g. deliver after 4 PM (optional)"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="block w-full px-3.5 py-2 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] focus:outline-none focus:ring-2 focus:ring-[#a65827]/10"
                />
              </div>

              {/* Live Billing Box */}
              {selectedProduct && (
                <div className="bg-[#FAF6F0]/50 p-4.5 rounded-2xl border border-[#E6CCB2]/30 space-y-2">
                  <h4 className="font-extrabold text-[#3D271B] border-b border-[#E6CCB2]/20 pb-1">Billing Summary</h4>
                  <div className="flex justify-between items-center text-[#6E5A4F] font-semibold">
                    <span>{selectedProduct.name} (x{quantity})</span>
                    <span className="font-mono">₹{selectedProduct.sellingPrice} each</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-[#3D271B] pt-1">
                    <span>Total Amount</span>
                    <span className="text-[#a65827] font-mono text-base">₹{totalAmount}</span>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
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
                      <Loader2 size={13} className="animate-spin" /> Creating...
                    </>
                  ) : (
                    "Place Order"
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

export default OrderModal;
