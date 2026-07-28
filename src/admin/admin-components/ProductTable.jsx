import { Edit, Trash2, Star, Flame, TrendingUp, Clock } from "lucide-react";

const ProductTable = ({ products, onEditClick, onDeleteClick, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E6CCB2]/30 shadow-xs overflow-hidden text-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF6F0]/50 border-b border-[#E6CCB2]/20 text-[#6E5A4F] font-semibold">
              <th className="px-6 py-4">Sweet Image</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-center font-mono">Price (MRP / Sell)</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4 text-center">Promotions</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAF6F0] text-[#3D271B]">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-[#FAF6F0]/15 transition">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-slate-100 overflow-hidden shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-sm block">{p.name}</span>
                  {p.description && <span className="text-[10px] text-[#6E5A4F] block mt-0.5 max-w-xs truncate">{p.description}</span>}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-0.5 bg-[#FAF6F0] border border-[#E6CCB2]/30 rounded-md text-[10px] text-[#6E5A4F] font-bold">
                    {p.categoryId}
                  </span>
                </td>
                <td className="px-6 py-4 text-center font-semibold">
                  <span className="text-[#6E5A4F]/60 line-through block font-mono text-[10px]">₹{p.mrp}</span>
                  <span className="font-bold text-[#3D271B] font-mono">₹{p.sellingPrice} / {p.unit}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`font-bold font-mono px-2 py-0.5 rounded-md
                    ${p.stock === 0 ? "bg-red-50 text-red-700" : "bg-slate-50 text-slate-700"}`}>
                    {p.stock} {p.unit}s
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {p.isFeatured && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-md text-[9px] font-bold">
                        <Star size={8} fill="currentColor" /> Featured
                      </span>
                    )}
                    {p.isBestSeller && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-md text-[9px] font-bold">
                        <Flame size={8} fill="currentColor" /> Best
                      </span>
                    )}
                    {p.isTrending && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-md text-[9px] font-bold">
                        <TrendingUp size={8} /> Trending
                      </span>
                    )}
                    {p.isNewArrival && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-[9px] font-bold">
                        <Clock size={8} /> New
                      </span>
                    )}
                    {!p.isFeatured && !p.isBestSeller && !p.isTrending && !p.isNewArrival && (
                      <span className="text-[10px] text-[#6E5A4F]/40">—</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => onToggleStatus(p.id)} className="focus:outline-none hover:scale-105 transition cursor-pointer">
                    {p.status ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[10px]">Active</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-full font-bold text-[10px]">Disabled</span>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEditClick(p)}
                      className="p-1.5 hover:bg-amber-50 text-[#a65827] hover:text-[#DFA250] rounded-lg transition cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteClick(p.id)}
                      className="p-1.5 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-lg transition cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
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

export default ProductTable;
