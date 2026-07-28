import { motion } from "framer-motion";
import {
  Leaf,
  Clock,
  Users,
  Heart,
  Award,
  ShieldCheck,
} from "lucide-react";

const STATS = [
  { label: "Years of Legacy", value: "25+" },
  { label: "Happy Customers", value: "1L+" },
  { label: "Sweet Varieties", value: "80+" },
  { label: "Cities Delivered", value: "40+" },
];

const VALUES = [
  {
    icon: Leaf,
    title: "Pure Ingredients",
    desc: "Only pure cow ghee, fresh milk, and hand-picked dry fruits go into every batch.",
  },
  {
    icon: Clock,
    title: "Fresh, Every Day",
    desc: "Made fresh each morning in small batches — never stored, never stale.",
  },
  {
    icon: Award,
    title: "Traditional Recipes",
    desc: "Recipes passed down three generations, unchanged since 1999.",
  },
  {
    icon: ShieldCheck,
    title: "Hygienic & Safe",
    desc: "FSSAI-certified kitchens with strict quality checks at every step.",
  },
];

const JOURNEY = [
  { year: "1999", text: "Started as a small family shop with just 5 varieties of sweets." },
  { year: "2008", text: "Opened our second store and introduced festive gift hampers." },
  { year: "2016", text: "Crossed 50,000 happy customers across the city." },
  { year: "2024", text: "Launched online ordering with home delivery across 40+ cities." },
];

const SweetBlob = ({ size = 220 }) => (
  <svg viewBox="0 0 220 220" width={size} height={size}>
    <defs>
      <radialGradient id="aboutBlob" cx="35%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#F9D889" />
        <stop offset="55%" stopColor="#E0A233" />
        <stop offset="100%" stopColor="#9C5E1B" />
      </radialGradient>
    </defs>
    <circle cx="110" cy="115" r="85" fill="url(#aboutBlob)" />
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

const AboutUs = () => {
  return (
    <div className="w-full" style={{ backgroundColor: "#FFFDF8" }}>
      {/* Hero */}
      <section
        className="w-full"
        style={{ background: "linear-gradient(160deg,#FFF3D6,#F6D989)" }}
      >
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-8 px-4 py-14 sm:px-6 md:flex-row md:justify-between md:py-20 lg:px-8">
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
              Our Story
            </span>
            <h1
              className="mt-3 text-3xl font-bold leading-tight sm:text-5xl"
              style={{ color: "#3D1F12" }}
            >
              Sweetness, Made the Way Home Does It
            </h1>
            <p className="mt-4 text-base sm:text-lg" style={{ color: "#5C3A24" }}>
              For over 25 years, Mithai Ghar has been turning pure ghee, fresh
              milk, and family recipes into sweets that taste like celebration.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="shrink-0 drop-shadow-2xl"
          >
            <SweetBlob />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-3xl font-bold sm:text-4xl" style={{ color: "#8A2E2E" }}>
                {s.value}
              </p>
              <p className="mt-1 text-xs font-semibold sm:text-sm" style={{ color: "#7A5C4A" }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our story text block */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold sm:text-3xl" style={{ color: "#3D1F12" }}>
            Where It All Began
          </h2>
          <p className="mt-4 text-sm leading-relaxed sm:text-base" style={{ color: "#7A5C4A" }}>
            Mithai Ghar started in 1999 as a tiny family-run shop with a single
            copper kadhai and five recipes handed down from our grandmother.
            What hasn't changed since then is our promise: pure ingredients, no
            shortcuts, and sweets made fresh every single morning. Today, we
            deliver that same homemade taste to thousands of homes — just a
            little further than our neighbourhood.
          </p>
        </motion.div>
      </section>

      {/* Values */}
      <section className="w-full" style={{ backgroundColor: "#FBF3E4" }}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center text-2xl font-bold sm:text-3xl"
            style={{ color: "#3D1F12" }}
          >
            Why Families Trust Us
          </motion.h2>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="rounded-2xl border bg-white p-6 text-center shadow-sm"
                  style={{ borderColor: "#F0E4CC" }}
                >
                  <div
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#FBF3E4" }}
                  >
                    <Icon size={24} style={{ color: "#8A2E2E" }} />
                  </div>
                  <h3 className="mt-4 text-base font-bold" style={{ color: "#3D1F12" }}>
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "#7A5C4A" }}>
                    {v.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey timeline */}
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center text-2xl font-bold sm:text-3xl"
          style={{ color: "#3D1F12" }}
        >
          Our Journey
        </motion.h2>

        <div className="relative mt-10 border-l-2 pl-6" style={{ borderColor: "#E8C68A" }}>
          {JOURNEY.map((j, i) => (
            <motion.div
              key={j.year}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative mb-8 last:mb-0"
            >
              <span
                className="absolute top-1 flex h-4 w-4 items-center justify-center rounded-full"
                style={{ backgroundColor: "#8A2E2E", left: "-1.95rem" }}
              />
              <p className="text-sm font-bold" style={{ color: "#8A2E2E" }}>
                {j.year}
              </p>
              <p className="mt-1 text-sm sm:text-base" style={{ color: "#5C3A24" }}>
                {j.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="w-full" style={{ backgroundColor: "#8A2E2E" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-14 text-center sm:px-6 lg:px-8"
        >
          <Heart size={32} color="#F3D9A8" />
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Taste the tradition for yourself
          </h2>
          <p className="text-sm text-white/85 sm:text-base">
            Explore our full range of sweets, savouries, and festive hampers.
          </p>
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="mt-2 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-lg"
            style={{ backgroundColor: "#FFF8EC", color: "#8A2E2E" }}
          >
            <Users size={16} />
            Shop Our Sweets
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUs;