import { Edit, Trash2, Star, Flame, TrendingUp, Clock } from "lucide-react";

const ProductTable = ({
  products,
  onEditClick,
  onDeleteClick,
  onToggleStatus,
}) => {
  return (
    <div className="w-full">
      {/* ========================================================== */}
      {/* Mobile Card Grid View (Shown below 1024px viewport)        */}
      {/* ========================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:hidden">
        {products.map((p) => {
          // Calculate discount percentage
          const discount =
            p.mrp && p.sellingPrice
              ? Math.round(((p.mrp - p.sellingPrice) / p.mrp) * 100)
              : 0;

          return (
            <div
              key={p._id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E6CCB2]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4"
            >
              {/* Header: Category Badge & Action Buttons */}
              <div className="flex items-center justify-between">
                <span className="inline-flex px-3 py-1 bg-[#FAF6F0] border border-[#E6CCB2]/30 rounded-xl text-xs text-[#a65827] font-bold uppercase tracking-wider">
                  {p.category?.name || "Uncategorized"}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditClick(p)}
                    className="p-2.5 bg-[#FAF6F0] hover:bg-[#E6CCB2]/30 text-[#a65827] rounded-xl transition cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
                    title="Edit Product"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteClick(p._id)}
                    className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
                    title="Delete Product"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Main Content Area: Image next to details */}
              <div className="flex items-start gap-4">
                {/* Product Image */}
                <div className="w-20 h-20 rounded-2xl bg-amber-50/50 border border-[#E6CCB2]/30 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                  {p.images?.[0]?.url ? (
                    <img
                      src={p.images[0].url}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#E6CCB2] uppercase">
                      No Img
                    </span>
                  )}
                </div>

                {/* Name, Prices, Discount */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg text-[#3D271B] leading-snug truncate">
                    {p.name}
                  </h3>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-black text-base sm:text-lg text-[#3D271B] font-mono">
                      ₹{p.sellingPrice}
                    </span>
                    {p.mrp > p.sellingPrice && (
                      <span className="text-xs line-through text-[#6E5A4F]/60 font-mono">
                        ₹{p.mrp}
                      </span>
                    )}
                    <span className="text-xs text-[#6E5A4F] font-semibold">
                      / {p.unit}
                    </span>
                  </div>
                  {discount > 0 && (
                    <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold px-2.5 py-0.5 rounded-lg">
                      {discount}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Promo badging */}
              {(p.isFeatured ||
                p.isBestSeller ||
                p.isTrending ||
                p.isNewArrival) && (
                <div className="flex flex-wrap gap-2 border-t border-[#FAF6F0] pt-3.5">
                  {p.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-full text-xs font-bold">
                      <Star size={12} fill="currentColor" /> Featured
                    </span>
                  )}
                  {p.isBestSeller && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-800 border border-orange-200 rounded-full text-xs font-bold">
                      <Flame size={12} fill="currentColor" /> Best
                    </span>
                  )}
                  {p.isTrending && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-full text-xs font-bold">
                      <TrendingUp size={12} /> Trending
                    </span>
                  )}
                  {p.isNewArrival && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-xs font-bold">
                      <Clock size={12} /> New
                    </span>
                  )}
                </div>
              )}

              {/* Card Footer: Stock Level and Toggle switch */}
              <div className="flex items-center justify-between border-t border-[#FAF6F0] pt-3.5">
                <span
                  className={`font-bold font-mono px-3 py-1 rounded-xl text-xs sm:text-sm ${
                    p.stock === 0
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-[#FAF6F0] text-[#3D271B] border border-[#E6CCB2]/30"
                  }`}
                >
                  Stock: {p.stock} {p.unit}s
                </span>

                <button
                  onClick={() => onToggleStatus(p)}
                  className="focus:outline-none hover:scale-105 active:scale-95 transition cursor-pointer"
                >
                  {p.status ? (
                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-xs uppercase tracking-wider shadow-xs">
                      Active
                    </span>
                  ) : (
                    <span className="px-4 py-1.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-full font-bold text-xs uppercase tracking-wider shadow-xs">
                      Disabled
                    </span>
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
      <div className="bg-white rounded-3xl border border-[#E6CCB2]/40 shadow-xs overflow-hidden text-sm hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0]/60 border-b border-[#E6CCB2]/30 text-[#6E5A4F] font-bold text-xs uppercase tracking-wider">
                <th className="px-6 py-4.5">Sweet Image</th>
                <th className="px-6 py-4.5">Name</th>
                <th className="px-6 py-4.5">Category</th>
                <th className="px-6 py-4.5 text-center font-mono">
                  Price (MRP / Sell)
                </th>
                <th className="px-6 py-4.5 text-center">Stock</th>
                <th className="px-6 py-4.5 text-center">Promotions</th>
                <th className="px-6 py-4.5 text-center">Status</th>
                <th className="px-6 py-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0] text-[#3D271B]">
              {products.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-[#FAF6F0]/25 transition"
                >
                  <td className="px-6 py-4.5">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-[#E6CCB2]/30 shadow-xs overflow-hidden shrink-0 flex items-center justify-center transition duration-300 hover:scale-105">
                      {p.images?.[0]?.url ? (
                        <img
                          src={p.images[0].url}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-[#E6CCB2] uppercase">
                          No Img
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4.5 relative group max-w-xs">
                    <span className="font-bold text-base block text-[#3D271B]">
                      {p.name}
                    </span>
                    {p.description && (
                      <>
                        <span className="text-xs text-[#6E5A4F] block mt-1 truncate cursor-help">
                          {p.description}
                        </span>
                        <div className="absolute left-6 bottom-full mb-2 hidden group-hover:block w-80 bg-[#3D271B] text-[#FFFDF8] text-xs rounded-2xl p-4 shadow-2xl border border-[#E6CCB2]/30 z-30 pointer-events-none transition-all duration-200">
                          <p className="font-bold text-xs text-[#DFA250] mb-1.5 uppercase tracking-wider">
                            Full Description
                          </p>
                          <p className="whitespace-normal leading-relaxed font-normal">
                            {p.description}
                          </p>
                          <div className="absolute left-4 top-full w-2.5 h-2.5 bg-[#3D271B] border-r border-b border-[#E6CCB2]/30 rotate-45 -translate-y-[5px]"></div>
                        </div>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4.5">
                    <span className="inline-flex px-3 py-1 bg-[#FAF6F0] border border-[#E6CCB2]/30 rounded-xl text-xs text-[#6E5A4F] font-bold">
                      {p.category?.name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-center font-semibold">
                    <span className="text-[#6E5A4F]/60 line-through block font-mono text-xs">
                      ₹{p.mrp}
                    </span>
                    <span className="font-black text-[#3D271B] font-mono text-base">
                      ₹{p.sellingPrice} / {p.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-center">
                    <span
                      className={`font-bold font-mono px-3 py-1.5 rounded-xl text-xs sm:text-sm ${
                        p.stock === 0
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {p.stock} {p.unit}s
                    </span>
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {p.isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-full text-xs font-bold">
                          <Star size={11} fill="currentColor" /> Featured
                        </span>
                      )}
                      {p.isBestSeller && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-800 border border-orange-200 rounded-full text-xs font-bold">
                          <Flame size={11} fill="currentColor" /> Best
                        </span>
                      )}
                      {p.isTrending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-full text-xs font-bold">
                          <TrendingUp size={11} /> Trending
                        </span>
                      )}
                      {p.isNewArrival && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-xs font-bold">
                          <Clock size={11} /> New
                        </span>
                      )}
                      {!p.isFeatured &&
                        !p.isBestSeller &&
                        !p.isTrending &&
                        !p.isNewArrival && (
                          <span className="text-xs text-[#6E5A4F]/40">—</span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-center">
                    <button
                      onClick={() => onToggleStatus(p)}
                      className="focus:outline-none hover:scale-105 active:scale-95 transition cursor-pointer"
                    >
                      {p.status ? (
                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-xs uppercase tracking-wider shadow-xs">
                          Active
                        </span>
                      ) : (
                        <span className="px-4 py-1.5 bg-slate-50 text-slate-500 border border-slate-200 rounded-full font-bold text-xs uppercase tracking-wider shadow-xs">
                          Disabled
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditClick(p)}
                        className="p-2.5 hover:bg-amber-50 text-[#a65827] hover:text-[#DFA250] rounded-xl transition cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteClick(p._id)}
                        className="p-2.5 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-xl transition cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
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
