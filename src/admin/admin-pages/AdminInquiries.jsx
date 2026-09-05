import { useState, useEffect } from "react";
import { MessageSquare, Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InquiryList from "../admin-components/InquiryList";
import InquiryDetail from "../admin-components/InquiryDetail";
import { useToast } from "../../context/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { getAllContacts, updateContactStatus, deleteContact } from "../../redux/features/contact/contactThunk";
import DeleteConfirmationModal from "../admin-components/Product/DeleteConfirmationModal";

const AdminInquiries = () => {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  
  const { contacts: inquiries = [], isLoading } = useSelector((state) => state.contact);

  useEffect(() => {
    dispatch(getAllContacts());
  }, [dispatch]);

  // Filters State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Selected Inquiry for viewing details
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);

  const handleToggleResolve = async (id) => {
    const target = inquiries.find(inq => inq._id === id);
    if (!target) return;
    
    const nextStatus = target.status === "Pending" ? "Resolved" : "Pending";
    
    try {
      const resultAction = await dispatch(updateContactStatus({ contactId: id, status: nextStatus })).unwrap();
      if (resultAction.success) {
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry({
            ...selectedInquiry,
            status: nextStatus
          });
        }
        showToast(`Inquiry marked as ${nextStatus}!`, "success");
      }
    } catch (err) {
      showToast(err.message || "Failed to update inquiry status", "error");
    }
  };

  const handleDeleteInquiry = (id) => {
    setInquiryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!inquiryToDelete) return;
    try {
      const resultAction = await dispatch(deleteContact(inquiryToDelete)).unwrap();
      if (resultAction.success) {
        setSelectedInquiry(null);
        showToast("Inquiry record deleted successfully.", "info");
      }
    } catch (err) {
      showToast(err.message || "Failed to delete inquiry", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setInquiryToDelete(null);
    }
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = inq.name?.toLowerCase().includes(search.toLowerCase()) || 
                          inq.email?.toLowerCase().includes(search.toLowerCase()) || 
                          inq.reason?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || inq.status === statusFilter;
    // Don't show deleted ones
    const notDeleted = !inq.isDeleted;
    return matchesSearch && matchesStatus && notDeleted;
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
              selectedInquiryId={selectedInquiry?._id}
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setInquiryToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Inquiry"
        message="Are you sure you want to delete this inquiry record? This action cannot be undone."
      />
    </div>
  );
};

export default AdminInquiries;
