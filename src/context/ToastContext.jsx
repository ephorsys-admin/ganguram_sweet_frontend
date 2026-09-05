import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Automatically dismiss after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 left-5 md:left-auto z-[9999] pointer-events-none flex flex-col gap-3 max-w-md md:max-w-sm font-sans mx-auto md:mx-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl border shadow-lg ${
                t.type === "success"
                  ? "bg-emerald-600 border-emerald-500 text-white shadow-emerald-950/10"
                  : t.type === "error"
                  ? "bg-rose-600 border-rose-500 text-white shadow-rose-950/10"
                  : "bg-[#a65827] border-[#8e451b] text-white shadow-amber-950/10"
              }`}
            >
              <div className="flex items-center gap-3">
                {t.type === "success" && <CheckCircle2 className="h-5 w-5 text-white shrink-0" />}
                {t.type === "error" && <AlertCircle className="h-5 w-5 text-white shrink-0" />}
                {t.type === "info" && <Info className="h-5 w-5 text-white shrink-0" />}
                <p className="text-xs font-semibold leading-relaxed">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="ml-4 p-1 hover:bg-white/15 rounded-full transition text-white/80 hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
