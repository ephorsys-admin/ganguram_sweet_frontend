import { useState, useEffect } from "react";
import { AlertTriangle, Loader2, Megaphone, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAdvertisements, updateAdvertisement, deleteAdvertisement } from "../../redux/features/advertisement/advertisementThunk";
import AdvertisementTable from "../admin-components/Advertisement/AdvertisementTable";
import DeleteConfirmationModal from "../admin-components/modals/DeleteConfirmationModal";
import { useToast } from "../../context/ToastContext";

const AdminAdvertisements = () => {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { advertisements = [], isLoading, error } = useSelector((state) => state.advertisement);
  const isError = !!error;

  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedAdForDelete, setSelectedAdForDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAdvertisements());
  }, [dispatch]);

  const handleOpenAdd = () => {
    navigate("/admin/advertisements/create");
  };

  const handleOpenEdit = (ad) => {
    navigate(`/admin/advertisements/edit/${ad._id}`);
  };

  const handleOpenDelete = (ad) => {
    setSelectedAdForDelete(ad);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAdForDelete) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteAdvertisement(selectedAdForDelete._id)).unwrap();
      showToast("Advertisement deleted successfully.", "success");
      setIsDeleteModalOpen(false);
      setSelectedAdForDelete(null);
    } catch (err) {
      showToast(err?.message || "Failed to delete advertisement.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublic = async (ad) => {
    const formData = new FormData();
    formData.append("isPublic", !ad.isPublic);

    try {
      await dispatch(updateAdvertisement({ advertisementId: ad._id, formData })).unwrap();
      showToast(`Advertisement visibility changed to ${!ad.isPublic ? "Public" : "Private"}`, "success");
    } catch (err) {
      showToast(err?.message || "Failed to update advertisement visibility.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3D271B] flex items-center gap-2">
            <Megaphone className="text-[#a65827] h-8 w-8" />
            Manage Advertisements
          </h1>
          <p className="text-xs text-[#6E5A4F] mt-1 font-sans">
            Add, update, and manage display banner advertisements for the website front page.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-[#3D271B] to-[#a65827] hover:from-[#a65827] hover:to-[#DFA250] text-[#FAF6F0] text-xs font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={16} /> Add Advertisement
        </button>
      </div>

      {/* Content View */}
      {isLoading ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center space-y-3">
          <Loader2 className="h-10 w-10 text-[#DFA250] animate-spin" />
          <span className="text-xs text-[#6E5A4F] font-semibold">Loading Advertisements...</span>
        </div>
      ) : isError ? (
        <div className="bg-red-50/50 p-8 rounded-3xl border border-red-200 flex flex-col items-center justify-center text-center space-y-2">
          <AlertTriangle className="h-10 w-10 text-red-600" />
          <span className="text-sm font-bold text-red-800">Connection Failed</span>
          <p className="text-xs text-red-600/80">Make sure your backend server is running and try again.</p>
          <button onClick={() => dispatch(getAdvertisements())} className="mt-2 px-4 py-2 bg-red-600 text-white font-semibold text-xs rounded-lg shadow-md hover:bg-red-700 transition">
            Retry Connection
          </button>
        </div>
      ) : advertisements.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 text-center space-y-4 shadow-xs">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#DFA250] border border-[#E6CCB2]/20">
            <Megaphone size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#3D271B]">No Advertisements Created</h3>
            <p className="text-xs text-[#6E5A4F]">Get started by creating your first display advertisement banner.</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#3D271B] hover:bg-[#a65827] text-white text-xs font-semibold rounded-xl shadow-md transition"
          >
            Create Advertisement
          </button>
        </div>
      ) : (
        <AdvertisementTable
          advertisements={advertisements}
          onEditClick={handleOpenEdit}
          onDeleteClick={handleOpenDelete}
          onTogglePublic={handleTogglePublic}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAdForDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Advertisement"
        message={`Are you sure you want to delete "${selectedAdForDelete?.title || "this advertisement"}"? This action will remove the banner from Cloudinary storage and the web interface permanently.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminAdvertisements;
