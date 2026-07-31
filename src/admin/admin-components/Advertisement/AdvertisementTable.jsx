import { Edit, Trash, Megaphone, Calendar, User } from "lucide-react";

const AdvertisementTable = ({ advertisements, onEditClick, onDeleteClick, onTogglePublic }) => {
  return (
    <div className="w-full">
      {/* ========================================================== */}
      {/* Mobile Card Grid View (Shown below 1024px viewport)        */}
      {/* ========================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:hidden">
        {advertisements.map((ad) => (
          <div 
            key={ad._id} 
            className="bg-white rounded-3xl border border-[#E6CCB2]/20 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Image Preview Banner */}
            <div className="relative h-44 w-full bg-[#FAF6F0] border-b border-[#E6CCB2]/10 overflow-hidden flex items-center justify-center">
              {ad.image ? (
                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
              ) : (
                <Megaphone className="text-[#E6CCB2] h-12 w-12" />
              )}

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <button
                  onClick={() => onTogglePublic(ad)}
                  className="focus:outline-none transition cursor-pointer"
                  title={`Click to mark as ${ad.isPublic ? 'Private' : 'Public'}`}
                >
                  {ad.isPublic ? (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[9px] uppercase tracking-wider">
                      Public
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-slate-50 text-slate-500 border border-slate-200 rounded-full font-bold text-[9px] uppercase tracking-wider">
                      Private
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <h3 className="font-serif font-black text-base text-[#3D271B] leading-snug line-clamp-2">
                  {ad.title}
                </h3>

                {/* Metadata */}
                <div className="space-y-1 text-[11px] text-[#6E5A4F]">
                  <div className="flex items-center gap-1.5">
                    <User size={12} className="text-[#a65827]" />
                    <span>Created by: <span className="font-bold">{ad.createdBy?.fullName || "Admin"}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-[#a65827]" />
                    <span>{new Date(ad.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-[#FAF6F0] pt-3 mt-1">
                <span className="text-[10px] text-[#6E5A4F]/60 font-semibold">
                  Actions
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditClick(ad)}
                    className="p-2 bg-[#FAF6F0] hover:bg-[#E6CCB2]/20 text-[#a65827] rounded-xl transition cursor-pointer hover:scale-105 active:scale-95"
                    title="Edit Advertisement"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteClick(ad)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition cursor-pointer hover:scale-105 active:scale-95"
                    title="Delete Advertisement"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================== */}
      {/* Desktop Table View (Shown on lg viewport and above)         */}
      {/* ========================================================== */}
      <div className="bg-white rounded-3xl border border-[#E6CCB2]/30 shadow-xs overflow-hidden text-sm hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF6F0]/50 border-b border-[#E6CCB2]/20 text-[#6E5A4F] font-semibold text-xs uppercase tracking-wider">
                <th className="px-6 py-4.5 w-48">Banner</th>
                <th className="px-6 py-4.5">Title</th>
                <th className="px-6 py-4.5">Created By</th>
                <th className="px-6 py-4.5">Created Date</th>
                <th className="px-6 py-4.5 text-center">Visibility</th>
                <th className="px-6 py-4.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF6F0] text-[#3D271B]">
              {advertisements.map((ad) => (
                <tr key={ad._id} className="hover:bg-[#FAF6F0]/15 transition">
                  {/* Banner Column */}
                  <td className="px-6 py-4.5">
                    <div className="w-36 h-20 rounded-2xl bg-amber-50 border border-[#E6CCB2]/30 shadow-xs overflow-hidden flex items-center justify-center transition duration-300 hover:scale-105 shrink-0">
                      {ad.image ? (
                        <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                      ) : (
                        <Megaphone className="text-[#E6CCB2] h-6 w-6" />
                      )}
                    </div>
                  </td>

                  {/* Title Column */}
                  <td className="px-6 py-4.5 font-bold text-base text-[#3D271B] max-w-xs truncate" title={ad.title}>
                    {ad.title}
                  </td>

                  {/* Created By Column */}
                  <td className="px-6 py-4.5 text-sm text-[#6E5A4F]">
                    <div className="font-semibold">{ad.createdBy?.fullName || "Admin"}</div>
                    <div className="text-[10px] text-[#6E5A4F]/70">{ad.createdBy?.email}</div>
                  </td>

                  {/* Created Date Column */}
                  <td className="px-6 py-4.5 text-sm text-[#6E5A4F] font-mono">
                    {new Date(ad.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                  </td>

                  {/* Visibility Toggle Column */}
                  <td className="px-6 py-4.5">
                    <div className="flex justify-center">
                      <button
                        onClick={() => onTogglePublic(ad)}
                        className="focus:outline-none transition hover:scale-105 active:scale-95 cursor-pointer"
                        title={`Click to mark as ${ad.isPublic ? 'Private' : 'Public'}`}
                      >
                        {ad.isPublic ? (
                          <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                            Public
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-[11px] font-bold bg-slate-50 text-slate-500 border border-slate-200 uppercase tracking-wider">
                            Private
                          </span>
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4.5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEditClick(ad)}
                        className="p-2 hover:bg-amber-50 text-[#a65827] hover:text-[#DFA250] rounded-xl transition cursor-pointer"
                        title="Edit Advertisement"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteClick(ad)}
                        className="p-2 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-xl transition cursor-pointer"
                        title="Delete Advertisement"
                      >
                        <Trash size={14} />
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

export default AdvertisementTable;
