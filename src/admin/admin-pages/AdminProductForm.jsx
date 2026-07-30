import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Upload, Layers, ToggleRight, ToggleLeft, Loader2, Save } from "lucide-react";
import { getAdminProductById, createProduct, updateProduct, deleteProductImage, addProductImage } from "../../redux/features/product/productThunk";
import { getCategories } from "../../redux/features/category/categoryThunk";
import { useToast } from "../../context/ToastContext";

const AdminProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const isEdit = !!productId;

  // Redux state
  const { categories = [] } = useSelector((state) => state.category);
  const { currentProduct, isLoading: productLoading } = useSelector((state) => state.product);

  // Local Form state
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

  const [isSaving, setIsSaving] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Set default category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0]._id);
    }
  }, [categories, categoryId]);

  // Fetch product detail if edit mode
  useEffect(() => {
    if (isEdit) {
      dispatch(getAdminProductById(productId));
    }
  }, [dispatch, productId, isEdit]);

  // Sync state with fetched product details
  useEffect(() => {
    if (isEdit && currentProduct && currentProduct._id === productId) {
      setName(currentProduct.name || "");
      setCategoryId(currentProduct.category?._id || currentProduct.category || "");
      setMrp(currentProduct.mrp || 0);
      setSellingPrice(currentProduct.sellingPrice || 0);
      setStock(currentProduct.stock || 0);
      setUnit(currentProduct.unit || "Kg");
      setStatus(currentProduct.status ?? true);
      setImageFile(null);
      setImagePreview(currentProduct.images?.[0]?.url || "");
      setDescription(currentProduct.description || currentProduct.shortDescription || "");
      setIsFeatured(currentProduct.isFeatured || false);
      setIsBestSeller(currentProduct.isBestSeller || false);
      setIsTrending(currentProduct.isTrending || false);
      setIsNewArrival(currentProduct.isNewArrival || false);
    }
  }, [currentProduct, isEdit, productId]);

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
      showToast("Product name is required", "error");
      return;
    }
    if (!categoryId) {
      showToast("Product category is required", "error");
      return;
    }
    if (Number(sellingPrice) > Number(mrp)) {
      showToast("Selling price cannot be greater than MRP.", "error");
      return;
    }

    setIsSaving(true);
    try {
      if (!isEdit) {
        // Create Mode
        if (!imageFile) {
          showToast("Product image file is required.", "error");
          setIsSaving(false);
          return;
        }

        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("category", categoryId);
        formData.append("mrp", mrp);
        formData.append("sellingPrice", sellingPrice);
        formData.append("stock", stock);
        formData.append("unit", unit);
        formData.append("shortDescription", description.trim());
        formData.append("description", description.trim());
        formData.append("status", status);
        formData.append("isFeatured", isFeatured);
        formData.append("isBestSeller", isBestSeller);
        formData.append("isTrending", isTrending);
        formData.append("isNewArrival", isNewArrival);
        
        formData.append("images", imageFile);

        await dispatch(createProduct(formData)).unwrap();
        showToast("Product created successfully!", "success");
      } else {
        // Edit Mode
        const body = {
          name: name.trim(),
          category: categoryId,
          mrp: Number(mrp),
          sellingPrice: Number(sellingPrice),
          stock: Number(stock),
          unit,
          status,
          shortDescription: description.trim(),
          description: description.trim(),
          isFeatured,
          isBestSeller,
          isTrending,
          isNewArrival,
        };

        await dispatch(updateProduct({ productId, body })).unwrap();

        if (imageFile) {
          // Replaces image by deleting existing ones and uploading new one
          if (currentProduct.images && currentProduct.images.length > 0) {
            for (const img of currentProduct.images) {
              try {
                await dispatch(deleteProductImage({ productId, publicId: img.publicId })).unwrap();
              } catch (e) {
                console.error("Failed to delete image: ", img.publicId, e);
              }
            }
          }

          const imgFormData = new FormData();
          imgFormData.append("images", imageFile);
          await dispatch(addProductImage({ productId, formData: imgFormData })).unwrap();
        }

        showToast("Product updated successfully!", "success");
      }
      
      // Redirect back to products listing
      navigate("/admin/products");
    } catch (err) {
      console.error("Save product error details:", err);
      showToast(err?.message || err?.data?.message || "Failed to save product.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isEdit && productLoading && !name) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="h-10 w-10 text-[#DFA250] animate-spin" />
        <span className="text-xs text-[#6E5A4F] font-semibold">Loading Sweet Product Details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header & Back Action */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/products")}
          className="p-2 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-xl border border-[#E6CCB2]/20 transition shadow-xs"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-black text-[#3D271B]">
            {isEdit ? "Edit Sweet Product" : "Add Sweet Product"}
          </h1>
          <p className="text-[10px] sm:text-xs text-[#6E5A4F] font-sans">
            {isEdit ? "Update pricing, description, stock and settings." : "Create a new catalog item for Ganguram menu."}
          </p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6CCB2]/30 shadow-xl space-y-6 text-xs text-slate-800 font-sans">
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief details about sweet origin, rich taste or key ingredients..."
            className="block w-full px-4 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl h-20 resize-none focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 text-xs text-[#3D271B]"
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

        {/* Menu Status */}
        <div className="flex items-center gap-2 py-1">
          <button type="button" onClick={() => setStatus(!status)} className="flex items-center gap-2 focus:outline-none cursor-pointer">
            {status ? <ToggleRight size={28} className="text-[#a65827]" /> : <ToggleLeft size={28} className="text-slate-400" />}
            <span className="font-extrabold text-[#3D271B]">Menu Active (Show to customers)</span>
          </button>
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-[#FAF6F0] justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
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
                <Save size={13} /> {isEdit ? "Save Changes" : "Create Product"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
