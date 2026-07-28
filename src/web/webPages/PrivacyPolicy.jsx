import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ScrollText, Mail, Phone, MapPin, Eye } from "lucide-react";

// Custom theme-aligned legal shield icon
const PolicyShieldBlob = () => (
  <svg viewBox="0 0 220 220" className="w-full h-full drop-shadow-xl">
    <defs>
      <radialGradient id="policyShield" cx="40%" cy="30%" r="85%">
        <stop offset="0%" stopColor="#FFF3D6" />
        <stop offset="60%" stopColor="#F4D383" />
        <stop offset="100%" stopColor="#D9962E" />
      </radialGradient>
    </defs>
    <path
      d="M110,25 C155,25 190,40 190,40 C190,110 160,170 110,195 C60,170 30,110 30,40 C30,40 65,25 110,25 Z"
      fill="url(#policyShield)"
      stroke="#8A2E2E"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M110,40 L110,180"
      stroke="#8A2E2E"
      strokeWidth="1.5"
      strokeDasharray="4 4"
      opacity="0.6"
    />
    <path
      d="M60,80 L110,130 L160,80"
      stroke="#8A2E2E"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity="0.85"
    />
  </svg>
);

const SECTIONS = [
  { id: "intro", title: "1. Introduction" },
  { id: "collect", title: "2. Data We Collect" },
  { id: "use", title: "3. How We Use Data" },
  { id: "cookies", title: "4. Cookies Policy" },
  { id: "security", title: "5. Data Security" },
  { id: "contact", title: "6. Support & Contact" },
];

