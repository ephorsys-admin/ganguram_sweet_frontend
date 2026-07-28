import { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPasswordUser } from "../../redux/features/auth/authThunk";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";

const ForgotEmailStep = ({ onBackClick, onEmailSubmitted }) => {
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState("");
  const [forgotEmailLoading, setForgotEmailLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setForgotEmailError("");

    if (!forgotEmail) {
      setForgotEmailError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      setForgotEmailError("Please enter a valid email address.");
      return;
    }

    setForgotEmailLoading(true);
    try {
      const resultAction = await dispatch(forgotPasswordUser({ email: forgotEmail }));
      setForgotEmailLoading(false);

      if (forgotPasswordUser.fulfilled.match(resultAction)) {
        onEmailSubmitted(forgotEmail);
      } else {
        setForgotEmailError(
          resultAction.payload?.message || "Failed to send OTP. Please check the email."
        );
      }
    } catch (err) {
      setForgotEmailLoading(false);
      setForgotEmailError(err?.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 15 }}
      transition={{ duration: 0.25 }}
      className="flex-grow flex flex-col justify-between"
    >
      <div>
        {/* Return link */}
        <button
          type="button"
          onClick={onBackClick}
          className="inline-flex items-center text-xs font-semibold text-[#B0652F] hover:text-[#DFA250] transition-colors mb-6 bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          <span>Return to Login</span>
        </button>

        <div className="mb-8">
          <h3 className="text-2xl font-serif font-bold text-[#3D271B]">Forgot Password?</h3>
          <p className="text-xs text-[#3D271B]/60 mt-1.5 font-medium leading-relaxed">
            Provide your admin email. If matched, a 6-digit OTP code will be sent to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#3D271B]/70" htmlFor="forgotEmail">
              Registered Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3D271B]/40 group-focus-within:text-[#B0652F] transition-colors">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                id="forgotEmail"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="admin@ganguramsweets.com"
                className="block w-full pl-10 pr-4 py-3 bg-[#FAF6F0]/90 border border-[#E6CCB2] rounded-xl text-sm text-[#3D271B] placeholder-[#3D271B]/35 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#B0652F]/20 focus:border-[#B0652F] transition-all"
                disabled={forgotEmailLoading}
              />
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {forgotEmailError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
              >
                <span className="font-semibold mr-1">Error:</span>
                <span>{forgotEmailError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Send Button */}
          <button
            type="submit"
            disabled={forgotEmailLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#3D271B] to-[#B0652F] hover:from-[#B0652F] hover:to-[#DFA250] text-[#FAF6F0] rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-[#3D271B]/20 hover:shadow-xl hover:shadow-[#B0652F]/10 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {forgotEmailLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Sending Security OTP...</span>
              </>
            ) : (
              <span>Send OTP Verification Code</span>
            )}
          </button>
        </form>
      </div>

      <div className="text-center text-[10px] text-[#3D271B]/40 font-mono mt-8">
        STAGE 1 // ACCESS RECOVERY SYSTEM
      </div>
    </motion.div>
  );
};

export default ForgotEmailStep;
