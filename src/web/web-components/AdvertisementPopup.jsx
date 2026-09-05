import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { getPublicAdvertisements } from "../../redux/features/advertisement/advertisementThunk";

const AUTOPLAY_MS = 5000;

const AdvertisementPopup = () => {
  const dispatch = useDispatch();
  const { advertisements = [], isLoading } = useSelector((state) => state.advertisement);

  const [isOpen, setIsOpen] = useState(false);
  const [[page, direction], setPage] = useState([0, 0]);
  const [progressKey, setProgressKey] = useState(0);

  const activeIndex = advertisements.length
    ? ((page % advertisements.length) + advertisements.length) % advertisements.length
    : 0;

  // Fetch public ads on mount
  useEffect(() => {
    dispatch(getPublicAdvertisements());
  }, [dispatch]);

  // Open the popup once advertisements are loaded
  useEffect(() => {
    if (advertisements.length > 0) {
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [advertisements]);

  // Autoplay carousel if multiple advertisements are public
  useEffect(() => {
    if (isOpen && advertisements.length > 1) {
      const interval = setInterval(() => {
        setPage(([prevPage]) => [prevPage + 1, 1]);
        setProgressKey((k) => k + 1);
      }, AUTOPLAY_MS);
      return () => clearInterval(interval);
    }
  }, [isOpen, advertisements.length]);

  const handleClose = () => setIsOpen(false);

  const paginate = (newDirection) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
    setProgressKey((k) => k + 1);
  };

  if (advertisements.length === 0) return null;

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      zIndex: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 60 : -60,
      opacity: 0,
      zIndex: 0,
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#0C0705]/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Card wrapper - Deep Crimson/Maroon Border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="relative w-full max-w-lg md:max-w-4xl bg-[#A22648] p-7 md:p-8 rounded-[20px] overflow-hidden z-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#C23C5E]"
          >
            {/* Corner Flowers ❃ */}
            <span className="absolute top-2 left-2 text-[#ECAFB9]/50 text-xs select-none">❃</span>
            <span className="absolute top-2 right-8 text-[#ECAFB9]/50 text-xs select-none">❃</span>
            <span className="absolute bottom-2 left-2 text-[#ECAFB9]/50 text-xs select-none">❃</span>
            <span className="absolute bottom-2 right-2 text-[#ECAFB9]/50 text-xs select-none">❃</span>

            {/* Rotated Border Texts "TRADITION KA NAYA EDITION" */}
            {/* Top */}
            <div className="absolute top-2 left-0 right-0 text-center pointer-events-none">
              <span className="text-[9px] tracking-[0.25em] font-medium text-[#ECAFB9]/90 uppercase">
                TRADITION KA NAYA EDITION
              </span>
            </div>
            {/* Bottom */}
            <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
              <span className="text-[9px] tracking-[0.25em] font-medium text-[#ECAFB9]/90 uppercase">
                TRADITION KA NAYA EDITION
              </span>
            </div>
            {/* Left */}
            <div className="absolute left-2 top-0 bottom-0 flex items-center justify-center pointer-events-none">
              <span className="text-[9px] tracking-[0.25em] font-medium text-[#ECAFB9]/90 uppercase [writing-mode:vertical-lr] rotate-180">
                TRADITION KA NAYA EDITION
              </span>
            </div>
            {/* Right */}
            <div className="absolute right-2 top-0 bottom-0 flex items-center justify-center pointer-events-none">
              <span className="text-[9px] tracking-[0.25em] font-medium text-[#ECAFB9]/90 uppercase [writing-mode:vertical-lr]">
                TRADITION KA NAYA EDITION
              </span>
            </div>

            {/* Close Button ("X") */}
            <button
              onClick={handleClose}
              className="absolute top-1.5 right-1.5 z-30 p-1.5 text-[#ECAFB9] hover:text-white transition-colors duration-200 cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={22} strokeWidth={2.5} />
            </button>

            {/* Inner Postage Stamp White Card */}
            <div className="relative bg-white w-full rounded-lg shadow-inner overflow-hidden select-none">

              {/* Radial-Gradient Scalloped Edges (Postage Stamp Cuts) */}
              <div
                className="absolute top-0 left-0 right-0 h-3 z-20 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle at 50% -2px, #A22648 5px, transparent 6px)",
                  backgroundSize: "14px 10px",
                  backgroundRepeat: "repeat-x"
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-3 z-20 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle at 50% 12px, #A22648 5px, transparent 6px)",
                  backgroundSize: "14px 10px",
                  backgroundRepeat: "repeat-x"
                }}
              />
              <div
                className="absolute top-0 bottom-0 left-0 w-3 z-20 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle at -2px 50%, #A22648 5px, transparent 6px)",
                  backgroundSize: "10px 14px",
                  backgroundRepeat: "repeat-y"
                }}
              />
              <div
                className="absolute top-0 bottom-0 right-0 w-3 z-20 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle at 12px 50%, #A22648 5px, transparent 6px)",
                  backgroundSize: "10px 14px",
                  backgroundRepeat: "repeat-y"
                }}
              />

              {/* Decorative Corner Sweet Illustrations */}
              {/* Top-Left Sweet (Round Modak/Peda) */}
              <div className="absolute top-4 left-4 z-20 drop-shadow-sm pointer-events-none">
                <svg viewBox="0 0 40 40" className="w-8 h-8">
                  <path d="M 20 6 Q 13 18 11 24 Q 11 34 20 34 Q 29 34 29 24 Q 27 18 20 6 Z" fill="#D29034" />
                  <path d="M 20 6 Q 16 18 20 34" fill="none" stroke="#B87318" strokeWidth="1" />
                  <path d="M 20 6 Q 24 18 20 34" fill="none" stroke="#B87318" strokeWidth="1" />
                  <circle cx="20" cy="21" r="2.5" fill="#A86208" />
                </svg>
              </div>

              {/* Top-Right Sweet (Diamond Kaju Katli) */}
              <div className="absolute top-4 right-8 z-20 drop-shadow-sm pointer-events-none">
                <svg viewBox="0 0 40 40" className="w-9 h-9">
                  <polygon points="20,8 33,20 20,32 7,20" fill="#EBC85E" />
                  <polygon points="12,17 28,13 24,24 14,22" fill="#E8F1F2" opacity="0.6" />
                  <circle cx="18" cy="18" r="1.5" fill="#5D8B3E" />
                  <circle cx="22" cy="21" r="1.2" fill="#5D8B3E" />
                </svg>
              </div>

              {/* Bottom-Right Sweet (Chocolate Roll) */}
              <div className="absolute bottom-3 right-6 z-20 drop-shadow-sm pointer-events-none">
                <svg viewBox="0 0 50 40" className="w-11 h-9">
                  <g transform="rotate(-15, 25, 20)">
                    <rect x="5" y="10" width="30" height="18" rx="2.5" fill="#512E20" />
                    <path d="M 5 10 L 35 10" stroke="#7A4E3B" strokeWidth="1.5" />
                    <ellipse cx="35" cy="19" rx="3.5" ry="9" fill="#F5B041" />
                    <ellipse cx="35" cy="19" rx="1.8" ry="5" fill="#FAD7A0" />
                    <line x1="8" y1="13" x2="11" y2="14" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="14" y1="15" x2="16" y2="13" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="21" y1="12" x2="24" y2="14" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="11" y1="21" x2="13" y2="23" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
                  </g>
                </svg>
              </div>

              {/* Dynamic Image Slideshow Container */}
              <div className="relative aspect-[4/3] md:aspect-[21/9] w-full overflow-hidden bg-[#FAF6F0] z-10 px-4 pt-4">
                {/* Reel-style progress bars */}
                {advertisements.length > 1 && (
                  <div className="absolute top-6 left-6 right-6 z-30 flex gap-1.5">
                    {advertisements.map((_, idx) => (
                      <div
                        key={idx}
                        className="h-[3px] flex-1 rounded-full bg-white/40 overflow-hidden"
                      >
                        {idx === activeIndex && (
                          <motion.div
                            key={progressKey}
                            className="h-full bg-white rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                          />
                        )}
                        {idx < activeIndex && (
                          <div className="h-full w-full bg-white rounded-full" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative w-full h-full rounded-md overflow-hidden shadow-inner">
                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.img
                      key={page}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                      src={advertisements[activeIndex].image}
                      alt={advertisements[activeIndex].title}
                      className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing select-none"
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.5}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -50) {
                          paginate(1);
                        } else if (info.offset.x > 50) {
                          paginate(-1);
                        }
                      }}
                    />
                  </AnimatePresence>
                </div>

                {/* Arrows */}
                {advertisements.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        paginate(-1);
                      }}
                      className="absolute left-6 top-1/2 -translate-y-1/2 z-25 p-2 bg-white/85 hover:bg-white text-[#3D271B] rounded-full transition-colors duration-200 shadow-sm cursor-pointer"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        paginate(1);
                      }}
                      className="absolute right-6 top-1/2 -translate-y-1/2 z-25 p-2 bg-white/85 hover:bg-white text-[#3D271B] rounded-full transition-colors duration-200 shadow-sm cursor-pointer"
                      aria-label="Next slide"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>

              {/* Content / Advertisement Text below image */}
              <div className="relative px-6 md:px-8 pt-4 pb-6 md:pb-8 z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#DFA250]/12 rounded-full w-fit mb-2">
                  <Sparkles size={11} className="text-[#B87A2F]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B87A2F]">
                    Exclusive Offer
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.h3
                    key={page}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="font-serif font-bold text-xl md:text-2xl text-[#1E110A] leading-snug"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {advertisements[activeIndex].title}
                  </motion.h3>
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdvertisementPopup;