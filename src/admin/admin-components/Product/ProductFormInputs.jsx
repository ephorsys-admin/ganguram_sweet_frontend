import { Upload, Layers, ToggleRight, ToggleLeft, Loader2, Save } from "lucide-react";

const ProductFormInputs = ({
  name,
  setName,
  categoryId,
  setCategoryId,
  mrp,
  setMrp,
  sellingPrice,
  setSellingPrice,
  stock,
  setStock,
  unit,
  setUnit,
  status,
  setStatus,
  shortDescription,
  setShortDescription,
  description,
  setDescription,
  homeDelivery,
  setHomeDelivery,
  isFeatured,
  setIsFeatured,
  isBestSeller,
  setIsBestSeller,
  isTrending,
  setIsTrending,
  isNewArrival,
  setIsNewArrival,
  imagePreview,
  imageFile,
  handleImageChange,
  categories,
  isEdit,
  isSaving,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6CCB2]/30 shadow-xl space-y-6 text-xs text-slate-800 font-sans">
      {/* Banner Upload */}
      <div className="space-y-2">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block">Product Display Image</label>
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FAF6F0]/20 p-4 rounded-2xl border border-[#E6CCB2]/15">
          <div className="w-24 h-24 rounded-2xl bg-[#FAF6F0] border-2 border-dashed border-[#E6CCB2] flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Layers className="text-[#E6CCB2]/70 h-8 w-8" />
            )}
          </div>
          
          <label className="w-full sm:w-auto px-5 py-3 bg-[#FAF6F0] hover:bg-[#E6CCB2]/20 border border-[#E6CCB2]/40 rounded-xl cursor-pointer text-center text-xs text-[#6E5A4F] font-extrabold transition flex flex-col items-center justify-center gap-1">
            <Upload size={16} className="text-[#a65827]" />
            <span>{imageFile || imagePreview ? "Change Product Image" : "Upload Product Image"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-1">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block">Product Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Delicious Chhena Poda / Kaju Katli"
          className="block w-full px-4 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 text-xs text-[#3D271B] font-semibold"
          required
        />
      </div>

      {/* Category & Unit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block">Category *</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="block w-full px-3.5 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 text-[#3D271B] font-semibold"
          >
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block">Unit Type *</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="block w-full px-3.5 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 text-[#3D271B] font-semibold"
          >
            <option value="Kg">Kg</option>
            <option value="Piece">Piece</option>
            <option value="Box">Box</option>
            <option value="Pack">Pack</option>
            <option value="Gram">Gram</option>
          </select>
        </div>
      </div>

      {/* MRP & Sell Price & Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block">MRP Price (₹) *</label>
          <input
            type="number"
            value={mrp}
            onChange={(e) => setMrp(e.target.value)}
            min="0"
            className="block w-full px-3.5 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl font-mono text-xs text-[#3D271B] font-bold"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block">Selling Price (₹) *</label>
          <input
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            min="0"
            className="block w-full px-3.5 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl font-mono text-xs text-[#3D271B] font-bold"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block">Stock Quantity *</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            className="block w-full px-3.5 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl font-mono text-xs text-[#3D271B] font-bold"
            required
          />
        </div>
      </div>

      {/* Short Description */}
      <div className="space-y-1">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block">Short Description</label>
        <textarea
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="Brief details about sweet origin, rich taste or key ingredients (max 300 characters)..."
          maxLength={300}
          className="block w-full px-4 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl h-16 resize-none focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 text-xs text-[#3D271B]"
        />
      </div>

      {/* Full Description */}
      <div className="space-y-1">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block">Full Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed product story, texture specifications, shelf life info, and allergy warnings..."
          className="block w-full px-4 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl h-28 resize-none focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 text-xs text-[#3D271B]"
        />
      </div>

      {/* Promotions */}
      <div className="bg-[#FAF6F0]/30 p-5 rounded-2xl border border-[#E6CCB2]/20 space-y-3">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block">Promotion Badges</label>
        
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded text-[#a65827] focus:ring-[#a65827] h-4 w-4" />
            <span>Featured Sweet</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
            <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} className="rounded text-[#a65827] focus:ring-[#a65827] h-4 w-4" />
            <span>Best Seller</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
            <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="rounded text-[#a65827] focus:ring-[#a65827] h-4 w-4" />
            <span>Trending Now</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
            <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="rounded text-[#a65827] focus:ring-[#a65827] h-4 w-4" />
            <span>New Arrival</span>
          </label>
        </div>
      </div>

      {/* Menu Status & Home Delivery */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 py-1">
        <button type="button" onClick={() => setStatus(!status)} className="flex items-center gap-2 focus:outline-none cursor-pointer">
          {status ? <ToggleRight size={28} className="text-[#a65827]" /> : <ToggleLeft size={28} className="text-slate-400" />}
          <span className="font-extrabold text-[#3D271B]">Menu Active (Show to customers)</span>
        </button>

        <button type="button" onClick={() => setHomeDelivery(!homeDelivery)} className="flex items-center gap-2 focus:outline-none cursor-pointer">
          {homeDelivery ? <ToggleRight size={28} className="text-[#a65827]" /> : <ToggleLeft size={28} className="text-slate-400" />}
          <span className="font-extrabold text-[#3D271B]">Home Delivery Available</span>
        </button>
      </div>

      {/* Form Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#FAF6F0] justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border border-slate-200 text-slate-500 hover:bg-[#FAF6F0] rounded-xl font-bold transition cursor-pointer"
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
              <Loader2 size={13} className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={13} /> {isEdit ? "Save Changes" : "Create Product"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductFormInputs;
