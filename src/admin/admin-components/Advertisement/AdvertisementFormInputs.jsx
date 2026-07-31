import { Upload, Megaphone, Loader2, ToggleLeft, ToggleRight, Save } from "lucide-react";

const AdvertisementFormInputs = ({
  title,
  setTitle,
  isPublic,
  setIsPublic,
  imageFile,
  imagePreview,
  handleImageChange,
  isEdit,
  isSaving,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6CCB2]/30 shadow-xl space-y-6 text-xs text-slate-800 font-sans">
      {/* Banner Upload */}
      <div className="space-y-2">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block">
          Advertisement Banner Image *
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FAF6F0]/20 p-4 rounded-2xl border border-[#E6CCB2]/15">
          <div className="w-48 h-28 rounded-2xl bg-[#FAF6F0] border-2 border-dashed border-[#E6CCB2] flex items-center justify-center overflow-hidden shrink-0 shadow-xs relative">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Megaphone className="text-[#E6CCB2]/70 h-8 w-8" />
            )}
          </div>
          
          <label className="w-full sm:w-auto px-5 py-3 bg-[#FAF6F0] hover:bg-[#E6CCB2]/20 border border-[#E6CCB2]/40 rounded-xl cursor-pointer text-center text-xs text-[#6E5A4F] font-extrabold transition flex flex-col items-center justify-center gap-1">
            <Upload size={16} className="text-[#a65827]" />
            <span>{imageFile || imagePreview ? "Change Banner Image" : "Upload Banner Image"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block" htmlFor="adTitle">
          Advertisement Title *
        </label>
        <input
          type="text"
          id="adTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Diwali Sweets Special - 20% Off / Mango Festival Sweets"
          className="block w-full px-4 py-3 bg-[#FAF6F0]/20 border border-[#E6CCB2]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a65827]/10 text-xs text-[#3D271B] font-semibold"
          required
        />
      </div>

      {/* Visibility toggle */}
      <div className="space-y-1 pt-2">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E5A4F] block">
          Website Visibility
        </label>
        <div className="flex items-center h-12">
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className="flex items-center gap-2 text-xs font-bold text-[#3D271B] focus:outline-none cursor-pointer"
          >
            {isPublic ? (
              <>
                <ToggleRight size={28} className="text-[#a65827]" />
                <span className="font-extrabold text-[#3D271B]">Public (Visible on home page)</span>
              </>
            ) : (
              <>
                <ToggleLeft size={28} className="text-slate-400" />
                <span className="font-extrabold text-slate-500">Private (Hidden from home page)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#FAF6F0] justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 border border-slate-200 text-slate-500 hover:bg-[#FAF6F0] rounded-xl font-bold transition cursor-pointer"
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
              <Save size={13} /> {isEdit ? "Save Changes" : "Create Advertisement"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AdvertisementFormInputs;
