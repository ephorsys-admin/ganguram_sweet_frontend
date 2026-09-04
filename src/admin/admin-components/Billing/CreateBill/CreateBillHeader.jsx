import { ArrowLeft, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateBillHeader = ({ orderId }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3.5 sm:gap-4 pb-3 border-b border-[#E6CCB2]/30">
      <button
        type="button"
        onClick={() =>
          navigate(orderId ? "/admin/orders" : "/admin/billing")
        }
        className="p-3 hover:bg-white text-[#6E5A4F] hover:text-[#3D271B] border border-[#E6CCB2]/40 rounded-2xl transition shadow-xs cursor-pointer active:scale-95 shrink-0"
        title={orderId ? "Back to Orders" : "Back to Bills"}
      >
        <ArrowLeft size={20} />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#3D271B] flex items-center gap-2.5 sm:gap-3 leading-tight">
          <ClipboardList className="text-[#a65827] h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 shrink-0" />
          <span>{orderId ? "Generate Order Bill" : "New Walk-in Bill"}</span>
        </h1>

        <p className="text-sm sm:text-base text-[#6E5A4F] mt-1 font-medium">
          {orderId
            ? "Configure and generate receipt for existing customer order."
            : "Generate POS invoices, register customer details, and calculate discounts."}
        </p>
      </div>
    </div>
  );
};

export default CreateBillHeader;
