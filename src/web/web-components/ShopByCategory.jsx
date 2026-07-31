import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesPublic } from "../../redux/features/category/categoryThunk";
import { Layers, Loader2 } from "lucide-react";

const GRADIENTS = [
  "linear-gradient(160deg,#FFE9C9,#F7C46B)",
  "linear-gradient(160deg,#FFF3C4,#F2C24A)",
  "linear-gradient(160deg,#FBE1E8,#F0B8C8)",
  "linear-gradient(160deg,#FBE0C4,#F2A85E)",
  "linear-gradient(160deg,#E4E3F9,#B7B4E8)",
  "linear-gradient(160deg,#FDE7D6,#F0B98E)",
  "linear-gradient(160deg,#F7E7D2,#E8C39A)",
];

const AUTO_SCROLL_SPEED = 0.6; // px per frame

const CategoryPill = ({ cat, index, onClick }) => {
  const bgGradient = GRADIENTS[index % GRADIENTS.length];
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.05 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
      className="group flex shrink-0 flex-col items-center gap-2 cursor-pointer"
    >
      <div
        className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full shadow-sm transition-transform duration-300 group-hover:scale-105 xs:h-20 xs:w-20 sm:h-24 sm:w-24 border border-brand-accent/20"
        style={{ background: bgGradient }}
      >
        {cat.image?.url ? (
          <img src={cat.image.url} alt={cat.name} className="h-full w-full object-cover" />
        ) : (
          <Layers className="text-brand-dark/60 h-6 w-6" />
        )}
      </div>

      <span
        className="text-center text-xs font-bold leading-tight sm:text-sm"
        style={{ color: "#3D1F12", maxWidth: "6rem" }}
      >
        {cat.name}
      </span>
    </motion.button>
  );
};

const ShopByCategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories = [], isLoading } = useSelector((state) => state.category);

  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    dispatch(getCategoriesPublic());
  }, [dispatch]);

  // Detect whether the categories overflow the visible track — only then do
  // we duplicate the list and auto-scroll. On a wide screen with few
  // categories the row just stays centered and static.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || categories.length === 0) {
      setOverflowing(false);
      return;
    }

    const checkOverflow = () => {
      // Measure against the single (non-duplicated) content width.
      const singleWidth = overflowing ? el.scrollWidth / 2 : el.scrollWidth;
      setOverflowing(singleWidth > el.clientWidth + 1);
    };

    checkOverflow();
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length]);

  // Continuous auto-scroll with seamless looping (list is rendered twice
  // when overflowing, and we jump back by half-width once we pass it).
  useEffect(() => {
    if (!overflowing) return;
    const el = trackRef.current;
    if (!el) return;

    const step = () => {
      if (!pausedRef.current && el) {
        el.scrollLeft += AUTO_SCROLL_SPEED;
        const halfWidth = el.scrollWidth / 2;
        if (el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [overflowing]);

  const pause = useCallback(() => {
    pausedRef.current = true;
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
  }, []);

  const displayCategories = useMemo(
    () => (overflowing ? [...categories, ...categories] : categories),
    [categories, overflowing]
  );

  return (
    <section className="w-full" style={{ backgroundColor: "#FFFDF8" }}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold sm:text-5xl" style={{ color: "#3D1F12" }}>
            Shop by Category
          </h2>
          <p className="mt-2 text-sm sm:text-base" style={{ color: "#7A5C4A" }}>
            Everything from classic sweets to festive hampers, all in one place.
          </p>
        </motion.div>

        {/* Loading / empty / category row */}
        {isLoading ? (
          <div className="mt-8 flex justify-center py-6">
            <Loader2 className="h-8 w-8 text-brand-gold animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <p className="mt-8 text-center text-xs text-[#7A5C4A]">No categories available right now.</p>
        ) : (
          <div className="relative mt-8">
            {/* Edge fades — only meaningful once the row actually scrolls */}
            {overflowing && (
              <>
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-[#FFFDF8] to-transparent sm:w-14" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-[#FFFDF8] to-transparent sm:w-14" />
              </>
            )}

            <div
              ref={trackRef}
              onMouseEnter={pause}
              onMouseLeave={resume}
              onTouchStart={pause}
              onTouchEnd={resume}
              className={`flex gap-6 overflow-x-auto px-1 py-2 sm:gap-10 scrollbar-none [&::-webkit-scrollbar]:hidden ${overflowing ? "" : "justify-center"
                }`}
            >
              {displayCategories.map((cat, i) => (
                <CategoryPill
                  key={`${cat._id}-${i}`}
                  cat={cat}
                  index={i}
                  onClick={() => navigate(`/category/${cat._id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopByCategory;