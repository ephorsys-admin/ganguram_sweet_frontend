import { useState, useEffect } from "react";
import { ArrowLeft, ClipboardList, Loader2, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createWalkinBill } from "../../redux/features/bill/billThunk";
import { getProducts } from "../../redux/features/product/productThunk";
import { useToast } from "../../context/ToastContext";

const AdminCreateBill = () => {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { products = [] } = useSelector((state) => state.product);
  const { isLoading: isSaving } = useSelector((state) => state.bill);

  // Customer Details State
  const [customerName, setCustomerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");

  // Items State (Draft list)
  const [items, setItems] = useState([]);

  // Item Selector Row State
  const [selectedProductId, setSelectedProductId] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [itemQuantity, setItemQuantity] = useState(1);

  // Discount State
  const [discountType, setDiscountType] = useState("FLAT");
  const [discountValue, setDiscountValue] = useState(0);

  // Form Validation State
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleProductChange = (e) => {
    const prodId = e.target.value;
    setSelectedProductId(prodId);
    const prod = products.find((p) => p._id === prodId);
    if (prod) {
      setItemPrice(prod.sellingPrice);
    } else {
      setItemPrice(0);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      showToast("Please select a sweet product first.", "error");
      return;
    }
    if (itemQuantity < 1) {
      showToast("Quantity must be at least 1.", "error");
      return;
    }
    const prod = products.find((p) => p._id === selectedProductId);
    if (!prod) return;

    const existingIndex = items.findIndex((item) => item.productId === selectedProductId);
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += itemQuantity;
      updated[existingIndex].total = updated[existingIndex].quantity * updated[existingIndex].price;
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          productId: selectedProductId,
          productName: prod.name,
          quantity: itemQuantity,
          price: Number(itemPrice),
          total: itemQuantity * Number(itemPrice),
        },
      ]);
    }

    setSelectedProductId("");
    setItemPrice(0);
    setItemQuantity(1);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculations
  const subTotal = items.reduce((acc, curr) => acc + curr.total, 0);
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

    if (whatsappNumber.trim() && !/^[6-9]\d{9}$/.test(whatsappNumber.trim())) {
      tempErrors.whatsappNumber = "Enter a valid WhatsApp number.";
    }

    if (items.length === 0) {
      tempErrors.items = "Please add at least one sweet item to generate the bill.";
    }

    if (discountType === "PERCENTAGE" && (discountValue < 0 || discountValue > 100)) {
      tempErrors.discount = "Discount percentage must be between 0 and 100.";
    } else if (discountType === "FLAT" && discountValue < 0) {
      tempErrors.discount = "Discount value cannot be negative.";
    } else if (discountType === "FLAT" && discountValue > subTotal) {
      tempErrors.discount = "Flat discount cannot exceed subtotal amount.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const resultAction = await dispatch(
        createWalkinBill({
          customerName: customerName.trim(),
          mobile: mobile.trim(),
          email: email.trim(),
          whatsappNumber: whatsappNumber.trim(),
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
          address: address.trim(),
          items: items.map((it) => ({
            productId: it.productId,
            productName: it.productName,
            quantity: it.quantity,
            price: it.price,
          })),
          discountType,
          discountValue: Number(discountValue),
        })
      ).unwrap();

      if (resultAction.success) {
        showToast("Walk-in bill created successfully!", "success");
        navigate("/admin/billing");
        
        // Open the generated PDF receipt from Cloudinary in a new browser tab
        if (resultAction.data?.invoiceUrl) {
          window.open(resultAction.data.invoiceUrl, "_blank");
        }
      }
    } catch (err) {
      showToast(err.message || "Failed to create walk-in bill", "error");
    }
  };

  return (
    <div className="space-y-6 text-xs font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2">
        <button
          onClick={() => navigate("/admin/billing")}
          className="p-2 hover:bg-white text-[#6E5A4F] hover:text-[#3D271B] border border-[#E6CCB2]/30 rounded-xl transition cursor-pointer"
          title="Back to Bills"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3D271B] flex items-center gap-2">
            <ClipboardList className="text-[#a65827] h-8 w-8" />
            New Walk-in Bill
          </h1>
          <p className="text-xs text-[#6E5A4F] mt-1">Generate POS invoices, register customer details, and calculate discounts.</p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Customer Details Form */}
        <div className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-xs space-y-4">
          <h4 className="font-bold text-[#3D271B] uppercase tracking-wider text-[11px] border-b border-[#FAF6F0] pb-2">
            1. Customer Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[#6E5A4F] font-bold">Customer Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="e.g. Rajesh Kumar"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="block w-full px-3.5 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none"
              />
              {errors.customerName && <p className="text-[10px] font-bold text-red-655">{errors.customerName}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-[#6E5A4F] font-bold">Mobile Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="10-digit number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="block w-full px-3.5 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono focus:outline-none"
              />
              {errors.mobile && <p className="text-[10px] font-bold text-red-650">{errors.mobile}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-[#6E5A4F] font-bold">Email Address</label>
              <input
                type="email"
                placeholder="e.g. name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3.5 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] focus:outline-none"
              />
              {errors.email && <p className="text-[10px] font-bold text-red-650">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-[#6E5A4F] font-bold">WhatsApp Number</label>
              <input
                type="text"
                placeholder="optional"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="block w-full px-3.5 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono focus:outline-none"
              />
              {errors.whatsappNumber && <p className="text-[10px] font-bold text-red-650">{errors.whatsappNumber}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-[#6E5A4F] font-bold">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="block w-full px-3.5 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[#6E5A4F] font-bold">Address</label>
            <input
              type="text"
              placeholder="Residential address details (optional)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="block w-full px-3.5 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none"
            />
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-xs space-y-4">
          <h4 className="font-bold text-[#3D271B] uppercase tracking-wider text-[11px] border-b border-[#FAF6F0] pb-2 flex items-center gap-1.5">
            <ShoppingBag size={13} className="text-[#a65827]" /> 2. Items List
          </h4>

          {/* Add Item Row Form */}
          <div className="flex flex-col sm:grid sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-[#6E5A4F] font-bold">Sweet Product</label>
              <select
                value={selectedProductId}
                onChange={handleProductChange}
                className="block w-full px-3.5 py-2.5 bg-[#FAF6F0]/45 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none"
              >
                <option value="">-- Choose Sweet --</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (₹{p.sellingPrice} / {p.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* Price, Qty, and Add button grouped side-by-side on mobile */}
            <div className="grid grid-cols-12 gap-2 sm:col-span-2 items-end">
              <div className="space-y-1 col-span-5 sm:col-span-6">
                <label className="block text-[#6E5A4F] font-bold">Price</label>
                <input
                  type="number"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(Number(e.target.value) || 0)}
                  className="block w-full px-3.5 py-2.5 bg-white border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-1 col-span-4 sm:col-span-3">
                <label className="block text-[#6E5A4F] font-bold">Qty</label>
                <input
                  type="number"
                  min="1"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="block w-full px-3.5 py-2.5 bg-white border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono focus:outline-none"
                />
              </div>

              <div className="col-span-3 sm:col-span-3">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full h-9.5 bg-[#a65827] text-white rounded-xl hover:bg-[#3D271B] transition cursor-pointer flex items-center justify-center gap-1 shadow-xs hover:scale-105 active:scale-95 text-[11px] font-bold"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>
          </div>

          {/* Draft list table */}
          {items.length > 0 ? (
            <>
              {/* Desktop/Tablet Table View */}
              <div className="hidden sm:block border border-[#E6CCB2]/20 rounded-2xl overflow-hidden mt-3 bg-white">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#FAF6F0]/40 text-[#6E5A4F] font-semibold border-b border-[#E6CCB2]/20">
                      <th className="px-5 py-3">Item Name</th>
                      <th className="px-5 py-3 text-center">Qty</th>
                      <th className="px-5 py-3 text-right">Price</th>
                      <th className="px-5 py-3 text-right">Total</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FAF6F0] text-[#3D271B]">
                    {items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF6F0]/15">
                        <td className="px-5 py-3 font-bold">{it.productName}</td>
                        <td className="px-5 py-3 text-center font-bold font-mono">{it.quantity}</td>
                        <td className="px-5 py-3 text-right font-mono">₹{it.price}</td>
                        <td className="px-5 py-3 text-right font-bold font-mono">₹{it.total}</td>
                        <td className="px-5 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 text-red-650 hover:bg-red-50 rounded transition"
                            title="Remove Item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="block sm:hidden space-y-2 mt-3">
                {items.map((it, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-[#E6CCB2]/20 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-bold text-[#3D271B]">{it.productName}</p>
                      <p className="text-[10px] text-[#6E5A4F] font-semibold font-mono">
                        {it.quantity} x ₹{it.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold font-mono text-xs text-[#a65827]">₹{it.total}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 text-red-655 bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-[11px] font-semibold text-slate-500 text-center py-5 bg-[#FAF6F0]/20 rounded-2xl border border-dashed border-[#E6CCB2]/30 mt-3">
              No items added yet. Choose a product and click "+ Add" to add it to the list.
            </p>
          )}
          {errors.items && <p className="text-[10px] font-bold text-red-650 mt-1">{errors.items}</p>}
        </div>

        {/* Discount Section & Billing calculations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Discount Configuration */}
          <div className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-xs space-y-4 flex flex-col justify-between">
            <h4 className="font-bold text-[#3D271B] uppercase tracking-wider text-[11px] border-b border-[#FAF6F0] pb-2">
              3. Discount config
            </h4>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="block text-[#6E5A4F] font-bold">Discount Type</label>
                <div className="flex gap-5">
                  <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="discType"
                      value="FLAT"
                      checked={discountType === "FLAT"}
                      onChange={() => setDiscountType("FLAT")}
                      className="accent-[#a65827]"
                    />
                    Flat (₹)
                  </label>
                  <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="discType"
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
                  className="block w-full px-3.5 py-2 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono focus:outline-none"
                />
                {errors.discount && <p className="text-[10px] font-bold text-red-655 mt-1">{errors.discount}</p>}
              </div>
            </div>
          </div>

          {/* Billing calculations Summary */}
          <div className="bg-[#FAF6F0]/40 p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-xs space-y-4 flex flex-col justify-between">
            <h4 className="font-extrabold text-[#3D271B] border-b border-[#E6CCB2]/20 pb-2">Billing calculations</h4>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-[#6E5A4F] font-bold">
                <span>Subtotal:</span>
                <span className="font-mono">₹{subTotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-red-655 font-bold">
                  <span>Discount Amount:</span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2.5 border-t border-[#E6CCB2]/25 text-sm font-black text-[#3D271B]">
                <span>Grand Total:</span>
                <span className="text-[#a65827] font-mono text-lg font-black">₹{finalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#E6CCB2]/20">
          <button
            type="button"
            onClick={() => navigate("/admin/billing")}
            disabled={isSaving}
            className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-2.5 bg-gradient-to-r from-[#3D271B] to-[#a65827] hover:from-[#a65827] hover:to-[#DFA250] text-[#FAF6F0] rounded-xl font-bold shadow-lg transition-all duration-300 flex items-center gap-1.5 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSaving ? (
              <>
                <Loader2 size={13} className="animate-spin" /> Generating Receipt...
              </>
            ) : (
              "Generate Bill"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateBill;
