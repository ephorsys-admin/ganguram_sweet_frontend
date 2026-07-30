import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ClipboardList, Loader2, Save, ShoppingBag } from "lucide-react";
import { createAdminOrder, getOrders } from "../../redux/features/order/orderThunk";
import { getProducts } from "../../redux/features/product/productThunk";
import { useToast } from "../../context/ToastContext";

const AdminCreateOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  // Form State
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Redux state
  const { products = [], isLoading: productsLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      const resultAction = await dispatch(
        createAdminOrder({
          product: productId,
          quantity: Number(quantity),
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerMobile: customerMobile.trim(),
          deliveryAddress: deliveryAddress.trim(),
          specialInstructions: specialInstructions.trim(),
        })
      ).unwrap();

      if (resultAction.success) {
        showToast("Admin order created successfully!", "success");
        // Refresh orders list and redirect back
        dispatch(getOrders());
        navigate("/admin/orders");
      }
    } catch (err) {
      showToast(err.message || "Failed to create order", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Find selected product to compute total pricing
  const selectedProduct = products.find((p) => p._id === productId);
  const totalAmount = selectedProduct ? selectedProduct.sellingPrice * quantity : 0;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header & Back Action */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/orders")}
          className="p-2 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-xl border border-[#E6CCB2]/20 transition shadow-xs"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-black text-[#3D271B]">
            Create Admin Order
          </h1>
          <p className="text-[10px] sm:text-xs text-[#6E5A4F] font-sans">
            Place a new sweet order manually on behalf of a customer.
          </p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6CCB2]/30 shadow-xl space-y-6 text-xs text-slate-800 font-sans">
        {/* Product Selection */}
        <div className="space-y-1">
          <label className="block text-[#6E5A4F] font-bold">Select Sweet Product *</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="block w-full px-4 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#a65827]/10"
          >
            <option value="">-- Choose Sweet --</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} (₹{p.sellingPrice} / {p.unit})
              </option>
            ))}
          </select>
          {errors.product && <p className="text-[10px] font-bold text-red-650 mt-1">{errors.product}</p>}
        </div>

        {/* Quantity */}
        <div className="space-y-1">
          <label className="block text-[#6E5A4F] font-bold">Quantity *</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="block w-full px-4 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 font-bold"
          />
          {errors.quantity && <p className="text-[10px] font-bold text-red-650 mt-1">{errors.quantity}</p>}
        </div>

        {/* Customer Name */}
        <div className="space-y-1">
          <label className="block text-[#6E5A4F] font-bold">Customer Name *</label>
          <input
            type="text"
            placeholder="e.g. Rajesh Kumar"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="block w-full px-4 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#a65827]/10"
          />
          {errors.customerName && <p className="text-[10px] font-bold text-red-655 mt-1">{errors.customerName}</p>}
        </div>

        {/* Grid: Mobile and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[#6E5A4F] font-bold">Mobile Number *</label>
            <input
              type="text"
              placeholder="10-digit number"
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value)}
              className="block w-full px-4 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 font-bold"
            />
            {errors.customerMobile && <p className="text-[10px] font-bold text-red-650 mt-1">{errors.customerMobile}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-[#6E5A4F] font-bold">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com (optional)"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="block w-full px-4 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 font-semibold"
            />
            {errors.customerEmail && <p className="text-[10px] font-bold text-red-650 mt-1">{errors.customerEmail}</p>}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="space-y-1">
          <label className="block text-[#6E5A4F] font-bold">Delivery Address *</label>
          <textarea
            rows="3"
            placeholder="Full shipping details (min 10 characters)"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="block w-full px-4 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#a65827]/10"
          />
          {errors.deliveryAddress && <p className="text-[10px] font-bold text-red-650 mt-1">{errors.deliveryAddress}</p>}
        </div>

        {/* Special Instructions */}
        <div className="space-y-1">
          <label className="block text-[#6E5A4F] font-bold">Special Instructions</label>
          <textarea
            rows="2"
            placeholder="e.g. deliver after 4 PM / custom notes (optional)"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="block w-full px-4 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] focus:outline-none focus:ring-2 focus:ring-[#a65827]/10"
          />
        </div>

        {/* Live Billing Box */}
        {selectedProduct && (
          <div className="bg-[#FAF6F0]/30 p-5 rounded-2xl border border-[#E6CCB2]/20 space-y-2.5">
            <h4 className="font-extrabold text-[#3D271B] border-b border-[#E6CCB2]/20 pb-2 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-[#a65827]" /> Live billing preview
            </h4>
            <div className="flex justify-between items-center text-[#6E5A4F] font-semibold">
              <span>{selectedProduct.name} (x{quantity})</span>
              <span className="font-mono">₹{selectedProduct.sellingPrice} each</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-[#3D271B] pt-2 border-t border-[#FAF6F0]">
              <span>Grand Total Amount</span>
              <span className="text-[#a65827] font-mono text-base font-extrabold">₹{totalAmount}</span>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-[#FAF6F0] justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="px-5 py-2.5 border border-slate-200 text-slate-500 hover:bg-[#FAF6F0] rounded-xl font-bold transition"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#3D271B] hover:bg-[#a65827] text-white rounded-xl font-extrabold shadow-md transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={13} className="animate-spin" /> Placing...
              </>
            ) : (
              <>
                <Save size={13} /> Place Order
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateOrder;
