import { ChefHat, ShieldCheck, Truck, Gift } from "lucide-react";
import { motion } from "framer-motion";

const PILLARS = [
  {
    icon: ChefHat,
    title: "Artisanal Kitchens",
    desc: "Every sweet is handcrafted by master confections artisans following reduction recipes passed down since 1999.",
    color: "#a65827",
    bg: "bg-[#a65827]/5"
  },
  {
    icon: ShieldCheck,
    title: "100% Pure Cow Ghee",
    desc: "We strictly source fresh local milk, rich chhena cottage cheese, and premium aromatic cow ghee daily.",
    color: "#DFA250",
    bg: "bg-[#DFA250]/10"
  },
  {
    icon: Truck,
    title: "Fresh Home Delivery",
    desc: "Delivered directly from our vintage ovens to your doorstep in secure, temperature-controlled food-grade packaging.",
    color: "#2E8B3D",
    bg: "bg-emerald-50"
  },
  {
    icon: Gift,
    title: "Curated Royal Hampers",
    desc: "Exquisite golden-embossed gift wraps and custom assortments curated for marriages and auspicious occasions.",
    color: "#8A2E2E",
    bg: "bg-red-50"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="w-full py-16" style={{ backgroundColor: "#FAF6F0" }}>
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-[10px] sm:text-xs font-bold text-[#a65827] uppercase tracking-[0.25em] bg-[#FAF6F0] px-3.5 py-1.5 rounded-full border border-[#E6CCB2]/30">
            The Maharaja Guarantee
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#3D271B] leading-tight">
            Crafting Heritage Confections
          </h2>
          <p className="text-xs sm:text-sm text-[#6E5A4F] leading-relaxed">
            Indulge in flavors made honorable by vintage preparation rules, premium ingredients, and absolute hygiene.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white rounded-3xl p-6 border border-[#E6CCB2]/20 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl ${p.bg} flex items-center justify-center border border-white/50 shrink-0`}>
                    <Icon size={22} style={{ color: p.color }} />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#3D271B]">{p.title}</h3>
                  <p className="text-xs text-[#6E5A4F] leading-relaxed font-sans">{p.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
