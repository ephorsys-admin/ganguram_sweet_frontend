import { motion } from "framer-motion";
import ProductCard from "./Productcard";
const DUMMY_PRODUCTS = [
  { id: 1, name: "Besan Ladoo", slug: "besan-ladoo", weight: "500g Box", price: 349, mrp: 449, rating: 4.5, reviews: 210, tag: "Bestseller", bg: "linear-gradient(135deg,#FFE9B8,#D9962E)" },
  { id: 2, name: "Kaju Katli", slug: "kaju-katli", weight: "250g Box", price: 399, mrp: 499, rating: 4.7, reviews: 340, tag: "Premium", bg: "linear-gradient(135deg,#FBF3DD,#B8912F)" },
  { id: 3, name: "Gulab Jamun", slug: "gulab-jamun", weight: "1kg Tin", price: 299, mrp: 349, rating: 4.6, reviews: 512, tag: "Bestseller", bg: "linear-gradient(135deg,#C98B5E,#7A3E22)" },
  { id: 4, name: "Rasgulla", slug: "rasgulla", weight: "1kg Tin", price: 279, mrp: 320, rating: 4.4, reviews: 189, tag: null, bg: "linear-gradient(135deg,#FFF9EF,#D9BE8A)" },
  { id: 5, name: "Motichoor Ladoo", slug: "motichoor-ladoo", weight: "500g Box", price: 329, mrp: 399, rating: 4.5, reviews: 275, tag: null, bg: "linear-gradient(135deg,#F9D889,#9C5E1B)" },
  { id: 6, name: "Dry Fruit Barfi", slug: "dry-fruit-barfi", weight: "400g Box", price: 449, mrp: 549, rating: 4.8, reviews: 156, tag: "New", bg: "linear-gradient(135deg,#F3E3C3,#D9BE8A)" },
  { id: 7, name: "Rasmalai", slug: "rasmalai", weight: "500g Tub", price: 259, mrp: 299, rating: 4.6, reviews: 231, tag: "Bestseller", bg: "linear-gradient(135deg,#FDEFD8,#E3C079)" },
  { id: 8, name: "Soan Papdi", slug: "soan-papdi", weight: "400g Box", price: 199, mrp: 249, rating: 4.2, reviews: 143, tag: null, bg: "linear-gradient(135deg,#FFF3D6,#E0A233)" },
];

const OurBestselling = () => {
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
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4">
          {DUMMY_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurBestselling;