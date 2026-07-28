import { useEffect } from "react";
import { motion } from "framer-motion";

const ForgotSuccessStep = ({ onTimeout }) => {
  useEffect(() => {
    const triggerTimeout = setTimeout(() => {
      onTimeout();
    }, 3500);
    return () => clearTimeout(triggerTimeout);
  }, [onTimeout]);

  return (
    <motion.div
      key="forgot-success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex-grow flex flex-col items-center justify-center py-6 text-center space-y-6"
    >
      {/* Self-drawing checkmark inside elegant glowing circle */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 10 }}
          className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500 shadow-md shadow-emerald-500/10"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-10 h-10"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </motion.div>
        
        {/* Ambient background particles */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute inset-0 rounded-full bg-emerald-400/25 blur-md -z-10"
        />
      </div>

      <div className="space-y-2 max-w-[280px]">
        <h3 className="text-xl font-serif font-bold text-[#3D271B]">Password Reset Successfully!</h3>
        <p className="text-xs text-[#3D271B]/60 leading-relaxed font-medium">
          Your admin security profile is now updated. You can use your new password immediately.
        </p>
      </div>

      {/* Timing Redirect Bar */}
      <div className="w-full max-w-[240px] pt-4 flex flex-col items-center space-y-2.5">
        <div className="w-full h-1 bg-[#3D271B]/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.2, ease: "linear" }}
            className="h-full bg-gradient-to-r from-[#B0652F] to-[#DFA250]"
          />
        </div>
        <p className="text-[10px] text-[#3D271B]/50 font-medium">
          Redirecting you back to login page...
        </p>
      </div>

      <div className="text-center text-[10px] text-[#3D271B]/40 font-mono pt-4">
        SECURE PROFILE RE-ESTABLISHED
      </div>
    </motion.div>
  );
};

export default ForgotSuccessStep;
