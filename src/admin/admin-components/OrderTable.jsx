import { Eye, CheckCircle2, Clock, XCircle, ChevronRight, Download } from "lucide-react";

const OrderTable = ({ orders, onViewDetails, onUpdateStatus, onDownloadBill }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-750 border-emerald-100";
      case "Out For Delivery":
        return "bg-purple-50 text-purple-750 border-purple-100";
      case "Preparing":
        return "bg-orange-50 text-orange-750 border-orange-100";
      case "Confirmed":
        return "bg-blue-50 text-blue-750 border-blue-100";
      case "Pending":
        return "bg-amber-50 text-amber-755 border-amber-100";
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
        {orders.map((order) => {
          const dateStr = order.createdAt 
            ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              })
            : "—";

          return (
            <div 
              key={order._id} 
              className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/20 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4"
            >
              {/* Card Header: Order Number & Date */}
              <div className="flex items-center justify-between">
                <span className="font-bold font-mono text-[#a65827] bg-[#FAF6F0] px-2.5 py-1 rounded-lg text-[10px] tracking-wider uppercase">
                  {order.orderNumber || `ID: ${order._id.substring(18)}`}
                </span>
                <span className="text-[10px] text-[#6E5A4F]/60 font-mono font-medium">
                  {dateStr}
                </span>
              </div>

              {/* Main Content Area */}
              <div className="space-y-3">
                {/* Customer Details */}
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-sm sm:text-base text-[#3D271B] leading-tight">
                    {order.customerName}
                  </h4>
                  <p className="text-[10px] text-[#6E5A4F]/70 font-semibold font-mono">
                    Phone: {order.customerMobile}
                  </p>
                </div>

                {/* Items snapshot */}
                <div className="bg-[#FAF6F0]/40 p-3 rounded-2xl border border-[#E6CCB2]/20 text-[11px] text-[#3D271B] font-semibold space-y-1">
                  <div className="flex justify-between items-center text-[#6E5A4F] text-[9px] uppercase tracking-wider border-b border-[#E6CCB2]/20 pb-1">
                    <span>Sweet Product</span>
                    <span>Total</span>
                  </div>
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="truncate max-w-[150px] font-bold">{order.productName}</span>
                    <span className="font-mono text-[#6E5A4F]">x{order.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center pt-0.5 font-bold border-t border-[#E6CCB2]/10 mt-1">
                    <span className="text-[#6E5A4F]">Grand Total</span>
                    <span className="font-mono text-sm text-[#a65827]">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Status Update & Details link */}
              <div className="flex items-center justify-between border-t border-[#FAF6F0] pt-3.5 gap-2">
                {/* Status selector */}
                <select
                  value={order.orderStatus}
                  onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                  className="px-2 py-1.5 bg-[#FAF6F0]/45 border border-[#E6CCB2]/30 rounded-xl text-[10px] font-bold text-[#3D271B] focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out For Delivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <div className="flex items-center gap-1.5">
                  {order.billGenerated && (
                    <button
                      onClick={() => onDownloadBill(order)}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition cursor-pointer"
                      title="Download Invoice"
                    >
                      <Download size={12} />
                    </button>
                  )}
                  <button 
                    onClick={() => onViewDetails(order)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#3D271B] hover:bg-[#a65827] text-white rounded-xl text-[10px] font-bold shadow-xs transition cursor-pointer"
                  >
                    Details <ChevronRight size={10} />
                  </button>
                </div>
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
          <table className="w-full min-w-[1050px] text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0]/50 border-b border-[#E6CCB2]/20 text-[#6E5A4F] font-semibold text-xs uppercase tracking-wider">
                <th className="px-6 py-4.5">Order ID</th>
                <th className="px-6 py-4.5">Date</th>
                <th className="px-6 py-4.5">Customer</th>
                <th className="px-6 py-4.5">Ordered Sweet</th>
                <th className="px-6 py-4.5 text-center">Qty</th>
                <th className="px-6 py-4.5">Amount</th>
                <th className="px-6 py-4.5 text-center">Status</th>
                <th className="px-6 py-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0] text-[#3D271B]">
              {orders.map((order) => {
                const dateStr = order.createdAt 
                  ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })
                  : "—";

                return (
                  <tr key={order._id} className="hover:bg-[#FAF6F0]/15 transition">
                    <td className="px-6 py-4 font-semibold font-mono text-[#a65827]">
                      {order.orderNumber || order._id.substring(18)}
                    </td>
                    <td className="px-6 py-4 text-[#6E5A4F] font-mono">{dateStr}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold block">{order.customerName}</span>
                      <span className="text-[10px] text-[#6E5A4F]/70 font-mono">{order.customerMobile}</span>
                    </td>
                    <td className="px-6 py-4 font-bold">{order.productName}</td>
                    <td className="px-6 py-4 text-center font-bold font-mono">{order.quantity}</td>
                    <td className="px-6 py-4 font-bold font-mono text-sm">₹{order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider
                          ${getStatusStyle(order.orderStatus)}
                        `}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.billGenerated && (
                          <button
                            onClick={() => onDownloadBill(order)}
                            className="p-2 hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 rounded-xl transition cursor-pointer"
                            title="Download Invoice"
                          >
                            <Download size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => onViewDetails(order)}
                          className="p-2 hover:bg-[#FAF6F0] text-[#a65827] hover:text-[#3D271B] rounded-xl transition cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye size={14} />
                        </button>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                          className="px-2.5 py-1.5 bg-white border border-[#E6CCB2]/30 rounded-xl text-[10px] font-bold text-[#3D271B]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out For Delivery">Out For Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
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

export default OrderTable;
