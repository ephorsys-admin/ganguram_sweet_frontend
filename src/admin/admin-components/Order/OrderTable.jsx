import { Eye, CheckCircle2, Clock, XCircle, ChevronRight, Download } from "lucide-react";

const OrderTable = ({ orders, onViewDetails, onUpdateStatus, onDownloadBill }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Out For Delivery":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "Preparing":
        return "bg-orange-50 text-orange-800 border-orange-200";
      case "Confirmed":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Pending":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Cancelled":
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Mobile Card Grid View */}
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
              className="bg-white p-6 rounded-3xl border border-[#E6CCB2]/30 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-5"
            >
              {/* Card Header: Order Number & Date */}
              <div className="flex items-center justify-between">
                <span className="font-extrabold font-mono text-[#a65827] bg-[#FAF6F0] px-3 py-1.5 rounded-xl text-xs sm:text-sm tracking-wider uppercase border border-[#E6CCB2]/30">
                  {order.orderNumber || `ID: ${order._id.substring(18)}`}
                </span>
                <span className="text-xs text-[#6E5A4F] font-mono font-medium">
                  {dateStr}
                </span>
              </div>

              {/* Main Content Area */}
              <div className="space-y-3">
                {/* Customer Details */}
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base sm:text-lg text-[#3D271B] leading-tight">
                    {order.customerName}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6E5A4F] font-semibold font-mono">
                    Phone: {order.customerMobile || "N/A"}
                  </p>
                </div>

                {/* Items snapshot */}
                <div className="bg-[#FAF6F0]/50 p-4 rounded-2xl border border-[#E6CCB2]/30 text-xs sm:text-sm text-[#3D271B] font-semibold space-y-2">
                  <div className="flex justify-between items-center text-[#6E5A4F] text-xs uppercase tracking-wider border-b border-[#E6CCB2]/20 pb-1.5 font-bold">
                    <span>Sweet Product</span>
                    <span>Quantity</span>
                  </div>
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="truncate max-w-[180px] font-bold text-sm">{order.productName}</span>
                    <span className="font-mono text-[#6E5A4F] font-bold">×{order.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 font-bold border-t border-[#E6CCB2]/20">
                    <span className="text-[#6E5A4F]">Grand Total</span>
                    <span className="font-mono text-base font-black text-[#a65827]">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Status Update & Details link */}
              <div className="flex items-center justify-between border-t border-[#FAF6F0] pt-4 gap-2">
                {/* Status selector */}
                <select
                  value={order.orderStatus}
                  onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                  className="px-3 py-2 bg-[#FAF6F0]/60 border border-[#E6CCB2]/40 rounded-xl text-xs sm:text-sm font-bold text-[#3D271B] focus:outline-none cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out For Delivery">Out For Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <div className="flex items-center gap-2">
                  {order.billGenerated && (
                    <button
                      onClick={() => onDownloadBill(order)}
                      className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition cursor-pointer"
                      title="Download Invoice"
                    >
                      <Download size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => onViewDetails(order)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#3D271B] hover:bg-[#a65827] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition cursor-pointer"
                  >
                    <span>Details</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
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
            <tbody className="divide-y divide-[#FAF6F0] text-sm sm:text-base font-semibold text-[#3D271B]">
              {orders.map((order) => {
                const dateStr = order.createdAt 
                  ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })
                  : "—";

                return (
                  <tr key={order._id} className="hover:bg-[#FAF6F0]/20 transition">
                    <td className="px-6 py-4.5 font-bold font-mono text-[#a65827]">
                      {order.orderNumber || order._id.substring(18)}
                    </td>
                    <td className="px-6 py-4.5 text-[#6E5A4F] font-mono text-xs sm:text-sm">{dateStr}</td>
                    <td className="px-6 py-4.5">
                      <span className="font-bold text-base block">{order.customerName}</span>
                      <span className="text-xs text-[#6E5A4F] font-mono mt-0.5 block">{order.customerMobile}</span>
                    </td>
                    <td className="px-6 py-4.5 font-bold">{order.productName}</td>
                    <td className="px-6 py-4.5 text-center font-bold font-mono">{order.quantity}</td>
                    <td className="px-6 py-4.5 font-black font-mono text-base text-[#a65827]">₹{order.totalAmount}</td>
                    <td className="px-6 py-4.5">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider
                          ${getStatusStyle(order.orderStatus)}
                        `}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.billGenerated && (
                          <button
                            onClick={() => onDownloadBill(order)}
                            className="p-2.5 hover:bg-emerald-50 text-emerald-700 rounded-xl transition cursor-pointer"
                            title="Download Invoice"
                          >
                            <Download size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => onViewDetails(order)}
                          className="p-2.5 hover:bg-[#FAF6F0] text-[#a65827] hover:text-[#3D271B] rounded-xl transition cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye size={18} />
                        </button>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                          className="px-3 py-2 bg-white border border-[#E6CCB2]/40 rounded-xl text-xs sm:text-sm font-bold text-[#3D271B] cursor-pointer"
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
