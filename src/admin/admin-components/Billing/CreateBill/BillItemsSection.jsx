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
  Edit3,
} from "lucide-react";

const BillItemsSection = ({
  products = [],
  selectedProductId,
  handleProductChange,
  customProductName = "",
  setCustomProductName = () => {},
  itemPrice,
  setItemPrice,
  itemQuantity,
  setItemQuantity,
  handleAddItem,
  items = [],
  handleRemoveItem,
  handleUpdateItemQuantity = () => {},
  handleUpdateItemPrice = () => {},
  errors = {},
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const customInputRef = useRef(null);

  // Find currently selected product object
  const selectedProduct = products.find((p) => p._id === selectedProductId);

  // Keep search query in sync when selectedProductId changes/resets
  useEffect(() => {
    if (selectedProduct) {
      setSearchQuery(
        `${selectedProduct.name} (₹${selectedProduct.sellingPrice} / ${selectedProduct.unit})`
      );
      setIsCustomMode(false);
    } else if (!selectedProductId && !customProductName) {
      setSearchQuery("");
    }
  }, [selectedProductId, selectedProduct, customProductName]);

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
        } else if (!customProductName) {
          setSearchQuery("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedProduct, customProductName]);

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
    setIsCustomMode(false);
    setCustomProductName("");
    handleProductChange({ target: { value: prod._id } });
    setSearchQuery(`${prod.name} (₹${prod.sellingPrice} / ${prod.unit})`);
    setIsOpen(false);
  };

  const handleClearSelection = (e) => {
    e.stopPropagation();
    handleProductChange({ target: { value: "" } });
    setCustomProductName("");
    setSearchQuery("");
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleSelectAsCustomItem = (name) => {
    setIsCustomMode(true);
    setCustomProductName(name);
    handleProductChange({ target: { value: "" } });
    setSearchQuery(name);
    setIsOpen(false);
    if (!itemPrice) {
      setItemPrice("");
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-[#E6CCB2]/40 shadow-sm space-y-5 sm:space-y-6">
      {/* SECTION TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#FAF6F0] pb-3.5 gap-1.5 sm:gap-2">
        <h3 className="font-bold text-[#3D271B] uppercase tracking-wider text-sm sm:text-base flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#FAF6F0] text-[#a65827] flex items-center justify-center text-xs font-black shrink-0">
            2
          </span>
          Items List
        </h3>
        <span className="text-xs sm:text-sm text-[#6E5A4F] font-semibold">
          Search catalog sweets or enter custom manual items
        </span>
      </div>

      {/* ==================================================
          ITEM SELECTOR BAR (Fully Responsive Mobile/Tablet/Desktop)
          - Mobile (< 640px): Stacked (Product -> Price & Qty 2-col -> Add Full Width)
          - Tablet (640px - 1023px): Row 1 (Product Full), Row 2 (Price 4-col, Qty 4-col, Add 4-col)
          - Desktop (1024px+): Single Row (Product 5-col, Price 2-col, Qty 2-col, Add 3-col)
      ================================================== */}
      <div className="flex flex-col sm:grid sm:grid-cols-12 gap-3.5 sm:gap-4 sm:items-end bg-[#FAF6F0]/40 p-3.5 sm:p-5 rounded-2xl border border-[#E6CCB2]/30">
        
        {/* PRODUCT SELECTOR / CUSTOM ITEM INPUT */}
        <div className="w-full sm:col-span-12 lg:col-span-5 space-y-1.5 sm:space-y-2 relative" ref={dropdownRef}>
          {/* Header with Mode Switch */}
          <div className="flex items-center justify-between gap-2">
            <label className="block text-xs sm:text-sm md:text-base font-bold text-[#3D271B] truncate">
              {isCustomMode ? "Manual / Custom Item" : "Sweet Product"}{" "}
              <span className="text-red-500">*</span>
            </label>

            {/* Quick Switch Mode Tabs */}
            <div className="inline-flex items-center gap-1 bg-white p-0.5 sm:p-1 rounded-xl border border-[#E6CCB2]/40 shadow-xs shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(false);
                  setCustomProductName("");
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  !isCustomMode
                    ? "bg-[#FAF6F0] text-[#a65827] shadow-xs"
                    : "text-[#6E5A4F] hover:text-[#3D271B]"
                }`}
              >
                Catalog
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(true);
                  handleProductChange({ target: { value: "" } });
                  setSearchQuery("");
                  setTimeout(() => customInputRef.current?.focus(), 50);
                }}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  isCustomMode
                    ? "bg-[#a65827] text-white shadow-xs"
                    : "text-[#6E5A4F] hover:text-[#3D271B]"
                }`}
              >
                <Plus size={12} />
                Custom
              </button>
            </div>
          </div>

          {/* INPUT CONTAINER */}
          {isCustomMode ? (
            /* DIRECT CUSTOM ITEM TEXT INPUT */
            <div className="relative flex items-center bg-white border-2 border-[#a65827]/40 rounded-2xl shadow-xs focus-within:border-[#a65827] focus-within:ring-2 focus-within:ring-[#a65827]/20 transition">
              <div className="pl-3.5 pr-2 text-[#a65827] flex items-center pointer-events-none shrink-0">
                <Edit3 size={18} />
              </div>
              <input
                ref={customInputRef}
                type="text"
                value={customProductName}
                onChange={(e) => setCustomProductName(e.target.value)}
                placeholder="Enter item name (e.g. Samosa, Chai)..."
                className="w-full py-3 sm:py-3.5 pr-10 bg-transparent text-xs sm:text-sm md:text-base text-[#3D271B] font-semibold focus:outline-none placeholder-[#6E5A4F]/60"
              />
              {customProductName && (
                <button
                  type="button"
                  onClick={() => setCustomProductName("")}
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  title="Clear text"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ) : (
            /* CATALOG SEARCHABLE DROPDOWN INPUT */
            <div className="relative">
              <div
                className="relative flex items-center bg-white border border-[#E6CCB2]/40 rounded-2xl shadow-xs focus-within:ring-2 focus-within:ring-[#a65827]/20 focus-within:border-[#a65827] transition cursor-pointer"
                onClick={() => {
                  setIsOpen(true);
                  inputRef.current?.focus();
                }}
              >
                <div className="pl-3.5 pr-2 text-[#a65827] flex items-center pointer-events-none shrink-0">
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
                  placeholder="Search sweet or type custom item (e.g. Samosa)..."
                  className="w-full py-3 sm:py-3.5 pr-16 bg-transparent text-xs sm:text-sm md:text-base text-[#3D271B] font-semibold focus:outline-none placeholder-[#6E5A4F]/60"
                />

                <div className="absolute right-2.5 flex items-center gap-1">
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
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-[#E6CCB2]/50 shadow-2xl z-50 overflow-hidden max-h-64 sm:max-h-72 md:max-h-80 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150 w-full">
                  
                  {/* Option to use current query as custom item if typed something */}
                  {searchQuery.trim() && (
                    <div
                      onClick={() => handleSelectAsCustomItem(searchQuery.trim())}
                      className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-b border-[#E6CCB2]/40 flex items-center justify-between cursor-pointer transition text-[#a65827]"
                    >
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold truncate">
                        <span className="w-5 h-5 rounded-md bg-[#a65827] text-white flex items-center justify-center shrink-0 text-xs">
                          <Plus size={13} />
                        </span>
                        <span className="truncate">
                          Add <strong>"{searchQuery.trim()}"</strong> as custom item
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-[#a65827]/10 text-[#a65827] px-1.5 sm:px-2 py-0.5 rounded-md shrink-0 ml-2">
                        Manual
                      </span>
                    </div>
                  )}

                  <div className="px-3.5 sm:px-4 py-2 bg-[#FAF6F0] border-b border-[#E6CCB2]/30 flex justify-between items-center text-xs sm:text-sm font-bold text-[#6E5A4F]">
                    <span>
                      {filteredProducts.length} catalog sweet
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
                            className={`p-3 sm:p-3.5 flex items-center justify-between gap-2.5 sm:gap-3 cursor-pointer transition ${
                              isSelected
                                ? "bg-[#FAF6F0] text-[#a65827]"
                                : "hover:bg-[#FAF6F0]/60 text-[#3D271B]"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-50 border border-[#E6CCB2]/30 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                                {p.images?.[0]?.url ? (
                                  <img
                                    src={p.images[0].url}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Layers className="text-[#E6CCB2] h-5 w-5 sm:h-6 sm:w-6" />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-xs sm:text-sm md:text-base leading-tight truncate">
                                  {p.name}
                                </p>
                                {p.category?.name && (
                                  <span className="inline-block text-[11px] sm:text-xs text-[#6E5A4F] font-semibold mt-0.5 truncate">
                                    {p.category.name}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                              <div className="text-right">
                                <span className="font-black font-mono text-xs sm:text-sm md:text-base text-[#a65827] whitespace-nowrap">
                                  ₹{Number(p.sellingPrice || 0).toFixed(2)}
                                </span>
                                <span className="block text-[10px] sm:text-xs text-[#6E5A4F] font-semibold whitespace-nowrap">
                                  / {p.unit}
                                </span>
                              </div>

                              {isSelected && (
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#a65827] text-white flex items-center justify-center">
                                  <Check size={13} />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center space-y-3">
                        <ShoppingBag className="mx-auto h-7 w-7 sm:h-8 sm:w-8 text-[#a65827]/40" />
                        <p className="text-xs sm:text-sm font-semibold text-[#6E5A4F]">
                          No catalog sweets match "{searchQuery}".
                        </p>
                        {searchQuery.trim() && (
                          <button
                            type="button"
                            onClick={() => handleSelectAsCustomItem(searchQuery.trim())}
                            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-[#a65827] hover:bg-[#8B4513] text-white text-xs sm:text-sm font-bold rounded-xl transition shadow-xs cursor-pointer"
                          >
                            <Plus size={15} />
                            Add "{searchQuery.trim()}" as Custom Item
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PRICE & QUANTITY ROW (Clean 2-column on mobile, responsive grid in tablet/desktop) */}
        <div className="grid grid-cols-2 gap-3 w-full sm:col-span-8 lg:col-span-4 sm:items-end">
          {/* PRICE INPUT (Manual Entry Allowed) */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm md:text-base font-bold text-[#3D271B]">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              placeholder="0.00"
              className="block w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-white border border-[#E6CCB2]/40 rounded-2xl text-xs sm:text-sm md:text-base text-[#3D271B] font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827]"
            />
          </div>

          {/* QUANTITY INPUT (Manual Typing Allowed + Stepper) */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm md:text-base font-bold text-[#3D271B]">
              Qty <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={() => {
                  const current = Number(itemQuantity) || 1;
                  setItemQuantity(String(Math.max(1, current - 1)));
                }}
                className="absolute left-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FAF6F0] hover:bg-[#E6CCB2]/50 text-[#3D271B] font-bold text-base flex items-center justify-center transition cursor-pointer z-10"
                title="Decrease quantity"
              >
                -
              </button>
              <input
                type="number"
                step="any"
                min="0.01"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
                placeholder="1"
                className="block w-full px-8 sm:px-10 py-3 sm:py-3.5 bg-white border border-[#E6CCB2]/40 rounded-2xl text-center text-xs sm:text-sm md:text-base text-[#3D271B] font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#a65827]/20 focus:border-[#a65827]"
              />
              <button
                type="button"
                onClick={() => {
                  const current = Number(itemQuantity) || 0;
                  setItemQuantity(String(current + 1));
                }}
                className="absolute right-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FAF6F0] hover:bg-[#E6CCB2]/50 text-[#3D271B] font-bold text-base flex items-center justify-center transition cursor-pointer z-10"
                title="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* ADD BUTTON */}
        <div className="w-full sm:col-span-4 lg:col-span-3 pt-1 sm:pt-0">
          <button
            type="button"
            onClick={handleAddItem}
            className="w-full h-[48px] sm:h-[50px] md:h-[52px] bg-gradient-to-r from-[#3D271B] to-[#a65827] hover:from-[#a65827] hover:to-[#DFA250] text-white rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] text-xs sm:text-sm md:text-base font-bold"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>
      </div>

      {/* ==================================================
          ITEMS TABLE / CARDS
      ================================================== */}
      {items.length > 0 ? (
        <>
          {/* DESKTOP & TABLET TABLE (Scrollable container for tablets) */}
          <div className="hidden sm:block border border-[#E6CCB2]/30 rounded-2xl overflow-x-auto bg-white shadow-xs">
            <table className="w-full text-left min-w-[560px]">
              <thead>
                <tr className="bg-[#FAF6F0]/60 text-[#6E5A4F] font-bold text-xs sm:text-sm uppercase tracking-wider border-b border-[#E6CCB2]/30">
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 md:px-6 md:py-4">Item Name</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 md:px-6 md:py-4 text-center">Qty</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 md:px-6 md:py-4 text-right">Price (₹)</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 md:px-6 md:py-4 text-right">Total</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-3.5 md:px-6 md:py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#FAF6F0] text-xs sm:text-sm md:text-base font-medium text-[#3D271B]">
                {items.map((it, idx) => (
                  <tr
                    key={`${it.productId || "custom"}-${idx}`}
                    className="hover:bg-[#FAF6F0]/25 transition"
                  >
                    {/* Item Name + Custom Pill */}
                    <td className="px-3 py-3 sm:px-4 sm:py-3.5 md:px-6 md:py-4 font-bold text-[#3D271B]">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span>{it.productName}</span>
                        {(!it.productId || it.isCustom) && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                            Custom
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Quantity with live +/- and manual typing */}
                    <td className="px-3 py-3 sm:px-4 sm:py-3.5 md:px-6 md:py-4 text-center">
                      <div className="inline-flex items-center justify-center gap-1 bg-[#FAF6F0] rounded-xl p-1 border border-[#E6CCB2]/40">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateItemQuantity(
                              idx,
                              Math.max(1, Number(it.quantity) - 1)
                            )
                          }
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white hover:bg-[#a65827] hover:text-white flex items-center justify-center text-[#3D271B] font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer"
                          title="Decrease Qty"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          step="any"
                          min="0.01"
                          value={it.quantity}
                          onChange={(e) =>
                            handleUpdateItemQuantity(idx, e.target.value)
                          }
                          className="w-11 sm:w-14 text-center font-bold font-mono text-xs sm:text-sm bg-transparent focus:outline-none focus:bg-white rounded px-1"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateItemQuantity(
                              idx,
                              Number(it.quantity) + 1
                            )
                          }
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white hover:bg-[#a65827] hover:text-white flex items-center justify-center text-[#3D271B] font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer"
                          title="Increase Qty"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Price with live manual editing */}
                    <td className="px-3 py-3 sm:px-4 sm:py-3.5 md:px-6 md:py-4 text-right font-mono font-semibold">
                      <div className="inline-flex items-center justify-end gap-1">
                        <span className="text-[#6E5A4F] font-bold text-xs">₹</span>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={it.price}
                          onChange={(e) =>
                            handleUpdateItemPrice(idx, e.target.value)
                          }
                          className="w-16 sm:w-20 text-right font-mono font-bold text-xs sm:text-sm px-1.5 sm:px-2 py-1 rounded-lg border border-transparent hover:border-[#E6CCB2]/50 focus:border-[#a65827] focus:bg-white focus:outline-none transition"
                        />
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-3 py-3 sm:px-4 sm:py-3.5 md:px-6 md:py-4 text-right font-black font-mono text-[#a65827] whitespace-nowrap">
                      ₹{Number(it.total).toFixed(2)}
                    </td>

                    {/* Remove Action */}
                    <td className="px-3 py-3 sm:px-4 sm:py-3.5 md:px-6 md:py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS (< 640px) - Full Touch/Edit Enabled */}
          <div className="block sm:hidden space-y-3">
            {items.map((it, idx) => (
              <div
                key={`${it.productId || "custom"}-${idx}`}
                className="bg-[#FAF6F0]/40 p-3.5 rounded-2xl border border-[#E6CCB2]/40 space-y-3 shadow-xs"
              >
                {/* Header: Item Name + Custom Badge + Delete Button */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <p className="font-bold text-sm text-[#3D271B] truncate">
                      {it.productName}
                    </p>
                    {(!it.productId || it.isCustom) && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                        Custom
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition cursor-pointer shrink-0"
                    title="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Controls Row: Qty Stepper, Price Input, and Subtotal */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E6CCB2]/30 flex-wrap">
                  {/* Mobile Qty Stepper */}
                  <div className="inline-flex items-center gap-1 bg-white rounded-xl p-1 border border-[#E6CCB2]/50 shadow-xs">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateItemQuantity(
                          idx,
                          Math.max(1, Number(it.quantity) - 1)
                        )
                      }
                      className="w-7 h-7 rounded-lg bg-[#FAF6F0] hover:bg-[#a65827] hover:text-white flex items-center justify-center font-bold text-xs transition"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      value={it.quantity}
                      onChange={(e) =>
                        handleUpdateItemQuantity(idx, e.target.value)
                      }
                      className="w-10 text-center font-bold font-mono text-xs bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateItemQuantity(idx, Number(it.quantity) + 1)
                      }
                      className="w-7 h-7 rounded-lg bg-[#FAF6F0] hover:bg-[#a65827] hover:text-white flex items-center justify-center font-bold text-xs transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Mobile Price Input */}
                  <div className="inline-flex items-center gap-1 bg-white rounded-xl px-2 py-1 border border-[#E6CCB2]/50 shadow-xs">
                    <span className="text-[#6E5A4F] font-bold text-xs">₹</span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={it.price}
                      onChange={(e) =>
                        handleUpdateItemPrice(idx, e.target.value)
                      }
                      className="w-14 text-right font-mono font-bold text-xs bg-transparent focus:outline-none"
                    />
                  </div>

                  {/* Mobile Total */}
                  <div className="text-right ml-auto">
                    <span className="font-black font-mono text-sm text-[#a65827]">
                      ₹{Number(it.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="py-6 sm:py-8 text-center bg-[#FAF6F0]/25 rounded-2xl border border-dashed border-[#E6CCB2]/40 space-y-2">
          <ShoppingBag className="mx-auto h-7 w-7 sm:h-8 sm:w-8 text-[#a65827]/40" />
          <p className="text-xs sm:text-sm font-semibold text-[#6E5A4F] px-4">
            No items added yet. Search a catalog sweet or enter a custom item above and click{" "}
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
