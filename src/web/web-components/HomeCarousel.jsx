import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Per-variant piece data: shared <defs> plus an array of individual
 * shapes. Splitting each sweet into pieces lets us drop them onto
 * the plate one by one instead of animating one static blob.
 */
const SWEET_DATA = {
  ladoo: {
    defs: (
      <radialGradient id="ladooG" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#F9D889" />
        <stop offset="55%" stopColor="#E0A233" />
        <stop offset="100%" stopColor="#9C5E1B" />
      </radialGradient>
    ),
    pieces: [
      <>
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
      </>,
    ],
  },
  gulabJamun: {
    defs: (
      <radialGradient id="jamunG" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#8C4A2A" />
        <stop offset="60%" stopColor="#5A2A16" />
        <stop offset="100%" stopColor="#301509" />
      </radialGradient>
    ),
    pieces: [
      <ellipse cx="115" cy="140" rx="65" ry="58" fill="url(#jamunG)" />,
      <ellipse cx="195" cy="185" rx="58" ry="52" fill="url(#jamunG)" />,
      <path
        d="M40 230 Q150 260 260 225"
        stroke="#C9962C"
        strokeWidth="4"
        fill="none"
        opacity="0.6"
      />,
    ],
  },
  kajuKatli: {
    defs: (
      <linearGradient id="katliG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F3E3C3" />
        <stop offset="100%" stopColor="#D9BE8A" />
      </linearGradient>
    ),
    pieces: [0, 1, 2].map((i) => (
      <g transform={`translate(${70 + i * 55} 90) rotate(8)`}>
        <polygon
          points="0,80 60,0 100,60 40,140"
          fill="url(#katliG)"
          stroke="#B8912F"
          strokeWidth="2"
        />
        <polygon points="0,80 60,0 65,10 8,86" fill="#EBCB7A" opacity="0.6" />
      </g>
    )),
  },
  rasgulla: {
    defs: (
      <radialGradient id="rasG" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#FBF3E4" />
        <stop offset="100%" stopColor="#E9D9B8" />
      </radialGradient>
    ),
    pieces: [
      <circle cx="110" cy="150" r="70" fill="url(#rasG)" />,
      <circle cx="205" cy="120" r="55" fill="url(#rasG)" />,
      <circle cx="185" cy="205" r="48" fill="url(#rasG)" />,
    ],
  },
};

/**
 * AnimatedSweet — renders a sweet's pieces so each one drops onto
 * the plate from above, one after another, with a soft bounce.
 * Remounts (and therefore replays) every time the slide changes.
 */
const AnimatedSweet = ({ variant }) => {
  const data = SWEET_DATA[variant];
  if (!data) return null;
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full overflow-visible">
      <defs>{data.defs}</defs>
      {data.pieces.map((piece, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, y: -240, rotate: i % 2 === 0 ? -12 : 12 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 13,
            mass: 0.8,
            delay: 0.2 + i * 0.28,
          }}
        >
          {piece}
        </motion.g>
      ))}
    </svg>
  );
};

/**
 * Sparkle — a single twinkling dot used around the plate for a
 * premium, "modern" ambient feel. Position is passed in % so it
 * can be scattered loosely around the sweet.
 */
