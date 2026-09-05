import { useState } from "react";
import { motion } from "framer-motion";
import { ScrollText, BookOpen, Clock, AlertTriangle, Scale, Shield } from "lucide-react";

// Custom theme-aligned scroll SVG
const PolicyScrollBlob = () => (
  <svg viewBox="0 0 220 220" className="w-full h-full drop-shadow-xl">
    <defs>
      <radialGradient id="policyScrollGrad" cx="35%" cy="30%" r="85%">
        <stop offset="0%" stopColor="#FFF3D6" />
        <stop offset="60%" stopColor="#F4D383" />
        <stop offset="100%" stopColor="#D9962E" />
      </radialGradient>
    </defs>
    <circle cx="110" cy="115" r="85" fill="url(#policyScrollGrad)" />
    
    {/* Scroll outer roll */}
    <path
      d="M75,65 H145 C150,65 155,70 155,75 V140 C155,145 150,150 145,150 H75 C70,150 65,145 65,140 V75 C65,70 70,65 75,65 Z"
      fill="#FFFDF8"
      stroke="#8A2E2E"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Inner scrollwork lines */}
    <line x1="85" y1="85" x2="135" y2="85" stroke="#3D1F12" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <line x1="85" y1="102" x2="135" y2="102" stroke="#3D1F12" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <line x1="85" y1="119" x2="135" y2="119" stroke="#3D1F12" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <line x1="85" y1="134" x2="115" y2="134" stroke="#3D1F12" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

    {/* Elegant quill decoration next to scroll */}
    <path
      d="M150,50 C155,70 140,110 135,120 L130,125 L132,115 C138,105 142,75 145,55 Z"
      fill="#8A2E2E"
      opacity="0.9"
    />
  </svg>
);

const SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "ordering", title: "2. Orders & Payments" },
  { id: "shipping", title: "3. Perishables & Returns" },
  { id: "proprietary", title: "4. Intellectual Property" },
  { id: "membership", title: "5. Membership Accounts" },
  { id: "disputes", title: "6. Liability & Jurisdiction" },
];

