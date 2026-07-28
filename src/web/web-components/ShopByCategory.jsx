import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGetCategoriesPublicQuery } from "../../redux/services/adminApi";
import { Layers, Loader2 } from "lucide-react";

const GRADIENTS = [
  "linear-gradient(160deg,#FFE9C9,#F7C46B)",
  "linear-gradient(160deg,#FFF3C4,#F2C24A)",
  "linear-gradient(160deg,#FBE1E8,#F0B8C8)",
  "linear-gradient(160deg,#FBE0C4,#F2A85E)",
  "linear-gradient(160deg,#E4E3F9,#B7B4E8)",
  "linear-gradient(160deg,#FDE7D6,#F0B98E)",
  "linear-gradient(160deg,#F7E7D2,#E8C39A)"
];

const ShopByCategory = () => {
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetCategoriesPublicQuery();
  const categories = response?.data || [];

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

        {/* Loading / Category row */}
        {isLoading ? (
          <div className="mt-8 flex justify-center py-6">
            <Loader2 className="h-8 w-8 text-[#DFA250] animate-spin" />
          </div>
        ) : (
          <div className="mt-8 flex gap-6 overflow-x-auto px-1 py-2 sm:justify-center sm:gap-10">
            {categories.map((cat, i) => {
              const bgGradient = GRADIENTS[i % GRADIENTS.length];
              return (
                <motion.button
                  key={cat._id}
                  onClick={() => navigate(`/category/${cat._id}`)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex shrink-0 flex-col items-center gap-2 cursor-pointer"
                >
                  <div
                    className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full p-0 shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-24 sm:w-24 border border-[#E6CCB2]/20"
                    style={{ background: bgGradient }}
                  >
                    {cat.image?.url ? (
                      <img src={cat.image.url} alt={cat.name} className="h-full w-full object-cover" />
                    ) : (
                      <Layers className="text-[#3D271B]/60 h-6 w-6" />
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
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopByCategory;