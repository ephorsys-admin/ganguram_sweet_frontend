import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
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
              className="absolute top-4 right-4 p-1 hover:bg-[#FAF6F0] text-[#6E5A4F] hover:text-[#3D271B] rounded-lg transition cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Logout Icon Banner */}
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-[#a65827] border border-[#E6CCB2]/30">
              <LogOut size={22} className="ml-0.5" />
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <h3 className="font-serif font-black text-base text-[#3D271B]">
                Confirm Logout
              </h3>
              <p className="text-xs text-[#6E5A4F] px-4 leading-relaxed">
                Are you sure you want to log out of the admin dashboard?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2 justify-center">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-[#FAF6F0] rounded-xl font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-5 py-2 bg-[#3D271B] hover:bg-[#a65827] text-white rounded-xl font-semibold shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LogoutConfirmationModal;
