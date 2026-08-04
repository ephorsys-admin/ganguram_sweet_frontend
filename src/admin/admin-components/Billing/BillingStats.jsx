import { Receipt, DollarSign, Clock, AlertTriangle } from "lucide-react";

export default function BillingStats({ bills = [], totalInvoicesCount, isSuperAdmin }) {
  const generatedInvoices = bills.filter((b) => b.status === "Generated");
  const cancelledInvoices = bills.filter((b) => b.status === "Cancelled");

  const totalRevenue = bills
    .filter((b) => b.status === "Paid")
    .reduce((sum, b) => sum + (b.finalAmount || 0), 0);

  const displayPrice = (val) => {
    return typeof val === "number" ? val.toFixed(2) : Number(val || 0).toFixed(2);
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${isSuperAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4`}>
      {/* Total Invoices */}
      <div className="bg-white border border-[#E6CCB2]/30 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-all hover:scale-[1.01]">
        <div className="w-12 h-12 rounded-xl bg-[#FAF6F0] flex items-center justify-center text-[#a65827]">
          <Receipt className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#6E5A4F]/60 uppercase tracking-wider">Total Invoices</span>
          <p className="text-xl font-extrabold text-[#3D271B]">{totalInvoicesCount || bills.length}</p>
        </div>
      </div>

      {/* Paid Revenue */}
      {isSuperAdmin && (
        <div className="bg-white border border-[#E6CCB2]/30 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-all hover:scale-[1.01]">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#6E5A4F]/60 uppercase tracking-wider">Paid Revenue</span>
            <p className="text-xl font-extrabold text-[#3D271B]">₹{displayPrice(totalRevenue)}</p>
          </div>
        </div>
      )}

      {/* Generated Bills */}
      <div className="bg-white border border-[#E6CCB2]/30 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-all hover:scale-[1.01]">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#6E5A4F]/60 uppercase tracking-wider">Generated Bills</span>
          <p className="text-xl font-extrabold text-[#3D271B]">{generatedInvoices.length}</p>
        </div>
      </div>

      {/* Cancelled Bills */}
      <div className="bg-white border border-[#E6CCB2]/30 rounded-2xl p-5 shadow-xs flex items-center gap-4 transition-all hover:scale-[1.01]">
        <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#6E5A4F]/60 uppercase tracking-wider">Cancelled Bills</span>
          <p className="text-xl font-extrabold text-[#3D271B]">{cancelledInvoices.length}</p>
        </div>
      </div>
    </div>
  );
}
