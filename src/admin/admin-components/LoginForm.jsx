import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/features/auth/authThunk";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../context/ToastContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  RefreshCw,
  Sparkles,
  ShieldCheck
} from "lucide-react";

const LoginForm = ({ onForgotClick }) => {
  const { showToast } = useToast();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginLoading = useSelector((state) => state.auth.isLoading);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      setLoginError("Please enter a valid email address.");
      return;
    }

    try {
      const resultAction = await dispatch(
        loginUser({ email: loginEmail, password: loginPassword })
      );

      if (loginUser.fulfilled.match(resultAction)) {
        setLoginSuccess(true);
        showToast("Logged in successfully! Welcome to Maharaja Admin Portal.", "success");
        setTimeout(() => {
          setLoginSuccess(false);
          navigate("/admin/dashboard");
        }, 1000);
      } else {
        const errorMsg = resultAction.payload?.message || "Invalid credentials. Please try again.";
        setLoginError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (err) {
      const errorMsg = err?.message || "An unexpected error occurred. Please try again.";
      setLoginError(errorMsg);
      showToast(errorMsg, "error");
    }
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        {/* Mobile Header Logo */}
        <div className="flex lg:hidden items-center justify-center space-x-2 mb-6">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#DFA250] to-[#B0652F] flex items-center justify-center shadow-md">
            <Sparkles className="h-4 w-4 text-[#FAF6F0]" />
          </div>
          <span className="text-[#3D271B] font-serif font-bold text-base tracking-wider">GANGURAM</span>
        </div>

        <div className="text-center md:text-left mb-8">
          <h3 className="text-2xl font-serif font-bold text-[#3D271B]">Welcome Back</h3>
          <p className="text-xs text-[#3D271B]/60 mt-1.5 font-medium">Enter your credentials to enter the royal vault</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#3D271B]/70" htmlFor="email">
              Admin Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3D271B]/40 group-focus-within:text-[#B0652F] transition-colors">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                id="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@ganguramsweets.com"
                className="block w-full pl-10 pr-4 py-3 bg-[#FAF6F0]/90 border border-[#E6CCB2] rounded-xl text-sm text-[#3D271B] placeholder-[#3D271B]/35 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#B0652F]/20 focus:border-[#B0652F] transition-all"
                disabled={loginLoading || loginSuccess}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#3D271B]/70" htmlFor="password">
                Portal Password
              </label>
              <button
                type="button"
                onClick={onForgotClick}
                className="text-xs font-semibold text-[#B0652F] hover:text-[#DFA250] transition-colors bg-transparent border-none cursor-pointer"
                tabIndex={-1}
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3D271B]/40 group-focus-within:text-[#B0652F] transition-colors">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showLoginPassword ? "text" : "password"}
                id="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="block w-full pl-10 pr-10 py-3 bg-[#FAF6F0]/90 border border-[#E6CCB2] rounded-xl text-sm text-[#3D271B] placeholder-[#3D271B]/35 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#B0652F]/20 focus:border-[#B0652F] transition-all"
                disabled={loginLoading || loginSuccess}
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#3D271B]/40 hover:text-[#3D271B]/70 transition-colors bg-transparent border-none cursor-pointer"
              >
                {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error Prompt */}
          <AnimatePresence>
            {loginError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 flex items-start space-x-2"
              >
                <span className="font-semibold">Error:</span>
                <span>{loginError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loginLoading || loginSuccess}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#3D271B] to-[#B0652F] hover:from-[#B0652F] hover:to-[#DFA250] text-[#FAF6F0] rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-[#3D271B]/20 hover:shadow-xl hover:shadow-[#B0652F]/10 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loginLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Validating Credentials...</span>
              </>
            ) : loginSuccess ? (
              <>
                <Check className="h-4 w-4 text-emerald-400 stroke-[3]" />
                <span>Authentication Granted</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        {/* Additional Helper info */}
        <div className="mt-8 text-center text-xs text-[#3D271B]/55 font-medium flex items-center justify-center space-x-1.5 bg-[#E6CCB2]/10 py-2.5 rounded-xl border border-[#E6CCB2]/20">
          <ShieldCheck className="h-3.5 w-3.5 text-[#B0652F]" />
          <span>Authorized Personnel Only</span>
        </div>
      </div>

      {/* Copyright Info */}
      <div className="text-center text-[10px] text-[#3D271B]/40 font-mono mt-8">
        MAHARAJA GANGURAM SWEETS PORTAL
      </div>
    </div>
  );
};

export default LoginForm;
