import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Compass } from "lucide-react";
import { MaharajaCrown } from "@/admin/admin-components/SweetIcons";
import LoginForm from "../admin-components/LoginForm";
import ForgotPasswordForm from "../admin-components/ForgotPasswordForm";

const AdminLogin = () => {
  const [cardState, setCardState] = useState("login"); // "login" | "forgot"

  return (
    <div className="min-h-screen w-screen flex bg-[#FAF6F0] overflow-hidden select-none font-sans">
      
      {/* LEFT SIDE PANEL: Modern Luxury Sweet Shop Showcase (hidden on mobile) */}
      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen overflow-hidden flex-col justify-between p-12 z-10 border-r border-[#E6CCB2]/20">
        
        {/* Full Sweet Shop Background Image with Dark Contrast Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
          style={{ 
            backgroundImage: `url('/footer-bg.jpg')`,
            filter: "brightness(0.35) contrast(1.15) saturate(0.9)" 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B1B12]/80 via-transparent to-[#2B1B12]/50 pointer-events-none" />

        {/* Top Branding Section */}
        <div className="relative flex items-center space-x-3.5 z-10">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#DFA250] to-[#B0652F] flex items-center justify-center shadow-xl shadow-black/30 border border-[#FAF6F0]/20">
            <MaharajaCrown className="h-8 w-8 filter drop-shadow" />
          </div>
          <div>
            <h2 className="text-[#FAF6F0] font-serif font-semibold tracking-wider text-2xl">GANGURAM</h2>
            <p className="text-[#DFA250] text-[10px] uppercase tracking-[0.3em] font-semibold leading-none mt-0.5">Sweet Heritage</p>
          </div>
        </div>

        {/* Center Presentation: Modern Sweet Shop Presentation */}
        <div className="relative flex flex-col justify-center flex-grow py-12 max-w-lg z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#DFA250]/15 border border-[#DFA250]/30 text-[#DFA250] text-xs font-semibold tracking-wide backdrop-blur-md">
              <Compass className="h-3.5 w-3.5" />
              <span>Imperial Sweet Boutique Operations</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-[#FAF6F0] leading-tight font-medium drop-shadow-md">
              Savor the Legacy of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFA250] via-[#E6CCB2] to-[#DFA250] drop-shadow-sm font-bold">Royal Taste</span>.
            </h1>
            
            <p className="text-[#E6CCB2]/90 text-sm leading-relaxed drop-shadow">
              Orchestrate the creation of Bengal's finest heritage confections. Oversee artisanal kitchen batches, monitor fresh production lines, and dispatch luxury sweet hampers across the empire.
            </p>
          </motion.div>
        </div>

        {/* Bottom Metadata */}
        <div className="relative text-xs text-[#E6CCB2]/50 font-mono flex justify-between items-center z-10 drop-shadow">
          <span>SECURE ROYAL PORTAL V4.4 // SSL ENCRYPTED</span>
          <span className="text-[10px] text-[#DFA250]/50">© MAHARAJA GANGURAM</span>
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