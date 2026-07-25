import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Filter, Sparkles, Box, ShieldCheck, Heart, Crown } from "lucide-react";
import LinearCard from "@/components/ui/linear-card";

export default function SweetPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "All", label: "All" },
    { id: "Traditional Odia Sweets", label: "Traditional Odia Sweets" },
    { id: "Signature Bengali Sweets", label: "Signature Bengali Sweets" },
    { id: "Dry Sweets & Laddus", label: "Dry Sweets & Laddus" },
    { id: "Packaged & Tin Sweets (for Travel/Gifting)", label: "Packaged & Tin Sweets (for Travel/Gifting)" },
    { id: "Snacks & Namkeen", label: "Snacks & Namkeen" },
  ];

  const sweetProducts = [
    // Traditional Odia Sweets
    {
      id: 1,
      name: "Authentic Chhena Poda",
      category: "Traditional Odia Sweets",
      origin: "Nayagarh & Puri Dham, Odisha",
      description: "Puri Jagannath Dham inspired baked cottage cheese dessert, caramelized with cardamom & cashews.",
      price: "₹480 / 500g",
      badge: "ODIA HERITAGE",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Royal Kendrapara Rasabali",
      category: "Traditional Odia Sweets",
      origin: "Kendrapara Temple, Odisha",
      description: "Deep-fried flattened chhena patties soaked in thick, cardamom-flavored sweetened condensed milk.",
      price: "₹520 / 500g",
      badge: "TRADITIONAL ODIA",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Pahala Style Chhena Jhili",
      category: "Traditional Odia Sweets",
      origin: "Pahala Highway, Odisha",
      description: "Melt-in-mouth golden fried chhena rolls dipped in light cardamom sugar syrup.",
      price: "₹460 / 500g",
      badge: "PAHALA SPECIAL",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop",
    },

    // Signature Bengali Sweets
    {
      id: 4,
      name: "Classic Saffron Rajbhog",
      category: "Signature Bengali Sweets",
      origin: "Kolkata, West Bengal",
      description: "Spongy chhena spheres filled with saffron pistachios and steeped in royal syrup.",
      price: "₹450 / 500g",
      badge: "BENGALI SIGNATURE",
      image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 5,
      name: "Heritage Nolen Gur Sandesh",
      category: "Signature Bengali Sweets",
      origin: "Murshidabad, West Bengal",
      description: "Hand-crafted cottage cheese confection flavored with liquid date palm jaggery.",
      price: "₹580 / 500g",
      badge: "SEASONAL SPECIAL",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 6,
      name: "Shahi Cham Cham",
      category: "Signature Bengali Sweets",
      origin: "Porabari & Dhaka Tradition",
      description: "Cylindrical chhena sweets coated with mawa flakes and garnished with pistachios.",
      price: "₹490 / 500g",
      badge: "ROYAL BENGALI",
      image: "https://images.unsplash.com/photo-1601356616077-695728ecf769?q=80&w=800&auto=format&fit=crop",
    },

    // Dry Sweets & Laddus
    {
      id: 7,
      name: "Vedic Ghee Kaju Katli",
      category: "Dry Sweets & Laddus",
      origin: "Goa & Mathura Royal Heritage",
      description: "Finest Goan cashews ground with pure silver leaf and hand-churned A2 Vedic ghee.",
      price: "₹680 / 500g",
      badge: "PURE VEDIC GHEE",
      image: "https://images.unsplash.com/photo-1605197397734-e431ea624b5a?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 8,
      name: "Gold Foil Motichoor Laddu",
      category: "Dry Sweets & Laddus",
      origin: "Varanasi Royal Kitchens",
      description: "Fine gram flour pearls fried in organic ghee, infused with saffron and melon seeds.",
      price: "₹520 / 500g",
      badge: "BESTSELLER",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 9,
      name: "Pistachio Rose Peda",
      category: "Dry Sweets & Laddus",
      origin: "Mathura, Uttar Pradesh",
      description: "Slow-cooked milk solids blended with green pistachios and edible rose petals.",
      price: "₹560 / 500g",
      badge: "DRY DELICACY",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop",
    },

    // Packaged & Tin Sweets (for Travel/Gifting)
    {
      id: 10,
      name: "Hermetically Sealed Rasgulla Tin",
      category: "Packaged & Tin Sweets (for Travel/Gifting)",
      origin: "Puri & Kolkata Gifting Reserve",
      description: "Travel-safe hermetically sealed tin preserving 100% fresh sponge rasgullas for up to 6 months.",
      price: "₹390 / 1kg Tin",
      badge: "TRAVEL SAFE",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 11,
      name: "Shahi Gulab Jamun Gift Can",
      category: "Packaged & Tin Sweets (for Travel/Gifting)",
      origin: "Royal Gifting Collection",
      description: "Premium tin box containing soft syrup-soaked jamuns, perfect for long-distance travel and gifting.",
      price: "₹420 / 1kg Tin",
      badge: "GIFTING SPECIAL",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
    },

    // Snacks & Namkeen
    {
      id: 12,
      name: "Shahi Artisanal Namkeen Mix",
      category: "Snacks & Namkeen",
      origin: "Bhubaneswar Savory Kitchens",
      description: "Crispy savory lentils, cashews, raisins, and spices roasted in pure ghee.",
      price: "₹350 / 500g",
      badge: "SAVORY CRISP",
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 13,
      name: "Special Mathri & Kuchnimix",
      category: "Snacks & Namkeen",
      origin: "Traditional Heritage Recipe",
      description: "Traditional carom-seeded flaky crackers paired with spiced chickpea noodles.",
      price: "₹280 / 500g",
      badge: "SNACKS & NAMKEEN",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop",
    }
  ];

  const filteredProducts = sweetProducts.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[#FAF0E6] text-[#3D271B] min-h-screen pt-28 pb-20 relative overflow-hidden font-sans">
      
      {/* Background Indian Temple Spire Line Art Overlay */}
      <svg viewBox="0 0 400 500" className="absolute right-0 top-10 h-full w-auto max-w-[320px] opacity-15 pointer-events-none stroke-[#a65827] fill-none" strokeWidth="1.2">
        <path d="M 200 30 L 250 45 L 200 60 Z" fill="#a65827" fillOpacity="0.2" />
        <circle cx="200" cy="100" r="14" strokeWidth="1.8" />
        <ellipse cx="200" cy="125" rx="22" ry="10" strokeWidth="1.8" />
        <path d="M 160 145 C 160 220 150 300 130 380 L 270 380 C 250 300 240 220 240 145 Z" strokeWidth="1.6" />
        <path d="M 120 380 L 280 380 L 280 480 L 120 480 Z" strokeWidth="1.8" />
      </svg>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-xs font-serif tracking-[0.35em] text-[#a65827] uppercase font-bold block mb-3">
            T H E &nbsp; C O L L E C T I O N
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#3D271B] leading-tight">
            Royal Confectionery Menu
          </h1>
          <div className="w-20 h-[2px] bg-[#a65827] mx-auto my-6" />
          <p className="text-[#3D271B]/80 text-base sm:text-lg leading-relaxed font-light">
            Discover traditional Odia delicacies, signature Bengali sweets, travel-safe tin packs, and savory namkeen.
          </p>
        </motion.div>

        {/* HIGH-END ANIMATED CATEGORY SELECTOR & SEARCH BAR */}
        <div className="bg-[#FAF6F0] rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/35 shadow-xl mb-14 space-y-6">
          
          {/* SEARCH INPUT BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#a65827]/15">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#a65827]" />
              <span className="font-serif text-sm uppercase tracking-widest text-[#3D271B] font-semibold">
                Filter By Category
              </span>
            </div>

            <div className="relative w-full sm:w-80">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Odia sweets, Rasgulla, Kaju Katli..."
                className="w-full bg-[#FAF0E6] border border-[#a65827]/25 rounded-full pl-10 pr-4 py-2.5 text-xs text-[#3D271B] focus:outline-none focus:border-[#a65827] focus:ring-1 focus:ring-[#a65827]/30 transition-all"
              />
              <Search className="w-4 h-4 text-[#a65827] absolute left-3.5 top-3" />
            </div>
          </div>

          {/* SMOOTH ANIMATED CATEGORY TABS (Framer Motion Layout Indicator) */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative px-5 py-3 rounded-full text-xs font-serif tracking-wider uppercase transition-colors duration-300 cursor-pointer focus:outline-none select-none ${
                    isActive ? "text-white font-bold" : "text-[#3D271B]/80 hover:text-[#a65827] bg-[#FAF0E6] border border-[#a65827]/15"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryTab"
                      className="absolute inset-0 bg-[#a65827] rounded-full shadow-md z-0"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* PRODUCTS GRID WITH LAYOUT TRANSITION ANIMATION & INTERACTIVE COMPACT LINEAR CARDS */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((sweet) => (
              <motion.div
                layout
                key={sweet.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <LinearCard item={sweet} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-[#FAF6F0] rounded-3xl border border-[#a65827]/15 my-8">
            <p className="font-serif text-xl text-[#3D271B]/70">No royal sweets matched your search query.</p>
            <button 
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="mt-4 px-6 py-2.5 bg-[#a65827] text-white font-serif text-xs uppercase tracking-widest rounded-full hover:bg-[#3D271B] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}