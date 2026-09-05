import { useState, useEffect } from "react";
import { Loader2, AlertTriangle, CheckCircle, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../redux/features/category/categoryThunk";
import { getProducts, updateProduct, deleteProduct } from "../../redux/features/product/productThunk";
import { useNavigate } from "react-router-dom";
import ProductHeader from "../admin-components/Product/ProductHeader";
import ProductFilters from "../admin-components/Product/ProductFilters";
import ProductTable from "../admin-components/Product/ProductTable";
import DeleteConfirmationModal from "../admin-components/Product/DeleteConfirmationModal";
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
      <ProductHeader onCreateClick={handleOpenAddModal} />

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
      <ProductFilters
        search={search}
        setSearch={setSearch}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
      />

      {/* Content View */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-10 w-10 text-[#DFA250] animate-spin" />
          <span className="text-xs text-[#6E5A4F] font-semibold">Loading Sweet Products...</span>
        </div>
      ) : isError ? (
        <div className="bg-red-50/50 p-8 rounded-3xl border border-red-200 flex flex-col items-center justify-center text-center space-y-2">
          <AlertTriangle className="h-10 w-10 text-red-655" />
          <span className="text-sm font-bold text-red-800">Connection Failed</span>
          <p className="text-xs text-red-600/80">Make sure your backend server is running and try again.</p>
          <button onClick={() => dispatch(getProducts())} className="mt-2 px-4 py-2 bg-red-650 text-white font-semibold text-xs rounded-lg shadow-md hover:bg-red-700 transition">
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
