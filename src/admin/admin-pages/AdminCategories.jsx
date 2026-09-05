import { useState, useEffect } from "react";
import { AlertTriangle, Loader2, Layers } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, updateCategory } from "../../redux/features/category/categoryThunk";
import { useNavigate } from "react-router-dom";
import CategoryHeader from "../admin-components/Category/CategoryHeader";
import CategoryTable from "../admin-components/Category/CategoryTable";
import { useToast } from "../../context/ToastContext";

const AdminCategories = () => {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { categories = [], isLoading, error } = useSelector((state) => state.category);
  const isError = !!error;
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    navigate("/admin/categories/create");
  };

  const handleOpenEditModal = (cat) => {
    navigate(`/admin/categories/edit/${cat._id}`);
  };

  const handleToggleStatus = async (cat) => {
    const formData = new FormData();
    formData.append("status", !cat.status);
    setIsSaving(true);
    try {
      await dispatch(updateCategory({ categoryId: cat._id, formData })).unwrap();
      showToast(`Category marked as ${!cat.status ? 'Active' : 'Inactive'}`, "success");
      dispatch(getCategories());
    } catch (err) {
      showToast(err?.message || "Failed to update status", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <CategoryHeader onCreateClick={handleOpenAddModal} />

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
          <button onClick={() => dispatch(getCategories())} className="mt-2 px-4 py-2 bg-red-600 text-white font-semibold text-xs rounded-lg shadow-md hover:bg-red-700 transition">
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
    </div>
  );
};

export default AdminCategories;
