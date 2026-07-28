import { Eye, CheckCircle2, Clock, XCircle } from "lucide-react";

const OrderTable = ({ orders, onViewDetails, onUpdateStatus }) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E6CCB2]/30 shadow-xs overflow-hidden text-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF6F0]/50 border-b border-[#E6CCB2]/20 text-[#6E5A4F] font-semibold">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAF6F0] text-[#3D271B]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#FAF6F0]/15 transition">
                <td className="px-6 py-4 font-semibold font-mono">{order.id}</td>
                <td className="px-6 py-4 text-[#6E5A4F] font-mono">{order.date}</td>
                <td className="px-6 py-4">
                  <span className="font-bold block">{order.customerName}</span>
                  <span className="text-[10px] text-[#6E5A4F]/70">{order.phone}</span>
                </td>
                <td className="px-6 py-4 font-bold">₹{order.amount}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md font-semibold text-[10px]">
                    {order.paymentMethod}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold
                      ${order.status === "Completed" ? "bg-emerald-50 text-emerald-700" : ""}
                      ${order.status === "Processing" ? "bg-amber-50 text-amber-700" : ""}
                      ${order.status === "Pending" ? "bg-red-50 text-red-700" : ""}
                      ${order.status === "Cancelled" ? "bg-slate-100 text-slate-600" : ""}
                    `}>
                      {order.status === "Completed" && <CheckCircle2 size={10} />}
                      {order.status === "Processing" && <Clock size={10} />}
                      {order.status === "Pending" && <Clock size={10} />}
                      {order.status === "Cancelled" && <XCircle size={10} />}
                      {order.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onViewDetails(order)}
                      className="p-1.5 hover:bg-[#FAF6F0] text-[#a65827] hover:text-[#3D271B] rounded-lg transition cursor-pointer"
                      title="View Order Details"
                    >
                      <Eye size={15} />
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                      className="px-2 py-1 bg-white border border-[#E6CCB2]/30 rounded-md text-[10px] font-semibold text-[#3D271B]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
