import { ArrowLeft, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateBillHeader = ({ orderId }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 sm:gap-4 pb-3 border-b border-[#E6CCB2]/30">
      <button
        type="button"
        onClick={() =>
          navigate(orderId ? "/admin/orders" : "/admin/billing")
        }
        className="p-2.5 sm:p-3 hover:bg-white text-[#6E5A4F] hover:text-[#3D271B] border border-[#E6CCB2]/40 rounded-xl sm:rounded-2xl transition shadow-xs cursor-pointer active:scale-95 shrink-0"
        title={orderId ? "Back to Orders" : "Back to Bills"}
      >
        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="text-lg sm:text-2xl md:text-3xl font-serif font-black text-[#3D271B] flex items-center gap-2 sm:gap-2.5 leading-tight">
          <ClipboardList className="text-[#a65827] h-5 w-5 sm:h-7 sm:w-7 md:h-8 md:w-8 shrink-0" />
          <span className="truncate">{orderId ? "Generate Order Bill" : "New Walk-in Bill"}</span>
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-[#6E5A4F] mt-0.5 sm:mt-1 font-medium line-clamp-2 sm:line-clamp-none">
          {orderId
            ? "Configure and generate receipt for existing customer order."
            : "Generate POS invoices, register customer details, and calculate discounts."}
        </p>
      </div>
    </div>
  );
};

export default CreateBillHeader;
