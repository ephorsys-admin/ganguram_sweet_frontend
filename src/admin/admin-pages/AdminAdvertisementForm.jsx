import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { getAdvertisements, createAdvertisement, updateAdvertisement } from "../../redux/features/advertisement/advertisementThunk";
import { useToast } from "../../context/ToastContext";
import AdvertisementFormInputs from "../admin-components/Advertisement/AdvertisementFormInputs";

const AdminAdvertisementForm = () => {
  const { advertisementId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const isEdit = !!advertisementId;

  // Redux state
  const { advertisements = [] } = useSelector((state) => state.advertisement);

  // Local Form state
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // Fetch advertisements on mount if not loaded
  useEffect(() => {
    if (advertisements.length === 0) {
      dispatch(getAdvertisements());
    }
  }, [dispatch, advertisements.length]);

  // Sync state with current advertisement details if edit mode
  useEffect(() => {
    if (isEdit && advertisements.length > 0) {
      const ad = advertisements.find((a) => a._id === advertisementId);
      if (ad) {
        setTitle(ad.title || "");
        setIsPublic(ad.isPublic ?? true);
        setImageFile(null);
        setImagePreview(ad.image || "");
      }
    }
  }, [advertisements, isEdit, advertisementId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast("Advertisement title is required", "error");
      return;
    }

    if (!isEdit && !imageFile) {
      showToast("Advertisement image is required", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("isPublic", isPublic);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    setIsSaving(true);
    try {
      if (!isEdit) {
        await dispatch(createAdvertisement(formData)).unwrap();
        showToast("Advertisement created successfully!", "success");
      } else {
        await dispatch(updateAdvertisement({ advertisementId, formData })).unwrap();
        showToast("Advertisement updated successfully!", "success");
      }

      // Refresh list & redirect
      dispatch(getAdvertisements());
      navigate("/admin/advertisements");
    } catch (err) {
      showToast(err?.message || err?.data?.message || "Failed to save advertisement.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header & Back Action */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/advertisements")}
          className="p-2 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-xl border border-[#E6CCB2]/20 transition shadow-xs cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-black text-[#3D271B]">
            {isEdit ? "Edit Advertisement" : "Create Advertisement"}
          </h1>
          <p className="text-[10px] sm:text-xs text-[#6E5A4F] font-sans">
            {isEdit ? "Update advertisement banner, title and public visibility state." : "Launch a new front-page advertisement banner for Ganguram store."}
          </p>
        </div>
      </div>

      <AdvertisementFormInputs
        title={title}
        setTitle={setTitle}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
        imageFile={imageFile}
        imagePreview={imagePreview}
        handleImageChange={handleImageChange}
        isEdit={isEdit}
        isSaving={isSaving}
        onSubmit={handleFormSubmit}
        onCancel={() => navigate("/admin/advertisements")}
      />
    </div>
  );
};

export default AdminAdvertisementForm;
