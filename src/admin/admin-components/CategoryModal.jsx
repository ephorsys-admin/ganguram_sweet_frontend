import { useState, useEffect } from "react";
import { X, Upload, Layers, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CategoryModal = ({ isOpen, type, category, onClose, onSubmit, isLoading }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && category) {
        setName(category.name || "");
        setDescription(category.description || "");
        setSortOrder(category.sortOrder || 0);
        setStatus(category.status ?? true);
        setImageFile(null);
        setImagePreview(category.image?.url || "");
      } else {
        setName("");
        setDescription("");
        setSortOrder(0);
        setStatus(true);
        setImageFile(null);
        setImagePreview("");
      }
    }
  }, [isOpen, type, category]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, sortOrder, status, imageFile });
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
            className="relative bg-white w-full max-w-md rounded-3xl border border-[#E6CCB2]/40 shadow-2xl p-6 md:p-8 z-10 space-y-6 text-xs font-sans"
          >
            <div className="flex justify-between items-center border-b border-[#FAF6F0] pb-4">
              <h3 className="font-serif font-black text-lg text-[#3D271B]">
                {type === "add" ? "Create Category" : "Edit Category"}
              </h3>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-1 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-lg transition disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Image Upload Box */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#6E5A4F]">Category Banner Image</label>
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
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#6E5A4F]" htmlFor="catName">Category Name</label>
                <input
                  type="text"
                  id="catName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Traditional Odia Sweets"
                  className="block w-full px-4 py-2.5 bg-[#FAF6F0]/50 border border-[#E6CCB2]/40 rounded-xl text-xs text-[#3D271B] placeholder-[#6E5A4F]/40 focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 focus:border-[#a65827] transition"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#6E5A4F]" htmlFor="catDesc">Description</label>
                <textarea
                  id="catDesc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the sweet category..."
                  className="block w-full px-4 py-2.5 bg-[#FAF6F0]/50 border border-[#E6CCB2]/40 rounded-xl text-xs text-[#3D271B] placeholder-[#6E5A4F]/40 focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 focus:border-[#a65827] transition h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Sort Order */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6E5A4F]" htmlFor="catOrder">Sort Order</label>
                  <input
                    type="number"
                    id="catOrder"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                    min="0"
                    className="block w-full px-4 py-2.5 bg-[#FAF6F0]/50 border border-[#E6CCB2]/40 rounded-xl text-xs text-[#3D271B] focus:outline-none"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#6E5A4F]">Status</label>
                  <div className="flex items-center h-10">
                    <button
                      type="button"
                      onClick={() => setStatus(!status)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#3D271B] focus:outline-none cursor-pointer"
                    >
                      {status ? (
                        <>
                          <ToggleRight size={28} className="text-[#a65827]" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={28} className="text-[#6E5A4F]/50" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#FAF6F0] justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-[#FAF6F0] rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 bg-[#3D271B] hover:bg-[#a65827] text-white rounded-xl text-xs font-semibold shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  {isLoading && <Loader2 size={12} className="animate-spin" />}
                  <span>{type === "add" ? "Create Category" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CategoryModal;
