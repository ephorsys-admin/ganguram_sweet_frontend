import { Calendar } from "lucide-react";

const InquiryList = ({ inquiries, selectedInquiryId, onSelectInquiry }) => {
  return (
    <div className="space-y-3">
      {inquiries.map((inq) => (
        <div 
          key={inq._id}
          onClick={() => onSelectInquiry(inq)}
          className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3
            ${selectedInquiryId === inq._id 
              ? "bg-white border-[#DFA250] shadow-md ring-1 ring-[#DFA250]/20" 
              : "bg-white border-[#E6CCB2]/30 hover:border-[#E6CCB2]/60 hover:shadow-xs"}`}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-0.5">
              <span className="font-bold text-sm text-[#3D271B]">{inq.name}</span>
              <div className="flex items-center gap-2 text-[10px] text-[#6E5A4F]/70">
                <span className="font-semibold">{inq.email}</span>
                <span>•</span>
                <span className="font-semibold">{inq.phone}</span>
              </div>
            </div>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0
              ${inq.status === "Pending" ? "bg-red-50 text-red-700 border border-red-100" : "bg-emerald-50 text-emerald-700 border border-emerald-100"}
            `}>
              {inq.status}
            </span>
          </div>

          <p className="text-[#6E5A4F] text-xs line-clamp-2 leading-relaxed whitespace-pre-wrap">
            "{inq.reason}"
          </p>

          <div className="flex justify-between items-center pt-2 border-t border-[#FAF6F0] text-[10px] font-mono text-[#6E5A4F]/60">
            <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(inq.createdAt).toLocaleDateString()}</span>
            <span className="text-[#a65827] font-semibold">Click to inspect</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InquiryList;
