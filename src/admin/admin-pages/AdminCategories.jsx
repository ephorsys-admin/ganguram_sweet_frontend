import { useState } from "react";
import { 
  Plus, 
  Layers, 
  AlertTriangle, 
  CheckCircle,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useGetCategoriesQuery, 
  useCreateCategoryMutation, 
  useUpdateCategoryMutation 
} from "../../redux/services/adminApi";
import CategoryTable from "../admin-components/CategoryTable";
import CategoryModal from "../admin-components/CategoryModal";

const AdminCategories = () => {
  const { data: response, isLoading, isError, refetch } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const categories = response?.data || [];

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" | "edit"
  const [currentCategory, setCurrentCategory] = useState(null);

  // Feedback Messages
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "success" }), 3000);
  };

  const handleOpenAddModal = () => {
    setModalType("add");
    setCurrentCategory(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setModalType("edit");
    setCurrentCategory(cat);
    setModalOpen(true);
  };

  const handleModalSubmit = async ({ name, description, sortOrder, status, imageFile }) => {
    if (!name.trim()) {
      showAlert("Category name is required", "error");
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

    try {
      if (modalType === "add") {
        await createCategory(formData).unwrap();
        showAlert("Category created successfully!");
      } else {
        await updateCategory({ categoryId: currentCategory._id, formData }).unwrap();
        showAlert("Category updated successfully!");
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      showAlert(err?.data?.message || "Failed to save category. Please try again.", "error");
    }
  };

  const handleToggleStatus = async (cat) => {
    const formData = new FormData();
    formData.append("status", !cat.status);
    try {
      await updateCategory({ categoryId: cat._id, formData }).unwrap();
      showAlert(`Category marked as ${!cat.status ? 'Active' : 'Inactive'}`);
      refetch();
    } catch (err) {
      showAlert("Failed to update status", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3D271B] flex items-center gap-2">
            <Layers className="text-[#a65827] h-8 w-8" />
            Manage Categories
          </h1>
          <p className="text-xs text-[#6E5A4F] mt-1 font-sans">Add, update, and manage categories for Ganguram sweets catalog.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-gradient-to-r from-[#3D271B] to-[#a65827] hover:from-[#a65827] hover:to-[#DFA250] text-[#FAF6F0] text-xs font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={16} /> Add Category
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

      {/* Content View */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-10 w-10 text-[#DFA250] animate-spin" />
          <span className="text-xs text-[#6E5A4F] font-semibold">Loading Sweet Categories...</span>
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
      ) : categories.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 text-center space-y-4 shadow-xs">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#DFA250] border border-[#E6CCB2]/20">
            <Layers size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#3D271B]">No Categories Created</h3>
            <p className="text-xs text-[#6E5A4F]">Get started by creating your first sweet category.</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-[#3D271B] hover:bg-[#a65827] text-white text-xs font-semibold rounded-xl shadow-md transition"
          >
            Create Category
          </button>
        </div>
      ) : (
        <CategoryTable 
          categories={categories}
          onEditClick={handleOpenEditModal}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Reusable Dialog Component */}
      <CategoryModal 
        isOpen={modalOpen}
        type={modalType}
        category={currentCategory}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
};

export default AdminCategories;
