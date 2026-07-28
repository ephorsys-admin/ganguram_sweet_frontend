import { Edit, Layers } from "lucide-react";

const CategoryTable = ({ categories, onEditClick, onToggleStatus }) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E6CCB2]/30 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAF6F0]/50 border-b border-[#E6CCB2]/20 text-[#6E5A4F] font-semibold">
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-center">Sort Order</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAF6F0] text-[#3D271B]">
            {categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-[#FAF6F0]/15 transition">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                    {cat.image?.url ? (
                      <img src={cat.image.url} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <Layers className="text-[#E6CCB2] h-5 w-5" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-sm">{cat.name}</td>
                <td className="px-6 py-4 text-[#6E5A4F] max-w-xs truncate">{cat.description || "—"}</td>
                <td className="px-6 py-4 text-center font-bold font-mono">{cat.sortOrder}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onToggleStatus(cat)}
                      className="focus:outline-none transition hover:scale-105 active:scale-95 cursor-pointer"
                      title={`Click to mark as ${cat.status ? 'Inactive' : 'Active'}`}
                    >
                      {cat.status ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Inactive
                        </span>
                      )}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onEditClick(cat)}
                    className="p-2 hover:bg-amber-50 text-[#a65827] hover:text-[#DFA250] rounded-lg transition cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit size={15} />
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
