import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Loader2,
  Save,
  ShoppingBag,
  PlusCircle,
} from "lucide-react";
import {
  createAdminOrder,
  getOrders,
} from "../../redux/features/order/orderThunk";
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
  const { products = [] } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const validateForm = () => {
    const tempErrors = {};
    if (!productId) tempErrors.product = "Please select a sweet product.";
    if (!quantity || quantity < 1)
      tempErrors.quantity = "Quantity must be at least 1.";
    if (!customerName.trim())
      tempErrors.customerName = "Customer name is required.";

    const mobileTrimmed = customerMobile.trim();
    if (!mobileTrimmed) {
      tempErrors.customerMobile = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(mobileTrimmed)) {
      tempErrors.customerMobile =
        "Enter a valid 10-digit Indian mobile number.";
    }

    if (
      customerEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
    ) {
      tempErrors.customerEmail = "Enter a valid email address.";
    }

    const addressTrimmed = deliveryAddress.trim();
    if (!addressTrimmed) {
      tempErrors.deliveryAddress = "Delivery address is required.";
    } else if (addressTrimmed.length < 10) {
      tempErrors.deliveryAddress =
        "Address details must be at least 10 characters.";
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
  const totalAmount = selectedProduct
    ? selectedProduct.sellingPrice * quantity
    : 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      {/* Header & Back Action */}
      <div className="flex items-center gap-4 pb-2 border-b border-[#E6CCB2]/30">
        <button
          onClick={() => navigate("/admin/orders")}
          className="p-3 hover:bg-white text-[#6E5A4F] hover:text-[#3D271B] rounded-2xl border border-[#E6CCB2]/40 transition shadow-xs cursor-pointer active:scale-95"
          title="Back to Orders"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#3D271B] flex items-center gap-3">
            <PlusCircle className="text-[#a65827] h-8 w-8 sm:h-9 sm:w-9 shrink-0" />
            Create Admin Order
          </h1>
          <p className="text-sm sm:text-base text-[#6E5A4F] mt-1 font-medium">
            Place a new sweet order manually on behalf of a customer.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl border border-[#E6CCB2]/40 shadow-sm space-y-6 text-slate-800 font-sans"
      >
        {/* Product Selection */}
        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-bold text-[#3D271B]">
            Select Sweet Product <span className="text-red-500">*</span>
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="block w-full px-4 py-3.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl text-sm sm:text-base text-[#3D271B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827] cursor-pointer"
          >
            <option value="">-- Choose Sweet --</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} (₹{p.sellingPrice} / {p.unit})
              </option>
            ))}
          </select>
          {errors.product && (
            <p className="text-xs sm:text-sm font-bold text-red-500 mt-1">
              {errors.product}
            </p>
          )}
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-bold text-[#3D271B]">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="block w-full px-4 py-3.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl text-sm sm:text-base text-[#3D271B] font-mono focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827] font-bold"
          />
          {errors.quantity && (
            <p className="text-xs sm:text-sm font-bold text-red-500 mt-1">
              {errors.quantity}
            </p>
          )}
        </div>

        {/* Customer Name */}
        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-bold text-[#3D271B]">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Rajesh Kumar"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="block w-full px-4 py-3.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl text-sm sm:text-base text-[#3D271B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827]"
          />
          {errors.customerName && (
            <p className="text-xs sm:text-sm font-bold text-red-500 mt-1">
              {errors.customerName}
            </p>
          )}
        </div>

        {/* Grid: Mobile and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-bold text-[#3D271B]">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={10}
              placeholder="10-digit number"
              value={customerMobile}
              onChange={(e) =>
                setCustomerMobile(
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              className="block w-full px-4 py-3.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl text-sm sm:text-base text-[#3D271B] font-mono focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827] font-bold"
            />
            {errors.customerMobile && (
              <p className="text-xs sm:text-sm font-bold text-red-500 mt-1">
                {errors.customerMobile}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-bold text-[#3D271B]">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com (optional)"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="block w-full px-4 py-3.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl text-sm sm:text-base text-[#3D271B] focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827] font-medium"
            />
            {errors.customerEmail && (
              <p className="text-xs sm:text-sm font-bold text-red-500 mt-1">
                {errors.customerEmail}
              </p>
            )}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-bold text-[#3D271B]">
            Delivery Address <span className="text-red-500">*</span>
          </label>
          <textarea
            rows="3"
            placeholder="Full shipping details (min 10 characters)"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="block w-full px-4 py-3.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl text-sm sm:text-base text-[#3D271B] font-medium focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827]"
          />
          {errors.deliveryAddress && (
            <p className="text-xs sm:text-sm font-bold text-red-500 mt-1">
              {errors.deliveryAddress}
            </p>
          )}
        </div>

        {/* Special Instructions */}
        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-bold text-[#3D271B]">
            Special Instructions
          </label>
          <textarea
            rows="2"
            placeholder="e.g. deliver after 4 PM / custom notes (optional)"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="block w-full px-4 py-3.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-2xl text-sm sm:text-base text-[#3D271B] focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827] font-medium"
          />
        </div>

        {/* Live Billing Box */}
        {selectedProduct && (
          <div className="bg-gradient-to-br from-[#FAF6F0] to-[#FAF0E6] p-6 rounded-3xl border border-[#E6CCB2]/50 space-y-3 shadow-xs">
            <h4 className="font-extrabold text-[#3D271B] border-b border-[#E6CCB2]/30 pb-2 text-xs uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag size={16} className="text-[#a65827]" /> Live billing preview
            </h4>
            <div className="flex justify-between items-center text-[#6E5A4F] font-semibold text-sm sm:text-base">
              <span>
                {selectedProduct.name} (x{quantity})
              </span>
              <span className="font-mono">
                ₹{Number(selectedProduct.sellingPrice || 0).toFixed(2)} each
              </span>
            </div>
            <div className="flex justify-between items-center text-base sm:text-lg font-black text-[#3D271B] pt-3 border-t border-[#E6CCB2]/30">
              <span>Grand Total Amount</span>
              <span className="text-[#a65827] font-mono text-2xl sm:text-3xl font-black">
                ₹{Number(totalAmount || 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-[#FAF6F0] justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="w-full sm:w-auto px-8 py-3.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-2xl font-bold transition cursor-pointer text-sm sm:text-base text-center"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-9 py-3.5 bg-gradient-to-r from-[#3D271B] via-[#a65827] to-[#DFA250] hover:opacity-95 text-[#FAF6F0] rounded-2xl font-black shadow-xl hover:shadow-2xl transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Placing...
              </>
            ) : (
              <>
                <Save size={18} /> Place Order
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateOrder;
