import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ChefHat,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Award
} from "lucide-react";
import LoginForm from "../admin-components/LoginForm";
import ForgotPasswordForm from "../admin-components/ForgotPasswordForm";

const AdminLogin = () => {
  const [cardState, setCardState] = useState("login"); // "login" | "forgot"

  return (
    <div className="min-h-screen w-screen flex bg-[#FAF6F0] overflow-hidden select-none font-sans">
      
      {/* LEFT SIDE PANEL: Ambient Brand Showcase (hidden on mobile) */}
      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen bg-[#3D271B] overflow-hidden flex-col justify-between p-12 z-10">
        
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -50, 40, 0],
              scale: [1, 1.2, 0.9, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#DFA250]/15 blur-[100px]"
          />
          <motion.div
            animate={{
              x: [0, -40, 30, 0],
              y: [0, 60, -30, 0],
              scale: [1, 0.9, 1.1, 1]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#B0652F]/20 blur-[120px]"
          />
          
          {/* Subtle Grid Pattern overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(var(--color-brand-accent) 1px, transparent 0px)`,
              backgroundSize: "24px 24px"
            }}
          />
        </div>

        {/* Top Branding Section */}
        <div className="relative flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#DFA250] to-[#B0652F] flex items-center justify-center shadow-lg shadow-[#3D271B]/50 border border-[#FAF6F0]/20">
            <Sparkles className="h-5 w-5 text-[#FAF6F0] animate-pulse" />
          </div>
          <div>
            <h2 className="text-[#FAF6F0] font-serif font-semibold tracking-wider text-lg">GANGURAM</h2>
            <p className="text-[#DFA250] text-[10px] uppercase tracking-[0.2em] font-semibold leading-none">Sweet Heritage</p>
          </div>
        </div>

        {/* Center Presentation: Interactive Dashboard Preview */}
        <div className="relative flex flex-col justify-center flex-grow py-12 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#DFA250]/10 border border-[#DFA250]/20 text-[#DFA250] text-xs font-medium">
              <Award className="h-3.5 w-3.5" />
              <span>Royal Portal Admin Control</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-[#FAF6F0] leading-tight font-medium">
              Oversee the Empire of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFA250] via-[#E6CCB2] to-[#DFA250] drop-shadow-sm font-bold">Royal Taste</span>.
            </h1>
            
            <p className="text-[#E6CCB2]/80 text-sm leading-relaxed">
              Log in to regulate production, manage sweet recipes, track logistics, and audit regional outlets across the imperial network.
            </p>
          </motion.div>

          {/* Floating statistics dashboard card previews */}
          <div className="mt-12 space-y-4">
            
            {/* Card 1: Revenue Stats */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="p-4 rounded-2xl bg-[#FAF6F0]/5 border border-[#FAF6F0]/10 backdrop-blur-md flex items-center justify-between shadow-lg cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-xl bg-[#DFA250]/15 border border-[#DFA250]/30 flex items-center justify-center text-[#DFA250]">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#E6CCB2]/60">Daily Revenue</p>
                  <p className="text-lg font-bold text-[#FAF6F0]">₹1,84,350</p>
                </div>
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" /> +14.2%
                </span>
                <span className="text-[10px] text-[#E6CCB2]/40">vs yesterday</span>
              </div>
            </motion.div>

            {/* Card 2: Kitchen State Stats */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
              className="p-4 rounded-2xl bg-[#FAF6F0]/5 border border-[#FAF6F0]/10 backdrop-blur-md flex items-center justify-between shadow-lg cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-xl bg-[#B0652F]/15 border border-[#B0652F]/30 flex items-center justify-center text-[#B0652F]">
                  <ChefHat className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#E6CCB2]/60">Kitchen Operations</p>
                  <p className="text-lg font-bold text-[#FAF6F0]">Active Preparation</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-[#DFA250]">12 Royal Batches</span>
                <p className="text-[10px] text-[#E6CCB2]/40">8 Master Chefs</p>
              </div>
            </motion.div>

            {/* Card 3: Dispatch Log */}
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="p-4 rounded-2xl bg-[#FAF6F0]/5 border border-[#FAF6F0]/10 backdrop-blur-md flex items-center justify-between shadow-lg cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-xl bg-[#E6CCB2]/10 border border-[#E6CCB2]/20 flex items-center justify-center text-[#E6CCB2]">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#E6CCB2]/60">Pending Dispatch</p>
                  <p className="text-lg font-bold text-[#FAF6F0]">48 Catering Orders</p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#B0652F]/20 text-[#DFA250] border border-[#B0652F]/30 animate-pulse">
                  5 Express
                </span>
                <p className="text-[10px] text-[#E6CCB2]/40 mt-1">Ready to ship</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="relative text-xs text-[#E6CCB2]/40 font-mono">
          <span>SECURE PROTOCOL V4.3.0 // SHIELD SECURED</span>
        </div>
      </div>

      {/* RIGHT SIDE PANEL: Main Form Area */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center px-4 md:px-8 relative bg-gradient-to-b from-[#FAF6F0] to-[#E6CCB2]/20 text-[#3D271B]">
        
        {/* Soft glowing circles on mobile/right view for aesthetic depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-[#DFA250]/5 blur-[80px]" />
          <div className="absolute bottom-[20%] left-[10%] w-[250px] h-[250px] rounded-full bg-[#B0652F]/5 blur-[70px]" />
        </div>

        {/* 3D Flip Card Container */}
        <div className="w-full max-w-md relative min-h-[580px] flex items-center justify-center [perspective:1000px]">
          
          <motion.div
            animate={{ rotateY: cardState === "login" ? 0 : 180 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
            className="w-full h-full relative"
          >
            
            {/* FRONT FACE: ADMIN LOGIN */}
            <div
              style={{ backfaceVisibility: "hidden" }}
              className="w-full bg-[#FAF6F0]/75 backdrop-blur-xl border border-[#E6CCB2]/40 shadow-2xl rounded-3xl p-8 md:p-10"
            >
              <LoginForm onForgotClick={() => setCardState("forgot")} />
            </div>

            {/* BACK FACE: PASSWORD RESET */}
            <div
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
              }}
              className="w-full absolute inset-0 bg-[#FAF6F0]/75 backdrop-blur-xl border border-[#E6CCB2]/40 shadow-2xl rounded-3xl p-8 md:p-10"
            >
              <ForgotPasswordForm
                onLoginClick={() => setCardState("login")}
                onResetSuccessComplete={() => setCardState("login")}
              />
            </div>
            
          </motion.div>
          
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;