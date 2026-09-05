import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw, Check, KeyRound, Eye, EyeOff, Lock } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  verifyForgotOtpUser,
  resetPasswordUser,
  forgotPasswordUser
} from "../../redux/features/auth/authThunk";

const ForgotResetStep = ({ email, onBackClick, onResetComplete }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [timer, setTimer] = useState(59);
  const [timerActive, setTimerActive] = useState(true);

  const otpRefs = useRef([]);
  const dispatch = useDispatch();

  // Auto-focus OTP inputs timer helper
  useEffect(() => {
    let interval = null;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  // Focus on first input on mount
  useEffect(() => {
    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 100);
  }, []);

  const handleOtpChange = (index, value) => {
    if (value && isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setOtpError("");
    try {
      const resultAction = await dispatch(forgotPasswordUser({ email }));
      if (forgotPasswordUser.fulfilled.match(resultAction)) {
        setTimer(59);
        setTimerActive(true);
        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 50);
      } else {
        setOtpError(resultAction.payload?.message || "Failed to resend OTP.");
      }
    } catch (err) {
      setOtpError(err?.message || "Failed to resend OTP.");
    }
  };

  // Password Complexity Validation
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword);
  const hasUpperCase = /[A-Z]/.test(newPassword);

  const getPasswordStrength = () => {
    let score = 0;
    if (newPassword.length > 0) score++;
    if (hasMinLength) score++;
    if (hasNumber && hasUpperCase) score++;
    if (hasSpecialChar) score++;
    return score;
  };

  const strengthScore = getPasswordStrength();
  const strengthLabels = ["Weak", "Fair", "Strong", "Royal Strength!"];
  const strengthColors = ["bg-red-500", "bg-yellow-500", "bg-teal-500", "bg-[#B0652F]"];

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setOtpError("");
    setPasswordError("");

    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setOtpError("Please enter the complete 6-digit OTP code.");
      return;
    }

    if (!newPassword) {
      setPasswordError("Please enter a new password.");
      return;
    }

    if (strengthScore < 3) {
      setPasswordError("Password must meet strength guidelines.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setResetLoading(true);

    try {
      // 1. Verify OTP first
      const verifyResult = await dispatch(verifyForgotOtpUser({ email, otp: fullOtp }));
      if (!verifyForgotOtpUser.fulfilled.match(verifyResult)) {
        throw new Error(verifyResult.payload?.message || "Invalid OTP code.");
      }

      // 2. If OTP matches, reset the password
      const resetResult = await dispatch(
        resetPasswordUser({
          email,
          newPassword,
          confirmPassword
        })
      );
      if (!resetPasswordUser.fulfilled.match(resetResult)) {
        throw new Error(resetResult.payload?.message || "Failed to reset password.");
      }

      setResetLoading(false);
      onResetComplete();
    } catch (err) {
      setResetLoading(false);
      const errorMsg = err?.message || "An error occurred. Please try again.";
      if (errorMsg.toLowerCase().includes("otp")) {
        setOtpError(errorMsg);
      } else {
        setPasswordError(errorMsg);
      }
    }
  };

  return (
    <motion.div
      key="forgot-otp"
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 15 }}
      transition={{ duration: 0.25 }}
      className="flex-grow flex flex-col justify-between"
    >
      <div>
        {/* Back button */}
        <button
          type="button"
          onClick={onBackClick}
          className="inline-flex items-center text-xs font-semibold text-[#B0652F] hover:text-[#DFA250] transition-colors mb-4 bg-transparent border-none cursor-pointer"
          disabled={resetLoading}
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          <span>Back to Email Step</span>
        </button>

        <div className="mb-5">
          <h3 className="text-xl font-serif font-bold text-[#3D271B]">Enter OTP & Reset</h3>
          <p className="text-xs text-[#3D271B]/60 mt-1 font-medium leading-relaxed">
            We sent a 6-digit verification code to <span className="text-[#3D271B] font-semibold">{email}</span>
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          
          {/* OTP Code Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#3D271B]/70 block">
              6-Digit Verification Code
            </label>
            <div className="flex justify-between gap-1.5" onPaste={handleOtpPaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-11 text-center bg-[#FAF6F0]/90 border border-[#E6CCB2] rounded-xl text-lg font-bold text-[#3D271B] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#B0652F]/30 focus:border-[#B0652F] transition-all"
                  disabled={resetLoading}
                />
              ))}
            </div>
            
            {/* OTP Alert Feedback & Resend trigger */}
            <div className="flex justify-between items-center pt-1 min-h-[20px]">
              {otpError ? (
                <p className="text-[10px] font-semibold text-red-600">{otpError}</p>
              ) : timerActive ? (
                <p className="text-[10px] text-[#3D271B]/60 flex items-center font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse mr-1" />
                  Resend code in <strong className="ml-1 text-[#3D271B]">{timer}s</strong>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[10px] font-bold text-[#B0652F] hover:text-[#DFA250] flex items-center gap-0.5 transition-colors bg-transparent border-none cursor-pointer"
                >
                  <RefreshCw className="h-2.5 w-2.5" /> Resend Verification Code
                </button>
              )}
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#3D271B]/70" htmlFor="newPassword">
              Create New Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3D271B]/40 group-focus-within:text-[#B0652F] transition-colors">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="block w-full pl-10 pr-10 py-2.5 bg-[#FAF6F0]/90 border border-[#E6CCB2] rounded-xl text-xs text-[#3D271B] placeholder-[#3D271B]/35 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#B0652F]/20 focus:border-[#B0652F] transition-all"
                disabled={resetLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#3D271B]/40 hover:text-[#3D271B]/70 transition-colors bg-transparent border-none cursor-pointer"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Strength criteria visual check */}
          {newPassword && (
            <div className="p-2.5 bg-[#E6CCB2]/15 border border-[#E6CCB2]/20 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-[#3D271B]/70">Password Strength:</span>
                <span className="text-[9px] font-bold text-[#3D271B]">{strengthLabels[strengthScore - 1] || "Invalid"}</span>
              </div>
              
              <div className="h-1.5 w-full bg-[#3D271B]/10 rounded-full overflow-hidden flex gap-0.5">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-full flex-grow transition-all duration-300 ${
                      idx < strengthScore ? strengthColors[strengthScore - 1] : "bg-[#3D271B]/5"
                    }`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-0.5">
                <span className={`text-[8.5px] font-semibold flex items-center gap-1 ${hasMinLength ? "text-emerald-600" : "text-[#3D271B]/50"}`}>
                  <Check className={`h-2.5 w-2.5 ${hasMinLength ? "stroke-[3.5]" : "opacity-40"}`} /> Min 8 characters
                </span>
                <span className={`text-[8.5px] font-semibold flex items-center gap-1 ${hasNumber ? "text-emerald-600" : "text-[#3D271B]/50"}`}>
                  <Check className={`h-2.5 w-2.5 ${hasNumber ? "stroke-[3.5]" : "opacity-40"}`} /> Contains a number
                </span>
                <span className={`text-[8.5px] font-semibold flex items-center gap-1 ${hasUpperCase ? "text-emerald-600" : "text-[#3D271B]/50"}`}>
                  <Check className={`h-2.5 w-2.5 ${hasUpperCase ? "stroke-[3.5]" : "opacity-40"}`} /> Contains UPPERCASE
                </span>
                <span className={`text-[8.5px] font-semibold flex items-center gap-1 ${hasSpecialChar ? "text-emerald-600" : "text-[#3D271B]/50"}`}>
                  <Check className={`h-2.5 w-2.5 ${hasSpecialChar ? "stroke-[3.5]" : "opacity-40"}`} /> Special char (!@#...)
                </span>
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#3D271B]/70" htmlFor="confirmPassword">
              Confirm Portal Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3D271B]/40 group-focus-within:text-[#B0652F] transition-colors">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="block w-full pl-10 pr-10 py-2.5 bg-[#FAF6F0]/90 border border-[#E6CCB2] rounded-xl text-xs text-[#3D271B] placeholder-[#3D271B]/35 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#B0652F]/20 focus:border-[#B0652F] transition-all"
                disabled={resetLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#3D271B]/40 hover:text-[#3D271B]/70 transition-colors bg-transparent border-none cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Errors */}
          <AnimatePresence>
            {passwordError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[10px] text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200"
              >
                <span className="font-semibold">Error:</span> {passwordError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Trigger */}
          <button
            type="submit"
            disabled={resetLoading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#3D271B] to-[#B0652F] hover:from-[#B0652F] hover:to-[#DFA250] text-[#FAF6F0] rounded-xl text-xs font-semibold tracking-wide shadow-lg shadow-[#3D271B]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {resetLoading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Saving Portal Settings...</span>
              </>
            ) : (
              <span>Reset & Update Password</span>
            )}
          </button>
        </form>
      </div>

      <div className="text-center text-[10px] text-[#3D271B]/40 font-mono mt-4">
        STAGE 2 // CREDENTIAL UPDATOR
      </div>
    </motion.div>
  );
};

export default ForgotResetStep;
