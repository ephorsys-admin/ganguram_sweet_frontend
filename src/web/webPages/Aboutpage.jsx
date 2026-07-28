import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, Crown, Heart, Sparkles, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const heritageMilestones = [
    {
      year: "1914",
      title: "The Genesis in Kolkata",
      description: "Founded by royal halwais in the heart of Kolkata, pioneering traditional cottage cheese and saffron sweet recipes."
    },
    {
      year: "1950",
      title: "Palace Purveyors",
      description: "Appointed as official sweetmakers for grand royal weddings and state banquets across Eastern India."
    },
    {
      year: "1995",
      title: "Vedic Ghee Standardization",
      description: "Pioneered 100% pure A2 Vedic ghee processing to guarantee absolute purity in every batch."
    },
    {
      year: "2026",
      title: "Modern Royal Luxury",
      description: "Blending century-old heritage with modern aesthetic packaging, serving over 5 lakh+ patrons worldwide."
    }
  ];

  return (
    <div className="w-full bg-[#FAF0E6] text-[#3D271B] min-h-screen pt-28 pb-20 relative overflow-hidden font-sans">
      
      {/* Background Indian Temple Spire & Scrollwork Vector Artwork */}
      <svg viewBox="0 0 400 500" className="absolute right-0 top-20 h-full w-auto max-w-[320px] opacity-15 pointer-events-none stroke-[#a65827] fill-none" strokeWidth="1.2">
        <path d="M 200 30 L 250 45 L 200 60 Z" fill="#a65827" fillOpacity="0.2" />
        <circle cx="200" cy="100" r="14" strokeWidth="1.8" />
        <ellipse cx="200" cy="125" rx="22" ry="10" strokeWidth="1.8" />
        <path d="M 160 145 C 160 220 150 300 130 380 L 270 380 C 250 300 240 220 240 145 Z" strokeWidth="1.6" />
        <path d="M 120 380 L 280 380 L 280 480 L 120 480 Z" strokeWidth="1.8" />
      </svg>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* HERO BANNER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
        >
          <span className="text-xs font-serif tracking-[0.35em] text-[#a65827] uppercase font-bold block mb-3">
            O U R &nbsp; H E R I T A G E &nbsp; & &nbsp; S O U L
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#3D271B] leading-tight">
            Centuries of Pure Sweetmaking Alchemy
          </h1>
          <div className="w-20 h-[2px] bg-[#a65827] mx-auto my-6" />
          <p className="text-[#3D271B]/80 text-base sm:text-lg leading-relaxed font-light">
            At Maharaja Ganguram Sweets, every confection is an ode to ancient royal kitchens. 
            We preserve century-old sweetmaking rituals using pure Vedic ghee, organic Kashmir saffron, and hand-selected Goan cashews.
          </p>
        </motion.div>

        {/* HERITAGE GRID SHOWCASE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 md:mb-28">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#FAF6F0] rounded-2xl p-8 border border-[#a65827]/15 shadow-md hover:shadow-xl transition-all duration-300 relative group overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#a65827]/10 flex items-center justify-center text-[#a65827] mb-6 group-hover:scale-110 transition-transform">
              <Crown className="w-7 h-7 stroke-[1.6]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#3D271B] mb-3">Royal Heritage</h3>
            <p className="text-[#3D271B]/75 text-sm leading-relaxed font-light">
              Inherited recipes passed down through generations of royal halwais, maintaining pristine authenticity.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-[#FAF6F0] rounded-2xl p-8 border border-[#a65827]/15 shadow-md hover:shadow-xl transition-all duration-300 relative group overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#a65827]/10 flex items-center justify-center text-[#a65827] mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7 stroke-[1.6]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#3D271B] mb-3">Purest Ingredients</h3>
            <p className="text-[#3D271B]/75 text-sm leading-relaxed font-light">
              No preservatives, artificial colors, or additives. Only 100% pure desi ghee, organic milk, and authentic spices.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#FAF6F0] rounded-2xl p-8 border border-[#a65827]/15 shadow-md hover:shadow-xl transition-all duration-300 relative group overflow-hidden"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#a65827]/10 flex items-center justify-center text-[#a65827] mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-7 h-7 stroke-[1.6]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#3D271B] mb-3">Crafted with Devotion</h3>
            <p className="text-[#3D271B]/75 text-sm leading-relaxed font-light">
              Every sphere of Rajbhog and diamond katli is hand-sculpted by master artisans dedicated to perfection.
            </p>
          </motion.div>
        </div>

        {/* TIMELINE SECTION */}
        <div className="bg-[#FAF6F0] rounded-3xl p-8 sm:p-12 border border-[#D4AF37]/35 shadow-xl relative overflow-hidden mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-serif tracking-[0.3em] text-[#a65827] uppercase font-bold block mb-2">
              H I S T O R I C A L &nbsp; T I M E L I N E
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3D271B]">
              A Legacy of Over a Century
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {heritageMilestones.map((item, idx) => (
              <div key={idx} className="border-l-2 border-[#a65827] pl-5 py-2">
                <span className="font-serif text-3xl font-bold text-[#a65827] block mb-2">{item.year}</span>
                <h4 className="font-serif text-lg font-semibold text-[#3D271B] mb-2">{item.title}</h4>
                <p className="text-xs text-[#3D271B]/75 leading-relaxed font-light">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA TO EXPLORE MENU */}
        <div className="text-center">
          <Link
            to="/menu"
            className="inline-flex items-center px-10 py-4.5 rounded-full bg-[#a65827] hover:bg-[#3D271B] text-[#FAF6F0] font-serif text-xs sm:text-sm tracking-[0.25em] uppercase font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl group border border-[#D4AF37]/30"
          >
            <span>DISCOVER THE ROYAL MENU</span>
            <ArrowRight className="w-4 h-4 ml-3 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}