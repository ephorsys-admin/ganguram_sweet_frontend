import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Trash2,
  ShoppingBag,
  Search,
  ChevronDown,
  X,
  Check,
  Layers,
} from "lucide-react";

const BillItemsSection = ({
  products = [],
  selectedProductId,
  handleProductChange,
  itemPrice,
  setItemPrice,
  itemQuantity,
  setItemQuantity,
  handleAddItem,
  items = [],
  handleRemoveItem,
  errors = {},
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Find currently selected product object
  const selectedProduct = products.find((p) => p._id === selectedProductId);

  // Keep search query in sync when selectedProductId changes/resets
  useEffect(() => {
    if (selectedProduct) {
      setSearchQuery(
        `${selectedProduct.name} (₹${selectedProduct.sellingPrice} / ${selectedProduct.unit})`
      );
    } else if (!selectedProductId) {
      setSearchQuery("");
    }
  }, [selectedProductId, selectedProduct]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        if (selectedProduct) {
          setSearchQuery(
            `${selectedProduct.name} (₹${selectedProduct.sellingPrice} / ${selectedProduct.unit})`
          );
        } else {
          setSearchQuery("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedProduct]);

  // Filter products based on search query
  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const nameMatch = p.name?.toLowerCase().includes(query);
    const categoryMatch = p.category?.name?.toLowerCase().includes(query);
    const priceMatch = String(p.sellingPrice || "").includes(query);
    const unitMatch = p.unit?.toLowerCase().includes(query);
    return nameMatch || categoryMatch || priceMatch || unitMatch;
  });

  const handleSelectProduct = (prod) => {
    handleProductChange({ target: { value: prod._id } });
    setSearchQuery(`${prod.name} (₹${prod.sellingPrice} / ${prod.unit})`);
    setIsOpen(false);
  };

  const handleClearSelection = (e) => {
    e.stopPropagation();
    handleProductChange({ target: { value: "" } });
    setSearchQuery("");
    setIsOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white p-5 sm:p-6 md:p-8 rounded-3xl border border-[#E6CCB2]/40 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-[#FAF6F0] pb-3.5">
        <h3 className="font-bold text-[#3D271B] uppercase tracking-wider text-sm sm:text-base flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#FAF6F0] text-[#a65827] flex items-center justify-center text-xs font-black">
            2
          </span>
          Items List
        </h3>
        <span className="text-xs sm:text-sm text-[#6E5A4F] font-semibold">
          Search & add sweet items to bill
        </span>
      </div>

      {/* ITEM SELECTOR BAR */}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-stretch md:items-end bg-[#FAF6F0]/40 p-4 sm:p-5 rounded-2xl border border-[#E6CCB2]/30">
        {/* SEARCHABLE SWEET PRODUCT DROPDOWN */}
        <div className="w-full md:col-span-6 space-y-2 relative" ref={dropdownRef}>
          <label className="block text-sm sm:text-base font-bold text-[#3D271B]">
            Sweet Product <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <div
              className="relative flex items-center bg-white border border-[#E6CCB2]/40 rounded-2xl shadow-xs focus-within:ring-2 focus-within:ring-[#a65827]/20 focus-within:border-[#a65827] transition cursor-pointer"
              onClick={() => {
                setIsOpen(true);
                inputRef.current?.focus();
              }}
            >
              <div className="pl-4 pr-2 text-[#a65827] flex items-center pointer-events-none">
                <Search size={18} />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setIsOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsOpen(true);
                  if (selectedProductId && e.target.value !== selectedProduct?.name) {
                    handleProductChange({ target: { value: "" } });
                  }
                }}
                placeholder="Search sweet product..."
                className="w-full py-3.5 pr-16 bg-transparent text-sm sm:text-base text-[#3D271B] font-semibold focus:outline-none placeholder-[#6E5A4F]/60"
              />

              <div className="absolute right-3 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen((prev) => !prev);
                  }}
                  className="p-1.5 text-[#6E5A4F] hover:text-[#3D271B] rounded-lg transition cursor-pointer"
                >
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* DROPDOWN MENU */}
            {isOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-[#E6CCB2]/50 shadow-2xl z-50 overflow-hidden max-h-72 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150 w-full">
                <div className="px-4 py-2.5 bg-[#FAF6F0] border-b border-[#E6CCB2]/30 flex justify-between items-center text-xs sm:text-sm font-bold text-[#6E5A4F]">
                  <span>
                    {filteredProducts.length} sweet
                    {filteredProducts.length !== 1 ? "s" : ""} found
                  </span>
                  <span className="text-xs text-[#a65827]">
                    Click to select
                  </span>
                </div>

                <div className="overflow-y-auto divide-y divide-[#FAF6F0]">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => {
                      const isSelected = p._id === selectedProductId;
                      return (
                        <div
                          key={p._id}
                          onClick={() => handleSelectProduct(p)}
                          className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition ${
                            isSelected
                              ? "bg-[#FAF6F0] text-[#a65827]"
                              : "hover:bg-[#FAF6F0]/60 text-[#3D271B]"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-[#E6CCB2]/30 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                              {p.images?.[0]?.url ? (
                                <img
                                  src={p.images[0].url}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Layers className="text-[#E6CCB2] h-6 w-6" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-sm sm:text-base leading-tight truncate">
                                {p.name}
                              </p>
                              {p.category?.name && (
                                <span className="inline-block text-xs text-[#6E5A4F] font-semibold mt-0.5">
                                  {p.category.name}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <span className="font-black font-mono text-sm sm:text-base text-[#a65827] whitespace-nowrap">
                                ₹{Number(p.sellingPrice || 0).toFixed(2)}
                              </span>
                              <span className="block text-xs text-[#6E5A4F] font-semibold whitespace-nowrap">
                                / {p.unit}
                              </span>
                            </div>

                            {isSelected && (
                              <div className="w-6 h-6 rounded-full bg-[#a65827] text-white flex items-center justify-center">
                                <Check size={14} />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center space-y-2">
                      <ShoppingBag className="mx-auto h-8 w-8 text-[#a65827]/40" />
                      <p className="text-sm font-semibold text-[#6E5A4F]">
                        No sweets match "{searchQuery}".
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          inputRef.current?.focus();
                        }}
                        className="text-xs sm:text-sm text-[#a65827] font-bold underline cursor-pointer"
                      >
                        Show all sweets
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PRICE & QUANTITY (Side-by-side) */}
        <div className="grid grid-cols-2 gap-3.5 md:col-span-4">
          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-bold text-[#3D271B]">
              Price (₹)
            </label>
            <input
              type="number"
              min="0"
              value={itemPrice}
              onChange={(e) => setItemPrice(Number(e.target.value) || 0)}
              className="block w-full px-4 py-3.5 bg-white border border-[#E6CCB2]/40 rounded-2xl text-sm sm:text-base text-[#3D271B] font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-bold text-[#3D271B]">
              Qty
            </label>
            <input
              type="number"
              min="1"
              value={itemQuantity}
              onChange={(e) =>
                setItemQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="block w-full px-4 py-3.5 bg-white border border-[#E6CCB2]/40 rounded-2xl text-sm sm:text-base text-[#3D271B] font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827]"
            />
          </div>
        </div>

        {/* ADD BUTTON */}
        <div className="w-full md:col-span-2 pt-1 md:pt-0">
          <button
            type="button"
            onClick={handleAddItem}
            className="w-full h-[52px] bg-gradient-to-r from-[#3D271B] to-[#a65827] hover:from-[#a65827] hover:to-[#DFA250] text-white rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base font-bold"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>
      </div>

      {/* ==================================================
          ITEMS TABLE / LIST
      ================================================== */}
      {items.length > 0 ? (
        <>
          {/* DESKTOP & TABLET TABLE */}
          <div className="hidden sm:block border border-[#E6CCB2]/30 rounded-2xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#FAF6F0]/60 text-[#6E5A4F] font-bold text-xs sm:text-sm uppercase tracking-wider border-b border-[#E6CCB2]/30">
                  <th className="px-6 py-4">Item Name</th>
                  <th className="px-6 py-4 text-center">Qty</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#FAF6F0] text-sm sm:text-base font-medium text-[#3D271B]">
                {items.map((it, idx) => (
                  <tr
                    key={`${it.productId}-${idx}`}
                    className="hover:bg-[#FAF6F0]/25 transition"
                  >
                    <td className="px-6 py-4 font-bold text-[#3D271B]">
                      {it.productName}
                    </td>

                    <td className="px-6 py-4 text-center font-bold font-mono">
                      {it.quantity}
                    </td>

                    <td className="px-6 py-4 text-right font-mono font-semibold">
                      ₹{Number(it.price).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-right font-black font-mono text-[#a65827]">
                      ₹{Number(it.total).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="block sm:hidden space-y-3">
            {items.map((it, idx) => (
              <div
                key={`${it.productId}-${idx}`}
                className="bg-[#FAF6F0]/30 p-4 rounded-2xl border border-[#E6CCB2]/30 flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="font-bold text-base text-[#3D271B] truncate">
                    {it.productName}
                  </p>
                  <p className="text-xs text-[#6E5A4F] font-semibold font-mono">
                    {it.quantity} qty × ₹{Number(it.price).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-black font-mono text-base text-[#a65827]">
                    ₹{Number(it.total).toFixed(2)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="py-8 text-center bg-[#FAF6F0]/25 rounded-2xl border border-dashed border-[#E6CCB2]/40 space-y-2">
          <ShoppingBag className="mx-auto h-8 w-8 text-[#a65827]/40" />
          <p className="text-sm font-semibold text-[#6E5A4F]">
            No items added yet. Search or choose a sweet above and click{" "}
            <span className="font-bold text-[#a65827]">"+ Add Item"</span>.
          </p>
        </div>
      )}

      {errors.items && (
        <p className="text-xs sm:text-sm font-bold text-red-500 mt-1">
          {errors.items}
        </p>
      )}
    </div>
  );
};

export default BillItemsSection;
