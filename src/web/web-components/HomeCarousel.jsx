import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Decorative sweet illustrations (SVG) used as slide art.
 * Swap the <SweetArt /> usage below with a real <img src="..." />
 * once you have product photography.
 */
const SweetArt = ({ variant }) => {
  const artMap = {
    ladoo: (
      <svg viewBox="0 0 300 300" className="h-full w-full">
        <defs>
          <radialGradient id="ladooG" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#F9D889" />
            <stop offset="55%" stopColor="#E0A233" />
            <stop offset="100%" stopColor="#9C5E1B" />
          </radialGradient>
        </defs>
        <circle cx="150" cy="155" r="105" fill="url(#ladooG)" />
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          const r = 60 + (i % 3) * 12;
          return (
            <circle
              key={i}
              cx={150 + Math.cos(a) * r}
              cy={155 + Math.sin(a) * r}
              r={4 + (i % 3)}
              fill="#FFEFC2"
              opacity="0.85"
            />
          );
        })}
      </svg>
    ),
    gulabJamun: (
      <svg viewBox="0 0 300 300" className="h-full w-full">
        <defs>
          <radialGradient id="jamunG" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#8C4A2A" />
            <stop offset="60%" stopColor="#5A2A16" />
            <stop offset="100%" stopColor="#301509" />
          </radialGradient>
        </defs>
        <ellipse cx="115" cy="140" rx="65" ry="58" fill="url(#jamunG)" />
        <ellipse cx="195" cy="185" rx="58" ry="52" fill="url(#jamunG)" />
        <path
          d="M40 230 Q150 260 260 225"
          stroke="#C9962C"
          strokeWidth="4"
          fill="none"
          opacity="0.6"
        />
      </svg>
    ),
    kajuKatli: (
      <svg viewBox="0 0 300 300" className="h-full w-full">
        <defs>
          <linearGradient id="katliG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F3E3C3" />
            <stop offset="100%" stopColor="#D9BE8A" />
          </linearGradient>
        </defs>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${70 + i * 55} 90) rotate(8)`}>
            <polygon
              points="0,80 60,0 100,60 40,140"
              fill="url(#katliG)"
              stroke="#B8912F"
              strokeWidth="2"
            />
            <polygon points="0,80 60,0 65,10 8,86" fill="#EBCB7A" opacity="0.6" />
          </g>
        ))}
      </svg>
    ),
    rasgulla: (
      <svg viewBox="0 0 300 300" className="h-full w-full">
        <defs>
          <radialGradient id="rasG" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#FBF3E4" />
            <stop offset="100%" stopColor="#E9D9B8" />
          </radialGradient>
        </defs>
        <circle cx="110" cy="150" r="70" fill="url(#rasG)" />
        <circle cx="205" cy="120" r="55" fill="url(#rasG)" />
        <circle cx="185" cy="205" r="48" fill="url(#rasG)" />
      </svg>
    ),
  };
  return artMap[variant] ?? null;
};

const SLIDES = [
  {
    id: "ladoo",
    art: "ladoo",
    eyebrow: "Festival Favourite",
    title: "Besan Ladoo",
    subtitle: "Roasted gram flour, pure ghee, slow-cooked the traditional way.",
    bg: "linear-gradient(135deg, #FFF3D6 0%, #F6D989 55%, #D9962E 100%)",
  },
  {
    id: "gulabJamun",
    art: "gulabJamun",
    eyebrow: "Best Seller",
    title: "Gulab Jamun",
    subtitle: "Soft milk dumplings soaked in warm cardamom-rose syrup.",
    bg: "linear-gradient(135deg, #F3D9C4 0%, #C98B5E 55%, #7A3E22 100%)",
  },
  {
    id: "kajuKatli",
    art: "kajuKatli",
    eyebrow: "Premium Pick",
    title: "Kaju Katli",
    subtitle: "Silver-leaf cashew diamonds, hand-cut, melt-in-mouth smooth.",
    bg: "linear-gradient(135deg, #FBF3DD 0%, #E9CE8F 55%, #B8912F 100%)",
  },
  {
    id: "rasgulla",
    art: "rasgulla",
    eyebrow: "Bengal Classic",
    title: "Rasgulla",
    subtitle: "Spongy cottage-cheese balls in light, fragrant sugar syrup.",
    bg: "linear-gradient(135deg, #FFF9EF 0%, #F0E2C4 55%, #D9BE8A 100%)",
  },
];

const AUTOPLAY_MS = 2500;

const HomeCarousel = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (next) => {
      setDirection(next > index || (index === SLIDES.length - 1 && next === 0) ? 1 : -1);
      setIndex((next + SLIDES.length) % SLIDES.length);
    },
    [index]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const pause = () => clearInterval(timerRef.current);
  const resume = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, AUTOPLAY_MS);
  };

  const slide = SLIDES[index];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? "8%" : "-8%", opacity: 0, scale: 1.04 }),
    center: { x: "0%", opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? "-8%" : "8%", opacity: 0, scale: 1.04 }),
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "34rem" }}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80) next();
            else if (info.offset.x > 80) prev();
          }}
          className="absolute inset-0 flex items-center"
          style={{ background: slide.bg }}
        >
          <div className="mx-auto flex w-full max-w-7xl flex-col-reverse items-center gap-8 px-6 sm:px-10 md:flex-row md:justify-between lg:px-16">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="max-w-lg text-center md:text-left"
            >
              <span
                className="text-sm font-bold uppercase tracking-widest"
                style={{ color: "#8A2E2E" }}
              >
                {slide.eyebrow}
              </span>
              <h2
                className="mt-3 text-4xl font-bold leading-tight sm:text-5xl"
                style={{ color: "#3D1F12" }}
              >
                {slide.title}
              </h2>
              <p className="mt-4 text-base sm:text-lg" style={{ color: "#5C3A24" }}>
                {slide.subtitle}
              </p>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg"
                style={{ backgroundColor: "#8A2E2E" }}
              >
                Order Now
              </motion.a>
            </motion.div>

            {/* Art */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="h-56 w-56 shrink-0 drop-shadow-2xl sm:h-72 sm:w-72 md:h-80 md:w-80"
            >
              <SweetArt variant={slide.art} />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/70 p-2 backdrop-blur transition-transform hover:scale-110 sm:left-6 sm:p-3"
        style={{ color: "#5C2A1A" }}
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/70 p-2 backdrop-blur transition-transform hover:scale-110 sm:right-6 sm:p-3"
        style={{ color: "#5C2A1A" }}
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-2.5 rounded-full transition-all"
            style={{
              width: i === index ? "1.75rem" : "0.625rem",
              backgroundColor: i === index ? "#8A2E2E" : "rgba(90,42,26,0.35)",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeCarousel;