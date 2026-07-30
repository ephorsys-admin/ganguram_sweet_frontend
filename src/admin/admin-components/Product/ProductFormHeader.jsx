import { ArrowLeft } from "lucide-react";

const ProductFormHeader = ({ isEdit, onBackClick }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onBackClick}
        className="p-2 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-xl border border-[#E6CCB2]/20 transition shadow-xs cursor-pointer"
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
  );
};

export default ProductFormHeader;
