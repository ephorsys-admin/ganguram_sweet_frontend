import { Calendar } from "lucide-react";

const InquiryList = ({ inquiries, selectedInquiryId, onSelectInquiry }) => {
  return (
    <div className="space-y-4">
      {inquiries.map((inq) => (
        <div
          key={inq._id}
          onClick={() => onSelectInquiry(inq)}
          className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3.5 ${
            selectedInquiryId === inq._id
              ? "bg-white border-[#DFA250] shadow-md ring-2 ring-[#DFA250]/20"
              : "bg-white border-[#E6CCB2]/40 hover:border-[#E6CCB2]/70 hover:shadow-xs"
          }`}
        >
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <span className="font-bold text-base text-[#3D271B]">
                {inq.name}
              </span>
              <div className="flex items-center gap-2 text-xs text-[#6E5A4F]">
                <span className="font-medium">{inq.email}</span>
                <span>•</span>
                <span className="font-mono font-semibold">{inq.phone}</span>
              </div>
            </div>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-bold shrink-0 shadow-xs ${
                inq.status === "Pending"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {inq.status}
            </span>
          </div>

          <p className="text-[#6E5A4F] text-sm line-clamp-2 leading-relaxed whitespace-pre-wrap">
            "{inq.reason}"
          </p>

          <div className="flex justify-between items-center pt-3 border-t border-[#FAF6F0] text-xs font-mono text-[#6E5A4F]/70">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar size={13} />{" "}
              {new Date(inq.createdAt).toLocaleDateString("en-IN")}
            </span>
            <span className="text-[#a65827] font-bold">Click to inspect</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InquiryList;
