import { ReceiptText, Plus } from "lucide-react";

const BillingHeader = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#3D271B] flex items-center gap-3">
          <ReceiptText className="text-[#a65827] h-8 w-8 sm:h-9 sm:w-9" />
          Billing & Invoices
        </h1>
        <p className="text-sm sm:text-base text-[#6E5A4F] mt-1.5 font-medium">
          Generate walk-in receipts, audit transactional invoices, and view order receipts.
        </p>
      </div>

      <button
        onClick={onCreateClick}
        className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#3D271B] via-[#a65827] to-[#DFA250] hover:opacity-95 text-[#FAF6F0] text-sm sm:text-base font-bold rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
      >
        <Plus size={18} /> New Walk-in Bill
      </button>
    </div>
  );
};

export default BillingHeader;
