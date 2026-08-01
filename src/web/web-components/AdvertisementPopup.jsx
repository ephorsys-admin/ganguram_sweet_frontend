import { useState, useEffect, useRef } from "react";
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
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#0C0705]/70 backdrop-blur-xl cursor-pointer"
          />

          {/* Modal Container — modern card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="relative w-full max-w-lg md:max-w-4xl rounded-[24px] bg-white overflow-hidden z-10 shadow-[0_30px_80px_-20px_rgba(30,17,10,0.45)]"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3.5 right-3.5 z-30 p-2 bg-white/90 hover:bg-white text-[#3D271B] rounded-full transition-colors duration-200 cursor-pointer shadow-sm"
              aria-label="Close dialog"
            >
              <X size={15} strokeWidth={2.5} />
            </button>

            {/* Image section */}
            <div className="relative aspect-[4/3] md:aspect-[21/9] w-full overflow-hidden bg-[#FAF6F0]">
              {/* Reel-style progress bars, on top of the image */}
              {advertisements.length > 1 && (
                <div className="absolute top-3 left-3 right-3 z-20 flex gap-1.5">
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
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Arrows, on the image */}
              {advertisements.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      paginate(-1);
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/85 hover:bg-white text-[#3D271B] rounded-full transition-colors duration-200 shadow-sm cursor-pointer"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      paginate(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/85 hover:bg-white text-[#3D271B] rounded-full transition-colors duration-200 shadow-sm cursor-pointer"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Content section, below the image */}
            <div className="relative px-6 md:px-8 pt-5 md:pt-6 pb-6 md:pb-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#DFA250]/12 rounded-full w-fit mb-3">
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
                >
                  {advertisements[activeIndex].title}
                </motion.h3>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdvertisementPopup;