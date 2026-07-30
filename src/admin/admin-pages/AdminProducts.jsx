import { useState, useEffect } from "react";
import { 
  Plus, 
  ChefHat, 
  Search, 
  Filter,
  Loader2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../redux/features/category/categoryThunk";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImage,
  deleteProductImage
} from "../../redux/features/product/productThunk";
import { useNavigate } from "react-router-dom";
import ProductTable from "../admin-components/ProductTable";
import DeleteConfirmationModal from "../admin-components/modals/DeleteConfirmationModal";
import { useToast } from "../../context/ToastContext";

const AdminProducts = () => {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories = [] } = useSelector((state) => state.category);
  const { products = [], isLoading, error } = useSelector((state) => state.product);
  const isError = !!error;

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getProducts());
  }, [dispatch]);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");



  // Delete Confirmation State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  // Feedback Messages
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    showToast(message, type);
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
  };

  const handleOpenAddModal = () => {
    navigate("/admin/products/create");
  };

  const handleOpenEditModal = (prod) => {
    navigate(`/admin/products/edit/${prod._id}`);
  };

  const handleToggleStatus = async (prod) => {
    setIsSaving(true);
    try {
      await dispatch(updateProduct({ 
        productId: prod._id, 
        body: { status: !prod.status } 
      })).unwrap();
      showAlert(`Product marked as ${!prod.status ? 'Active' : 'Inactive'}`);
      dispatch(getProducts());
    } catch (err) {
      showAlert(err?.message || err?.data?.message || "Failed to update status", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDeleteModal = (productId) => {
    setProductIdToDelete(productId);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productIdToDelete) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteProduct(productIdToDelete)).unwrap();
      showAlert("Product deleted successfully!");
      setDeleteOpen(false);
      setProductIdToDelete(null);
      dispatch(getProducts());
    } catch (err) {
      showAlert(err?.message || err?.data?.message || "Failed to delete product.", "error");
    } finally {
      setIsDeleting(false);
    }
  };



  // Filtered lists
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category?.name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3D271B] flex items-center gap-2">
            <ChefHat className="text-[#a65827] h-8 w-8" />
            Manage Products
          </h1>
          <p className="text-xs text-[#6E5A4F] mt-1 font-sans">Regulate menu pricing, sweet inventory, and catalog status.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-[#3D271B] to-[#a65827] hover:from-[#a65827] hover:to-[#DFA250] text-[#FAF6F0] text-xs font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={16} /> Add Sweet Product
        </button>
      </div>

      {/* Alert System */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 border shadow-md
              ${alert.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : "bg-red-50 text-red-800 border-red-200"}`}
          >
            {alert.type === "success" ? <CheckCircle size={16} className="text-emerald-600" /> : <AlertTriangle size={16} className="text-red-600" />}
            {alert.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6CCB2]/30 shadow-xs flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full lg:flex-1">
          <Search className="absolute inset-y-0 left-3.5 my-auto text-[#6E5A4F]/50 h-4 w-4" />
          <input
            type="text"
            placeholder="Search sweets by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] placeholder-[#6E5A4F]/40 focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 focus:border-[#a65827] transition"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
          <Filter size={15} className="text-[#a65827]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full lg:w-48 px-3 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 focus:border-[#a65827] transition"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content View */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-10 w-10 text-[#DFA250] animate-spin" />
          <span className="text-xs text-[#6E5A4F] font-semibold">Loading Sweet Products...</span>
        </div>
      ) : isError ? (
        <div className="bg-red-50/50 p-8 rounded-3xl border border-red-200 flex flex-col items-center justify-center text-center space-y-2">
          <AlertTriangle className="h-10 w-10 text-red-600" />
          <span className="text-sm font-bold text-red-800">Connection Failed</span>
          <p className="text-xs text-red-600/80">Make sure your backend server is running and try again.</p>
          <button onClick={() => dispatch(getProducts())} className="mt-2 px-4 py-2 bg-red-600 text-white font-semibold text-xs rounded-lg shadow-md hover:bg-red-700 transition">
            Retry Connection
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 text-center space-y-4 shadow-xs">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#DFA250] border border-[#E6CCB2]/20">
            <ChefHat size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#3D271B]">No Sweets Found</h3>
            <p className="text-xs text-[#6E5A4F]">Try adjusting your search criteria or add a new sweet item.</p>
          </div>
        </div>
      ) : (
        <ProductTable 
          products={filteredProducts}
          onEditClick={handleOpenEditModal}
          onDeleteClick={handleOpenDeleteModal}
          onToggleStatus={handleToggleStatus}
        />
      )}



      {/* Custom delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={deleteOpen}
        isLoading={isDeleting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Sweet Product"
        message="Are you sure you want to delete this sweet product? This will remove it from the menu catalog."
      />
    </div>
  );
};

export default AdminProducts;
