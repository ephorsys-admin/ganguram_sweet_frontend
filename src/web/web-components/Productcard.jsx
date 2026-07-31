import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingBag } from "lucide-react";

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

const ProductCard = ({ product, onViewDetails }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const price = product.sellingPrice || product.price || 0;
  const mrp = product.mrp || 0;
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const rating = product.averageRating || 0;
  const reviews = product.totalReviews || 0;
  const hasRating = reviews > 0;

  const weight = product.weight ? `${product.weight} ${product.weightUnit || ""}` : `1 ${product.unit || "Piece"}`;
  const imageUrl = product.images?.[0]?.url;
  const targetId = product._id || product.slug || product.id;
  const isAvailable = product.isAvailable !== false;
  const lowStock = isAvailable && product.stock > 0 && product.stock <= 10;

  const handleDetailsClick = () => {
    if (onViewDetails) {
      onViewDetails(product);
    } else {
      navigate(`/products/${targetId}`);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow"
      style={{ borderColor: "#F0E4CC" }}
    >
      {/* Image area */}
      <div
        onClick={handleDetailsClick}
        className="relative aspect-square w-full bg-[#FAF6F0] flex items-center justify-center cursor-pointer overflow-hidden"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <SweetThumb bg={product.bg || "linear-gradient(135deg,#FFE9B8,#D9962E)"} />
        )}

        {discount > 0 && (
          <span
            className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold text-white z-10 shadow-sm"
            style={{ backgroundColor: "#8A2E2E" }}
          >
            {discount}% OFF
          </span>
        )}

        {product.tag && (
          <span
            className="absolute left-2 bottom-2 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-bold shadow-sm z-10"
            style={{ color: "#B8801F" }}
          >
            {product.tag}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLiked((l) => !l);
          }}
          aria-label="Save to wishlist"
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm cursor-pointer"
        >
          <Heart size={13} fill={liked ? "#8A2E2E" : "none"} color="#8A2E2E" />
        </button>

        {!isAvailable && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <span className="rounded-md bg-[#3D1F12] px-2.5 py-1 text-[11px] font-bold text-white">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 px-2.5 pb-2.5 pt-2.5 sm:px-3 sm:pb-3 sm:pt-3">
        <div className="flex min-h-[1.2em] items-center gap-1">
          {hasRating && (
            <>
              <Star size={11} fill="#2E8B3D" color="#2E8B3D" />
              <span className="text-[11px] font-semibold" style={{ color: "#2E8B3D" }}>
                {rating}
              </span>
              <span className="text-[11px]" style={{ color: "#9A8A78" }}>
                ({reviews})
              </span>
            </>
          )}
        </div>

        <h3
          className="line-clamp-2 min-h-[2.4em] text-[13px] font-bold leading-snug cursor-pointer hover:underline sm:text-sm"
          onClick={handleDetailsClick}
          style={{ color: "#3D1F12" }}
        >
          {product.name}
        </h3>
        <p className="text-[11px] sm:text-xs" style={{ color: "#9A8A78" }}>
          {weight}
        </p>

        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-sm font-extrabold sm:text-base" style={{ color: "#3D1F12" }}>
            ₹{price}
          </span>
          {mrp > price && (
            <span className="text-[11px] line-through sm:text-xs" style={{ color: "#B0A18E" }}>
              ₹{mrp}
            </span>
          )}
        </div>

        {/* Reserves a fixed line even when empty, so the button below always
            starts at the same vertical position across every card in a row */}
        <p className="min-h-[1.3em] text-[10px] font-semibold" style={{ color: "#8A2E2E" }}>
          {lowStock ? `Only ${product.stock} left` : ""}
        </p>

        {/* Action — mt-auto pins this to the bottom of the card no matter
            how much text sits above it, so buttons stay aligned in a row */}
        <motion.button
          onClick={handleDetailsClick}
          whileTap={{ scale: 0.97 }}
          disabled={!isAvailable}
          className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold text-white transition cursor-pointer disabled:opacity-50 sm:text-sm"
          style={{ backgroundColor: "#8A2E2E" }}
        >
          <ShoppingBag size={13} />
          {isAvailable ? "View Details" : "Out of Stock"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;