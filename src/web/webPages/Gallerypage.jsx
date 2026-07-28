import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

export default function GalleryPage() {
  const galleryItems = [
    {
      id: 1,
      title: "Royal Saffron Rajbhog",
      category: "Signature Sweets",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Vedic Ghee Kaju Katli",
      category: "Heritage Recipes",
      image: "https://images.unsplash.com/photo-1601356616077-695728ecf769?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Gold Motichoor Laddu",
      category: "Festive Collection",
      image: "https://images.unsplash.com/photo-1605197397734-e431ea624b5a?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Artisanal Kitchen Crafts",
      category: "Royal Kitchens",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Pistachio & Cardamom Peda",
      category: "Signature Sweets",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 6,
      title: "Royal Gifting Hampers",
      category: "Luxury Gifting",
      image: "https://images.unsplash.com/photo-1605197397734-e431ea624b5a?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="w-full bg-[#FAF0E6] text-[#3D271B] min-h-screen pt-28 pb-20 relative overflow-hidden font-sans">
      
      {/* Heritage Vector Artwork Overlay */}
      <svg viewBox="0 0 400 500" className="absolute right-0 top-10 h-full w-auto max-w-[300px] opacity-15 pointer-events-none stroke-[#a65827] fill-none" strokeWidth="1.2">
        <path d="M 200 30 L 250 45 L 200 60 Z" fill="#a65827" fillOpacity="0.2" />
        <circle cx="200" cy="100" r="14" strokeWidth="1.8" />
        <ellipse cx="200" cy="125" rx="22" ry="10" strokeWidth="1.8" />
        <path d="M 160 145 C 160 220 150 300 130 380 L 270 380 C 250 300 240 220 240 145 Z" strokeWidth="1.6" />
      </svg>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-serif tracking-[0.35em] text-[#a65827] uppercase font-bold block mb-3">
            V I S U A L &nbsp; C R A F T S M A N S H I P
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#3D271B] leading-tight">
            The Royal Gallery of Sweets
          </h1>
          <div className="w-20 h-[2px] bg-[#a65827] mx-auto my-6" />
          <p className="text-[#3D271B]/80 text-base sm:text-lg leading-relaxed font-light">
            Immerse yourself in the visual elegance of hand-crafted Indian mithai, royal kitchen preparations, and festive gift ensembles.
          </p>
        </motion.div>

        {/* GALLERY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {galleryItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-[#FAF6F0] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-md hover:shadow-2xl transition-all duration-500 group relative"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3D271B]/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] font-serif tracking-widest text-[#D4AF37] uppercase font-bold block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-xl font-normal text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/menu"
            className="inline-flex items-center px-10 py-4.5 rounded-full bg-[#a65827] hover:bg-[#3D271B] text-[#FAF6F0] font-serif text-xs sm:text-sm tracking-[0.25em] uppercase font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl group border border-[#D4AF37]/30"
          >
            <span>EXPLORE MENU & ORDER NOW</span>
            <ArrowRight className="w-4 h-4 ml-3 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}