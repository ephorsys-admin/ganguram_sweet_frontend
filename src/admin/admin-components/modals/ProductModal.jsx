import { useState, useEffect } from "react";
import { X, Upload, Layers, ToggleRight, ToggleLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductModal = ({ isOpen, type, product, categories, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [mrp, setMrp] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [unit, setUnit] = useState("Kg");
  const [status, setStatus] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [description, setDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && product) {
        setName(product.name || "");
        setCategoryId(product.category?._id || product.category || "");
        setMrp(product.mrp || 0);
        setSellingPrice(product.sellingPrice || 0);
        setStock(product.stock || 0);
        setUnit(product.unit || "Kg");
        setStatus(product.status ?? true);
        setImageFile(null);
        setImagePreview(product.images?.[0]?.url || "");
        setDescription(product.description || product.shortDescription || "");
        setIsFeatured(product.isFeatured || false);
        setIsBestSeller(product.isBestSeller || false);
        setIsTrending(product.isTrending || false);
        setIsNewArrival(product.isNewArrival || false);
      } else {
        setName("");
        setCategoryId(categories[0]?._id || "");
        setMrp(0);
        setSellingPrice(0);
        setStock(0);
        setUnit("Kg");
        setStatus(true);
        setImageFile(null);
        setImagePreview("");
        setDescription("");
        setIsFeatured(false);
        setIsBestSeller(false);
        setIsTrending(false);
        setIsNewArrival(false);
      }
    }
  }, [isOpen, type, product, categories]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      categoryId,
      mrp,
      sellingPrice,
      stock,
      unit,
      status,
      imageFile,
      description,
      isFeatured,
      isBestSeller,
      isTrending,
      isNewArrival
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
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white w-full max-w-lg rounded-3xl border border-[#E6CCB2]/40 shadow-2xl p-6 md:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-6 text-xs font-sans text-slate-800"
          >
            <div className="flex justify-between items-center border-b border-[#FAF6F0] pb-4">
              <h3 className="font-serif font-black text-lg text-[#3D271B]">
                {type === "add" ? "Add Sweet Product" : "Edit Sweet Product"}
              </h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Image Upload Box */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5A4F]">Product Banner Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-[#FAF6F0] border-2 border-dashed border-[#E6CCB2] flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Layers className="text-[#E6CCB2]/70 h-6 w-6" />
                    )}
                  </div>
                  
                  <label className="flex-1 flex flex-col items-center justify-center px-4 py-3 bg-[#FAF6F0]/80 hover:bg-[#FAF6F0] border border-[#E6CCB2]/30 rounded-xl cursor-pointer text-center text-xs text-[#6E5A4F] font-semibold transition">
                    <Upload size={16} className="text-[#a65827] mb-1" />
                    <span>{imageFile ? "Change Image" : "Upload Image"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5A4F]">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Delicious Chhena Poda"
                  className="block w-full px-4 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#a65827]"
                  required
                />
              </div>

              {/* Category & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5A4F]">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-xl focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5A4F]">Unit Type</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-xl focus:outline-none"
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
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5A4F]">MRP (₹)</label>
                  <input
                    type="number"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    min="0"
                    className="block w-full px-3 py-2 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-xl font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5A4F]">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    min="0"
                    className="block w-full px-3 py-2 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-xl font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5A4F]">Stock Quantity</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    min="0"
                    className="block w-full px-3 py-2 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5A4F]">Short Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief details about origin or recipe..."
                  className="block w-full px-4 py-2 bg-[#FAF6F0]/40 border border-[#E6CCB2]/40 rounded-xl h-14 resize-none focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="bg-[#FAF6F0]/50 p-4 rounded-2xl border border-[#E6CCB2]/20 space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5A4F] block">Homepage Promotions & Settings</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded text-[#a65827] focus:ring-[#a65827]" />
                    <span className="font-semibold text-slate-700">Featured Sweet</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} className="rounded text-[#a65827] focus:ring-[#a65827]" />
                    <span className="font-semibold text-slate-700">Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="rounded text-[#a65827] focus:ring-[#a65827]" />
                    <span className="font-semibold text-slate-700">Trending Now</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="rounded text-[#a65827] focus:ring-[#a65827]" />
                    <span className="font-semibold text-slate-700">New Arrival</span>
                  </label>
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center gap-2 pt-2">
                <button type="button" onClick={() => setStatus(!status)} className="flex items-center gap-1.5 focus:outline-none cursor-pointer">
                  {status ? <ToggleRight size={26} className="text-[#a65827]" /> : <ToggleLeft size={26} className="text-slate-400" />}
                  <span className="font-bold text-[#3D271B]">Menu Active (Show to customers)</span>
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#FAF6F0] justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-[#FAF6F0] rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3D271B] hover:bg-[#a65827] text-white rounded-xl font-semibold shadow-md transition cursor-pointer"
                >
                  {type === "add" ? "Create Product" : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
