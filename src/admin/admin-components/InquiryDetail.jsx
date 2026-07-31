import { MessageSquare, User, Mail, Phone, Calendar, Trash2, Check, X } from "lucide-react";

const InquiryDetail = ({ inquiry, onToggleStatus, onDelete }) => {
  if (!inquiry) {
    return (
      <div className="text-center py-16 text-slate-400 space-y-3 font-sans">
        <div className="mx-auto w-12 h-12 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#E6CCB2]/70">
          <MessageSquare size={22} />
        </div>
        <p className="text-[11px] font-semibold text-[#6E5A4F]/70">Select an inquiry from the left side panel list to view details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs text-slate-800">
      <div className="flex justify-between items-center border-b border-[#FAF6F0] pb-4">
        <h3 className="font-serif font-black text-lg text-[#3D271B]">Inquiry Detail</h3>
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold
          ${inquiry.status === "Pending" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}
        `}>
          {inquiry.status}
        </span>
      </div>

      {/* Sender Cards */}
      <div className="bg-[#FAF6F0]/40 p-4 rounded-2xl border border-[#E6CCB2]/20 space-y-2.5">
        <h4 className="font-bold text-[#3D271B] flex items-center gap-1.5 border-b border-[#E6CCB2]/20 pb-1">
          <User size={13} className="text-[#a65827]" /> Contact Information
        </h4>
        <div className="space-y-2 font-semibold">
          <p className="text-sm font-bold text-[#3D271B]">{inquiry.name}</p>
          <p className="flex items-center gap-2 text-[#6E5A4F]"><Mail size={13} /> {inquiry.email}</p>
          <p className="flex items-center gap-2 text-[#6E5A4F]"><Phone size={13} /> {inquiry.phone}</p>
          <p className="flex items-center gap-2 text-[#6E5A4F] font-mono text-[10px]"><Calendar size={13} /> Received: {new Date(inquiry.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Message Box */}
      <div className="bg-[#FAF6F0]/40 p-4 rounded-2xl border border-[#E6CCB2]/20 space-y-1.5">
        <h4 className="font-bold text-[#3D271B] border-b border-[#E6CCB2]/20 pb-1">
          Message Content
        </h4>
        <p className="text-[#3D271B] leading-relaxed font-semibold italic text-xs whitespace-pre-wrap">
          "{inquiry.reason}"
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-[#FAF6F0] justify-end">
        <button
          onClick={() => onDelete(inquiry._id)}
          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition cursor-pointer"
          title="Delete Inquiry Record"
        >
          <Trash2 size={15} />
        </button>
        <div className="flex-grow" />
        <button
          onClick={() => onToggleStatus(inquiry._id)}
          className={`px-4 py-2 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition
            ${inquiry.status === "Pending" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700"}`}
        >
          {inquiry.status === "Pending" ? (
            <>
              <Check size={14} /> Mark Resolved
            </>
          ) : (
            <>
              <X size={14} /> Mark Pending
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InquiryDetail;