const PrivacyPolicy = () => {
  const [activeTab, setActiveTab] = useState("intro");

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
              Security & Loyalty
            </span>
            <h1
              className="mt-3 text-3xl font-bold leading-tight sm:text-5xl"
              style={{ color: "#3D1F12" }}
            >
              Privacy Policy
            </h1>
            <p className="mt-4 text-base sm:text-lg" style={{ color: "#5C3A24" }}>
              At Mithai Ghar, we value the trust you place in our family recipe legacy. Learn how we collect, store, and safeguard your personal details.
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
            <PolicyShieldBlob />
          </motion.div>
        </div>
      </section>

      {/* Content Container */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Sticky Sidebar Index Nav */}
          <div className="hidden lg:block lg:col-span-4 sticky top-28 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider pl-4" style={{ color: "#3D1F12" }}>
              Table of Contents
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
                Need Policy Inquiry?
              </h3>
              <p className="text-xs mb-3" style={{ color: "#7A5C4A" }}>
                If you have questions about data removal or cookie consent issues, reach out instantly.
              </p>
              <a
                href="mailto:privacy@mithaighar.com"
                className="text-xs font-bold underline transition hover:opacity-85"
                style={{ color: "#8A2E2E" }}
              >
                privacy@mithaighar.com
              </a>
            </div>
          </div>

          {/* Right Policy Document Pages */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-2xl border bg-white p-6 sm:p-10 shadow-sm" style={{ borderColor: "#F0E4CC" }}>
              
              {/* Introduction */}
              <div id="intro" className="scroll-mt-28 space-y-4 mb-10">
                <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "#FBF3E4" }}>
                  <ScrollText size={20} style={{ color: "#8A2E2E" }} />
                  <h2 className="text-xl font-bold font-serif" style={{ color: "#3D1F12" }}>
                    1. Introduction & Scope
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-slate-700" style={{ color: "#7A5C4A" }}>
                  Welcome to <strong>Mithai Ghar</strong> ("we," "our," "us"). We operate under strict digital compliance to make your online orders and browsing experiences safe. This privacy statement documents the procedures followed regarding collection of logs, order information, registration addresses, and cookies collected on our online domain site and applications.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  By interacting with public services, ordering traditional sweets, or submitting data entries on our contact loops, you implicitly agree to the guidelines specified in this privacy mandate.
                </p>
              </div>

              {/* Data We Collect */}
              <div id="collect" className="scroll-mt-28 space-y-4 mb-10">
                <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "#FBF3E4" }}>
                  <ShieldCheck size={20} style={{ color: "#8A2E2E" }} />
                  <h2 className="text-xl font-bold font-serif" style={{ color: "#3D1F12" }}>
                    2. Data We Collect
                  </h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  To process transactions and shipping logistics, we collect basic details you voluntarily communicate.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                  <div className="p-4 rounded-xl border" style={{ borderColor: "#FBF3E4", backgroundColor: "#FFFDF8" }}>
                    <h3 className="text-xs font-bold uppercase mb-1 tracking-wider" style={{ color: "#3D1F12" }}>
                      Explicit Parameters
                    </h3>
                    <ul className="list-disc pl-4 text-xs space-y-1" style={{ color: "#7A5C4A" }}>
                      <li>Full Name and prefix</li>
                      <li>Telephone numbers (Mobile/WhatsApp)</li>
                      <li>Electronic Mail addresses</li>
                      <li>Delivery shipping address, ZIP postal code</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl border" style={{ borderColor: "#FBF3E4", backgroundColor: "#FFFDF8" }}>
                    <h3 className="text-xs font-bold uppercase mb-1 tracking-wider" style={{ color: "#3D1F12" }}>
                      Implicit Parameters
                    </h3>
                    <ul className="list-disc pl-4 text-xs space-y-1" style={{ color: "#7A5C4A" }}>
                      <li>IP address configurations</li>
                      <li>Default browser type tags</li>
                      <li>Purchase invoice logs</li>
                      <li>Location data mappings (optional)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How We Use Data */}
              <div id="use" className="scroll-mt-28 space-y-4 mb-10">
                <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "#FBF3E4" }}>
                  <Eye size={20} style={{ color: "#8A2E2E" }} />
                  <h2 className="text-xl font-bold font-serif" style={{ color: "#3D1F12" }}>
                    3. How We Use Data
                  </h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  Your details are utilized to enhance product delivery, service standards, and target offerings:
                </p>
                <ul className="list-decimal pl-5 text-sm space-y-2.5" style={{ color: "#7A5C4A" }}>
                  <li>
                    <strong>Order Processing:</strong> Managing invoice creations, processing sweet preparation workflows, and delivering boxes via our shipping partners.
                  </li>
                  <li>
                    <strong>Notifications:</strong> Transmit details about shipment statuses, tracking changes, or sudden menu updates.
                  </li>
                  <li>
                    <strong>Customer Support:</strong> Managing inquiry responses submitted through our Contact Us interfaces.
                  </li>
                  <li>
                    <strong>Personalization:</strong> Recommending sweet categories (e.g. Traditional, Festive) based on your interest histories.
                  </li>
                </ul>
              </div>

              {/* Cookies Policy */}
              <div id="cookies" className="scroll-mt-28 space-y-4 mb-10">
                <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "#FBF3E4" }}>
                  <ScrollText size={20} style={{ color: "#8A2E2E" }} />
                  <h2 className="text-xl font-bold font-serif" style={{ color: "#3D1F12" }}>
                    4. Cookies & Trackers Policy
                  </h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  We leverage cookies (small files generated by browsers on devices) to keep track of user sessions and selections.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  These include **Session Cookies** (keeping items in your shopping bag while exploring categories) and **Analytical Logs** (mapping page hits to identify areas that need visual refinement). You have the ability to deny cookie installations within browser preference dashboards, though this may restrict cart checkout workflows.
                </p>
              </div>

              {/* Data Security */}
              <div id="security" className="scroll-mt-28 space-y-4 mb-10">
                <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "#FBF3E4" }}>
                  <ShieldCheck size={20} style={{ color: "#8A2E2E" }} />
                  <h2 className="text-xl font-bold font-serif" style={{ color: "#3D1F12" }}>
                    5. Data Security
                  </h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  Mithai Ghar utilizes high fidelity Secure Sockets Layer (SSL) encryption for processing transaction values. All payments are compiled underneath certified gateways. We never save raw Credit/Debit card numbers on our local databases.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  While no transmission channel online is fully bulletproof, we deploy regular security patches to avoid data leakages.
                </p>
              </div>

              {/* Support & Contact */}
              <div id="contact" className="scroll-mt-28 space-y-4">
                <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: "#FBF3E4" }}>
                  <Mail size={20} style={{ color: "#8A2E2E" }} />
                  <h2 className="text-xl font-bold font-serif" style={{ color: "#3D1F12" }}>
                    6. Grievance Redressal Coordinator
                  </h2>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                  If you wish to modify personal records or request deletion of data accounts, contact our compliance manager:
                </p>
                
                <div className="p-6 rounded-xl border grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mt-3 bg-[#FFFDF8]" style={{ borderColor: "#F0E4CC" }}>
                  <div className="flex gap-2">
                    <Mail size={15} style={{ color: "#8A2E2E" }} className="shrink-0" />
                    <div>
                      <strong className="block mb-0.5" style={{ color: "#3D1F12" }}>Email</strong>
                      <span style={{ color: "#7A5C4A" }}>privacy@mithaighar.com</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Phone size={15} style={{ color: "#8A2E2E" }} className="shrink-0" />
                    <div>
                      <strong className="block mb-0.5" style={{ color: "#3D1F12" }}>Compliance Direct</strong>
                      <span style={{ color: "#7A5C4A" }}>+91 674 9876543 (Ext. 09)</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <MapPin size={15} style={{ color: "#8A2E2E" }} className="shrink-0" />
                    <div>
                      <strong className="block mb-0.5" style={{ color: "#3D1F12" }}>Address</strong>
                      <span style={{ color: "#7A5C4A" }}>Mithai Ghar HQ, Bhubaneswar</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
