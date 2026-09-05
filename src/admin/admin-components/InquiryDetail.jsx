import {
  MessageSquare,
  User,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Check,
  X,
} from "lucide-react";

const InquiryDetail = ({ inquiry, onToggleStatus, onDelete }) => {
  if (!inquiry) {
    return (
      <div className="text-center py-20 text-slate-400 space-y-3 font-sans">
        <div className="mx-auto w-14 h-14 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#E6CCB2]">
          <MessageSquare size={26} />
        </div>
        <p className="text-sm font-semibold text-[#6E5A4F]">
          Select an inquiry from the left side panel list to view details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-sm text-slate-800">
      <div className="flex justify-between items-center border-b border-[#FAF6F0] pb-4">
        <h3 className="font-serif font-black text-xl sm:text-2xl text-[#3D271B]">
          Inquiry Detail
        </h3>
        <span
          className={`inline-flex px-3.5 py-1 rounded-full text-xs font-bold shadow-xs ${
            inquiry.status === "Pending"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {inquiry.status}
        </span>
      </div>

      {/* Sender Cards */}
      <div className="bg-[#FAF6F0]/40 p-5 sm:p-6 rounded-2xl border border-[#E6CCB2]/30 space-y-3">
        <h4 className="font-bold text-[#3D271B] flex items-center gap-2 border-b border-[#E6CCB2]/20 pb-2 text-xs uppercase tracking-wider">
          <User size={15} className="text-[#a65827]" /> Contact Information
        </h4>
        <div className="space-y-2.5 font-semibold text-sm">
          <p className="text-base font-bold text-[#3D271B]">{inquiry.name}</p>
          <p className="flex items-center gap-2.5 text-[#6E5A4F]">
            <Mail size={15} className="text-[#a65827]" /> {inquiry.email}
          </p>
          <p className="flex items-center gap-2.5 text-[#6E5A4F] font-mono">
            <Phone size={15} className="text-[#a65827]" /> {inquiry.phone}
          </p>
          <p className="flex items-center gap-2.5 text-[#6E5A4F] font-mono text-xs pt-1">
            <Calendar size={15} className="text-[#a65827]" /> Received:{" "}
            {new Date(inquiry.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      {/* Message Box */}
      <div className="bg-[#FAF6F0]/40 p-5 sm:p-6 rounded-2xl border border-[#E6CCB2]/30 space-y-2">
        <h4 className="font-bold text-[#3D271B] border-b border-[#E6CCB2]/20 pb-2 text-xs uppercase tracking-wider">
          Message Content
        </h4>
        <p className="text-[#3D271B] leading-relaxed font-medium italic text-sm sm:text-base whitespace-pre-wrap">
          "{inquiry.reason}"
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-3 border-t border-[#FAF6F0] justify-end">
        <button
          onClick={() => onDelete(inquiry._id)}
          className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition cursor-pointer shadow-xs"
          title="Delete Inquiry Record"
        >
          <Trash2 size={18} />
        </button>
        <div className="flex-grow" />
        <button
          onClick={() => onToggleStatus(inquiry._id)}
          className={`px-6 py-3 text-white rounded-2xl font-bold flex items-center gap-2 cursor-pointer shadow-md transition text-sm ${
            inquiry.status === "Pending"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-amber-600 hover:bg-amber-700"
          }`}
        >
          {inquiry.status === "Pending" ? (
            <>
              <Check size={16} /> Mark Resolved
            </>
          ) : (
            <>
              <X size={16} /> Mark Pending
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InquiryDetail;
