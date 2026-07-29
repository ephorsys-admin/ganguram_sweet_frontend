import { Edit, Layers } from "lucide-react";

const CategoryTable = ({ categories, onEditClick, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E6CCB2]/30 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-[#FAF6F0]/50 border-b border-[#E6CCB2]/20 text-[#6E5A4F] font-semibold text-sm">
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
              <tr key={cat._id} className="hover:bg-[#FAF6F0]/15 transition">
                <td className="px-6 py-5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-[#E6CCB2]/30 shadow-sm overflow-hidden flex items-center justify-center transition duration-300 hover:scale-105 shrink-0">
                    {cat.image?.url ? (
                      <img src={cat.image.url} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <Layers className="text-[#E6CCB2] h-6 w-6" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 font-bold text-base text-[#3D271B]">{cat.name}</td>
                <td className="px-6 py-5 text-sm text-[#6E5A4F] relative group max-w-xs">
                  <span className="block truncate cursor-help">{cat.description || "—"}</span>
                  {cat.description && (
                    <div className="absolute left-6 bottom-full mb-1.5 hidden group-hover:block w-72 bg-[#3D271B] text-[#FFFDF8] text-xs rounded-xl p-3 shadow-xl border border-[#E6CCB2]/30 z-30 pointer-events-none transition-all duration-200">
                      <p className="font-semibold text-[10px] text-[#DFA250] mb-1">Full Description</p>
                      <p className="whitespace-normal leading-relaxed">{cat.description}</p>
                      <div className="absolute left-4 top-full w-2.5 h-2.5 bg-[#3D271B] border-r border-b border-[#E6CCB2]/30 rotate-45 -translate-y-[5px]"></div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-5 text-center font-bold font-mono text-sm">{cat.sortOrder}</td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onToggleStatus(cat)}
                      className="focus:outline-none transition hover:scale-105 active:scale-95 cursor-pointer"
                      title={`Click to mark as ${cat.status ? 'Inactive' : 'Active'}`}
                    >
                      {cat.status ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Inactive
                        </span>
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => onEditClick(cat)}
                    className="p-2 hover:bg-amber-50 text-[#a65827] hover:text-[#DFA250] rounded-lg transition cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
