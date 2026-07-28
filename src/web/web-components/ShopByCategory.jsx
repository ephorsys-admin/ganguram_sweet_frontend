import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * Decorative per-category art (SVG). Replace <CategoryArt /> with
 * <img src={category.image} className="h-full w-full object-cover" />
 * once real photos are available from the API.
 */
const CategoryArt = ({ variant }) => {
  const artMap = {
    sweets: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <radialGradient id="sw" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#FFB37A" />
            <stop offset="100%" stopColor="#D9962E" />
          </radialGradient>
        </defs>
        <circle cx="70" cy="90" r="42" fill="url(#sw)" />
        <circle cx="130" cy="105" r="34" fill="url(#sw)" />
        <circle cx="105" cy="55" r="26" fill="url(#sw)" />
      </svg>
    ),
    savouries: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <linearGradient id="sv" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F7D154" />
            <stop offset="100%" stopColor="#C98B22" />
          </linearGradient>
        </defs>
        {Array.from({ length: 26 }).map((_, i) => (
          <line
            key={i}
            x1={30 + (i % 13) * 12}
            y1={70 + Math.floor(i / 13) * 45}
            x2={45 + (i % 13) * 12}
            y2={130 + Math.floor(i / 13) * 45}
            stroke="url(#sv)"
            strokeWidth="5"
            strokeLinecap="round"
          />
        ))}
      </svg>
    ),
    artisanal: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <linearGradient id="ar" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E88AA0" />
            <stop offset="100%" stopColor="#A8365A" />
          </linearGradient>
        </defs>
        <rect x="55" y="55" width="90" height="90" rx="8" fill="url(#ar)" transform="rotate(-6 100 100)" />
        <circle cx="100" cy="100" r="12" fill="#FBEAEF" opacity="0.85" />
      </svg>
    ),
    kovilpatti: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <radialGradient id="kv" cx="40%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#F2A65A" />
            <stop offset="100%" stopColor="#B85E1F" />
          </radialGradient>
        </defs>
        {Array.from({ length: 10 }).map((_, i) => (
          <circle
            key={i}
            cx={50 + (i % 5) * 26}
            cy={70 + Math.floor(i / 5) * 40}
            r="16"
            fill="url(#kv)"
          />
        ))}
      </svg>
    ),
    gifting: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <linearGradient id="gf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4C4FCE" />
            <stop offset="100%" stopColor="#241E5E" />
          </linearGradient>
        </defs>
        <rect x="45" y="45" width="110" height="110" rx="10" fill="url(#gf)" />
        <rect x="90" y="45" width="20" height="110" fill="#F7D154" opacity="0.8" />
        <rect x="45" y="90" width="110" height="20" fill="#F7D154" opacity="0.8" />
      </svg>
    ),
    pickles: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <linearGradient id="pk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3E8E5A" />
            <stop offset="100%" stopColor="#D9622E" />
          </linearGradient>
        </defs>
        <rect x="72" y="50" width="56" height="18" rx="4" fill="#2E6B45" />
        <rect x="65" y="68" width="70" height="82" rx="14" fill="url(#pk)" />
      </svg>
    ),
    newin: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <radialGradient id="ni" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#F0C79A" />
            <stop offset="100%" stopColor="#B87A3E" />
          </radialGradient>
        </defs>
        <circle cx="75" cy="95" r="36" fill="url(#ni)" />
        <circle cx="125" cy="100" r="30" fill="url(#ni)" />
        <circle cx="100" cy="60" r="24" fill="url(#ni)" />
      </svg>
    ),
  };
  return artMap[variant] ?? null;
};

export const CATEGORIES = [
  { id: "sweets", label: "Sweets", art: "sweets", bg: "linear-gradient(160deg,#FFE9C9,#F7C46B)" },
  { id: "savouries", label: "Savouries", art: "savouries", bg: "linear-gradient(160deg,#FFF3C4,#F2C24A)" },
  { id: "artisanal", label: "Artisanal Sweets", art: "artisanal", badge: "Premium", bg: "linear-gradient(160deg,#FBE1E8,#F0B8C8)" },
  { id: "kovilpatti", label: "Kovilpatti", art: "kovilpatti", badge: "Traditional", bg: "linear-gradient(160deg,#FBE0C4,#F2A85E)" },
  { id: "gifting", label: "Gifting", art: "gifting", bg: "linear-gradient(160deg,#E4E3F9,#B7B4E8)" },
  { id: "pickles", label: "Podi, Thokku & Pickles", art: "pickles", bg: "linear-gradient(160deg,#FDE7D6,#F0B98E)" },
  { id: "newin", label: "Newly Launched", art: "newin", badge: "New In", bg: "linear-gradient(160deg,#F7E7D2,#E8C39A)" },
];

const BADGE_COLORS = {
  Premium: "#8A2E2E",
  Traditional: "#B8801F",
  "New In": "#2E86DE",
};

const ShopByCategory = () => {
  const navigate = useNavigate();

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

        {/* Category row — single line, circular */}
        <div className="mt-8 flex gap-6 overflow-x-auto px-1 py-2 sm:justify-center sm:gap-10">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              onClick={() => navigate(`/category/${cat.id}`)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="group flex shrink-0 flex-col items-center gap-2"
            >
              <div
                className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full p-3 shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-24 sm:w-24"
                style={{ background: cat.bg }}
              >
                <CategoryArt variant={cat.art} />
              </div>

              {cat.badge && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{ backgroundColor: BADGE_COLORS[cat.badge] }}
                >
                  {cat.badge}
                </span>
              )}

              <span
                className="text-center text-xs font-bold leading-tight sm:text-sm"
                style={{ color: "#3D1F12", maxWidth: "6rem" }}
              >
                {cat.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;