import { ChefHat, Plus } from "lucide-react";

const ProductHeader = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3D271B] flex items-center gap-2">
          <ChefHat className="text-[#a65827] h-8 w-8" />
          Manage Products
        </h1>
        <p className="text-xs text-[#6E5A4F] mt-1 font-sans">
          Regulate menu pricing, sweet inventory, and catalog status.
        </p>
      </div>
      <button
        onClick={onCreateClick}
        className="px-4 py-2.5 bg-gradient-to-r from-[#3D271B] to-[#a65827] hover:from-[#a65827] hover:to-[#DFA250] text-[#FAF6F0] text-xs font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
      >
        <Plus size={16} /> Add Sweet Product
      </button>
    </div>
  );
};

export default ProductHeader;
