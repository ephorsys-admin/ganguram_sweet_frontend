import { ReceiptText, IndianRupee, Clock, AlertTriangle } from "lucide-react";

export default function BillingStats({
  bills = [],
  totalInvoicesCount,
  isSuperAdmin,
}) {
  const generatedInvoices = bills.filter((b) => b.status === "Generated");
  const cancelledInvoices = bills.filter((b) => b.status === "Cancelled");

  const totalRevenue = bills
    .filter((b) => b.status === "Paid")
    .reduce((sum, b) => sum + (b.finalAmount || 0), 0);

  const displayPrice = (val) => {
    return typeof val === "number"
      ? val.toFixed(2)
      : Number(val || 0).toFixed(2);
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${
        isSuperAdmin ? "xl:grid-cols-4" : "xl:grid-cols-3"
      } gap-4 sm:gap-5 w-full min-w-0`}
    >
      {/* Total Invoices */}
      <div className="bg-white border border-[#E6CCB2]/30 rounded-3xl p-5 sm:p-6 shadow-xs flex items-center gap-4 transition-all hover:shadow-md min-w-0">
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF6F0] flex items-center justify-center text-[#a65827] shrink-0 border border-[#E6CCB2]/20">
          <ReceiptText className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div className="min-w-0">
          <span className="text-xs sm:text-sm font-bold text-[#6E5A4F] uppercase tracking-wider block truncate">
            Total Invoices
          </span>
          <p className="text-2xl sm:text-3xl font-black text-[#3D271B] mt-0.5 truncate">
            {totalInvoicesCount || bills.length}
          </p>
        </div>
      </div>

      {/* Paid Revenue */}
      {isSuperAdmin && (
        <div className="bg-white border border-[#E6CCB2]/30 rounded-3xl p-5 sm:p-6 shadow-xs flex items-center gap-4 transition-all hover:shadow-md min-w-0">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <IndianRupee className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0">
            <span className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wider block truncate">
              Paid Revenue
            </span>
            <p className="text-2xl sm:text-3xl font-black text-[#3D271B] font-mono mt-0.5 truncate">
              ₹{displayPrice(totalRevenue)}
            </p>
          </div>
        </div>
      )}

      {/* Generated Bills */}
      <div className="bg-white border border-[#E6CCB2]/30 rounded-3xl p-5 sm:p-6 shadow-xs flex items-center gap-4 transition-all hover:shadow-md min-w-0">
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
          <Clock className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div className="min-w-0">
          <span className="text-xs sm:text-sm font-bold text-blue-800 uppercase tracking-wider block truncate">
            Generated Bills
          </span>
          <p className="text-2xl sm:text-3xl font-black text-[#3D271B] mt-0.5 truncate">
            {generatedInvoices.length}
          </p>
        </div>
      </div>

      {/* Cancelled Bills */}
      <div className="bg-white border border-[#E6CCB2]/30 rounded-3xl p-5 sm:p-6 shadow-xs flex items-center gap-4 transition-all hover:shadow-md min-w-0">
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
          <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div className="min-w-0">
          <span className="text-xs sm:text-sm font-bold text-rose-800 uppercase tracking-wider block truncate">
            Cancelled Bills
          </span>
          <p className="text-2xl sm:text-3xl font-black text-[#3D271B] mt-0.5 truncate">
            {cancelledInvoices.length}
          </p>
        </div>
      </div>
    </div>
  );
}
