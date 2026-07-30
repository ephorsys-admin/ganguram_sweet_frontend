import { Eye, Receipt, ChevronRight } from "lucide-react";

const BillTable = ({ bills, onViewDetails }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Generated":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Cancelled":
      default:
        return "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  return (
    <div className="w-full">
      {/* ========================================================== */}
      {/* Mobile Card Grid View (Shown below 1024px viewport)        */}
      {/* ========================================================== */}
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
              className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/20 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4"
            >
              {/* Card Header: Invoice & Type */}
              <div className="flex items-center justify-between">
                <span className="font-bold font-mono text-[#a65827] bg-[#FAF6F0] px-2.5 py-1 rounded-lg text-[10px] tracking-wider uppercase">
                  {bill.invoiceNumber || `ID: ${bill._id.substring(18)}`}
                </span>
                <span className="inline-flex px-2 py-0.5 bg-[#FAF6F0] border border-[#E6CCB2]/30 rounded-md text-[9px] text-[#6E5A4F] font-bold uppercase tracking-wide">
                  {bill.billType}
                </span>
              </div>

              {/* Main Content: Customer & Price info */}
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-sm sm:text-base text-[#3D271B] leading-tight">
                    {bill.customerName}
                  </h4>
                  <p className="text-[10px] text-[#6E5A4F]/70 font-semibold font-mono">
                    Phone: {bill.mobile}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[11px] font-semibold border-t border-[#FAF6F0] pt-2">
                  <span className="text-[#6E5A4F]">Date:</span>
                  <span className="text-[#3D271B] font-mono">{dateStr}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-semibold">
                  <span className="text-[#6E5A4F]">Final Amount:</span>
                  <span className="text-[#a65827] font-mono text-sm font-bold">₹{bill.finalAmount}</span>
                </div>
              </div>

              {/* Card Footer: Status & Action */}
              <div className="flex items-center justify-between border-t border-[#FAF6F0] pt-3">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(bill.status)}`}>
                  {bill.status}
                </span>

                <button 
                  onClick={() => onViewDetails(bill)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#3D271B] hover:bg-[#a65827] text-white rounded-xl text-[10px] font-bold shadow-xs transition cursor-pointer"
                >
                  View Details <ChevronRight size={10} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================== */}
      {/* Desktop Table View (Shown on lg viewport and above)         */}
      {/* ========================================================== */}
      <div className="bg-white rounded-3xl border border-[#E6CCB2]/30 shadow-xs overflow-hidden text-xs hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0]/50 border-b border-[#E6CCB2]/20 text-[#6E5A4F] font-semibold text-xs uppercase tracking-wider">
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
            <tbody className="divide-y divide-[#FAF6F0] text-[#3D271B]">
              {bills.map((bill) => {
                const dateStr = bill.createdAt 
                  ? new Date(bill.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })
                  : "—";

                return (
                  <tr key={bill._id} className="hover:bg-[#FAF6F0]/15 transition">
                    <td className="px-6 py-4 font-semibold font-mono text-[#a65827]">
                      {bill.invoiceNumber || bill._id.substring(18)}
                    </td>
                    <td className="px-6 py-4 text-[#6E5A4F] font-mono">{dateStr}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-0.5 bg-[#FAF6F0] border border-[#E6CCB2]/30 rounded-md text-[10px] text-[#6E5A4F] font-bold uppercase">
                        {bill.billType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">{bill.customerName}</td>
                    <td className="px-6 py-4 font-mono text-[#6E5A4F]">{bill.mobile}</td>
                    <td className="px-6 py-4 font-mono text-right">₹{bill.subTotal}</td>
                    <td className="px-6 py-4 font-mono text-right text-red-650">-₹{bill.discountAmount}</td>
                    <td className="px-6 py-4 font-bold font-mono text-right text-sm text-[#a65827]">
                      ₹{bill.finalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(bill.status)}`}>
                          {bill.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onViewDetails(bill)}
                        className="p-2 hover:bg-[#FAF6F0] text-[#a65827] hover:text-[#3D271B] rounded-xl transition cursor-pointer"
                        title="View Bill Details"
                      >
                        <Eye size={14} />
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
