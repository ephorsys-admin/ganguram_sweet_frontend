import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";

/**
 * Small decorative "photo" placeholder — replace the <SweetThumb />
 * usage below with <img src={product.image} className="h-full w-full object-cover" />
 * once real product photos are available from the API.
 */
const SweetThumb = ({ bg }) => (
  <div
    className="flex h-full w-full items-center justify-center"
    style={{ background: bg }}
  >
    <svg viewBox="0 0 100 100" className="h-2/3 w-2/3 opacity-90">
      <circle cx="35" cy="45" r="26" fill="#FFF3D6" opacity="0.9" />
      <circle cx="62" cy="58" r="20" fill="#FFE9B8" opacity="0.9" />
      <circle cx="55" cy="30" r="14" fill="#FFF8EC" opacity="0.9" />
    </svg>
  </div>
);

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm"
      style={{ borderColor: "#F0E4CC" }}
    >
      {/* Image area */}
      <div className="relative aspect-square w-full">
        <SweetThumb bg={product.bg} />

        {discount > 0 && (
          <span
            className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-[11px] font-bold text-white"
            style={{ backgroundColor: "#8A2E2E" }}
          >
            {discount}% OFF
          </span>
        )}

        {product.tag && (
          <span
            className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-[11px] font-bold shadow-sm"
            style={{ color: "#B8801F" }}
          >
            {product.tag}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 px-3 pb-3 pt-3">
        <div className="flex items-center gap-1">
          <Star size={12} fill="#2E8B3D" color="#2E8B3D" />
          <span className="text-xs font-semibold" style={{ color: "#2E8B3D" }}>
            {product.rating}
          </span>
          <span className="text-xs" style={{ color: "#9A8A78" }}>
            ({product.reviews})
          </span>
        </div>

        <h3
          className="line-clamp-2 text-sm font-bold leading-snug"
          style={{ color: "#3D1F12" }}
        >
          {product.name}
        </h3>
        <p className="text-xs" style={{ color: "#9A8A78" }}>
          {product.weight}
        </p>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-bold" style={{ color: "#3D1F12" }}>
            ₹{product.price}
          </span>
          {product.mrp > product.price && (
            <span
              className="text-xs line-through"
              style={{ color: "#B0A18E" }}
            >
              ₹{product.mrp}
            </span>
          )}
        </div>

        {/* Action */}
        <motion.button
          onClick={() => navigate(`/products/${product.slug}`)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="mt-3 bg-yellow-600  text-white  cursor-pointer flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-bold"
        >
          View Details
          <ArrowRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;