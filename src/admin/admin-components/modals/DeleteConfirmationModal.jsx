import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white w-full max-w-sm rounded-3xl border border-[#E6CCB2]/40 shadow-2xl p-6 z-10 text-xs font-sans text-slate-800 text-center space-y-4"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 p-1 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-lg transition disabled:opacity-50 cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Warning Icon Banner */}
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-200/50">
              <AlertTriangle size={24} />
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <h3 className="font-serif font-black text-base text-[#3D271B]">
                {title || "Confirm Delete"}
              </h3>
              <p className="text-xs text-[#6E5A4F] px-2 leading-relaxed">
                {message || "Are you sure you want to delete this item? This action cannot be undone."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2 justify-center">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-[#FAF6F0] rounded-xl font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
