import { Edit, Layers } from "lucide-react";

const CategoryTable = ({ categories, onEditClick, onToggleStatus }) => {
  return (
    <div className="w-full">
      {/* ========================================================== */}
      {/* Mobile Card Grid View (Shown below 1024px viewport)        */}
      {/* ========================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:hidden">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E6CCB2]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4"
          >
            {/* Card Header: Sort Order & Edit Action */}
            <div className="flex items-center justify-between">
              <span className="inline-flex px-3 py-1 bg-[#FAF6F0] border border-[#E6CCB2]/30 rounded-xl text-xs text-[#a65827] font-bold uppercase tracking-wider">
                Sort Order: {cat.sortOrder}
              </span>

              <button
                onClick={() => onEditClick(cat)}
                className="p-2.5 bg-[#FAF6F0] hover:bg-[#E6CCB2]/30 text-[#a65827] rounded-xl transition cursor-pointer hover:scale-105 active:scale-95 shadow-xs"
                title="Edit Category"
              >
                <Edit size={16} />
              </button>
            </div>

            {/* Main Content Area: Image next to details */}
            <div className="flex items-start gap-4">
              {/* Category Image */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-50/50 border border-[#E6CCB2]/30 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                {cat.image?.url ? (
                  <img
                    src={cat.image.url}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Layers className="text-[#E6CCB2] h-8 w-8" />
                )}
              </div>

              {/* Name & Description */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-lg text-[#3D271B] leading-snug truncate">
                  {cat.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#6E5A4F] line-clamp-2">
                  {cat.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Card Footer: Status toggle */}
            <div className="flex items-center justify-between border-t border-[#FAF6F0] pt-3.5">
              <span className="text-xs text-[#6E5A4F] font-semibold">
                Status Settings
              </span>

              <button
                onClick={() => onToggleStatus(cat)}
                className="focus:outline-none hover:scale-105 active:scale-95 transition cursor-pointer"
                title={`Click to mark as ${cat.status ? "Inactive" : "Active"}`}
              >
                {cat.status ? (
                  <span className="px-4 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-xs uppercase tracking-wider">
                    Active
                  </span>
                ) : (
                  <span className="px-4 py-1 bg-slate-50 text-slate-500 border border-slate-200 rounded-full font-bold text-xs uppercase tracking-wider">
                    Inactive
                  </span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================== */}
      {/* Desktop Table View (Shown on lg viewport and above)         */}
      {/* ========================================================== */}
      <div className="bg-white rounded-3xl border border-[#E6CCB2]/40 shadow-xs overflow-hidden text-sm hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0]/60 border-b border-[#E6CCB2]/30 text-[#6E5A4F] font-bold text-xs uppercase tracking-wider">
                <th className="px-6 py-4.5">Image</th>
                <th className="px-6 py-4.5">Name</th>
                <th className="px-6 py-4.5">Description</th>
                <th className="px-6 py-4.5 text-center">Sort Order</th>
                <th className="px-6 py-4.5 text-center">Status</th>
                <th className="px-6 py-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0] text-[#3D271B]">
              {categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="hover:bg-[#FAF6F0]/25 transition"
                >
                  <td className="px-6 py-4.5">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-[#E6CCB2]/30 shadow-xs overflow-hidden flex items-center justify-center transition duration-300 hover:scale-105 shrink-0">
                      {cat.image?.url ? (
                        <img
                          src={cat.image.url}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Layers className="text-[#E6CCB2] h-7 w-7" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4.5 font-bold text-base text-[#3D271B]">
                    {cat.name}
                  </td>
                  <td className="px-6 py-4.5 text-sm text-[#6E5A4F] relative group max-w-xs">
                    <span className="block truncate cursor-help">
                      {cat.description || "—"}
                    </span>
                    {cat.description && (
                      <div className="absolute left-6 bottom-full mb-2 hidden group-hover:block w-80 bg-[#3D271B] text-[#FFFDF8] text-xs rounded-2xl p-4 shadow-2xl border border-[#E6CCB2]/30 z-30 pointer-events-none transition-all duration-200">
                        <p className="font-bold text-xs text-[#DFA250] mb-1.5 uppercase tracking-wider">
                          Full Description
                        </p>
                        <p className="whitespace-normal leading-relaxed">
                          {cat.description}
                        </p>
                        <div className="absolute left-4 top-full w-2.5 h-2.5 bg-[#3D271B] border-r border-b border-[#E6CCB2]/30 rotate-45 -translate-y-[5px]"></div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4.5 text-center font-bold font-mono text-base">
                    {cat.sortOrder}
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="flex justify-center">
                      <button
                        onClick={() => onToggleStatus(cat)}
                        className="focus:outline-none transition hover:scale-105 active:scale-95 cursor-pointer"
                        title={`Click to mark as ${
                          cat.status ? "Inactive" : "Active"
                        }`}
                      >
                        {cat.status ? (
                          <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider shadow-xs">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold bg-slate-50 text-slate-500 border border-slate-200 uppercase tracking-wider shadow-xs">
                            Inactive
                          </span>
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-right">
                    <button
                      onClick={() => onEditClick(cat)}
                      className="p-2.5 hover:bg-amber-50 text-[#a65827] hover:text-[#DFA250] rounded-xl transition cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit size={18} />
                    </button>
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

export default CategoryTable;