const Sparkle = ({ top, left, size = 6, delay = 0, duration = 2.2 }) => (
  <motion.span
    className="pointer-events-none absolute rounded-full"
    style={{
      top,
      left,
      width: size,
      height: size,
      background: "radial-gradient(circle, #FFF7E0 0%, #F3C463 70%, transparent 100%)",
      boxShadow: "0 0 6px 1px rgba(255, 224, 150, 0.8)",
    }}
    animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

/**
 * PlateStage — sits the sweet illustration on an animated ceramic
 * plate: gentle infinite float + wobble, a shadow that breathes in
 * counter-time, a diagonal shimmer sweep, and a scatter of sparkles.
 */
const PlateStage = ({ art, plateTint = "#FFF9EF" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{ duration: 0.6, delay: 0.1 }}
    className="relative flex h-64 w-64 shrink-0 items-center justify-center sm:h-80 sm:w-80 md:h-96 md:w-96"
  >
    {/* Plate */}
    <svg
      viewBox="0 0 320 320"
      className="absolute inset-0 h-full w-full drop-shadow-xl"
    >
      <defs>
        <radialGradient id="plateBase" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor={plateTint} />
          <stop offset="100%" stopColor="#D8C79E" />
        </radialGradient>
        <radialGradient id="plateRim" cx="40%" cy="35%" r="75%">
          <stop offset="80%" stopColor="rgba(255,255,255,0)" />
          <stop offset="92%" stopColor="rgba(255,255,255,0.75)" />
          <stop offset="100%" stopColor="rgba(191,161,102,0.6)" />
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="168" rx="150" ry="130" fill="url(#plateBase)" />
      <ellipse cx="160" cy="168" rx="150" ry="130" fill="url(#plateRim)" />
      <ellipse
        cx="160"
        cy="168"
        rx="108"
        ry="92"
        fill="none"
        stroke="rgba(180,140,70,0.35)"
        strokeWidth="2"
      />
    </svg>

    {/* Breathing contact shadow under the sweet */}
    <motion.div
      className="absolute rounded-full"
      style={{
        bottom: "16%",
        width: "56%",
        height: "10%",
        background: "radial-gradient(ellipse, rgba(60,30,10,0.35) 0%, rgba(60,30,10,0) 72%)",
        filter: "blur(2px)",
      }}
      animate={{ scaleX: [1, 0.82, 1], opacity: [0.55, 0.35, 0.55] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Sparkles scattered around the sweet */}
    <Sparkle top="12%" left="18%" size={5} delay={0} />
    <Sparkle top="20%" left="78%" size={4} delay={0.6} duration={1.8} />
    <Sparkle top="68%" left="82%" size={6} delay={1.1} duration={2.4} />
    <Sparkle top="72%" left="14%" size={4} delay={1.6} duration={2} />

    {/* Falling sweet pieces, then a gentle continuous float */}
    <motion.div
      className="relative h-40 w-40 overflow-visible drop-shadow-2xl sm:h-52 sm:w-52 md:h-60 md:w-60"
      animate={{ y: [0, -14, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
    >
      <AnimatedSweet variant={art} />
    </motion.div>
  </motion.div>
);

const SLIDES = [
  {
    id: "ladoo",
    art: "ladoo",
    eyebrow: "Festival Favourite",
    title: "Besan Ladoo",
    subtitle: "Roasted gram flour, pure ghee, slow-cooked the traditional way.",
    bg: "linear-gradient(135deg, #FFF3D6 0%, #F6D989 55%, #D9962E 100%)",
    plateTint: "#FFF3D6",
    bgImage: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "gulabJamun",
    art: "gulabJamun",
    eyebrow: "Best Seller",
    title: "Gulab Jamun",
    subtitle: "Soft milk dumplings soaked in warm cardamom-rose syrup.",
    bg: "linear-gradient(135deg, #F3D9C4 0%, #C98B5E 55%, #7A3E22 100%)",
    plateTint: "#F3D9C4",
    bgImage: "/homepic/second.jpg",

  },
  {
    id: "kajuKatli",
    art: "kajuKatli",
    eyebrow: "Premium Pick",
    title: "Kaju Katli",
    subtitle: "Silver-leaf cashew diamonds, hand-cut, melt-in-mouth smooth.",
    bg: "linear-gradient(135deg, #FBF3DD 0%, #E9CE8F 55%, #B8912F 100%)",
    plateTint: "#FBF3DD",
    bgImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "rasgulla",
    art: "rasgulla",
    eyebrow: "Bengal Classic",
    title: "Rasgulla",
    subtitle: "Spongy cottage-cheese balls in light, fragrant sugar syrup.",
    bg: "linear-gradient(135deg, #DFCAAC 0%, #B8966E 55%, #7D5B3A 100%)",
    plateTint: "#FFF9EF",
    bgImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
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
          {/* Background image overlay with mix-blend-overlay and low opacity for depth */}
          {slide.bgImage && (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: `url(${slide.bgImage})` }}
            />
          )}

          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col-reverse items-center gap-8 px-6 sm:px-10 md:flex-row md:justify-between lg:px-16">
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
                whileHover={{ scale: 1.04, backgroundColor: "#A33636" }}
                whileTap={{ scale: 0.98 }}
                className="group mt-8 inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(138,46,46,0.3)] hover:shadow-[0_6px_24px_rgba(138,46,46,0.5)] tracking-wide transition-all"
                style={{
                  backgroundColor: "#8A2E2E",
                  fontFamily: "'Outfit', sans-serif",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}
              >
                <span>Order Now</span>
                <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </motion.a>
            </motion.div>

            {/* Art */}
            <PlateStage art={slide.art} plateTint={slide.plateTint} />
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