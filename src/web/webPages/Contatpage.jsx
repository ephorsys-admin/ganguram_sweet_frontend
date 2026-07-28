import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="w-full bg-[#FAF0E6] text-[#3D271B] min-h-screen pt-28 pb-20 relative overflow-hidden font-sans">
      
      {/* Background Heritage Artwork */}
      <svg viewBox="0 0 400 500" className="absolute left-0 bottom-0 h-full w-auto max-w-[280px] opacity-15 pointer-events-none stroke-[#a65827] fill-none" strokeWidth="1.2">
        <ellipse cx="200" cy="125" rx="22" ry="10" strokeWidth="1.8" />
        <ellipse cx="200" cy="145" rx="32" ry="12" strokeWidth="1.8" />
        <path d="M 160 145 C 160 220 150 300 130 380 L 270 380 C 250 300 240 220 240 145 Z" strokeWidth="1.6" />
        <path d="M 120 380 L 280 380 L 280 480 L 120 480 Z" strokeWidth="1.8" />
      </svg>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-serif tracking-[0.35em] text-[#a65827] uppercase font-bold block mb-3">
            R O Y A L &nbsp; C U S T O M E R &nbsp; C A R E
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#3D271B] leading-tight">
            Connect With Our Royal Kitchens
          </h1>
          <div className="w-20 h-[2px] bg-[#a65827] mx-auto my-6" />
          <p className="text-[#3D271B]/80 text-base sm:text-lg leading-relaxed font-light">
            Whether inquiring about corporate sweet boxes, royal wedding catering, or order expediting, 
            our customer care concierge is at your service.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* CONTACT INFO CARDS (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="bg-[#FAF6F0] rounded-2xl p-8 border border-[#a65827]/15 shadow-md flex items-start space-x-5">
              <div className="w-12 h-12 rounded-xl bg-[#a65827]/10 flex items-center justify-center text-[#a65827] shrink-0">
                <Phone className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#3D271B]">Phone & WhatsApp</h3>
                <p className="text-[#3D271B]/75 text-sm mt-1">+91 801 555 0199 / +91 33 2244 8899</p>
                <span className="text-xs text-[#a65827] font-medium block mt-2">Mon – Sat (9:00 AM – 8:00 PM IST)</span>
              </div>
            </div>

            <div className="bg-[#FAF6F0] rounded-2xl p-8 border border-[#a65827]/15 shadow-md flex items-start space-x-5">
              <div className="w-12 h-12 rounded-xl bg-[#a65827]/10 flex items-center justify-center text-[#a65827] shrink-0">
                <Mail className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#3D271B]">Email Concierge</h3>
                <p className="text-[#3D271B]/75 text-sm mt-1">hello@ganguram.in</p>
                <p className="text-[#3D271B]/75 text-sm">bulkorders@ganguram.in</p>
              </div>
            </div>

            <div className="bg-[#FAF6F0] rounded-2xl p-8 border border-[#a65827]/15 shadow-md flex items-start space-x-5">
              <div className="w-12 h-12 rounded-xl bg-[#a65827]/10 flex items-center justify-center text-[#a65827] shrink-0">
                <MapPin className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#3D271B]">Heritage Flagship Store</h3>
                <p className="text-[#3D271B]/75 text-sm mt-1">123 Royal Lane, Park Street Area, Kolkata, West Bengal 700001, India</p>
              </div>
            </div>
          </motion.div>

          {/* PARCHMENT FORM (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 bg-[#FAF6F0] rounded-3xl p-8 sm:p-10 border border-[#D4AF37]/35 shadow-xl relative"
          >
            <div className="flex items-center space-x-3 mb-6">
              <MessageSquare className="w-6 h-6 text-[#a65827]" />
              <h3 className="font-serif text-2xl font-bold text-[#3D271B]">Send a Message or Bulk Order Inquiry</h3>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-serif tracking-wider uppercase text-[#3D271B]/80 font-bold mb-2">Your Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Maharaja Customer"
                    className="w-full bg-[#FAF0E6] border border-[#a65827]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#a65827]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif tracking-wider uppercase text-[#3D271B]/80 font-bold mb-2">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@domain.com"
                    className="w-full bg-[#FAF0E6] border border-[#a65827]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#a65827]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif tracking-wider uppercase text-[#3D271B]/80 font-bold mb-2">Subject / Inquiry Type</label>
                <select className="w-full bg-[#FAF0E6] border border-[#a65827]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#a65827]">
                  <option>General Inquiry</option>
                  <option>Bulk Order / Wedding Catering</option>
                  <option>Corporate Festival Gifting</option>
                  <option>Expedite Order</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-serif tracking-wider uppercase text-[#3D271B]/80 font-bold mb-2">Message</label>
                <textarea 
                  rows={4}
                  placeholder="Share details about your order or request..."
                  className="w-full bg-[#FAF0E6] border border-[#a65827]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#a65827]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#a65827] hover:bg-[#3D271B] text-white font-serif text-xs tracking-[0.25em] uppercase font-bold transition-all duration-300 shadow-md flex items-center justify-center space-x-3 cursor-pointer"
              >
                <span>SUBMIT ENQUIRY</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>

        </div>

      </div>
    </div>
  );
}