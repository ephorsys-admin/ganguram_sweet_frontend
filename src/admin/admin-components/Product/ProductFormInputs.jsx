import { Upload, Layers, ToggleRight, ToggleLeft, Loader2, Save, X, ArrowLeft, ArrowRight } from "lucide-react";

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
  imagesList = [],
  handleImageChange,
  handleRemoveImage,
  handleMoveImage,
  handleMakePrimary,
  handleDragStart,
  handleDragOver,
  handleDrop,
  categories,
  isEdit,
  isSaving,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6CCB2]/30 shadow-xl space-y-6 text-xs text-slate-800 font-sans">
      {/* Product Images (Max 5) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block">
            Product Images (Max 5) *
          </label>
          <span className="text-[10px] font-bold text-[#a65827]">
            {imagesList.length} / 5 Images
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-[#FAF6F0]/20 p-4 rounded-2xl border border-[#E6CCB2]/15">
          {imagesList.map((item, index) => (
            <div
              key={item.id}
              draggable="true"
              onDragStart={(e) => handleDragStart && handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver && handleDragOver(e)}
              onDrop={(e) => handleDrop && handleDrop(e, index)}
              className="relative aspect-square rounded-2xl bg-white border border-[#E6CCB2]/30 flex flex-col overflow-hidden group shadow-xs hover:shadow-md transition-all duration-300 cursor-grab active:cursor-grabbing"
            >
              {/* Image Preview */}
              <img
                src={item.url}
                alt={`Product preview ${index + 1}`}
                onClick={() => handleMakePrimary && handleMakePrimary(index)}
                draggable="false"
                className={`w-full h-full object-cover transition duration-300 ${index !== 0 ? "cursor-pointer hover:opacity-85" : ""}`}
                title={index !== 0 ? "Click to set as Primary (move to 1st position)" : ""}
              />

              {/* Primary Badge */}
              {index === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-emerald-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
                  Primary
                </span>
              )}

              {/* Remove X Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(item.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition cursor-pointer hover:scale-105 active:scale-95"
                title="Remove Image"
              >
                <X size={12} />
              </button>

              {/* Reordering Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#3D271B]/85 backdrop-blur-xs py-1 px-2 flex justify-between items-center opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  type="button"
                  onClick={() => handleMoveImage(index, "left")}
                  disabled={index === 0}
                  className="p-1 hover:bg-[#FAF6F0]/20 rounded text-white disabled:opacity-30 cursor-pointer flex items-center justify-center"
                  title="Move Left"
                >
                  <ArrowLeft size={12} />
                </button>
                <span className="text-[9px] font-extrabold text-white">
                  Pos {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleMoveImage(index, "right")}
                  disabled={index === imagesList.length - 1}
                  className="p-1 hover:bg-[#FAF6F0]/20 rounded text-white disabled:opacity-30 cursor-pointer flex items-center justify-center"
                  title="Move Right"
                >
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}

          {/* Add Image Upload Button */}
          {imagesList.length < 5 && (
            <label className="aspect-square bg-white border-2 border-dashed border-[#E6CCB2]/60 hover:border-[#a65827] rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition shadow-xs group">
              <Upload size={20} className="text-[#a65827]/70 group-hover:text-[#a65827] transition" />
              <span className="text-[10px] font-extrabold text-[#6E5A4F] group-hover:text-[#3D271B] transition text-center px-2">
                Upload Image
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
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