const TermsOfService = () => {
  const [activeTab, setActiveTab] = useState("acceptance");

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full" style={{ backgroundColor: "#FFFDF8" }}>
      
      {/* Hero Section - Matching AboutUs.jsx exactly */}
      <section
        className="w-full"
        style={{ background: "linear-gradient(160deg,#FFF3D6,#F6D989)" }}
      >
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-8 px-4 py-14 sm:px-6 md:flex-row md:justify-between md:py-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl text-center md:text-left"
          >
            <span
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "#8A2E2E" }}
            >
              Heritage Guidelines
            </span>
            <h1
              className="mt-3 text-3xl font-bold leading-tight sm:text-5xl"
              style={{ color: "#3D1F12" }}
            >
              Terms of Service
            </h1>
            <p className="mt-4 text-base sm:text-lg" style={{ color: "#5C3A24" }}>
              Please review the general terms, conditions, and shipping policies that govern purchases and interactions with the Mithai Ghar brand.
            </p>
            <div className="mt-6 text-xs font-semibold" style={{ color: "#8A2E2E" }}>
              Last Updated: July 28, 2026
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="shrink-0 drop-shadow-2xl w-40 h-40 md:w-56 md:h-56"
          >
            <PolicyScrollBlob />
          </motion.div>
        </div>
      </section>

      {/* Content Container */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Sticky Sidebar Index Nav */}
          <div className="hidden lg:block lg:col-span-4 sticky top-28 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider pl-4" style={{ color: "#3D1F12" }}>
              Sections
            </h2>
            <div className="flex flex-col border-l-2" style={{ borderColor: "#FBF3E4" }}>
              {SECTIONS.map((sec) => {
                const isActive = activeTab === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className="text-left py-3 px-4 text-sm font-semibold transition-all select-none border-l-2 -ml-[2px] cursor-pointer"
                    style={{
                      borderColor: isActive ? "#8A2E2E" : "transparent",
                      color: isActive ? "#8A2E2E" : "#7A5C4A",
                    }}
                  >
                    {sec.title}
                  </button>
                );
              })}
            </div>
            
            <div className="p-5 rounded-2xl border mt-8 bg-white" style={{ borderColor: "#F0E4CC" }}>
              <h3 className="text-sm font-bold font-serif mb-2" style={{ color: "#3D1F12" }}>
                Acceptance Check
              </h3>
              <p className="text-xs mb-3" style={{ color: "#7A5C4A" }}>
                By checking out or buying bulk orders, you implicitly sign and accept the liability rules discussed in section 3.
              </p>
            </div>
          </div>

          {/* Right Terms Document Pages */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-2xl border bg-white p-6 sm:p-10 shadow-sm" style={{ borderColor: "#F0E4CC" }}>
              
              {/* Acceptance of Terms */}
              <div id="acceptance" className="scroll-mt-28 space-y-4 mb-10">
                <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "#FBF3E4" }}>
                  <BookOpen size={20} style={{ color: "#8A2E2E" }} />
                  <h2 className="text-xl font-bold font-serif" style={{ color: "#3D1F12" }}>
                    1. Acceptance of Terms & Conditions
                  </h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  These Terms of Service formulate articles of agreement governing access and interactions with <strong>Mithai Ghar</strong> portals and physical lounges. By exploring, accessing, or placing retail checkout transactions, you represent that you are at least 18 years old and agree to these terms.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  If you disagree with any portion of these conditions, please discontinue use of online shipping items and service loops.
                </p>
              </div>

              {/* Ordering and Payments */}
              <div id="ordering" className="scroll-mt-28 space-y-4 mb-10">
                <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "#FBF3E4" }}>
                  <Clock size={20} style={{ color: "#8A2E2E" }} />
                  <h2 className="text-xl font-bold font-serif" style={{ color: "#3D1F12" }}>
                    2. Order Placement & Price Mappings
                  </h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  All sweets listings are subject to chef availability. Large bulk requests or party caterings must be reserved at least **72 hours in advance** with a minimum **50% deposit payment**.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  Prices listed are in Indian Rupees (INR) and include GST unless specified otherwise. We reserve the rights to alter sweet rates due to raw cow milk, pure ghee market pricing fluctuations without warnings.
                </p>
              </div>

              {/* Perishables and Returns (CRITICAL SECTION FOR FOOD WEBSITES) */}
              <div id="shipping" className="scroll-mt-28 space-y-4 mb-10">
                <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "#FBF3E4" }}>
                  <AlertTriangle size={20} style={{ color: "#8A2E2E" }} />
                  <h2 className="text-xl font-bold font-serif" style={{ color: "#3D1F12" }}>
                    3. Perishable Food Liabilities & Refunds
                  </h2>
                </div>
                <div className="p-4 rounded-xl border border-red-200/50 mb-3 bg-red-50/20">
                  <h4 className="text-xs font-bold text-red-800 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <AlertTriangle size={13} /> Return Exemption Notice
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: "#7A5C4A" }}>
                    Please note that due to strict food safety guidelines, traditional Indian sweets are classified as highly perishable. We DO NOT accept returns or exchanges once dispatch or packaging occurs.
                  </p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  In cases where you receive a damaged box or spoiled sweets, you must notify our service lounge via email within **4 hours of delivery** with photographic evidence. Valid complaints will be compensated via replacement delivery or shopping vouchers. Refund transfers are not provided.
                </p>
              </div>

              {/* Intellectual Property */}
              <div id="proprietary" className="scroll-mt-28 space-y-4 mb-10">
                <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "#FBF3E4" }}>
                  <ScrollText size={20} style={{ color: "#8A2E2E" }} />
                  <h2 className="text-xl font-bold font-serif" style={{ color: "#3D1F12" }}>
                    4. Brand Recipes & Intellectual Property
                  </h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  All visual graphics, illustrations, site design, text content, menus, and brand recipe descriptions displayed on Mithai Ghar sites are registered trademarks. 
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  No customer has authorization to reproduce, copy, or distribute recipe descriptions or layout configurations for commercial gains without formal letters from our management.
                </p>
              </div>

              {/* Membership Accounts */}
              <div id="membership" className="scroll-mt-28 space-y-4 mb-10">
                <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "#FBF3E4" }}>
                  <Shield size={20} style={{ color: "#8A2E2E" }} />
                  <h2 className="text-xl font-bold font-serif" style={{ color: "#3D1F12" }}>
                    5. Loyalty Membership Accounts
                  </h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  Registered Sweet Club members must maintain credential security. You are responsible for all actions processed under your login codes. If you detect unauthorized entry access, notify us instantly. We reserve the rights to ban accounts that engage in spam reviews or credit hacks.
                </p>
              </div>

              {/* Liability & Jurisdiction */}
              <div id="disputes" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "#FBF3E4" }}>
                  <Scale size={20} style={{ color: "#8A2E2E" }} />
                  <h2 className="text-xl font-bold font-serif" style={{ color: "#3D1F12" }}>
                    6. Liability Caps & Dispute Juridictions
                  </h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  Mithai Ghar represents that sweets are prepared following stringent sanitary constraints. However, consumers are fully responsible for checking ingredient warnings (such as cashews, wheat gluten, lactose dairy products) for potential allergen factors. We are not liable for health issues arising from pre-existing food allergies.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  Any legal claims or debates relating to purchases on this domain are governed under local state courts situated in Bhubaneswar, Odisha, India.
                </p>
              </div>

            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
