import { Edit, Trash2, Star, Flame, TrendingUp, Clock } from "lucide-react";

const ProductTable = ({ products, onEditClick, onDeleteClick, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E6CCB2]/30 shadow-xs overflow-hidden text-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF6F0]/50 border-b border-[#E6CCB2]/20 text-[#6E5A4F] font-semibold text-sm">
              <th className="px-6 py-4.5">Sweet Image</th>
              <th className="px-6 py-4.5">Name</th>
              <th className="px-6 py-4.5">Category</th>
              <th className="px-6 py-4.5 text-center font-mono">Price (MRP / Sell)</th>
              <th className="px-6 py-4.5 text-center">Stock</th>
              <th className="px-6 py-4.5 text-center">Promotions</th>
              <th className="px-6 py-4.5 text-center">Status</th>
              <th className="px-6 py-4.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAF6F0] text-[#3D271B]">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-[#FAF6F0]/15 transition">
                <td className="px-6 py-5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-[#E6CCB2]/30 shadow-sm overflow-hidden shrink-0 flex items-center justify-center transition duration-300 hover:scale-105">
                    {p.images?.[0]?.url ? (
                      <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[11px] font-bold text-[#E6CCB2] uppercase">No Img</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 relative group max-w-xs">
                  <span className="font-bold text-base block text-[#3D271B]">{p.name}</span>
                  {p.description && (
                    <>
                      <span className="text-[11px] text-[#6E5A4F] block mt-0.5 truncate cursor-help">{p.description}</span>
                      <div className="absolute left-6 bottom-full mb-1.5 hidden group-hover:block w-72 bg-[#3D271B] text-[#FFFDF8] text-xs rounded-xl p-3 shadow-xl border border-[#E6CCB2]/30 z-30 pointer-events-none transition-all duration-200">
                        <p className="font-semibold text-[10px] text-[#DFA250] mb-1">Full Description</p>
                        <p className="whitespace-normal leading-relaxed font-normal">{p.description}</p>
                        <div className="absolute left-4 top-full w-2.5 h-2.5 bg-[#3D271B] border-r border-b border-[#E6CCB2]/30 rotate-45 -translate-y-[5px]"></div>
                      </div>
                    </>
                  )}
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex px-2.5 py-1 bg-[#FAF6F0] border border-[#E6CCB2]/30 rounded-md text-[11px] text-[#6E5A4F] font-bold">
                    {p.category?.name || "Uncategorized"}
                  </span>
                </td>
                <td className="px-6 py-5 text-center font-semibold">
                  <span className="text-[#6E5A4F]/60 line-through block font-mono text-[11px]">₹{p.mrp}</span>
                  <span className="font-bold text-[#3D271B] font-mono text-sm">₹{p.sellingPrice} / {p.unit}</span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`font-bold font-mono px-2.5 py-1 rounded-md text-xs
                    ${p.stock === 0 ? "bg-red-50 text-red-700" : "bg-slate-50 text-slate-700"}`}>
                    {p.stock} {p.unit}s
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {p.isFeatured && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-md text-[10px] font-bold">
                        <Star size={10} fill="currentColor" /> Featured
                      </span>
                    )}
                    {p.isBestSeller && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-md text-[10px] font-bold">
                        <Flame size={10} fill="currentColor" /> Best
                      </span>
                    )}
                    {p.isTrending && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-md text-[10px] font-bold">
                        <TrendingUp size={10} /> Trending
                      </span>
                    )}
                    {p.isNewArrival && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-[10px] font-bold">
                        <Clock size={10} /> New
                      </span>
                    )}
                    {!p.isFeatured && !p.isBestSeller && !p.isTrending && !p.isNewArrival && (
                      <span className="text-[11px] text-[#6E5A4F]/40">—</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <button onClick={() => onToggleStatus(p)} className="focus:outline-none hover:scale-105 transition cursor-pointer">
                    {p.status ? (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[11px]">Active</span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-50 text-slate-500 border border-slate-200 rounded-full font-bold text-[11px]">Disabled</span>
                    )}
                  </button>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEditClick(p)}
                      className="p-1.5 hover:bg-amber-50 text-[#a65827] hover:text-[#DFA250] rounded-lg transition cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteClick(p._id)}
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
