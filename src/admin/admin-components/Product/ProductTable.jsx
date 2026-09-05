import { Edit, Trash2, Star, Flame, TrendingUp, Clock } from "lucide-react";

const ProductTable = ({ products, onEditClick, onDeleteClick, onToggleStatus }) => {
  return (
    <div className="w-full">
      {/* ========================================================== */}
      {/* Mobile Card Grid View (Shown below 1024px viewport)        */}
      {/* ========================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:hidden">
        {products.map((p) => {
          // Calculate discount percentage
          const discount = p.mrp && p.sellingPrice 
            ? Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100)
            : 0;

          return (
            <div 
              key={p._id} 
              className="bg-white p-5 rounded-3xl border border-[#E6CCB2]/20 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4"
            >
              {/* Header: Category Badge & Action Buttons */}
              <div className="flex items-center justify-between">
                <span className="inline-flex px-2.5 py-1 bg-[#FAF6F0] border border-[#E6CCB2]/20 rounded-xl text-[10px] text-[#a65827] font-bold uppercase tracking-wider">
                  {p.category?.name || "Uncategorized"}
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditClick(p)}
                    className="p-2 bg-[#FAF6F0] hover:bg-[#E6CCB2]/20 text-[#a65827] rounded-xl transition cursor-pointer hover:scale-105 active:scale-95"
                    title="Edit Product"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteClick(p._id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-650 rounded-xl transition cursor-pointer hover:scale-105 active:scale-95"
                    title="Delete Product"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Main Content Area: Image next to details */}
              <div className="flex items-start gap-4">
                {/* Product Image */}
                <div className="w-18 h-18 rounded-2xl bg-amber-50/50 border border-[#E6CCB2]/20 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                  {p.images?.[0]?.url ? (
                    <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-bold text-[#E6CCB2] uppercase">No Img</span>
                  )}
                </div>

                {/* Name, Prices, Discount */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-[#3D271B] leading-snug truncate">
                    {p.name}
                  </h3>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-extrabold text-sm sm:text-base text-[#3D271B] font-mono">
                      ₹{p.sellingPrice}
                    </span>
                    {p.mrp > p.sellingPrice && (
                      <span className="text-[10px] sm:text-xs line-through text-[#6E5A4F]/40 font-mono">
                        ₹{p.mrp}
                      </span>
                    )}
                    <span className="text-[10px] text-[#6E5A4F]/60 font-medium">/ {p.unit}</span>
                  </div>
                  {discount > 0 && (
                    <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold px-2 py-0.5 rounded-md">
                      {discount}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Promo badging */}
              {(p.isFeatured || p.isBestSeller || p.isTrending || p.isNewArrival) && (
                <div className="flex flex-wrap gap-1.5 border-t border-[#FAF6F0] pt-3">
                  {p.isFeatured && (
                    <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-full text-[9px] font-bold">
                      <Star size={9} fill="currentColor" /> Featured
                    </span>
                  )}
                  {p.isBestSeller && (
                    <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-full text-[9px] font-bold">
                      <Flame size={9} fill="currentColor" /> Best
                    </span>
                  )}
                  {p.isTrending && (
                    <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-[9px] font-bold">
                      <TrendingUp size={9} /> Trending
                    </span>
                  )}
                  {p.isNewArrival && (
                    <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[9px] font-bold">
                      <Clock size={9} /> New
                    </span>
                  )}
                </div>
              )}

              {/* Card Footer: Stock Level and Toggle switch */}
              <div className="flex items-center justify-between border-t border-[#FAF6F0] pt-3">
                <span className={`font-bold font-mono px-2.5 py-1 rounded-lg text-[11px]
                  ${p.stock === 0 ? "bg-red-50 text-red-755" : "bg-slate-50 text-slate-755"}`}>
                  Stock: {p.stock} {p.unit}s
                </span>

                <button onClick={() => onToggleStatus(p)} className="focus:outline-none hover:scale-105 transition cursor-pointer">
                  {p.status ? (
                    <span className="px-3.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[10px] uppercase tracking-wider">Active</span>
                  ) : (
                    <span className="px-3.5 py-1 bg-slate-50 text-slate-500 border border-slate-200 rounded-full font-bold text-[10px] uppercase tracking-wider">Disabled</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================== */}
      {/* Desktop Table View (Shown on lg viewport and above)         */}
      {/* ========================================================== */}
      <div className="bg-white rounded-3xl border border-[#E6CCB2]/30 shadow-xs overflow-hidden text-sm hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0]/50 border-b border-[#E6CCB2]/20 text-[#6E5A4F] font-semibold text-xs uppercase tracking-wider">
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
                  <td className="px-6 py-4.5">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-[#E6CCB2]/30 shadow-xs overflow-hidden shrink-0 flex items-center justify-center transition duration-300 hover:scale-105">
                      {p.images?.[0]?.url ? (
                        <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[11px] font-bold text-[#E6CCB2] uppercase">No Img</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4.5 relative group max-w-xs">
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
                  <td className="px-6 py-4.5">
                    <span className="inline-flex px-2.5 py-1 bg-[#FAF6F0] border border-[#E6CCB2]/30 rounded-lg text-[11px] text-[#6E5A4F] font-bold">
                      {p.category?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-center font-semibold">
                    <span className="text-[#6E5A4F]/65 line-through block font-mono text-[11px]">₹{p.mrp}</span>
                    <span className="font-bold text-[#3D271B] font-mono text-sm">₹{p.sellingPrice} / {p.unit}</span>
                  </td>
                  <td className="px-6 py-4.5 text-center">
                    <span className={`font-bold font-mono px-2.5 py-1 rounded-lg text-xs
                      ${p.stock === 0 ? "bg-red-50 text-red-700" : "bg-slate-50 text-slate-700"}`}>
                      {p.stock} {p.unit}s
                    </span>
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {p.isFeatured && (
                        <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-full text-[10px] font-bold">
                          <Star size={10} fill="currentColor" /> Featured
                        </span>
                      )}
                      {p.isBestSeller && (
                        <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-full text-[10px] font-bold">
                          <Flame size={10} fill="currentColor" /> Best
                        </span>
                      )}
                      {p.isTrending && (
                        <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-[10px] font-bold">
                          <TrendingUp size={10} /> Trending
                        </span>
                      )}
                      {p.isNewArrival && (
                        <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[10px] font-bold">
                          <Clock size={10} /> New
                        </span>
                      )}
                      {!p.isFeatured && !p.isBestSeller && !p.isTrending && !p.isNewArrival && (
                        <span className="text-[11px] text-[#6E5A4F]/40">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-center">
                    <button onClick={() => onToggleStatus(p)} className="focus:outline-none hover:scale-105 transition cursor-pointer">
                      {p.status ? (
                        <span className="px-3.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[11px] uppercase tracking-wider">Active</span>
                      ) : (
                        <span className="px-3.5 py-1 bg-slate-50 text-slate-500 border border-slate-200 rounded-full font-bold text-[11px] uppercase tracking-wider">Disabled</span>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEditClick(p)}
                        className="p-2 hover:bg-amber-50 text-[#a65827] hover:text-[#DFA250] rounded-xl transition cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteClick(p._id)}
                        className="p-2 hover:bg-red-50 text-red-655 hover:text-red-700 rounded-xl transition cursor-pointer"
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
    </div>
  );
};

export default ProductTable;
