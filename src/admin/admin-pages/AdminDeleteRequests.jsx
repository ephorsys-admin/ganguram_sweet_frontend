import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  AlertTriangle, 
  Calendar, 
  ArrowLeft, 
  MessageSquare,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllDeleteRequests, approveDeleteRequest, rejectDeleteRequest } from "../../redux/features/order/orderThunk";
import { useToast } from "../../context/ToastContext";

const AdminDeleteRequests = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { deleteRequests = [], isLoading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllDeleteRequests());
  }, [dispatch]);

  const handleApprove = async (requestId) => {
    if (!window.confirm("Are you sure you want to approve this delete request? This will permanently delete the order.")) {
      return;
    }
    try {
      await dispatch(approveDeleteRequest(requestId)).unwrap();
      showToast("Delete request approved and order deleted successfully.", "success");
    } catch (err) {
      showToast(err.message || "Failed to approve request", "error");
    }
  };

  const handleReject = async (requestId) => {
    if (!window.confirm("Are you sure you want to reject this delete request?")) {
      return;
    }
    try {
      await dispatch(rejectDeleteRequest(requestId)).unwrap();
      showToast("Delete request rejected successfully.", "success");
    } catch (err) {
      showToast(err.message || "Failed to reject request", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3D271B] flex items-center gap-2">
            <Trash2 className="text-[#a65827] h-8 w-8" />
            Delete Requests
          </h1>
          <p className="text-xs text-[#6E5A4F] mt-1">
            Review and authorize order deletion requests submitted by store administrators.
          </p>
        </div>
        <Link 
          to="/admin/dashboard" 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E6CCB2]/30 rounded-xl text-xs font-bold text-[#6E5A4F] hover:bg-[#FAF6F0] transition"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-white p-16 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center min-h-[40vh] space-y-3">
          <Loader2 className="h-10 w-10 text-[#DFA250] animate-spin" />
          <span className="text-xs text-[#6E5A4F] font-semibold">Fetching deletion requests...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50/50 border border-red-200/50 p-6 rounded-2xl flex items-center gap-3 text-red-650">
          <AlertTriangle size={20} />
          <span className="text-xs font-semibold">{error}</span>
        </div>
      ) : deleteRequests.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-[#E6CCB2]/30 shadow-xs flex flex-col items-center justify-center min-h-[45vh] text-center space-y-4">
          <div className="w-16 h-16 bg-[#FAF6F0] rounded-full flex items-center justify-center text-[#DFA250]">
            <CheckCircle size={32} />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-sm font-extrabold text-[#3D271B]">No Pending Requests</h3>
            <p className="text-xs text-[#6E5A4F]">
              All deletion requests have been processed. Your dashboard is clean!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {deleteRequests.map((req) => (
              <motion.div
                key={req._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl border border-[#E6CCB2]/30 p-5 shadow-md flex flex-col justify-between hover:border-[#DFA250]/40 transition-colors"
              >
                <div className="space-y-4">
                  {/* Meta Header */}
                  <div className="flex justify-between items-start border-b border-[#FAF6F0] pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#a65827] tracking-wider bg-[#FAF0E6] px-2 py-0.5 rounded-md">
                        Order Request
                      </span>
                      <Link 
                        to={`/admin/orders/${req.itemId}`}
                        className="text-xs font-black text-[#3D271B] block mt-1.5 hover:text-[#DFA250] transition underline"
                      >
                        Order ID: {req.itemId}
                      </Link>
                    </div>
                    <div className="text-[10px] text-[#6E5A4F] font-mono flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="space-y-3.5 text-xs text-[#3D271B]">
                    <div className="flex items-start gap-2.5">
                      <User size={14} className="text-[#a65827] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-[#6E5A4F] block">Requested By</span>
                        <span className="font-semibold text-slate-800 break-all">
                          {req.requestedBy?.name || req.requestedBy?.email || "Unknown Admin"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 bg-[#FAF6F0]/65 p-3 rounded-xl border border-[#FAF6F0]">
                      <MessageSquare size={14} className="text-[#DFA250] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-[#6E5A4F] block">Deletion Reason</span>
                        <p className="font-medium text-slate-700 italic mt-0.5 leading-relaxed">
                          "{req.reason}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 border-t border-[#FAF6F0] pt-4 mt-4">
                  <button
                    onClick={() => handleReject(req._id)}
                    className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-650 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer text-xs shadow-xs"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                  <button
                    onClick={() => handleApprove(req._id)}
                    className="flex-1 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer text-xs shadow-xs"
                  >
                    <CheckCircle size={14} /> Approve Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminDeleteRequests;
