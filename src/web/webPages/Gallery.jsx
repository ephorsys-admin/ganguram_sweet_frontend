import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, ZoomIn } from "lucide-react";

import ladooImg from "../../assets/gallery/ladoo.png";
import processImg from "../../assets/gallery/process.png";
import kajukatliImg from "../../assets/gallery/kajukatli.png";
import rasgullaImg from "../../assets/gallery/rasgulla.png";
import Banner from "../../../public/Mylogo/Sweets2.png";

const CATEGORIES = ["All", "Traditional Sweets", "Kitchen Artisans", "Festive Joy"];

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

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = activeCategory === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="w-full bg-white">

      <section className="relative w-full h-55 sm:h-70 md:h-80 overflow-hidden">
        <img
          src={Banner}
          alt="Our gallery"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-4 sm:px-6 lg:px-8">
          <nav className="mb-2 text-xs font-medium text-white/70">
            <span>Home</span> <span className="mx-1.5">/</span> <span className="text-white">Gallery</span>
          </nav>
          <h1 className="text-2xl font-bold text-white sm:text-4xl">
            Our Gallery
          </h1>
          <p className="mt-2 max-w-lg text-sm text-white/85 sm:text-base">
            A visual tour through our heritage kitchens, traditional preparation, and signature sweets.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto flex max-w-7xl flex-col px-4 py-10 sm:px-6 lg:px-8">

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

        {/* Flat filter bar — consistent with Contact page styling */}
        <div className="mb-10 flex w-full items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-px sm:justify-center">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className="relative shrink-0 whitespace-nowrap px-4 py-2.5 text-sm font-semibold outline-none transition-colors cursor-pointer"
                style={{ color: isActive ? "#3D1F12" : "#94a3b8" }}
              >
                {category}
                {isActive && (
                  <motion.div
                    layoutId="activeFilterUnderline"
                    className="absolute inset-x-0 -bottom-px h-0.5 rounded-full"
                    style={{ backgroundColor: "#8A2E2E" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid — hover reveal panels kept for the "wow" factor */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -4 }}
                className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                onClick={() => setSelectedItem(item)}
              >
                {/* Image Cover */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark gradient shadow overlay at bottom in default state */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-100 transition-opacity duration-500 group-hover:opacity-0" />

                {/* Initial Info Overlay (Visible when not hovered) */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex transform flex-col justify-end p-5 transition-all duration-500 group-hover:translate-y-4 group-hover:opacity-0">
                  <span
                    className="mb-2 w-max rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: "#8A2E2E" }}
                  >
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold leading-snug text-white">
                    {item.title}
                  </h3>
                  <span className="mt-2.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/80">
                    Explore Details <Eye size={12} />
                  </span>
                </div>

                {/* Slide-Up Overlay Panel (Visible on Hover) */}
                <div className="z-25 absolute inset-x-0 bottom-0 top-1/4 flex translate-y-full flex-col justify-between border-t border-slate-200 bg-white p-5 transition-all duration-500 ease-out group-hover:translate-y-0">
                  <div>
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest" style={{ color: "#8A2E2E" }}>
                      {item.category}
                    </span>
                    <h3 className="mb-2.5 text-lg font-bold leading-snug text-slate-800">
                      {item.title}
                    </h3>
                    <p className="line-clamp-5 text-sm leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 flex w-full items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold uppercase tracking-wider text-[#8A2E2E]">
                    <span>View Showcase</span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                      <ZoomIn size={13} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 py-20 text-center">
            <p className="text-sm text-slate-500">No items found in this category.</p>
          </div>
        )}

        {/* Lightbox details modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs sm:p-6"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 12 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="relative w-full max-w-4xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close handle */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute right-4 top-4 z-20 cursor-pointer rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50"
                >
                  <X size={16} />
                </button>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-50 md:aspect-auto md:h-[420px]">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-center p-8">
                    <span className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "#8A2E2E" }}>
                      {selectedItem.category}
                    </span>
                    <h2 className="mb-4 text-2xl font-bold text-slate-800">
                      {selectedItem.title}
                    </h2>

                    <div className="mb-6 h-1 w-12 rounded-full" style={{ backgroundColor: "#8A2E2E" }} />

                    <p className="mb-6 text-sm leading-relaxed text-slate-500">
                      {selectedItem.description}
                    </p>

                    <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
                      <strong className="text-slate-700">Heritage Standard:</strong> High purity preparation. Crafted in hygienic environments using traditional milk & pure cow ghee since 1999.
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