import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  forwardRef,
} from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, ShoppingCart, Sparkles, ShieldCheck, Heart, MapPin, Info } from "lucide-react";

const DialogContext = React.createContext(null);

function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}

function DialogProvider({ children, transition }) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  const triggerRef = useRef(null);

  const contextValue = useMemo(
    () => ({ isOpen, setIsOpen, uniqueId, triggerRef }),
    [isOpen, uniqueId]
  );

  return (
    <DialogContext.Provider value={contextValue}>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </DialogContext.Provider>
  );
}

function Dialog({ children, transition }) {
  return (
    <DialogProvider transition={transition}>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </DialogProvider>
  );
}

function DialogTrigger({ children, className, style, triggerRef }) {
  const { setIsOpen, isOpen, uniqueId } = useDialog();

  const handleClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setIsOpen(!isOpen);
      }
    },
    [isOpen, setIsOpen]
  );

  return (
    <motion.div
      ref={triggerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn("relative cursor-pointer select-none", className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={style}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={`dialog-content-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}

function DialogContent({ children, className, style }) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useDialog();
  const containerRef = useRef(null);
  const [firstFocusableElement, setFirstFocusableElement] = useState(null);
  const [lastFocusableElement, setLastFocusableElement] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
      if (event.key === "Tab") {
        if (!firstFocusableElement || !lastFocusableElement) return;

        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            event.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            event.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setIsOpen, firstFocusableElement, lastFocusableElement]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not-[tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        setFirstFocusableElement(focusableElements[0]);
        setLastFocusableElement(focusableElements[focusableElements.length - 1]);
        focusableElements[0].focus();
      }
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    } else {
      document.body.classList.remove("overflow-hidden");
      triggerRef.current?.focus();
    }
  }, [isOpen, triggerRef]);

  return (
    <motion.div
      ref={containerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn("overflow-hidden", className)}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`dialog-title-${uniqueId}`}
      aria-describedby={`dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}

function DialogContainer({ children, className }) {
  const { isOpen, setIsOpen, uniqueId } = useDialog();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;
  return (
    <AnimatePresence initial={false} mode="sync">
      {isOpen && (
        <>
          <motion.div
            key={`backdrop-${uniqueId}`}
            className="fixed inset-0 h-full z-50 w-full bg-[#3D271B]/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <div className={cn(`fixed inset-0 z-50 w-fit mx-auto flex items-center justify-center p-4 sm:p-6`, className)}>
            {children}
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function DialogTitle({ children, className, style }) {
  const { uniqueId } = useDialog();

  return (
    <motion.div
      layoutId={`dialog-title-container-${uniqueId}`}
      className={className}
      style={style}
      layout
    >
      {children}
    </motion.div>
  );
}

function DialogSubtitle({ children, className, style }) {
  const { uniqueId } = useDialog();

  return (
    <motion.div
      layoutId={`dialog-subtitle-container-${uniqueId}`}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function DialogDescription({ children, className, variants, disableLayoutAnimation }) {
  const { uniqueId } = useDialog();

  return (
    <motion.div
      key={`dialog-description-${uniqueId}`}
      layoutId={disableLayoutAnimation ? undefined : `dialog-description-content-${uniqueId}`}
      variants={variants}
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      id={`dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}

function DialogImage({ src, alt, className, style }) {
  const { uniqueId } = useDialog();

  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn(className)}
      layoutId={`dialog-img-${uniqueId}`}
      style={style}
    />
  );
}

function DialogClose({ children, className, variants }) {
  const { setIsOpen, uniqueId } = useDialog();

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <motion.button
      onClick={handleClose}
      type="button"
      aria-label="Close dialog"
      key={`dialog-close-${uniqueId}`}
      className={cn("absolute right-4 top-4 z-20 cursor-pointer", className)}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      {children || (
        <div className="w-8 h-8 rounded-full bg-[#FAF0E6] text-[#a65827] border border-[#a65827]/30 flex items-center justify-center shadow-md hover:bg-[#a65827] hover:text-white transition-colors">
          <X className="w-4 h-4 stroke-[2]" />
        </div>
      )}
    </motion.button>
  );
}

/**
 * Compact Single Sweet Item Card Component with Transparent-Blur Hover Details Overlay
 */
function SingleCardItem({ item, onAddToCart }) {
  const [added, setAdded] = useState(false);

  const imgSrc = item.image || item.url?.src || (typeof item.url === "string" ? item.url : "");
  const titleText = item.name || item.title || "Royal Sweets";
  const descText = item.description || "Authentic Indian confectionery hand-crafted with pure Vedic ghee.";
  const priceText = item.price || "₹450 / 500g";
  const originText = item.origin || item.category || "Heritage Recipe";

  const handleBuyClick = (e) => {
    e.stopPropagation();
    setAdded(true);
    if (onAddToCart) onAddToCart(item);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Dialog
      transition={{
        type: "spring",
        bounce: 0.05,
        duration: 0.5,
      }}
    >
      {/* COMPACT CARD TRIGGER PREVIEW */}
      <DialogTrigger
        style={{ borderRadius: "14px" }}
        className="group flex w-full flex-col overflow-hidden bg-[#FAF6F0] border border-[#a65827]/20 hover:border-[#D4AF37]/70 shadow-sm hover:shadow-xl transition-all duration-500 relative"
      >
        {/* Top Image Section with Hover Transparent-Blur Overlay */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF0E6]">
          {/* Badge */}
          {item.badge && (
            <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 bg-[#FAF6F0]/95 backdrop-blur-xs text-[9px] font-serif tracking-wider text-[#a65827] uppercase font-bold rounded border border-[#a65827]/25 shadow-xs">
              {item.badge}
            </span>
          )}

          {/* Sweet Image */}
          <DialogImage
            src={imgSrc}
            alt={titleText}
            className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-700"
          />

          {/* HOVER / TOUCH OVERLAY WITH TRANSPARENT BLUR & DETAILS + ORIGIN */}
          <div className="absolute inset-0 bg-[#3D271B]/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-400 p-4 flex flex-col justify-between text-white z-20">
            <div>
              {/* Origin Tag */}
              <div className="flex items-center space-x-1.5 text-[#D4AF37] text-[10px] font-serif tracking-widest uppercase font-bold mb-2">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{originText}</span>
              </div>
              
              {/* Product Details Text */}
              <p className="text-amber-50/95 text-xs font-light leading-relaxed line-clamp-4 font-sans">
                {descText}
              </p>
            </div>

            <div className="flex items-center justify-between text-[10px] font-serif text-[#F8E7D1]/80 tracking-wider uppercase border-t border-white/15 pt-2 mt-2">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>Pure Ghee Recipe</span>
              </span>
              <span className="underline hover:text-white cursor-pointer font-bold">Tap to Inspect</span>
            </div>
          </div>
        </div>

        {/* BOTTOM CARD BAR: TITLE + PRICE + BUY ICON */}
        <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 bg-[#FAF6F0]">
          {/* Title */}
          <DialogTitle className="text-[#3D271B] font-serif text-base sm:text-lg font-normal leading-snug truncate mb-2 group-hover:text-[#a65827] transition-colors">
            {titleText}
          </DialogTitle>

          {/* Price & Buy Icon Bar */}
          <div className="flex items-center justify-between border-t border-[#a65827]/15 pt-2.5 mt-1">
            <span className="font-serif text-sm sm:text-base font-bold text-[#a65827]">
              {priceText}
            </span>

            {/* SHOPPING CART BUY BUTTON */}
            <button
              type="button"
              onClick={handleBuyClick}
              className={`p-2 sm:p-2.5 rounded-full transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center ${
                added 
                  ? "bg-[#D4AF37] text-[#3D271B] scale-110" 
                  : "bg-[#a65827] hover:bg-[#3D271B] text-white hover:scale-105"
              }`}
              aria-label={`Buy ${titleText}`}
              title="Add to Royal Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </DialogTrigger>

      {/* EXPANDED DIALOG MODAL VIEW */}
      <DialogContainer className="py-8">
        <DialogContent
          style={{ borderRadius: "20px" }}
          className="relative flex flex-col overflow-y-auto bg-[#FAF6F0] border-2 border-[#D4AF37]/50 shadow-2xl w-[92vw] sm:w-[85vw] max-w-2xl max-h-[85vh] text-[#3D271B] font-sans"
        >
          <DialogClose />

          {/* Large Modal Image Header */}
          <div className="relative w-full h-56 sm:h-72 overflow-hidden bg-[#FAF0E6] shrink-0">
            <DialogImage
              src={imgSrc}
              alt={titleText}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F0] via-transparent to-transparent" />
            
            {item.badge && (
              <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#FAF6F0]/95 backdrop-blur-md text-[10px] font-serif tracking-widest text-[#a65827] uppercase font-bold rounded-full border border-[#D4AF37]/60 shadow-md">
                {item.badge}
              </span>
            )}
          </div>

          {/* Modal Body Content */}
          <div className="p-5 sm:p-8 -mt-6 relative z-10 flex flex-col justify-between flex-1 space-y-5">
            <div>
              {/* Origin Header */}
              <div className="flex items-center space-x-2 text-xs font-serif tracking-[0.2em] text-[#a65827] uppercase font-bold mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{originText}</span>
              </div>

              <DialogTitle className="font-serif text-2xl sm:text-4xl font-normal text-[#3D271B] leading-tight">
                {titleText}
              </DialogTitle>

              <div className="flex items-center space-x-3 my-3">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#a65827]">
                  {priceText}
                </span>
                <span className="text-[11px] text-[#3D271B]/60 font-serif tracking-wider uppercase border-l border-[#a65827]/20 pl-3">
                  100% Pure Heritage Recipe
                </span>
              </div>

              <DialogDescription
                disableLayoutAnimation
                variants={{
                  initial: { opacity: 0, scale: 0.95, y: 15 },
                  animate: { opacity: 1, scale: 1, y: 0 },
                  exit: { opacity: 0, scale: 0.95, y: 15 },
                }}
                className="space-y-3 text-[#3D271B]/80 text-xs sm:text-sm font-light leading-relaxed"
              >
                <p>{descText}</p>
              </DialogDescription>

              {/* Royal Purity Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5 pt-4 border-t border-[#a65827]/15">
                <div className="bg-[#FAF0E6] rounded-lg p-2.5 border border-[#a65827]/15 flex items-center space-x-2 text-[11px] text-[#3D271B] font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#a65827] shrink-0" />
                  <span>Pure Ghee</span>
                </div>
                <div className="bg-[#FAF0E6] rounded-lg p-2.5 border border-[#a65827]/15 flex items-center space-x-2 text-[11px] text-[#3D271B] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#a65827] shrink-0" />
                  <span>No Preservatives</span>
                </div>
                <div className="bg-[#FAF0E6] rounded-lg p-2.5 border border-[#a65827]/15 flex items-center space-x-2 text-[11px] text-[#3D271B] font-medium">
                  <Heart className="w-3.5 h-3.5 text-[#a65827] shrink-0" />
                  <span>Handcrafted</span>
                </div>
              </div>
            </div>

            {/* Add to Royal Cart Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleBuyClick}
                className={`w-full py-3 sm:py-3.5 rounded-full font-serif text-xs tracking-[0.2em] uppercase font-bold transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 cursor-pointer ${
                  added
                    ? "bg-[#D4AF37] text-[#3D271B] scale-102"
                    : "bg-[#a65827] hover:bg-[#3D271B] text-white"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{added ? "ADDED TO ROYAL CART!" : "ADD TO ROYAL CART"}</span>
              </button>
            </div>
          </div>
        </DialogContent>
      </DialogContainer>
    </Dialog>
  );
}

/**
 * Component forwardRef supporting both `item` object and `items` array props.
 */
const Component = forwardRef(({ item, items, onAddToCart }, ref) => {
  const itemList = items || (item ? [item] : []);

  if (itemList.length === 1 && item) {
    return <SingleCardItem ref={ref} item={item} onAddToCart={onAddToCart} />;
  }

  return (
    <div ref={ref} className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {itemList.map((it) => (
        <SingleCardItem key={it.id || it.title} item={it} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
});

Component.displayName = "Component";

export default Component;

export {
  Dialog,
  DialogTrigger,
  DialogContainer,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogSubtitle,
  DialogDescription,
  DialogImage,
};
