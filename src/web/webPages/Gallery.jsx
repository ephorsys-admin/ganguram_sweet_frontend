import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eye, X, ZoomIn } from "lucide-react";

import ladooImg from "../../assets/gallery/ladoo.png";
import processImg from "../../assets/gallery/process.png";
import kajukatliImg from "../../assets/gallery/kajukatli.png";
import rasgullaImg from "../../assets/gallery/rasgulla.png";

const CATEGORIES = ["All", "Traditional Sweets", "Kitchen Artisans", "Festive Joy"];

const HERO_GRADIENTS = [
  "linear-gradient(160deg, #FFF3D6, #F6D989)", // Saffron / Sweet Yellow
  "linear-gradient(160deg, #FFF9EF, #F0E2C4)", // Rasgulla / Creamy Gold
  "linear-gradient(160deg, #F3D9C4, #C98B5E)", // Gulab Jamun / Warm Caramel
  "linear-gradient(160deg, #FBF3DD, #E9CE8F)", // Kaju Katli / Silver Honey
];

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Heritage Kesaria Ladoo",
    category: "Traditional Sweets",
    description: "Pure cow ghee Motichoor Ladoos piled on a traditional brass container, decorated with rose petals and pistachio.",
    image: ladooImg,
  },
  {
    id: 2,
    title: "Traditional Milk Reduction",
    category: "Kitchen Artisans",
    description: "Slow boiling and reduction of organic cow milk in our vintage large copper kadhai vessels.",
    image: processImg,
  },
  {
    id: 3,
    title: "Royal Kaju Katli",
    category: "Traditional Sweets",
    description: "Classic rich cashew fudge cut in premium diamond shapes and clad in pure sterling silver varq.",
    image: kajukatliImg,
  },
  {
    id: 4,
    title: "Saffron Clay Pot Rasgullas",
    category: "Traditional Sweets",
    description: "Super soft, spongy cottage cheese dumplings soaked in saffron-infused syrup presented in traditional clay handi.",
    image: rasgullaImg,
  },
  {
    id: 5,
    title: "Curated Shahi Utsav Box",
    category: "Festive Joy",
    description: "Our signature luxury gold-detailed box packed with dry fruits, laddoo, and mathri for auspicious occasions.",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 6,
    title: "Heritage Ghee Preparation",
    category: "Kitchen Artisans",
    description: "Extracting pure aromatic amber ghee from butter, following ancestral secrets since 1999.",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=600",
  },
];

// Helper Abstract gallery/camera graphics to match the visual style of AboutUs.jsx
const GalleryAbstractBlob = () => (
  <svg viewBox="0 0 220 220" className="w-full h-full drop-shadow-xl">
    <defs>
      <radialGradient id="galleryAbstractGrad" cx="35%" cy="30%" r="85%">
        <stop offset="0%" stopColor="#FFF3D6" />
        <stop offset="60%" stopColor="#F4D383" />
        <stop offset="100%" stopColor="#D9962E" />
      </radialGradient>
    </defs>
    
    {/* Main circular base */}
    <circle cx="110" cy="115" r="85" fill="url(#galleryAbstractGrad)" />
    
    {/* Vintage Detailed camera body: fill white, outline red */}
    <path
      d="M75,98 L75,138 C75,141 78,144 81,144 L139,144 C142,144 145,141 145,98 Z"
      fill="#FFFDF8"
      stroke="#8A2E2E"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M75,98 H145 V98 C145,94 142,91 139,91 H81 C78,91 75,94 75,98 Z"
      fill="#FBF3E4"
      stroke="#8A2E2E"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M93,91 L98,80 H122 L127,91"
      fill="#FFFDF8"
      stroke="#8A2E2E"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    
    {/* Camera lens */}
    <circle
      cx="110"
      cy="118"
      r="16"
      fill="#F1E4CD"
      stroke="#8A2E2E"
      strokeWidth="2.5"
    />
    <circle
      cx="110"
      cy="118"
      r="8"
      fill="#8A2E2E"
    />

    {/* Floating tiny circles */}
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      const r = 45 + (i % 3) * 10;
      return (
        <circle
          key={i}
          cx={110 + Math.cos(a) * r}
          cy={115 + Math.sin(a) * r}
          r={3 + (i % 3)}
          fill="#FFEFC2"
          opacity="0.85"
        />
      );
    })}
  </svg>
);

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [gradientIndex, setGradientIndex] = useState(0);

  // Cycle through gradients list every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % HERO_GRADIENTS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const filteredItems = activeCategory === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="w-full" style={{ backgroundColor: "#FFFDF8" }}>
      
      {/* Hero Section - Matching AboutUs.jsx exactly with animated bg gradient cross-fading */}
      <section className="w-full relative overflow-hidden">
        {/* Background Gradients cross-fading */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={gradientIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ background: HERO_GRADIENTS[gradientIndex] }}
          />
        </AnimatePresence>

        {/* Content Overlay */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col-reverse items-center gap-8 px-4 py-14 sm:px-6 md:flex-row md:justify-between md:py-20 lg:px-8">
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
              Pure Sights & Traditions
            </span>
            <h1
              className="mt-3 text-3xl font-bold leading-tight sm:text-5xl"
              style={{ color: "#3D1F12" }}
            >
              Our Sweet Visual Journey
            </h1>
            <p className="mt-4 text-base sm:text-lg" style={{ color: "#5C3A24" }}>
              Take a visual tour through our heritage kitchens, traditional preparation rituals, and premium sweets designed to make every occasion a royal celebration.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="shrink-0 drop-shadow-2xl w-40 h-40 md:w-56 md:h-56"
          >
            <GalleryAbstractBlob />
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col">
        
        {/* Style injection to hide scrollbars on horizontal lists */}
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Modern Sliding Glassmorphism Filters */}
        <div 
          className="mx-auto bg-white/60 backdrop-blur-xs p-1.5 rounded-2xl sm:rounded-full border flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-1 mb-12 md:mb-16 shadow-xs max-w-full w-full sm:w-auto"
          style={{ borderColor: "#F0E4CC" }}
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className="relative px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-colors duration-300 cursor-pointer outline-hidden shrink-0"
                style={{
                  color: isActive ? "#FFFFFF" : "#7A5C4A",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 rounded-full shadow-md z-0"
                    style={{ backgroundColor: "#8A2E2E" }}
                    transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -6 }}
                className="relative aspect-[4/5] overflow-hidden rounded-2xl border bg-[#FBF3E4]/10 shadow-sm cursor-pointer group"
                style={{ borderColor: "#F0E4CC" }}
                onClick={() => setSelectedItem(item)}
              >
                {/* Image Cover */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark gradient shadow overlay at bottom in default state */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500 z-10" />

                {/* Initial Info Overlay (Visible when not hovered) */}
                <div className="absolute bottom-0 inset-x-0 p-6 z-20 flex flex-col justify-end group-hover:opacity-0 transition-all duration-500 transform group-hover:translate-y-4 pointer-events-none">
                  <span
                    className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider mb-2.5 w-max text-white"
                    style={{ backgroundColor: "#8A2E2E" }}
                  >
                    {item.category}
                  </span>
                  <h3 className="text-xl font-bold font-serif text-white tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <span className="text-xs text-white/80 mt-3 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    Explore Details <Eye size={12} />
                  </span>
                </div>

                {/* Slide-Up Overlay Panel (Visible on Hover) */}
                <div
                  className="absolute inset-x-0 bottom-0 top-1/4 translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-out z-25 flex flex-col justify-between p-6 border-t"
                  style={{ backgroundColor: "#FFFDF8", borderColor: "#F0E4CC" }}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest block mb-1" style={{ color: "#8A2E2E" }}>
                      {item.category}
                    </span>
                    <h3 className="text-xl font-bold font-serif mb-3 leading-snug" style={{ color: "#3D1F12" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed line-clamp-5" style={{ color: "#7A5C4A" }}>
                      {item.description}
                    </p>
                  </div>

                  <div
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider mt-4 pt-3 border-t text-[#8A2E2E]"
                    style={{ borderColor: "#FBF3E4" }}
                  >
                    <span>View Showcase</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FBF3E4] text-[#8A2E2E]">
                      <ZoomIn size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state overlay */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed" style={{ borderColor: "#F0E4CC" }}>
            <p className="text-base" style={{ color: "#7A5C4A" }}>No items found in this category.</p>
          </div>
        )}

        {/* Lightbox details modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl relative border"
                style={{ backgroundColor: "#FFFDF8", borderColor: "#F0E4CC" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close handle */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full shadow-md transition-all cursor-pointer border hover:opacity-90"
                  style={{ backgroundColor: "#FFFDF8", borderColor: "#F0E4CC", color: "#3D1F12" }}
                >
                  <X size={16} />
                </button>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="aspect-[4/3] md:aspect-auto md:h-[420px] bg-[#FBF3E4] overflow-hidden">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-8 flex flex-col justify-center bg-white">
                    <span className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#8A2E2E" }}>
                      {selectedItem.category}
                    </span>
                    <h2 className="text-2xl font-bold font-serif mb-4" style={{ color: "#3D1F12" }}>
                      {selectedItem.title}
                    </h2>
                    
                    <div className="w-12 h-1 mb-6 rounded-full" style={{ backgroundColor: "#8A2E2E" }} />
                    
                    <p className="text-sm leading-relaxed mb-6" style={{ color: "#7A5C4A" }}>
                      {selectedItem.description}
                    </p>

                    <div className="p-4 rounded-xl border text-xs leading-relaxed" style={{ backgroundColor: "#FFFDF8", borderColor: "#F0E4CC", color: "#7A5C4A" }}>
                      <strong>Heritage Standard:</strong> High purity preparation. Crafted in hygienic environments using traditional milk & pure cow ghee since 1999.
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </section>
    </div>
  );
};

export default Gallery;
