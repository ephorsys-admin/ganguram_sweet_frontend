import { motion } from "framer-motion";
import ProductCard from "./Productcard";
import { useGetProductsPublicQuery } from "../../redux/services/adminApi";
import { Loader2 } from "lucide-react";

const OurBestselling = () => {
  const { data: response, isLoading } = useGetProductsPublicQuery();
  const products = response?.data || [];

  // Filter for active products, showing all sweets
  const popularSweets = products.filter(p => p.status !== false);

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
          <h2
            className="text-2xl font-bold sm:text-3xl"
            style={{ color: "#3D1F12" }}
          >
            Our Popular Sweets
          </h2>
          <p className="mt-2 text-sm sm:text-base" style={{ color: "#7A5C4A" }}>
            Loved by our customers, made fresh every day.
          </p>
        </motion.div>

        {/* Product grid */}
        {isLoading ? (
          <div className="mt-8 flex justify-center py-6">
            <Loader2 className="h-8 w-8 text-[#DFA250] animate-spin" />
          </div>
        ) : popularSweets.length === 0 ? (
          <p className="mt-8 text-center text-xs text-[#7A5C4A]">No popular sweets available right now.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4">
            {popularSweets.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OurBestselling;