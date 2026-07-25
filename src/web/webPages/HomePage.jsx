import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";
import LinearCard from "@/components/ui/linear-card";

const HomePage = () => {
  // Array of high quality authentic Indian sweets background images for auto-transition slideshow
  const heroBackgroundImages = [
    {
      url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=2070&auto=format&fit=crop",
      title: "Royal Saffron Rajbhog",
    },
    {
      url: "https://images.unsplash.com/photo-1601356616077-695728ecf769?q=80&w=2070&auto=format&fit=crop",
      title: "Vedic Ghee Kaju Katli",
    },
    {
      url: "https://images.unsplash.com/photo-1605197397734-e431ea624b5a?q=80&w=2070&auto=format&fit=crop",
      title: "Gold Motichoor Laddu",
    },
    {
      url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2070&auto=format&fit=crop",
      title: "Heritage Mithai Platter",
    },
  ];

  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Auto transition hero background images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % heroBackgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroBackgroundImages.length]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Sweets data for Maharaja Collection
  const sweetCollection = [
    {
      id: 1,
      name: "Classic Saffron Rajbhog",
      category: "Signature Bengali Sweets",
      origin: "Kolkata, West Bengal",
      description: "Hand-crafted cottage cheese spheres steeped in royal saffron & cardamom syrup.",
      price: "₹450 / 500g",
      badge: "ROYAL SIGNATURE",
      image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop",
      isCart: true,
    },
    {
      id: 2,
      name: "Vedic Ghee Kaju Katli",
      category: "Dry Sweets & Laddus",
      origin: "Goa & Mathura Heritage",
      description: "Finest Goan cashews ground with pure silver leaf and hand-churned Vedic ghee.",
      price: "₹680 / 500g",
      badge: "HERITAGE RECIPE",
      image: "https://images.unsplash.com/photo-1605197397734-e431ea624b5a?q=80&w=800&auto=format&fit=crop",
      isCart: true,
    },
    {
      id: 3,
      name: "Gold Foil Motichoor Laddu",
      category: "Dry Sweets & Laddus",
      origin: "Varanasi Royal Kitchens",
      description: "Fine gram flour pearls fried in organic ghee, sprinkled with pistachio flakes.",
      price: "₹520 / 500g",
      badge: "FESTIVE FAVORITE",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
      isCart: true,
    },
  ];

  return (
    <div className="w-full bg-[#FAF6F0] text-[#3D271B] overflow-x-hidden">
      
      {/* 1. HERO SECTION WITH BACKGROUND IMAGE SLIDESHOW TRANSITION */}
      <section className="relative min-h-screen w-full flex items-center pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        
        {/* Background Image Slideshow with Smooth Cross-fade */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence mode="sync">
            <motion.div 
              key={currentBgIndex}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center md:bg-right"
              style={{ backgroundImage: `url(${heroBackgroundImages[currentBgIndex].url})` }}
            />
          </AnimatePresence>

          {/* Adjusted Soft Gradient Overlay: Clear visibility of sweet images while guaranteeing text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0]/95 via-[#FAF6F0]/70 to-[#FAF6F0]/20 md:via-[#FAF6F0]/65 md:to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6F0]/90 via-transparent to-[#FAF6F0] z-10" />
        </div>

        {/* Faint Background Watermark Text "MAHARAJA" */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-10">
          <span className="font-serif text-[18vw] font-bold tracking-[0.25em] text-[#3D271B]/[0.04] uppercase whitespace-nowrap leading-none transform -rotate-2">
            MAHARAJA
          </span>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="max-w-3xl">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col justify-center"
            >
              
              {/* SINCE 2014 Tag */}
              <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
                <span className="text-xs sm:text-sm font-serif tracking-[0.35em] text-[#a65827] font-semibold uppercase block">
                  S I N C E &nbsp; 2 0 1 4
                </span>
              </motion.div>

              {/* Main Heading format: "The Soul of / Pure Alchemy." */}
              <motion.h1 variants={itemVariants} className="font-serif leading-[1.05] tracking-tight">
                <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-[#3D271B] drop-shadow-xs">
                  The Soul of
                </span>
                <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl italic font-normal text-[#3D271B] mt-1 sm:mt-2 drop-shadow-xs">
                  Pure Alchemy.
                </span>
              </motion.h1>

              {/* Subheading Description */}
              <motion.p
                variants={itemVariants}
                className="mt-8 text-[#3D271B]/85 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-xl font-sans"
              >
                Redefining the heritage of Indian confectionery through a minimalist lens of luxury. 
                A sensory journey through the high plains of Saffron and hand-churned Vedic Ghee.
              </motion.p>

              {/* CTA Link: DISCOVER COLLECTIONS */}
              <motion.div variants={itemVariants} className="mt-10 sm:mt-12 flex items-center space-x-8">
                <Link
                  to="/menu"
                  className="group inline-flex items-center text-xs sm:text-sm font-serif tracking-[0.25em] text-[#a65827] uppercase font-semibold border-b-2 border-[#a65827] pb-1.5 hover:text-[#3D271B] hover:border-[#3D271B] transition-all duration-300"
                >
                  <span>DISCOVER COLLECTIONS</span>
                  <ArrowRight className="w-4 h-4 ml-3 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
                <Link
                  to="/about"
                  className="text-xs sm:text-sm font-sans tracking-[0.2em] text-[#3D271B]/70 uppercase hover:text-[#a65827] font-medium transition-colors"
                >
                  Our Heritage
                </Link>
              </motion.div>

            </motion.div>
          </div>
        </div>

        {/* Carousel Transition Dots / Indicators */}
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-12 z-30 flex items-center space-x-3 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-[#a65827]/15 shadow-sm">
          {heroBackgroundImages.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBgIndex(idx)}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                currentBgIndex === idx
                  ? "w-8 bg-[#a65827]"
                  : "w-2 bg-[#3D271B]/30 hover:bg-[#a65827]/60"
              }`}
              aria-label={`Slide to ${image.title}`}
              title={image.title}
            />
          ))}
        </div>

      </section>

      {/* 2. HERITAGE & CRAFTSMANSHIP BANNER */}
      <section className="py-20 md:py-28 bg-[#FAF6F0] relative border-t border-[#a65827]/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column Image Showcase */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] border border-[#a65827]/15">
                <img 
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop" 
                  alt="Craftsmanship & Royal Kitchens" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3D271B]/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="font-serif italic text-lg sm:text-xl">"Hand-churned with devotion since 2014"</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column Text Narrative */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7 flex flex-col justify-center text-left"
            >
              <span className="text-xs font-serif tracking-[0.3em] text-[#a65827] uppercase font-medium mb-3 block">
                P U R I T Y &nbsp; & &nbsp; H E R I T A G E
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#3D271B] leading-tight">
                Crafted for Royal Palates
              </h2>
              <div className="w-16 h-[2px] bg-[#a65827] my-6" />
              
              <p className="text-[#3D271B]/80 text-base sm:text-lg leading-relaxed font-sans font-light">
                At Maharaja Ganguram Sweets, every recipe is a preserved monument of Bengal’s culinary grandeur. 
                We combine pure Vedic ghee, organic Kashmir saffron, and century-old sweetmaking rituals to deliver 
                an unmatched experience of luxury and authentic flavor.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-6 sm:gap-8">
                <div className="border-l-2 border-[#a65827]/30 pl-4 sm:pl-6 py-2">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#a65827] block">100%</span>
                  <span className="text-xs uppercase font-sans tracking-widest text-[#3D271B]/70 mt-1 block">Pure Desi Ghee</span>
                </div>
                <div className="border-l-2 border-[#a65827]/30 pl-4 sm:pl-6 py-2">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#a65827] block">50+</span>
                  <span className="text-xs uppercase font-sans tracking-widest text-[#3D271B]/70 mt-1 block">Royal Confections</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. CURATED COLLECTIONS GRID */}
      <section className="pt-8 pb-20 md:pt-12 md:pb-28 bg-[#F3ECE2] border-t border-[#a65827]/10 relative z-20">
        
        {/* FLOATING TRUST / FEATURE BANNER WITH ROYAL HERITAGE PARCHMENT THEME */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-30 -mt-20 sm:-mt-24 md:-mt-32 mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gradient-to-r from-[#a65827] via-[#852E17] to-[#5C1F10] rounded-2xl md:rounded-3xl p-6 sm:p-8 md:py-9 px-6 md:px-10 shadow-[0_22px_55px_rgba(114,46,26,0.38)] border border-[#D4AF37]/40 text-white relative overflow-hidden group"
          >
            {/* HERITAGE ARCHITECTURE ARTWORK OVERLAY (RIGHT SIDE: INDIAN TEMPLE DOME SPIRE) */}
            <svg viewBox="0 0 400 500" className="absolute right-0 bottom-0 h-full w-auto max-w-[280px] opacity-25 pointer-events-none stroke-[#F8E7D1] fill-none transition-opacity duration-700 group-hover:opacity-35" strokeWidth="1.2">
              {/* Flag on top */}
              <path d="M 200 30 L 250 45 L 200 60 Z" fill="#F8E7D1" fillOpacity="0.3" strokeLinejoin="round" />
              <path d="M 200 20 L 200 90" strokeWidth="2" strokeLinecap="round" />
              
              {/* Sudarshan Chakra emblem */}
              <circle cx="200" cy="100" r="14" strokeWidth="1.8" />
              <path d="M 200 86 L 200 114 M 186 100 L 214 100 M 190 90 L 210 110 M 190 110 L 210 90" strokeWidth="1" />
              
              {/* Temple Amalaka & Dome Tiers */}
              <ellipse cx="200" cy="125" rx="22" ry="10" strokeWidth="1.8" />
              <ellipse cx="200" cy="145" rx="32" ry="12" strokeWidth="1.8" />
              
              {/* Main Shikhar Tiers */}
              <path d="M 160 145 C 160 220 150 300 130 380 L 270 380 C 250 300 240 220 240 145 Z" strokeWidth="1.6" />
              
              {/* Horizontal Architectural Ribs */}
              <path d="M 157 170 C 175 177 225 177 243 170" />
              <path d="M 154 200 C 175 208 225 208 246 200" />
              <path d="M 150 230 C 175 239 225 239 250 230" />
              <path d="M 145 260 C 175 270 225 270 255 260" />
              <path d="M 140 290 C 175 301 225 301 260 290" />
              <path d="M 135 320 C 175 332 225 332 265 320" />
              <path d="M 132 350 C 175 363 225 363 268 350" />
              
              {/* Vertical Spire Lines */}
              <path d="M 200 145 L 200 380" strokeWidth="1.4" />
              <path d="M 180 145 C 180 220 170 300 155 380" />
              <path d="M 220 145 C 220 220 230 300 245 380" />
              
              {/* Base Temple Walls & Archways */}
              <path d="M 120 380 L 280 380 L 280 480 L 120 480 Z" strokeWidth="1.8" />
              <path d="M 150 380 L 150 480 M 250 380 L 250 480 M 200 380 L 200 480" />
              <path d="M 175 420 C 175 400 225 400 225 420 L 225 480 L 175 480 Z" strokeWidth="1.5" />
              
              {/* Birds in the sky */}
              <path d="M 290 80 C 295 75 300 78 305 78 C 310 78 315 75 320 80" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 320 110 C 324 106 328 108 332 108 C 336 108 340 106 344 110" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 110 130 C 114 126 118 128 122 128 C 126 128 130 126 134 130" strokeWidth="1.2" strokeLinecap="round" />
            </svg>

            {/* HERITAGE FLORAL SCROLLWORK OVERLAY (LEFT SIDE: FLORAL PAISLEY VINES) */}
            <svg viewBox="0 0 300 400" className="absolute left-0 bottom-0 h-full w-auto max-w-[200px] opacity-20 pointer-events-none stroke-[#F8E7D1] fill-none transition-opacity duration-700 group-hover:opacity-30" strokeWidth="1.3">
              <path d="M 10 380 C 30 300 20 220 80 180 C 130 150 140 80 100 40 C 70 10 30 50 60 90 C 80 120 120 120 140 100" strokeLinecap="round" />
              <path d="M 40 260 C 90 260 120 290 100 340 C 80 380 20 370 30 310" strokeLinecap="round" />
              <circle cx="100" cy="40" r="10" strokeWidth="1" />
              <path d="M 100 20 C 105 30 115 35 120 40 C 115 45 105 50 100 60 C 95 50 85 45 80 40 C 85 35 95 30 100 20 Z" fill="#F8E7D1" fillOpacity="0.2" />
            </svg>

            {/* Subtle background glow accents */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative z-10">
              
              {/* Feature 1: Loved By India */}
              <div className="flex items-center space-x-4 sm:space-x-5 group lg:border-r lg:border-white/20 lg:pr-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/25 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300 shadow-sm">
                  <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-10 sm:h-10 text-white stroke-[1.8]" fill="none" stroke="currentColor">
                    {/* India Map Outline */}
                    <path d="M48,16 C52,17 56,20 59,23 C62,26 65,28 68,31 C70,33 68,36 71,38 C74,40 77,43 75,47 C72,51 68,54 65,58 C59,64 54,72 49,84 C47,88 46,88 44,84 C39,73 34,64 30,57 C27,51 24,46 27,41 C29,36 33,34 35,30 C38,27 41,24 43,20 Z" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Heart in center */}
                    <path d="M49,36 C49,34 47,32 45,32 C43,32 41,34 41,36 C41,39 45,43 47,45 C49,43 53,39 53,36 C53,34 51,32 49,32 Z" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#F8E7D1] tracking-wide leading-tight group-hover:text-white transition-colors">
                    Loved By India
                  </h4>
                  <p className="text-xs sm:text-sm text-white/85 font-sans mt-1 font-light leading-snug">
                    Loved by 5 lakh+ customers
                  </p>
                </div>
              </div>

              {/* Feature 2: Handmade */}
              <div className="flex items-center space-x-4 sm:space-x-5 group lg:border-r lg:border-white/20 lg:pr-5 lg:pl-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/25 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300 shadow-sm">
                  <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-10 sm:h-10 text-white stroke-[1.8]" fill="none" stroke="currentColor">
                    {/* Dashed & solid heart outline */}
                    <path d="M50,22 C42,14 30,16 24,26 C18,36 22,50 36,62 L50,74 L64,62 C78,50 82,36 76,26 C70,16 58,14 50,22 Z" strokeDasharray="3 3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M50,26 C43,19 33,21 28,29 C23,38 27,49 38,59 L50,69 L62,59 C73,49 77,38 72,29 C67,21 57,19 50,26 Z" strokeLinecap="round" strokeLinejoin="round" />
                    {/* HAND MADE text inside heart */}
                    <text x="50" y="42" textAnchor="middle" fill="currentColor" stroke="none" fontSize="7.5" fontWeight="bold" fontFamily="serif" letterSpacing="0.6">HAND</text>
                    <text x="50" y="51" textAnchor="middle" fill="currentColor" stroke="none" fontSize="7.5" fontWeight="bold" fontFamily="serif" letterSpacing="0.6">MADE</text>
                    {/* Cupping hands below */}
                    <path d="M24,58 C28,66 36,72 45,76 M76,58 C72,66 64,72 55,76" strokeLinecap="round" strokeWidth="2" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#F8E7D1] tracking-wide leading-tight group-hover:text-white transition-colors">
                    Handmade
                  </h4>
                  <p className="text-xs sm:text-sm text-white/85 font-sans mt-1 font-light leading-snug">
                    Every piece is made with love
                  </p>
                </div>
              </div>

              {/* Feature 3: Ships In 5-7 Days */}
              <div className="flex items-center space-x-4 sm:space-x-5 group lg:border-r lg:border-white/20 lg:pr-5 lg:pl-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/25 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300 shadow-sm">
                  <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-10 sm:h-10 text-white stroke-[1.8]" fill="none" stroke="currentColor">
                    {/* Motion lines */}
                    <path d="M12,38 L25,38 M8,50 L22,50 M14,62 L26,62" strokeLinecap="round" strokeWidth="2.2" />
                    {/* Clock Circle */}
                    <circle cx="58" cy="50" r="25" strokeLinecap="round" />
                    {/* Clock Hands */}
                    <path d="M58,34 L58,50 L69,50" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                    {/* Clock ticks */}
                    <path d="M58,21 L58,25 M83,50 L79,50 M58,79 L58,75 M33,50 L37,50" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#F8E7D1] tracking-wide leading-tight group-hover:text-white transition-colors">
                    Ships In 5–7 Days
                  </h4>
                  <p className="text-xs sm:text-sm text-white/85 font-sans mt-1 font-light leading-snug">
                    Write to us to expedite your order
                  </p>
                </div>
              </div>

              {/* Feature 4: No Preservatives */}
              <div className="flex items-center space-x-4 sm:space-x-5 group lg:pl-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/25 group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300 shadow-sm">
                  <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-10 sm:h-10 text-white stroke-[1.8]" fill="none" stroke="currentColor">
                    {/* Chemical Flask outline */}
                    <path d="M42,20 L54,20 M48,20 L48,36 L66,66 C70,73 65,80 57,80 L39,80 C31,80 26,73 30,66 L48,36" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Liquid line inside flask */}
                    <path d="M35,62 C40,60 56,64 61,62" strokeLinecap="round" />
                    {/* No Preservatives (Circle with X) on upper right */}
                    <circle cx="70" cy="32" r="11" fill="#a65827" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M64,26 L76,38 M76,26 L64,38" strokeLinecap="round" strokeWidth="2" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#F8E7D1] tracking-wide leading-tight group-hover:text-white transition-colors">
                    No Preservatives
                  </h4>
                  <p className="text-xs sm:text-sm text-white/85 font-sans mt-1 font-light leading-snug">
                    Pure taste, naturally fresh
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-xs font-serif tracking-[0.3em] text-[#a65827] uppercase font-medium block mb-2">
                E X C L U S I V E &nbsp; S E L E C T I O N
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#3D271B]">
                The Maharaja Collection
              </h2>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center text-xs font-serif tracking-[0.25em] text-[#a65827] uppercase hover:underline"
            >
              VIEW ALL SWEETS <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sweetCollection.map((sweet, index) => (
              <motion.div
                key={sweet.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <LinearCard item={sweet} />
              </motion.div>
            ))}
          </div>

          {/* EXPLORE MENU CTA BUTTON BELOW COLLECTION CARDS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-14 sm:mt-16 flex flex-col items-center justify-center text-center"
          >
            <Link
              to="/menu"
              className="inline-flex items-center px-8 sm:px-10 py-4 sm:py-4.5 rounded-full bg-[#a65827] hover:bg-[#3D271B] text-[#FAF6F0] font-serif text-xs sm:text-sm tracking-[0.25em] uppercase font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.03] group border border-[#D4AF37]/30"
            >
              <span>EXPLORE FULL MENU</span>
              <ArrowRight className="w-4 h-4 ml-3 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
            <p className="text-xs text-[#3D271B]/60 font-sans mt-3 tracking-wider uppercase">
              Discover our complete range of royal mithai & seasonal delicacies
            </p>
          </motion.div>

        </div>
      </section>

    </div>
  );
};

export default HomePage;