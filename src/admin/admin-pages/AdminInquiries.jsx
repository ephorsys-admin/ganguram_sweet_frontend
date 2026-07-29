import { useState, useEffect } from "react";
import { MessageSquare, Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InquiryList from "../admin-components/InquiryList";
import InquiryDetail from "../admin-components/InquiryDetail";
import { useToast } from "../../context/ToastContext";

const AdminInquiries = () => {
  const { showToast } = useToast();
  // Load inquiries from localStorage
  const [inquiries, setInquiries] = useState(() => {
    const data = localStorage.getItem("ganguram_inquiries");
    return data ? JSON.parse(data) : [
      { id: 1, name: "Vikram Singh", email: "vikram@gmail.com", phone: "9876543210", message: "Bulk catering order for wedding on 15th August. Need Chhena Poda and Rajbhog for 500 guests.", status: "Pending", date: "2026-07-28" },
      { id: 2, name: "Anjali Gupta", email: "anjali@gmail.com", phone: "8765432109", message: "Do you deliver packaged/canned sweets to Mumbai? Wanted to order Kaju Katli for gifting.", status: "Resolved", date: "2026-07-27" },
      { id: 3, name: "Debashish Roy", email: "debashish@gmail.com", phone: "7654321098", message: "Wanted to inquire about franchise options in Cuttack. Please share the details of partnership.", status: "Pending", date: "2026-07-26" },
      { id: 4, name: "Shalini Patnaik", email: "shalini.p@outlook.com", phone: "9437012345", message: "Amazing Chhena Jhili! Visited the outlet yesterday and was very impressed. Keep up the quality.", status: "Resolved", date: "2026-07-24" }
    ];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("ganguram_inquiries", JSON.stringify(inquiries));
  }, [inquiries]);

  // Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Selected Inquiry for viewing details
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const handleToggleResolve = (id) => {
    const updated = inquiries.map(inq => {
      if (inq.id === id) {
        const nextStatus = inq.status === "Pending" ? "Resolved" : "Pending";
        return { ...inq, status: nextStatus };
      }
      return inq;
    });
    setInquiries(updated);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({
        ...selectedInquiry,
        status: selectedInquiry.status === "Pending" ? "Resolved" : "Pending"
      });
    }
    const target = inquiries.find(inq => inq.id === id);
    const nextStatus = target?.status === "Pending" ? "Resolved" : "Pending";
    showToast(`Inquiry marked as ${nextStatus}!`, "success");
  };

  const handleDeleteInquiry = (id) => {
    if (window.confirm("Are you sure you want to delete this inquiry record?")) {
      setInquiries(inquiries.filter(inq => inq.id !== id));
      setSelectedInquiry(null);
      showToast("Inquiry record deleted successfully.", "info");
    }
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = inq.name.toLowerCase().includes(search.toLowerCase()) || 
                          inq.email.toLowerCase().includes(search.toLowerCase()) || 
                          inq.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3D271B] flex items-center gap-2">
          <MessageSquare className="text-[#a65827] h-8 w-8" />
          Customer Inquiries
        </h1>
        <p className="text-xs text-[#6E5A4F] mt-1">Review feedback, corporate gifting requests, and bulk catering booking inquiries.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6CCB2]/30 shadow-xs flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute inset-y-0 left-3.5 my-auto text-[#6E5A4F]/50 h-4 w-4" />
          <input
            type="text"
            placeholder="Search inquiries by name, email, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] focus:outline-none focus:ring-2 focus:ring-[#a65827]/10"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <Filter size={15} className="text-[#a65827]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full md:w-48 px-3 py-2.5 bg-[#FAF6F0]/40 border border-[#E6CCB2]/30 rounded-xl text-xs text-[#3D271B] font-semibold focus:outline-none"
          >
            <option value="All">All Inquiries</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Inquiries List Component */}
        <div className="lg:col-span-2 space-y-4">
          {filteredInquiries.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-[#E6CCB2]/30 text-center space-y-4 shadow-xs">
              <div className="mx-auto w-16 h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#DFA250] border border-[#E6CCB2]/25">
                <MessageSquare size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#3D271B]">No Inquiries Found</h3>
                <p className="text-xs text-[#6E5A4F]">Try adjusting your search criteria.</p>
              </div>
            </div>
          ) : (
            <InquiryList 
              inquiries={filteredInquiries}
              selectedInquiryId={selectedInquiry?.id}
              onSelectInquiry={setSelectedInquiry}
            />
          )}
        </div>

        {/* Right: Selected Inquiry Detail Component (Desktop Only) */}
        <div className="hidden lg:block bg-white p-5 rounded-3xl border border-[#E6CCB2]/30 shadow-xs h-fit sticky top-6">
          <InquiryDetail 
            inquiry={selectedInquiry}
            onToggleStatus={handleToggleResolve}
            onDelete={handleDeleteInquiry}
          />
        </div>

      </div>

      {/* Mobile/Tablet Detail Overlay Modal */}
      <AnimatePresence>
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 lg:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-5 relative overflow-hidden text-left"
            >
              <button
                onClick={() => setSelectedInquiry(null)}
                className="absolute right-4 top-4 p-1.5 hover:bg-slate-100 rounded-full transition text-[#5C2A1A] z-10 cursor-pointer"
              >
                <X size={18} />
              </button>
              <div className="mt-4">
                <InquiryDetail 
                  inquiry={selectedInquiry}
                  onToggleStatus={handleToggleResolve}
                  onDelete={(id) => {
                    handleDeleteInquiry(id);
                    setSelectedInquiry(null);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminInquiries;
