import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Upload, Layers, Loader2, ToggleLeft, ToggleRight, Save } from "lucide-react";
import { getCategories, createCategory, updateCategory } from "../../redux/features/category/categoryThunk";
import { useToast } from "../../context/ToastContext";

const AdminCategoryForm = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const isEdit = !!categoryId;

  // Redux state
  const { categories = [], isLoading: categoriesLoading } = useSelector((state) => state.category);

  // Local Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // Fetch categories on mount if not loaded
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    }
  }, [dispatch, categories]);

  // Sync state with current category details if edit mode
  useEffect(() => {
    if (isEdit && categories.length > 0) {
      const category = categories.find((c) => c._id === categoryId);
      if (category) {
        setName(category.name || "");
        setDescription(category.description || "");
        setSortOrder(category.sortOrder || 0);
        setStatus(category.status ?? true);
        setImageFile(null);
        setImagePreview(category.image?.url || "");
      }
    }
  }, [categories, isEdit, categoryId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Category name is required", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("sortOrder", sortOrder);
    formData.append("status", status);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    setIsSaving(true);
    try {
      if (!isEdit) {
        await dispatch(createCategory(formData)).unwrap();
        showToast("Category created successfully!", "success");
      } else {
        await dispatch(updateCategory({ categoryId, formData })).unwrap();
        showToast("Category updated successfully!", "success");
      }
      
      // Refresh list & redirect
      dispatch(getCategories());
      navigate("/admin/categories");
    } catch (err) {
      showToast(err?.message || err?.data?.message || "Failed to save category.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header & Back Action */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/categories")}
          className="p-2 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-xl border border-[#E6CCB2]/20 transition shadow-xs"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-black text-[#3D271B]">
            {isEdit ? "Edit Sweet Category" : "Create Sweet Category"}
          </h1>
          <p className="text-[10px] sm:text-xs text-[#6E5A4F] font-sans">
            {isEdit ? "Update display banner, order sequence and active state." : "Establish a new sweet collection for the Ganguram store."}
          </p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6CCB2]/30 shadow-xl space-y-6 text-xs text-slate-800 font-sans">
        {/* Category Image Upload */}
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block">Category Banner Image</label>
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
              <span>{imageFile || imagePreview ? "Change Banner Image" : "Upload Banner Image"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block" htmlFor="catName">Category Name *</label>
          <input
            type="text"
            id="catName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Traditional Odia Sweets / Special Sandesh"
            className="block w-full px-4 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 text-xs text-[#3D271B] font-semibold"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block" htmlFor="catDesc">Description</label>
          <textarea
            id="catDesc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Introduce the heritage or specialized ingredients of this catalog group..."
            className="block w-full px-4 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 text-xs text-[#3D271B]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sort Order */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block" htmlFor="catOrder">Sort Sequence Order</label>
            <input
              type="number"
              id="catOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              min="0"
              className="block w-full px-4 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-mono font-bold"
            />
          </div>

          {/* Status toggle */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block">Catalog Status</label>
            <div className="flex items-center h-12">
              <button
                type="button"
                onClick={() => setStatus(!status)}
                className="flex items-center gap-2 text-xs font-bold text-[#3D271B] focus:outline-none cursor-pointer"
              >
                {status ? (
                  <>
                    <ToggleRight size={28} className="text-[#a65827]" />
                    <span className="font-extrabold text-[#3D271B]">Active (Displaying in menu)</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft size={28} className="text-slate-400" />
                    <span className="font-extrabold text-slate-500">Inactive (Hidden)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-[#FAF6F0] justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
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
                <Loader2 size={13} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={13} /> {isEdit ? "Save Changes" : "Create Category"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCategoryForm;
