import { useState } from "react";
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
import { 
  useGetCategoriesQuery, 
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddProductImageMutation,
  useDeleteProductImageMutation
} from "../../redux/services/adminApi";
import ProductTable from "../admin-components/ProductTable";
import ProductModal from "../admin-components/modals/ProductModal";
import DeleteConfirmationModal from "../admin-components/modals/DeleteConfirmationModal";
import { useToast } from "../../context/ToastContext";

const AdminProducts = () => {
  const { showToast } = useToast();
  // Fetch real categories list to bind to dropdown
  const { data: categoriesResponse } = useGetCategoriesQuery();
  const categories = categoriesResponse?.data || [];

  // Fetch real products list
  const { data: productsResponse, isLoading, isError, refetch } = useGetProductsQuery();
  const products = productsResponse?.data || [];

  // API mutations
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [addProductImage] = useAddProductImageMutation();
  const [deleteProductImage] = useDeleteProductImageMutation();

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" | "edit"
  const [currentProduct, setCurrentProduct] = useState(null);

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
    setModalType("add");
    setCurrentProduct(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setModalType("edit");
    setCurrentProduct(prod);
    setModalOpen(true);
  };

  const handleToggleStatus = async (prod) => {
    try {
      await updateProduct({ 
        productId: prod._id, 
        body: { status: !prod.status } 
      }).unwrap();
      showAlert(`Product marked as ${!prod.status ? 'Active' : 'Inactive'}`);
      refetch();
    } catch (err) {
      showAlert(err?.data?.message || "Failed to update status", "error");
    }
  };

  const handleOpenDeleteModal = (productId) => {
    setProductIdToDelete(productId);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productIdToDelete) return;
    try {
      await deleteProduct(productIdToDelete).unwrap();
      showAlert("Product deleted successfully!");
      setDeleteOpen(false);
      setProductIdToDelete(null);
      refetch();
    } catch (err) {
      showAlert(err?.data?.message || "Failed to delete product.", "error");
    }
  };

  const handleModalSubmit = async ({
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
  }) => {
    if (!name.trim()) {
      showAlert("Product name is required", "error");
      return;
    }
    if (!categoryId) {
      showAlert("Product category is required", "error");
      return;
    }
    if (Number(sellingPrice) > Number(mrp)) {
      showAlert("Selling price cannot be greater than MRP.", "error");
      return;
    }

    try {
      if (modalType === "add") {
        if (!imageFile) {
          showAlert("Product image file is required.", "error");
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
        
        formData.append("images", imageFile); // backend expects upload.array("images", 5) with 'images' key

        await createProduct(formData).unwrap();
        showAlert("Product created successfully!");
      } else {
        // Edit Mode
        const body = {
          name: name.trim(),
          category: categoryId,
          mrp,
          sellingPrice,
          stock,
          unit,
          shortDescription: description.trim(),
          description: description.trim(),
          status,
          isFeatured,
          isBestSeller,
          isTrending,
          isNewArrival
        };

        await updateProduct({ productId: currentProduct._id, body }).unwrap();

        if (imageFile) {
          // Replaces image by deleting existing ones and uploading new one
          if (currentProduct.images && currentProduct.images.length > 0) {
            for (const img of currentProduct.images) {
              try {
                await deleteProductImage({ productId: currentProduct._id, publicId: img.publicId }).unwrap();
              } catch (e) {
                console.error("Failed to delete image: ", img.publicId, e);
              }
            }
          }

          const imgFormData = new FormData();
          imgFormData.append("images", imageFile);
          await addProductImage({ productId: currentProduct._id, formData: imgFormData }).unwrap();
        }

        showAlert("Product updated successfully!");
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Save product error details:", err);
      if (err?.data?.errors) {
        console.error("Validation Errors List:", JSON.stringify(err.data.errors, null, 2));
      }
      const errMsg = err?.data?.errors?.[0]?.message || err?.data?.message || "Failed to save product. Please try again.";
      showAlert(errMsg, "error");
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
      <div className="bg-white p-4 rounded-2xl border border-[#E6CCB2]/30 shadow-xs flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
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
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <Filter size={15} className="text-[#a65827]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full md:w-48 px-3 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 focus:border-[#a65827] transition"
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
          <button onClick={refetch} className="mt-2 px-4 py-2 bg-red-600 text-white font-semibold text-xs rounded-lg shadow-md hover:bg-red-700 transition">
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

      {/* Add / Edit modal component */}
      <ProductModal 
        isOpen={modalOpen}
        type={modalType}
        product={currentProduct}
        categories={categories}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

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
