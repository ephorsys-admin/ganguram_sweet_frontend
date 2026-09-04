import { Eye, Receipt, ChevronRight } from "lucide-react";

const BillTable = ({ bills, onViewDetails }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Generated":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Cancelled":
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="w-full">
      {/* Mobile Card Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:hidden">
        {bills.map((bill) => {
          const dateStr = bill.createdAt 
            ? new Date(bill.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              })
            : "—";

          return (
            <div 
              key={bill._id} 
              className="bg-white p-6 rounded-3xl border border-[#E6CCB2]/30 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-5"
            >
              {/* Card Header: Invoice & Type */}
              <div className="flex items-center justify-between">
                <span className="font-extrabold font-mono text-[#a65827] bg-[#FAF6F0] px-3 py-1.5 rounded-xl text-xs sm:text-sm tracking-wider uppercase border border-[#E6CCB2]/30">
                  {bill.invoiceNumber || `ID: ${bill._id.substring(18)}`}
                </span>
                <span className="inline-flex px-3 py-1 bg-[#FAF6F0] border border-[#E6CCB2]/30 rounded-xl text-xs text-[#6E5A4F] font-bold uppercase tracking-wide">
                  {bill.billType}
                </span>
              </div>

              {/* Main Content */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base sm:text-lg text-[#3D271B] leading-tight">
                    {bill.customerName}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6E5A4F] font-semibold font-mono">
                    Phone: {bill.mobile || "N/A"}
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold border-t border-[#FAF6F0] pt-2.5">
                  <span className="text-[#6E5A4F]">Date:</span>
                  <span className="text-brand-dark font-mono font-bold">{dateStr}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-[#6E5A4F]">Final Amount:</span>
                  <span className="text-brand-copper font-mono text-base sm:text-lg font-black">₹{bill.finalAmount}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between border-t border-[#FAF6F0] pt-3.5">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusStyle(bill.status)}`}>
                  {bill.status}
                </span>

                <button 
                  onClick={() => onViewDetails(bill)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#3D271B] hover:bg-[#a65827] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
                >
                  View Details <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="bg-white rounded-3xl border border-[#E6CCB2]/30 shadow-xs overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0]/60 border-b border-[#E6CCB2]/30 text-[#6E5A4F] font-bold text-xs sm:text-sm uppercase tracking-wider">
                <th className="px-6 py-4.5">Invoice No</th>
                <th className="px-6 py-4.5">Date</th>
                <th className="px-6 py-4.5">Bill Type</th>
                <th className="px-6 py-4.5">Customer Name</th>
                <th className="px-6 py-4.5">Mobile</th>
                <th className="px-6 py-4.5 font-mono text-right">Subtotal</th>
                <th className="px-6 py-4.5 font-mono text-right">Discount</th>
                <th className="px-6 py-4.5 font-mono text-right">Final Amount</th>
                <th className="px-6 py-4.5 text-center">Status</th>
                <th className="px-6 py-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0] text-sm sm:text-base font-medium text-[#3D271B]">
              {bills.map((bill) => {
                const dateStr = bill.createdAt 
                  ? new Date(bill.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })
                  : "—";

                return (
                  <tr key={bill._id} className="hover:bg-[#FAF6F0]/20 transition">
                    <td className="px-6 py-4.5 font-bold font-mono text-[#a65827]">
                      {bill.invoiceNumber || bill._id.substring(18)}
                    </td>
                    <td className="px-6 py-4.5 text-[#6E5A4F] font-mono text-xs">{dateStr}</td>
                    <td className="px-6 py-4.5">
                      <span className="inline-flex px-3 py-1 bg-[#FAF6F0] border border-[#E6CCB2]/30 rounded-xl text-xs text-[#6E5A4F] font-bold uppercase">
                        {bill.billType}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 font-bold">{bill.customerName}</td>
                    <td className="px-6 py-4.5 font-mono text-[#6E5A4F]">{bill.mobile}</td>
                    <td className="px-6 py-4.5 font-mono text-right font-semibold">₹{bill.subTotal}</td>
                    <td className="px-6 py-4.5 font-mono text-right text-red-600 font-semibold">-₹{bill.discountAmount}</td>
                    <td className="px-6 py-4.5 font-black font-mono text-right text-[#a65827]">
                      ₹{bill.finalAmount}
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusStyle(bill.status)}`}>
                          {bill.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <button
                        onClick={() => onViewDetails(bill)}
                        className="p-2.5 hover:bg-[#FAF6F0] text-[#a65827] hover:text-[#3D271B] rounded-xl transition cursor-pointer"
                        title="View Bill Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillTable;
